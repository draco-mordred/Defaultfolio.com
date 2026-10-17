import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "node:crypto";
import type { BlogComment, BlogIdentity } from "@/util/blog-community";
import {
	generatedDisplayName,
	getArticleReadKey,
	getArticleViewKey,
	getRedis,
	getRequestIp,
	handleKey,
	hashIp,
	incrementRateLimit,
	isPublishedBlogPost,
	isSameOrigin,
	matchesModeratorToken,
	normalizeDisplayName,
	readIdentity,
	setIdentityCookie,
	verifyTurnstile,
} from "@/util/blog-community";

type ApiResponse = Record<string, unknown>;

function bodyRecord(body: unknown): Record<string, unknown> {
	if (!body || typeof body !== "object" || Array.isArray(body)) return {};
	return body as Record<string, unknown>;
}

function commentKey(id: string) {
	return `blog:comment:${id}`;
}

function commentListKey(slug: string) {
	return `blog:comments:${slug}`;
}

function reactionKey(slug: string, targetType: "article" | "comment", targetId: string) {
	return `blog:reactions:${slug}:${targetType}:${targetId}`;
}

function reportKey(slug: string, commentId: string) {
	return `blog:reports:${slug}:${commentId}`;
}

function sendError(
	res: NextApiResponse<ApiResponse>,
	status: number,
	error: string,
) {
	return res.status(status).json({ error });
}

async function readComments(slug: string, visitorId?: string) {
	const redis = getRedis();
	const ids = await redis.lrange<string>(commentListKey(slug), 0, 199);
	if (ids.length === 0) return [];
	const storedComments = await redis.mget<(BlogComment | null)[]>(
		...ids.map(commentKey),
	);
	const comments = storedComments
		.filter((comment): comment is BlogComment => comment?.status === "approved")
		.sort((a, b) => a.createdAt - b.createdAt)
		.slice(-200);

	return Promise.all(
		comments.map(async (comment) => {
			const reactions = reactionKey(slug, "comment", comment.id);
			const [likes, liked] = await Promise.all([
				redis.scard(reactions),
				visitorId ? redis.sismember(reactions, visitorId) : 0,
			]);
			return { ...comment, likes, liked: Boolean(liked) };
		}),
	);
}

async function getSession(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
	const redis = getRedis();
	let identity: BlogIdentity | null;
	try {
		identity = readIdentity(req);
	} catch {
		return sendError(res, 503, "Anonymous profiles are not configured.");
	}

	if (identity) {
		return res.status(200).json({ displayName: identity.displayName });
	}

	const ipHash = hashIp(getRequestIp(req));
	if (!(await incrementRateLimit(redis, `blog:limit:session:${ipHash}`, 30, 3600))) {
		return sendError(res, 429, "Too many profile requests. Try again later.");
	}

	for (let attempt = 0; attempt < 12; attempt += 1) {
		const displayName = generatedDisplayName();
		const id = randomUUID();
		const claimed = await redis.set(handleKey(displayName), id, {
			nx: true,
		});
		if (claimed) {
			identity = { id, displayName };
			setIdentityCookie(res, identity);
			return res.status(200).json({ displayName });
		}
	}

	return sendError(res, 503, "Could not create a unique display name.");
}

async function updateProfile(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const redis = getRedis();
	let identity: BlogIdentity | null;
	try {
		identity = readIdentity(req);
	} catch {
		return sendError(res, 503, "Anonymous profiles are not configured.");
	}
	if (!identity) return sendError(res, 401, "Refresh the page to create a profile.");

	const body = bodyRecord(req.body);
	const displayName = normalizeDisplayName(body.displayName);
	if (!displayName) {
		return sendError(
			res,
			400,
			"Display names must be 3–20 basic letters, numbers, spaces, underscores, or hyphens.",
		);
	}

	let validChallenge: boolean;
	try {
		validChallenge = await verifyTurnstile(
			body.turnstileToken,
			getRequestIp(req),
			new URL(`https://${req.headers.host}`).hostname,
		);
	} catch (error) {
		console.error("Turnstile verification is unavailable:", error);
		return sendError(res, 503, "Name changes are temporarily unavailable.");
	}
	if (!validChallenge) return sendError(res, 400, "Complete the spam check.");

	const ipHash = hashIp(getRequestIp(req));
	if (!(await incrementRateLimit(redis, `blog:limit:profile:${ipHash}`, 5, 3600))) {
		return sendError(res, 429, "Too many name changes. Try again later.");
	}

	const claimed = await redis.set(handleKey(displayName), identity.id, {
		nx: true,
	});
	if (!claimed) {
		const owner = await redis.get<string>(handleKey(displayName));
		if (owner !== identity.id) {
			return sendError(res, 409, "That display name is already taken.");
		}
	}

	identity = { ...identity, displayName };
	setIdentityCookie(res, identity);
	return res.status(200).json({ displayName });
}

async function getPublicComments(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	const slug = typeof req.query.slug === "string" ? req.query.slug : "";
	if (!slug || !isPublishedBlogPost(slug)) {
		return sendError(res, 404, "Article not found.");
	}
	const identity = readIdentity(req);
	const comments = await readComments(slug, identity?.id);
	return res.status(200).json({ comments });
}

async function createComment(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const body = bodyRecord(req.body);
	const slug = typeof body.slug === "string" ? body.slug : "";
	const text = typeof body.text === "string" ? body.text.trim() : "";
	const parentId = typeof body.parentId === "string" ? body.parentId : null;
	if (!slug || !isPublishedBlogPost(slug)) {
		return sendError(res, 404, "Article not found.");
	}
	if (text.length < 2 || text.length > 2000) {
		return sendError(res, 400, "Comments must be between 2 and 2,000 characters.");
	}
	if (/https?:\/\/|www\./i.test(text)) {
		return sendError(res, 400, "Links are not allowed in comments.");
	}

	let identity: BlogIdentity | null;
	try {
		identity = readIdentity(req);
	} catch {
		return sendError(res, 503, "Anonymous profiles are not configured.");
	}
	if (!identity) return sendError(res, 401, "Refresh the page to create a profile.");

	const redis = getRedis();
	let validChallenge: boolean;
	try {
		validChallenge = await verifyTurnstile(
			body.turnstileToken,
			getRequestIp(req),
			new URL(`https://${req.headers.host}`).hostname,
		);
	} catch (error) {
		console.error("Turnstile verification is unavailable:", error);
		return sendError(res, 503, "Comments are temporarily unavailable.");
	}
	if (!validChallenge) return sendError(res, 400, "Complete the spam check.");

	const ipHash = hashIp(getRequestIp(req));
	if (!(await incrementRateLimit(redis, `blog:limit:comment:${ipHash}`, 5, 3600))) {
		return sendError(res, 429, "Too many comments. Try again later.");
	}

	if (parentId) {
		const parent = await redis.get<BlogComment>(commentKey(parentId));
		if (
			!parent ||
			parent.slug !== slug ||
			parent.status !== "approved"
		) {
			return sendError(res, 400, "Replies must belong to a published comment.");
		}
	}

	const id = randomUUID();
	const comment: BlogComment = {
		id,
		slug,
		parentId,
		displayName: identity.displayName,
		text,
		createdAt: Date.now(),
		status: "pending",
	};
	await redis.set(commentKey(id), comment);
	await redis.lpush(commentListKey(slug), id);
	await redis.sadd("blog:comments:all", id);
	return res.status(202).json({
		message: "Thanks—your comment is awaiting moderation.",
	});
}

async function toggleReaction(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const body = bodyRecord(req.body);
	const slug = typeof body.slug === "string" ? body.slug : "";
	const targetType = body.targetType;
	const targetId = typeof body.targetId === "string" ? body.targetId : "";
	if (
		!slug ||
		!isPublishedBlogPost(slug) ||
		(targetType !== "article" && targetType !== "comment")
	) {
		return sendError(res, 404, "Article not found.");
	}
	const identity = readIdentity(req);
	if (!identity) return sendError(res, 401, "Refresh the page to create a profile.");
	const redis = getRedis();

	if (targetType === "comment") {
		const comment = await redis.get<BlogComment>(commentKey(targetId));
		if (!comment || comment.slug !== slug || comment.status !== "approved") {
			return sendError(res, 404, "Comment not found.");
		}
	} else if (targetId !== slug) {
		return sendError(res, 400, "Invalid article reaction.");
	}

	const ipHash = hashIp(getRequestIp(req));
	if (!(await incrementRateLimit(redis, `blog:limit:reaction:${ipHash}`, 120, 3600))) {
		return sendError(res, 429, "Too many reactions. Try again later.");
	}

	const key = reactionKey(slug, targetType, targetId);
	const alreadyLiked = await redis.sismember(key, identity.id);
	if (alreadyLiked) {
		await redis.srem(key, identity.id);
	} else {
		await redis.sadd(key, identity.id);
	}
	const likes = await redis.scard(key);
	return res.status(200).json({ likes, liked: !alreadyLiked });
}

async function reportComment(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const body = bodyRecord(req.body);
	const slug = typeof body.slug === "string" ? body.slug : "";
	const commentId = typeof body.commentId === "string" ? body.commentId : "";
	if (!slug || !isPublishedBlogPost(slug)) {
		return sendError(res, 404, "Article not found.");
	}
	const identity = readIdentity(req);
	if (!identity) return sendError(res, 401, "Refresh the page to create a profile.");
	const redis = getRedis();
	const comment = await redis.get<BlogComment>(commentKey(commentId));
	if (!comment || comment.slug !== slug || comment.status !== "approved") {
		return sendError(res, 404, "Comment not found.");
	}
	const ipHash = hashIp(getRequestIp(req));
	if (!(await incrementRateLimit(redis, `blog:limit:report:${ipHash}`, 10, 3600))) {
		return sendError(res, 429, "Too many reports. Try again later.");
	}
	await redis.sadd(reportKey(slug, commentId), identity.id);
	return res.status(202).json({ message: "Comment reported for review." });
}

async function trackEngagement(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const body = bodyRecord(req.body);
	const slug = typeof body.slug === "string" ? body.slug : "";
	const event = body.event;
	if (
		!slug ||
		!isPublishedBlogPost(slug) ||
		(event !== "view" && event !== "read")
	) {
		return sendError(res, 400, "Invalid engagement event.");
	}
	const identity = readIdentity(req);
	if (!identity) return sendError(res, 401, "Refresh the page to create a profile.");
	const redis = getRedis();
	const dedupeKey = `blog:engagement:${slug}:${event}:visitor:${identity.id}`;
	const isNew = await redis.set(dedupeKey, true, { nx: true, ex: 24 * 60 * 60 });
	if (isNew) {
		const counterKey = event === "view" ? getArticleViewKey(slug) : getArticleReadKey(slug);
		await redis.incr(counterKey);
	}
	const [views, reads, likes] = await Promise.all([
		redis.get<number>(getArticleViewKey(slug)),
		redis.get<number>(getArticleReadKey(slug)),
		redis.scard(reactionKey(slug, "article", slug)),
	]);
	const liked = await redis.sismember(
		reactionKey(slug, "article", slug),
		identity.id,
	);
	return res.status(200).json({
		views: views ?? 0,
		reads: reads ?? 0,
		likes,
		liked: Boolean(liked),
	});
}

async function getModerationQueue(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
	if (!matchesModeratorToken(token)) {
		return sendError(res, 401, "Moderator authorization required.");
	}
	const redis = getRedis();
	const ids = await redis.smembers<string[]>("blog:comments:all");
	if (ids.length === 0) return res.status(200).json({ comments: [] });
	const storedComments = await redis.mget<(BlogComment | null)[]>(
		...ids.map(commentKey),
	);
	const comments = await Promise.all(
		storedComments
			.filter(
				(comment): comment is BlogComment =>
					!!comment && comment.status !== "rejected",
			)
			.map(async (comment) => ({
				...comment,
				reports: await redis.scard(reportKey(comment.slug, comment.id)),
			})),
	);
	const reviewQueue = comments.filter(
		(comment) => comment.status === "pending" || comment.reports > 0,
	);
	reviewQueue.sort((a, b) => {
		if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
		if (a.reports !== b.reports) return b.reports - a.reports;
		return a.createdAt - b.createdAt;
	});
	return res.status(200).json({ comments: reviewQueue });
}

async function moderateComment(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	if (!isSameOrigin(req)) return sendError(res, 403, "Invalid request origin.");
	const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
	if (!matchesModeratorToken(token)) {
		return sendError(res, 401, "Moderator authorization required.");
	}
	const body = bodyRecord(req.body);
	const id = typeof body.id === "string" ? body.id : "";
	const action = body.action;
	if (!id || (action !== "approve" && action !== "reject")) {
		return sendError(res, 400, "Invalid moderation action.");
	}
	const redis = getRedis();
	const comment = await redis.get<BlogComment>(commentKey(id));
	if (!comment) return sendError(res, 404, "Comment not found.");
	comment.status = action === "approve" ? "approved" : "rejected";
	await redis.set(commentKey(id), comment);
	return res.status(200).json({
		message: action === "approve" ? "Comment approved." : "Comment hidden.",
	});
}

export default async function blogApi(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	const action = req.query.action;
	try {
		switch (action) {
			case "session":
				if (req.method === "GET") return await getSession(req, res);
				if (req.method === "POST") return await updateProfile(req, res);
				break;
			case "comments":
				if (req.method === "GET") return await getPublicComments(req, res);
				if (req.method === "POST") return await createComment(req, res);
				break;
			case "react":
				if (req.method === "POST") return await toggleReaction(req, res);
				break;
			case "report":
				if (req.method === "POST") return await reportComment(req, res);
				break;
			case "engagement":
				if (req.method === "POST") return await trackEngagement(req, res);
				break;
			case "moderation":
				if (req.method === "GET") return await getModerationQueue(req, res);
				if (req.method === "POST") return await moderateComment(req, res);
				break;
		}
		res.setHeader("Allow", "GET, POST");
		return sendError(res, 405, "Method not allowed.");
	} catch (error) {
		console.error(`Blog ${String(action)} API failed:`, error);
		if (
			error instanceof Error &&
			(error.message.includes("not configured") ||
				error.message.includes("must be at least"))
		) {
			return sendError(res, 503, error.message);
		}
		return sendError(res, 500, "The request could not be completed.");
	}
}
