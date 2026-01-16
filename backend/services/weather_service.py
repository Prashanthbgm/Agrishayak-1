import time
import requests
from datetime import datetime, timedelta

_cache = {}
CACHE_TTL = 3600  # 1 hour

def get_weather_average(lat, lon, days=30):
    key = f"{lat}:{lon}:{days}"
    now = time.time()

    if key in _cache and now - _cache[key][0] < CACHE_TTL:
        return _cache[key][1]

    end_date = datetime.utcnow().date() - timedelta(days=1)
    start_date = end_date - timedelta(days=days - 1)

    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "hourly": "temperature_2m,relativehumidity_2m",
        "timezone": "UTC"
    }

    res = requests.get(url, params=params, timeout=15)
    res.raise_for_status()
    data = res.json()

    temps = data.get("hourly", {}).get("temperature_2m", [])
    hums = data.get("hourly", {}).get("relativehumidity_2m", [])

    result = {
        "avg_temp": round(sum(temps) / len(temps), 2) if temps else None,
        "avg_humidity": round(sum(hums) / len(hums), 2) if hums else None,
        "days": days,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat()
    }

    _cache[key] = (now, result)
    return result
