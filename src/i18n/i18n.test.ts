import { describe, expect, it } from 'vitest';
import { dictionaries, localizePath, richText, stripLocale } from './index';
import { PARTNER_TYPES } from '../lib/contact';

type Tree = string | number | boolean | Tree[] | { [k: string]: Tree };

/** Flattens a dictionary into `path -> value` pairs, including array shapes. */
function flatten(node: Tree, prefix = ''): Record<string, string> {
  if (typeof node !== 'object' || node === null) return { [prefix]: String(node) };
  return Object.entries(node).reduce<Record<string, string>>(
    (acc, [k, v]) => ({ ...acc, ...flatten(v as Tree, prefix ? `${prefix}.${k}` : k) }),
    {},
  );
}

const en = flatten(dictionaries.en as unknown as Tree);

describe.each(Object.entries(dictionaries))('dictionary "%s"', (_locale, dict) => {
  const flat = flatten(dict as unknown as Tree);

  it('has exactly the same keys as English (including list lengths)', () => {
    expect(Object.keys(flat).sort()).toEqual(Object.keys(en).sort());
  });

  it('has no empty strings', () => {
    const empty = Object.entries(flat).filter(([, v]) => v.trim() === '');
    expect(empty).toEqual([]);
  });

  it('offers every partner type the API accepts', () => {
    expect(dict.partner.form.partnerTypes.map((t) => t.value)).toEqual([...PARTNER_TYPES]);
  });
});

describe('locale helpers', () => {
  it('builds paths without a prefix for the default locale', () => {
    expect(localizePath('en')).toBe('/');
    expect(localizePath('en', '/privacy')).toBe('/privacy');
    expect(localizePath('ru')).toBe('/ru/');
    expect(localizePath('hy', 'privacy/')).toBe('/hy/privacy');
  });

  it('strips locale prefixes', () => {
    expect(stripLocale('/ru/privacy')).toBe('/privacy');
    expect(stripLocale('/hy/')).toBe('/');
    expect(stripLocale('/privacy')).toBe('/privacy');
  });

  it('escapes HTML and renders bold markers', () => {
    expect(richText('<b>x</b> **AMAR**')).toBe('&lt;b&gt;x&lt;/b&gt; <strong>AMAR</strong>');
  });
});
