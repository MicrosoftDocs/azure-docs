---
title: Sign in Microsoft Account and Azure Active Directory users in a single application
description: An introduction to building applications with both Microsoft Account and Azure Active Directory sign-in.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 2dee579f-fdf6-474b-bc2c-016c931eaa27
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: hirsin, jmprieur
ms.custom: aaddev
---

# Sign in Microsoft Account and Azure Active Directory users in a single application

In the past, application developers who wanted to support both personal Microsoft accounts and work accounts from Azure Active Directory (Azure AD) had to integrate with two separate systems. The v2.0 endpoint and platform provides an authentication API version that simplifies this process. v2.0 enables sign-in from both types of accounts by using a single integration. Applications that use the v2.0 endpoint can also consume the REST APIs from the [Microsoft Graph API](https://graph.microsoft.io) by using either type of account.

## Getting started

Choose your favorite platform from the following list to build an application by using the Microsoft open source libraries and frameworks. You can also use the OAuth 2.0 and OpenID Connect protocols to send and receive protocol messages directly without using an authentication library.

[!INCLUDE [Azure AD v2.0 endpoint platforms](../../../includes/active-directory-v2-quickstart-table.md)]

## Learn more about the Azure AD v2.0 endpoint

Learn about what you can do with the Azure AD v2.0 endpoint:

* Discover the [types of applications that you can build with the Azure AD v2.0 endpoint](v2-app-types.md).
* Understand the [limitations, restrictions, and constraints](active-directory-v2-limitations.md) with the Azure AD v2.0 endpoint.
* Watch this video for an overview of the Azure AD v2.0 endpoint:

>[!VIDEO https://channel9.msdn.com/Events/Build/2017/P4031/player]

## Additional resources

Explore in-depth information about the Azure AD v2.0 endpoint platform:

* [Azure AD v2.0 protocols reference](active-directory-v2-protocols.md)
* [Azure AD v2.0 tokens reference](v2-id-and-access-tokens.md)
* [Azure AD v2.0 authentication libraries reference](reference-v2-libraries.md)
* [Scopes and consent in the Azure AD v2.0 endpoint](v2-permissions-and-consent.md)
* [The Microsoft Graph API](https://graph.microsoft.io)

> [!NOTE]
> If you only need to sign in work and school accounts from Azure Active Directory, start with the [Azure AD developer's guide](azure-ad-developers-guide.md). The Azure AD v2.0 endpoint is intended for use by developers who explicitly need to sign in Microsoft personal accounts.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
