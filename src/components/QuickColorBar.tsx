import { useStore } from "../store";
import { BEADS, FINISH_LABEL } from "../data/beads";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import PaletteGrid from "./PaletteGrid";
import { Palette, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuickColorBar() {
  const currentBead = useStore((s) => s.currentBead);
  const recent = useStore((s) => s.recent);
  const setBead = useStore((s) => s.setBead);
  const cur = BEADS[currentBead];

  return (
    <div className="flex items-center gap-3 border-t border-border bg-card px-3 py-2">
      {/* color actual */}
      <div className="flex items-center gap-2">
        <span
          className="h-7 w-7 flex-none rounded-md border border-border shadow-sm"
          style={{ background: cur.hex }}
        />
        <div className="leading-tight">
          <div className="text-[12px] font-semibold">{cur.num}</div>
          <div className="text-[10px] text-muted-foreground">{FINISH_LABEL[cur.finish]}</div>
        </div>
      </div>

      <div className="h-7 w-px bg-border" />

      {/* recientes */}
      <span className="text-[11px] text-muted-foreground">Recientes</span>
      <div className="flex items-center gap-1 overflow-x-auto">
        {recent.map((idx) => (
          <button
            key={idx}
            title={`${BEADS[idx].num} · ${BEADS[idx].name}`}
            onClick={() => setBead(idx)}
            className={cn(
              "h-7 w-7 flex-none rounded-md border-2 transition",
              idx === currentBead ? "border-foreground" : "border-transparent hover:border-border"
            )}
            style={{ background: BEADS[idx].hex }}
          />
        ))}
      </div>

      {/* popover paleta completa */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto gap-1.5">
            <Palette size={15} /> Todos los colores
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <Plus size={14} /> Elegir color
          </div>
          <PaletteGrid columns={7} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
