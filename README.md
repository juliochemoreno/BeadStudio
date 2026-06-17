# BeadStudio — editor de patrones de cuentas (web)

Proyecto inicial inspirado en BeadTool 4, reconstruido como app web moderna.

## Stack

- **React 18 + TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** (UI)
- **Zustand** (estado del lienzo)
- **lucide-react** (iconos)
- Render del patrón en **HTML5 Canvas 2D** con la grilla como `Uint16Array` (índices a la paleta) — clave para rendimiento en patrones grandes.

## Cómo correrlo

```bash
cd beadtool-web
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en dist/
```

## Qué incluye (paridad con BeadTool + mejoras)

- **Renderizado realista**: cada cuenta se dibuja con su forma real (cilindro Delica / dona rocalla), proporción de tamaño a escala y sombreado según el **acabado** (opaco, mate, transparente, AB/tornasol, silver-lined, perlado, metálico, galvanizado, color-lined). Con mucho zoom-out cae a relleno plano por rendimiento.
- **Tipos de cuenta reales** con dimensiones de Miyuki/Toho: Delica 8/10/11/15, rocallas redondas 6/8/11/15, Toho 11/0.
- **Catálogo de color con acabado**: paleta Delica buscable y filtrable por acabado, con número de fabricante + nombre comercial.
- Puntadas **square/telar, brick y peyote** (offset de media cuenta).
- **Dimensiones físicas en vivo** (pulgadas y cm) calculadas según el tipo de cuenta — como BeadTool (Delica 11/0 calibrado para reproducir sus números).
- **Herramientas**: lápiz, borrador, relleno (flood fill), cuentagotas, línea, rectángulo, óvalo, triángulo, diamante. Con preview en vivo de las formas.
- **Paleta Miyuki Delica** buscable, con número de fabricante + nombre comercial.
- **Lista de perlas** con conteo automático por color (cuántas cuentas necesitas).
- **Layout de dos pestañas** (Diseñar / Paleta).
- Zoom y pan (rueda, barra espaciadora o botón medio), deshacer/rehacer (Ctrl/Cmd+Z).
- Export a **PNG** y a **word chart** (receta escrita fila por fila).

## Arquitectura (resumen)

```
src/
  data/beads.ts      Tipos de cuenta (mm) + paleta Delica
  lib/
    color.ts         RGB→Lab y ΔE para conversión foto→patrón (futuro)
    shapes.ts        Celdas de cada herramienta de forma
    export.ts        PNG + word chart
  store.ts           Estado global (grid, tool, undo/redo) con Zustand
  components/
    TopBar.tsx       Barra superior + export
    ToolRail.tsx     Barra de herramientas izquierda
    BeadCanvas.tsx   Lienzo Canvas 2D (draw + pointer + zoom/pan)
    SidePanel.tsx    Panel derecho (Diseñar / Paleta)
```

## Próximos pasos sugeridos

1. Conversión **foto → patrón** (ya está `lib/color.ts` con Lab/ΔE; falta UI de subir imagen, recortar y cuantizar).
2. Persistencia: guardar/cargar en nube + auth (freemium).
3. **PWA** (instalable, offline) para iPad/Android.
4. Grillas muy grandes (400×400+) con WebGL si Canvas 2D se queda corto.
5. Export a **PDF** imprimible con leyenda y conteo.
6. Más bibliotecas de cuentas (Toho, Preciosa) desde base de datos.
