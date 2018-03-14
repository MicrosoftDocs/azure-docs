---
title: Authentication and authorization in Azure App Service | Microsoft Docs
description: Conceptual reference and overview of the Authentication / Authorization feature for Azure App Service
services: app-service
documentationcenter: ''
author: mattchenderson
manager: erikre
editor: ''

ms.assetid: b7151b57-09e5-4c77-a10c-375a262f17e5
ms.service: app-service
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 08/29/2016
ms.author: mahender

---
# Authentication and authorization in Azure App Service

Azure App Service provides built-in authentication and authorization support, so you can sign in users and access data by writing minimal or no code in your web app, API, mobile back end, or function app. This article describes how App Service helps simplify authentication and authorization for your app. 

For information specific to native mobile apps, see [User authentication and authorization for mobile apps with Azure App Service](../app-service-mobile/app-service-mobile-auth.md).

## App Service vs. your own auth code

You are free to write your own code to authenticate and authorize users. However, secure authentication requires deep understanding of security, including federation, encryption, [JSON web tokens (JWT)](https://wikipedia.org/wiki/JSON_Web_Token) management, [grant types](https://oauth.net/2/grant-types/), and so on. App Service helps deliver world-class authentication and authorization to your app with the click of a button.

Authentication and authorization in App Service doesn't fit everyone's need. Use your own utilities for authentication and authorization when you need more flexibility than App Service provides. 

### User claims

For ASP.NET 4.6 apps, App Service populates [ClaimsPrincipal.Current](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims, so you can follow the standard code pattern. For other language frameworks, App Service makes the user's claims available by injecting them into the request headers.

For more information, see [Access user claims](app-service-authentication-how-to.md#access-user-claims).

### Token store

App Service provides a built-in token store, which is a repository of [OAuth](https://wikipedia.org/wiki/OAuth) tokens that are associated with the users of your web apps, APIs, or native mobile apps. When you enable authentication with any provider, this token store is immediately available to your app. If your application code needs to access data from these providers, such as: 

- post to the authenticated user's Facebook timeline
- read corporate data from the Azure Active Directory Graph API or even the Microsoft Graph on behalf of a user

you typically must write code to collect, store, and refresh these tokens in your application. With the token store, you just retrieve the tokens when you need them and tell App Service to refresh them when they become invalid. 

If you don't need to token store for your app, you can disable it.

For more information, see [Retrieve tokens in app code](app-service-authentication-how-to.md#retrieve-tokens-in-app-code) and [Refresh access tokens](app-service-authentication-how-to.md#refresh-access-tokens).

## Authentication flow

App Service uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. Five identity providers are available by default: 

- Azure Active Directory (`/.auth/login/aad`)
- Microsoft Account (`/.auth/login/microsoft`)
- Facebook (`/.auth/login/facebook`)
- Google (`/.auth/login/google`)
- Twitter (`/.auth/login/twitter`)

You can provide your users with any number of these sign-in options with ease. You can also integrate another identity provider or [your own custom identity solution][custom-auth].

The authentication flow is the same for all providers, but differs depending on whether the browser is involved:

- Browser apps: Can present the provider's login page to the user. The server code manages the sign-in process, so it is also called _server-directed flow_ or _server flow_. This case applies to web apps. It also applies to native apps that sign users in using the Mobile Apps client SDK because the SDK opens a web view to sign users in with App Service authentication. 
- Browser-less apps: Cannot present the provider's login page to the user. The client code must sign users in directly using the provider's SDK, so it is also called _client-directed flow_ or _client flow_. This case applies to REST APIs, function apps, and JavaScript browser clients. It also applies to native mobile apps that sign users in using the provider's SDK. 

> [!NOTE]
> Calls from a trusted browser app in App Service calls another REST API App Service or function app can be authenticated using the server-directed flow. For more information, see [Authenticate users with Azure App Service]().
>

| Step | Browser app | Browser-less app |
| 1. Sign user sin | Redirects client to `/.auth/login/<provider>`. | Client code signs user in directly with provider's SDK. |
| 2. Post authentication | Provider redirects client to `/.auth/login/<provider>/callback`. | Client code posts token from provider to `/.auth/login/<provider>`. |
| 3. Establish authenticated session | App Service adds authenticated cookie to response. | App Service returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header (automatically handled by Mobile Apps client SDKs). |

For client browsers, App Service can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app using their provider of choice.

<a name="authorization"></a>

## Authorization behavior

You can configure App Service authorization with any of the following behaviors:

- (default) Allow all requests - Authentication and authorization is not managed by App Service (turned off). 

    Choose this option that you don't need authentication and authorization, or that you want to write your own authentication and authorization code.

- Allow only authenticated requests - In the Azure portal, the option is **Log in with \<provider>**. App Service redirects all anonymous requests to `/.auth/login/<provider>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`.

    With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](app-service-authentication-how-to.md#access-user-claims)).

- Allow all requests, but validate authenticated requests - In the Azure portal, the option is **Allow Anonymous requests**. This option turns on authentication and authorization in App Service, but defers authorization decisions to your application code. For authenticated requests, App Service also passes along authentication information in the HTTP headers. 

    This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in options](app-service-authentication-how-to.md#configure-multiple-sign-in-options) to your users. However, you have to write code. 

## More resources

The following tutorials show how to configure App Service to use different authentication providers:

* [How to configure your app to use Azure Active Directory login][AAD]
* [How to configure your app to use Facebook login][Facebook]
* [How to configure your app to use Google login][Google]
* [How to configure your app to use Microsoft Account login][MSA]
* [How to configure your app to use Twitter login][Twitter]

To use a custom identity system, you can also use the [preview custom authentication support in the Mobile Apps .NET server SDK][custom-auth], which can be used by web apps, mobile apps, or API apps.

For information specific to native mobile apps, see [User authentication and authorization for mobile apps with Azure App Service](../app-service-mobile/app-service-mobile-auth.md).

[AAD]: app-service-mobile-how-to-configure-active-directory-authentication.md
[Facebook]: app-service-mobile-how-to-configure-facebook-authentication.md
[Google]: app-service-mobile-how-to-configure-google-authentication.md
[MSA]: app-service-mobile-how-to-configure-microsoft-authentication.md
[Twitter]: app-service-mobile-how-to-configure-twitter-authentication.md

[custom-auth]: ../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth

[ADAL-Android]: ../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md#adal
[ADAL-iOS]: ../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#adal
[ADAL-dotnet]: ../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#adal
