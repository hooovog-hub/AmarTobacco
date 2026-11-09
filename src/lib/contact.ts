/** Partner inquiry validation, shared by the API route and unit tests. */

export const PARTNER_TYPES = ['importer', 'distributor', 'retailer', 'other'] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export interface ContactInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  partnerType: PartnerType;
  message: string;
  locale: string;
}

export type ContactField = keyof Omit<ContactInput, 'locale'> | 'consent';

export type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactField[] }
  | { ok: false; spam: true };

const LIMITS = { name: 120, company: 160, email: 200, phone: 40, country: 80, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/;
/** Submissions faster than this after page load are almost certainly bots. */
export const MIN_FILL_MS = 2500;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * Validates a raw form payload. `website` is a honeypot field that real users never see,
 * and `startedAt` is the timestamp the form was rendered (ms since epoch).
 */
export function validateContact(raw: Record<string, unknown>, now = Date.now()): ValidationResult {
  if (str(raw.website)) return { ok: false, spam: true };
  const startedAt = Number(raw.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < MIN_FILL_MS) {
    return { ok: false, spam: true };
  }

  const data = {
    name: str(raw.name),
    company: str(raw.company),
    email: str(raw.email).toLowerCase(),
    phone: str(raw.phone),
    country: str(raw.country),
    partnerType: str(raw.partnerType) as PartnerType,
    message: str(raw.message),
    locale: str(raw.locale) || 'en',
  };

  const errors: ContactField[] = [];
  if (data.name.length < 2 || data.name.length > LIMITS.name) errors.push('name');
  if (data.company.length < 2 || data.company.length > LIMITS.company) errors.push('company');
  if (!EMAIL_RE.test(data.email) || data.email.length > LIMITS.email) errors.push('email');
  if (data.phone && (!PHONE_RE.test(data.phone) || data.phone.length > LIMITS.phone)) {
    errors.push('phone');
  }
  if (data.country.length < 2 || data.country.length > LIMITS.country) errors.push('country');
  if (!PARTNER_TYPES.includes(data.partnerType)) errors.push('partnerType');
  if (data.message.length < 10 || data.message.length > LIMITS.message) errors.push('message');
  const consent = raw.consent;
  if (!(consent === true || consent === 'on' || consent === 'true')) errors.push('consent');

  return errors.length ? { ok: false, errors } : { ok: true, data };
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Builds the notification email sent to the AMAR team. */
export function buildInquiryEmail(d: ContactInput) {
  const rows: [string, string][] = [
    ['Name', d.name],
    ['Company', d.company],
    ['Email', d.email],
    ['Phone', d.phone || '—'],
    ['Country / market', d.country],
    ['Partner type', d.partnerType],
    ['Site language', d.locale],
  ];
  const subject = `AMAR partner inquiry — ${d.company} (${d.country})`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${d.message}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;max-width:600px">
      <h2 style="color:#e3101b;margin:0 0 16px">New partner inquiry</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:20px 0 6px;color:#666">Message</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(d.message)}</p>
    </div>`;
  return { subject, text, html };
}
