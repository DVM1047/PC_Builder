import { motion } from "framer-motion";
import { Bookmark, Cpu, RotateCcw } from "lucide-react";
import AnimatedINR from "./AnimatedINR";

export default function Nav({
  total,
  count,
  savedCount,
  onOpenSaved,
  onReset,
}: {
  total: number;
  count: number;
  savedCount: number;
  onOpenSaved: () => void;
  onReset: () => void;
}) {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[60] border-b border-line bg-ink/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-ink">
            <Cpu size={16} strokeWidth={2.4} />
          </div>
          <div className="leading-none">
            <p className="font-display text-[15px] font-bold tracking-[0.16em] text-white">
              RIGFORGE
            </p>
            <p className="mt-0.5 font-mono text-[8.5px] tracking-[0.32em] text-smoke">
              BUILD LAB · IN
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-2 font-mono text-[11px] text-smoke md:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${count === 8 ? "bg-accent" : "bg-hazard"} ${count === 0 ? "hidden" : ""}`} />
          <span className="tracking-[0.2em]">
            {count}/8 PARTS LOCKED
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="mr-1 text-right leading-none">
            <p className="font-mono text-[8.5px] tracking-[0.28em] text-smoke">RUNNING TOTAL</p>
            <AnimatedINR
              value={total}
              className="font-mono text-[15px] font-bold tracking-tight text-accent sm:text-base"
            />
          </div>
          <button
            onClick={onOpenSaved}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel text-mist transition-colors hover:border-white/25 hover:text-white"
            title="Saved builds"
          >
            <Bookmark size={15} />
            {savedCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold text-ink">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel text-mist transition-colors hover:border-danger/50 hover:text-danger"
            title="Clear workbench"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
