import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { contactSchema } from "./contact-schema";

const RESEND_API_URL = "https://api.resend.com/emails";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Save to messages table
    const { error: dbError } = await supabaseAdmin.from("messages").insert({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (dbError) {
      console.error("Failed to save message:", dbError);
      throw new Error("Could not save your message. Please try again.");
    }

    // 2. Notify you by email (Resend). Messages always land in Supabase `messages` above.
    const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
    const contactTo = process.env.CONTACT_TO_EMAIL?.trim();

    if (!RESEND_API_KEY || !contactTo) {
      console.warn(
        "Email skipped: set RESEND_API_KEY and CONTACT_TO_EMAIL in .env (message still saved in database)."
      );
      return { ok: true, emailed: false, emailError: "Missing RESEND_API_KEY or CONTACT_TO_EMAIL on server." };
    }

    const from =
      process.env.RESEND_FROM?.trim() || "Portfolio <onboarding@resend.dev>";

    try {
      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from,
          to: [contactTo],
          reply_to: [data.email],
          subject: `New portfolio message from ${data.name}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px">
              <h2 style="margin:0 0 16px;color:#22d3ee">New contact form submission</h2>
              <p style="margin:0 0 8px"><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
              <hr style="border:none;border-top:1px solid #334155;margin:16px 0"/>
              <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(data.message)}</p>
            </div>
          `,
        }),
      });

      const bodyText = await res.text();

      if (!res.ok) {
        let detail = bodyText;
        try {
          const parsed = JSON.parse(bodyText) as { message?: string };
          if (parsed?.message) detail = parsed.message;
        } catch {
          /* keep raw body */
        }
        console.error(`Resend error [${res.status}]:`, bodyText);
        return { ok: true, emailed: false, emailError: detail };
      }
      return { ok: true, emailed: true };
    } catch (err) {
      console.error("Resend request failed:", err);
      return {
        ok: true,
        emailed: false,
        emailError: err instanceof Error ? err.message : "Resend request failed",
      };
    }
  });

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
