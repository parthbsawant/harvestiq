#!/usr/bin/env python3
import sys

current_year = None
temp_sum = 0.0
humidity_sum = 0.0
wind_sum = 0.0
pressure_sum = 0.0
count = 0

for line in sys.stdin:
    try:
        line = line.strip()
        if not line:
            continue

        year, values = line.split("\t", 1)
        temp, humidity, wind, pressure = map(float, values.split(","))

    except:
        continue

    if current_year == year:
        temp_sum += temp
        humidity_sum += humidity
        wind_sum += wind
        pressure_sum += pressure
        count += 1
    else:
        if current_year is not None and count > 0:
            print(f"{current_year}\t{temp_sum/count:.2f},{humidity_sum/count:.2f},{wind_sum/count:.2f},{pressure_sum/count:.2f}")

        current_year = year
        temp_sum = temp
        humidity_sum = humidity
        wind_sum = wind
        pressure_sum = pressure
        count = 1

# 🔥 IMPORTANT: final print (this was likely failing before)
if current_year is not None and count > 0:
    print(f"{current_year}\t{temp_sum/count:.2f},{humidity_sum/count:.2f},{wind_sum/count:.2f},{pressure_sum/count:.2f}")