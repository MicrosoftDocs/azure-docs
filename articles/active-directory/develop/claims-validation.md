---
title: Secure applications and APIs by validating claims
description: Learn about securing the business logic of your applications and APIs by validating claims in tokens.
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 04/21/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
---

# Secure applications and APIs by validating claims

Interacting with tokens is a core piece of building applications to authenticate or authorize users. In accordance with the [Zero Trust principle to explicitly verify](zero-trust-for-developers.md), it's essential that applications validate the tokens they're issued. Token validation allows applications to ensure tokens have not been tampered with or misused by verifying the correct structure, claim values, expiry, and signature. That being said, token validation can seem complex given its various scenarios and applications. This document aims to simplify the token validation process so you can ensure your applications adhere to the most secure practices. 

To make sure that your authorization logic is secure, you must validate the following information in claims:

* The appropriate audience is specified for the token.
* The tenant ID of the token matches the ID of the tenant where data is stored.
* The subject of the token is appropriate.
* The actor (client app) is authorized.

For more information about the claims mentioned in this article, see [Microsoft identity platform access tokens](access-tokens.md).

> [!NOTE]
>Access tokens are only validated in the web APIs for which they were acquired by a client. The client should not validate access tokens.

## Validate the audience

[Need information here about what is important about validating the `aud` claim. Example of doing it]

## Validate the tenant

First, always check that the `tid` in a token matches the tenant ID used to store data with the application. When information is stored for an application in the context of a tenant, it should only be accessed again later in the same tenant. Never allow data in one tenant to be accessed from another tenant.

[Need example]

## Validate the subject

Next, to determine if the token subject, such as the user (or app itself for an app-only token), is authorized. 

You can either check for specific `sub` or `oid` claims.

Or,

You can check that the subject belongs to an appropriate role or group with the `roles`, `groups`, `wids` claims.

For example, use the immutable claim values `tid` and `oid` as a combined key for application data and determining whether a user should be granted access.

The `roles`, `groups` or `wids` claims can also be used to determine if the subject has authorization to perform an operation. For example, an administrator may have permission to write to an API, but not a normal user, or the user may be in a group allowed to do some action.

> [!WARNING]
> Never use claims like `email`, `preferred_username` or `unique_name` to store or determine whether the user in an access token should have access to data. These claims are not unique and can be controllable by tenant administrators or sometimes users, which makes them unsuitable for authorization decisions. They are only usable for display purposes. Also don't use the `upn` claim for authorization. While the UPN is unique, it often changes over the lifetime of a user principal, which makes it unreliable for authorization.

[Need example]

## Validate the actor

Lastly, a client app that is acting on behalf of a user (referred to as the *actor*), must also be authorized. Use the `scp` claim (scope) to validate that the app has permission to perform an operation. For more information, see [Scopes and permissions in the Microsoft identity platform](scopes-oidc.md). For more information about building least privilege into how your application manages ID tokens that it receives from the Microsoft identity platform, see [Managing tokens for Zero Trust](/security/zero-trust/develop/token-management).

The application defines the scopes and the absence of the `scp` claim means full actor permissions.

> [!NOTE]
> An application may handle app-only tokens (requests from applications without users, such as daemon apps) and want to authorize a specific application across multiple tenants, rather than individual service principal IDs. In that case, the `appid` claim (for v1.0 tokens) or the `azp` claim (for v2.0 tokens) can be used for subject authorization. However, when using these claims, the application must ensure that the token was issued directly for the application by validating the `idtyp` optional claim. Only tokens of type `app` can be authorized this way, as delegated user tokens can potentially be obtained by entities other than the application.

[Need example]

## Next steps

* Learn more about tokens and claims in [Security tokens](security-tokens.md)
