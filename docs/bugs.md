# Bug Tracking — DSA and Software Engineering V.0.1

This file tracks all identified bugs, edge cases, and their corresponding resolutions.

| Bug ID | Date Reported | Description | Severity | Status | Solution / Fix |
|---|---|---|---|---|---|
| BUG-001 | 2026-10-06 | Unicode characters (`→`, `☑`, `☐`) in initial Python Excel extraction script caused `charmap` encode error on Windows cp1252 terminal. | Medium | Resolved | Reconfigured Python stdout to `utf-8` via `sys.stdout.reconfigure(encoding='utf-8')` and parsed cell hyperlinks directly through openpyxl target extraction. |
| BUG-002 | 2026-10-06 | Review days (Day 7, 14, 21, etc.) and Mock day (Day 90) have null problem numbers (`num: null`) which could corrupt numerical sorting and total problem counter. | Medium | Resolved | Structured problem key generator to handle non-numbered items (`day_${day}_${problem}`) and restricted primary problem counter to items with valid `num` values, preventing inflation of the 150 problem target. |
