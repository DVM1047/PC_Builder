import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, ChevronDown, Plus, ShieldCheck, X, XCircle } from "lucide-react";
import {
  CATEGORIES,
  partsByCategory,
  type CategoryKey,
  type Part,
  type SelectionState,
} from "../data/parts";
import { formatINR, verdictFor } from "../lib/engine";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MAKER_COLOR: Record<string, string> = {
  Intel: "#2d8cff",
  AMD: "#ff4d4d",
  NVIDIA: "#76b900",
};

const VERDICT_STYLE = {
  ok: "border-accent/40 bg-accent/10 text-accent",
  warn: "border-hazard/40 bg-hazard/10 text-hazard",
  error: "border-danger/40 bg-danger/10 text-danger",
};

const TAG_STYLE: Record<string, string> = {
  "BEST VALUE": "border-accent/50 text-accent",
  POPULAR: "border-white/30 text-white",
  OVERKILL: "border-hazard/50 text-hazard",
  NEW: "border-[#8f8cff]/60 text-[#b9b7ff]",
};

/* ------------------------------ option row ------------------------------- */

function OptionRow({
  part,
  selected,
  verdict,
  onToggle,
  index,
}: {
  part: Part;
  selected: boolean;
  verdict: ReturnType<typeof verdictFor>;
  onToggle: () => void;
  index: number;
}) {
  const VIcon =
    verdict?.level === "error" ? XCircle : verdict?.level === "warn" ? AlertTriangle : ShieldCheck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4, ease: EASE }}
      className={`group relative grid grid-cols-[76px_1fr] gap-3.5 rounded-xl border p-3 transition-all duration-300 sm:grid-cols-[92px_1fr_auto] sm:gap-4 sm:p-3.5 ${
        selected
          ? "border-accent/60 bg-accent/[0.05]"
          : "border-line bg-panel-2/60 hover:border-white/20 hover:bg-panel-2"
      }`}
    >
      {/* photo */}
      <div className="relative h-[76px] w-[76px] overflow-hidden rounded-lg border border-line bg-ink sm:h-[92px] sm:w-[92px]">
        <img
          src={part.image}
          alt={part.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            selected ? "" : "opacity-90"
          }`}
        />
        <span
          className="absolute left-1 top-1 rounded px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.14em] text-white backdrop-blur-sm"
          style={{ background: `${MAKER_COLOR[part.maker] ?? "#3a4149"}d9` }}
        >
          {part.maker.slice(0, 5).toUpperCase()}
        </span>
      </div>

      {/* info */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h4 className="font-display text-[15px] font-bold leading-tight text-white">
            {part.maker} {part.name}
          </h4>
          {part.tag && (
            <span className={`rounded border px-1.5 py-px font-mono text-[8px] tracking-[0.18em] ${TAG_STYLE[part.tag]}`}>
              {part.tag}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-[12px] text-smoke">{part.blurb}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {part.stats.map(([k, v]) => (
            <span
              key={k}
              className="rounded border border-line bg-ink/60 px-1.5 py-0.5 font-mono text-[9.5px] text-mist"
            >
              <span className="text-smoke">{k}</span> {v}
            </span>
          ))}
          {verdict && (
            <span
              className={`flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] font-semibold ${VERDICT_STYLE[verdict.level]}`}
            >
              <VIcon size={10} />
              {verdict.text}
            </span>
          )}
        </div>
      </div>

      {/* price + action */}
      <div className="col-span-2 flex items-center justify-between gap-3 border-t border-line pt-2.5 sm:col-span-1 sm:w-[128px] sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
        <div className="text-right">
          <p className={`font-mono text-[15px] font-bold leading-none ${selected ? "text-accent" : "text-white"}`}>
            {formatINR(part.price)}
          </p>
          <p className="mt-1 font-mono text-[8.5px] tracking-[0.22em] text-smoke">
            TIER {String(part.tier).padStart(2, "0")}
          </p>
        </div>
        <button
          onClick={onToggle}
          title={selected ? "Remove part" : "Add to build"}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            selected
              ? "rotate-0 border-accent bg-accent text-ink hover:bg-danger hover:border-danger hover:text-white"
              : "border-white/20 text-mist hover:border-accent hover:text-accent"
          }`}
        >
          {selected ? <Check size={15} strokeWidth={3} /> : <Plus size={15} />}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------ category row ------------------------------ */

function CategoryRow({
  catKey,
  sel,
  active,
  onActivate,
  onSelect,
  onRemove,
}: {
  catKey: CategoryKey;
  sel: SelectionState;
  active: boolean;
  onActivate: () => void;
  onSelect: (part: Part) => void;
  onRemove: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.key === catKey)!;
  const options = partsByCategory(catKey);
  const picked = sel[catKey];
  const brands = Array.from(new Set(options.map((o) => o.maker)));
  const [brand, setBrand] = useState<string>("ALL");
  const visible = brand === "ALL" ? options : options.filter((o) => o.maker === brand);
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        active ? "border-white/20 bg-panel" : "border-line bg-panel/70 hover:border-white/15"
      }`}
    >
      {/* header */}
      <button onClick={onActivate} className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5">
        <span className={`font-mono text-[11px] font-bold ${picked ? "text-accent" : "text-smoke"}`}>
          {cat.num}
        </span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            picked ? "border-accent/50 bg-accent/10 text-accent" : "border-line bg-panel-2 text-mist"
          }`}
        >
          <Icon size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-bold uppercase tracking-[0.06em] text-white">
            {cat.label}
          </span>
          {picked ? (
            <span className="mt-0.5 block truncate font-mono text-[11px] text-accent">
              {picked.maker} {picked.name} · {formatINR(picked.price)}
            </span>
          ) : (
            <span className="mt-0.5 block truncate text-[12px] text-smoke">{cat.blurb}</span>
          )}
        </span>
        {!picked && (
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-hazard" />
            <span className="font-mono text-[9px] tracking-[0.22em] text-hazard">REQUIRED</span>
          </span>
        )}
        <ChevronDown
          size={16}
          className={`shrink-0 text-smoke transition-transform duration-300 ${active ? "rotate-180 text-white" : ""}`}
        />
      </button>

      {/* options */}
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 pb-4 pt-3.5 sm:px-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {["ALL", ...brands].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] transition-colors ${
                        brand === b
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line text-smoke hover:border-white/25 hover:text-mist"
                      }`}
                    >
                      {b.toUpperCase()}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[9.5px] tracking-[0.2em] text-smoke">
                  {visible.length} OPTIONS · ₹ INR
                </span>
              </div>
              <div className="space-y-2.5">
                {visible.map((part, i) => (
                  <OptionRow
                    key={part.id}
                    part={part}
                    index={i}
                    selected={picked?.id === part.id}
                    verdict={verdictFor(sel, part)}
                    onToggle={() => (picked?.id === part.id ? onRemove() : onSelect(part))}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* remove shortcut when collapsed */}
      {!active && picked && (
        <div className="flex items-center justify-between border-t border-line/60 bg-ink/30 px-4 py-2 sm:px-5">
          <span className="font-mono text-[9px] tracking-[0.22em] text-smoke">INSTALLED</span>
          <button
            onClick={onRemove}
            className="flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] text-smoke transition-colors hover:text-danger"
          >
            <X size={11} /> REMOVE
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* --------------------------------- builder -------------------------------- */

export default function Builder({
  sel,
  activeCat,
  onActivate,
  onSelect,
  onRemove,
}: {
  sel: SelectionState;
  activeCat: CategoryKey;
  onActivate: (key: CategoryKey) => void;
  onSelect: (key: CategoryKey, part: Part) => void;
  onRemove: (key: CategoryKey) => void;
}) {
  return (
    <div className="space-y-3">
      {CATEGORIES.map((c) => (
        <CategoryRow
          key={c.key}
          catKey={c.key}
          sel={sel}
          active={activeCat === c.key}
          onActivate={() => onActivate(c.key)}
          onSelect={(part) => onSelect(c.key, part)}
          onRemove={() => onRemove(c.key)}
        />
      ))}
    </div>
  );
}
