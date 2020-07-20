---
title: Renew role-assignable group assignments in PIM - Azure AD | Microsoft Docs
description: Learn how to extend or renew role-assignable group assignments in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: pim
ms.date: 06/30/2020
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Extend or renew privileged acsess group assignments in Privileged Identity Management

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) provides controls to manage the access and assignment lifecycle for privileged access groups. Administrators can assign roles using start and end date-time properties. When the assignment end approaches, Privileged Identity Management sends email notifications to the affected users or groups. It also sends email notifications to administrators of the resource to ensure that appropriate access is maintained. Assignments might be renewed and remain visible in an expired state for up to 30 days, even if access is not extended.

## Who can extend and renew

Only administrators of the resource can extend or renew privileged access group assignments. The affected user or group can request to extend assignments that are about to expire and request to renew assignments that are already expired.

## When notifications are sent

Privileged Identity Management sends email notifications to administrators and affected users of privileged access group assignments that are expiring:

- Within 14 days prior to expiration
- One day prior to expiration
- When an assignment expires

Administrators receive notifications when a user or group requests to extend or renew an expiring or expired assignment. When an administrator resolves the request, all administrators and the requesting user are notified of the approval or denial.

## Extend role assignments

The following steps outline the process for requesting, resolving, or administering an extension or renewal of a role assignment.

### Self-extend expiring assignments

Users or groups assigned to a role can extend expiring role assignments directly from the **Eligible** or **Active** tab on the **Assignments** page for a privileged access group. Users or groups can request to extend eligible and active (assigned) roles that expire in the next 14 days.

![Azure resources - My roles page listing eligible roles with an Action column](media/pim-resource-roles-renew-extend/self-extend-group-assignment.png)

When the assignment end date-time is within 14 days, the **Extend** command is available. To request an extension of a role assignment, select **Extend** to open the request form.

![Extend role assignment pane with a Reason box and details](media/pim-resource-roles-renew-extend/extend-request-details-group-assignment.png)

>[!NOTE]
>We recommend including the details of why the extension is necessary, and for how long the extension should be granted (if you have this information).

In a matter of moments, administrators receive an email notification requesting that they review the extension request. If a request to extend has already been submitted, an Azure notification appears in the portal.

Tto view the status of or cancel your request, open the **Pending requests** page for the group assignment.

![Privileged access group assignments - Pending requests page showing the link to Cancel](media/pim-resource-roles-renew-extend/group-assignment-extend-cancel-request.png)

### Admin approved extension

When a user or group submits a request to extend a role assignment, administrators receive an email notification that contains the details of the original assignment and the reason for the request. The notification includes a direct link to the request for the administrator to approve or deny.

In addition to using following the link from email, administrators can approve or deny requests by going to the Privileged Identity Management administration portal and selecting **Approve requests** in the left pane.

![Privileged access group assignments - Approve requests page listing requests and links to approve or deny](media/pim-resource-roles-renew-extend/group-assignment-extend-admin-approve.png)

When an Administrator selects **Approve** or **Deny**, the details of the request are shown, along with a field to provide a business justification for the audit logs.

![Approve group assignment request with requestor reason, assignment type, start time, end time, and reason](media/pim-resource-roles-renew-extend/group-assignment-extend-admin-approve-reason.png)

When approving a request to extend role assignment, resource administrators can choose a new start date, end date, and assignment type. Changing assignment type might be necessary if the administrator wants to provide limited access to complete a specific task (one day, for example). In this example, the administrator can change the assignment from **Eligible** to **Active**. This means they can provide access to the requestor without requiring them to activate.

### Admin initiated extension

If a user assigned to a role doesn't request an extension for the role assignment, an administrator can extend an assignment on behalf of the user. Administrative extensions of role assignment do not require approval, but notifications are sent to all other administrators after the role has been extended.

To extend a role assignment, browse to the resource role or assignment view in Privileged Identity Management. Find the assignment that requires an extension. Then select **Extend** in the action column.

![Azure resources - assignments page listing eligible roles with links to extend](media/pim-resource-roles-renew-extend/aadpim-rbac-extend-admin-extend.png)

## Renew role assignments

While conceptually similar to the process for requesting an extension, the process to renew an expired role assignment is different. Using the following steps, assignments and administrators can renew access to expired roles when necessary.

### Self-renew

Users who can no longer access resources can access up to 30 days of expired assignment history. To do this, they browse to **My Roles** in the left pane, and then select the **Expired roles** tab in the Azure resource roles section.

![My roles page - Expired roles tab](media/pim-resource-roles-renew-extend/aadpim-rbac-renew-from-myroles.png)

The list of roles shown defaults to **Eligible roles**. Use the drop-down menu to toggle between Eligible and Active assigned roles.

To request renewal for any of the role assignments in the list, select the **Renew** action. Then provide a reason for the request. It's helpful to provide a duration in addition to any additional context or a business justification that can help the resource administrator decide to approve or deny.

![Renew role assignment pane showing Reason box](media/pim-resource-roles-renew-extend/aadpim-rbac-renew-request-form.png)

After the request has been submitted, resource administrators are notified of a pending request to renew a role assignment.

### Admin approves

Resource administrators can access the renewal request from the link in the email notification or by accessing Privileged Identity Management from the Azure portal and selecting **Approve requests** from the left pane.

![Azure resources - Approve requests page listing requests and links to approve or deny](media/pim-resource-roles-renew-extend/aadpim-rbac-extend-admin-approve-grid.png)

When an administrator selects **Approve** or **Deny**, the details of the request are shown along with a field to provide a business justification for the audit logs.

![Approve role assignment request with requestor reason, assignment type, start time, end time, and reason](media/pim-resource-roles-renew-extend/aadpim-rbac-extend-admin-approve-blade.png)

When approving a request to renew role assignment, resource administrators must enter a new start date, end date, and assignment type.

## Next steps

- [Approve or deny requests for Azure resource roles in Privileged Identity Management](pim-resource-roles-approval-workflow.md)
- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
