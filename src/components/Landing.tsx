import { useEffect, useRef } from "react";
import { useStore } from "../store";
import { EMPTY } from "../data/beads";
import { getCatalog } from "../data/palettes";
import { drawBead } from "../lib/beadRender";
import Editor from "./Editor";
import WaitlistForm from "./WaitlistForm";
import {
  ArrowRight,
  Grid2x2,
  Check,
  Star,
  Gem,
  Printer,
  Sparkles,
  Lock,
  MousePointerClick,
  Smartphone,
} from "lucide-react";

const ACCENT = ["#e8633f", "#f5b133", "#1fa896", "#3f7bf0", "#d94f6e", "#7c5cc4"];

// Glifo de marca (cuadrado redondeado azul con 5 "cuentas").
function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#2f6bff" />
      <g fill="#fff">
        <rect x="4" y="5" width="4" height="5" rx="2" />
        <rect x="10" y="5" width="4" height="5" rx="2" />
        <rect x="16" y="5" width="4" height="5" rx="2" />
        <rect x="7" y="11.5" width="4" height="5" rx="2" />
        <rect x="13" y="11.5" width="4" height="5" rx="2" />
      </g>
    </svg>
  );
}

// Patrón de ejemplo renderizado con el MISMO motor del editor (drawBead), con
// cuentas cilíndricas Delica y colores del catálogo real, para que el hero se
// vea idéntico a los resultados de la app (no un dibujo decorativo).
function HeroPattern() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cat = getCatalog("delica");
    const rings = [6, 22, 41, 70, 92, 14].map((i) => cat[i]).filter(Boolean);
    if (!rings.length) return;
    const cols = 21;
    const rows = 21;
    const cell = 24;
    const W = cols * cell;
    const H = rows * cell;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.abs(c - cx) + Math.abs(r - cy);
        if (d > 9.5) continue;
        const b = rings[Math.round(d) % rings.length];
        drawBead(ctx, c * cell, r * cell, cell, cell, b.hex, "cylinder", b.finish, "h");
      }
    }
  }, []);
  return (
    <canvas
      ref={ref}
      className="block w-full"
      role="img"
      aria-label="Patrón de cuentas de ejemplo en forma de diamante"
    />
  );
}

function Bead({ color, className = "" }: { color: string; className?: string }) {
  return (
    <span
      className={"inline-block h-3 w-3 rounded-[4px] " + className}
      style={{ background: color, boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.45)" }}
    />
  );
}

const FEATURES = [
  {
    icon: Grid2x2,
    title: "Puntadas de verdad",
    body: "Telar y cuadrada, peyote (1–9 drop), ladrillo, RAW, tubular y gourd. Cada puntada con su geometría y desfase reales.",
    color: "#3f7bf0",
  },
  {
    icon: Gem,
    title: "Catálogos de marca",
    body: "Miyuki Delica, Toho y Preciosa con sus medidas, formas y acabados reales — no aproximaciones.",
    color: "#1fa896",
  },
  {
    icon: Sparkles,
    title: "Cuentas realistas",
    body: "Render con relieve y brillo, más una vista esquemática plana para contar y leer el patrón sin esfuerzo.",
    color: "#e8633f",
  },
  {
    icon: Printer,
    title: "Listo para tejer",
    body: "Exporta PNG e imprime con la lista de materiales y el word chart fila por fila. Diseña hoy, teje esta tarde.",
    color: "#f5b133",
  },
];

const FAQ = [
  {
    q: "¿Cuándo estará disponible?",
    a: "Estamos en preventa. Quienes se inscriban ahora reciben acceso anticipado y el precio fundador en cuanto abramos.",
  },
  {
    q: "¿Funciona en el móvil?",
    a: "Sí. La app web funciona en el navegador del móvil, con zoom por pellizco, paneo con dos dedos y dibujo táctil. Las apps nativas de iOS y Android llegarán después.",
  },
  {
    q: "¿Qué marcas de cuentas incluye?",
    a: "Miyuki Delica, Toho y Preciosa, con sus tamaños y acabados reales. Iremos sumando más catálogos.",
  },
  {
    q: "¿Cuánto costará?",
    a: "BeadStudio es una herramienta de pago. Anunciaremos el precio pronto; quienes entren en la preventa obtienen el precio fundador (el más bajo) y acceso anticipado.",
  },
];

export default function Landing() {
  const setView = useStore((s) => s.setView);

  // Siembra un patrón de demostración la primera vez (si el lienzo está vacío)
  // para que el editor embebido se vea vivo.
  useEffect(() => {
    const s = useStore.getState();
    const empty = s.grid.every((v) => v === EMPTY);
    if (!empty) return;
    s.resize(34, 22);
    const st = useStore.getState();
    st.beginStroke();
    const cols = 34;
    const rows = 22;
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const ring = [6, 22, 41, 70, 92, 14];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.abs(c - cx) + Math.abs(r - cy);
        if (d > 10.5) continue;
        st.paintCell(c, r, ring[Math.round(d) % ring.length]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditor = () => setView("editor");

  return (
    <div
      className="ls-grain font-body h-full overflow-y-auto bg-[#f6f1e9] text-[#1f2430]"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ---- NAV ---- */}
      <header className="sticky top-0 z-40 border-b border-[#ece4d5]/80 bg-[#f6f1e9]/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <Logo />
            <span className="text-[17px] font-extrabold tracking-tight">
              Bead<span className="text-[#2f6bff]">Studio</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-[14.5px] font-medium text-[#5b5446] md:flex">
            <a href="#demo" className="transition-colors hover:text-[#1f2430]">
              Demo
            </a>
            <a href="#features" className="transition-colors hover:text-[#1f2430]">
              Características
            </a>
            <a href="#preventa" className="transition-colors hover:text-[#1f2430]">
              Preventa
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={openEditor}
              className="hidden rounded-full px-4 py-2 text-[14px] font-semibold text-[#1f2430] transition-colors hover:bg-[#ece4d5] sm:block"
            >
              Abrir editor
            </button>
            <a
              href="#preventa"
              className="rounded-full bg-[#1f2430] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#2f3545]"
            >
              Reservar
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ---- HERO ---- */}
        <section className="relative overflow-hidden">
          {/* atmósfera: manchas cálidas suaves */}
          <div
            className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle,#f5b13355,transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle,#3f7bf044,transparent 70%)" }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-20">
            <div>
              <span
                className="ls-reveal inline-flex items-center gap-2 rounded-full border border-[#e3dccf] bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-[#5b5446]"
                style={{ animationDelay: "0ms" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8633f] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8633f]" />
                </span>
                Preventa abierta · Acceso anticipado
              </span>

              <h1
                className="ls-reveal font-display mt-6 text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.02em]"
                style={{ animationDelay: "80ms" }}
              >
                Diseña abalorios
                <br />
                como en un{" "}
                <span className="relative whitespace-nowrap text-[#2f6bff]">
                  estudio
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="10"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M2 7 Q 50 1 100 5 T 198 4"
                      fill="none"
                      stroke="#f5b133"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                profesional.
              </h1>

              <p
                className="ls-reveal mt-7 max-w-xl text-[17px] leading-relaxed text-[#5b5446]"
                style={{ animationDelay: "160ms" }}
              >
                El editor de patrones para telar, peyote, ladrillo y más — con cuentas
                realistas, catálogos <strong className="font-semibold text-[#1f2430]">Miyuki, Toho y
                Preciosa</strong>, y exportación lista para tejer. Directo en tu navegador, sin
                instalar nada.
              </p>

              <div className="ls-reveal mt-8 max-w-md" style={{ animationDelay: "240ms" }}>
                <WaitlistForm source="hero" />
              </div>

              <div
                className="ls-reveal mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-[#8a8170]"
                style={{ animationDelay: "320ms" }}
              >
                <a href="#demo" className="inline-flex items-center gap-1.5 font-semibold text-[#1f2430] hover:text-[#2f6bff]">
                  <MousePointerClick size={15} /> Probar la demo
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone size={15} /> App web · iOS y Android pronto
                </span>
              </div>
            </div>

            {/* visual: medalla de cuentas */}
            <div className="ls-reveal relative mx-auto w-full max-w-md" style={{ animationDelay: "200ms" }}>
              <div className="ls-float rotate-[-3deg] rounded-[28px] border border-[#ece4d5] bg-white p-5 shadow-[0_40px_80px_-30px_rgba(47,55,69,0.45)]">
                <HeroPattern />
              </div>
              <div className="absolute -right-3 -top-3 rounded-2xl border border-[#ece4d5] bg-white px-3.5 py-2 text-[13px] font-semibold shadow-lg">
                <span className="text-[#1fa896]">●</span> 6 puntadas
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-[#ece4d5] bg-white px-3.5 py-2 text-[13px] font-semibold shadow-lg">
                Miyuki · Toho · Preciosa
              </div>
            </div>
          </div>
        </section>

        {/* ---- STATS STRIP ---- */}
        <section className="border-y border-[#ece4d5] bg-[#fffdf8]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 text-[14px] font-medium text-[#5b5446]">
            {["6 puntadas", "3 catálogos de marca", "Export PNG e impresión", "Lista de materiales", "Funciona en móvil"].map(
              (t, i) => (
                <span key={t} className="inline-flex items-center gap-2.5">
                  <Bead color={ACCENT[i % ACCENT.length]} />
                  {t}
                </span>
              )
            )}
          </div>
        </section>

        {/* ---- DEMO ---- */}
        <section id="demo" className="scroll-mt-20 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#e8633f]">
                  Demo en vivo
                </p>
                <h2 className="font-display mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.02em]">
                  No es un video. Es el editor de verdad.
                </h2>
                <p className="mt-3 max-w-2xl text-[16px] text-[#5b5446]">
                  Pinta, cambia de puntada, prueba los catálogos. Esto es exactamente lo que
                  estamos construyendo — pruébalo aquí mismo.
                </p>
              </div>
              <button
                onClick={openEditor}
                className="group inline-flex flex-none items-center gap-2 rounded-full bg-[#2f6bff] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,107,255,0.7)] transition hover:bg-[#235ae6]"
              >
                Abrir editor completo
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* marco tipo app con el editor real embebido */}
            <div className="overflow-hidden rounded-2xl border border-[#d9cfba] bg-[#0f0f0f] shadow-[0_50px_100px_-40px_rgba(31,36,48,0.6)]">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#1b1b1b] px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="mx-auto rounded-md bg-white/10 px-3 py-1 text-[12px] font-medium text-white/70">
                  beadstudio.app
                </span>
              </div>
              <div
                className="relative h-[470px] bg-background text-foreground md:h-[640px]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Editor />
              </div>
            </div>
            <p className="mt-3 text-center text-[13px] text-[#8a8170]">
              Rueda para hacer zoom · arrastra para pintar · cambia puntada y paleta en el panel
            </p>
          </div>
        </section>

        {/* ---- FEATURES ---- */}
        <section id="features" className="scroll-mt-20 border-t border-[#ece4d5] bg-[#fffdf8] px-5 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#1fa896]">
                Por qué BeadStudio
              </p>
              <h2 className="font-display mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.02em]">
                Hecho por y para quienes tejen cuentas.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-[#ece4d5] bg-[#f6f1e9]/60 p-7 transition hover:-translate-y-0.5 hover:border-[#d9cfba] hover:shadow-[0_24px_50px_-30px_rgba(31,36,48,0.4)]"
                  >
                    <span
                      className="grid h-12 w-12 place-items-center rounded-xl text-white"
                      style={{ background: f.color }}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 className="font-display mt-5 text-[22px] font-semibold tracking-[-0.01em]">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-[#5b5446]">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- PREVENTA ---- */}
        <section id="preventa" className="scroll-mt-20 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[32px] bg-[#1f2430] px-7 py-14 text-white shadow-[0_50px_100px_-40px_rgba(31,36,48,0.7)] md:px-14 md:py-16">
              {/* profundidad: degradado + textura de puntos */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(125% 130% at 0% 0%, #2b3242 0%, #1f2430 55%)" }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              {/* fila de cuentas decorativa */}
              <div className="pointer-events-none absolute right-6 top-6 hidden gap-1.5 md:flex">
                {ACCENT.map((c) => (
                  <span key={c} className="h-3.5 w-3.5 rounded-[5px]" style={{ background: c }} />
                ))}
              </div>

              <div className="relative grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
                {/* pitch + ventajas */}
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#f5b133]">
                    Preventa · Miembro fundador
                  </p>
                  <h2 className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
                    Sé de los primeros en tejer con BeadStudio.
                  </h2>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/70">
                    Entra antes que nadie y bloquea las ventajas de fundador. Sin pagar nada hoy —
                    solo te avisamos cuando abramos.
                  </p>
                  <ul className="mt-7 space-y-3.5">
                    {[
                      ["Acceso anticipado", "Prueba la app antes del lanzamiento público."],
                      ["Precio fundador de por vida", "El mejor precio, bloqueado para siempre."],
                      ["Export sin marca de agua", "Exportaciones limpias, listas para imprimir o compartir."],
                      ["Moldea el producto", "Tu opinión define las próximas funciones."],
                    ].map(([t, d]) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#1fa896]/20 text-[#3fe0cb]">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <span className="leading-snug">
                          <span className="block text-[15px] font-semibold">{t}</span>
                          <span className="block text-[13.5px] text-white/55">{d}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* tarjeta de oferta (crema, para que el input blanco resalte y la
                    tarjeta destaque sobre el bloque oscuro) */}
                <div className="relative overflow-hidden rounded-3xl bg-[#f6f1e9] p-7 text-[#1f2430] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)]">
                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: "linear-gradient(90deg,#2f6bff,#1fa896,#f5b133)" }}
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2f6bff]/10 px-3 py-1 text-[12.5px] font-bold text-[#2f6bff]">
                    <Star size={13} className="fill-[#2f6bff]" /> Miembro fundador
                  </span>
                  <p className="font-display mt-4 text-[28px] font-semibold leading-tight">
                    Reserva tu acceso
                  </p>
                  <p className="mt-2 text-[14.5px] font-semibold text-[#1f2430]">
                    Precio fundador — el más bajo, solo en preventa.
                  </p>
                  <p className="mt-1 text-[13.5px] leading-snug text-[#8a8170]">
                    Sin pagar hoy. Aseguras tu acceso y tu precio para el lanzamiento.
                  </p>
                  <div className="mt-5">
                    <WaitlistForm variant="paper" source="preventa" stack />
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium text-[#5b5446]">
                    <Lock size={13} className="flex-none text-[#1fa896]" />
                    Plazas de fundador limitadas — te avisamos al abrir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="border-t border-[#ece4d5] bg-[#fffdf8] px-5 py-20 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display mb-10 text-center text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold tracking-[-0.02em]">
              Preguntas frecuentes
            </h2>
            <div className="divide-y divide-[#ece4d5] border-y border-[#ece4d5]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                    {f.q}
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-full border border-[#e3dccf] text-[#8a8170] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-[#5b5446]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA FINAL ---- */}
        <section className="px-5 py-20 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mb-5 flex justify-center gap-1.5">
              {ACCENT.map((c, i) => (
                <span
                  key={c}
                  className="h-3.5 w-3.5 rounded-[5px]"
                  style={{ background: c, animation: `ls-pop 0.5s ${i * 70}ms both` }}
                />
              ))}
            </div>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.02em]">
              Tu próximo patrón empieza aquí.
            </h2>
            <div className="mx-auto mt-7 max-w-md">
              <WaitlistForm source="footer-cta" />
            </div>
          </div>
        </section>
      </main>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-[#ece4d5] bg-[#f0e9db] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-[14px] text-[#8a8170] md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={22} />
            <span className="font-bold text-[#1f2430]">
              Bead<span className="text-[#2f6bff]">Studio</span>
            </span>
            <span className="ml-1">
              · un producto de{" "}
              <strong className="font-semibold text-[#5b5446]">Artesanías Che</strong>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={openEditor} className="font-medium transition-colors hover:text-[#1f2430]">
              Abrir editor
            </button>
            <a href="#preventa" className="font-medium transition-colors hover:text-[#1f2430]">
              Preventa
            </a>
            <span>© 2026 Artesanías Che</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
