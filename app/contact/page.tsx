"use client";

import { motion } from "framer-motion";
import { Github, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const contactLinks = [
  {
    icon: <Mail size={20} />,
    href: "mailto:israelmicheal227@gmail.com",
    label: "Email",
    value: "israelmicheal227@gmail.com",
    size: "wide",
  },
  {
    icon: <Twitter size={20} />,
    href: "https://twitter.com/DracoMordred",
    label: "Twitter",
    value: "@DracoMordred",
    size: "small",
  },
    {
    icon: <MapPin size={20} />,
    href: "https://maps.google.com/?q=Jos,+Nigeria",
    label: "Location",
    value: "Jos, Nigeria (Remote)",
    size: "wide",
  },
  {
    icon: <Phone size={20} />,
    href: "tel:+2349067604081",
    label: "Phone",
    value: "+234 906 760 4081",
    size: "small",
  },

  {
    icon: <Github size={20} />,
    href: "https://github.com/draco-mordred",
    label: "GitHub",
    value: "@draco-mordred",
    size: "small",
  },
  {
    icon: <Mail size={20} />,
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    value: "@israel-oladele",
    size: "wide",
  },
];

export default function ContactPage() {
  const rows = Array.from({ length: Math.ceil(contactLinks.length / 2) }, (_, rowIndex) => {
    const first = contactLinks[rowIndex * 2];
    const second = contactLinks[rowIndex * 2 + 1];
    const startsWithWide = rowIndex % 2 === 0;

    return {
      first: { ...first, isWide: startsWithWide },
      second: second ? { ...second, isWide: !startsWithWide } : null,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      <Navigation />
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-20">
        <div className="mt-20 grid w-full auto-rows-[minmax(180px,auto)] grid-cols-1 gap-6 md:grid-cols-3">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="contents">
              {row.first && (
                <div key={`${row.first.label}-first-${rowIndex}`} className={row.first.isWide ? "md:col-span-2" : "md:col-span-1"}>
                  <Card themeAware>
                    <Link
                      href={row.first.href}
                      target={row.first.href.startsWith("http") ? "_blank" : undefined}
                      rel={row.first.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group relative flex h-full min-h-[180px] flex-col items-center justify-center gap-4 p-6 text-center duration-700"
                    >
                      <span className="absolute left-1/2 top-0 h-2/3 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--muted)] via-[var(--border)] to-transparent" aria-hidden="true" />
                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)]/50 text-[var(--text)] backdrop-blur-[5px] transition-colors duration-300 group-hover:border-[var(--outline)] group-hover:text-[var(--text)]">
                        <span className="opacity-50">{row.first.icon}</span>
                      </span>
                      <div className="z-10 space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">{row.first.label}</p>
                        <p className="break-words text-sm font-medium text-[var(--text)] sm:text-base">
                          {row.first.value}
                        </p>
                      </div>
                    </Link>
                  </Card>
                </div>
              )}

              {row.second && (
                <div key={`${row.second.label}-second-${rowIndex}`} className={row.second.isWide ? "md:col-span-2" : "md:col-span-1"}>
                  <Card themeAware>
                    <Link
                      href={row.second.href}
                      target={row.second.href.startsWith("http") ? "_blank" : undefined}
                      rel={row.second.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group relative flex h-full min-h-[180px] flex-col items-center justify-center gap-4 p-6 text-center duration-700"
                    >
                      <span className="absolute left-1/2 top-0 h-2/3 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--muted)] via-[var(--border)] to-transparent" aria-hidden="true" />
                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)]/50 text-[var(--text)] backdrop-blur-[5px] transition-colors duration-300 group-hover:border-[var(--outline)] group-hover:text-[var(--text)]">
                        <span className="opacity-50">{row.second.icon}</span>
                      </span>
                      <div className="z-10 space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">{row.second.label}</p>
                        <p className="break-words text-sm font-medium text-[var(--text)] sm:text-base">
                          {row.second.value}
                        </p>
                      </div>
                    </Link>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
