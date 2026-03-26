"use client";

import Link from "next/link";
import { ToolClient } from "@/components/tool-client";
import { useLanguage } from "@/components/language-provider";
import { getGuidesForTool } from "@/lib/guide-articles";
import type { ToolDefinition } from "@/lib/tool-definitions";
import { getLocalizedToolText } from "@/lib/i18n";
import { getToolGuide } from "@/lib/tool-guides";

export function ToolPageContent({ tool }: { tool: ToolDefinition }) {
  const { locale, t } = useLanguage();
  const localized = getLocalizedToolText(locale, tool.slug);
  const guide = getToolGuide(tool.kind, locale);
  const relatedGuides = getGuidesForTool(tool.slug, locale);
  const faqTitle = locale === "ko" ? "FAQ" : "FAQ";

  return (
    <div className="page-wrap">
      <section className="tool-topbar">
        <div>
          <p className="eyebrow">{String(t("toolLabel"))}</p>
          <h1>{localized?.name ?? tool.name}</h1>
          <p className="tool-subtitle">
            {localized?.shortDescription ?? tool.shortDescription}
          </p>
        </div>
        <Link href="/" className="button-secondary">
          {String(t("allTools"))}
        </Link>
      </section>

      <section className="section-block guide-section">
        <div className="guide-grid">
          {guide.sections.map((section) => (
            <article key={section.title} className="guide-card">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="guide-faq-card">
          <h3>{faqTitle}</h3>
          <div className="guide-faq-list">
            {guide.faqs.map((faq) => (
              <article key={faq.question} className="guide-faq-item">
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedGuides.length ? (
        <section className="section-block related-guides-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Related guides</p>
              <h2>Practical reading for this tool</h2>
            </div>
          </div>
          <div className="guide-article-grid">
            {relatedGuides.map((article) => (
              <article key={article.slug} className="guide-article-card">
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <Link href={`/guides/${article.slug}`}>Read guide</Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <ToolClient tool={tool} />
    </div>
  );
}