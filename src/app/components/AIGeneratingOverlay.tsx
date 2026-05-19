"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
    Compass, MapPin, Plane, Globe, Sparkles, Route,
    Camera, Utensils, Hotel, Clock
} from "lucide-react";

const STEPS = [
    { icon: Globe, label: "Analyzing destination", color: "#00BCD4", lightColor: "#00838F" },
    { icon: Route, label: "Mapping routes", color: "#7C4DFF", lightColor: "#5E35B1" },
    { icon: MapPin, label: "Finding hidden gems", color: "#FFB300", lightColor: "#E65100" },
    { icon: Camera, label: "Curating experiences", color: "#FF6B6B", lightColor: "#C62828" },
    { icon: Utensils, label: "Picking local flavors", color: "#69F0AE", lightColor: "#2E7D32" },
    { icon: Hotel, label: "Selecting accommodations", color: "#40C4FF", lightColor: "#0277BD" },
    { icon: Clock, label: "Optimizing schedule", color: "#FF80AB", lightColor: "#AD1457" },
    { icon: Sparkles, label: "Finalizing your plan", color: "#FFD740", lightColor: "#F57F17" },
];

const ORBIT_ICONS = [Plane, MapPin, Camera, Globe, Utensils, Hotel];

export default function AIGeneratingOverlay({
    destination,
    message,
}: {
    destination: string;
    message: string;
}) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const [activeStep, setActiveStep] = useState(0);
    const [particles, setParticles] = useState<Array<{
        id: number; x: number; y: number; size: number; delay: number; duration: number;
    }>>([]);

    useEffect(() => {
        const pts = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 4,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 4,
        }));
        setParticles(pts);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % STEPS.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    const currentStep = STEPS[activeStep];
    const StepIcon = currentStep.icon;
    const stepColor = isDark ? currentStep.color : currentStep.lightColor;

    // Theme-aware colors
    const bg = isDark
        ? "radial-gradient(ellipse at center, rgba(10,20,50,0.97) 0%, rgba(5,10,30,0.99) 100%)"
        : "radial-gradient(ellipse at center, rgba(224,247,250,0.97) 0%, rgba(178,235,242,0.99) 100%)";

    const particleColor = isDark
        ? "radial-gradient(circle, rgba(0,188,212,0.6), transparent)"
        : "radial-gradient(circle, rgba(0,150,180,0.5), transparent)";

    const outerRingBorder = isDark
        ? "1px solid rgba(0,188,212,0.15)"
        : "1px solid rgba(0,150,180,0.25)";

    const middleRingBorder = isDark
        ? "1px dashed rgba(124,77,255,0.2)"
        : "1px dashed rgba(94,53,177,0.25)";

    const innerGlowBg = isDark
        ? "radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(0,150,180,0.12) 0%, transparent 70%)";

    const innerGlowBorder = isDark
        ? "1px solid rgba(0,188,212,0.12)"
        : "1px solid rgba(0,150,180,0.2)";

    const innerGlowShadows = isDark
        ? [
            "0 0 40px rgba(0,188,212,0.1), inset 0 0 40px rgba(0,188,212,0.05)",
            "0 0 80px rgba(0,188,212,0.2), inset 0 0 60px rgba(0,188,212,0.1)",
            "0 0 40px rgba(0,188,212,0.1), inset 0 0 40px rgba(0,188,212,0.05)",
        ]
        : [
            "0 0 40px rgba(0,150,180,0.08), inset 0 0 40px rgba(0,150,180,0.04)",
            "0 0 80px rgba(0,150,180,0.15), inset 0 0 60px rgba(0,150,180,0.08)",
            "0 0 40px rgba(0,150,180,0.08), inset 0 0 40px rgba(0,150,180,0.04)",
        ];

    const coreBg = isDark
        ? "radial-gradient(circle, rgba(0,188,212,0.15) 0%, rgba(124,77,255,0.08) 50%, transparent 100%)"
        : "radial-gradient(circle, rgba(0,150,180,0.1) 0%, rgba(94,53,177,0.06) 50%, transparent 100%)";

    const compassColor = isDark ? "text-cyan-400" : "text-teal-600";

    const orbitIconBg = isDark
        ? "bg-white/5 border-white/10"
        : "bg-white/70 border-black/10 shadow-sm";

    const orbitIconColor = isDark ? "text-cyan-400/80" : "text-teal-600";

    const neuralLineColor = isDark
        ? "linear-gradient(90deg, rgba(0,188,212,0.3), transparent)"
        : "linear-gradient(90deg, rgba(0,150,180,0.2), transparent)";

    const titleColor = isDark ? "text-white" : "text-gray-800";
    const subtextColor = isDark ? "text-white/50" : "text-gray-500";
    const progressBg = isDark ? "bg-white/5" : "bg-black/5";
    const dotInactive = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";

    const destinationGradient = isDark
        ? "from-cyan-400 via-purple-400 to-amber-400"
        : "from-teal-600 via-purple-600 to-orange-500";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{
                background: bg,
                backdropFilter: "blur(30px)",
            }}
        >
            {/* Ambient particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: particleColor,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Central Orb Container */}
            <div className="relative flex flex-col items-center gap-8">
                {/* Orbital System */}
                <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: outerRingBorder }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {ORBIT_ICONS.map((Icon, i) => {
                            const angle = (i / ORBIT_ICONS.length) * 360;
                            return (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                        transform: `rotate(${angle}deg) translateX(140px) rotate(-${angle}deg)`,
                                    }}
                                    animate={{
                                        scale: [0.8, 1.1, 0.8],
                                        opacity: [0.4, 0.9, 0.4],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                    }}
                                >
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl backdrop-blur-md border flex items-center justify-center -translate-x-1/2 -translate-y-1/2 ${orbitIconBg}`}>
                                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${orbitIconColor}`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Middle Ring */}
                    <motion.div
                        className="absolute inset-[35px] sm:inset-[45px] rounded-full"
                        style={{ border: middleRingBorder }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Glow Ring */}
                    <motion.div
                        className="absolute inset-[60px] sm:inset-[75px] rounded-full"
                        style={{
                            background: innerGlowBg,
                            border: innerGlowBorder,
                        }}
                        animate={{ boxShadow: innerGlowShadows }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Central Core */}
                    <div className="absolute inset-[80px] sm:inset-[100px] rounded-full flex items-center justify-center">
                        <motion.div
                            className="relative w-full h-full rounded-full flex items-center justify-center"
                            style={{ background: coreBg }}
                        >
                            {/* Pulsing compass */}
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <Compass className={`w-12 h-12 sm:w-14 sm:h-14 ${compassColor}`} />
                            </motion.div>

                            {/* Core pulse effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                animate={{
                                    boxShadow: isDark
                                        ? [
                                            "0 0 0 0 rgba(0,188,212,0.4)",
                                            "0 0 0 20px rgba(0,188,212,0)",
                                        ]
                                        : [
                                            "0 0 0 0 rgba(0,150,180,0.3)",
                                            "0 0 0 20px rgba(0,150,180,0)",
                                        ],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        </motion.div>
                    </div>

                    {/* Neural connection lines */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.div
                            key={`line-${i}`}
                            className="absolute top-1/2 left-1/2 h-[1px] origin-left"
                            style={{
                                width: "120px",
                                transform: `rotate(${angle}deg)`,
                                background: neuralLineColor,
                            }}
                            animate={{
                                opacity: [0.2, 0.6, 0.2],
                                scaleX: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Active Step Indicator */}
                <div className="flex flex-col items-center gap-4 max-w-sm text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-full border"
                            style={{
                                background: `${stepColor}10`,
                                borderColor: `${stepColor}30`,
                            }}
                        >
                            <StepIcon
                                className="w-5 h-5"
                                style={{ color: stepColor }}
                            />
                            <span
                                className="text-sm font-semibold tracking-wide"
                                style={{ color: stepColor }}
                            >
                                {currentStep.label}
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Destination */}
                    <motion.h3
                        className={`text-2xl sm:text-3xl font-bold ${titleColor}`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Planning{" "}
                        <span className={`bg-gradient-to-r ${destinationGradient} bg-clip-text text-transparent`}>
                            {destination}
                        </span>
                    </motion.h3>

                    {/* Rotating message */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={message}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.4 }}
                            className={`text-sm ${subtextColor}`}
                        >
                            {message}
                        </motion.p>
                    </AnimatePresence>

                    {/* Progress bar */}
                    <div className={`w-48 h-1 ${progressBg} rounded-full overflow-hidden mt-2`}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #00BCD4, #7C4DFF, #FFB300)",
                            }}
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    {/* Step dots */}
                    <div className="flex gap-1.5 mt-1">
                        {STEPS.map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full"
                                animate={{
                                    backgroundColor:
                                        i === activeStep
                                            ? stepColor
                                            : dotInactive,
                                    scale: i === activeStep ? 1.4 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
