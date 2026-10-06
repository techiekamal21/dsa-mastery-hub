/**
 * LeetCode 150 Roadmap Tracker — Main Application Script
 */

// State
let userProgress = {};
let reminderConfig = {
    enabled: true,
    time: "09:00",
    message: "Time to solve today's LeetCode problems! 🚀",
    lastNotifiedDate: null
};
let currentNoteProblemKey = null;

const STORAGE_KEYS = {
    PROGRESS: 'lc150_progress_v1',
    REMINDER: 'lc150_reminder_v1',
    THEME: 'lc150_theme_v1',
    STREAK: 'lc150_streak_v1'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadStorageData();
    populateFilters();
    renderProblems();
    updateStats();
    renderHeatmap();
    renderPatternGrid();
    setupReminderTimer();
    checkDailyReminder();
});

// Load / Save Storage
function loadStorageData() {
    try {
        const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        if (savedProgress) userProgress = JSON.parse(savedProgress);

        const savedReminder = localStorage.getItem(STORAGE_KEYS.REMINDER);
        if (savedReminder) reminderConfig = { ...reminderConfig, ...JSON.parse(savedReminder) };
    } catch (e) {
        console.error('Error loading storage data', e);
    }
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(userProgress));
}

function saveReminderConfig() {
    localStorage.setItem(STORAGE_KEYS.REMINDER, JSON.stringify(reminderConfig));
}

// Key helper
function getProblemKey(item) {
    if (item.num !== null && item.num !== undefined) {
        return `p_${item.num}`;
    }
    return `day_${item.day}_${item.problem.replace(/\s+/g, '_')}`;
}

// Theme handling
function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Populate Filters
function populateFilters() {
    const patternSelect = document.getElementById('filter-pattern');
    const daySelect = document.getElementById('filter-day');

    const patterns = new Set();
    const days = new Set();

    ROADMAP_DATA.forEach(item => {
        if (item.pattern) patterns.add(item.pattern);
        if (item.day) days.add(item.day);
    });

    Array.from(patterns).sort().forEach(pat => {
        const opt = document.createElement('option');
        opt.value = pat;
        opt.textContent = pat;
        patternSelect.appendChild(opt);
    });

    Array.from(days).sort((a,b) => a - b).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = `Day ${d}`;
        daySelect.appendChild(opt);
    });
}

// Problem Rendering
function renderProblems() {
    const tbody = document.getElementById('problems-tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const patternFilter = document.getElementById('filter-pattern').value;
    const diffFilter = document.getElementById('filter-difficulty').value;
    const statusFilter = document.getElementById('filter-status').value;
    const dayFilter = document.getElementById('filter-day').value;

    tbody.innerHTML = '';

    const filtered = ROADMAP_DATA.filter(item => {
        const key = getProblemKey(item);
        const isDone = userProgress[key]?.done || false;

        // Search text
        if (searchTerm) {
            const numStr = item.num ? `#${item.num} ${item.num}` : '';
            const matchText = `${item.problem} ${item.pattern || ''} ${numStr}`.toLowerCase();
            if (!matchText.includes(searchTerm)) return false;
        }

        // Pattern filter
        if (patternFilter !== 'all' && item.pattern !== patternFilter) return false;

        // Difficulty filter
        if (diffFilter !== 'all' && item.difficulty !== diffFilter) return false;

        // Day filter
        if (dayFilter !== 'all' && String(item.day) !== String(dayFilter)) return false;

        // Status filter
        if (statusFilter === 'done' && !isDone) return false;
        if (statusFilter === 'pending' && isDone) return false;

        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    🔍 No problems match your selected filters.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {
        const key = getProblemKey(item);
        const isDone = userProgress[key]?.done || false;
        const notes = userProgress[key]?.notes || '';
        const isReview = !item.num;

        const tr = document.createElement('tr');
        tr.className = `problem-row ${isDone ? 'completed' : ''} ${isReview ? 'review-row' : ''}`;

        // Checkbox column
        const tdCheck = document.createElement('td');
        tdCheck.className = 'col-check';
        tdCheck.innerHTML = `
            <label class="custom-checkbox">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleProblemDone('${key}', this.checked)">
                <span class="checkmark"></span>
            </label>
        `;
        tr.appendChild(tdCheck);

        // Day
        const tdDay = document.createElement('td');
        tdDay.className = 'col-day';
        tdDay.innerHTML = `<span class="day-badge" onclick="filterByDay(${item.day})" style="cursor:pointer;" title="Filter by Day ${item.day}">Day ${item.day}</span>`;
        tr.appendChild(tdDay);

        // Number
        const tdNum = document.createElement('td');
        tdNum.className = 'col-num';
        tdNum.textContent = item.num ? `#${item.num}` : '—';
        tr.appendChild(tdNum);

        // Pattern
        const tdPattern = document.createElement('td');
        tdPattern.className = 'col-pattern';
        const isPatternReview = item.pattern === 'Review' || item.pattern === 'Mock';
        tdPattern.innerHTML = `<span class="pattern-badge ${isPatternReview ? 'review-badge' : ''}" onclick="filterByPattern('${item.pattern}')" style="cursor:pointer;">${item.pattern || 'General'}</span>`;
        tr.appendChild(tdPattern);

        // Problem Title + Direct URL Link
        const tdProblem = document.createElement('td');
        tdProblem.className = 'col-problem';
        if (item.url) {
            tdProblem.innerHTML = `
                <div class="problem-link-wrapper">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="problem-link" title="Open LeetCode problem in new tab">
                        <span class="problem-title">${item.problem}</span>
                        <span class="ext-icon">↗</span>
                    </a>
                </div>
            `;
        } else {
            tdProblem.innerHTML = `<span class="problem-title" style="font-weight:600; color:${isReview ? '#818cf8' : 'inherit'}">${item.problem}</span>`;
        }
        tr.appendChild(tdProblem);

        // Difficulty
        const tdDiff = document.createElement('td');
        tdDiff.className = 'col-diff';
        if (item.difficulty) {
            const diffClass = item.difficulty.toLowerCase();
            tdDiff.innerHTML = `<span class="difficulty-badge ${diffClass}">${item.difficulty}</span>`;
        } else {
            tdDiff.innerHTML = `<span class="difficulty-badge" style="background:rgba(255,255,255,0.06); color:var(--text-muted); border:1px solid var(--border-subtle);">${item.pattern || 'Special'}</span>`;
        }
        tr.appendChild(tdDiff);

        // Actions
        const tdActions = document.createElement('td');
        tdActions.className = 'col-actions';
        const hasNotesClass = notes.trim().length > 0 ? 'has-notes' : '';
        let urlBtn = item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Open in LeetCode">🚀</a>` : '';
        tdActions.innerHTML = `
            <div class="action-btn-group">
                <button class="btn-icon ${hasNotesClass}" onclick="openNotesModal('${key}', '${escapeJs(item.problem)}')" title="Problem Notes">📝</button>
                ${urlBtn}
            </div>
        `;
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function escapeJs(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Toggle Done Status
function toggleProblemDone(key, isDone) {
    if (!userProgress[key]) {
        userProgress[key] = { done: false, completedAt: null, notes: '' };
    }

    userProgress[key].done = isDone;
    if (isDone) {
        userProgress[key].completedAt = new Date().toISOString();
    } else {
        userProgress[key].completedAt = null;
    }

    saveProgress();
    updateStreak();
    updateStats();
    renderProblems();
    renderHeatmap();
    renderPatternGrid();
}

// Streak Tracking Logic
function updateStreak() {
    const datesSolved = new Set();
    Object.values(userProgress).forEach(item => {
        if (item.done && item.completedAt) {
            datesSolved.add(item.completedAt.split('T')[0]);
        }
    });

    const sortedDates = Array.from(datesSolved).sort().reverse();
    if (sortedDates.length === 0) {
        saveStreakData(0, getStoredBestStreak());
        return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    let checkDate = new Date();

    // If solved today, start counting from today. Otherwise if solved yesterday, start from yesterday.
    if (sortedDates.includes(todayStr)) {
        // start from today
    } else if (sortedDates.includes(yesterdayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
    } else {
        currentStreak = 0;
        saveStreakData(0, getStoredBestStreak());
        return;
    }

    while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (sortedDates.includes(dStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    let best = Math.max(currentStreak, getStoredBestStreak());
    saveStreakData(currentStreak, best);
}

function getStoredBestStreak() {
    try {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK) || '{}');
        return s.best || 0;
    } catch {
        return 0;
    }
}

function saveStreakData(current, best) {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ current, best }));
}

// Statistics Update
function updateStats() {
    // Only count actual numbered LeetCode problems (1 to 150)
    const problemItems = ROADMAP_DATA.filter(item => item.num !== null && item.num !== undefined);
    const totalProblems = problemItems.length;

    let solvedCount = 0;
    let easySolved = 0, easyTotal = 0;
    let medSolved = 0, medTotal = 0;
    let hardSolved = 0, hardTotal = 0;

    // Track active/current day
    let currentActiveDay = 1;
    let dayAllDone = true;

    problemItems.forEach(item => {
        const key = getProblemKey(item);
        const isDone = userProgress[key]?.done || false;

        if (item.difficulty === 'Easy') {
            easyTotal++;
            if (isDone) easySolved++;
        } else if (item.difficulty === 'Medium') {
            medTotal++;
            if (isDone) medSolved++;
        } else if (item.difficulty === 'Hard') {
            hardTotal++;
            if (isDone) hardSolved++;
        }

        if (isDone) solvedCount++;
    });

    // Find the first day with incomplete items
    const dayMap = {};
    ROADMAP_DATA.forEach(item => {
        if (!dayMap[item.day]) dayMap[item.day] = [];
        dayMap[item.day].push(item);
    });

    const sortedDays = Object.keys(dayMap).map(Number).sort((a,b) => a - b);
    for (let d of sortedDays) {
        const dayProblems = dayMap[d];
        const isCompleted = dayProblems.every(p => userProgress[getProblemKey(p)]?.done);
        if (!isCompleted) {
            currentActiveDay = d;
            dayAllDone = false;
            break;
        }
    }

    if (dayAllDone && sortedDays.length > 0) {
        currentActiveDay = sortedDays[sortedDays.length - 1];
    }

    // Update Counter Elements
    const solvedEl = document.getElementById('solved-count');
    const totalEl = document.getElementById('total-count');
    if (solvedEl) solvedEl.textContent = solvedCount;
    if (totalEl) totalEl.textContent = totalProblems;

    // Progress Ring (Circumference = 2 * PI * 52 ≈ 326.72)
    const percent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
    const ringEl = document.getElementById('progress-ring');
    const ringPercentEl = document.getElementById('ring-percent');
    if (ringPercentEl) ringPercentEl.textContent = `${percent}%`;

    if (ringEl) {
        const circumference = 326.72;
        const offset = circumference - (percent / 100) * circumference;
        ringEl.style.strokeDashoffset = offset;
    }

    // Difficulty Bars
    const easyBar = document.getElementById('easy-bar');
    const easyCount = document.getElementById('easy-count');
    if (easyBar) easyBar.style.width = `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%`;
    if (easyCount) easyCount.textContent = `${easySolved}/${easyTotal}`;

    const medBar = document.getElementById('medium-bar');
    const medCount = document.getElementById('medium-count');
    if (medBar) medBar.style.width = `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%`;
    if (medCount) medCount.textContent = `${medSolved}/${medTotal}`;

    const hardBar = document.getElementById('hard-bar');
    const hardCount = document.getElementById('hard-count');
    if (hardBar) hardBar.style.width = `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%`;
    if (hardCount) hardCount.textContent = `${hardSolved}/${hardTotal}`;

    // Streak
    let streakData = { current: 0, best: 0 };
    try {
        streakData = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK) || '{"current":0,"best":0}');
    } catch {}
    const streakCountEl = document.getElementById('streak-count');
    const bestStreakEl = document.getElementById('best-streak');
    if (streakCountEl) streakCountEl.textContent = streakData.current || 0;
    if (bestStreakEl) bestStreakEl.textContent = `Best: ${streakData.best || 0}`;

    // Current Day info
    const todayDayEl = document.getElementById('today-day');
    const todayProblemsEl = document.getElementById('today-problems');
    if (todayDayEl) todayDayEl.textContent = `Day ${currentActiveDay}`;

    const currentDayItems = dayMap[currentActiveDay] || [];
    const remainingInDay = currentDayItems.filter(p => !userProgress[getProblemKey(p)]?.done).length;
    if (todayProblemsEl) {
        todayProblemsEl.textContent = remainingInDay === 0 ? 'All done today! 🎉' : `${remainingInDay} remaining`;
    }
}

// 90-Day Interactive Heatmap
function renderHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;

    container.innerHTML = '';

    const dayMap = {};
    ROADMAP_DATA.forEach(item => {
        if (!dayMap[item.day]) dayMap[item.day] = [];
        dayMap[item.day].push(item);
    });

    // Days 1 through 90
    for (let d = 1; d <= 90; d++) {
        const cell = document.createElement('div');
        cell.className = 'heat-cell';

        const problems = dayMap[d] || [];
        if (problems.length === 0) {
            cell.classList.add('empty');
            cell.setAttribute('data-tooltip', `Day ${d}: Rest / Review`);
        } else {
            const completedCount = problems.filter(p => userProgress[getProblemKey(p)]?.done).length;
            if (completedCount === 0) {
                cell.classList.add('empty');
                cell.setAttribute('data-tooltip', `Day ${d}: 0/${problems.length} done`);
            } else if (completedCount < problems.length) {
                cell.classList.add('partial');
                cell.setAttribute('data-tooltip', `Day ${d}: ${completedCount}/${problems.length} done`);
            } else {
                cell.classList.add('complete');
                cell.setAttribute('data-tooltip', `Day ${d}: Completed! ✅`);
            }
        }

        cell.onclick = () => filterByDay(d);
        container.appendChild(cell);
    }
}

// Pattern Grid Cards
function renderPatternGrid() {
    const container = document.getElementById('pattern-grid');
    if (!container) return;

    container.innerHTML = '';

    const patternStats = {};
    ROADMAP_DATA.forEach(item => {
        if (!item.pattern || item.pattern === 'Review' || item.pattern === 'Mock') return;
        if (!patternStats[item.pattern]) {
            patternStats[item.pattern] = { total: 0, solved: 0 };
        }
        patternStats[item.pattern].total++;
        if (userProgress[getProblemKey(item)]?.done) {
            patternStats[item.pattern].solved++;
        }
    });

    const activePattern = document.getElementById('filter-pattern').value;

    Object.keys(patternStats).sort().forEach(pat => {
        const { solved, total } = patternStats[pat];
        const percent = Math.round((solved / total) * 100);

        const card = document.createElement('div');
        card.className = `pattern-card ${activePattern === pat ? 'active-filter' : ''}`;
        card.onclick = () => filterByPattern(pat);

        card.innerHTML = `
            <div class="pattern-card-header">
                <span class="pattern-name">${pat}</span>
                <span class="pattern-stats">${solved}/${total} (${percent}%)</span>
            </div>
            <div class="pattern-progress-track">
                <div class="pattern-progress-fill" style="width: ${percent}%;"></div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Helper Filter Actions
function filterByDay(day) {
    const daySelect = document.getElementById('filter-day');
    if (daySelect) {
        daySelect.value = String(day);
        renderProblems();
        daySelect.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function filterByPattern(pattern) {
    const patternSelect = document.getElementById('filter-pattern');
    if (patternSelect) {
        patternSelect.value = pattern;
        renderProblems();
        renderPatternGrid();
        patternSelect.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ==========================================================================
// Notes Modal
// ==========================================================================
function openNotesModal(key, title) {
    currentNoteProblemKey = key;
    const modal = document.getElementById('notes-modal');
    const titleEl = document.getElementById('notes-modal-title');
    const textarea = document.getElementById('notes-textarea');

    if (titleEl) titleEl.textContent = `📝 Notes: ${title}`;
    if (textarea) textarea.value = userProgress[key]?.notes || '';

    if (modal) modal.classList.remove('hidden');
}

function closeNotesModal() {
    const modal = document.getElementById('notes-modal');
    if (modal) modal.classList.add('hidden');
    currentNoteProblemKey = null;
}

function saveNotes() {
    if (!currentNoteProblemKey) return;
    const textarea = document.getElementById('notes-textarea');
    const content = textarea ? textarea.value : '';

    if (!userProgress[currentNoteProblemKey]) {
        userProgress[currentNoteProblemKey] = { done: false, completedAt: null, notes: '' };
    }

    userProgress[currentNoteProblemKey].notes = content;
    saveProgress();
    closeNotesModal();
    renderProblems();
}

// ==========================================================================
// Daily Reminder System
// ==========================================================================
function setupReminderTimer() {
    // Check every 60 seconds
    setInterval(checkDailyReminder, 60000);
}

function checkDailyReminder() {
    if (!reminderConfig.enabled) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Format current hours and minutes
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    if (currentTimeStr >= reminderConfig.time && reminderConfig.lastNotifiedDate !== todayStr) {
        triggerReminderNotification();
        reminderConfig.lastNotifiedDate = todayStr;
        saveReminderConfig();
    }
}

function triggerReminderNotification() {
    // 1. Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('DSA LeetCode 150 Reminder 🔔', {
            body: reminderConfig.message || "Time to practice your daily LeetCode problems!",
            icon: '🧠'
        });
    }

    // 2. In-App Toast
    showToast(reminderConfig.message || "Time to solve today's DSA problems!");
}

function showToast(msg) {
    const toast = document.getElementById('reminder-toast');
    const msgEl = document.getElementById('toast-msg');
    if (toast && msgEl) {
        msgEl.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 8000);
    }
}

function closeToast() {
    const toast = document.getElementById('reminder-toast');
    if (toast) toast.classList.add('hidden');
}

// Reminder Modal
function openReminderModal() {
    const modal = document.getElementById('reminder-modal');
    const timeInput = document.getElementById('reminder-time');
    const enabledInput = document.getElementById('reminder-enabled');
    const msgInput = document.getElementById('reminder-message');
    const statusEl = document.getElementById('reminder-status');

    if (timeInput) timeInput.value = reminderConfig.time || '09:00';
    if (enabledInput) enabledInput.checked = reminderConfig.enabled !== false;
    if (msgInput) msgInput.value = reminderConfig.message || "Time to solve LeetCode problems! 🚀";

    if (statusEl) {
        if ('Notification' in window) {
            statusEl.innerHTML = `<small style="color:var(--text-muted)">Notification permission: <strong>${Notification.permission}</strong></small>`;
        }
    }

    if (modal) modal.classList.remove('hidden');
}

function closeReminderModal() {
    const modal = document.getElementById('reminder-modal');
    if (modal) modal.classList.add('hidden');
}

function saveReminderSettings() {
    const timeInput = document.getElementById('reminder-time');
    const enabledInput = document.getElementById('reminder-enabled');
    const msgInput = document.getElementById('reminder-message');

    reminderConfig.time = timeInput ? timeInput.value : '09:00';
    reminderConfig.enabled = enabledInput ? enabledInput.checked : true;
    reminderConfig.message = msgInput ? msgInput.value : 'Time to solve LeetCode problems! 🚀';

    // Request browser notification permission if enabled
    if (reminderConfig.enabled && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            saveReminderConfig();
            closeReminderModal();
            showToast('Daily reminder updated & notification permission requested!');
        });
    } else {
        saveReminderConfig();
        closeReminderModal();
        showToast('Daily reminder settings saved successfully! ⏰');
    }
}

// ==========================================================================
// Backup, Export & Import
// ==========================================================================
function exportProgress() {
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        progress: userProgress,
        streak: JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK) || '{}'),
        reminder: reminderConfig
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leetcode150_progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported successfully! 📁');
}

function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.progress) {
                userProgress = data.progress;
                saveProgress();
                if (data.reminder) {
                    reminderConfig = data.reminder;
                    saveReminderConfig();
                }
                if (data.streak) {
                    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data.streak));
                }
                updateStats();
                renderProblems();
                renderHeatmap();
                renderPatternGrid();
                showToast('Progress imported successfully! 🚀');
            } else {
                alert('Invalid backup file format.');
            }
        } catch (err) {
            alert('Failed to parse backup file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// ==========================================================================
// Reset All Progress
// ==========================================================================
function openResetModal() {
    const modal = document.getElementById('reset-modal');
    const input = document.getElementById('reset-confirm-input');
    if (input) input.value = '';
    if (modal) modal.classList.remove('hidden');
}

function closeResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) modal.classList.add('hidden');
}

function confirmReset() {
    const input = document.getElementById('reset-confirm-input');
    if (input && input.value.trim().toUpperCase() === 'RESET') {
        userProgress = {};
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.STREAK);
        closeResetModal();
        updateStreak();
        updateStats();
        renderProblems();
        renderHeatmap();
        renderPatternGrid();
        showToast('All progress has been reset. Fresh start! ✨');
    } else {
        alert('Please type RESET in capital letters to confirm.');
    }
}
