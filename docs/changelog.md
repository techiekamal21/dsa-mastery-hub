# Changelog — DSA and Software Engineering V.0.1

## [0.5.2] — 2026-10-24

### Fixed: More Dropdown Hover Bridge, Mobile Viewport Boundary Clamping, Touch Interactivity, and Asset Cache-Busting

**Date:** 2026-10-24  
**Timestamp:** 13:55 IST  
**Branch:** `fix/deployed-more-dropdown-and-cache-busting`  

**Files Modified:**
- `shared-nav.css`:
  - Added invisible pseudo-element hover bridges (`.cba-more-dd::after` and `.cba-more-menu::before`) eliminating mouse-out collapse over the 10px spacing gap.
  - Added responsive right-anchoring and viewport bounding rules (`max-width: min(300px, calc(100vw - 2rem))`) for screens <= 768px and <= 680px.
  - Added full-width fixed sheet presentation for mobile devices <= 480px (`position: fixed; left: 0.5rem; right: 0.5rem; top: calc(var(--sn-nav-h) + 6px)`), preventing horizontal cutoff or off-screen clipping.
  - Added `.cba-tab-label-text` collapsing rules on screens <= 900px and <= 680px so "More ▾" shrinks to icon-only (`📦 ▾`) without colliding with profile and tab controls.
- `shared-nav.js`:
  - Wrapped "More" label text with `<span class="cba-tab-label-text">` to support responsive icon-only display on narrow screens.
  - Synchronized `aria-expanded` state on trigger button (`#cba-more-btn`) across all dropdown operations.
  - Added `touchstart` listener on document body for reliable mobile outside-tap closing.
  - Added cache-busting query parameter `shared-nav.css?v=0.5.2` in `inject()` dynamic loader.
- `home.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2` for instant CDN/browser cache invalidation.
- `index.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `dsa_roadmap.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `dsa_pattern_guide.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `DSA Pattern Guide.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `cicd_guide.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `sdet_software_engineering_interview_question_bank.html`:
  - Updated stylesheet link to `shared-nav.css?v=0.5.2` and script tag to `shared-nav.js?v=0.5.2`.
- `docs/bugs.md`:
  - Logged `BUG-006` with comprehensive diagnosis and solution details.

---

## [0.5.1] — 2026-10-24

### Fixed: Roadmap Content Rendering (Syntax Error Fix), More Dropdown Visibility (`overflow: visible`), and Pattern Guide Dark Theme Alignment

**Date:** 2026-10-24  
**Timestamp:** 13:25 IST  
**Branch:** `main`  

**Files Modified:**
- `dsa_roadmap.html`:
  - Resolved `SyntaxError: Unexpected end of input` caused by a truncated legacy event listener (`document.addEventListener('click', ...)`).
  - Restored full JavaScript execution so `render()` properly populates `#mainArea` with all 2,325 curriculum problems, category cards, month goals, and difficulty filters.
- `shared-nav.css`:
  - Fixed More dropdown clipping by changing `.cba-nav-tabs` from `overflow: hidden` to `overflow: visible`.
  - Added `:hover` pseudo-class states to `.cba-more-dd` for both desktop hover opening and click/touch toggle accessibility.
- `shared-nav.js`:
  - Added `initTheme()` function to read theme preference from `localStorage` (`cba-theme` or legacy `lc-theme`, defaulting to `'dark'`) and apply `data-theme` to `document.documentElement` on initial load.
- `dsa_pattern_guide.html`:
  - Updated `:root` CSS variables to default to the platform's unified dark theme palette (`--bg: #0b1120`, `--card: #131d31`, `--tx: #e6e8eb`, `--bd: #223049`, `--ac: #a5a0ff`) with zero loss of existing topics, patterns, clues, or problem questions.
  - Added `:root[data-theme="light"]` and `:root[data-theme="dark"]` rules for explicit theme switching.
- `DSA Pattern Guide.html`:
  - Synchronized backward-compatible alias with unified dark theme default tokens and data-theme rules.
- `docs/bugs.md`:
  - Documented BUG-004 (roadmap script syntax error and more dropdown clipping) and BUG-005 (pattern guide theme mismatch) along with their resolutions.

---

## [0.5.0] — 2026-10-24

### Added: Unified Header with Profile Dropdown, Settings Dropdown (Export, Import, Save, Theme, Reminder, Cache Clear, Reset All), Safety Warning Modals, and Consistent Cross-Platform Footer

**Date:** 2026-10-24  
**Timestamp:** 12:55 IST  
**Branch:** `feature/unified-header-profile-settings-footer`  

**Files Modified / Added:**
- `shared-nav.js` *(New)* — Standalone global navigation engine injected across all portals:
  - **Unified Navigation Shell (`#cba-top-nav`)**: Fixed 58px high-performance top navbar with glassmorphism (`rgba(6, 8, 16, 0.85)` + `backdrop-filter: blur(24px)`), dynamic scroll shadow (`.scrolled`), CodeByArt SVG logo emblem with linear gradient, brand mark, and portal tab navigation (`Home`, `LeetCode 150`, `775-Day Roadmap`, `Pattern Guide`, `More ▾`).
  - **User Profile Dropdown (`#cba-profile-dd`)**:
    - Header avatar badge displaying first letter uppercase with gradient initial.
    - User display name display (defaults to "Guest" until configured).
    - In-place name editor input with max 40-character limit, sanitized input (stripping `<>\"'&`), and iOS 16px font to prevent mobile auto-zoom.
    - "Save Name →" button persisting to `localStorage` key `cba-user-name` and triggering live synchronization with on-page greetings (e.g., `#welcomeBar`, `#welcomeName`, `#topNavWelcome`).
    - "✕ Clear & Reset Name" button restoring guest status.
    - Global API hook `window.cbaUpdateProfile(name)` exposed for portal-specific onboarding flows (e.g. `home.html` welcome modal).
  - **Settings Dropdown (`#cba-settings-dd`)**:
    - Dedicated `⚙️` settings trigger in the header separating utility actions from the main navigation.
    - **Data Management**:
      - `📤 Export Progress`: Downloads a timestamped JSON file (`codebyart-backup-YYYY-MM-DD.json`) containing all platform keys from `localStorage`.
      - `📥 Import Progress`: Triggers a safety confirmation warning modal explaining data merge and overwrite risks before opening file picker (`.json`), parsing and validating JSON dictionary structure, restoring keys, and reloading cleanly.
      - `💾 Save Snapshot`: Forces an immediate progress checkpoint to `localStorage` (hooks into `window.saveProgress()` where available).
    - **Preferences**:
      - `🌙 / ☀️ Toggle Theme`: Toggles between dark and light themes, hooks into `window.toggleTheme()` on LeetCode tracker, sets `data-theme` attribute, persists to `cba-theme`, and dynamically updates dropdown label and icon.
      - `⏰ Daily Reminder`: Opens the study reminder modal (hooks into `window.openReminderModal()` on LeetCode tracker or directs user to configuration).
    - **Danger Zone**:
      - `🧹 Clear Cache`: Warns user before clearing non-progress UI state keys (`cba-theme`, `cba-sidebar`, `cba-collapse`, `lc-theme`, `sdet-collapse`, `filter-state`) while reassuring the user that their solved problems, progress, notes, and profile name are 100% safe.
      - `🗑️ Reset All Progress`: Triggers a severe, high-danger confirmation modal that warns of permanent data wipe and strictly requires the user to type the word `"RESET"` before allowing confirmation. Clears `localStorage` and redirects cleanly to `home.html`.
  - **Glassmorphic Warning / Confirmation Modal (`#cba-warning-overlay`)**:
    - Accessible, centered modal dialog with warning emoji, header, explanatory message, warning highlight box, optional confirmation input field, and Cancel / Confirm action buttons.
    - Supports dismissal via overlay backdrop click, Cancel button, or Escape keyboard key.
  - **Toast Notification System (`#cba-toast`)**:
    - Floating bottom toast component (`z-index: 99998`) with smooth cubic-bezier slide-in animation, color-coded borders (green for success, amber for warnings, rose for errors), and automatic 3.2s auto-dismiss.
  - **Standardized Footer (`.cba-footer`)**:
    - Clean, modern layout rendered uniformly across all portals.
    - Links to all 5 core portals + Home + GitHub repository.
    - Developer attribution: `© 2026 CodeByArt · Engineered by Kamal Patel` linking to Kamal Patel's LinkedIn.
- `shared-nav.css` *(New)* — Design tokens, component rules, and layout offsets:
  - Custom tokens: `--sn-bg`, `--sn-border`, `--sn-surface`, `--sn-text`, `--sn-cyan`, `--sn-violet`, `--sn-grad`, `--sn-nav-h: 58px`.
  - Layout compensation: `body.has-cba-nav` with `padding-top: var(--sn-nav-h) !important;`.
  - Sticky element offsets: `.sidebar`, `.toolbar`, and `aside` offsets adjusted to accommodate the fixed 58px header.
  - Multi-tier responsive breakpoints (`@media (max-width: 900px)`, `@media (max-width: 680px)`, `@media (max-width: 480px)`): hides verbose labels, collapses tabs into More dropdown on ultra-small viewports, ensures dropdown menus fit within `min(290px, 94vw)`, and wraps footer links cleanly.
- `home.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed obsolete `#topNav` and redundant `.site-footer`.
  - Updated onboarding modal save action to call `window.cbaUpdateProfile(name)` ensuring instant navbar synchronization.
  - Appended `<script src="shared-nav.js" data-page="home"></script>`.
- `index.html` (LeetCode 150 Tracker):
  - Linked `shared-nav.css` in `<head>`.
  - Removed obsolete `.top-nav` and old static footer.
  - Preserved hero stats, search/filter toolbar, problem tables, reminder modal, and notes modal.
  - Appended `<script src="shared-nav.js" data-page="leetcode"></script>`.
- `dsa_roadmap.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed old `.hub-header` and inline welcome sync script.
  - Appended `<script src="shared-nav.js" data-page="roadmap"></script>`.
- `dsa_pattern_guide.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed old `.hub-header` and inline welcome sync script.
  - Appended `<script src="shared-nav.js" data-page="patterns"></script>`.
- `DSA Pattern Guide.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed old `.hub-header` and inline welcome sync script.
  - Appended `<script src="shared-nav.js" data-page="patterns"></script>`.
- `cicd_guide.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed old `.hub-header`, old footer, and inline welcome sync script.
  - Appended `<script src="shared-nav.js" data-page="cicd"></script>`.
- `sdet_software_engineering_interview_question_bank.html`:
  - Linked `shared-nav.css` in `<head>`.
  - Removed old `.hub-header`, old `.site-footer`, and inline welcome sync script.
  - Appended `<script src="shared-nav.js" data-page="sdet"></script>`.
- `testing/test_runner.py`:
  - Updated test assertions to validate `shared-nav.js` and `shared-nav.css` syntax, responsive layout tokens, presence across all 7 pages, profile controls, settings dropdown actions, modal warning system, toast notifications, scoped cache clear logic, and sticky layout compensation.
  - Added negative test cases: NEG-17 (strict "RESET" confirmation verification), NEG-18 (corrupted/non-object JSON import rejection), NEG-19 (profile name truncation at 40 chars), and NEG-20 (safe default fallback for unknown data-page).
- `testing/test-results.md`:
  - Updated test execution report with 63 total tests executed (43 Positive + 20 Negative), achieving 100% pass rate.

---

## [0.4.1] — 2026-10-24

### Changed: Homepage Creator Section Redesign + "Want to Contribute?" Section Added

**Date:** 2026-10-24  
**Timestamp:** 12:14 IST  
**Branch:** `feature/homepage-creator-contribute-section`  
**PR:** [#8 — feat(home): redesign creator section](https://github.com/techiekamal21/dsa-mastery-hub/pull/8)

**Files Modified:**
- `home.html` — About / Creator section redesign:
  - **Removed**: 4 stat data cards on the right column of the About section (150 LeetCode Problems, 2,325 Curriculum Problems, 71 Interview Topics, 5 Integrated Portals). The `.about-right` two-column grid and `.about-card`/`.about-card-val` styles were removed entirely.
  - **Redesigned layout**: `.about-inner` changed from a `grid (1fr 1fr)` to a `flex column` layout with `max-width: 860px` centered — giving the creator block a focused, full-width treatment.
  - **Added**: "Want to Contribute?" card (`.contribute-card`) placed below the creator bio, featuring:
    - Glassmorphic dual-gradient border (cyan → violet)
    - `::before` radial gradient overlay for visual depth
    - "Contribute on GitHub" primary CTA (gradient brand, GitHub SVG icon)
    - "Connect on LinkedIn" LinkedIn-blue-tinted button (LinkedIn SVG icon)
    - "Send an Email" secondary button → `codebyart@gmail.com`
    - "Visit Website" secondary button → `codebyart.com`
  - **Social btn update**: Added `white-space: nowrap` to prevent social pills from breaking across lines on narrow viewports.
  - **Responsive updates**: Removed obsolete `@media (max-width: 900px)` `.about-inner` and `.about-right` rules; added `.contribute-header` column stacking, `.contribute-btn` wrapping, and full-width contribute buttons at `≤400px`.

---

## [0.4.0] — 2026-10-24

### Added: Professional Platform Homepage (`home.html`), User Name Onboarding, Cross-Portal Welcome Sync & Cross-Device / iOS Compatibility

**Date:** 2026-10-24  
**Timestamp:** 00:20 IST  

**Files Modified / Added:**
- `home.html` *(New)* — Standalone, professional entry-point landing page for the CodeByArt DSA & Software Engineering Platform:
  - Animated glassmorphic hero section with drifting radial-gradient orb background, subtle CSS grid overlay, and a branded eyebrow pill.
  - Animated stat counter bar (150 problems, 2,325 curriculum, 71 topics, 5 portals, zero backend) with easeOut counter animation.
  - 5-portal showcase grid with per-portal color themes (indigo, cyan, violet, emerald, amber), subtle 3D tilt-on-hover effect, top accent bars, feature chips, and deep-link CTAs.
  - 6-item platform DNA feature strip with glassmorphic cards and hover micro-interactions.
  - About section with creator bio, social link pills, and 2×2 stat card grid.
  - Sticky glassmorphic top nav, scroll-triggered section reveal animations, read scroll progress bar, and branded footer with all portal quick-links.
  - Personalized Name Onboarding Modal (`#nameModalOverlay`): allows visitors to enter their name with persistent `localStorage` storage (`cba-user-name`).
  - Welcome banner (`#welcomeBar`) with inline name display, edit button, and top navigation greeting pill (`#topNavWelcome`).
  - iOS Safari & Cross-Device Hardening: explicit `16px` font size on inputs to prevent unwanted iOS auto-zoom, `-webkit-appearance: none` on buttons/inputs, full `viewport-fit=cover` and `env(safe-area-inset-top)` offsets, `100dvh` viewport support, `-webkit-backdrop-filter` prefixes across all glassmorphic elements, and mobile-friendly layouts down to 320px/375px (iPhone SE).
- `index.html` — Added `🏠 Home` tab to navigation and integrated global welcome sync script displaying `👋 Hi, [Name]` in `.nav-network`.
- `dsa_roadmap.html` — Added `🏠 Home` tab to `.hub-tabs` and integrated global welcome sync script in `.hub-network`.
- `dsa_pattern_guide.html` — Added `🏠 Home` tab to `.hub-tabs` and integrated global welcome sync script in `.hub-network`.
- `DSA Pattern Guide.html` — Added `🏠 Home` tab to `.hub-tabs` and integrated global welcome sync script in `.hub-network`.
- `cicd_guide.html` — Added `🏠 Home` tab to `.hub-tabs` and integrated global welcome sync script in `.hub-network`.
- `sdet_software_engineering_interview_question_bank.html` — Added `🏠 Home` tab to `.hub-tabs` and integrated global welcome sync script in `.hub-network`.
- `README.md` — Updated Core Portals table and Directory Structure with `home.html`.
- `testing/test_runner.py` — Expanded automated test suite from 50 to 63 test cases (POS-01..47, NEG-01..16) covering homepage validity, iOS safe-area configuration, portal links, name modal elements, cross-portal welcome sync, responsive breakpoints, XSS sanitization, empty input rejections, and viewport validation.
- `testing/test-results.md` — Updated test execution report confirming 63/63 tests passing (100% pass rate).

---

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
