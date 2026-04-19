from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["harvestiq_db"]
collection = db["crop_data"]

@app.route("/")
def home():
    return "HarvestIQ Backend Running"

@app.route("/data", methods=["GET"])
def get_data():
    data = list(collection.find({}, {"_id": 0}).limit(100))
    return jsonify(data)

# ✅ NEW FILTER API
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

# ALWAYS KEEP THIS LAST
if __name__ == "__main__":
    app.run(debug=True)