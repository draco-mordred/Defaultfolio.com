import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { allBlogPosts } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Navigation } from "@/app/components/nav";
import "./mdx.css";

type Props = {
	params: {
		slug: string;
	};
};

function getPost(slug: string) {
	return allBlogPosts.find((post) => post.slug === slug && post.published);
}

export function generateMetadata({ params }: Props): Metadata {
	const post = getPost(params.slug);
	if (!post) {
		return {};
	}

	return {
		title: post.title,
		description: post.description,
	};
}

export default function BlogPostPage({ params }: Props) {
	const post = getPost(params.slug);
	if (!post) {
		notFound();
	}

	return (
		<>
			<Navigation />
			<main className="mx-auto min-h-screen w-full max-w-5xl px-6 pb-32 pt-32 lg:px-8">
				<article>
					<header className="border-b border-[var(--border)] pb-8">
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
						>
							<ArrowLeft className="h-4 w-4" aria-hidden="true" />
							All writing
						</Link>
						<div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
							{post.date && (
								<time dateTime={new Date(post.date).toISOString()}>
									{Intl.DateTimeFormat("en-US", {
										dateStyle: "long",
									}).format(new Date(post.date))}
								</time>
							)}
							{post.category && (
								<>
									<span aria-hidden="true">·</span>
									<span>{post.category}</span>
								</>
							)}
						</div>
						<h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl">
							{post.title}
						</h1>
						<p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
							{post.description}
						</p>
					</header>

					<div className="blog-article-content mx-auto mt-10 max-w-3xl">
						<Mdx code={post.body.code} />
					</div>
				</article>
			</main>
		</>
	);
}
