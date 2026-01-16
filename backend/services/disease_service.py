import os
import io
import base64
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def image_to_base64(img_bytes):
    return base64.b64encode(img_bytes).decode("utf-8")


def predict_disease_from_image(img_bytes):
    """
    Uses Gemini Vision to:
    - Check if image is a plant leaf
    - Detect disease
    - Suggest treatment
    """

    try:
        # Convert image to base64
        img_base64 = image_to_base64(img_bytes)

        prompt = """
You are an agricultural expert.

Analyze the given image and respond strictly in JSON format with:
{
  "is_plant": true/false,
  "label": "Healthy" or "Diseased" or "Uncertain",
  "disease_name": "<name or null>",
  "confidence": "<percentage>",
  "remedy": "<short treatment advice>"
}

Rules:
- If image is not a plant leaf, set is_plant=false
- If healthy, disease_name=null
- If unsure, label=Uncertain
- Be concise and farmer-friendly
"""

        response = model.generate_content(
            [
                prompt,
                {
                    "mime_type": "image/jpeg",
                    "data": img_base64
                }
            ]
        )

        text = response.text.strip()

        # Extract JSON safely
        start = text.find("{")
        end = text.rfind("}") + 1
        json_text = text[start:end]

        return eval(json_text)

    except Exception as e:
        return {
            "error": "Gemini disease detection failed",
            "details": str(e)
        }
