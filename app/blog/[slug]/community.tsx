"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: {
					sitekey: string;
					callback: (token: string) => void;
					"expired-callback": () => void;
					"error-callback": () => void;
				},
			) => string;
			reset: (widgetId?: string) => void;
			remove: (widgetId: string) => void;
		};
	}
}

type Comment = {
	id: string;
	slug: string;
	parentId: string | null;
	displayName: string;
	text: string;
	createdAt: number;
	likes: number;
	liked: boolean;
};

type CommunityData = {
	views: number;
	reads: number;
	likes: number;
	liked: boolean;
};

type Props = {
	slug: string;
	siteKey: string;
};

function formatCount(value: number) {
	return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function BlogCommunity({ slug, siteKey }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [profileName, setProfileName] = useState("");
	const [nameInput, setNameInput] = useState("");
	const [commentText, setCommentText] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [community, setCommunity] = useState<CommunityData>({
		views: 0,
		reads: 0,
		likes: 0,
		liked: false,
	});
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [scriptReady, setScriptReady] = useState(false);
	const widgetRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	const updateTurnstileToken = useCallback((token: string | null) => {
		setTurnstileToken(token);
	}, []);

	useEffect(() => {
		if (!siteKey || !scriptReady || !widgetRef.current || !window.turnstile) {
			return;
		}
		widgetIdRef.current = window.turnstile.render(widgetRef.current, {
			sitekey: siteKey,
			callback: (token) => updateTurnstileToken(token),
			"expired-callback": () => updateTurnstileToken(null),
			"error-callback": () => updateTurnstileToken(null),
		});
		return () => {
			if (widgetIdRef.current) {
				window.turnstile?.remove(widgetIdRef.current);
			}
		};
	}, [scriptReady, siteKey, updateTurnstileToken]);

	const resetTurnstile = () => {
		setTurnstileToken(null);
		if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
	};

	const loadCommunity = useCallback(async () => {
		setIsLoading(true);
		setError("");
		try {
			const sessionResponse = await fetch("/api/blog/session");
			const session = await sessionResponse.json();
			if (!sessionResponse.ok) throw new Error(session.error ?? "Could not load profile.");
			setProfileName(session.displayName);
			setNameInput(session.displayName);

			const [commentsResponse, engagementResponse] = await Promise.all([
				fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`),
				fetch("/api/blog/engagement", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ slug, event: "view" }),
				}),
			]);
			const commentsData = await commentsResponse.json();
			const engagementData = await engagementResponse.json();
			if (!commentsResponse.ok) {
				throw new Error(commentsData.error ?? "Could not load comments.");
			}
			if (!engagementResponse.ok) {
				throw new Error(engagementData.error ?? "Could not load article stats.");
			}
			setComments(commentsData.comments);
			setCommunity(engagementData);
		} catch (loadError) {
			setError(
				loadError instanceof Error
					? loadError.message
					: "Could not load article interactions.",
			);
		} finally {
			setIsLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		void loadCommunity();
	}, [loadCommunity]);

	useEffect(() => {
		let activeSeconds = 0;
		let readRecorded = false;
		const article = document.getElementById("blog-article-content");
		if (!article) return;

		const timer = window.setInterval(() => {
			if (document.visibilityState !== "visible") return;
			activeSeconds += 1;
			if (readRecorded || activeSeconds < 30) return;

			const bounds = article.getBoundingClientRect();
			const halfwayPoint = window.scrollY + bounds.top + bounds.height / 2;
			if (window.scrollY + window.innerHeight < halfwayPoint) return;

			readRecorded = true;
			void fetch("/api/blog/engagement", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, event: "read" }),
			})
				.then(async (response) => {
					const data = await response.json();
					if (!response.ok) throw new Error(data.error ?? "Could not record read.");
					setCommunity((current) => ({ ...current, ...data }));
				})
				.catch((readError: unknown) => {
					console.error("Could not record article read:", readError);
				});
		}, 1000);
		return () => window.clearInterval(timer);
	}, [slug]);

	const sendComment = async (parentId: string | null) => {
		setError("");
		setMessage("");
		if (!turnstileToken) {
			setError("Complete the spam check before submitting.");
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/blog/comments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					slug,
					parentId,
					text: commentText,
					turnstileToken,
				}),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not submit comment.");
			setCommentText("");
			setReplyingTo(null);
			setMessage(data.message);
			resetTurnstile();
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Could not submit comment.",
			);
			resetTurnstile();
		} finally {
			setIsSubmitting(false);
		}
	};

	const changeName = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");
		setMessage("");
		if (!turnstileToken) {
			setError("Complete the spam check before saving your name.");
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/blog/session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ displayName: nameInput, turnstileToken }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not save display name.");
			setProfileName(data.displayName);
			setNameInput(data.displayName);
			setMessage(`Your display name is now ${data.displayName}.`);
			resetTurnstile();
		} catch (profileError) {
			setError(
				profileError instanceof Error
					? profileError.message
					: "Could not save display name.",
			);
			resetTurnstile();
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleLike = async (targetType: "article" | "comment", targetId: string) => {
		try {
			const response = await fetch("/api/blog/react", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, targetType, targetId }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not update reaction.");
			if (targetType === "article") {
				setCommunity((current) => ({
					...current,
					likes: data.likes,
					liked: data.liked,
				}));
			} else {
				setComments((current) =>
					current.map((comment) =>
						comment.id === targetId
							? { ...comment, likes: data.likes, liked: data.liked }
							: comment,
					),
				);
			}
		} catch (reactionError) {
			setError(
				reactionError instanceof Error
					? reactionError.message
					: "Could not update reaction.",
			);
		}
	};

	const reportComment = async (commentId: string) => {
		setError("");
		setMessage("");
		try {
			const response = await fetch("/api/blog/report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, commentId }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not report comment.");
			setMessage(data.message);
		} catch (reportError) {
			setError(
				reportError instanceof Error
					? reportError.message
					: "Could not report comment.",
			);
		}
	};

	const shareArticle = async () => {
		const url = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({ title: document.title, url });
			} else {
				await navigator.clipboard.writeText(url);
				setMessage("Article link copied.");
			}
		} catch (shareError) {
			if (shareError instanceof Error && shareError.name === "AbortError") return;
			setError("Could not share the article. Copy its URL from the address bar.");
		}
	};

	const renderComment = (comment: Comment, depth = 0): React.ReactNode => {
		const replies = comments.filter((reply) => reply.parentId === comment.id);
		return (
			<li key={comment.id} className={depth > 0 ? "ml-4 border-l border-[var(--border)] pl-4 sm:ml-8" : ""}>
				<article className="py-5">
					<div className="flex flex-wrap items-center gap-2 text-sm">
						<strong className="text-[var(--text)]">{comment.displayName}</strong>
						<time
							dateTime={new Date(comment.createdAt).toISOString()}
							className="text-[var(--muted)]"
						>
							{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
								new Date(comment.createdAt),
							)}
						</time>
					</div>
					<p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text-soft)]">
						{comment.text}
					</p>
					<div className="mt-3 flex gap-4 text-xs">
						<button
							type="button"
							onClick={() => void toggleLike("comment", comment.id)}
							className="text-[var(--text-soft)] hover:text-[var(--text)]"
						>
							{comment.liked ? "♥ Liked" : "♡ Like"} · {formatCount(comment.likes)}
						</button>
						{depth < 3 && (
							<button
								type="button"
								onClick={() => {
									setReplyingTo(replyingTo === comment.id ? null : comment.id);
									setCommentText("");
								}}
								className="text-[var(--text-soft)] hover:text-[var(--text)]"
							>
								Reply
							</button>
						)}
						<button
							type="button"
							onClick={() => void reportComment(comment.id)}
							className="text-[var(--muted)] hover:text-[var(--text)]"
						>
							Report
						</button>
					</div>
					{replyingTo === comment.id && (
						<CommentForm
							value={commentText}
							onChange={(value) => setCommentText(value)}
							onSubmit={() => void sendComment(comment.id)}
							isSubmitting={isSubmitting}
							hasChallenge={Boolean(turnstileToken)}
							displayName={profileName}
							isReply
						/>
					)}
				</article>
				{replies.length > 0 && (
					<ul className="divide-y divide-[var(--border)]">
						{replies.map((reply) => renderComment(reply, depth + 1))}
					</ul>
				)}
			</li>
		);
	};

	return (
		<section
			aria-labelledby="article-discussion"
			className="mx-auto mt-12 max-w-3xl border-t border-[var(--border)] pt-8"
		>
			{siteKey && (
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
					strategy="afterInteractive"
					onLoad={() => setScriptReady(true)}
				/>
			)}

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
					<span>{formatCount(community.views)} views</span>
					<span>{formatCount(community.reads)} reads</span>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => void toggleLike("article", slug)}
						className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-soft)] hover:border-[var(--outline)] hover:text-[var(--text)]"
					>
						{community.liked ? "♥ Liked" : "♡ Like"} ·{" "}
						{formatCount(community.likes)}
					</button>
					<button
						type="button"
						onClick={() => void shareArticle()}
						className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-soft)] hover:border-[var(--outline)] hover:text-[var(--text)]"
					>
						Share
					</button>
				</div>
			</div>

			<h2
				id="article-discussion"
				className="mt-10 font-display text-2xl font-semibold text-[var(--text)]"
			>
				Discussion
			</h2>
			<p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
				Choose a unique display name or keep your generated pseudonym. Comments
				are reviewed before they appear. Names are reserved first-come, first-served
				on this browser; there is no account recovery. A signed browser cookie
				remembers your profile, and spam prevention uses Turnstile and
				short-lived IP-derived rate limits.
			</p>

			{siteKey ? (
				<>
					<form onSubmit={(event) => void changeName(event)} className="mt-5 flex flex-wrap gap-2">
						<label htmlFor={`display-name-${slug}`} className="sr-only">
							Unique display name
						</label>
						<input
							id={`display-name-${slug}`}
							value={nameInput}
							onChange={(event) => setNameInput(event.target.value)}
							maxLength={20}
							minLength={3}
							className="min-h-10 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
							placeholder="Choose a unique display name"
						/>
						<button
							type="submit"
							disabled={isSubmitting || !turnstileToken || nameInput === profileName}
							className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
						>
							Save name
						</button>
					</form>

					<CommentForm
						value={replyingTo ? "" : commentText}
						onChange={(value) => {
							setReplyingTo(null);
							setCommentText(value);
						}}
						onSubmit={() => void sendComment(null)}
						isSubmitting={isSubmitting}
						hasChallenge={Boolean(turnstileToken)}
						displayName={profileName}
					/>
					<div ref={widgetRef} className="mt-4" />
					{!scriptReady && <p className="mt-2 text-xs text-[var(--muted)]">Loading spam protection…</p>}
				</>
			) : (
				<p className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-soft)]">
					Comments are temporarily unavailable until spam protection is configured.
				</p>
			)}

			{message && (
				<p role="status" className="mt-4 text-sm text-[var(--home-accent)]">
					{message}
				</p>
			)}
			{error && (
				<p role="alert" className="mt-4 text-sm text-red-400">
					{error}
				</p>
			)}

			{isLoading ? (
				<p className="mt-8 text-sm text-[var(--muted)]">Loading discussion…</p>
			) : comments.length === 0 ? (
				<p className="mt-8 text-sm text-[var(--muted)]">
					No approved comments yet. You can be the first to join the discussion.
				</p>
			) : (
				<ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
					{comments
						.filter((comment) => !comment.parentId)
						.map((comment) => renderComment(comment))}
				</ul>
			)}
		</section>
	);
}

function CommentForm({
	value,
	onChange,
	onSubmit,
	isSubmitting,
	hasChallenge,
	displayName,
	isReply = false,
}: {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	hasChallenge: boolean;
	displayName: string;
	isReply?: boolean;
}) {
	return (
		<div className="mt-4">
			<textarea
				id={isReply ? undefined : "new-comment"}
				aria-label={isReply ? "Write a reply" : "Write a comment"}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				maxLength={2000}
				minLength={2}
				rows={isReply ? 3 : 4}
				placeholder={
					displayName
						? `Comment as ${displayName}…`
						: "Write your comment…"
				}
				className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text)] placeholder:text-[var(--muted)]"
			/>
			<div className="mt-2 flex items-center justify-between gap-3">
				<span className="text-xs text-[var(--muted)]">{value.length}/2000</span>
				<button
					type="button"
					onClick={onSubmit}
					disabled={isSubmitting || !hasChallenge || value.trim().length < 2}
					className="rounded-lg bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? "Sending…" : isReply ? "Send reply" : "Submit comment"}
				</button>
			</div>
			<p className="mt-2 text-xs text-[var(--muted)]">
				Your comment will be visible after moderation. Links aren’t allowed.
			</p>
		</div>
	);
}
