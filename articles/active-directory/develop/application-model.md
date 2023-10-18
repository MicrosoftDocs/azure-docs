---
title: Application model
description: Learn about the process of registering your application so it can integrate with the Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/17/2023
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda, sureshja, ludwignick
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand how to register an application so it can integrate with the Microsoft identity platform.
---

# Application model

Applications can sign in users themselves or delegate sign-in to an identity provider. This article discusses the steps that are required to register an application with the Microsoft identity platform.

## Register an application

For an identity provider to know that a user has access to a particular app, both the user and the application must be registered with the identity provider. When you register your application with Microsoft Entra ID, you're providing an identity configuration for your application that allows it to integrate with the Microsoft identity platform. Registering the app also allows you to:

* Customize the branding of your application in the sign-in dialog box. This branding is important because signing in is the first experience a user will have with your app.
* Decide if you want to allow users to sign in only if they belong to your organization. This architecture is known as a single-tenant application. Or, you can allow users to sign in by using any work or school account, which is known as a multi-tenant application. You can also allow personal Microsoft accounts or a social account from LinkedIn, Google, and so on.
* Request scope permissions. For example, you can request the "user.read" scope, which grants permission to read the profile of the signed-in user.
* Define scopes that define access to your web API. Typically, when an app wants to access your API, it will need to request permissions to the scopes you define.
* Share a secret with the Microsoft identity platform that proves the app's identity. Using a secret is relevant in the case where the app is a confidential client application. A confidential [client application](developer-glossary.md#client-application) is an application that can hold credentials securely, like a [web client](developer-glossary.md#web-client). A trusted back-end server is required to store the credentials.

After the app is registered, it's given a unique identifier that it shares with the Microsoft identity platform when it requests tokens. If the app is a confidential client application, it will also share the secret or the public key depending on whether certificates or secrets were used.

The Microsoft identity platform represents applications by using a model that fulfills two main functions:

* Identify the app by the authentication protocols it supports.
* Provide all the identifiers, URLs, secrets, and related information that are needed to authenticate.

The Microsoft identity platform:

* Holds all the data required to support authentication at runtime.
* Holds all the data for deciding what resources an app might need to access, and under what circumstances a given request should be fulfilled.
* Provides infrastructure for implementing app provisioning within the app developer's tenant, and to any other Microsoft Entra tenant.
* Handles user consent during token request time and facilitates the dynamic provisioning of apps across tenants.

[*Consent*](developer-glossary.md#consent) is the process of a resource owner granting authorization for a client application to access protected resources, under specific permissions, on behalf of the resource owner. The Microsoft identity platform enables:

* Users and administrators to dynamically grant or deny consent for the app to access resources on their behalf.
* Administrators to ultimately decide what apps are allowed to do and which users can use specific apps, and how the directory resources are accessed.

## Multi-tenant apps

In the Microsoft identity platform, an [application object](developer-glossary.md#application-object) describes an application. At deployment time, the Microsoft identity platform uses the application object as a blueprint to create a [service principal](developer-glossary.md#service-principal-object), which represents a concrete instance of an application within a directory or tenant. The service principal defines what the app can actually do in a specific target directory, who can use it, what resources it has access to, and so on. The Microsoft identity platform creates a service principal from an application object through consent.

The following diagram shows a simplified Microsoft identity platform provisioning flow driven by consent. It shows two tenants: *A* and *B*.

* *Tenant A* owns the application.
* *Tenant B* is instantiating the application via a service principal.

![Diagram that shows a simplified provisioning flow driven by consent.](./media/authentication-scenarios/simplified-provisioning-flow-consent-driven.svg)

In this provisioning flow:

1. A user from tenant B attempts to sign in with the app. The authorization endpoint requests a token for the application.
1. The user credentials are acquired and verified for authentication.
1. The user is prompted to provide consent for the app to gain access to tenant B.
1. The Microsoft identity platform uses the application object in tenant A as a blueprint for creating a service principal in tenant B.
1. The user receives the requested token.

You can repeat this process for more tenants. Tenant A retains the blueprint for the app (application object). Users and admins of all the other tenants where the app is given consent keep control over what the application is allowed to do via the corresponding service principal object in each tenant. For more information, see [Application and service principal objects in the Microsoft identity platform](app-objects-and-service-principals.md).

## Next steps

For more information about authentication and authorization in the Microsoft identity platform, see the following articles:

* To learn about the basic concepts of authentication and authorization, see [Authentication vs. authorization](authentication-vs-authorization.md).
* To learn how access tokens, refresh tokens, and ID tokens are used in authentication and authorization, see [Security tokens](security-tokens.md).
* To learn about the sign-in flow of web, desktop, and mobile apps, see [App sign-in flow](app-sign-in-flow.md).
* To learn about proper authorization using token claims, see [Secure applications and APIs by validating claims](./claims-validation.md)

For more information about the application model, see the following articles:

* For more information on application objects and service principals in the Microsoft identity platform, see [How and why applications are added to Microsoft Entra ID](how-applications-are-added.md).
* For more information on single-tenant apps and multi-tenant apps, see [Tenancy in Microsoft Entra ID](single-and-multi-tenant-apps.md).
* For more information on how Microsoft Entra ID also provides Azure Active Directory B2C so that organizations can sign in users, typically customers, by using social identities like a Google account, see [Azure Active Directory B2C documentation](../../active-directory-b2c/index.yml).
