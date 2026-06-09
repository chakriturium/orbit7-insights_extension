app_name = "insights_extension"
app_title = "Insights Extension"
app_publisher = "chakri"
app_description = "Insights Extension"
app_email = "chakradhar.cherukuri@turium.ai"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "insights_extension",
# 		"logo": "/assets/insights_extension/logo.png",
# 		"title": "Insights Extension",
# 		"route": "/insights_extension",
# 		"has_permission": "insights_extension.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/insights_extension/css/insights_extension.css"
# app_include_js = "/assets/insights_extension/js/insights_extension.js"

# include js, css files in header of web template
# web_include_css = "/assets/insights_extension/css/insights_extension.css"
# web_include_js = "/assets/insights_extension/js/insights_extension.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "insights_extension/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "insights_extension/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "insights_extension.utils.jinja_methods",
# 	"filters": "insights_extension.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "insights_extension.install.before_install"
# after_install = "insights_extension.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "insights_extension.uninstall.before_uninstall"
# after_uninstall = "insights_extension.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "insights_extension.utils.before_app_install"
# after_app_install = "insights_extension.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "insights_extension.utils.before_app_uninstall"
# after_app_uninstall = "insights_extension.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See orbit7.core.notifications.get_notification_config

# notification_config = "insights_extension.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "orbit7.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "orbit7.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"insights_extension.tasks.all"
# 	],
# 	"daily": [
# 		"insights_extension.tasks.daily"
# 	],
# 	"hourly": [
# 		"insights_extension.tasks.hourly"
# 	],
# 	"weekly": [
# 		"insights_extension.tasks.weekly"
# 	],
# 	"monthly": [
# 		"insights_extension.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "insights_extension.install.before_tests"

# Extend DocType Class
# ------------------------------
#
# Specify custom mixins to extend the standard doctype controller.
# extend_doctype_class = {
# 	"Task": "insights_extension.custom.task.CustomTaskMixin"
# }

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"orbit7.desk.doctype.event.event.get_events": "insights_extension.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Orbit7 apps
# override_doctype_dashboards = {
# 	"Task": "insights_extension.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["insights_extension.utils.before_request"]
# after_request = ["insights_extension.utils.after_request"]

# Job Events
# ----------
# before_job = ["insights_extension.utils.before_job"]
# after_job = ["insights_extension.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"insights_extension.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Translation
# ------------
# List of apps whose translatable strings should be excluded from this app's translations.
# ignore_translatable_strings_from = []

