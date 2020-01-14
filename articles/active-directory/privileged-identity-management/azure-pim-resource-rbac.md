---
title: View audit report for Azure resource roles in PIM - Azure AD | Microsoft Docs
description: View activity and audit history for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.assetid:
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 01/10/2020
ms.author: curtand

ms.collection: M365-identity-device-management
---
# View activity and audit history for Azure resource roles in Privileged Identity Management

With Azure Active Directory (Azure AD) Privileged Identity Management (PIM), you can view activity, activations, and audit history for Azure resources roles within your organization. This includes subscriptions, resource groups, and even virtual machines. Any resource within the Azure portal that leverages the Azure role-based access control (RBAC) functionality can take advantage of the security and lifecycle management capabilities in Privileged Identity Management.

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure delegated resource management](../../lighthouse/concepts/azure-delegated-resource-management.md), role assignments authorized by that service provider won't be shown here.

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

## Next steps

- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)
- [Approve or deny requests for Azure resource roles in Privileged Identity Management](pim-resource-roles-approval-workflow.md)
- [View audit history for Azure AD roles in Privileged Identity Management](pim-how-to-use-audit-log.md)
