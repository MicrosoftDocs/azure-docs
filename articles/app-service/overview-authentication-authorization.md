---
title: Authentication and Authorization
description: Learn about the built-in authentication and authorization support in Azure App Service and Azure Functions, and how it can help secure your app.
ms.assetid: b7151b57-09e5-4c77-a10c-375a262f17e5
ms.topic: conceptual
ms.date: 03/28/2025
ms.update-cycle: 1095-days
ms.reviewer: mahender
ms.custom: UpdateFrequency3, fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to user Easy Auth to simplify authentication and authorization for my apps in Azure App Service.
---
# Authentication and authorization in Azure App Service and Azure Functions

Azure App Service provides built-in authentication (signing in users) and authorization (providing access to secure data) capabilities. These capabilities are sometimes called *Easy Auth*. You can use them to sign in users and access data by writing little or no code in your web app, RESTful API, mobile server, and [functions](../azure-functions/functions-overview.md).

This article describes how App Service helps simplify authentication and authorization for your app.

## Reasons to use built-in authentication

To implement authentication and authorization, you can use the bundled security features in your web framework of choice, or you can write your own tools. Implementing a secure solution for authentication and authorization can take significant effort. You need to follow industry best practices and standards. You also need to ensure that your solution stays up to date with the latest security, protocol, and browser updates.

The built-in capabilities of App Service and Azure Functions can save you time and effort by providing out-of-the-box authentication with federated identity providers, so you can focus on the rest of your application.

With App Service, you can integrate authentication capabilities into your web app or API without implementing them yourself. This feature is built directly into the platform and doesn't require any particular language, SDK, security expertise, or code. You can integrate it with multiple sign-in providers, such as Microsoft Entra, Facebook, Google, and X.

Your app might need to support more complex scenarios, such as Visual Studio integration or incremental consent. Several authentication solutions are available to support these scenarios. To learn more, see [Authentication scenarios and recommendations](identity-scenarios.md).

## Identity providers

App Service uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity). A Microsoft or non-Microsoft identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:

| Provider | Sign-in endpoint | How-to guidance |
|:- |:- |:- |
| [Microsoft Entra](/entra/index) | `/.auth/login/aad` | [App Service Microsoft Entra platform sign-in](configure-authentication-provider-aad.md) |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` | [App Service Facebook sign-in](configure-authentication-provider-facebook.md) |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` | [App Service Google sign-in](configure-authentication-provider-google.md) |
| [X](https://developer.x.com/en/docs/basics/authentication) | `/.auth/login/x` | [App Service X sign-in](configure-authentication-provider-twitter.md) |
| [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) | `/.auth/login/github` | [App Service GitHub sign-in](configure-authentication-provider-github.md) |
| [Apple](https://developer.apple.com/sign-in-with-apple/) | `/.auth/login/apple` | [App Service sign-in via Apple sign-in (preview)](configure-authentication-provider-apple.md) |
| Any [OpenID Connect](https://openid.net/connect/) provider | `/.auth/login/<providerName>` | [App Service OpenID Connect sign-in](configure-authentication-provider-openid-connect.md) |

When you configure this feature with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider. You can provide your users with any number of these sign-in options.

## Considerations for using built-in authentication

Enabling built-in authentication causes all requests to your application to be automatically redirected to HTTPS, regardless of the App Service configuration setting to enforce HTTPS. You can disable this automatic redirection by using the `requireHttps` setting in the V2 configuration. However, we recommend that you keep using HTTPS and ensure that no security tokens are ever transmitted over nonsecure HTTP connections.

You can use App Service for authentication with or without restricting access to your site content and APIs. Set access restrictions in the **Settings** > **Authentication** > **Authentication settings** section of your web app:

- To restrict app access to only authenticated users, set **Action to take when request is not authenticated** to sign in with one of the configured identity providers.
- To authenticate but not restrict access, set **Action to take when request is not authenticated** to **Allow anonymous requests (no action)**.

> [!IMPORTANT]
> You should give each app registration its own permission and consent. Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When you're testing new code, this practice can help prevent problems from affecting the production app.

## How it works

### Feature architecture

The authentication and authorization middleware component is a feature of the platform that runs on the same virtual machine as your application. When you enable it, every incoming HTTP request passes through that component before your application handles it.

:::image type="content" source="media/app-service-authentication-overview/architecture.png" alt-text="Architecture diagram that shows a process in the site sandbox interacting with identity providers before allowing traffic to the deployed site." lightbox="media/app-service-authentication-overview/architecture.png":::

The platform middleware handles several things for your app:

- Authenticates users and clients with the specified identity providers
- Validates, stores, and refreshes OAuth tokens that the configured identity providers issued
- Manages the authenticated session
- Injects identity information into HTTP request headers

The module runs separately from your application code. You can configure it by using Azure Resource Manager settings or by using [a configuration file](configure-authentication-file-based.md). No SDKs, specific programming languages, or changes to your application code are required.

#### Feature architecture on Windows (non-container deployment)

The authentication and authorization module runs as a native [IIS module](/iis/get-started/introduction-to-iis/iis-modules-overview) in the same sandbox as your application. When you enable it, every incoming HTTP request passes through it before your application handles it.

#### Feature architecture on Linux and containers

The authentication and authorization module runs in a separate container that's isolated from your application code. The module uses the [Ambassador pattern](/azure/architecture/patterns/ambassador) to interact with the incoming traffic to perform similar functionality as on Windows. Because it doesn't run in process, no direct integration with specific language frameworks is possible. However, the relevant information that your app needs is passed through in request headers.

### Authentication flow

The authentication flow is the same for all providers. It differs depending on whether you want to sign in with the provider's SDK:

- **Without provider SDK**: The application delegates federated sign-in to App Service. This delegation is typically the case with browser apps, which can present the provider's sign-in page to the user. The server code manages the sign-in process, so it's also called *server-directed flow* or *server flow*.

  This case applies to browser apps and mobile apps that use an embedded browser for authentication.

- **With provider SDK**: The application signs in users to the provider manually. Then it submits the authentication token to App Service for validation. This process is typically the case with browserless apps, which can't present the provider's sign-in page to the user. The application code manages the sign-in process, so it's also called *client-directed flow* or *client flow*.

  This case applies to REST APIs, [Azure Functions](../azure-functions/functions-overview.md), and JavaScript browser clients, in addition to browser apps that need more flexibility in the sign-in process. It also applies to native mobile apps that sign in users by using the provider's SDK.

Calls from a trusted browser app in App Service to another REST API in App Service or [Azure Functions](../azure-functions/functions-overview.md) can be authenticated through the server-directed flow. For more information, see [Customize sign-in and sign-out in Azure App Service authentication](configure-authentication-customize-sign-in-out.md).

The following table shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign in the user | Provider redirects the client to `/.auth/login/<provider>`. | Client code signs in the user directly with the provider's SDK and receives an authentication token. For more information, see the provider's documentation. |
| 2. Conduct post-authentication | Provider redirects the client to `/.auth/login/<provider>/callback`. | Client code [posts the token from the provider](configure-authentication-customize-sign-in-out.md#client-directed-sign-in) to `/.auth/login/<provider>` for validation. |
| 3. Establish an authenticated session | App Service adds an authenticated cookie to the response. | App Service returns its own authentication token to the client code. |
| 4. Serve authenticated content | Client includes an authentication cookie in subsequent requests (automatically handled by the browser). | Client code presents the authentication token in the `X-ZUMO-AUTH` header. |

For client browsers, App Service can automatically direct all unauthenticated users to `/.auth/login/<provider>`. You can also present users with one or more `/.auth/login/<provider>` links to sign in to your app by using their provider of choice.

<a name="authorization"></a>

### Authorization behavior

In the [Azure portal](https://portal.azure.com), you can configure App Service with various behaviors when an incoming request isn't authenticated. The following sections describe the options.

> [!IMPORTANT]
> By default, this feature provides only authentication, not authorization. Your application might still need to make authorization decisions, in addition to any checks that you configure here.

#### Restricted access

- **Allow unauthenticated requests**: This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, App Service also passes along authentication information in the HTTP headers.

  This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](configure-authentication-customize-sign-in-out.md#use-multiple-sign-in-providers) to your users. However, you must write code.

- **Require authentication**: This option rejects any unauthenticated traffic to your application. Specific action to take is specified in the [Unauthenticated requests](#unauthenticated-requests) section later in this article.

  With this option, you don't need to write any authentication code in your app. You can handle finer authorization, such as role-specific authorization, by [inspecting the user's claims](configure-authentication-user-identities.md).

  > [!CAUTION]
  > Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications. If exceptions are needed, you need to [configure excluded paths in a configuration-file](configure-authentication-file-based.md).

  > [!NOTE]
  > When using the Microsoft identity provider for users in your organization, the default behavior is that any user in your Microsoft Entra tenant can request a token for your application. You can [configure the application in Microsoft Entra](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users. App Service also offers some [basic built-in authorization checks](.\configure-authentication-provider-aad.md#authorize-requests) which can help with some validations. To learn more about authorization in Microsoft Entra, see [Microsoft Entra authorization basics](../active-directory/develop/authorization-basics.md).


When you're using the Microsoft identity provider for users in your organization, the default behavior is that any user in your Microsoft Entra tenant can request a token for your application. You can [configure the application in Microsoft Entra](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users. App Service also offers some [basic built-in authorization checks](.\configure-authentication-provider-aad.md#authorize-requests) that can help with some validations. To learn more about authorization in Microsoft Entra, see [Microsoft Entra authorization basics](../active-directory/develop/authorization-basics.md).

#### Unauthenticated requests

- **HTTP 302 Found redirect: recommended for websites**: Redirects action to one of the configured identity providers. In these cases, a browser client is redirected to `/.auth/login/<provider>` for the provider that you choose.
- **HTTP 401 Unauthorized: recommended for APIs**: Returns an `HTTP 401 Unauthorized` response if the anonymous request comes from a native mobile app. You can also configure the rejection to be `HTTP 401 Unauthorized` for all requests.
- **HTTP 403 Forbidden**: Configures the rejection to be `HTTP 403 Forbidden` for all requests.
- **HTTP 404 Not found**: Configures the rejection to be `HTTP 404 Not found` for all requests.

### Token store

App Service provides a built-in token store. A token store is a repository of tokens that are associated with the users of your web apps, APIs, or native mobile apps. When you enable authentication with any provider, this token store is immediately available to your app.

If your application code needs to access data from these providers on the user's behalf, you typically must write code to collect, store, and refresh these tokens in your application. Actions might include:

- Post to the authenticated user's Facebook timeline.
- Read the user's corporate data by using the Microsoft Graph API.

With the token store, you just [retrieve the tokens](configure-authentication-oauth-tokens.md#retrieve-tokens-in-app-code) when you need them and [tell App Service to refresh them](configure-authentication-oauth-tokens.md#refresh-auth-tokens) when they become invalid.

The ID tokens, access tokens, and refresh tokens are cached for the authenticated session. Only the associated user can access them.

If you don't need to work with tokens in your app, you can disable the token store on your app's **Settings** > **Authentication** page.

### Logging and tracing

If you [enable application logging](troubleshoot-diagnostic-logs.md), authentication and authorization traces appear directly in your log files. If you see an authentication error that you didn't expect, you can conveniently find all the details by looking in your existing application logs.

If you enable [failed request tracing](troubleshoot-diagnostic-logs.md), you can see exactly what role the authentication and authorization module might play in a failed request. In the trace logs, look for references to a module named `EasyAuthModule_32/64`.

### Mitigation of cross-site request forgery

App Service authentication mitigates cross-site request forgery by inspecting client requests for the following conditions:

- It's a `POST` request that authenticated through a session cookie.
- The request came from a known browser, as determined by the HTTP `User-Agent` header.
- The HTTP `Origin` or HTTP `Referer` header is missing or isn't in the configured list of approved external domains for redirection.
- The HTTP `Origin` header is missing or isn't in the configured list of cross-origin resource sharing (CORS) origins.

When a request fulfills all these conditions, App Service authentication automatically rejects it. You can work around this mitigation logic by adding your external domain to the redirect list in **Settings** > **Authentication** > **Edit authentication settings** > **Allowed external redirect URLs**.

## Considerations for using Azure Front Door

When you're using Azure App Service with authentication behind Azure Front Door or other reverse proxies, consider the following actions.

### Disable Azure Front Door caching

Disable [Azure Front Door caching](../frontdoor/front-door-caching.md) for the authentication workflow.

### Use the Azure Front Door endpoint for redirects

App Service is usually not accessible directly when it's exposed by Azure Front Door. You can prevent this behavior, for example, by exposing App Service by using Azure Private Link in Azure Front Door Premium. To prevent the authentication workflow from redirecting traffic back to App Service directly. For more information, see [Redirect URI](/entra/identity-platform/reply-url).

### Ensure that App Service is using the right redirect URI

In some configurations, App Service uses its fully qualified domain name (FQDN) as the redirect URI, instead of the Azure Front Door FQDN. This configuration causes a problem when the client is redirected to App Service instead of Azure Front Door. To change it, set `forwardProxy` to `Standard` to make App Service respect the `X-Forwarded-Host` header that Azure Front Door set.

Other reverse proxies, like Azure Application Gateway or non-Microsoft products, might use different headers and need a different `forwardProxy` setting.

You can't change the `forwardProxy` configuration by using the Azure portal. You need to use `az rest`.

#### Export settings

```bash
az rest --uri /subscriptions/REPLACE-ME-SUBSCRIPTIONID/resourceGroups/REPLACE-ME-RESOURCEGROUP/providers/Microsoft.Web/sites/REPLACE-ME-APPNAME/config/authsettingsV2?api-version=2020-09-01 --method get > auth.json
```

#### Update settings

Search for:

```json
"httpSettings": {
  "forwardProxy": {
    "convention": "Standard"
  }
}
```

Ensure that `convention` is set to `Standard` to respect the `X-Forwarded-Host` header that Azure Front Door uses.

#### Import settings

```bash
az rest --uri /subscriptions/REPLACE-ME-SUBSCRIPTIONID/resourceGroups/REPLACE-ME-RESOURCEGROUP/providers/Microsoft.Web/sites/REPLACE-ME-APPNAME/config/authsettingsV2?api-version=2020-09-01 --method put --body @auth.json
```

## Related content

For more information about App Service authentication, see:

- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](configure-authentication-provider-aad.md)
- [Customize sign-in and sign-out in Azure App Service authentication](configure-authentication-customize-sign-in-out.md)
- [Work with OAuth tokens in Azure App Service authentication](configure-authentication-oauth-tokens.md)
- [Work with user identities in Azure App Service authentication](configure-authentication-user-identities.md)
- [File-based configuration in Azure App Service authentication](configure-authentication-file-based.md)

For samples, see:

- [Quickstart: Add app authentication to your web app running on Azure App Service](scenario-secure-app-authentication-app-service.md)
- [Tutorial: Authenticate and authorize users end to end in Azure App Service](tutorial-auth-aad.md)
- [.NET Core integration of Azure AppService Easy Auth](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth) (non-Microsoft GitHub content)
- [Getting Azure App Service authentication working with .NET Core](https://github.com/kirkone/KK.AspNetCore.EasyAuthAuthentication) (non-Microsoft GitHub content)
