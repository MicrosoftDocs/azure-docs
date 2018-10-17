---
title: Approve or deny requests for Azure resource roles in PIM | Microsoft Docs
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
ms.component: pim
ms.date: 08/31/2018
ms.author: rolyon
ms.custom: pim
---

# Approve or deny requests for Azure resource roles in PIM

With Azure AD Privileged Identity Management (PIM), you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Follow the steps in this article to approve or deny requests for Azure resource roles.

## View pending requests

As a delegated approver, you'll receive an email notification when an Azure resource role request is pending your approval. You can view these pending requests in PIM.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Approve requests**.

    ![Azure resources - Approve requests](./media/pim-resource-roles-approval-workflow/resources-approve-requests.png)

    In the **Requests for role activations** section, you'll see a list of requests pending your approval.

## Approve requests

1. Find and click the request that you want to approve. An approval pane appears.

    ![Approve requests pane](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, type a reason.

1. Click **Approve**.

    A notification appears with your approval.

    ![Approve notification](./media/pim-resource-roles-approval-workflow/resources-approve-notification.png)

## Deny requests

1. Find and click the request that you want to deny. An approval pane appears.

    ![Approve requests pane](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png)

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
- [Approve or deny requests for Azure AD directory roles in PIM](azure-ad-pim-approval-workflow.md)
