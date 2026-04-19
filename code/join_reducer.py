#!/usr/bin/env python3
import sys

current_year = None
climate_data = None
crop_records = []

def emit():
    if current_year and climate_data:
        for state, crop, yield_val in crop_records:
            print(f"{current_year},{state},{crop}\t{yield_val},{climate_data}")

for line in sys.stdin:
    try:
        line = line.strip()
        if not line:
            continue

        year, value = line.split("\t", 1)
        parts = value.split(",")

        tag = parts[0]

    except:
        continue

    if current_year == year:
        if tag == "CLIMATE":
            climate_data = ",".join(parts[1:])
        elif tag == "CROP":
            crop_records.append((parts[1], parts[2], parts[3]))

    else:
        emit()

        current_year = year
        climate_data = None
        crop_records = []

        if tag == "CLIMATE":
            climate_data = ",".join(parts[1:])
        elif tag == "CROP":
            crop_records.append((parts[1], parts[2], parts[3]))

# Final emit
emit()