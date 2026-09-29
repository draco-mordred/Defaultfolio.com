import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "github.com",
				pathname: "/draco-mordred.png",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/u/49540006",
			},
		],
	},
	experimental: {
		mdxRs: true,
	},
};

export default withContentlayer(nextConfig);
