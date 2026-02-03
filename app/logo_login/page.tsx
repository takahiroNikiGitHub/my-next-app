"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

// --- 1. 個別のロゴコンポーネント ---
const FloatingLogo = ({ config, mouseX, mouseY }: { config: any, mouseX: MotionValue, mouseY: MotionValue }) => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const offsetTransformX = useTransform(mouseX, (x) => (x - windowWidth / 2) * config.mouseFactor);
  const offsetTransformY = useTransform(mouseY, (y) => (y - windowHeight / 2) * config.mouseFactor);

  return (
    <motion.img
      src="/logo.png"
      alt="Logo"
      initial={{ x: config.initialX, y: config.initialY, scale: 0, rotate: config.initialRotate, opacity: 0 }}
      animate={{
        x: [config.initialX, config.initialX + 150, config.initialX - 150, config.initialX],
        y: [config.initialY, config.initialY - 150, config.initialY + 150, config.initialY],
        scale: [config.initialScale, config.initialScale * 1.2, config.initialScale],
        rotate: [config.initialRotate, config.initialRotate + 180, config.initialRotate + 360],
        opacity: [0.2, 0.7, 0.3, 0.6, 0.2],
      }}
      transition={{ duration: config.animationDuration, repeat: Infinity, ease: "linear", delay: config.delay }}
      style={{ translateX: offsetTransformX, translateY: offsetTransformY }}
      className="absolute object-contain pointer-events-none"
      width={config.size}
      height={config.size}
    />
  );
};

// --- 2. 背景アニメーションコンポーネント ---
const InteractiveLogoCanvas = ({ mouseX, mouseY }: { mouseX: MotionValue, mouseY: MotionValue }) => {
  const [logoConfigs, setLogoConfigs] = useState<any[]>([]);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const configs = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      initialScale: 0.4 + Math.random() * 0.8,
      size: 40 + Math.random() * 100,
      initialRotate: Math.random() * 360,
      animationDuration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      mouseFactor: (Math.random() - 0.5) * 0.2,
    }));
    setLogoConfigs(configs);
  }, []);

  return (
    <>
      <motion.div 
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
      />
      {logoConfigs.map((config) => (
        <FloatingLogo key={config.id} config={config} mouseX={springX} mouseY={springY} />
      ))}
    </>
  );
};

// --- 3. メインページ (全体統合) ---
export default function EntryPage() {
  const [isJoined, setIsJoined] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* LAYER 1: 背景 */}
      <div className="absolute inset-0 z-0">
        <InteractiveLogoCanvas mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* LAYER 2: 薄いオーバーレイ */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      {/* LAYER 3: コンテンツ */}
      <div className="relative z-20 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {!isJoined ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">
                AUTHENTICATION
              </h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="USERNAME" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm tracking-widest"
                />
                <button 
                  onClick={() => setIsJoined(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 tracking-widest"
                >
                  ENTER SYSTEM
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.h1 
                animate={{ letterSpacing: ["0.2em", "1em", "0.2em"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl md:text-6xl font-black text-white italic mb-4"
              >
                ACCESS GRANTED
              </motion.h1>
              <p className="text-blue-400 font-mono animate-pulse">SYNCHRONIZING DATA...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}