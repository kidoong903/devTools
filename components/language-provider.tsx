"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { localeOptions, messages, type Locale, type MessageKey } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => (typeof messages)["en"][MessageKey];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("bbalrang-tools-locale") as Locale | null;
    if (stored && localeOptions.some((option) => option.code === stored)) {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);
    window.localStorage.setItem("bbalrang-tools-locale", nextLocale);
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      locale,
      setLocale,
      t: (key) => messages[locale][key]
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

