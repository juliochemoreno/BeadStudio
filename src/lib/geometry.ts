import { BeadType } from "../data/beads";
import { StitchDef } from "../data/stitches";

// Geometría de celda compartida por el lienzo, la exportación y la medida,
// para que el dibujo y el "tamaño real" no puedan divergir.

// Relación alto/ancho de cada celda según cómo se orienta la cuenta en la puntada.
//   'v' (peyote): cuenta parada → celda más alta que ancha (pitchY/pitchX)
//   'h' (telar/brick): cuenta acostada → celda más ancha que alta (rotada 90°)
//   RAW: celda cuadrada
export function cellAspect(def: StitchDef, beadType: BeadType): number {
  const aspectV = beadType.pitchY / beadType.pitchX;
  if (def.weave === "raw") return 1;
  return def.orient === "v" ? aspectV : 1 / aspectV;
}

// Paso físico (mm) entre columnas y entre filas, coherente con cellAspect:
// el cociente stepY/stepX es exactamente cellAspect, así la medida sigue al dibujo.
export function cellPitch(def: StitchDef, beadType: BeadType): { stepX: number; stepY: number } {
  const { pitchX, pitchY } = beadType;
  if (def.weave === "raw") return { stepX: pitchX, stepY: pitchX };
  return def.orient === "v"
    ? { stepX: pitchX, stepY: pitchY }
    : { stepX: pitchY, stepY: pitchX };
}
