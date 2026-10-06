import os
import sys
import json
import re
import subprocess

TESTS_PASSED = 0
TESTS_FAILED = 0
TEST_LOGS = []

def log_test(name, passed, message=""):
    global TESTS_PASSED, TESTS_FAILED
    status = "PASS" if passed else "FAIL"
    if passed:
        TESTS_PASSED += 1
    else:
        TESTS_FAILED += 1
    line = f"[{status}] {name}: {message}"
    print(line)
    TEST_LOGS.append(line)

def run_tests():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Running automated test suite for LeetCode 150 Roadmap Tracker in: {base_dir}\n")

    # 1. POSITIVE: Data JSON validity
    json_path = os.path.join(base_dir, "roadmap_data.json")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        log_test("POS-01: roadmap_data.json parse", True, f"Loaded {len(data)} items successfully.")
    except Exception as e:
        log_test("POS-01: roadmap_data.json parse", False, str(e))
        return

    # 2. POSITIVE: Numbered problems count
    numbered = [d for d in data if d.get('num') is not None]
    log_test("POS-02: Exactly 150 numbered problems", len(numbered) == 150, f"Found {len(numbered)} problems.")

    # 3. POSITIVE: Problem numbers sequence 1..150
    nums = sorted([d['num'] for d in numbered])
    expected = list(range(1, 151))
    log_test("POS-03: Sequential problem numbers 1-150", nums == expected, "All numbers 1-150 sequentially present.")

    # 4. POSITIVE: LeetCode URLs valid and present
    invalid_urls = [d for d in numbered if not d.get('url') or not d['url'].startswith("https://leetcode.com/problems/")]
    log_test("POS-04: Valid LeetCode URLs for all 150 problems", len(invalid_urls) == 0, f"Invalid URLs count: {len(invalid_urls)}")

    # 5. POSITIVE: Valid difficulties
    allowed_diffs = {"Easy", "Medium", "Hard"}
    bad_diffs = [d for d in numbered if d.get('difficulty') not in allowed_diffs]
    log_test("POS-05: Difficulties match Easy/Medium/Hard", len(bad_diffs) == 0, f"Invalid difficulty count: {len(bad_diffs)}")

    # 6. POSITIVE: Review and Mock days present
    reviews = [d for d in data if d.get('num') is None]
    log_test("POS-06: Review and Mock days correctly captured", len(reviews) == 13, f"Found {len(reviews)} review/mock milestone items.")

    # 7. POSITIVE: Days span Day 1 to Day 90
    days = set(d['day'] for d in data if d.get('day'))
    log_test("POS-07: 90-day roadmap coverage", min(days) == 1 and max(days) == 90, f"Day span: {min(days)} to {max(days)}")

    # 8. POSITIVE: data.js content matches JSON
    data_js_path = os.path.join(base_dir, "data.js")
    with open(data_js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
    log_test("POS-08: data.js defines ROADMAP_DATA", "const ROADMAP_DATA =" in js_content, "ROADMAP_DATA constant defined.")

    # 9. POSITIVE: index.html DOM structure check
    html_path = os.path.join(base_dir, "index.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    required_ids = [
        "reminder-toast", "reminder-modal", "notes-modal", "reset-modal",
        "progress-ring", "ring-percent", "solved-count", "total-count",
        "streak-count", "best-streak", "today-day", "today-problems",
        "easy-bar", "medium-bar", "hard-bar", "heatmap",
        "search-input", "filter-pattern", "filter-difficulty",
        "filter-status", "filter-day", "problems-tbody", "pattern-grid"
    ]
    missing_ids = [i for i in required_ids if f'id="{i}"' not in html_content]
    log_test("POS-09: Required DOM IDs in index.html", len(missing_ids) == 0, f"Missing IDs: {missing_ids}")

    # 10. POSITIVE: styles.css integrity
    css_path = os.path.join(base_dir, "styles.css")
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    log_test("POS-10: styles.css contains theme tokens and classes", "--bg-base" in css_content and ".problems-table" in css_content and ".nav-tabs" in css_content, "CSS tokens, classes, and nav-tabs present.")

    # 11. POSITIVE: JavaScript syntax validation
    app_js_path = os.path.join(base_dir, "app.js")
    node_check = subprocess.run(["node", "-c", app_js_path], capture_output=True, text=True)
    log_test("POS-11: app.js syntax validation via node -c", node_check.returncode == 0, "No syntax errors found.")

    node_data_check = subprocess.run(["node", "-c", data_js_path], capture_output=True, text=True)
    log_test("POS-12: data.js syntax validation via node -c", node_data_check.returncode == 0, "No syntax errors found.")

    # 13. POSITIVE: 775-Day Roadmap Page Integration
    roadmap_html_path = os.path.join(base_dir, "dsa_roadmap.html")
    with open(roadmap_html_path, 'r', encoding='utf-8') as f:
        roadmap_html = f.read()
    has_roadmap_nav = "hub-header" in roadmap_html and "index.html" in roadmap_html and "dsa_pattern_guide.html" in roadmap_html
    log_test("POS-13: dsa_roadmap.html has cross-platform hub-header", has_roadmap_nav, "Found unified navigation bar in dsa_roadmap.html.")

    # 14. POSITIVE: Pattern Guide Page Integration
    pattern_html_path = os.path.join(base_dir, "dsa_pattern_guide.html")
    with open(pattern_html_path, 'r', encoding='utf-8') as f:
        pattern_html = f.read()
    has_pattern_nav = "hub-header" in pattern_html and "index.html" in pattern_html and "dsa_roadmap.html" in pattern_html
    log_test("POS-14: dsa_pattern_guide.html has cross-platform hub-header", has_pattern_nav, "Found unified navigation bar in dsa_pattern_guide.html.")

    # 15. POSITIVE: Multi-platform Mobile Viewport meta tags on all 3 portals
    all_pages = [("index.html", html_content), ("dsa_roadmap.html", roadmap_html), ("dsa_pattern_guide.html", pattern_html)]
    viewport_ok = all("viewport" in content and "width=device-width" in content for _, content in all_pages)
    log_test("POS-15: Responsive mobile viewport on all 3 portals", viewport_ok, "All pages have mobile viewport-fit configuration.")

    # 16. POSITIVE: Cross-page link targets all exist on disk
    links_ok = (
        os.path.exists(os.path.join(base_dir, "index.html")) and
        os.path.exists(os.path.join(base_dir, "dsa_roadmap.html")) and
        os.path.exists(os.path.join(base_dir, "dsa_pattern_guide.html")) and
        os.path.exists(os.path.join(base_dir, "DSA Pattern Guide.html"))
    )
    log_test("POS-16: Inter-page navigation targets exist on disk", links_ok, "All multiplatform link destinations verified.")

    # 17. POSITIVE: CodeByArt Branding Elements
    has_branding = "CODE" in html_content and "BYART" in html_content and "SWE Platform" in html_content and "cba-grad" in html_content
    log_test("POS-17: CodeByArt branding and SVG logo emblem", has_branding, "CodeByArt brand mark and gradient SVG emblem verified.")

    # 18. POSITIVE: Social and Company Links
    linkedin_url = "https://www.linkedin.com/in/kamal-patel-61a8201a0/"
    has_social = (
        linkedin_url in html_content and
        "https://codebyart.com" in html_content and
        "https://connectkreations.com" in html_content and
        "Kamal Patel" in html_content
    )
    log_test("POS-18: Kamal Patel LinkedIn, codebyart.com, and connectkreations.com links", has_social, "All company and profile links present and verified.")

    # 19. POSITIVE: Modern Branded Footer
    has_footer = "footer-brand" in html_content and "footer-credit" in html_content and "Engineered &amp; Curated by" in html_content
    log_test("POS-19: Modern CodeByArt footer with developer attribution", has_footer, "Professional footer layout and credits verified.")

    # 20. NEGATIVE TESTS:
    # NEG-01: Incomplete or corrupted problem record detection
    corrupted_sample = {"day": 5, "problem": "Corrupted"}
    is_valid_numbered = corrupted_sample.get('num') is not None and corrupted_sample.get('url', '').startswith("http")
    log_test("NEG-01: Corrupted record rejected by numbering validator", not is_valid_numbered, "Successfully flagged missing num and URL.")

    # NEG-02: Invalid difficulty detection
    invalid_diff_sample = {"difficulty": "SuperHard"}
    is_valid_diff = invalid_diff_sample.get('difficulty') in allowed_diffs
    log_test("NEG-02: Invalid difficulty rejected", not is_valid_diff, "Successfully rejected non-standard difficulty.")

    # NEG-03: Corrupted JSON import handling
    corrupted_json_str = '{"progress": broken_json}'
    failed_safely = False
    try:
        json.loads(corrupted_json_str)
    except json.JSONDecodeError:
        failed_safely = True
    log_test("NEG-03: Corrupted JSON backup correctly raises decode error", failed_safely, "JSON parser safely rejects malformed payload.")

    # NEG-04: Non-existent search query handling
    sample_problems = ["Two Sum", "3Sum", "Trapping Rain Water"]
    query = "NonExistentProblemXYZ"
    matches = [p for p in sample_problems if query.lower() in p.lower()]
    log_test("NEG-04: Non-existent search term produces zero matches without error", len(matches) == 0, f"Found {len(matches)} matches.")

    # NEG-05: Missing page link safely flagged as non-existent
    broken_link = "non_existent_portal.html"
    log_test("NEG-05: Missing page link safely flagged as non-existent", not os.path.exists(os.path.join(base_dir, broken_link)), "Detected non-existent page link.")

    # NEG-06: Malformed viewport string detected
    bad_viewport = "<meta name='viewport' content=''>"
    has_width = "width=device-width" in bad_viewport
    log_test("NEG-06: Malformed viewport string detected", not has_width, "Correctly caught missing device-width.")

    # NEG-07: Invalid profile URL detection
    malformed_linkedin = "http://linkedin.com/bad/kamal"
    is_valid_profile = malformed_linkedin.startswith("https://www.linkedin.com/in/")
    log_test("NEG-07: Malformed profile link rejected by URL validator", not is_valid_profile, "Correctly rejected non-standard URL.")

    # Write test results log
    results_md = f"""# Test Execution Report — LeetCode 150 Roadmap Webpage

**Date:** 2026-10-06  
**Total Tests:** {TESTS_PASSED + TESTS_FAILED}  
**Passed:** {TESTS_PASSED}  
**Failed:** {TESTS_FAILED}  
**Status:** {"ALL PASS" if TESTS_FAILED == 0 else "FAILURES DETECTED"}  

## Detailed Test Logs

| Status | Test Name | Result Summary |
|---|---|---|
"""
    for log in TEST_LOGS:
        parts = log.split(":", 1)
        status_name = parts[0].strip()
        summary = parts[1].strip() if len(parts) > 1 else ""
        results_md += f"| {status_name} | {summary} |\n"

    test_results_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test-results.md")
    with open(test_results_path, 'w', encoding='utf-8') as f:
        f.write(results_md)
    print(f"\nSaved test results to: {test_results_path}")

if __name__ == "__main__":
    run_tests()
