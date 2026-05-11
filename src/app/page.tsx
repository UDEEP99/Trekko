"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import {
  Plane,
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  AlertCircle,
  X,
  Compass,
  Globe,
  Cloud,
  TreePalm,
  Hotel,
  Map,
  ExternalLink,
  Navigation,
  Clock,
  Trash2,
  ImageIcon,
  Search,
  Ticket,
  Heart,
  Utensils,
  Camera,
  Mountain,
  Music,
  LogIn,
  Bookmark,
  Share2,
  Check,
  Link2,
  Copy,
  Plus,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/Header";
import FlightSearch from "./components/FlightSearch";
import ItinerarySkeleton from "./components/ItinerarySkeleton";

/* ─── Geocoding Types ─── */
interface GeoSuggestion {
  id: number;
  name: string;
  country: string;
  admin1?: string;
}

/* ─── Types ─── */
interface Activity {
  id?: string;
  isCustom?: boolean;
  time: string;
  place: string;
  description: string;
  imageUrl?: string;
  tourUrl?: string;
  category?: string;
}
interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}
interface SavedTrip {
  id: string;
  destination: string;
  days: number;
  budget: string;
  vibe: string;
  itinerary: DayPlan[];
  savedAt: number;
}

/* ─── localStorage Key ─── */
const STORAGE_KEY = "trekko-recent-trips";
const SAVED_PLANS_KEY = "trekko-saved-plans";
const MAX_RECENT = 5;
const MAX_SAVED = 20;

/* ─── Loading Messages ─── */
const LOADING_MESSAGES = [
  "Searching for hidden gems…",
  "Booking the best spots…",
  "Finding local secrets…",
  "Crafting your perfect days…",
  "Mapping out adventures…",
  "Finalizing your itinerary…",
];

/* ─── Floating Background Decor ─── */
function FloatingDecor() {
  const items = [
    { Icon: Sun, x: "8%", y: "12%", size: 32, delay: 0, duration: 7, color: "text-amber-300/20" },
    { Icon: Cloud, x: "75%", y: "8%", size: 38, delay: 2, duration: 9, color: "text-sky-300/15" },
    { Icon: TreePalm, x: "90%", y: "35%", size: 30, delay: 1, duration: 8, color: "text-emerald-400/15" },
    { Icon: Cloud, x: "20%", y: "45%", size: 28, delay: 4, duration: 10, color: "text-sky-200/12" },
    { Icon: Sun, x: "85%", y: "70%", size: 24, delay: 3, duration: 6, color: "text-orange-300/15" },
    { Icon: TreePalm, x: "5%", y: "75%", size: 26, delay: 5, duration: 9, color: "text-emerald-300/12" },
    { Icon: Cloud, x: "55%", y: "25%", size: 22, delay: 6, duration: 11, color: "text-sky-200/10" },
    { Icon: Plane, x: "40%", y: "5%", size: 20, delay: 1.5, duration: 8, color: "text-orange-300/12" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Warm gradient blobs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-200/15 dark:bg-cyan-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "3s" }} />
      <div className="absolute -bottom-40 right-1/4 w-[450px] h-[450px] bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "5s" }} />
      <div className="absolute top-2/3 left-1/3 w-[350px] h-[350px] bg-teal-200/8 dark:bg-teal-500/5 rounded-full blur-3xl animate-float-slower" style={{ animationDelay: "7s" }} />

      {/* Floating icons */}
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.color}`}
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -15, 0, 10, 0],
            rotate: [0, 5, -5, 3, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Quick Booking Buttons ─── */
function QuickBookings({ destination }: { destination: string }) {
  const encoded = encodeURIComponent(destination);
  const bookings = [
    {
      label: "Book Flights",
      emoji: "✈️",
      icon: Plane,
      href: `https://www.skyscanner.com/transport/flights-from/anywhere/to/${encoded}`,
      className: "booking-btn booking-btn-flights",
    },
    {
      label: "Find Hotels",
      emoji: "🏨",
      icon: Hotel,
      href: `https://www.booking.com/searchresults.html?ss=${encoded}`,
      className: "booking-btn booking-btn-hotels",
    },
    {
      label: "Book Local Tours",
      emoji: "🗺️",
      icon: Map,
      href: `https://www.viator.com/searchResults/all?text=${encoded}`,
      className: "booking-btn booking-btn-tours",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
        Quick Bookings
      </p>
      <div className="flex flex-wrap gap-3">
        {bookings.map((b, i) => (
          <motion.a
            key={b.label}
            href={b.href}
            target="_blank"
            rel="noopener noreferrer"
            className={b.className}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{b.emoji}</span>
            {b.label}
            <ExternalLink className="w-3 h-3 opacity-50" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Premium Custom Dropdown ─── */
function SelectField({
  icon: Icon, label, value, onChange, options, id,
}: {
  icon: React.ElementType; label: string; value: string;
  onChange: (v: string) => void; options: string[]; id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={dropdownRef}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-2.5 pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-orange-100 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-300/40 dark:focus:ring-cyan-400/30 focus:border-orange-400 dark:focus:border-cyan-500 transition-all duration-200 hover:border-orange-300 dark:hover:border-slate-500 relative cursor-pointer"
      >
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 dark:text-cyan-400" />
        <span className="flex-1 truncate font-medium">{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-orange-100/60 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden py-1"
            style={{ transformOrigin: "top" }}
          >
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center gap-2.5 ${
                    value === option
                      ? "bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 dark:hover:text-orange-400"
                  }`}
                >
                  {value === option && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 flex-shrink-0" />
                  )}
                  <span className={value === option ? "" : "ml-4"}>{option}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Category Icon for Activity Cards ─── */
function CategoryIcon({ category, time }: { category?: string; time: string }) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("food") || cat.includes("restaurant") || cat.includes("dining") || cat.includes("eat"))
    return <Utensils className="w-4 h-4 text-white" />;
  if (cat.includes("sightsee") || cat.includes("photo") || cat.includes("view"))
    return <Camera className="w-4 h-4 text-white" />;
  if (cat.includes("adventure") || cat.includes("hike") || cat.includes("trek") || cat.includes("outdoor"))
    return <Mountain className="w-4 h-4 text-white" />;
  if (cat.includes("culture") || cat.includes("museum") || cat.includes("temple") || cat.includes("heritage"))
    return <Globe className="w-4 h-4 text-white" />;
  if (cat.includes("nightlife") || cat.includes("music") || cat.includes("party") || cat.includes("bar"))
    return <Music className="w-4 h-4 text-white" />;
  if (cat.includes("romantic") || cat.includes("couple") || cat.includes("date"))
    return <Heart className="w-4 h-4 text-white" />;
  if (cat.includes("hotel") || cat.includes("relax") || cat.includes("spa") || cat.includes("resort"))
    return <Hotel className="w-4 h-4 text-white" />;
  // fallback based on time of day
  if (time === "Morning") return <Sun className="w-4 h-4 text-white" />;
  if (time === "Afternoon") return <Compass className="w-4 h-4 text-white" />;
  return <Moon className="w-4 h-4 text-white" />;
}

/* ─── ActivityCard Component (Marina Bay style) ─── */
function ActivityCard({
  activity,
  destination,
  onZoom,
  animDelay,
}: {
  activity: Activity;
  destination: string;
  onZoom: (url: string) => void;
  animDelay: number;
}) {
  // Use the image URL already provided by the backend (WikiMedia / Foursquare)
  const imageUrl = activity.imageUrl || null;
  // ── DEBUG: Log what the backend sent for this card ──
  console.log("Card Image Prop Received:", activity.place, "→", activity.imageUrl);
  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">(
    imageUrl ? "loading" : "error"
  );

  // Build Viator tour URL
  const viatorUrl =
    activity.tourUrl ||
    `https://www.viator.com/searchResults/all?text=${encodeURIComponent(activity.place + " " + destination)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animDelay }}
      className="activity-card"
    >
      {/* ─── Left Column: Time + Category Icon ─── */}
      <div className="activity-card-left">
        <span className="activity-card-time">{activity.time === "Morning" ? "10:00 AM" : activity.time === "Afternoon" ? "2:00 PM" : "7:00 PM"}</span>
        <div className="activity-card-icon">
          <CategoryIcon category={activity.category} time={activity.time} />
        </div>
      </div>

      {/* ─── Center Column: Title + Description + Tour Link ─── */}
      <div className="activity-card-center">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="activity-card-title">{activity.place}</h4>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(activity.place + " in " + destination)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="navigate-link"
          >
            <Navigation className="w-3 h-3" />
            Navigate
          </a>
        </div>
        <p className="activity-card-desc">{activity.description}</p>
        {/* Viator Booking Link */}
        <a
          href={viatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-card-tour"
        >
          <Ticket className="w-3.5 h-3.5" />
          Book a Tour
        </a>
      </div>

      {/* ─── Right Column: Image Thumbnail ─── */}
      <div
        className="activity-card-thumb"
        onClick={() => { if (imageUrl && imgStatus === "loaded") onZoom(imageUrl); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" && imageUrl && imgStatus === "loaded") onZoom(imageUrl); }}
      >
        {!imageUrl || imgStatus === "error" ? (
          <div className="activity-card-thumb-fallback">
            <ImageIcon className="w-5 h-5 text-orange-300 dark:text-slate-400" />
          </div>
        ) : (
          <>
            {imgStatus === "loading" && (
              <div className="absolute inset-0 rounded-xl bg-shimmer animate-shimmer z-10" />
            )}
            <Image
              src={imageUrl}
              alt={activity.place}
              width={80}
              height={80}
              unoptimized={true}
              loading="lazy"
              className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${imgStatus === "loaded" ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setImgStatus("loaded")}
              onError={() => setImgStatus("error")}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Add Activity Form ─── */
function AddActivityForm({
  day,
  destination,
  onAdd,
  onCancel,
}: {
  day: number;
  destination: string;
  onAdd: (activity: Activity) => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
        );
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-4 relative w-full overflow-visible" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          placeholder="Type an activity or place..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
        />
        <button
          onClick={onCancel}
          className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-[calc(100%+8px)] left-0 w-full z-[99999] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto py-1"
          >
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd({
                      id: Date.now().toString(),
                      isCustom: true,
                      time: "Flexible",
                      place: s.name,
                      description: `Custom activity added in ${s.name}, ${s.country}`,
                      category: "custom",
                    });
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors flex flex-col border-b border-gray-50 dark:border-slate-700/50 last:border-b-0"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {s.admin1 ? `${s.admin1}, ` : ""}
                    {s.country}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ─── Day Card Gradient Accent ─── */
const DAY_ACCENTS = [
  "from-orange-500 to-amber-400",
  "from-cyan-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-emerald-500 to-green-400",
  "from-violet-500 to-purple-400",
  "from-sky-500 to-blue-400",
  "from-amber-500 to-yellow-400",
];

/* ─── Splash Banner ─── */
const splashContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const splashWordVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function SplashBanner({ onStart }: { onStart: () => void }) {
  const headline = "Get start your trip with Trekko";
  const words = headline.split(" ");

  return (
    <motion.div
      key="splash-banner"
      className="splash-banner"
      variants={splashContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated tropical particles */}
      <div className="splash-particles">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="splash-particle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${6 + i * 3}px`,
              height: `${6 + i * 3}px`,
            }}
            animate={{
              y: [0, -20, 0, 15, 0],
              x: [0, 10, -5, 8, 0],
              opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
              scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Splash content */}
      <div className="splash-content">
        {/* Small tagline */}
        <motion.div variants={splashWordVariants} className="splash-tagline">
          <Sparkles className="w-4 h-4" />
          AI-Powered Travel Planner
        </motion.div>

        {/* Main headline — word by word */}
        <h1 className="splash-headline">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={splashWordVariants}
              className={word === "Trekko" ? "splash-headline-accent" : ""}
            >
              {word}{" "}
            </motion.span>
          ))}
        </h1>

        {/* Sub-text */}
        <motion.p variants={splashWordVariants} className="splash-subtext">
          Discover hidden gems, craft perfect itineraries, and explore the world — all in seconds.
        </motion.p>

        {/* Glowing CTA button */}
        <motion.div variants={splashWordVariants}>
          <motion.button
            onClick={onStart}
            className="splash-cta"
            whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(251, 191, 36, 0.5), 0 0 80px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            <Plane className="w-5 h-5" />
            Start Journey
            <motion.span
              className="splash-cta-arrow"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom decorative wave */}
      <div className="splash-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <motion.path
            d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
            animate={{
              d: [
                "M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z",
                "M0,60 C360,40 720,100 1080,60 C1260,40 1380,80 1440,60 L1440,120 L0,120 Z",
                "M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function ImageLightbox({
  imageUrl,
  onClose,
}: {
  imageUrl: string | null;
  onClose: () => void;
}) {
  if (!imageUrl || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out p-4"
        onClick={onClose}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={imageUrl}
          src={imageUrl}
          alt="Zoomed activity photo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const { data: session } = useSession();
  const [hasStarted, setHasStarted] = useState(false);
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("Moderate");
  const [vibe, setVibe] = useState("Culture & History");
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentTrips, setRecentTrips] = useState<SavedTrip[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedTrip[]>([]);
  const [bannerImageError, setBannerImageError] = useState(false);
  const [selectedDestinationImage, setSelectedDestinationImage] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [addingActivityDay, setAddingActivityDay] = useState<number | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const moodBoardImages = useMemo(() => {
    if (!itinerary) return [];

    const imageUrls = itinerary
      .flatMap((dayPlan) => dayPlan.activities.map((activity) => activity.imageUrl))
      .filter((url): url is string => Boolean(url));

    const uniqueImages = Array.from(new Set(imageUrls));
    const fallbackImage =
      selectedDestinationImage ||
      `https://source.unsplash.com/1600x900/?${encodeURIComponent(destination || "travel destination")}`;

    while (uniqueImages.length < 5) {
      uniqueImages.push(fallbackImage);
    }

    return uniqueImages.slice(0, 5);
  }, [itinerary, selectedDestinationImage, destination]);

  const removeCustomActivity = (dayIndex: number, activityId: string) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      return prev.map((dp, i) => {
        if (i === dayIndex) {
          return {
            ...dp,
            activities: dp.activities.filter((act) => act.id !== activityId),
          };
        }
        return dp;
      });
    });
  };

  const handleNextDay = useCallback(() => {
    setActiveDayIndex((prev) => {
      if (!itinerary || itinerary.length === 0) return prev;
      return Math.min(prev + 1, itinerary.length - 1);
    });
  }, [itinerary]);

  const handlePrevDay = useCallback(() => {
    setActiveDayIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  /* ─── Autocomplete State ─── */
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  /* ─── Debounced Geocoding Fetch ─── */
  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await res.json();
        if (data.results) {
          setSuggestions(
            data.results.map((r: { id: number; name: string; country: string; admin1?: string }) => ({
              id: r.id,
              name: r.name,
              country: r.country,
              admin1: r.admin1,
            }))
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  /* ─── Handle Suggestion Selection ─── */
  const handleSelectSuggestion = useCallback((suggestion: GeoSuggestion) => {
    const placeName = `${suggestion.name}, ${suggestion.country}`;
    setDestination(placeName);
    setShowSuggestions(false);
    setSuggestions([]);
    // Fetch banner image from WikiMedia Commons API
    setBannerImageError(false);
    setSelectedDestinationImage(null);
    setBannerLoading(true);

    const wikiQuery = suggestion.name.replace(/ /g, "_");
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(wikiQuery)}&origin=*`)
      .then((res) => res.json())
      .then((data) => {
        const pages = data?.query?.pages;
        if (!pages) { setBannerImageError(true); return; }
        const pageId = Object.keys(pages)[0];
        const url = pageId && pageId !== "-1" ? pages[pageId]?.original?.source : null;
        if (url) {
          setSelectedDestinationImage(url);
        } else {
          setBannerImageError(true);
        }
      })
      .catch(() => {
        setBannerImageError(true);
      })
      .finally(() => setBannerLoading(false));
  }, []);

  /* ─── Close suggestions on outside click ─── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─── Hydration-safe localStorage load ─── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentTrips(JSON.parse(stored));
    } catch {
      /* ignore corrupt data */
    }
    try {
      const stored = localStorage.getItem(SAVED_PLANS_KEY);
      if (stored) setSavedPlans(JSON.parse(stored));
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  /* ─── Save a trip to localStorage ─── */
  const saveTrip = useCallback(
    (dest: string, d: number, b: string, v: string, trip: DayPlan[]) => {
      setRecentTrips((prev) => {
        const newTrip: SavedTrip = {
          id: `${Date.now()}`,
          destination: dest,
          days: d,
          budget: b,
          vibe: v,
          itinerary: trip,
          savedAt: Date.now(),
        };
        // Remove duplicate destinations, prepend new, cap at MAX_RECENT
        const updated = [newTrip, ...prev.filter((t) => t.destination.toLowerCase() !== dest.toLowerCase())].slice(0, MAX_RECENT);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          /* storage full — silently fail */
        }
        return updated;
      });
    },
    []
  );

  /* ─── Load a saved trip into the results view ─── */
  function loadSavedTrip(saved: SavedTrip) {
    setDestination(saved.destination);
    setDays(saved.days);
    setBudget(saved.budget);
    setVibe(saved.vibe);
    setItinerary(saved.itinerary);
    setError(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  /* ─── Clear history ─── */
  function clearHistory() {
    setRecentTrips([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  /* ─── Show toast ─── */
  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* ─── Save plan to Saved Plans ─── */
  const savePlan = useCallback(() => {
    if (!itinerary || !destination.trim()) return;
    const newPlan: SavedTrip = {
      id: `saved-${Date.now()}`,
      destination: destination.trim(),
      days,
      budget,
      vibe,
      itinerary,
      savedAt: Date.now(),
    };
    setSavedPlans((prev) => {
      const updated = [newPlan, ...prev.filter((p) => p.destination.toLowerCase() !== destination.trim().toLowerCase())].slice(0, MAX_SAVED);
      try {
        localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
      } catch {
        /* storage full */
      }
      return updated;
    });
    setIsSaved(true);
    showToast("Plan saved successfully!", "success");
  }, [itinerary, destination, days, budget, vibe, showToast]);

  /* ─── Remove plan from Saved Plans (unsave toggle) ─── */
  const removeSavedPlan = useCallback(() => {
    if (!destination.trim()) return;
    const destLower = destination.trim().toLowerCase();
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.destination.toLowerCase() !== destLower);
      try {
        localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
    setIsSaved(false);
    showToast("Plan removed from saved.", "info");
  }, [destination, showToast]);

  /* ─── Sync isSaved when itinerary, destination, or savedPlans change ─── */
  useEffect(() => {
    if (!itinerary || !destination.trim()) {
      setIsSaved(false);
      return;
    }
    const destLower = destination.trim().toLowerCase();
    const alreadySaved = savedPlans.some((p) => p.destination.toLowerCase() === destLower);
    setIsSaved(alreadySaved);
  }, [itinerary, destination, savedPlans]);

  useEffect(() => {
    if (!itinerary || itinerary.length === 0) {
      setActiveDayIndex(0);
      return;
    }
    setActiveDayIndex((prev) => Math.min(prev, itinerary.length - 1));
  }, [itinerary]);

  /* ─── Share plan ─── */
  const sharePlan = useCallback(async () => {
    const shareData = {
      title: `My ${days}-day trip to ${destination} — Trekko`,
      text: `Check out my ${days}-day trip plan to ${destination}, crafted by Trekko AI!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "info");
      } catch {
        showToast("Could not copy link", "info");
      }
    }
  }, [days, destination, showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setItinerary(null);
    setError(null);
    setMsgIndex(0);

    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, budget, vibe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setItinerary(data.trip);
      setIsSaved(false);
      saveTrip(destination.trim(), days, budget, vibe, data.trip);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate itinerary");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {!hasStarted ? (
        <SplashBanner key="splash" onStart={() => setHasStarted(true)} />
      ) : (
        <motion.div
          key="main-app"
          className="relative min-h-screen overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* ─── Floating Background Decor ─── */}
          <FloatingDecor />

          {/* ─── NAVBAR ─── */}
          <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <Plane className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient tracking-tight">Trekko</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>AI-Powered Travel</span>
                </div>
                <ThemeToggle />
                <Header
                  recentTrips={recentTrips}
                  savedPlans={savedPlans}
                  onLoadTrip={loadSavedTrip}
                  onClearHistory={clearHistory}
                />
              </motion.div>
            </div>
          </nav>

          {/* ─── HERO ─── */}
          <section className="pt-16 pb-8 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/30 border border-orange-200/60 dark:border-orange-700/50 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Powered by AI
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Plan your dream trip{" "}
                  <span className="text-gradient">in seconds.</span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed"
              >
                Trekko AI builds personalized, day-by-day itineraries tailored to your budget and travel style.
              </motion.p>
            </div>
          </section>

          {/* ─── FORM CARD ─── */}
          <section className="px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="max-w-2xl mx-auto"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-strong rounded-2xl p-6 sm:p-8 shadow-glass hover:shadow-glass-lg transition-shadow duration-500"
              >
                {/* ─── Destination Banner Image ─── */}
                <AnimatePresence>
                  {(selectedDestinationImage || bannerLoading) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden rounded-2xl relative"
                    >
                      <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden"
                      >
                        {/* Banner image with error boundary — shows gradient fallback on failure */}
                        {bannerLoading ? (
                          <div className="w-full h-full bg-shimmer animate-shimmer rounded-2xl" />
                        ) : !bannerImageError && selectedDestinationImage ? (
                          <>  {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedDestinationImage}
                              alt={`${destination} destination`}
                              className="w-full h-full object-cover rounded-lg"
                              onError={() => setBannerImageError(true)}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-500 to-cyan-500 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="w-8 h-8 text-white/80 mx-auto mb-2" />
                              <p className="text-white font-bold text-xl drop-shadow-md">{destination}</p>
                              <p className="text-white/70 text-sm mt-1">Destination Preview</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
                        >
                          <div>
                            <p className="text-white font-bold text-lg drop-shadow-md">{destination}</p>
                            <p className="text-white/80 text-xs drop-shadow-sm">Your next adventure awaits</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedDestinationImage(null)}
                            className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Destination — Animated Search + Autocomplete */}
                  <div className="sm:col-span-2 relative group" ref={suggestionsRef}>
                    <label htmlFor="destination" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Where to?
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        scale: searchFocused ? 1.02 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div
                        className={`absolute -inset-0.5 rounded-xl transition-all duration-300 pointer-events-none ${searchFocused
                          ? "bg-gradient-to-r from-orange-400/30 via-amber-300/20 to-cyan-400/30 dark:from-orange-500/20 dark:via-amber-400/15 dark:to-cyan-500/20 blur-sm opacity-100"
                          : "opacity-0"
                          }`}
                      />
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${searchFocused ? "text-orange-600 dark:text-cyan-300" : "text-orange-500 dark:text-cyan-400"}`} />
                        <input
                          id="destination"
                          type="text"
                          placeholder="Search Paris, Tokyo, Bali…"
                          value={destination}
                          onChange={(e) => {
                            setDestination(e.target.value);
                            fetchSuggestions(e.target.value);
                          }}
                          onFocus={() => {
                            setSearchFocused(true);
                            if (suggestions.length > 0) setShowSuggestions(true);
                          }}
                          onBlur={() => setSearchFocused(false)}
                          autoComplete="off"
                          required
                          className={`w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 border rounded-xl text-slate-700 dark:text-slate-200 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all duration-200 ${searchFocused
                            ? "border-orange-400 dark:border-cyan-500 ring-2 ring-orange-300/40 dark:ring-cyan-400/30 shadow-lg shadow-orange-200/20 dark:shadow-cyan-500/10"
                            : "border-orange-100 dark:border-slate-600 hover:border-orange-300 dark:hover:border-slate-500"
                            }`}
                        />
                      </div>
                    </motion.div>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{ transformOrigin: "top" }}
                          className="absolute z-50 left-0 right-0 mt-2 rounded-xl overflow-hidden glass-strong shadow-glass-lg border border-orange-100/60 dark:border-slate-600/60"
                        >
                          {suggestions.map((s, i) => (
                            <motion.button
                              key={s.id}
                              type="button"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => handleSelectSuggestion(s)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50/80 dark:hover:bg-slate-700/60 transition-colors duration-150 border-b border-orange-50 dark:border-slate-700/50 last:border-b-0"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-orange-500 dark:text-cyan-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.name}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                  {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Days */}
                  <div className="relative group">
                    <label htmlFor="days" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Number of Days
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 dark:text-cyan-400" />
                      <input
                        id="days"
                        type="number"
                        min={1}
                        max={14}
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-orange-100 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300/40 dark:focus:ring-cyan-400/30 focus:border-orange-400 dark:focus:border-cyan-500 transition-all duration-200 hover:border-orange-300 dark:hover:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <SelectField
                    id="budget"
                    icon={Wallet}
                    label="Budget"
                    value={budget}
                    onChange={setBudget}
                    options={["Backpacker", "Moderate", "Luxury"]}
                  />

                  {/* Vibe */}
                  <div className="sm:col-span-2">
                    <SelectField
                      id="vibe"
                      icon={Compass}
                      label="Travel Style"
                      value={vibe}
                      onChange={setVibe}
                      options={["Romantic for Couples", "Chill & Relax", "Adventure", "Culture & History", "Party"]}
                    />
                  </div>
                </div>

                {/* Submit — auth-gated */}
                {session ? (
                  <motion.button
                    type="submit"
                    disabled={loading || !destination.trim()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating…
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Itinerary
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => signIn("appid")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login to Generate Itinerary
                  </motion.button>
                )}
              </form>
            </motion.div>

            {/* ─── FLIGHT SEARCH ─── */}
            <FlightSearch />
          </section>



          {/* ─── LOADING STATE ─── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Rotating loading message */}
                <div className="text-center mb-8 px-6">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={msgIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-lg font-medium text-orange-700 dark:text-orange-400"
                    >
                      {LOADING_MESSAGES[msgIndex]}
                    </motion.p>
                  </AnimatePresence>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-orange-400"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Premium skeleton loader */}
                <ItinerarySkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── ERROR TOAST ─── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 shadow-lg shadow-red-100/50 dark:shadow-red-900/20 max-w-md">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
                  <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── RESULTS ─── */}
          <AnimatePresence>
            {itinerary && (
              <section ref={resultsRef} className="px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      Your Trip to{" "}
                      <span className="text-gradient">{destination}</span>
                    </h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      {itinerary.length} days · {budget} · {vibe}
                    </p>
                  </motion.div>

                  {/* ─── Action Bar: Save & Share ─── */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="action-bar"
                  >
                    <motion.button
                      onClick={isSaved ? removeSavedPlan : savePlan}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`action-btn action-btn-save ${isSaved ? "" : ""}`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Save Plan
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={sharePlan}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="action-btn action-btn-share"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </motion.button>
                  </motion.div>

                  {/* ─── Quick Bookings ─── */}
                  <QuickBookings destination={destination} />

                  {/* ─── Mood Board Hero Grid ─── */}
                  {moodBoardImages.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.45 }}
                      className="mt-8"
                    >
                      <div className="mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Mood Board</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          A visual preview of your upcoming journey.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="overflow-hidden rounded-2xl min-h-[260px] md:min-h-[340px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={moodBoardImages[0]}
                            alt={`${destination} mood board highlight`}
                            className="rounded-2xl object-cover w-full h-full hover:scale-105 transition-transform duration-500 cursor-pointer"
                            loading="lazy"
                            onClick={() => setZoomedImage(moodBoardImages[0])}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {moodBoardImages.slice(1, 5).map((imageUrl, imageIndex) => (
                            <div key={`${imageUrl}-${imageIndex}`} className="overflow-hidden rounded-2xl h-32 sm:h-40 md:h-[162px]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imageUrl}
                                alt={`${destination} mood board image ${imageIndex + 2}`}
                                className="rounded-2xl object-cover w-full h-full hover:scale-105 transition-transform duration-500 cursor-pointer"
                                loading="lazy"
                                onClick={() => setZoomedImage(imageUrl)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {/* ─── Day Pills + Horizontal Card Swipe ─── */}
                  <div className="mt-8">
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                      {itinerary.map((dayPlan, index) => {
                        const isActive = activeDayIndex === index;
                        return (
                          <button
                            key={dayPlan.day}
                            type="button"
                            onClick={() => setActiveDayIndex(index)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-200 ${
                              isActive
                                ? "bg-orange-500 border-orange-500 text-white dark:bg-cyan-500 dark:border-cyan-500 dark:text-slate-900 shadow-md shadow-orange-500/25 dark:shadow-cyan-500/25"
                                : "bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500"
                            }`}
                          >
                            Day {dayPlan.day}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence mode="wait">
                      {itinerary[activeDayIndex] && (
                        <motion.div
                          key={activeDayIndex}
                          initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(4px)" }}
                          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                          className="mt-5 glass-strong rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-500 group relative z-10 focus-within:z-50"
                          style={{ transformOrigin: "center top", transformStyle: "preserve-3d" }}
                        >
                          {/* Gradient accent bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${DAY_ACCENTS[activeDayIndex % DAY_ACCENTS.length]}`} />

                          {/* Day Header */}
                          <div className="flex items-center gap-3 mb-5">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${DAY_ACCENTS[activeDayIndex % DAY_ACCENTS.length]} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                              D{itinerary[activeDayIndex].day}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">Day {itinerary[activeDayIndex].day}</h3>
                              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{itinerary[activeDayIndex].theme}</p>
                            </div>
                          </div>

                          {/* Activities */}
                          <div className="space-y-3">
                            {itinerary[activeDayIndex].activities.map((activity, aIdx) => (
                              <div key={activity.id || aIdx} className="flex flex-row justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <ActivityCard
                                    activity={activity}
                                    destination={destination}
                                    onZoom={setZoomedImage}
                                    animDelay={aIdx * 0.08 + 0.15}
                                  />
                                </div>
                                {activity.isCustom && activity.id && (
                                  <button
                                    onClick={() => removeCustomActivity(activeDayIndex, activity.id!)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer mt-2"
                                    title="Delete Activity"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* ─── Find Hotels Banner ─── */}
                          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4.5 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4 justify-between transition-colors duration-300">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-cyan-900/40 flex items-center justify-center flex-shrink-0">
                                <Hotel className="w-5 h-5 text-orange-600 dark:text-cyan-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Find hotels in {destination}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Discover great places to stay near your activities.</p>
                              </div>
                            </div>
                            <a
                              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-center"
                            >
                              Search Hotels
                            </a>
                          </div>

                          {/* ─── Add Activity Button / Form ─── */}
                          <div className="mt-4">
                            {addingActivityDay === itinerary[activeDayIndex].day ? (
                              <AddActivityForm
                                day={itinerary[activeDayIndex].day}
                                destination={destination}
                                onAdd={(newActivity) => {
                                  setItinerary((prev) => {
                                    if (!prev) return prev;
                                    return prev.map((dp) => {
                                      if (dp.day === itinerary[activeDayIndex].day) {
                                        return {
                                          ...dp,
                                          activities: [...dp.activities, newActivity],
                                        };
                                      }
                                      return dp;
                                    });
                                  });
                                  setAddingActivityDay(null);
                                }}
                                onCancel={() => setAddingActivityDay(null)}
                              />
                            ) : (
                              <button
                                onClick={() => setAddingActivityDay(itinerary[activeDayIndex].day)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-cyan-400 hover:border-orange-300 dark:hover:border-cyan-500/50 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                              >
                                <Plus className="w-4 h-4" />
                                Add Activity
                              </button>
                            )}
                          </div>

                          {/* ─── Previous / Next Day Navigation ─── */}
                          <div className="flex justify-between w-full mt-6">
                            <div>
                              {activeDayIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={handlePrevDay}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all"
                                >
                                  <span>⬅</span>
                                  Previous Day
                                </button>
                              )}
                            </div>
                            <div>
                              {activeDayIndex < itinerary.length - 1 && (
                                <button
                                  type="button"
                                  onClick={handleNextDay}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-amber-600 dark:hover:from-cyan-400 dark:hover:to-blue-400 transition-all"
                                >
                                  Next Day
                                  <span>➡</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ─── Affiliate Carousels ─── */}
                  <div className="mt-14 space-y-10">
                    {/* Hotels Carousel */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                        Recommended Hotels in {destination}
                      </h3>
                      <div className="flex flex-row overflow-x-auto gap-4 hide-scrollbar px-2 py-4 -mx-2">
                        {[
                          { name: "Luxury Resort & Spa", desc: "5-star relaxation and comfort", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80" },
                          { name: "Downtown Boutique Hotel", desc: "Heart of the city vibe", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80" },
                          { name: "Oceanview Suites", desc: "Breathtaking coastal views", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80" },
                          { name: "Cozy Backpacker Hostel", desc: "Budget friendly and social", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=80" },
                        ].map((hotel, idx) => (
                          <a
                            key={idx}
                            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + " " + destination)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20 overflow-hidden group block"
                          >
                            <div className="h-36 overflow-hidden relative">
                              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">{hotel.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{hotel.desc}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Tours Carousel */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Map className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                        Recommended Tours in {destination}
                      </h3>
                      <div className="flex flex-row overflow-x-auto gap-4 hide-scrollbar px-2 py-4 -mx-2">
                        {[
                          { name: "Guided City Highlights Tour", desc: "See the best spots in one day", img: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=500&q=80" },
                          { name: "Local Food Tasting Experience", desc: "Taste authentic local cuisine", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80" },
                          { name: "Sunset Cruise Adventure", desc: "Relaxing evening on the water", img: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=500&q=80" },
                          { name: "Historical Walking Tour", desc: "Step back in time with a guide", img: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=500&q=80" },
                        ].map((tour, idx) => (
                          <a
                            key={idx}
                            href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(tour.name + " " + destination)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20 overflow-hidden group block"
                          >
                            <div className="h-36 overflow-hidden relative">
                              <img src={tour.img} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">{tour.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{tour.desc}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Generate Again */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: itinerary.length * 0.15 + 0.5 }}
                    className="mt-10 text-center"
                  >
                    <button
                      onClick={() => {
                        setItinerary(null);
                        setIsSaved(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-orange-200 dark:border-slate-600 text-orange-700 dark:text-cyan-400 font-medium text-sm hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors duration-200"
                    >
                      <Sparkles className="w-4 h-4" />
                      Plan another trip
                    </button>
                  </motion.div>
                </div>
              </section>
            )}
          </AnimatePresence>



          {/* ─── TOAST NOTIFICATION ─── */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-info"}`}>
                  {toast.type === "success" ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Link2 className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{toast.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Footer ─── */}
          <footer className="py-8 text-center text-sm text-slate-400 dark:text-slate-500 border-t border-orange-100/50 dark:border-slate-800">
            <p>Built with ✈️ by <span className="text-gradient font-semibold">Trekko AI</span></p>
          </footer>

          <ImageLightbox imageUrl={zoomedImage} onClose={() => setZoomedImage(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
