---
title: Authentication and authorization in Azure Container Apps
description: Use built-in authentication in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 04/20/2022
ms.author: cshoe
---

# Authentication and authorization in Azure Container Apps

Azure Container Apps provides built-in authentication and authorization features (sometimes referred to as "Easy Auth"), to secure your external ingress-enabled container app with minimal or no code.

For details surrounding authentication and authorization, refer to the following guides for your choice of provider.

* [Azure Active Directory](authentication-azure-active-directory.md)
* [Facebook](authentication-facebook.md)
* [GitHub](authentication-github.md)
* [Google](authentication-google.md)
* [Twitter](authentication-twitter.md)
* [Custom OpenID Connect](authentication-openid.md)

## Why use the built-in authentication?

You're not required to use this feature for authentication and authorization. You can use the bundled security features in your web framework of choice, or you can write your own utilities. However, implementing a secure solution for authentication (signing-in users) and authorization (providing access to secure data) can take significant effort. You must make sure to follow industry best practices and standards, and keep your implementation up to date.

The built-in authentication feature for Container Apps can save you time and effort by providing out-of-the-box authentication with federated identity providers, allowing you to focus on the rest of your application.

* Azure Container Apps provides access to various built-in authentication providers.
* The built-in auth features don’t require any particular language, SDK, security expertise, or even any code that you have to write.
* You can integrate with multiple providers including Azure Active Directory, Facebook, Google, and Twitter.

## Identity providers

Container Apps uses [federated identity](https://en.wikipedia.org/wiki/Federated_identity), in which a third-party identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:

| Provider | Sign-in endpoint | How-To guidance |
| - | - | - |
| [Microsoft Identity Platform](../active-directory/fundamentals/active-directory-whatis.md) | `/.auth/login/aad` | [Microsoft Identity Platform](authentication-azure-active-directory.md) |
| [Facebook](https://developers.facebook.com/docs/facebook-login) | `/.auth/login/facebook` | [Facebook](authentication-facebook.md) |
| [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps) | `/.auth/login/github` | [GitHub](authentication-github.md) |
| [Google](https://developers.google.com/identity/choose-auth) | `/.auth/login/google` | [Google](authentication-google.md) |
| [Twitter](https://developer.twitter.com/en/docs/basics/authentication) | `/.auth/login/twitter` | [Twitter](authentication-twitter.md) |
| Any [OpenID Connect](https://openid.net/connect/) provider | `/.auth/login/<providerName>` | [OpenID Connect](authentication-openid.md) |

When you use one of these providers, the sign-in endpoint is available for user authentication and authentication token validation from the provider. You can provide your users with any number of these provider options.

## Considerations for using built-in authentication

This feature should be used with HTTPS only. Ensure `allowInsecure` is disabled on your container app's ingress configuration.

You can configure your container app for authentication with or without restricting access to your site content and APIs. To restrict app access only to authenticated users, set its *Restrict access* setting to **Require authentication**. To authenticate but not restrict access, set its *Restrict access* setting to **Allow unauthenticated access**.

Each container app issues its own unique cookie or token for authentication. A client cannot use the same cookie or token provided by one container app to authenticate with another container app, even within the same container app environment.

## Feature architecture
 
The authentication and authorization middleware component is a feature of the platform that runs as a sidecar container on each replica in your application. When enabled, every incoming HTTP request passes through the security layer before being handled by your application.

:::image type="content" source="media/authentication/architecture.png" alt-text="An architecture diagram showing requests being intercepted by a sidecar container which interacts with identity providers before allowing traffic to the app container" lightbox="media/authentication/architecture.png":::

The platform middleware handles several things for your app:

* Authenticates users and clients with the specified identity provider(s)
* Manages the authenticated session
* Injects identity information into HTTP request headers

The authentication and authorization module runs in a separate container, isolated from your application code. As the security container doesn't run in-process, no direct integration with specific language frameworks is possible. However, relevant information your app needs is provided in request headers as explained below.

### Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

* **Without provider SDK** (_server-directed flow_ or _server flow_): The application delegates federated sign-in to Container Apps. Delegation is typically the case with browser apps, which presents the provider's sign-in page to the user.

* **With provider SDK** (_client-directed flow_ or _client flow_): The application signs users in to the provider manually and then submits the authentication token to Container Apps for validation. This approach is typical for browser-less apps that don't present the provider's sign-in page to the user. An example is a native mobile app that signs users in using the provider's SDK.

Calls from a trusted browser app in Container Apps to another REST API in Container Apps can be authenticated using the server-directed flow. For more information, see [Customize sign-ins and sign-outs](#customize-sign-in-and-sign-out).

The table below shows the steps of the authentication flow.

| Step | Without provider SDK | With provider SDK |
| - | - | - |
| 1. Sign user in | Redirects client to `/.auth/login/<PROVIDER>`. | Client code signs user in directly with provider's SDK and receives an authentication token. For information, see the provider's documentation. |
| 2. Post-authentication | Provider redirects client to `/.auth/login/<PROVIDER>/callback`. | Client code [posts token from provider](#client-directed-sign-in) to `/.auth/login/<PROVIDER>` for validation. |
| 3. Establish authenticated session | Container Apps adds authenticated cookie to response. | Container Apps returns its own authentication token to client code. |
| 4. Serve authenticated content | Client includes authentication cookie in subsequent requests (automatically handled by browser). | Client code presents authentication token in `X-ZUMO-AUTH` header. |

For client browsers, Container Apps can automatically direct all unauthenticated users to `/.auth/login/<PROVIDER>`. You can also present users with one or more `/.auth/login/<PROVIDER>` links to sign in to your app using their provider of choice.

### <a name="authorization"></a>Authorization behavior

In the [Azure portal](https://portal.azure.com), you can edit your container app's authentication settings to configure it with various behaviors when an incoming request isn't authenticated. The following headings describe the options.

* **Allow unauthenticated access**:  This option defers authorization of unauthenticated traffic to your application code. For authenticated requests, Container Apps also passes along authentication information in the HTTP headers. Your app can use information in the headers to make authorization decisions for a request.

  This option provides more flexibility in handling anonymous requests. For example, it lets you [present multiple sign-in providers](#use-multiple-sign-in-providers) to your users. However, you must write code.

* **Require authentication**: This option rejects any unauthenticated traffic to your application. This rejection can be a redirect action to one of the configured identity providers. In these cases, a browser client is redirected to `/.auth/login/<PROVIDER>` for the provider you choose. If the anonymous request comes from a native mobile app, the returned response is an `HTTP 401 Unauthorized`. You can also configure the rejection to be an `HTTP 401 Unauthorized` or `HTTP 403 Forbidden` for all requests.

  With this option, you don't need to write any authentication code in your app. Finer authorization, such as role-specific authorization, can be handled by inspecting the user's claims (see [Access user claims](#access-user-claims-in-application-code)).

  > [!CAUTION]
  > Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications.

  > [!NOTE]
  > By default, any user in your Azure AD tenant can request a token for your application from Azure AD. You can [configure the application in Azure AD](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md) if you want to restrict access to your app to a defined set of users.

## Customize sign-in and sign-out

Container Apps Authentication provides built-in endpoints for sign-in and sign-out. When the feature is enabled, these endpoints are available under the `/.auth` route prefix on your container app.

### Use multiple sign-in providers

The portal configuration doesn't offer a turn-key way to present multiple sign-in providers to your users (such as both Facebook and Twitter). However, it isn't difficult to add the functionality to your app. The steps are outlined as follows:

First, in the **Authentication / Authorization** page in the Azure portal, configure each of the identity provider you want to enable.

In **Action to take when request is not authenticated**, select **Allow Anonymous requests (no action)**.

In the sign-in page, or the navigation bar, or any other location of your app, add a sign-in link to each of the providers you enabled (`/.auth/login/<provider>`). For example:

```html
<a href="/.auth/login/aad">Log in with the Microsoft Identity Platform</a>
<a href="/.auth/login/facebook">Log in with Facebook</a>
<a href="/.auth/login/google">Log in with Google</a>
<a href="/.auth/login/twitter">Log in with Twitter</a>
```

When the user selects on one of the links, the UI for the respective providers is displayed to the user.

To redirect the user post-sign-in to a custom URL, use the `post_login_redirect_uri` query string parameter (not to be confused with the Redirect URI in your identity provider configuration). For example, to navigate the user to `/Home/Index` after sign-in, use the following HTML code:

```html
<a href="/.auth/login/<provider>?post_login_redirect_uri=/Home/Index">Log in</a>
```

### Client-directed sign-in

In a client-directed sign-in, the application signs in the user to the identity provider using a provider-specific SDK. The application code then submits the resulting authentication token to Container Apps for validation (see [Authentication flow](authentication.md#authentication-flow)) using an HTTP POST request.

To validate the provider token, container app must first be configured with the desired provider. At runtime, after you retrieve the authentication token from your provider, post the token to `/.auth/login/<provider>` for validation. For example:

```console
POST https://<hostname>.azurecontainerapps.io/.auth/login/aad HTTP/1.1
Content-Type: application/json

{"id_token":"<token>","access_token":"<token>"}
```

The token format varies slightly according to the provider. See the following table for details:

| Provider value | Required in request body | Comments |
|-|-|-|
| `aad` | `{"access_token":"<ACCESS_TOKEN>"}` | The `id_token`, `refresh_token`, and `expires_in` properties are optional. |
| `microsoftaccount` | `{"access_token":"<ACCESS_TOKEN>"}` or `{"authentication_token": "<TOKEN>"`| `authentication_token` is preferred over `access_token`. The `expires_in` property is optional. <br/> When requesting the token from Live services, always request the `wl.basic` scope. |
| `google` | `{"id_token":"<ID_TOKEN>"}` | The `authorization_code` property is optional. Providing an `authorization_code` value will add an access token and a refresh token to the token store. When specified, `authorization_code` can also optionally be accompanied by a `redirect_uri` property. |
| `facebook`| `{"access_token":"<USER_ACCESS_TOKEN>"}` | Use a valid [user access token](https://developers.facebook.com/docs/facebook-login/access-tokens) from Facebook. |
| `twitter` | `{"access_token":"<ACCESS_TOKEN>", "access_token_secret":"<ACCES_TOKEN_SECRET>"}` | |
| | | |

If the provider token is validated successfully, the API returns with an `authenticationToken` in the response body, which is your session token. 

```json
{
    "authenticationToken": "...",
    "user": {
        "userId": "sid:..."
    }
}
```

Once you have this session token, you can access protected app resources by adding the `X-ZUMO-AUTH` header to your HTTP requests. For example:

```console
GET https://<hostname>.azurecontainerapps.io/api/products/1
X-ZUMO-AUTH: <authenticationToken_value>
```

### Sign out of a session

Users can initiate a sign-out by sending a `GET` request to the app's `/.auth/logout` endpoint. The `GET` request conducts the following actions:

* Clears authentication cookies from the current session.
* Deletes the current user's tokens from the token store.
* For Azure Active Directory and Google, performs a server-side sign-out on the identity provider.

Here's a simple sign-out link in a webpage:

```html
<a href="/.auth/logout">Sign out</a>
```

By default, a successful sign-out redirects the client to the URL `/.auth/logout/done`. You can change the post-sign-out redirect page by adding the `post_logout_redirect_uri` query parameter. For example:

```console
GET /.auth/logout?post_logout_redirect_uri=/index.html
```

It's recommended that you [encode](https://wikipedia.org/wiki/Percent-encoding) the value of `post_logout_redirect_uri`.

URL must be hosted in the same domain when using fully qualified URLs.

## Access user claims in application code

For all language frameworks, Container Apps makes the claims in the incoming token available to your application code. The claims are injected into the request headers, which are present whether from an authenticated end user or a client application. External requests aren't allowed to set these headers, so they're present only if set by Container Apps. Some example headers include:

* `X-MS-CLIENT-PRINCIPAL-NAME`
* `X-MS-CLIENT-PRINCIPAL-ID`

Code that is written in any language or framework can get the information that it needs from these headers.

> [!NOTE]
> Different language frameworks may present these headers to the app code in different formats, such as lowercase or title case.

## Next steps

Refer to the following articles for details on securing your container app.

* [Azure Active Directory](authentication-azure-active-directory.md)
* [Facebook](authentication-facebook.md)
* [GitHub](authentication-github.md)
* [Google](authentication-google.md)
* [Twitter](authentication-twitter.md)
* [Custom OpenID Connect](authentication-openid.md)
