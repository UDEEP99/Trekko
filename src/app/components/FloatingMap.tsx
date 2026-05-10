"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, Maximize2, Minimize2, X } from "lucide-react";

interface Props {
  destination: string;
}

export default function FloatingMap({ destination }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!destination.trim()) { setCoords(null); return; }
    const controller = new AbortController();
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (data[0]) setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }); })
      .catch(() => {});
    return () => controller.abort();
  }, [destination]);

  if (!coords || !visible) return null;

  const bbox = (d: number) => `${coords.lon - d},${coords.lat - d},${coords.lon + d},${coords.lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(expanded ? 0.05 : 0.03)}&layer=mapnik&marker=${coords.lat},${coords.lon}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div
        layout
        className="glass-map rounded-2xl overflow-hidden"
        animate={{ width: expanded ? 420 : 260, height: expanded ? 320 : 190 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/50 dark:bg-slate-800/50 border-b border-orange-100/30 dark:border-slate-700/40">
          <div className="flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-orange-500 dark:text-cyan-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{destination}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors" aria-label={expanded ? "Collapse map" : "Expand map"}>
              {expanded ? <Minimize2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> : <Maximize2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
            </button>
            <button onClick={() => setVisible(false)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" aria-label="Close map">
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
            </button>
          </div>
        </div>
        {/* Map iframe */}
        <iframe src={src} className="w-full h-[calc(100%-36px)] map-iframe" style={{ border: 0 }} loading="lazy" title={`Map of ${destination}`} />
      </motion.div>
    </motion.div>
  );
}
