'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Check, Star, Zap, Crown } from 'lucide-react';

export default function PricingPage() {
    const handleCheckout = async (priceType: string) => {
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceType,
                    userId: 'demo-user-' + Date.now(), // In production, use actual user ID
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('エラーが発生しました。もう一度お試しください。');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="stars" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold gold-text">手相AI Premium</span>
                    </Link>
                    <Link
                        href="/reading"
                        className="px-6 py-3 glass-card hover:bg-white/10 rounded-full font-semibold transition"
                    >
                        占いに戻る
                    </Link>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 container mx-auto px-6 py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        あなたに合った
                        <span className="gold-text">プラン</span>
                        を選ぶ
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        無料プランで基本診断を体験。プレミアムで完全な運命解析へ。
                    </p>
                </motion.div>
            </section>

            {/* Pricing Cards */}
            <section className="relative z-10 container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8 relative"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-6 h-6 text-purple-400" />
                            <h3 className="text-2xl font-bold">無料プラン</h3>
                        </div>

                        <div className="mb-8">
                            <div className="text-4xl font-bold mb-2">¥0</div>
                            <div className="text-white/60">永久無料</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                '基本スコア表示',
                                '生命線解析',
                                '基本メッセージ',
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-white/80">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/reading"
                            className="block w-full text-center py-3 glass-card-hover rounded-full font-semibold"
                        >
                            無料で始める
                        </Link>
                    </motion.div>

                    {/* Premium Monthly */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 relative border-2 border-yellow-400/50 scale-105"
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="px-4 py-1 gold-gradient text-black text-sm font-bold rounded-full">
                                人気No.1
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-2xl font-bold">月額プラン</h3>
                        </div>

                        <div className="mb-8">
                            <div className="text-4xl font-bold mb-2 gold-text">¥980</div>
                            <div className="text-white/60">/ 月</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                '無料プランの全機能',
                                '詳細スコア解析',
                                '開運アドバイス',
                                'ラッキーアイテム',
                                '月間運勢',
                                '優先サポート',
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-yellow-400" />
                                    <span className="text-white/90">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCheckout('monthly')}
                            className="w-full py-3 gold-gradient text-black rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            月額プランを始める
                        </button>
                    </motion.div>

                    {/* Premium One-Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-8 relative"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="w-6 h-6 text-purple-400" />
                            <h3 className="text-2xl font-bold">買い切りプラン</h3>
                        </div>

                        <div className="mb-8">
                            <div className="text-4xl font-bold mb-2">¥2,980</div>
                            <div className="text-white/60">永久アクセス</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                '月額プランの全機能',
                                '永久アクセス権',
                                '新機能の優先利用',
                                '広告なし',
                                'プレミアムバッジ',
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-purple-400" />
                                    <span className="text-white/80">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCheckout('oneTime')}
                            className="w-full py-3 luxury-gradient rounded-full font-semibold hover:scale-105 transition-transform"
                        >
                            今すぐ購入
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-12">
                    <span className="text-gradient">よくある質問</span>
                </h2>

                <div className="max-w-3xl mx-auto space-y-6">
                    {[
                        {
                            q: '無料プランでもちゃんと占えますか？',
                            a: 'はい！無料プランでも基本的な生命線解析とスコア表示が可能です。より詳しい運勢やアドバイスをご希望の場合はプレミアムプランをお試しください。',
                        },
                        {
                            q: '月額プランはいつでも解約できますか？',
                            a: 'はい、いつでもキャンセル可能です。解約後も期間満了まではプレミアム機能をご利用いただけます。',
                        },
                        {
                            q: '支払い方法は？',
                            a: 'クレジットカード決済（Stripe経由）に対応しています。安全で確実な決済処理を保証します。',
                        },
                    ].map((faq, i) => (
                        <motion.div
                            key={i}
                            className="glass-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                            <p className="text-white/70">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
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
