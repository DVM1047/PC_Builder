import { motion } from "framer-motion";
import { ArrowDown, Gauge, IndianRupee, Layers, ShieldCheck } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
  { icon: Layers, label: "42 PARTS · 8 CATEGORIES" },
  { icon: ShieldCheck, label: "LIVE COMPATIBILITY" },
  { icon: Gauge, label: "FPS + WATTAGE MODELS" },
  { icon: IndianRupee, label: "INDIAN STREET PRICING" },
];

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[60px]">
      <div className="bg-blueprint absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 520px at 78% 18%, rgba(201,247,58,0.09), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(80,120,255,0.07), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-20">
        {/* copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-panel/80 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
            <span className="font-mono text-[10.5px] tracking-[0.24em] text-mist">
              PC BUILD SIMULATOR · PRICES IN ₹ INR
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(3.2rem,9.5vw,7.6rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
            <Line delay={2.95}>
              <span className="text-white">Spec it.</span>
            </Line>
            <Line delay={3.08}>
              <span className="text-outline">Slot it.</span>
            </Line>
            <Line delay={3.21}>
              <span className="text-accent">Boot it.</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.7, ease: EASE }}
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base"
          >
            Pick a CPU, GPU, motherboard and five more parts — the lab checks sockets,
            RAM generations, cabinet clearance and PSU headroom in real time, then
            estimates your FPS. Every price is an Indian-street-price in{" "}
            <span className="font-semibold text-accent">₹ rupees</span>, lakh-grouped.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.65, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#builder"
              className="group flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Start building
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#fastlane"
              className="rounded-full border border-line bg-panel/70 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-mist transition-colors hover:border-white/25 hover:text-white"
            >
              One-click budgets
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.9, duration: 0.8 }}
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={13} className="text-accent" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-smoke">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 1, ease: EASE }}
          className="relative hidden lg:block"
        >
          <div className="animate-float relative">
            <div className="absolute -inset-8 rounded-[40px] bg-accent/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl shadow-black">
              <img
                src="/images/case-black.jpg"
                alt="Gaming PC cabinet"
                className="aspect-[4/4.6] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.3em] text-smoke">EXHIBIT 08 · CABINET</p>
                  <p className="mt-1 font-display text-lg font-bold text-white">Lancool-class airflow tower</p>
                </div>
                <p className="rounded-md border border-accent/30 bg-ink/70 px-2.5 py-1 font-mono text-xs font-bold text-accent backdrop-blur">
                  ₹ 8,990
                </p>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-8 top-10 rounded-xl border border-line bg-panel-2/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="font-mono text-[9px] tracking-[0.25em] text-smoke">SOCKET CHECK</p>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-accent">
              <ShieldCheck size={13} /> AM5 · AM5 — MATCH
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-24 rounded-xl border border-line bg-panel-2/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="font-mono text-[9px] tracking-[0.25em] text-smoke">1440P ULTRA</p>
            <p className="mt-1 font-mono text-xl font-bold text-white">
              118<span className="text-[11px] text-accent"> FPS</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
