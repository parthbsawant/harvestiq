#!/usr/bin/env python3
import sys

for line in sys.stdin:
    line = line.strip()
    parts = line.split(",")

    # Skip header
    if parts[0] == "State_Name":
        continue

    try:
        state = parts[0]
        year = parts[1]
        crop = parts[2]
        area = float(parts[3])
        production = float(parts[4])

        if area == 0:
            continue

        yield_value = production / area

        print(f"{year},{state},{crop}\t{yield_value}")

    except:
        continue