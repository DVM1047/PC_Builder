import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  CATEGORIES,
  PRESETS,
  emptySelection,
  presetSelection,
  selectionFromIds,
  type CategoryKey,
  type Part,
  type Preset,
  type SelectionState,
} from "./data/parts";
import { formatINR, selectedCount, specSheetText, totalPrice } from "./lib/engine";
import Intro from "./components/Intro";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import FastLane from "./components/FastLane";
import Builder from "./components/Builder";
import BuildSheet from "./components/BuildSheet";
import SavedDrawer, { type SavedBuild } from "./components/SavedDrawer";
import Toasts, { type Toast } from "./components/Toasts";
import Footer from "./components/Footer";

const VAULT_KEY = "rigforge-vault-v1";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function loadVault(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? (JSON.parse(raw) as SavedBuild[]) : [];
  } catch {
    return [];
  }
}

let toastId = 0;

export default function App() {
  const [booting, setBooting] = useState(true);
  const [sel, setSel] = useState<SelectionState>(emptySelection);
  const [activeCat, setActiveCat] = useState<CategoryKey>("cpu");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [vault, setVault] = useState<SavedBuild[]>(loadVault);
  const [vaultOpen, setVaultOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
    } catch {
      /* storage full — ignore */
    }
  }, [vault]);

  const pushToast = useCallback((title: string, sub?: string, tone: Toast["tone"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev.slice(-3), { id, title, sub, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  /* ------------------------------ selection ops ----------------------------- */

  const handleSelect = useCallback(
    (key: CategoryKey, part: Part) => {
      setSel((prev) => ({ ...prev, [key]: part }));
      const cat = CATEGORIES.find((c) => c.key === key)!;
      pushToast(`${part.maker} ${part.name}`, `→ ${cat.short} · ${formatINR(part.price)}`, "ok");
      const idx = CATEGORIES.findIndex((c) => c.key === key);
      const next = CATEGORIES[idx + 1];
      if (next) setActiveCat(next.key);
    },
    [pushToast]
  );

  const handleRemove = useCallback(
    (key: CategoryKey) => {
      const part = sel[key];
      if (part) pushToast(`${part.maker} ${part.name} removed`, undefined, "info");
      setSel((prev) => ({ ...prev, [key]: null }));
      setActiveCat(key);
    },
    [sel, pushToast]
  );

  const handlePreset = useCallback(
    (preset: Preset) => {
      setSel(presetSelection(preset));
      setActiveCat("cpu");
      pushToast(`${preset.name} loaded`, `8/8 parts · ${formatINR(totalPrice(presetSelection(preset)))}`, "ok");
      setTimeout(() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }), 80);
    },
    [pushToast]
  );

  const handleReset = useCallback(() => {
    setSel(emptySelection());
    setActiveCat("cpu");
    pushToast("Workbench cleared", "all 8 slots open", "info");
  }, [pushToast]);

  /* --------------------------------- vault ---------------------------------- */

  const handleSave = useCallback(() => {
    const total = totalPrice(sel);
    const count = selectedCount(sel);
    const label =
      total < 60000 ? "Hostel Hero" : total < 120000 ? "Esports Rig" : total < 200000 ? "Creator Machine" : "Halo Flagship";
    setVault((prev) => {
      const ids: SavedBuild["ids"] = {};
      CATEGORIES.forEach((c) => {
        if (sel[c.key]) ids[c.key] = sel[c.key]!.id;
      });
      return [
        {
          id: crypto.randomUUID(),
          name: `${label} #${String(prev.length + 1).padStart(2, "0")}`,
          createdAt: Date.now(),
          total,
          count,
          ids,
        },
        ...prev,
      ];
    });
    pushToast("Build saved to vault", `${label} · ${formatINR(total)}`, "ok");
  }, [sel, pushToast]);

  const handleLoad = useCallback(
    (b: SavedBuild) => {
      setSel(selectionFromIds(b.ids));
      setVaultOpen(false);
      setActiveCat("cpu");
      pushToast(`${b.name} loaded`, formatINR(b.total), "ok");
      setTimeout(() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }), 80);
    },
    [pushToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setVault((prev) => prev.filter((b) => b.id !== id));
      pushToast("Build deleted", undefined, "info");
    },
    [pushToast]
  );

  /* ---------------------------------- copy ---------------------------------- */

  const handleCopy = useCallback(async () => {
    const text = specSheetText(sel);
    try {
      await navigator.clipboard.writeText(text);
      pushToast("Spec sheet copied", `${formatINR(totalPrice(sel))} · ${selectedCount(sel)}/8 parts`, "ok");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      pushToast("Spec sheet copied", formatINR(totalPrice(sel)), "ok");
    }
  }, [sel, pushToast]);

  /* --------------------------------- derived -------------------------------- */

  const total = totalPrice(sel);
  const count = selectedCount(sel);

  const activePreset = useMemo(() => {
    if (count !== 8) return null;
    const current = Object.fromEntries(
      CATEGORIES.map((c) => [c.key, sel[c.key]?.id ?? ""])
    ) as Record<CategoryKey, string>;
    return PRESETS.find((p) => CATEGORIES.every((c) => p.ids[c.key] === current[c.key]))?.id ?? null;
  }, [sel, count]);

  /* ---------------------------------- render -------------------------------- */

  return (
    <div
      className="relative min-h-screen bg-ink text-white"
      onClick={() => booting && setBooting(false)}
    >
      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[55] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <AnimatePresence>{booting && <Intro />}</AnimatePresence>

      <div>
        <Nav total={total} count={count} savedCount={vault.length} onOpenSaved={() => setVaultOpen(true)} onReset={handleReset} />

        <main>
          <Hero />
          <Marquee />
          <FastLane onApply={handlePreset} activePreset={activePreset} />

          {/* configurator */}
          <section id="builder" className="relative">
            <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-24">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10.5px] tracking-[0.3em] text-accent">01 / CONFIGURATOR</p>
                  <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                    Choose your silicon
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-smoke">
                  Every pick re-runs the compatibility matrix against sockets, RAM
                  generations, cabinet fit and PSU headroom. Photos included — no
                  imagination required.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
                <Builder
                  sel={sel}
                  activeCat={activeCat}
                  onActivate={setActiveCat}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                />
                <BuildSheet sel={sel} onCopy={handleCopy} onSave={handleSave} />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <SavedDrawer
        open={vaultOpen}
        builds={vault}
        onClose={() => setVaultOpen(false)}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
      <Toasts items={toasts} />
    </div>
  );
}
