import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MIYUKI_REFERENCE,
  PRECIOSA_REFERENCE,
  CROSS_BRAND,
  AUGHT_NOTE,
  REFERENCE_SOURCE,
  RefFamily,
} from "../data/beadReference";

function FamilySection({ fam }: { fam: RefFamily }) {
  return (
    <section>
      <div className="mb-1 flex items-center gap-2">
        <h3 className="text-[14px] font-semibold">{fam.label}</h3>
        {fam.inEditor && (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            En el editor
          </span>
        )}
      </div>
      <p className="mb-2 text-[12px] leading-snug text-muted-foreground">{fam.description}</p>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-muted/50 text-left text-muted-foreground">
              <th className="px-2.5 py-1.5 font-medium">Cuenta</th>
              <th className="px-2.5 py-1.5 font-medium">Tamaño</th>
              <th className="px-2.5 py-1.5 font-medium">Agujero</th>
              <th className="px-2.5 py-1.5 text-right font-medium">Uds/g</th>
            </tr>
          </thead>
          <tbody>
            {fam.beads.map((b) => (
              <tr key={b.name} className="border-t border-border align-top">
                <td className="px-2.5 py-1.5">
                  <span className="font-medium">{b.name}</span>
                  {b.note && (
                    <span className="block text-[11px] text-muted-foreground">{b.note}</span>
                  )}
                </td>
                <td className="px-2.5 py-1.5 tabular-nums">{b.size}</td>
                <td className="px-2.5 py-1.5 tabular-nums">{b.hole}</td>
                <td className="px-2.5 py-1.5 text-right tabular-nums">{b.perGram}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function BeadGuide({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[min(92vw,720px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guía de cuentas</DialogTitle>
          <DialogDescription>
            Formas y tamaños de seed beads. No todas se pueden diseñar aún en el editor; se incluyen
            como referencia para conocer otros materiales.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Sistema de tallas */}
          <p className="rounded-lg border border-border bg-muted/30 p-3 text-[12px] leading-snug text-muted-foreground">
            <span className="font-semibold text-foreground">El sistema "/0": </span>
            {AUGHT_NOTE}
          </p>

          {/* Comparativa entre marcas */}
          <section>
            <h3 className="mb-1 text-[14px] font-semibold">Misma talla, distinto tamaño</h3>
            <p className="mb-2 text-[12px] leading-snug text-muted-foreground">
              Diámetro exterior (mm) de la misma talla según marca y forma. La Delica (cilindro) es
              siempre la más estrecha; la Toho, la mayor entre las redondas.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-muted/50 text-left text-muted-foreground">
                    <th className="px-2.5 py-1.5 font-medium">Talla</th>
                    <th className="px-2.5 py-1.5 text-right font-medium">Delica</th>
                    <th className="px-2.5 py-1.5 text-right font-medium">Rocalla Miyuki</th>
                    <th className="px-2.5 py-1.5 text-right font-medium">Toho</th>
                    <th className="px-2.5 py-1.5 text-right font-medium">Preciosa</th>
                  </tr>
                </thead>
                <tbody>
                  {CROSS_BRAND.map((r) => (
                    <tr key={r.aught} className="border-t border-border">
                      <td className="px-2.5 py-1.5 font-medium">{r.aught}</td>
                      <td className="px-2.5 py-1.5 text-right tabular-nums">{r.delica}</td>
                      <td className="px-2.5 py-1.5 text-right tabular-nums">{r.miyukiRound}</td>
                      <td className="px-2.5 py-1.5 text-right tabular-nums">{r.toho}</td>
                      <td className="px-2.5 py-1.5 text-right tabular-nums">{r.preciosa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Miyuki */}
          <h2 className="border-b border-border pb-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Miyuki (japonesas)
          </h2>
          {MIYUKI_REFERENCE.map((fam) => (
            <FamilySection key={fam.key} fam={fam} />
          ))}

          {/* Preciosa */}
          <h2 className="border-b border-border pb-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Preciosa (checas)
          </h2>
          {PRECIOSA_REFERENCE.map((fam) => (
            <FamilySection key={fam.key} fam={fam} />
          ))}

          <p className="border-t border-border pt-3 text-[11px] leading-snug text-muted-foreground">
            {REFERENCE_SOURCE}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
