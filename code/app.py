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

# ---------------- ML PREDICTION API ----------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Create input dict
        input_dict = {
            "year": int(data["year"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "wind_speed": float(data["wind_speed"]),
            "pressure": float(data["pressure"])
        }

        # Handle crop encoding
        crop_name = data["crop"]

        # Create DataFrame
        input_df = pd.DataFrame([input_dict])

        # Add crop columns (one-hot)
        for col in model_columns:
            if col.startswith("crop_"):
                input_df[col] = 1 if col == f"crop_{crop_name}" else 0

        # Add missing columns
        for col in model_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        # Ensure correct order
        input_df = input_df[model_columns]

        # Predict
        prediction = model.predict(input_df)[0]

        return jsonify({
            "predicted_yield": round(float(prediction), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ALWAYS KEEP THIS LAST
if __name__ == "__main__":
    app.run(debug=True)