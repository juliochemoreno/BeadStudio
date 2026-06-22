// Dibujo realista de una cuenta en canvas: forma (cilindro Delica / dona
// rocalla) + sombreado según el acabado. Pensado para llamarse por celda
// cuando el zoom es suficiente; en zoom-out se usa relleno plano.

import { BeadShape, Finish } from "../data/beads";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
// mezcla hacia blanco (t>0) o negro (t<0)
function shade([r, g, b]: [number, number, number], t: number): string {
  const tgt = t >= 0 ? 255 : 0;
  const k = Math.abs(t);
  return `rgb(${Math.round(r + (tgt - r) * k)},${Math.round(g + (tgt - g) * k)},${Math.round(b + (tgt - b) * k)})`;
}
function rgba([r, g, b]: [number, number, number], a: number): string {
  return `rgba(${r},${g},${b},${a})`;
}

export function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function iridescent(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "rgba(255,120,200,0.30)");
  g.addColorStop(0.35, "rgba(120,220,255,0.22)");
  g.addColorStop(0.6, "rgba(150,255,170,0.20)");
  g.addColorStop(1, "rgba(200,160,255,0.28)");
  ctx.fillStyle = g;
  ctx.fill();
}

/**
 * Dibuja una cuenta dentro de la celda [cx0,cy0] de tamaño cellW x cellH.
 * El "cuerpo" se centra y deja un pequeño margen para separar de las vecinas.
 */
export type Orient = "v" | "h"; // cilindro parado (hueco vertical) o acostado (hueco horizontal)

export function drawBead(
  ctx: CanvasRenderingContext2D,
  cx0: number,
  cy0: number,
  cellW: number,
  cellH: number,
  hex: string,
  shape: BeadShape,
  finish: Finish,
  orient: Orient = "v"
) {
  const rgb = hexToRgb(hex);
  const m = Math.max(0.6, Math.min(cellW, cellH) * 0.06); // margen
  const x = cx0 + m,
    y = cy0 + m,
    w = cellW - m * 2,
    h = cellH - m * 2;
  const cx = x + w / 2,
    cy = y + h / 2;

  ctx.save();

  if (shape === "cylinder") {
    // Delica: azulejo casi cuadrado, esquinas apenas redondeadas
    const r = Math.min(w, h) * 0.14;
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();
    const horizontal = orient === "h";
    // cuerpo: gradiente que cruza el tubo (perpendicular al eje del hueco)
    const body = horizontal
      ? ctx.createLinearGradient(x, y, x, y + h)
      : ctx.createLinearGradient(x, y, x + w, y);
    if (finish === "matte") {
      body.addColorStop(0, shade(rgb, -0.08));
      body.addColorStop(0.5, shade(rgb, 0.05));
      body.addColorStop(1, shade(rgb, -0.12));
    } else {
      body.addColorStop(0, shade(rgb, -0.28));
      body.addColorStop(0.38, shade(rgb, 0.36));
      body.addColorStop(0.55, shade(rgb, 0.1));
      body.addColorStop(0.8, shade(rgb, -0.14));
      body.addColorStop(1, shade(rgb, -0.34));
    }
    ctx.fillStyle = body;
    ctx.fillRect(x, y, w, h);
    // rebordes (los extremos planos del tubo), más oscuros, en los lados del hueco
    ctx.fillStyle = shade(rgb, -0.3);
    ctx.globalAlpha = 0.5;
    if (horizontal) {
      const cap = Math.max(1, w * 0.1);
      ctx.fillRect(x, y, cap, h);
      ctx.fillRect(x + w - cap, y, cap, h);
    } else {
      const cap = Math.max(1, h * 0.1);
      ctx.fillRect(x, y, w, cap);
      ctx.fillRect(x, y + h - cap, w, cap);
    }
    ctx.globalAlpha = 1;
  } else if (shape === "barrel") {
    // pony bead: barril rechoncho con hueco grande
    const r = Math.min(w, h) * 0.45;
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();
    const rad = ctx.createRadialGradient(cx - w * 0.16, cy - h * 0.22, Math.min(w, h) * 0.12, cx, cy, Math.max(w, h) * 0.7);
    if (finish === "matte") {
      rad.addColorStop(0, shade(rgb, 0.08));
      rad.addColorStop(1, shade(rgb, -0.14));
    } else {
      rad.addColorStop(0, shade(rgb, 0.4));
      rad.addColorStop(0.5, shade(rgb, 0.05));
      rad.addColorStop(1, shade(rgb, -0.26));
    }
    ctx.fillStyle = rad;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
  } else {
    // rocalla redonda: cojín redondeado (más cuerpo que una elipse, no un círculo plano)
    roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.4);
    ctx.clip();
    const rad = ctx.createRadialGradient(
      cx - w * 0.22,
      cy - h * 0.24,
      Math.min(w, h) * 0.05,
      cx,
      cy,
      Math.max(w, h) * 0.66
    );
    if (finish === "matte") {
      rad.addColorStop(0, shade(rgb, 0.14));
      rad.addColorStop(0.6, shade(rgb, -0.02));
      rad.addColorStop(1, shade(rgb, -0.18));
    } else {
      rad.addColorStop(0, shade(rgb, 0.58));
      rad.addColorStop(0.35, shade(rgb, 0.12));
      rad.addColorStop(0.72, shade(rgb, -0.12));
      rad.addColorStop(1, shade(rgb, -0.4));
    }
    ctx.fillStyle = rad;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
  }

  // --- overlays por acabado (sobre el cuerpo recortado) ---
  switch (finish) {
    case "ab":
      iridescent(ctx, x, y, w, h);
      break;
    case "silver-lined":
    case "silverlined": {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      g.addColorStop(0, "rgba(255,255,255,0.85)");
      g.addColorStop(0.5, "rgba(255,255,255,0.18)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
      break;
    }
    case "metallic":
    case "galvanized": {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      const a = finish === "galvanized" ? 0.25 : 0.5;
      g.addColorStop(0, `rgba(0,0,0,${a * 0.7})`);
      g.addColorStop(0.45, `rgba(255,255,255,${a})`);
      g.addColorStop(0.7, `rgba(255,255,255,${a * 0.3})`);
      g.addColorStop(1, `rgba(0,0,0,${a * 0.6})`);
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
      break;
    }
    case "ceylon":
    case "luster": {
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.4, "rgba(255,255,255,0.1)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
      break;
    }
  }

  // --- sombra de contacto: oscurece el borde inferior para dar volumen ---
  const ao = ctx.createLinearGradient(x, y + h * 0.55, x, y + h);
  ao.addColorStop(0, "rgba(0,0,0,0)");
  ao.addColorStop(1, finish === "matte" ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.26)");
  ctx.fillStyle = ao;
  ctx.fillRect(x, y, w, h);

  // --- brillo especular (no en mate): un punto nítido arriba-izquierda ---
  if (finish !== "matte") {
    const hl =
      finish === "transparent" || finish === "luster" || finish === "ceylon" ? 0.75 : 0.55;
    const hx = x + w * 0.32,
      hy = y + h * 0.26;
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(w, h) * 0.32);
    g.addColorStop(0, `rgba(255,255,255,${hl})`);
    g.addColorStop(0.5, `rgba(255,255,255,${hl * 0.22})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  ctx.restore();

  // contorno sutil para separar
  ctx.save();
  if (shape === "cylinder") roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.14);
  else if (shape === "barrel") roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.45);
  else roundRectPath(ctx, x, y, w, h, Math.min(w, h) * 0.4);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.stroke();
  ctx.restore();
}
