"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  const isDark = theme === "dark";

  return (
    <div className="tooltip-wrapper" data-tooltip="Toggle Website Appearance">
      <motion.button
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 dark:bg-slate-800 border border-orange-200/60 dark:border-slate-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div key="moon" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
              <Moon className="w-4 h-4 text-cyan-400" />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
              <Sun className="w-4 h-4 text-orange-500" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
        {/* Active mode indicator dot */}
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" : "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]"}`} />
      </motion.button>
    </div>
  );
}
