import { useEffect, useRef } from "react";
import { useStore, ToolId } from "../store";
import { EMPTY } from "../data/beads";
import { getBeadType, getCatalog } from "../data/palettes";
import { stitchDef, beadOrient } from "../data/stitches";
import { drawBead } from "../lib/beadRender";
import { cellAspect } from "../lib/geometry";
import { printPattern } from "../lib/export";
import { saveProject } from "../lib/project";
import {
  Cell,
  lineCells,
  rectCells,
  ovalCells,
  triangleCells,
  diamondCells,
} from "../lib/shapes";
import { Plus, Minus, Maximize, Undo2, Redo2, Hash } from "lucide-react";
import CanvasInfo from "./CanvasInfo";

const SHAPE_TOOLS: ToolId[] = ["line", "rect", "oval", "triangle", "diamond"];
const DETAIL_MIN = 9; // px de celda a partir del cual se dibuja la cuenta con relieve

function previewCells(tool: ToolId, c0: number, r0: number, c1: number, r1: number): Cell[] {
  switch (tool) {
    case "line":
      return lineCells(c0, r0, c1, r1);
    case "rect":
      return rectCells(c0, r0, c1, r1);
    case "oval":
      return ovalCells(c0, r0, c1, r1);
    case "triangle":
      return triangleCells(c0, r0, c1, r1);
    case "diamond":
      return diamondCells(c0, r0, c1, r1);
    default:
      return [];
  }
}

export default function BeadCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useRef({ scale: 16, offX: 40, offY: 40 });
  const drag = useRef({
    start: null as Cell | null,
    end: null as Cell | null,
    shape: false,
    painting: false,
    pan: false,
    panFrom: null as any,
  });
  const spaceDown = useRef(false);
  const selDrag = useRef<{ c0: number; r0: number; c1: number; r1: number } | null>(null);
  const moveRef = useRef<{
    lifted: boolean;
    sel: { c0: number; r0: number; c1: number; r1: number };
    buf: Uint16Array;
    w: number;
    h: number;
    oc: number;
    or: number;
    dc: number;
    dr: number;
    sc: number;
    sr: number;
  } | null>(null);

  const rev = useStore((s) => s.rev);
  const stitch = useStore((s) => s.stitch);
  const cols = useStore((s) => s.cols);
  const rows = useStore((s) => s.rows);
  const paletteId = useStore((s) => s.paletteId);
  const selection = useStore((s) => s.selection);
  const schematic = useStore((s) => s.schematic);
  const showNumbers = useStore((s) => s.showNumbers);
  const tool = useStore((s) => s.tool);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const toggleNumbers = useStore((s) => s.toggleNumbers);
  const theme = useStore((s) => s.theme);
  const ctheme =
    theme === "light"
      ? { empty: "#ededed", line: "#dcdcdc", num: "#737373", numBold: "#0a0a0a", guide: "#c4c4c4" }
      : { empty: "#1c1c1c", line: "#2a2a2a", num: "#a3a3a3", numBold: "#fafafa", guide: "#3a3a3a" };

  const beadType = getBeadType(paletteId);
  const catalog = getCatalog(paletteId);
  const def = stitchDef(stitch);
  // orient 'h' = cuenta acostada (square/loom/brick) · 'v' = parada (peyote)
  // RAW usa celdas cuadradas; las unidades se muestran con separadores (no rotando cuentas)
  const aspect = cellAspect(def, beadType);

  function cellH() {
    return view.current.scale * aspect;
  }
  // desfase de cada celda según la puntada
  function offsetX(r: number) {
    return def.offset === "row" ? (r % 2) * 0.5 * view.current.scale : 0;
  }
  function offsetY(c: number) {
    return def.offset === "col" ? (Math.floor(c / def.drop) % 2) * 0.5 * cellH() : 0;
  }

  function draw() {
    const wrap = wrapRef.current,
      canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { scale, offX, offY } = view.current;
    const ch = cellH();
    const W = wrap.clientWidth,
      H = wrap.clientHeight;
    ctx.clearRect(0, 0, W, H);
    const { grid } = useStore.getState();
    const detail = scale >= DETAIL_MIN;

    for (let r = 0; r < rows; r++) {
      const ox = offsetX(r);
      for (let c = 0; c < cols; c++) {
        const x = offX + c * scale + ox;
        const y = offY + r * ch + offsetY(c);
        if (x + scale < 0 || x > W || y + ch < 0 || y > H) continue;
        const idx = grid[r * cols + c];
        if (idx === EMPTY) {
          ctx.fillStyle = ctheme.empty;
          ctx.fillRect(x + 0.5, y + 0.5, scale - 1, ch - 1);
          if (scale > 5) {
            ctx.strokeStyle = ctheme.line;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, scale - 1, ch - 1);
          }
          continue;
        }
        const bead = catalog[idx];
        if (!bead) continue;
        if (schematic) {
          // vista esquemática: celda plana de color (fácil de leer/contar)
          ctx.fillStyle = bead.hex;
          ctx.fillRect(x + 0.5, y + 0.5, scale - 1, ch - 1);
          if (scale > 5) {
            ctx.strokeStyle = ctheme.line;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, scale - 1, ch - 1);
          }
        } else if (detail) {
          drawBead(ctx, x, y, scale, ch, bead.hex, beadType.shape, bead.finish, beadOrient(def, c, r));
        } else {
          ctx.fillStyle = bead.hex;
          ctx.fillRect(x + 0.5, y + 0.5, scale - 1, ch - 1);
        }
      }
    }

    // RAW: separadores de unidad (grupos de "drop" cuentas)
    if (def.weave === "raw" && def.drop > 1) {
      ctx.save();
      ctx.strokeStyle = ctheme.guide;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      for (let c = def.drop; c < cols; c += def.drop) {
        const x = offX + c * scale;
        ctx.moveTo(x, offY);
        ctx.lineTo(x, offY + rows * ch);
      }
      for (let r = def.drop; r < rows; r += def.drop) {
        const y = offY + r * ch;
        ctx.moveTo(offX, y);
        ctx.lineTo(offX + cols * scale, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Tubular: marca de costura (el borde izquierdo se une con el derecho)
    if (stitch === "tubular") {
      const seam = theme === "light" ? "#2f6bff" : "#5b8cff";
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = seam;
      ctx.beginPath();
      ctx.moveTo(offX + 0.5, offY);
      ctx.lineTo(offX + 0.5, offY + rows * ch);
      ctx.moveTo(offX + cols * scale + 0.5, offY);
      ctx.lineTo(offX + cols * scale + 0.5, offY + rows * ch);
      ctx.stroke();
      ctx.restore();
    }

    // numeración de filas/columnas + guía marcada cada 10 (estilo papel cuadriculado)
    if (showNumbers) {
      const fs = Math.max(8, Math.min(11, scale * 0.55));
      const step = scale >= 14 ? 1 : scale >= 8 ? 5 : 10;
      const gridTop = offY,
        gridBottom = offY + rows * ch,
        gridLeft = offX,
        gridRight = offX + cols * scale;

      // líneas guía cada 10 (más marcadas)
      ctx.strokeStyle = ctheme.guide;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let c = 10; c < cols; c += 10) {
        const x = offX + c * scale;
        ctx.moveTo(x, gridTop);
        ctx.lineTo(x, gridBottom);
      }
      for (let r = 10; r < rows; r += 10) {
        const y = offY + r * ch;
        ctx.moveTo(gridLeft, y);
        ctx.lineTo(gridRight, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // columnas (arriba)
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (let c = 0; c < cols; c++) {
        const n = c + 1;
        if (n !== 1 && n !== cols && n % step !== 0) continue;
        const x = offX + c * scale + scale / 2;
        if (x < -20 || x > W + 20) continue;
        const y = offY + offsetY(c) - 4;
        const major = n % 10 === 0;
        ctx.fillStyle = major ? ctheme.numBold : ctheme.num;
        ctx.font = `${major ? 600 : 400} ${fs}px Inter, system-ui, sans-serif`;
        ctx.fillText(String(n), x, y);
      }
      // filas (izquierda)
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let r = 0; r < rows; r++) {
        const n = r + 1;
        if (n !== 1 && n !== rows && n % step !== 0) continue;
        const y = offY + r * ch + ch / 2;
        if (y < -20 || y > H + 20) continue;
        const x = offX + (def.offset === "row" ? (r % 2) * 0.5 * scale : 0) - 5;
        const major = n % 10 === 0;
        ctx.fillStyle = major ? ctheme.numBold : ctheme.num;
        ctx.font = `${major ? 600 : 400} ${fs}px Inter, system-ui, sans-serif`;
        ctx.fillText(String(n), x, y);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }

    // preview de forma
    const d = drag.current;
    if (d.shape && d.start && d.end) {
      const { tool, currentBead } = useStore.getState();
      const bead = catalog[currentBead] ?? catalog[0];
      ctx.globalAlpha = 0.65;
      for (const [c, r] of previewCells(tool, d.start[0], d.start[1], d.end[0], d.end[1])) {
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const x = offX + c * scale + offsetX(r);
        const y = offY + r * ch + offsetY(c);
        if (detail) drawBead(ctx, x, y, scale, ch, bead.hex, beadType.shape, bead.finish, beadOrient(def, c, r));
        else {
          ctx.fillStyle = bead.hex;
          ctx.fillRect(x, y, scale, ch);
        }
      }
      ctx.globalAlpha = 1;
    }

    // vista previa del bloque que se está moviendo
    const mv = moveRef.current;
    if (mv && mv.lifted) {
      ctx.globalAlpha = 0.8;
      for (let r = 0; r < mv.h; r++)
        for (let c = 0; c < mv.w; c++) {
          const v = mv.buf[r * mv.w + c];
          if (v === EMPTY) continue;
          const gc = mv.oc + mv.dc + c,
            gr = mv.or + mv.dr + r;
          const x = offX + gc * scale + offsetX(gr);
          const y = offY + gr * ch + offsetY(gc);
          const bead = catalog[v];
          if (!bead) continue;
          if (detail) drawBead(ctx, x, y, scale, ch, bead.hex, beadType.shape, bead.finish, beadOrient(def, gc, gr));
          else {
            ctx.fillStyle = bead.hex;
            ctx.fillRect(x, y, scale, ch);
          }
        }
      ctx.globalAlpha = 1;
    }

    // rectángulo de selección (confirmada o en progreso)
    const selBox = selDrag.current
      ? {
          c0: Math.min(selDrag.current.c0, selDrag.current.c1),
          r0: Math.min(selDrag.current.r0, selDrag.current.r1),
          c1: Math.max(selDrag.current.c0, selDrag.current.c1),
          r1: Math.max(selDrag.current.r0, selDrag.current.r1),
        }
      : mv && mv.lifted
      ? { c0: mv.oc + mv.dc, r0: mv.or + mv.dr, c1: mv.oc + mv.dc + mv.w - 1, r1: mv.or + mv.dr + mv.h - 1 }
      : selection;
    if (selBox) {
      const x = offX + selBox.c0 * scale;
      const y = offY + selBox.r0 * ch;
      const w = (selBox.c1 - selBox.c0 + 1) * scale;
      const h = (selBox.r1 - selBox.r0 + 1) * ch;
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = theme === "light" ? "#1d2330" : "#ffffff";
      ctx.strokeRect(x + 0.5, y + 0.5, w, h);
      ctx.restore();
    }
  }

  function resizeCanvas() {
    const wrap = wrapRef.current,
      canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wrap.clientWidth * dpr;
    canvas.height = wrap.clientHeight * dpr;
    canvas.style.width = wrap.clientWidth + "px";
    canvas.style.height = wrap.clientHeight + "px";
    canvas.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function fit() {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const pad = 36;
    const extraX = def.offset === "row" ? 0.5 : 0;
    const extraY = def.offset === "col" ? 0.5 : 0;
    const sx = (wrap.clientWidth - pad * 2) / (cols + extraX);
    const sy = (wrap.clientHeight - pad * 2) / ((rows + extraY) * aspect);
    const scale = Math.max(3, Math.min(46, Math.min(sx, sy)));
    view.current.scale = scale;
    const ch = scale * aspect;
    view.current.offX = (wrap.clientWidth - (cols + extraX) * scale) / 2;
    view.current.offY = (wrap.clientHeight - (rows + extraY) * ch) / 2;
    draw();
  }

  // redibujar al pintar o al cambiar numeración/tema
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, showNumbers, theme, selection, schematic]);

  // reencuadrar al cambiar puntada, tamaño o tipo de cuenta (cambia la geometría)
  useEffect(() => {
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stitch, cols, rows, paletteId]);

  // cursor base según la herramienta
  useEffect(() => {
    if (canvasRef.current) canvasRef.current.style.cursor = "crosshair";
  }, [tool]);

  useEffect(() => {
    resizeCanvas();
    fit();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (e.code === "Space") spaceDown.current = true;
      const s = useStore.getState();
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === "z") {
        e.preventDefault();
        e.shiftKey ? s.redo() : s.undo();
      } else if (mod && k === "y") {
        e.preventDefault();
        s.redo();
      } else if (mod && k === "a") {
        e.preventDefault();
        s.selectAll();
      } else if (mod && k === "c") {
        e.preventDefault();
        s.copySelection();
      } else if (mod && k === "x") {
        e.preventDefault();
        s.cutSelection();
      } else if (mod && k === "v") {
        e.preventDefault();
        s.pasteClipboard();
      } else if (mod && k === "s") {
        e.preventDefault(); // evitar "guardar página" del navegador
        saveProject();
      } else if (mod && k === "p") {
        e.preventDefault(); // evitar el imprimir del navegador
        printPattern(s.grid, s.cols, s.rows, s.stitch, s.paletteId);
      } else if (k === "delete" || k === "backspace") {
        if (s.selection) {
          e.preventDefault();
          s.deleteSelection();
        }
      } else if (k === "escape") {
        s.deselect();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceDown.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function evtPos(e: React.PointerEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function updateCursor(px: number, py: number) {
    const cv = canvasRef.current;
    if (!cv) return;
    if (moveRef.current) {
      cv.style.cursor = "grabbing";
      return;
    }
    const st = useStore.getState();
    if (st.tool === "select") {
      const cell = pickCell(px, py);
      const sel = st.selection;
      const inside =
        cell && sel && cell[0] >= sel.c0 && cell[0] <= sel.c1 && cell[1] >= sel.r0 && cell[1] <= sel.r1;
      cv.style.cursor = inside ? "move" : "crosshair";
    } else {
      cv.style.cursor = "crosshair";
    }
  }
  function pickCell(px: number, py: number): Cell | null {
    const { scale, offX, offY } = view.current;
    const ch = cellH();
    if (def.offset === "col") {
      const c = Math.floor((px - offX) / scale);
      if (c < 0 || c >= cols) return null;
      const oy = (Math.floor(c / def.drop) % 2) * 0.5 * ch;
      const r = Math.floor((py - offY - oy) / ch);
      if (r < 0 || r >= rows) return null;
      return [c, r];
    }
    if (def.offset === "row") {
      const r = Math.floor((py - offY) / ch);
      if (r < 0 || r >= rows) return null;
      const c = Math.floor((px - offX - (r % 2) * 0.5 * scale) / scale);
      if (c < 0 || c >= cols) return null;
      return [c, r];
    }
    const c = Math.floor((px - offX) / scale);
    const r = Math.floor((py - offY) / ch);
    if (c < 0 || c >= cols || r < 0 || r >= rows) return null;
    return [c, r];
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = evtPos(e);
    const d = drag.current;
    if (e.button === 1 || spaceDown.current) {
      d.pan = true;
      d.panFrom = { x: e.clientX, y: e.clientY, ox: view.current.offX, oy: view.current.offY };
      return;
    }
    const s = useStore.getState();
    const cell = pickCell(p.x, p.y);
    if (!cell) return;
    if (s.tool === "select") {
      const sel = s.selection;
      const inside =
        sel && cell[0] >= sel.c0 && cell[0] <= sel.c1 && cell[1] >= sel.r0 && cell[1] <= sel.r1;
      if (inside && sel) {
        // armar posible movimiento (sólo se levanta el bloque si se arrastra)
        moveRef.current = {
          lifted: false,
          sel,
          buf: new Uint16Array(0),
          w: 0,
          h: 0,
          oc: sel.c0,
          or: sel.r0,
          dc: 0,
          dr: 0,
          sc: cell[0],
          sr: cell[1],
        };
      } else {
        // nueva selección rectangular
        s.setSelection(null);
        selDrag.current = { c0: cell[0], r0: cell[1], c1: cell[0], r1: cell[1] };
      }
      draw();
      return;
    }
    if (s.tool === "picker") {
      s.pickAt(cell[0], cell[1]);
      return;
    }
    if (SHAPE_TOOLS.includes(s.tool)) {
      s.beginStroke();
      d.shape = true;
      d.start = cell;
      d.end = cell;
      draw();
      return;
    }
    if (s.tool === "fill") {
      s.beginStroke();
      s.floodFill(cell[0], cell[1]);
      return;
    }
    s.beginStroke();
    d.painting = true;
    s.paintCell(cell[0], cell[1], s.tool === "eraser" ? EMPTY : s.currentBead);
  }

  function onPointerMove(e: React.PointerEvent) {
    const p = evtPos(e);
    const d = drag.current;
    if (!d.pan && !d.painting && !d.shape && !selDrag.current) updateCursor(p.x, p.y);
    if (d.pan && d.panFrom) {
      view.current.offX = d.panFrom.ox + (e.clientX - d.panFrom.x);
      view.current.offY = d.panFrom.oy + (e.clientY - d.panFrom.y);
      draw();
      return;
    }
    const cell = pickCell(p.x, p.y);
    if (!cell) return;
    const s = useStore.getState();
    if (moveRef.current) {
      const mv = moveRef.current;
      const rawDc = cell[0] - mv.sc;
      const rawDr = cell[1] - mv.sr;
      if (!mv.lifted) {
        if (rawDc === 0 && rawDr === 0) return; // aún es un clic, no un arrastre
        const lift = s.liftRegion(mv.sel);
        mv.buf = lift.buf;
        mv.w = lift.w;
        mv.h = lift.h;
        mv.lifted = true;
      }
      // limitar el movimiento para que el bloque quede siempre dentro del grid
      mv.dc = Math.max(-mv.oc, Math.min(cols - (mv.oc + mv.w), rawDc));
      mv.dr = Math.max(-mv.or, Math.min(rows - (mv.or + mv.h), rawDr));
      draw();
      return;
    }
    if (selDrag.current) {
      selDrag.current.c1 = cell[0];
      selDrag.current.r1 = cell[1];
      draw();
      return;
    }
    if (d.shape) {
      d.end = cell;
      draw();
      return;
    }
    if (d.painting) {
      s.paintCell(cell[0], cell[1], s.tool === "eraser" ? EMPTY : s.currentBead);
    }
  }

  function onPointerUp() {
    const d = drag.current;
    const s = useStore.getState();
    if (moveRef.current) {
      const mv = moveRef.current;
      if (mv.lifted) {
        s.pasteRegion(mv.buf, mv.w, mv.h, mv.oc + mv.dc, mv.or + mv.dr);
        s.setSelection({
          c0: mv.oc + mv.dc,
          r0: mv.or + mv.dr,
          c1: mv.oc + mv.dc + mv.w - 1,
          r1: mv.or + mv.dr + mv.h - 1,
        });
      } else {
        // clic dentro de la selección sin arrastrar = deseleccionar
        s.setSelection(null);
      }
      moveRef.current = null;
    } else if (selDrag.current) {
      const sd = selDrag.current;
      // clic simple (sin arrastrar) = deseleccionar
      if (sd.c0 === sd.c1 && sd.r0 === sd.r1) {
        s.setSelection(null);
      } else {
        const c0 = Math.max(0, Math.min(sd.c0, sd.c1));
        const r0 = Math.max(0, Math.min(sd.r0, sd.r1));
        const c1 = Math.min(cols - 1, Math.max(sd.c0, sd.c1));
        const r1 = Math.min(rows - 1, Math.max(sd.r0, sd.r1));
        s.setSelection({ c0, r0, c1, r1 });
      }
      selDrag.current = null;
    }
    if (d.shape && d.start && d.end) {
      s.commitShape(s.tool, d.start[0], d.start[1], d.end[0], d.end[1]);
    }
    d.shape = false;
    d.painting = false;
    d.pan = false;
    d.start = null;
    d.end = null;
    d.panFrom = null;
  }

  function onWheel(e: React.WheelEvent) {
    const p = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const v = view.current;
    const old = v.scale;
    v.scale = Math.max(3, Math.min(64, v.scale * (e.deltaY < 0 ? 1.1 : 0.9)));
    const k = v.scale / old;
    v.offX = p.x - (p.x - v.offX) * k;
    v.offY = p.y - (p.y - v.offY) * k;
    draw();
  }

  function zoom(factor: number) {
    view.current.scale = Math.max(3, Math.min(64, view.current.scale * factor));
    draw();
  }

  return (
    <div
      ref={wrapRef}
      className="relative flex-1 overflow-hidden bg-canvas no-select"
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="absolute left-3 top-3 flex gap-2">
        <button
          onClick={undo}
          title="Deshacer"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          title="Rehacer"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <Redo2 size={16} />
        </button>
        <button
          onClick={toggleNumbers}
          title="Mostrar/ocultar numeración"
          className={
            "grid h-9 w-9 place-items-center rounded-lg border shadow-sm transition-colors " +
            (showNumbers
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card/90 text-foreground hover:bg-accent")
          }
        >
          <Hash size={16} />
        </button>
      </div>
      <div className="absolute right-3 top-3">
        <CanvasInfo />
      </div>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
          onClick={() => zoom(1.2)}
        >
          <Plus size={16} />
        </button>
        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
          onClick={() => zoom(0.83)}
        >
          <Minus size={16} />
        </button>
        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
          onClick={fit}
        >
          <Maximize size={15} />
        </button>
      </div>
    </div>
  );
}
