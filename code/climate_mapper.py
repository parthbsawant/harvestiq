#!/usr/bin/env python3
import sys

for line in sys.stdin:
    line = line.strip()

    if not line or line.startswith("date"):
        continue

    parts = line.split(",")

    if len(parts) < 5:
        continue

    try:
        year = parts[0].split("-")[0]

        # Clean values (handle missing)
        temp = float(parts[1]) if parts[1] else 0
        humidity = float(parts[2]) if parts[2] else 0
        wind = float(parts[3]) if parts[3] else 0
        pressure = float(parts[4]) if parts[4] else 0

        print(f"{year}\t{temp},{humidity},{wind},{pressure}")

    except:
        continue