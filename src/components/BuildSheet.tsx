import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  Box,
  CheckCircle2,
  Copy,
  Flame,
  MinusCircle,
  RotateCcw,
  XCircle,
  Zap,
} from "lucide-react";
import { CATEGORIES, type SelectionState } from "../data/parts";
import {
  analyze,
  formatINR,
  perf,
  powerDraw,
  recommendedPsu,
  selectedCount,
  selectedParts,
  totalPrice,
  type Level,
} from "../lib/engine";
import AnimatedINR from "./AnimatedINR";

const CHECK_ICON: Record<Level, React.ReactNode> = {
  ok: <CheckCircle2 size={14} className="text-accent" />,
  warn: <AlertTriangle size={14} className="text-hazard" />,
  error: <XCircle size={14} className="text-danger" />,
  pending: <MinusCircle size={14} className="text-smoke" />,
};

const CHECK_LINE: Record<Level, string> = {
  ok: "border-l-accent/70",
  warn: "border-l-hazard/70",
  error: "border-l-danger/70",
  pending: "border-l-white/10",
};

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9.5px] tracking-[0.2em] text-smoke">{label}</span>
        <span className="font-mono text-[11px] font-bold text-white">
          {value === null ? "—" : `${value}`}
          {value !== null && <span className="text-smoke">/100</span>}
        </span>
      </div>
      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent/50 to-accent"
          animate={{ width: value === null ? "0%" : `${value}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
        />
      </div>
    </div>
  );
}

export default function BuildSheet({
  sel,
  onCopy,
  onSave,
}: {
  sel: SelectionState;
  onCopy: () => void;
  onSave: () => void;
}) {
  const checks = analyze(sel);
  const p = perf(sel);
  const total = totalPrice(sel);
  const count = selectedCount(sel);
  const draw = powerDraw(sel);
  const parts = selectedParts(sel);
  const maxFps = Math.max(240, ...p.games.map((g) => g.fps ?? 0));

  return (
    <div className="space-y-4 lg:sticky lg:top-[84px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-line bg-panel"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
            <span className="font-display text-[13px] font-bold uppercase tracking-[0.22em] text-white">
              Build Sheet
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-smoke">
            {count}/8 SLOTS
          </span>
        </div>

        {/* progress */}
        <div className="h-[3px] bg-white/[0.06]">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${(count / 8) * 100}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          />
        </div>

        {/* chassis visual */}
        <div className="relative border-b border-line">
          {sel.case ? (
            <div className="relative">
              <img
                src={sel.case.image}
                alt={sel.case.name}
                className="aspect-[16/8.5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[8.5px] tracking-[0.28em] text-smoke">CHASSIS</p>
                  <p className="font-display text-[15px] font-bold text-white">
                    {sel.case.maker} {sel.case.name}
                  </p>
                </div>
                <p className="rounded border border-line bg-ink/70 px-2 py-1 font-mono text-[11px] font-bold text-accent backdrop-blur">
                  {formatINR(sel.case.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-diag flex aspect-[16/8.5] flex-col items-center justify-center gap-2.5 text-center">
              <Box size={26} className="text-smoke" strokeWidth={1.4} />
              <p className="font-mono text-[10px] tracking-[0.24em] text-smoke">
                SELECT A CABINET TO PREVIEW
              </p>
            </div>
          )}
        </div>

        {/* fps dashboard */}
        <div className="border-b border-line px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.24em] text-smoke">
              <Flame size={11} className="text-accent" /> 1440P ULTRA · EST. FPS
            </span>
            {!sel.gpu && <span className="font-mono text-[9px] text-smoke">AWAITING GPU</span>}
          </div>
          <div className="space-y-2.5">
            {p.games.map((g) => (
              <div key={g.name} className="grid grid-cols-[minmax(0,1.3fr)_2fr_44px] items-center gap-3">
                <span className="truncate font-mono text-[10.5px] text-mist">{g.name}</span>
                <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className={`h-full rounded-full ${g.fps === null ? "bg-white/10" : "bg-gradient-to-r from-accent/40 to-accent"}`}
                    animate={{ width: g.fps === null ? "4%" : `${(g.fps / maxFps) * 100}%` }}
                    transition={{ type: "spring", stiffness: 70, damping: 20 }}
                  />
                </div>
                <span className="text-right font-mono text-[11.5px] font-bold text-white">
                  {g.fps ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* vitals */}
        <div className="grid grid-cols-2 gap-4 border-b border-line px-5 py-4">
          <ScoreBar label="GAMING SCORE" value={p.gaming} />
          <ScoreBar label="CREATOR SCORE" value={p.creator} />
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-[0.2em] text-smoke">POWER DRAW</span>
              <Zap size={11} className="text-hazard" />
            </div>
            <p className="mt-1 font-mono text-[15px] font-bold text-white">
              {draw ? `~${draw}W` : "—"}
            </p>
            {draw && (
              <p className="font-mono text-[9px] text-smoke">
                PSU {recommendedPsu(draw)}W+ advised
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-[0.2em] text-smoke">PAIRING</span>
            </div>
            <p
              className={`mt-1 font-mono text-[10.5px] font-semibold leading-snug ${
                !p.bottleneck
                  ? "text-smoke"
                  : p.bottleneck.tone === "good"
                    ? "text-accent"
                    : p.bottleneck.tone === "ok"
                      ? "text-hazard"
                      : "text-danger"
              }`}
            >
              {p.bottleneck ? p.bottleneck.label : "—"}
            </p>
          </div>
        </div>

        {/* compatibility */}
        <div className="border-b border-line px-5 py-4">
          <p className="mb-3 font-mono text-[9.5px] tracking-[0.24em] text-smoke">
            COMPATIBILITY MATRIX
          </p>
          <div className="space-y-2">
            {checks.map((c) => (
              <div
                key={c.id}
                className={`flex items-start gap-2.5 rounded-r-lg border-l-2 py-1 pl-2.5 ${CHECK_LINE[c.level]}`}
              >
                <span className="mt-px shrink-0">{CHECK_ICON[c.level]}</span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight text-white">{c.label}</p>
                  <p className="truncate font-mono text-[10px] text-smoke">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* price breakdown */}
        <div className="px-5 py-4">
          <p className="mb-3 font-mono text-[9.5px] tracking-[0.24em] text-smoke">
            PRICE BREAKDOWN · ₹ INR
          </p>
          {parts.length === 0 ? (
            <p className="py-2 text-center font-mono text-[10.5px] text-smoke">
              — workbench is empty —
            </p>
          ) : (
            <div className="space-y-1.5">
              {CATEGORIES.filter((c) => sel[c.key]).map((c) => {
                const part = sel[c.key]!;
                return (
                  <div key={c.key} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <c.icon size={11} className="shrink-0 text-smoke" />
                      <span className="truncate text-[12px] text-mist">
                        {part.maker} {part.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[11.5px] text-white">
                      {formatINR(part.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 border-t border-dashed border-white/15 pt-3.5">
            <div className="flex items-end justify-between">
              <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                Total
              </span>
              <AnimatedINR
                value={total}
                className="font-mono text-[26px] font-bold leading-none tracking-tight text-accent"
              />
            </div>
            {total > 0 && (
              <p className="mt-1.5 text-right font-mono text-[9.5px] text-smoke">
                or ~{formatINR(total / 12)} × 12 no-cost EMI
              </p>
            )}
          </div>

          {/* actions */}
          <div className="mt-5 space-y-2.5">
            <button
              onClick={onCopy}
              disabled={count === 0}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-ink transition-all enabled:hover:brightness-110 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Copy size={14} /> Copy spec sheet
            </button>
            <button
              onClick={onSave}
              disabled={count === 0}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-panel-2 py-3 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-mist transition-all enabled:hover:border-accent/50 enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Bookmark size={13} /> Save to vault
            </button>
          </div>
          <p className="mt-3 text-center font-mono text-[8.5px] leading-relaxed tracking-[0.08em] text-smoke">
            Illustrative street prices, INR. Syncs to Firebase in the mobile app.
          </p>
        </div>
      </motion.div>

      {/* count nudge */}
      {count < 8 && count > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-hazard/25 bg-hazard/[0.05] px-4 py-3">
          <RotateCcw size={14} className="shrink-0 text-hazard" />
          <p className="font-mono text-[10.5px] leading-snug text-hazard/90">
            {8 - count} SLOT{8 - count > 1 ? "S" : ""} OPEN — complete all 8 for a validated boot.
          </p>
        </div>
      )}
    </div>
  );
}
