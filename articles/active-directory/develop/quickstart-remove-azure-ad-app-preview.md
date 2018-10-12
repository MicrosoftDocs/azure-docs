---
title: Remove an application registered with Microsoft’s identity platform
description: Learn how to remove an application registered with Microsoft’s identity platform.
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
ms.date: 09/24/2018
ms.author: celested
ms.custom: aaddev
ms.reviewer: lenalepa, sureshja
#Customer intent: As an application developer, I need to know how to remove my application from Azure Active Directory.
---

# Quickstart: Remove an application registered with Microsoft’s identity platform

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with Microsoft’s identity platform may need to remove an application's registration.

In this quickstart, you'll learn how to:

* [Remove an application authored by you or your organization](#removing-an-application-authored-by-your-organization)
* [Remove an application authored by another organization](#removing-a-multi-tenant-application-authorized-by-another-organization)

## Prerequisites

To get started, you'll need an account that has applications registered to it. To learn how to add and register apps, see [Add an application to Azure AD](quickstart-integrate-apps-with-azure-ad.md).

## Removing an application authored by you or your organization

Applications that you or your organization have registered are represented by both an Application and Service Principal object in your tenant. For more information, see [Application Objects and Service Principal Objects](active-directory-application-objects.md).

### To remove an application 

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, select the **Azure Active Directory** service, then select **App registrations**. Find/click the application you want to configure. You are taken to application's **Overview** page.
4. From the **Overview** page, click **Delete**.
5. Click **Yes** in the confirmation message.

  > [!NOTE]
  > To delete an application, you need to be listed as an owner of the application or have admin privileges. 


## Removing an application authored by another organization

If you are viewing **App registrations** in the context of a tenant, a subset of the applications that appear under the **All apps** tab are from another tenant and were registered into your tenant during the consent process. More specifically, they are represented by only a service principal object in your tenant, with no corresponding application object. For more information on the differences between application and service principal objects, see [Application and service principal objects in Azure AD](active-directory-application-objects.md).

In order to remove an application’s access to your directory (after having granted consent), the company administrator must remove its service principal. The administrator must have global admin access, and can remove the application through the Azure portal or use the [Azure AD PowerShell Cmdlets](http://go.microsoft.com/fwlink/?LinkId=294151) to remove access.

## Next steps

Learn about these other related app management quickstarts for apps:

- [Register an application with Microsoft's identity platform](quickstart-v1-integrate-apps-with-azure-ad.md)
- [Update an application registered with Microsoft's identity platform](quickstart-v1-update-azure-ad-app.md)
