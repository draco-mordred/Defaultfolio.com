import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { allBlogPosts } from "contentlayer/generated";
import { Navigation } from "@/app/components/nav";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Notes and ideas on AI evaluation, medicine, software, and creative work.",
};

function formatDate(date: string) {
	return Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
		new Date(date),
	);
}

export default function BlogPage() {
	const posts = allBlogPosts
		.filter((post) => post.published)
		.sort(
			(a, b) =>
				new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
		);
	const upcomingPosts = allBlogPosts.filter(
		(post) => !post.published && post.comingSoon,
	);
	const featuredPost = posts.find((post) => post.featured) ?? posts[0];
	const otherPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

	return (
		<>
			<Navigation />
			<main className="relative mx-auto min-h-screen w-full max-w-5xl px-6 pb-32 pt-32 lg:px-8">
				<header className="border-b border-[var(--border)] pb-8">
					<p className="text-sm uppercase tracking-[0.22em] text-[var(--text-soft)]">
						Writing
					</p>
					<h1 className="mt-4 font-display text-4xl font-extrabold text-[var(--text)] sm:text-5xl">
						Ideas, notes, and lessons learned.
					</h1>
					<p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-soft)]">
						Writing about AI quality, medicine and learning, software, and the
						creative work in between.
					</p>
				</header>

				{featuredPost ? (
					<section aria-labelledby="featured-writing" className="pt-8">
						<h2
							id="featured-writing"
							className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
						>
							Featured
						</h2>
						<Link
							href={`/blog/${featuredPost.slug}`}
							className="group mt-4 block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--outline)] hover:bg-[var(--surface-strong)] sm:p-8"
						>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
								{featuredPost.date && (
									<time dateTime={new Date(featuredPost.date).toISOString()}>
										{formatDate(featuredPost.date)}
									</time>
								)}
								{featuredPost.category && (
									<>
										<span aria-hidden="true">·</span>
										<span>{featuredPost.category}</span>
									</>
								)}
							</div>
							<div className="mt-4 flex items-start justify-between gap-4">
								<h3 className="font-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
									{featuredPost.title}
								</h3>
								<ArrowUpRight
									className="mt-1 h-5 w-5 shrink-0 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--text)]"
									aria-hidden="true"
								/>
							</div>
							<p className="mt-3 max-w-3xl leading-7 text-[var(--text-soft)]">
								{featuredPost.description}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text)]">
								Read article <span aria-hidden="true">→</span>
							</span>
						</Link>
					</section>
				) : upcomingPosts.length === 0 ? (
					<section className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-12 text-center">
						<p className="font-display text-xl font-semibold text-[var(--text)]">
							The first post is on its way.
						</p>
						<p className="mx-auto mt-3 max-w-lg leading-7 text-[var(--text-soft)]">
							This is where I’ll share notes on AI evaluation, medicine,
							software, and creative work.
						</p>
						<Link
							href="/"
							className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] hover:text-[var(--text-soft)]"
						>
							<ArrowLeft className="h-4 w-4" aria-hidden="true" />
							Back to portfolio
						</Link>
					</section>
				) : null}

				{otherPosts.length > 0 && (
					<section aria-labelledby="all-writing" className="mt-12">
						<h2
							id="all-writing"
							className="font-display text-2xl font-semibold text-[var(--text)]"
						>
							More writing
						</h2>
						<div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
							{otherPosts.map((post) => (
								<Link
									key={post.slug}
									href={`/blog/${post.slug}`}
									className="group block py-6"
								>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
										{post.date && (
											<time dateTime={new Date(post.date).toISOString()}>
												{formatDate(post.date)}
											</time>
										)}
										{post.category && (
											<>
												<span aria-hidden="true">·</span>
												<span>{post.category}</span>
											</>
										)}
									</div>
									<h3 className="mt-2 font-display text-xl font-semibold text-[var(--text)] group-hover:text-[var(--text-soft)]">
										{post.title}
									</h3>
									<p className="mt-2 leading-6 text-[var(--text-soft)]">
										{post.description}
									</p>
								</Link>
							))}
						</div>
					</section>
				)}

				{upcomingPosts.length > 0 && (
					<section
						aria-labelledby="coming-soon"
						className={posts.length > 0 ? "mt-12" : "pt-8"}
					>
						<h2
							id="coming-soon"
							className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
						>
							Coming soon
						</h2>
						<div className="mt-4 grid gap-4 sm:grid-cols-2">
							{upcomingPosts.map((post) => (
								<article
									key={post.slug}
									className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
								>
									{post.category && (
										<p className="text-sm text-[var(--muted)]">
											{post.category}
										</p>
									)}
									<h3 className="mt-3 font-display text-xl font-semibold text-[var(--text)]">
										{post.title}
									</h3>
									<p className="mt-2 leading-6 text-[var(--text-soft)]">
										{post.description}
									</p>
									<p className="mt-5 text-sm font-medium text-[var(--text)]">
										Stay tuned.
									</p>
								</article>
							))}
						</div>
					</section>
				)}
			</main>
		</>
	);
}
