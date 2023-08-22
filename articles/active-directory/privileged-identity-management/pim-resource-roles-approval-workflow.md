---
title: Approve requests for Azure resource roles in PIM
description: Learn how to approve or deny requests for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 06/24/2022
ms.author: billmath
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Approve or deny requests for Azure resource roles in Privileged Identity Management

With Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, you can configure roles to require approval for activation, and choose users or groups from your Azure AD organization as delegated approvers. We recommend selecting two or more approvers for each role to reduce workload for the privileged role administrator. Delegated approvers have 24 hours to approve requests. If a request is not approved within 24 hours, then the eligible user must re-submit a new request. The 24 hour approval time window is not configurable.

Follow the steps in this article to approve or deny requests for Azure resource roles.

>[!NOTE]
> Approval for **extend and renew** requests is currently not supported by the Microsoft Graph API

## View pending requests

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

As a delegated approver, you'll receive an email notification when an Azure resource role request is pending your approval. You can view these pending requests in Privileged Identity Management.

 1. Sign in to the [portal](https://portal.azure.com).
 2. Open **Azure AD Privileged Identity Management**.
 3. Select **Approve requests**.
     :::image type="content" source="media/pim-resource-roles-approval-workflow/approve-1.png" alt-text="Screenshot of pending resource reqeusts." lightbox="media/pim-resource-roles-approval-workflow/approve-1.png":::

 4. In the **Requests for role activations** section, you'll see a list of requests pending your approval.

## Approve requests

 1. Find and select the request that you want to approve. An approve or deny page appears.     
     :::image type="content" source="media/pim-resource-roles-approval-workflow/approve-1.png" alt-text="Screenshot of approve resource reqeusts." lightbox="media/pim-resource-roles-approval-workflow/approve-1.png":::
 
 2. In the **Justification** box, enter the business justification.
 3. Select **Approve**. You will receive an Azure notification of your approval.
      :::image type="content" source="media/azure-ad-pim-approval-workflow/approve-3.png" alt-text="Screenshot of resource approving." lightbox="media/azure-ad-pim-approval-workflow/approve-3.png":::

## Deny requests

 1. Find and select the request that you want to approve. An approve or deny page appears.     
     :::image type="content" source="media/pim-resource-roles-approval-workflow/approve-1.png" alt-text="Screenshot of deny resource reqeusts." lightbox="media/pim-resource-roles-approval-workflow/approve-1.png":::
 
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
- [Approve or deny requests for Azure AD roles in Privileged Identity Management](./pim-approval-workflow.md)
