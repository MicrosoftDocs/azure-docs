---
title: Authentication vs authorization | Azure
titleSuffix: Microsoft identity platform
description: Learn about the basics of authentication and authorization in Microsoft identity platform (v2.0).
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/22/2020
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda, sureshja, hirsin
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand the basic concepts of authentication and authorization in Microsoft identity platform
---

# Authentication vs authorization

This article defines authentication and authorization and briefly covers how you can use the Microsoft identity platform to authenticate and authorize users in your web apps, web APIs, or apps calling protected web APIs. If you see a term you aren't familiar with, try our [glossary](developer-glossary.md) or our [Microsoft identity platform videos](identity-videos.md) which cover basic concepts.

## Authentication

**Authentication** is the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN. Microsoft identity platform implements the [OpenID Connect](https://openid.net/connect/) protocol for handling authentication.

## Authorization

**Authorization** is the act of granting an authenticated party permission to do something. It specifies what data you're allowed to access and what you can do with that data. Authorization is sometimes shortened to AuthZ. Microsoft identity platform implements the [OAuth 2.0](https://oauth.net/2/) protocol for handling authorization.

## Authentication and authorization using Microsoft identity platform

Instead of creating apps that each maintain their own username and password information, which incurs a high administrative burden when you need to add or remove users across multiple apps, apps can delegate that responsibility to a centralized identity provider.

Azure Active Directory (Azure AD) is a centralized identity provider in the cloud. Delegating authentication and authorization to it enables scenarios such as Conditional Access policies that require a user to be in a specific location, the use of [multi-factor authentication](../authentication/concept-mfa-howitworks.md) (sometimes referred to as two-factor authentication or 2FA), as well as enabling a user to sign in once and then be automatically signed in to all of the web apps that share the same centralized directory. This capability is referred to as **Single Sign On (SSO)**.

Microsoft identity platform simplifies authorization and authentication for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly. It allows developers to build applications that sign in all Microsoft identities, get tokens to call [Microsoft Graph](https://developer.microsoft.com/graph/), other Microsoft APIs, or APIs that developers have built. For more information, see [Evolution of Microsoft identity platform](about-microsoft-identity-platform.md).

Following is a brief comparison of the various protocols used by Microsoft identity platform:

* **OAuth vs OpenID Connect**: OAuth is used for authorization and OpenID Connect (OIDC) is used for authentication. OpenID Connect is built on top of OAuth 2.0, so the terminology and flow are similar between the two. You can even both authenticate a user (using OpenID Connect) and get authorization to access a protected resource that the user owns (using OAuth 2.0) in one request. For more information, see [OAuth 2.0 and OpenID Connect protocols](active-directory-v2-protocols.md) and [OpenID Connect protocol](v2-protocols-oidc.md).
* **OAuth vs SAML**: OAuth is used for authorization and SAML is used for authentication. See [Microsoft identity platform and OAuth 2.0 SAML bearer assertion flow](v2-saml-bearer-assertion.md) for more information on how the two protocols can be used together to both authenticate a user (using SAML) and get authorization to access a protected resource (using OAuth 2.0).
* **OpenID Connect vs SAML**: Both OpenID Connect and SAML are used to authenticate a user and are used to enable Single Sign On. SAML authentication is commonly used with identity providers such as Active Directory Federation Services (ADFS) federated to Azure AD and is therefore frequently used in enterprise applications. OpenID Connect is commonly used for apps that are purely in the cloud, such as mobile apps, web sites, and web APIs.

## Next steps

For other topics covering authentication and authorization basics:

* See [Security tokens](security-tokens.md) to learn how access tokens, refresh tokens, and ID tokens are used in authorization and authentication.
* See [Application model](application-model.md) to learn about the process of registering your application so it can integrate with Microsoft identity platform.
* See [App sign-in flow](app-sign-in-flow.md) to learn about the sign-in flow of web, desktop, and mobile apps in Microsoft identity platform.

* To learn more about the protocols that Microsoft identity platform implements, see [OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform](active-directory-v2-protocols.md).
* See [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md) for more information on how Microsoft identity platform supports Single Sign-On.
* See [Single sign-on to applications in Azure Active Directory](../manage-apps/what-is-single-sign-on.md) for more information on the different ways you can implement single sign-on in your app.
