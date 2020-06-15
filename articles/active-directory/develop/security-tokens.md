---
title: Security tokens | Azure
titleSuffix: Microsoft identity platform
description: Learn about the basics of security tokens in Microsoft identity platform (v2.0).
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/11/2020
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda, sureshja, hirsin
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to understand the basic concepts of security tokens in Microsoft identity platform
---

# Security tokens

A centralized identity provider is especially useful for apps that have users located around the globe that don't necessarily sign in from the enterprise's network. Microsoft identity platform authenticates users and provides security tokens, such as [access token](developer-glossary.md#access-token), [refresh token](developer-glossary.md#refresh-token), and [ID token](developer-glossary.md#id-token), that allow a [client application](developer-glossary.md#client-application) to access protected resources on a [resource server](developer-glossary.md#resource-server).

An **access token** is a security token that is issued by an [authorization server](developer-glossary.md#authorization-server) as part of an [OAuth 2.0](active-directory-v2-protocols.md) flow. It contains information about the user and the app for which the token is intended; which can be used to access web APIs and other protected resources. To learn more about how Microsoft identity platform issues access tokens, see [Access tokens](access-tokens.md).

Access tokens are only valid for a short period of time, so authorization servers will sometimes issue a **refresh token** at the same time the access token is issued. The client application can then exchange this refresh token for a new access token when needed. To learn more about how Microsoft identity platform uses refresh tokens to revoke permissions, see [Token revocation](access-tokens.md#token-revocation).

**ID tokens** are sent to the client application as part of an [OpenID Connect](v2-protocols-oidc.md) flow. They can be sent along side or instead of an access token, and are used by the client to authenticate the user. To learn more about how Microsoft identity platform issues ID tokens, see [ID tokens](id-tokens.md).

> [!NOTE]
> This article discusses security tokens used by the OAuth2 and OpenID Connect protocols. Many enterprise applications use SAML to authenticate users. See [Azure AD SAML token reference](reference-saml-tokens.md) for information on SAML assertions.

## Validating security tokens

It's up to the app for which the token was generated, the web app that signed-in the user, or the web API being called, to validate the token. The token is signed by the **Security Token Server (STS)** with a private key. The STS publishes the corresponding public key. To validate a token, the app verifies the signature by using the STS public key to validate that the signature was created using the private key.

Tokens are only valid for a limited amount of time. Usually the STS provides a pair of tokens:

* An access token to access the application or protected resource, and
* A refresh token used to refresh the access token when the access token is close to expiring.

Access tokens are passed to a web API as the bearer token in the `Authorization` header. An app can provide a refresh token to the STS, and if the user access to the app wasn't revoked, it will get back a new access token and a new refresh token. This is how the scenario of someone leaving the enterprise is handled. When the STS receives the refresh token, it won't issue another valid access token if the user is no longer authorized.

## JSON Web Tokens (JWTs) and claims

Microsoft identity platform implements security tokens as **JSON Web Tokens (JWTs)** that contain **claims**. Since JWTs are used as security tokens, this form of authentication is sometimes called **JWT authentication**.

A [claim](developer-glossary.md#claim) provides assertions about one entity, such as a client application or [resource owner](developer-glossary.md#resource-owner), to another entity, such as a resource server. A claim may also be referred to as a JWT claim or JSON Web Token claim.

Claims are name/value pairs that relay facts about the token subject. For example, a claim may contain facts about the security principal that was authenticated by the authorization server. The claims present in a given token depend on many things, including the type of token, the type of credential used to authenticate the subject, the application configuration, and so on.

Applications can use claims for various tasks such as:

* Validating the token
* Identifying the token subject's [tenant](developer-glossary.md#tenant)
* Displaying user information
* Determining the subject's authorization

A claim consists of key-value pairs that provide information such as the:

* Security Token Server that generated the token
* Date when the token was generated
* Subject (such as the user--except for daemons)
* Audience, which is the app for which the token was generated
* App (the client) that asked for the token. In the case of web apps, this may be the same as the audience

To learn more about how Microsoft identity platform implements tokens and claim information, see [access tokens](access-tokens.md) and [ID tokens](id-tokens.md).

## How each flow emits tokens and codes

Depending on how your client is built, it can use one (or several) of the authentication flows supported by Microsoft identity platform. These flows can produce a variety of tokens (ID tokens, refresh tokens, access tokens) as well as authorization codes, and require different tokens to make them work. This chart provides an overview:

|Flow | Requires | ID token | access token | refresh token | authorization code |
|-----|----------|----------|--------------|---------------|--------------------|
|[Authorization code flow](v2-oauth2-auth-code-flow.md) | | x | x | x | x|
|[Implicit flow](v2-oauth2-implicit-grant-flow.md) | | x        | x    |      |                    |
|[Hybrid OIDC flow](v2-protocols-oidc.md#protocol-diagram-access-token-acquisition)| | x  | |          |            x   |
|[Refresh token redemption](v2-oauth2-auth-code-flow.md#refresh-the-access-token) | refresh token | x | x | x| |
|[On-behalf-of flow](v2-oauth2-on-behalf-of-flow.md) | access token| x| x| x| |
|[Client credentials](v2-oauth2-client-creds-grant-flow.md) | | | x (app-only)| | |

Tokens issued via the implicit mode have a length limitation due to being passed back to the browser via the URL (where `response_mode` is `query` or `fragment`).  Some browsers have a limit on the size of the URL that can be put in the browser bar and fail when it is too long.  Thus, these tokens do not have `groups` or `wids` claims.

## Next steps

For other topics covering authentication and authorization basics:

* See [Authentication vs. authorization](authentication-vs-authorization.md) to learn about the basic concepts of authentication and authorization in Microsoft identity platform.
* See [Application model](application-model.md) to learn about the process of registering your application so it can integrate with Microsoft identity platform.
* See [App sign-in flow](app-sign-in-flow.md) to learn about the sign-in flow of web, desktop, and mobile apps in Microsoft identity platform.
