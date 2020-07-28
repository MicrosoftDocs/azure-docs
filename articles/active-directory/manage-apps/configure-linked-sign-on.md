---
title: Linked sign-on for Azure AD apps - Microsoft identity platform
description: Configure linked single sign-on (SSO) to your Azure AD enterprise applications in Microsoft identity platform (Azure AD)
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 05/08/2019
ms.author: kenwith
ms.reviewer: arvinh,luleon
ms.collection: M365-identity-device-management
---

# Configure linked sign-on

When you add a gallery or non-gallery web application, one of the single sign-on options available to you is [linked sign-on](what-is-single-sign-on.md). Select this option to add a link to the application in your organization's Azure AD Access Panel or Office 365 portal. You can use this method to add links to custom web applications that currently use Active Directory Federation Services (or other federation service) instead of Azure AD for authentication. Or, you can add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels.

## Before you begin

If the application hasn't been added to your Azure AD tenant, see [Add a gallery app](add-gallery-app.md) or [Add a non-gallery app](add-non-gallery-app.md).

### Open the app and select linked sign-on

1. Sign in to the [Azure portal](https://portal.azure.com) as a cloud application admin, or an application admin for your Azure AD tenant.

1. Navigate to **Azure Active Directory** > **Enterprise applications**. A random sample of the applications in your Azure AD tenant appears. 

1. In the **Application Type** menu, select **All applications**, and then select **Apply**.

1. Enter the name of the application in the search box, and then select the application from the results.

1. Under the **Manage** section, select **Single sign-on**. 

1. Select **Linked**.

1. Enter the URL of the application to link to. Type the URL and select **Save**. 
 
1. You may assign users and groups to the application, which causes the application to appear in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](end-user-experiences.md) for those users.

1. Select **Save**.

## Next steps

- [Assign users or groups to the application](methods-for-assigning-users-and-groups.md)
- [Configure automatic user account provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md)
