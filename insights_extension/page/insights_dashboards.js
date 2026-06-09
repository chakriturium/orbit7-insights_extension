
orbit7.pages['insights-dashboards'] = orbit7.pages['insights-dashboards'] || {};

orbit7.pages['insights-dashboards'].on_page_load = function(wrapper) {
    let page = orbit7.ui.make_app_page({
        parent: wrapper,
        title: __('Insights Dashboards'),
        single_column: true
    });

    wrapper.page_instance = page;

    orbit7.dom.set_style(`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        /* ── Root Layout ── */
        .insights-layout-wrapper {
            display: flex;
            gap: 0;
            height: calc(100vh - 60px);
            margin-top: -15px;
            margin-bottom: -15px;
            font-family: 'DM Sans', sans-serif;
            background: var(--bg-color);
            overflow: hidden;
        }

        /* ── Sidebar ── */
        .insights-sidebar {
            width: 240px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            background: var(--card-bg);
            border-right: 1px solid var(--border-color);
            padding: 0;
            overflow: hidden;
            position: relative;
        }

        .insights-sidebar::before {
            content: '';
            display: block;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color-light, #a78bfa) 100%);
            flex-shrink: 0;
        }

        .insights-sidebar-header {
            padding: 20px 18px 12px;
            border-bottom: 1px solid var(--border-color);
        }

        .insights-sidebar-eyebrow {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 1.8px;
            text-transform: uppercase;
            color: var(--primary-color);
            margin-bottom: 4px;
            font-family: 'DM Mono', monospace;
        }

        .insights-sidebar-title-text {
            font-size: 15px;
            font-weight: 600;
            color: var(--text-color);
            line-height: 1.2;
        }

        .insights-sidebar-search {
            padding: 10px 14px;
            border-bottom: 1px solid var(--border-color);
        }

        .insights-search-input {
            width: 100%;
            padding: 7px 10px 7px 30px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 12px;
            font-family: 'DM Sans', sans-serif;
            color: var(--text-color);
            background: var(--bg-color);
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }

        .insights-search-input:focus {
            border-color: var(--primary-color);
        }

        .insights-search-wrap {
            position: relative;
        }

        .insights-search-wrap .search-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 13px;
            pointer-events: none;
        }

        .insights-menu-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 10px 10px;
        }

        .insights-menu-scroll::-webkit-scrollbar { width: 4px; }
        .insights-menu-scroll::-webkit-scrollbar-track { background: transparent; }
        .insights-menu-scroll::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }

        .insights-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        /* ── Each sidebar list item — needs relative for pin button ── */
        .insights-menu li {
            margin-bottom: 2px;
            position: relative;
        }

        .insights-nav-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 36px 9px 12px; /* right padding reserves space for pin btn */
            border-radius: 7px;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 13px;
            font-weight: 400;
            transition: background 0.15s ease, color 0.15s ease;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
        }

        .insights-nav-link .nav-icon {
            width: 24px;
            height: 24px;
            border-radius: 5px;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.15s, border-color 0.15s;
        }

        .insights-nav-link .nav-icon i {
            font-size: 11px;
            color: var(--text-muted);
            transition: color 0.15s;
        }

        .insights-nav-link .nav-label {
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }

        .insights-nav-link:hover {
            background: var(--fg-color);
            color: var(--text-color);
            text-decoration: none;
        }

        .insights-nav-link:hover .nav-icon {
            background: var(--control-bg);
            border-color: var(--primary-color);
        }

        .insights-nav-link:hover .nav-icon i {
            color: var(--primary-color);
        }

        .insights-nav-link.active {
            background: var(--primary-color);
            color: #fff;
            font-weight: 500;
        }

        .insights-nav-link.active .nav-icon {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.3);
        }

        .insights-nav-link.active .nav-icon i {
            color: #fff;
        }

        /* ── Pin-to-Workspace button ── */
        .insights-pin-btn {
            display: none;          /* hidden by default; shown on li:hover */
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 22px;
            height: 22px;
            border-radius: 5px;
            background: var(--control-bg);
            border: 1px solid var(--border-color);
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: background 0.15s, border-color 0.15s;
        }

        .insights-pin-btn i {
            font-size: 10px;
            color: var(--text-muted);
            pointer-events: none;
        }

        .insights-menu li:hover .insights-pin-btn {
            display: flex;
        }

        .insights-pin-btn:hover {
            background: var(--primary-color);
            border-color: var(--primary-color);
        }

        .insights-pin-btn:hover i { color: #fff; }

        /* Pinned state — always visible with accent colour */
        .insights-pin-btn.pinned {
            display: flex;
            background: var(--fg-color);
        }

        .insights-pin-btn.pinned i { color: var(--primary-color); }

        /* On an active (purple) row, invert the pin button colours */
        li:has(.insights-nav-link.active) .insights-pin-btn {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.3);
        }

        li:has(.insights-nav-link.active) .insights-pin-btn i { color: #fff; }
        li:has(.insights-nav-link.active) .insights-pin-btn.pinned i { color: #fff; }

        /* ── Sidebar footer ── */
        .insights-sidebar-footer {
            padding: 10px 14px;
            border-top: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .insights-count-badge {
            font-size: 11px;
            color: var(--text-muted);
            font-family: 'DM Mono', monospace;
        }

        /* ── Content Area ── */
        .insights-content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: var(--bg-color);
        }

        .insights-content-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: var(--card-bg);
            border-bottom: 1px solid var(--border-color);
            flex-shrink: 0;
        }

        .insights-breadcrumb {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        }

        .insights-breadcrumb .crumb-root { color: var(--text-muted); font-weight: 400; }
        .insights-breadcrumb .crumb-sep  { color: var(--border-color); font-size: 16px; }
        .insights-breadcrumb .crumb-current { color: var(--text-color); font-weight: 500; }

        .insights-topbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .insights-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            background: var(--fg-color);
            color: var(--text-muted);
            border: 1px solid var(--border-color);
        }

        .insights-badge .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
        }

        .insights-content-card {
            flex: 1;
            overflow: hidden;
            position: relative;
            background: var(--bg-color);
        }

        /* ── Empty State ── */
        .insights-empty-state {
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: var(--bg-color);
        }

        .insights-empty-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 18px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
        }

        .insights-empty-icon-wrap::after {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: 18px;
            box-shadow: 0 0 0 6px var(--fg-color);
        }

        .insights-empty-icon-wrap i { font-size: 28px; color: var(--text-muted); }
        .insights-empty-title  { font-size: 16px; font-weight: 600; color: var(--text-color); margin: 0 0 6px; }
        .insights-empty-desc   { font-size: 13px; color: var(--text-muted); max-width: 260px; text-align: center; line-height: 1.6; }

        .insights-empty-hint {
            margin-top: 20px;
            padding: 8px 16px;
            border: 1px dashed var(--border-color);
            border-radius: 8px;
            font-size: 12px;
            color: var(--text-muted);
            font-family: 'DM Mono', monospace;
        }

        /* ── Loading skeleton ── */
        .insights-skeleton { padding: 4px 0; }

        .insights-skeleton-item {
            height: 36px;
            border-radius: 7px;
            background: var(--fg-color);
            margin-bottom: 3px;
            animation: sk-pulse 1.4s ease-in-out infinite;
        }

        .insights-skeleton-item:nth-child(2) { opacity: 0.75; animation-delay: 0.15s; }
        .insights-skeleton-item:nth-child(3) { opacity: 0.5;  animation-delay: 0.3s;  }

        @keyframes sk-pulse {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1;  }
        }

        /* ── Iframe ── */
        #insights-embed-iframe { width: 100%; height: 100%; border: none; display: block; }

        /* ════════════════════════════════════════════════
           Workspace Picker Dialog
        ════════════════════════════════════════════════ */

        .iws-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.35);
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: iws-fadein 0.15s ease;
        }

        @keyframes iws-fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        .iws-dialog {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.20);
            width: 380px;
            max-width: 95vw;
            overflow: hidden;
            animation: iws-slidein 0.18s ease;
        }

        @keyframes iws-slidein {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        .iws-dialog-header {
            padding: 18px 20px 14px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .iws-dialog-icon {
            width: 38px;
            height: 38px;
            border-radius: 9px;
            background: var(--fg-color);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .iws-dialog-icon i { font-size: 15px; color: var(--primary-color); }

        .iws-dialog-title-wrap { flex: 1; min-width: 0; }

        .iws-dialog-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
            margin: 0 0 3px;
        }

        .iws-dialog-subtitle {
            font-size: 12px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .iws-close-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 14px;
            flex-shrink: 0;
            transition: background 0.15s;
        }

        .iws-close-btn:hover { background: var(--fg-color); color: var(--text-color); }

        /* Search inside dialog */
        .iws-dialog-search {
            padding: 10px 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .iws-dialog-search-wrap { position: relative; }

        .iws-dialog-search-wrap .iws-search-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 12px;
            pointer-events: none;
        }

        .iws-dialog-search-input {
            width: 100%;
            padding: 6px 10px 6px 28px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 12px;
            font-family: 'DM Sans', sans-serif;
            color: var(--text-color);
            background: var(--bg-color);
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }

        .iws-dialog-search-input:focus { border-color: var(--primary-color); }

        .iws-dialog-body {
            padding: 10px 12px;
            max-height: 260px;
            overflow-y: auto;
        }

        .iws-dialog-body::-webkit-scrollbar { width: 4px; }
        .iws-dialog-body::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }

        .iws-workspace-list { list-style: none; padding: 0; margin: 0; }

        .iws-workspace-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 10px;
            border-radius: 7px;
            cursor: pointer;
            transition: background 0.12s;
            border: 1px solid transparent;
            margin-bottom: 2px;
        }

        .iws-workspace-item:hover {
            background: var(--fg-color);
            border-color: var(--border-color);
        }

        .iws-workspace-item.selected {
            background: var(--control-bg);
            border-color: var(--primary-color);
        }

        .iws-ws-icon {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: var(--fg-color);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.15s, border-color 0.15s;
        }

        .iws-ws-icon i { font-size: 11px; color: var(--text-muted); }

        .iws-workspace-item.selected .iws-ws-icon {
            background: var(--primary-color);
            border-color: var(--primary-color);
        }

        .iws-workspace-item.selected .iws-ws-icon i { color: #fff; }

        .iws-ws-name { font-size: 13px; color: var(--text-color); flex: 1; }

        .iws-ws-check {
            font-size: 13px;
            color: var(--primary-color);
            display: none;
        }

        .iws-workspace-item.selected .iws-ws-check { display: block; }

        .iws-loading-row, .iws-empty-row {
            text-align: center;
            padding: 24px 16px;
            font-size: 12px;
            color: var(--text-muted);
        }

        .iws-dialog-footer {
            padding: 12px 16px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            align-items: center;
        }

        .iws-footer-hint {
            flex: 1;
            font-size: 11px;
            color: var(--text-muted);
            font-family: 'DM Mono', monospace;
        }

        .iws-btn {
            padding: 7px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid transparent;
            font-family: 'DM Sans', sans-serif;
            transition: all 0.15s;
        }

        .iws-btn-cancel {
            background: var(--fg-color);
            border-color: var(--border-color);
            color: var(--text-muted);
        }

        .iws-btn-cancel:hover { color: var(--text-color); border-color: var(--text-muted); }

        .iws-btn-confirm {
            background: var(--primary-color);
            color: #fff;
        }

        .iws-btn-confirm:hover   { opacity: 0.88; }
        .iws-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
    `);

    // ── Build Layout ──────────────────────────────────────────────────────────
    $(page.body).html(`
        <div class="insights-layout-wrapper">

            <!-- Sidebar -->
            <div class="insights-sidebar">
                <div class="insights-sidebar-header">
                    <div class="insights-sidebar-eyebrow">${__('Analytics')}</div>
                    <div class="insights-sidebar-title-text">${__('Dashboards')}</div>
                </div>

                <div class="insights-sidebar-search">
                    <div class="insights-search-wrap">
                        <i class="fa fa-search search-icon"></i>
                        <input type="text" class="insights-search-input"
                               id="insights-search-box"
                               placeholder="${__('Search dashboards…')}" />
                    </div>
                </div>

                <div class="insights-menu-scroll">
                    <ul id="insights-custom-sidebar" class="insights-menu">
                        <div class="insights-skeleton">
                            <div class="insights-skeleton-item"></div>
                            <div class="insights-skeleton-item"></div>
                            <div class="insights-skeleton-item"></div>
                        </div>
                    </ul>
                </div>

                <div class="insights-sidebar-footer">
                    <span class="insights-count-badge" id="insights-dash-count">—</span>
                </div>
            </div>

            <!-- Content Area -->
            <div class="insights-content-area">
                <div class="insights-content-topbar" id="insights-topbar">
                    <div class="insights-breadcrumb">
                        <span class="crumb-root">${__('Dashboards')}</span>
                        <span class="crumb-sep">›</span>
                        <span class="crumb-current" id="insights-crumb-label">${__('Select a dashboard')}</span>
                    </div>
                    <div class="insights-topbar-actions">
                        <span class="insights-badge">
                            <span class="dot"></span>
                            ${__('Live')}
                        </span>
                    </div>
                </div>

                <div id="insights-iframe-container" class="insights-content-card"></div>
            </div>
        </div>
    `);

    // ── Fetch sidebar items ───────────────────────────────────────────────────
    orbit7.call({
        method: "insights_sidebar.api.get_sidebar_items",
        callback: function(r) {
            const $sidebar = $('#insights-custom-sidebar');
            $sidebar.empty();

            if (!r.message || !r.message.length) {
                $sidebar.append(`
                    <li style="padding: 10px 12px;">
                        <span style="font-size:12px;color:var(--text-muted);">${__('No dashboards available')}</span>
                    </li>
                `);
                $('#insights-dash-count').text('0 dashboards');
                return;
            }

            const count = r.message.length;
            $('#insights-dash-count').text(count + ' dashboard' + (count !== 1 ? 's' : ''));

            r.message.forEach(item => {
                $sidebar.append(`
                    <li>
                        <a href="/app/insights-dashboards/${item.dashboard}"
                           class="insights-nav-link"
                           data-dashboard="${item.dashboard}"
                           data-label="${item.label}">
                            <span class="nav-icon" aria-hidden="true">
                                <i class="fa fa-bar-chart"></i>
                            </span>
                            <span class="nav-label">${item.label}</span>
                        </a>
                        <button class="insights-pin-btn"
                                title="${__('Add to Workspace')}"
                                data-dashboard="${item.dashboard}"
                                data-label="${item.label}">
                            <i class="fa fa-thumb-tack"></i>
                        </button>
                    </li>
                `);
            });

            // ── Dashboard click ───────────────────────────────────────────
            $('.insights-nav-link').on('click', function(e) {
                e.preventDefault();
                orbit7.set_route('insights-dashboards', $(this).attr('data-dashboard'));
            });

            // ── Search / filter ───────────────────────────────────────────
            $('#insights-search-box').on('input', function() {
                const q = $(this).val().toLowerCase().trim();
                $('.insights-nav-link').each(function() {
                    const label = $(this).attr('data-label') || '';
                    $(this).closest('li').toggle(label.toLowerCase().includes(q));
                });
            });

            // ── Pin button click — open workspace picker ──────────────────
            $('.insights-pin-btn').on('click', function(e) {
                e.stopPropagation();
                const dashboard = $(this).attr('data-dashboard');
                const label     = $(this).attr('data-label');
                open_workspace_picker(dashboard, label, $(this));
            });

            orbit7.pages['insights-dashboards'].on_page_show(wrapper);
        }
    });
};

// ── Workspace Picker ──────────────────────────────────────────────────────────
function open_workspace_picker(dashboard_name, dashboard_label, $pin_btn) {
    // Remove any stale overlay
    $('.iws-overlay').remove();

    const $overlay = $(`
        <div class="iws-overlay" id="iws-overlay">
            <div class="iws-dialog" role="dialog" aria-modal="true"
                 aria-label="${__('Add to Workspace')}">

                <div class="iws-dialog-header">
                    <div class="iws-dialog-icon">
                        <i class="fa fa-thumb-tack"></i>
                    </div>
                    <div class="iws-dialog-title-wrap">
                        <p class="iws-dialog-title">${__('Add to Workspace')}</p>
                        <p class="iws-dialog-subtitle" title="${dashboard_label}">${dashboard_label}</p>
                    </div>
                    <button class="iws-close-btn" id="iws-close" aria-label="${__('Close')}">
                        <i class="fa fa-times"></i>
                    </button>
                </div>

                <div class="iws-dialog-search">
                    <div class="iws-dialog-search-wrap">
                        <i class="fa fa-search iws-search-icon"></i>
                        <input type="text" class="iws-dialog-search-input"
                               id="iws-ws-search"
                               placeholder="${__('Filter workspaces…')}" />
                    </div>
                </div>

                <div class="iws-dialog-body">
                    <ul class="iws-workspace-list" id="iws-workspace-list">
                        <li class="iws-loading-row">
                            <i class="fa fa-spinner fa-spin mr-1"></i> ${__('Loading workspaces…')}
                        </li>
                    </ul>
                </div>

                <div class="iws-dialog-footer">
                    <span class="iws-footer-hint" id="iws-footer-hint"></span>
                    <button class="iws-btn iws-btn-cancel" id="iws-cancel">${__('Cancel')}</button>
                    <button class="iws-btn iws-btn-confirm" id="iws-confirm" disabled>
                        ${__('Add Shortcut')}
                    </button>
                </div>
            </div>
        </div>
    `);

    $('body').append($overlay);

    let selected_workspace   = null;
    let all_workspaces       = [];

    // Close handlers
    function close_dialog() { $overlay.remove(); }
    $('#iws-close, #iws-cancel').on('click', close_dialog);
    $overlay.on('click', function(e) {
        if ($(e.target).is('.iws-overlay')) close_dialog();
    });
    $(document).on('keydown.iws', function(e) {
        if (e.key === 'Escape') { close_dialog(); $(document).off('keydown.iws'); }
    });

    // Render workspace rows
    function render_workspaces(list) {
        const $list = $('#iws-workspace-list');
        $list.empty();

        if (!list.length) {
            $list.append(`<li class="iws-empty-row">${__('No workspaces found')}</li>`);
            return;
        }

        list.forEach(ws => {
            const icon = ws.icon || 'fa fa-th-large';
            $list.append(`
                <li class="iws-workspace-item" data-name="${ws.name}" data-title="${ws.title}">
                    <span class="iws-ws-icon">
                        <i class="${icon}"></i>
                    </span>
                    <span class="iws-ws-name">${ws.title || ws.name}</span>
                    <i class="fa fa-check iws-ws-check"></i>
                </li>
            `);
        });

        // Row click — select workspace
        $('.iws-workspace-item').on('click', function() {
            $('.iws-workspace-item').removeClass('selected');
            $(this).addClass('selected');
            selected_workspace = { name: $(this).attr('data-name'), title: $(this).attr('data-title') };
            $('#iws-confirm').prop('disabled', false);
            $('#iws-footer-hint').text(__('Workspace: ') + selected_workspace.title);
        });
    }

    // Fetch all workspaces the user can access
    orbit7.call({
        method: 'orbit7.client.get_list',
        args: {
            doctype: 'Workspace',
            fields:  ['name', 'title', 'icon'],
            filters: { 'for_user': '' },   // public workspaces
            limit:   100
        },
        callback: function(r) {
            all_workspaces = r.message || [];
            render_workspaces(all_workspaces);
        }
    });

    // Filter workspaces in dialog
    $('#iws-ws-search').on('input', function() {
        const q = $(this).val().toLowerCase().trim();
        const filtered = all_workspaces.filter(ws =>
            (ws.title || ws.name).toLowerCase().includes(q)
        );
        render_workspaces(filtered);
        // Re-apply selection highlight if still in filtered list
        if (selected_workspace) {
            $(`.iws-workspace-item[data-name="${selected_workspace.name}"]`).addClass('selected');
        }
    });

    // Confirm — write shortcut to the selected workspace
    $('#iws-confirm').on('click', function() {
        if (!selected_workspace) return;

        const $btn = $(this);
        $btn.prop('disabled', true).text(__('Saving…'));

        // Fetch the full Workspace doc, add shortcut, then save
        orbit7.call({
            method: 'orbit7.client.get',
            args: { doctype: 'Workspace', name: selected_workspace.name },
            callback: function(r) {
                if (!r.message) {
                    orbit7.msgprint(__('Could not load workspace. Please try again.'));
                    $btn.prop('disabled', false).text(__('Add Shortcut'));
                    return;
                }

                const doc = r.message;

                // Guard against duplicate shortcuts
                const already_exists = (doc.shortcuts || []).some(s =>
                    s.type === 'URL' && s.url && s.url.includes(dashboard_name)
                );

                if (already_exists) {
                    orbit7.show_alert({
                        message: __('This dashboard is already pinned to {0}', [selected_workspace.title]),
                        indicator: 'orange'
                    }, 4);
                    close_dialog();
                    return;
                }

                // Append shortcut row
                if (!doc.shortcuts) doc.shortcuts = [];
                doc.shortcuts.push({
                    doctype: 'Workspace Shortcut',
                    type:    'URL',
                    label:   dashboard_label,
                    url:     `/app/insights-dashboards/${dashboard_name}`,
                    icon:    'bar-chart'
                });

                orbit7.call({
                    method: 'orbit7.client.save',
                    args:   { doc: doc },
                    callback: function(save_r) {
                        if (save_r.message) {
                            // Mark the pin button as pinned
                            $pin_btn.addClass('pinned')
                                    .attr('title', __('Pinned to ') + selected_workspace.title);

                            orbit7.show_alert({
                                message:   __('"{0}" added to {1}', [dashboard_label, selected_workspace.title]),
                                indicator: 'green'
                            }, 5);

                            close_dialog();
                        } else {
                            orbit7.msgprint(__('Failed to save. Please try again.'));
                            $btn.prop('disabled', false).text(__('Add Shortcut'));
                        }
                    }
                });
            }
        });
    });
}

// ── on_page_show ──────────────────────────────────────────────────────────────
orbit7.pages['insights-dashboards'].on_page_show = function(wrapper) {
    if (!wrapper.page_instance) return;

    const route          = orbit7.get_route();
    const dashboard_name = route[1];

    $('.insights-nav-link').removeClass('active');

    const $container = $('#insights-iframe-container');

    if (!dashboard_name) {
        $('#insights-crumb-label').text(__('Select a dashboard'));
        $container.html(`
            <div class="insights-empty-state">
                <div class="insights-empty-icon-wrap">
                    <i class="fa fa-pie-chart"></i>
                </div>
                <p class="insights-empty-title">${__('No Dashboard Selected')}</p>
                <p class="insights-empty-desc">${__('Choose a dashboard from the sidebar to view your data insights.')}</p>
                <div class="insights-empty-hint">← ${__('Pick one from the list')}</div>
            </div>
        `);
        return;
    }

    const $activeLink = $(`.insights-nav-link[data-dashboard="${dashboard_name}"]`);
    $activeLink.addClass('active');
    $('#insights-crumb-label').text($activeLink.attr('data-label') || dashboard_name);

    // Load iframe
    $container.html(`
        <iframe id="insights-embed-iframe"
                src="/insights/dashboards/${dashboard_name}?embed=true"
                allowfullscreen></iframe>
    `);

    // ── Robust Insights sidebar suppressor (Vue SPA) ─────────────────────────
    $('#insights-embed-iframe').on('load', function() {
        try {
            const iframeDoc = this.contentDocument || this.contentWindow.document;

            // Layer 1 — persistent CSS
            const style = iframeDoc.createElement('style');
            style.id    = 'orbit7InsightsEmbedHide';
            style.textContent = `
                aside, nav, header,
                [class*="sidebar"], [class*="Sidebar"],
                .w-48, .w-52, .w-56, .w-60, .w-64, .w-72,
                .orbit7-ui-sidebar, .layout-side-section,
                [data-v-app] > div > aside,
                [data-v-app] > div > nav {
                    display: none !important;
                    width: 0 !important; min-width: 0 !important;
                    overflow: hidden !important;
                }
                main, .flex-1, [class*="main-content"], [class*="content-area"],
                .flex > main, .flex > .flex-1, .layout-main, .page-content {
                    margin-left: 0 !important; padding-left: 0 !important;
                    width: 100% !important; max-width: 100% !important;
                    flex: 1 1 0% !important;
                }
            `;
            if (iframeDoc.head) {
                iframeDoc.head.appendChild(style);
            } else {
                const ho = new MutationObserver(() => {
                    if (iframeDoc.head) { iframeDoc.head.appendChild(style); ho.disconnect(); }
                });
                ho.observe(iframeDoc.documentElement, { childList: true });
            }

            // Layer 2 — MutationObserver script injected INTO the iframe
            // Catches the sidebar after Vue mounts it (load fires before Vue renders)
            const script = iframeDoc.createElement('script');
            script.textContent = `
                (function() {
                    var SEL = ['aside','nav','header','[class*="sidebar"]','[class*="Sidebar"]',
                               '.w-48','.w-52','.w-56','.w-60','.w-64','.w-72',
                               '.orbit7-ui-sidebar','.layout-side-section'];
                    function hideAll() {
                        SEL.forEach(function(s) {
                            try {
                                document.querySelectorAll(s).forEach(function(el) {
                                    el.style.setProperty('display','none','important');
                                    el.style.setProperty('width','0','important');
                                    el.style.setProperty('min-width','0','important');
                                    el.style.setProperty('overflow','hidden','important');
                                });
                            } catch(e) {}
                        });
                    }
                    hideAll();
                    var mo = new MutationObserver(function(muts) {
                        if (muts.some(function(m){ return m.addedNodes.length > 0; })) hideAll();
                    });
                    mo.observe(document.body || document.documentElement,
                               { childList: true, subtree: true });
                    [100,300,600,1000,2000,4000].forEach(function(ms){ setTimeout(hideAll, ms); });
                    setTimeout(function(){ mo.disconnect(); }, 10000);
                })();
            `;
            (iframeDoc.body || iframeDoc.documentElement).appendChild(script);

        } catch(e) {
            console.warn('Insights embed: iframe injection blocked —', e.message);
        }
    });
};