---
title: Approve or deny requests for Azure AD directory roles in PIM | Microsoft Docs
description: Learn how to approve or deny requests for Azure AD directory roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 08/29/2018
ms.author: rolyon
ms.custom: pim
---

# Approve or deny requests for Azure AD directory roles in PIM

With Azure AD Privileged Identity Management (PIM), you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Follow the steps in this article to approve or deny requests for Azure AD directory roles.

## View pending requests

As a delegated approver, you'll receive an email notification when an Azure AD directory role request is pending your approval. You can view these pending requests in PIM.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD directory roles**.

1. Click **Approve requests**.

    ![PIM Azure AD directory roles - Roles](./media/azure-ad-pim-approval-workflow/pim-directory-roles-approve-requests.png)

    You'll see a list of requests pending your approval.

## Approve requests

1. Select the requests you want to approve and then click **Approve** to open the Approve selected requests pane.

    ![PIM Approve requests list](./media/azure-ad-pim-approval-workflow/pim-approve-requests-list.png)

1. In the **Approve reason** box, type a reason.

    ![PIM Approve selected requests](./media/azure-ad-pim-approval-workflow/pim-approve-selected-requests.png)

1. Click **Approve**.

    The Status symbol will be updated with your approval.

    ![PIM Approve selected requests](./media/azure-ad-pim-approval-workflow/pim-approve-status.png)

## Deny requests

1. Select the requests you want to deny and then click **Deny** to open the Deny selected requests pane.

    ![PIM Approve requests list](./media/azure-ad-pim-approval-workflow/pim-deny-requests-list.png)

1. In the **Deny reason** box, type a reason.

    ![PIM Deny selected requests](./media/azure-ad-pim-approval-workflow/pim-deny-selected-requests.png)

1. Click **Deny**.

    The Status symbol will be updated with your denial.

## Next steps

- [Email notifications in PIM](pim-email-notifications.md)
- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
