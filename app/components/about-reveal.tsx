"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, User, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function AboutReveal() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.85;
  const clipOrigin = "40px 40px";

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
            className="home-about-modal fixed inset-0 z-[60] min-h-screen overflow-y-auto"
          >
            <div
              aria-hidden="true"
              className="home-modal-grid pointer-events-none absolute inset-0 bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close About Me and return home"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--home-accent)] hover:text-[var(--home-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-accent)] sm:right-8 sm:top-7"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, delay: duration * 0.5 }}
              className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-[2fr_3fr] md:gap-12 md:px-12 md:py-20 lg:gap-20"
            >
              <div className="flex justify-center md:justify-end">
                <div className="relative grid aspect-square w-[min(72vw,18rem)] place-items-center overflow-hidden rounded-full border border-[var(--home-accent)] bg-[var(--surface-strong)] text-[var(--text)] shadow-[0_0_100px_rgba(15,23,42,0.08)] md:w-[75%] md:max-w-[28rem]">
                  {profileImageFailed ? (
                    <>
                      <div className="absolute inset-3 rounded-full border border-[var(--home-accent)] sm:inset-5" />
                      <User className="h-[38%] w-[38%] stroke-[1.15] text-[var(--home-accent)]" aria-hidden="true" />
                      <span className="absolute bottom-[16%] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--home-accent)]">
                        IO
                      </span>
                    </>
                  ) : (
                    <Image
                      src="https://github.com/draco-mordred.png?size=512"
                      alt="Israel Oladele"
                      fill
                      sizes="(max-width: 768px) 72vw, 28rem"
                      className="object-cover"
                      onError={() => setProfileImageFailed(true)}
                    />
                  )}
                </div>
              </div>

              <section className="mx-auto w-full max-w-xl pb-8 md:mx-0 md:pb-0">
                <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[var(--home-accent)]">
                  About me <span className="ml-2 text-[var(--muted)]">/ 01</span>
                </p>
                <h1
                  id="about-reveal-title"
                  className="text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl lg:text-6xl"
                >
                  Hello, I&apos;m <span className="text-[var(--home-accent)]">Israel Oladele.</span>
                </h1>
                <p className="mt-7 max-w-lg text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                  I enjoy turning ideas into useful, thoughtful digital experiences. From
                  learning tools like MedLog LMS to creative projects like my art gallery,
                  I love bringing technology and creativity together.
                </p>
                <Link
                  href="/contact"
                  className="mt-9 inline-flex items-center gap-2 border-b border-[var(--home-accent)] pb-2 text-sm font-medium text-[var(--home-accent)] transition-colors hover:border-[var(--home-accent)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-accent)]"
                >
                  Get in touch
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}