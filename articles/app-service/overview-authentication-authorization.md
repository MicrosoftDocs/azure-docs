---
title: Authentication and authorization
description: Find out about the built-in authentication and authorization support in Azure App Service and Azure Functions, and how it can help secure your app against unauthorized access.
ms.assetid: b7151b57-09e5-4c77-a10c-375a262f17e5
ms.topic: article
ms.date: 04/15/2020
ms.reviewer: mahender
ms.custom: seodec18, fasttrack-edit, has-adal-ref
---
# Authentication and authorization in Azure App Service and Azure Functions

> [!NOTE]
> At this time, ASP.NET Core does not currently support populating the current user with the Authentication/Authorization feature.
>

Azure App Service provides built-in authentication and authorization support, so you can sign in users and access data by writing minimal or no code in your web app, RESTful API, and mobile back end, and also [Azure Functions](../azure-functions/functions-overview.md). This article describes how App Service helps simplify authentication and authorization for your app.

Secure authentication and authorization require deep understanding of security, including federation, encryption, [JSON web tokens (JWT)](https://wikipedia.org/wiki/JSON_Web_Token) management, [grant types](https://oauth.net/2/grant-types/), and so on. App Service provides these utilities so that you can spend more time and energy on providing business value to your customer.

> [!IMPORTANT]
> You're not required to use this feature for authentication and authorization. You can use the bundled security features in your web framework of choice, or you can write your own utilities. However, keep in mind that [Chrome 80 is making breaking changes to its implementation of SameSite for cookies](https://www.chromestatus.com/feature/5088147346030592) (release date around March 2020), and custom remote authentication or other scenarios that rely on cross-site cookie posting may break when client Chrome browsers are updated. The workaround is complex because it needs to support different SameSite behaviors for different browsers. 
>
> The ASP.NET Core 2.1 and above versions hosted by App Service are already patched for this breaking change and handle Chrome 80 and older browsers appropriately. In addition, the same patch for ASP.NET Framework 4.7.2 is being deployed on the App Service instances throughout January 2020. For more information, including how to know if your app has received the patch, see [Azure App Service SameSite cookie update](https://azure.microsoft.com/updates/app-service-samesite-cookie-update/).
>

For information specific to native mobile apps, see [User authentication and authorization for mobile apps with Azure App Service](../app-service-mobile/app-service-mobile-auth.md).

## How it works

The authentication and authorization module runs in the same sandbox as your application code. When it's enabled, every incoming HTTP request passes through it before being handled by your application code.

![](media/app-service-authentication-overview/architecture.png)

This module handles several things for your app:

- Authenticates users with the specified provider
- Validates, stores, and refreshes tokens
- Manages the authenticated session
- Injects identity information into request headers

The module runs separately from your application code and is configured using app settings. No SDKs, specific languages, or changes to your application code are required. 

### User/Application claims

For all language frameworks, App Service makes the claims in the incoming token (whether that be from an authenticated end user or a client application) available to your code by injecting them into the request headers. For ASP.NET 4.6 apps, App Service populates [ClaimsPrincipal.Current](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims, so you can follow the standard .NET code pattern, including the `[Authorize]` attribute. Similarly, for PHP apps, App Service populates the `_SERVER['REMOTE_USER']` variable. For Java apps, the claims are [accessible from the Tomcat servlet](containers/configure-language-java.md#authenticate-users-easy-auth).

For [Azure Functions](../azure-functions/functions-overview.md), `ClaimsPrincipal.Current` is not populated for .NET code, but you can still find the user claims in the request headers, or get the `ClaimsPrincipal` object from the request context or even through a binding parameter. See [working with client identities](../azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities) for more information.

For more information, see [Access user claims](app-service-authentication-how-to.md#access-user-claims).

### Token store

App Service provides a built-in token store, which is a repository of tokens that are associated with the users of your web apps, APIs, or native mobile apps. When you enable authentication with any provider, this token store is immediately available to your app. If your application code needs to access data from these providers on the user's behalf, such as: 

- post to the authenticated user's Facebook timeline
- read the user's corporate data using the Microsoft Graph API

You typically must write code to collect, store, and refresh these tokens in your application. With the token store, you just [retrieve the tokens](app-service-authentication-how-to.md#retrieve-tokens-in-app-code) when you need them and [tell App Service to refresh them](app-service-authentication-how-to.md#refresh-identity-provider-tokens) when they become invalid. 

The id tokens, access tokens, and refresh tokens are cached for the authenticated session, and they're accessible only by the associated user.  

If you don't need to work with tokens in your app, you can disable the token store.

### Logging and tracing

If you [enable application logging](troubleshoot-diagnostic-logs.md), you will see authentication and authorization traces directly in your log files. If you see an authentication error that you didn't expect, you can conveniently find all the details by looking in your existing application logs. If you enable [failed request tracing](troubleshoot-diagnostic-logs.md), you can see exactly what role the authentication and authorization module may have played in a failed request. In the trace logs, look for references to a module named `EasyAuthModule_32/64`. 

## Identity providers

App Service uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. Five identity providers are available by default: 

| Provider | Sign-in endpoint |
| - | - |
| [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) | `/.auth/login/aad` |
| [Microsoft Account](../active-directory/develop/v2-overview.md) | `/.auth/login/microsoftaccount` |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` |
| [Twitter](https://developer.twitter.com/en/docs/basics/authentication) | `/.auth/login/twitter` |

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider. You can provide your users with any number of these sign-in options with ease. You can also integrate another identity provider or [your own custom identity solution][custom-auth].

## Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

- Without provider SDK: The application delegates federated sign-in to App Service. This is typically the case with browser apps, which can present the provider's login page to the user. The server code manages the sign-in process, so it is also called _server-directed flow_ or _server flow_. This case applies to browser apps. It also applies to native apps that sign users in using the Mobile Apps client SDK because the SDK opens a web view to sign users in with App Service authentication. 
- With provider SDK: The application signs users in to the provider manually and then submits the authentication token to App Service for validation. This is typically the case with browser-less apps, which can't present the provider's sign-in page to the user. The application code manages the sign-in process, so it is also called _client-directed flow_ or _client flow_. This case applies to REST APIs, [Azure Functions](../azure-functions/functions-overview.md), and JavaScript browser clients, as well as browser apps that need more flexibility in the sign-in process. It also applies to native mobile apps that sign users in using the provider's SDK.

> [!NOTE]
> Calls from a trusted browser app in App Service to another REST API in App Service or [Azure Functions](../azure-functions/functions-overview.md) can be authenticated using the server-directed flow. For more information, see [Customize authentication and authorization in App Service](app-service-authentication-how-to.md).
>

The table below shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign user in | Redirects client to `/.auth/login/<provider>`. | Client code signs user in directly with provider's SDK and receives an authentication token. For information, see the provider's documentation. |
| 2. Post-authentication | Provider redirects client to `/.auth/login/<provider>/callback`. | Client code [posts token from provider](app-service-authentication-how-to.md#validate-tokens-from-providers) to `/.auth/login/<provider>` for validation. |
| 3. Establish authenticated session | App Service adds authenticated cookie to response. | App Service returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header (automatically handled by Mobile Apps client SDKs). |

For client browsers, App Service can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app using their provider of choice.

<a name="authorization"></a>

## Authorization behavior

In the [Azure portal](https://portal.azure.com), you can configure App Service authorization with a number of behaviors when incoming request is not authenticated.

![](media/app-service-authentication-overview/authorization-flow.png)

The following headings describe the options.

### Allow Anonymous requests (no action)

This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, App Service also passes along authentication information in the HTTP headers. 

This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](app-service-authentication-how-to.md#use-multiple-sign-in-providers) to your users. However, you must write code. 

### Allow only authenticated requests

The option is **Log in with \<provider>**. App Service redirects all anonymous requests to `/.auth/login/<provider>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`.

With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](app-service-authentication-how-to.md#access-user-claims)).

> [!CAUTION]
> Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

> [!NOTE]
> Authentication/Authorization was previously known as Easy Auth.
>

## More resources

[Tutorial: Authenticate and authorize users end-to-end in Azure App Service (Windows)](app-service-web-tutorial-auth-aad.md)  
[Tutorial: Authenticate and authorize users end-to-end in Azure App Service for Linux](containers/tutorial-auth-aad.md)  
[Customize authentication and authorization in App Service](app-service-authentication-how-to.md)
[.NET Core integration of Azure AppService EasyAuth (3rd party)](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth)
[Getting Azure App Service authentication working with .NET Core (3rd party)](https://github.com/kirkone/KK.AspNetCore.EasyAuthAuthentication)

Provider-specific how-to guides:

* [How to configure your app to use Azure Active Directory login][AAD]
* [How to configure your app to use Facebook login][Facebook]
* [How to configure your app to use Google login][Google]
* [How to configure your app to use Microsoft Account login][MSA]
* [How to configure your app to use Twitter login][Twitter]
* [How to: Use custom authentication for your application][custom-auth]

[AAD]: configure-authentication-provider-aad.md
[Facebook]: configure-authentication-provider-facebook.md
[Google]: configure-authentication-provider-google.md
[MSA]: configure-authentication-provider-microsoft.md
[Twitter]: configure-authentication-provider-twitter.md

[custom-auth]: ../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#custom-auth

[ADAL-Android]: ../app-service-mobile/app-service-mobile-android-how-to-use-client-library.md#adal
[ADAL-iOS]: ../app-service-mobile/app-service-mobile-ios-how-to-use-client-library.md#adal
[ADAL-dotnet]: ../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#adal
