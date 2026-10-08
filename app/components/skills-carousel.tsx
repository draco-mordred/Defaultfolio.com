"use client";

import Image from "next/image";
import { GitBranch } from "lucide-react";
import { useState } from "react";

const masteredSkills = [
  { name: "JavaScript", icon: "javascript/javascript-original.svg" },
  { name: "Python", icon: "python/python-original.svg" },
  { name: "NodeJS", icon: "nodejs/nodejs-original.svg" },
  { name: "ElectronJS", icon: "electron/electron-original.svg" },
  { name: "VueJS", icon: "vuejs/vuejs-original.svg" },
  { name: "NextJS", icon: "nextjs/nextjs-original.svg" },
  { name: "TypeScript", icon: "typescript/typescript-original.svg" },
  { name: "Adobe PhotoShop", icon: "photoshop/photoshop-plain.svg" },
  { name: "Adobe Illustrator", icon: "illustrator/illustrator-plain.svg" },
  { name: "JetBrains", icon: "jetbrains/jetbrains-original.svg" },
  { name: "Visual Studio", icon: "visualstudio/visualstudio-plain.svg" },
  { name: "Git", icon: "git/git-original.svg" },
  { name: "GitHub", icon: "github/github-original.svg" },
  { name: "GitLens", icon: null },
  { name: "PowerShell", icon: "powershell/powershell-original.svg" },
];

const areasOfFocus = [
  "AI Evaluation",
  "LLM QA",
  "Prompt Engineering",
  "Data Annotation",
  "Digital Art",
  "Fact-checking",
  "Research",
];

const deviconBaseUrl =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

type MarqueeProps = {
  label: string;
  items: string[] | typeof masteredSkills;
  showIcons?: boolean;
};

function SkillMarquee({ label, items, showIcons = false }: MarqueeProps) {
  const [isTouching, setIsTouching] = useState(false);
  const repeatedItems = [...items, ...items];

  return (
    <div className="mx-auto mt-4 max-w-3xl overflow-hidden">
      <div
        className={`skill-marquee${isTouching ? " is-touching" : ""}`}
        role="group"
        aria-label={`${label} carousel. Focus or touch to pause.`}
        aria-roledescription="carousel"
        tabIndex={0}
        onTouchStart={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
        onTouchCancel={() => setIsTouching(false)}
      >
        <div className="skill-track inline-flex items-center gap-3">
          {repeatedItems.map((item, idx) => {
            const skill = typeof item === "string" ? item : item.name;
            const icon = typeof item === "string" ? undefined : item.icon;

            return (
              <span
                key={`${skill}-${idx}`}
                aria-hidden={idx >= items.length}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text-soft)]"
              >
                {showIcons && (
                  <span className="skill-icon-surface grid h-7 w-7 shrink-0 place-items-center rounded">
                    {icon ? (
                      <Image
                        src={`${deviconBaseUrl}/${icon}`}
                        alt=""
                        aria-hidden="true"
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px]"
                      />
                    ) : (
                      <GitBranch
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                )}
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SkillsCarousel() {
  return (
    <>
      <section
        aria-labelledby="skills-heading"
        className="border-t border-[var(--border)] px-5 py-6 sm:px-10"
      >
        <h2
          id="skills-heading"
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          Skills
        </h2>
        <SkillMarquee label="Skills" items={masteredSkills} showIcons />
      </section>

      <section
        aria-labelledby="focus-heading"
        className="border-t border-[var(--border)] px-5 py-6 sm:px-10"
      >
        <h2
          id="focus-heading"
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          Areas of focus
        </h2>
        <SkillMarquee label="Areas of focus" items={areasOfFocus} />
      </section>
    </>
  );
}
