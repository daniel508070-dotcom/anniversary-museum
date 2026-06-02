"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";

export function MetricReliquary({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <motion.article
      className="reliquary"
      whileHover={{ y: -8, rotate: -0.5 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <p>{title}</p>
      <strong><AnimatedNumber value={value} /></strong>
      <span>{detail}</span>
    </motion.article>
  );
}
