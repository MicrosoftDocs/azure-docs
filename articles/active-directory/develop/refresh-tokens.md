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

When a client acquires an access token to access a protected resource, the client also receives a refresh token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires. The refresh token is bound to a combination of user and client. Refresh tokens are used only with authorization servers and are never sent to resource servers. Refresh tokens can be used to obtain extra access tokens with similar or lesser permissions and scope. 

A refresh token can be revoked at any time, and the token's validity is checked every time the token is used. Refresh tokens are not revoked when used to fetch new access tokens. The best practice, however, is to securely delete the old token when getting a new one.

Whenever access tokens expire but still need to access a resource that is protected, refresh tokens are used to acquire new access tokens. This happens without prompting the user to reauthenticate. It's important to make a distinction between confidential clients and public clients, as this impacts how long refresh tokens can be used. For more information about different types of clients, see RFC 6749.

## Refresh token lifetimes

Refresh tokens need to be stored safely in line with stringent requirements since they have a long lifetime and are used to obtain access tokens. The tokens can, however, be invalidated or revoked at any time, for different reasons. These reasons fall into two main categories: timeouts and revocations

### Token timeouts

Using [token lifetime configuration](active-directory-configurable-token-lifetimes#refresh-and-session-token-lifetime-policy-properties), the lifetime of refresh tokens can be altered. Tokens can go without use and expire. This is a normal occurrence. For example, the user does not open the app for three months. Apps will come across scenarios where the sign-in server rejects a refresh token because of its age. These scenarios include:

* MaxInactiveTime: If the refresh token hasn't been used within the time dictated by the MaxInactiveTime, the Refresh Token will no longer be valid.
* MaxSessionAge: If MaxAgeSessionMultiFactor or MaxAgeSessionSingleFactor have been set to something other than their default (Until-revoked), then reauthentication will be required after the time set in the MaxAgeSession* elapses.
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
