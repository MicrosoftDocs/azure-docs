---
title: Authentication and authorization
description: Find out about the built-in authentication and authorization support in Azure App Service and Azure Functions, and how it can help secure your app against unauthorized access.
ms.assetid: b7151b57-09e5-4c77-a10c-375a262f17e5
ms.topic: article
ms.date: 02/03/2023
ms.reviewer: mahender
ms.custom: UpdateFrequency3, seodec18, fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
---
# Authentication and authorization in Azure App Service and Azure Functions

Azure App Service provides built-in authentication and authorization capabilities (sometimes referred to as "Easy Auth"), so you can sign in users and access data by writing minimal or no code in your web app, RESTful API, and mobile back end, and also [Azure Functions](../azure-functions/functions-overview.md). This article describes how App Service helps simplify authentication and authorization for your app.

## Why use the built-in authentication?

You're not required to use this feature for authentication and authorization. You can use the bundled security features in your web framework of choice, or you can write your own utilities. However, you will need to ensure that your solution stays up to date with the latest security, protocol, and browser updates.

Implementing a secure solution for authentication (signing-in users) and authorization (providing access to secure data) can take significant effort. You must make sure to follow industry best practices and standards, and keep your implementation up to date. The built-in authentication feature for App Service and Azure Functions can save you time and effort by providing out-of-the-box authentication with federated identity providers, allowing you to focus on the rest of your application.

- Azure App Service allows you to integrate a variety of auth capabilities into your web app or API without implementing them yourself.
- It’s built directly into the platform and doesn’t require any particular language, SDK, security expertise, or even any code to utilize.
- You can integrate with multiple login providers. For example, Azure AD, Facebook, Google, Twitter.

Your app might need to support more complex scenarios such as Visual Studio integration or incremental consent.  There are several different authentication solutions available to support these scenarios. To learn more, read [Identity scenarios](identity-scenarios.md).

## Identity providers

App Service uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:

| Provider | Sign-in endpoint | How-To guidance |
| - | - | - |
| [Microsoft identity platform](../active-directory/fundamentals/active-directory-whatis.md) | `/.auth/login/aad` | [App Service Microsoft Identity Platform login](configure-authentication-provider-aad.md) |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` | [App Service Facebook login](configure-authentication-provider-facebook.md) |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` | [App Service Google login](configure-authentication-provider-google.md) |
| [Twitter](https://developer.twitter.com/en/docs/basics/authentication) | `/.auth/login/twitter` | [App Service Twitter login](configure-authentication-provider-twitter.md) |
| [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) | `/.auth/login/github` | [App Service GitHub login](configure-authentication-provider-github.md) |
| [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/) | `/.auth/login/apple` | [App Service Sign in With Apple login (Preview)](configure-authentication-provider-apple.md) |
| Any [OpenID Connect](https://openid.net/connect/) provider | `/.auth/login/<providerName>` | [App Service OpenID Connect login](configure-authentication-provider-openid-connect.md) |

When you configure this feature with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider. You can provide your users with any number of these sign-in options.

## Considerations for using built-in authentication

Enabling this feature will cause all requests to your application to be automatically redirected to HTTPS, regardless of the App Service configuration setting to enforce HTTPS. You can disable this with the  `requireHttps` setting in the V2 configuration. However, we do recommend sticking with HTTPS, and you should ensure no security tokens ever get transmitted over non-secure HTTP connections.

App Service can be used for authentication with or without restricting access to your site content and APIs. To restrict app access only to authenticated users, set **Action to take when request is not authenticated** to  log in with one of the configured identity providers. To authenticate but not restrict access, set **Action to take when request is not authenticated** to "Allow anonymous requests (no action)."

> [!IMPORTANT]
> You should give each app registration its own permission and consent. Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When testing new code, this practice can help prevent issues from affecting the production app.

## How it works

[Feature architecture](#feature-architecture)

[Authentication flow](#authentication-flow)

[Authorization behavior](#authorization-behavior)

[Token store](#token-store)

[Logging and tracing](#logging-and-tracing)

### Feature architecture

The authentication and authorization middleware component is a feature of the platform that runs on the same VM as your application. When it's enabled, every incoming HTTP request passes through it before being handled by your application.

:::image type="content" source="media/app-service-authentication-overview/architecture.png" alt-text="An architecture diagram showing requests being intercepted by a process in the site sandbox which interacts with identity providers before allowing traffic to the deployed site" lightbox="media/app-service-authentication-overview/architecture.png":::

The platform middleware handles several things for your app:

- Authenticates users and clients with the specified identity provider(s)
- Validates, stores, and refreshes OAuth tokens issued by the configured identity provider(s)
- Manages the authenticated session
- Injects identity information into HTTP request headers

The module runs separately from your application code and can be configured using Azure Resource Manager settings or using [a configuration file](configure-authentication-file-based.md). No SDKs, specific programming languages, or changes to your application code are required. 

#### Feature architecture on Windows (non-container deployment)

The authentication and authorization module runs as a native [IIS module](/iis/get-started/introduction-to-iis/iis-modules-overview) in the same sandbox as your application. When it's enabled, every incoming HTTP request passes through it before being handled by your application.

#### Feature architecture on Linux and containers

The authentication and authorization module runs in a separate container, isolated from your application code. Using what's known as the [Ambassador pattern](/azure/architecture/patterns/ambassador), it interacts with the incoming traffic to perform similar functionality as on Windows. Because it does not run in-process, no direct integration with specific language frameworks is possible; however, the relevant information that your app needs is passed through using request headers as explained below.

### Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

- Without provider SDK: The application delegates federated sign-in to App Service. This is typically the case with browser apps, which can present the provider's login page to the user. The server code manages the sign-in process, so it is also called _server-directed flow_ or _server flow_. This case applies to browser apps and mobile apps that use an embedded browser for authentication. 
- With provider SDK: The application signs users in to the provider manually and then submits the authentication token to App Service for validation. This is typically the case with browser-less apps, which can't present the provider's sign-in page to the user. The application code manages the sign-in process, so it is also called _client-directed flow_ or _client flow_. This case applies to REST APIs, [Azure Functions](../azure-functions/functions-overview.md), and JavaScript browser clients, as well as browser apps that need more flexibility in the sign-in process. It also applies to native mobile apps that sign users in using the provider's SDK.

Calls from a trusted browser app in App Service to another REST API in App Service or [Azure Functions](../azure-functions/functions-overview.md) can be authenticated using the server-directed flow. For more information, see [Customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md).

The table below shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign user in | Redirects client to `/.auth/login/<provider>`. | Client code signs user in directly with provider's SDK and receives an authentication token. For information, see the provider's documentation. |
| 2. Post-authentication | Provider redirects client to `/.auth/login/<provider>/callback`. | Client code [posts token from provider](configure-authentication-customize-sign-in-out.md#client-directed-sign-in) to `/.auth/login/<provider>` for validation. |
| 3. Establish authenticated session | App Service adds authenticated cookie to response. | App Service returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header. |

For client browsers, App Service can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app using their provider of choice.

<a name="authorization"></a>

### Authorization behavior

> [!IMPORTANT]
> By default, this feature only provides authentication, not authorization. Your application may still need to make authorization decisions, in addition to any checks you configure here.

In the [Azure portal](https://portal.azure.com), you can configure App Service with a number of behaviors when incoming request is not authenticated. The following headings describe the options.

**Allow unauthenticated requests**

This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, App Service also passes along authentication information in the HTTP headers.

This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](configure-authentication-customize-sign-in-out.md#use-multiple-sign-in-providers) to your users. However, you must write code.

**Require authentication**

This option will reject any unauthenticated traffic to your application. This rejection can be a redirect action to one of the configured identity providers. In these cases, a browser client is redirected to `/.auth/login/<provider>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`. You can also configure the rejection to be an `HTTP 401 Unauthorized` or `HTTP 403 Forbidden` for all requests.

With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](configure-authentication-user-identities.md)).

> [!CAUTION]
> Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

> [!NOTE]
> When using the Microsoft identity provider for users in your organization, the default behavior is that any user in your Azure AD tenant can request a token for your application. You can [configure the application in Azure AD](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users. App Service also offers some [basic built-in authorization checks](.\configure-authentication-provider-aad.md#authorize-requests) which can help with some validations. To learn more about authorization in the Microsoft identity platform, see [Microsoft identity platform authorization basics](../active-directory/develop/authorization-basics.md).

### Token store

App Service provides a built-in token store, which is a repository of tokens that are associated with the users of your web apps, APIs, or native mobile apps. When you enable authentication with any provider, this token store is immediately available to your app. If your application code needs to access data from these providers on the user's behalf, such as:

- post to the authenticated user's Facebook timeline
- read the user's corporate data using the Microsoft Graph API

You typically must write code to collect, store, and refresh these tokens in your application. With the token store, you just [retrieve the tokens](configure-authentication-oauth-tokens.md#retrieve-tokens-in-app-code) when you need them and [tell App Service to refresh them](configure-authentication-oauth-tokens.md#refresh-auth-tokens) when they become invalid. 

The ID tokens, access tokens, and refresh tokens are cached for the authenticated session, and they're accessible only by the associated user.  

If you don't need to work with tokens in your app, you can disable the token store in your app's **Authentication / Authorization** page.

### Logging and tracing

If you [enable application logging](troubleshoot-diagnostic-logs.md), you will see authentication and authorization traces directly in your log files. If you see an authentication error that you didn't expect, you can conveniently find all the details by looking in your existing application logs. If you enable [failed request tracing](troubleshoot-diagnostic-logs.md), you can see exactly what role the authentication and authorization module may have played in a failed request. In the trace logs, look for references to a module named `EasyAuthModule_32/64`.

### Considerations when using Azure Front Door

When using Azure App Service with Easy Auth behind Azure Front Door or other reverse proxies, a few additional things have to be taken into consideration.

1) Disable Caching for the authentication workflow

    See [Disable cache for auth workflow](../static-web-apps/front-door-manual.md#disable-cache-for-auth-workflow) to learn more on how to configure rules in Azure Front Door to disable caching for authentication and authorization-related pages.

2) Use the Front Door endpoint for redirects

    App Service is usually not accessible directly when exposed via Azure Front Door. This can be prevented, for example, by exposing App Service via Private Link in Azure Front Door Premium. To prevent the authentication workflow to redirect traffic back to App Service directly, it is important to configure the application to redirect back to `https://<front-door-endpoint>/.auth/login/<provider>/callback`.

3) Ensure that App Service is using the right redirect URI

    In some configurations, the App Service is using the App Service FQDN as the redirect URI instead of the Front Door FQDN. This will lead to an issue when the client is being redirected to App Service instead of Front Door. To change that, the `forwardProxy` setting needs to be set to `Standard` to make App Service respect the `X-Forwarded-Host` header set by Azure Front Door.
    
    Other reverse proxies like Azure Application Gateway or 3rd-party products might use different headers and need a different forwardProxy setting.
    
    This configuration cannot be done via the Azure portal today and needs to be done via `az rest`:
    
    **Export settings**
    
    `az rest --uri /subscriptions/REPLACE-ME-SUBSCRIPTIONID/resourceGroups/REPLACE-ME-RESOURCEGROUP/providers/Microsoft.Web/sites/REPLACE-ME-APPNAME/config/authsettingsV2?api-version=2020-09-01 --method get > auth.json`
    
    **Update settings**
    
    Search for 
    ```json
    "httpSettings": {
      "forwardProxy": {
        "convention": "Standard"
      }
    }
    ```
    and ensure that `convention` is set to `Standard` to respect the `X-Forwarded-Host` header used by Azure Front Door.
    
    **Import settings**
    
    `az rest --uri /subscriptions/REPLACE-ME-SUBSCRIPTIONID/resourceGroups/REPLACE-ME-RESOURCEGROUP/providers/Microsoft.Web/sites/REPLACE-ME-APPNAME/config/authsettingsV2?api-version=2020-09-01 --method put --body @auth.json`
    
## More resources

- [How-To: Configure your App Service or Azure Functions app to use Azure AD login](configure-authentication-provider-aad.md)
- [Customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md)
<!-- - [Authenticate native client apps](configure-authentication-client-apps.md) -->
- [Work with OAuth tokens and sessions](configure-authentication-oauth-tokens.md)
- [Access user and application claims](configure-authentication-user-identities.md)
- [File-based configuration](configure-authentication-file-based.md)

Samples:
- [Tutorial: Add authentication to your web app running on Azure App Service](scenario-secure-app-authentication-app-service.md)
- [Tutorial: Authenticate and authorize users end-to-end in Azure App Service (Windows or Linux)](tutorial-auth-aad.md)
- [.NET Core integration of Azure AppService EasyAuth (3rd party)](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth)
- [Getting Azure App Service authentication working with .NET Core (3rd party)](https://github.com/kirkone/KK.AspNetCore.EasyAuthAuthentication)
