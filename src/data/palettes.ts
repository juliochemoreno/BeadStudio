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

// El "tipo de cuenta" (geometría: tamaño + forma) y la "paleta de color" (catálogo)
// son ahora dos ejes independientes. Cada marca tiene su propio catálogo de color;
// hoy solo "delica" tiene datos reales, el resto comparten los colores genéricos
// (placeholder). Para enchufar datos reales basta con rellenar `beads` del catálogo
// correspondiente en CATALOGS y poner `real: true`: aparecerá solo en el selector.
export type CatalogId =
  | "delica"
  | "miyukiRound"
  | "tohoAiko"
  | "tohoTreasures"
  | "tohoRounds"
  | "preciosa"
  | "generic";

export interface CatalogDef {
  id: CatalogId;
  label: string;
  beads: Bead[];
  real: boolean; // true = códigos y colores de la marca; false = genéricos aproximados
}

const CATALOGS: Record<CatalogId, CatalogDef> = {
  delica: { id: "delica", label: "Miyuki Delica", beads: BEADS, real: true },
  miyukiRound: { id: "miyukiRound", label: "Miyuki Round", beads: GENERIC_BEADS, real: false },
  tohoAiko: { id: "tohoAiko", label: "Toho Aiko", beads: GENERIC_BEADS, real: false },
  tohoTreasures: { id: "tohoTreasures", label: "Toho Treasures", beads: GENERIC_BEADS, real: false },
  tohoRounds: { id: "tohoRounds", label: "Toho Rounds", beads: GENERIC_BEADS, real: false },
  preciosa: { id: "preciosa", label: "Preciosa", beads: GENERIC_BEADS, real: false },
  generic: { id: "generic", label: "Colores genéricos", beads: GENERIC_BEADS, real: false },
};

// Paletas de color ofrecidas en el selector: las que tienen datos reales propios
// más la genérica. Las marcas sin datos reales no se listan como paleta de color
// (su tamaño/forma vive en el "tipo de cuenta").
export const COLOR_PALETTES: CatalogDef[] = Object.values(CATALOGS).filter(
  (c) => c.real || c.id === "generic"
);

export const DEFAULT_CATALOG_ID: CatalogId = "delica";

export function getCatalog(catalogId: string): Bead[] {
  return (CATALOGS[catalogId as CatalogId] ?? CATALOGS.generic).beads;
}

export function getCatalogLabel(catalogId: string): string {
  return (CATALOGS[catalogId as CatalogId] ?? CATALOGS.generic).label;
}

// ¿el id corresponde a una paleta de color ofrecida en el selector?
export function isColorPalette(catalogId: string): boolean {
  return COLOR_PALETTES.some((c) => c.id === catalogId);
}

// Tipo de cuenta (geometría: tamaño + forma).
export function getBeadType(beadTypeId: string): BeadType {
  return BEAD_TYPES.find((b) => b.id === beadTypeId) ?? BEAD_TYPES[0];
}

// --- Compatibilidad: paletas antiguas (geometría + color en una sola entrada).
// Se conservan solo para migrar proyectos y ajustes guardados con el formato previo.
export interface Palette {
  id: string;
  label: string;
  beadTypeId: string;
  catalog: CatalogId | null;
}

const LEGACY_PALETTES: Palette[] = [
  { id: "delica11", label: "Miyuki Delicas (Size 11)", beadTypeId: "delica11", catalog: "delica" },
  { id: "delica10", label: "Miyuki Delicas (Size 10)", beadTypeId: "delica10", catalog: "delica" },
  { id: "delica15", label: "Miyuki Delicas (Size 15)", beadTypeId: "delica15", catalog: "delica" },
  { id: "delica8", label: "Miyuki Delicas (Size 8)", beadTypeId: "delica8", catalog: "delica" },
  { id: "round11", label: "Miyuki Round Rocailles (Size 11)", beadTypeId: "round11", catalog: "miyukiRound" },
  { id: "round15", label: "Miyuki Round Rocailles (Size 15)", beadTypeId: "round15", catalog: "miyukiRound" },
  { id: "round10", label: "Miyuki Round Rocailles (Size 10)", beadTypeId: "round10", catalog: "miyukiRound" },
  { id: "round6", label: "Miyuki Round Rocailles (Size 6)", beadTypeId: "round6", catalog: "miyukiRound" },
  { id: "round8", label: "Miyuki Round Rocailles (Size 8)", beadTypeId: "round8", catalog: "miyukiRound" },
  { id: "round5", label: "Miyuki Round Rocailles (Size 5)", beadTypeId: "round5", catalog: "miyukiRound" },
  { id: "round9mm", label: "Miyuki Round Rocailles (9mm)", beadTypeId: "round9mm", catalog: "miyukiRound" },
  { id: "preciosa11", label: "Preciosa Rocailles (Size 11)", beadTypeId: "round11", catalog: "preciosa" },
  { id: "pony9", label: "Pony Beads (9mm)", beadTypeId: "pony9", catalog: "generic" },
  { id: "tohoAiko", label: "Toho Aiko", beadTypeId: "tohoAiko", catalog: "tohoAiko" },
  { id: "tohoTreasures", label: "Toho Treasures", beadTypeId: "tohoTreasures", catalog: "tohoTreasures" },
  { id: "tohoRounds", label: "Toho Rounds", beadTypeId: "toho11", catalog: "tohoRounds" },
  { id: "generic", label: "Colores genéricos", beadTypeId: "generic", catalog: "generic" },
];

export function legacyPalette(id: string): Palette | undefined {
  return LEGACY_PALETTES.find((p) => p.id === id);
}
