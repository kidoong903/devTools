import Script from "next/script";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bbalrang.com";
const adsenseClient = "ca-pub-7692188291867192";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BbalRang Tools | Developer Utilities Online",
    template: "%s | BbalRang Tools"
  },
  description:
    "Browser-based developer utilities for formatting JSON, decoding JWTs, testing regex, generating UUIDs, comparing text, encoding Base64, and URL conversion.",
  keywords: [
    "developer tools",
    "json formatter",
    "jwt decoder",
    "regex tester",
    "uuid generator",
    "text diff checker",
    "base64 encode decode",
    "url encode decode"
  ],
  openGraph: {
    title: "BbalRang Tools | Developer Utilities Online",
    description:
      "Browser-based developer utilities for JSON, JWT, regex, UUIDs, text diff, Base64, and URL encoding.",
    url: siteUrl,
    siteName: "BbalRang Tools",
    type: "website"
  },
  other: {
    "google-adsense-account": adsenseClient
  },
  twitter: {
    card: "summary_large_image",
    title: "BbalRang Tools | Developer Utilities Online",
    description:
      "Fast online developer utilities for JSON, JWT, regex, UUIDs, text diff, Base64, and URL encoding."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
