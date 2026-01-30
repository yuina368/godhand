'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, TrendingUp, Heart, Leaf, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ResultDisplayProps {
    result: any;
    isPremium?: boolean;
}

export default function ResultDisplay({ result, isPremium = false }: ResultDisplayProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const fortune = result.fortune;

    useEffect(() => {
        // Animate score
        let start = 0;
        const end = fortune.score;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setAnimatedScore(end);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [fortune.score]);

    const circumference = 2 * Math.PI * 120;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Main Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 text-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-2 luxury-gradient rounded-full mb-6"
                >
                    {fortune.rank_label}
                </motion.div>

                {/* Score Circle */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            className="text-6xl font-bold gold-text"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            {animatedScore}
                        </motion.div>
                        <div className="text-white/70">点</div>
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-white/90 max-w-lg mx-auto leading-relaxed"
                >
                    {fortune.message}
                </motion.p>
            </motion.div>

            {/* Detail Scores */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="glass-card p-8 space-y-6"
            >
                <h3 className="text-2xl font-bold text-center mb-6">詳細スコア</h3>

                <DetailBar
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="活力"
                    value={fortune.details.vitality}
                    color="from-purple-500 to-pink-500"
                    delay={1.2}
                />
                <DetailBar
                    icon={<Heart className="w-6 h-6" />}
                    label="健康運"
                    value={fortune.details.health}
                    color="from-red-500 to-orange-500"
                    delay={1.4}
                />
                <DetailBar
                    icon={<Leaf className="w-6 h-6" />}
                    label="長寿度"
                    value={fortune.details.longevity}
                    color="from-green-500 to-teal-500"
                    delay={1.6}
                />
            </motion.div>

            {/* Premium Content */}
            {isPremium ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-xl font-bold">開運アドバイス</h4>
                        </div>
                        <p className="text-white/80">{fortune.advice}</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-xl font-bold">ラッキーアイテム</h4>
                        </div>
                        <p className="text-white/80">{fortune.lucky_item}</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="glass-card p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center">
                        <div className="space-y-4">
                            <Lock className="w-16 h-16 mx-auto text-yellow-400" />
                            <h3 className="text-2xl font-bold">プレミアム限定コンテンツ</h3>
                            <p className="text-white/70 mb-6">
                                詳細な開運アドバイスとラッキーアイテムを見るには
                                <br />
                                プレミアム会員にアップグレードしてください
                            </p>
                            <Link
                                href="/pricing"
                                className="inline-block px-8 py-4 gold-gradient text-black rounded-full font-semibold hover:scale-105 transition-transform"
                            >
                                プレミアムにアップグレード
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Retry Button */}
            <div className="text-center">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 glass-card-hover font-semibold rounded-full hover:scale-105 transition-transform"
                >
                    もう一度占う
                </button>
            </div>
        </div>
    );
}

interface DetailBarProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    delay: number;
}

function DetailBar({ icon, label, value, color, delay }: DetailBarProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 0;
            const increment = value / 60;
            const interval = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setAnimatedValue(value);
                    clearInterval(interval);
                } else {
                    setAnimatedValue(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-semibold">{label}</span>
                </div>
                <span className="text-lg font-bold">{animatedValue}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full bg-gradient-to-r ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${animatedValue}%` }}
                    transition={{ duration: 1.5, delay: delay, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
