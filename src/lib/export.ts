import { EMPTY } from "../data/beads";
import { getBeadType, getCatalog } from "../data/palettes";
import { StitchId, stitchDef, beadOrient } from "../data/stitches";
import { drawBead, roundRectPath } from "./beadRender";
import { cellAspect } from "./geometry";

const PAD = 18;
const BRAND_BLUE = "#2f6bff";
const BRAND_INK = "#1d2330";

// Marca del plan gratuito: barra de crédito al pie (logo + wordmark) que no
// toca ninguna cuenta, más una retícula diagonal muy tenue sobre el patrón que
// hace que recortar la marca también recorte cuentas. El plan de pago exporta
// limpio: con watermark=false el lienzo es idéntico al de antes (mismas
// dimensiones, mismos píxeles). Un único punto de control.
function footerHeight(W: number, Hp: number): number {
  const u = Math.max(W, Hp) / 100;
  return Math.min(64, Math.max(26, Math.round(u * 6)));
}

// Dibuja el glifo de marca (cuadrado redondeado azul con 5 "cuentas" blancas).
function drawLogoMark(o: CanvasRenderingContext2D, x: number, y: number, g: number) {
  roundRectPath(o, x, y, g, g, g * 0.25);
  o.fillStyle = BRAND_BLUE;
  o.fill();
  o.fillStyle = "#ffffff";
  const pw = g * 0.22,
    ph = g * 0.15,
    pr = ph / 2;
  const yT = y + g * 0.34,
    yB = y + g * 0.62;
  for (const f of [0.28, 0.5, 0.72]) {
    roundRectPath(o, x + g * f - pw / 2, yT - ph / 2, pw, ph, pr);
    o.fill();
  }
  for (const f of [0.39, 0.61]) {
    roundRectPath(o, x + g * f - pw / 2, yB - ph / 2, pw, ph, pr);
    o.fill();
  }
}

function drawWatermark(o: CanvasRenderingContext2D, W: number, Hp: number, barH: number) {
  const pad = PAD;
  const u = Math.max(W, Hp) / 100;

  // ---- Capa B: retícula diagonal tenue, sólo sobre el área del patrón ----
  o.save();
  o.beginPath();
  o.rect(pad, pad, W - pad * 2, Hp - pad * 2); // interior; nunca la barra del pie
  o.clip();
  const cx = W / 2,
    cy = Hp / 2;
  o.translate(cx, cy);
  o.rotate((-30 * Math.PI) / 180);
  o.translate(-cx, -cy);
  const fs = Math.max(9, 3.0 * u);
  o.font = `600 ${fs}px Inter, system-ui, sans-serif`;
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.fillStyle = BRAND_INK;
  o.globalAlpha = Math.max(W, Hp) < 320 ? 0.1 : 0.08; // un poco más visible en exportaciones pequeñas
  const phrase = "BeadStudio · beadstudio.app";
  const stepX = 30 * u,
    stepY = 22 * u;
  const diag = Math.hypot(W, Hp); // sobre-barrido: las esquinas rotadas quedan cubiertas (el clip recorta)
  let rowCount = 0;
  for (let y = cy - diag; y <= cy + diag; y += stepY) {
    const rowOdd = Math.round((y - cy) / stepY) % 2;
    if (++rowCount > 160 && o.globalAlpha > 0.04) o.globalAlpha = 0.04; // tapices enormes: la densidad compone
    for (let x = cx - diag; x <= cx + diag; x += stepX) {
      o.fillText(phrase, x + (rowOdd ? stepX / 2 : 0), y);
    }
  }
  o.globalAlpha = 1;
  o.restore();

  // ---- Capa A: barra de crédito al pie (banda reservada, opaca) ----
  o.save();
  const sepY = Math.ceil(Hp) + 0.5;
  o.strokeStyle = "#e3e3e3"; // mismo gris que las celdas vacías: se siente nativo
  o.lineWidth = 1;
  o.beginPath();
  o.moveTo(pad, sepY);
  o.lineTo(W - pad, sepY);
  o.stroke();

  const cyB = Hp + barH / 2;
  const g = barH * 0.62;
  drawLogoMark(o, pad, cyB - g / 2, g);

  const tx = pad + g + g * 0.5;
  o.textBaseline = "middle";
  o.textAlign = "left";
  o.font = `600 ${Math.round(barH * 0.42)}px Inter, system-ui, sans-serif`;
  o.fillStyle = BRAND_INK;
  o.fillText("Bead", tx, cyB);
  const bw = o.measureText("Bead").width;
  o.fillStyle = BRAND_BLUE;
  o.fillText("Studio", tx + bw, cyB);
  const wordRight = tx + bw + o.measureText("Studio").width;

  // URL a la derecha, con guarda de colisión para pulseras largas y estrechas
  const url = "beadstudio.app · Free";
  o.font = `500 ${Math.round(barH * 0.3)}px Inter, system-ui, sans-serif`;
  const urlLeft = W - pad - o.measureText(url).width;
  if (urlLeft > wordRight + g * 0.5) {
    o.textAlign = "right";
    o.fillStyle = "#8a91a0";
    o.fillText(url, W - pad, cyB);
  }
  o.restore();
}

function buildCanvas(
  grid: Uint16Array,
  cols: number,
  rows: number,
  stitch: StitchId,
  beadTypeId: string,
  catalogId: string,
  watermark = true
): HTMLCanvasElement {
  const beadType = getBeadType(beadTypeId);
  const catalog = getCatalog(catalogId);
  const def = stitchDef(stitch);
  const aspect = cellAspect(def, beadType);
  const cellW = 22;
  const cellH = cellW * aspect;
  const pad = PAD;
  const extraX = def.offset === "row" ? 0.5 : 0;
  const extraY = def.offset === "col" ? 0.5 : 0;
  const W = (cols + extraX) * cellW + pad * 2;
  const Hp = (rows + extraY) * cellH + pad * 2; // alto del patrón (sin la barra del pie)
  const barH = watermark ? footerHeight(W, Hp) : 0;
  const c = document.createElement("canvas");
  c.width = Math.ceil(W);
  c.height = Math.ceil(Hp + barH);
  const o = c.getContext("2d")!;
  o.fillStyle = "#ffffff";
  o.fillRect(0, 0, c.width, c.height);
  for (let r = 0; r < rows; r++)
    for (let col = 0; col < cols; col++) {
      const idx = grid[r * cols + col];
      const ox = (def.offset === "row" ? (r % 2) * 0.5 : 0) * cellW;
      const oy = (def.offset === "col" ? (Math.floor(col / def.drop) % 2) * 0.5 : 0) * cellH;
      const x = pad + col * cellW + ox;
      const y = pad + r * cellH + oy;
      if (idx === EMPTY) {
        o.strokeStyle = "#e3e3e3";
        o.lineWidth = 1;
        o.strokeRect(x, y, cellW, cellH);
        continue;
      }
      const bead = catalog[idx];
      drawBead(o, x, y, cellW, cellH, bead.hex, beadType.shape, bead.finish, beadOrient(def, col, r));
    }
  if (watermark) drawWatermark(o, W, Hp, barH);
  return c;
}

export function exportPNG(
  grid: Uint16Array,
  cols: number,
  rows: number,
  stitch: StitchId,
  beadTypeId: string,
  catalogId: string,
  watermark = true
) {
  const a = document.createElement("a");
  a.download = "patron-beadstudio.png";
  a.href = buildCanvas(grid, cols, rows, stitch, beadTypeId, catalogId, watermark).toDataURL("image/png");
  a.click();
}

function countList(grid: Uint16Array, catalogId: string) {
  const catalog = getCatalog(catalogId);
  const map = new Map<number, number>();
  for (let i = 0; i < grid.length; i++) {
    const v = grid[i];
    if (v !== EMPTY) map.set(v, (map.get(v) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([idx, n]) => ({ bead: catalog[idx], n }));
}

export function printPattern(
  grid: Uint16Array,
  cols: number,
  rows: number,
  stitch: StitchId,
  beadTypeId: string,
  catalogId: string,
  watermark = true
) {
  const img = buildCanvas(grid, cols, rows, stitch, beadTypeId, catalogId, watermark).toDataURL("image/png");
  const counts = countList(grid, catalogId);
  const total = counts.reduce((s, x) => s + x.n, 0);
  const rowsHtml = counts
    .map(
      (x) =>
        `<tr><td><span class="sw" style="background:${x.bead.hex}"></span></td><td>${x.bead.num}</td><td>${x.bead.name}</td><td class="q">${x.n}</td></tr>`
    )
    .join("");
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Patrón BeadStudio</title>
  <style>
    body{font-family:system-ui,Arial,sans-serif;margin:24px;color:#111}
    h1{font-size:18px;margin:0 0 4px} .meta{color:#666;font-size:12px;margin-bottom:16px}
    img{max-width:100%;border:1px solid #ddd}
    table{border-collapse:collapse;margin-top:16px;font-size:12px;width:100%}
    td,th{border-bottom:1px solid #eee;padding:4px 8px;text-align:left}
    .q{text-align:right;font-variant-numeric:tabular-nums}
    .sw{display:inline-block;width:16px;height:16px;border-radius:3px;border:1px solid #ccc;vertical-align:middle}
    @media print{ button{display:none} }
  </style></head><body>
  <h1>Patrón BeadStudio</h1>
  <div class="meta">${cols} × ${rows} · ${stitchDef(stitch).label} · ${total} cuentas · ${counts.length} colores</div>
  <img src="${img}"/>
  <table><thead><tr><th></th><th>Código</th><th>Color</th><th>Cant.</th></tr></thead><tbody>${rowsHtml}</tbody></table>
  <button onclick="window.print()" style="margin-top:16px;padding:8px 14px">Imprimir</button>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 300);
}

// "Word chart": la receta escrita fila por fila (RLE por color).
export function exportWordChart(
  grid: Uint16Array,
  cols: number,
  rows: number,
  catalogId: string,
  watermark = true
) {
  const catalog = getCatalog(catalogId);
  const lines: string[] = ["Patrón — word chart", ""];
  for (let r = 0; r < rows; r++) {
    const parts: string[] = [];
    let run = 1;
    for (let c = 1; c <= cols; c++) {
      const prev = grid[r * cols + (c - 1)];
      const cur = c < cols ? grid[r * cols + c] : -1;
      if (cur === prev) {
        run++;
      } else {
        const label = prev === EMPTY ? "vacío" : `${catalog[prev].num} ${catalog[prev].name}`;
        parts.push(`${run}× ${label}`);
        run = 1;
      }
    }
    lines.push(`Fila ${r + 1}: ${parts.join(", ")}`);
  }
  if (watermark) lines.push("", "Hecho con BeadStudio · beadstudio.app");
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.download = "word-chart.txt";
  a.href = URL.createObjectURL(blob);
  a.click();
}
