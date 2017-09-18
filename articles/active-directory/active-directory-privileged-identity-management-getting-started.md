---
title: Get started with Azure AD Privileged Identity Management | Microsoft Docs
description: Learn how to manage privileged identities with the Azure Active Directory Privileged Identity Management application in Azure portal.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: 2299db7d-bee7-40d0-b3c6-8d628ac61071
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/27/2017
ms.author: billmath
ms.custom: pim ; H1Hack27Feb2017
---
# Start using Azure AD Privileged Identity Management
With Azure Active Directory (AD) Privileged Identity Management, you can manage, control, and monitor access within your organization. This scope includes access to resources in Azure AD and other Microsoft online services like Office 365 or Microsoft Intune.

This article tells you how to add the Azure AD PIM app to your Azure portal dashboard.

## Add the Privileged Identity Management application
Before you use Azure AD Privileged Identity Management, you need to add the application to your Azure portal dashboard.

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your directory.
2. If your organization has more than one directory, select your username in the upper right-hand corner of the Azure portal. Select the directory where you want to use PIM.
3. Select **More services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application opens.

If you're the first person to use Azure AD Privileged Identity Management in your directory, you are automatically assigned the **Security administrator** and **Privileged role administrator** roles in the directory. Only privileged role administrators can manage role assignments of users. In addition, you may choose to run the [security wizard.](active-directory-privileged-identity-management-security-wizard.md) that walks you through the initial discovery and assignment experience.

## Navigate to your tasks
Once Azure AD Privileged Identity Management is set up, you see the navigation blade whenever you open the application. Use this blade to accomplish your identity management tasks.

![Top-level tasks for PIM - screenshot](./media/active-directory-privileged-identity-management-getting-started/PIM_Tasks_New.png)

* **My Roles** takes you to a list of roles that are assigned to you. This section is where you activate any roles that you are eligible for.
* **Approve Requests (Preview)** displays a list of pending activation requests from users in your directory. [Learn more.](./privileged-identity-management/azure-ad-pim-approval-workflow.md)
* **Pending Requests (Preview)** displays any current requests to have made to activate.
* **Review Access** takes you to any pending access reviews that you need to complete, whether you're reviewing access for yourself or someone else.
* **Azure AD Directory Roles** located under the 'Manage' section is the dashboard for privileged role admins to manage role assignments, change role activation settings, start access reviews, and more. The options in this dashboard are disabled for anyone who isn't a privileged role administrator.

## Next steps
The [Azure AD Privileged Identity Management overview](active-directory-privileged-identity-management-configure.md) includes more details on how you can manage administrative access in your organization.

[!INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png
