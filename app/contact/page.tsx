import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for BbalRang Tools."
};

export default function ContactPage() {
  return <StaticPageContent kind="contact" />;
}

