

(function () {
    'use strict';

    console.log("[Insights] workspace_insights.js v4 loaded ✓");

    const STYLE_ID = 'insights-ws-styles-v4';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `

            /* ── Sidebar section ── */
            .insights-sidebar-section {
                margin-top: 4px;
                padding-top: 4px;
                border-top: 1px solid var(--border-color);
            }
            .insights-sidebar-heading {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px 12px;
                cursor: pointer;
                border-radius: var(--border-radius);
                user-select: none;
                transition: background 0.15s;
            }
            .insights-sidebar-heading:hover {
                background: var(--sidebar-select-color, var(--fg-color));
            }
            .insights-heading-text {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.6px;
                text-transform: uppercase;
                color: var(--text-muted);
            }
            .insights-chevron {
                font-size: 10px;
                color: var(--text-muted);
                transition: transform 0.2s;
            }
            .insights-sidebar-heading.is-collapsed .insights-chevron {
                transform: rotate(-90deg);
            }
            .insights-sidebar-items.is-collapsed { display: none; }

            /* ── Each dashboard item ── */
            .insights-dashboard-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 7px 12px 7px 20px;
                border-radius: var(--border-radius);
                font-size: 13px;
                color: var(--text-muted);
                cursor: pointer;
                transition: background 0.15s, color 0.15s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .insights-dashboard-item:hover {
                background: var(--sidebar-select-color, var(--fg-color));
                color: var(--text-color);
            }
            .insights-dashboard-item.active {
                background: var(--sidebar-select-color, var(--fg-color));
                color: var(--text-color);
                font-weight: 500;
            }
            .insights-dashboard-item.active .insights-item-icon { color: var(--primary-color); }
            .insights-item-icon { font-size: 12px; flex-shrink: 0; color: var(--text-muted); }
            .insights-item-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }

            /* ── Dashboard view — fills content area only, sidebar untouched ── */
            /*
                CRITICAL: This is NOT position:fixed (which covered everything).
                It is a flex column that fills the content area from inside.
                The sidebar stays visible because it is a sibling DOM element,
                completely outside this content area.
            */
            #insights-dashboard-view {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                min-height: 80vh;           /* fallback when parent has no explicit height */
                background: var(--bg-color);
            }

            /* ── Topbar (keep exactly as user wants) ── */
            .insights-page-topbar {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 16px;
                background: var(--card-bg);
                border-bottom: 1px solid var(--border-color);
                flex-shrink: 0;
                height: 48px;
                box-sizing: border-box;
            }
            .insights-back-btn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                font-size: 12px;
                color: var(--text-muted);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                background: var(--fg-color);
                cursor: pointer;
                transition: background 0.15s, color 0.15s;
            }
            .insights-back-btn:hover { background: var(--control-bg); color: var(--text-color); }
            .insights-page-title {
                font-size: 13px;
                font-weight: 500;
                color: var(--text-color);
            }

            /* ── iframe fills remaining space exactly ── */
            #insights-embed-iframe {
                flex: 1;
                width: 100%;
                border: none;
                display: block;
                /* min-height 0 is required for flex children to shrink properly */
                min-height: 0;
            }
        `;
        document.head.appendChild(style);
        console.log("[Insights] Styles injected ✓");
    }



    let _active_dashboard   = null;   
    let _saved_content      = null;   
    let _current_workspace  = null;  



    orbit7.after_ajax(() => {
        setTimeout(() => {
            console.log("[Insights] after_ajax fired");
            on_route_change();
        }, 1200);
    });

    if (orbit7.router && orbit7.router.on) {
        orbit7.router.on('change', () => {
            setTimeout(() => {
                console.log("[Insights] router change fired");
                on_route_change();
            }, 1400);
        });
    }



    function on_route_change() {
        const route = orbit7.get_route();
        console.log("[Insights] Route:", route);

        const on_workspace = route && route[0] === 'Workspaces' && route[1];

        if (!on_workspace) {

            console.log("[Insights] Not on workspace route — skipping injection.");
            return;
        }

        const workspace = route[1];

        if (_current_workspace && _current_workspace !== workspace) {
            console.log("[Insights] Workspace changed from", _current_workspace, "to", workspace, "— resetting.");
            close_dashboard_view(false);
            _current_workspace = null;
        }

        inject_insights_dashboards(workspace);
    }



    async function inject_insights_dashboards(workspace) {
        try {
            const $sidebar = $('.body-sidebar .sidebar-items');
            if (!$sidebar.length) {
                console.warn("[Insights] Sidebar not found — retrying in 800ms");
                console.log("[Insights] Debug: .body-sidebar =", $('.body-sidebar').length,
                            "| .sidebar-items =", $('.sidebar-items').length);
                setTimeout(() => inject_insights_dashboards(workspace), 800);
                return;
            }


            const section_in_dom = $sidebar.find('.insights-sidebar-section').length > 0;
            if (section_in_dom && _current_workspace === workspace) {
                console.log("[Insights] Section already in DOM for workspace:", workspace, "— skipping injection.");
                sync_active_state();
                return;
            }

            $sidebar.find('.insights-sidebar-section').remove();

            console.log("[Insights] Fetching dashboards for workspace:", workspace);

            const r = await orbit7.call({
                method: "insights_extension.api.get_workspace_dashboards",
                args: { workspace }
            });

            const dashboards = r.message || [];
            console.log("[Insights] Dashboards:", dashboards);

            if (!dashboards.length) {
                console.log("[Insights] No dashboards — nothing to inject.");
                return;
            }

            dashboards.sort((a, b) => (a.portion ?? 99) - (b.portion ?? 99));

            // ── Build section ────────────────────────────────────────────────
            const $section = $(`
                <div class="sidebar-item-container insights-sidebar-section"
                     data-insights-workspace="${workspace}">
                    <div class="insights-sidebar-heading">
                        <span class="insights-heading-text">Insights</span>
                        <i class="fa fa-chevron-down insights-chevron"></i>
                    </div>
                    <div class="insights-sidebar-items">
                        ${dashboards.map(d => `
                            <div class="insights-dashboard-item"
                                 data-dashboard="${d.dashboard}"
                                 data-label="${d.label}">
                                <i class="fa fa-bar-chart insights-item-icon"></i>
                                <span class="insights-item-label">${d.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);

            // Collapse toggle
            $section.find('.insights-sidebar-heading').on('click', function () {
                const collapsed = $section.find('.insights-sidebar-items')
                                          .toggleClass('is-collapsed')
                                          .hasClass('is-collapsed');
                $(this).toggleClass('is-collapsed', collapsed);
                console.log("[Insights] Section", collapsed ? "collapsed" : "expanded");
            });

            // Dashboard item click
            $section.find('.insights-dashboard-item').on('click', function () {
                const $item     = $(this);
                const dashboard = $item.data('dashboard');
                const label     = $item.data('label');

                console.log("[Insights] Item clicked:", dashboard, label);

                if (_active_dashboard === dashboard) {
                    console.log("[Insights] Same dashboard already open.");
                    return;
                }

                $('.insights-dashboard-item').removeClass('active');
                $item.addClass('active');

                open_dashboard_view(dashboard, label);
            });

            $sidebar.append($section);
            _current_workspace = workspace;
            console.log("[Insights] Sidebar section injected ✓ for", workspace);

            sync_active_state();

        } catch (e) {
            console.error("[Insights] inject ERROR:", e);
        }
    }


    function open_dashboard_view(dashboard_name, label) {
        console.log("[Insights] open_dashboard_view:", dashboard_name, label);


        const SELECTORS = [
            '.layout-main-section-wrapper',
            '.layout-main-section',
            '.main-section',
            '.page-content',
        ];

        let $content_area = null;
        for (const sel of SELECTORS) {
            const $el = $(sel).first();
            if ($el.length) {
                $content_area = $el;
                console.log("[Insights] Content area found:", sel);
                break;
            }
        }

        if (!$content_area) {
            console.error("[Insights] Content area not found. Checked:", SELECTORS);
            return;
        }

        if (!_saved_content) {
            _saved_content = {
                node: $content_area[0],
                html: $content_area.html(),
            };
            console.log("[Insights] Original content saved. html length:", _saved_content.html.length);
        }

        _active_dashboard = dashboard_name;

        const iframe_src = `/insights/dashboards/${dashboard_name}`;
        console.log("[Insights] iframe src:", iframe_src);


        $content_area.html(`
            <div id="insights-dashboard-view">
                <div class="insights-page-topbar">
                    <button class="insights-back-btn" id="insights-back-btn">
                        <i class="fa fa-arrow-left"></i>&nbsp;Back
                    </button>
                    <span class="insights-page-title">${label}</span>
                </div>
                <iframe
                    id="insights-embed-iframe"
                    src="${iframe_src}"
                    allowfullscreen>
                </iframe>
            </div>
        `);

        $('#insights-back-btn').on('click', function () {
            console.log("[Insights] Back clicked — restoring workspace content.");
            close_dashboard_view(true);
        });

        // Suppress Insights app's own sidebar inside iframe (same-origin only)
        $('#insights-embed-iframe').on('load', function () {
            console.log("[Insights] iframe loaded ✓");
            try {
                const iDoc = this.contentDocument || this.contentWindow.document;
                const s = iDoc.createElement('style');
                s.textContent = `
                    aside, nav, header,
                    [class*="sidebar"],[class*="Sidebar"],
                    .w-48,.w-52,.w-56,.w-60,.w-64,.w-72 {
                        display:none!important; width:0!important; min-width:0!important;
                    }
                    main,.flex-1,[class*="main-content"] {
                        margin-left:0!important; width:100%!important; flex:1 1 0%!important;
                    }
                `;
                iDoc.head && iDoc.head.appendChild(s);

                // MutationObserver for Vue SPA
                const sc = iDoc.createElement('script');
                sc.textContent = `
                    (function(){
                        var S=['aside','nav','header','[class*="sidebar"]','[class*="Sidebar"]',
                               '.w-48','.w-52','.w-56','.w-60','.w-64','.w-72'];
                        function h(){S.forEach(function(s){try{document.querySelectorAll(s)
                            .forEach(function(e){e.style.setProperty('display','none','important');
                            e.style.setProperty('width','0','important');});}catch(e){}});}
                        h();
                        var o=new MutationObserver(function(m){if(m.some(function(x){
                            return x.addedNodes.length;}))h();});
                        o.observe(document.body||document.documentElement,
                            {childList:true,subtree:true});
                        [100,300,600,1000,2000,4000].forEach(function(ms){setTimeout(h,ms);});
                        setTimeout(function(){o.disconnect();},10000);
                    })();
                `;
                (iDoc.body || iDoc.documentElement).appendChild(sc);
                console.log("[Insights] iframe sidebar suppressor injected ✓");
            } catch (e) {
                console.warn("[Insights] iframe injection blocked (cross-origin):", e.message);
            }
        });

        console.log("[Insights] Dashboard view rendered in content area ✓");
    }


    function close_dashboard_view(restore_content) {
        console.log("[Insights] close_dashboard_view | restore:", restore_content);

        if (restore_content && _saved_content) {
            $(_saved_content.node).html(_saved_content.html);
            console.log("[Insights] Workspace content restored ✓");
        }

        _saved_content    = null;
        _active_dashboard = null;

        $('.insights-dashboard-item').removeClass('active');
        console.log("[Insights] Dashboard view closed.");
    }

    $(document).on('click',
        '.body-sidebar .sidebar-item-container:not(.insights-sidebar-section)',
        function () {
            if (_active_dashboard) {
                console.log("[Insights] Native sidebar item clicked while dashboard open — closing view.");
                close_dashboard_view(false);
            }
        }
    );

    function sync_active_state() {
        if (!_active_dashboard) {
            $('.insights-dashboard-item').removeClass('active');
            return;
        }
        $('.insights-dashboard-item').each(function () {
            const isActive = $(this).data('dashboard') === _active_dashboard;
            $(this).toggleClass('active', isActive);
        });
        console.log("[Insights] Active state synced for:", _active_dashboard);
    }

})();