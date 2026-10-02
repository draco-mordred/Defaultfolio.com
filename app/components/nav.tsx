"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
        <Link href={href} onClick={handleClick} className="duration-200 text-zinc-400 hover:text-zinc-100">
          {children}
        </Link>
      </motion.div>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-zinc-950/80 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200/40 bg-zinc-100/5"
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
				<div className="flex justify-between gap-8">
					<Link
						href="/projects"
						className="duration-200 text-zinc-400 hover:text-zinc-100"
					>
						Projects
					</Link>
					<TransitionNavLink href="/about">About</TransitionNavLink>
					<TransitionNavLink href="/contact">Contact</TransitionNavLink>
				</div>

				<Link
					href="/"
					className="duration-200 text-zinc-300 hover:text-zinc-100"
				>
					<ArrowLeft className="h-6 w-6" />
				</Link>
			</div>
		</header>
	);
}
