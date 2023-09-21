---
title: Extend or renew PIM for groups assignments
description: Learn how to extend or renew PIM for groups assignments.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.reviewer: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: pim
ms.date: 6/7/2023
ms.author: barclayn
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Extend or renew PIM for groups assignments 

Privileged Identity Management (PIM) in Microsoft Entra ID provides controls to manage the access and assignment lifecycle for group membership and ownership. Administrators can assign start and end date-time properties for group membership and ownership. When the assignment end approaches, Privileged Identity Management sends email notifications to the affected users or groups. It also sends email notifications to administrators of the resource to ensure that appropriate access is maintained. Assignments might be renewed and remain visible in an expired state for up to 30 days, even if access isn't extended.

## Who can extend and renew

Only users with permissions to manage groups can extend or renew group membership or ownership time-bound assignments. The affected user or group can request to extend assignments that are about to expire and request to renew assignments that are already expired.

Role-assignable groups can be managed by Global Administrator, Privileged Role Administrator, or Owner of the group. Non-role-assignable groups can be managed by Global Administrator, Directory Writer, Groups Administrator, Identity Governance Administrator, User Administrator, or Owner of the group. Role assignments for administrators should be scoped at directory level (not Administrative Unit level). 

> [!NOTE]
> Other roles with permissions to manage groups (such as Exchange Administrators for non-role-assignable M365 groups) and administrators with assignments scoped at administrative unit level can manage groups through Groups API/UX and override changes made in Microsoft Entra PIM.

## When notifications are sent

Privileged Identity Management sends email notifications to administrators and affected users of PIM for Groups assignments that are expiring:

- Within 14 days prior to expiration
- One day prior to expiration
- When an assignment expires

Administrators receive notifications when a user or group requests to extend or renew an expiring or expired assignment. When an administrator resolves the request, all administrators and the requesting user are notified of the approval or denial.

## Extend group assignments

The following steps outline the process for requesting, resolving, or administering an extension or renewal of a group membership or ownership assignment.

### Self-extend expiring assignments

Users assigned group membership or ownership can extend expiring group assignments directly from the **Eligible** or **Active** tab on the **Assignments** page for the group. Users or groups can request to extend eligible and active assignments that expire in the next 14 days.

:::image type="content" source="media/pim-for-groups/pim-group-11.png" alt-text="Screenshot of where to self-extend expiring assignments." lightbox="media/pim-for-groups/pim-group-11.png":::

When the assignment end date-time is within 14 days, the **Extend** command is available. To request an extension of a group assignment, select **Extend** to open the request form.

:::image type="content" source="media/pim-for-groups/pim-group-12.png" alt-text="Screenshot of where to extend group assignment pane with a Reason box and details." lightbox="media/pim-for-groups/pim-group-12.png":::

>[!NOTE]
>We recommend including the details of why the extension is necessary, and for how long the extension should be granted (if you have this information).

Administrators receive an email notification requesting that they review the extension request. If a request to extend has already been submitted, an Azure notification appears in the portal.

To view the status of or cancel your request, open the **Pending requests** page for the group assignment.

:::image type="content" source="media/pim-for-groups/pim-group-13.png" alt-text="Screenshot of the pending requests page showing the link to Cancel." lightbox="media/pim-for-groups/pim-group-13.png":::

### Admin approved extension

When a user or group submits a request to extend a group assignment, administrators receive an email notification that contains the details of the original assignment and the reason for the request. The notification includes a direct link to the request for the administrator to approve or deny.

In addition to using following the link from email, administrators can approve or deny requests by going to the Privileged Identity Management administration portal and selecting **Approve requests** in the left pane.

:::image type="content" source="media/pim-for-groups/pim-group-14.png" alt-text="Screenshot of the approve requests page listing requests and links to approve or deny." lightbox="media/pim-for-groups/pim-group-14.png":::

When an Administrator selects **Approve** or **Deny**, the details of the request are shown, along with a field to provide a business justification for the audit logs.

:::image type="content" source="media/pim-for-groups/pim-group-15.png" alt-text="Screenshot of where to approve group assignment request with requestor reason, assignment type, start time, end time, and reason." lightbox="media/pim-for-groups/pim-group-15.png":::

When approving a request to extend a group assignment, resource administrators can choose a new start date, end date, and assignment type. Changing assignment type might be necessary if the administrator wants to provide limited access to complete a specific task (one day, for example). In this example, the administrator can change the assignment from **Eligible** to **Active**. This means they can provide access to the requestor without requiring them to activate.

### Admin initiated extension

If a user assigned to a group doesn't request an extension for the group assignment, an administrator can extend an assignment on behalf of the user. Administrative extensions of group assignment do not require approval, but notifications are sent to all other administrators after the assignment has been extended.

To extend a group assignment, browse to the assignment view in Privileged Identity Management. Find the assignment that requires an extension. Then select **Extend** in the action column.

:::image type="content" source="media/pim-for-groups/pim-group-16.png" alt-text="Screenshot of the assignments page listing eligible group assignments with links to extend." lightbox="media/pim-for-groups/pim-group-16.png":::

## Renew group assignments

While conceptually similar to the process for requesting an extension, the process to renew an expired group assignment is different. Using the following steps, assignments and administrators can renew access to expired assignments when necessary.

### Self-renew

Users who can no longer access resources can access up to 30 days of expired assignment history. To do this, they browse to **My Roles** in the left pane, and then select the **Expired assignments** tab.

The list of assignments shown defaults to **Eligible assignments**. Use the drop-down menu to toggle between Eligible and Active assignments.

To request renewal for any of the group assignments in the list, select the **Renew** action. Then provide a reason for the request. It's helpful to provide a duration in addition to any additional context or a business justification that can help the resource administrator decide to approve or deny.

After the request has been submitted, resource administrators are notified of a pending request to renew a group assignment.

### Admin approves

Resource administrators can access the renewal request from the link in the email notification or by accessing Privileged Identity Management from the Microsoft Entra admin center and selecting **Approve requests** from the left pane.

When an administrator selects **Approve** or **Deny**, the details of the request are shown along with a field to provide a business justification for the audit logs.

When approving a request to renew a group assignment, resource administrators must enter a new start date, end date, and assignment type.

## Next steps

- [Approve activation requests for group members and owners](groups-approval-workflow.md)
- [Configure PIM for Groups settings](groups-role-settings.md)
