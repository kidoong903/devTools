import type { Metadata } from "next";
import { HomePageContent } from "@/components/home-page-content";

export const metadata: Metadata = {
  title: "BbalRang Tools | Developer Tools and Practical Guides",
  description:
    "Fast browser-based developer tools with practical guides for JSON formatting, JWT decoding, regex testing, UUID generation, text diff checks, Base64, and URL encoding.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "BbalRang Tools | Developer Tools Online",
    description:
      "Use fast online developer tools for JSON, JWT, regex, UUIDs, text diff, Base64, and URL encoding, with practical guides for common tasks.",
    url: "/"
  }
};

export default function HomePage() {
  return <HomePageContent />;
}