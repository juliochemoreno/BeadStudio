import { BEADS, BEAD_TYPES, Bead, BeadType } from "./beads";

// Catálogo de colores genéricos (no atado a un fabricante).
export const GENERIC_BEADS: Bead[] = [
  { num: "G-01", name: "Negro", hex: "#000000", finish: "opaque" },
  { num: "G-02", name: "Gris oscuro", hex: "#3a3a3a", finish: "opaque" },
  { num: "G-03", name: "Gris", hex: "#7a7a7a", finish: "opaque" },
  { num: "G-04", name: "Gris claro", hex: "#b8b8b8", finish: "opaque" },
  { num: "G-05", name: "Blanco", hex: "#ffffff", finish: "opaque" },
  { num: "G-06", name: "Marfil", hex: "#f3ead2", finish: "opaque" },
  { num: "G-07", name: "Crema", hex: "#f7e6c4", finish: "opaque" },
  { num: "G-08", name: "Amarillo", hex: "#ffd21e", finish: "opaque" },
  { num: "G-09", name: "Amarillo oro", hex: "#f2b705", finish: "opaque" },
  { num: "G-10", name: "Mostaza", hex: "#c99700", finish: "opaque" },
  { num: "G-11", name: "Naranja", hex: "#f5821f", finish: "opaque" },
  { num: "G-12", name: "Naranja oscuro", hex: "#d35400", finish: "opaque" },
  { num: "G-13", name: "Coral", hex: "#f08080", finish: "opaque" },
  { num: "G-14", name: "Rojo", hex: "#e02424", finish: "opaque" },
  { num: "G-15", name: "Rojo oscuro", hex: "#a01818", finish: "opaque" },
  { num: "G-16", name: "Vino", hex: "#7a1f3d", finish: "opaque" },
  { num: "G-17", name: "Rosa", hex: "#f48fb1", finish: "opaque" },
  { num: "G-18", name: "Rosa fuerte", hex: "#e91e8c", finish: "opaque" },
  { num: "G-19", name: "Magenta", hex: "#c2185b", finish: "opaque" },
  { num: "G-20", name: "Morado", hex: "#7b3fa0", finish: "opaque" },
  { num: "G-21", name: "Morado oscuro", hex: "#512888", finish: "opaque" },
  { num: "G-22", name: "Lavanda", hex: "#b39ddb", finish: "opaque" },
  { num: "G-23", name: "Azul", hex: "#2962ff", finish: "opaque" },
  { num: "G-24", name: "Azul cobalto", hex: "#1a3a8f", finish: "opaque" },
  { num: "G-25", name: "Azul marino", hex: "#16264d", finish: "opaque" },
  { num: "G-26", name: "Celeste", hex: "#7ec8e3", finish: "opaque" },
  { num: "G-27", name: "Cian", hex: "#00b8d4", finish: "opaque" },
  { num: "G-28", name: "Turquesa", hex: "#1abc9c", finish: "opaque" },
  { num: "G-29", name: "Verde azulado", hex: "#0e7c6b", finish: "opaque" },
  { num: "G-30", name: "Verde", hex: "#2e9e3f", finish: "opaque" },
  { num: "G-31", name: "Verde oscuro", hex: "#1e5a2e", finish: "opaque" },
  { num: "G-32", name: "Lima", hex: "#a4c93a", finish: "opaque" },
  { num: "G-33", name: "Oliva", hex: "#73762f", finish: "opaque" },
  { num: "G-34", name: "Café", hex: "#5b3a1e", finish: "opaque" },
  { num: "G-35", name: "Café claro", hex: "#a9743f", finish: "opaque" },
  { num: "G-36", name: "Tan", hex: "#c2a06a", finish: "opaque" },
  { num: "G-37", name: "Durazno", hex: "#f4c19a", finish: "opaque" },
  { num: "G-38", name: "Beige", hex: "#e3d3b3", finish: "opaque" },
  { num: "G-39", name: "Plata", hex: "#c9ccd1", finish: "metallic" },
  { num: "G-40", name: "Oro", hex: "#cda94b", finish: "metallic" },
];

export type CatalogId = "delica" | "generic";

export interface Palette {
  id: string;
  label: string;
  beadTypeId: string; // geometría (tamaño/forma)
  catalog: CatalogId | null; // null = sin datos de color (placeholder)
}

// catalog "delica" = colores reales (Miyuki Delica). "generic" = aproximados
// hasta digitalizar las sample cards de cada marca.
export const PALETTES: Palette[] = [
  { id: "delica11", label: "Miyuki Delica 11/0", beadTypeId: "delica11", catalog: "delica" },
  { id: "delica10", label: "Miyuki Delica 10/0", beadTypeId: "delica10", catalog: "delica" },
  { id: "delica15", label: "Miyuki Delica 15/0", beadTypeId: "delica15", catalog: "delica" },
  { id: "delica8", label: "Miyuki Delica 8/0", beadTypeId: "delica8", catalog: "delica" },
  { id: "round11", label: "Miyuki Round Rocaille 11/0", beadTypeId: "round11", catalog: "generic" },
  { id: "round15", label: "Miyuki Round Rocaille 15/0", beadTypeId: "round15", catalog: "generic" },
  { id: "round8", label: "Miyuki Round Rocaille 8/0", beadTypeId: "round8", catalog: "generic" },
  { id: "round6", label: "Miyuki Round Rocaille 6/0", beadTypeId: "round6", catalog: "generic" },
  { id: "preciosa11", label: "Preciosa Rocaille 11/0", beadTypeId: "round11", catalog: "generic" },
  { id: "preciosa8", label: "Preciosa Rocaille 8/0", beadTypeId: "round8", catalog: "generic" },
  { id: "tohoTreasures", label: "Toho Treasures 11/0", beadTypeId: "tohocyl", catalog: "generic" },
  { id: "tohoAiko", label: "Toho Aiko 11/0", beadTypeId: "tohocyl", catalog: "generic" },
  { id: "tohoRound11", label: "Toho Round 11/0", beadTypeId: "toho11", catalog: "generic" },
  { id: "tohoRound8", label: "Toho Round 8/0", beadTypeId: "round8", catalog: "generic" },
  { id: "pony9", label: "Pony Beads 9 mm", beadTypeId: "pony9", catalog: "generic" },
];

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

export function getCatalog(paletteId: string): Bead[] {
  const p = getPalette(paletteId);
  return p.catalog === "generic" ? GENERIC_BEADS : BEADS;
}

export function getBeadType(paletteId: string): BeadType {
  const p = getPalette(paletteId);
  return BEAD_TYPES.find((b) => b.id === p.beadTypeId) ?? BEAD_TYPES[0];
}
