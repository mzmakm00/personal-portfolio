import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { submitContact } from "@/lib/contact.functions";
import { contactSchema } from "@/lib/contact-schema";
import { MagneticButton } from "./magnetic-button";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const submit = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const validateField = (field: keyof typeof form, value: string) => {
    const result = contactSchema.shape[field].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) validateField(field, value);
  };

  const onBlur = (field: keyof typeof form) => () => validateField(field, form[field]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setStatus("submitting");
    try {
      await submit({ data: parsed.data });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl border border-border bg-card/60 p-8 backdrop-blur-sm md:p-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 text-2xl font-semibold text-foreground">Message received</h3>
            <p className="mt-2 text-sm text-muted-foreground">Thanks for reaching out — I'll reply within a day or two.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-xs font-medium text-primary hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            className="space-y-5"
            noValidate
          >
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                onBlur={onBlur("name")}
                maxLength={80}
                className={inputClass(errors.name)}
                placeholder="Ada Lovelace"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                onBlur={onBlur("email")}
                maxLength={160}
                className={inputClass(errors.email)}
                placeholder="ada@example.com"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                rows={5}
                value={form.message}
                onChange={onChange("message")}
                onBlur={onBlur("message")}
                maxLength={2000}
                className={inputClass(errors.message) + " resize-none"}
                placeholder="Tell me about your project…"
              />
            </Field>

            {serverError && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {serverError}
              </p>
            )}

            <div className="flex justify-center pt-2">
              <MagneticButton type="submit">
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <Send className="h-4 w-4" />
                  </>
                )}
              </MagneticButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-destructive"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function inputClass(hasError?: string) {
  return (
    "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 " +
    (hasError ? "border-destructive/60" : "border-border")
  );
}
