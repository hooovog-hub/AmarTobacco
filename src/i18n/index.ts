import en from './locales/en';
import ru from './locales/ru';
import hy from './locales/hy';
import { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale } from './types';

export { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale };

export const dictionaries: Record<Locale, Dictionary> = { en, ru, hy };

/** Native names shown in the language switcher. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  ru: { short: 'RU', name: 'Русский' },
  hy: { short: 'HY', name: 'Հայերեն' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: string | undefined): Dictionary {
  return dictionaries[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

/** Builds a locale-aware path. The default locale has no prefix: `/`, `/ru/`, `/hy/privacy`. */
export function localizePath(locale: Locale, path = '/'): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return clean ? `${prefix}/${clean}` : `${prefix}/`;
}

/** Strips a locale prefix from a pathname, e.g. `/ru/privacy` → `/privacy`. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (isLocale(first)) return `/${rest.join('/')}`;
  return pathname || '/';
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes a translation string and turns `**bold**` markers into <strong>. */
export function richText(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
