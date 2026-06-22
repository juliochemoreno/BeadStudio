import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY, DEFAULT_BEAD_INDEX } from "./data/beads";
import { StitchId } from "./data/stitches";
import { getCatalog, legacyPalette, isColorPalette } from "./data/palettes";
import { hexToLab, nearestBead } from "./lib/color";
import {
  Cell,
  lineCells,
  rectCells,
  ovalCells,
  triangleCells,
  diamondCells,
  outlineCells,
} from "./lib/shapes";

export type ToolId =
  | "select"
  | "pencil"
  | "eraser"
  | "fill"
  | "picker"
  | "line"
  | "rect"
  | "oval"
  | "triangle"
  | "diamond";

export interface Selection {
  c0: number;
  r0: number;
  c1: number;
  r1: number;
}

const SHAPE_FILLABLE: ToolId[] = ["rect", "oval", "triangle", "diamond"];

interface State {
  cols: number;
  rows: number;
  beadTypeId: string; // tipo de cuenta (geometría: tamaño/forma)
  catalogId: string; // paleta de color (catálogo)
  stitch: StitchId;
  grid: Uint16Array;
  currentBead: number;
  tool: ToolId;
  selection: Selection | null;
  clipboard: { buf: Uint16Array; w: number; h: number } | null;
  shapeFill: boolean;
  schematic: boolean; // vista esquemática (celdas planas) vs realista
  showNumbers: boolean;
  showRulers: boolean;
  theme: "dark" | "light";
  units: "in" | "cm";
  pro: boolean; // plan de pago: exporta sin marca de agua (placeholder hasta el paywall)
  view: "landing" | "editor"; // vista actual: landing de preventa o editor
  recent: number[];
  rev: number;
  past: Uint16Array[];
  future: Uint16Array[];

  setTool: (t: ToolId) => void;
  setSelection: (sel: Selection | null) => void;
  liftRegion: (sel: Selection) => { buf: Uint16Array; w: number; h: number };
  pasteRegion: (buf: Uint16Array, w: number, h: number, destC: number, destR: number) => void;
  toggleNumbers: () => void;
  toggleRulers: () => void;
  toggleTheme: () => void;
  toggleUnits: () => void;
  toggleShapeFill: () => void;
  toggleSchematic: () => void;
  setPro: (v: boolean) => void;
  setView: (v: "landing" | "editor") => void;
  setBead: (i: number) => void;
  setStitch: (s: StitchId) => void;
  setBeadType: (id: string) => void;
  setCatalog: (id: string) => void;
  resize: (cols: number, rows: number) => void;
  beginStroke: () => void;
  paintCell: (c: number, r: number, value: number) => void;
  floodFill: (c: number, r: number) => void;
  commitShape: (tool: ToolId, c0: number, r0: number, c1: number, r1: number) => void;
  pickAt: (c: number, r: number) => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  // edición de selección
  selectAll: () => void;
  deselect: () => void;
  deleteSelection: () => void;
  copySelection: () => void;
  cutSelection: () => void;
  pasteClipboard: () => void;
  mirrorSelection: (axis: "h" | "v") => void;
  rotateSelection: (dir: "left" | "right") => void;
  // proyecto
  loadProject: (data: ProjectData) => void;
}

export interface ProjectData {
  version: number;
  cols: number;
  rows: number;
  stitch: StitchId;
  beadTypeId?: string;
  catalogId?: string;
  paletteId?: string; // formato anterior (geometría + color juntos)
  grid: number[];
}

const MAX_HISTORY = 60;

function shapeCells(tool: ToolId, c0: number, r0: number, c1: number, r1: number): Cell[] {
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

export const useStore = create<State>()(
  persist(
    (set, get) => ({
  cols: 70,
  rows: 20,
  beadTypeId: "delica11",
  catalogId: "delica",
  stitch: "square",
  grid: new Uint16Array(70 * 20).fill(EMPTY),
  currentBead: DEFAULT_BEAD_INDEX, // DB-1006 Metallic Blue Green Gold AB
  tool: "pencil",
  selection: null,
  clipboard: null,
  shapeFill: true,
  schematic: false,
  showNumbers: true,
  showRulers: true,
  theme: "dark",
  units: "cm",
  pro: false,
  view: "landing",
  recent: [DEFAULT_BEAD_INDEX],
  rev: 0,
  past: [],
  future: [],

  setTool: (t) => set((s) => ({ tool: t, selection: t === "select" ? s.selection : null })),
  setSelection: (sel) => set({ selection: sel }),

  liftRegion: (sel) => {
    const { grid, cols, rows } = get();
    const c0 = Math.max(0, Math.min(cols - 1, Math.min(sel.c0, sel.c1)));
    const r0 = Math.max(0, Math.min(rows - 1, Math.min(sel.r0, sel.r1)));
    const c1 = Math.max(0, Math.min(cols - 1, Math.max(sel.c0, sel.c1)));
    const r1 = Math.max(0, Math.min(rows - 1, Math.max(sel.r0, sel.r1)));
    const w = c1 - c0 + 1;
    const h = r1 - r0 + 1;
    const buf = new Uint16Array(w * h).fill(EMPTY);
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) buf[r * w + c] = grid[(r0 + r) * cols + (c0 + c)];
    // snapshot para deshacer (un solo paso para todo el movimiento)
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] }));
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) grid[(r0 + r) * cols + (c0 + c)] = EMPTY;
    set((s) => ({ rev: s.rev + 1 }));
    return { buf, w, h };
  },

  pasteRegion: (buf, w, h, destC, destR) => {
    const { grid, cols, rows } = get();
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) {
        const v = buf[r * w + c];
        if (v === EMPTY) continue;
        const gc = destC + c,
          gr = destR + r;
        if (gc < 0 || gr < 0 || gc >= cols || gr >= rows) continue;
        grid[gr * cols + gc] = v;
      }
    set((s) => ({ rev: s.rev + 1 }));
  },

  toggleNumbers: () => set((s) => ({ showNumbers: !s.showNumbers })),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  toggleUnits: () => set((s) => ({ units: s.units === "in" ? "cm" : "in" })),
  toggleShapeFill: () => set((s) => ({ shapeFill: !s.shapeFill })),
  toggleSchematic: () => set((s) => ({ schematic: !s.schematic })),
  setPro: (v) => set({ pro: v }),
  setView: (v) => set({ view: v }),
  setBead: (i) =>
    set((s) => ({ currentBead: i, recent: [i, ...s.recent.filter((x) => x !== i)].slice(0, 14) })),
  setStitch: (s) => set({ stitch: s, rev: get().rev + 1 }),

  // cambiar el tipo de cuenta solo afecta la geometría (mismos colores)
  setBeadType: (id) => set((s) => ({ beadTypeId: id, rev: s.rev + 1 })),

  setCatalog: (id) => {
    const cur = get();
    const oldCat = getCatalog(cur.catalogId);
    const newCat = getCatalog(id);
    if (oldCat === newCat) {
      // mismo catálogo de color (no hay que remapear)
      set({ catalogId: id, rev: cur.rev + 1 });
      return;
    }
    // catálogo distinto: remapear cada cuenta al color más parecido (CIELAB)
    const labs = newCat.map((b) => hexToLab(b.hex));
    const cache = new Map<number, number>();
    const remap = (idx: number) => {
      if (idx === EMPTY) return EMPTY;
      let m = cache.get(idx);
      if (m === undefined) {
        m = nearestBead(hexToLab(oldCat[idx]?.hex ?? "#000000"), labs);
        cache.set(idx, m);
      }
      return m;
    };
    const ng = new Uint16Array(cur.grid.length);
    for (let i = 0; i < ng.length; i++) ng[i] = remap(cur.grid[i]);
    const newCurrent = remap(cur.currentBead);
    set({
      catalogId: id,
      grid: ng,
      currentBead: newCurrent,
      recent: [newCurrent],
      past: [...cur.past, cur.grid.slice()].slice(-MAX_HISTORY),
      future: [],
      rev: cur.rev + 1,
    });
  },

  resize: (cols, rows) => {
    const { grid: old, cols: oc, rows: or } = get();
    const ng = new Uint16Array(cols * rows).fill(EMPTY);
    for (let r = 0; r < Math.min(or, rows); r++)
      for (let c = 0; c < Math.min(oc, cols); c++) ng[r * cols + c] = old[r * oc + c];
    set((s) => ({
      grid: ng,
      cols,
      rows,
      past: [...s.past, old].slice(-MAX_HISTORY),
      future: [],
      rev: s.rev + 1,
    }));
  },

  beginStroke: () =>
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] })),

  paintCell: (c, r, value) => {
    const { grid, cols, rows } = get();
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    const i = r * cols + c;
    if (grid[i] === value) return;
    grid[i] = value;
    set((s) => ({ rev: s.rev + 1 }));
  },

  floodFill: (c, r) => {
    const { grid, cols, rows, currentBead } = get();
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    const target = grid[r * cols + c];
    if (target === currentBead) return;
    const stack: Cell[] = [[c, r]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
      if (grid[y * cols + x] !== target) continue;
      grid[y * cols + x] = currentBead;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    set((s) => ({ rev: s.rev + 1 }));
  },

  commitShape: (tool, c0, r0, c1, r1) => {
    const { grid, cols, rows, currentBead, shapeFill } = get();
    let cells = shapeCells(tool, c0, r0, c1, r1);
    if (!shapeFill && SHAPE_FILLABLE.includes(tool)) cells = outlineCells(cells);
    for (const [c, r] of cells) {
      if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
      grid[r * cols + c] = currentBead;
    }
    set((s) => ({ rev: s.rev + 1 }));
  },

  pickAt: (c, r) => {
    const { grid, cols, rows } = get();
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    const v = grid[r * cols + c];
    if (v !== EMPTY)
      set((s) => ({
        currentBead: v,
        tool: "pencil",
        recent: [v, ...s.recent.filter((x) => x !== v)].slice(0, 14),
      }));
  },

  clear: () =>
    set((s) => ({
      past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY),
      future: [],
      grid: new Uint16Array(s.cols * s.rows).fill(EMPTY),
      rev: s.rev + 1,
    })),

  undo: () =>
    set((s) => {
      if (!s.past.length) return s;
      const past = s.past.slice();
      const prev = past.pop()!;
      return { grid: prev, past, future: [...s.future, s.grid.slice()].slice(-MAX_HISTORY), rev: s.rev + 1 };
    }),

  redo: () =>
    set((s) => {
      if (!s.future.length) return s;
      const future = s.future.slice();
      const next = future.pop()!;
      return { grid: next, future, past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), rev: s.rev + 1 };
    }),

  selectAll: () => set((s) => ({ selection: { c0: 0, r0: 0, c1: s.cols - 1, r1: s.rows - 1 } })),
  deselect: () => set({ selection: null }),

  deleteSelection: () => {
    const { grid, cols, selection } = get();
    if (!selection) return;
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] }));
    for (let r = selection.r0; r <= selection.r1; r++)
      for (let c = selection.c0; c <= selection.c1; c++) grid[r * cols + c] = EMPTY;
    set((s) => ({ rev: s.rev + 1 }));
  },

  copySelection: () => {
    const { grid, cols, selection } = get();
    if (!selection) return;
    const w = selection.c1 - selection.c0 + 1;
    const h = selection.r1 - selection.r0 + 1;
    const buf = new Uint16Array(w * h).fill(EMPTY);
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) buf[r * w + c] = grid[(selection.r0 + r) * cols + (selection.c0 + c)];
    set({ clipboard: { buf, w, h } });
  },

  cutSelection: () => {
    get().copySelection();
    get().deleteSelection();
  },

  pasteClipboard: () => {
    const { clipboard, grid, cols, rows, selection } = get();
    if (!clipboard) return;
    const destC = selection ? selection.c0 : 0;
    const destR = selection ? selection.r0 : 0;
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] }));
    for (let r = 0; r < clipboard.h; r++)
      for (let c = 0; c < clipboard.w; c++) {
        const v = clipboard.buf[r * clipboard.w + c];
        if (v === EMPTY) continue;
        const gc = destC + c,
          gr = destR + r;
        if (gc < 0 || gr < 0 || gc >= cols || gr >= rows) continue;
        grid[gr * cols + gc] = v;
      }
    const c1 = Math.min(cols - 1, destC + clipboard.w - 1);
    const r1 = Math.min(rows - 1, destR + clipboard.h - 1);
    set((s) => ({ selection: { c0: destC, r0: destR, c1, r1 }, rev: s.rev + 1 }));
  },

  mirrorSelection: (axis) => {
    const { grid, cols, rows, selection } = get();
    const sel = selection ?? { c0: 0, r0: 0, c1: cols - 1, r1: rows - 1 };
    const w = sel.c1 - sel.c0 + 1;
    const h = sel.r1 - sel.r0 + 1;
    const buf = new Uint16Array(w * h);
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) buf[r * w + c] = grid[(sel.r0 + r) * cols + (sel.c0 + c)];
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] }));
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) {
        const src = axis === "h" ? buf[r * w + (w - 1 - c)] : buf[(h - 1 - r) * w + c];
        grid[(sel.r0 + r) * cols + (sel.c0 + c)] = src;
      }
    set((s) => ({ rev: s.rev + 1 }));
  },

  rotateSelection: (dir) => {
    const s0 = get();
    const { grid, cols, rows, selection } = s0;
    const sel = selection ?? { c0: 0, r0: 0, c1: cols - 1, r1: rows - 1 };
    const whole = !selection || (sel.c0 === 0 && sel.r0 === 0 && sel.c1 === cols - 1 && sel.r1 === rows - 1);
    const w = sel.c1 - sel.c0 + 1;
    const h = sel.r1 - sel.r0 + 1;
    const buf = new Uint16Array(w * h);
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) buf[r * w + c] = grid[(sel.r0 + r) * cols + (sel.c0 + c)];
    const nw = h,
      nh = w;
    const rot = new Uint16Array(nw * nh);
    for (let y = 0; y < nh; y++)
      for (let x = 0; x < nw; x++) {
        // right = horario, left = antihorario
        rot[y * nw + x] = dir === "right" ? buf[(h - 1 - x) * w + y] : buf[x * w + (w - 1 - y)];
      }
    set((s) => ({ past: [...s.past, s.grid.slice()].slice(-MAX_HISTORY), future: [] }));
    if (whole) {
      // rotar todo el lienzo: intercambia dimensiones
      set((s) => ({
        grid: rot,
        cols: nw,
        rows: nh,
        selection: null,
        rev: s.rev + 1,
      }));
      return;
    }
    // sub-selección: limpiar región original y pegar rotado anclado arriba-izquierda
    for (let r = 0; r < h; r++)
      for (let c = 0; c < w; c++) grid[(sel.r0 + r) * cols + (sel.c0 + c)] = EMPTY;
    for (let y = 0; y < nh; y++)
      for (let x = 0; x < nw; x++) {
        const gc = sel.c0 + x,
          gr = sel.r0 + y;
        if (gc < 0 || gr < 0 || gc >= cols || gr >= rows) continue;
        grid[gr * cols + gc] = rot[y * nw + x];
      }
    set((s) => ({
      selection: {
        c0: sel.c0,
        r0: sel.r0,
        c1: Math.min(cols - 1, sel.c0 + nw - 1),
        r1: Math.min(rows - 1, sel.r0 + nh - 1),
      },
      rev: s.rev + 1,
    }));
  },

  loadProject: (data) => {
    const len = data.cols * data.rows;
    const grid = new Uint16Array(len).fill(EMPTY);
    for (let i = 0; i < Math.min(len, data.grid.length); i++) grid[i] = data.grid[i];
    // formato nuevo (beadTypeId + catalogId) con migración del antiguo (paletteId)
    const legacy = data.paletteId ? legacyPalette(data.paletteId) : undefined;
    const beadTypeId = data.beadTypeId ?? legacy?.beadTypeId ?? "delica11";
    let catalogId = data.catalogId ?? legacy?.catalog ?? "delica";
    if (!isColorPalette(catalogId)) catalogId = "generic";
    const cat = getCatalog(catalogId);
    set((s) => ({
      cols: data.cols,
      rows: data.rows,
      stitch: data.stitch,
      beadTypeId,
      catalogId,
      grid,
      selection: null,
      past: [],
      future: [],
      currentBead: s.currentBead < cat.length ? s.currentBead : 0,
      recent: [s.currentBead < cat.length ? s.currentBead : 0],
      rev: s.rev + 1,
    }));
  },
    }),
    {
      name: "beadstudio-settings-v2",
      partialize: (s) => ({
        theme: s.theme,
        units: s.units,
        pro: s.pro,
        showNumbers: s.showNumbers,
        shapeFill: s.shapeFill,
        schematic: s.schematic,
        beadTypeId: s.beadTypeId,
        catalogId: s.catalogId,
        cols: s.cols,
        rows: s.rows,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // migración del formato anterior (paletteId único) a beadTypeId + catalogId
        const legacyId = (state as unknown as { paletteId?: string }).paletteId;
        if (legacyId) {
          const p = legacyPalette(legacyId);
          if (p) {
            state.beadTypeId = p.beadTypeId;
            state.catalogId = p.catalog ?? "generic";
          }
          delete (state as unknown as { paletteId?: string }).paletteId;
        }
        if (!isColorPalette(state.catalogId)) state.catalogId = "generic";
        // el color actual debe ser válido para el catálogo guardado
        const cat = getCatalog(state.catalogId);
        if (state.currentBead >= cat.length) state.currentBead = 0;
        state.recent = state.recent.filter((i) => i < cat.length);
        if (state.recent.length === 0) state.recent = [state.currentBead];
        // entitlement del plan de pago: forzar booleano (es un placeholder
        // falsificable desde el cliente hasta que exista validación en servidor)
        state.pro = state.pro === true;
        // cols/rows se persisten pero el lienzo no: recrear un grid vacío del
        // tamaño guardado para que grid.length siga coincidiendo con cols*rows.
        state.cols = Math.max(2, Math.min(400, Math.round(state.cols)));
        state.rows = Math.max(2, Math.min(400, Math.round(state.rows)));
        state.grid = new Uint16Array(state.cols * state.rows).fill(EMPTY);
      },
    }
  )
);
