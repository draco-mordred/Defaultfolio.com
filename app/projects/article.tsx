import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
	project: Project;
	views: number;
	externalHref?: string;
};

export function Article({ project, views, externalHref }: Props) {
	const content = (
		<article className="p-4 md:p-8">
			<div className="flex justify-between gap-2 items-center">
				<span className="text-xs duration-1000 text-[var(--text-soft)] group-hover:text-[var(--text)] drop-shadow-orange">
					{project.date ? (
						<time dateTime={new Date(project.date).toISOString()}>
							{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
								new Date(project.date),
							)}
						</time>
					) : (
						<span>SOON</span>
					)}
				</span>
				<span className="text-[var(--muted)] text-xs flex items-center gap-1">
					<Eye className="w-2 h-2" />{" "}
					{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
				</span>
			</div>
			<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-[var(--text)] group-hover:text-[var(--text)] font-display">
				{project.title}
			</h2>
			<p className="z-20 mt-4 text-sm duration-1000 text-[var(--text-soft)] group-hover:text-[var(--text)]">
				{project.description}
			</p>
		</article>
	);

	if (externalHref) {
		return (
			<a
				href={externalHref}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				{content}
			</a>
		);
	}

	return <Link href={`/projects/${project.slug}`}>{content}</Link>;
}
