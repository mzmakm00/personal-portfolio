import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema } from "./contact-schema";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Save to messages table
    const { error: dbError } = await supabase.from("messages").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (dbError) {
      console.error("Failed to save message:", dbError);
      throw new Error("Could not save your message. Please try again.");
    }

    // 2. Send email via Resend (gateway)
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.warn("Resend env vars missing — message saved but email skipped");
      return { ok: true, emailed: false };
    }

    try {
      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: ["delivered@resend.dev"],
          reply_to: data.email,
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

      if (!res.ok) {
        const body = await res.text();
        console.error(`Resend error [${res.status}]:`, body);
        return { ok: true, emailed: false };
      }
      return { ok: true, emailed: true };
    } catch (err) {
      console.error("Resend request failed:", err);
      return { ok: true, emailed: false };
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
