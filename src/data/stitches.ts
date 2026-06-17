// Definición de cada puntada: orientación de la cuenta y tipo de desfase.
//   orient 'h' = cuenta acostada (telar/brick) · 'v' = parada (peyote)
//   offset 'row' = filas escalonadas (brick) · 'col' = columnas escalonadas (peyote)
//   drop = nº de cuentas por paso en peyote multi-drop
export type StitchId =
  | "square"
  | "brick"
  | "gourd"
  | "peyote"
  | "peyote2"
  | "peyote3"
  | "peyote4"
  | "peyote5"
  | "peyote6"
  | "peyote7"
  | "peyote8"
  | "peyote9"
  | "tubular"
  | "raw"
  | "raw2"
  | "raw3";

export interface StitchDef {
  id: StitchId;
  label: string;
  orient: "v" | "h";
  offset: "none" | "row" | "col";
  drop: number;
}

export const STITCHES: StitchDef[] = [
  { id: "square", label: "Loom & Square stitch", orient: "h", offset: "none", drop: 1 },
  { id: "brick", label: "Brick stitch", orient: "h", offset: "row", drop: 1 },
  { id: "peyote", label: "Peyote (1 Drop)", orient: "v", offset: "col", drop: 1 },
  { id: "peyote2", label: "Peyote (2 Drop)", orient: "v", offset: "col", drop: 2 },
  { id: "peyote3", label: "Peyote (3 Drop)", orient: "v", offset: "col", drop: 3 },
  { id: "peyote4", label: "Peyote (4 Drop)", orient: "v", offset: "col", drop: 4 },
  { id: "peyote5", label: "Peyote (5 Drop)", orient: "v", offset: "col", drop: 5 },
  { id: "peyote6", label: "Peyote (6 Drop)", orient: "v", offset: "col", drop: 6 },
  { id: "peyote7", label: "Peyote (7 Drop)", orient: "v", offset: "col", drop: 7 },
  { id: "peyote8", label: "Peyote (8 Drop)", orient: "v", offset: "col", drop: 8 },
  { id: "peyote9", label: "Peyote (9 Drop)", orient: "v", offset: "col", drop: 9 },
  { id: "tubular", label: "Tubular Peyote", orient: "v", offset: "col", drop: 1 },
  { id: "gourd", label: "Native American Gourd", orient: "v", offset: "col", drop: 1 },
  { id: "raw", label: "Right Angle Weave (1 Bead)", orient: "v", offset: "none", drop: 1 },
  { id: "raw2", label: "Right Angle Weave (2 Bead)", orient: "v", offset: "none", drop: 1 },
  { id: "raw3", label: "Right Angle Weave (3 Bead)", orient: "v", offset: "none", drop: 1 },
];

export function stitchDef(id: StitchId): StitchDef {
  return STITCHES.find((s) => s.id === id) ?? STITCHES[0];
}
