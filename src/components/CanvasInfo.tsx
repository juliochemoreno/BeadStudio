import { useStore } from "../store";
import { getBeadType } from "../data/palettes";
import { stitchDef } from "../data/stitches";
import { EMPTY } from "../data/beads";
import { pieceSize } from "../lib/measure";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

export default function CanvasInfo() {
  const cols = useStore((s) => s.cols);
  const rows = useStore((s) => s.rows);
  const beadTypeId = useStore((s) => s.beadTypeId);
  const stitch = useStore((s) => s.stitch);
  const units = useStore((s) => s.units);
  const grid = useStore((s) => s.grid);
  
  const beadType = getBeadType(beadTypeId);
  const def = stitchDef(stitch);
  const size = pieceSize(cols, rows, def, beadType, units);

  let activeBeads = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== EMPTY) activeBeads++;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Información del patrón"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <Info size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-4">
        <div className="mb-3 text-sm font-semibold">Resumen Físico</div>
        <dl className="space-y-2 text-[13px]">
          <Item k="Ancho final" v={`${size.w} ${size.unit}`} />
          <Item k="Alto final" v={`${size.h} ${size.unit}`} />
          <div className="my-2 border-t border-border" />
          <Item k="Cuentas tejidas" v={String(activeBeads)} />
          <Item k="Área (rejilla)" v={`${cols} × ${rows} celdas`} />
        </dl>
      </PopoverContent>
    </Popover>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
