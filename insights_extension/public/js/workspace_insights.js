(function () {
	'use strict';

	if (window.insights_sidebar_initialized) {
		console.log("[Insights] already initialized. Skipping duplicate execution.");
		return;
	}
	window.insights_sidebar_initialized = true;

	console.log("[Insights] workspace_insights.js loaded ✓");

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
		`;
		document.head.appendChild(style);
	}

	let _current_workspace = null;
	let _is_fetching = false;

	orbit7.after_ajax(() => {
		setTimeout(() => {
			on_route_change();
		}, 300);
	});

	if (orbit7.router && orbit7.router.on) {
		orbit7.router.on('change', () => {
			setTimeout(() => {
				on_route_change();
			}, 300);
		});
	}

	function on_route_change() {
		const route = orbit7.get_route();
		if (!route) return;

		if (route[0] === 'Workspaces') {
			const workspace = route[1] === 'private' ? route[2] : route[1];
			if (workspace) {
				_current_workspace = workspace;
				ensure_sidebar(workspace, null);
			}
		} else if (route[0] === 'insights-dashboards') {
			const dashboard = route[1];
			if (dashboard) {
				if (_current_workspace) {
					ensure_sidebar(_current_workspace, dashboard);
				} else {
					orbit7.call({
						method: "insights_extension.api.get_dashboard_workspace",
						args: { dashboard },
						callback: function (r) {
							if (r.message) {
								_current_workspace = r.message;
								ensure_sidebar(_current_workspace, dashboard);
							}
						}
					});
				}
			}
		}
	}

	function ensure_sidebar(workspace, active_dashboard) {
		if (!workspace) return;

		if (orbit7.app.sidebar) {
			orbit7.app.sidebar.wrapper.show();
			if (orbit7.app.sidebar.sidebar_title !== workspace) {
				orbit7.app.sidebar.setup(workspace);
			}
		}

		inject_insights_dashboards(workspace, active_dashboard);
	}

	async function inject_insights_dashboards(workspace, active_dashboard) {
		if (_is_fetching) return;
		try {
			const $sidebar = $('.body-sidebar:visible .sidebar-items').first();
			if (!$sidebar.length) {
				setTimeout(() => inject_insights_dashboards(workspace, active_dashboard), 200);
				return;
			}

			const $existing = $sidebar.find('.insights-sidebar-section');
			if ($existing.length && $existing.attr('data-insights-workspace') === workspace) {
				sync_active_state(active_dashboard);
				return;
			}

			_is_fetching = true;
			$('.insights-sidebar-section').remove();

			const r = await orbit7.call({
				method: "insights_extension.api.get_workspace_dashboards",
				args: { workspace }
			});

			_is_fetching = false;

			const dashboards = r.message || [];
			if (!dashboards.length) return;

			dashboards.sort((a, b) => (a.portion ?? 99) - (b.portion ?? 99));

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

			$section.find('.insights-sidebar-heading').on('click', function () {
				const collapsed = $section.find('.insights-sidebar-items')
										  .toggleClass('is-collapsed')
										  .hasClass('is-collapsed');
				$(this).toggleClass('is-collapsed', collapsed);
			});

			$section.find('.insights-dashboard-item').on('click', function () {
				const dashboard = $(this).data('dashboard');
				orbit7.set_route('insights-dashboards', dashboard);
			});

			const $currSidebar = $('.body-sidebar:visible .sidebar-items').first();
			$('.insights-sidebar-section').remove();
			$currSidebar.append($section);
			sync_active_state(active_dashboard);

		} catch (e) {
			_is_fetching = false;
			console.error("[Insights] injection error:", e);
		}
	}

	function sync_active_state(active_dashboard) {
		$('.insights-dashboard-item').each(function () {
			const isActive = $(this).data('dashboard') === active_dashboard;
			$(this).toggleClass('active', isActive);
		});
	}

})();