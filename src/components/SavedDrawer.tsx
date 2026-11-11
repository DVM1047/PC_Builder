import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, HardDriveDownload, Trash2, X } from "lucide-react";
import { formatINR } from "../lib/engine";
import type { CategoryKey } from "../data/parts";

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: number;
  total: number;
  count: number;
  ids: Partial<Record<CategoryKey, string>>;
}

export default function SavedDrawer({
  open,
  builds,
  onClose,
  onLoad,
  onDelete,
}: {
  open: boolean;
  builds: SavedBuild[];
  onClose: () => void;
  onLoad: (b: SavedBuild) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-[400px] flex-col border-l border-line bg-panel"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Bookmark size={15} className="text-accent" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
                  Build Vault
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-mist transition-colors hover:border-white/25 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {builds.length === 0 ? (
                <div className="bg-diag flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 text-center">
                  <Bookmark size={24} className="text-smoke" strokeWidth={1.4} />
                  <p className="max-w-[220px] font-mono text-[10.5px] leading-relaxed tracking-[0.08em] text-smoke">
                    NO SAVED RIGS YET — SAVE A SHEET FROM THE BUILD PANEL
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {builds.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="rounded-xl border border-line bg-panel-2 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15px] font-bold text-white">{b.name}</p>
                          <p className="mt-0.5 font-mono text-[9.5px] tracking-[0.14em] text-smoke">
                            {new Date(b.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            · {b.count}/8 PARTS
                          </p>
                        </div>
                        <p className="shrink-0 font-mono text-[13px] font-bold text-accent">
                          {formatINR(b.total)}
                        </p>
                      </div>
                      <div className="mt-3.5 flex gap-2">
                        <button
                          onClick={() => onLoad(b)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent/10 py-2 font-mono text-[10px] font-bold tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-ink"
                        >
                          <HardDriveDownload size={12} /> LOAD
                        </button>
                        <button
                          onClick={() => onDelete(b.id)}
                          className="flex h-8 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-danger/50 hover:text-danger"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-line px-5 py-3">
              <p className="font-mono text-[8.5px] leading-relaxed tracking-[0.1em] text-smoke">
                VAULT STORED LOCALLY NOW · FIRESTORE SYNC IN REACT NATIVE BUILD
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
