"use client";

import { useLanguage } from "@/components/language-provider";

type StaticPageKind = "about" | "contact" | "privacy";

type StaticPageContentProps = {
  kind: StaticPageKind;
};

type StaticPageCopy = {
  eyebrow: string;
  title: string;
  body: string[];
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@bbalrang.com";

const sharedCopy: Record<StaticPageKind, StaticPageCopy> = {
  about: {
    eyebrow: "About",
    title: "About BbalRang Tools",
    body: [
      "BbalRang Tools is a browser-based collection of developer utilities built for everyday debugging and formatting work.",
      "The site focuses on practical tools such as JSON formatting, JWT inspection, regex testing, UUID generation, and text comparison.",
      "In addition to the tools themselves, BbalRang Tools also publishes short guides that explain when to use each tool, what common mistakes to watch for, and how to work with real development inputs more safely."
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact",
    body: [
      `For site-related questions, policy issues, or correction requests, you can contact ${contactEmail}.`,
      "This address is intended for website administration and content-related requests rather than product support for third-party services."
    ]
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    body: [
      "This site does not directly collect personal information such as names, email addresses, or account details.",
      "Most tool inputs are processed in your browser. Basic technical data such as access logs, cookies, or advertising-related data may be handled by hosting, analytics, or advertising services.",
      "If Google AdSense or similar services are used, they may use cookies or similar technologies according to their own policies."
    ]
  }
};

const pageCopy = {
  en: sharedCopy,
  ko: sharedCopy,
  ch: sharedCopy,
  jp: sharedCopy
};

export function StaticPageContent({ kind }: StaticPageContentProps) {
  const { locale } = useLanguage();
  const content = pageCopy[locale][kind];

  return (
    <div className="page-wrap">
      <section className="section-block static-page">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}