"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Moon, SunMedium } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme = storedTheme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    setIsDark(nextTheme === "dark");
    setMounted(true);
  }, []);

  const applyTheme = (nextTheme: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    setIsDark(nextTheme === "dark");
  };

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";
    const bounds = event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--theme-ripple-x",
      `${bounds.left + bounds.width / 2}px`,
    );
    document.documentElement.style.setProperty(
      "--theme-ripple-y",
      `${bounds.top + bounds.height / 2}px`,
    );

    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => unknown;
    };

    if (reduceMotion || !transitionDocument.startViewTransition) {
      applyTheme(nextTheme);
      return;
    }

    transitionDocument.startViewTransition(() => applyTheme(nextTheme));
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={!isDark}
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--outline)] hover:text-[var(--text)]"
    >
      {mounted && !isDark ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
    </button>
  );
}

function TransitionNavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isBouncing, setIsBouncing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      return;
    }

    event.preventDefault();
    setIsBouncing(true);
    setIsTransitioning(true);

    window.setTimeout(() => {
      router.push(href);
    }, 260);

    window.setTimeout(() => {
      setIsBouncing(false);
      setIsTransitioning(false);
    }, 900);
  };

  return (
    <>
      <motion.div
        animate={isBouncing ? { y: [0, -6, 0], scale: [1, 1.04, 1] } : { y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <Link href={href} onClick={handleClick} className="duration-200 text-[var(--text-soft)] hover:text-[var(--text)]">
          {children}
        </Link>
      </motion.div>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="navigation-transition-overlay pointer-events-none fixed inset-0 z-[100] overflow-hidden backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="navigation-transition-ripple absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Navigation() {
	return (
		<header className="site-glass-surface site-navigation-glass fixed inset-x-0 top-0 z-[60] bg-black/20 backdrop-blur-xl">
			<div className="container relative z-10 mx-auto flex flex-row-reverse items-center justify-between px-6 py-2.5">
				<div className="flex items-center justify-between gap-8">
					<Link
						href="/projects"
            className="duration-200 text-[var(--text-soft)] hover:text-[var(--text)]"
					>
						Projects
					</Link>
					<TransitionNavLink href="/about">About</TransitionNavLink>
					<TransitionNavLink href="/contact">Contact</TransitionNavLink>
				</div>

				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Link
						href="/"
            className="duration-200 text-[var(--text-soft)] hover:text-[var(--text)]"
					>
						<ArrowLeft className="h-6 w-6" />
					</Link>
				</div>
			</div>
		</header>
	);
}
