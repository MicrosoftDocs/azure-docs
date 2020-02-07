---
title: Remove app registered with the Microsoft identity platform | Azure
description: Learn how to remove an application registered with the Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 05/08/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: aragra, lenalepa, sureshja
#Customer intent: As an application developer, I want to know how to remove my application from the Microsoft identity registered.
---

# Quickstart: Remove an application registered with the Microsoft identity platform

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with Microsoft identity platform may need to remove an application's registration.

In this quickstart, you'll learn how to:

* Remove an application authored by you or your organization
* Remove an application authored by another organization

## Prerequisites

You must have a tenant that has applications registered to it. To learn how to add and register apps, see [Register an application with the Microsoft identity platform](quickstart-register-app.md).

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

In order to remove an application’s access to your directory (after having granted consent), the company administrator must remove its service principal. The administrator must have global admin access, and can remove the application through the Azure portal or use the [Azure AD PowerShell Cmdlets](https://go.microsoft.com/fwlink/?LinkId=294151) to remove access.

## Next steps

Learn about these other related app management quickstarts:

* [Register an application with the Microsoft identity platform](quickstart-register-app.md)
* [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md)
* [Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md)
* [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)
