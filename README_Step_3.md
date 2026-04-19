STEP 4: Data Integration (Crop Yield + Climate Data)
1. Introduction

This step focuses on integrating multiple datasets to create a unified dataset for analysis and prediction.

In previous steps:

Step 2 produced average crop yield per (year, state, crop)
Step 3 produced year-wise climate averages

However, these datasets exist independently and do not provide direct insights when analyzed separately.

The objective of Step 4 is to merge crop yield data with climate data using a common key, thereby enabling meaningful analysis of how environmental factors influence agricultural productivity.

This step transforms isolated datasets into a combined analytical dataset, which forms the foundation for prediction and decision-making.

2. What We Got from Step 2 and Step 3
From Step 2 (Crop Data)

Format:

year,state,crop    avg_yield

Example:

1997,Andhra Pradesh,Arhar/Tur    0.3148
From Step 3 (Climate Data)

Format:

year    avg_temp,avg_humidity,avg_wind,avg_pressure

Example:

2013    24.79,63.05,6.83,1007.64
Key Observation
Both datasets share a common attribute: YEAR
Crop data is more granular (year, state, crop)
Climate data is aggregated at year level
3. What We Are Doing in Step 4

In this step, we:

Join crop dataset with climate dataset using:

year (common key)
Enrich crop data with environmental parameters
Final Output Format
year,state,crop,avg_yield,temp,humidity,wind,pressure
Goal

Convert:

Isolated datasets → Integrated dataset

This enables:

Correlation analysis
Pattern detection
Machine learning readiness
4. System Architecture Overview

The architecture now includes multi-dataset processing:

Local System (macOS)
HDFS (Multiple input sources)
Hadoop Streaming (MapReduce)
Python Mapper and Reducer
5. Data Flow
Crop Data (/output/avg_yield)
        │
        ▼
Climate Data (/output/climate_yearly)
        │
        ▼
Mapper (Tagging & Key Formation)
        │
        ▼
Shuffle & Sort (Group by Year)
        │
        ▼
Reducer (Join Operation)
        │
        ▼
Final Output (/output/final_dataset)
6. Step-by-Step Implementation
Step 1: Prepare Inputs

Two datasets are used:

/output/avg_yield
/output/climate_yearly
Step 2: Copy Data into Single Input Folder
hdfs dfs -mkdir /input/join_data

hdfs dfs -cp /output/avg_yield/part-00000 /input/join_data/crop.txt
hdfs dfs -cp /output/climate_yearly/part-00000 /input/join_data/climate.txt
7. Mapper Logic

The mapper reads both datasets and differentiates them using tags.

Operations:
Identify source (crop or climate)
Extract year as key
Attach tag to value
Mapper Output Format
year    CROP,state,crop,yield
year    CLIMATE,temp,humidity,wind,pressure
Concept
Key: year
Value: tagged data (CROP / CLIMATE)
8. Shuffle and Sort Phase

Hadoop groups data based on year.

Example:
2013 → [CROP,..., CROP,..., CLIMATE,...]

This prepares data for joining.

9. Reducer Logic

Reducer performs a join operation.

Steps:
Separate:
Crop records
Climate record
For each crop record:
Attach climate values
Emit combined result
10. Join Concept

This is similar to:

SQL INNER JOIN on year
Formula Representation
Final Record =
Crop Data + Climate Data
11. Job Execution
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
-input /input/join_data \
-output /output/final_dataset \
-mapper "python3 join_mapper.py" \
-reducer "python3 join_reducer.py" \
-file join_mapper.py \
-file join_reducer.py
12. Output

Stored in:

/output/final_dataset/part-00000
Sample Output
2013,Delhi,Wheat    2.45,24.79,63.05,6.83,1007.64
2014,Delhi,Rice     3.12,25.01,59.77,6.76,1008.35
13. Explanation of Output

Each row represents:

(year, state, crop) + climate conditions
Interpretation Example
2013,Delhi,Wheat    2.45,24.79,63.05,6.83,1007.64

Meaning:

Year: 2013
State: Delhi
Crop: Wheat
Yield: 2.45
Temperature: 24.79
Humidity: 63.05
Wind Speed: 6.83
Pressure: 1007.64
14. What We Achieved in Step 4

This step successfully:

Combined multiple datasets
Enriched crop data with climate factors
Created a unified dataset
Enabled advanced analytics
15. How This Helps in Further Steps

This dataset can now be used for:

Predictive modeling
Trend analysis
Recommendation systems
Machine learning
Example Use Cases
Predict crop yield based on climate
Identify optimal growing conditions
Detect environmental impact on crops
16. Key Concepts Learned
Data integration in Hadoop
Reduce-side join
Multi-source data processing
Key-based joining
Distributed join operation
17. Limitations
Join based only on year (not location-specific climate)
Missing climate values handled simplistically
No advanced statistical modeling yet
18. Conclusion

Step 4 transforms separate datasets into a unified analytical dataset.

This is the most critical step in the pipeline, as it enables meaningful insights and prepares the data for intelligent systems such as prediction models and dashboards.

19. Next Step

The next step involves:

Storing integrated data in MongoDB and building backend APIs

This will allow:

Data querying
Real-time access
Integration with frontend systems