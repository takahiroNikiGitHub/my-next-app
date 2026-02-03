"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

// 1. 各ロゴの個別の動きを管理するコンポーネント
const FloatingLogo = ({ config, mouseX, mouseY }: { config: any, mouseX: MotionValue, mouseY: MotionValue }) => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // マウス位置に基づいた個別の動き
  const offsetTransformX = useTransform(mouseX, (x) => (x - windowWidth / 2) * config.mouseFactor);
  const offsetTransformY = useTransform(mouseY, (y) => (y - windowHeight / 2) * config.mouseFactor);

  return (
    <motion.img
      src="/logo.png"
      alt="Logo"
      initial={{
        x: config.initialX,
        y: config.initialY,
        scale: 0,
        rotate: config.initialRotate,
        opacity: 0,
      }}
      animate={{
        // 画面内をランダムに浮遊
        x: [config.initialX, config.initialX + 150, config.initialX - 150, config.initialX],
        y: [config.initialY, config.initialY - 150, config.initialY + 150, config.initialY],
        scale: [config.initialScale, config.initialScale * 1.3, config.initialScale],
        rotate: [config.initialRotate, config.initialRotate + 180, config.initialRotate + 360],
        opacity: [0.3, 0.9, 0.5, 0.8, 0.3], // フェードイン・アウトを繰り返す
      }}
      transition={{
        duration: config.animationDuration,
        repeat: Infinity,
        ease: "linear",
        delay: config.delay,
      }}
      style={{
        translateX: offsetTransformX,
        translateY: offsetTransformY,
      }}
      className="absolute object-contain pointer-events-none"
      width={config.size}
      height={config.size}
    />
  );
};

// 2. メインのページコンポーネント
export default function InteractiveLogoCanvas() {
  const [logoConfigs, setLogoConfigs] = useState<any[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const NUM_LOGOS = 35; // 画面いっぱいに表示
    const configs = Array.from({ length: NUM_LOGOS }).map((_, i) => ({
      id: i,
      initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      initialY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      initialScale: 0.5 + Math.random() * 1.0,
      size: 40 + Math.random() * 120, 
      initialRotate: Math.random() * 360,
      animationDuration: 10 + Math.random() * 20, // ゆっくり動かす
      delay: Math.random() * 5,
      mouseFactor: (Math.random() - 0.5) * 0.3, // 追いかけるロゴと逃げるロゴを作る
    }));
    setLogoConfigs(configs);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* 修正ポイント: 背景の光（タグの閉じミスを修正） */}
      <motion.div 
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
      />

      {/* ロゴの群れ */}
      {logoConfigs.map((config) => (
        <FloatingLogo key={config.id} config={config} mouseX={springX} mouseY={springY} />
      ))}

      {/* 中央の文字演出 */}
      <div className="z-50 text-center pointer-events-none p-10 select-none">
        <motion.h1 
          initial={{ letterSpacing: "0em", opacity: 0, filter: "blur(10px)" }}
          animate={{ letterSpacing: "1.2em", opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-white text-4xl md:text-7xl font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        >
          AWAKENING
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-blue-300 mt-6 text-sm tracking-[0.5em]"
        >
          FUTURE INTERFACE
        </motion.p>
      </div>
    </div>
  );
}