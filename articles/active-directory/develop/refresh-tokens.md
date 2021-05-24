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
ms.date: 04/02/2021
ms.author: shermanouko
ms.reviewer: mmacy, hirsin
ms.custom: aaddev, identityplatformtop40, fasttrack-edit
---

# Microsoft identity platform refresh tokens

When a client acquires an access token to access a protected resource, the client usually also receives a refresh token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires, and to acquire additional access tokens for other resources. Refresh tokens are bound to a combination of user and client, but are not locked with respect to resources or tenant - this allows a client to use a refresh token to acquire access tokens across any combination of resource and tenant where it has permission to do so. 

Refresh tokens have a significantly longer lifetime than access tokens - 90 days, by default - and replace themselves with a fresh token upon every use. The Microsoft identity platform does not revoke refresh tokens when used to fetch new access tokens, so the best practice is to securely delete the old token when getting a new one. 

Whenever access tokens expire but still need to access a resource that is protected, refresh tokens are used to acquire new access tokens. This happens without prompting the user to reauthenticate. It's important to make a distinction between confidential clients and public clients, as this impacts how long refresh tokens can be used. For more information about different types of clients, see RFC 6749.

## Refresh token expiration

Refresh tokens need to be stored safely in line with stringent requirements since they have a long lifetime and are used to obtain access tokens. The tokens can, however, be invalidated or revoked at any time, for different reasons. These reasons fall into two main categories: timeouts and revocations

### Token timeouts

Using [token lifetime configuration](active-directory-configurable-token-lifetimes#refresh-and-session-token-lifetime-policy-properties), the lifetime of refresh tokens can be reduced or lengthened. This setting changes the length of time that a refresh token can go without use. For example, if a user does not open an app for three months, when the app attempts to use that 90+ day old refresh token it will find that it has expired. Additionally, an admin can  require that second factors be used on a regular cadence, forcing the user to manually sign in at specific intervals. These scenarios include:

* Inactivity: refresh tokens are only valid for a period dictated by the `MaxInactiveTime`.  If the token is not used (and replaced by the new token) within that time period, it will no longer be usable.
* Session age-out: If `MaxAgeSessionMultiFactor` or `MaxAgeSessionSingleFactor` have been set to something other than their default (Until-revoked), then reauthentication will be required after the time set in the MaxAgeSession* elapses.  This is used to force users to re-authenticate with a first or second factor periodically. 
* Examples:
  * The tenant has a MaxInactiveTime of five days, and the user went on vacation for a week. As such, Azure AD hasn't seen a new token request from the user in seven days. The next time the user requests a new token, they'll find their Refresh Token has been revoked, and they must enter their credentials again.
  * A sensitive application has a MaxAgeSessionSingleFactor of one day. If a user logs in on Monday, and on Tuesday (after 25 hours have elapsed), they'll be required to reauthenticate.

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
| Single sign-out ([v1.0](../azuread-dev/v1-protocols-openid-connect-code.md#single-sign-out), [v2.0](v2-protocols-oidc.md#single-sign-out) ) on web | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

## Next steps

* Learn about [ID tokens in Azure AD](id-tokens.md).
* Learn about [Access tokens in Azure AD](access-tokens.md).
* Check out [Primary Refresh Tokens](../devices/concept-primary-refresh-token.md) for more details on primary refresh tokens.
