// Cálculo de las celdas que cubre cada herramienta de forma, dado el punto
// inicial (c0,r0) y el final (c1,r1). Devuelve pares [col, row].

export type Cell = [number, number];

export function lineCells(c0: number, r0: number, c1: number, r1: number): Cell[] {
  const cells: Cell[] = [];
  let dx = Math.abs(c1 - c0),
    dy = Math.abs(r1 - r0);
  const sx = c0 < c1 ? 1 : -1,
    sy = r0 < r1 ? 1 : -1;
  let err = dx - dy;
  let c = c0,
    r = r0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    cells.push([c, r]);
    if (c === c1 && r === r1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      c += sx;
    }
    if (e2 < dx) {
      err += dx;
      r += sy;
    }
  }
  return cells;
}

export function rectCells(c0: number, r0: number, c1: number, r1: number): Cell[] {
  const cells: Cell[] = [];
  const minC = Math.min(c0, c1),
    maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1),
    maxR = Math.max(r0, r1);
  for (let r = minR; r <= maxR; r++) for (let c = minC; c <= maxC; c++) cells.push([c, r]);
  return cells;
}

export function ovalCells(c0: number, r0: number, c1: number, r1: number): Cell[] {
  const cells: Cell[] = [];
  const minC = Math.min(c0, c1),
    maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1),
    maxR = Math.max(r0, r1);
  const cx = (minC + maxC) / 2,
    cy = (minR + maxR) / 2;
  const rx = Math.max(0.5, (maxC - minC) / 2 + 0.5),
    ry = Math.max(0.5, (maxR - minR) / 2 + 0.5);
  for (let r = minR; r <= maxR; r++)
    for (let c = minC; c <= maxC; c++) {
      const nx = (c - cx) / rx,
        ny = (r - cy) / ry;
      if (nx * nx + ny * ny <= 1) cells.push([c, r]);
    }
  return cells;
}

export function triangleCells(c0: number, r0: number, c1: number, r1: number): Cell[] {
  // Triángulo isósceles dentro del bounding box, apuntando hacia arriba.
  const cells: Cell[] = [];
  const minC = Math.min(c0, c1),
    maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1),
    maxR = Math.max(r0, r1);
  const h = maxR - minR || 1;
  const apex = (minC + maxC) / 2;
  for (let r = minR; r <= maxR; r++) {
    const t = (r - minR) / h; // 0 arriba, 1 abajo
    const half = (t * (maxC - minC)) / 2;
    const left = Math.round(apex - half),
      right = Math.round(apex + half);
    for (let c = left; c <= right; c++) cells.push([c, r]);
  }
  return cells;
}

// Devuelve solo las celdas del borde de un conjunto relleno (para formas en contorno).
export function outlineCells(cells: Cell[]): Cell[] {
  const set = new Set(cells.map(([c, r]) => c + "," + r));
  return cells.filter(([c, r]) => {
    return (
      !set.has(c + 1 + "," + r) ||
      !set.has(c - 1 + "," + r) ||
      !set.has(c + "," + (r + 1)) ||
      !set.has(c + "," + (r - 1))
    );
  });
}

export function diamondCells(c0: number, r0: number, c1: number, r1: number): Cell[] {
  const cells: Cell[] = [];
  const minC = Math.min(c0, c1),
    maxC = Math.max(c0, c1);
  const minR = Math.min(r0, r1),
    maxR = Math.max(r0, r1);
  const cx = (minC + maxC) / 2,
    cy = (minR + maxR) / 2;
  const rx = Math.max(0.5, (maxC - minC) / 2 + 0.5),
    ry = Math.max(0.5, (maxR - minR) / 2 + 0.5);
  for (let r = minR; r <= maxR; r++)
    for (let c = minC; c <= maxC; c++) {
      if (Math.abs(c - cx) / rx + Math.abs(r - cy) / ry <= 1) cells.push([c, r]);
    }
  return cells;
}
