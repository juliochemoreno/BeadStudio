import { useEffect } from "react";
import { useStore } from "./store";
import TopBar from "./components/TopBar";
import ToolRail from "./components/ToolRail";
import BeadCanvas from "./components/BeadCanvas";
import SidePanel from "./components/SidePanel";
import ColorStrip from "./components/ColorStrip";

export default function App() {
  const theme = useStore((s) => s.theme);
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
        <SidePanel />
      </div>
    </div>
  );
}
