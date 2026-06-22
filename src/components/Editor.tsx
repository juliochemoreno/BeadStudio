import { useState } from "react";
import TopBar from "./TopBar";
import ToolRail from "./ToolRail";
import BeadCanvas from "./BeadCanvas";
import SidePanel from "./SidePanel";
import ColorStrip from "./ColorStrip";
import { SlidersHorizontal } from "lucide-react";

// El editor completo. Se usa tanto a pantalla completa (vista "editor") como
// embebido dentro de la landing (sección de demo). Por eso los overlays móviles
// usan `absolute` (contenidos en este marco) en vez de `fixed` (viewport).
export default function Editor() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="relative flex min-h-0 flex-1">
        <ToolRail />
        <BeadCanvas />
        <ColorStrip />

        {/* backdrop: solo móvil, al abrir el panel */}
        {panelOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setPanelOpen(false)}
          />
        )}

        <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

        {/* botón flotante para abrir el panel (solo móvil) */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            aria-label="Opciones del patrón"
            className="absolute bottom-4 right-14 z-30 grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-lg md:hidden"
          >
            <SlidersHorizontal size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
