---
title: Security tokens
description: Learn about the basics of security tokens in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/27/2021
ms.author: davidmu
ms.reviewer: jmprieur, saeeda, sureshja, ludwignick
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand the basic concepts of security tokens in the Microsoft identity platform.
---

# Security tokens

A centralized identity provider is especially useful for apps that have users located around the globe who don't necessarily sign in from the enterprise's network. The Microsoft identity platform authenticates users and provides security tokens, such as [access tokens](developer-glossary.md#access-token), [refresh tokens](developer-glossary.md#refresh-token), and [ID tokens](developer-glossary.md#id-token). Security tokens allow a [client application](developer-glossary.md#client-application) to access protected resources on a [resource server](developer-glossary.md#resource-server).

**Access token**: An access token is a security token that's issued by an [authorization server](developer-glossary.md#authorization-server) as part of an [OAuth 2.0](active-directory-v2-protocols.md) flow. It contains information about the user and the resource for which the token is intended. The information can be used to access web APIs and other protected resources. Access tokens are validated by resources to grant access to a client app. To learn more about how the Microsoft identity platform issues access tokens, see [Access tokens](access-tokens.md).

**Refresh token**: Because access tokens are valid for only a short period of time, authorization servers will sometimes issue a refresh token at the same time the access token is issued. The client application can then exchange this refresh token for a new access token when needed. To learn more about how the Microsoft identity platform uses refresh tokens to revoke permissions, see [Refresh tokens](refresh-tokens.md).

**ID token**: ID tokens are sent to the client application as part of an [OpenID Connect](v2-protocols-oidc.md) flow. They can be sent alongside or instead of an access token. ID tokens are used by the client to authenticate the user. To learn more about how the Microsoft identity platform issues ID tokens, see [ID tokens](id-tokens.md).

> [!NOTE]
> This article discusses security tokens used by the OAuth2 and OpenID Connect protocols. Many enterprise applications use SAML to authenticate users. For information on SAML assertions, see [Azure Active Directory SAML token reference](reference-saml-tokens.md).

## Validate security tokens

It's up to the app for which the token was generated, the web app that signed in the user, or the web API being called to validate the token. The token is signed by the authorization server with a private key. The authorization server publishes the corresponding public key. To validate a token, the app verifies the signature by using the authorization server public key to validate that the signature was created using the private key.

Tokens are valid for only a limited amount of time. Usually, the authorization server provides a pair of tokens, such as:

* An access token, which accesses the application or protected resource.
* A refresh token, which is used to refresh the access token when the access token is close to expiring.

Access tokens are passed to a web API as the bearer token in the `Authorization` header. An app can provide a refresh token to the authorization server. If the user access to the app wasn't revoked, it will get back a new access token and a new refresh token. This is how the scenario of someone leaving the enterprise is handled. When the authorization server receives the refresh token, it won't issue another valid access token if the user is no longer authorized.

## JSON Web Tokens and claims

The Microsoft identity platform implements security tokens as JSON Web Tokens (JWTs) that contain *claims*. Since JWTs are used as security tokens, this form of authentication is sometimes called *JWT authentication*.

A [claim](developer-glossary.md#claim) provides assertions about one entity, such as a client application or [resource owner](developer-glossary.md#resource-owner), to another entity, such as a resource server. A claim might also be referred to as a JWT claim or a JSON Web Token claim.

Claims are name or value pairs that relay facts about the token subject. For example, a claim might contain facts about the security principal that was authenticated by the authorization server. The claims present in a specific token depend on many things, such as the type of token, the type of credential used to authenticate the subject, and the application configuration.

Applications can use claims for various tasks, such as to:

* Validate the token.
* Identify the token subject's [tenant](developer-glossary.md#tenant).
* Display user information.
* Determine the subject's authorization.

A claim consists of key-value pairs that provide information such as the:

* Security Token Server that generated the token.
* Date when the token was generated.
* Subject (such as the user--except for daemons).
* Audience, which is the app for which the token was generated.
* App (the client) that asked for the token. In the case of web apps, this app might be the same as the audience.

To learn more about how the Microsoft identity platform implements tokens and claim information, see [Access tokens](access-tokens.md) and [ID tokens](id-tokens.md).

## How each flow emits tokens and codes

Depending on how your client is built, it can use one (or several) of the authentication flows supported by the Microsoft identity platform. These flows can produce various tokens (ID tokens, refresh tokens, access tokens) and authorization codes. They require different tokens to make them work. This table provides an overview.

|Flow | Requires | ID token | Access token | Refresh token | Authorization code |
|-----|----------|----------|--------------|---------------|--------------------|
|[Authorization code flow](v2-oauth2-auth-code-flow.md) | | x | x | x | x|
|[Implicit flow](v2-oauth2-implicit-grant-flow.md) | | x        | x    |      |                    |
|[Hybrid OIDC flow](v2-protocols-oidc.md#protocol-diagram-access-token-acquisition)| | x  | |          |            x   |
|[Refresh token redemption](v2-oauth2-auth-code-flow.md#refresh-the-access-token) | Refresh token | x | x | x| |
|[On-behalf-of flow](v2-oauth2-on-behalf-of-flow.md) | Access token| x| x| x| |
|[Client credentials](v2-oauth2-client-creds-grant-flow.md) | | | x (App only)| | |

Tokens issued via the implicit mode have a length limitation because they're passed back to the browser via the URL, where `response_mode` is `query` or `fragment`. Some browsers have a limit on the size of the URL that can be put in the browser bar and fail when it's too long. As a result, these tokens don't have `groups` or `wids` claims.

## Next steps

For more information about authentication and authorization in the Microsoft identity platform, see the following articles:

* To learn about the basic concepts of authentication and authorization, see [Authentication vs. authorization](authentication-vs-authorization.md).
* To learn about registering your application for integration, see [Application model](application-model.md).
* To learn about the sign-in flow of web, desktop, and mobile apps, see [App sign-in flow](app-sign-in-flow.md).
