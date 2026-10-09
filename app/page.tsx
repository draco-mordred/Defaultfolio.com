import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Github,
  Menu,
  X,
} from "lucide-react";
import Particles from "./components/particles";
import { SkillsCarousel } from "./components/skills-carousel";
import { AboutReveal } from "./components/about-reveal";
import { ThemeToggle } from "./components/nav";

const navigation = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const featuredProjects = [
  {
    name: "MedLog LMS",
    description:
      "A learning management system for medical learners, teachers, and administrators.",
    href: "https://medloglms.vercel.app",
    tags: ["Medical education", "LMS", "Learning tools"],
  },
  {
    name: "Art Gallery",
    description:
      "A curated online gallery for showcasing digital illustrations and visual work.",
    href: "https://sites.google.com/view/israel-oladele/home",
    tags: ["Illustration", "Digital art", "Creative"],
  },
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm text-[var(--text-soft)] transition-colors hover:text-[var(--text)] ${
            mobile ? "rounded-lg px-3 py-2 hover:bg-[var(--surface)]" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
  
export default function Home() {
  return (
    <div className="home-page-background home-content-revealed relative isolate flex w-full flex-1 flex-col items-center overflow-x-clip pb-[1.75rem] sm:pb-14">
      <Particles
        className="home-particles pointer-events-none absolute inset-0 -z-10"
        quantity={90}
      />

      <header className="home-wide-sticky-nav sticky top-0 z-50 flex min-h-16 w-full items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-7 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <AboutReveal />
          <Link href="/" className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[var(--text)]">
              Israel Oladele
            </span>
            <span className="block truncate text-xs text-[var(--muted)]">
              draco-mordred
            </span>
          </Link>
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 sm:flex"
        >
          <NavigationLinks />
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition hover:opacity-80"
          >
            Hire Me
          </Link>
        </nav>

        <ThemeToggle className="sm:hidden" />

        <details className="group relative sm:hidden">
          <summary
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-12 z-20 grid min-w-44 gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-strong)] p-2 shadow-xl"
          >
            <NavigationLinks mobile />
            <Link
              href="/contact"
              className="rounded-lg bg-[var(--text)] px-3 py-2 text-sm font-semibold text-[var(--bg)]"
            >
              Hire Me
            </Link>
          </nav>
        </details>
      </header>

      <div className="relative z-10 mt-3 w-[calc(100%-1.25rem)] max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/20 backdrop-blur-xl pt-3 sm:mt-4 sm:w-[calc(100%-2rem)] sm:pt-4 md:mt-6 md:w-[calc(100%-2.5rem)] md:pt-5 lg:my-6 lg:w-full lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:pt-0 lg:shadow-none lg:backdrop-blur-none">
        <main className="lg:mx-6 lg:w-[calc(100%-3rem)] lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[var(--border)] lg:bg-[var(--surface)] lg:shadow-2xl lg:shadow-black/20 lg:backdrop-blur-xl">
        <section className="px-4 pb-7 pt-7 text-center sm:px-8 sm:pb-8 sm:pt-10 md:px-10 md:pb-9 md:pt-11 lg:pt-12">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border border-[var(--outline)] bg-[var(--surface-strong)] shadow-[var(--home-logo-shadow)] ring-4 ring-white/[0.03] sm:h-24 sm:w-24">
            <Image
              src="https://github.com/draco-mordred.png?size=512"
              alt="Israel Oladele"
              fill
              sizes="(max-width: 768px) 5rem, 6rem"
              className="object-cover"
            />
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            Full-stack Developer · AI evaluator · Medical Doctor
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            Israel Oladele
          </h1>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            - draco-mordred
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-soft)] sm:text-base">
            AI Evaluator &amp; Medical Student — improving AI quality through
            careful evaluation, research, and creative problem-solving.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition hover:opacity-80"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              View Projects
            </Link>
            <a
              href="https://github.com/draco-mordred"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition hover:border-[var(--outline)] hover:bg-[var(--surface-strong)]"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </section>

        <SkillsCarousel />

        <section
          id="featured-projects"
          aria-labelledby="featured-heading"
          className="border-t border-[var(--border)] px-5 pb-7 pt-6 sm:px-10 sm:pb-9"
        >
          <h2
            id="featured-heading"
            className="text-center font-display text-xl font-semibold text-[var(--text)] sm:text-2xl"
          >
            Featured Projects
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {featuredProjects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-[var(--home-card-border)] bg-[var(--home-card-bg)] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--outline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] sm:p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
                    {project.name}
                  </span>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--text)]"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 block text-sm leading-5 text-[var(--text-soft)]">
                  {project.description}
                </span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded px-2 py-1 text-[10px] font-semibold text-[var(--text)]"
                      style={{ backgroundColor: "var(--home-arrow-bg)", color: "var(--home-arrow-text)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </section>
        </main>
      </div>
    </div>
  );
}
