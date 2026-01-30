"""
手相解析モジュール（高精度版）
より正確な手のひら検出と生命線解析
"""

import cv2
import numpy as np
from typing import Tuple, Dict, Any


class PalmAnalyzer:
    """手のひら画像を解析するクラス（高精度版）"""
    
    def __init__(self):
        pass
    
    def analyze(self, image_bytes: bytes) -> Dict[str, Any]:
        """画像を解析し、手のひらと生命線の情報を抽出"""
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return {"error": "画像を読み込めませんでした"}
        
        # リサイズ（高品質維持）
        max_dim = 1200
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_LANCZOS4)
        
        # 画像前処理（コントラスト調整）
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        hsv = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2HSV)
        
        # 手のひら領域を検出（改善版）
        palm_mask, palm_contour = self._detect_palm_region_advanced(hsv, enhanced_bgr)
        
        if palm_contour is None:
            return {"error": "手のひらが検出できませんでした。明るい場所で手のひら全体を撮影してください。"}
        
        # 手のひらメトリクス
        palm_info = self._get_palm_metrics(palm_contour, image.shape)
        
        # 生命線を検出（高精度版）
        life_line_info = self._detect_life_line_advanced(enhanced_bgr, palm_mask, palm_contour)
        
        # スコア計算
        ratio_result = self._calculate_ratio(palm_info, life_line_info)
        
        return {
            "palm_metrics": palm_info,
            "life_line": life_line_info,
            "ratio": ratio_result,
            "image_size": {"width": image.shape[1], "height": image.shape[0]}
        }
    
    def _detect_palm_region_advanced(self, hsv: np.ndarray, bgr: np.ndarray) -> Tuple[np.ndarray, Any]:
        """高精度肌色検出"""
        # 複数の肌色範囲を統合
        skin_ranges = [
            (np.array([0, 20, 70]), np.array([20, 150, 255])),
            (np.array([0, 10, 60]), np.array([25, 160, 255])),
            (np.array([170, 20, 70]), np.array([180, 150, 255]))
        ]
        
        skin_mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
        for lower, upper in skin_ranges:
            mask = cv2.inRange(hsv, lower, upper)
            skin_mask = cv2.bitwise_or(skin_mask, mask)
        
        # YCrCb色空間でも検出（より正確）
        ycrcb = cv2.cvtColor(bgr, cv2.COLOR_BGR2YCrCb)
        skin_ycrcb = cv2.inRange(ycrcb, np.array([0, 133, 77]), np.array([255, 173, 127]))
        skin_mask = cv2.bitwise_or(skin_mask, skin_ycrcb)
        
        # ノイズ除去（より強力）
        kernel_small = np.ones((5, 5), np.uint8)
        kernel_large = np.ones((11, 11), np.uint8)
        
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel_small, iterations=2)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel_large, iterations=3)
        skin_mask = cv2.GaussianBlur(skin_mask, (5, 5), 0)
        _, skin_mask = cv2.threshold(skin_mask, 127, 255, cv2.THRESH_BINARY)
        
        # 輪郭検出
        contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return skin_mask, None
        
        # 最大の凸包領域を手のひらとする
        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)
        
        min_area = (bgr.shape[0] * bgr.shape[1]) * 0.08
        if area < min_area:
            return skin_mask, None
        
        # 凸包で手のひらを滑らかに
        hull = cv2.convexHull(largest_contour)
        
        return skin_mask, hull
    
    def _get_palm_metrics(self, contour: np.ndarray, img_shape: Tuple) -> Dict[str, Any]:
        """手のひらの基本情報を取得"""
        x, y, w, h = cv2.boundingRect(contour)
        area = cv2.contourArea(contour)
        
        # 手のひら幅の約10%を基準とする（より正確な推定）
        estimated_joint_width = int(w * 0.11)
        
        return {
            "width": w,
            "height": h,
            "area": area,
            "estimated_joint_width": estimated_joint_width,
            "bbox": {"x": x, "y": y, "w": w, "h": h}
        }
    
    def _detect_life_line_advanced(self, bgr: np.ndarray, palm_mask: np.ndarray, palm_contour: np.ndarray) -> Dict[str, Any]:
        """高精度生命線検出"""
        # グレースケール変換
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        
        # 手のひら領域に限定
        palm_gray = cv2.bitwise_and(gray, gray, mask=palm_mask)
        
        # ノイズ除去
        denoised = cv2.fastNlMeansDenoising(palm_gray, None, 10, 7, 21)
        
        # エッジ検出（複数手法を組み合わせ）
        # 1. Cannyエッジ
        edges_canny = cv2.Canny(denoised, 40, 120, apertureSize=3)
        
        # 2. Sobelエッジ
        sobelx = cv2.Sobel(denoised, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(denoised, cv2.CV_64F, 0, 1, ksize=3)
        edges_sobel = np.sqrt(sobelx**2 + sobely**2)
        edges_sobel = np.uint8(edges_sobel / edges_sobel.max() * 255)
        _, edges_sobel = cv2.threshold(edges_sobel, 50, 255, cv2.THRESH_BINARY)
        
        # エッジを統合
        edges = cv2.bitwise_or(edges_canny, edges_sobel)
        
        # 形態学処理でエッジを強調
        kernel = np.ones((3, 3), np.uint8)
        edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)
        
        # 手のひらのバウンディングボックス
        x, y, pw, ph = cv2.boundingRect(palm_contour)
        
        # 生命線候補領域（親指側の下部 - より広範囲）
        # 生命線は通常、親指と人差し指の間から手首に向かう
        life_region_x_start = x + int(pw * 0.05)
        life_region_x_end = x + int(pw * 0.55)
        life_region_y_start = y + int(ph * 0.25)
        life_region_y_end = y + int(ph * 0.95)
        
        life_line_region = edges[
            life_region_y_start:life_region_y_end,
            life_region_x_start:life_region_x_end
        ]
        
        # ハフ線変換で生命線を検出
        lines = cv2.HoughLinesP(
            life_line_region,
            rho=1,
            theta=np.pi/180,
            threshold=30,
            minLineLength=int(ph * 0.15),
            maxLineGap=10
        )
        
        total_length = 0
        line_pixels = cv2.countNonZero(life_line_region)
        
        if lines is not None:
            # 全ての線の長さを合計
            for line in lines:
                x1, y1, x2, y2 = line[0]
                length = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
                total_length += length
            
            # 最も長い連続線を推定
            estimated_length = int(total_length * 0.7)
        else:
            # 線が検出できない場合はピクセルカウントから推定
            estimated_length = int(line_pixels * 0.5)
        
        return {
            "detected": line_pixels > 100,
            "pixel_count": int(line_pixels),
            "estimated_length": max(estimated_length, int(ph * 0.3)),
            "confidence": min(100, int(line_pixels / 10))
        }
    
    def _calculate_ratio(self, palm_info: Dict, life_line_info: Dict) -> Dict[str, Any]:
        """手のひらサイズに対する生命線の比率を計算"""
        if not life_line_info.get("detected"):
            return {
                "valid": False,
                "message": "生命線が検出できませんでした。手のひら全体が明るく写り、しわが見えるように撮影してください。"
            }
        
        reference_width = palm_info["estimated_joint_width"]
        life_line_length = life_line_info["estimated_length"]
        
        # 比率計算（より正確なスケーリング）
        length_ratio = life_line_length / max(reference_width, 1)
        
        # 信頼度加重
        confidence = life_line_info.get("confidence", 50) / 100.0
        
        # スコアリング: 理想的な比率は4-7程度
        base_score = min(100, max(25, (length_ratio / 5.5) * 85))
        adjusted_score = base_score * (0.7 + 0.3 * confidence)
        
        return {
            "valid": True,
            "reference_width": reference_width,
            "life_line_length": life_line_length,
            "length_ratio": round(length_ratio, 2),
            "normalized_score": int(adjusted_score),
            "confidence": int(confidence * 100),
            "reference_estimated": True
        }
