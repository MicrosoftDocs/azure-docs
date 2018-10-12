---
title: Remove an application registered with Microsoft identity platform | Azure
description: Learn how to remove an application registered with Microsoft identity platform.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/17/2018
ms.author: celested
ms.custom: aaddev
ms.reviewer: lenalepa, sureshja
#Customer intent: As an application developer, I want to know how to remove my application from Azure Active Directory.
---

# Quickstart: Remove an application registered with Microsoft identity platform (Preview)

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with Microsoft identity platform may need to remove an application's registration.

In this quickstart, you'll learn how to:

* [Remove an application authored by you or your organization](#remove-an-application-authored-by-your-organization)
* [Remove an application authored by another organization](#remove-an-application-authoried-by-another-organization)

## Prerequisites

To get started, you'll need an account that has applications registered to it. To learn how to add and register apps, see [Register an application with Microsoft identity platform](quickstart-add-azure-ad-app-preview.md).

## Remove an application authored by you or your organization

Applications that you or your organization have registered are represented by both an application object and service principal object in your tenant. For more information, see [Application Objects and Service Principal Objects](active-directory-application-objects.md).

### To remove an application

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, select the **Azure Active Directory** service, then select **App registrations**. Find and select the application that you want to configure. Once you've selected the app, you'll see the application's **Overview** page.
4. From the **Overview** page, select **Delete**.
5. Select **Yes** to confirm that you want to delete the app.

  > [!NOTE]
  > To delete an application, you need to be listed as an owner of the application or have admin privileges.

## Remove an application authored by another organization

If you are viewing **App registrations** in the context of a tenant, a subset of the applications that appear under the **All apps** tab are from another tenant and were registered into your tenant during the consent process. More specifically, they are represented by only a service principal object in your tenant, with no corresponding application object. For more information on the differences between application and service principal objects, see [Application and service principal objects in Azure AD](active-directory-application-objects.md).

In order to remove an application’s access to your directory (after having granted consent), the company administrator must remove its service principal. The administrator must have global admin access, and can remove the application through the Azure portal or use the [Azure AD PowerShell Cmdlets](http://go.microsoft.com/fwlink/?LinkId=294151) to remove access.

## Next steps

Learn about these other related app management quickstarts:

- [Register an application with Microsoft identity platform](quickstart-add-azure-ad-app-preview.md)
- [Update an application registered with Microsoft identity platform](quickstart-update-azure-ad-app-preview.md)
