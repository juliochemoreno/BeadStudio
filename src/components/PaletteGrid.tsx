import { useMemo, useState } from "react";
import { useStore } from "../store";
import { FINISH_LABEL, Finish } from "../data/beads";
import { getBeadType, getCatalog } from "../data/palettes";
import BeadSwatch from "./BeadSwatch";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FINISH_OPTIONS: ("all" | Finish)[] = [
  "all",
  "opaque",
  "matte",
  "transparent",
  "ab",
  "silverlined",
  "metallic",
  "galvanized",
  "ceylon",
  "luster",
  "lined",
];

export default function PaletteGrid({ columns = 6 }: { columns?: number }) {
  const currentBead = useStore((s) => s.currentBead);
  const setBead = useStore((s) => s.setBead);
  const catalogId = useStore((s) => s.catalogId);
  const beadTypeId = useStore((s) => s.beadTypeId);
  const catalog = getCatalog(catalogId);
  const shape = getBeadType(beadTypeId).shape;
  const [search, setSearch] = useState("");
  const [finishFilter, setFinishFilter] = useState<"all" | Finish>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.map((b, i) => ({ b, i })).filter(
      ({ b }) =>
        (finishFilter === "all" || b.finish === finishFilter) &&
        (!q || b.num.toLowerCase().includes(q) || b.name.toLowerCase().includes(q))
    );
  }, [search, finishFilter, catalogId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nº o nombre…"
            className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-2.5 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
        <Select value={finishFilter} onValueChange={(v) => setFinishFilter(v as "all" | Finish)}>
          <SelectTrigger className="w-full">
            <span className="flex items-center gap-2 truncate">
              <Filter size={14} className="flex-none text-muted-foreground" />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {FINISH_OPTIONS.map((f) => (
              <SelectItem key={f} value={f}>
                {f === "all" ? "Todos los acabados" : FINISH_LABEL[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        {filtered.map(({ b, i }) => (
          <button
            key={b.num}
            onClick={() => setBead(i)}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-1.5 py-1 text-left outline-none transition focus:outline-none focus-visible:outline-none",
              i === currentBead ? "bg-accent font-medium" : "hover:bg-accent/60"
            )}
          >
            <BeadSwatch hex={b.hex} finish={b.finish} shape={shape} size={28} className="flex-none" />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[12px] font-semibold">{b.num}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {b.name} · {FINISH_LABEL[b.finish]}
              </span>
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">Sin resultados.</p>
        )}
      </div>
    </div>
  );
}
