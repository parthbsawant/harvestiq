STEP 5: Backend Development, MongoDB Integration, and Machine Learning Prediction
1. Introduction

This step focuses on transforming the processed dataset into a usable application system by introducing:

Database storage (MongoDB)
Backend APIs (Flask)
Machine Learning model for prediction

The objective is to convert static Hadoop output into a dynamic, queryable, and intelligent system capable of serving real-time insights and predictions.

2. Input Data
Source

Final integrated dataset generated from Step 4:

/output/final_dataset/part-00000
Structure
year,state,crop    yield,temp,humidity,wind,pressure
Example
2013,Andhra Pradesh,Rice    2.45,24.79,63.05,6.83,1007.64
3. Data Export from HDFS

The dataset was copied from HDFS to local system:

hdfs dfs -get /output/final_dataset ./hadoop_outputs/
4. MongoDB Integration
4.1 Database Setup
Database: harvestiq_db
Collection: crop_data
use harvestiq_db
db.createCollection("crop_data")
4.2 Data Ingestion

A Python script (load_to_mongo.py) was used to:

Read dataset line-by-line
Parse key-value format
Convert into structured JSON
Insert into MongoDB
Document Structure
{
  "year": 2013,
  "state": "Andhra Pradesh",
  "crop": "Rice",
  "yield": 2.45,
  "temperature": 24.79,
  "humidity": 63.05,
  "wind_speed": 6.83,
  "pressure": 1007.64
}
4.3 Outcome
Data successfully stored in MongoDB
Structured format enables fast querying
Dataset ready for backend APIs
5. Backend Development using Flask

A Flask-based backend server was implemented to expose APIs.

5.1 Basic APIs
1. Get Data
GET /data

Returns dataset (limited records)

2. Filter Data
GET /filter?year=2013&state=Andhra Pradesh

Supports filtering based on:

year
state
crop
6. Analytics APIs

To enhance analytical capability, MongoDB aggregation pipelines were used.

6.1 Average Yield per Crop
GET /avg_yield_per_crop
Groups data by crop
Computes average yield
Returns top 10 crops
6.2 Year-wise Yield Trend
GET /yield_trend
Groups by year
Shows average yield trend
Useful for time-series visualization
6.3 Top Crops
GET /top_crops
Identifies best performing crops
Returns top 5
7. Machine Learning Model
7.1 Objective

Predict crop yield using environmental factors.

7.2 Features Used
year
temperature
humidity
wind_speed
pressure
crop (encoded)
7.3 Data Preparation
Removed non-numeric column (state)
Applied one-hot encoding on crop
Split data into training and testing
7.4 Model Used

Linear Regression

Reason:

Simple
Fast
Suitable for regression problems
7.5 Training Process
Data fetched from MongoDB
Converted to DataFrame
Model trained using scikit-learn
Saved using joblib

Generated files:

yield_model.pkl
model_columns.pkl
7.6 Prediction API
POST /predict
Input Format
{
  "year": 2013,
  "temperature": 25,
  "humidity": 60,
  "wind_speed": 5,
  "pressure": 1005,
  "crop": "Rice"
}
Output
{
  "predicted_yield": 2.85
}
Working
Input converted to DataFrame
Crop encoded
Columns aligned with training data
Model predicts yield
8. System Architecture
Hadoop Output
     ↓
Local Dataset
     ↓
MongoDB
     ↓
Flask Backend
     ↓
Analytics APIs + ML Prediction
     ↓
Frontend (Next Step)
9. Key Concepts Learned
NoSQL Database (MongoDB)
REST API development (Flask)
MongoDB Aggregation Pipeline
Machine Learning integration
Model deployment via API
End-to-end data pipeline
10. Outcome of Step 5

This step successfully:

Converted static data into dynamic system
Enabled querying and filtering
Added analytical capabilities
Integrated machine learning model
Created prediction API
11. Limitations
Linear regression may not capture complex patterns
No location-specific climate mapping
No real-time data updates
12. Next Step

The next phase involves:

Building frontend dashboard using React
Integrating APIs into UI
Visualizing insights and predictions