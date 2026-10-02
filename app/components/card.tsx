import type { PropsWithChildren } from "react";


type CardProps = PropsWithChildren<{
	themeAware?: boolean;
}>;

export function Card({ children, themeAware = false }: CardProps) {
	const cardClassName = themeAware
		? "group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] duration-300 hover:border-[var(--outline)] hover:bg-[var(--surface-strong)] md:gap-8"
		: "group relative overflow-hidden rounded-xl border border-zinc-600 duration-300 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8";
	const overlayClassName = themeAware
		? "pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--glass-a)] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
		: "pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-100/[0.04] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100";

	return (
		<div className={cardClassName}>
			<div
				aria-hidden="true"
				className={overlayClassName}
			/>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
