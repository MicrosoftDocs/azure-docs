---
title: About Microsoft identity platform | Azure 
description: Learn about Microsoft identity platform, an evolution of the Azure Active Directory identity service and developer platform.
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
#Customer intent: As an application developer, I want to understand about the Microsoft identity platform so I can decide which endpoint and platform best meets my needs.
---

# About Microsoft identity platform

Microsoft identity platform is an evolution of the Azure Active Directory (Azure AD) identity service and developer platform. It allows developers to build applications that sign in all Microsoft identities, get tokens to call Microsoft Graph, other Microsoft APIs, or APIs that developers have built. It’s a full-featured platform that consists of an authentication service, libraries, application registration and configuration (through a developer portal and application API), full developer documentation, code samples, and other developer content. The Microsoft identity platform supports industry standard protocols such as OAuth 2.0 and OpenID Connect.

Up until now, most developers have worked with Azure AD v1.0 platform to authenticate Azure AD identities (work and school accounts) by requesting tokens from the Azure AD v1.0 endpoint, using Azure AD Authentication Library (ADAL), Azure portal for application registration and configuration, and Azure AD Graph API for programmatic application configuration. The Azure AD v1.0 platform is a mature platform offering that will continue to work for enterprise applications.

To expand and evolve the capabilities of the Microsoft identity platform, you can now authenticate a broader set of Microsoft identities (Azure AD identities, Microsoft accounts (MSA), and external identities such as Azure AD B2C accounts) through what has been known as the Azure AD v2.0 endpoint. Here, you’ll be using the Microsoft Authentication Library (MSAL), the Azure portal for application registration and configuration, and the Microsoft Graph API for programmatic application configuration. The updated Microsoft identity platform (in particular, the MSAL libraries and latest Azure portal app registration experience) has evolved significantly over the last year. To finalize this release, we encourage developers to develop and test their applications using the latest Microsoft identity platform.

Applications using the latest ADAL and the latest MSAL will SSO with each other. Applications updated from ADAL to MSAL will maintain user sign-in state. Developers can choose to update their applications to MSAL as they see fit, as applications built with ADAL will continue to work and be supported.

## Microsoft identity platform experience

This diagram describes the Microsoft identity experience at a high-level, including the app registration experience, SDKs, endpoints, and supported identities.

![Microsoft identity platform today](./media/about-microsoft-identity-platform/microsoft-identity-platform-today.png)

## Next steps

Learn more about v1.0 and v2.0.

* [About v1.0](azure-ad-developers-guide.md)
* [About v2.0](azure-ad-developers-guide.md)
