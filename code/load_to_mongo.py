from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["harvestiq_db"]
collection = db["crop_data"]

# File path
file_path = "../hadoop_outputs/final_dataset/final_dataset/part-00000"

with open(file_path, "r") as file:
    for line in file:
        line = line.strip()

        if not line:
            continue

        try:
            key, values = line.split("\t")

            year, state, crop = key.split(",")
            yield_val, temp, humidity, wind, pressure = values.split(",")

            document = {
                "year": int(year),
                "state": state.strip(),
                "crop": crop.strip(),
                "yield": float(yield_val),
                "temperature": float(temp),
                "humidity": float(humidity),
                "wind_speed": float(wind),
                "pressure": float(pressure)
            }

            collection.insert_one(document)

        except:
            continue

print("Data inserted successfully")