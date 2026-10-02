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
      className="group relative flex w-full max-w-[22rem] scale-90 items-center justify-between gap-6 rounded-xl border border-zinc-700/80 bg-zinc-950/85 px-5 py-4 text-left shadow-2xl shadow-black/50 backdrop-blur transition-colors hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-300"
    >
      <motion.span
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="pointer-events-none absolute -top-12 right-3 z-20 w-40 rounded-xl border border-zinc-700/80 bg-zinc-950/90 px-2 py-1 text-[10px] font-medium text-zinc-200 shadow-xl shadow-black/40"
      >
        {project.detail}
      </motion.span>

      <span>
        <span className="block text-xs uppercase tracking-widest text-zinc-500">
          Featured project
        </span>
        <span className="mt-1 block text-lg font-semibold text-zinc-100">
          {project.name}
        </span>
        <span className="mt-1 block text-sm text-zinc-400 group-hover:text-zinc-200">
          {project.label}
        </span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </motion.a>
  );
}

export default function Home() {
  return (
    <div className="flex w-screen flex-1 flex-col justify-between overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <AboutReveal />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 my-16"
          style={{ perspective: 1000, marginTop: "-16rem" }}
        >
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-500 duration-500 hover:text-zinc-300"
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
          className="absolute inset-0 -z-10"
          quantity={108}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 260, scale: 0.45 }}
            animate={{
              opacity: 1,
              y: [260, 180, 80, 0],
              scale: [0.45, 0.75, 1.08, 1],
            }}
            transition={{
              duration: 1.7,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.38, 0.72, 1],
              delay: 0.1,
            }}
            className="relative flex h-[10.75rem] w-[10.75rem] items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/80 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            role="img"
            aria-label="Avalon Enterprises logo placeholder"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.8, 2.2] }}
              transition={{
                delay: 1.2,
                duration: 1,
                ease: "easeOut",
              }}
              className="absolute inset-[-11px] rounded-full border border-zinc-300/35"
            />
            <span aria-hidden="true" className="font-display text-[2.69rem] text-zinc-100">
              A
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 flex flex-col items-center justify-center whitespace-nowrap bg-clip-text bg-white text-center font-display text-transparent text-edge-outline"
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
          transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden h-px w-full bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center md:mt-12"
        >
          <h2 className="text-md text-zinc-500">My portfolio</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 mt-4 flex w-full flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap"
        >
          {projectCards.map((project, index) => (
            <FeaturedProjectCard key={project.name} project={project} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
