export const LOCALES = ['en', 'ru', 'hy'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** A label/value pair, e.g. a technical spec line. */
export type Spec = readonly [label: string, value: string];

export interface FeatureCopy {
  kicker: string;
  title: string;
  lead: string;
  body: string;
  specs: readonly Spec[];
}

export interface ProductLineCopy {
  name: string;
  description: string;
}

/**
 * Every locale must implement this shape, so a missing translation is a compile error.
 * Strings may contain **bold** markers, rendered by `richText()`.
 */
export interface Dictionary {
  meta: { title: string; description: string; ogLocale: string };
  a11y: { skip: string; openMenu: string; closeMenu: string; language: string; home: string };
  nav: {
    about: string;
    blend: string;
    production: string;
    specs: string;
    partner: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageAlt: string;
  };
  stats: readonly { value: string; label: string }[];
  about: {
    kicker: string;
    title: string;
    body: string;
    points: readonly string[];
    imageAlt: string;
    linesTitle: string;
    format: string;
    tar: string;
    nicotine: string;
    exclusive: ProductLineCopy;
    black: ProductLineCopy;
  };
  blend: FeatureCopy & { imageAlt: string };
  paper: FeatureCopy & { imageAlt: string };
  filters: FeatureCopy & { imageAlt: string };
  manufacturing: FeatureCopy & { imageAlt: string };
  packaging: FeatureCopy & { imageAlt: string };
  specs: {
    kicker: string;
    title: string;
    parameter: string;
    specification: string;
    rows: readonly Spec[];
    note: string;
    imageAlt: string;
  };
  ritual: { title: string; body: readonly string[]; imageAlt: string };
  partner: {
    kicker: string;
    title: string;
    lead: string;
    body: readonly string[];
    imageAlt: string;
    emailLabel: string;
    webLabel: string;
    form: {
      title: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      country: string;
      partnerType: string;
      partnerTypes: readonly { value: string; label: string }[];
      message: string;
      messagePlaceholder: string;
      consent: string;
      submit: string;
      sending: string;
      success: string;
      errorGeneric: string;
      errorUnavailable: string;
      errorValidation: string;
      required: string;
    };
  };
  ageGate: {
    title: string;
    question: string;
    confirm: string;
    deny: string;
    denied: string;
    note: string;
  };
  footer: {
    warning: string;
    tagline: string;
    rights: string;
    privacy: string;
    legal: string;
  };
  privacy: {
    title: string;
    updated: string;
    sections: readonly { heading: string; body: string }[];
  };
  notFound: { title: string; body: string; back: string };
}
