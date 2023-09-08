---
title: Refresh tokens in the Microsoft identity platform
description: Learn about refresh tokens that are used in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 06/02/2023
ms.author: davidmu
ms.reviewer: ludwignick
ms.custom: aaddev, curation-claims
---

# Refresh tokens in the Microsoft identity platform

When a client acquires an access token to access a protected resource, the client also receives a refresh token. The refresh token is used to obtain new access and refresh token pairs when the current access token expires. 

Refresh tokens are also used to acquire extra access tokens for other resources. Refresh tokens are bound to a combination of user and client, but aren't tied to a resource or tenant. A client can use a refresh token to acquire access tokens across any combination of resource and tenant where it has permission to do so. Refresh tokens are encrypted and only the Microsoft identity platform can read them.

## Token lifetime

Refresh tokens have a longer lifetime than access tokens. The default lifetime for the refresh tokens is 24 hours for single page apps and 90 days for all other scenarios. Refresh tokens replace themselves with a fresh token upon every use. The Microsoft identity platform doesn't revoke old refresh tokens when used to fetch new access tokens. Securely delete the old refresh token after acquiring a new one. Refresh tokens need to be stored safely like access tokens or application credentials.

> [!IMPORTANT]
> Refresh tokens sent to a redirect URI registered as `spa` expire after 24 hours. Additional refresh tokens acquired using the initial refresh token carry over that expiration time, so apps must be prepared to rerun the authorization code flow using an interactive authentication to get a new refresh token every 24 hours. Users don't have to enter their credentials and usually don't even see any related user experience, just a reload of your application. The browser must visit the sign-in page in a top-level frame to show the login session. This is due to [privacy features in browsers that block third party cookies](reference-third-party-cookies-spas.md).

## Token expiration

Refresh tokens can be revoked at any time, because of timeouts and revocations. Your app must handle revocations by the sign-in service gracefully by sending the user to an interactive sign-in prompt to sign in again.

### Token timeouts

You can't configure the lifetime of a refresh token. You can't reduce or lengthen their lifetime. Configure sign-in frequency in Conditional Access to define the time periods before a user is required to sign in again. For more information, see [Configuring authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

Not all refresh tokens follow the rules set in the token lifetime policy. Specifically, refresh tokens used in single page apps are always fixed to 24 hours of activity, as if they have a `MaxAgeSessionSingleFactor` policy of 24 hours applied to them.

### Token revocation

The server can revoke refresh tokens because of a change in credentials, user action, or admin action. Refresh tokens fall into two classes: tokens issued to confidential clients (the rightmost column) and tokens issued to public clients (all other columns).

| Change | Password-based cookie | Password-based token | Non-password-based cookie | Non-password-based token | Confidential client token |
| ------ | --------------------- | -------------------- | ------------------------- | ------------------------ | ------------------------- |
| Password expires | Stays alive | Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User revokes their refresh tokens | Revoked | Revoked | Revoked | Revoked | Revoked |
| Admin revokes all refresh tokens for a user | Revoked | Revoked | Revoked | Revoked | Revoked |
| Single sign-out | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

## See also


- [Access tokens in the Microsoft identity platform](access-tokens.md) 
- [ID tokens in the Microsoft identity platform](id-tokens.md)
- [Invalidate refresh token](https://learn.microsoft.com/powershell/module/microsoft.graph.beta.users.actions/invoke-mgbetainvalidateuserrefreshtoken?view=graph-powershell-beta.md)
- [Single sign-out](v2-protocols-oidc.md#single-sign-out)

## Next steps

- Learn about [configurable token lifetimes](configurable-token-lifetimes.md)
