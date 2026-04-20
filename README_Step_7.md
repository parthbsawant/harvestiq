STEP 7: Frontend Integration, API Testing & Debugging Phase
1. Introduction

In this step, the backend system developed in previous steps is integrated with a React-based frontend dashboard.

The goal is to:

Connect all APIs with UI
Enable user interaction
Display predictions, analytics, and recommendations visually
Identify and debug real-world integration issues
2. Objectives
Integrate Flask backend with React frontend
Build UI for:
Crop Yield Prediction
Crop Recommendation
Dashboard Analytics
Handle API responses in frontend
Debug real-time issues (CORS, data mismatch, API failures)
3. System Architecture (Updated)
React Frontend (Port 5173)
        ↓
Axios API Calls
        ↓
Flask Backend (Port 5000)
        ↓
MongoDB Database
        ↓
ML Model + Logic
4. Frontend Features Implemented
4.1 Predict Yield Page
User inputs:
Year
Crop
Temperature
Humidity
Wind Speed
Pressure
Output:
Predicted Yield
Insight Message
4.2 Dashboard Page
Filters:
Year
State
Crop
Visualizations:
Top Performing Crops
Average Yield per Crop
Yield Trend Graph
4.3 Recommendation Page
Inputs:
Environmental conditions
Output:
Top recommended crops
5. API Integration (Frontend)
Base URL
http://127.0.0.1:5000
APIs Used
API	Method	Purpose
/data	GET	Raw dataset
/filter	GET	Filtered data
/avg_yield_per_crop	GET	Average yield
/yield_trend	GET	Trend analysis
/top_crops	GET	Best crops
/predict	POST	Yield prediction
/recommend	POST	Crop recommendation
6. Issues Encountered During Integration
6.1 CORS Error
Error:
Access to XMLHttpRequest blocked by CORS policy
Cause:

Frontend (5173) and Backend (5000) run on different origins.

Fix:
from flask_cors import CORS
CORS(app)
6.2 Backend Not Running
Error:
net::ERR_FAILED
Cause:

Flask server not active or wrong port.

Fix:
Ensure Flask is running:
python app.py
6.3 Payload Key Mismatch
Problem:

Frontend sent:

Temperature, Humidity, Wind_Speed

Backend expected:

temperature, humidity, wind_speed
Fix:

Standardized payload keys to lowercase.

6.4 Recommendation Not Working
Problem:

No results returned.

Cause:

ML-based recommendation logic mismatch with dataset.

Temporary Fix:

Replaced with similarity-based recommendation:

Compare input with dataset
Return closest matching crops
6.5 Dashboard Showing "Unknown"
Problem:
Top crops showing "Unknown"
Cause:

Mismatch in backend response keys:

Backend: avg_yield
Frontend expected: yield
Fix:

Standardized response:

{
  "crop": "Rice",
  "yield": 2.5
}
6.6 Yield Trend Graph Issue
Problem:
Same data for every query
Graph not changing
Cause:
Backend returning raw data instead of aggregated trend
Status:

To be fixed in next step.

6.7 Incorrect Insights in Prediction
Problem:

Insight message not matching conditions.

Cause:

Rule-based logic too generic.

Status:

Will be refined in next step.

7. Current Working Status
Feature	Status
Predict Yield	✅ Working
Backend APIs	✅ Working
Dashboard	⚠️ Partial
Recommendation	⚠️ Basic working
Graphs	❌ Incorrect
Insights	⚠️ Needs improvement
8. Testing & Validation
8.1 Backend Direct Testing (Browser)
Test 1:
http://127.0.0.1:5000/data

✅ Returns dataset

Test 2:
http://127.0.0.1:5000/top_crops

✅ Returns:

[
  { "crop": "Coconut", "yield": 5514.36 },
  ...
]
Test 3:
http://127.0.0.1:5000/avg_yield_per_crop

✅ Returns aggregated data

8.2 Prediction Test Cases
Test Case 1 (Valid Input)
Parameter	Value
Year	2013
Crop	Groundnut
Temp	24.7
Humidity	60
Wind	6.8
Pressure	1007

✅ Output:

Prediction generated
Insight shown
Test Case 2 (Edge Case)

| Temp | 40 |
| Humidity | 20 |

⚠️ Output:

Prediction works
Insight not accurate
8.3 Recommendation Test Cases
Test Case 1 (Real Data Match)

| Temp | 24.7 |
| Humidity | 63 |
| Wind | 6.8 |
| Pressure | 1007 |

⚠️ Output:

Sometimes empty or inconsistent
Test Case 2 (Random Input)

| Temp | 20 |
| Humidity | 45 |

⚠️ Output:

Limited recommendations
8.4 Dashboard Test Cases
Test Case 1:

| Year | 2024 |
| State | Maharashtra |
| Crop | Rice |

⚠️ Output:

Limited or no data
Test Case 2:

| Year | 2013 |
| State | Andhra Pradesh |
| Crop | Bajra |

⚠️ Output:

Data appears but inconsistent
9. Observations
Backend APIs are functional
Data exists and is accessible
Major issues are due to:
Data filtering logic
Aggregation errors
Frontend mapping inconsistencies
10. Key Learnings
Importance of API contract consistency
Handling real-world integration issues
Debugging frontend-backend communication
Data transformation between layers
Importance of proper aggregation in analytics
11. Limitations (Current Stage)
Recommendation logic is not ML-based
Trend analysis not properly implemented
Insights are rule-based and inaccurate
Dashboard lacks meaningful visualization
12. Next Step (Step 8)

The next step will focus on:

Fixing yield trend aggregation
Improving recommendation accuracy
Enhancing insight generation logic
Correcting dashboard data mapping
Ensuring realistic outputs across all modules
13. Conclusion

Step 7 successfully establishes:

Full frontend-backend integration
Functional prediction system
Initial dashboard and recommendation system

However, it also exposes critical real-world challenges that will be addressed in the next phase to make the system robust, accurate, and production-ready.