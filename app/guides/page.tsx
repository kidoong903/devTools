import type { Metadata } from "next";
import { GuidesPageContent } from "@/components/guides-page-content";

export const metadata: Metadata = {
  title: "Developer Guides | JSON, JWT, and Regex Help",
  description:
    "Practical developer guides for formatting JSON, reading JWT claims, and understanding regex flags and common debugging patterns.",
  alternates: {
    canonical: "/guides"
  },
  openGraph: {
    title: "Developer Guides | BbalRang Tools",
    description:
      "Short, practical guides for common developer tasks such as JSON formatting, JWT debugging, and regex testing.",
    url: "/guides"
  }
};

export default function GuidesPage() {
  return <GuidesPageContent />;
}