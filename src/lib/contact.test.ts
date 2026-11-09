import { describe, expect, it } from 'vitest';
import { buildInquiryEmail, MIN_FILL_MS, validateContact } from './contact';

const NOW = 1_800_000_000_000;
const valid = {
  name: 'Anna Petrosyan',
  company: 'Global Trade LLC',
  email: 'Anna@Example.com ',
  phone: '+374 91 123456',
  country: 'Armenia',
  partnerType: 'distributor',
  message: 'We would like to discuss pricing and MOQ for 2027.',
  consent: 'on',
  locale: 'hy',
  startedAt: String(NOW - 10_000),
};

describe('validateContact', () => {
  it('accepts a valid inquiry and normalizes fields', () => {
    const r = validateContact(valid, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.email).toBe('anna@example.com');
      expect(r.data.locale).toBe('hy');
    }
  });

  it('allows an empty phone number', () => {
    expect(validateContact({ ...valid, phone: '' }, NOW).ok).toBe(true);
  });

  it('reports every invalid field', () => {
    const r = validateContact(
      {
        ...valid,
        name: 'A',
        email: 'nope',
        partnerType: 'hacker',
        message: 'hi',
        consent: undefined,
      },
      NOW,
    );
    expect(r).toEqual({
      ok: false,
      errors: ['name', 'email', 'partnerType', 'message', 'consent'],
    });
  });

  it('flags the honeypot as spam', () => {
    expect(validateContact({ ...valid, website: 'http://spam' }, NOW)).toEqual({
      ok: false,
      spam: true,
    });
  });

  it('flags submissions that are too fast as spam', () => {
    const r = validateContact({ ...valid, startedAt: String(NOW - MIN_FILL_MS + 100) }, NOW);
    expect(r).toEqual({ ok: false, spam: true });
  });
});

describe('buildInquiryEmail', () => {
  it('escapes user input in the HTML body', () => {
    const r = validateContact({ ...valid, message: '<script>alert(1)</script> hello there' }, NOW);
    if (!r.ok) throw new Error('expected valid');
    const email = buildInquiryEmail(r.data);
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.subject).toContain('Global Trade LLC');
  });
});
