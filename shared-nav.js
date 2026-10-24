/**
 * shared-nav.js  —  CodeByArt Platform
 * Injects a consistent, unified, cross-device header + footer on every portal page.
 * Usage: <script src="shared-nav.js" data-page="home|leetcode|roadmap|patterns|cicd|sdet"></script>
 */
(function () {
  'use strict';

  /* ── Constants ── */
  var STORAGE_KEY    = 'cba-user-name';
  var THEME_KEY      = 'cba-theme';

  /* ── Detect current page ── */
  var scriptEl = document.currentScript || (function () {
    var scripts = document.querySelectorAll('script[src*="shared-nav"]');
    return scripts[scripts.length - 1];
  }());
  var PAGE = (scriptEl && scriptEl.getAttribute('data-page')) || 'home';

  /* ══════════════════════════════════════════════════════════════
     LOGO SVG (Shared across all portals)
     ══════════════════════════════════════════════════════════════ */
  var LOGO_SVG = '<svg class="cba-nav-logo-emblem" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs><linearGradient id="cba-sn-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#00e5ff"/><stop offset="50%" stop-color="#6366f1"/><stop offset="100%" stop-color="#b14aff"/>' +
    '</linearGradient></defs>' +
    '<rect width="32" height="32" rx="8" fill="#131926" stroke="rgba(255,255,255,0.14)"/>' +
    '<path d="M10 11L5 16L10 21" stroke="url(#cba-sn-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M22 11L27 16L22 21" stroke="url(#cba-sn-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M18 9L14 23" stroke="url(#cba-sn-grad)" stroke-width="2.5" stroke-linecap="round"/>' +
    '</svg>';

  /* ══════════════════════════════════════════════════════════════
     BUILD NAV HTML
     ══════════════════════════════════════════════════════════════ */
  function buildNav() {
    var tabs = [
      { id: 'home',     href: 'home.html',              icon: '🏠', label: 'Home',           cls: 'cba-tab-home' },
      { id: 'leetcode', href: 'index.html',             icon: '🎯', label: 'LeetCode 150',   cls: 'cba-tab-hide' },
      { id: 'roadmap',  href: 'dsa_roadmap.html',       icon: '🗺️', label: '775-Day Roadmap',cls: 'cba-tab-hide' },
      { id: 'patterns', href: 'dsa_pattern_guide.html', icon: '💡', label: 'Pattern Guide', cls: 'cba-tab-hide' },
    ];

    var tabsHtml = tabs.map(function (t) {
      var active = (t.id === PAGE) ? ' active' : '';
      return '<a href="' + t.href + '" class="cba-nav-tab ' + t.cls + active + '" title="' + t.label + '">' +
        '<span class="cba-nav-tab-icon">' + t.icon + '</span>' +
        '<span class="cba-tab-label">' + t.label + '</span>' +
        '</a>';
    }).join('');

    var moreActive = (PAGE === 'cicd' || PAGE === 'sdet') ? ' active' : '';
    var moreHtml = '<div class="cba-more-dd" id="cba-more-dd">' +
      '<button type="button" class="cba-more-trigger' + moreActive + '" id="cba-more-btn" onclick="cbaToggleMore(event)" aria-haspopup="true" aria-expanded="false" title="More Portals">' +
      '<span class="cba-nav-tab-icon">📦</span>' +
      '<span class="cba-tab-label">More <span class="cba-more-caret">▾</span></span>' +
      '</button>' +
      '<div class="cba-more-menu" id="cba-more-menu" role="menu">' +
        '<div class="cba-menu-section">DevOps &amp; Engineering</div>' +
        '<a href="cicd_guide.html" class="cba-menu-item' + (PAGE === 'cicd' ? ' active' : '') + '">' +
          '<span class="cba-menu-item-icon">🔄</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">CI/CD Complete Guide</span><span class="cba-menu-item-desc">Zero to Production Pipelines</span></div>' +
        '</a>' +
        '<div class="cba-menu-section">Interview &amp; QA</div>' +
        '<a href="sdet_software_engineering_interview_question_bank.html" class="cba-menu-item' + (PAGE === 'sdet' ? ' active' : '') + '">' +
          '<span class="cba-menu-item-icon">🧪</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">SDET &amp; SWE Question Bank</span><span class="cba-menu-item-desc">Coding, QA &amp; System Design</span></div>' +
        '</a>' +
      '</div>' +
    '</div>';

    /* Profile Trigger & Dropdown */
    var profileHtml = '<div class="cba-profile-dd" id="cba-profile-dd">' +
      '<button type="button" class="cba-profile-trigger" id="cba-profile-trigger" onclick="cbaToggleProfile(event)" title="Your Profile" aria-haspopup="true" aria-expanded="false">' +
        '<div class="cba-profile-avatar" id="cba-profile-avatar">?</div>' +
        '<span class="cba-profile-name" id="cba-profile-name">Guest</span>' +
        '<span class="cba-profile-caret">▾</span>' +
      '</button>' +
      '<div class="cba-profile-menu" id="cba-profile-menu" role="menu">' +
        '<div class="cba-profile-header">' +
          '<div class="cba-profile-header-avatar" id="cba-ph-avatar">?</div>' +
          '<div class="cba-profile-header-info">' +
            '<div class="cba-profile-header-name" id="cba-ph-name">Guest User</div>' +
            '<div class="cba-profile-header-sub">CodeByArt Platform</div>' +
          '</div>' +
        '</div>' +
        '<p class="cba-profile-label">Change Display Name</p>' +
        '<input type="text" class="cba-profile-edit-input" id="cba-profile-input" placeholder="Your name..." maxlength="40" autocomplete="given-name" aria-label="Display Name">' +
        '<button type="button" class="cba-profile-save-btn" id="cba-profile-save-btn" onclick="cbaSaveProfileName()">Save Name →</button>' +
        '<button type="button" class="cba-profile-clear-btn" id="cba-profile-clear-btn" onclick="cbaClearProfileName()">✕ Clear &amp; Reset Name</button>' +
      '</div>' +
    '</div>';

    /* Settings Trigger & Dropdown */
    var settingsHtml = '<div class="cba-settings-dd" id="cba-settings-dd">' +
      '<button type="button" class="cba-settings-trigger" id="cba-settings-btn" onclick="cbaToggleSettings(event)" title="Settings &amp; Data" aria-haspopup="true" aria-expanded="false" aria-label="Settings">' +
        '⚙️' +
      '</button>' +
      '<div class="cba-settings-menu" id="cba-settings-menu" role="menu">' +
        '<div class="cba-menu-section">Data Management</div>' +
        '<button type="button" class="cba-menu-item" id="cba-btn-export" onclick="cbaNavExport()">' +
          '<span class="cba-menu-item-icon">📤</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Export Progress</span><span class="cba-menu-item-desc">Download complete JSON backup</span></div>' +
        '</button>' +
        '<button type="button" class="cba-menu-item" id="cba-btn-import" onclick="cbaNavImportClick()">' +
          '<span class="cba-menu-item-icon">📥</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Import Progress</span><span class="cba-menu-item-desc">Restore from JSON backup</span></div>' +
        '</button>' +
        '<input type="file" id="cba-import-file" accept=".json" hidden>' +
        '<button type="button" class="cba-menu-item" id="cba-btn-save" onclick="cbaNavSave()">' +
          '<span class="cba-menu-item-icon">💾</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Save Snapshot</span><span class="cba-menu-item-desc">Force save progress state</span></div>' +
        '</button>' +
        '<div class="cba-menu-divider"></div>' +
        '<div class="cba-menu-section">Preferences</div>' +
        '<button type="button" class="cba-menu-item" id="cba-btn-theme" onclick="cbaToggleTheme()">' +
          '<span class="cba-menu-item-icon" id="cba-theme-icon">🌙</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Toggle Theme</span><span class="cba-menu-item-desc" id="cba-theme-desc">Switch dark / light mode</span></div>' +
        '</button>' +
        '<button type="button" class="cba-menu-item" id="cba-btn-reminder" onclick="cbaOpenReminders()">' +
          '<span class="cba-menu-item-icon">⏰</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Daily Reminder</span><span class="cba-menu-item-desc">Study alert notification</span></div>' +
        '</button>' +
        '<div class="cba-menu-divider"></div>' +
        '<div class="cba-menu-section">Danger Zone</div>' +
        '<button type="button" class="cba-menu-item warn" id="cba-btn-cache-clear" onclick="cbaNavCacheClear()">' +
          '<span class="cba-menu-item-icon">🧹</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Clear Cache</span><span class="cba-menu-item-desc">Remove UI cache (keeps study progress)</span></div>' +
        '</button>' +
        '<button type="button" class="cba-menu-item danger" id="cba-btn-reset-all" onclick="cbaNavReset()">' +
          '<span class="cba-menu-item-icon">🗑️</span>' +
          '<div class="cba-menu-item-body"><span class="cba-menu-item-title">Reset All Progress</span><span class="cba-menu-item-desc">Permanently wipe all platform data</span></div>' +
        '</button>' +
      '</div>' +
    '</div>';

    /* LinkedIn button */
    var linkedinHtml = '<a href="https://www.linkedin.com/in/kamal-patel-61a8201a0/" target="_blank" rel="noopener noreferrer" class="cba-icon-btn cba-hide-xs" title="Kamal Patel on LinkedIn" aria-label="LinkedIn">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z"/>' +
      '</svg>' +
    '</a>';

    return '<nav class="cba-nav" id="cba-top-nav" role="navigation" aria-label="Global navigation">' +
      '<a href="home.html" class="cba-nav-logo" aria-label="CodeByArt Home">' +
        LOGO_SVG +
        '<div class="cba-nav-logo-text">' +
          '<span class="cba-nav-logo-brand">CODE<span class="cba-nav-logo-brand-art">BYART</span></span>' +
          '<span class="cba-nav-logo-sub">SWE Platform</span>' +
        '</div>' +
      '</a>' +
      '<div class="cba-nav-divider" aria-hidden="true"></div>' +
      '<div class="cba-nav-tabs" role="tablist">' +
        tabsHtml + moreHtml +
      '</div>' +
      '<div class="cba-nav-right">' +
        profileHtml +
        settingsHtml +
        linkedinHtml +
      '</div>' +
    '</nav>';
  }

  /* ══════════════════════════════════════════════════════════════
     BUILD FOOTER HTML
     ══════════════════════════════════════════════════════════════ */
  function buildFooter() {
    return '<footer class="cba-footer" role="contentinfo">' +
      '<div class="cba-footer-inner">' +
        '<div>' +
          '<div class="cba-footer-brand">' +
            '<span class="cba-footer-brand-name">CODE<span class="cba-footer-brand-art">BYART</span></span>' +
            '<span style="font-size:0.65rem;color:var(--sn-muted,#4b5563);font-weight:500;margin-left:0.4rem;">SWE Platform</span>' +
          '</div>' +
          '<p class="cba-footer-copy">&copy; 2026 CodeByArt &middot; Engineered by <a href="https://www.linkedin.com/in/kamal-patel-61a8201a0/" target="_blank" rel="noopener noreferrer">Kamal Patel</a></p>' +
        '</div>' +
        '<nav class="cba-footer-links" aria-label="Footer navigation">' +
          '<a href="home.html">Home</a>' +
          '<a href="index.html">LeetCode 150</a>' +
          '<a href="dsa_roadmap.html">Roadmap</a>' +
          '<a href="dsa_pattern_guide.html">Patterns</a>' +
          '<a href="cicd_guide.html">CI/CD</a>' +
          '<a href="sdet_software_engineering_interview_question_bank.html">SDET Bank</a>' +
          '<a href="https://github.com/techiekamal21/dsa-mastery-hub" target="_blank" rel="noopener noreferrer">GitHub ↗</a>' +
        '</nav>' +
      '</div>' +
    '</footer>';
  }

  /* ══════════════════════════════════════════════════════════════
     BUILD MODALS + TOAST HTML
     ══════════════════════════════════════════════════════════════ */
  function buildOverlays() {
    return '<div class="cba-modal-overlay hidden" id="cba-warning-overlay" role="dialog" aria-modal="true">' +
      '<div class="cba-modal" id="cba-warning-modal">' +
        '<div class="cba-modal-emoji" id="cba-warn-emoji">⚠️</div>' +
        '<div class="cba-modal-title" id="cba-warn-title">Are you sure?</div>' +
        '<div class="cba-modal-body" id="cba-warn-body"></div>' +
        '<div class="cba-modal-warn-box" id="cba-warn-box"></div>' +
        '<input type="text" class="cba-modal-input hidden" id="cba-warn-input" placeholder="Type CONFIRM" autocomplete="off">' +
        '<div class="cba-modal-actions">' +
          '<button type="button" class="cba-modal-btn cba-modal-btn-cancel" onclick="cbaCloseWarning()">Cancel</button>' +
          '<button type="button" class="cba-modal-btn cba-modal-btn-danger" id="cba-warn-confirm-btn" onclick="cbaConfirmWarning()">Confirm</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="cba-toast" id="cba-toast" role="status" aria-live="polite"></div>';
  }

  /* ══════════════════════════════════════════════════════════════
     INJECT INTO DOM
     ══════════════════════════════════════════════════════════════ */
  function inject() {
    /* Inject CSS link if not already present in head */
    if (!document.querySelector('link[href*="shared-nav.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'shared-nav.css';
      document.head.insertBefore(link, document.head.firstChild);
    }

    /* Add class to body for spacing & sticky element rules */
    document.body.classList.add('has-cba-nav');
    document.body.style.paddingTop = '58px';

    /* Inject nav at top of body */
    var navEl = document.createElement('div');
    navEl.innerHTML = buildNav();
    document.body.insertBefore(navEl.firstChild, document.body.firstChild);

    /* Inject footer at bottom of body (only if page doesn't have cba-footer) */
    if (!document.querySelector('.cba-footer')) {
      var footerEl = document.createElement('div');
      footerEl.innerHTML = buildFooter();
      document.body.appendChild(footerEl.firstChild);
    }

    /* Inject modals + toast */
    var overlayEl = document.createElement('div');
    overlayEl.innerHTML = buildOverlays();
    while (overlayEl.firstChild) {
      document.body.appendChild(overlayEl.firstChild);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     PROFILE LOGIC & SYNC
     ══════════════════════════════════════════════════════════════ */
  function sanitize(str) {
    return (str || '').replace(/[<>"'&]/g, '').trim().slice(0, 40);
  }

  function getInitial(name) {
    return (name || 'G').charAt(0).toUpperCase();
  }

  function updateProfileUI(name) {
    var trigger = document.getElementById('cba-profile-trigger');
    var avatarEl = document.getElementById('cba-profile-avatar');
    var nameEl   = document.getElementById('cba-profile-name');
    var phAvatar = document.getElementById('cba-ph-avatar');
    var phName   = document.getElementById('cba-ph-name');
    var input    = document.getElementById('cba-profile-input');
    if (!trigger) return;
    var display = name || 'Guest';
    var initial = getInitial(name);
    if (avatarEl) avatarEl.textContent = initial;
    if (nameEl)   nameEl.textContent   = display;
    if (phAvatar) phAvatar.textContent = initial;
    if (phName)   phName.textContent   = name ? name : 'Guest User';
    if (input)    input.value          = name || '';

    /* Sync with home.html welcome bar if present */
    var wbName = document.getElementById('welcomeName');
    if (wbName) wbName.textContent = name || '';
    var wbBar = document.getElementById('welcomeBar');
    if (wbBar) {
      if (name) wbBar.classList.remove('hidden');
      else wbBar.classList.add('hidden');
    }
    var topNavWelcome = document.getElementById('topNavWelcome');
    var topNavName = document.getElementById('topNavName');
    if (topNavWelcome && topNavName) {
      if (name) {
        topNavName.textContent = name;
        topNavWelcome.style.display = 'inline-flex';
      } else {
        topNavWelcome.style.display = 'none';
      }
    }
  }

  function loadProfile() {
    var saved = '';
    try { saved = sanitize(localStorage.getItem(STORAGE_KEY) || ''); } catch (e) {}
    updateProfileUI(saved);
  }

  window.cbaUpdateProfile = function (name) {
    var clean = sanitize(name);
    updateProfileUI(clean);
  };

  window.cbaSaveProfileName = function () {
    var input = document.getElementById('cba-profile-input');
    if (!input) return;
    var name = sanitize(input.value);
    if (!name) {
      input.style.borderColor = 'rgba(244,63,94,0.6)';
      cbaToast('⚠️ Please enter a name first', 'warn');
      return;
    }
    input.style.borderColor = '';
    try { localStorage.setItem(STORAGE_KEY, name); } catch (e) {}
    updateProfileUI(name);
    cbaToast('✅ Name updated to "' + name + '"', 'success');
    closeAllDropdowns();
  };

  window.cbaClearProfileName = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    updateProfileUI('');
    cbaToast('👋 Name cleared — you are now Guest', 'warn');
    closeAllDropdowns();
  };

  /* ══════════════════════════════════════════════════════════════
     DROPDOWN TOGGLING
     ══════════════════════════════════════════════════════════════ */
  function closeAllDropdowns() {
    ['cba-more-dd', 'cba-profile-dd', 'cba-settings-dd'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('open');
    });
  }

  window.cbaToggleMore = function (e) {
    if (e) e.stopPropagation();
    var el = document.getElementById('cba-more-dd');
    var wasOpen = el && el.classList.contains('open');
    closeAllDropdowns();
    if (el && !wasOpen) el.classList.add('open');
  };

  window.cbaToggleProfile = function (e) {
    if (e) e.stopPropagation();
    var el = document.getElementById('cba-profile-dd');
    var wasOpen = el && el.classList.contains('open');
    closeAllDropdowns();
    if (el && !wasOpen) {
      el.classList.add('open');
      setTimeout(function () {
        var inp = document.getElementById('cba-profile-input');
        if (inp) inp.focus();
      }, 120);
    }
  };

  window.cbaToggleSettings = function (e) {
    if (e) e.stopPropagation();
    var el = document.getElementById('cba-settings-dd');
    var wasOpen = el && el.classList.contains('open');
    closeAllDropdowns();
    if (el && !wasOpen) el.classList.add('open');
  };

  /* Close on outside click */
  document.addEventListener('click', function (e) {
    var nav = document.getElementById('cba-top-nav');
    if (nav && !nav.contains(e.target)) closeAllDropdowns();
  });

  /* ESC to close dropdowns & modals */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      cbaCloseWarning();
    }
  });

  /* ══════════════════════════════════════════════════════════════
     TOAST
     ══════════════════════════════════════════════════════════════ */
  var toastTimer = null;
  window.cbaToast = function (msg, type) {
    var el = document.getElementById('cba-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'cba-toast ' + (type || '');
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 3200);
  };

  /* ══════════════════════════════════════════════════════════════
     WARNING MODAL
     ══════════════════════════════════════════════════════════════ */
  var pendingAction = null;
  var requiredConfirmation = null;

  function showWarning(opts) {
    var overlay    = document.getElementById('cba-warning-overlay');
    var emojiEl    = document.getElementById('cba-warn-emoji');
    var titleEl    = document.getElementById('cba-warn-title');
    var bodyEl     = document.getElementById('cba-warn-body');
    var warnBoxEl  = document.getElementById('cba-warn-box');
    var inputEl    = document.getElementById('cba-warn-input');
    var confirmBtn = document.getElementById('cba-warn-confirm-btn');
    if (!overlay) return;

    if (emojiEl) emojiEl.textContent = opts.emoji || '⚠️';
    if (titleEl) titleEl.textContent = opts.title || 'Are you sure?';
    if (bodyEl)  bodyEl.innerHTML    = opts.body  || '';

    if (warnBoxEl) {
      warnBoxEl.textContent = opts.warnBox || '';
      warnBoxEl.style.display = opts.warnBox ? '' : 'none';
    }

    requiredConfirmation = opts.requiredConfirmation || (opts.requiresInput ? 'RESET' : null);
    if (inputEl) {
      inputEl.value = '';
      inputEl.classList.toggle('hidden', !opts.requiresInput);
      inputEl.placeholder = opts.inputPlaceholder || 'Type CONFIRM';
      if (opts.requiresInput) {
        setTimeout(function () { inputEl.focus(); }, 120);
      }
    }

    if (confirmBtn) {
      confirmBtn.textContent = opts.confirmLabel || 'Confirm';
      confirmBtn.className = 'cba-modal-btn ' + (opts.type === 'danger' ? 'cba-modal-btn-danger' : 'cba-modal-btn-primary');
    }

    pendingAction = opts.onConfirm || null;
    overlay.classList.remove('hidden');
    closeAllDropdowns();
  }

  window.cbaCloseWarning = function () {
    var overlay = document.getElementById('cba-warning-overlay');
    if (overlay) overlay.classList.add('hidden');
    pendingAction = null;
    requiredConfirmation = null;
  };

  window.cbaConfirmWarning = function () {
    var inputEl = document.getElementById('cba-warn-input');
    if (inputEl && !inputEl.classList.contains('hidden') && requiredConfirmation) {
      var val = (inputEl.value || '').trim().toUpperCase();
      if (val !== requiredConfirmation.toUpperCase()) {
        inputEl.style.borderColor = 'rgba(244,63,94,0.6)';
        cbaToast('❌ Type ' + requiredConfirmation + ' to confirm', 'error');
        return;
      }
    }
    if (pendingAction) pendingAction();
    cbaCloseWarning();
  };

  /* Close on overlay backdrop click */
  document.addEventListener('click', function (e) {
    var overlay = document.getElementById('cba-warning-overlay');
    if (overlay && e.target === overlay) cbaCloseWarning();
  });

  /* ══════════════════════════════════════════════════════════════
     SETTINGS & DATA ACTIONS
     ══════════════════════════════════════════════════════════════ */

  /* ── Export ── */
  window.cbaNavExport = function () {
    closeAllDropdowns();
    try {
      var fullDump = {};
      for (var j = 0; j < localStorage.length; j++) {
        var key = localStorage.key(j);
        if (key) {
          try { fullDump[key] = localStorage.getItem(key); } catch (_) {}
        }
      }
      var blob = new Blob([JSON.stringify(fullDump, null, 2)], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href = url;
      a.download = 'codebyart-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      cbaToast('📤 Progress exported successfully!', 'success');
    } catch (err) {
      cbaToast('❌ Export failed: ' + err.message, 'error');
    }
  };

  /* ── Import ── */
  window.cbaNavImportClick = function () {
    closeAllDropdowns();
    showWarning({
      emoji: '📥',
      title: 'Import Progress',
      body: 'Select a <strong>JSON backup file</strong> previously exported from this platform. This will merge and restore your progress.',
      warnBox: '⚠️ Existing data for matching keys will be overwritten. Export first if you want a backup!',
      type: 'primary',
      confirmLabel: 'Choose File →',
      onConfirm: function () {
        var inp = document.getElementById('cba-import-file');
        if (inp) inp.click();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('cba-import-file');
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          try {
            var data = JSON.parse(ev.target.result);
            if (typeof data !== 'object' || data === null) throw new Error('Invalid JSON format');
            var count = 0;
            Object.keys(data).forEach(function (k) {
              try { localStorage.setItem(k, data[k]); count++; } catch (_) {}
            });
            cbaToast('📥 Imported ' + count + ' items! Refreshing…', 'success');
            setTimeout(function () { location.reload(); }, 1200);
          } catch (err) {
            cbaToast('❌ Invalid backup file: ' + err.message, 'error');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }
  });

  /* ── Save Snapshot ── */
  window.cbaNavSave = function () {
    closeAllDropdowns();
    if (typeof window.saveProgress === 'function') {
      window.saveProgress();
    }
    cbaToast('💾 Progress saved to localStorage!', 'success');
  };

  /* ── Theme Toggle ── */
  window.cbaToggleTheme = function () {
    closeAllDropdowns();
    if (typeof window.toggleTheme === 'function') {
      window.toggleTheme();
    } else {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    }
    updateThemeUI();
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    cbaToast((currentTheme === 'light' ? '☀️' : '🌙') + ' Switched to ' + currentTheme + ' mode', 'success');
  };

  function updateThemeUI() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var icon = document.getElementById('cba-theme-icon');
    var desc = document.getElementById('cba-theme-desc');
    if (icon) icon.textContent = current === 'dark' ? '☀️' : '🌙';
    if (desc) desc.textContent = current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }

  /* ── Daily Reminders ── */
  window.cbaOpenReminders = function () {
    closeAllDropdowns();
    if (typeof window.openReminderModal === 'function') {
      window.openReminderModal();
    } else {
      cbaToast('⏰ Daily reminders are configured in LeetCode 150 Tracker', 'warn');
      setTimeout(function () {
        if (PAGE !== 'leetcode') location.href = 'index.html';
      }, 1400);
    }
  };

  /* ── Clear Cache ── */
  window.cbaNavCacheClear = function () {
    closeAllDropdowns();
    showWarning({
      emoji: '🧹',
      title: 'Clear Cache?',
      body: 'This removes temporary UI state (theme, collapse states, filters) but <strong>keeps all your study progress, solved questions, and notes intact</strong>.',
      warnBox: '⚠️ The page will reload after clearing cache. Your LeetCode & study progress is completely safe.',
      type: 'primary',
      confirmLabel: 'Clear Cache',
      onConfirm: function () {
        var uiKeys = ['cba-theme', 'cba-sidebar', 'cba-collapse', 'lc-theme', 'sdet-collapse', 'filter-state'];
        uiKeys.forEach(function (k) {
          try { localStorage.removeItem(k); } catch (_) {}
        });
        cbaToast('🧹 UI cache cleared! Reloading…', 'success');
        setTimeout(function () { location.reload(); }, 800);
      }
    });
  };

  /* ── Reset All Progress ── */
  window.cbaNavReset = function () {
    closeAllDropdowns();
    showWarning({
      emoji: '🗑️',
      title: 'Reset ALL Progress',
      body: '<strong>This permanently wipes all platform data</strong> — all LeetCode progress, notes, streak data, roadmap progress, and your profile name. This action cannot be undone.',
      warnBox: '⚠️ Make sure you Export first! Type RESET below to confirm irreversible wipe.',
      requiresInput: true,
      requiredConfirmation: 'RESET',
      inputPlaceholder: 'Type RESET to confirm',
      type: 'danger',
      confirmLabel: '🗑️ Reset Everything',
      onConfirm: function () {
        try { localStorage.clear(); } catch (e) {}
        cbaToast('🗑️ All data reset. Redirecting to Home…', 'warn');
        setTimeout(function () { location.href = 'home.html'; }, 1200);
      }
    });
  };

  /* ══════════════════════════════════════════════════════════════
     SCROLL SHADOW
     ══════════════════════════════════════════════════════════════ */
  function initScrollShadow() {
    var nav = document.getElementById('cba-top-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════════ */
  function init() {
    inject();
    loadProfile();
    updateThemeUI();
    initScrollShadow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
