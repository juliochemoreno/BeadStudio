// Guía de referencia de cuentas Miyuki — datos verificados contra la ficha oficial
// de Miyuki (miyuki-beads.co.jp) y distribuidores (Fire Mountain Gems, Caravan
// Beads, Perles & Co, That Bead Lady, DIY Beads). Es material informativo: no
// todas estas formas se pueden diseñar en el editor todavía.
//
// Notas importantes de medición:
//  - Miyuki publica SOLO el diámetro exterior y el agujero de las rocallas; el
//    "largo" (eje del hueco) lo añaden los distribuidores y no está estandarizado.
//  - Todas las medidas son aproximadas: el acabado (galvanizado, metálico,
//    forrado) altera ligeramente el tamaño y el conteo por gramo.

export interface RefBead {
  name: string;
  size: string; // dimensiones legibles, p. ej. "1.6 × 1.3 mm" o "Ø 2.0 mm"
  hole: string; // diámetro del agujero
  perGram: string; // cuentas por gramo (aprox.)
  note?: string;
}

export interface RefFamily {
  key: string;
  label: string;
  description: string;
  inEditor?: boolean; // la geometría está disponible en el selector "Tipo de cuenta"
  beads: RefBead[];
}

export const REFERENCE_SOURCE =
  "Fuentes: fichas oficiales de Miyuki (miyuki-beads.co.jp) y Preciosa Ornela (preciosa-ornela.com), más distribuidores (Fire Mountain Gems, Caravan, Perles & Co, Bluestreak) y Wikipedia para el sistema de tallas. Medidas aproximadas: el largo y las unidades/gramo varían con el acabado.";

// El sistema de tallas "/0" (aughts) explicado para el usuario.
export const AUGHT_NOTE =
  "Las tallas 11/0, 15/0… (\"aughts\") son una convención tradicional del siglo XIX, basada aproximadamente en cuántas cuentas caben en una pulgada — NO un estándar de milímetros. A mayor número, más pequeña la cuenta. Como no hay norma de industria, el mismo número mide distinto según la marca y la forma: la variación entre fabricantes puede superar la variación dentro de una misma talla.";

export interface CrossRow {
  aught: string;
  delica: string; // cilindro
  miyukiRound: string;
  toho: string;
  preciosa: string;
}

// Diámetro exterior (mm) de la misma talla en distintos productos — demuestra que
// el mismo "/0" no equivale al mismo tamaño. "—" = esa marca no fabrica esa talla.
export const CROSS_BRAND: CrossRow[] = [
  { aught: "15/0", delica: "1.3", miyukiRound: "1.5", toho: "—", preciosa: "1.5" },
  { aught: "11/0", delica: "1.6", miyukiRound: "2.0", toho: "2.2", preciosa: "2.1" },
  { aught: "10/0", delica: "2.2", miyukiRound: "—", toho: "—", preciosa: "2.3" },
  { aught: "8/0", delica: "2.5", miyukiRound: "3.0", toho: "~3.0", preciosa: "2.9" },
  { aught: "6/0", delica: "—", miyukiRound: "4.0", toho: "—", preciosa: "4.1" },
];

export const MIYUKI_REFERENCE: RefFamily[] = [
  {
    key: "delica",
    label: "Delica (cilíndricas)",
    description:
      "Cilindros de paredes rectas y extremos planos, cortados con precisión. Encajan en rejilla uniforme: las favoritas para peyote, brick y telar. El diámetro y el agujero son muy estables entre fuentes; el largo es aproximado.",
    inEditor: true,
    beads: [
      { name: "Delica 15/0 (DBS)", size: "1.3 × 1.1 mm", hole: "0.65 mm", perGram: "~350" },
      { name: "Delica 11/0 (DB)", size: "1.6 × 1.3 mm", hole: "0.8 mm", perGram: "~200", note: "La más popular." },
      { name: "Delica 10/0 (DBM)", size: "2.2 × 1.2 mm", hole: "1.0 mm", perGram: "~108" },
      { name: "Delica 8/0 (DBL)", size: "2.5 × 2.5 mm", hole: "1.5 mm", perGram: "~30" },
      { name: "Delica 11/0 hex-cut (DBC)", size: "1.6 × 1.3 mm", hole: "0.8 mm", perGram: "~200", note: "Igual que la DB 11/0 pero facetada (6 caras)." },
    ],
  },
  {
    key: "round",
    label: "Rocallas redondas",
    description:
      "Cuentas con forma de dona achatada y agujero grande. Sistema de talla inverso: a mayor número, más pequeña la cuenta. Miyuki publica solo el diámetro exterior y el agujero (valores oficiales del fabricante).",
    inEditor: true,
    beads: [
      { name: "Rocalla 15/0", size: "Ø 1.5 mm", hole: "0.7 mm", perGram: "250" },
      { name: "Rocalla 11/0", size: "Ø 2.0 mm", hole: "0.8 mm", perGram: "110", note: "La talla más usada." },
      { name: "Rocalla 8/0", size: "Ø 3.0 mm", hole: "1.1 mm", perGram: "39" },
      { name: "Rocalla 6/0", size: "Ø 4.0 mm", hole: "1.5 mm", perGram: "12" },
      { name: "Rocalla 5/0 (E)", size: "Ø 5.0 mm", hole: "2.0 mm", perGram: "~7" },
      { name: "Rocalla 1/0 (EE)", size: "Ø 6.5 mm", hole: "2.9 mm", perGram: "~3" },
    ],
  },
  {
    key: "hex",
    label: "Hex-cut (facetadas)",
    description:
      "Rocallas cortadas en 6 caras (cilindro corto hexagonal) que reflejan más la luz. Mismo tamaño nominal que la rocalla redonda equivalente.",
    beads: [
      { name: "Hex 15/0 (15C)", size: "1.5 × 1.3 mm", hole: "0.7 mm", perGram: "~250" },
      { name: "Hex 11/0 (11C)", size: "≈ 2.0 mm", hole: "0.8 mm", perGram: "~110" },
      { name: "Hex 8/0 (8C)", size: "≈ 3.0 mm", hole: "1.1 mm", perGram: "~39" },
    ],
  },
  {
    key: "tila",
    label: "Tila (azulejos de 2 agujeros)",
    description:
      "Cuentas planas tipo azulejo con dos agujeros paralelos. Comparten largo (5 mm), grosor (1.9 mm) y agujeros (0.8 mm); solo cambia el ancho.",
    beads: [
      { name: "Tila (TL)", size: "5 × 5 × 1.9 mm", hole: "2 × 0.8 mm", perGram: "~11" },
      { name: "Half Tila (HTL)", size: "5 × 2.3 × 1.9 mm", hole: "2 × 0.8 mm", perGram: "~25" },
      { name: "Quarter Tila (QTL)", size: "5 × 1.2 × 1.9 mm", hole: "2 × 0.8 mm", perGram: "~48" },
    ],
  },
  {
    key: "bugle",
    label: "Canutillos (bugles)",
    description:
      "Tubos de vidrio rectos o retorcidos (twisted). El número mayor es la longitud del tubo; el menor, el diámetro.",
    beads: [
      { name: "Canutillo 3 mm (BGL1)", size: "1.0 × 3 mm", hole: "0.65 mm", perGram: "~83" },
      { name: "Canutillo 6 mm (BGL2)", size: "1.5 × 6 mm", hole: "0.8 mm", perGram: "~38" },
      { name: "Twisted 2×6 mm (TW206)", size: "2.0 × 6 mm", hole: "0.8 mm", perGram: "~31" },
      { name: "Twisted 2×12 mm (TW2012)", size: "2.0 × 12 mm", hole: "0.8 mm", perGram: "~18" },
      { name: "Twisted 2.7×12 mm (TW2712)", size: "2.7 × 12 mm", hole: "1.0 mm", perGram: "~9" },
    ],
  },
  {
    key: "drop",
    label: "Gotas (drops) y fringe",
    description:
      "Cuentas en forma de gota con el agujero cerca de la punta; se usan para flecos y bordes. La Long Magatama tiene el agujero en ángulo y cuelga inclinada.",
    beads: [
      { name: "Drop 2.8 mm (DP28)", size: "2.0 × 2.8 mm", hole: "0.65 mm", perGram: "~36" },
      { name: "Drop 3.4 mm (DP)", size: "3.0 × 3.4 mm", hole: "0.65 mm", perGram: "~18" },
      { name: "Long Drop (LDP)", size: "5.5 × 3 × 3 mm", hole: "0.8 mm", perGram: "~13" },
    ],
  },
  {
    key: "magatama",
    label: "Magatama",
    description:
      "Gotas rechonchas perforadas por arriba (top-drilled), clásicas para flecos. La Long Magatama es más alargada, en forma de pétalo.",
    beads: [
      { name: "Magatama 4 mm (MA4)", size: "4 × 4 mm", hole: "1.3 mm", perGram: "~12" },
      { name: "Long Magatama (LMA)", size: "4 × 7 mm", hole: "1.0–1.4 mm", perGram: "~8", note: "El agujero varía según el color." },
    ],
  },
  {
    key: "cube",
    label: "Cubos",
    description:
      "Cuentas cúbicas con un agujero que atraviesa de cara a cara. Dan un aspecto geométrico y un brillo distinto al de las redondas.",
    beads: [
      { name: "Cubo 1.8 mm (SB18)", size: "1.8 × 1.8 × 1.8 mm", hole: "1.0 mm", perGram: "~82" },
      { name: "Cubo 3 mm (SB3)", size: "3 × 3 × 3 mm", hole: "1.3 mm", perGram: "~21" },
      { name: "Cubo 4 mm (SB)", size: "4 × 4 × 4 mm", hole: "1.4 mm", perGram: "~10", note: "Tamaño real ≈ 3.7–4.0 mm." },
    ],
  },
  {
    key: "triangle",
    label: "Triángulos afilados (Sharp)",
    description:
      "Cuentas de sección triangular con vértices afilados (código STR). El número de talla no son milímetros; la cara real es más pequeña.",
    beads: [
      { name: "Sharp Triangle 10/0 (STR10)", size: "2.1 × 2.1 mm", hole: "0.8 mm", perGram: "~85" },
      { name: "Sharp Triangle 8/0 (STR8)", size: "2.6 × 2.6 mm", hole: "1.0 mm", perGram: "~49" },
      { name: "Sharp Triangle 5/0 (STR5)", size: "4.2 × 4.2 mm", hole: "1.3 mm", perGram: "~12" },
    ],
  },
  {
    key: "special",
    label: "Spacers y especiales",
    description:
      "Rondelas finas (spacers) para separar, y formas con relieve como la Berry (cacahuete) que anida al ensartarse.",
    beads: [
      { name: "Spacer 2.2 mm (SPR22)", size: "2.2 × 1.0 mm", hole: "0.9 mm", perGram: "~130" },
      { name: "Spacer 3 mm (SPR3)", size: "3.0 × 1.3 mm", hole: "1.3 mm", perGram: "~65" },
      { name: "Triangle Spacer (SPTR)", size: "2.8 × 1.3 mm", hole: "1.0 mm", perGram: "~75" },
      { name: "Berry (BB)", size: "4.5 × 3 × 2.5 mm", hole: "0.8 mm", perGram: "~23" },
    ],
  },
];

// Cuentas checas (Preciosa Ornela). Preciosa NO publica una tabla talla→mm en su
// web; las medidas provienen de distribuidores autorizados (Bluestreak, ScaraBeads,
// crystalsandbeadsforfriends) cruzados. Son más irregulares que las japonesas y se
// venden tradicionalmente en mazos (hanks).
export const PRECIOSA_REFERENCE: RefFamily[] = [
  {
    key: "preciosa-round",
    label: "Rocallas checas (Preciosa)",
    description:
      "Seed beads checas de perfil redondeado/orgánico, con más variación entre piezas que las japonesas. Misma numeración inversa. Frente a la Miyuki del mismo número: diámetro parecido pero agujero algo menor (la 11/0 checa ≈ 0.6 mm vs 0.7–0.8 mm japonesa).",
    beads: [
      { name: "Rocalla checa 6/0", size: "Ø 4.1 mm", hole: "0.9 mm", perGram: "~13" },
      { name: "Rocalla checa 7/0", size: "Ø 3.5 mm", hole: "1.0 mm", perGram: "~30" },
      { name: "Rocalla checa 8/0", size: "Ø 2.9 mm", hole: "0.9 mm", perGram: "~42" },
      { name: "Rocalla checa 9/0", size: "Ø 2.6 mm", hole: "0.9 mm", perGram: "~65" },
      { name: "Rocalla checa 10/0", size: "Ø 2.3 mm", hole: "0.8 mm", perGram: "~90" },
      { name: "Rocalla checa 11/0", size: "Ø 2.1 mm", hole: "0.6 mm", perGram: "~130", note: "La más usada; se vende en mazos." },
      { name: "Rocalla checa 15/0", size: "Ø 1.5 mm", hole: "~0.6 mm", perGram: "~290" },
    ],
  },
  {
    key: "preciosa-other",
    label: "Otras cuentas checas (Preciosa)",
    description:
      "Cortes y formas prensadas características del cristal checo. Preciosa rara vez publica el agujero, así que esos valores son aproximados (cuentas prensadas, varían pieza a pieza).",
    beads: [
      { name: "Charlotte / one-cut 13/0", size: "Ø 1.7 mm", hole: "0.4 mm", perGram: "~200", note: "Rocalla con 1 faceta." },
      { name: "Two-cut (hexagonal)", size: "1.6–2.7 mm (12/0–8/0)", hole: "~0.6–0.9 mm", perGram: "—", note: "Tubo de sección hexagonal." },
      { name: "Three-cut", size: "1.6–2.5 mm (12/0–8/0)", hole: "~0.6–0.9 mm", perGram: "—", note: "Hexagonal con facetas aleatorias." },
      { name: "Twin (2 agujeros)", size: "2.5 × 5 mm", hole: "2 × ~0.8 mm", perGram: "~19" },
      { name: "Farfalle / mariposa", size: "3.2 × 6.5 mm", hole: "elíptico central", perGram: "~7.6" },
      { name: "Pip (pétalo)", size: "5 × 7 mm", hole: "~0.7–0.9 mm", perGram: "~6.6" },
      { name: "Chilli (2 agujeros)", size: "4 × 11 mm", hole: "~0.8 mm", perGram: "~4" },
      { name: "Ripple (disco ondulado)", size: "Ø 12 × 3 mm", hole: "central", perGram: "~1.2" },
    ],
  },
];
