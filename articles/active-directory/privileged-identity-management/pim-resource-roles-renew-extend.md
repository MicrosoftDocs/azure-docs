---
title: Extend or renew Azure resource role assignments in PIM | Microsoft Docs
description: Learn how to extend or renew Azure resource role assignments in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---



# Extend or renew Azure resource role assignments in PIM

Privileged Identity Management (PIM) for Azure resources introduces new controls to manage the access and assignment lifecycle for Azure resources. Administrators can assign membership using start and end date-time properties. When the assignment end approaches, PIM sends email notifications to the affected users or groups. It also sends email notifications to administrators of the resource to ensure that appropriate access is maintained. Assignments might be renewed and remain visible in an expired state for up to 30 days, even if access is not extended.

## Who can extend and renew?

Only administrators of the resource can extend or renew role assignments. The affected member can request to extend roles that are about to expire and request to renew roles that are already expired.

## When are notifications sent?

PIM sends email notifications to administrators and affected members of roles that are expiring within 14 days and one day prior to expiration. It sends an additional email when an assignment officially expires. 

Administrators receive notifications when a member of an expiring or expired role requests to extend or renew. When a specific administrator resolves the request, all other administrators are notified of the resolution decision (approved or denied). Then the requesting member is notified of the decision. 

## Extend role assignments

The following steps outline the process for requesting, resolving, or administering an extension or renewal of a role assignment. 

### Member extend

Members of a role assignment can extend expiring role assignments directly from the **Eligible** or **Active** tab on the **My roles** page of a resource and from the top level **My roles** page of the PIM portal. Members can request to extend eligible and active (assigned) roles that expire in the next 14 days.

![Extend roles](media/azure-pim-resource-rbac/aadpim_rbac_extend_ui.png)

When the assignment end date-time is within 14 days, the button to **Extend** becomes an active link in the user interface. In the following example, assume the current date is March 27.

![The "Extend" button](media/azure-pim-resource-rbac/aadpim_rbac_extend_within_14.png)

To request an extension of this role assignment, select **Extend** to open the request form.

![Open the request form](media/azure-pim-resource-rbac/aadpim_rbac_extend_role_assignment_request.png)

To view information about the original assignment, expand **Assignment details**. Enter a reason for the extension request, and then select **Extend**.

>[!Note]
>We recommend including the details of why the extension is necessary, and for how long the extension should be granted (if you have this information).

![Extend role assignment](media/azure-pim-resource-rbac/aadpim_rbac_extend_form_complete.png)

In a matter of moments, resource administrators  receive an email notification requesting that they review the extension request. If a request to extend has already been submitted, a toast notification appears at the top of the Azure portal explaining the error.

![](media/azure-pim-resource-rbac/aadpim_rbac_extend_failed_existing_request.png)

Go to the **Pending requests** tab in the left pane to view the status of your request or to cancel it.

![](media/azure-pim-resource-rbac/aadpim_rbac_extend_cancel_request.png)

### Admin approve

When a member submits a request to extend a role assignment, resource administrators receive an email notification that contains the details of the original assignment and the reason for the request. The notification includes a direct link to the request for the administrator to approve or deny. 

In addition to using following the link from email, administrators can approve or deny requests by going to the PIM administration portal and selecting **Approve requests** in the left pane.

![Screenshot of error](media/azure-pim-resource-rbac/aadpim_rbac_extend_admin_approve_grid.png)

When an Administrator selects **Approve** or **Deny**, the details of the request are shown, along with a field to provide justification for the audit logs.

![](media/azure-pim-resource-rbac/aadpim_rbac_extend_admin_approve_blade.png)

When approving a request to extend role assignment, resource administrators can choose a new start date, end date, and assignment type. Changing assignment type might be necessary if the administrator wants to provide limited access to complete a specific task (one day, for example). In this example, the administrator can change the assignment from **Eligible** to **Active**. This means they can provide access to the requestor without requiring them to activate.

### Admin extend

If a role member forgets or is unable to request a role membership extension, an administrator can extend an assignment on behalf of the member. Administrative extensions of role membership do not require approval, but notifications are sent to all other administrators after the role has been extended.

To extend a role membership, browse to the resource role or member view in PIM. Find the member that requires an extension. Then select **Extend** in the action column.

![Extend a role membership](media/azure-pim-resource-rbac/aadpim_rbac_extend_admin_extend.png)

## Renew role assignments

While conceptually similar to the process for requesting an extension, the process to renew an expired role assignment is different. Using the following steps, members and administrators can renew access to expired roles when necessary.

### Member renew

Members who can no longer access resources can access up to 30 days of expired assignment history. To do this, they browse to **My Roles** in the left pane, and then select the **Expired roles** tab in the Azure resource roles section.

![The "Expired roles" tab](media/azure-pim-resource-rbac/aadpim_rbac_renew_from_myroles.png)

The list of roles shown defaults to **Eligible roles**. Use the drop-down menu to toggle between Eligible and Active assigned roles.

To request renewal for any of the role assignments in the list, select the **Renew** action. Then provide a reason for the request. It's helpful to provide a duration in addition to any additional context that helps the resource administrator decide to approve or deny.

![Renew role assignment](media/azure-pim-resource-rbac/aadpim_rbac_renew_request_form.png)

After the request has been submitted, resource administrators are notified of a pending request to renew a role assignment.

### Admin approves

Resource administrators can access the renewal request from the link in the email notification or by accessing PIM from the Azure portal and selecting **Approve requests** from the left pane.

![Approve requests](media/azure-pim-resource-rbac/aadpim_rbac_extend_admin_approve_grid.png)

When an administrator selects **Approve** or **Deny**, the details of the request are shown along with a field to provide justification for the audit logs.

![Approve role assignment](media/azure-pim-resource-rbac/aadpim_rbac_extend_admin_approve_blade.png)

When approving a request to renew role assignment, resource administrators must enter a new start date, end date, and assignment type. 

### Admin renew

Resource administrators can renew expired role assignments from the **Members** tab in the left navigation menu of a resource. They can also renew expired role assignments from within the **Expired** roles tab of a resource role.

To view a list of all expired role assignments, on the **Members** screen, select **Expired roles**.

![Expired roles](media/azure-pim-resource-rbac/aadpim_rbac_renew_from_member_blade.png)

## Next steps

- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
- [Configure Azure resource role settings in PIM](pim-resource-roles-configure-role-settings.md)
