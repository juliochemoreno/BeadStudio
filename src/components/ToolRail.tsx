import { useStore, ToolId } from "../store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Minus,
  Square,
  SquareDashed,
  Circle,
  Triangle,
  Diamond,
  BoxSelect,
} from "lucide-react";

const GROUPS: { id: ToolId; icon: typeof Pencil; label: string }[][] = [
  [{ id: "select", icon: BoxSelect, label: "Seleccionar / mover" }],
  [
    { id: "pencil", icon: Pencil, label: "Lápiz" },
    { id: "eraser", icon: Eraser, label: "Borrar" },
    { id: "fill", icon: PaintBucket, label: "Relleno" },
    { id: "picker", icon: Pipette, label: "Cuentagotas" },
  ],
  [
    { id: "line", icon: Minus, label: "Línea" },
    { id: "rect", icon: Square, label: "Rectángulo" },
    { id: "oval", icon: Circle, label: "Óvalo" },
    { id: "triangle", icon: Triangle, label: "Triángulo" },
    { id: "diamond", icon: Diamond, label: "Diamante" },
  ],
];

export default function ToolRail() {
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const shapeFill = useStore((s) => s.shapeFill);
  const toggleShapeFill = useStore((s) => s.toggleShapeFill);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex w-12 flex-col items-center gap-1 border-r border-border bg-card py-2">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col items-center gap-1">
            {gi > 0 && <Separator className="my-1 w-6" />}
            {group.map(({ id, icon: Icon, label }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setTool(id)}
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}

        <Separator className="my-1 w-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleShapeFill}
              aria-label="Relleno o contorno"
            >
              {shapeFill ? <Square size={18} className="fill-current" /> : <SquareDashed size={18} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {shapeFill ? "Formas: relleno" : "Formas: contorno"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
