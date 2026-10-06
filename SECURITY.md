# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Reporting a Vulnerability

If you discover a security vulnerability within this repository, please send an email to **security@codebyart.com** or reach out via [codebyart.com/contact](https://codebyart.com). 

All security vulnerabilities will be promptly addressed. Please do not report security vulnerabilities through public GitHub issues.

---

## Data Hygiene & Confidentiality Safeguards

To prevent proprietary or confidential data leaks, this repository enforces strict `.gitignore` rules:
- **Raw Spreadsheets & Proprietary Data**: Binary sheets (`*.xlsx`, `*.xls`, `*.csv`) such as local roadmap trackers are untracked and excluded from public version control.
- **Local Testing Environments**: All local test runners, DOM verification scripts, and logs (`testing/`) are excluded from Git commits.
- **Environment & Secret Files**: All `.env*` files and local caches (`.cache/`, `node_modules/`) are strictly ignored.

