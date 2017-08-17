---
title: Azure Active Directory v2.0 endpoint | Microsoft Docs
description: An introduction to building apps with both Microsoft Account and Azure Active Directory sign-in.
services: active-directory
documentationcenter: ''
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: 2dee579f-fdf6-474b-bc2c-016c931eaa27
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/01/2017
ms.author: dastrock
ms.custom: aaddev

---
# Sign-in Microsoft Account & Azure AD users in a single app
In the past, an app developer who wanted to support both personal Microsoft accounts and work accounts from Azure Active Directory was required to integrate with two separate systems.  The **Azure AD v2.0 endpoint** introduces a new authentication API version that enables you to sign in both types of accounts using one simple integration.  Apps that use the v2.0 endpoint can also consume REST APIs from the [Microsoft Graph](https://graph.microsoft.io) using either type of account.

## Getting Started
Choose your favorite platform from the following list to build an app using our open source libraries & frameworks.  Alternatively, you can use our OAuth 2.0 & OpenID Connect protocol documentation to send & receive protocol messages directly without using an auth library.

<br />

[!INCLUDE [active-directory-v2-quickstart-table](../../../includes/active-directory-v2-quickstart-table.md)]

## What's New
The information here will be useful in understanding what is & what isn't possible with the v2.0 endpoint.

* Learn about the [types of apps you can build with the v2.0 endpoint](active-directory-v2-flows.md).
* Understand the [limitations, restrictions, and constraints](active-directory-v2-limitations.md) with the v2.0 endpoint.
* Check out this overview video for the v2.0 endpoint:

>[!VIDEO https://channel9.msdn.com/Events/Build/2017/P4031/player]

## Reference
These links will be useful for exploring the platform in depth:

* [v2.0 Protocol Reference](active-directory-v2-protocols.md)
* [v2.0 Token Reference](active-directory-v2-tokens.md)
* [v2.0 Library Reference](active-directory-v2-libraries.md)
* [Scopes and Consent in the v2.0 endpoint](active-directory-v2-scopes.md)
* [The Microsoft Graph](https://graph.microsoft.io)

## Help & Support
These are the best places to get help with developing on Azure Active Directory.

* [Stack Overflow's `azure-active-directory` and `adal` tags](http://stackoverflow.com/questions/tagged/azure-active-directory+or+adal)
* [Feedback on Azure Active Directory](https://feedback.azure.com/forums/169401-azure-active-directory/category/164757-developer-experiences)


> [!NOTE]
> If you only need to sign in work and school accounts from Azure Active Directory, you should start with our [Azure AD developer's guide](active-directory-developers-guide.md).  The v2.0 endpoint is intended for use by developers who explicitly need to sign in Microsoft personal accounts.

