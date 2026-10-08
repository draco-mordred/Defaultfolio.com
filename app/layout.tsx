import "../global.css";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { SiteFooter } from "./components/site-footer";

var name = "Israel Oladele"

export const metadata: Metadata = {
  title: {
    default: name,
    template: `%s | ${name}`,
  },
  description: `${name} — Full-stack Developer, AI evaluator, medical student, and creative technologist.`,
  openGraph: {
    title: name,
    description: `${name} — AI evaluator, medical student, and creative technologist.`,
    url: "https://defaultfolio.com",
    siteName: "Israel Oladele",
    images: [
      {
        url: "/og.png",
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
    title: "Israel Oladele",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
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
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={[calSans.variable, "font-sans"].join(" ")}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme');
                const preferredTheme = storedTheme || 'dark';
                document.documentElement.setAttribute('data-theme', preferredTheme);
              } catch (e) {}
            `,
          }}
        />
        <Analytics />
      </head>
      <body
        className={`flex min-h-screen flex-col bg-[var(--bg)] font-sans antialiased ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
