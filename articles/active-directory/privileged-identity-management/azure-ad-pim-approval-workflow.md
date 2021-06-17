---
title: Approve or deny requests for Azure AD roles in PIM - Azure AD | Microsoft Docs
description: Learn how to approve or deny requests for Azure AD roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.service: active-directory
ms.subservice: pim
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/03/2021
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Approve or deny requests for Azure AD roles in Privileged Identity Management

With Azure Active Directory (Azure AD) Privileged Identity Management (PIM), you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Delegated approvers have 24 hours to approve requests. If a request is not approved within 24 hours, then the eligible user must re-submit a new request. The 24 hour approval time window is not configurable.

## View pending requests

As a delegated approver, you'll receive an email notification when an Azure AD role request is pending your approval. You can view these pending requests in Privileged Identity Management.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Approve requests**.

    ![Approve requests - page showing request to review Azure AD roles](./media/azure-ad-pim-approval-workflow/resources-approve-pane.png)

    In the **Requests for role activations** section, you'll see a list of requests pending your approval.

## Approve requests

1. Find and select the request that you want to approve. An approve or deny page appears.

    ![Screenshot that shows the "Approve requests - Azure AD roles" page.](./media/azure-ad-pim-approval-workflow/resources-approve-pane.png)

1. In the **Justification** box, enter the business justification.

1. Select **Approve**. You will receive an Azure notification of your approval.

    ![Approve notification showing request was approved](./media/pim-resource-roles-approval-workflow/resources-approve-pane.png))

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
- Global admins and Privileged role admins are notified when an approved user becomes active in their role.

>[!NOTE]
>A Global admin or Privileged role admin who believes that an approved user should not be active can remove the active role assignment in Privileged Identity Management. Although administrators are not notified of pending requests unless they are an approver, they can view and cancel any pending requests for all users by viewing pending requests in Privileged Identity Management.

## Next steps

- [Email notifications in Privileged Identity Management](pim-email-notifications.md)
- [Approve or deny requests for Azure resource roles in Privileged Identity Management](pim-resource-roles-approval-workflow.md)
