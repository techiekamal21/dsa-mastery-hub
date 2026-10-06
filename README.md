<p align="center">
  <img src="https://img.shields.io/badge/LeetCode-150_Tracker-6366f1?style=for-the-badge&logo=leetcode&logoColor=white" alt="LeetCode 150"/>
  <img src="https://img.shields.io/badge/Zero-Dependencies-00E5FF?style=for-the-badge" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/License-MIT-B14AFF?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Multiplatform-Ready-10B981?style=for-the-badge" alt="Multiplatform Ready"/>
</p>

<h1 align="center">DSA and Software Engineering V.0.1</h1>

<p align="center">
  <b>A unified, cross-platform engineering portal featuring an Interactive 90-Day LeetCode 150 Tracker, 775-Day Comprehensive Curriculum (2,325 problems), and Algorithmic Pattern Guide.</b>
</p>


<p align="center">
  <a href="https://www.linkedin.com/in/kamal-patel-61a8201a0/">💼 Kamal Patel</a> •
  <a href="https://codebyart.com">🚀 codebyart.com</a> •
  <a href="https://connectkreations.com">🌐 connectkreations.com</a> •
  <a href="#quick-start">⚡ Quick Start</a> •
  <a href="#core-portals">📦 Portals</a>
</p>

---

## 🌟 Overview

The **CodeByArt DSA Mastery Hub** is an open-source, client-side engineering platform engineered for developers preparing for top-tier software engineering technical interviews. 

**Zero backend requirements. Zero API keys. Zero build steps.** Everything runs instantly in your browser with offline-first persistence powered by `localStorage`.

---

## 📦 Core Portals

The suite integrates three comprehensive preparation tools connected via a unified global navigation bar:

| Portal | File | Description | Problems Covered |
|---|---|---|---|
| 🎯 **LeetCode 150 Tracker** | `index.html` | Daily 90-day progress tracker with interactive checkboxes, SVG circular completion ring, consecutive streak engine, in-app daily reminder system, problem notes modal, and 90-day activity heatmap. | 150 Curated Problems |
| 🗺️ **775-Day Comprehensive Roadmap** | `dsa_roadmap.html` | Exhaustive 26-month journey broken into 6 developmental phases with month navigation, deep algorithmic thought processes, and category filtering. | 2,325 Problems · 26 Months |
| 💡 **DSA Algorithmic Pattern Guide** | `dsa_pattern_guide.html` | Interactive pattern archetype manual detailing scenario triggers, identification clues, time/space complexities, and classic problem links across 15+ algorithmic topics. | 15+ Algorithmic Topics |

---

## 🚀 Key Features

- **Direct LeetCode Integration**: Every problem includes direct, preserved links to `https://leetcode.com/problems/...` with external launch triggers.
- **Progress Tracking & Daily Streaks**: Real-time completion calculation with consecutive day streak counting (`🔥`) and all-time best streak tracking.
- **90-Day Interactive Activity Heatmap**: Visual matrix tracking daily completion status with color codes (pending, partial, complete) that double as instant day filters.
- **Daily Reminders & Notifications**: Built-in customizable timer with Web Notification API support and in-app toast alerts.
- **Problem Notes Modal**: Add, review, and persist personalized approach notes and complexity analyses for each problem (`📝`).
- **Data Portability**: Full JSON export (`📤`) and import (`📥`) capabilities to backup progress or synchronize across devices.
- **Multi-Platform & Mobile Optimized**: Responsive grid systems with safe-area insets (`env(safe-area-inset-top)`), touch targets (>44px), and sticky navigation offsets.
- **Dark & Light Mode**: Persistent dual-theme design system with custom CSS tokens and glassmorphic styling.

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/techiekamal21/dsa-mastery-hub.git
cd dsa-mastery-hub
```

### 2. Run Locally
Because this project is built with zero runtime dependencies, you can run it with any static server:

**Using Python:**
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080/` in your browser.

**Using Node.js:**
```bash
npx serve -p 8080
```

**Or simply double-click:**
Open `index.html` directly in any web browser (`Chrome`, `Safari`, `Firefox`, `Edge`).

---

## 📁 Repository Structure

```
dsa-mastery-hub/
├── index.html                 # Main LeetCode 150 Interactive Tracker
├── dsa_roadmap.html           # 775-Day Comprehensive Curriculum (2,325 problems)
├── dsa_pattern_guide.html     # DSA Algorithmic Pattern Guide
├── DSA Pattern Guide.html     # Backward-compatible alias
├── styles.css                 # Modern design system & responsive styling
├── app.js                     # Application logic, streaks, reminders & state engine
├── data.js                    # Parsed dataset of 163 roadmap entries
├── roadmap_data.json          # Formatted JSON dataset
├── README.md                  # Project documentation & guide
├── LICENSE                    # MIT License
├── CONTRIBUTING.md            # Community contribution guidelines
├── SECURITY.md                # Security policy
├── .gitignore                 # Standard git exclusions
├── assets/
│   └── screenshots/           # Screenshot assets and checklist
└── docs/
    ├── changelog.md           # Granular version and change tracking
    ├── bugs.md                # Bug tracking and resolution history
    └── open-items.md          # Feature backlog and enhancement roadmap
```

---


## 📱 Cross-Platform Compatibility

| Platform / Browser | Status | Features Tested |
|---|---|---|
| **Google Chrome (Desktop/Mobile)** | ✅ Supported | LocalStorage, Notifications, SVG Progress, Heatmap |
| **Apple Safari (macOS / iOS)** | ✅ Supported | Viewport safe-areas, Touch scrolling, Glassmorphism |
| **Mozilla Firefox** | ✅ Supported | Custom checkboxes, Scrollbars, CSS Variables |
| **Microsoft Edge** | ✅ Supported | Full compatibility across all modules |
| **Android Chrome & WebViews** | ✅ Supported | Responsive breakpoints, 44px+ touch targets |

---

## 👤 Author & Organization

- **Created by**: **Kamal Patel** — [LinkedIn Profile](https://www.linkedin.com/in/kamal-patel-61a8201a0/)
- **Organization**: [CodeByArt](https://codebyart.com) — Where Code Meets Artistry
- **Collaborator**: [ConnectKreations](https://connectkreations.com)

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
