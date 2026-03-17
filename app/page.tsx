import type { Metadata } from "next";
import { HomePageContent } from "@/components/home-page-content";

export const metadata: Metadata = {
  title: "BbalRang Tools | JSON Formatter, JWT Decoder, Regex Tester",
  description:
    "Fast browser-based developer tools for JSON formatting, JWT decoding, regex testing, UUID generation, text diff checks, Base64, and URL encoding.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Developer Tools Online | BbalRang Tools",
    description:
      "Use fast online developer tools for JSON, JWT, regex, UUIDs, text diff, Base64, and URL encoding.",
    url: "/"
  }
};

export default function HomePage() {
  return <HomePageContent />;
}


