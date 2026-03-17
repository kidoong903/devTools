"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getFeaturedTools, getOrderedTools } from "@/lib/tool-definitions";
import { getLocalizedToolText } from "@/lib/i18n";

export function HomePageContent() {
  const { locale, t } = useLanguage();
  const featuredTools = getFeaturedTools();
  const allTools = getOrderedTools();
  const secondaryTools = allTools.filter((tool) => !tool.featured);

  return (
    <div className="page-wrap">
      <section className="hero hero-compact">
        <div className="hero-copy">
          <p className="eyebrow">{String(t("heroEyebrow"))}</p>
          <h1>{String(t("heroTitle"))}</h1>
          <p className="hero-text">{String(t("heroBody"))}</p>
        </div>
        <div className="hero-strip">
          {(t("heroPills") as string[]).map((pill) => (
            <span key={pill}>{pill}</span>
          ))}
        </div>
      </section>

      <section id="tools" className="section-block home-section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">{String(t("popularEyebrow"))}</p>
            <h2>{String(t("popularTitle"))}</h2>
            <p>{String(t("popularBody"))}</p>
          </div>
        </div>
        <div className="featured-tool-grid">
          {featuredTools.map((tool) => {
            const localized = getLocalizedToolText(locale, tool.slug);

            return (
              <article className="tool-card featured-tool-card" key={tool.slug}>
                <div className="tool-card-top">
                  <span className="tool-badge">{String(t("popularBadge"))}</span>
                  <h3>{localized?.name ?? tool.name}</h3>
                </div>
                <p>{localized?.shortDescription ?? tool.shortDescription}</p>
                <div className="tool-card-actions">
                  <Link href={`/tools/${tool.slug}`}>{String(t("openTool"))}</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block home-section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">{String(t("allToolsEyebrow"))}</p>
            <h2>{String(t("allToolsTitle"))}</h2>
            <p>{String(t("allToolsBody"))}</p>
          </div>
        </div>
        <div className="tool-card-grid compact-tool-grid">
          {secondaryTools.map((tool) => {
            const localized = getLocalizedToolText(locale, tool.slug);

            return (
              <article className="tool-card" key={tool.slug}>
                <h3>{localized?.name ?? tool.name}</h3>
                <p>{localized?.shortDescription ?? tool.shortDescription}</p>
                <Link href={`/tools/${tool.slug}`}>{String(t("openTool"))}</Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
