---
title: Microsoft identity platform overview - Azure
titleSuffix: Microsoft identity platform
description: Learn about the components of the Microsoft identity platform and how they can help you build identity and access management (IAM) support into your applications.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: overview
ms.workload: identity
ms.date: 07/09/2020
ms.author: ryanwi
ms.reviewer: agirling, saeeda, benv
ms.custom: identityplatformtop40, contperf-fy21q2
# Customer intent: As an application developer, I want a quick introduction to the Microsoft identity platform so I can decide if this platform meets my application development requirements.
---

# What is the Microsoft identity platform?

The Microsoft identity platform helps you build applications your users and customers can sign in to using their Microsoft identities or social accounts, and provide authorized access to your own APIs or Microsoft APIs like Microsoft Graph.

There are several components that make up the Microsoft identity platform:

- **OAuth 2.0 and OpenID Connect standard-compliant authentication service** enabling developers to authenticate several identity types, including:
  - Work or school accounts, provisioned through Azure AD
  - Personal Microsoft account, like Skype, Xbox, and Outlook.com
  - Social or local accounts, by using Azure AD B2C
- **Open-source libraries**: Microsoft Authentication Libraries (MSAL) and support for other standards-compliant libraries
- **Application management portal**: A registration and configuration experience in the Azure portal, along with the other Azure management capabilities.
- **Application configuration API and PowerShell**: Programmatic configuration of your applications through the Microsoft Graph API and PowerShell so you can automate your DevOps tasks.
- **Developer content**: Technical documentation including quickstarts, tutorials, how-to guides, and code samples.

For developers, the Microsoft identity platform offers integration of modern innovations in the identity and security space like passwordless authentication, step-up authentication, and Conditional Access. You don’t need to implement such functionality yourself: applications integrated with the Microsoft identity platform natively take advantage of such innovations.

With the Microsoft identity platform, you can write code once and reach any user. You can build an app once and have it work across many platforms, or build an app that functions as a client as well as a resource application (API).

For a video overview of the platform and a demo of the authentication experience, see [What is the Microsoft identity platform for developers?](https://youtu.be/uDU1QTSw7Ps).

## Getting started

Choose the [application scenario](authentication-flows-app-scenarios.md) you'd like to build. Each of these scenario paths starts with an overview and links to a quickstart to help you get up and running:

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

Learn how core authentication and Azure AD concepts apply to the Microsoft identity platform in this recommended set of articles:

- [Authentication basics](./authentication-vs-authorization.md)
- [Application and service principals](app-objects-and-service-principals.md)
- [Audiences](v2-supported-account-types.md)
- [Permissions and consent](v2-permissions-and-consent.md)
- [ID tokens](id-tokens.md)
- [Access tokens](access-tokens.md)
- [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

## More identity and access management options

[Azure AD B2C](../../active-directory-b2c/overview.md) - Build customer-facing applications your users can sign in to using their social accounts like Facebook or Google, or by using an email address and password.

[Azure AD B2B](../external-identities/what-is-b2b.md) - Invite external users into your Azure AD tenant as "guest" users, and assign permissions for authorization while they use their existing credentials for authentication.

[Azure Active Directory for developers (v1.0)](../azuread-dev/v1-overview.md) - Shown here for developers with existing apps that use the older v1.0 endpoint. **Do not** use v1.0 for new projects.

## Next steps

If you have an Azure account you already have access to an Azure Active Directory tenant, but most the Microsoft identity platform developers need their own Azure AD tenant for use while developing applications, a "dev tenant."

Learn how to create your own tenant for use while building your applications:

[Quickstart: Set up an Azure AD tenant](quickstart-create-new-tenant.md)
