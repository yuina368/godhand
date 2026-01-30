"""
手相解析モジュール（マーカーレス版）
手のひらを自動検出して生命線を解析
"""

import cv2
import numpy as np
from typing import Tuple, Dict, Any


class PalmAnalyzer:
    """手のひら画像を解析するクラス（マーカー不要版）"""
    
    # 肌色のHSV範囲（手のひら検出用）
    SKIN_LOWER = np.array([0, 20, 70])
    SKIN_UPPER = np.array([20, 150, 255])
    SKIN_LOWER2 = np.array([170, 20, 70])
    SKIN_UPPER2 = np.array([180, 150, 255])
    
    def __init__(self):
        pass
    
    def analyze(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        画像を解析し、手のひらと生命線の情報を抽出
        
        Args:
            image_bytes: 画像のバイトデータ
            
        Returns:
            解析結果の辞書
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return {"error": "画像を読み込めませんでした"}
        
        # リサイズ
        max_dim = 1000
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)))
        
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # 手のひら領域を検出
        palm_mask, palm_contour = self._detect_palm_region(hsv, image)
        
        if palm_contour is None:
            return {"error": "手のひらが検出できませんでした。画像全体に手のひらが写るように撮影してください。"}
        
        # 手のひらのサイズ情報を取得
        palm_info = self._get_palm_metrics(palm_contour, image.shape)
        
        # 生命線を検出（エッジ検出ベース）
        life_line_info = self._detect_life_line(image, palm_mask, palm_contour)
        
        # スコアを計算
        ratio_result = self._calculate_ratio(palm_info, life_line_info)
        
        return {
            "palm_metrics": palm_info,
            "life_line": life_line_info,
            "ratio": ratio_result,
            "image_size": {"width": image.shape[1], "height": image.shape[0]}
        }
    
    def _detect_palm_region(self, hsv: np.ndarray, image: np.ndarray) -> Tuple[np.ndarray, Any]:
        """肌色を検出して手のひら領域を特定"""
        skin_mask1 = cv2.inRange(hsv, self.SKIN_LOWER, self.SKIN_UPPER)
        skin_mask2 = cv2.inRange(hsv, self.SKIN_LOWER2, self.SKIN_UPPER2)
        skin_mask = cv2.bitwise_or(skin_mask1, skin_mask2)
        
        kernel = np.ones((7, 7), np.uint8)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
        
        contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return skin_mask, None
        
        # 最大の輪郭を手のひらとする
        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)
        
        # 画像サイズの10%以下は手のひらではない
        min_area = (image.shape[0] * image.shape[1]) * 0.1
        if area < min_area:
            return skin_mask, None
        
        return skin_mask, largest_contour
    
    def _get_palm_metrics(self, contour: np.ndarray, img_shape: Tuple) -> Dict[str, Any]:
        """手のひらの基本情報を取得"""
        x, y, w, h = cv2.boundingRect(contour)
        area = cv2.contourArea(contour)
        
        # 手のひらの幅から基準サイズを推定
        # 一般的な成人の手のひら幅は約8-10cm
        # 人差し指の第一関節の幅は手のひら幅の約1/8-1/10
        estimated_joint_width = w // 9
        
        return {
            "width": w,
            "height": h,
            "area": area,
            "estimated_joint_width": estimated_joint_width,
            "bbox": {"x": x, "y": y, "w": w, "h": h}
        }
    
    def _detect_life_line(self, image: np.ndarray, palm_mask: np.ndarray, palm_contour: np.ndarray) -> Dict[str, Any]:
        """生命線を検出（エッジ検出ベース）"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # 手のひら領域のみに限定
        palm_gray = cv2.bitwise_and(gray, gray, mask=palm_mask)
        
        # エッジ検出
        edges = cv2.Canny(palm_gray, 30, 100)
        
        # 生命線は通常、親指の下から手首に向かう曲線
        # 手のひら左側（親指側）の下半分を重点的に検出
        h, w = edges.shape
        x, y, pw, ph = cv2.boundingRect(palm_contour)
        
        # 生命線候補領域（手のひら左下）
        life_line_region = edges[y+ph//3:y+ph, x:x+pw//2]
        
        # 線の長さを推定
        line_pixels = cv2.countNonZero(life_line_region)
        
        # 輪郭検出
        contours, _ = cv2.findContours(life_line_region, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # 最長の輪郭を生命線とする
            longest = max(contours, key=cv2.arcLength)
            length = cv2.arcLength(longest, closed=False)
            
            # 実際の座標系でのバウンディングボックス
            lx, ly, lw, lh = cv2.boundingRect(longest)
            line_span = np.sqrt(lw**2 + lh**2)
        else:
            length = line_pixels
            line_span = line_pixels
        
        return {
            "detected": line_pixels > 50,
            "pixel_count": int(line_pixels),
            "estimated_length": int(line_span),
            "arc_length": int(length) if contours else int(line_pixels)
        }
    
    def _calculate_ratio(self, palm_info: Dict, life_line_info: Dict) -> Dict[str, Any]:
        """手のひらサイズに対する生命線の比率を計算"""
        if not life_line_info.get("detected"):
            return {
                "valid": False,
                "message": "生命線が検出できませんでした。手のひら全体が明るく写るように撮影してください。"
            }
        
        reference_width = palm_info["estimated_joint_width"]
        life_line_length = life_line_info["estimated_length"]
        
        # 比率計算
        length_ratio = life_line_length / max(reference_width, 1)
        
        # スコアリング: 理想的な比率は4-6程度
        normalized_score = min(100, max(30, (length_ratio / 5.0) * 80))
        
        return {
            "valid": True,
            "reference_width": reference_width,
            "life_line_length": life_line_length,
            "length_ratio": round(length_ratio, 2),
            "normalized_score": int(normalized_score),
            "reference_estimated": True
        }
