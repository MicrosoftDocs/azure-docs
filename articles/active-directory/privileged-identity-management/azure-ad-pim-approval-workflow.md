---
title: Approve or deny requests for Azure AD roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to approve or deny requests for Azure AD roles in Azure AD Privileged Identity Management (PIM).
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
ms.subservice: pim
ms.date: 04/09/2019
ms.author: rolyon
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Approve or deny requests for Azure AD roles in PIM

With Azure Active Directory (Azure AD) Privileged Identity Management (PIM), you can configure roles to require approval for activation, and choose one or multiple users or groups as delegated approvers. Delegated approvers have 24 hours to approve requests. If a request is not approved within 24 hours, then the eligible user must re-submit a new request. The 24 hour approval time window is not configurable.

Follow the steps in this article to approve or deny requests for Azure AD roles.

## View pending requests

As a delegated approver, you'll receive an email notification when an Azure AD role request is pending your approval. You can view these pending requests in PIM.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD roles**.

1. Click **Approve requests**.

    ![Azure AD roles - Approve requests](./media/azure-ad-pim-approval-workflow/pim-directory-roles-approve-requests.png)

    You'll see a list of requests pending your approval.

## Approve requests

1. Select the requests you want to approve and then click **Approve** to open the Approve selected requests pane.

    ![Approve requests list with Approve option highlighted](./media/azure-ad-pim-approval-workflow/pim-approve-requests-list.png)

1. In the **Approve reason** box, type a reason.

    ![Approve selected requests pane with a approve reason](./media/azure-ad-pim-approval-workflow/pim-approve-selected-requests.png)

1. Click **Approve**.

    The Status symbol will be updated with your approval.

    ![Approve selected requests pane after Approve button clicked](./media/azure-ad-pim-approval-workflow/pim-approve-status.png)

## Deny requests

1. Select the requests you want to deny and then click **Deny** to open the Deny selected requests pane.

    ![Approve requests list with Deny option highlighted](./media/azure-ad-pim-approval-workflow/pim-deny-requests-list.png)

1. In the **Deny reason** box, type a reason.

    ![Deny selected requests pane with a deny reason](./media/azure-ad-pim-approval-workflow/pim-deny-selected-requests.png)

1. Click **Deny**.

    The Status symbol will be updated with your denial.

## Next steps

- [Email notifications in PIM](pim-email-notifications.md)
- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
