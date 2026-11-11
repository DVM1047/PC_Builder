import {
  Box,
  CircuitBoard,
  Cpu,
  Fan,
  HardDrive,
  Layers,
  MemoryStick,
  Plug,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------- types --------------------------------- */

export type Socket = "LGA1700" | "AM4" | "AM5";
export type MemType = "DDR4" | "DDR5";
export type FormFactor = "ITX" | "mATX" | "ATX" | "E-ATX";

export type CategoryKey =
  | "cpu"
  | "cooler"
  | "motherboard"
  | "memory"
  | "storage"
  | "gpu"
  | "psu"
  | "case";

export interface Category {
  key: CategoryKey;
  num: string;
  label: string;
  short: string;
  blurb: string;
  icon: LucideIcon;
}

export interface Part {
  id: string;
  category: CategoryKey;
  maker: string;
  name: string;
  price: number; // INR, Indian street price
  tier: number; // 1 - 10 performance tier
  image: string;
  blurb: string;
  stats: [string, string][];
  socket?: Socket; // cpu / motherboard
  socketSupport?: Socket[]; // cooler
  memType?: MemType; // ram / motherboard
  formFactor?: FormFactor; // motherboard
  caseSupport?: FormFactor[]; // case
  watt?: number; // cpu / gpu typical draw
  capacity?: number; // psu watts
  tag?: "BEST VALUE" | "POPULAR" | "OVERKILL" | "NEW";
}

export type SelectionState = Record<CategoryKey, Part | null>;

/* ------------------------------- categories ------------------------------- */

export const CATEGORIES: Category[] = [
  { key: "cpu", num: "01", label: "Processor", short: "CPU", blurb: "The brain. Socket decides your motherboard.", icon: Cpu },
  { key: "cooler", num: "02", label: "CPU Cooler", short: "COOLER", blurb: "Keep clocks high, temps low.", icon: Fan },
  { key: "motherboard", num: "03", label: "Motherboard", short: "BOARD", blurb: "Socket + RAM type lock your platform.", icon: CircuitBoard },
  { key: "memory", num: "04", label: "Memory", short: "RAM", blurb: "DDR4 or DDR5 — must match the board.", icon: MemoryStick },
  { key: "storage", num: "05", label: "Storage", short: "SSD", blurb: "NVMe Gen4 for instant level loads.", icon: HardDrive },
  { key: "gpu", num: "06", label: "Graphics Card", short: "GPU", blurb: "Frames win games. Biggest FPS lever.", icon: Layers },
  { key: "psu", num: "07", label: "Power Supply", short: "PSU", blurb: "Headroom today = upgrades tomorrow.", icon: Plug },
  { key: "case", num: "08", label: "Cabinet", short: "CASE", blurb: "Your rig's armour. Fit the board inside.", icon: Box },
];

export const emptySelection = (): SelectionState => ({
  cpu: null,
  cooler: null,
  motherboard: null,
  memory: null,
  storage: null,
  gpu: null,
  psu: null,
  case: null,
});

/* --------------------------------- images --------------------------------- */

const IMG = {
  cpu: "/images/cpu.jpg",
  gpu: "/images/gpu.jpg",
  motherboard: "/images/motherboard.jpg",
  ram: "/images/ram.jpg",
  storage: "/images/storage.jpg",
  psu: "/images/psu.jpg",
  cooler: "/images/cooler.jpg",
  caseBlack: "/images/case-black.jpg",
  caseWhite: "/images/case-white.jpg",
  caseCompact: "/images/case-compact.jpg",
};

/* ---------------------------------- parts --------------------------------- */

export const PARTS: Part[] = [
  /* ------------------------------- processors ------------------------------ */
  {
    id: "i3-12100f", category: "cpu", maker: "Intel", name: "Core i3-12100F",
    price: 7650, tier: 4, image: IMG.cpu, socket: "LGA1700", watt: 89, tag: "BEST VALUE",
    blurb: "Quad-core budget king. Laughs at 1080p esports titles.",
    stats: [["Cores / Threads", "4P / 8T"], ["Boost", "4.3 GHz"], ["Socket", "LGA1700"], ["TDP", "89 W"]],
  },
  {
    id: "r5-5600", category: "cpu", maker: "AMD", name: "Ryzen 5 5600",
    price: 11050, tier: 5, image: IMG.cpu, socket: "AM4", watt: 65,
    blurb: "AM4's last legend. Cheap, cool, still quick.",
    stats: [["Cores / Threads", "6 / 12"], ["Boost", "4.4 GHz"], ["Socket", "AM4"], ["TDP", "65 W"]],
  },
  {
    id: "i5-12400f", category: "cpu", maker: "Intel", name: "Core i5-12400F",
    price: 11400, tier: 5, image: IMG.cpu, socket: "LGA1700", watt: 117, tag: "POPULAR",
    blurb: "India's favourite mid-range chip for a reason.",
    stats: [["Cores / Threads", "6P / 12T"], ["Boost", "4.4 GHz"], ["Socket", "LGA1700"], ["TDP", "117 W"]],
  },
  {
    id: "r5-7600x", category: "cpu", maker: "AMD", name: "Ryzen 5 7600X",
    price: 21490, tier: 7, image: IMG.cpu, socket: "AM5", watt: 105,
    blurb: "AM5 entry ticket. DDR5 speed on a sensible budget.",
    stats: [["Cores / Threads", "6 / 12"], ["Boost", "5.3 GHz"], ["Socket", "AM5"], ["TDP", "105 W"]],
  },
  {
    id: "i5-13600k", category: "cpu", maker: "Intel", name: "Core i5-13600K",
    price: 26490, tier: 7, image: IMG.cpu, socket: "LGA1700", watt: 181,
    blurb: "14-core hybrid monster. Games hard, renders harder.",
    stats: [["Cores / Threads", "6P+8E / 20T"], ["Boost", "5.1 GHz"], ["Socket", "LGA1700"], ["TDP", "181 W"]],
  },
  {
    id: "r7-7800x3d", category: "cpu", maker: "AMD", name: "Ryzen 7 7800X3D",
    price: 35450, tier: 8, image: IMG.cpu, socket: "AM5", watt: 120, tag: "BEST VALUE",
    blurb: "3D V-Cache. The fastest gaming CPU money can buy.",
    stats: [["Cores / Threads", "8 / 16"], ["Game Cache", "96 MB"], ["Socket", "AM5"], ["TDP", "120 W"]],
  },
  {
    id: "i7-14700k", category: "cpu", maker: "Intel", name: "Core i7-14700K",
    price: 38950, tier: 8, image: IMG.cpu, socket: "LGA1700", watt: 219,
    blurb: "20 threads of entropy for creators who also frag.",
    stats: [["Cores / Threads", "8P+12E / 28T"], ["Boost", "5.6 GHz"], ["Socket", "LGA1700"], ["TDP", "219 W"]],
  },
  {
    id: "r9-7950x", category: "cpu", maker: "AMD", name: "Ryzen 9 7950X",
    price: 47900, tier: 9, image: IMG.cpu, socket: "AM5", watt: 170,
    blurb: "16 cores. Render farms fear it.",
    stats: [["Cores / Threads", "16 / 32"], ["Boost", "5.7 GHz"], ["Socket", "AM5"], ["TDP", "170 W"]],
  },
  {
    id: "i9-14900k", category: "cpu", maker: "Intel", name: "Core i9-14900K",
    price: 51900, tier: 9, image: IMG.cpu, socket: "LGA1700", watt: 253, tag: "OVERKILL",
    blurb: "6 GHz out of the box. Bring a serious cooler.",
    stats: [["Cores / Threads", "8P+16E / 32T"], ["Boost", "6.0 GHz"], ["Socket", "LGA1700"], ["TDP", "253 W"]],
  },

  /* -------------------------------- coolers -------------------------------- */
  {
    id: "ag400", category: "cooler", maker: "Deepcool", name: "AG400",
    price: 1790, tier: 4, image: IMG.cooler, socketSupport: ["LGA1700", "AM4"], watt: 5,
    blurb: "Single-tower starter. No AM5 mounting kit in the box.",
    stats: [["Type", "Air · 120mm"], ["Heatpipes", "4"], ["Sockets", "1700 / AM4"], ["Noise", "31 dBA"]],
  },
  {
    id: "hyper212", category: "cooler", maker: "Cooler Master", name: "Hyper 212 Halo",
    price: 2940, tier: 5, image: IMG.cooler, socketSupport: ["LGA1700", "AM4", "AM5"], watt: 4,
    blurb: "The dictionary definition of 'good enough'.",
    stats: [["Type", "Air · 120mm"], ["Heatpipes", "4"], ["Sockets", "All modern"], ["Noise", "27 dBA"]],
  },
  {
    id: "ak620", category: "cooler", maker: "Deepcool", name: "AK620",
    price: 5590, tier: 6, image: IMG.cooler, socketSupport: ["LGA1700", "AM4", "AM5"], watt: 6, tag: "BEST VALUE",
    blurb: "Dual-tower sleeper. Handles 200W without drama.",
    stats: [["Type", "Air · Dual tower"], ["TDP rating", "260 W"], ["Sockets", "All modern"], ["Noise", "28 dBA"]],
  },
  {
    id: "nhd15", category: "cooler", maker: "Noctua", name: "NH-D15 chromax.black",
    price: 9890, tier: 7, image: IMG.cooler, socketSupport: ["LGA1700", "AM4", "AM5"], watt: 3, tag: "POPULAR",
    blurb: "The air-cooling endgame. Whispers at full load.",
    stats: [["Type", "Air · Twin 140mm"], ["TDP rating", "250 W+"], ["Sockets", "All modern"], ["Noise", "24.6 dBA"]],
  },
  {
    id: "h100i", category: "cooler", maker: "Corsair", name: "iCUE H100i RGB 240",
    price: 11450, tier: 7, image: IMG.cooler, socketSupport: ["LGA1700", "AM4", "AM5"], watt: 10,
    blurb: "240mm AIO with a proper RGB light show.",
    stats: [["Type", "AIO liquid · 240mm"], ["Radiator", "Dual fan"], ["Sockets", "All modern"], ["Noise", "37 dBA"]],
  },
  {
    id: "galahad360", category: "cooler", maker: "Lian Li", name: "Galahad II Trinity 360",
    price: 13990, tier: 8, image: IMG.cooler, socketSupport: ["LGA1700", "AM4", "AM5"], watt: 12, tag: "OVERKILL",
    blurb: "360mm of liquid headroom for i9s and Ryzen 9s.",
    stats: [["Type", "AIO liquid · 360mm"], ["Radiator", "Triple fan"], ["Sockets", "All modern"], ["Noise", "34 dBA"]],
  },

  /* ------------------------------ motherboards ----------------------------- */
  {
    id: "b550m", category: "motherboard", maker: "Gigabyte", name: "B550M DS3H",
    price: 8940, tier: 4, image: IMG.motherboard, socket: "AM4", memType: "DDR4", formFactor: "mATX",
    blurb: "AM4 workhorse. PCIe 4.0 where it counts.",
    stats: [["Socket", "AM4"], ["Memory", "DDR4 · 4×DIMM"], ["Form", "mATX"], ["M.2 slots", "2"]],
  },
  {
    id: "b660m", category: "motherboard", maker: "ASUS", name: "Prime B660M-A D4",
    price: 11150, tier: 5, image: IMG.motherboard, socket: "LGA1700", memType: "DDR4", formFactor: "mATX",
    blurb: "Intel on a DDR4 budget. Zero fuss, solid VRMs.",
    stats: [["Socket", "LGA1700"], ["Memory", "DDR4 · 4×DIMM"], ["Form", "mATX"], ["M.2 slots", "2"]],
  },
  {
    id: "b760m", category: "motherboard", maker: "MSI", name: "PRO B760M-A WiFi",
    price: 14450, tier: 6, image: IMG.motherboard, socket: "LGA1700", memType: "DDR5", formFactor: "mATX", tag: "POPULAR",
    blurb: "DDR5 + Wi-Fi 6E without the ROG tax.",
    stats: [["Socket", "LGA1700"], ["Memory", "DDR5 · 4×DIMM"], ["Form", "mATX"], ["Wireless", "Wi-Fi 6E"]],
  },
  {
    id: "b650plus", category: "motherboard", maker: "MSI", name: "B650 Gaming Plus WiFi",
    price: 17450, tier: 6, image: IMG.motherboard, socket: "AM5", memType: "DDR5", formFactor: "ATX",
    blurb: "The sensible AM5 launchpad. Clean BIOS, big heatsinks.",
    stats: [["Socket", "AM5"], ["Memory", "DDR5 · 4×DIMM"], ["Form", "ATX"], ["M.2 slots", "2"]],
  },
  {
    id: "z790tuf", category: "motherboard", maker: "ASUS", name: "TUF Gaming Z790-Plus WiFi",
    price: 25750, tier: 7, image: IMG.motherboard, socket: "LGA1700", memType: "DDR5", formFactor: "ATX",
    blurb: "Overclockable Intel with military-grade VRM cooling.",
    stats: [["Socket", "LGA1700"], ["Memory", "DDR5 · 7200+ OC"], ["Form", "ATX"], ["M.2 slots", "4"]],
  },
  {
    id: "b650e", category: "motherboard", maker: "ASRock", name: "B650E Steel Legend WiFi",
    price: 26400, tier: 7, image: IMG.motherboard, socket: "AM5", memType: "DDR5", formFactor: "ATX", tag: "NEW",
    blurb: "PCIe 5.0 for GPU and SSD. Camo never looked this clean.",
    stats: [["Socket", "AM5"], ["Memory", "DDR5 · 4×DIMM"], ["PCIe", "5.0 ×16"], ["Form", "ATX"]],
  },
  {
    id: "x670e", category: "motherboard", maker: "ASUS", name: "ROG Strix X670E-E Gaming",
    price: 42300, tier: 9, image: IMG.motherboard, socket: "AM5", memType: "DDR5", formFactor: "ATX", tag: "OVERKILL",
    blurb: "Flagship AM5. Every lane lights up PCIe 5.0.",
    stats: [["Socket", "AM5"], ["Memory", "DDR5 · 8000+ OC"], ["PCIe", "5.0 GPU+SSD"], ["M.2 slots", "4"]],
  },

  /* --------------------------------- memory -------------------------------- */
  {
    id: "lpx16", category: "memory", maker: "Corsair", name: "Vengeance LPX 16GB 3200",
    price: 3850, tier: 4, image: IMG.ram, memType: "DDR4", tag: "BEST VALUE",
    blurb: "2×8GB dual-channel. The default answer for budget rigs.",
    stats: [["Capacity", "16 GB (2×8)"], ["Type", "DDR4"], ["Speed", "3200 MT/s"], ["CAS", "CL16"]],
  },
  {
    id: "ripjaws32", category: "memory", maker: "G.Skill", name: "Ripjaws V 32GB 3600",
    price: 7240, tier: 5, image: IMG.ram, memType: "DDR4",
    blurb: "32GB of DDR4 headroom for heavy Chrome tab crime.",
    stats: [["Capacity", "32 GB (2×16)"], ["Type", "DDR4"], ["Speed", "3600 MT/s"], ["CAS", "CL18"]],
  },
  {
    id: "fury16d5", category: "memory", maker: "Kingston", name: "Fury Beast 16GB 5200",
    price: 6150, tier: 6, image: IMG.ram, memType: "DDR5",
    blurb: "Cheapest honest ticket into DDR5 land.",
    stats: [["Capacity", "16 GB (2×8)"], ["Type", "DDR5"], ["Speed", "5200 MT/s"], ["CAS", "CL36"]],
  },
  {
    id: "trident32", category: "memory", maker: "G.Skill", name: "Trident Z5 RGB 32GB 6000",
    price: 12490, tier: 7, image: IMG.ram, memType: "DDR5", tag: "POPULAR",
    blurb: "The AM5 sweet spot — 6000 MT/s with EXPO.",
    stats: [["Capacity", "32 GB (2×16)"], ["Type", "DDR5"], ["Speed", "6000 MT/s"], ["CAS", "CL30"]],
  },
  {
    id: "dominator64", category: "memory", maker: "Corsair", name: "Dominator Platinum 64GB",
    price: 24900, tier: 8, image: IMG.ram, memType: "DDR5", tag: "OVERKILL",
    blurb: "64GB for timelines, VMs and After Effects marathons.",
    stats: [["Capacity", "64 GB (2×32)"], ["Type", "DDR5"], ["Speed", "5600 MT/s"], ["CAS", "CL36"]],
  },

  /* --------------------------------- storage ------------------------------- */
  {
    id: "sn580", category: "storage", maker: "WD", name: "Blue SN580 500GB",
    price: 3240, tier: 4, image: IMG.storage,
    blurb: "Gen4 boot drive money can barely notice.",
    stats: [["Capacity", "500 GB"], ["Interface", "NVMe Gen4"], ["Read", "4,150 MB/s"], ["Form", "M.2 2280"]],
  },
  {
    id: "s980", category: "storage", maker: "Samsung", name: "980 1TB",
    price: 5390, tier: 5, image: IMG.storage, tag: "POPULAR",
    blurb: "A classic 1TB Gen3 drive at giveaway prices.",
    stats: [["Capacity", "1 TB"], ["Interface", "NVMe Gen3"], ["Read", "3,500 MB/s"], ["Form", "M.2 2280"]],
  },
  {
    id: "mx500", category: "storage", maker: "Crucial", name: "MX500 1TB SATA",
    price: 5690, tier: 4, image: IMG.storage,
    blurb: "2.5-inch SATA bulk storage for the Steam backlog.",
    stats: [["Capacity", "1 TB"], ["Interface", "SATA III"], ["Read", "560 MB/s"], ["Form", "2.5 inch"]],
  },
  {
    id: "sn850x", category: "storage", maker: "WD", name: "Black SN850X 1TB",
    price: 7290, tier: 7, image: IMG.storage, tag: "BEST VALUE",
    blurb: "7,300 MB/s. Levels load before you sit down.",
    stats: [["Capacity", "1 TB"], ["Interface", "NVMe Gen4"], ["Read", "7,300 MB/s"], ["Form", "M.2 2280"]],
  },
  {
    id: "990pro", category: "storage", maker: "Samsung", name: "990 Pro 2TB",
    price: 14150, tier: 8, image: IMG.storage,
    blurb: "2TB of Gen4 royalty. DirectStorage-ready.",
    stats: [["Capacity", "2 TB"], ["Interface", "NVMe Gen4"], ["Read", "7,450 MB/s"], ["Form", "M.2 2280"]],
  },

  /* -------------------------------- graphics ------------------------------- */
  {
    id: "rx7600", category: "gpu", maker: "AMD", name: "Radeon RX 7600",
    price: 23450, tier: 4, image: IMG.gpu, watt: 165, tag: "BEST VALUE",
    blurb: "1080p ultra without emptying the wallet.",
    stats: [["VRAM", "8 GB GDDR6"], ["Boost", "2.66 GHz"], ["Power", "165 W"], ["Output", "3×DP · HDMI"]],
  },
  {
    id: "rtx4060", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4060",
    price: 29490, tier: 5, image: IMG.gpu, watt: 115, tag: "POPULAR",
    blurb: "DLSS 3 frame generation on a 115W power bill.",
    stats: [["VRAM", "8 GB GDDR6"], ["Boost", "2.46 GHz"], ["Power", "115 W"], ["RT cores", "3rd gen"]],
  },
  {
    id: "rx7700xt", category: "gpu", maker: "AMD", name: "Radeon RX 7700 XT",
    price: 38900, tier: 6, image: IMG.gpu, watt: 245,
    blurb: "12GB VRAM and honest 1440p raster grunt.",
    stats: [["VRAM", "12 GB GDDR6"], ["Boost", "2.54 GHz"], ["Power", "245 W"], ["Bus", "PCIe 4.0"]],
  },
  {
    id: "rtx4060ti", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4060 Ti",
    price: 41200, tier: 5, image: IMG.gpu, watt: 160,
    blurb: "1080p maxed, 1440p with DLSS doing cardio.",
    stats: [["VRAM", "8 GB GDDR6"], ["Boost", "2.54 GHz"], ["Power", "160 W"], ["DLSS", "3 · Frame Gen"]],
  },
  {
    id: "rx7800xt", category: "gpu", maker: "AMD", name: "Radeon RX 7800 XT",
    price: 46450, tier: 6, image: IMG.gpu, watt: 263, tag: "BEST VALUE",
    blurb: "16GB VRAM. The 1440p value champion.",
    stats: [["VRAM", "16 GB GDDR6"], ["Boost", "2.43 GHz"], ["Power", "263 W"], ["FSR", "3 supported"]],
  },
  {
    id: "rtx4070s", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4070 Super",
    price: 57900, tier: 7, image: IMG.gpu, watt: 220, tag: "POPULAR",
    blurb: "1440p ultra locked. Ray tracing fully on.",
    stats: [["VRAM", "12 GB GDDR6X"], ["Boost", "2.48 GHz"], ["Power", "220 W"], ["CUDA", "7,168"]],
  },
  {
    id: "rtx4070tis", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4070 Ti Super",
    price: 77900, tier: 8, image: IMG.gpu, watt: 285,
    blurb: "16GB. 4K doorbell with 1440p high-refresh manners.",
    stats: [["VRAM", "16 GB GDDR6X"], ["Boost", "2.61 GHz"], ["Power", "285 W"], ["CUDA", "8,448"]],
  },
  {
    id: "rx7900xtx", category: "gpu", maker: "AMD", name: "Radeon RX 7900 XTX",
    price: 87900, tier: 8, image: IMG.gpu, watt: 355,
    blurb: "24GB of raster brute force for 4K ultra.",
    stats: [["VRAM", "24 GB GDDR6"], ["Boost", "2.5 GHz"], ["Power", "355 W"], ["Compute", "96 CU"]],
  },
  {
    id: "rtx4080s", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4080 Super",
    price: 102400, tier: 9, image: IMG.gpu, watt: 320,
    blurb: "4K ultra with RT and frames to spare.",
    stats: [["VRAM", "16 GB GDDR6X"], ["Boost", "2.55 GHz"], ["Power", "320 W"], ["CUDA", "10,240"]],
  },
  {
    id: "rtx4090", category: "gpu", maker: "NVIDIA", name: "GeForce RTX 4090",
    price: 161900, tier: 10, image: IMG.gpu, watt: 450, tag: "OVERKILL",
    blurb: "Nothing else matters. The final boss of graphics cards.",
    stats: [["VRAM", "24 GB GDDR6X"], ["Boost", "2.52 GHz"], ["Power", "450 W"], ["CUDA", "16,384"]],
  },

  /* ---------------------------------- psus ---------------------------------- */
  {
    id: "cv550", category: "psu", maker: "Corsair", name: "CV550 550W Bronze",
    price: 3540, tier: 4, image: IMG.psu, capacity: 550,
    blurb: "Honest 80+ Bronze power for entry rigs.",
    stats: [["Wattage", "550 W"], ["Rating", "80+ Bronze"], ["Modular", "No"], ["Warranty", "3 yr"]],
  },
  {
    id: "csk650", category: "psu", maker: "Antec", name: "CSK650 650W Bronze",
    price: 4590, tier: 5, image: IMG.psu, capacity: 650,
    blurb: "DC-to-DC design with a quiet 120mm fan.",
    stats: [["Wattage", "650 W"], ["Rating", "80+ Bronze"], ["Modular", "Semi"], ["Warranty", "5 yr"]],
  },
  {
    id: "rm750e", category: "psu", maker: "Corsair", name: "RM750e 750W Gold",
    price: 7890, tier: 6, image: IMG.psu, capacity: 750, tag: "BEST VALUE",
    blurb: "Fully modular Gold. ATX 3.0 with native 12VHPWR.",
    stats: [["Wattage", "750 W"], ["Rating", "80+ Gold"], ["Modular", "Full"], ["ATX", "3.0 · PCIe 5"]],
  },
  {
    id: "a850g", category: "psu", maker: "MSI", name: "MPG A850G 850W Gold",
    price: 10450, tier: 7, image: IMG.psu, capacity: 850, tag: "POPULAR",
    blurb: "850W of Gold-rated silence for big GPUs.",
    stats: [["Wattage", "850 W"], ["Rating", "80+ Gold"], ["Modular", "Full"], ["Warranty", "10 yr"]],
  },
  {
    id: "rm1000x", category: "psu", maker: "Corsair", name: "RM1000x 1000W Gold",
    price: 14490, tier: 8, image: IMG.psu, capacity: 1000,
    blurb: "Kilowatt club. RTX 4080 Super approved.",
    stats: [["Wattage", "1000 W"], ["Rating", "80+ Gold"], ["Modular", "Full"], ["Warranty", "10 yr"]],
  },
  {
    id: "thor1200", category: "psu", maker: "ASUS", name: "ROG Thor 1200P2 Platinum",
    price: 27900, tier: 9, image: IMG.psu, capacity: 1200, tag: "OVERKILL",
    blurb: "OLED wattage display. Because you can.",
    stats: [["Wattage", "1200 W"], ["Rating", "80+ Platinum"], ["Modular", "Full"], ["Extra", "OLED panel"]],
  },

  /* ---------------------------------- cases --------------------------------- */
  {
    id: "matrexx40", category: "case", maker: "Deepcool", name: "Matrexx 40",
    price: 2840, tier: 4, image: IMG.caseCompact, caseSupport: ["mATX", "ITX"],
    blurb: "Compact mATX starter with a tempered glass side.",
    stats: [["Type", "Mini tower"], ["Fits boards", "mATX · ITX"], ["Fans incl.", "1× 120mm"], ["Glass", "Tempered"]],
  },
  {
    id: "ice100", category: "case", maker: "Ant Esports", name: "ICE-100TG",
    price: 3190, tier: 4, image: IMG.caseBlack, caseSupport: ["ATX", "mATX", "ITX"], tag: "POPULAR",
    blurb: "India's budget favourite. Full ATX, RGB strip included.",
    stats: [["Type", "Mid tower"], ["Fits boards", "ATX · mATX · ITX"], ["Fans incl.", "1× 120mm"], ["Front", "RGB strip"]],
  },
  {
    id: "nr200p", category: "case", maker: "Cooler Master", name: "NR200P",
    price: 8190, tier: 6, image: IMG.caseCompact, caseSupport: ["ITX"],
    blurb: "18L small-form-factor icon. Big GPU still fits.",
    stats: [["Type", "SFF · 18 L"], ["Fits boards", "ITX only"], ["Fans incl.", "2× 120mm"], ["GPU room", "330mm"]],
  },
  {
    id: "4000d", category: "case", maker: "Corsair", name: "4000D Airflow",
    price: 8490, tier: 6, image: IMG.caseWhite, caseSupport: ["ATX", "mATX", "ITX"], tag: "BEST VALUE",
    blurb: "White steel, mesh front, legendary cable channels.",
    stats: [["Type", "Mid tower"], ["Fits boards", "ATX · mATX · ITX"], ["Fans incl.", "2× 120mm"], ["Front", "Steel mesh"]],
  },
  {
    id: "lancool216", category: "case", maker: "Lian Li", name: "Lancool 216 RGB",
    price: 8990, tier: 7, image: IMG.caseBlack, caseSupport: ["ATX", "mATX", "ITX", "E-ATX"], tag: "POPULAR",
    blurb: "Two 160mm ARGB intake monsters. Wind-tunnel energy.",
    stats: [["Type", "Mid tower"], ["Fits boards", "Up to E-ATX"], ["Fans incl.", "2×160 + 1×140"], ["Front", "Full mesh"]],
  },
  {
    id: "h5flow", category: "case", maker: "NZXT", name: "H5 Flow",
    price: 9390, tier: 7, image: IMG.caseBlack, caseSupport: ["ATX", "mATX", "ITX"],
    blurb: "Minimal NZXT looks with a perforated intake face.",
    stats: [["Type", "Mid tower"], ["Fits boards", "ATX · mATX · ITX"], ["Fans incl.", "2× 120mm"], ["PSU", "Shrouded"]],
  },
];

export const partsByCategory = (key: CategoryKey): Part[] =>
  PARTS.filter((p) => p.category === key);

/* --------------------------------- presets -------------------------------- */

export interface Preset {
  id: string;
  name: string;
  tierLabel: string;
  blurb: string;
  ids: Record<CategoryKey, string>;
}

export const PRESETS: Preset[] = [
  {
    id: "starter",
    name: "Hostel Hero",
    tierLabel: "1080P · STARTER",
    blurb: "Dorm-room esports rig that leaves money for mess food upgrades.",
    ids: { cpu: "r5-5600", cooler: "ag400", motherboard: "b550m", memory: "lpx16", storage: "sn580", gpu: "rx7600", psu: "cv550", case: "matrexx40" },
  },
  {
    id: "esports",
    name: "Esports Weapon",
    tierLabel: "1080P · HIGH FPS",
    blurb: "240Hz-ready Valorant and CS2 machine with DDR5 legs.",
    ids: { cpu: "i5-12400f", cooler: "hyper212", motherboard: "b760m", memory: "fury16d5", storage: "s980", gpu: "rtx4060", psu: "csk650", case: "ice100" },
  },
  {
    id: "creator",
    name: "Creator Studio",
    tierLabel: "1440P · ULTRA",
    blurb: "Edits 4K timelines by day, melts AAA worlds by night.",
    ids: { cpu: "r5-7600x", cooler: "ak620", motherboard: "b650plus", memory: "trident32", storage: "sn850x", gpu: "rtx4070s", psu: "rm750e", case: "4000d" },
  },
  {
    id: "flagship",
    name: "Zero Compromise",
    tierLabel: "4K · MAXED",
    blurb: "7800X3D + RTX 4080 Super. Frame rates your monitor can't catch.",
    ids: { cpu: "r7-7800x3d", cooler: "galahad360", motherboard: "x670e", memory: "trident32", storage: "990pro", gpu: "rtx4080s", psu: "rm1000x", case: "lancool216" },
  },
];

export const presetSelection = (p: Preset): SelectionState => {
  const sel = emptySelection();
  (Object.keys(p.ids) as CategoryKey[]).forEach((k) => {
    sel[k] = PARTS.find((part) => part.id === p.ids[k]) ?? null;
  });
  return sel;
};

export const selectionFromIds = (ids: Partial<Record<CategoryKey, string>>): SelectionState => {
  const sel = emptySelection();
  (Object.keys(ids) as CategoryKey[]).forEach((k) => {
    sel[k] = PARTS.find((part) => part.id === ids[k]) ?? null;
  });
  return sel;
};
