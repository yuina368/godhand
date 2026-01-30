'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Sparkles, Loader2, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PalmUploaderProps {
    onAnalysisComplete: (result: any) => void;
}

export default function PalmUploader({ onAnalysisComplete }: PalmUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('画像ファイルを選択してください');
            return;
        }

        setSelectedFile(file);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || '解析に失敗しました');

            onAnalysisComplete(data);
        } catch (err: any) {
            setError(err.message || 'エラーが発生しました');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card-hover p-8 text-center cursor-pointer relative overflow-hidden"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {/* Hand Guide Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <Hand className="w-48 h-48 text-purple-400" />
                        </div>

                        <div className="relative z-10">
                            <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                            <h3 className="text-2xl font-bold mb-2">手のひらを撮影</h3>
                            <p className="text-white/70 mb-4">
                                クリックまたはドラッグ&ドロップ
                            </p>
                            <div className="inline-block px-4 py-2 glass-card mb-3">
                                <p className="text-sm text-yellow-300">
                                    📌 手のひら全体が明るく写るように撮影してください
                                </p>
                            </div>
                            <p className="text-xs text-white/50">
                                マーカー不要 | 自動で生命線を検出します
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="glass-card p-6 relative">
                            <button
                                onClick={handleReset}
                                className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full py-4 luxury-gradient rounded-full font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    AI解析中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    手相を解析
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
}
