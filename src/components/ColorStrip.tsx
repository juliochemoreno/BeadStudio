import { useStore } from "../store";
import { FINISH_LABEL } from "../data/beads";
import { getBeadType, getCatalog } from "../data/palettes";
import BeadSwatch from "./BeadSwatch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ColorStrip() {
  const currentBead = useStore((s) => s.currentBead);
  const setBead = useStore((s) => s.setBead);
  const catalogId = useStore((s) => s.catalogId);
  const beadTypeId = useStore((s) => s.beadTypeId);
  const catalog = getCatalog(catalogId);
  const shape = getBeadType(beadTypeId).shape;

  const Swatch = ({ idx }: { idx: number }) => {
    const b = catalog[idx];
    if (!b) return null;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setBead(idx)}
            className="grid h-8 w-8 flex-none place-items-center rounded-md outline-none transition hover:bg-accent/60 focus:outline-none focus-visible:outline-none"
          >
            <BeadSwatch hex={b.hex} finish={b.finish} shape={shape} size={26} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <span className="font-medium">{b.num}</span> · {b.name} · {FINISH_LABEL[b.finish]}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex w-11 flex-none flex-col items-center overflow-y-auto border-l border-border bg-card">
        {/* color seleccionado, fijo arriba */}
        <div className="sticky top-0 z-10 flex w-full flex-col items-center border-b border-border bg-card py-2">
          <Swatch idx={currentBead} />
        </div>
        <div className="flex flex-col items-center gap-1 py-2">
          {catalog.map((_, i) => (
            <Swatch key={i} idx={i} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
