/** Brand-wide constants used across pages, SEO and the contact endpoint. */
export const SITE = {
  name: 'AMAR',
  legalName: 'AMAR Tobacco',
  url: 'https://amartobacco.com',
  email: 'amartobacco.arm@gmail.com',
  /** Minimum legal age shown on the age gate. */
  minAge: 18,
  /** localStorage key that remembers a confirmed age check. */
  ageStorageKey: 'amar-age-verified',
  /** How long (days) an age confirmation is remembered. */
  ageRememberDays: 30,
} as const;

/** In-page anchors, shared by the header navigation and the sections. */
export const SECTION_IDS = {
  about: 'about',
  blend: 'blend',
  paper: 'paper',
  filters: 'filters',
  manufacturing: 'manufacturing',
  packaging: 'packaging',
  specs: 'specifications',
  ritual: 'ritual',
  partner: 'partner',
} as const;
