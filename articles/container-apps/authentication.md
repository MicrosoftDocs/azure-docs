---
title: Authentication and authorization in Azure Container Apps Preview
description: Use built-in authentication in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/06/2022
ms.author: cshoe
---

# Authentication and authorization in Azure Container Apps Preview

Azure Container Apps provides built-in authentication and authorization capabilities (sometimes referred to as "Easy Auth"), so you can sign in users and access data by writing minimal or no code in your ingress-enabled container app.

## Why use the built-in authentication?

You're not required to use this feature for authentication and authorization. You can use the bundled security features in your web framework of choice, or you can write your own utilities. However, implementing a secure solution for authentication (signing-in users) and authorization (providing access to secure data) can take significant effort. You must make sure to follow industry best practices and standards, and keep your implementation up to date.

The built-in authentication feature for Container Apps can save you time and effort by providing out-of-the-box authentication with federated identity providers, allowing you to focus on the rest of your application.

- Azure Container Apps allows you to integrate a variety of auth capabilities into your web app or API without implementing them yourself.
- It’s built directly into the platform and doesn’t require any particular language, SDK, security expertise, or even any code to utilize.
- You can integrate with multiple login providers. For example, Azure AD, Facebook, Google, Twitter.

## Identity providers

Container Apps uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:

| Provider | Sign-in endpoint | How-To guidance |
| - | - | - |
| [Microsoft Identity Platform](../active-directory/fundamentals/active-directory-whatis.md) | `/.auth/login/aad` | [Container Apps Microsoft Identity Platform login](enable-authentication.md?pivots=aad) |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` | [Container Apps Facebook login](enable-authentication.md?pivots=facebook) |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` | [Container Apps Google login](enable-authentication.md?pivots=google) |
| [Twitter](https://developer.twitter.com/en/docs/basics/authentication) | `/.auth/login/twitter` | [Container Apps Twitter login](enable-authentication.md?pivots=twitter) |
| Any [OpenID Connect](https://openid.net/connect/) provider | `/.auth/login/<providerName>` | [Container Apps OpenID Connect login](enable-authentication.md?pivots=openid) |

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider. You can provide your users with any number of these sign-in options.

## Considerations for using built-in authentication

Enabling this feature will cause all requests to your application to be automatically redirected to HTTPS, regardless of the Container Apps configuration setting to enforce HTTPS. You can disable this with the  `requireHttps` setting in the V2 configuration. However, we do recommend sticking with HTTPS, and you should ensure no security tokens ever get transmitted over non-secure HTTP connections.

Container Apps can be used for authentication with or without restricting access to your site content and APIs. To restrict app access only to authenticated users, set **Action to take when request is not authenticated** to log in with one of the configured identity providers. To authenticate but not restrict access, set **Action to take when request is not authenticated** to "Allow anonymous requests (no action)."

> [!NOTE]
> You should give each app registration its own permission and consent. Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When testing new code, this practice can help prevent issues from affecting the production app.

## How it works

### Feature architecture

The authentication and authorization middleware component is a feature of the platform that runs on the same VM as your application. When it's enabled, every incoming HTTP request passes through it before being handled by your application.

:::image type="content" source="../app-service/media/app-service-authentication-overview/architecture.png" alt-text="An architecture diagram showing requests being intercepted by a process in the site sandbox which interacts with identity providers before allowing traffic to the deployed site" lightbox="../app-service/media/app-service-authentication-overview/architecture.png":::

The platform middleware handles several things for your app:

- Authenticates users and clients with the specified identity provider(s)
- Manages the authenticated session
- Injects identity information into HTTP request headers

The module runs separately from your application code and can be configured using Azure Resource Manager settings. No SDKs, specific programming languages, or changes to your application code are required. 

The authentication and authorization module runs in a separate container, isolated from your application code. Because it doesn't run in-process, no direct integration with specific language frameworks is possible; however, the relevant information that your app needs is provided in request headers as explained below.

### Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

- Without provider SDK (_server-directed flow_ or _server flow_): The application delegates federated sign-in to Container Apps. This is typically the case with browser apps, which can present the provider's login page to the user. This case applies to browser apps.

- With provider SDK (_client-directed flow_ or _client flow_): The application signs users in to the provider manually and then submits the authentication token to Container Apps for validation. This is typically the case with browser-less apps, which can't present the provider's sign-in page to the user. An example is a native mobile app that signs users in using the provider's SDK.

Calls from a trusted browser app in Container Apps to another REST API in Container Apps can be authenticated using the server-directed flow. For more information, see [Customize sign-ins and sign-outs](enable-authentication.md#customize-sign-in-and-sign-out).

The table below shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign user in | Redirects client to `/.auth/login/<provider>`. | Client code signs user in directly with provider's SDK and receives an authentication token. For information, see the provider's documentation. |
| 2. Post-authentication | Provider redirects client to `/.auth/login/<provider>/callback`. | Client code [posts token from provider](enable-authentication.md#client-directed-sign-in) to `/.auth/login/<provider>` for validation. |
| 3. Establish authenticated session | Container Apps adds authenticated cookie to response. | Container Apps returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header. |

For client browsers, Container Apps can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app using their provider of choice.



### <a name="authorization"></a>Authorization behavior

In the [Azure portal](https://portal.azure.com), you can configure your container app with a number of behaviors when incoming request is not authenticated. The following headings describe the options.

**Allow unauthenticated requests**

This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, Container Apps also passes along authentication information in the HTTP headers.

This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](enable-authentication.md#use-multiple-sign-in-providers) to your users. However, you must write code.

**Require authentication**

This option will reject any unauthenticated traffic to your application. This rejection can be a redirect action to one of the configured identity providers. In these cases, a browser client is redirected to `/.auth/login/<provider>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`. You can also configure the rejection to be an `HTTP 401 Unauthorized` or `HTTP 403 Forbidden` for all requests.

With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](enable-authentication.md#access-user-claims-in-app-code)).

> [!CAUTION]
> Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

> [!NOTE]
> By default, any user in your Azure AD tenant can request a token for your application from Azure AD. You can [configure the application in Azure AD](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users.

### Logging and tracing

If you [enable application logging](monitor.md), you will see authentication and authorization traces directly in your log files. If you see an authentication error that you didn't expect, you can conveniently find all the details by looking in your existing application logs. If you enable [failed request tracing](monitor.md), you can see exactly what role the authentication and authorization module may have played in a failed request. In the trace logs, look for references to a module named `EasyAuthModule_32/64`.

