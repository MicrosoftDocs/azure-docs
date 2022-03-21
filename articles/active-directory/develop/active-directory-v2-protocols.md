---
title: OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform | Azure
titleSuffix: Microsoft identity platform
description: A guide to OAuth 2.0 and OpenID Connect protocols as supported by the Microsoft identity platform.
services: active-directory
author: nickludwig
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/21/2022
ms.author: ludwignick
ms.reviewer: marsma
ms.custom: aaddev
---

# OAuth 2.0 and OpenID Connect in the Microsoft identity platform

The Microsoft identity platform offers authentication and authorization services using standards-compliant implementations of OAuth 2.0 and OpenID Connect (OIDC) 1.0.

You don't need to learn OAuth and OIDC at the protocol level to use the Microsoft identity platform. However, debugging your apps can be made easier by learning a few basics of the protocols and their implementation on the identity platform.

## Roles in OAuth 2.0

Four parties are typically involved in an OAuth 2.0 and OpenID Connect authentication and authorization exchange. Such exchanges are often called *authentication flows* or *auth flows*.

![Diagram showing the OAuth 2.0 roles](./media/active-directory-v2-flows/protocols-roles.svg)

* **Authorization server** - The Microsoft identity platform itself is the authorization server. Also called an *identity provider* or *IdP*, it securely handles the end-user's information, their access, and the trust relationships between the parties in the auth flow. The authorization server issues the security tokens your apps and APIs use for granting, denying, or revoking access to resources (authorization) after the user has signed in (authenticated).

* **Client** - The client in an OAuth exchange is the application requesting access to a protected resource. The client could be a web app running on a server, a single-page web app running in a user's web browser, or a web API that calls another web API. You'll often see the client referred to as *client application*, *application*, or *app*.

* **Resource owner** - The resource owner in an auth flow is typically the application user, or *end-user* in OAuth terminology. The end-user "owns" the protected resource--their data--your app accesses on their behalf. The resource owner can grant or deny your app (the client) access to the resources they own. For example, your app might call an external system's API to get a user's email address from their profile on that system. Their profile data is a resource the end-user owns on the external system, and the end-user can consent to or deny your app's request to access their data.

* **Resource server** - The resource server hosts or provides access to a resource owner's data. Most often, the resource server is a web API fronting a data store. The resource server relies on the authorization server to perform authentication and uses information in bearer tokens issued by the authorization server to grant or deny access to resources.

## Tokens

The parties in an authentication flow use **bearer tokens** to assure identification (authentication) and to grant or deny access to protected resources (authorization). Bearer tokens in the Microsoft identity platform are formatted as [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT).

Three types of bearer tokens are used by the Microsoft identity platform as *security tokens*:

* [Access tokens](access-tokens.md) - Access tokens are issued by the authorization server to the client application. The client passes access tokens to the resource server. Access tokens contain the permissions the client has been granted by the authorization server. 

* [ID tokens](id-tokens.md) - ID tokens are issued by the authorization server to the client application. Clients use ID tokens when signing in users and to get basic information about them.

* **Refresh tokens** - The client uses a refresh token, or *RT*, to request new access and ID tokens from the authorization server. Your code should treat refresh tokens and their string content as opaque because they're intended for use only by authorization server.

## App registration

Your client app needs a way to trust the security tokens issued to it by the Microsoft identity platform. The first step in establishing that trust is by [registering your app](quickstart-register-app.md) with the identity platform in Azure Active Directory (AD).

When you register your app in Azure AD, the Microsoft identity platform automatically assigns it some values, while others you configure based on the application's type.

* **Application (client) ID** - Also called _application ID_ and _client ID_, this value is assigned to your app by the Microsoft identity platform. The client ID uniquely identifies your app in the identity platform and is included in the security tokens the platform issues to your app.
* **Redirect URI** - The authorization server uses a redirect URI to direct the resource owner's *user-agent* (web browser, mobile app) to another destination after completing their interaction (for example, after the end-user authenticates with the authorization server). Not all client types use redirect URIs.
* **Values specific to the client app type or scenario** - For example, a standard web app, single-page app (SPA), and a web API calling another web API might all require different settings values unique to each.

Your app's registration also holds information about the authentication and authorization *endpoints* you'll use in your code to get ID and access tokens.

## Endpoints

Authorization servers like the Microsoft identity platform provide a set of HTTP endpoints for use by the parties in an auth flow to execute the flow.

Two of the most commonly used endpoints are the [`authorization` endpoint](v2-oauth2-auth-code-flow.md#request-an-authorization-code) and [`token` endpoint](v2-oauth2-auth-code-flow.md#redeem-a-code-for-an-access-token). In the Microsoft identity platform, these two endpoints often--but not always--take this form:

```
https://login.microsoftonline.com/<issuer>/oauth2/v2.0/authorize
https://login.microsoftonline.com/<issuer>/oauth2/v2.0/token
```

The endpoint URIs for your app are generated for you when you register the app in Azure AD. The endpoints you use in your app's code depend on the application's type and the identities (account types) it should support.

To find the endpoints for an application you've registered, in the [Azure portal](https://portal.azure.com) navigate to:

**Azure Active Directory** > **App registrations** > *{YOUR-APPLICATION}* > **Endpoints**
 
## Next steps

Next, learn about the OAuth 2.0 authentication flows used by each application type and the libraries you can use in your apps to perform them:

- [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
- [Microsoft authentication libraries](reference-v2-libraries.md)

Always prefer using an authentication library over making raw HTTP calls to execute auth flows. However, if you have an app that requires it or you'd like to learn more about the identity platform's implementation of OAuth and OIDC, see:

* [OpenID Connect](v2-protocols-oidc.md) - User sign-in, sign-out, and single sign-on (SSO)
* [Authorization code grant flow](v2-oauth2-auth-code-flow.md) - Single-page apps (SPA), mobile apps, native (desktop) applications
* [Client credentials flow](v2-oauth2-client-creds-grant-flow.md) - Server-side processes, scripts, daemons
* [On-behalf-of (OBO) flow](v2-oauth2-on-behalf-of-flow.md) - Web APIs that call another web API on a user's behalf