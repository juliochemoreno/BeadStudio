import { BeadType } from "../data/beads";
import { StitchDef } from "../data/stitches";
import { cellPitch } from "./geometry";

// Tamaño físico de la pieza en la unidad elegida.
// El paso por eje depende de la puntada (cellPitch), de modo que el "tamaño real"
// sigue la misma rotación que el dibujo (peyote y telar no dan el mismo número).
export function pieceSize(
  cols: number,
  rows: number,
  def: StitchDef,
  beadType: BeadType,
  units: "in" | "cm"
) {
  const { stepX, stepY } = cellPitch(def, beadType);
  const wmm = cols * stepX;
  const hmm = rows * stepY;
  if (units === "cm") {
    return { w: (wmm / 10).toFixed(1), h: (hmm / 10).toFixed(1), unit: "cm" };
  }
  return { w: (wmm / 25.4).toFixed(2), h: (hmm / 25.4).toFixed(2), unit: "in" };
}
