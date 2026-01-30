'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import PalmUploader from '@/components/PalmUploader';
import ResultDisplay from '@/components/ResultDisplay';

export default function ReadingPage() {
    const [result, setResult] = useState<any>(null);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="stars" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <nav className="relative z-10 container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        <span>トップに戻る</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold gold-text">手相AI</span>
                    </Link>
                    <div className="w-24" />
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {!result ? (
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="text-gradient">AI手相占い</span>
                        </h1>
                        <p className="text-xl text-white/70 mb-12">
                            手のひらの写真をアップロードして運命を占う
                        </p>

                        <PalmUploader onAnalysisComplete={setResult} />
                    </div>
                ) : (
                    <ResultDisplay result={result} isPremium={false} />
                )}
            </div>

            <footer className="relative z-10 border-t border-white/10 py-8 mt-20">
                <div className="container mx-auto px-6 text-center text-white/50">
                    <p>© 2026 手相AI Premium. エンターテイメント目的のサービスです。</p>
                </div>
            </footer>
        </div>
    );
}
