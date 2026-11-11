import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { formatINR } from "../lib/engine";

export default function AnimatedINR({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 110, damping: 22, mass: 0.9 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(v));
    return unsub;
  }, [spring]);

  return <span className={className}>{formatINR(Math.max(0, display))}</span>;
}
