"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

function parseValue(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    number: Number(match[1].replaceAll(",", "")),
    suffix: match[2] ?? ""
  };
}

export function AnimatedNumber({ value }: { value: string }) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (!parsed) return value;
    return `${Math.round(latest).toLocaleString()}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!parsed) return;
    const controls = animate(count, parsed.number, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1]
    });
    return () => controls.stop();
  }, [count, parsed]);

  if (!parsed) return <>{value}</>;
  return <motion.span>{rounded}</motion.span>;
}
