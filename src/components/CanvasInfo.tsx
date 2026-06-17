import { useStore } from "../store";
import { getBeadType, getPalette } from "../data/palettes";
import { stitchDef } from "../data/stitches";
import { pieceSize } from "../lib/measure";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

export default function CanvasInfo() {
  const cols = useStore((s) => s.cols);
  const rows = useStore((s) => s.rows);
  const paletteId = useStore((s) => s.paletteId);
  const stitch = useStore((s) => s.stitch);
  const units = useStore((s) => s.units);
  const beadType = getBeadType(paletteId);
  const size = pieceSize(cols, rows, beadType, units);

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
      <PopoverContent align="end" className="w-64">
        <div className="mb-2 text-sm font-semibold">Detalles del patrón</div>
        <dl className="space-y-1.5 text-[13px]">
          <Item k="Puntada" v={stitchDef(stitch).label} />
          <Item k="Paleta" v={getPalette(paletteId).label} />
          <Item k="Forma" v={beadType.shape === "cylinder" ? "Cilíndrica" : "Redonda"} />
          <Item k="Tamaño cuenta" v={beadType.sizeLabel} />
          <Item k="Rejilla" v={`${cols} × ${rows}`} />
          <Item k="Tamaño real" v={`${size.w} × ${size.h} ${size.unit}`} />
          <Item k="Cuentas (máx.)" v={String(cols * rows)} />
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
