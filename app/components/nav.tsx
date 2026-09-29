import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function Navigation() {
	return (
		<header className="site-glass-surface site-navigation-glass fixed inset-x-0 top-0 z-50">
				<div className="container mx-auto flex flex-row-reverse items-center justify-between px-6 py-2.5">
					<div className="flex justify-between gap-8">
						<Link
							href="/projects"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Projects
						</Link>
						<Link
							href="/about"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							About
						</Link>
						<Link
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Contact
						</Link>
					</div>

					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
		</header>
	);
}
