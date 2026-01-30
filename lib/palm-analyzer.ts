/**
 * Palm Analyzer TypeScript Wrapper
 * Calls Python CLI and returns results
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export interface AnalysisResult {
    success: boolean;
    fortune?: FortuneResult;
    raw_analysis?: any;
    error?: string;
}

export interface FortuneResult {
    success: boolean;
    score: number;
    rank: string;
    rank_label: string;
    message: string;
    advice: string;
    lucky_item: string;
    details: {
        vitality: number;
        health: number;
        longevity: number;
    };
    analysis_data: {
        life_line_ratio: number;
        reference_width: number;
    };
    timestamp: string;
}

export async function analyzePalm(imageBuffer: Buffer): Promise<AnalysisResult> {
    // Create temporary file
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `palm-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`);

    try {
        // Write image buffer to temp file
        await fs.writeFile(tempPath, imageBuffer);

        // Call Python CLI
        const result = await callPythonAnalyzer(tempPath);

        // Clean up
        await fs.unlink(tempPath).catch(() => { });

        return result;
    } catch (error) {
        // Clean up on error
        await fs.unlink(tempPath).catch(() => { });
        throw error;
    }
}

function callPythonAnalyzer(imagePath: string): Promise<AnalysisResult> {
    return new Promise((resolve, reject) => {
        const pythonDir = path.join(process.cwd(), 'python');
        const scriptPath = path.join(pythonDir, 'analyze_cli.py');

        // Check if Python3 is available
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

        const python = spawn(pythonCmd, [scriptPath, imagePath], {
            cwd: pythonDir,
        });

        let stdoutData = '';
        let stderrData = '';

        python.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        python.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error('Python stderr:', stderrData);
                reject(new Error(`Python script failed with code ${code}: ${stderrData}`));
                return;
            }

            try {
                const result = JSON.parse(stdoutData);
                resolve(result);
            } catch (error) {
                console.error('Failed to parse Python output:', stdoutData);
                reject(new Error('Failed to parse analysis result'));
            }
        });

        python.on('error', (error) => {
            reject(new Error(`Failed to spawn Python process: ${error.message}`));
        });
    });
}
