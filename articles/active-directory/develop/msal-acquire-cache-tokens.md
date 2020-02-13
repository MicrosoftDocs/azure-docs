---
title: Acquire & cache tokens with MSAL | Azure
titleSuffix: Microsoft identity platform
description: Learn about acquiring and caching tokens using the Microsoft Authentication Library (MSAL).
services: active-directory
author: TylerMSFT
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/07/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about acquiring and caching tokens so I can decide if this platform meets my application development needs and requirements.
---

# Acquire and cache tokens using the Microsoft authentication library (MSAL)

[Access tokens](access-tokens.md) enable clients to securely call web APIs protected by Azure. There are many ways to acquire a token using Microsoft Authentication Library (MSAL). Some ways require user interactions through a web browser. Some don't require any user interactions. In general, the way to acquire a token depends on if the application is a public client application (desktop or mobile app) or a confidential client application (Web App, Web API, or daemon application like a Windows service).

MSAL caches a token after it has been acquired.  Application code should try to get a token silently (from the cache), first, before acquiring a token by other means.

You can also clear the token cache, which is achieved by removing the accounts from the cache. This does not remove the session cookie which is in the browser, though.

## Scopes when acquiring tokens

[Scopes](v2-permissions-and-consent.md) are the permissions that a web API exposes for client applications to request access to. Client applications request the user's consent for these scopes when making authentication requests to get tokens to access the web APIs. MSAL allows you to get tokens to access Azure AD for developers (v1.0) and Microsoft identity platform (v2.0) APIs. v2.0 protocol uses scopes instead of resource in the requests. For more information, read [v1.0 and v2.0 comparison](active-directory-v2-compare.md). Based on the web API's configuration of the token version it accepts, the v2.0 endpoint returns the access token to MSAL.

A number of MSAL acquire token methods require a *scopes* parameter. This parameter is a simple list of strings that declare the desired permissions and resources that are requested. Well known scopes are the [Microsoft Graph permissions](/graph/permissions-reference).

It's also possible in MSAL to access v1.0 resources. For more information, read [Scopes for a v1.0 application](msal-v1-app-scopes.md).

### Request specific scopes for a web API

When your application needs to request tokens with specific permissions for a resource API, you will need to pass the scopes containing the app ID URI of the API in the below format: *&lt;app ID URI&gt;/&lt;scope&gt;*

For example, scopes for Microsoft Graph API: `https://graph.microsoft.com/User.Read`

Or, for example, scopes for a custom web API: `api://abscdefgh-1234-abcd-efgh-1234567890/api.read`

For the Microsoft Graph API, only, a scope value `user.read` maps to `https://graph.microsoft.com/User.Read` format and can be used interchangeably.

> [!NOTE]
> Certain web APIs such as Azure Resource Manager API (https://management.core.windows.net/) expect a trailing '/' in the audience claim (aud) of the access token. In this case, it is important to pass the scope as https://management.core.windows.net//user_impersonation (note the double slash), for the token to be valid in the API.

### Request dynamic scopes for incremental consent

When building applications using v1.0, you had to register the full set of permissions (static scopes) required by the application for the user to consent at the time of login. In v2.0, you can request additional permissions as needed using the scope parameter. These are called dynamic scopes and allow the user to provide incremental consent to scopes.

For example, you can initially sign in the user and deny them any kind of access. Later, you can give them the ability to read the calendar of the user by requesting the calendar scope in the acquire token methods and get the user's consent.

For example: `https://graph.microsoft.com/User.Read` and `https://graph.microsoft.com/Calendar.Read`

## Acquiring tokens silently (from the cache)

MSAL maintains a token cache (or two caches for confidential client applications) and caches a token after it has been acquired.  In many cases, attempting to silently get a token will acquire another token with more scopes based on a token in the cache. It's also capable of refreshing a token when it's getting close to expiration (as the token cache also contains a refresh token).

### Recommended call pattern for public client applications

Application code should try to get a token silently (from the cache), first.  If the method call returns a "UI required" error or exception, try acquiring a token by other means. 

However, there are two flows before which you **should not** attempt to silently acquire a token:

- [client credentials flow](msal-authentication-flows.md#client-credentials), which does not use the user token cache, but an application token cache. This method takes care of verifying this application token cache before sending a request to the STS.
- [authorization code flow](msal-authentication-flows.md#authorization-code) in Web Apps, as it redeems a code that the application got by signing-in the user, and having them consent for more scopes. Since a code is passed as a parameter, and not an account, the method cannot look in the cache before redeeming the code, which requires, anyway, a call to the service.

### Recommended call pattern in Web Apps using the Authorization Code flow

For Web applications that use the [OpenID Connect authorization code flow](v2-protocols-oidc.md), the recommended pattern in the controllers is to:

- Instantiate a confidential client application with a token cache with customized serialization. 
- Acquire the token using the authorization code flow

## Acquiring tokens

Generally, the method of acquiring a token depends on whether it's a public client or confidential client application.

### Public client applications

For public client applications (desktop or mobile app), you:
- Often acquire tokens interactively, having the user sign in through a UI or pop-up window.
- Can [get a token silently for the signed-in user](msal-authentication-flows.md#integrated-windows-authentication) using Integrated Windows Authentication (IWA/Kerberos) if the desktop application is running on a Windows computer joined to a domain or to Azure.
- Can [get a token with a username and password](msal-authentication-flows.md#usernamepassword) in .NET framework desktop client applications, but this is not recommended. Do not use username/password in confidential client applications.
- Can acquire a token through the [device code flow](msal-authentication-flows.md#device-code) in applications running on devices which don't have a web browser. The user is provided with a URL and a code, who then goes to a web browser on another device and enters the code and signs in.  Azure AD then sends a token back to the browser-less device.

### Confidential client applications

For confidential client applications (Web App, Web API, or daemon application like a Windows service), you:
- Acquire tokens **for the application itself** and not for a user, using the [client credentials flow](msal-authentication-flows.md#client-credentials). This can be used for syncing tools, or tools that process users in general and not a specific user. 
- Use the [On-behalf-of flow](msal-authentication-flows.md#on-behalf-of) for a web API to call an API on behalf of the user. The application is identified with client credentials in order to acquire a token based on a user assertion (SAML for example, or a JWT token). This flow is used by applications that need to access resources of a particular user in service-to-service calls.
- Acquire tokens using the [authorization code flow](msal-authentication-flows.md#authorization-code) in web apps after the user signs in through the authorization request URL. OpenID Connect application typically use this mechanism, which lets the user sign in using Open ID connect and then access web APIs on behalf of the user.

## Authentication results

When your client requests an access token, Azure AD also returns an authentication result which includes some metadata about the access token. This information includes the expiry time of the access token and the scopes for which it's valid. This data allows your app to do intelligent caching of access tokens without having to parse the access token itself.  The authentication result exposes:

- The [access token](access-tokens.md) for the web API to access resources. This is a string, usually a base64 encoded JWT but the client should never look inside the access token. The format isn't guaranteed to remain stable and it can be encrypted for the resource. People writing code depending on access token content on the client is one of the biggest sources of errors and client logic breaks.
- The [ID token](id-tokens.md) for the user (this is a JWT).
- The token expiration, which tells the date/time when the token expires.
- The tenant ID contains the tenant in which the user was found. For guest users (Azure AD B2B scenarios), the tenant ID is the guest tenant, not the unique tenant. When the token is delivered in the name of a user, the authentication result also contains information about this user. For confidential client flows where tokens are requested with no user (for the application), this user information is null.
- The scopes for which the token was issued.
- The unique ID for the user.

## Next steps

If you are using MSAL for Java, learn about [Custom token cache serialization in MSAL for Java](msal-java-token-cache-serialization.md).

Learn about [handling errors and exceptions](msal-handling-exceptions.md).
