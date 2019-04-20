---
title: Microsoft identity platform (v2.0) overview | Azure
description: Learn about the Microsoft identity platform (v2.0) endpoint and platform.
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: celested
ms.reviewer: agirling, saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to understand about the Microsoft identity platform (v2.0) endpoint and platform so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Microsoft identity platform (v2.0) overview

Microsoft identity platform is an evolution of the Azure Active Directory (Azure AD) identity service and developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs, such as [Microsoft Graph](https://developer.microsoft.com/graph/), or APIs that developers have built. It’s a full-featured platform that consists of an OAuth 2.0 and OpenID Connect standard-compliant authentication service, open-source libraries, application registration and configuration, robust conceptual and reference documentation, quickstart samples, code samples, tutorials, and how-to guides.
  
Microsoft identity platform connects and secures over 1 billion monthly active users across work, school, and life with over 1 million third-party active applications. For developers, Microsoft identity platform offers seamless integration into major innovations in the identity and security space, such as passwordless authentication, step-up authentication, and conditional access. Developers don't need to implement such functionality themselves: applications integrated with the Microsoft identity platform natively take advantage of such innovations.
  
Microsoft identity platform unifies application development for various Microsoft identities. Whether your app needs to authenticate users with work or school accounts (provisioned through Azure AD) or personal accounts (known as Microsoft accounts (MSA), such as @outlook.com), the unified platform simplifies getting authentication integrated into your app. The unified Microsoft identity platform lets developers write code once and have the code work with all the applicable user identities. Developers can build an app once and have it work across many platforms, or build an app that functions as a client and a resource application (API).

# Getting started

Working with identity doesn’t have to be hard. However, it's important to know the basics and choose the right flow for the scenario. It's also important to follow principles and patterns necessary to ensure secure configuration of the application, and secure DevOps processes to ensure that the app won't be compromised in the course of its lifecycle.

The following diagram outlines key authentication concepts and best practices for common application scenarios – we recommend that you reference it when integrating the Microsoft identity platform with your app:

[![Application scenarios in Microsoft identity platform](./media/v2-overview/application-scenarios-identity-platform.png)](./media/v2-overview/application-scenarios-identity-platform.svg#lightbox)

Choose a scenario that applies to you. Start by reviewing the **Prerequisites**, which are core authentication concepts that apply to all app scenarios. Each scenario path has a quickstart to get you up and running in minutes and an overview of scenario and other specifics you need to know:

- Build a single-page application
- Build a web application that signs in users
- Build a web application that calls web APIs
- Protect a web API
- Build a web API that calls web APIs
- Build a daemon application
- Build a desktop application
- Build a mobile application

In each application scenario path, we'll also show you how to call APIs using your app's access tokens to call APIs like Microsoft Graph or other APIs.

And when you're ready to launch your app into a production environment, see the steps on how to **Move to production**.

## Additional resources

Explore in-depth information about v2.0:

* [About the Microsoft identity platform](about-microsoft-identity-platform.md)
* [Microsoft identity platform protocols reference](active-directory-v2-protocols.md)
* [Access tokens reference](access-tokens.md)
* [ID tokens reference](id-tokens.md)
* [Authentication libraries reference](reference-v2-libraries.md)
* [Permissions and consent in Microsoft identity platform](v2-permissions-and-consent.md)
* [Microsoft Graph API](https://developer.microsoft.com/graph)

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
