from pymongo import MongoClient
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["harvestiq_db"]
collection = db["crop_data"]

# Load data
data = list(collection.find({}, {"_id": 0}))
df = pd.DataFrame(data)

# ---------------- FIX START ----------------

# Drop non-numeric unnecessary column
df = df.drop(columns=["state"])

# Encode crop
df = pd.get_dummies(df, columns=["crop"])

# ---------------- FIX END ----------------

# Features & target
X = df.drop("yield", axis=1)
y = df["yield"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "yield_model.pkl")

# Save columns
joblib.dump(X.columns.tolist(), "model_columns.pkl")

print("Model trained and saved successfully")