---
title: Activate my Azure AD roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to activate Azure AD roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: karenhoran
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 10/07/2021
ms.author: curtand
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Activate my Azure AD roles in PIM

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) simplifies how enterprises manage privileged access to resources in Azure AD and other Microsoft online services like Microsoft 365 or Microsoft Intune.  

If you have been made *eligible* for an administrative role, then you must *activate* the role assignment when you need to perform privileged actions. For example, if you occasionally manage Microsoft 365 features, your organization's privileged role administrators might not make you a permanent Global Administrator, since that role impacts other services, too. Instead, they would make you eligible for Azure AD roles such as Exchange Online Administrator. You can request to activate that role when you need its privileges, and then you'll have administrator control for a predetermined time period.

This article is for administrators who need to activate their Azure AD role in Privileged Identity Management.

## Activate a role

When you need to assume an Azure AD role, you can request activation by opening **My roles** in Privileged Identity Management.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**. For information about how to add the Privileged Identity Management tile to your dashboard, see [Start using Privileged Identity Management](pim-getting-started.md).

1. Select **My roles**, and then select **Azure AD roles** to see a list of your eligible Azure AD roles.

    ![My roles page showing roles you can activate](./media/pim-how-to-activate-role/my-roles.png)

1. In the **Azure AD roles** list, find the role you want to activate.

    ![Azure AD roles - My eligible roles list](./media/pim-how-to-activate-role/activate-link.png)

1. Select **Activate** to open the Activate pane.

    ![Azure AD roles - activation page contains duration and scope](./media/pim-how-to-activate-role/activate-page.png)

1. Select **Additional verification required** and follow the instructions to provide security verification. You are required to authenticate only once per session.

    ![Screen to provide security verification such as a PIN code](./media/pim-resource-roles-activate-your-roles/resources-mfa-enter-code.png)

1. After multifactor authentication, select **Activate before proceeding**.

    ![Verify my identity with MFA before role activates](./media/pim-how-to-activate-role/activate-role-mfa-banner.png)

1. If you want to specify a reduced scope, select **Scope** to open the filter pane. On the filter pane, you can specify the Azure AD resources that you need access to. It's a best practice to request access to the fewest resources that you need.

1. If necessary, specify a custom activation start time. The Azure AD role would be activated after the selected time.

1. In the **Reason** box, enter the reason for the activation request.

1. Select **Activate**.

    If the [role requires approval](pim-resource-roles-approval-workflow.md) to activate, a notification will appear in the upper right corner of your browser informing you the request is pending approval.

    ![Activation request is pending approval notification](./media/pim-resource-roles-activate-your-roles/resources-my-roles-activate-notification.png)

## Activate a role using Graph API

### Get all eligible roles that you can activate

When a user gets their role eligibility via group membership, this Graph request doesn't return their eligibility.

#### HTTP request

````HTTP
GET https://graph.microsoft.com/beta/roleManagement/directory/roleEligibilityScheduleRequests/filterByCurrentUser(on='principal')  
````

#### HTTP response

To save space we're showing only the response for one role, but all eligible role assignments that you can activate will be listed.

````HTTP
{ 
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#Collection(unifiedRoleEligibilityScheduleRequest)", 
    "value": [ 
        { 
            "@odata.type": "#microsoft.graph.unifiedRoleEligibilityScheduleRequest", 
            "id": "<request-ID-GUID>", 
            "status": "Provisioned", 
            "createdDateTime": "2021-07-15T19:39:53.33Z", 
            "completedDateTime": "2021-07-15T19:39:53.383Z", 
            "approvalId": null, 
            "customData": null, 
            "action": "AdminAssign", 
            "principalId": "<principal-ID-GUID>", 
            "roleDefinitionId": "<definition-ID-GUID>", 
            "directoryScopeId": "/", 
            "appScopeId": null, 
            "isValidationOnly": false, 
            "targetScheduleId": "<schedule-ID-GUID>", 
            "justification": "test", 
            "createdBy": { 
                "application": null, 
                "device": null, 
                "user": { 
                    "displayName": null, 
                    "id": "<user-ID-GUID>" 
                } 
            }, 
            "scheduleInfo": { 
                "startDateTime": "2021-07-15T19:39:53.3846704Z", 
                "recurrence": null, 
                "expiration": { 
                    "type": "noExpiration", 
                    "endDateTime": null, 
                    "duration": null 
                } 
            }, 
            "ticketInfo": { 
                "ticketNumber": null, 
                "ticketSystem": null 
            } 
        },
} 
````

### Activate a role assignment with justification

#### HTTP request

````HTTP
POST https://graph.microsoft.com/beta/roleManagement/directory/roleAssignmentScheduleRequests 

{ 
    "action": "SelfActivate", 
    "justification": "adssadasasd", 
    "roleDefinitionId": "<definition-ID-GUID>", 
    "directoryScopeId": "/", 
    "principalId": "<principal-ID-GUID>" 
} 
````

#### HTTP response

````HTTP
{ 
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/roleAssignmentScheduleRequests/$entity", 
    "id": "f1ccef03-8750-40e0-b488-5aa2f02e2e55", 
    "status": "PendingApprovalProvisioning", 
    "createdDateTime": "2021-07-15T19:51:07.1870599Z", 
    "completedDateTime": "2021-07-15T19:51:17.3903028Z", 
    "approvalId": "<approval-ID-GUID>", 
    "customData": null, 
    "action": "SelfActivate", 
    "principalId": "<principal-ID-GUID>", 
    "roleDefinitionId": "<definition-ID-GUID>", 
    "directoryScopeId": "/", 
    "appScopeId": null, 
    "isValidationOnly": false, 
    "targetScheduleId": "<schedule-ID-GUID>", 
    "justification": "test", 
    "createdBy": { 
        "application": null, 
        "device": null, 
        "user": { 
            "displayName": null, 
            "id": "<user-ID-GUID>" 
        } 
    }, 
    "scheduleInfo": { 
        "startDateTime": null, 
        "recurrence": null, 
        "expiration": { 
            "type": "afterDuration", 
            "endDateTime": null, 
            "duration": "PT5H30M" 
        } 
    }, 
    "ticketInfo": { 
        "ticketNumber": null, 
        "ticketSystem": null 
    } 
} 
````

## View the status of activation requests

You can view the status of your pending requests to activate.

1. Open Azure AD Privileged Identity Management.

1. Select **My requests** to see a list of your Azure AD role and Azure resource role requests.

    ![My requests - Azure AD page showing your pending requests](./media/pim-how-to-activate-role/my-requests-page.png)

1. Scroll to the right to view the **Request Status** column.

## Cancel a pending request for new version

If you do not require activation of a role that requires approval, you can cancel a pending request at any time.

1. Open Azure AD Privileged Identity Management.

1. Select **My requests**.

1. For the role that you want to cancel, select the **Cancel** link.

    When you select Cancel, the request will be canceled. To activate the role again, you will have to submit a new request for activation.

   ![My request list with Cancel action highlighted](./media/pim-resource-roles-activate-your-roles/resources-my-requests-cancel.png)

## Deactivate a role assignment

five minutes
UX deactivate a role assignment can't within five minutes of activation

"SQL Server 2019 Big Data Clusters" and "big data clusters"
WACTH

Press deaCTIVATE LOOKS LIKE IT DOES BUT THERE'S A LAG
not instantaneous
Section in Activate articles for Deactivate. AD roles

## Troubleshoot portal delay

### Permissions aren't granted after activating a role

When you activate a role in Privileged Identity Management, the activation may not instantly propagate to all portals that require the privileged role. Sometimes, even if the change is propagated, web caching in a portal may result in the change not taking effect immediately. If your activation is delayed, sign out of the portal you are trying to perform the action and then sign back in. In the Azure portal, PIM signs you out and back in automatically.

## Next steps

- [View audit history for Azure AD roles](pim-how-to-use-audit-log.md)
