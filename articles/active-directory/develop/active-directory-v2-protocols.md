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
ms.date: 02/22/2022
ms.author: ludwignick
ms.reviewer: marsma
ms.custom: aaddev
---

# OAuth 2.0 and OpenID Connect in the Microsoft identity platform

The Microsoft identity platform offer authentication and authorization services using standards-compliant implementations of OAuth 2.0 and OpenID Connect (OIDC) 1.0. You're not required to learn OAuth and OIDC at the protocol level to use the identity platform, especially if you use a standards-compliant auth library like the [Microsoft Authentication Library (MSAL)](msal-overview.md). However, knowledge of the identity platform's implementation of these protocols can make building, debugging, and troubleshooting your applications easier.

## Roles in OAuth

Four parties are typically involved in OAuth 2.0 and OpenID Connect authentication and authorization exchanges (*authentication flows* or *auth flows*).

![Diagram showing the OAuth 2.0 roles](./media/active-directory-v2-flows/protocols-roles.svg)

* **Authorization server** - The Microsoft identity platform itself is the *authorization server*. Also called an *identity provider* or *IdP*, it securely handles the end-user's information, their access, and the trust relationships between the parties in the auth flow. The authorization server issues the bearer tokens (security tokens) your apps and web APIs use for granting, denying, or revoking access to resources (authorization) after the user has signed in (authenticated).

* **Resource owner** - The *resource owner* in an auth flow is typically the application user (*end-user* in OAuth terminology). The end-user *owns* the protected *resource* (data) your app accesses on their behalf. The resource owner can grant or deny your app access to the resources they own. For example, your app might call an external system's API to get a user's email address which a resource the user owns on that external system and to which they can grant or deny your app access.

* **Client** - Any party requesting access to a protected resource in an OAuth exchange is the *client*. A client in OAuth isn't always a web browser or desktop application operated by a human. For example, if a user interacts with a traditional web app (running on a server) to access a protected resource, the web application running on the server is the client, *not* the user's web browser.

* **Resource server** - The resource owner's protected resources reside on the resource server and is where the data is hosted or accessed. The resource server relies on the authorization server to perform authentication, and it authorizes or denies requests to access a resource owner's protected resources on the server by using bearer access tokens provided (*minted*) by the authorization server.

## Tokens

The **bearer token** is the other notable component in the diagram. The parties in an OAuth pass around to assure identification (authentication) and to grant or deny access to protected resources (authorization). Bearer tokens in the Microsoft identity platform are formatted as [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) (JWT) and are often called *security tokens* or *tokens*.

The identity platform uses bearer tokens for three types of OAUth 2.0 and OpenID connect security tokens:

* [Access tokens](access-tokens.md) - The resource server receives access tokens from a client. Access tokens contain the permissions the client has been granted by the authorization server.

* [ID tokens](id-tokens.md) - The client receives ID tokens from the authorization server. Client apps use ID tokens when signing in users and for getting basic information about those users.

* **Refresh tokens** - The client uses refresh tokens to request new access and ID tokens from the authorization server. Your code should treat refresh tokens and their string content as opaque because they're intended for use only by authorization server. You might see the refresh token called an _RT_.

## App registration

To trust and use security tokens issued by the Microsoft identity platform, your app needs a unique ID and a few other settings platform needs to uniquely identify the app in the tokens it issues.

When you use the [Azure portal](https://aka.ms/appregistrations) to register your app in **Azure Active Directory** > **App registrations**

* An **Application ID** that uniquely identifies your app.
* A **Redirect URI** (optional) that can be used to direct responses back to your app
* Scenario-specific values.

For more details, learn how to [register an app](quickstart-register-app.md).

## Endpoints

Even standards-compliant implementations differ between the authorization servers that offer them, including the endpoints they use for responding to security token requests.

An application that requests ID or access tokens for another application registered with the Microsoft identity platform sends its token requests to these endpoints:

```
https://login.microsoftonline.com/<signInAudience>/oauth2/v2.0/authorize
https://login.microsoftonline.com/<signInAudience>/oauth2/v2.0/token
```

The `<signInAudience>` value specifies which identities are allowed to authenticate by using the tokens issued by the endpoints.

| Value | Description |
| --- | --- |
| `common` | Allows users with both personal Microsoft accounts and work/school accounts from Azure AD to sign into the application. |
| `organizations` | Allows only users with work/school accounts from Azure AD to sign into the application. |
| `consumers` | Allows only users with personal Microsoft accounts (MSA) to sign into the application. |
| `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` | Allows only users with work/school accounts from a particular Azure AD tenant to sign into the application. Either the friendly domain name of the Azure AD tenant or the tenant's GUID identifier can be used. |

## Next steps

To help determine the right OAuth 2.0 authentication flow for your application, see the [Microsoft identity platform application type overview](v2-app-types.md).

These articles describe several the OAuth 2.0 authentication flows and the types of applications that typically use them:

* [Build mobile, native, and web application with OAuth 2.0](v2-oauth2-auth-code-flow.md)
* [Sign users in with OpenID Connect](v2-protocols-oidc.md)
* [Build daemons or server-side processes with the OAuth 2.0 client credentials flow](v2-oauth2-client-creds-grant-flow.md)
* [Get tokens in a web API with the OAuth 2.0 on-behalf-of Flow](v2-oauth2-on-behalf-of-flow.md)
* [Build single-page apps with the  OAuth 2.0 Implicit Flow](v2-oauth2-implicit-grant-flow.md)
