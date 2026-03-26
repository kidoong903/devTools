"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getGuideArticles } from "@/lib/guide-articles";

export function GuidesPageContent() {
  const { locale } = useLanguage();
  const guides = getGuideArticles(locale);

  return (
    <div className="page-wrap">
      <section className="hero hero-compact">
        <div className="hero-copy">
          <p className="eyebrow">Guides</p>
          <h1>Practical guides that explain when and how to use each tool</h1>
          <p className="hero-text">
            Use these short guides to understand common developer tasks such as
            formatting JSON, checking JWT claims, and testing regular expressions.
          </p>
        </div>
      </section>

      <section className="section-block guide-index-section">
        <div className="guide-article-grid">
          {guides.map((guide) => (
            <article key={guide.slug} className="guide-article-card">
              <p className="eyebrow">Guide</p>
              <h2>{guide.title}</h2>
              <p>{guide.summary}</p>
              <Link href={`/guides/${guide.slug}`}>Read guide</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}