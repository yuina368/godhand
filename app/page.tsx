'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp, Lock, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="stars" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold gold-text">手相AI Premium</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/pricing" className="text-white/80 hover:text-white transition">
              料金プラン
            </Link>
            <Link
              href="/reading"
              className="px-6 py-3 luxury-gradient rounded-full font-semibold hover:opacity-90 transition animate-glow"
            >
              今すぐ占う
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">AI技術で運命を科学する</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            あなたの
            <span className="gold-text"> 運命 </span>
            を
            <br />
            <span className="text-gradient">AIが読み解く</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            最新のコンピュータビジョン技術で手相を解析。
            <br />
            生命線から健康運、活力、長寿度を科学的に分析します。
          </p>

          <Link
            href="/reading"
            className="inline-flex items-center gap-2 px-8 py-4 luxury-gradient rounded-full text-lg font-semibold hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5" />
            無料で占いを始める
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="glass-card-hover p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">AI解析技術</h3>
            <p className="text-white/70">
              OpenCVとディープラーニングを活用した最先端の手相解析
            </p>
          </motion.div>

          <motion.div
            className="glass-card-hover p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">即座に結果</h3>
            <p className="text-white/70">
              アップロードから数秒で詳細な運勢レポートを生成
            </p>
          </motion.div>

          <motion.div
            className="glass-card-hover p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Lock className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">プレミアム特典</h3>
            <p className="text-white/70">
              詳細な運勢、アドバイス、ラッキーアイテムまで完全網羅
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-gradient">3つのステップ</span>で簡単占い
        </h2>

        <div className="max-w-4xl mx-auto space-y-12">
          {[
            {
              step: '01',
              title: 'マーカーで印をつける',
              desc: '青色マーカーを人差し指に、緑色マーカーで生命線をなぞります',
            },
            {
              step: '02',
              title: '手のひらを撮影',
              desc: '明るい場所で手のひら全体が写るように撮影してください',
            },
            {
              step: '03',
              title: 'AIが解析',
              desc: '数秒で詳細な運勢レポートが完成します',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0 w-16 h-16 luxury-gradient rounded-full flex items-center justify-center text-2xl font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            今すぐあなたの<span className="gold-text">運命</span>を知る
          </h2>
          <p className="text-xl text-white/70 mb-8">
            無料で基本診断を体験。プレミアムで詳細な運勢まで。
          </p>
          <Link
            href="/reading"
            className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-black rounded-full text-lg font-semibold hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5" />
            無料で始める
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-white/50">
          <p>© 2026 手相AI Premium. エンターテイメント目的のサービスです。</p>
        </div>
      </footer>
    </div>
  );
}
