#!/usr/bin/env python3
"""
Palm Analysis CLI
Command-line interface for palm analysis - callable from Next.js
"""

import sys
import json
import os
from palm_analyzer import PalmAnalyzer
from fortune_generator import FortuneGenerator

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "画像パスが指定されていません"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": "画像ファイルが見つかりません"}))
        sys.exit(1)
    
    try:
        # 画像を読み込み
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
        
        # 解析
        analyzer = PalmAnalyzer()
        fortune_gen = FortuneGenerator()
        
        analysis_result = analyzer.analyze(image_bytes)
        
        if "error" in analysis_result:
            print(json.dumps({
                "success": False,
                "error": analysis_result["error"]
            }))
            sys.exit(0)
        
        # 占い結果を生成
        fortune_result = fortune_gen.generate(analysis_result)
        
        # 結果を出力
        result = {
            "success": True,
            "fortune": fortune_result,
            "raw_analysis": analysis_result
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"解析エラー: {str(e)}"
        }, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
