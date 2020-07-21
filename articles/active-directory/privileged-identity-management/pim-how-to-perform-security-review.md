---
title: Review access to Azure AD roles in PIM - Azure AD | Microsoft Docs
description: Learn how to review access of Azure Active Directory roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 04/24/2020
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Review access to Azure AD roles in Privileged Identity Management

Privileged Identity Management (PIM) simplifies how enterprises manage privileged access to resources in Azure Active Directory (AD) and other Microsoft online services like Office 365 or Microsoft Intune. Follow the steps in this article to successfully self-review your assigned roles.

If you are assigned to an administrative role, your organization's privileged role administrator may ask you to regularly confirm that you still need that role for your job. You might get an email that includes a link, or you can go straight to the [Azure portal](https://portal.azure.com) and begin.

If you're a privileged role administrator or global administrator interested in access reviews, get more details at [How to start an access review](pim-how-to-start-security-review.md).

## Add a PIM dashboard tile

If you don't have the Privileged Identity Management service pinned to your dashboard in your Azure portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select your username in the upper right-hand corner of the Azure portal, and select the Azure AD organization where you will you be operating.
3. Select **All services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application will open.

## Approve or deny access

When you approve or deny access, you're just telling the reviewer whether you still use this role or not. Choose **Approve** if you want to stay in the role, or **Deny** if you don't need the access anymore. Your status won't change right away, until the reviewer applies the results.
Follow these steps to find and complete the access review:

1. In the Privileged Identity Management service, select **Review privileged access**. If you have any pending access reviews, they appear in the Azure AD **Access reviews** page.
2. Select the review you want to complete.
3. Unless you created the review, you appear as the only user in the review. Select the check mark next to your name.
4. Choose either **Approve** or **Deny**. You may need to include a reason for your decision in the **Provide a reason** text box.  
5. Close the **Review Azure AD roles** blade.

## Next steps

- [Perform an access review of my Azure resource roles in PIM](pim-resource-roles-perform-access-review.md)
