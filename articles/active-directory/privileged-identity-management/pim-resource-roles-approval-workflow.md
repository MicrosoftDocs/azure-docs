---
title: Approve or deny requests for Azure resource roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to approve or deny requests for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 04/09/2019
ms.author: rolyon
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Approve or deny requests for Azure resource roles in PIM

With Azure Active Directory (Azure AD) Privileged Identity Management (PIM), you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Delegated approvers have 24 hours to approve requests. If a request is not approved within 24 hours, then the eligible user must re-submit a new request. The 24 hour approval time window is not configurable.

Follow the steps in this article to approve or deny requests for Azure resource roles.

## View pending requests

As a delegated approver, you'll receive an email notification when an Azure resource role request is pending your approval. You can view these pending requests in PIM.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Approve requests**.

    ![Approve requests - Azure resources page showing request to review](./media/pim-resource-roles-approval-workflow/resources-approve-requests.png)

    In the **Requests for role activations** section, you'll see a list of requests pending your approval.

## Approve requests

1. Find and click the request that you want to approve. An approve or deny pane appears.

    ![Approve requests - approve or deny pane with details and Justification box](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, type a reason.

1. Click **Approve**.

    A notification appears with your approval.

    ![Approve notification showing request was approved](./media/pim-resource-roles-approval-workflow/resources-approve-notification.png)

## Deny requests

1. Find and click the request that you want to deny. An approve or deny pane appears.

    ![Approve requests - approve or deny pane with details and Justification box](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, type a reason.

1. Click **Deny**.

    A notification appears with your denial.

## Workflow notifications

Here's some information about workflow notifications:

- All members of the approver list are notified by email when a request for a role is pending their review. Email notifications include a direct link to the request, where the approver can approve or deny.
- Requests are resolved by the first member of the list who approves or denies.
- When an approver responds to the request, all members of the approver list are notified of the action.
- Resource administrators are notified when an approved member becomes active in their role.

>[!Note]
>A resource administrator who believes that an approved member should not be active can remove the active role assignment in PIM. Although resource administrators are not notified of pending requests unless they are members of the approver list, they can view and cancel pending requests of all users by viewing pending requests in PIM. 

## Next steps

- [Extend or renew Azure resource roles in PIM](pim-resource-roles-renew-extend.md)
- [Email notifications in PIM](pim-email-notifications.md)
- [Approve or deny requests for Azure AD roles in PIM](azure-ad-pim-approval-workflow.md)
