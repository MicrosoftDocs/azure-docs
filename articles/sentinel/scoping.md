---
title: Configure Microsoft Sentinel scoping (row-level RBAC)
description: Create and apply Microsoft Sentinel scopes to control access to data at the row level.
ms.topic: how-to
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform
author: mberdugo
ms.author: monaberdugo
ms.reviewer: Tomas Beerthuis
ms.date: 3/19/2026

#customer intent: As a security administrator, I want to configure Microsoft Sentinel scoping to control access to data at the row level, so that I can ensure that users only have access to the data relevant to their role and responsibilities.
---

# Configure Microsoft Sentinel scoping (row-level RBAC) (preview)

Microsoft Sentinel scoping provides row-level role-based access control (RBAC), enabling granular, row-level access without requiring workspace separation. This capability allows multiple teams to operate securely within a shared Microsoft Sentinel environment while using consistent and reusable scope definitions across tables and experiences.

Scoping is configured in the Microsoft Defender portal.

## What is Microsoft Sentinel scoping?

Microsoft Sentinel scoping extends permissions management in the Defender portal so the administrator can grant permissions to specific subsets of data in Sentinel tables. To create scopes, do the following:

- [Define logical scopes](#step-1-create-a-sentinel-scope): Create scope definitions that align with your organizational structure (by business unit, region, or data sensitivity)
- [Assign users or groups to scopes](#step-2-assign-scopes-tags-to-users-or-groups): Assign specific users or groups to one or more scopes using Unified RBAC
- [Tag data rows at ingestion time](#step-3-tag-tables-with-scope): Apply scope tags to rows in tables using Table Management, allowing you to create rules that tag newly ingested data automatically
- [Restrict access by scope](#step-4-access-scoped-data): Limit user access to alerts, incidents, hunting queries, and data lake exploration based on their assigned scope

> [!NOTE]
> Scopes are additive. Users assigned multiple roles get the broadest permissions available to them from all their assignments. For example, if you hold both an Entra global reader role and a Defender XDR URBAC role that provides scoped permissions on *System tables*, you're unrestricted by scopes on System tables due to the Entra role. Another example is if you hold the same role permissions in Microsoft Defender XDR for a workspace, with two different scopes, you have that permission for both scopes.

Scopes apply to Sentinel tables that support ingestion-time transformations.

## Use cases

- **Distributed/Federated SOC Teams**: Large enterprises and MSSPs often operate federated SOC models where different teams are responsible for specific regions, business units, or customers. Scoping allows each SOC team to operate independently within a shared Sentinel workspace, ensuring they can investigate and respond to threats within their domain without accessing unrelated data.
- **Scoped Access for External, Non-Security Teams**: Teams such as networking, IT operations, or compliance often require access to specific raw data sources without needing visibility into broader security content. Row-level scoping enables these external teams to securely access only the data relevant to their function.
- **Sensitive Data Protection**: Protect certain data/tables by applying a least privilege data access approach, ensuring sensitive information is only accessible to authorized users.

## Prerequisites

Before you begin, verify the following prerequisites:

- **Access to the Microsoft Defender portal**: `https://security.microsoft.com`
- **Microsoft Sentinel workspaces onboarded to the Defender portal**: Sentinel workspaces must be available in the Defender portal before roles and permissions can be assigned
- **Sentinel enabled in Unified RBAC**: You must [enable Microsoft Sentinel in URBAC](/defender-xdr/manage-rbac) before using this feature.
- **Required permissions** for the person assigning scope and tagging tables:
  - **Security Authorization (Manage)** permission (URBAC) to create scopes and assignments
  - **Data Operations (Manage)** permission (URBAC) for Table Management
  - **Subscription owner** or assigned with the `Microsoft.Insights/DataCollectionRules/Write` permission to create Data Collection Rules (DCRs)

## Step 1: Create a Sentinel scope

1. In the Microsoft Defender portal, go to **System** >**Permissions**.
1. Select **Microsoft Defender XDR**.
1. Open the **Scopes** tab.
1. Select **Add Sentinel scope**.
1. Enter a scope name and optional description.
1. Select **Create scope**.

You can create multiple scopes and define your own values for each scope to reflect your organizational structure and policies.

> [!NOTE]
> You can create up to 100 unique Sentinel scopes per tenant.

:::image type="content" source="./media/scoping/add-scope.png" alt-text="Screenshot of the Add Sentinel scope tab and dialog.":::

## Step 2: Assign scopes tags to users or groups

1. In **Permissions**, open the **Roles** tab.
1. Select **Create custom role**.
1. Configure the role name and description and select **Next**.

    :::image type="content" source="./media/scoping/set-up-basics.png" alt-text="Screenshot of dialog for creating name and description of a custom role.":::

1. Assign the required permissions to the role and select **Apply**.

     :::image type="content" source="./media/scoping/assign-permissions.png" alt-text="Screenshot of dialog for assigning permissions to a custom role.":::

1. In **Assignments**, give it a name and select:
   - Users or user groups (Azure AD groups)
   - Data sources and data collections (Sentinel workspaces)
1. Under **Scope**, select **Edit**.
1. Select one or more scopes to assign to this role.
1. Save the role.

Users can be assigned to multiple scopes simultaneously over multiple workspaces, with access rights aggregated across all assigned scopes. Restricted users can only access SIEM data associated with their assigned scopes.

:::image type="content" source="./media/scoping/edit-scope.png" alt-text="Screenshot of assigning Sentinel scopes to a custom role.":::

## Step 3: Tag tables with scope

You enforce scopes by tagging data during ingestion. This tagging creates a Data Collection Rule (DCR) that applies scope tags to newly ingested data.

1. In Microsoft Sentinel, go to **Configuration** > **Tables**.
1. Select a table that supports ingestion-time transformations.
1. Select **Scope tag rule**.

    :::image type="content" source="./media/scoping/scope-tag-rule.png" alt-text="Screenshot of the Scope tag rule tab.":::

1. Enable the **Allow use of scope tags for RBAC** toggle.
1. Enable the **Scope tag rule** toggle.
1. Define a KQL expression that selects rows using [transformKQL supported operators and limits](/azure/azure-monitor/essentials/data-collection-transformations).

    Example to scope by location:

    ```kql
    Location == 'Spain'
    ```

1. Select the scope to apply to rows matching the expression.
1. Save the rule.

Only newly ingested data is tagged. Previously ingested data isn't included. After tagging, it can take up to an hour for the new rule to take effect.

> [!TIP]
> You can create multiple scope tag rules on the same table to tag different rows with different scopes. Records can belong to multiple scopes simultaneously.

:::image type="content" source="./media/scoping/table-scope-tag-rule.png" alt-text="Screenshot of the table scope tag rule.":::

## Step 4: Access scoped data

After scopes are created, assigned, and applied to tables, scoped users can access Sentinel experiences based on their assigned scope. All newly ingested data automatically gets tagged with scope. Historical (previously ingested) data isn't included. Any data not explicitly scoped isn't visible to scoped users. Unscoped users have visibility on all data within the workspace

Scoped users can:

- View alerts generated from scoped data
- Manage alerts if they have access to all events linked to that alert
- View incidents that contain at least one scoped alert
- Manage incidents if they have access to all underlying alerts and have the required permission
- Run advanced hunting queries over scoped rows only
- Query and explore data in the Sentinel lake (tables with scope)
- Filter alerts and incidents based on their Sentinel Scope

Alerts inherit scope from the underlying data. Incidents are visible if at least one alert is within scope.

The `SentinelScope_CF` custom field is available for use in queries and detection rules to reference scope in your analytics.

> [!NOTE]
When you create custom detections and analytics rules, you must project the `SentinelScope_CF` column in their KQL to make the triggered alerts visible to scoped analysts. If you don't project this column, alerts are unscoped and hidden from scoped users.

:::image type="content" source="./media/scoping/scoped-alerts-view.png" alt-text="Screenshot of alerts filtered by Sentinel scope.":::

## Limitations

The following limitations apply:

- **Historical data**: Only newly ingested data is scoped. Previously ingested data isn't included and can't be retroactively scoped.
- **Table support**: Only tables that support ingestion-time transformations can be tagged. Custom tables (CLv1) aren't supported. CLv2 Tables are supported.
- **Transformation placement**: Transformations can only be added in the same subscription as the user's subscription.
- **Maximum scopes**: You can create a maximum of 100 unique Sentinel scopes per tenant.
- **Defender portal only**: Sentinel in the Azure portal (Ibiza) doesn't support scoping. Use the Defender portal instead.
- **XDR tables not supported**: XDR tables aren't directly supported. If you extend retention of XDR tables into Log Analytics, you can tag, but only data with 30+ days retention, and not data between 0-30 days.
- **No automatic scope inheritance**: The Log Analytics tables `SecurityAlerts` and `SecurityIncidents` don't automatically inherit the scope from the raw data/tables from which they were generated. Therefore, scoped users can't access them by default. As a workaround you can do one of the following actions:
  - Use the XDR `AlertsInfo` and `AlertsEvidence` tables where scope is automatically inherited, or
  - Apply scope to these Log Analytics tables manually (this method is limited to the attributes in the table and might not be equivalent to inheritance of the data tables that generated these alerts).
- **Supported experiences**: Sentinel scopes can only be assigned to Defender XDR RBAC roles. Azure RBAC permissions on workspaces or Entra global role permissions aren't supported. Experiences that can't use row level RBAC, such as Jupyter Notebooks, don't allow users who are restricted to a scope to view data for those respective workspaces.

## Permissions and access

- Users can view an incident if they have access to at least one alert in the incident. They can manage the incident only if they have access to all alerts in the incident and have the required permission.
- The scoped user can only see the data associated with their scope. If the alert contains entities that the user has no access to, the user can't see them. If the user has access to at least one of the associated entities, they can see the alert itself.
- To scope an entire table, use a rule that matches all rows (for example, using a condition that is always true). Previously ingested data can't be scoped retroactively.
- Scoped users can't manage resources (such as detection rules, playbooks, automation rules) unless permission is assigned to them in a separate role assignment.

## Next steps

- Review the list of [tables that support ingestion-time transformations](/azure/azure-monitor/logs/tables-feature-support)
- Plan scope names and logic before tagging data
- Start with a pilot scope for a small team or data subset
- Learn more about [Unified RBAC in Microsoft Defender XDR](/defender-xdr/manage-rbac)
