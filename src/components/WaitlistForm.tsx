import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Captura de correos para la preventa. Por ahora guarda en localStorage como
 * stub — el guardado real (Cloudflare KV/D1 o un servicio tipo Formspree) se
 * conecta en un paso aparte. Cambia `submitWaitlist` por la llamada real.
 */
async function submitWaitlist(email: string) {
  // TODO(preventa): POST a un endpoint real (Cloudflare Worker -> KV/D1) o Formspree.
  try {
    const key = "beadstudio-waitlist";
    const prev: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!prev.includes(email)) prev.push(email);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {
    /* ignore */
  }
}

export default function WaitlistForm({
  variant = "paper",
  source = "hero",
  stack = false,
}: {
  variant?: "paper" | "onColor";
  source?: string;
  stack?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Escribe un correo válido");
      return;
    }
    setError("");
    setBusy(true);
    await submitWaitlist(value);
    setBusy(false);
    setDone(true);
  }

  const onColor = variant === "onColor";

  if (done) {
    return (
      <div
        className={
          "flex items-center gap-3 rounded-2xl px-5 py-4 " +
          (onColor ? "bg-white/15 text-white" : "bg-[#1fa896]/12 text-[#0f5b51]")
        }
      >
        <span
          className={
            "grid h-9 w-9 flex-none place-items-center rounded-full " +
            (onColor ? "bg-white text-[#2f6bff]" : "bg-[#1fa896] text-white")
          }
        >
          <Check size={18} strokeWidth={3} />
        </span>
        <p className="text-[15px] font-semibold leading-snug">
          ¡Listo! Estás en la lista.
          <span className="block text-[13px] font-normal opacity-80">
            Te avisaremos apenas abramos el acceso anticipado.
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} data-source={source} className="w-full">
      <div className={"flex gap-2 " + (stack ? "flex-col" : "flex-col sm:flex-row")}>
        <div className="relative flex-1">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="tu@correo.com"
            aria-label="Tu correo"
            className={
              "ls-field h-12 w-full rounded-xl px-4 text-[15px] outline-none transition " +
              (onColor
                ? "ls-field-dark border border-white/35 bg-white/[0.16] text-white placeholder:text-white/65 focus:border-white/70 focus:bg-white/20"
                : "border border-[#d8cdb8] bg-white text-[#1f2430] placeholder:text-[#a99f8d] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/25")
            }
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className={
            "group inline-flex h-12 flex-none items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-60 " +
            (onColor
              ? "bg-white text-[#1f2430] hover:bg-white/90"
              : "bg-[#2f6bff] text-white shadow-[0_8px_24px_-8px_rgba(47,107,255,0.7)] hover:bg-[#235ae6]")
          }
        >
          {busy ? "Enviando…" : "Reservar acceso"}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {error ? (
        <p className={"mt-2 text-[13px] " + (onColor ? "text-white" : "text-[#d94f6e]")}>{error}</p>
      ) : (
        <p className={"mt-2 text-[12.5px] " + (onColor ? "text-white/70" : "text-[#8a8170]")}>
          Sin spam. Solo un aviso cuando abramos la preventa.
        </p>
      )}
    </form>
  );
}
