# Changelog — LeetCode 150 DSA Roadmap Webpage

## [2026-10-06] — 22:15 IST

### Security & Privacy: Excluded Raw Spreadsheet & Testing Suite via .gitignore

**Date:** 2026-10-06  
**Timestamp:** 22:15 IST  

**Files Modified:**
- `.gitignore` — Added ignore rules for raw proprietary spreadsheets (`*.xlsx`, `*.xls`, `*.csv`, `LeetCode_150_Roadmap.xlsx`) and local automated test suites/logs (`testing/`).
- `LeetCode_150_Roadmap.xlsx` — Untracked from Git index cache (`git rm --cached`) to prevent committing binary spreadsheets to GitHub while preserving files safely on the local disk.
- `testing/` (`test_runner.py`, `verify_dom.py`, `test-results.md`) — Untracked from Git index cache (`git rm -r --cached`) to maintain clean public repository boundaries.
- `README.md` — Updated repository file map to document exclusion of local spreadsheets and test scripts.
- `SECURITY.md` — Added Data Hygiene & Confidentiality Safeguards section detailing rules for secret, spreadsheet, and test environment isolation.

**Details:**
- Enforced zero-leak confidentiality standards prior to remote GitHub publishing.
- Verified local disk files remain intact and functional for local testing and historical reference.

---

## [2026-10-06] — 21:52 IST


### Redesigned: CodeByArt Software Engineering Brand Identity & Professional Header

**Date:** 2026-10-06  
**Timestamp:** 21:52 IST  

**Files Modified:**
- `DSA_Webpage/index.html` — Rebranded title and platform header to **CodeByArt — Software Engineering & DSA Roadmap Hub**. Embedded vector SVG glowing logo emblem, sub-badge `SWE Platform`, segmented portal tab switcher, and header network badges for `codebyart.com`, `connectkreations.com`, and **Kamal Patel** (LinkedIn). Upgraded footer with company links, developer credits, and copyright.
- `DSA_Webpage/styles.css` — Designed high-end glassmorphism navigation styling with subtle border lighting, glowing logo hover interactions, network pill badges, and mobile/tablet responsive layout adjustments.
- `DSA_Webpage/dsa_roadmap.html` — Updated top `.hub-header` with matching CodeByArt SVG branding, direct "← LeetCode 150" return button, and network badges.
- `DSA_Webpage/dsa_pattern_guide.html` & `DSA Pattern Guide.html` — Updated top `.hub-header` with matching CodeByArt SVG branding, direct "← LeetCode 150" return button, and network badges.
- `DSA_Webpage/testing/test_runner.py` — Expanded test suite to 26 test cases (19 positive + 7 negative) testing brand elements, social/company links, footer attribution, and link validity.
- `DSA_Webpage/testing/test-results.md` — Verified 26/26 tests passing.

**Details:**
- Delivered an executive-grade, professional visual hierarchy matching modern developer hubs (Linear/Vercel).
- Connected Kamal Patel's LinkedIn profile (`https://www.linkedin.com/in/kamal-patel-61a8201a0/`) and corporate ecosystems (`codebyart.com`, `connectkreations.com`).
- Added seamless two-way return navigation between all three portals.

---

## [2026-10-06] — 21:08 IST

### Added: Multiplatform Interconnected Hub (775-Day Roadmap & DSA Pattern Guide)

**Date:** 2026-10-06  
**Timestamp:** 21:08 IST  

**Files Modified:**
- `DSA_Webpage/index.html` — Added top navigation tabs (`.nav-tabs`) for switching between LeetCode 150, 775-Day Roadmap, and DSA Pattern Guide. Added companion learning portals discovery section.
- `DSA_Webpage/styles.css` — Added styling for `.nav-tabs`, active states, and `.companions-section` cards. Added responsive breakpoints (mobile, tablet, desktop) ensuring touch-friendly scrolling and safe-area compatibility.
- `DSA_Webpage/dsa_roadmap.html` — Embedded sticky `.hub-header` global navigation connecting to LeetCode 150 and Pattern Guide; adjusted desktop sidebar offset and mobile container styles.
- `DSA_Webpage/dsa_pattern_guide.html` — Clean URL alias of pattern guide with embedded sticky `.hub-header` global navigation, responsive search bar offset, and mobile viewports.
- `DSA_Webpage/DSA Pattern Guide.html` — Synchronized with embedded `.hub-header` navigation.
- `DSA_Webpage/testing/test_runner.py` — Expanded test suite to 22 test cases (16 positive + 6 negative) verifying inter-page linking, mobile viewports, DOM integrity, and error guards.
- `DSA_Webpage/testing/test-results.md` — Updated automated test report with all 22 passing tests.

**Details:**
- Unifies three major DSA portals into a cohesive, interconnected mastery suite.
- Preserves full cross-platform compatibility across Windows, macOS, Linux, iOS (Safari), and Android (Chrome).
- Ensures seamless URL resolution on static hosting without whitespace-encoding failures.

---

## [2026-10-06] — 20:27 IST

### Created: Interactive LeetCode 150 Roadmap Tracker Web Application

**Date:** 2026-10-06  
**Timestamp:** 20:27 IST  

**Files Created:**
- `DSA_Webpage/index.html` — Main interactive dashboard structure with responsive layout, SVG circular progress meter, daily streak cards, 90-day heatmap grid, filters, table view, pattern analytics grid, reminder modal, notes modal, and reset modal.
- `DSA_Webpage/styles.css` — High-fidelity modern styling with dark/light theme tokens, glassmorphism, glowing gradients, responsive grid layouts, custom checkboxes, difficulty badges, and modal animations.
- `DSA_Webpage/data.js` — Complete parsed dataset of 163 items (150 unique LeetCode problems + review and mock days) extracted directly from `LeetCode_150_Roadmap.xlsx`, preserving original URLs, day allocations, and pattern classifications.
- `DSA_Webpage/app.js` — Client-side state manager handling persistent storage via `localStorage`, dynamic problem completion toggling, consecutive day streak engine, daily reminder scheduling & browser notifications, problem notes manager, multi-filter search engine, 90-day activity heatmap, and JSON backup export/import.
- `DSA_Webpage/docs/changelog.md` — Detailed changelog tracking project releases.
- `DSA_Webpage/docs/bugs.md` — Project bug tracking and resolution log.
- `DSA_Webpage/docs/open-items.md` — Open items, feature roadmap, and enhancements.
- `DSA_Webpage/testing/test_runner.py` — Automated verification suite covering positive and negative test cases.
- `DSA_Webpage/testing/test-results.md` — Formal test execution report.

**Details:**
- Extracted and verified all 150 LeetCode problem URLs from `LeetCode_150_Roadmap.xlsx` without link degradation.
- Implemented automated daily notification trigger with custom time configuration and browser Web Notification API integration.
- Designed 90-day visual activity heatmap with status-coded cells (completed, partial, pending) that double as quick-day filters.
- Added live local hosting capability on dedicated port.
