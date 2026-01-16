import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_mandi_insight(prices, state):
    """
    prices = list of dicts from gov API
    """

    if not prices:
        return "No sufficient mandi data available today."

    sample = prices[:5]

    prompt = f"""
You are an agricultural market expert.

Given mandi prices data for {state}:
{sample}

Explain in simple farmer-friendly language:
- Which crop looks profitable today
- Whether prices are high or low
- Simple advice (sell now / wait)

Keep it short (3–4 lines).
"""

    response = model.generate_content(prompt)
    return response.text.strip()
