"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { getGuideBySlug } from "@/lib/guide-articles";
import { getLocalizedToolText } from "@/lib/i18n";

export function GuidePageContent({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const article = getGuideBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <div className="page-wrap">
      <section className="tool-topbar">
        <div>
          <p className="eyebrow">Guide</p>
          <h1>{article.title}</h1>
          <p className="tool-subtitle">{article.description}</p>
        </div>
        <Link href="/guides" className="button-secondary">
          All guides
        </Link>
      </section>

      <article className="section-block article-shell">
        <p className="article-summary">{article.summary}</p>

        {article.intro.map((paragraph) => (
          <p key={paragraph} className="article-paragraph">
            {paragraph}
          </p>
        ))}

        {article.sections.map((section) => (
          <section key={section.title} className="article-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="article-paragraph">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="article-bullets">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>

      <section className="section-block related-guides-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Related tools</p>
            <h2>Tools to use with this guide</h2>
          </div>
        </div>
        <div className="tool-card-grid compact-tool-grid">
          {article.relatedTools.map((toolSlug) => {
            const localized = getLocalizedToolText(locale, toolSlug);

            return (
              <article className="tool-card" key={toolSlug}>
                <h3>{localized?.name ?? toolSlug}</h3>
                <p>{localized?.shortDescription ?? ""}</p>
                <Link href={`/tools/${toolSlug}`}>Open tool</Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}