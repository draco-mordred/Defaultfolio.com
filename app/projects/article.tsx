import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
	project: Project;
	views: number;
	externalHref?: string;
	backgroundImages?: string[];
};

export function Article({
	project,
	views,
	externalHref,
	backgroundImages,
}: Props) {
	const content = (
		<article className="relative overflow-hidden p-4 md:p-8">
			{backgroundImages && backgroundImages.length > 0 && (
				<div
					aria-hidden="true"
					className="absolute inset-0 pointer-events-none select-none"
				>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="grid grid-cols-3 gap-4 p-4 -rotate-3 scale-125">
							{backgroundImages.slice(0, 6).map((src, i) => (
								<img
									key={src}
									src={src}
									alt=""
									loading="lazy"
									className="w-28 md:w-32 h-20 md:h-24 object-cover rounded-lg shadow-xl opacity-25"
									style={{ transform: `rotate(${i % 2 === 0 ? 4 : -5}deg)` }}
								/>
							))}
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)] opacity-60" />
				</div>
			)}
			<div className="relative flex justify-between gap-2 items-center">
				<span className="text-xs duration-1000 text-[var(--text-soft)] group-hover:text-[var(--text)] drop-shadow-orange">
					{project.date ? (
						<time dateTime={new Date(project.date).toISOString()}>
							{Intl.DateTimeFormat(undefined, {
								dateStyle: "medium",
							}).format(new Date(project.date))}
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
			<h2 className="relative z-20 mt-2 text-xl font-medium duration-1000 lg:text-3xl text-[var(--text)] group-hover:text-[var(--text)] font-display drop-shadow-md">
				{project.title}
			</h2>
			<p className="relative z-20 mt-4 text-sm duration-1000 text-[var(--text-soft)] group-hover:text-[var(--text)] drop-shadow-sm">
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
