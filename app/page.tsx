import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { AboutReveal } from "./components/about-reveal";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-between w-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <AboutReveal />
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <nav className="my-16 animate-fade-in">
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>
        <div className="hidden w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={48}
        />
        <div className="mb-8 animate-fade-in">
          <div
            role="img"
            aria-label="Avalon Enterprises logo placeholder"
            className="flex h-24 w-24 mx-auto items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/50"
          >
            <span aria-hidden="true" className="font-display text-6xl text-zinc-100">
              A
            </span>
          </div>
        </div>
        <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
          Avalon Enterprises
        </h1>

        <div className="hidden w-full h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="my-16 text-center animate-fade-in">
          <h2 className="text-sm text-zinc-500 ">Welcome to my portfolio</h2>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 animate-fade-in sm:flex-row sm:flex-wrap">
          <a
            href="https://sites.google.com/view/israel-oladele/home"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View my Art gallery here (opens in a new tab)"
            className="group gallery-float flex w-full max-w-sm items-center justify-between gap-6 rounded-xl border border-zinc-700/80 bg-zinc-950/85 px-5 py-4 text-left shadow-2xl shadow-black/50 backdrop-blur transition-colors hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-300"
          >
            <span>
              <span className="block text-xs uppercase tracking-widest text-zinc-500">
                Featured project
              </span>
              <span className="mt-1 block text-lg font-semibold text-zinc-100">
                Art gallery
              </span>
              <span className="mt-1 block text-sm text-zinc-400 group-hover:text-zinc-200">
                View my Art gallery here
              </span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </a>
          <a
            href="https://medloglms.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View my MedLog LMS here (opens in a new tab)"
            className="group gallery-float gallery-float-delayed flex w-full max-w-sm items-center justify-between gap-6 rounded-xl border border-zinc-700/80 bg-zinc-950/85 px-5 py-4 text-left shadow-2xl shadow-black/50 backdrop-blur transition-colors hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-300"
          >
            <span>
              <span className="block text-xs uppercase tracking-widest text-zinc-500">
                Featured project
              </span>
              <span className="mt-1 block text-lg font-semibold text-zinc-100">
                MedLog LMS
              </span>
              <span className="mt-1 block text-sm text-zinc-400 group-hover:text-zinc-200">
                View my MedLog LMS here
              </span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </a>
        </div>
      </main>

    </div>
  );
}
