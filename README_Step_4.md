STEP 4: Dataset Integration using Reduce-Side Join (Crop + Climate)
1. Introduction

This step focuses on integrating two processed datasets:

Crop Yield Dataset (from Step 2)
Climate Dataset (from Step 3)

The objective is to combine agricultural productivity data with environmental factors to create a unified dataset for analysis and prediction.

This integration is performed using Reduce-Side Join in Hadoop MapReduce, where data from multiple sources is merged based on a common key.

2. Input Datasets
Dataset 1: Crop Yield (Step 2 Output)

Stored at:

/output/avg_yield/part-00000

Format:

year,state,crop    avg_yield

Example:

2013,Andhra Pradesh,Rice    2.45
Dataset 2: Climate Data (Step 3 Output)

Stored at:

/output/climate_yearly/part-00000

Format:

year    temperature,humidity,wind_speed,pressure

Example:

2013    24.79,63.05,6.83,1007.64
3. Objective of Step 4

To combine both datasets using:

Common Key = Year

Final dataset should contain:

year, state, crop → yield + climate features
4. Join Strategy Used
Reduce-Side Join

This method involves:

Sending all data to reducer
Grouping by key (year)
Performing join inside reducer
5. Data Preparation

Both datasets were copied into a single HDFS directory:

/input/join_data/

Commands used:

hdfs dfs -mkdir -p /input/join_data

hdfs dfs -cp /output/avg_yield/part-00000 /input/join_data/crop.txt
hdfs dfs -cp /output/climate_yearly/part-00000 /input/join_data/climate.txt
6. Data Flow
Crop Data + Climate Data
            │
            ▼
      Combined Input Folder
            │
            ▼
        Mapper (Tagging)
            │
            ▼
     Shuffle & Sort (by year)
            │
            ▼
       Reducer (Join Logic)
            │
            ▼
 Final Integrated Dataset (HDFS)
7. Mapper Logic

The mapper performs:

Reads both datasets
Identifies dataset type
Tags records as:
CROP
CLIMATE
Emits key-value pairs using year as key
Mapper Output Format
year    CROP,state,crop,yield
year    CLIMATE,temp,humidity,wind,pressure
8. Shuffle and Sort Phase

Handled automatically by Hadoop.

Operations:

Groups all records by year
Ensures reducer receives all related data together
9. Reducer Logic

Reducer performs the actual join:

Stores climate data for each year
Collects all crop records
Combines both datasets
Logic:

For each year:

For each crop record:
    Attach climate data
10. Output Format

Final dataset:

year,state,crop    yield,temp,humidity,wind,pressure
Example Output
2013,Andhra Pradesh,Rice    2.45,24.79,63.05,6.83,1007.64
11. Job Execution
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
-input /input/join_data \
-output /output/final_dataset \
-mapper "python3 join_mapper.py" \
-reducer "python3 join_reducer.py" \
-file join_mapper.py \
-file join_reducer.py
12. Output Location

Stored in HDFS:

/output/final_dataset/part-00000

Also copied to local system:

hadoop_outputs/final_dataset/
13. Observations
Each crop entry now includes climate features
Same climate values repeated per year (expected behavior)
Dataset size increased significantly due to join
14. Key Concepts Learned
Reduce-Side Join in Hadoop
Multi-dataset processing
Data tagging for joins
Key-based grouping
Data integration pipeline
15. Outcome of Step 4

This step successfully:

Combined agricultural and climate datasets
Created a unified dataset for analysis
Enabled feature-rich data for prediction models
16. Limitations
Join based only on year (not location-specific)
Climate data is generalized (Delhi-based dataset)
No real-time data integration
17. Next Step

The next step involves:

Storing final dataset in MongoDB
Building backend APIs (Flask)
Enabling data access for frontend dashboard