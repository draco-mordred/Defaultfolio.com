import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
	return (
		<div className="group relative overflow-hidden rounded-xl border border-zinc-600 duration-300 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-100/[0.04] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
			/>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
