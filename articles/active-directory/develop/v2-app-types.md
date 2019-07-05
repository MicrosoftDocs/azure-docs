---
title: Application types for Microsoft identity platform | Azure
description: The types of apps and scenarios supported by the Microsoft identity platform (v2.0) endpoint.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 494a06b8-0f9b-44e1-a7a2-d728cf2077ae
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/06/2019
ms.author: ryanwi
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Application types for Microsoft identity platform

The Microsoft identity platform (v2.0) endpoint supports authentication for a variety of modern app architectures, all of them based on industry-standard protocols [OAuth 2.0 or OpenID Connect](active-directory-v2-protocols.md). This article describes the types of apps that you can build by using Microsoft identity platform, regardless of your preferred language or platform. The information is designed to help you understand high-level scenarios before you [start working with the code](v2-overview.md#getting-started).

> [!NOTE]
> The Microsoft identity platform endpoint doesn't support all Azure Active Directory (Azure AD) scenarios and features. To determine whether you should use the Microsoft identity platform endpoint, read about [Microsoft identity platform limitations](active-directory-v2-limitations.md).

## The basics

You must register each app that uses the Microsoft identity platform endpoint in the new [App registrations portal](https://go.microsoft.com/fwlink/?linkid=2083908). The app registration process collects and assigns these values for your app:

* An **Application (client) ID** that uniquely identifies your app
* A **Redirect URI** that you can use to direct responses back to your app
* A few other scenario-specific values such as supported account types

For details, learn how to [register an app](quickstart-register-app.md).

After the app is registered, the app communicates with Microsoft identity platform by sending requests to the endpoint. We provide open-source frameworks and libraries that handle the details of these requests. You also have the option to implement the authentication logic yourself by creating requests to these endpoints:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

## Single-page apps (JavaScript)

Many modern apps have a single-page app front end that primarily is written in JavaScript. Often, it's written by using a framework like Angular, React, or Vue. The Microsoft identity platform endpoint supports these apps by using the [OAuth 2.0 implicit flow](v2-oauth2-implicit-grant-flow.md).

In this flow, the app receives tokens directly from the Microsoft identity platform authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without extra page redirects.

![Shows the implicit authentication flow](./media/v2-app-types/convergence-scenarios-implicit.svg)

To see this scenario in action, try one of the single-page app code samples in the [Microsoft identity platform getting started](v2-overview.md#getting-started) section.

## Web apps

For web apps (.NET, PHP, Java, Ruby, Python, Node) that the user accesses through a browser, you can use [OpenID Connect](active-directory-v2-protocols.md) for user sign-in. In OpenID Connect, the web app receives an ID token. An ID token is a security token that verifies the user's identity and provides information about the user in the form of claims:

```
// Partial raw ID token
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtyaU1QZG1Cd...

// Partial content of a decoded ID token
{
    "name": "John Smith",
    "email": "john.smith@gmail.com",
    "oid": "d9674823-dffc-4e3f-a6eb-62fe4bd48a58"
    ...
}
```

Further details of different types of tokens used in the Microsoft identity platform endpoint are available in the [access token](access-tokens.md) reference and [id_token reference](id-tokens.md)

In web server apps, the sign-in authentication flow takes these high-level steps:

![Shows the web app authentication flow](./media/v2-app-types/convergence-scenarios-webapp.svg)

You can ensure the user's identity by validating the ID token with a public signing key that is received from the Microsoft identity platform endpoint. A session cookie is set, which can be used to identify the user on subsequent page requests.

To see this scenario in action, try one of the web app sign-in code samples in the [Microsoft identity platform getting started](v2-overview.md#getting-started) section.

In addition to simple sign-in, a web server app might need to access another web service, such as a REST API. In this case, the web server app engages in a combined OpenID Connect and OAuth 2.0 flow, by using the [OAuth 2.0 authorization code flow](active-directory-v2-protocols.md). For more information about this scenario, read about [getting started with web apps and Web APIs](active-directory-v2-devquickstarts-webapp-webapi-dotnet.md).

## Web APIs

You can use the Microsoft identity platform endpoint to secure web services, such as your app's RESTful Web API. Instead of ID tokens and session cookies, a Web API uses an OAuth 2.0 access token to secure its data and to authenticate incoming requests. The caller of a Web API appends an access token in the authorization header of an HTTP request, like this:

```
GET /api/items HTTP/1.1
Host: www.mywebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6...
Accept: application/json
...
```

The Web API uses the access token to verify the API caller's identity and to extract information about the caller from claims that are encoded in the access token. Further details of different types of tokens used in the Microsoft identity platform endpoint are available in the [access token](access-tokens.md) reference and [id_token reference](id-tokens.md)

A Web API can give users the power to opt in or opt out of specific functionality or data by exposing permissions, also known as [scopes](v2-permissions-and-consent.md). For a calling app to acquire permission to a scope, the user must consent to the scope during a flow. The Microsoft identity platform endpoint asks the user for permission, and then records permissions in all access tokens that the Web API receives. The Web API validates the access tokens it receives on each call and performs authorization checks.

A Web API can receive access tokens from all types of apps, including web server apps, desktop and mobile apps, single-page apps, server-side daemons, and even other Web APIs. The high-level flow for a Web API looks like this:

![Shows the web API authentication flow](./media/v2-app-types/convergence-scenarios-webapi.svg)

To learn how to secure a Web API by using OAuth2 access tokens, check out the Web API code samples in the [Microsoft identity platform getting started](v2-overview.md#getting-started) section.

In many cases, web APIs also need to make outbound requests to other downstream web APIs secured by Microsoft identity platform. To do so, web APIs can take advantage of the **On-Behalf-Of** flow, which allows the web API to exchange an incoming access token for another access token to be used in outbound requests. For more info, see [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](v2-oauth2-on-behalf-of-flow.md).

## Mobile and native apps

Device-installed apps, such as mobile and desktop apps, often need to access back-end services or Web APIs that store data and perform functions on behalf of a user. These apps can add sign-in and authorization to back-end services by using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

In this flow, the app receives an authorization code from the Microsoft identity platform endpoint when the user signs in. The authorization code represents the app's permission to call back-end services on behalf of the user who is signed in. The app can exchange the authorization code in the background for an OAuth 2.0 access token and a refresh token. The app can use the access token to authenticate to Web APIs in HTTP requests, and use the refresh token to get new access tokens when older access tokens expire.

![Shows the native app authentication flow](./media/v2-app-types/convergence-scenarios-native.svg)

## Daemons and server-side apps

Apps that have long-running processes or that operate without interaction with a user also need a way to access secured resources, such as Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity, with the OAuth 2.0 client credentials flow. You can prove the app's identity using a client secret or certificate. For more info, see [Authenticating to Microsoft identity platform in daemon apps with certificates](https://azure.microsoft.com/resources/samples/active-directory-dotnet-daemon-certificate-credential/).

In this flow, the app interacts directly with the `/token` endpoint to obtain access:

![Shows the daemon app authentication flow](./media/v2-app-types/convergence-scenarios-daemon.svg)

To build a daemon app, see the [client credentials documentation](v2-oauth2-client-creds-grant-flow.md), or try a [.NET sample app](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).
