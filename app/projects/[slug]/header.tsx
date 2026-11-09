"use client";
import { ArrowLeft, Eye, Github, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
	project: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};

	views: number;
	backgroundImages?: string[];
};

export const Header: React.FC<Props> = ({ project, views, backgroundImages }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({
			label: "GitHub",
			href: `https://github.com/${project.repository}`,
		});
	}
	if (project.url) {
		links.push({
			label: "Website",
			href: project.url,
		});
	}
	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const iconLinkClasses =
		"duration-200 hover:font-medium text-[var(--text-soft)] hover:text-[var(--text)]";

	return (
		<header
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-tl from-[var(--bg-strong)] via-[var(--bg)] to-[var(--bg-strong)]"
		>
			{backgroundImages && backgroundImages.length > 0 && (
				<div
					aria-hidden="true"
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
				>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 p-8 -rotate-3 scale-125">
						{backgroundImages.map((src, i) => (
							<img
								key={src}
								src={src}
								alt=""
								loading="lazy"
								className="w-64 md:w-80 h-40 md:h-48 object-cover rounded-xl shadow-2xl opacity-25"
								style={{ transform: `rotate(${i % 2 === 0 ? 3 : -4}deg)` }}
							/>
						))}
					</div>
				</div>
			)}
			{backgroundImages && backgroundImages.length > 0 && (
				<div
					aria-hidden="true"
					className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]"
				/>
			)}
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
					isIntersecting
						? "bg-transparent border-transparent"
						: "bg-[var(--surface)] border-[var(--border)] lg:border-transparent"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className={`flex items-center gap-1 ${iconLinkClasses}`}
						>
							<Eye className="w-5 h-5" />{" "}
							{Intl.NumberFormat("en-US", { notation: "compact" }).format(
								views,
							)}
						</span>
						<Link
							target="_blank"
							href="https://twitter.com/draco-mordred"
							className={iconLinkClasses}
						>
							<Twitter className="w-6 h-6" />
						</Link>
						<Link
							target="_blank"
							href="https://github.com/draco-mordred"
							className={iconLinkClasses}
						>
							<Github className="w-6 h-6" />
						</Link>
					</div>

					<Link href="/projects" className={iconLinkClasses}>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-6xl font-display drop-shadow-lg">
							{project.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-[var(--text-soft)] drop-shadow-md">
							{project.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-[var(--text)] sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link target="_blank" key={link.label} href={link.href}>
									{link.label} <span aria-hidden="true">&rarr;</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
