"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// 抽選アイテムの定義
const ITEMS = [
  { label: "💎 特賞", color: "from-yellow-400 to-amber-600" },
  { label: "✨ 1等", color: "from-blue-400 to-indigo-600" },
  { label: "🎫 2等", color: "from-emerald-400 to-teal-600" },
  { label: "🎈 3等", color: "from-slate-400 to-slate-600" },
];

export default function LuckyDrawPage() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<typeof ITEMS[0] | null>(null);

  const startDraw = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setResult(null);

    // 1.5秒待ってから結果を表示
    setTimeout(() => {
      const picked = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      setResult(picked);
      setIsDrawing(false);

      // 演出：紙吹雪（特賞と1等なら多めに）
      const isHighRank = picked.label.includes("特賞") || picked.label.includes("1等");
      confetti({
        particleCount: isHighRank ? 150 : 80,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 100,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white overflow-hidden p-4">
      
      {/* 1. タイトル部分 */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          LUCKY DRAW
        </h1>
        <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full" />
      </motion.div>

      {/* 2. メイン演出エリア */}
      <div className="relative flex items-center justify-center w-full max-w-sm h-[400px]">
        <AnimatePresence mode="wait">
          {isDrawing ? (
            /* 抽選中の光るエフェクト */
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-b-2 border-blue-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-400 animate-pulse">
                DRAWING...
              </div>
            </motion.div>
          ) : result ? (
            /* 当たったカードの出現 */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className={`w-64 h-96 bg-gradient-to-br ${result.color} rounded-2xl shadow-2xl p-1 flex flex-col items-center justify-center relative border border-white/20`}
            >
              <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none" />
              <div className="bg-white/10 backdrop-blur-md w-full h-full rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <span className="text-xs font-bold tracking-[0.5em] text-white/50 mb-4">YOU GOT!</span>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-black text-white drop-shadow-lg"
                >
                  {result.label}
                </motion.div>
                <div className="mt-8 text-[10px] text-white/30 uppercase tracking-widest">
                  Valid only for today
                </div>
              </div>
            </motion.div>
          ) : (
            /* 初期状態：何も出ていない時 */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-600 text-sm font-mono"
            >
              READY TO DRAW?
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. ボタンエリア */}
      <div className="mt-12 h-20">
        {!isDrawing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startDraw}
            className="px-10 py-4 bg-white text-black font-black rounded-full shadow-xl hover:bg-blue-50 transition-colors"
          >
            {result ? "TRY AGAIN" : "START DRAW"}
          </motion.button>
        )}
      </div>

    </div>
  );
}