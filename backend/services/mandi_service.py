import requests

GOV_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
API_KEY = "YOUR_GOV_API_KEY"

def get_market_prices(state="Karnataka", crop=None):
    try:
        params = {
            "api-key": API_KEY,
            "format": "json",
            "limit": "100",
            "filters[state]": state
        }

        if crop:
            params["filters[commodity]"] = crop

        res = requests.get(GOV_API_URL, params=params, timeout=10)
        res.raise_for_status()

        data = res.json()
        records = data.get("records", [])

        prices = [
            {
                "crop": r.get("commodity"),
                "market": r.get("market"),
                "district": r.get("district"),
                "price": float(r.get("modal_price", 0))
            }
            for r in records[:20]
        ]

        return {
            "source": "government_api",
            "prices": prices
        }

    except Exception:
        return {
            "source": "fallback",
            "prices": [
                {"crop": "Onion", "market": "Bangalore", "district": "Bangalore Urban", "price": 2600},
                {"crop": "Tomato", "market": "Kolar", "district": "Kolar", "price": 1900},
                {"crop": "Potato", "market": "Mysore", "district": "Mysore", "price": 1200}
            ]
        }
