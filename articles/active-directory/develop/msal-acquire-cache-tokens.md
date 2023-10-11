---
title: Acquire and cache tokens with Microsoft Authentication Library (MSAL)
description: Learn about acquiring and caching tokens using MSAL.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/27/2023
ms.author: cwerner
ms.reviewer: saeeda
ms.custom: aaddev, has-adal-ref, engagement-fy23
#Customer intent: As an application developer, I want to learn about acquiring and caching tokens so my app can support authentication and authorization.
---

# Acquire and cache tokens using the Microsoft Authentication Library (MSAL)

[Access tokens](access-tokens.md) enable clients to securely call web APIs protected by Azure. There are several ways to acquire a token by using the Microsoft Authentication Library (MSAL). Some require user interaction through a web browser, while others don't require user interaction. In general, the method used for acquiring a token depends on whether the application is a public client application like desktop or mobile app, or a confidential client application like web app, web API, or daemon application.

MSAL caches a token after it's been acquired. Your application code should first try to get a token silently from the cache before attempting to acquire a token by other means.

You can also clear the token cache, which is achieved by removing the accounts from the cache. This doesn't remove the session cookie that's in the browser, however.

## Scopes when acquiring tokens

[Scopes](./permissions-consent-overview.md) are the permissions that a web API exposes that client applications can request access to. Client applications request the user's consent for these scopes when making authentication requests to get tokens to access the web APIs. MSAL allows you to get tokens to access Azure Active Directory (Azure AD) for developers (v1.0) and the Microsoft identity platform APIs. The v2.0 protocol uses scopes instead of resource in the requests. Based on the web API's configuration of the token version it accepts, the v2.0 endpoint returns the access token to MSAL.

Several of MSAL's token acquisition methods require a `scopes` parameter. The `scopes` parameter is a list of strings that declare the desired permissions and the resources requested. Well-known scopes are the [Microsoft Graph permissions](/graph/permissions-reference).

It's also possible in MSAL to access v1.0 resources. For more information, see [Scopes for a v1.0 application](msal-v1-app-scopes.md).

### Request scopes for a web API

When your application needs to request an access token with specific permissions for a resource API, pass the scopes containing the app ID URI of the API in the format `<app ID URI>/<scope>`.

Some example scope values for different resources:

- Microsoft Graph API: `https://graph.microsoft.com/User.Read`
- Custom web API: `api://11111111-1111-1111-1111-111111111111/api.read`

The format of the scope value varies depending on the resource (the API) receiving the access token and the `aud` claim values it accepts.

For Microsoft Graph only, the `user.read` scope maps to `https://graph.microsoft.com/User.Read`, and both scope formats can be used interchangeably.

Certain web APIs such as the Azure Resource Manager API (`https://management.core.windows.net/`) expect a trailing forward slash (`/`) in the audience claim (`aud`) of the access token. In this case, pass the scope as `https://management.core.windows.net//user_impersonation`, including the double forward slash (`//`).

Other APIs might require that *no scheme or host* is included in the scope value, and expect only the app ID (a GUID) and the scope name, for example:

`11111111-1111-1111-1111-111111111111/api.read`

> [!TIP]
> If the downstream resource is not under your control, you might need to try different scope value formats (for example with/without scheme and host) if you receive `401` or other errors when passing the access token to the resource.

### Request dynamic scopes for incremental consent

As the features provided by your application or its requirements change, you can request additional permissions as needed by using the scope parameter. Such *dynamic scopes* allow your users to provide incremental consent to scopes.

For example, you might sign in the user but initially deny them access to any resources. Later, you can give them the ability to view their calendar by requesting the calendar scope in the acquire token method and obtaining the user's consent to do so. For example, by requesting the `https://graph.microsoft.com/User.Read` and `https://graph.microsoft.com/Calendar.Read` scopes.

## Acquiring tokens silently (from the cache)

MSAL maintains a token cache (or two caches for confidential client applications) and caches a token after it's been acquired. In many cases, attempting to silently get a token will acquire another token with more scopes based on a token in the cache. It's also capable of refreshing a token when it's getting close to expiration (as the token cache also contains a refresh token).

### Recommended call pattern for public client applications

Application source code should first try to get a token silently from the cache. If the method call returns a "UI required" error or exception, try acquiring a token by other means.

There are two flows, however, in which you **should not** attempt to silently acquire a token:

- [Client credentials flow](msal-authentication-flows.md#client-credentials), which does not use the user token cache but an application token cache. This method takes care of verifying the application token cache before sending a request to the security token service (STS).
- [Authorization code flow](msal-authentication-flows.md#authorization-code) in web apps, as it redeems a code that the application obtained by signing in the user and having them consent to more scopes. Since a code and not an account is passed as a parameter, the method can't look in the cache before redeeming the code, which invokes a call to the service.

### Recommended call pattern in web apps using the authorization code flow

For Web applications that use the [OpenID Connect authorization code flow](v2-protocols-oidc.md), the recommended pattern in the controllers is to:

- Instantiate a confidential client application with a token cache with customized serialization.
- Acquire the token using the authorization code flow

## Acquiring tokens

Generally, the method of acquiring a token depends on whether it's a public client or confidential client application.

### Public client applications

In public client applications like desktop and mobile apps, you can:

- Get tokens interactively by having the user sign in through a UI or pop-up window.
- Get a token silently for the signed-in user using [integrated Windows authentication](msal-authentication-flows.md#integrated-windows-authentication-iwa) (IWA/Kerberos) if the desktop application is running on a Windows computer joined to a domain or to Azure.
- Get a token with a [username and password](msal-authentication-flows.md#usernamepassword-ropc) in .NET framework desktop client applications (not recommended). Do not use username/password in confidential client applications.
- Get a token through the [device code flow](msal-authentication-flows.md#device-code) in applications running on devices that don't have a web browser. The user is provided with a URL and a code, who then goes to a web browser on another device and enters the code and signs in. Microsoft Entra ID then sends a token back to the browser-less device.

### Confidential client applications

For confidential client applications (web app, web API, or a daemon application like a Windows service), you can;

- Acquire tokens **for the application itself** and not for a user, using the [client credentials flow](msal-authentication-flows.md#client-credentials). This technique can be used for syncing tools, or tools that process users in general and not a specific user.
- Use the [on-behalf-of (OBO) flow](msal-authentication-flows.md#on-behalf-of-obo) for a web API to call an API on behalf of the user. The application is identified with client credentials in order to acquire a token based on a user assertion (SAML, for example, or a JWT token). This flow is used by applications that need to access resources of a particular user in service-to-service calls.
- Acquire tokens using the [authorization code flow](msal-authentication-flows.md#authorization-code) in web apps after the user signs in through the authorization request URL. OpenID Connect application typically use this mechanism, which lets the user sign in using OpenID Connect and then access web APIs on behalf of the user.

## Authentication results

When your client requests an access token, Microsoft Entra ID also returns an authentication result that includes metadata about the access token. This information includes the expiry time of the access token and the scopes for which it's valid. This data allows your app to do intelligent caching of access tokens without having to parse the access token itself. The authentication result exposes:

- The [access token](access-tokens.md) for the web API to access resources. This string is usually a Base64-encoded JWT, but the client should never look inside the access token. The format isn't guaranteed to remain stable, and it can be encrypted for the resource. People writing code depending on access token content on the client is one of the most common sources of errors and client logic breakage.
- The [ID token](id-tokens.md) for the user (a JWT).
- The token expiration, which tells the date/time when the token expires.
- The tenant ID contains the tenant in which the user was found. For guest users (Microsoft Entra B2B scenarios), the tenant ID is the guest tenant, not the unique tenant. When the token is delivered in the name of a user, the authentication result also contains information about this user. For confidential client flows where tokens are requested with no user (for the application), this user information is null.
- The scopes for which the token was issued.
- The unique ID for the user.

## (Advanced) Accessing the user's cached tokens in background apps and services

[!INCLUDE [advanced-token-caching](../../../includes/advanced-token-cache.md)]

## Next steps

Several of the platforms supported by MSAL have additional token cache-related information in the documentation for that platform's library. For example:
- [Get a token from the token cache using MSAL.NET](msal-net-acquire-token-silently.md)
- [Single sign-on with MSAL.js](msal-js-sso.md)
- [Custom token cache serialization in MSAL for Python](/entra/msal/python/advanced/msal-python-token-cache-serialization)
- [Custom token cache serialization in MSAL for Java](/entra/msal/java/advanced/msal-java-token-cache-serialization)
