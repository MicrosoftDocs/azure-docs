---
title: View audit report for Azure AD roles in PIM - Azure AD | Microsoft Docs
description: Learn how to view the audit history for Azure AD roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 11/13/2019
ms.author: curtand
ms.custom: pim

ms.collection: M365-identity-device-management
---
# View audit history for Azure AD roles in PIM

You can use the Privileged Identity Management (PIM) audit history to see all role assignments and activations within the past 30 days for all privileged roles. If you want to see the full audit history of activity in your Azure Active Directory (Azure AD) organization, including administrator, end user, and synchronization activity, you can use the [Azure Active Directory security and activity reports](../reports-monitoring/overview-reports.md).

## Determine your version of PIM

After November 2019, the way that Azure AD roles are assigned in Privileged Identity Management is being updated to a new version that matches the way Azure resource access roles are assigned. While the new version is being rolled out, procedures that you must follow in this article will depend on version of Privileged Identity Management you currently have. Follow the steps in this section to determine which version of Privileged Identity Management you have. After you know your version of Privileged Identity Management, you can select the procedures in this article that match that version.

1. Sign in to the [Azure portal](https://portal.azure.com/) with a user that is a member of the [Privileged Role Administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles**.

    If your user interface looks like the following, you have the **Current version** of Privileged Identity Management.

    ![Azure AD roles current version](./media/pim-how-to-add-role-to-user/pim-current-version.png)

    If your user interface looks like the following, you have the **New version** of Privileged Identity Management.

    ![Azure AD roles new version](./media/pim-how-to-add-role-to-user/pim-new-version.png)

1. If you have the current version of Privileged Identity Management, select the following **Current version** tab. If you have the new version of Privileged Identity Management, select the following **New version** tab.

Follow the steps in this article to approve or deny requests for Azure AD roles.

# [Current version](#tab/current)

## View audit history

Follow these steps to view the audit history for Azure AD roles.

1. Sign in to [Azure portal](https://portal.azure.com/) with a user that is a member of the [Privileged Role Administrator](../users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles**.

1. Select **Directory roles audit history**.

    Depending on your audit history, a column chart is displayed along with the total activations, max activations per day, and average activations per day.

    ![Directory roles audit history](media/pim-how-to-use-audit-log/directory-roles-audit-history.png)

    At the bottom of the page, a table is displayed with information about each action in the available audit history. The columns have the following meanings:

    | Column | Description |
    | --- | --- |
    | Time | When the action occurred. |
    | Requestor | User who requested the role activation or change. If the value is **Azure System**, check the Azure audit history for more information. |
    | Action | Actions taken by the requestor. Actions can include Assign, Unassign, Activate, Deactivate, or AddedOutsidePIM. |
    | Member | User who is activating or assigned to a role. |
    | Role | Role assigned or activated by the user. |
    | Reasoning | Text that was entered into the reason field during activation. |
    | Expiration | When an activated role expires. Applies only to eligible role assignments. |

1. To sort the audit history, click the **Time**, **Action**, and **Role** buttons.

## Filter audit history

1. At the top of the audit history page, click the **Filter** button.

    The **Update chart parameters** pane appears.

1. In **Time range**, select a time range.

1. In **Roles**, select the checkboxes to indicate the roles you want to view.

    ![Update chart parameters pane](media/pim-how-to-use-audit-log/update-chart-parameters.png)

1. Select **Done** to view the filtered audit history.

# [New version](#tab/new)

## View activity and activations

To see what actions a specific user took in various resources, you can view the Azure resource activity that's associated with a given activation period.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Click the resource you want to view activity and activations for.

1. Click **Roles** or **Members**.

1. Click a user.

    You see a graphical view of the user's actions in Azure resources by date. It also shows the recent role activations over that same time period.

    ![User details with resource activity summary and role activations](media/azure-pim-resource-rbac/rbac-user-details.png)

1. Click a specific role activation to see details and corresponding Azure resource activity that occurred while that user was active.

    ![Role activation selected and activity details displayed by date](media/azure-pim-resource-rbac/rbac-user-resource-activity.png)

## Export role assignments with children

You may have a compliance requirement where you must provide a complete list of role assignments to auditors. Privileged Identity Management enables you to query role assignments at a specific resource, which includes role assignments for all child resources. Previously, it was difficult for administrators to get a complete list of role assignments for a subscription and they had to export role assignments for each specific resource. Using Privileged Identity Management, you can query for all active and eligible role assignments in a subscription including role assignments for all resource groups and resources.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Click the resource you want to export role assignments for, such as a subscription.

1. Click **Members**.

1. Click **Export** to open the Export membership pane.

    ![Export membership pane to export all members](media/azure-pim-resource-rbac/export-membership.png)

1. Click **Export all members** to export all role assignments in a CSV file.

    ![Exported role assignments in CSV file as display in Excel](media/azure-pim-resource-rbac/export-csv.png)

## View resource audit history

Resource audit gives you a view of all role activity for a resource.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Click the resource you want to view audit history for.

1. Click **Resource audit**.

1. Filter the history using a predefined date or custom range.

    ![Resource audit list with filters](media/azure-pim-resource-rbac/rbac-resource-audit.png)

1. For **Audit type**, select **Activate (Assigned + Activated)**.

    ![Resource audit list that is filtered by Activate audit type](media/azure-pim-resource-rbac/rbac-audit-activity.png)

1. Under **Action**, click **(activity)** for a user to see that user's activity detail in Azure resources.

    ![User activity details for a particular action](media/azure-pim-resource-rbac/rbac-audit-activity-details.png)

## View my audit

My audit enables you to view your personal role activity.

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure resources**.

1. Click the resource you want to view audit history for.

1. Click **My audit**.

1. Filter the history using a predefined date or custom range.

    ![Audit list for the current user](media/azure-pim-resource-rbac/my-audit-time.png)

---

## Next steps

- [View activity and audit history for Azure resource roles in Privileged Identity Management](azure-pim-resource-rbac.md)
