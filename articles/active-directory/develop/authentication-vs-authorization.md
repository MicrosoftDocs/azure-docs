---
title: Authentication vs. authorization | Azure
titleSuffix: Microsoft identity platform
description: Learn about the basics of authentication and authorization in Microsoft identity platform (v2.0).
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/28/2020
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda, sureshja, hirsin
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand the basic concepts of authentication and authorization in Microsoft identity platform
---

# Authentication vs. authorization

This article defines authentication and authorization and briefly covers how you can use the Microsoft identity platform to authenticate and authorize users in your web apps, web APIs, or apps calling protected web APIs. If you see a term you aren't familiar with, try our [glossary](developer-glossary.md) or our [Microsoft identity platform videos](identity-videos.md) which cover basic concepts.

## Authentication

**Authentication** is the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN. Microsoft identity platform implements the [OpenID Connect](https://openid.net/connect/) protocol for handling authentication.

## Authorization

**Authorization** is the act of granting an authenticated party permission to do something. It specifies what data you're allowed to access and what you can do with that data. Authorization is sometimes shortened to AuthZ. Microsoft identity platform implements the [OAuth 2.0](https://oauth.net/2/) protocol for handling authorization.

## Authentication and authorization using the Microsoft identity platform

Instead of creating apps that each maintain their own username and password information, which incurs a high administrative burden when you need to add or remove users across multiple apps, apps can delegate that responsibility to a centralized identity provider.

Azure Active Directory (Azure AD) is a centralized identity provider in the cloud. Delegating authentication and authorization to it enables scenarios such as Conditional Access policies that require a user to be in a specific location, the use of multi-factor authentication, as well as enabling a user to sign in once and then be automatically signed in to all of the web apps that share the same centralized directory. This capability is referred to as **Single Sign On (SSO)**.

Microsoft identity platform simplifies authentication and authorization for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly. It allows developers to build applications that sign in all Microsoft identities, get tokens to call [Microsoft Graph](https://developer.microsoft.com/graph/), other Microsoft APIs, or APIs that developers have built. For more information, see [Evolution of Microsoft identity platform](about-microsoft-identity-platform.md).

## Next steps

For other topics covering authentication and authorization basics:

* See [Security tokens](security-tokens.md) to learn how access tokens, refresh tokens, and ID tokens are used in authentication and authorization.
* See [Application model](application-model.md) to learn about the process of registering your application so it can integrate with Microsoft identity platform.
* See [App sign-in flow](app-sign-in-flow.md) to learn about the sign-in flow of web, desktop, and mobile apps in Microsoft identity platform.

To learn more about the protocols that Microsoft identity platform implements:

* See [OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform](active-directory-v2-protocols.md) for more information on the OpenID Connect and OAuth 2.0 standards.
* See [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md) for more information on how Microsoft identity platform supports Single Sign-On.
