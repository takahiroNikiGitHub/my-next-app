"use client"; // アニメーションはブラウザで動くので、この一行が必須です！

import { motion } from "framer-motion";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 最初：透明、少し下
      whileInView={{ opacity: 1, y: 0 }} // 見えた時：不透明、元の位置
      viewport={{ once: true }} // アニメーションは一回だけ
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6秒かけて滑らかに
    >
      {children}
    </motion.div>
  );
}