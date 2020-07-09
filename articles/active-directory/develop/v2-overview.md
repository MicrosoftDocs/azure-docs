---
title: Microsoft identity platform (v2.0) overview - Azure
description: Learn about the Microsoft identity platform (v2.0) endpoint and platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: overview
ms.workload: identity
ms.date: 05/08/2019
ms.author: ryanwi
ms.reviewer: agirling, saeeda, benv
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to understand about the Microsoft identity platform (v2.0) endpoint and platform so I can decide if this platform meets my application development needs and requirements.
---

# Microsoft identity platform (v2.0) overview

Microsoft identity platform is an evolution of the Azure Active Directory (Azure AD) developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs, such as Microsoft Graph, or APIs that developers have built. The Microsoft identity platform consists of:

- **OAuth 2.0 and OpenID Connect standard-compliant authentication service** that enables developers to authenticate any Microsoft identity, including:
  - Work or school accounts (provisioned through Azure AD)
  - Personal Microsoft accounts (such as Skype, Xbox, and Outlook.com)
  - Social or local accounts (via Azure AD B2C)
- **Open-source libraries**: Microsoft Authentication Libraries (MSAL) and support for other standards-compliant libraries
- **Application management portal**: A registration and configuration experience built in the Azure portal, along with all your other Azure management capabilities.
- **Application configuration API and PowerShell**: which allows programmatic configuration of your applications through the Microsoft Graph API and PowerShell, so you can automate your DevOps tasks.
- **Developer content**: conceptual and reference documentation, quickstart samples, code samples, tutorials, and how-to guides.

For developers, Microsoft identity platform offers seamless integration into innovations in the identity and security space, such as passwordless authentication, step-up authentication, and Conditional Access.  You don’t need to implement such functionality yourself: applications integrated with the Microsoft identity platform natively take advantage of such innovations.

With Microsoft identity platform, you can write code once and reach any user. You can build an app once and have it work across many platforms, or build an app that functions as a client as well as a resource application (API).

## Getting started

Choose the [application scenario](authentication-flows-app-scenarios.md) you'd like to build. Each of these scenario paths starts with an overview and links to a quickstart to help you get up and running.

- [Single-page app (SPA)](scenario-spa-overview.md)
- [Web app that signs in users](scenario-web-app-sign-user-overview.md)
- [Web app that calls web APIs](scenario-web-app-call-api-overview.md)
- [Protected web API](scenario-protected-web-api-overview.md)
- [Web API that calls web APIs](scenario-web-api-call-api-overview.md)
- [Desktop app](scenario-desktop-overview.md)
- [Daemon app](scenario-daemon-overview.md)
- [Mobile app](scenario-mobile-overview.md)

As you work with the Microsoft identity platform to integrate authentication and authorization in your apps, you can refer to this image that outlines the most common app scenarios and their identity components. Select the image to view it full-size.

[![Metro map showing several application scenarios in Microsoft identity platform](./media/v2-overview/application-scenarios-identity-platform.png)](./media/v2-overview/application-scenarios-identity-platform.svg#lightbox)

## Learn authentication concepts

If you’d like to learn how core authentication concepts apply to the Microsoft identity platform, here are several recommended topics to start with:

- [Authentication basics](authentication-scenarios.md)
- [Application and service principals](app-objects-and-service-principals.md)
- [Audiences](v2-supported-account-types.md)
- [Permissions and consent](v2-permissions-and-consent.md)
- [ID tokens](id-tokens.md) and [access tokens](access-tokens.md)
- [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

## More identity and access management options

If you'd like to build a customer-facing application that users can sign in to using their social accounts like Facebook or Google, see [Azure AD B2C](../../active-directory-b2c/overview.md).

If you'd like invite external users into your tenant as "guest" users to which you can assign permissions (for authorization) while allowing them to use their existing credentials (for authentication), see [Azure AD B2B](../b2b/what-is-b2b.md).

> [!TIP]
> Looking for **Azure Active Directory (Azure AD) developer platform (v1.0)** documentation? We've moved it here: [Azure Active Directory for developers (v1.0) overview](../azuread-dev/v1-overview.md).

## Next steps

Most developers need an Azure Active Directory tenant they can use for development purposes, also known as a "dev tenant."

For info on creating your own dev tenant, see [Quickstart: Set up a tenant](quickstart-create-new-tenant.md).
