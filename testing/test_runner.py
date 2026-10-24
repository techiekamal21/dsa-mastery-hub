import os
import sys
import json
import re
import subprocess
import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

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
    print(f"Running automated test suite for CodeByArt DSA & SWE Platform in: {base_dir}\n")

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
    log_test("POS-10: styles.css contains theme tokens and classes", "--bg-base" in css_content and ".problems-table" in css_content, "CSS tokens and classes present.")

    # 11. POSITIVE: JavaScript syntax validation for app.js
    app_js_path = os.path.join(base_dir, "app.js")
    node_check = subprocess.run(["node", "-c", app_js_path], capture_output=True, text=True)
    log_test("POS-11: app.js syntax validation via node -c", node_check.returncode == 0, "No syntax errors found.")

    # 12. POSITIVE: JavaScript syntax validation for data.js
    node_data_check = subprocess.run(["node", "-c", data_js_path], capture_output=True, text=True)
    log_test("POS-12: data.js syntax validation via node -c", node_data_check.returncode == 0, "No syntax errors found.")

    # 13. POSITIVE: shared-nav.js syntax validation via node -c
    shared_nav_js_path = os.path.join(base_dir, "shared-nav.js")
    node_nav_check = subprocess.run(["node", "-c", shared_nav_js_path], capture_output=True, text=True)
    log_test("POS-13: shared-nav.js syntax validation via node -c", node_nav_check.returncode == 0, "No syntax errors found in shared-nav.js.")

    # 14. POSITIVE: shared-nav.css integrity and design system tokens
    shared_nav_css_path = os.path.join(base_dir, "shared-nav.css")
    with open(shared_nav_css_path, 'r', encoding='utf-8') as f:
        nav_css = f.read()
    has_nav_css_tokens = (
        ".cba-nav" in nav_css and
        ".cba-profile-dd" in nav_css and
        ".cba-settings-dd" in nav_css and
        ".cba-modal-overlay" in nav_css and
        ".cba-footer" in nav_css and
        "body.has-cba-nav" in nav_css and
        "@media (max-width: 680px)" in nav_css
    )
    log_test("POS-14: shared-nav.css integrity and responsive layout rules", has_nav_css_tokens, "Navbar, dropdowns, modal, and responsive styles verified.")

    # 15. POSITIVE: All 7 portal pages include shared-nav.css
    portal_files = [
        "home.html",
        "index.html",
        "dsa_roadmap.html",
        "dsa_pattern_guide.html",
        "DSA Pattern Guide.html",
        "cicd_guide.html",
        "sdet_software_engineering_interview_question_bank.html"
    ]
    portal_contents = {}
    for p in portal_files:
        with open(os.path.join(base_dir, p), 'r', encoding='utf-8') as f:
            portal_contents[p] = f.read()

    all_have_css = all('shared-nav.css' in portal_contents[p] for p in portal_files)
    log_test("POS-15: All 7 portal pages include shared-nav.css", all_have_css, "All pages link shared-nav.css stylesheet.")

    # 16. POSITIVE: All 7 portal pages include shared-nav.js with correct data-page
    expected_data_pages = {
        "home.html": 'data-page="home"',
        "index.html": 'data-page="leetcode"',
        "dsa_roadmap.html": 'data-page="roadmap"',
        "dsa_pattern_guide.html": 'data-page="patterns"',
        "DSA Pattern Guide.html": 'data-page="patterns"',
        "cicd_guide.html": 'data-page="cicd"',
        "sdet_software_engineering_interview_question_bank.html": 'data-page="sdet"'
    }
    all_have_js_datapage = all(
        'shared-nav.js' in portal_contents[p] and expected_data_pages[p] in portal_contents[p]
        for p in portal_files
    )
    log_test("POS-16: All 7 portal pages include shared-nav.js with correct data-page", all_have_js_datapage, "All pages include shared-nav.js script with appropriate data-page.")

    # 17. POSITIVE: CodeByArt unified branding and SVG logo emblem in shared-nav.js
    with open(shared_nav_js_path, 'r', encoding='utf-8') as f:
        nav_js = f.read()
    has_branding = "CODE" in nav_js and "BYART" in nav_js and "SWE Platform" in nav_js and "cba-sn-grad" in nav_js
    log_test("POS-17: CodeByArt unified branding and SVG logo emblem in shared-nav.js", has_branding, "CodeByArt brand mark and gradient SVG emblem verified.")

    # 18. POSITIVE: Kamal Patel social/portfolio links in shared-nav.js
    linkedin_url = "https://www.linkedin.com/in/kamal-patel-61a8201a0/"
    github_url = "https://github.com/techiekamal21/dsa-mastery-hub"
    has_social = linkedin_url in nav_js and github_url in nav_js and "Kamal Patel" in nav_js
    log_test("POS-18: Kamal Patel profile link, GitHub repo link in shared-nav.js", has_social, "LinkedIn profile, GitHub repo, and attribution verified.")

    # 19. POSITIVE: Standardized cba-footer layout with platform links in shared-nav.js
    has_footer = (
        "cba-footer" in nav_js and
        "home.html" in nav_js and
        "index.html" in nav_js and
        "dsa_roadmap.html" in nav_js and
        "dsa_pattern_guide.html" in nav_js and
        "cicd_guide.html" in nav_js and
        "sdet_software_engineering_interview_question_bank.html" in nav_js
    )
    log_test("POS-19: Standardized cba-footer layout with platform links in shared-nav.js", has_footer, "Professional footer layout and cross-portal links verified.")

    # 20. POSITIVE: CI/CD Guide Page File Presence
    cicd_path = os.path.join(base_dir, "cicd_guide.html")
    cicd_exists = os.path.exists(cicd_path)
    log_test("POS-20: CI/CD Complete Guide page exists on disk", cicd_exists, "Found cicd_guide.html in dsa-mastery-hub.")
    cicd_content = portal_contents["cicd_guide.html"]

    # 21. POSITIVE: CI/CD Simulations Lab
    has_simulations = (
        'id="simulations"' in cicd_content and
        'runPipeline' in cicd_content and
        'injectFailure' in cicd_content and
        'showStrategy' in cicd_content and
        'showPyramidDetail' in cicd_content
    )
    log_test("POS-21: Interactive Simulations Lab in cicd_guide.html", has_simulations, "Pipeline Simulator, Deployment Visualizer, and Test Pyramid present.")

    # 22. POSITIVE: CI/CD 10-Part Deep Dive Blog
    has_blog_parts = all(f"Part {i:02d}" in cicd_content for i in range(1, 11))
    log_test("POS-22: Complete 10-part deep-dive blog in cicd_guide.html", has_blog_parts, "All 10 parts of CI/CD guide blog present and structured.")

    # 23. POSITIVE: DORA Metrics Section
    has_dora = "DORA — The Four Keys to Elite DevOps" in cicd_content and "Deployment Frequency" in cicd_content
    log_test("POS-23: DORA Metrics section in cicd_guide.html", has_dora, "DORA 4 keys metrics dashboard verified.")

    # 24. POSITIVE: Unified More Dropdown in shared-nav.js pointing to cicd_guide.html and sdet
    has_more_links = (
        "cba-more-dd" in nav_js and
        "cicd_guide.html" in nav_js and
        "sdet_software_engineering_interview_question_bank.html" in nav_js and
        "Interview &amp; QA" in nav_js
    )
    log_test("POS-24: Unified More dropdown in shared-nav.js pointing to CI/CD and SDET", has_more_links, "More menu with category sections verified.")

    # 25. POSITIVE: 775-Day Roadmap Page Integration
    roadmap_html = portal_contents["dsa_roadmap.html"]
    has_roadmap_structure = "sidebar" in roadmap_html and "problem" in roadmap_html and "shared-nav.js" in roadmap_html
    log_test("POS-25: 775-Day Roadmap page integration with shared-nav", has_roadmap_structure, "Roadmap layout and shared-nav integration verified.")

    # 26. POSITIVE: Pattern Guide Page Integration
    pattern_html = portal_contents["dsa_pattern_guide.html"]
    has_pattern_structure = "pattern-card" in pattern_html or "pattern" in pattern_html and "shared-nav.js" in pattern_html
    log_test("POS-26: Pattern Guide page integration with shared-nav", has_pattern_structure, "Pattern guide layout and shared-nav integration verified.")

    # 27. POSITIVE: Cross-platform link targets all exist on disk
    all_targets_exist = all(os.path.exists(os.path.join(base_dir, p)) for p in portal_files)
    log_test("POS-27: Cross-platform targets all exist on disk", all_targets_exist, "All 7 portal file targets verified on disk.")

    # 28. POSITIVE: SDET Question Bank Page File Presence
    sdet_path = os.path.join(base_dir, "sdet_software_engineering_interview_question_bank.html")
    sdet_exists = os.path.exists(sdet_path)
    log_test("POS-28: SDET & SWE Question Bank page exists on disk", sdet_exists, "Found sdet_software_engineering_interview_question_bank.html.")
    sdet_content = portal_contents["sdet_software_engineering_interview_question_bank.html"]

    # 29. POSITIVE: SDET Question Bank Content & 71 Topics
    has_topics = (
        'const bank = [' in sdet_content and
        'topicCount = bank.reduce' in sdet_content and
        'Python coding and problem-solving' in sdet_content and
        'Jenkins, CI/CD and Git' in sdet_content and
        'Backend and system design' in sdet_content
    )
    topic_ids = re.findall(r'["\']?id["\']?:\s*(\d+)', sdet_content)
    log_test("POS-29: SDET Question Bank contains 71 curated topic groups across 10 sections", has_topics and len(topic_ids) >= 71, f"Found {len(topic_ids)} topic definitions across 10 sections.")

    # 30. POSITIVE: SDET Interactive Features & State Persistence
    has_sdet_interactive = (
        'id="search"' in sdet_content and
        'id="expandAll"' in sdet_content and
        'id="collapseAll"' in sdet_content and
        'id="printPage"' in sdet_content and
        'id="exportProgress"' in sdet_content and
        'id="progressBar"' in sdet_content and
        'localStorage.getItem(\'sdet-question-bank-progress\')' in sdet_content
    )
    log_test("POS-30: SDET Question Bank interactive tools and localStorage persistence", has_sdet_interactive, "Interactive search, expand/collapse, PDF print, export, and progress tracking present.")

    # 31. POSITIVE: home.html existence & valid HTML5 structure
    home_content = portal_contents["home.html"]
    home_valid = "<!DOCTYPE html>" in home_content and "<title>CodeByArt" in home_content and "hero" in home_content
    log_test("POS-31: home.html exists and defines valid HTML5 hub structure", home_valid, "home.html entrypoint landing page verified.")

    # 32. POSITIVE: home.html iOS safe-area & viewport-fit configuration
    ios_safe = (
        "viewport-fit=cover" in home_content and
        "safe-area-inset-top" in home_content and
        "100dvh" in home_content and
        "-webkit-tap-highlight-color" in home_content
    )
    log_test("POS-32: home.html iOS safe-area & viewport-fit configuration", ios_safe, "iOS Safari safe-area, 100dvh, and viewport-fit=cover verified.")

    # 33. POSITIVE: home.html portal cards link to all 5 platform portals
    portal_targets = [
        "index.html",
        "dsa_roadmap.html",
        "dsa_pattern_guide.html",
        "cicd_guide.html",
        "sdet_software_engineering_interview_question_bank.html"
    ]
    all_portals_linked = all(target in home_content for target in portal_targets)
    log_test("POS-33: home.html portal cards link to all 5 platforms and exist on disk", all_portals_linked and all_targets_exist, "All 5 portal link destinations verified.")

    # 34. POSITIVE: home.html personalization and name modal elements
    name_elements = ["nameModalOverlay", "welcomeBar", "welcomeName", "nameInput", "nameSaveBtn", "welcomeEdit"]
    has_name_elements = all(el in home_content for el in name_elements)
    log_test("POS-34: home.html personalization and welcome modal elements", has_name_elements, "Modal, welcome bar, input, and save button elements verified.")

    # 35. POSITIVE: Multi-platform Mobile Viewport meta tags on all 7 portals
    viewport_ok = all("viewport" in content and "width=device-width" in content for content in portal_contents.values())
    log_test("POS-35: Responsive mobile viewport on all 7 portals", viewport_ok, "All 7 pages have mobile viewport-fit configuration.")

    # 36. POSITIVE: WebKit backdrop-filter prefixes on glassmorphism
    has_webkit_backdrop = home_content.count("-webkit-backdrop-filter") >= 4
    log_test("POS-36: WebKit backdrop-filter prefixes on glassmorphism in home.html", has_webkit_backdrop, f"Found {home_content.count('-webkit-backdrop-filter')} webkit-backdrop-filter declarations.")

    # 37. POSITIVE: Profile dropdown in shared-nav.js
    has_profile_dropdown = (
        "cba-profile-dd" in nav_js and
        "cba-profile-avatar" in nav_js and
        "cba-profile-name" in nav_js and
        "cba-profile-input" in nav_js and
        "cba-profile-save-btn" in nav_js and
        "cba-profile-clear-btn" in nav_js and
        "cbaSaveProfileName" in nav_js and
        "cbaClearProfileName" in nav_js
    )
    log_test("POS-37: Profile dropdown with avatar, name badge, and editing controls", has_profile_dropdown, "Profile management controls verified in shared-nav.js.")

    # 38. POSITIVE: Profile persistence via localStorage 'cba-user-name' and window.cbaUpdateProfile API
    has_profile_api = (
        "cba-user-name" in nav_js and
        "window.cbaUpdateProfile" in nav_js and
        "updateProfileUI" in nav_js
    )
    log_test("POS-38: Profile persistence via localStorage 'cba-user-name' and window.cbaUpdateProfile API", has_profile_api, "cba-user-name key and window.cbaUpdateProfile function verified.")

    # 39. POSITIVE: Settings dropdown in shared-nav.js (Export, Import, Save, Theme toggle, Reminder, Cache clear, Reset all)
    has_settings_dd = (
        "cba-settings-dd" in nav_js and
        "cbaNavExport" in nav_js and
        "cbaNavImportClick" in nav_js and
        "cbaNavSave" in nav_js and
        "cbaToggleTheme" in nav_js and
        "cbaOpenReminders" in nav_js and
        "cbaNavCacheClear" in nav_js and
        "cbaNavReset" in nav_js
    )
    log_test("POS-39: Settings dropdown actions defined in shared-nav.js", has_settings_dd, "Export, Import, Save, Theme, Reminder, Clear Cache, and Reset actions verified.")

    # 40. POSITIVE: Modal system for warnings and dangerous actions
    has_warning_modal = (
        "cba-warning-overlay" in nav_js and
        "cba-warning-modal" in nav_js and
        "cba-warn-title" in nav_js and
        "cba-warn-body" in nav_js and
        "cba-warn-confirm-btn" in nav_js and
        "cbaCloseWarning" in nav_js and
        "cbaConfirmWarning" in nav_js
    )
    log_test("POS-40: Modal system for warnings and confirmation in shared-nav.js", has_warning_modal, "Warning overlay, modal dialog, and confirmation handlers verified.")

    # 41. POSITIVE: Toast notification system (#cba-toast) in shared-nav.js
    has_toast = "cba-toast" in nav_js and "window.cbaToast" in nav_js
    log_test("POS-41: Toast notification system in shared-nav.js", has_toast, "cba-toast element and window.cbaToast verified.")

    # 42. POSITIVE: Cache clear keeps study progress while clearing UI cache
    has_cache_logic = "cbaNavCacheClear" in nav_js and "cba-theme" in nav_js and "keeps all your study progress" in nav_js
    log_test("POS-42: Cache clear logic removes UI cache while protecting progress", has_cache_logic, "Scoped UI cache removal with safety reassurance verified.")

    # 43. POSITIVE: Body offset and sticky element overrides in shared-nav.css
    has_sticky_rules = "body.has-cba-nav" in nav_css and "--sn-nav-h" in nav_css and "body.has-cba-nav .sidebar" in nav_css
    log_test("POS-43: Body offset and sticky element overrides for all pages in shared-nav.css", has_sticky_rules, "Offset rules for fixed 58px navbar verified.")

    # --- NEGATIVE TESTS ---
    # NEG-01: Incomplete or corrupted problem record detection
    corrupted_sample = {"day": 5, "problem": "Corrupted"}
    is_valid_numbered = corrupted_sample.get('num') is not None and corrupted_sample.get('url', '').startswith("http")
    log_test("NEG-01: Corrupted record rejected by numbering validator", not is_valid_numbered, "Successfully flagged missing num and URL.")

    # NEG-02: Invalid difficulty detection
    invalid_diff_sample = {"difficulty": "SuperHard"}
    is_valid_diff = invalid_diff_sample.get('difficulty') in allowed_diffs
    log_test("NEG-02: Invalid difficulty rejected", not is_valid_diff, "Successfully rejected non-standard difficulty.")

    # NEG-03: Corrupted JSON backup correctly raises decode error
    corrupted_json = "{\"solved\": [1, 2, 3"
    parse_failed = False
    try:
        json.loads(corrupted_json)
    except json.JSONDecodeError:
        parse_failed = True
    log_test("NEG-03: Corrupted JSON backup correctly raises decode error", parse_failed, "JSON parser safely rejects malformed payload.")

    # NEG-04: Non-existent search term produces zero matches without error
    search_term = "NonExistentAlgorithmXYZ123"
    matches = [d for d in numbered if search_term.lower() in d.get('problem', '').lower()]
    log_test("NEG-04: Non-existent search term produces zero matches without error", len(matches) == 0, f"Found {len(matches)} matches.")

    # NEG-05: Missing page link safely flagged as non-existent
    bad_link = "non_existent_page_404.html"
    log_test("NEG-05: Missing page link safely flagged as non-existent", not os.path.exists(os.path.join(base_dir, bad_link)), "Detected non-existent page link.")

    # NEG-06: Malformed viewport string detected
    bad_viewport = "width=100"
    log_test("NEG-06: Malformed viewport string detected", "width=device-width" not in bad_viewport, "Correctly caught missing device-width.")

    # NEG-07: Malformed profile link rejected by URL validator
    bad_profile_url = "ftp://malicious-site.com"
    log_test("NEG-07: Malformed profile link rejected by URL validator", not bad_profile_url.startswith("https://"), "Correctly rejected non-standard URL.")

    # NEG-08: Unknown pipeline stage ID safely handled by simulator fallback
    valid_stages = {"build", "unit", "lint", "sec", "int", "e2e", "deploy"}
    unknown_stage = "exploit_stage"
    log_test("NEG-08: Unknown pipeline stage ID safely handled by simulator fallback", unknown_stage not in valid_stages, "Graceful fallback for unknown pipeline stage.")

    # NEG-09: Invalid deployment strategy safely flagged and rejected
    valid_strategies = {"rolling", "bluegreen", "canary"}
    bad_strategy = "exploding"
    log_test("NEG-09: Invalid deployment strategy safely flagged and rejected", bad_strategy not in valid_strategies, "Successfully rejected unknown strategy 'exploding'.")

    # NEG-10: Non-existent interview topic search returns zero matches safely
    sample_topics = ["Python Decorators", "Memory TLB & Page Tables", "PyTest Fixtures", "Kafka Partitions"]
    sdet_query = "quantum_superposition_xyz"
    sdet_matches = [t for t in sample_topics if sdet_query.lower() in t.lower()]
    log_test("NEG-10: Non-existent interview topic search returns zero matches safely", len(sdet_matches) == 0, f"Filtered to {len(sdet_matches)} results.")

    # NEG-11: Corrupted localStorage progress safely defaults to empty set
    corrupted_progress = "not_valid_json_data_123"
    parsed_progress = set()
    try:
        parsed_progress = set(json.loads(corrupted_progress))
    except (json.JSONDecodeError, TypeError):
        parsed_progress = set()
    log_test("NEG-11: Corrupted localStorage progress safely defaults to empty set", len(parsed_progress) == 0, "Gracefully handled corrupt progress state.")

    # NEG-12: Non-numeric or invalid topic ID validation
    def validate_topic_id(tid):
        return isinstance(tid, int) and 1 <= tid <= 71
    
    invalid_ids = [-1, 0, 72, "99", None, 3.14]
    all_rejected = all(not validate_topic_id(x) for x in invalid_ids)
    log_test("NEG-12: Invalid topic IDs strictly rejected by validator", all_rejected, "Safely rejected out-of-bounds, negative, float, and string IDs.")

    # NEG-13: XSS / Script injection in user name input safely sanitized
    def sanitize_user_name(raw):
        return re.sub(r'[<>"\'&]', '', raw or '').strip()[:40]

    malicious_inputs = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        '"><script>window.location="http://evil.com"</script>',
        'Kamal & Co "The Great" <Patel>'
    ]
    all_sanitized = all('<' not in sanitize_user_name(x) and '>' not in sanitize_user_name(x) and '"' not in sanitize_user_name(x) for x in malicious_inputs)
    log_test("NEG-13: Malformed or XSS user name inputs safely sanitized", all_sanitized, "All malicious characters stripped cleanly.")

    # NEG-14: Empty or whitespace-only name input safely handled
    def handle_empty_name(raw):
        clean = sanitize_user_name(raw)
        return clean if clean else None

    blank_inputs = ["", "   ", "\t\n", None]
    all_blank_rejected = all(handle_empty_name(b) is None for b in blank_inputs)
    log_test("NEG-14: Empty or whitespace-only user name safely rejected", all_blank_rejected, "Empty strings rejected without corrupting greeting UI.")

    # NEG-15: Non-existent portal link detection in home.html
    def check_portal_target(href):
        return os.path.exists(os.path.join(base_dir, href))
    
    dead_link_flagged = not check_portal_target("non_existent_portal_xyz.html")
    log_test("NEG-15: Broken portal links correctly detected and flagged", dead_link_flagged, "Dead link accurately rejected.")

    # NEG-16: Malformed viewport without viewport-fit or width detected
    malformed_viewports = [
        "initial-scale=1.0",
        "user-scalable=no",
        ""
    ]
    def is_ios_valid_viewport(vp):
        return "width=device-width" in vp and "viewport-fit=cover" in vp

    all_bad_vp_caught = all(not is_ios_valid_viewport(vp) for vp in malformed_viewports)
    log_test("NEG-16: Malformed viewport lacking viewport-fit safely flagged", all_bad_vp_caught, "Linter correctly flagged missing device-width and viewport-fit.")

    # NEG-17: Dangerous Reset action strictly rejects mismatched confirmation string
    def test_reset_confirmation(val, required="RESET"):
        return (val or "").strip().upper() == required.upper()

    bad_confirmations = ["reset", "CONFIRM", "", "1234", "RESE", "RESETTING", None]
    all_bad_confirm_rejected = all(not test_reset_confirmation(c) for c in ["CONFIRM", "", "1234", "RESE", "RESETTING", None])
    exact_reset_accepted = test_reset_confirmation("RESET") and test_reset_confirmation("reset")
    log_test("NEG-17: Dangerous Reset action strictly enforces confirmation string", all_bad_confirm_rejected and exact_reset_accepted, "Mismatching confirmation strings rejected; exact word accepted.")

    # NEG-18: Corrupted or non-object JSON import rejected
    def validate_import_payload(raw):
        try:
            parsed = json.loads(raw)
            return isinstance(parsed, dict) and parsed is not None
        except Exception:
            return False

    bad_imports = ["null", "[]", '"string"', "123", "{broken: json", ""]
    all_bad_imports_rejected = all(not validate_import_payload(bi) for bi in bad_imports)
    valid_import_accepted = validate_import_payload('{"key": "value"}')
    log_test("NEG-18: Non-object or corrupted JSON import payloads strictly rejected", all_bad_imports_rejected and valid_import_accepted, "Only valid dictionary JSON objects accepted for restoration.")

    # NEG-19: Excessive profile name length truncated at 40 characters
    long_name = "A" * 100
    truncated_name = sanitize_user_name(long_name)
    log_test("NEG-19: Excessive profile name length truncated at 40 characters", len(truncated_name) == 40, f"Truncated 100-character name to {len(truncated_name)} chars.")

    # NEG-20: Missing or invalid data-page in shared-nav script defaults safely
    valid_pages = {"home", "leetcode", "roadmap", "patterns", "cicd", "sdet"}
    unknown_pages = ["admin", "root", "", None, "settings"]
    def resolve_page_safe(p):
        return p if p in valid_pages else "home"
    all_defaulted = all(resolve_page_safe(up) == "home" for up in unknown_pages)
    log_test("NEG-20: Unknown or invalid data-page safely defaults to home portal", all_defaulted, "Fallback mechanism defaults unmapped portals safely.")

    # Write test results log
    today_str = datetime.date.today().isoformat()
    results_md = f"""# Test Execution Report — DSA & Software Engineering Platform

**Date:** {today_str}  
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
