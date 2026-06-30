import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { en } from './en';
import { uz } from './uz';

type Locale = 'en' | 'uz';

const locales: Record<Locale, Record<string, unknown>> = { en, uz };

function resolve(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback(
    (path: string): string => {
      const v = resolve(locales[locale], path);
      if (v !== undefined) return v;
      const fallback = resolve(locales.en, path);
      return fallback ?? path;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
