STEP 2: Crop Yield Aggregation using Hadoop MapReduce

1. Introduction

This step builds upon the output generated in Step 1 and focuses on transforming raw yield values into meaningful aggregated insights.

In Step 1, crop yield was calculated for each individual record. However, due to the presence of district-level data in the original dataset, multiple entries exist for the same combination of year, state, and crop.

The objective of Step 2 is to eliminate this redundancy and compute the average yield for each unique combination of:

Year
State
Crop

This is achieved using Hadoop MapReduce, where the reducer plays a central role in aggregation.

2. What We Got from Step 1

From Step 1, the output dataset contained:

Format:
year,state,crop    yield
Example:
1997,Andhra Pradesh,Arhar/Tur    0.1214
1997,Andhra Pradesh,Arhar/Tur    0.1875
1997,Andhra Pradesh,Arhar/Tur    0.5246
Key Observations:
Multiple rows exist for the same (year, state, crop)
Each row represents yield from a different district
No aggregation was applied
Data is suitable for further processing
3. What We Are Doing in Step 2

In this step, we:

Group data based on:

(year, state, crop)
Combine all yield values belonging to the same key

Compute:

Average Yield = Sum of Yields / Number of Records
Goal:

Convert multiple district-level yield values into a single representative value per group

4. System Architecture Overview

Same architecture as Step 1, but with active reducer logic:

Local System (macOS)
HDFS (Input and Output storage)
Hadoop Streaming
Python Mapper and Reducer
5. Data Flow
Step 1 Output (/output/yield)
        │
        ▼
Mapper (Key-Value emission)
        │
        ▼
Shuffle & Sort (Grouping by key)
        │
        ▼
Reducer (Aggregation)
        │
        ▼
Final Output (/output/avg_yield)
6. Step-by-Step Implementation
Step 1: Input Data

Input is taken from:

/input/crop_cleaned.csv

Mapper recomputes yield (same logic as Step 1)

Step 2: Mapper Logic

The mapper performs:

Reads each row
Extracts:
year
state
crop
area
production

Computes:

yield = production / area
Emits:
key = year,state,crop
value = yield
Mapper Output:
1997,Andhra Pradesh,Arhar/Tur    0.1214
1997,Andhra Pradesh,Arhar/Tur    0.1875
7. Shuffle and Sort Phase

Handled automatically by Hadoop.

What happens internally:
All records with same key are grouped together
Data is sorted
Reducer receives grouped values
Example transformation:

Before:

(1997, AP, Arhar) → 0.12
(1997, AP, Arhar) → 0.18
(1997, AP, Arhar) → 0.52

After grouping:

(1997, AP, Arhar) → [0.12, 0.18, 0.52]
8. Reducer Logic

Reducer performs aggregation.

Steps:

Initialize:

total = 0
count = 0

For each value:

total += value
count += 1

Compute average:

average = total / count

Output:

key    average
9. Formula Used
Crop Yield (from Step 1):
Yield = Production / Area
Average Yield (Step 2):
Average Yield = (Σ Yield values) / Number of records
Example Calculation:

Input:

0.12, 0.18, 0.52
Sum = 0.82
Count = 3
Average = 0.82 / 3 = 0.2733
10. Job Execution

Command used:

hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
-input /input/crop_cleaned.csv \
-output /output/avg_yield \
-mapper "python3 mapper.py" \
-reducer "python3 reducer.py" \
-file mapper.py \
-file reducer.py
11. Output

Stored in:

/output/avg_yield/part-00000
Sample Output:
1997,Andhra Pradesh,Arhar/Tur    0.3148
1997,Andhra Pradesh,Bajra        1.0490
1997,Andhra Pradesh,Cotton(lint) 2.0373
12. Explanation of Output

Each row represents:

(year, state, crop) → average yield
Key Improvements from Step 1:
Step 1	Step 2
Multiple rows per key	Single row per key
Raw yield values	Aggregated yield
District-level	State-level
Redundant data	Clean data
13. What We Achieved in Step 2

This step successfully:

Removed duplicate key entries
Aggregated district-level data
Computed meaningful averages
Reduced dataset size
Prepared structured data for analysis
14. How to Read This Output

Each row can be interpreted as:

"In year X, in state Y, crop Z had an average yield of W"
Example:
1997,Andhra Pradesh,Groundnut    1.2228

Meaning:

Year: 1997
State: Andhra Pradesh
Crop: Groundnut
Average Yield: 1.2228 tonnes/hectare
15. How This Helps in Step 3

This output becomes critical input for the next stage.

Why this is important:
Data is now clean and aggregated
Each key has a single value
Easy to join with external datasets
In Step 3, we will:
Introduce climate dataset

Combine:

Crop Yield + Climate Conditions
Perform analysis such as:
Yield vs rainfall
Yield vs temperature
Build predictive or recommendation models
16. Key Concepts Learned
Data aggregation using Reduce phase
Grouping in MapReduce
Shuffle and sort mechanism
Key-value based processing
Distributed computation of averages
Handling large-scale data efficiently
17. Limitations
No climate or soil factors included yet
Only average is computed (no variance, trends)
Temporal patterns not analyzed
18. Conclusion

Step 2 converts raw yield data into a structured, aggregated format suitable for analytics.

This step plays a crucial role in transforming distributed raw data into meaningful insights and prepares the foundation for integrating multiple datasets in the next stage.