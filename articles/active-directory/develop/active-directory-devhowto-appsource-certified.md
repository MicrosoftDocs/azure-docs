---
title: How to get AppSource certified for Azure Active Directory| Microsoft Docs
description: Details on how to get your application AppSource certified for Azure Active Directory.
services: active-directory
documentationcenter: ''
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 21206407-49f8-4c0b-84d1-c25e17cd4183
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/28/2017
ms.author: andret
ms.custom: aaddev

---
# How to get AppSource Certified for Azure Active Directory (AD)
[AppSource](https://appsource.microsoft.com/) is the premier destination to market and distribute your apps, content packs, and add-ins — all backed by a brand that billions of customers already know and trust.

To receive AppSource certification for Azure Active Directory, your application must accept single sign-on from work accounts from any company or organization that has Azure Active Directory. The sign-in process must use the OpenID Connect or OAuth 2.0 protocols.

## Guides and code samples
See [this document](active-directory-developers-guide#get-started "Get Started with Azure AD Guides") for code samples and guides for your platform.

## Multi-tenant applications
An application that accepts sign-ins from users from any company or organization that have Azure Active Directory without requiring a separate instance, configuration, or deployment is known as a multi-tenant application. AppSource recommends that applications implement multi-tenancy to enable the single-click customer-led trial experience.

For more information about multi-tenancy, see: [How to sign in any Azure Active Directory (AD) user using the multi-tenant application pattern](active-directory-devhowto-multi-tenant-overview).


> [!NOTE]
> Applications registered in the [Azure Portal](https://portal.azure.com/) are single-tenant by default and may require additional settings and/or code changes to become multi-tenant.  

<!--Reference style links -->
[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[AAD-Auth-Scenarios-Browser-To-WebApp]: ./active-directory-authentication-scenarios.md#web-browser-to-web-application
[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Howto-Multitenant-Overview]: ./active-directory-devhowto-multi-tenant-overview.md
[AAD-QuickStart-Web-Apps]: ./active-directory-developers-guide.md#get-started

​