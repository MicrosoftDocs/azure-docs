---
title: OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform | Azure
titleSuffix: Microsoft identity platform
description: A guide to OAuth 2.0 and OpenID Connect protocols as supported by the Microsoft identity platform.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 02/19/2022
ms.author: ludwignick
ms.reviewer: ludwignick
ms.custom: aaddev
---

# OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform

The Microsoft identity platform provides authorization and authentication by using standards-compliant implementations of the OAuth 2.0 and OpenID Connect 1.0 (OIDC) protocols. This and the other protocol articles describe the OAuth 2 and OIDC protocols and their functionality as provided by the Microsoft identity platform.

You don't need to learn how OAuth 2 and OpenID Connect operate at a low level to use the Microsoft identity platform, especially if you use a [Microsoft authentication library](reference-v2-libraries.md) in your app. Knowing some of the specifics of the identity platform's implementation, however, can be helpful during application development and while troubleshooting authentication issues.

## OAuth roles - the basics

There are four parties involved in most OAuth 2.0 and OpenID Connect authentication and authorization exchanges. Such exchanges are often called *authentication flows*, or just *auth flows*.

![Diagram showing the OAuth 2.0 roles](./media/active-directory-v2-flows/protocols-roles.svg)

* **Authorization server** - In OAuth terms, the Microsoft identity platform itself is the authorization server. The authorization server, also known as the *identity provider* or *IdP*, securely handles anything to do with the user's information, their access, and the trust relationships between the parties in an auth flow. It issues the security tokens your apps and web APIs use for granting, denying, or revoking access to resources (authorization) after the user has signed in (authenticated).

* **Resource owner** - The resource owner in an auth flow is typically an application's user, or *end-user* in OAuth terminology. They're the entity that *owns* some data, a protected *resource*, your app needs to access on that entity's behalf. The resource owner can grant or deny your app access to the resources they own. For example, your app might need call an API to get a user's email address from their profile on an external system, a resource the user owns on that system.

* **OAuth client** - In an OAuth flow, the party that requests access to a protected resource is the *client*. This is true even if the requesting party is a traditional web app whose code runs on a server in a data center. If that web app requests access to data the user owns, the web application that's running on the server, not the web browser of user interacting with the web app, is considered the client.

* **Resource server** - The resource owner's protected resources reside on the resource server - it's where the data is hosted. The resource server relies on the authorization server to perform authentication, and it authorizes or denies requests to access a resource owner's protected resources on the server by using bearer access tokens provided (sometimes called *minted*) by the authorization server.

The other notable component in the diagram, the **bearer token**, is covered next. There are several token types, and it's the artifact these parties pass around to assure identification (authentication) and grant or deny access to protected resources (authorization).

## Tokens

The Microsoft identity platform uses three types of OAuth 2.0 and OpenID Connect security tokens. All three are bearer tokens formatted as [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT).

* [Access tokens](access-tokens.md) - The resource server receives access tokens from a client. They contain permissions the client has been granted by the authorization server.

* [ID tokens](id-tokens.md) - Th client receives ID tokens from the authorization server. ID tokens are used for signing in users and getting basic information about them.

* **Refresh tokens** - Refresh tokens are used by the client to request new access and ID tokens from the authorization server. Refresh tokens are opaque strings, understood and intended for use only by the authorization server.

### Secure your tokens

A bearer token is a lightweight security token granting the *bearer* access to a protected resource. Though a party must have authenticated with the Microsoft identity platform to receive a bearer token, the "bearer" is *anyone* with a copy of the token.

* Transport bearer tokens using an encrypted protocol like transport layer security (HTTPS).
* Store and cache bearer tokens in a similarly secure manner.

For more security considerations for bearer tokens, see [RFC 6750 Section 5](https://tools.ietf.org/html/rfc6750).

The Microsoft

## App registration

Every app that wants to accept both personal and work or school accounts must be registered through the **App registrations** experience in the [Azure portal](https://aka.ms/appregistrations) before it can sign these users in using OAuth 2.0 or OpenID Connect. The app registration process will collect and assign a few values to your app:

* An **Application ID** that uniquely identifies your app
* A **Redirect URI** (optional) that can be used to direct responses back to your app
* A few other scenario-specific values.

For more details, learn how to [register an app](quickstart-register-app.md).

## Endpoints

Even standards-compliant implementations differ slightly between the services (the *authorization servers*) that offer them, including the endpoints they use for responding to security token requests.

An application that requests ID or access tokens for another application registered with the Microsoft identity platform sends its token requests to these endpoints:

```
https://login.microsoftonline.com/<signInAudience>/oauth2/v2.0/authorize
https://login.microsoftonline.com/<signInAudience>/oauth2/v2.0/token
```

The `<signInAudience>` value specifies which entities are allowed to authenticate by using the tokens issued by the endpoints.

| Value | Description |
| --- | --- |
| `common` | Allows users with both personal Microsoft accounts and work/school accounts from Azure AD to sign into the application. |
| `organizations` | Allows only users with work/school accounts from Azure AD to sign into the application. |
| `consumers` | Allows only users with personal Microsoft accounts (MSA) to sign into the application. |
| `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` | Allows only users with work/school accounts from a particular Azure AD tenant to sign into the application. Either the friendly domain name of the Azure AD tenant or the tenant's GUID identifier can be used. |

To learn how to interact with these endpoints, choose a particular app type in the [Protocols](#protocols) section and follow the links for more info.


## Next steps

To help determine the right OAuth 2.0 authentication flow for your application, see the [Microsoft identity platform application type overview](v2-app-types.md).

These articles describe several the OAuth 2.0 authentication flows and the types of applications that typically use them:

* [Build mobile, native, and web application with OAuth 2.0](v2-oauth2-auth-code-flow.md)
* [Sign users in with OpenID Connect](v2-protocols-oidc.md)
* [Build daemons or server-side processes with the OAuth 2.0 client credentials flow](v2-oauth2-client-creds-grant-flow.md)
* [Get tokens in a web API with the OAuth 2.0 on-behalf-of Flow](v2-oauth2-on-behalf-of-flow.md)
* [Build single-page apps with the  OAuth 2.0 Implicit Flow](v2-oauth2-implicit-grant-flow.md)