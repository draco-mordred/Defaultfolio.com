import Link from "next/link";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="site-glass-surface site-footer-glass fixed inset-x-0 bottom-0 z-50 w-full px-6 py-4 text-center text-sm text-zinc-100">
			<div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6">
				<span>© {year} Avalon Enterprises</span>
				<Link
					href="#policy"
					className="transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:text-white"
				>
					Policy
				</Link>
			</div>
		</footer>
	);
}