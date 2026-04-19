#!/usr/bin/env python3
import sys

for line in sys.stdin:
    line = line.strip()

    if not line:
        continue

    parts = line.split("\t")

    # Ensure proper format
    if len(parts) != 2:
        continue

    key_part = parts[0]
    value_part = parts[1]

    # -----------------------------
    # CROP DATA
    # -----------------------------
    if "," in key_part:
        try:
            year, state, crop = key_part.split(",", 2)
            yield_val = value_part

            print(f"{year}\tCROP,{state},{crop},{yield_val}")
        except:
            continue

    # -----------------------------
    # CLIMATE DATA
    # -----------------------------
    else:
        try:
            year = key_part
            print(f"{year}\tCLIMATE,{value_part}")
        except:
            continue