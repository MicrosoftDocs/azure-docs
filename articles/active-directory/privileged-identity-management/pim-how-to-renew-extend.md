---
title: Renew Microsoft Entra role assignments in PIM
description: Learn how to extend or renew Microsoft Entra role assignments in Microsoft Entra Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: pim
ms.date: 09/13/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Extend or renew Microsoft Entra role assignments in Privileged Identity Management

Microsoft Entra Privileged Identity Management (PIM) provides controls to manage the access and assignment lifecycle for roles in Microsoft Entra ID. Administrators can assign roles using start and end date-time properties. When the assignment end approaches, Privileged Identity Management sends email notifications to the affected users or groups. It also sends email notifications to Microsoft Entra administrators to ensure that appropriate access is maintained. Assignments might be renewed and remain visible in an expired state for up to 30 days, even if access is not extended.

## Who can extend and renew?

Only Global Administrators or Privileged Role administrators can extend or renew Microsoft Entra role assignments. The affected user or group can ask to extend roles that are about to expire and request to renew roles that are already expired.

## When are notifications sent?

Privileged Identity Management sends email notifications to administrators and affected user or groups of roles that are expiring within 14 days and one day prior to expiration. It sends another email when an assignment officially expires.

Administrators receive notifications when a user or group assigned an expiring or expired role requests to extend or renew. When an administrator resolves a request as approved or denied, all other administrators are notified of the decision. Then the requesting user or group is notified of the decision.

## Extend role assignments

The following steps outline the process for requesting, resolving, or administering an extension or renewal of a role assignment.

### Self-extend expiring assignments

Users assigned to a role can extend expiring role assignments directly from the **Eligible** or **Active** tab on the **My roles** page, either under **Microsoft Entra roles** or from the top level **My roles** page of the Privileged Identity Management portal. In the portal, users can request to extend eligible or active (assigned) roles that expire in the next 14 days.

![Microsoft Entra roles - My roles page listing eligible roles with an Action column](./media/pim-how-to-renew-extend/pim-extend-link-in-portal.png)

When the assignment end date and time is within 14 days, the button to **Extend** becomes an active link in the user interface. In the following example, assume the current date is March 27.

>[!Note]
>For a group assigned to a role, the **Extend** link never becomes available so that a user with an inherited assignment can't extend the group assignment.

![Action column with links to Activate or Extend](./media/pim-how-to-renew-extend/pim-extend-within-fourteen.png)

To request an extension of this role assignment, select **Extend** to open the request form.

![Extend role assignment pane with a Reason box](./media/pim-how-to-renew-extend/extend-role-assignment-request.png)

Enter a reason for the extension request, and then select **Extend**.

>[!NOTE]
>We recommend including the details of why the extension is necessary, and for how long the extension should be granted (if you have this information).

Administrators receive an email notification to review the extension request. If a request to extend has already been submitted, an Azure notification appears in the portal.

![Notification explaining that there is already an existing pending role assignment extension](./media/pim-how-to-renew-extend/extend-notification.png)

Go to the **Pending requests** page to view the status of your request or to cancel it.

![Microsoft Entra roles - Pending requests page listing any pending requested and a link to Cancel](./media/pim-how-to-renew-extend/pending-requests.png)

### Admin approved extension

When a user or group submits a request to extend a role assignment, administrators receive an email notification that contains the details of the original assignment and the reason for the request. The notification includes a direct link to the request for the administrator to approve or deny.

In addition to using following the link from email, administrators can approve or deny requests by going to the Privileged Identity Management administration portal and selecting **Approve requests** in the left pane.

![Microsoft Entra roles - Approve requests page listing requests and links to approve or deny](./media/pim-how-to-renew-extend/extend-admin-approve-list.png)

When an Administrator selects **Approve** or **Deny**, the details of the request are shown, along with a field to provide a business justification for the audit logs.

![Approve role assignment request with requestor reason, assignment type, start time, end time, and reason](./media/pim-how-to-renew-extend/extend-admin-approve-form.png)

When approving a request to extend role assignment, administrators can choose a new start date, end date, and assignment type. Changing assignment type might be necessary if the administrator wants to provide limited access to complete a specific task (one day, for example). In this example, the administrator can change the assignment from **Eligible** to **Active**. This means they can provide access to the requestor without requiring them to activate.

### Admin initiated extension

If a user assigned to a role doesn't request an extension for the role assignment, an administrator can extend an assignment on behalf of the user. Administrative extensions of role assignment do not require approval, but notifications are sent to all other administrators after the role has been extended.

To extend a role assignment, browse to the role or assignment view in Privileged Identity Management. Find the assignment that requires an extension. Then select **Extend** in the action column.

![Microsoft Entra roles - Assignments page listing eligible roles with links to extend](./media/pim-how-to-renew-extend/extend-admin-extend.png)

## Extend role assignments using Microsoft Graph API

In the following request, an administrator extends an active assignment using Microsoft Graph API.

#### HTTP request


````HTTP
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignmentScheduleRequests 
 
{
    "action": "adminExtend",
    "justification": "TEST",
    "roleDefinitionId": "31392ffb-586c-42d1-9346-e59415a2cc4e",
    "directoryScopeId": "/",
    "principalId": "071cc716-8147-4397-a5ba-b2105951cc0b",
    "scheduleInfo": {
        "startDateTime": "2022-04-10T00:00:00Z",
        "expiration": {
            "type": "afterDuration",
            "duration": "PT3H"
        }
    }
}
````

#### HTTP response

````HTTP
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#roleManagement/directory/roleAssignmentScheduleRequests/$entity",
    "id": "c3a3aa36-22e2-4240-8e4c-ea2a3af7c30f",
    "status": "Provisioned",
    "createdDateTime": "2022-05-13T16:18:36.3647674Z",
    "completedDateTime": "2022-05-13T16:18:40.0835993Z",
    "approvalId": null,
    "customData": null,
    "action": "adminExtend",
    "principalId": "071cc716-8147-4397-a5ba-b2105951cc0b",
    "roleDefinitionId": "31392ffb-586c-42d1-9346-e59415a2cc4e",
    "directoryScopeId": "/",
    "appScopeId": null,
    "isValidationOnly": false,
    "targetScheduleId": "c3a3aa36-22e2-4240-8e4c-ea2a3af7c30f",
    "justification": "TEST",
    "createdBy": {
        "application": null,
        "device": null,
        "user": {
            "displayName": null,
            "id": "3fbd929d-8c56-4462-851e-0eb9a7b3a2a5"
        }
    },
    "scheduleInfo": {
        "startDateTime": "2022-05-13T16:18:40.0835993Z",
        "recurrence": null,
        "expiration": {
            "type": "afterDuration",
            "endDateTime": null,
            "duration": "PT3H"
        }
    },
    "ticketInfo": {
        "ticketNumber": null,
        "ticketSystem": null
    }
}
````

## Renew role assignments

While conceptually similar to the process for requesting an extension, the process to renew an expired role assignment is different. Using the following steps, assignments and administrators can renew access to expired roles when necessary.

### Self-renew

Users who can no longer access resources can access up to 30 days of expired assignment history. To do this, they browse to **My Roles** in the left pane, and then select the **Expired roles** tab in the Microsoft Entra roles section.

![My roles page - Expired roles tab](./media/pim-how-to-renew-extend/renew-from-myroles.png)

The list of roles shown defaults to **Eligible roles**. Select **Eligible** or **Active** assigned roles.

To request renewal for any of the role assignments in the list, select the **Renew** action. Then provide a reason for the request. It's helpful to provide a duration in addition to any additional context or a business justification that can help the administrator decide whether to approve or deny.

![Renew role assignment pane showing Reason box](./media/pim-how-to-renew-extend/renew-request-form.png)

After the request has been submitted, administrators are notified of a pending request to renew a role assignment.

### Admin approves

Microsoft Entra administrators can access the renewal request from the link in the email notification, or by accessing Privileged Identity Management from the Microsoft Entra admin center and selecting **Approve requests** in PIM.

![Microsoft Entra roles - Approve requests page listing requests and links to approve or deny](./media/pim-how-to-renew-extend/extend-admin-approve-list.png)

When an administrator selects **Approve** or **Deny**, the details of the request are shown along with a field to provide a business justification for the audit logs.

![Approve role assignment request with requestor reason, assignment type, start time, end time, and reason](./media/pim-how-to-renew-extend/extend-admin-approve-form.png)

When approving a request to renew role assignment, administrators must enter a new start date, end date, and assignment type.

### Admin renew

They can also renew expired role assignments from within the **Expired** roles tab of a Microsoft Entra role. To view a list of all expired role assignments, on the **Assignments** screen, select **Expired roles**.

![Microsoft Entra roles - Assignments page listing expired roles with links to renew](./media/pim-how-to-renew-extend/renew-from-assignments-pane.png)

## Next steps

- [Approve or deny requests for Microsoft Entra roles in Privileged Identity Management](./pim-approval-workflow.md)
- [Configure Microsoft Entra role settings in Privileged Identity Management](pim-how-to-change-default-settings.md)
