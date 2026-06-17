import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store";
import { EMPTY, FINISH_LABEL } from "../data/beads";
import { PALETTES, getBeadType, getCatalog } from "../data/palettes";
import { STITCHES, StitchId } from "../data/stitches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PaletteGrid from "./PaletteGrid";
import BeadSwatch from "./BeadSwatch";
import { Grid2x2, Palette, Minus, Plus } from "lucide-react";

const MIN = 2;
const MAX = 400;

export default function SidePanel() {
  const cols = useStore((s) => s.cols);
  const rows = useStore((s) => s.rows);
  const stitch = useStore((s) => s.stitch);
  const paletteId = useStore((s) => s.paletteId);
  const currentBead = useStore((s) => s.currentBead);
  const rev = useStore((s) => s.rev);
  const setStitch = useStore((s) => s.setStitch);
  const setBead = useStore((s) => s.setBead);
  const setPalette = useStore((s) => s.setPalette);
  const resize = useStore((s) => s.resize);

  const beadType = getBeadType(paletteId);
  const catalog = getCatalog(paletteId);
  const cur = catalog[currentBead] ?? catalog[0];

  const counts = useMemo(() => {
    const grid = useStore.getState().grid;
    const map = new Map<number, number>();
    for (let i = 0; i < grid.length; i++) {
      const v = grid[i];
      if (v !== EMPTY) map.set(v, (map.get(v) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, paletteId]);
  const total = counts.reduce((s, [, n]) => s + n, 0);

  const setCols = (n: number) => resize(Math.max(MIN, Math.min(MAX, n)), rows);
  const setRows = (n: number) => resize(cols, Math.max(MIN, Math.min(MAX, n)));

  return (
    <aside className="flex h-full w-72 min-h-0 flex-col overflow-hidden border-l border-border bg-card">
      <Tabs defaultValue="design" className="flex min-h-0 flex-1 flex-col">
        <div className="p-3 pb-0">
          <TabsList className="w-full">
            <TabsTrigger value="design">Diseñar</TabsTrigger>
            <TabsTrigger value="palette">Paleta</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design" className="flex min-h-0 flex-1 flex-col">
          <section className="shrink-0 space-y-4 p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Patrón
            </h2>

            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground">Puntada</label>
              <Select value={stitch} onValueChange={(v) => setStitch(v as StitchId)}>
                <SelectTrigger className="w-full">
                  <span className="flex items-center gap-2 truncate">
                    <Grid2x2 size={14} className="flex-none text-muted-foreground" />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {STITCHES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground">Cuenta / paleta</label>
              <Select value={paletteId} onValueChange={(v) => setPalette(v)}>
                <SelectTrigger className="w-full">
                  <span className="flex items-center gap-2 truncate">
                    <Palette size={14} className="flex-none text-muted-foreground" />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {PALETTES.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.catalog === null}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                {beadType.shape === "cylinder" ? "Cilíndrica" : "Redonda"} · {beadType.sizeLabel}
              </p>
            </div>

            <div className="flex gap-3">
              <Stepper label="Columnas" value={cols} onChange={setCols} />
              <Stepper label="Filas" value={rows} onChange={setRows} />
            </div>
          </section>

          <Separator className="shrink-0" />

          <section className="flex min-h-0 flex-1 flex-col p-4">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Lista de perlas
            </h2>
            {counts.length === 0 ? (
              <p className="text-[12px] text-muted-foreground">Pinta para ver las cuentas y su conteo.</p>
            ) : (
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                {counts.map(([idx, n]) => {
                  const b = catalog[idx];
                  if (!b) return null;
                  return (
                    <li
                      key={idx}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-accent"
                      onClick={() => setBead(idx)}
                    >
                      <BeadSwatch hex={b.hex} finish={b.finish} shape={beadType.shape} size={30} />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-[12px] font-semibold">{b.num}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {b.name} · {FINISH_LABEL[b.finish]}
                        </span>
                      </span>
                      <span className="text-[12px] tabular-nums text-muted-foreground">{n}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            {total > 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Total: {total} cuentas · {counts.length} colores
              </p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="palette" className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-2.5">
            <BeadSwatch hex={cur.hex} finish={cur.finish} shape={beadType.shape} size={36} />
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold">{cur.name}</span>
              <span className="block text-[11px] text-muted-foreground">
                {cur.num} · {FINISH_LABEL[cur.finish]}
              </span>
            </span>
          </div>
          <PaletteGrid columns={6} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const [txt, setTxt] = useState(String(value));
  useEffect(() => setTxt(String(value)), [value]);
  useEffect(() => {
    const n = parseInt(txt, 10);
    if (!isNaN(n) && n >= MIN && n <= MAX && n !== value) {
      const t = setTimeout(() => onChange(n), 350);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txt]);

  return (
    <div className="flex-1 space-y-1.5">
      <label className="text-[12px] text-muted-foreground">{label}</label>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="grid h-8 w-8 flex-none place-items-center rounded-l-md border border-input transition-colors hover:bg-accent"
          aria-label={`${label} menos`}
        >
          <Minus size={14} />
        </button>
        <input
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          inputMode="numeric"
          className="h-8 w-full min-w-0 border-y border-input bg-background text-center text-[13px] tabular-nums outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="grid h-8 w-8 flex-none place-items-center rounded-r-md border border-input transition-colors hover:bg-accent"
          aria-label={`${label} más`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
