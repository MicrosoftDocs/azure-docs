---
title: Review access to Azure resource roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to review access of Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: pim
ms.date: 03/30/2018
ms.author: rolyon
ms.custom: pim
ms.collection: M365-identity-device-management
---


# Review access to Azure resource roles in PIM
Azure Active Directory (Azure AD) Privileged Identity Management (PIM) simplifies how enterprises manage privileged access to resources in Azure. 

If you are assigned to an administrative role, your organization's privileged role administrator might ask you to regularly confirm that you still need that role for your job. You might get an email that includes a link, or you can go straight to the [Azure portal](https://portal.azure.com). Follow the steps in this article to perform a self-review of your assigned roles.

If you're a privileged role administrator interested in access reviews, get more details at [How to start an access review](pim-resource-roles-start-access-review.md).

## Add the Privileged Identity Management application
You can use the Azure Active Directory (Azure AD) PIM application in the [Azure portal](https://portal.azure.com/) to perform your review. If you don't have the application in your portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select your user name in the upper right-hand corner of the Azure portal, and select the directory where you will you be operating.
3. Select **All services**, and use the **Filter** box to search for *Azure AD Privileged Identity Management*.
4. Check **Pin to dashboard**, and then select **Create**. The PIM application opens.

## Approve or deny access
When you approve or deny access, you're just telling the reviewer whether you still use this role or not. Choose **Approve** if you want to stay in the role, or **Deny** if you don't need the access anymore. Your status changes only when the reviewer applies the results.

Follow these steps to find and complete the access review:
1. Browse to the Azure AD PIM application.
2. Select the **Review access** blade.

   ![Screenshot of PIM application, with Review access blade selected](media/pim-resource-roles-perform-access-review/rbac-access-review-complete.png)

3. Select the review you want to complete. 
4. Choose either **Approve** or **Deny**. In the **Provide a reason box**, you might need to include a reason for your decision.

   ![Screenshot of Review details page](media/pim-resource-roles-perform-access-review/rbac-access-review-choice.png)

## Next steps

- [Perform an access review of my Azure AD roles in PIM](pim-how-to-perform-security-review.md)
