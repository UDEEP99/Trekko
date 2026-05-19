"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { Sparkles, Compass, ChevronRight, ChevronDown, ArrowRight, Globe, Calendar, Wallet, Waves, Shell } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";



/* ── Floating Beach Particles ── */
function BeachParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(circle, #00BCD4 0%, transparent 70%)", animation: "tropicalFloat 12s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full blur-[80px] opacity-15"
        style={{ background: "radial-gradient(circle, #FFB347 0%, transparent 70%)", animation: "tropicalFloat 15s ease-in-out infinite 3s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[90px] opacity-10"
        style={{ background: "radial-gradient(circle, #69F0AE 0%, transparent 70%)", animation: "tropicalFloat 18s ease-in-out infinite 6s" }} />
      {/* Floating bubbles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bubble" style={{
          left: `${10 + i * 12}%`,
          width: `${4 + (i % 3) * 3}px`,
          height: `${4 + (i % 3) * 3}px`,
          animationDuration: `${6 + i * 2}s`,
          animationDelay: `${i * 1.5}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Destination Hero Slides ── */
const HERO_SLIDES = [
  { name: "Santorini", country: "Greece", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=85", tagline: "Where the sky meets the sea" },
  { name: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85", tagline: "Island of the Gods" },
  { name: "Kyoto", country: "Japan", img: "https://images.unsplash.com/photo-1522383507380-c7d4ad5f96a1?w=1920&q=85", tagline: "Ancient temples, timeless beauty" },
  { name: "Maldives", country: "Indian Ocean", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=85", tagline: "Paradise on Earth" },
  { name: "Amalfi", country: "Italy", img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1920&q=85", tagline: "Where the mountains kiss the coast" },
];

const EXPLORE = [
  { name: "Swiss Alps", country: "Switzerland", img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80" },
  { name: "Machu Picchu", country: "Peru", img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80" },
  { name: "Dubai", country: "UAE", img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80" },
  { name: "Iceland", country: "Nordic", img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80" },
  { name: "Cappadocia", country: "Turkey", img: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600&q=80" },
  { name: "Patagonia", country: "Argentina", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80" },
];

const FEATURES = [
  { icon: Sparkles, title: "AI-Crafted Itineraries", desc: "Our AI studies thousands of reviews and local insights to craft a trip plan uniquely yours." },
  { icon: Globe, title: "200+ Destinations", desc: "From Kyoto's temples to Patagonia's glaciers — plan trips anywhere." },
  { icon: Calendar, title: "Day-by-Day Plans", desc: "Wake up knowing exactly where to go, what to see, and where to eat." },
  { icon: Wallet, title: "Budget Aware", desc: "Whether backpacker or luxury, your plan adapts to your wallet." },
];



export default function TrekkoLanding() {
  const { data: session } = useSession();
  const [current, setCurrent] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Auto-rotate hero slides */
  const goToSlide = useCallback((idx: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTimeout(() => setTransitioning(false), 100);
    }, 600);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 3D mouse tracking for hero */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const slide = HERO_SLIDES[current];
  const navSolid = scrollY > 60;

  return (
    <div className="relative" style={{ animation: "pageTransitionIn 0.6s ease-out" }}>
      <BeachParticles />

      {/* ══ NAVBAR ══ */}
      <nav className={`trekko-nav ${navSolid ? "nav--solid" : ""}`} style={{ background: navSolid ? "var(--gd2)" : "transparent", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] flex items-center justify-center shadow-lg" style={{ animation: "float 4s ease-in-out infinite" }}>
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-[0.2em] italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Trekko</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="nav-link">About</a>
          <a href="#explore" className="nav-link">Explore</a>
          <a href="#plan" className="nav-link">Plan</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <Link href="/dashboard" className="btn btn-primary text-sm py-2.5 px-5">
              <Sparkles className="w-4 h-4" /> Dashboard
            </Link>
          ) : (
            <>
              <button onClick={() => signIn("appid")} className="text-white/80 text-sm font-medium hover:text-white transition-colors hidden sm:block cursor-pointer">Log In</button>
              <button onClick={() => signIn("appid")} className="btn btn-primary text-sm py-2.5 px-5">Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ══ HERO — FULL-SCREEN PHOTO SLIDESHOW WITH 3D PARALLAX ══ */}
      <section className="relative w-full h-screen overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.name} className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === current && !transitioning ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
            <Image src={s.img} alt={s.name} fill className="object-cover"
              style={{
                transform: `scale(1.08) translateY(${scrollY * 0.15}px) translateX(${mousePos.x * -8}px) rotateY(${mousePos.x * 0.5}deg)`,
                transition: "transform 0.3s ease-out",
              }}
              priority={i === 0} />
          </div>
        ))}

        {/* Gradient overlay with beach tint */}
        <div className="absolute inset-0 z-[2]" style={{
          background: "linear-gradient(180deg, rgba(0,54,64,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,54,64,0.7) 100%)"
        }} />

        {/* Animated bottom waves */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] h-[100px]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z" fill="rgba(0,96,100,0.3)"
              style={{ animation: "oceanWave1 8s ease-in-out infinite" }} />
            <path d="M0,90 C360,60 720,100 1080,90 C1260,70 1380,95 1440,90 L1440,120 L0,120 Z" fill="rgba(0,77,86,0.4)"
              style={{ animation: "oceanWave2 6s ease-in-out infinite" }} />
            <path d="M0,100 C480,110 960,95 1440,105 L1440,120 L0,120 Z" fill="#006064" />
          </svg>
        </div>

        {/* Center content with 3D depth */}
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center text-center px-6"
          style={{ transform: `perspective(1000px) rotateX(${mousePos.y * -0.5}deg) rotateY(${mousePos.x * 0.5}deg)`, transition: "transform 0.2s ease-out" }}>
          <div className="transition-all duration-700 ease-out"
            style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(40px) scale(0.95)" : "translateY(0) scale(1)" }}>
            <p className="text-white/70 text-sm md:text-base uppercase tracking-[0.35em] font-medium mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {slide.country}
            </p>
            <h1 className="text-white font-black leading-[0.9] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(4rem, 15vw, 12rem)",
                textShadow: "0 4px 60px rgba(0,188,212,0.3), 0 2px 20px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
              }}>
              {slide.name}
            </h1>
            <p className="text-white/60 text-lg md:text-xl italic max-w-lg mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {slide.tagline}
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-100"
            style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(20px)" : "translateY(0)" }}>
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-4 shadow-xl">
              <Sparkles className="w-5 h-5" /> Plan My Trip
            </Link>
            <a href="#explore" className="btn btn-ghost text-base px-8 py-4 backdrop-blur-sm">
              Explore <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)} className="group relative cursor-pointer" aria-label={`Go to slide ${i + 1}`}>
              <div className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-[#00BCD4]" : "w-4 bg-white/40 group-hover:bg-white/60"}`}
                style={i === current ? { boxShadow: "0 0 12px rgba(0,188,212,0.6)" } : {}} />
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Side counter */}
        <div className="absolute right-8 bottom-8 z-[4] text-white/50 text-sm font-mono hidden md:block">
          <span className="text-[#00BCD4] font-bold text-lg">{String(current + 1).padStart(2, "0")}</span>
          <span className="mx-1">/</span>
          <span>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
        </div>
      </section>

      {/* ══ ABOUT — WHY TREKKO ══ */}
      <section id="about" className="relative z-10 py-28 px-6 bg-gradient-to-b from-tsky-300 via-tsky-200 to-tsky-100 dark:bg-none">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 opacity-[0.05] text-white" style={{ animation: "palmSway 8s ease-in-out infinite" }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20" data-reveal>
            <span className="t-label text-gold-700 dark:text-[#FFB300] mb-4 block">
              <Waves className="w-4 h-4 inline-block mr-2 mb-0.5" />Why Trekko
            </span>
            <h2 className="t-h1 text-ink dark:text-white mb-6">Travel Planning,<br /><em className="text-gradient">Reimagined</em></h2>
            <p className="t-tagline text-ink/70 dark:text-white/50 max-w-2xl mx-auto">
              We combine the magic of artificial intelligence with deep travel expertise to create journeys that feel handcrafted — because they are.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-container" data-reveal-group>
            {FEATURES.map((f, i) => (
              <div key={i} className="glass card-3d p-8 rounded-2xl group cursor-default" data-reveal>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-sky-400/20 dark:from-[#FFB300]/20 dark:to-[#00BCD4]/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <f.icon className="w-6 h-6 text-gold-700 dark:text-[#FFB300]" />
                </div>
                <h3 className="t-h4 text-ink dark:text-white mb-2">{f.title}</h3>
                <p className="t-body text-ink/70 dark:text-white/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPLORE — DESTINATION GRID WITH 3D CARDS ══ */}
      <section id="explore" className="relative z-10 py-28 px-6 bg-gradient-to-b from-tsky-100 via-tsky-200 to-tsky-300 dark:bg-none">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <span className="t-label text-gold-700 dark:text-[#FFB300] mb-4 block">
              <Shell className="w-4 h-4 inline-block mr-2 mb-0.5" />Popular Destinations
            </span>
            <h2 className="t-h1 text-ink dark:text-white">Where Will <em className="text-gradient">You</em> Go?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 perspective-container" data-reveal-group>
            {EXPLORE.map((d, i) => (
              <Link href="/dashboard" key={i} className="group relative overflow-hidden rounded-2xl cursor-pointer block aspect-[4/3] card-3d" data-reveal>
                <Image src={d.img} alt={d.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[#00BCD4]/0 group-hover:bg-[#00BCD4]/10 transition-colors duration-500" />
                {/* 3D shine overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,188,212,0.05) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-1">{d.country}</p>
                  <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{d.name}</h3>
                  <div className="mt-3 flex items-center gap-1 text-[#FFB300] text-sm font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Plan this trip <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ══ FOOTER ══ */}
      <footer className="relative z-10 border-t border-ink/10 dark:border-white/10 py-14 px-6 bg-white dark:bg-transparent">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 to-sky-400 dark:from-[#FFB300] dark:to-[#00BCD4] flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#0A2540]" />
            </div>
            <span className="text-ink dark:text-white font-bold tracking-[0.15em] uppercase text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Trekko</span>
          </div>
          <p className="text-ink/60 dark:text-white/35 text-sm">Built with ✈️ and AI by <span className="text-gradient font-semibold">Trekko</span></p>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-ink/60 hover:text-sky-500 dark:text-white/40 text-sm dark:hover:text-[#00BCD4] transition-colors">About</a>
            <a href="#explore" className="text-ink/60 hover:text-sky-500 dark:text-white/40 text-sm dark:hover:text-[#00BCD4] transition-colors">Explore</a>
            <a href="#plan" className="text-ink/60 hover:text-sky-500 dark:text-white/40 text-sm dark:hover:text-[#00BCD4] transition-colors">Plan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
