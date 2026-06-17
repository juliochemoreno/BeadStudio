import { EMPTY } from "../data/beads";
import { getBeadType, getCatalog } from "../data/palettes";
import { StitchId, stitchDef, beadOrient } from "../data/stitches";
import { drawBead } from "./beadRender";
import { cellAspect } from "./geometry";

function buildCanvas(
  grid: Uint16Array,
  cols: number,
  rows: number,
  stitch: StitchId,
  beadTypeId: string,
  catalogId: string
): HTMLCanvasElement {
  const beadType = getBeadType(beadTypeId);
  const catalog = getCatalog(catalogId);
  const def = stitchDef(stitch);
  const aspect = cellAspect(def, beadType);
  const cellW = 22;
  const cellH = cellW * aspect;
  const pad = 18;
  const extraX = def.offset === "row" ? 0.5 : 0;
  const extraY = def.offset === "col" ? 0.5 : 0;
  const W = (cols + extraX) * cellW + pad * 2;
  const H = (rows + extraY) * cellH + pad * 2;
  const c = document.createElement("canvas");
  c.width = Math.ceil(W);
  c.height = Math.ceil(H);
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
  return c;
}

export function exportPNG(
  grid: Uint16Array,
  cols: number,
  rows: number,
  stitch: StitchId,
  beadTypeId: string,
  catalogId: string
) {
  const a = document.createElement("a");
  a.download = "patron-beadstudio.png";
  a.href = buildCanvas(grid, cols, rows, stitch, beadTypeId, catalogId).toDataURL("image/png");
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
  catalogId: string
) {
  const img = buildCanvas(grid, cols, rows, stitch, beadTypeId, catalogId).toDataURL("image/png");
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
export function exportWordChart(grid: Uint16Array, cols: number, rows: number, catalogId: string) {
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
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.download = "word-chart.txt";
  a.href = URL.createObjectURL(blob);
  a.click();
}
