---
title: Use Azure AD v2.0 to sign in users using ROPC | Microsoft Docs
description: Build embedded and browser-less authentication flows using the device code grant.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 7abdf119-8200-45d7-9f40-940d612c01f7
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/5/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# Azure Active Directory v2.0 and the OAuth 2.0 resource owner password credential

Azure AD supports the [resource owner password credential grant](https://tools.ietf.org/html/rfc6749#section-4.3) (ROPC), which allows an application to sign in the user by directly handling their password.  Because this flow requires a high degree of trust and user exposure, the ROPC flow should only be used when the other, more secure flows, cannot be used.

> [!Important]
> The v2.0 endpoint only supports ROPC for Azure AD tenants, not personal accounts.  This means that you must use a tenanted endpoint or the organizations endpoint.  
>
> Personal accounts that are invited to an Azure AD tenant cannot use ROPC.
>
> Accounts that don't have passwords cannot sign in via ROPC - for this reason, we encourage your app to use a different flow instead.
>
> If a user would have to perform MFA to log in to the application, they will be blocked instead.


> [!NOTE]
> The v2.0 endpoint doesn't support all Azure Active Directory scenarios and features. To determine whether you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).
>

## Protocol diagram

The ROPC flow looks similar to the next diagram.

![ROPC flow](media/v2-oauth2-ropc/v2-oauth-ropc.png)

## Authorization request

The ROPC flow is a single request - sending the client identification and user's credentials to the IDP, and receiving tokens back.  The client must request the user's email address (UPN) and password before doing so.  Immediately after a succesful request, the client should securely release the user's credentials from memory.  It must never save them.

```
// Line breaks and spaces are for legibility only.

POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?

client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&scope=user.read%20openid%20profile%20offline_access
&client_secret=wkubdywbc2894u
&username=MyUsername@myTenant.com
&password=SuperS3cret
&grant_type=password
```

| Parameter | Condition | Description |
| --- | --- | --- |
| tenant |Required |The directory tenant that you want to log the user into. This can be in GUID or friendly name format, and cannot be `common` or `consumers` but may be `organizations`.  |
| grant_type |Required | Must be `password`.  |
|username| Required| The user's email address. |
|password| Required| The user's password.  |
| scope | Recommended | A space-separated list of [scopes](v2-permissions-and-consent.md) that the app requires.  These must be consented to ahead of time, either by an admin or by the user in an interactive flow. |

### Succesful authentication response

A successful token response will look like:

```json
{
    "token_type": "Bearer",
    "scope": "User.Read profile openid email",
    "expires_in": 3599,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
    "refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD..."
}
```

| Parameter | Format | Description |
| --------- | ------ | ----------- |
|`token_type` | String| Always "Bearer. |
|`scope` | Space seperated strings | If an access token was returned, this lists the scopes the access token is valid for. |
|`expires_in`| int | Number of seconds before the included access token is valid for. |
|`access_token`| Opaque string | Issued for the [scopes](v2-permissions-and-consent.md) that were requested.  |
|`id_token`   | JWT | Issued if the original `scope` parameter included the `openid` scope.  |
|`refresh_token` | Opaque string | Issued if the original `scope` parameter included `offline_access`.  |

The refresh token can be used to acquire new access tokens and refresh tokens using the same flow detailed in the [OAuth Code flow documentation](v2-oauth2-auth-code-flow.md#refresh-the-access-token).  

### Error response

If the user has not provided the correct username or password, or the client has not recieved the consent requested, the authentication will fail.

| Error | Description | Client Action |
|------ | ----------- | -------------|
| `invalid_grant` | The authentication failed. | The credentials were incorrect or the client does not have consent for the requested scopes.  If the scopes are not granted, a suberror will be returned - `consent_required`.  If this occurs, the client should send the user to an interactive prompt using a webview or browser.|