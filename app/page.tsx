import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col justify-between w-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
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
          quantity={100}
        />
        <div className="mb-8 animate-fade-in">
          {/* Logo placeholder - add your logo image here */}
          <div className="w-24 h-24 mx-auto rounded-lg border border-zinc-700 bg-zinc-900/50 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">Logo</span>
          </div>
        </div>
        <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
          Avalon Enterprises
        </h1>

        <div className="hidden w-full h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="my-16 text-center animate-fade-in">
          <h2 className="text-sm text-zinc-500 ">Welcome to my portfolio</h2>
        </div>
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
      </main>

      <footer className="w-full border-t border-zinc-800 bg-black/90 px-6 py-6 text-center text-sm text-zinc-500 animate-fade-in">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-6 max-w-3xl">
          <span className="transition duration-300 ease-out hover:text-white hover:-translate-y-0.5 hover:scale-105">
            © {year} Avalon Enterprises
          </span>
          <Link
            href="#policy"
            className="transition duration-300 ease-out hover:text-white hover:-translate-y-0.5 hover:scale-105"
          >
            Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
