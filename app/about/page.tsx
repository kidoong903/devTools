import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about BbalRang Tools and how the site works."
};

export default function AboutPage() {
  return <StaticPageContent kind="about" />;
}

