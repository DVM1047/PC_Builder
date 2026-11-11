import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export interface Toast {
  id: number;
  title: string;
  sub?: string;
  tone?: "ok" | "warn" | "error" | "info";
}

const TONE = {
  ok: { icon: CheckCircle2, bar: "bg-accent", fg: "text-accent" },
  warn: { icon: AlertTriangle, bar: "bg-hazard", fg: "text-hazard" },
  error: { icon: XCircle, bar: "bg-danger", fg: "text-danger" },
  info: { icon: Info, bar: "bg-mist", fg: "text-mist" },
};

export default function Toasts({ items }: { items: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[320px] max-w-[calc(100vw-40px)] flex-col gap-2.5">
      <AnimatePresence>
        {items.map((t) => {
          const tone = TONE[t.tone ?? "info"];
          const Icon = tone.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto relative overflow-hidden rounded-xl border border-line bg-panel-2/95 p-3.5 pl-4 shadow-2xl shadow-black/60 backdrop-blur-md"
            >
              <span className={`absolute inset-y-0 left-0 w-[3px] ${tone.bar}`} />
              <div className="flex items-start gap-3">
                <Icon size={17} className={`mt-0.5 shrink-0 ${tone.fg}`} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold leading-tight text-white">
                    {t.title}
                  </p>
                  {t.sub && (
                    <p className="mt-0.5 truncate font-mono text-[11px] text-smoke">{t.sub}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
