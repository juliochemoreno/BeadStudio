import { memo, useEffect, useRef } from "react";
import { drawBead, Orient } from "../lib/beadRender";
import { BeadShape, Finish } from "../data/beads";

interface Props {
  hex: string;
  finish: Finish;
  shape: BeadShape;
  size?: number;
  width?: number;
  height?: number;
  orient?: Orient;
  className?: string;
}

function BeadSwatchImpl({ hex, finish, shape, size = 28, width, height, orient = "v", className }: Props) {
  const w = width ?? size;
  const h = height ?? size;
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    drawBead(ctx, 0, 0, w, h, hex, shape, finish, orient);
  }, [hex, finish, shape, w, h, orient]);
  return <canvas ref={ref} style={{ width: w, height: h }} className={className} />;
}

export default memo(BeadSwatchImpl);
