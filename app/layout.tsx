import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { SiteFooter } from "./components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Avalon Enterprises",
    template: "%s | Avalon Enterprises",
  },
  description: "Avalon Enterprises - Portfolio & Projects", // Kontora Black  Madani Arabic Semi Bold
  openGraph: {
    title: "Avalon Enterprises",
    description:
      "Avalon Enterprises - Portfolio & Projects",
    url: "https://defaultfolio.com", //"https://chronark.com",
    siteName: "Avalon Enterprises",
    images: [
      {
        url: "/public/og-avalon-enterprises.png", //"https://chronark.com/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Avalon Enterprises",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`flex min-h-screen flex-col bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <div className="flex flex-1 flex-col pb-20">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
