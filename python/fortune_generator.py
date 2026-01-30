"""
占い結果生成モジュール
生命線の比率からエンターテイメント性のある占い結果を生成
"""

import random
from typing import Dict, Any
from datetime import datetime


class FortuneGenerator:
    """手相の占い結果を生成するクラス"""
    
    # 生命線スコアに応じたメッセージ
    LIFE_LINE_MESSAGES = {
        "excellent": [
            "驚異的な生命力の持ち主です！100歳を超えても元気でいられるでしょう。",
            "類まれな生命エネルギーに満ち溢れています。大きな挑戦も乗り越えられます。",
            "非常に強い生命線です。どんな困難も跳ね返すパワーがあります。"
        ],
        "great": [
            "素晴らしい生命力をお持ちです。健康的な長寿が期待できます。",
            "安定した強い生命線です。心身ともに充実した人生を送れるでしょう。",
            "頼もしい生命力が見られます。エネルギッシュな毎日を過ごせます。"
        ],
        "good": [
            "しっかりとした生命線です。バランスの取れた健康運があります。",
            "標準以上の生命力があります。日々の健康管理でさらに運気アップ！",
            "安定感のある生命線です。穏やかで充実した人生が待っています。"
        ],
        "average": [
            "平均的な生命線です。規則正しい生活でさらに運気を高められます。",
            "バランスの取れた生命線です。無理をせず自分のペースを大切に。",
            "標準的な生命力ですが、心がけ次第で大きく向上できます。"
        ],
        "developing": [
            "生命線は成長途中です。これからの努力で大きく伸びる可能性があります！",
            "繊細な生命線は、感受性の豊かさの表れです。自分を大切にしましょう。",
            "手相は変化します。健康的な生活で生命線も強くなっていきます！"
        ]
    }
    
    # アドバイス
    ADVICE_MESSAGES = [
        "朝日を浴びることで生命力がさらに高まります。",
        "緑の多い場所を歩くと運気が上昇します。",
        "水分をこまめに取ることで手相も良い方向に変化します。",
        "深呼吸を習慣にすると生命線が強化されます。",
        "笑顔を心がけることで全体運がアップします。",
        "感謝の気持ちを持つと生命エネルギーが活性化されます。",
        "早寝早起きは生命線を強くする最良の方法です。",
        "ストレッチは手相を良くする効果があります。"
    ]
    
    # ラッキーアイテム
    LUCKY_ITEMS = [
        "緑色のアクセサリー",
        "天然石のブレスレット", 
        "革製の手帳",
        "木製の小物",
        "青い花",
        "シルバーのリング",
        "観葉植物",
        "お気に入りのマグカップ"
    ]
    
    def __init__(self):
        pass
    
    def generate(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        解析結果から占い結果を生成
        
        Args:
            analysis_result: palm_analyzerからの解析結果
            
        Returns:
            占い結果の辞書
        """
        ratio_data = analysis_result.get("ratio", {})
        
        if not ratio_data.get("valid"):
            return {
                "success": False,
                "error": ratio_data.get("message", "解析に失敗しました"),
                "suggestion": "青色マーカー（人差し指第一関節）と緑色マーカー（生命線）を明るい場所ではっきりと撮影してください。"
            }
        
        # スコア計算
        score = self._calculate_score(ratio_data)
        
        # ランクを判定
        rank = self._determine_rank(score)
        
        # メッセージを生成
        message = random.choice(self.LIFE_LINE_MESSAGES[rank])
        
        # アドバイスとラッキーアイテム
        advice = random.choice(self.ADVICE_MESSAGES)
        lucky_item = random.choice(self.LUCKY_ITEMS)
        
        # 詳細スコア（エンターテイメント用）
        vitality = min(100, int(score * 1.1 + random.randint(-5, 10)))
        health = min(100, int(score * 0.95 + random.randint(-3, 8)))
        longevity = min(100, int(score * 1.05 + random.randint(-7, 12)))
        
        return {
            "success": True,
            "score": int(score),
            "rank": rank,
            "rank_label": self._rank_to_label(rank),
            "message": message,
            "advice": advice,
            "lucky_item": lucky_item,
            "details": {
                "vitality": vitality,       # 活力
                "health": health,           # 健康運
                "longevity": longevity,     # 長寿度
            },
            "analysis_data": {
                "life_line_ratio": ratio_data.get("length_ratio", 0),
                "reference_width": ratio_data.get("reference_width", 0)
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_score(self, ratio_data: Dict) -> float:
        """
        比率データからスコアを計算（0-100）
        
        基準値（実測データより）:
        - 比率 5.5 → 80点（基準画像）
        - 比率 2 → 30点（短め）
        - 比率 9 → 100点（長い生命線）
        
        線形補間:
        2-5.5 の範囲: 30-80点
        5.5-9 の範囲: 80-100点
        """
        length_ratio = ratio_data.get("length_ratio", 0)
        pixel_ratio = ratio_data.get("pixel_ratio", 0)
        
        # 3区間のスケーリング
        if length_ratio <= 2:
            base_score = 30
        elif length_ratio <= 5.5:
            # 2-5.5 → 30-80点: (ratio-2)/(5.5-2) * 50 + 30
            base_score = (length_ratio - 2) / 3.5 * 50 + 30
        elif length_ratio <= 9:
            # 5.5-9 → 80-100点: (ratio-5.5)/(9-5.5) * 20 + 80
            base_score = (length_ratio - 5.5) / 3.5 * 20 + 80
        else:
            base_score = 100
        
        # ピクセル密度ボーナス（線がしっかり塗られているか）
        density_bonus = min(5, max(0, pixel_ratio * 0.3))
        
        # ランダム要素（±3%の変動でエンタメ感）
        fortune_modifier = random.uniform(0.97, 1.03)
        
        # 最終スコア
        final_score = (base_score + density_bonus) * fortune_modifier
        
        return max(25, min(100, final_score))  # 25-100の範囲
    
    def _determine_rank(self, score: float) -> str:
        """スコアからランクを判定（緩和版）"""
        if score >= 80:
            return "excellent"
        elif score >= 60:
            return "great"
        elif score >= 45:
            return "good"
        elif score >= 30:
            return "average"
        else:
            return "developing"
    
    def _rank_to_label(self, rank: str) -> str:
        """ランクを日本語ラベルに変換"""
        labels = {
            "excellent": "★★★★★ 極上",
            "great": "★★★★☆ 大吉",
            "good": "★★★☆☆ 吉",
            "average": "★★☆☆☆ 中吉",
            "developing": "★☆☆☆☆ 成長中"
        }
        return labels.get(rank, "不明")
