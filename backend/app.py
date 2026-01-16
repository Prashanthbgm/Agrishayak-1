from flask import Flask, request, jsonify
from flask_cors import CORS
from services.crop_service import predict_crop
from services.disease_service import predict_disease_from_image
from services.mandi_service import get_market_prices
from services.auction_service import (
    create_auction,
    get_active_auctions,
    place_bid,
    get_admin_connections
)
from services.auction_service import accept_highest_bid


app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running"})
#croprecommendation endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    result = predict_crop(data)
    return jsonify(result)

from services.weather_service import get_weather_average
#weather average endpoint
@app.route("/api/weather-average", methods=["GET"])
def weather_average():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    days = int(request.args.get("days", 30))

    if not lat or not lon:
        return jsonify({"error": "lat and lon required"}), 400

    return jsonify(get_weather_average(lat, lon, days))
#disease prediction endpoint
@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    image = request.files["image"]
    result = predict_disease_from_image(image.read())
    return jsonify(result)

#mandi prices endpoint

@app.route("/api/mandi-prices", methods=["GET"])
def mandi_prices():
    state = request.args.get("state", "Karnataka")
    crop = request.args.get("crop") or None

    result = get_market_prices(state=state, crop=crop)
    return jsonify(result)

#auction endpoints
@app.route("/api/upload-crop", methods=["POST"])
def upload_crop():
    data = request.get_json()
    return jsonify(create_auction(data))


@app.route("/api/auctions", methods=["GET"])
def auctions():
    return jsonify({"auctions": get_active_auctions()})


@app.route("/api/auctions/<auction_id>/bid", methods=["POST"])
def bid(auction_id):
    data = request.get_json()
    return jsonify(place_bid(auction_id, data))


@app.route("/api/admin/connections", methods=["GET"])
def admin_connections():
    connections = get_admin_connections()

    # Add WhatsApp links
    for c in connections:
        if c["seller_contact"]:
            c["seller_whatsapp"] = f"https://wa.me/91{c['seller_contact']}"
        if c["bidder_contact"]:
            c["bidder_whatsapp"] = f"https://wa.me/91{c['bidder_contact']}"

    return jsonify({"connections": connections})
#accept highest bid endpoint
@app.route("/api/auctions/<auction_id>/accept", methods=["POST"])
def accept_bid(auction_id):
    return jsonify(accept_highest_bid(auction_id))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
