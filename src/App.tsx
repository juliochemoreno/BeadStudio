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

        {/* botón flotante para abrir el panel (solo móvil) */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg md:hidden"
          >
            <SlidersHorizontal size={16} /> Opciones
          </button>
        )}
      </div>
    </div>
  );
}
