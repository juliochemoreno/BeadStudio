// === Datos de materiales reales (Miyuki / Toho) ===
// Tamaños y formas según las fichas oficiales de Miyuki y Caravan Beads.
// Delica = cilindro de lados rectos; rocalla redonda = dona/esfera achatada.

export type BeadShape = "cylinder" | "round";

export type Finish =
  | "opaque"
  | "transparent"
  | "matte"
  | "ab"
  | "silverlined"
  | "ceylon"
  | "luster"
  | "metallic"
  | "galvanized"
  | "lined";

export const FINISH_LABEL: Record<Finish, string> = {
  opaque: "Opaco",
  transparent: "Transparente",
  matte: "Mate",
  ab: "AB / Tornasol",
  silverlined: "Forrada en plata",
  ceylon: "Ceylon (perlado)",
  luster: "Lustre",
  metallic: "Metálico",
  galvanized: "Galvanizado",
  lined: "Color-lined",
};

export interface BeadType {
  id: string;
  label: string;
  shape: BeadShape;
  pitchX: number; // separación entre columnas (mm)
  pitchY: number; // separación entre filas (mm)
  hole: number; // diámetro del hueco (mm)
  sizeLabel: string;
}

// pitchX/pitchY = tamaño físico que ocupa cada cuenta en el tejido.
// delica11 está calibrado para coincidir con BeadTool 4.
export const BEAD_TYPES: BeadType[] = [
  { id: "delica11", label: "Miyuki Delica 11/0", shape: "cylinder", pitchX: 1.354, pitchY: 1.749, hole: 0.8, sizeLabel: "1.6 × 1.5 mm" },
  { id: "delica15", label: "Miyuki Delica 15/0", shape: "cylinder", pitchX: 1.0, pitchY: 1.3, hole: 0.7, sizeLabel: "1.3 × 1.0 mm" },
  { id: "delica10", label: "Miyuki Delica 10/0", shape: "cylinder", pitchX: 1.7, pitchY: 2.1, hole: 1.0, sizeLabel: "2.3 × 1.2 mm" },
  { id: "delica8", label: "Miyuki Delica 8/0", shape: "cylinder", pitchX: 2.4, pitchY: 2.5, hole: 1.5, sizeLabel: "2.5 × 2.5 mm" },
  { id: "round15", label: "Miyuki Rocalla 15/0", shape: "round", pitchX: 1.4, pitchY: 1.5, hole: 0.7, sizeLabel: "1.5 × 1.3 mm" },
  { id: "round11", label: "Miyuki Rocalla 11/0", shape: "round", pitchX: 1.8, pitchY: 1.9, hole: 1.0, sizeLabel: "2.0 × 1.0 mm" },
  { id: "round8", label: "Miyuki Rocalla 8/0", shape: "round", pitchX: 2.6, pitchY: 2.8, hole: 1.0, sizeLabel: "3.0 × 2.0 mm" },
  { id: "round6", label: "Miyuki Rocalla 6/0", shape: "round", pitchX: 3.6, pitchY: 3.7, hole: 1.3, sizeLabel: "4.0 × 3.0 mm" },
  { id: "toho11", label: "Toho Round 11/0", shape: "round", pitchX: 2.0, pitchY: 2.0, hole: 1.0, sizeLabel: "≈2.2 × 1.5 mm" },
  { id: "tohocyl", label: "Toho cilíndrica 11/0", shape: "cylinder", pitchX: 1.7, pitchY: 1.7, hole: 0.8, sizeLabel: "≈1.8 × 1.7 mm" },
  { id: "pony9", label: "Pony 9 mm", shape: "round", pitchX: 4.2, pitchY: 4.2, hole: 3.0, sizeLabel: "9 × 6 mm" },
];

export interface Bead {
  num: string; // código del fabricante
  name: string; // nombre comercial
  hex: string;
  finish: Finish;
}

// Subconjunto curado de Miyuki Delica 11/0 con acabado real (color aproximado).
// En producción esto crecería a 1,250+ colores digitalizando las sample cards.
export const BEADS: Bead[] = [
  // --- Opacos ---
  { num: "DB-0010", name: "Black", hex: "#1b1b1d", finish: "opaque" },
  { num: "DB-0200", name: "White Pearl", hex: "#f3efe4", finish: "opaque" },
  { num: "DB-0721", name: "Opaque Yellow", hex: "#f4c20d", finish: "opaque" },
  { num: "DB-1132", name: "Opaque Canary", hex: "#f7d046", finish: "opaque" },
  { num: "DB-0651", name: "Squash", hex: "#e88a2d", finish: "opaque" },
  { num: "DB-0722", name: "Opaque Orange", hex: "#e8651f", finish: "opaque" },
  { num: "DB-0723", name: "Opaque Red", hex: "#c2362b", finish: "opaque" },
  { num: "DB-0727", name: "Opaque Cardinal", hex: "#a91f33", finish: "opaque" },
  { num: "DB-1490", name: "Opaque Pink", hex: "#f2a7bd", finish: "opaque" },
  { num: "DB-0661", name: "Opaque Bright Purple", hex: "#6c3b9c", finish: "opaque" },
  { num: "DB-0726", name: "Opaque Cobalt", hex: "#243c91", finish: "opaque" },
  { num: "DB-0210", name: "Opaque Light Blue", hex: "#9cc3e6", finish: "opaque" },
  { num: "DB-0165", name: "Opaque Turquoise", hex: "#1fa3bd", finish: "opaque" },
  { num: "DB-0656", name: "Opaque Teal", hex: "#147a6e", finish: "opaque" },
  { num: "DB-0724", name: "Opaque Green", hex: "#2f8c40", finish: "opaque" },
  { num: "DB-0733", name: "Opaque Forest", hex: "#1e5a32", finish: "opaque" },
  { num: "DB-0734", name: "Opaque Chocolate", hex: "#4b3528", finish: "opaque" },
  { num: "DB-0653", name: "Opaque Sienna", hex: "#8a4a2b", finish: "opaque" },
  { num: "DB-0763", name: "Opaque Light Green", hex: "#8fb86f", finish: "opaque" },
  { num: "DB-0207", name: "Opaque Cream Luster", hex: "#ecdcbf", finish: "luster" },

  // --- Mate ---
  { num: "DB-0301", name: "Matte Black", hex: "#19191b", finish: "matte" },
  { num: "DB-0351", name: "Matte Opaque White", hex: "#ece8de", finish: "matte" },
  { num: "DB-0751", name: "Matte Opaque Yellow", hex: "#e8be2f", finish: "matte" },
  { num: "DB-0795", name: "Matte Opaque Squash", hex: "#d98233", finish: "matte" },
  { num: "DB-0753", name: "Matte Opaque Red", hex: "#b53430", finish: "matte" },
  { num: "DB-0758", name: "Matte Opaque Grey", hex: "#83868c", finish: "matte" },
  { num: "DB-0756", name: "Matte Opaque Cobalt", hex: "#26407e", finish: "matte" },
  { num: "DB-0759", name: "Matte Opaque Turquoise", hex: "#3a9aa6", finish: "matte" },
  { num: "DB-0877", name: "Matte Opaque Lime AB", hex: "#a6c83b", finish: "matte" },
  { num: "DB-0769", name: "Matte Opaque Tan", hex: "#b89a6b", finish: "matte" },
  { num: "DB-0794", name: "Matte Opaque Olive", hex: "#73762f", finish: "matte" },
  { num: "DB-0388", name: "Matte Opaque Bone", hex: "#e3dcc8", finish: "matte" },
  { num: "DB-0306", name: "Matte Gunmetal", hex: "#3b3d42", finish: "matte" },
  { num: "DB-0310", name: "Matte Black Metallic", hex: "#202126", finish: "matte" },

  // --- Transparentes ---
  { num: "DB-0703", name: "Transparent Orange", hex: "#ef7a3a", finish: "transparent" },
  { num: "DB-0704", name: "Transparent Red", hex: "#cc3030", finish: "transparent" },
  { num: "DB-0708", name: "Transparent Lt Blue", hex: "#86c5e8", finish: "transparent" },
  { num: "DB-0712", name: "Transparent Crystal", hex: "#e9ecf0", finish: "transparent" },
  { num: "DB-0713", name: "Transparent Green", hex: "#4aa85a", finish: "transparent" },
  { num: "DB-0714", name: "Transparent Grey", hex: "#9a9ca0", finish: "transparent" },
  { num: "DB-1311", name: "Dyed Transparent Wine", hex: "#7d2f47", finish: "transparent" },
  { num: "DB-1107", name: "Transparent Amber", hex: "#d99a3a", finish: "transparent" },

  // --- AB / Tornasol ---
  { num: "DB-0202", name: "White Pearl AB", hex: "#efe9dc", finish: "ab" },
  { num: "DB-0164", name: "Opaque Blue AB", hex: "#2f6ec4", finish: "ab" },
  { num: "DB-0163", name: "Opaque Green AB", hex: "#3aa050", finish: "ab" },
  { num: "DB-0874", name: "Matte Tr. Cranberry AB", hex: "#8d2748", finish: "ab" },
  { num: "DB-0879", name: "Matte Tr. Sapphire AB", hex: "#22407e", finish: "ab" },
  { num: "DB-0982", name: "Sparkle Crystal AB", hex: "#e6e9ef", finish: "ab" },
  { num: "DB-0057", name: "Lined Lt Sapphire AB", hex: "#5aa6da", finish: "ab" },

  // --- Silver-lined ---
  { num: "DB-0046", name: "Silver Lined Aqua", hex: "#46c0c8", finish: "silverlined" },
  { num: "DB-0042", name: "Silver Lined Gold", hex: "#d6b24e", finish: "silverlined" },
  { num: "DB-0045", name: "Silver Lined Lt Topaz", hex: "#e0c06a", finish: "silverlined" },
  { num: "DB-0043", name: "Silver Lined Red", hex: "#d63a47", finish: "silverlined" },
  { num: "DB-0047", name: "Silver Lined Cobalt", hex: "#2a52c4", finish: "silverlined" },
  { num: "DB-0605", name: "Silver Lined Magenta", hex: "#c83a86", finish: "silverlined" },
  { num: "DB-0148", name: "Silver Lined Emerald", hex: "#1f9e6a", finish: "silverlined" },

  // --- Metálico / Galvanizado ---
  { num: "DB-1006", name: "Metallic Blue Green Gold AB", hex: "#2e7d86", finish: "metallic" },
  { num: "DB-0021", name: "Metallic Steel Grey", hex: "#5a5d66", finish: "metallic" },
  { num: "DB-0022", name: "Metallic Bronze", hex: "#7a5a34", finish: "metallic" },
  { num: "DB-0029", name: "Metallic Dark Plum", hex: "#5a3450", finish: "metallic" },
  { num: "DB-0034", name: "Bright Gold Plated", hex: "#cda94b", finish: "metallic" },
  { num: "DB-0038", name: "Nickel Plated", hex: "#aeb2b8", finish: "metallic" },
  { num: "DB-0035", name: "Galvanized Silver", hex: "#c9ccd1", finish: "galvanized" },
  { num: "DB-0411", name: "Galvanized Gold", hex: "#c9a45a", finish: "galvanized" },
  { num: "DB-0413", name: "Galvanized Lt Pewter", hex: "#9b9ea4", finish: "galvanized" },
  { num: "DB-1844", name: "Duracoat Galv. Champagne", hex: "#d8c79a", finish: "galvanized" },

  // --- Ceylon / Luster ---
  { num: "DB-0244", name: "Light Rose Ceylon", hex: "#f0b9c4", finish: "ceylon" },
  { num: "DB-0252", name: "Light Grey Ceylon", hex: "#c4c3c0", finish: "ceylon" },
  { num: "DB-0254", name: "Light Peach Ceylon", hex: "#f1c9a0", finish: "ceylon" },
  { num: "DB-0249", name: "Cymophane Purple Ceylon", hex: "#7c47a0", finish: "ceylon" },
  { num: "DB-0231", name: "Lined Crystal Ivory Luster", hex: "#ece1c6", finish: "luster" },
  { num: "DB-0216", name: "Royal Blue Luster", hex: "#284a9c", finish: "luster" },
  { num: "DB-0114", name: "Transparent Wine Luster", hex: "#7d3045", finish: "luster" },

  // --- Color-lined ---
  { num: "DB-0073", name: "Lined Crystal Fuchsia", hex: "#d94f97", finish: "lined" },
  { num: "DB-0233", name: "Lined Crystal Peach", hex: "#f2caa2", finish: "lined" },
  { num: "DB-0237", name: "Lined Crystal Lime", hex: "#bcd24a", finish: "lined" },
  { num: "DB-0058", name: "Lined Crystal Capri Blue", hex: "#3aa0d4", finish: "lined" },
  { num: "DB-0070", name: "Lined Crystal Rose AB", hex: "#e98fae", finish: "lined" },
  { num: "DB-0062", name: "Lined Lt Cranberry", hex: "#c45a7a", finish: "lined" },
  { num: "DB-0287", name: "Lined Sapphire", hex: "#33508f", finish: "lined" },
  { num: "DB-0285", name: "Lined Aqua / Lime", hex: "#5bbf8f", finish: "lined" },
];

export const DEFAULT_BEAD_INDEX = Math.max(
  0,
  BEADS.findIndex((b) => b.num === "DB-1006")
);

export const EMPTY = 65535;
