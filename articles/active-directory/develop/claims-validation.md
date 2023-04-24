---
title: Secure tokens by validating claims
description: Learn about the claims that must be validated to ensure that tokens are secure.
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

# Secure tokens by validating claims

The business logic of an application determines how authorization should be handled. The general approach to claims-based authorization, and which claims should be used, is described in the following sections.

To make sure that your authorization logic is secure, you must validate the following information in claims:

* The appropriate audience is specified for the token.
* The tenant ID of the token matches the ID of the tenant where data is stored.
* The subject of the token is appropriate.
* The actor (client app) is authorized.

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
> Never use `email` or `upn` claim values to store or determine whether the user in an access token should have access to data. Mutable claim values like these can change over time, making them insecure and unreliable for authorization.

[Need example]

## Validate the actor

Lastly, when an app is acting for a user, this client app (the actor), must also be authorized. Use the `scp` claim (scope) to validate that the app has permission to perform an operation.

The application defines the scopes and the absence of the `scp` claim means full actor permissions.

> [!NOTE]
> An application may handle app-only tokens (requests from applications without users, such as daemon apps) and want to authorize a specific application across multiple tenants, rather than individual service principal IDs. In that case, check for an app-only token using the `idtyp` optional claim and use the `appid` claim (for v1.0 tokens) or the `azp` claim (for v2.0 tokens) along with `tid` to determine authorization based on tenant and application ID.

[Need example]

## Next steps

* Learn more about tokens and claims in [Security tokens](security-tokens.md)
