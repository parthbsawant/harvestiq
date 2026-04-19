STEP 1: Crop Yield Calculation using Hadoop MapReduce

1. Introduction

This step focuses on building the first stage of a data processing pipeline for agricultural analytics. The objective is to compute crop yield from raw agricultural production data using Hadoop MapReduce.

Crop yield is a critical metric in agriculture, defined as the ratio of production to the area of cultivation. This step transforms raw data into a structured and meaningful format that can be used for further analytics and prediction.

The implementation uses Hadoop Distributed File System (HDFS) for storage and Hadoop Streaming with Python for distributed processing.

2. Dataset Description
Source Dataset: Crop Production Dataset

The dataset contains agricultural production data across different states and years.

Original Columns
State_Name, District_Name, Crop_Year, Season, Crop, Area, Production
Cleaned Dataset Used

For this step, unnecessary columns were removed to simplify processing.

State_Name, Crop_Year, Crop, Area, Production
Column Details
State_Name: Name of the state where crop is grown
Crop_Year: Year of production
Crop: Type of crop
Area: Area under cultivation (in hectares)
Production: Total production (in tonnes)
Derived Metric
Yield = Production / Area
3. System Architecture Overview

The processing pipeline consists of the following components:

Local System (macOS)
Hadoop Distributed File System (HDFS)
Hadoop MapReduce (Streaming Mode)
Python-based Mapper and Reducer
4. Data Flow
Local CSV File
      │
      ▼
Upload to HDFS (/input)
      │
      ▼
Mapper (Python)
      │
      ▼
Shuffle and Sort (Hadoop)
      │
      ▼
Reducer (Python)
      │
      ▼
Output stored in HDFS (/output/yield)
5. Step-by-Step Implementation
Step 1: Data Preparation

The dataset was cleaned by removing unnecessary columns such as district and season. The cleaned dataset was saved as:

crop_cleaned.csv
Step 2: Upload Data to HDFS

The dataset was uploaded to Hadoop Distributed File System:

hdfs dfs -mkdir /input
hdfs dfs -put crop_cleaned.csv /input
Step 3: MapReduce Implementation using Hadoop Streaming

Hadoop Streaming allows the use of Python scripts for MapReduce operations.

Two scripts were created:

mapper.py
reducer.py
6. Mapper Logic

The mapper processes each line of the dataset and performs the following:

Reads input line by line
Skips the header row
Splits the CSV into columns
Extracts required fields
Converts numerical values to float
Handles invalid data (e.g., division by zero)
Computes yield
Emits key-value pairs
Mapper Output Format
year,state,crop    yield
Concept
Key: year,state,crop
Value: yield
7. Shuffle and Sort Phase

This phase is handled automatically by Hadoop.

Operations performed:

Groups data based on keys
Sorts intermediate data
Prepares input for reducer
8. Reducer Logic

The reducer in this step performs a pass-through operation.

It simply outputs the mapper results without aggregation.

This is done because the goal of this step is to compute yield at a per-record level.

9. Job Execution

The MapReduce job was executed using Hadoop Streaming:

hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
-input /input/crop_cleaned.csv \
-output /output/yield \
-mapper mapper.py \
-reducer reducer.py \
-files mapper.py,reducer.py
10. Output

The output is stored in HDFS:

/output/yield/part-00000
Sample Output
1997,Andhra Pradesh,Arhar/Tur    0.1214
1997,Andhra Pradesh,Arhar/Tur    0.1875
11. Observations
Multiple entries exist for the same combination of year, state, and crop
This occurs because the original dataset contained district-level records
No aggregation has been applied at this stage
12. Key Concepts Learned
Hadoop Distributed File System (HDFS) for scalable storage
Hadoop Streaming for using Python in MapReduce
Mapper for data transformation
Reducer for data aggregation (not used fully in this step)
Key-value pair processing model
Distributed data processing
13. Outcome of Step 1

This step successfully:

Converted raw agricultural data into meaningful yield values
Established a working Hadoop pipeline
Enabled distributed processing of large datasets
Prepared the dataset for further aggregation and analysis
14. Limitations
No aggregation performed
Duplicate keys exist
No integration with other datasets yet
15. Next Step

The next step involves aggregation:

Compute average yield per (year, state, crop)

This will reduce duplicate entries and generate meaningful insights.