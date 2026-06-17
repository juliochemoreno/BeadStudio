import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MIYUKI_REFERENCE, REFERENCE_SOURCE } from "../data/beadReference";

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
          <DialogTitle>Guía de cuentas Miyuki</DialogTitle>
          <DialogDescription>
            Formas y tamaños de la gama Miyuki. No todas se pueden diseñar aún en el editor; se
            incluyen como referencia para conocer otros materiales.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {MIYUKI_REFERENCE.map((fam) => (
            <section key={fam.key}>
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
          ))}

          <p className="border-t border-border pt-3 text-[11px] leading-snug text-muted-foreground">
            {REFERENCE_SOURCE}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
