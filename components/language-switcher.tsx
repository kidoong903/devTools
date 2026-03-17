"use client";

import { localeOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="language-switcher" aria-label="Language switcher">
      {localeOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          className={locale === option.code ? "active" : ""}
          onClick={() => setLocale(option.code)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
