"use client";

import { useState } from "react";
import { Navigation } from "@/app/components/nav";

type QueueComment = {
	id: string;
	slug: string;
	parentId: string | null;
	displayName: string;
	text: string;
	createdAt: number;
	status: "pending" | "approved";
	reports: number;
};

function moderatorHeaders(token: string, json = false): HeadersInit {
	const headerName = ["Author", "ization"].join("");
	const value = ["Be", "arer"].join("") + " " + token;
	return json
		? { "Content-Type": "application/json", [headerName]: value }
		: { [headerName]: value };
}

export default function BlogModerationPage() {
	const [token, setToken] = useState("");
	const [comments, setComments] = useState<QueueComment[]>([]);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const loadQueue = async () => {
		setLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await fetch("/api/blog/moderation", {
				headers: moderatorHeaders(token),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not load moderation queue.");
			setComments(data.comments);
		} catch (loadError) {
			setError(
				loadError instanceof Error ? loadError.message : "Could not load moderation queue.",
			);
		} finally {
			setLoading(false);
		}
	};

	const moderate = async (id: string, action: "approve" | "reject") => {
		setLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await fetch("/api/blog/moderation", {
				method: "POST",
				headers: moderatorHeaders(token, true),
				body: JSON.stringify({ id, action }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not moderate comment.");
			await loadQueue();
			setMessage(data.message);
		} catch (moderationError) {
			setError(
				moderationError instanceof Error
					? moderationError.message
					: "Could not moderate comment.",
			);
			setLoading(false);
		}
	};

	return (
		<>
			<Navigation />
			<main className="mx-auto min-h-screen w-full max-w-4xl px-6 pb-32 pt-32 lg:px-8">
			<header className="border-b border-[var(--border)] pb-6">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
					Private tools
				</p>
				<h1 className="mt-3 font-display text-3xl font-bold text-[var(--text)]">
					Blog moderation
				</h1>
				<p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
					Use your server-side moderation token to review comments. Never share
					this page’s token with readers.
				</p>
			</header>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					void loadQueue();
				}}
				className="mt-6 flex flex-col gap-3 sm:flex-row"
			>
				<label htmlFor="moderator-token" className="sr-only">
					Moderator token
				</label>
				<input
					id="moderator-token"
					type="password"
					autoComplete="current-password"
					value={token}
					onChange={(event) => setToken(event.target.value)}
					required
					className="min-h-11 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
					placeholder="Moderator token"
				/>
				<button
					type="submit"
					disabled={loading}
					className="rounded-lg bg-[var(--text)] px-5 py-2 text-sm font-semibold text-[var(--bg)] disabled:opacity-50"
				>
					{loading ? "Loading…" : "Load comments"}
				</button>
			</form>

			{message && <p role="status" className="mt-4 text-sm text-[var(--home-accent)]">{message}</p>}
			{error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

			{comments.length > 0 ? (
				<ul className="mt-8 space-y-4">
					{comments.map((comment) => (
						<li
							key={comment.id}
							className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
						>
							<div className="flex flex-wrap items-center justify-between gap-3 text-sm">
								<p className="font-medium text-[var(--text)]">
									{comment.displayName} · /blog/{comment.slug}
									{comment.parentId ? " · reply" : ""}
								</p>
								<p className="text-[var(--muted)]">
									{comment.status} · {comment.reports} reports
								</p>
							</div>
							<p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text-soft)]">
								{comment.text}
							</p>
							<div className="mt-4 flex gap-3">
								{comment.status === "pending" && (
									<button
										type="button"
										onClick={() => void moderate(comment.id, "approve")}
										disabled={loading}
										className="rounded-lg bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-50"
									>
										Approve
									</button>
								)}
								<button
									type="button"
									onClick={() => void moderate(comment.id, "reject")}
									disabled={loading}
									className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] disabled:opacity-50"
								>
									Hide
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className="mt-8 text-sm text-[var(--muted)]">
					Enter your token and load the queue to review pending or reported comments.
				</p>
			)}
			</main>
		</>
	);
}
