---
title: Remove an application from Azure Active Directory 
description: Learn how to remove an application from Azure Active Directory (Azure AD).
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

# Quickstart: Remove an application from Azure Active Directory

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with Azure Active Directory (Azure AD) may need to remove an application's registration from their Azure AD tenant.

In this quickstart, you'll learn how to:

* [Remove an application authored by your organization](#removing-an-application-authored-by-your-organization)
* [Remove a multi-tenant application authorized by another organization](#removing-a-multi-tenant-application-authorized-by-another-organization)

## Prerequisites

To get started, you'll need an Azure AD tenant that has applications registered to it.

* If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).
* To learn how to add and register apps to your tenant, see [Add an application to Azure AD](quickstart-v1-integrate-apps-with-azure-ad.md).

## Removing an application authored by your organization

Applications that your organization has registered appear under the **My apps** filter on your tenant's main **App registrations** page. These applications are ones you registered manually through the Azure portal, or programmatically through PowerShell or the Microsoft Graph API. More specifically, these applications are represented by both an application and service principal object in your tenant. For more info about these objects, see [Application objects and service principal objects](app-objects-and-service-principals.md).

### To remove a single-tenant application from your directory

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account gives you access to more than one, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service, select **App registrations**, and then find and select the application you want to configure.
    This takes you to the application's main registration page, which opens up the **Settings** page for the application.
1. From the application's main registration page, select **Delete**.
1. Select **Yes** to confirm that you want to delete the application.

### To remove a multi-tenant application from its home directory

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account gives you access to more than one, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service, select **App registrations**, and then find and select the application you want to configure.
    This takes you to the application's main registration page, which opens up the **Settings** page for the application.
1. From the **Settings** page, choose **Properties** and change the **Multi-tenanted** switch to **No** to first change your application to single-tenant, and then select **Save**.
    The application's service principal objects remain in the tenants of all organizations that have already consented to it.
1. Select **Delete** from the application's main registration page.
1. Select **Yes** to confirm that you want to delete the application.

## Removing a multi-tenant application authorized by another organization

A subset of the applications that appear under the **All apps** filter (excluding the **My apps** registrations) on your tenant's main **App registrations** page, are multi-tenant applications.

In technical terms, these multi-tenant applications are from another tenant, and were registered into your tenant during the consent process. More specifically, they are represented by only a service principal object in your tenant, with no corresponding application object. For more info on the differences between application and service principal objects, see [Application and service principal objects in Azure AD](app-objects-and-service-principals.md).

To remove a multi-tenant application’s access to your directory (after having granted consent), the company administrator must remove the application's service principal. The administrator must have global admin access and can remove it through the Azure portal or use the [Azure AD PowerShell Cmdlets](http://go.microsoft.com/fwlink/?LinkId=294151).

## Next steps

Learn about these other related app management quickstarts for apps using the Azure AD v1.0 endpoint:

- [Add an application to Azure AD](quickstart-v1-integrate-apps-with-azure-ad.md)
- [Update an application in Azure AD](quickstart-v1-update-azure-ad-app.md)
