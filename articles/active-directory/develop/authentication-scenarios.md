---
title: Authentication in Microsoft identity platform | Azure
description: Learn about the basics of authentication in the Microsoft identity platform (v2.0).
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 0c84e7d0-16aa-4897-82f2-f53c6c990fd9
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/18/2019
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda, sureshja, hirsin
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand the basic concepts of authentication in the Microsoft identity platform
---

# Authentication basics

## What is authentication

This article covers many of the authentication concepts you'll need to understand to create protected web apps, web APIs, or apps calling protected Web APIs.

**Authentication** is the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN.

**Authorization** is the act of granting an authenticated party permission to do something. It specifies what data you're allowed to access and what you can do with that data. Authorization is sometimes shortened to AuthZ.

Instead of creating apps that each maintain their own username and password information, which incurs a high administrative burden when you need to add or remove users across multiple apps, apps can delegate that responsibility to a centralized identity provider.

Azure Active Directory (Azure AD) is a centralized identity provider in the cloud. Delegating authentication and authorization to it enables scenarios such as Conditional Access policies that require a user to be in a specific location, the use of multi-factor authentication, as well as enabling a user to sign in once and then be automatically signed in to all of the web apps that share the same centralized directory. This capability is referred to as Single Sign On (SSO).

A centralized identity provider is even more important for apps that have users located around the globe that don't necessarily sign in from the enterprise's network. Azure AD authenticates users and provides access tokens. An access token is a security token that is issued by an authorization server. It contains information about the user and the app for which the token is intended, which can be used to access Web APIs and other protected resources.

The Microsoft identity platform simplifies authentication for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly. It allows developers to build applications that sign in all Microsoft identities, get tokens to call Microsoft Graph, other Microsoft APIs, or APIs that developers have built. For more information, see [Evolution of Microsoft identity platform](about-microsoft-identity-platform.md).

### Tenants

A cloud identity provider serves many organizations. To keep users from different organizations separate, Azure AD is partitioned into tenants, with one tenant per organization.

Tenants keep track of users and their associated apps. The Microsoft identity platform also supports users that sign in with personal Microsoft accounts.

Azure AD also provides Azure Active Directory B2C so that organizations can  sign in users, typically customers, using social identities like a Google account. For more information, see [Azure Active Directory B2C documentation](https://docs.microsoft.com/azure/active-directory-b2c) .

### Security tokens

Security tokens contain information about users and apps. Azure AD uses JSON based tokens (JWTs) that contain claims. A claim provides assertions about one entity to another. Applications can use claims for various tasks such as:

* Validating the token
* Identifying the subject's directory tenant
* Displaying user information
* Determining the subject's authorization

A claim consists of key-value pairs that provide information such as:

- the Security Token Server that generated the token.
- the date when the token was generated.
- the subject, such as the user (except for daemons).
- the audience, which is the app for which the token was generated.
- the app (the client) that asked for the token. In the case of web apps, this may be the same as the audience.

For more detailed claim information, see the [access tokens](access-tokens.md) and [ID tokens](id-tokens.md).

It's up to the app for which the token was generated, the web app that signed-in the user, or the Web API being called, to validate the token. The token is signed by the Security Token Server (STS) with a private key. The STS publishes the corresponding public key. To validate a token, the app verifies the signature by using the STS public key to validate that the signature was created using the private key.

Tokens are only valid for a limited amount of time. Usually the STS provides a pair of tokens: an access token to access the application or protected resource, and a refresh token used to refresh the access token when the access token is close to expiring. 

Access tokens are passed to a Web API as the bearer token in the `Authorization` header. An app can provide a refresh token to the STS, and if the user access to the app wasn't revoked, it will get back a new access token and a new refresh token. This is how the scenario of someone leaving the enterprise is handled. When the STS receives the refresh token, it won't issue another valid access token if the user is no longer authorized.

## Application model

Applications can sign in users themselves or delegate sign-in to an identity provider. See [Authentication flows and app scenarios](authentication-flows-app-scenarios.md) to learn about sign-in scenarios supported by Azure AD.

For an identity provider to know that a user has access to a particular app, both the user and the application must be registered with the identity provider. When you register your application with Azure AD, you are providing an identity configuration for your application that allows it to integrate with Azure AD. Registering the app also  allows you to:

- customize the branding of your application in the sign-in dialog. This is important because this is the first experience a user will have with your app.
- decide if you want to let users sign in only if they belong to your organization. This is a single tenant application. Or allow users to sign in using any work or school account. This is a multi-tenant application. You can also allow personal Microsoft accounts, or a social account from LinkedIn, Google, and so on.
- request scope permissions. For example, you can request the "user.read" scope, which grants permission to read the profile of the signed-in user.
- define scopes that define access to your Web API. Typically, when an app wants to access your API, it will need to request permissions to the scopes you define.
- share a secret with Azure AD that proves the app's identity to Azure AD.  This is relevant in the case where the app is a confidential client application. A confidential client application is an application that can hold credentials securely. They require a trusted backend server to store the credentials.

Once registered, the application will be given a GUID that the app shares with Azure AD when it requests tokens. If the app is a confidential client application, it will also share the secret or the public key, depending on whether certificates or secrets were used.

The Microsoft identity platform represents applications using a model that fulfills two main functions:

Identify the app by the authentication protocols it supports and provide all the identifiers, URLs, secrets, and related information that are needed to authenticate.
The Microsoft identity platform:

* Holds all the data required to support authentication at runtime.
* Holds all the data for deciding what resources an app might need to access, and under what circumstances a given request should be fulfilled.
* Provides infrastructure for implementing app provisioning within the app developer's tenant, and to any other Azure AD tenant.
* Handles user consent during token request time and facilitate the dynamic provisioning of apps across tenants

Consent is the process of a resource owner granting authorization for a client application to access protected resources, under specific permissions, on behalf of the resource owner. The Microsoft identity platform:

* Enables users and administrators to dynamically grant or deny consent for the app to access resources on their behalf.
* Enables administrators to ultimately decide what apps are allowed to do and which users can use specific apps, and how the directory resources are accessed.

In the Microsoft identity platform, an **application object** describes an application as an abstract entity. At deployment time, the Microsoft identity platform uses the application object as a blueprint to create a **service principal**, which represents a concrete instance of an application within a directory or tenant. The service principal defines what the app can actually do in a specific target directory, who can use it, what resources it has access to, and so on. The Microsoft identity platform creates a service principal from an application object through **consent**.

The following diagram shows a simplified Microsoft identity platform provisioning flow driven by consent. It shows two tenants (A and B). Tenant A owns the application. Tenant B is instantiating the application via a service principal.  

![Simplified provisioning flow driven by consent](./media/authentication-scenarios/simplified-provisioning-flow-consent-driven.svg)

In this provisioning flow:

1. A user from tenant B attempts to sign in with the app, the authorization endpoint requests a token for the application.
1. The user credentials are acquired and verified for authentication.
1. The user is prompted to provide consent for the app to gain access to tenant B.
1. The Microsoft identity platform uses the application object in tenant A as a blueprint for creating a service principal in tenant B.
1. The user receives the requested token.

You can repeat this process for additional tenants. Tenant A retains the blueprint for the app (application object). Users and admins of all the other tenants where the app is given consent keep control over what the application is allowed to do via the corresponding service principal object in each tenant. For more information, see [Application and service principal objects in Microsoft identity platform](app-objects-and-service-principals.md).

## Web app sign-in flow with Azure AD

When a user navigates in the browser to a web app, the following happens:

- The web app determines whether the user is authenticated.
- If the user isn't authenticated, the web app delegates to Azure AD to sign in the user. That sign in will be compliant with the policy of the organization, which may mean asking the user to enter their credentials, using multi-factor-authentication, or not using a password at all (for example using Windows Hello).
- The user is asked to consent to the access that the client app needs. This is why client apps need to be registered with Azure AD, so that Azure AD can deliver tokens representing the access that the user has consented to.

When the user has successfully authenticated:

- Azure AD sends a token to the web app.
- A cookie is saved, associated with Azure AD's domain, that contains the identity of the user in the browser's cookie jar. The next time an app uses the browser to navigate to the Azure AD authorization end point, the browser presents the cookie so that the user doesn't have to sign in again. This is also the way that SSO is  achieved. The cookie is produced by Azure AD and can only be understood by Azure AD.
- The web app then validates the token. If the validation succeeds, the web app displays the protected page and saves a session cookie in the browser's cookie jar. When the user navigates to another page, the web app knows that the user is authenticated based on the session cookie.

The following sequence diagram summarizes this interaction:

![web app authentication process](media/authentication-scenarios/web-app-how-it-appears-to-be.png)

### How a web app determines if the user is authenticated

Web app developers can indicate whether all or only certain pages require authentication. For example, in ASP.NET/ASP.NET Core, this is done by adding the `[Authorize]` attribute to the controller actions. 

This attribute causes ASP.NET to check for the presence of a session cookie containing the identity of the user. If a cookie isn't present, ASP.NET redirects authentication to the specified identity provider. If the identity provider is Azure AD, the web app redirects authentication to https://login.microsoftonline.com, which displays a sign-in dialog.

### How a web app delegates sign-in to Azure AD and obtains a token

User authentication happens via the browser. The OpenID protocol uses standard HTTP protocol messages.
- The web app sends an HTTP 302 (redirect) to the browser to use Azure AD.
- When the user is authenticated, Azure AD sends the token to the web app by using a redirect through the browser.
- The redirect is provided by the web app in the form of a redirect URI. This redirect URI is registered with the Azure AD application object. There can be several redirect URIs because the application may be deployed at several URLs. So the web app will also need to specify the redirect URi to use.
- Azure AD verifies that the redirect URI sent by the web app is one of the registered redirect URIs for the app.

## Desktop and mobile app sign-in flow with Azure AD

The flow described above applies, with slight differences, to desktop and mobile applications.

Desktop and mobile applications can use an embedded Web control, or a system browser, for authentication. The following diagram shows how a Desktop or mobile app uses the Microsoft authentication library (MSAL) to acquire access tokens and call web APIs.

![Desktop app how it appears to be](media/authentication-scenarios/desktop-app-how-it-appears-to-be.png)

MSAL uses a browser to get tokens, and as with web apps, delegates authentication to Azure AD.

Because Azure AD saves the same identity cookie in the browser as it does for web apps, if the native or mobile app uses the system browser it will immediately get SSO with the corresponding web app.

By default, MSAL uses the system browser except for .NET Framework desktop applications where an embedded control is used to provide a more integrated user experience.

## Next steps

- See the [Microsoft identity platform developer glossary](developer-glossary.md) to get familiar with common terms.
- See [Authentication flows and app scenarios](authentication-flows-app-scenarios.md) to learn more about other scenarios for authenticating users supported by the Microsoft identity platform.
- See [MSAL libraries](msal-overview.md) to learn about the Microsoft libraries that help you develop applications that work with Microsoft Accounts, Azure AD accounts, and Azure AD B2C users all in a single, streamlined programming model.
- See [Integrate App Service with Microsoft identity platform](/azure/app-service/configure-authentication-provider-aad) to learn how to configure authentication for your App Service app.
