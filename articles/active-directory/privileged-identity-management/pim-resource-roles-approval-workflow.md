---
title: Approve requests for Azure resource roles in PIM
description: Learn how to approve or deny requests for Azure resource roles in Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 09/14/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Approve or deny requests for Azure resource roles in Privileged Identity Management

Microsoft Entra Privileged Identity Management (PIM) enables you to configure roles so that they require approval for activation, and choose users or groups from your Microsoft Entra organization as delegated approvers. We recommend selecting two or more approvers for each role to reduce workload for the privileged role administrator. Delegated approvers have 24 hours to approve requests. If a request isn't approved within 24 hours, then the eligible user must re-submit a new request. The 24 hour approval time window isn't configurable.

Follow the steps in this article to approve or deny requests for Azure resource roles.


## View pending requests

As a delegated approver, you receive an email notification when an Azure resource role request is pending your approval. You can view these pending requests in Privileged Identity Management.


1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged role administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity governance** > **Privileged Identity Management** > **Approve requests**.

    ![Approve requests - Azure resources page showing request to review](./media/pim-resource-roles-approval-workflow/resources-approve-requests.png)

    In the **Requests for role activations** section, you see a list of requests pending your approval.


## Approve requests

 1. Find and select the request that you want to approve. An approve or deny page appears.     
 2. In the **Justification** box, enter the business justification.
 3. Select **Approve**. You will receive an Azure notification of your approval.


## Approve pending requests using Microsoft ARM API

>[!NOTE]
> Approval for **extend and renew** requests is currently not supported by the Microsoft ARM API

### Get IDs for the steps that require approval

To get the details of any stage of a role assignment approval, you can use [Role Assignment Approval Step - Get By ID](/rest/api/authorization/role-assignment-approval-step/get-by-id?tabs=HTTP) REST API.

#### HTTP request

````HTTP
GET https://management.azure.com/providers/Microsoft.Authorization/roleAssignmentApprovals/{approvalId}/stages/{stageId}?api-version=2021-01-01-preview
````


### Approve the activation request step

#### HTTP request

````HTTP
PATCH 
PATCH https://management.azure.com/providers/Microsoft.Authorization/roleAssignmentApprovals/{approvalId}/stages/{stageId}?api-version=2021-01-01-preview 
{ 
    "reviewResult": "Approve", // or "Deny"
    "justification": "Trusted User" 
} 
 ````

#### HTTP response

Successful PATCH calls generate an empty response.

For more information, see [Use Role Assignment Approvals to approve PIM role activation requests with REST API](/rest/api/authorization/privileged-approval-sample)

## Deny requests

 1. Find and select the request that you want to approve. An approve or deny page appears.     
 2. In the **Justification** box, enter the business justification.
 3. Select **Deny**. A notification appears with your denial.

## Workflow notifications

Here's some information about workflow notifications:

- Approvers are notified by email when a request for a role is pending their review. Email notifications include a direct link to the request, where the approver can approve or deny.
- Requests are resolved by the first approver who approves or denies.
- When an approver responds to the request, all approvers are notified of the action.
- Resource administrators are notified when an approved user becomes active in their role.

>[!Note]
>A resource administrator who believes that an approved user should not be active can remove the active role assignment in Privileged Identity Management. Although resource administrators are not notified of pending requests unless they are an approver, they can view and cancel pending requests for all users by viewing pending requests in Privileged Identity Management.

## Next steps

- [Email notifications in Privileged Identity Management](pim-email-notifications.md)
- [Approve or deny requests for Microsoft Entra roles in Privileged Identity Management](./pim-approval-workflow.md)
