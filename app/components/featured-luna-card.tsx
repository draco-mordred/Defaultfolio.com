"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  screenshots: string[];
  name: string;
  description: string;
  tags: string[];
  href: string;
};

export function FeaturedCarouselCard({
  screenshots,
  name,
  description,
  tags,
  href,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (screenshots.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % screenshots.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [screenshots.length]);

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-[var(--home-card-border)] bg-[var(--home-card-bg)] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--outline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] sm:col-span-2 sm:p-5"
    >
      {screenshots.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          {screenshots.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-25" : "opacity-0"
              }`}
            />
          ))}
        </div>
      )}
      <span className="relative flex items-start justify-between gap-3">
        <span className="font-display text-base font-semibold text-[var(--text)] drop-shadow-md sm:text-lg">
          {name}
        </span>
        <ArrowUpRight
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--text)]"
          aria-hidden="true"
        />
      </span>
      <span className="relative mt-2 block text-sm leading-5 text-[var(--text-soft)] drop-shadow-sm">
        {description}
      </span>
      <span className="relative mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded px-2 py-1 text-[10px] font-semibold text-[var(--text)]"
            style={{
              backgroundColor: "var(--home-arrow-bg)",
              color: "var(--home-arrow-text)",
            }}
          >
            {tag}
          </span>
        ))}
      </span>
    </Link>
  );
}
