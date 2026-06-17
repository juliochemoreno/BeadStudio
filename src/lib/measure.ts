import { BeadType } from "../data/beads";

// Tamaño físico de la pieza en la unidad elegida.
export function pieceSize(cols: number, rows: number, beadType: BeadType, units: "in" | "cm") {
  const wmm = cols * beadType.pitchX;
  const hmm = rows * beadType.pitchY;
  if (units === "cm") {
    return { w: (wmm / 10).toFixed(1), h: (hmm / 10).toFixed(1), unit: "cm" };
  }
  return { w: (wmm / 25.4).toFixed(2), h: (hmm / 25.4).toFixed(2), unit: "in" };
}
