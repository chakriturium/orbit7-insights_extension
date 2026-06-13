orbit7.pages['insights-dashboards'] = orbit7.pages['insights-dashboards'] || {};

orbit7.pages['insights-dashboards'].on_page_load = function(wrapper) {
	let page = orbit7.ui.make_app_page({
		parent: wrapper,
		title: __('Insights Dashboards'),
		single_column: true,
		hide_sidebar: false
	});

	wrapper.page_instance = page;

	orbit7.dom.set_style(`
		.insights-iframe-container {
			width: 100%;
			height: calc(100vh - 120px);
			position: relative;
			background: var(--bg-color);
		}
		.insights-iframe-container iframe {
			width: 100%;
			height: 100%;
			border: none;
			display: block;
		}
		.insights-unauthorized {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 60vh;
			flex-direction: column;
			text-align: center;
		}
		.insights-unauthorized i {
			font-size: 48px;
			color: var(--text-muted);
			margin-bottom: 15px;
		}
		.insights-unauthorized h4 {
			margin: 0 0 8px;
			font-weight: 600;
		}
	`);

	$(page.body).html(`
		<div class="insights-iframe-container" id="insights-iframe-container">
			<div class="text-center padding" style="margin-top: 50px;">
				<i class="fa fa-spinner fa-spin fa-2x text-muted"></i>
			</div>
		</div>
	`);

	orbit7.pages['insights-dashboards'].on_page_show(wrapper);
};

orbit7.pages['insights-dashboards'].on_page_show = function(wrapper) {
	if (!wrapper.page_instance) return;

	const page = wrapper.page_instance;
	const route = orbit7.get_route();
	const dashboard_name = route[1];
	const $container = $('#insights-iframe-container');

	if (!dashboard_name) {
		page.set_title(__('Insights Dashboards'));
		$container.html(`
			<div class="insights-unauthorized">
				<i class="fa fa-pie-chart"></i>
				<h4>${__('No Dashboard Selected')}</h4>
				<p class="text-muted">${__('Choose a dashboard from the sidebar.')}</p>
			</div>
		`);
		return;
	}

	$container.html(`
		<div class="text-center padding" style="margin-top: 50px;">
			<i class="fa fa-spinner fa-spin fa-2x text-muted"></i>
		</div>
	`);

	orbit7.call({
		method: "insights_extension.api.check_dashboard_access",
		args: { dashboard: dashboard_name },
		callback: function(r) {
			if (r.message === true) {
				orbit7.call({
					method: "orbit7.client.get",
					args: { doctype: "Insights Dashboard v3", name: dashboard_name },
					callback: function(res) {
						if (res.message) {
							page.set_title(__(res.message.label || dashboard_name));
						} else {
							page.set_title(__(dashboard_name));
						}
					}
				});

				$container.html(`
					<iframe id="insights-embed-iframe"
							src="/insights/dashboards/${dashboard_name}?embed=true"
							allowfullscreen></iframe>
				`);

				$('#insights-embed-iframe').on('load', function() {
					try {
						const iframeDoc = this.contentDocument || this.contentWindow.document;

						const style = iframeDoc.createElement('style');
						style.textContent = `
							aside, nav, header,
							[class*="sidebar"], [class*="Sidebar"],
							.orbit7-ui-sidebar, .layout-side-section,
							[data-v-app] > div > aside,
							[data-v-app] > div > nav {
								display: none !important;
								width: 0 !important; min-width: 0 !important;
							}
							main, .flex-1, [class*="main-content"], [class*="content-area"],
							.layout-main, .page-content {
								margin-left: 0 !important; padding-left: 0 !important;
								width: 100% !important; max-width: 100% !important;
								flex: 1 1 0% !important;
							}
						`;
						if (iframeDoc.head) {
							iframeDoc.head.appendChild(style);
						}

						const script = iframeDoc.createElement('script');
						script.textContent = `
							(function() {
								var SEL = ['aside','nav','header','[class*="sidebar"]','[class*="Sidebar"]','.orbit7-ui-sidebar','.layout-side-section'];
								function hideAll() {
									SEL.forEach(function(s) {
										try {
											document.querySelectorAll(s).forEach(function(el) {
												el.style.setProperty('display','none','important');
												el.style.setProperty('width','0','important');
												el.style.setProperty('min-width','0','important');
											});
										} catch(e) {}
									});
								}
								hideAll();
								var mo = new MutationObserver(hideAll);
								mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
								setTimeout(hideAll, 100);
								setTimeout(hideAll, 500);
								setTimeout(hideAll, 1000);
							})();
						`;
						(iframeDoc.body || iframeDoc.documentElement).appendChild(script);
					} catch(e) {
						console.warn('Iframe injection blocked:', e.message);
					}
				});
			} else {
				page.set_title(__('Access Denied'));
				$container.html(`
					<div class="insights-unauthorized">
						<i class="fa fa-lock" style="color: var(--red-500);"></i>
						<h4>${__('Access Denied')}</h4>
						<p class="text-muted">${__('You do not have permission to view this dashboard.')}</p>
					</div>
				`);
			}
		}
	});
};
