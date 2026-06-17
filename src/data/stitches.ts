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
  // RAW: el hilo va en ángulo recto, las cuentas alternan dirección (h/v) en
  // bloques de tamaño "drop". Las demás puntadas tienen dirección uniforme.
  weave?: "raw";
  // Guía de tejido para leer el patrón:
  //   boustrophedon = las filas alternan de sentido (off-loom); en telar van todas igual
  //   lengthAxis    = eje del chart en el que crece el "largo" de la pieza
  //   weaveNote     = cómo se teje / cómo se orienta, mostrado en el panel de información
  boustrophedon: boolean;
  lengthAxis: "h" | "v";
  weaveNote: string;
}

export const STITCHES: StitchDef[] = [
  { id: "square", label: "Loom & Square stitch", orient: "h", offset: "none", drop: 1,
    boustrophedon: false, lengthAxis: "h",
    weaveNote: "Cuentas acostadas en rejilla alineada. Las filas se tejen todas en el mismo sentido y el largo de la pieza corre en horizontal (como se lleva la pulsera)." },
  { id: "brick", label: "Brick stitch", orient: "h", offset: "row", drop: 1,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Cuentas acostadas en filas escalonadas (como ladrillos); el tejido crece hacia arriba. Es el mismo punto que el peyote girado 90°." },
  { id: "peyote", label: "Peyote (1 Drop)", orient: "v", offset: "col", drop: 1,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Cuentas paradas en columnas escalonadas; las filas alternan de sentido. En una pulsera (cuff) el largo suele ir en vertical: gira el lienzo si lo prefieres así." },
  { id: "peyote2", label: "Peyote (2 Drop)", orient: "v", offset: "col", drop: 2,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 2 cuentas por paso. Columnas escalonadas en bloques de 2; las filas alternan de sentido." },
  { id: "peyote3", label: "Peyote (3 Drop)", orient: "v", offset: "col", drop: 3,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 3 cuentas por paso. Columnas escalonadas en bloques de 3; las filas alternan de sentido." },
  { id: "peyote4", label: "Peyote (4 Drop)", orient: "v", offset: "col", drop: 4,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 4 cuentas por paso. Columnas escalonadas en bloques de 4; las filas alternan de sentido." },
  { id: "peyote5", label: "Peyote (5 Drop)", orient: "v", offset: "col", drop: 5,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 5 cuentas por paso. Columnas escalonadas en bloques de 5; las filas alternan de sentido." },
  { id: "peyote6", label: "Peyote (6 Drop)", orient: "v", offset: "col", drop: 6,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 6 cuentas por paso. Columnas escalonadas en bloques de 6; las filas alternan de sentido." },
  { id: "peyote7", label: "Peyote (7 Drop)", orient: "v", offset: "col", drop: 7,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 7 cuentas por paso. Columnas escalonadas en bloques de 7; las filas alternan de sentido." },
  { id: "peyote8", label: "Peyote (8 Drop)", orient: "v", offset: "col", drop: 8,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 8 cuentas por paso. Columnas escalonadas en bloques de 8; las filas alternan de sentido." },
  { id: "peyote9", label: "Peyote (9 Drop)", orient: "v", offset: "col", drop: 9,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote recogiendo 9 cuentas por paso. Columnas escalonadas en bloques de 9; las filas alternan de sentido." },
  { id: "tubular", label: "Tubular Peyote", orient: "v", offset: "col", drop: 1,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "Peyote en redondo: el borde izquierdo se une con el derecho (marca de costura azul). El ancho equivale a la circunferencia del tubo." },
  { id: "gourd", label: "Native American Gourd", orient: "v", offset: "col", drop: 1,
    boustrophedon: true, lengthAxis: "v",
    weaveNote: "El mismo punto que el peyote (columnas escalonadas, cuentas paradas); su nombre viene de la tradición nativa americana." },
  { id: "raw", label: "Right Angle Weave (1 Bead)", orient: "h", offset: "none", drop: 1, weave: "raw",
    boustrophedon: true, lengthAxis: "h",
    weaveNote: "Unidades de cuatro cuentas en ángulo recto con recorrido en figura de 8; dentro de cada unidad las cuentas alternan acostada y parada." },
  { id: "raw2", label: "Right Angle Weave (2 Bead)", orient: "h", offset: "none", drop: 2, weave: "raw",
    boustrophedon: true, lengthAxis: "h",
    weaveNote: "Right Angle Weave con 2 cuentas por lado de cada unidad; recorrido en figura de 8 y orientación alterna por bloques." },
  { id: "raw3", label: "Right Angle Weave (3 Bead)", orient: "h", offset: "none", drop: 3, weave: "raw",
    boustrophedon: true, lengthAxis: "h",
    weaveNote: "Right Angle Weave con 3 cuentas por lado de cada unidad; recorrido en figura de 8 y orientación alterna por bloques." },
];

export function stitchDef(id: StitchId): StitchDef {
  return STITCHES.find((s) => s.id === id) ?? STITCHES[0];
}

// Orientación de la cuenta en la celda (col, row), única fuente de verdad
// compartida por el lienzo y la exportación para que coincidan.
//   RAW: el hilo va en figura de 8 y las cuentas alternan h/v por bloques de "drop".
//   Resto de puntadas: dirección uniforme (la de def.orient).
export function beadOrient(def: StitchDef, c: number, r: number): "h" | "v" {
  if (def.weave === "raw") {
    return (Math.floor(c / def.drop) + Math.floor(r / def.drop)) % 2 === 0 ? "h" : "v";
  }
  return def.orient;
}
