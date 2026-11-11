import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

const LINES = [
  "rigforge bios v4.2.1 — POST check passed",
  "component database ........ 42 parts · ₹ INR",
  "compatibility engine .............. READY",
  "wattage + fps models ........ CALIBRATED",
  "initializing build lab .................",
];

export default function Intro() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-ink px-6"
      exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="bg-blueprint absolute inset-0 opacity-60" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-ink">
            <Cpu size={20} strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-[0.18em] text-white">RIGFORGE</p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">PC BUILD LAB · INDIA</p>
          </div>
        </div>

        <div className="space-y-2 font-mono text-[12px] text-mist">
          {LINES.map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.32, duration: 0.3 }}
            >
              <span className="text-accent">{"> "}</span>
              {l}
            </motion.p>
          ))}
        </div>

        <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.1, ease: "easeInOut", delay: 0.15 }}
          />
        </div>

        <motion.p
          className="mt-4 text-center font-mono text-[10px] tracking-[0.25em] text-smoke"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          TAP ANYWHERE TO SKIP
        </motion.p>
      </div>
    </motion.div>
  );
}
