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

## View pending requests

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

As a delegated approver, you'll receive an email notification when an Azure resource role request is pending your approval. You can view these pending requests in Privileged Identity Management.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Approve requests**.

    ![Approve requests - Azure resources page showing request to review](./media/pim-resource-roles-approval-workflow/resources-approve-requests.png)

    In the **Requests for role activations** section, you'll see a list of requests pending your approval.

## Approve requests

1. Find and select the request that you want to approve. An approve or deny page appears.

    ![Approve requests - approve or deny pane with details and Justification box](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, enter the business justification.

1. Select **Approve**. You will receive an Azure notification of your approval.

    ![Approve notification showing request was approved](./media/pim-resource-roles-approval-workflow/resources-approve-notification.png)

## Deny requests

1. Find and select the request that you want to deny. An approve or deny page appears.

    ![Approve requests - approve or deny pane with details and Justification box](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, enter the business justification.

1. Select **Deny**. A notification appears with your denial.

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
- [Approve or deny requests for Azure AD roles in Privileged Identity Management](azure-ad-pim-approval-workflow.md)
