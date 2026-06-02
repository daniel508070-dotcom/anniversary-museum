"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function AccessGate({ children }: { children: ReactNode }) {
  const [pin, setPin] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem("anniversary-access") === "granted") {
      setOpen(true);
    }
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin === "1102") {
      window.sessionStorage.setItem("anniversary-access", "granted");
      setOpen(true);
      return;
    }
    setError("The archive waits for the first date.");
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.main
            className="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="gate__glass" aria-hidden="true" />
            <motion.section
              className="gate__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="eyebrow">Private archive</p>
              <h1>Daniel & Isabella</h1>
              <form onSubmit={submit} className="gate__form">
                <label htmlFor="pin">When did our journey begin?</label>
                <input
                  id="pin"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  autoComplete="one-time-code"
                  value={pin}
                  onChange={(event) => {
                    setError("");
                    setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
                  aria-describedby={error ? "pin-error" : undefined}
                />
                <button type="submit">Enter the nave</button>
                {error && <p id="pin-error" className="gate__error">{error}</p>}
              </form>
            </motion.section>
          </motion.main>
        )}
      </AnimatePresence>
      {open && children}
    </>
  );
}
