import { Sparkle } from "lucide-react";

const ITEMS = [
  "INTEL", "AMD", "NVIDIA", "ASUS", "MSI", "GIGABYTE", "CORSAIR", "SAMSUNG",
  "G.SKILL", "NOCTUA", "LIAN LI", "NZXT", "DEEPCOOL", "WESTERN DIGITAL",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative border-y border-line bg-panel/60 py-3.5">
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-8 pr-8">
          {row.map((brand, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="whitespace-nowrap font-mono text-[11px] font-semibold tracking-[0.3em] text-smoke">
                {brand}
              </span>
              <Sparkle size={9} className="shrink-0 text-accent/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
