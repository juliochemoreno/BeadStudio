import { useState } from "react";
import { useStore } from "../store";
import { exportPNG, exportWordChart, printPattern } from "../lib/export";
import { saveProject, openProject } from "../lib/project";
import BeadGuide from "./BeadGuide";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Undo2,
  Redo2,
  Trash2,
  Image,
  FileText,
  FolderOpen,
  Save,
  Printer,
  Download,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";

function getState() {
  return useStore.getState();
}
function doExportPng() {
  const { grid, cols, rows, stitch, beadTypeId, catalogId, pro } = getState();
  exportPNG(grid, cols, rows, stitch, beadTypeId, catalogId, !pro);
}
function doExportChart() {
  const { grid, cols, rows, catalogId, pro } = getState();
  exportWordChart(grid, cols, rows, catalogId, !pro);
}
function doPrint() {
  const { grid, cols, rows, stitch, beadTypeId, catalogId, pro } = getState();
  printPattern(grid, cols, rows, stitch, beadTypeId, catalogId, !pro);
}

export default function TopBar() {
  const showNumbers = useStore((s) => s.showNumbers);
  const schematic = useStore((s) => s.schematic);
  const theme = useStore((s) => s.theme);
  const units = useStore((s) => s.units);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <>
      <BeadGuide open={guideOpen} onOpenChange={setGuideOpen} />
      <header className="flex h-9 items-center gap-1 border-b border-border bg-card px-2">
        <div className="mr-1 flex items-center gap-1.5 pl-1 pr-2">
          <LogoIcon />
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            Bead<span className="text-brand">Studio</span>
          </span>
        </div>

        <Menu label="Archivo">
          <DropdownMenuItem onClick={() => getState().clear()}>Nuevo lienzo</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openProject}>
            <FolderOpen size={14} /> Abrir proyecto…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={saveProject}>
            <Save size={14} /> Guardar proyecto <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Download size={14} /> Exportar
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={doExportPng}>
                <Image size={14} /> Imagen PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={doExportChart}>
                <FileText size={14} /> Word chart
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={doPrint}>
            <Printer size={14} /> Imprimir… <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Menu>

        <Menu label="Editar">
          <DropdownMenuItem onClick={() => getState().undo()}>
            <Undo2 size={14} /> Deshacer <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().redo()}>
            <Redo2 size={14} /> Rehacer <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => getState().selectAll()}>
            Seleccionar todo <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().deselect()}>Deseleccionar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => getState().cutSelection()}>
            Cortar <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().copySelection()}>
            Copiar <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().pasteClipboard()}>
            Pegar <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().deleteSelection()}>
            Eliminar selección <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => getState().mirrorSelection("h")}>
            <FlipHorizontal2 size={14} /> Reflejar horizontal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().mirrorSelection("v")}>
            <FlipVertical2 size={14} /> Reflejar vertical
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().rotateSelection("left")}>
            <RotateCcw size={14} /> Rotar a la izquierda
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getState().rotateSelection("right")}>
            <RotateCw size={14} /> Rotar a la derecha
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => getState().clear()}>
            <Trash2 size={14} /> Limpiar todo
          </DropdownMenuItem>
        </Menu>

        <Menu label="Ver">
          <DropdownMenuLabel>Vista</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showNumbers}
            onCheckedChange={() => getState().toggleNumbers()}
          >
            Numeración del grid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={useStore((s) => s.showRulers)}
            onCheckedChange={() => getState().toggleRulers()}
          >
            Reglas de medición
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={schematic}
            onCheckedChange={() => getState().toggleSchematic()}
          >
            Vista esquemática (celdas planas)
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Ajustes</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={units === "cm"}
            onCheckedChange={() => getState().toggleUnits()}
          >
            Sistema métrico (cm)
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />} Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(v) => {
                  if (v !== getState().theme) getState().toggleTheme();
                }}
              >
                <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Oscuro</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </Menu>

        <Menu label="Ayuda">
          <DropdownMenuItem onClick={() => setTimeout(() => setGuideOpen(true), 10)}>
            <BookOpen size={14} /> Guía de cuentas
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Atajos</DropdownMenuLabel>
          <DropdownMenuItem disabled>Deshacer · ⌘Z</DropdownMenuItem>
          <DropdownMenuItem disabled>Rehacer · ⇧⌘Z</DropdownMenuItem>
          <DropdownMenuItem disabled>Mover lienzo · Espacio + arrastrar</DropdownMenuItem>
          <DropdownMenuItem disabled>Zoom · rueda del ratón</DropdownMenuItem>
        </Menu>
      </header>
    </>
  );
}

function LogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="BeadStudio" role="img">
      <rect width="24" height="24" rx="6" fill="hsl(var(--brand))" />
      <g fill="#ffffff" opacity="0.96">
        <rect x="4" y="5" width="4" height="5" rx="2" />
        <rect x="10" y="5" width="4" height="5" rx="2" />
        <rect x="16" y="5" width="4" height="5" rx="2" />
        <rect x="7" y="11.5" width="4" height="5" rx="2" />
        <rect x="13" y="11.5" width="4" height="5" rx="2" />
      </g>
    </svg>
  );
}

function Menu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 font-normal">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

