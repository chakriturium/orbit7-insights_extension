# insights_sidebar/api.py

import frappe


@frappe.whitelist()
def get_workspace_dashboards(workspace):
    """
    Return Insights Sidebar items for a specific workspace,
    filtered by the current user's roles, sorted by portion (ascending).

    Security:
        - frappe.has_permission check at entry
        - Role intersection done server-side (never exposed to client)
    """
    print(f"[Insights API] get_workspace_dashboards | workspace={workspace} | user={frappe.session.user}")

    if not frappe.has_permission("Insights Sidebar", "read"):
        print(f"[Insights API] PERMISSION DENIED for user: {frappe.session.user}")
        frappe.throw("Not permitted", frappe.PermissionError)

    user_roles = set(frappe.get_roles(frappe.session.user))
    print(f"[Insights API] User roles: {user_roles}")

    cache_key = f"insights_sidebar_ws_{workspace}"
    all_configs = frappe.cache().get_value(cache_key)

    if all_configs is None:
        print(f"[Insights API] Cache MISS for key: {cache_key} — querying DB")

        docs = frappe.get_all(
            "Insights Sidebar",
            filters={"workspace": workspace},
            fields=["name", "label", "dashboard", "portion"],
            order_by="portion asc"          # sort by portion at DB level too
        )
        print(f"[Insights API] DB returned {len(docs)} record(s): {[d.label for d in docs]}")

        all_configs = []
        for d in docs:
            roles_assigned = frappe.get_all(
                "Has Role",
                filters={"parent": d.name, "parenttype": "Insights Sidebar"},
                fields=["role"]
            )
            all_configs.append({
                "label":         d.label,
                "dashboard":     d.dashboard,
                "portion":       d.portion if d.portion is not None else 0,
                "allowed_roles": [r.role for r in roles_assigned if r.role]
            })

        frappe.cache().set_value(cache_key, all_configs, expires_in_sec=3600)
        print(f"[Insights API] Cached {len(all_configs)} config(s) under key: {cache_key}")

    else:
        print(f"[Insights API] Cache HIT for key: {cache_key} — {len(all_configs)} config(s)")

    # ── Real-time role filter (never cached — roles can change anytime) ──────
    allowed = []
    for item in all_configs:
        required = set(item.get("allowed_roles", []))
        has_access = (not required) or bool(user_roles.intersection(required))

        print(f"[Insights API] '{item['label']}' | required={required} | portion={item['portion']} | access={has_access}")

        if has_access:
            allowed.append({
                "label":     item["label"],
                "dashboard": item["dashboard"],
                "portion":   item["portion"],
            })

    print(f"[Insights API] Returning {len(allowed)} item(s) to {frappe.session.user}")
    return allowed


def clear_sidebar_cache(workspace=None):
    """Clear cached config. Called from InsightsSidebar controller hooks."""
    if workspace:
        key = f"insights_sidebar_ws_{workspace}"
        frappe.cache().delete_value(key)
        print(f"[Insights API] Cache cleared: {key}")
    else:
        frappe.cache().delete_value("insights_sidebar_all_configs")
        print("[Insights API] Global cache cleared.")