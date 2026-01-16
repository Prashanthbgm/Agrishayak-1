import os
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")

artifact = joblib.load(MODEL_PATH)

# Handle dict-based artifact
if isinstance(artifact, dict):
    model = artifact.get("model")
    label_encoders = artifact.get("label_encoders", {})
    features = artifact.get("features", None)
else:
    model = artifact
    label_encoders = {}
    features = None


def decode_label(target_name, value):
    """Convert encoded value back to crop name"""
    if target_name in label_encoders:
        le = label_encoders[target_name]
        try:
            return str(le.inverse_transform([int(value)])[0])
        except:
            return str(value)
    return str(value)


def predict_crop(data):
    if not isinstance(data, dict):
        return {"error": "Invalid JSON input"}

    # Required numeric inputs (adjust if needed)
    mandatory = [
        "Soil_PH", "Soil_N", "Soil_P", "Soil_K",
        "Avg_Temp", "Avg_Humidity", "Rain_CM"
    ]
    missing = [f for f in mandatory if f not in data]

    if missing:
        return {"error": "Missing required fields", "missing": missing}

    # Build input row
    if features:
        row = {f: data.get(f, 0) for f in features}
    else:
        row = data

    df = pd.DataFrame([row])

    try:
        preds = model.predict(df)

        response = {}

        # Multi-output model
        if isinstance(preds, np.ndarray) and len(preds.shape) == 2:
            target_names = ["Recommended_Crop", "Suggested_Crop", "High_Value_Alt"]
            for i in range(preds.shape[1]):
                key = target_names[i] if i < len(target_names) else f"output_{i}"
                response[key] = decode_label(key, preds[0][i])

        # Single output
        else:
            response["Recommended_Crop"] = decode_label("Recommended_Crop", preds[0])

        return response

    except Exception as e:
        return {
            "error": "Prediction failed",
            "details": str(e)
        }
