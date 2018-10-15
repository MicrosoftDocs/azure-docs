---
title: About v2.0 | Azure
description: Learn about the v2.0 endpoint and platform.
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to understand about the v2.0 endpoint and platform so I can decide if this platform meets my application development needs and requirements.
---

# About v2.0

The v2.0 endpoint and platform has been in preview and continually enhanced. Today, the JavaScript single-page application (SPA) scenarios are feature complete and we invite you to use MSAL.js to build browser-based applications and give us feedback so we can update the status from preview to general availability (GA).

> [!NOTE]
> MSAL Android, iOS, and .NET still have features under development. You can use them to build applications and send us feedback.

The Azure portal developer experience has been significantly updated to now include all your applications built with ADAL or MSAL, and to improve usability.

In the past, application developers who wanted to support both personal Microsoft accounts and work accounts from Azure Active Directory (Azure AD) had to integrate with two separate systems. The v2.0 endpoint and platform provides an authentication API version that simplifies this process. It enables sign-in from both types of accounts by using a single integration. Applications that use the v2.0 endpoint can also consume the REST APIs from the [Microsoft Graph API](https://graph.microsoft.io) by using either type of account.

## Getting started

Choose your favorite platform from the following list to build an application by using the Microsoft open source libraries and frameworks. You can also use the OAuth 2.0 and OpenID Connect protocols to send and receive protocol messages directly without using an authentication library.

[!INCLUDE [v2.0 endpoint platforms](../../../includes/active-directory-v2-quickstart-table.md)]

## Learn more about the v2.0 endpoint and platform

Learn about what you can do with the Azure AD v2.0 endpoint:

* Discover the [types of applications that you can build with the Azure AD v2.0 endpoint](v2-app-types.md).
* Understand the [limitations, restrictions, and constraints](active-directory-v2-limitations.md) with the Azure AD v2.0 endpoint.
* Watch this video for an overview of the Azure AD v2.0 endpoint:

>[!VIDEO https://channel9.msdn.com/Events/Build/2017/P4031/player]

## Additional resources

Explore in-depth information about v2.0:

* [v2.0 protocols reference](active-directory-v2-protocols.md)
* [Access tokens reference](access-tokens.md)
* [`id_tokens` reference](id-tokens.md)
* [v2.0 authentication libraries reference](reference-v2-libraries.md)
* [Scopes and consent in v2.0](v2-permissions-and-consent.md)
* [The Microsoft Graph API](https://graph.microsoft.io)

> [!NOTE]
> If you only need to sign in work and school accounts from Azure Active Directory, start with the [Azure AD developer's guide](azure-ad-developers-guide.md). The v2.0 endpoint is intended for use by developers who explicitly need to sign in Microsoft personal accounts.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
