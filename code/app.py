
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["harvestiq_db"]
collection = db["crop_data"]

# ---------------- LOAD ML MODEL ----------------
model = joblib.load("yield_model.pkl")
model_columns = joblib.load("model_columns.pkl")

# Extract all crops from model columns
all_crops = [col.replace("crop_", "") for col in model_columns if col.startswith("crop_")]

# ---------------- BASIC APIs ----------------

@app.route("/")
def home():
    return "HarvestIQ Backend Running"

@app.route("/data", methods=["GET"])
def get_data():
    data = list(collection.find({}, {"_id": 0}).limit(100))
    return jsonify(data)

@app.route("/filter", methods=["GET"])
def filter_data():
    year = request.args.get("year")
    state = request.args.get("state")
    crop = request.args.get("crop")

    query = {}

    if year:
        query["year"] = int(year)
    if state:
        query["state"] = state
    if crop:
        query["crop"] = crop

    data = list(collection.find(query, {"_id": 0}).limit(100))
    return jsonify(data)

# ---------------- ANALYTICS APIs ----------------

@app.route("/avg_yield_per_crop", methods=["GET"])
def avg_yield_per_crop():
    pipeline = [
        {"$group": {"_id": "$crop", "avg_yield": {"$avg": "$yield"}}},
        {"$sort": {"avg_yield": -1}},
        {"$limit": 10}
    ]

    result = list(collection.aggregate(pipeline))

    for r in result:
        r["crop"] = r["_id"]
        del r["_id"]

    return jsonify(result)

@app.route("/yield_trend", methods=["GET"])
def yield_trend():
    pipeline = [
        {"$group": {"_id": "$year", "avg_yield": {"$avg": "$yield"}}},
        {"$sort": {"_id": 1}}
    ]

    result = list(collection.aggregate(pipeline))

    for r in result:
        r["year"] = r["_id"]
        del r["_id"]

    return jsonify(result)

@app.route("/top_crops", methods=["GET"])
def top_crops():
    pipeline = [
        {"$group": {"_id": "$crop", "avg_yield": {"$avg": "$yield"}}},
        {"$sort": {"avg_yield": -1}},
        {"$limit": 5}
    ]

    result = list(collection.aggregate(pipeline))

    for r in result:
        r["crop"] = r["_id"]
        del r["_id"]

    return jsonify(result)

# ---------------- HELPER FUNCTION ----------------

def generate_insight(temp, humidity, wind):
    if 20 <= temp <= 30 and 50 <= humidity <= 70:
        return "High yield expected due to favorable temperature and humidity"
    elif temp > 35:
        return "Yield may decrease due to high temperature"
    elif humidity < 30:
        return "Low humidity may negatively affect yield"
    elif wind > 15:
        return "High wind speed may impact crop stability"
    else:
        return "Moderate conditions, average yield expected"

# ---------------- ML PREDICTION API ----------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        input_dict = {
            "year": int(data["year"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "wind_speed": float(data["wind_speed"]),
            "pressure": float(data["pressure"])
        }

        crop_name = data["crop"]

        input_df = pd.DataFrame([input_dict])

        for col in model_columns:
            if col.startswith("crop_"):
                input_df[col] = 1 if col == f"crop_{crop_name}" else 0

        for col in model_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        input_df = input_df[model_columns]

        prediction = model.predict(input_df)[0]

        insight = generate_insight(
            input_dict["temperature"],
            input_dict["humidity"],
            input_dict["wind_speed"]
        )

        return jsonify({
            "predicted_yield": round(float(prediction), 4),
            "insight": insight
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ---------------- RECOMMENDATION API ----------------

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.json

        input_base = {
            "year": int(data["year"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "wind_speed": float(data["wind_speed"]),
            "pressure": float(data["pressure"])
        }

        results = []

        for crop in all_crops:
            input_df = pd.DataFrame([input_base])

            for col in model_columns:
                if col.startswith("crop_"):
                    input_df[col] = 1 if col == f"crop_{crop}" else 0

            for col in model_columns:
                if col not in input_df.columns:
                    input_df[col] = 0

            input_df = input_df[model_columns]

            pred = model.predict(input_df)[0]

            results.append({
                "crop": crop,
                "predicted_yield": round(float(pred), 4)
            })

        # Sort descending
        results = sorted(results, key=lambda x: x["predicted_yield"], reverse=True)

        return jsonify({
            "top_recommendations": results[:5]
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ALWAYS KEEP THIS LAST
if __name__ == "__main__":
    app.run(debug=True)