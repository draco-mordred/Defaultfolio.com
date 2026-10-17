import { Redis } from "@upstash/redis";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { allBlogPosts } from "contentlayer/generated";

export type BlogComment = {
	id: string;
	slug: string;
	parentId: string | null;
	displayName: string;
	text: string;
	createdAt: number;
	status: "pending" | "approved" | "rejected";
};

export type BlogIdentity = {
	id: string;
	displayName: string;
};

const cookieName = "blog_visitor";
const cookieMaxAge = 60 * 60 * 24 * 365;

export function getRedis() {
	if (
		!process.env.UPSTASH_REDIS_REST_URL ||
		!process.env.UPSTASH_REDIS_REST_TOKEN
	) {
		throw new Error("Upstash Redis is not configured.");
	}
	return Redis.fromEnv();
}

export function isPublishedBlogPost(slug: string) {
	return allBlogPosts.some((post) => post.slug === slug && post.published);
}

function identitySecret() {
	const secret = process.env.BLOG_IDENTITY_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error("BLOG_IDENTITY_SECRET must be at least 32 characters.");
	}
	return secret;
}

function signIdentity(identity: BlogIdentity) {
	const encodedName = Buffer.from(identity.displayName).toString("base64url");
	const payload = `${identity.id}.${encodedName}`;
	const signature = createHmac("sha256", identitySecret())
		.update(payload)
		.digest("base64url");
	return `${payload}.${signature}`;
}

export function readIdentity(req: NextApiRequest): BlogIdentity | null {
	const value = req.cookies[cookieName];
	if (!value) return null;
	const [id, encodedName, signature, ...extra] = value.split(".");
	if (!id || !encodedName || !signature || extra.length > 0) return null;

	const expected = createHmac("sha256", identitySecret())
		.update(`${id}.${encodedName}`)
		.digest("base64url");
	const suppliedBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);
	if (
		suppliedBuffer.length !== expectedBuffer.length ||
		!timingSafeEqual(suppliedBuffer, expectedBuffer)
	) {
		return null;
	}
	return {
		id,
		displayName: Buffer.from(encodedName, "base64url").toString("utf8"),
	};
}

export function setIdentityCookie(
	res: NextApiResponse,
	identity: BlogIdentity,
) {
	const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
	res.setHeader(
		"Set-Cookie",
		`${cookieName}=${signIdentity(identity)}; Path=/; Max-Age=${cookieMaxAge}; HttpOnly; SameSite=Lax${secure}`,
	);
}

export function normalizeDisplayName(value: unknown) {
	if (typeof value !== "string") return null;
	const displayName = value.trim().replace(/\s+/g, " ");
	if (
		displayName.length < 3 ||
		displayName.length > 20 ||
		!/^[a-zA-Z0-9_ -]+$/.test(displayName)
	) {
		return null;
	}
	return displayName;
}

export function handleKey(displayName: string) {
	return `blog:handle:${displayName.toLocaleLowerCase("en-US")}`;
}

export function isSameOrigin(req: NextApiRequest) {
	const origin = req.headers.origin;
	const host = req.headers.host;
	if (!origin || !host) return false;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}

export function getRequestIp(req: NextApiRequest) {
	const forwardedFor = req.headers["x-forwarded-for"];
	const forwardedIp =
		typeof forwardedFor === "string" ? forwardedFor.split(",")[0]?.trim() : "";
	return forwardedIp || req.socket.remoteAddress || "unknown";
}

export async function incrementRateLimit(
	redis: Redis,
	key: string,
	limit: number,
	windowSeconds: number,
) {
	const count = await redis.incr(key);
	if (count === 1) {
		await redis.expire(key, windowSeconds);
	}
	return count <= limit;
}

export function hashIp(ip: string) {
	return createHmac("sha256", identitySecret()).update(ip).digest("hex");
}

export async function verifyTurnstile(
	token: unknown,
	ip: string,
	expectedHost: string,
): Promise<boolean> {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		throw new Error("TURNSTILE_SECRET_KEY is not configured.");
	}
	if (typeof token !== "string" || token.length === 0) return false;

	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ secret, response: token, remoteip: ip }),
		},
	);
	if (!response.ok) {
		throw new Error(`Turnstile verification failed with HTTP ${response.status}.`);
	}
	const result = (await response.json()) as {
		success?: boolean;
		hostname?: string;
	};
	return (
		result.success === true &&
		result.hostname?.toLocaleLowerCase("en-US") ===
			expectedHost.toLocaleLowerCase("en-US")
	);
}

export function matchesModeratorToken(token: string | undefined) {
	const expected = process.env.BLOG_MODERATOR_TOKEN;
	if (!expected || expected.length < 32 || !token) return false;
	const expectedBuffer = Buffer.from(expected);
	const suppliedBuffer = Buffer.from(token);
	return (
		expectedBuffer.length === suppliedBuffer.length &&
		timingSafeEqual(expectedBuffer, suppliedBuffer)
	);
}

export function generatedDisplayName() {
	const adjectives = [
		"Bright",
		"Calm",
		"Kind",
		"Quiet",
		"Swift",
		"Curious",
		"Sunny",
		"Thoughtful",
	];
	const animals = [
		"Badger",
		"Bluejay",
		"Dolphin",
		"Fox",
		"Heron",
		"Otter",
		"Robin",
		"Turtle",
	];
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const animal = animals[Math.floor(Math.random() * animals.length)];
	const suffix = Math.floor(1000 + Math.random() * 9000);
	return `${adjective}${animal}${suffix}`;
}

export function getArticleViewKey(slug: string) {
	return `blog:engagement:${slug}:views`;
}

export function getArticleReadKey(slug: string) {
	return `blog:engagement:${slug}:reads`;
}
