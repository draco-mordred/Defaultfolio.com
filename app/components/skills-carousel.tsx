"use client";

import Image from "next/image";
import { GitBranch } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  `Web Development`,
  `AI Learning`,
  `Medical Education`,
  `Clinical Medicine`,
  `Medical Research`,
  "AI Evaluation",
  `Illustrations`,
  
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const extraSpeedRef = useRef(0);
  const touchStartRef = useRef<{ x: number; time: number } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!track || !firstSet) return;

    let loopWidth = firstSet.getBoundingClientRect().width;
    let previousTime = 0;
    let frameId = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resizeObserver = new ResizeObserver(() => {
      loopWidth = firstSet.getBoundingClientRect().width;
      if (loopWidth > 0) offsetRef.current %= loopWidth;
    });
    resizeObserver.observe(firstSet);

    const animate = (time: number) => {
      if (previousTime === 0) previousTime = time;
      const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const shouldPause = isTouching || isHovered || isFocused;

      if (!reducedMotion.matches && !shouldPause && loopWidth > 0) {
        const baseSpeed = loopWidth / 20;
        extraSpeedRef.current *= Math.exp(-deltaTime / 0.75);
        const speed = Math.max(baseSpeed * 0.15, baseSpeed + extraSpeedRef.current);
        offsetRef.current = (offsetRef.current + speed * deltaTime) % loopWidth;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [isTouching]);

  const addSpeedImpulse = (impulse: number) => {
    const firstSet = firstSetRef.current;
    if (!firstSet) return;

    const baseSpeed = firstSet.getBoundingClientRect().width / 20;
    extraSpeedRef.current = Math.max(
      -baseSpeed * 0.85,
      Math.min(baseSpeed * 4, extraSpeedRef.current + impulse),
    );
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const horizontalDelta = event.shiftKey ? event.deltaY : event.deltaX;
    if (horizontalDelta !== 0) addSpeedImpulse(-horizontalDelta * 4);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, time: performance.now() };
    setIsTouching(true);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    const start = touchStartRef.current;
    if (start) {
      const elapsed = Math.max((performance.now() - start.time) / 1000, 0.01);
      const swipeVelocity = (start.x - touch.clientX) / elapsed;
      addSpeedImpulse(Math.max(-1200, Math.min(1200, swipeVelocity * 0.4)));
    }
    touchStartRef.current = null;
    setIsTouching(false);
  };

  return (
    <div className="mx-auto mt-4 w-full overflow-hidden sm:w-[92%] md:w-[86%] lg:w-4/5 xl:w-3/4">
      <div
        className={`skill-marquee${isTouching || isHovered || isFocused ? " is-touching" : ""}`}
        role="group"
        aria-label={`${label} carousel. Scroll horizontally to change its speed. Focus or touch to pause.`}
        aria-roledescription="carousel"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartRef.current = null;
          setIsTouching(false);
        }}
      >
        <div ref={trackRef} className="skill-track inline-flex items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              ref={copy === 0 ? firstSetRef : undefined}
              className="skill-track-set inline-flex items-center"
              aria-hidden={copy === 1}
            >
              {items.map((item) => {
                const skill = typeof item === "string" ? item : item.name;
                const icon = typeof item === "string" ? undefined : item.icon;

                return (
                  <span
                    key={skill}
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
          ))}
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
