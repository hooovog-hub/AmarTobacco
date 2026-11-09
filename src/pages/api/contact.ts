import type { APIRoute } from 'astro';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { buildInquiryEmail, validateContact } from '@/lib/contact';

// Runs as a Vercel serverless function; every other route is pre-rendered.
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: Record<string, unknown>;
  try {
    const type = request.headers.get('content-type') ?? '';
    raw = type.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return json({ ok: false, reason: 'bad_request' }, 400);
  }

  const result = validateContact(raw);
  // Pretend success to bots so they don't retry.
  if (!result.ok && 'spam' in result) return json({ ok: true });
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);

  if (!RESEND_API_KEY) {
    console.warn('[contact] RESEND_API_KEY is not set — inquiry not sent.');
    return json({ ok: false, reason: 'unavailable' }, 503);
  }

  const { subject, text, html } = buildInquiryEmail(result.data);
  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: result.data.email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('[contact] Resend error:', error);
      return json({ ok: false, reason: 'send_failed' }, 502);
    }
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return json({ ok: false, reason: 'send_failed' }, 502);
  }

  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ ok: false, reason: 'method_not_allowed' }, 405);
