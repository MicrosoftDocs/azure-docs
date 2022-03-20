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

You don't need to learn OAuth and OIDC at the protocol level to use the Microsoft identity platform. However, debugging the apps you build with the [Microsoft Authentication Library (MSAL)](msal-overview.md) is easier with some knowledge of the protocols and their implementation on the identity platform.

## Roles in OAuth

Four parties are typically involved in an OAuth 2.0 and OpenID Connect authentication and authorization exchange. Such exchanges are often called *authentication flows*, or just *auth flows*.

![Diagram showing the OAuth 2.0 roles](./media/active-directory-v2-flows/protocols-roles.svg)

* **Authorization server** - The Microsoft identity platform itself is the *authorization server*. Also called an *identity provider* or *IdP*, it securely handles the end-user's information, their access, and the trust relationships between the parties in the auth flow. The authorization server issues the bearer tokens (security tokens) your apps and web APIs use for granting, denying, or revoking access to resources (authorization) after the user has signed in (authenticated).

* **Client** - Any application requesting access to a protected resource in an OAuth exchange is the *client*. A client in OAuth isn't always a web browser or desktop application operated by a human. For example, if a user interacts with a traditional web app (running on a server) to access a protected resource, the web application running on the server is the client, not the user's web browser. You'll often see the client referred to as "client application", "application," or even just "app."

* **Resource owner** - The *resource owner* in an auth flow is typically the application user, or *end-user* in OAuth terminology. The end-user *owns* the protected *resource* (data) your app accesses on their behalf. The resource owner can grant or deny your app (the _client_) access to the resources they own. For example, your app might call an external system's API to get a user's email address. Their email address is a resource the end-user owns on that external system, and to which they can grant or deny your app access.

* **Resource server** - Most often a web API fronting a data store, the *resource server* hosts or provides access to a resource owner's protected data in the data store. The resource server relies on the authorization server to perform authentication. For authorization, the resource server uses the information in *access tokens* to grant or deny access to protected resources. Access tokens are one of the three types of bearer tokens issued, or *minted*, by the Microsoft identity platform.

## Tokens

The **bearer token** is the other notable component in the diagram. The parties participating in an authentication flow use tokens to assure identification (authentication) and to grant or deny access to protected resources (authorization). Bearer tokens in the Microsoft identity platform are formatted as [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT).

The identity platform uses bearer tokens for three types of OAUth 2.0 and OpenID connect *security tokens*:

* [Access tokens](access-tokens.md) - Access tokens are issued by the authorization server to the client application. The client passes access tokens to the resource server. Access tokens contain the permissions the client has been granted by the authorization server. 

* [ID tokens](id-tokens.md) - ID tokens are issued by the authorization server to the client application. Clients use ID tokens when signing in users and for getting basic information about those users.

* **Refresh tokens** - The client uses a refresh token, or *RT*, to request new access and ID tokens from the authorization server. Your code should treat refresh tokens and their string content as opaque because they're intended for use only by authorization server.

## App registration

Your client app needs a way to trust the security tokens issued to it by the Microsoft identity platform. The first step in establishing that trust is by [registering your app](quickstart-register-app.md) with the identity platform.

When you register your app, the Microsoft identity platform automatically assigns it some values, while others you can configure based on the application's type.

* **Application (client) ID** - Also called _application ID_ and _client ID_, this value is assigned to your app by the Microsoft identity platform. It uniquely identifies your app within the identity platform and it's included in the security tokens the platform issues to your app.
* **Redirect URI** - A URI used by the identity platform for directing responses back to your app.
* Other values specific to the client app's type or scenario. For example, a standard web app, single-page app (SPA), or a web API calling another web API.

Your app's registration also holds information about the authentication and authorization *endpoints* you'll use in your code to get ID and access tokens.

## Endpoints

Authorization servers like the Microsoft identity platform provide a set of endpoints used by the entities in an authentication flow.

Two of the most commonly used endpoints are the [`authorization` endpoint](v2-oauth2-auth-code-flow.md#request-an-authorization-code) and [`token` endpoint](v2-oauth2-auth-code-flow.md#redeem-a-code-for-an-access-token). These endpoints often--but not always--take this form:

```
https://login.microsoftonline.com/<issuer>/oauth2/v2.0/authorize
https://login.microsoftonline.com/<issuer>/oauth2/v2.0/token
```

Find the endpoints for your application in the [Azure portal](https://portal.azure.com) by navigating to:

**Azure Active Directory** > **App registrations** > **{YOUR-APPLICATION}** > **Endpoints**.
 
## Next steps

Next, learn about the OAuth 2.0 authentication flows used by each application type and Microsoft's authentication libraries available you can use for them:

- [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
- [Microsoft identity platform authentication libraries](reference-v2-libraries.md)

If you have protocol-level experience issuing raw HTTP calls to perform auth flows and an application that requires it:

* [OpenID Connect](v2-protocols-oidc.md) - User sign-in, sign-out, and single sign-on (SSO)
* [Authorization code grant flow](v2-oauth2-auth-code-flow.md) - Single-page apps (SPA), mobile apps, native (desktop) applications
* [Client credentials flow](v2-oauth2-client-creds-grant-flow.md) - Server-side processes, scripts, daemons
* [On-behalf-of (OBO) flow](v2-oauth2-on-behalf-of-flow.md) - Web APIs that call another web API on a user's behalf