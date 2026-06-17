import { useStore, ProjectData } from "../store";

export function saveProject() {
  const s = useStore.getState();
  const data: ProjectData = {
    version: 1,
    cols: s.cols,
    rows: s.rows,
    stitch: s.stitch,
    paletteId: s.paletteId,
    grid: Array.from(s.grid),
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.download = "patron-beadstudio.json";
  a.href = URL.createObjectURL(blob);
  a.click();
}

export function openProject() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as ProjectData;
        if (!data.cols || !data.rows || !Array.isArray(data.grid)) throw new Error("formato");
        useStore.getState().loadProject(data);
      } catch {
        alert("No se pudo abrir el archivo: formato inválido.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
