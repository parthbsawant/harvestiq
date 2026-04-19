#!/usr/bin/env python3
import sys

current_key = None
total = 0.0
count = 0

for line in sys.stdin:
    try:
        line = line.strip()

        if not line:
            continue

        # Split only once
        key, value = line.split("\t", 1)

        value = float(value)

    except Exception:
        continue   # skip ANY bad line safely

    if current_key == key:
        total += value
        count += 1
    else:
        if current_key is not None:
            avg = total / count
            print(f"{current_key}\t{avg:.4f}")

        current_key = key
        total = value
        count = 1

# Last key
if current_key is not None:
    avg = total / count
    print(f"{current_key}\t{avg:.4f}")