import { useEffect, useState } from "react";
import { useStore } from "./store";
import TopBar from "./components/TopBar";
import ToolRail from "./components/ToolRail";
import BeadCanvas from "./components/BeadCanvas";
import SidePanel from "./components/SidePanel";
import ColorStrip from "./components/ColorStrip";
import { SlidersHorizontal } from "lucide-react";

export default function App() {
  const theme = useStore((s) => s.theme);
  // panel lateral colapsable en móvil (en escritorio está siempre visible)
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <ToolRail />
        <BeadCanvas />
        <ColorStrip />

        {/* backdrop: solo móvil, al abrir el panel */}
        {panelOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setPanelOpen(false)}
          />
        )}

        <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

        {/* botón flotante para abrir el panel (solo móvil) — abajo-derecha,
            separado de la tira de colores y libre de los controles de zoom */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            aria-label="Opciones del patrón"
            className="fixed bottom-4 right-14 z-30 grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-lg md:hidden"
          >
            <SlidersHorizontal size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
