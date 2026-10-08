"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, User, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "./nav";

export function AboutReveal() {
	const [isOpen, setIsOpen] = useState(false);
	const [profileImageFailed, setProfileImageFailed] = useState(false);
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
	const openButtonRef = useRef<HTMLButtonElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const reduceMotion = useReducedMotion();
	const duration = reduceMotion ? 0 : 0.85;
	const clipOrigin = "40px 40px";

	useEffect(() => {
		setPortalRoot(document.body);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
			openButtonRef.current?.focus();
		};
	}, [isOpen]);

	return (
		<>
			<button
				ref={openButtonRef}
				type="button"
				aria-label="Meet Israel Oladele"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-controls="about-reveal"
				onClick={() => setIsOpen(true)}
				className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--home-logo-shadow)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-accent)]"
			>
				<Image
					src="https://github.com/draco-mordred.png?size=256"
					alt="Israel Oladele"
					width={36}
					height={36}
					className="h-full w-full object-cover"
					onError={() => setProfileImageFailed(true)}
				/>
			</button>

			{portalRoot &&
				createPortal(
					<AnimatePresence>
						{isOpen && (
							<motion.div
								id="about-reveal"
								key="about-reveal"
								role="dialog"
								aria-modal="true"
								aria-labelledby="about-reveal-title"
								tabIndex={-1}
								initial={{ clipPath: `circle(0% at ${clipOrigin})` }}
								animate={{ clipPath: `circle(150% at ${clipOrigin})` }}
								exit={{ clipPath: `circle(0% at ${clipOrigin})` }}
								transition={{ duration, ease: "easeInOut" }}
								className="home-about-modal fixed inset-0 z-[60] h-dvh overflow-y-auto overscroll-contain"
							>
								<div
									aria-hidden="true"
									className="home-modal-grid pointer-events-none fixed inset-0 bg-[size:56px_56px] opacity-60"
								/>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: reduceMotion ? 0 : 0.55,
										delay: duration * 0.5,
									}}
									className="relative mx-auto w-[95vw] max-w-none px-0 pb-[2.5vh] pt-[2.5vh]"
								>
									<div className="relative mx-auto">
										<div
											aria-hidden="true"
											className="absolute inset-x-4 -bottom-3 top-3 rotate-[-1deg] rounded-2xl border border-[var(--border)] bg-[var(--surface)] opacity-55 sm:inset-x-8"
										/>
										<div
											aria-hidden="true"
											className="absolute inset-x-2 -bottom-1.5 top-1.5 rotate-[0.6deg] rounded-2xl border border-[var(--border)] bg-[var(--surface)] opacity-75 sm:inset-x-4"
										/>

										<article className="relative min-h-[95vh] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-strong)] text-[var(--text)] shadow-2xl shadow-black/15">
											<div className="relative flex h-12 items-center justify-center border-b border-[var(--border)] bg-[var(--surface)] px-3 sm:h-14 sm:px-5">
												<button
													ref={closeButtonRef}
													type="button"
													aria-label="Close About Me and return home"
													onClick={() => setIsOpen(false)}
													className="absolute left-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] transition hover:border-[var(--home-accent)] hover:text-[var(--home-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] sm:left-3"
												>
													<X className="h-4 w-4" aria-hidden="true" />
												</button>
												<div className="absolute left-1/2 flex min-w-0 max-w-[55%] -translate-x-1/2 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg)]/60 px-3 py-1 text-[11px] text-[var(--muted)] sm:max-w-sm sm:text-xs">
													<span
														className="h-1.5 w-1.5 rounded-full bg-[var(--home-accent)]"
														aria-hidden="true"
													/>
													<span className="truncate">
														israeloladele.dev / about
													</span>
												</div>
												<ThemeToggle className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 sm:right-3" />
											</div>

											<div className="px-5 pb-10 pt-7 sm:px-10 sm:pb-14 sm:pt-10 md:px-16 lg:px-20">
												<header className="mb-8 flex items-center justify-between border-b border-[var(--border)] pb-5">
													<Link href="/" className="flex items-center gap-2.5">
														<span className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--border)]">
															{profileImageFailed ? (
																<span className="grid h-full w-full place-items-center bg-[var(--surface-strong)]">
																	<User
																		className="h-5 w-5 text-[var(--home-accent)]"
																		aria-hidden="true"
																	/>
																</span>
															) : (
																<Image
																	src="https://github.com/draco-mordred.png?size=256"
																	alt=""
																	fill
																	sizes="36px"
																	className="object-cover"
																	onError={() => setProfileImageFailed(true)}
																/>
															)}
														</span>
														<span className="text-sm font-semibold">
															Israel Oladele
														</span>
													</Link>
													<span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
														A little about me
													</span>
												</header>

												<section aria-labelledby="about-reveal-title">
													<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--home-accent)]">
														The person behind the work
													</p>
													<h1
														id="about-reveal-title"
														className="mt-5 max-w-5xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl"
													>
														Hey, I&apos;m{" "}
														<span className="relative mx-1 inline-block h-[0.9em] w-[0.9em] translate-y-[0.12em] overflow-hidden rounded-full border-2 border-[var(--home-accent)] align-baseline">
															{profileImageFailed ? (
																<User
																	className="h-full w-full bg-[var(--surface-strong)] p-2 text-[var(--home-accent)]"
																	aria-hidden="true"
																/>
															) : (
																<Image
																	src="https://github.com/draco-mordred.png?size=512"
																	alt="Israel Oladele"
																	fill
																	sizes="(max-width: 768px) 3rem, 5rem"
																	className="object-cover"
																	onError={() => setProfileImageFailed(true)}
																/>
															)}
														</span>{" "}
														Israel Oladele.
													</h1>
													<p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--text-soft)] sm:text-xl sm:leading-9">
														I&apos;m a{" "}
														<strong className="font-semibold text-[var(--text)]">
															full-stack developer
														</strong>
														,{" "}
														<strong className="font-semibold text-[var(--text)]">
															AI evaluator
														</strong>
														, and medical professional who brings technology,
														careful reasoning, and creativity together to make
														useful things.
													</p>
												</section>

												<section
													aria-labelledby="quick-facts-title"
													className="mt-12 border-t border-[var(--border)] pt-7 sm:mt-14 sm:pt-9"
												>
													<div className="flex flex-wrap items-end justify-between gap-3">
														<h2
															id="quick-facts-title"
															className="font-display text-2xl font-bold text-[var(--text)] sm:text-3xl"
														>
															A few things about me
														</h2>
														<span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
															Quick facts / 01
														</span>
													</div>

													<div className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2">
														<div className="flex items-start gap-3">
															<CheckCircle2
																className="mt-1 h-4 w-4 shrink-0 text-[var(--home-accent)]"
																aria-hidden="true"
															/>
															<p className="text-sm leading-7 text-[var(--text-soft)] sm:text-base">
																<strong className="font-semibold text-[var(--text)]">
																	I have four years of experience in AI
																	evaluation
																</strong>
																, assessing factual accuracy, reasoning,
																grounding, and policy alignment.
															</p>
														</div>
														<div className="flex items-start gap-3">
															<CheckCircle2
																className="mt-1 h-4 w-4 shrink-0 text-[var(--home-accent)]"
																aria-hidden="true"
															/>
															<p className="text-sm leading-7 text-[var(--text-soft)] sm:text-base">
																I&apos;ve reviewed{" "}
																<strong className="font-semibold text-[var(--text)]">
																	1,500+ model responses
																</strong>{" "}
																across text, image, and video tasks, looking for
																subtle quality and reliability issues.
															</p>
														</div>
														<div className="flex items-start gap-3">
															<CheckCircle2
																className="mt-1 h-4 w-4 shrink-0 text-[var(--home-accent)]"
																aria-hidden="true"
															/>
															<p className="text-sm leading-7 text-[var(--text-soft)] sm:text-base">
																I studied medicine at the{" "}
																<strong className="font-semibold text-[var(--text)]">
																	University of Jos, Nigeria
																</strong>
																, bringing a research-minded and detail-oriented
																perspective to my work.
															</p>
														</div>
														<div className="flex items-start gap-3">
															<CheckCircle2
																className="mt-1 h-4 w-4 shrink-0 text-[var(--home-accent)]"
																aria-hidden="true"
															/>
															<p className="text-sm leading-7 text-[var(--text-soft)] sm:text-base">
																I&apos;m also a{" "}
																<strong className="font-semibold text-[var(--text)]">
																	digital illustrator and photo editor
																</strong>
																; visual storytelling keeps my creative side
																curious.
															</p>
														</div>
													</div>
												</section>

												<footer className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-[var(--border)] pt-7 sm:mt-14 sm:flex-row sm:items-center">
													<p className="max-w-xl text-sm leading-6 text-[var(--text-soft)]">
														I&apos;m always interested in thoughtful
														collaborations where technology can make a
														meaningful difference.
													</p>
													<Link
														href="/contact"
														className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-accent)]"
													>
														Get in touch
														<ArrowUpRight
															className="h-4 w-4"
															aria-hidden="true"
														/>
													</Link>
												</footer>
											</div>
										</article>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>,
					portalRoot,
				)}
		</>
	);
}
