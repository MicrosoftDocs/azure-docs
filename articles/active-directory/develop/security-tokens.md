---
title: Tokens and claims overview
description: Learn about the basics of security tokens in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 06/02/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
ms.reviewer: jmprieur, saeeda, ludwignick
#Customer intent: As an application developer, I want to understand the basic concepts of security tokens in the Microsoft identity platform.
---

# Tokens and claims overview

A centralized identity provider is especially useful for apps that have worldwide users who don't necessarily sign in from the enterprise's network. The Microsoft identity platform authenticates users and provides security tokens, such as access tokens, refresh tokens, and ID tokens. Security tokens allow a client application to access protected resources on a resource server. 

 - **Access token** - An access token is a security token issued by an authorization server as part of an OAuth 2.0 flow. It contains information about the user and the resource for which the token is intended. The information can be used to access web APIs and other protected resources. Resources validate access tokens to grant access to a client application. For more information, see [Access tokens in the Microsoft identity platform](access-tokens.md).
- **Refresh token** - Because access tokens are valid for only a short period of time, authorization servers sometimes issue a refresh token at the same time the access token is issued. The client application can then exchange this refresh token for a new access token when needed. For more information, see [Refresh tokens in the Microsoft identity platform](refresh-tokens.md).
- **ID token** - ID tokens are sent to the client application as part of an OpenID Connect flow. They can be sent alongside or instead of an access token. ID tokens are used by the client to authenticate the user. To learn more about how the Microsoft identity platform issues ID tokens, see [ID tokens in the Microsoft identity platform](id-tokens.md).

Many enterprise applications use SAML to authenticate users. For information on SAML assertions, see [SAML token reference](reference-saml-tokens.md).

## Validate tokens

It's up to the application for which the token was generated, the web app that signed in the user, or the web API being called to validate the token. The authorization server signs the token with a private key. The authorization server publishes the corresponding public key. To validate a token, the app verifies the signature by using the authorization server public key to validate that the signature was created using the private key.

Tokens are valid for only a limited amount of time, so the authorization server frequently provides a pair of tokens. An access token is provided, which accesses the application or protected resource. A refresh token is provided, which is used to refresh the access token when the access token is close to expiring.

Access tokens are passed to a web API as the bearer token in the `Authorization` header. An app can provide a refresh token to the authorization server. If the user access to the app wasn't revoked, it receives a new access token and a new refresh token. When the authorization server receives the refresh token, it issues another access token only if the user is still authorized.

## JSON Web Tokens and claims

The Microsoft identity platform implements security tokens as JSON Web Tokens (JWTs) that contain *claims*. Since JWTs are used as security tokens, this form of authentication is sometimes called *JWT authentication*.

A claim provides assertions about one entity, such as a client application or resource owner, to another entity, such as a resource server. A claim might also be referred to as a JWT claim or a JSON Web Token claim.

Claims are name or value pairs that relay facts about the token subject. For example, a claim might contain facts about the security principal that the authorization server authenticated. The claims present in a specific token depend on many things, such as the type of token, the type of credential used to authenticate the subject, and the application configuration.

Applications can use claims for the following various tasks:

* Validate the token
* Identify the token subject's tenant
* Display user information
* Determine the subject's authorization

A claim consists of key-value pairs that provide the following types of information:

* Security token server that generated the token
* Date when the token was generated
* Subject (like the user, but not daemons)
* Audience, which is the app for which the token was generated
* App (the client) that asked for the token

## Authorization flows and authentication codes

Depending on how your client is built, it can use one or several of the authentication flows supported by the Microsoft identity platform. The supported flows can produce various tokens and authorization codes and require different tokens to make them work. The following table provides an overview.

| Flow | Requires | ID token | Access token | Refresh token | Authorization code |
|------|----------|----------|--------------|---------------|--------------------|
| [Authorization code flow](v2-oauth2-auth-code-flow.md) | | x | x | x | x |
| [Implicit flow](v2-oauth2-implicit-grant-flow.md) | | x | x | | |
| [Hybrid OIDC flow](v2-protocols-oidc.md#protocol-diagram-access-token-acquisition)| | x | | | x |
| [Refresh token redemption](v2-oauth2-auth-code-flow.md#refresh-the-access-token) | Refresh token | x | x | x | |
| [On-behalf-of flow](v2-oauth2-on-behalf-of-flow.md) | Access token | x | x| x | |
| [Client credentials](v2-oauth2-client-creds-grant-flow.md) | | | x (App only) | | |

Tokens issued using the implicit flow have a length limitation because they're passed back to the browser using the URL, where `response_mode` is `query` or `fragment`. Some browsers have a limit on the size of the URL that can be put in the browser bar and fail when it's too long. As a result, these tokens don't have `groups` or `wids` claims.

## See also

* [OAuth 2.0](./v2-protocols.md)
* [OpenID Connect](v2-protocols-oidc.md)

## Next steps

* To learn about the basic concepts of authentication and authorization, see [Authentication vs. authorization](authentication-vs-authorization.md).
