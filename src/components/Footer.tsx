import { Cpu, Database, Smartphone, IndianRupee } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="bg-blueprint absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-ink">
                <Cpu size={17} strokeWidth={2.4} />
              </div>
              <p className="font-display text-lg font-bold tracking-[0.16em] text-white">RIGFORGE</p>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-smoke">
              A PC building simulator for the Indian market — pick parts, dodge socket
              mismatches, balance the PSU, and watch FPS estimates update live. The
              production mobile client runs on{" "}
              <span className="text-mist">React Native</span> with{" "}
              <span className="text-mist">Firebase</span> auth, Firestore vault sync and
              a live price feed. This is the web lab edition.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                { icon: Smartphone, t: "REACT NATIVE CLIENT" },
                { icon: Database, t: "FIREBASE BACKEND" },
                { icon: IndianRupee, t: "INR PRICING ENGINE" },
              ].map((chip) => (
                <span
                  key={chip.t}
                  className="flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.18em] text-mist"
                >
                  <chip.icon size={11} className="text-accent" />
                  {chip.t}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:justify-items-end">
            <div>
              <p className="font-mono text-[9.5px] tracking-[0.28em] text-smoke">LAB</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-mist">
                <li><a href="#fastlane" className="transition-colors hover:text-accent">One-click budgets</a></li>
                <li><a href="#builder" className="transition-colors hover:text-accent">Configurator</a></li>
                <li><a href="#top" className="transition-colors hover:text-accent">Back to top</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9.5px] tracking-[0.28em] text-smoke">DISCLAIMER</p>
              <p className="mt-4 max-w-[220px] text-[12px] leading-relaxed text-smoke">
                Prices are illustrative Indian street prices in ₹ and may differ from live
                retail listings. FPS figures are estimates.
              </p>
            </div>
          </div>
        </div>

        <p className="text-outline mt-16 select-none text-center font-display text-[clamp(3rem,12vw,10rem)] font-bold uppercase leading-none tracking-tight opacity-60">
          RIGFORGE
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[9.5px] tracking-[0.18em] text-smoke">
          <span>© 2025 RIGFORGE LABS · BUILT FOR PCMR INDIA</span>
          <span>SPEC · SLOT · BOOT</span>
        </div>
      </div>
    </footer>
  );
}
