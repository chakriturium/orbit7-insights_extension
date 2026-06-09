frappe.pages['insights-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'insights-Page',
		single_column: true
	});
}