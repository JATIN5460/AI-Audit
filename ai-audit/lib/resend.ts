import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

export async function sendAuditConfirmation(
  to: string,
  slug: string,
  monthlySavings: number
) {
  const isHighSavings = monthlySavings > 500;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your AI Spend Audit Report",
    html: `
      <h2>Your audit is ready</h2>
      <p>We found <strong>$${monthlySavings}/mo</strong> in potential savings.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${slug}">View your full report →</a></p>
      ${
        isHighSavings
          ? `<p>Because your savings opportunity exceeds $500/mo, a Credex advisor will reach out shortly to help you capture that savings through discounted AI credits.</p>`
          : ""
      }
      <hr/>
      <small>Credex · credex.rocks</small>
    `,
  });
}