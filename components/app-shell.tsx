"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand">
          BbalRang Tools
        </Link>
        <div className="header-controls">
          <nav className="top-nav" aria-label="Primary">
            <Link href="/#tools">{String(t("navTools"))}</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/about">{String(t("navAbout"))}</Link>
            <Link href="/contact">{String(t("navContact"))}</Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>{String(t("footerRuns"))}</p>
        <div className="footer-links">
          <Link href="/guides">Guides</Link>
          <Link href="/privacy">{String(t("navPrivacy"))}</Link>
          <Link href="/about">{String(t("navAbout"))}</Link>
          <Link href="/contact">{String(t("navContact"))}</Link>
        </div>
      </footer>
    </div>
  );
}