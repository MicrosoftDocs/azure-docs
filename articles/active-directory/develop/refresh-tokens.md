---
title: Microsoft identity platform refresh tokens | Azure
titleSuffix: Microsoft identity platform
description: Learn about refresh tokens emitted by the Azure AD.
services: active-directory
author: SHERMANOUKO
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: shermanouko
ms.reviewer: mmacy, hirsin
ms.custom: aaddev, identityplatformtop40, fasttrack-edit
---

# Microsoft identity platform refresh tokens

When a client acquires an access token to access a protected resource, the client also receives a refresh token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires. Refresh tokens are also used to acquire extra access tokens for other resources. Refresh tokens are bound to a combination of user and client, but aren't tied to a resource or tenant. As such, a client can use a refresh token to acquire access tokens across any combination of resource and tenant where it has permission to do so. Refresh tokens are encrypted and only the Microsoft identity platform can read them.

## Prerequisites

Before reading through this article, it's recommended that you go through the following articles:

* [ID tokens](id-tokens.md) in the Microsoft identity platform.
* [Access tokens](access-tokens.md) in the Microsoft identity platform.

## Refresh token lifetime

Refresh tokens have a longer lifetime than access tokens. The default lifetime for the tokens is 90 days and they replace themselves with a fresh token upon every use. As such, whenever a refresh token is used to acquire a new access token, a new refresh token is also issued. The Microsoft identity platform doesn't revoke old refresh tokens when used to fetch new access tokens. Securely delete the old refresh token after acquiring a new one. Refresh tokens need to be stored safely like access tokens or application credentials. 

## Refresh token expiration

Refresh tokens can be revoked at any time, because of timeouts and revocations. Your app must handle rejections by the sign-in service gracefully when this occurs. This is done by sending the user to an interactive sign-in prompt to sign in again. 

### Token timeouts

You can't configure the lifetime of a refresh token. You can't reduce or lengthen their lifetime. Configure sign-in frequency in Conditional Access to define the time periods before a user is required to sign in again. Learn more about [Configuring authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

Not all refresh tokens follow the rules set in the token lifetime policy. Specifically, refresh tokens used in [single page apps](reference-third-party-cookies-spas.md) are always fixed to 24 hours of activity, as if they have a `MaxAgeSessionSingleFactor` policy of 24 hours applied to them. 

### Revocation

Refresh tokens can be revoked by the server because of a change in credentials, user action, or admin action.  Refresh tokens fall into two classes: tokens issued to confidential clients (the rightmost column) and tokens issued to public clients (all other columns).

| Change | Password-based cookie | Password-based token | Non-password-based cookie | Non-password-based token | Confidential client token |
|---|-----------------------|----------------------|---------------------------|--------------------------|---------------------------|
| Password expires | Stays alive | Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User revokes their refresh tokens [via PowerShell](/powershell/module/azuread/revoke-azureadsignedinuserallrefreshtoken) | Revoked | Revoked | Revoked | Revoked | Revoked |
| Admin revokes all refresh tokens for a user [via PowerShell](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) | Revoked | Revoked |Revoked | Revoked | Revoked |
| Single sign-out [on web](v2-protocols-oidc.md#single-sign-out) | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

## Next steps

* Learn about [configurable token lifetimes](active-directory-configurable-token-lifetimes.md)
* Check out [Primary Refresh Tokens](../devices/concept-primary-refresh-token.md) for more details on primary refresh tokens.
