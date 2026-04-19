STEP 1 TO STEP 4: End-to-End Hadoop-Based Agricultural Data Pipeline
1. Introduction

This project implements a complete data processing pipeline for agricultural analytics using Hadoop MapReduce. The objective is to transform raw agricultural and environmental datasets into a structured, integrated dataset that can be used for analysis, visualization, and prediction.

The pipeline consists of four major stages:

Crop Yield Calculation
Crop Yield Aggregation
Climate Data Processing
Dataset Integration (Crop + Climate)

Each step progressively refines and enriches the data, moving from raw records to a feature-rich analytical dataset.

The implementation uses:

Hadoop Distributed File System (HDFS) for storage
Hadoop Streaming for distributed processing
Python-based Mapper and Reducer scripts
2. Datasets Used
2.1 Crop Production Dataset

Original Columns:

State_Name, District_Name, Crop_Year, Season, Crop, Area, Production

Cleaned Columns Used:

State_Name, Crop_Year, Crop, Area, Production

Column Description
State_Name: State where crop is grown
Crop_Year: Year of production
Crop: Crop type
Area: Area under cultivation (hectares)
Production: Production (tonnes)
Derived Metric

Yield = Production / Area

2.2 Climate Dataset

Processed to yearly averages.

Columns
Year
Temperature
Humidity
Wind Speed
Pressure
3. System Architecture Overview

The pipeline consists of:

Local System (macOS)
Hadoop Distributed File System (HDFS)
Hadoop MapReduce (Streaming Mode)
Python Mapper and Reducer
4. Overall Data Flow
Raw Crop Data + Climate Data
            │
            ▼
      Upload to HDFS (/input)
            │
            ▼
   Step 1: Yield Calculation
            │
            ▼
   Step 2: Yield Aggregation
            │
            ▼
   Step 3: Climate Processing
            │
            ▼
   Step 4: Dataset Integration
            │
            ▼
 Final Dataset (/output/final_dataset)
STEP 1: Crop Yield Calculation
Objective

Compute yield for each record using:

Yield = Production / Area

Key Operations
Read dataset
Skip header
Extract required columns
Compute yield
Emit key-value pairs
Output Format

year,state,crop yield

Output Location

/output/yield

Observations
Multiple entries exist for same key
Data is at district-level
No aggregation
STEP 2: Crop Yield Aggregation
Objective

Compute average yield per:

(year, state, crop)

What We Got from Step 1

Multiple yield values per key due to district-level data

What We Did

Grouped values and computed:

Average Yield = Σ(yield) / count

Mapper Output

year,state,crop yield

Reducer Logic
Sum values
Count records
Compute average
Output Format

year,state,crop avg_yield

Output Location

/output/avg_yield

Outcome
Removed duplicate entries
Reduced dataset size
Created clean aggregated dataset
STEP 3: Climate Data Processing
Objective

Convert raw climate data into yearly averages.

Operations
Group data by year
Compute averages for:
Temperature
Humidity
Wind Speed
Pressure
Output Format

year temp,humidity,wind,pressure

Output Location

/output/climate_yearly

Outcome
Converted raw climate data into structured yearly data
Prepared dataset for joining
STEP 4: Dataset Integration (Reduce-Side Join)
Objective

Combine crop yield data with climate data using:

Common Key = Year

Input Datasets
Crop Dataset (Step 2)

year,state,crop avg_yield

Climate Dataset (Step 3)

year temp,humidity,wind,pressure

Join Strategy

Reduce-Side Join

Data Flow
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
 Final Dataset (/output/final_dataset)
Mapper Logic
Identify dataset type
Tag records as:
CROP
CLIMATE
Emit using year as key
Mapper Output

year CROP,state,crop,yield
year CLIMATE,temp,humidity,wind,pressure

Reducer Logic
Separate crop and climate data
For each crop record:
Attach climate data
Final Output Format

year,state,crop yield,temp,humidity,wind,pressure

Example

2013,Andhra Pradesh,Rice 2.45,24.79,63.05,6.83,1007.64

Output Location

/output/final_dataset

Observations
Climate data repeated per year (expected)
Dataset size increased
Data enriched with environmental features
What We Achieved
Multi-dataset integration
Feature-rich dataset creation
Enabled analytical and predictive use cases
Key Concepts Learned
Hadoop Streaming
MapReduce Architecture
Aggregation using Reducer
Shuffle and Sort mechanism
Reduce-Side Join
Multi-source data integration
Limitations
Join based only on year
No location-specific climate mapping
No real-time data
Final Outcome

This pipeline successfully transforms:

Raw agricultural + climate data
→ Cleaned data
→ Aggregated insights
→ Integrated dataset

The final dataset is suitable for:

Data visualization
Backend APIs
Machine learning models
Decision support systems
Next Step

The next phase involves:

Storing data in MongoDB
Building backend APIs (Flask)
Connecting with frontend dashboard
Summary

This project demonstrates a complete Hadoop-based data engineering pipeline, covering:

Data transformation
Aggregation
Multi-source integration

It provides a strong foundation for building intelligent agricultural analytics systems.