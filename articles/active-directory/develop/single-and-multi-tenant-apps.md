---
title: Single and multi-tenant apps in Azure Active Directory
description: Provides an overview of the features and differences between single-tenant and multi-tenant apps in Azure AD
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 35af95cb-ced3-46ad-b01d-5d2f6fd064a3
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/27/2018
ms.author: celested
ms.reviewer: justhu
ms.custom: aaddev
---

# Tenancy in Azure Active Directory

Azure Active Directory (Azure AD) organizes objects like users and apps into groups called tenants. Tenants allow an administrator to set policies on the users and apps that their organization owns in order to meet their security and operational policies. 

## Who can sign in to your app?

When it comes to developing apps, developers can choose to configure their app to be either single-tenant or multi-tenant during app registration in the [Azure Portal](http://portal.azure.com). Single-tenant apps are only available in the tenant they were registered in, also known as their home tenant, but multi-tenant apps are available to users in both their home tenant and other tenants.

In the Azure Portal, you will see the following descriptions used to allow you to configure your app as either single-tenant or multi-tenant. 

| Audience | Single/multi-tenant | Who can sign-in | 
|----------|--------| ---------|
| Accounts in this directory only | Single tenant | All user and guest accounts in your directory can use your application or API. *Use this option if your target audience is internal to your organization.*|
| Accounts in any Azure AD directory | Multi-tenant | All users and guests with a work or school account from Microsoft can use your application or API. This includes schools and businesses that use Office 365. *Use this option if your target audience is business or educational customers.*|
| Accounts in any Azure AD directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com) | Multi-tenant | All users with a work or school, or personal Microsoft account can use your application or API. It includes schools and businesses that use Office 365 as well as personal accounts that are used to sign in to services like Xbox and Skype. *Use this option to target the widest set of Microsoft accounts.* | 

## Best practices for multi-tenant apps

Building great multi-tenant apps can be challenging due to the number of different policies that IT administrators can set in their tenants. If you choose to build a multi-tenant app, you should take care to follow these best practices:

* Test your app in a tenant which has configured [conditional access policies](conditional-access-dev-guide.md).
* Follow the principle of least user access to ensure that your app only requests permissions it actually needs. In particular, avoid requesting permissions that require admin consent as this may prevent users from acquiring your app at all in some organizations. 
* Provide appropriate names and descriptions for any permissions you expose as part of your app so that users and admins know what they are agreeing to when they attempt to use your app's APIs. For more information, see the best practices section of our [permissions guide](v1-permissions-and-consent.md)

## For more information

* [How to convert an app to be multi-tenant](howto-convert-app-to-be-multi-tenant.md)


