import Link from "next/link";
import Image from "next/image";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { ArrowUpRight, Eye } from "lucide-react";
import { getProjectPageviews } from "@/util/project-pageviews";

export const revalidate = 60;
export default async function ProjectsPage() {
  const views = await getProjectPageviews(allProjects.map((project) => project.slug));

  const featured = allProjects.find((project) => project.slug === "unkey")!;
  const top2 = allProjects.find((project) => project.slug === "planetfall")!;
  const top3 = allProjects.find((project) => project.slug === "highstorm")!;
  const topOverrides: Record<string, { title?: string; external?: string }> = {
    unkey: { title: "MedLog LMS", external: "https://medloglms.vercel.app" },
    planetfall: { title: "Luna: a music player", external: "https://luna.vercel.app" },
    highstorm: { title: "Health Care manager", external: "https://hospital.vercel.app" },
  };
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <>
      <Navigation />
      <div className="projects-page-enter relative isolate z-0 pb-16">
        <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 pt-20 lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-[var(--text-soft)]">
            Some of the projects are from work and some are on my own time.
          </p>
        </div>
        <div className="w-full h-px bg-[var(--border)]" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card themeAware>
            {topOverrides[featured.slug]?.external ? (
              <a
                href={topOverrides[featured.slug]!.external}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <article className="relative isolate min-h-[360px] overflow-hidden">
                  <Image
                    src="/medlog.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="scale-110 object-cover opacity-25 mix-blend-screen blur-[2px] transition duration-700 group-hover:scale-[1.15]"
                  />
                  <div className="project-image-overlay absolute inset-0" />
                  <div className="absolute right-3 top-10 h-20 w-20 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/50 p-3 backdrop-blur-[10px] sm:right-6 sm:top-8 sm:h-[6.5rem] sm:w-[6.5rem]">
                    <Image
                      src="/medlog.png"
                      alt="MedLog logo"
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 160px, 208px"
                      className="rounded-[10px] object-contain opacity-50 mix-blend-screen drop-shadow-2xl"
                    />
                  </div>
                  <div className="relative z-10 flex min-h-[360px] flex-col p-4 md:p-8">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-[var(--project-feature-soft)]">
                        {featured.date ? (
                          <time dateTime={new Date(featured.date).toISOString()}>
                            {Intl.DateTimeFormat(undefined, {
                              dateStyle: "medium",
                            }).format(new Date(featured.date))}
                          </time>
                        ) : (
                          <span>SOON</span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-[var(--project-feature-soft)]">
                        <Eye className="w-2 h-2" />{" "}
                        {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                          views[featured.slug] ?? 0,
                        )}
                      </span>
                    </div>
                    <div className="mt-auto max-w-xs">
                      <h2
                        id="featured-post"
                        className="text-3xl font-bold text-[var(--project-feature-text)] sm:text-4xl font-display"
                      >
                        {topOverrides[featured.slug]?.title ?? featured.title}
                      </h2>
                      <p className="mt-3 leading-7 text-[var(--project-feature-soft)]">
                        {featured.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--project-feature-text)]">
                        Visit MedLog LMS
                        <ArrowUpRight className="h-2 w-2" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            ) : (
              <Link href={`/projects/${featured.slug}`}>
                <article className="relative w-full h-full p-4 md:p-8">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-[var(--text-soft)]">
                      {featured.date ? (
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(featured.date))}
                        </time>
                      ) : (
                        <span>SOON</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                      <Eye className="w-2 h-2" />{" "}
                      {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                        views[featured.slug] ?? 0,
                      )}
                    </span>
                  </div>

                  <h2
                    id="featured-post"
                    className="mt-4 text-3xl font-bold text-[var(--text)] group-hover:text-[var(--text)] sm:text-4xl font-display"
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-8 duration-150 text-[var(--text-soft)] group-hover:text-[var(--text)]">
                    {featured.description}
                  </p>
                  <div className="absolute bottom-4 md:bottom-8">
                    <p className="hidden text-[var(--text)] hover:text-[var(--text-soft)] lg:block">
                      Read more <span aria-hidden="true">→</span>
                    </p>
                  </div>
                </article>
              </Link>
            )}
          </Card>

          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((project) => (
              <Card key={project.slug} themeAware>
                <Article
                  project={{ ...project, title: topOverrides[project.slug]?.title ?? project.title }}
                  views={views[project.slug] ?? 0}
                  externalHref={topOverrides[project.slug]?.external}
                />
              </Card>
            ))}
          </div>
        </div>
        <div className="hidden w-full h-px md:block bg-[var(--border)]" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug} themeAware>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug} themeAware>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug} themeAware>
                  <Article project={project} views={views[project.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
