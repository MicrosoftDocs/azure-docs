---
title: How to perform an access review | Microsoft Docs
description: Learn how to perform a review with the Azure Privileged Identity Management application.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: 49ee2feb-7d2e-4acf-82c1-40ff23062862
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/06/2017
ms.author: billmath
ms.custom: pim
---
# How to perform an access review in Azure AD Privileged Identity Management
Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged access to resources in Azure AD and other Microsoft online services like Office 365 or Microsoft Intune.  

If you are assigned to an administrative role, your organization's privileged role administrator may ask you to regularly confirm that you still need that role for your job. You might get an email that includes a link, or you can go straight to the [Azure portal](https://portal.azure.com). Follow the steps in this article to perform a self-review of your assigned roles.

If you're a privileged role administrator interested in access reviews, get more details at [How to start an access review](active-directory-privileged-identity-management-how-to-start-security-review.md).

## Add the Privileged Identity Management application
You can use the Azure AD Privileged Identity Management (PIM) application in the [Azure portal](https://portal.azure.com/) to perform your review.  If you don't have the Azure AD Privileged Identity Management application on your portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select your username in the upper right-hand corner of the Azure portal, and select the directory where you will you be operating.
3. Select **More services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application will open.

## Approve or deny access
When you approve or deny access, you're just telling the reviewer whether you still use this role or not. Choose **Approve** if you want to stay in the role, or **Deny** if you don't need the access anymore. Your status won't change right away, until the reviewer applies the results.
Follow these steps to find and complete the access review:

1. In the PIM application, select **Review privileged access**. If you have any pending access reviews, they appear in the Azure AD Access reviews blade.
2. Select the review you want to complete.
3. Unless you created the review, you appear as the only user in the review. Select the check mark next to your name.
4. Choose either **Approve** or **Deny**. You may need to include a reason for your decision in the **Provide a reason** text box.  
5. Close the **Review Azure AD roles** blade.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[!INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png
