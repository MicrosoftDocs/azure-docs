---
title: Authentication and authorization
description: Find out about the built-in authentication and authorization support in Azure App Service and Azure Functions, and how it can help secure your app against unauthorized access.
ms.assetid: b7151b57-09e5-4c77-a10c-375a262f17e5
ms.topic: article
ms.date: 07/08/2020
ms.reviewer: mahender
ms.custom: seodec18, fasttrack-edit, has-adal-ref
---
# Authentication and authorization in Azure App Service and Azure Functions

Azure App Service provides built-in authentication and authorization capabilities (sometimes referred to as "Easy Auth"), so you can sign in users and access data by writing minimal or no code in your web app, RESTful API, and mobile back end, and also [Azure Functions](../azure-functions/functions-overview.md). This article describes how App Service helps simplify authentication and authorization for your app.

## Why use the built in authentication?

Implementing a secure solution for authentication (signing-in users) and authorization (providing access to secure data) takes significant effort. You must make sure to follow industry best practices and standards, and keep your implementation up to date. Threat actors are constantly upping their game, and you must stay one step ahead of them to keep your users and data secure. The EasyAuth feature exists to save you time and effort by doing this work for you.

- Azure App Service that allows you to integrate a variety of auth capabilities into your web app or API without implementing them yourself.
- It’s built directly into the platform and doesn’t require any particular language, SDK, security expertise, or even any code to utilize.
- You can integrate with multiple login providers. For example, Azure AD, Facebook, Google, Twitter.

## Identity providers

App Service uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:

| Provider | Sign-in endpoint | How-To guidance |
| - | - | - |
| [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) | `/.auth/login/aad` | [App Service Azure AD login](configure-authentication-provider-aad.md) |
| [Microsoft Account](../active-directory/develop/v2-overview.md) | `/.auth/login/microsoftaccount` | [App Service Microsoft Account login](configure-authentication-provider-microsoft.md) |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` | [App Service Facebook login](configure-authentication-provider-facebook.md) |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` | [App Service Google login](configure-authentication-provider-google.md) |
| [Twitter](https://developer.twitter.com/en/docs/basics/authentication) | `/.auth/login/twitter` | [App Service Twitter login](configure-authentication-provider-twitter.md) |
| Any [OpenID Connect](https://openid.net/connect/) provider (preview) | `/.auth/login/<providerName>` | [App Service OpenID Connect login](configure-authentication-provider-openid-connect.md) |

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider. You can provide your users with any number of these sign-in options.

## Frequently asked questions

**Do I have to use the built in authentication feature?**

You're not required to use this feature for authentication and authorization. You can use the bundled security features in your web framework of choice, or you can write your own utilities. However, keep in mind that you will need to ensure that your solution stays up to date with the latest security, protocol, and browser updates.

**Can I link an existing app registration for multiple apps or slots?**

Give each app registration its own permission and consent. Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When testing new code, this practice can help prevent issues from affecting the production app.

**Are all requests redirected to HTTPS?**

Enabling this feature will cause all requests to your application to be automatically redirected to HTTPS, regardless of the App Service configuration setting to enforce HTTPS. You can disable this with the  `requireHttps` setting in the V2 configuration. Ensure no security tokens ever get transmitted over non-secure HTTP connections.

**Will this restrict access to content and APIs?**

App Service can be used for authentication with or without restricting access to your site content and APIs. To restrict app access only to authenticated users, set **Action to take when request is not authenticated** to  log in with one of the configured identity providers. To authenticate but not restrict access, set **Action to take when request is not authenticated** to "Allow anonymous requests (no action)."

**Can I authorize it with role-specific authorization?**

Authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see Access user claims). Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

## How it works

### Authentication module architecture

#### Windows

The authentication and authorization module runs in the same sandbox as your application code. When it's enabled, every incoming HTTP request passes through it before being handled by your application code.

:::image type="content" source="media/app-service-authentication-overview/architecture.png" alt-text="An architecture diagram showing requests being intercepted by a process in the site sandbox which interacts with identity providers before allowing traffic to the deployed site" lightbox="media/app-service-authentication-overview/architecture.png":::

This module handles several things for your app:

- Authenticates users with the specified provider
- Validates, stores, and refreshes tokens
- Manages the authenticated session
- Injects identity information into request headers

The module runs separately from your application code and is configured using app settings. No SDKs, specific languages, or changes to your application code are required. 

#### Containers

The authentication and authorization module runs in a separate container, isolated from your application code. Using what's known as the [Ambassador pattern](/azure/architecture/patterns/ambassador), it interacts with the incoming traffic to perform similar functionality as on Windows. Because it does not run in-process, no direct integration with specific language frameworks is possible; however, the relevant information that your app needs is passed through using request headers as explained below.

### User/Application claims

For all language frameworks, App Service makes the claims in the incoming token (whether that be from an authenticated end user or a client application) available to your code by injecting them into the request headers. For ASP.NET 4.6 apps, App Service populates [ClaimsPrincipal.Current](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims, so you can follow the standard .NET code pattern, including the `[Authorize]` attribute. Similarly, for PHP apps, App Service populates the `_SERVER['REMOTE_USER']` variable. For Java apps, the claims are [accessible from the Tomcat servlet](configure-language-java.md#authenticate-users-easy-auth).

For [Azure Functions](../azure-functions/functions-overview.md), `ClaimsPrincipal.Current` is not populated for .NET code, but you can still find the user claims in the request headers, or get the `ClaimsPrincipal` object from the request context or even through a binding parameter. See [working with client identities](../azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities) for more information.

For more information, see [Access user claims](app-service-authentication-how-to.md#access-user-claims).

At this time, ASP.NET Core does not currently support populating the current user with the Authentication/Authorization feature. However, some [3rd party, open source middleware components](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth) do exist to help fill this gap.

### Token store

App Service provides a built-in token store, which is a repository of tokens that are associated with the users of your web apps, APIs, or native mobile apps. When you enable authentication with any provider, this token store is immediately available to your app. If your application code needs to access data from these providers on the user's behalf, such as:

- post to the authenticated user's Facebook timeline
- read the user's corporate data using the Microsoft Graph API

You typically must write code to collect, store, and refresh these tokens in your application. With the token store, you just [retrieve the tokens](app-service-authentication-how-to.md#retrieve-tokens-in-app-code) when you need them and [tell App Service to refresh them](app-service-authentication-how-to.md#refresh-identity-provider-tokens) when they become invalid. 

The ID tokens, access tokens, and refresh tokens are cached for the authenticated session, and they're accessible only by the associated user.  

If you don't need to work with tokens in your app, you can disable the token store in your app's **Authentication / Authorization** page.

### Logging and tracing

If you [enable application logging](troubleshoot-diagnostic-logs.md), you will see authentication and authorization traces directly in your log files. If you see an authentication error that you didn't expect, you can conveniently find all the details by looking in your existing application logs. If you enable [failed request tracing](troubleshoot-diagnostic-logs.md), you can see exactly what role the authentication and authorization module may have played in a failed request. In the trace logs, look for references to a module named `EasyAuthModule_32/64`.

### Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

- Without provider SDK: The application delegates federated sign-in to App Service. This is typically the case with browser apps, which can present the provider's login page to the user. The server code manages the sign-in process, so it is also called _server-directed flow_ or _server flow_. This case applies to browser apps. It also applies to native apps that sign users in using the Mobile Apps client SDK because the SDK opens a web view to sign users in with App Service authentication.
- With provider SDK: The application signs users in to the provider manually and then submits the authentication token to App Service for validation. This is typically the case with browser-less apps, which can't present the provider's sign-in page to the user. The application code manages the sign-in process, so it is also called _client-directed flow_ or _client flow_. This case applies to REST APIs, [Azure Functions](../azure-functions/functions-overview.md), and JavaScript browser clients, as well as browser apps that need more flexibility in the sign-in process. It also applies to native mobile apps that sign users in using the provider's SDK.

Calls from a trusted browser app in App Service to another REST API in App Service or [Azure Functions](../azure-functions/functions-overview.md) can be authenticated using the server-directed flow. For more information, see [Customize authentication and authorization in App Service](app-service-authentication-how-to.md).

The table below shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign user in | Redirects client to `/.auth/login/<provider>`. | Client code signs user in directly with provider's SDK and receives an authentication token. For information, see the provider's documentation. |
| 2. Post-authentication | Provider redirects client to `/.auth/login/<provider>/callback`. | Client code [posts token from provider](app-service-authentication-how-to.md#validate-tokens-from-providers) to `/.auth/login/<provider>` for validation. |
| 3. Establish authenticated session | App Service adds authenticated cookie to response. | App Service returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header (automatically handled by Mobile Apps client SDKs). |

For client browsers, App Service can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app using their provider of choice.

<a name="authorization"></a>

### Authorization behavior

In the [Azure portal](https://portal.azure.com), you can configure App Service authorization with a number of behaviors when incoming request is not authenticated.

![A screenshot showing the "Action to take when request is not authenticated" dropdown](media/app-service-authentication-overview/authorization-flow.png)

The following headings describe the options.

#### Allow Anonymous requests (no action)

This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, App Service also passes along authentication information in the HTTP headers.

This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](app-service-authentication-how-to.md#use-multiple-sign-in-providers) to your users. However, you must write code.

#### Allow only authenticated requests

The option is **Log in with \<provider>**. App Service redirects all anonymous requests to `/.auth/login/<provider>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`.

With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](app-service-authentication-how-to.md#access-user-claims)).

> [!CAUTION]
> Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

> [!NOTE]
> By default, any user in your Azure AD tenant can request a token for your application from Azure AD. You can [configure the application in Azure AD](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users.

## More resources

- [How-To: Configure your App Service or Azure Functions app to use Azure AD login](configure-authentication-provider-aad.md)
- [Advanced usage of authentication and authorization in Azure App Service](app-service-authentication-how-to.md)

Samples:
- [Tutorial: Add authentication to your web app running on Azure App Service](scenario-secure-app-authentication-app-service.md)
- [Tutorial: Authenticate and authorize users end-to-end in Azure App Service (Windows or Linux)](tutorial-auth-aad.md)
- [.NET Core integration of Azure AppService EasyAuth (3rd party)](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth)
- [Getting Azure App Service authentication working with .NET Core (3rd party)](https://github.com/kirkone/KK.AspNetCore.EasyAuthAuthentication)
