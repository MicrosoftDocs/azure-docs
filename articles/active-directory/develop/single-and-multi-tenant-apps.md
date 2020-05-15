---
title: Single and multi-tenant apps in Azure AD
titleSuffix: Microsoft identity platform
description: Learn about the features and differences between single-tenant and multi-tenant apps in Azure AD.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/24/2018
ms.author: ryanwi
ms.reviewer: justhu
ms.custom: aaddev
---

# Tenancy in Azure Active Directory

Azure Active Directory (Azure AD) organizes objects like users and apps into groups called *tenants*. Tenants allow an administrator to set policies on the users within the organization and the apps that the organization owns to meet their security and operational policies. 

## Who can sign in to your app?

When it comes to developing apps, developers can choose to configure their app to be either single-tenant or multi-tenant during app registration in the [Azure portal](https://portal.azure.com).
* Single-tenant apps are only available in the tenant they were registered in, also known as their home tenant.
* Multi-tenant apps are available to users in both their home tenant and other tenants.

In the Azure portal, you can configure your app to be single-tenant or multi-tenant by setting the audience as follows.

| Audience | Single/multi-tenant | Who can sign in | 
|----------|--------| ---------|
| Accounts in this directory only | Single tenant | All user and guest accounts in your directory can use your application or API.<br>*Use this option if your target audience is internal to your organization.* |
| Accounts in any Azure AD directory | Multi-tenant | All users and guests with a work or school account from Microsoft can use your application or API. This includes schools and businesses that use Office 365.<br>*Use this option if your target audience is business or educational customers.* |
| Accounts in any Azure AD directory and personal Microsoft accounts (such as Skype, Xbox, Outlook.com) | Multi-tenant | All users with a work or school, or personal Microsoft account can use your application or API. It includes schools and businesses that use Office 365 as well as personal accounts that are used to sign in to services like Xbox and Skype.<br>*Use this option to target the widest set of Microsoft accounts.* | 

## Best practices for multi-tenant apps

Building great multi-tenant apps can be challenging because of the number of different policies that IT administrators can set in their tenants. If you choose to build a multi-tenant app, follow these best practices:

* Test your app in a tenant that has configured [Conditional Access policies](../azuread-dev/conditional-access-dev-guide.md).
* Follow the principle of least user access to ensure that your app only requests permissions it actually needs. Avoid requesting permissions that require admin consent as this may prevent users from acquiring your app at all in some organizations. 
* Provide appropriate names and descriptions for any permissions you expose as part of your app. This helps users and admins know what they are agreeing to when they attempt to use your app's APIs. For more information, see the best practices section in the [permissions guide](v2-permissions-and-consent.md).

## Next steps

* [How to convert an app to be multi-tenant](howto-convert-app-to-be-multi-tenant.md)
