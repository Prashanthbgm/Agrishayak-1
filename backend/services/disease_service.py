import os
import io
import base64
import json
import re
import numpy as np
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.0-pro-vision")


# ---------- local plant heuristic (fast) ----------
IMG_SIZE = (224, 224)

def preprocess_pil_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img) / 255.0
    return arr

def detect_plant_image(image_array):
    try:
        # Green channel dominance heuristic (same as you used before)
        green_mask = (
            (image_array[:, :, 1] > image_array[:, :, 0] + 0.04) &
            (image_array[:, :, 1] > image_array[:, :, 2] + 0.04)
        )
        green_ratio = float(np.mean(green_mask))
        gray = np.mean(image_array, axis=2)
        texture_var = float(np.var(gray))
        # conservative thresholds (reduce false positive plant detection)
        is_plant = (green_ratio > 0.18) or (texture_var > 0.012)
        return is_plant, round(green_ratio, 4), round(texture_var, 6)
    except Exception:
        return False, 0.0, 0.0

# ---------- helper ----------
def image_to_base64(img_bytes):
    return base64.b64encode(img_bytes).decode("utf-8")

def safe_extract_json(text):
    """
    Extract first {...} block from text and parse with json.loads.
    Returns dict or raises ValueError.
    """
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in model output")
    json_text = text[start:end+1]
    # Try to clean common issues (single quotes -> double quotes, trailing commas)
    json_text = re.sub(r"(\')", "\"", json_text)
    json_text = re.sub(r",\s*}", "}", json_text)
    json_text = re.sub(r",\s*]", "]", json_text)
    return json.loads(json_text)

# ---------- main function (improved) ----------
def predict_disease_from_image(img_bytes):
    """
    1) Run local plant heuristic — if not plant, return quickly.
    2) Call Gemini with strict prompt asking for JSON only and numeric confidence 0-100.
    3) Safely parse and normalize response.
    """
    # 1) local check
    try:
        arr = preprocess_pil_image(img_bytes)
        is_plant_local, green_ratio, texture_var = detect_plant_image(arr)
    except Exception as e:
        is_plant_local, green_ratio, texture_var = False, 0.0, 0.0

    if not is_plant_local and green_ratio < 0.14:
        return {
            "is_plant": False,
            "message": "Not a plant/leaf image (local heuristic)",
            "green_ratio": green_ratio,
            "texture_variance": texture_var
        }

    # 2) call Gemini
    try:
        img_b64 = image_to_base64(img_bytes)

        # Strict prompt: request numeric confidence 0-100 and short remedy
        prompt = (
            "You are an agricultural expert. Analyze the attached image (a crop leaf). "
            "Respond ONLY with a single JSON object and nothing else, using the following exact keys:\n"
            "{\n"
            '  "is_plant": true/false,\n'
            '  "label": "Healthy" | "Diseased" | "Uncertain",\n'
            '  "disease_name": null or "<disease name>",\n'
            '  "confidence": 0-100,   // integer or float, percent\n'
            '  "remedy": "<short farmer-friendly advice up to 30 words>"\n'
            "}\n"
            "Rules: If the image is not a leaf, set is_plant=false. If unsure, set label to Uncertain and keep disease_name null. Keep remedy concise."
        )

        # NOTE: set temperature=0 for deterministic answers; reduce max tokens reasonably
        response = model.generate_content(
    [
        prompt,
        {
            "mime_type": "image/jpeg",
            "data": img_b64
        }
    ]
)


        raw_text = response.text.strip()
        # log raw model output for debugging (print or app logger)
        print("=== output ===")
        print(raw_text)
        print("=========================")

        # 3) extract JSON safely
        parsed = safe_extract_json(raw_text)

        # Normalize fields
        is_plant = bool(parsed.get("is_plant", True))
        label = parsed.get("label", "Uncertain")
        disease_name = parsed.get("disease_name", None)
        confidence_raw = parsed.get("confidence", parsed.get("confidence_percent", None))

        # Normalize confidence to float 0-100
        if isinstance(confidence_raw, str):
            # remove % and whitespace
            confidence_raw = confidence_raw.replace("%", "").strip()
        try:
            confidence = float(confidence_raw)
        except Exception:
            confidence = None

        remedy = parsed.get("remedy", "") or ""

        # Safety: if confidence is None, map Uncertain
        if confidence is None:
            return {
                "is_plant": is_plant,
                "label": "Uncertain",
                "disease_name": None,
                "confidence": None,
                "remedy": "Low confidence from model. Retake image with better lighting."
            }

        # If confidence too low (under 60) mark Uncertain
        if confidence < 60:
            return {
                "is_plant": is_plant,
                "label": "Uncertain",
                "disease_name": disease_name,
                "confidence": round(confidence, 2),
                "remedy": "Low confidence. Please retake image with clear leaf centered."
            }

        # Final structured response
        return {
            "is_plant": is_plant,
            "label": label,
            "disease_name": disease_name,
            "confidence": round(confidence, 2),
            "remedy": remedy
        }

    except Exception as e:
        # log error
        print("Gemini call/parse error:", str(e))
        return {
            "error": "Gemini disease detection failed",
            "details": str(e)
        }
