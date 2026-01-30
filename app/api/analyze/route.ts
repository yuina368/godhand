import { NextRequest, NextResponse } from 'next/server';
import { analyzePalm } from '@/lib/palm-analyzer';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: '画像ファイルがアップロードされていません' },
                { status: 400 }
            );
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: '画像ファイルをアップロードしてください' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Analyze palm
        const result = await analyzePalm(buffer);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || '解析に失敗しました' },
                { status: 400 }
            );
        }

        // Return result
        return NextResponse.json({
            status: 'success',
            fortune: result.fortune,
            raw_analysis: result.raw_analysis,
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'サーバーエラーが発生しました' },
            { status: 500 }
        );
    }
}
