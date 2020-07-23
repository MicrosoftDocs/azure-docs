---
title: Application model | Azure
titleSuffix: Microsoft identity platform
description: Learn about the process of registering your application so it can integrate with Microsoft identity platform (v2.0).
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
#Customer intent: As an application developer, I want to understand how to register an application so it can integrate with Microsoft identity platform
---

# Application model

Applications can sign in users themselves or delegate sign-in to an identity provider. This topic discusses the steps that are required to register an application with Microsoft identity platform.

## Registering an application

For an identity provider to know that a user has access to a particular app, both the user and the application must be registered with the identity provider. When you register your application with Azure AD, you are providing an identity configuration for your application that allows it to integrate with Microsoft identity platform. Registering the app also allows you to:

* Customize the branding of your application in the sign-in dialog. This is important because this is the first experience a user will have with your app.
* Decide if you want to let users sign in only if they belong to your organization. This is a single tenant application. Or allow users to sign in using any work or school account. This is a multi-tenant application. You can also allow personal Microsoft accounts, or a social account from LinkedIn, Google, and so on.
* Request scope permissions. For example, you can request the "user.read" scope, which grants permission to read the profile of the signed-in user.
* Define scopes that define access to your web API. Typically, when an app wants to access your API, it will need to request permissions to the scopes you define.
* Share a secret with Microsoft identity platform that proves the app's identity.  This is relevant in the case where the app is a confidential client application. A confidential client application is an application that can hold credentials securely. They require a trusted backend server to store the credentials.

Once registered, the application will be given a unique identifier that the app shares with Microsoft identity platform when it requests tokens. If the app is a [confidential client application](developer-glossary.md#client-application), it will also share the secret or the public key-depending on whether certificates or secrets were used.

Microsoft identity platform represents applications using a model that fulfills two main functions:

* Identify the app by the authentication protocols it supports
* Provide all the identifiers, URLs, secrets, and related information that are needed to authenticate

Microsoft identity platform:

* Holds all the data required to support authentication at runtime
* Holds all the data for deciding what resources an app might need to access, and under what circumstances a given request should be fulfilled
* Provides infrastructure for implementing app provisioning within the app developer's tenant, and to any other Azure AD tenant
* Handles user consent during token request time and facilitate the dynamic provisioning of apps across tenants

**Consent** is the process of a resource owner granting authorization for a client application to access protected resources, under specific permissions, on behalf of the resource owner. Microsoft identity platform:

* Enables users and administrators to dynamically grant or deny consent for the app to access resources on their behalf.
* Enables administrators to ultimately decide what apps are allowed to do and which users can use specific apps, and how the directory resources are accessed.

## Multi-tenant apps

In Microsoft identity platform, an [application object](developer-glossary.md#application-object) describes an application. At deployment time, Microsoft identity platform uses the application object as a blueprint to create a [service principal](developer-glossary.md#service-principal-object), which represents a concrete instance of an application within a directory or tenant. The service principal defines what the app can actually do in a specific target directory, who can use it, what resources it has access to, and so on. Microsoft identity platform creates a service principal from an application object through [consent](developer-glossary.md#consent).

The following diagram shows a simplified Microsoft identity platform provisioning flow driven by consent. It shows two tenants: *A* and *B*.

* *Tenant A* owns the application.
* *Tenant B* is instantiating the application via a service principal.

![Simplified provisioning flow driven by consent](./media/authentication-scenarios/simplified-provisioning-flow-consent-driven.svg)

In this provisioning flow:

1. A user from tenant B attempts to sign in with the app, the authorization endpoint requests a token for the application.
1. The user credentials are acquired and verified for authentication.
1. The user is prompted to provide consent for the app to gain access to tenant B.
1. Microsoft identity platform uses the application object in tenant A as a blueprint for creating a service principal in tenant B.
1. The user receives the requested token.

You can repeat this process for additional tenants. Tenant A retains the blueprint for the app (application object). Users and admins of all the other tenants where the app is given consent keep control over what the application is allowed to do via the corresponding service principal object in each tenant. For more information, see [Application and service principal objects in Microsoft identity platform](app-objects-and-service-principals.md).

## Next steps

For other topics covering authentication and authorization basics:

* See [Authentication vs. authorization](authentication-vs-authorization.md) to learn about the basic concepts of authentication and authorization in Microsoft identity platform.
* See [Security tokens](security-tokens.md) to learn how access tokens, refresh tokens, and ID tokens are used in authentication and authorization.
* See [App sign-in flow](app-sign-in-flow.md) to learn about the sign-in flow of web, desktop, and mobile apps in Microsoft identity platform.

To learn more about the application model:

* See [How and why applications are added to Azure AD](active-directory-how-applications-are-added.md) for more information on application objects and service principals in Microsoft identity platform.
* See [Tenancy in Azure Active Directory](single-and-multi-tenant-apps.md) for more information on single-tenant apps and multi-tenant apps.
* See [Azure Active Directory B2C documentation](https://docs.microsoft.com/azure/active-directory-b2c) for more information on how Azure AD also provides Azure Active Directory B2C so that organizations can sign in users, typically customers, using social identities like a Google account.
