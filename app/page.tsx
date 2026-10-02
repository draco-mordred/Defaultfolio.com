"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AboutReveal } from "./components/about-reveal";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const projectCards = [
  {
    name: "Art gallery",
    href: "https://sites.google.com/view/israel-oladele/home",
    label: "View my Art gallery here",
    aria: "View my Art gallery here (opens in a new tab)",
    detail: "A curated collection of art and visual work.",
  },
  {
    name: "MedLog LMS",
    href: "https://medloglms.vercel.app",
    label: "View my MedLog LMS here",
    aria: "View my MedLog LMS here (opens in a new tab)",
    detail: "A learning platform built for practice and growth.",
  },
];

function FeaturedProjectCard({
  project,
  index,
}: {
  project: (typeof projectCards)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  return (

    <motion.a
      key={project.name}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={project.aria}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onFocus={handleHoverStart}
      onBlur={handleHoverEnd}
      initial={{ y: 0 }}
      animate={isHovered ? { y: 0 } : { y: [0, -7, 0, -3.5, 0] }}
      transition={
        isHovered
          ? { duration: 0.22, ease: "easeOut" }
          : {
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }
      }
      className="group relative flex w-full max-w-[22rem] scale-90 items-center justify-between gap-6 rounded-xl border border-[var(--home-card-border)] bg-[var(--home-card-bg)] px-5 py-4 text-left text-[var(--text)] shadow-2xl shadow-black/20 backdrop-blur transition-colors hover:border-[var(--outline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-accent)]"
    >
      <motion.span
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="pointer-events-none absolute -top-12 right-3 z-20 w-40 rounded-xl border border-[var(--home-tooltip-border)] bg-[var(--home-tooltip-bg)] px-2 py-1 text-[10px] font-medium text-[var(--text)] shadow-xl shadow-black/20 backdrop-blur"
      >
        {project.detail}
      </motion.span>

      <span>
        <span className="block text-xs uppercase tracking-widest text-[var(--muted)]">
          Featured project
        </span>
        <span className="mt-1 block text-lg font-semibold text-[var(--text)]">
          {project.name}
        </span>
        <span className="mt-1 block text-sm text-[var(--text-soft)] group-hover:text-[var(--text)]">
          {project.label}
        </span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--home-arrow-bg)] text-[var(--home-arrow-text)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </motion.a>
  );
}

export default function Home() {
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  return (
    <div className={`home-page-background flex w-screen flex-1 flex-col justify-between overflow-hidden ${isContentRevealed ? "home-content-revealed" : ""}`}>
      <AboutReveal isPageRevealed={isContentRevealed} />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 my-16"
          style={{ perspective: 1000, marginTop: "-16rem" }}
        >
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--text-soft)] duration-500 hover:text-[var(--text)]"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </motion.nav>

        {/* <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden h-px w-full bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block"
        /> */}

        <Particles
          className="home-particles absolute inset-0 -z-10"
          quantity={108}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative mb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -220, y: -240, scale: 0.45, rotate: -14 }}
            animate={{
              opacity: 1,
              x: [-220, -125, -70, -18, 28, 0],
              y: [-240, 50, -24, 34, -60, 0],
              scale: [0.45, 1.03, 0.95, 1.03, 0.94, 1],
              rotate: [-14, 5, -4, 2, -1, 0],
            }}
            transition={{
              duration: 2.35,
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeOut"],
              times: [0, 0.38, 0.55, 0.7, 0.86, 1],
              delay: 0.1,
            }}
            className="relative flex h-[10.75rem] w-[10.75rem] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--home-logo-shadow)]"
            role="img"
            aria-label="Avalon Enterprises logo placeholder"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.8, 2.2] }}
              transition={{
                delay: 2.35,
                duration: 0.9,
                ease: "easeOut",
              }}
              className="absolute inset-[-11px] rounded-full border border-[var(--home-ripple-border)]"
            />
            <span aria-hidden="true" className="font-display text-[2.69rem] text-[var(--text)]">
              A
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 flex flex-col items-center justify-center whitespace-nowrap bg-clip-text bg-[var(--home-title-color)] text-center font-display text-transparent text-edge-outline"
          style={{ width: "-webkit-fill-available"}}
        >
          <span className="block text-4xl sm:text-6xl md:text-9xl">Avalon</span>
          <span className="mt-1 block text-[1.8em] leading-none tracking-[0.08em] sm:text-[1.8em] md:text-[1.8em]">
            Enterprises
          </span>
        </motion.h1>

        <br />
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden h-px w-full bg-gradient-to-r from-[var(--border)] via-[var(--outline)] to-[var(--border)] md:block"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center md:mt-12"
        >
          <h2 className="text-md text-[var(--text-soft)]">My portfolio</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setIsContentRevealed(true)}
          className="absolute bottom-14 left-0 right-0 mt-4 flex w-full flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap"
        >
          {projectCards.map((project, index) => (
            <FeaturedProjectCard key={project.name} project={project} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
