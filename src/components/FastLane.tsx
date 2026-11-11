import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { PRESETS, presetSelection, type Preset } from "../data/parts";
import { formatINR, totalPrice } from "../lib/engine";

export default function FastLane({
  onApply,
  activePreset,
}: {
  onApply: (preset: Preset) => void;
  activePreset: string | null;
}) {
  return (
    <section id="fastlane" className="relative border-b border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.3em] text-accent">00 / FAST LANE</p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              One-click budgets
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-smoke">
            Fully compatible, pre-validated builds at India's favourite price points.
            Load one, then swap any part you like.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PRESETS.map((p, i) => {
            const total = totalPrice(presetSelection(p));
            const active = activePreset === p.id;
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onApply(p)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                  active
                    ? "border-accent/60 bg-accent/[0.06]"
                    : "border-line bg-panel hover:border-white/20 hover:bg-panel-2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] ${
                      active ? "border-accent/50 text-accent" : "border-line text-smoke"
                    }`}
                  >
                    {p.tierLabel}
                  </span>
                  <Zap
                    size={14}
                    className={`transition-colors ${active ? "text-accent" : "text-smoke group-hover:text-accent"}`}
                  />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">{p.name}</h3>
                <p className="mt-1.5 min-h-[40px] text-[12.5px] leading-snug text-smoke">{p.blurb}</p>
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <p className="font-mono text-[8.5px] tracking-[0.25em] text-smoke">ALL-IN</p>
                    <p className={`font-mono text-lg font-bold ${active ? "text-accent" : "text-white"}`}>
                      {formatINR(total)}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[10px] tracking-[0.2em] transition-colors ${
                      active ? "text-accent" : "text-mist group-hover:text-white"
                    }`}
                  >
                    {active ? "// ACTIVE" : "LOAD →"}
                  </span>
                </div>
                {active && (
                  <motion.div
                    layoutId="preset-glow"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
