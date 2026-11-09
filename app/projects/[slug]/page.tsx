import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { getProjectPageviews } from "@/util/project-pageviews";

export const revalidate = 60;

const LUNA_SCREENSHOTS = [
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/tracks.png",
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/albums.png",
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/lyrics-synced.png",
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/album-tracklist.png",
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/nowplaying-mobile.png",
  "https://raw.githubusercontent.com/draco-mordred/Luna/main/screenshots/tracks-mobile.png",
];

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  const pageviews = await getProjectPageviews([slug]);
  const views = pageviews[slug] ?? 0;

  const backgroundImages =
    project.repository === "draco-mordred/Luna" ? LUNA_SCREENSHOTS : undefined;

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <Header
        project={project}
        views={views}
        backgroundImages={backgroundImages}
      />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}
