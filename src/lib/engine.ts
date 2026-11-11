import { CATEGORIES, type Part, type SelectionState } from "../data/parts";

/* ------------------------------ INR formatting ----------------------------- */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,02,400 — true Indian lakh/crore digit grouping */
export const formatINR = (n: number): string => inr.format(Math.round(n));

export const formatINRCompact = (n: number): string => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 2)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return formatINR(n);
};

/* -------------------------------- selection -------------------------------- */

export const selectedParts = (sel: SelectionState): Part[] =>
  CATEGORIES.map((c) => sel[c.key]).filter((p): p is Part => p !== null);

export const selectedCount = (sel: SelectionState): number => selectedParts(sel).length;

export const totalPrice = (sel: SelectionState): number =>
  selectedParts(sel).reduce((s, p) => s + p.price, 0);

/* ---------------------------------- power ---------------------------------- */

/** Estimated sustained draw: CPU + GPU + platform overhead */
export function powerDraw(sel: SelectionState): number | null {
  const cpu = sel.cpu?.watt ?? 0;
  const gpu = sel.gpu?.watt ?? 0;
  if (cpu + gpu === 0) return null;
  return cpu + gpu + 95; // board, RAM, drives, fans, margin
}

export const recommendedPsu = (draw: number): number =>
  Math.ceil((draw * 1.35) / 50) * 50;

/* ------------------------------ compatibility ------------------------------ */

export type Level = "ok" | "warn" | "error" | "pending";

export interface Check {
  id: string;
  level: Level;
  label: string;
  detail: string;
}

export function analyze(sel: SelectionState): Check[] {
  const checks: Check[] = [];
  const { cpu, motherboard, memory, case: pcCase, cooler, psu, gpu } = sel;

  // socket: cpu <-> motherboard
  if (cpu && motherboard) {
    const match = cpu.socket === motherboard.socket;
    checks.push({
      id: "socket",
      level: match ? "ok" : "error",
      label: "CPU ↔ Board socket",
      detail: match
        ? `${cpu.socket} matches ${motherboard.maker} ${motherboard.name}`
        : `${cpu.name} is ${cpu.socket} — board is ${motherboard.socket}`,
    });
  } else {
    checks.push({ id: "socket", level: "pending", label: "CPU ↔ Board socket", detail: "Pick a CPU and a motherboard" });
  }

  // memory type
  if (memory && motherboard) {
    const match = memory.memType === motherboard.memType;
    checks.push({
      id: "mem",
      level: match ? "ok" : "error",
      label: "Memory generation",
      detail: match
        ? `${memory.memType} kit fits the ${motherboard.memType} slots`
        : `${memory.memType} kit — board only takes ${motherboard.memType}`,
    });
  } else {
    checks.push({ id: "mem", level: "pending", label: "Memory generation", detail: "Pick RAM and a motherboard" });
  }

  // cooler support
  if (cooler && cpu) {
    const ok = cooler.socketSupport?.includes(cpu.socket!) ?? true;
    checks.push({
      id: "cooler",
      level: ok ? "ok" : "error",
      label: "Cooler mounting",
      detail: ok
        ? `${cooler.name} ships a ${cpu.socket} bracket`
        : `${cooler.name} has no ${cpu.socket} mounting kit`,
    });
  } else {
    checks.push({ id: "cooler", level: "pending", label: "Cooler mounting", detail: "Pick a CPU and a cooler" });
  }

  // case fit
  if (pcCase && motherboard) {
    const ok = pcCase.caseSupport?.includes(motherboard.formFactor!) ?? true;
    checks.push({
      id: "fit",
      level: ok ? "ok" : "error",
      label: "Board fits cabinet",
      detail: ok
        ? `${motherboard.formFactor} board slides into the ${pcCase.name}`
        : `${motherboard.formFactor} board — ${pcCase.name} takes ${pcCase.caseSupport?.join("/")}`,
    });
  } else {
    checks.push({ id: "fit", level: "pending", label: "Board fits cabinet", detail: "Pick a board and a cabinet" });
  }

  // psu headroom
  const draw = powerDraw(sel);
  if (psu && draw) {
    const cap = psu.capacity ?? 0;
    if (draw > cap) {
      checks.push({ id: "psu", level: "error", label: "Power headroom", detail: `Needs ~${draw}W — PSU is only ${cap}W` });
    } else if (cap < recommendedPsu(draw)) {
      checks.push({ id: "psu", level: "warn", label: "Power headroom", detail: `${cap}W works, ~${recommendedPsu(draw)}W recommended` });
    } else {
      checks.push({ id: "psu", level: "ok", label: "Power headroom", detail: `${cap}W for a ~${draw}W load — comfortable` });
    }
  } else if (gpu || cpu) {
    checks.push({ id: "psu", level: "pending", label: "Power headroom", detail: "Add a PSU to close the loop" });
  } else {
    checks.push({ id: "psu", level: "pending", label: "Power headroom", detail: "Pick parts to estimate draw" });
  }

  return checks;
}

/* ---------------------------- per-option verdicts --------------------------- */

export interface Verdict {
  level: Exclude<Level, "pending">;
  text: string;
}

/** Compatibility hint shown on each option row, relative to current picks. */
export function verdictFor(sel: SelectionState, part: Part): Verdict | null {
  switch (part.category) {
    case "cpu": {
      if (sel.motherboard && sel.motherboard.socket !== part.socket)
        return { level: "error", text: `${part.socket} ✕ board is ${sel.motherboard.socket}` };
      if (sel.motherboard) return { level: "ok", text: `${part.socket} matches board` };
      if (sel.cooler && part.socket && !sel.cooler.socketSupport?.includes(part.socket))
        return { level: "warn", text: `${part.socket} ✗ cooler` };
      return null;
    }
    case "motherboard": {
      if (sel.cpu && sel.cpu.socket !== part.socket)
        return { level: "error", text: `${part.socket} ✕ CPU is ${sel.cpu.socket}` };
      if (sel.memory && part.memType !== sel.memory.memType)
        return { level: "error", text: `${part.memType} ✕ kit is ${sel.memory.memType}` };
      if (sel.case && part.formFactor && !sel.case.caseSupport?.includes(part.formFactor))
        return { level: "error", text: `${part.formFactor} ✗ case` };
      if (sel.cpu) return { level: "ok", text: `${part.socket} matches CPU` };
      return null;
    }
    case "memory": {
      if (sel.motherboard && sel.motherboard.memType !== part.memType)
        return { level: "error", text: `${part.memType} ✕ board is ${sel.motherboard.memType}` };
      if (sel.motherboard) return { level: "ok", text: `${part.memType} fits` };
      return null;
    }
    case "cooler": {
      if (sel.cpu && part.socketSupport && !part.socketSupport.includes(sel.cpu.socket!))
        return { level: "error", text: `No ${sel.cpu.socket} bracket` };
      if (sel.cpu) return { level: "ok", text: `Fits ${sel.cpu.socket}` };
      return null;
    }
    case "case": {
      if (sel.motherboard && !part.caseSupport?.includes(sel.motherboard.formFactor!))
        return { level: "error", text: `Won't fit ${sel.motherboard.formFactor}` };
      if (sel.motherboard) return { level: "ok", text: `Fits ${sel.motherboard.formFactor}` };
      return null;
    }
    case "psu": {
      const draw = powerDraw({ ...sel, psu: null });
      if (!draw) return null;
      const cap = part.capacity ?? 0;
      if (cap < draw) return { level: "error", text: `${cap}W < ${draw}W load` };
      if (cap < recommendedPsu(draw)) return { level: "warn", text: `${cap}W — tight` };
      return { level: "ok", text: `${cap}W ✓ headroom` };
    }
    case "gpu": {
      const draw = powerDraw({ ...sel, gpu: part });
      if (sel.psu && draw && (sel.psu.capacity ?? 0) < draw)
        return { level: "error", text: `PSU too small for ~${draw}W` };
      return null;
    }
    default:
      return null;
  }
}

export const hasErrors = (checks: Check[]) => checks.some((c) => c.level === "error");

/* -------------------------------- performance ------------------------------ */

const GPU_BASE: Record<number, number> = { 4: 38, 5: 52, 6: 70, 7: 92, 8: 118, 9: 150, 10: 196 };

const GAMES: { name: string; mult: number; cpuPull: number }[] = [
  { name: "Cyberpunk 2077 · RT", mult: 1.0, cpuPull: 1.0 },
  { name: "RDR2", mult: 1.18, cpuPull: 0.7 },
  { name: "GTA V — Enhanced", mult: 1.55, cpuPull: 1.0 },
  { name: "Apex Legends", mult: 1.95, cpuPull: 0.9 },
  { name: "Valorant", mult: 2.9, cpuPull: 1.5 },
];

export interface GameFps {
  name: string;
  fps: number | null;
}

export interface Perf {
  games: GameFps[];
  gaming: number | null;
  creator: number | null;
  bottleneck: { label: string; tone: "good" | "ok" | "bad" } | null;
}

export function perf(sel: SelectionState): Perf {
  const { cpu, gpu, memory } = sel;
  if (!gpu) return { games: GAMES.map((g) => ({ name: g.name, fps: null })), gaming: null, creator: null, bottleneck: null };

  const gpuTier = gpu.tier;
  const cpuTier = cpu?.tier ?? gpuTier - 2; // unknown cpu assumed weaker

  const games: GameFps[] = GAMES.map((g) => {
    const base = GPU_BASE[gpuTier] ?? 100;
    // a weak cpu throttles the gpu; cpu-heavy titles feel it more
    const deficit = Math.max(0, gpuTier - cpuTier - 1);
    const eff = 1 - deficit * 0.055 * g.cpuPull;
    const fps = Math.round(base * g.mult * eff);
    return { name: g.name, fps: Math.max(24, fps) };
  });

  const gaming = Math.min(100, Math.round(gpuTier * 8.4 + cpuTier * 1.5));

  let creator: number | null = null;
  if (cpu) {
    const gb = memory ? parseInt(memory.stats[0]?.[1] ?? "0", 10) : 0;
    const ramBonus = gb >= 64 ? 10 : gb >= 32 ? 7 : gb >= 16 ? 4 : 1;
    creator = Math.min(100, Math.round((cpuTier ?? 5) * 7.6 + gpuTier * 1.9 + ramBonus));
  }

  let bottleneck: Perf["bottleneck"] = null;
  if (cpu) {
    const d = cpuTier - gpuTier;
    if (d >= 1) bottleneck = { label: "GPU-bound — ideal for max eye candy", tone: "good" };
    else if (d >= -1) bottleneck = { label: "Balanced pairing — neither part waits", tone: "good" };
    else if (d >= -3) bottleneck = { label: "Mild CPU limit at high refresh rates", tone: "ok" };
    else bottleneck = { label: "CPU is holding this GPU back", tone: "bad" };
  }

  return { games, gaming, creator, bottleneck };
}

/* ------------------------------ spec sheet copy ----------------------------- */

export function specSheetText(sel: SelectionState): string {
  const lines: string[] = ["RIGFORGE · BUILD SHEET (prices in ₹ INR)", "─".repeat(42)];
  CATEGORIES.forEach((c) => {
    const p = sel[c.key];
    lines.push(`${c.short.padEnd(8)} ${p ? `${p.maker} ${p.name} — ${formatINR(p.price)}` : "— not selected —"}`);
  });
  lines.push("─".repeat(42));
  lines.push(`TOTAL    ${formatINR(totalPrice(sel))}`);
  const draw = powerDraw(sel);
  if (draw) lines.push(`POWER    ~${draw}W estimated · ${sel.psu ? `${sel.psu.capacity}W PSU` : "no PSU"}`);
  const p = perf(sel);
  const fpsLine = p.games.filter((g) => g.fps).map((g) => `${g.name}: ${g.fps}fps`).join(" · ");
  if (fpsLine) lines.push(`1440P    ${fpsLine}`);
  lines.push("─".repeat(42));
  lines.push("Built in RIGFORGE — the PC build simulator");
  return lines.join("\n");
}
