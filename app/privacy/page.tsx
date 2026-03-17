import type { Metadata } from "next";
import { StaticPageContent } from "@/components/static-page-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for BbalRang Tools."
};

export default function PrivacyPage() {
  return <StaticPageContent kind="privacy" />;
}

