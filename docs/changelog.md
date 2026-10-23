# Changelog — DSA and Software Engineering V.0.1

## [0.3.0] — 2026-10-23

### Added: SDET & Software Engineering Interview Question Bank Portal & Global "More" Integration

**Date:** 2026-10-23  
**Timestamp:** 23:40 IST  

**Files Modified / Added:**
- `sdet_software_engineering_interview_question_bank.html` — Upgraded and integrated comprehensive 71-topic interview study workspace:
  - Redesigned visual aesthetics with CodeByArt unified dark design system tokens (`#0b1120`, Inter & JetBrains Mono typography, cyan/purple gradient accents).
  - Integrated unified top navigation header (`.hub-header`) featuring CodeByArt brand emblem, `← LeetCode 150` return button, navigation tabs (LeetCode 150, 775-Day Roadmap, Pattern Guide), active `More ▾` dropdown, LinkedIn profile pill, and interactive `Connect ▾` dropdown.
  - Enhanced workspace features: live instant keyword search filtering, collapsible topic group cards, question checklists with `localStorage` persistence, interactive progress bar, Print/Save PDF mode, and text progress report export.
  - Added event listeners for outside-click and Escape key dropdown dismissal.
- `index.html` — Updated `#navMoreMenu` with new "Interview & QA" section header and SDET & SWE Question Bank link (`🧪`).
- `dsa_roadmap.html` — Updated `.hub-more-menu` with "Interview & QA" section header and SDET Question Bank link.
- `dsa_pattern_guide.html` — Updated `.hub-more-menu` with "Interview & QA" section header and SDET Question Bank link.
- `DSA Pattern Guide.html` — Updated backward-compatible alias `.hub-more-menu` with "Interview & QA" section header and SDET Question Bank link.
- `cicd_guide.html` — Updated `.hub-more-menu` with "Interview & QA" section header and SDET Question Bank link.
- `README.md` — Updated Core Portals table and repository directory tree to include SDET Question Bank portal.
- `testing/test_runner.py` — Expanded automated test suite from 38 to 50 test cases (POS-01..38, NEG-01..12) validating SDET question bank existence, 71 topic groups, interactive tools, cross-platform dropdown links across all 6 pages, and negative fallbacks.
- `testing/test-results.md` — Updated test execution report confirming all 50 automated tests pass with 0 failures.
- `docs/open-items.md` — Added future enhancement item for SDET Mock Interview Mode with random question selection and timer.

---

## [0.2.0] — 2026-10-13

### Added: CI/CD From Zero to Production Interactive Guide & "More" Dropdown Menu

**Date:** 2026-10-13  
**Timestamp:** 19:10 IST  

**Files Modified / Added:**
- `cicd_guide.html` *(New)* — Complete interactive CI/CD learning portal featuring:
  - DORA Metrics 4-keys dashboard (Deployment Frequency, Lead Time, Change Failure Rate, Time to Restore).
  - Interactive Simulation Lab: Pipeline Simulator (with live logs and failure injection), Deployment Strategy Visualizer (Rolling, Blue/Green, Canary, Recreate), and Interactive 3-tier Test Pyramid.
  - Comprehensive 10-chapter deep-dive blog covering everything from integration hell and trunk-based development to Kubernetes, GitOps, secret management, observability, and self-healing pipelines.
- `index.html` — Integrated "More" dropdown into primary `.nav-tabs` menu linking to `cicd_guide.html` under "DevOps & Engineering".
- `styles.css` — Added complete design system rules for `.nav-more-dropdown`, `.nav-more-trigger`, `.nav-more-menu`, and `.nav-more-item` supporting glassmorphism, responsive layouts, and light/dark theme modes.
- `app.js` — Implemented `toggleMoreDropdown(event)` function, document click outside detection, and keyboard Escape key dismissal.
- `dsa_roadmap.html` — Synchronized unified navigation header with "More" dropdown menu, custom styling, and click-outside handler.
- `dsa_pattern_guide.html` — Synchronized unified navigation header with "More" dropdown menu, custom styling, and click-outside handler.
- `DSA Pattern Guide.html` — Updated backward-compatible alias with "More" dropdown menu and styling.
- `testing/test_runner.py` — Expanded automated test suite from 26 to 38 test cases (POS-01..29, NEG-01..09) verifying CI/CD file existence, simulators, 10-part blog, dropdown menu links on all pages, CSS tokens, and fault-tolerant fallbacks.
- `testing/test-results.md` — Updated automated test execution report showing 38 passed, 0 failed.

---

## [0.1.2] — 2026-10-06

### Redesigned: Streamlined Header with LinkedIn & Connect Dropdown

**Date:** 2026-10-06  
**Timestamp:** 23:05 IST  

**Files Modified:**
- `index.html` — Streamlined navigation header to showcase only LinkedIn directly, consolidating mail (`codebyart@gmail.com`) and websites (`codebyart.com`, `connectkreations.com`) into an interactive Connect dropdown menu.
- `styles.css` — Created `.header-dropdown` styles with glassmorphic dropdown cards, smooth slide-down animation, carets, and backdrop blur.
- `app.js` — Added dropdown click toggle, outside-click detection, and Escape key listener.
- `dsa_roadmap.html`, `dsa_pattern_guide.html`, and `DSA Pattern Guide.html` — Synchronized unified navigation header with matching LinkedIn badge and Connect dropdown menu.

---

## [0.1.1] — 2026-10-06


### Added: Collaboration & Inquiries Contact Channel

**Date:** 2026-10-06  
**Timestamp:** 22:50 IST  

**Files Modified:**
- `README.md` — Added primary header link, Author & Organization attribution, and dedicated Collaboration & Contact section with `codebyart@gmail.com`.
- `SECURITY.md` — Set direct vulnerability reporting contact to `codebyart@gmail.com`.
- `CONTRIBUTING.md` — Added open-source collaboration and inquiries contact channel (`codebyart@gmail.com`).
- `index.html` — Integrated interactive `codebyart@gmail.com` contact badge into top navigation network bar and footer links.
- `styles.css` — Added hover interaction states for mail contact badges and footer pills.
- `dsa_roadmap.html` & `dsa_pattern_guide.html` — Synchronized `.hub-network` with collaboration email pill.

---

## [0.1.0] — 2026-10-06


### Initial Release: DSA and Software Engineering V.0.1

**Date:** 2026-10-06  
**Timestamp:** 22:25 IST  

**Repository:** `https://github.com/techiekamal21/dsa-mastery-hub`  
**Branch:** `main`

**Portals & Core Features:**
- **LeetCode 150 Tracker (`index.html`)**: Interactive progress tracking with circular completion ring, streak engine, daily reminders, notes modal, and 90-day heatmap.
- **775-Day Comprehensive Roadmap (`dsa_roadmap.html`)**: Multi-phase curriculum covering 2,325 problems across 26 months.
- **Algorithmic Pattern Guide (`dsa_pattern_guide.html`)**: Pattern archetypes, scenarios, complexities, and real-world triggers.
- **Cross-Platform Responsive Interface**: Fluid dark/light theme, modern typography, and touch optimization.
- **Zero-Dependency Architecture**: Runs client-side in modern web browsers with local storage persistence.
