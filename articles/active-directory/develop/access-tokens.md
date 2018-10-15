---
title: Azure Active Directory access tokens reference | Microsoft Docs
description: Learn about access tokens emitted by the v1.0 and v2.0 endpoints of Azure AD. 
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/02/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# Azure Active Directory access tokens

Access tokens enable clients to securely call APIs protected by Azure. Azure Active Directory (Azure AD) access tokens are [JWTs](https://tools.ietf.org/html/rfc7519), Base64 encoded JSON objects signed by Azure. Clients should treat access tokens as opaque strings, as the contents of the token are intended for the resource only. For validation and debugging purposes, developers can decode JWTs using a site like [jwt.ms](https://jwt.ms). Your client can get an access token from either endpoint (v1.0 or v2.0) using a variety of protocols.

When you request an access token, Azure AD also returns some metadata about the access token for your app's consumption. This information includes the expiry time of the access token and the scopes for which it is valid. This data allows your app to perform intelligent caching of access tokens without having to parse the access token itself.

If your application is a resource (web API) that clients can request access to, access tokens provide helpful information for use in authentication and authorization, such as the user, client, issuer, permissions, and more. 

See the following sections to learn how a resource can validate and use the claims inside an access token.

> [!NOTE]
> While testing your client application with a personal account (such as hotmail.com or outlook.com), you may find that the access token received by your client is an opaque string. This is because the resource being accessed has requested legacy MSA (Microsoft account) tickets that are encrypted and cannot be understood by the client.

## Sample tokens

v1.0 and v2.0 tokens look very similar and contain many of the same claims. An example of each is provided here.

### v1.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0=.D3H6pMUtQnoJAGq6AHd
```

View this v1.0 token in [JWT.ms](https://jwt.ms/#access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0=.D3H6pMUtQnoJAGq6AHd).

### v2.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt
```

View this v2.0 token in [JWT.ms](https://jwt.ms/#access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt).

## Claims in access tokens

JWTs are split into three pieces: 

* **Header** - Provides information about how to [validate the token](#validating-tokens) including information about the type of token and how it was signed.
* **Payload** - Contains all of the important data about the user or app that is attempting to call your service.
* **Signature** - Is the raw material used to validate the token.

Each piece is separated by a period (`.`) and separately Base64 encoded.

Claims are present only if a value exists to fill it. Thus, your app should not take a dependency on a claim being present. Examples include `pwd_exp` (not every tenant requires passwords to expire) or `family_name` ([client credential](v1-oauth2-client-creds-grant-flow.md) flows are on behalf of applications, which don't have names). Claims used for access token validation will always be present.

> [!NOTE]
> Some claims are used to help Azure AD secure tokens in case of reuse. These are marked as not being for public consumption in the description as "Opaque". These claims may or may not appear in a token, and new ones may be added without notice.

### Header claims

|Claim | Format | Description |
|--------|--------|-------------|
| `typ` | String - always "JWT" | Indicates that the token is a JWT.|
| `nonce` | String | A unique identifier used to protect against token replay attacks. Your resource can record this value to protect against replays. |
| `alg` | String | Indicates the algorithm that was used to sign the token, for example, "RS256" |
| `kid` | String | Specifies the thumbprint for the public key that's used to sign this token. Emitted in both v1.0 and v2.0 access tokens. |
| `x5t` | String | Functions the same (in use and value) as `kid`. This is a legacy claim emitted only in v1.0 access tokens for compatibility purposes. |

### Payload claims

| Claim | Format | Description |
|-----|--------|-------------|
| `aud` | String, an App ID URI | Identifies the intended recipient of the token. In access tokens, the audience is your app's Application ID, assigned to your app in the Azure portal. Your app should validate this value and reject the token if the value does not match. |
| `iss` | String, an STS URI | Identifies the security token service (STS) that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in `/v2.0`. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if applicable. |
|`idp`|String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account not in the same tenant as the issuer - guests, for instance. If the claim is not present, it means that the value of `iss` can be used instead.  For personal accounts being used in an orgnizational context (for instance, a personal account invited to an Azure AD tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. |  
| `iat` | int, a UNIX timestamp | "Issued At" indicates when the authentication for this token occurred. |
| `nbf` | int, a UNIX timestamp | The "nbf" (not before) claim identifies the time before which the JWT must not be accepted for processing. |
| `exp` | int, a UNIX timestamp | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT must not be accepted for processing. It's important to note that a resource may reject the token before this time as well, such as when a change in authentication is required or a token revocation has been detected. |
| `acr` | String, a "0" or "1" | The "Authentication context class" claim. A value of "0" indicates the end-user authentication did not meet the requirements of ISO/IEC 29115. |
| `aio` | Opaque String | An internal claim used by Azure AD to record data for token reuse. Resources should not use this claim. |
| `amr` | JSON array of strings | Only present in v1.0 tokens. Identifies how the subject of the token was authenticated. See [the amr claim section](#the-amr-claim) for more details. |
| `appid` | String, a GUID | Only present in v1.0 tokens. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. |
| `appidacr` | "0", "1", or "2" | Only present in v1.0 tokens. Indicates how the client was authenticated. For a public client, the value is "0". If client ID and client secret are used, the value is "1". If a client certificate was used for authentication, the value is "2". |
| `azp` | String, a GUID | Only present in v2.0 tokens. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. |
| `azpacr` | "0", "1", or "2" | Only present in v2.0 tokens. Indicates how the client was authenticated. For a public client, the value is "0". If client ID and client secret are used, the value is "1". If a client certificate was used for authentication, the value is "2". |
| `groups` | JSON array of GUIDs | Provides object IDs that represent the subject's group memberships. These values are unique (see Object ID) and can be safely used for managing access, such as enforcing authorization to access a resource. The groups included in the groups claim are configured on a per-application basis, through the `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md). A value of null will exclude all groups, a value of "SecurityGroup" will include only Active Directory Security Group memberships, and a value of "All" will include both Security Groups and Office 365 Distribution Lists. <br><br>See the `hasgroups` claim below for details on using the `groups` claim with the implicit grant. <br>For other flows, if the number of groups the user is in goes over a limit (150 for SAML, 200 for JWT), then an overage claim will be added to the claim sources pointing at the Graph endpoint containing the list of groups for the user. |
| `hasgroups` | Boolean | If present, always `true`, denoting the user is in at least one group. Used in place of the `groups` claim for JWTs in implicit grant flows if the full groups claim would extend the URI fragment beyond the URL length limits (currently 6 or more groups). Indicates that the client should use the Graph to determine the user's groups (`https://graph.windows.net/{tenantID}/users/{userID}/getMemberObjects`). |
| `groups:src1` | JSON object | For token requests that are not length limited (see `hasgroups` above) but still too large for the token, a link to the full groups list for the user will be included. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.windows.net/{tenantID}/users/{userID}/getMemberObjects" }`|
| `preferred_name` | String | Only present in v2.0 tokens. The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. The `profile` scope is required in order to receive this claim. |
| `name` | String | Provides a human-readable value that identifies the subject of the token. The value is not guaranteed to be unique, it is mutable, and it's designed to be used only for display purposes. The `profile` scope is required in order to receive this claim. |
| `oid` | String, a GUID | The immutable identifier for an object in the Microsoft identity platform, in this case, a user account. It can also be used to perform authorization checks safely and as a key in database tables. This ID uniquely identifies the user across applications - two different applications signing in the same user will receive the same value in the `oid` claim. Thus, `oid` can be used when making queries to Microsoft online services, such as the Microsoft Graph. The Microsoft Graph will return this ID as the `id` property for a given user account. Because the `oid` allows multiple apps to correlate users, the `profile` scope is required in order to receive this claim. Note that if a single user exists in multiple tenants, the user will contain a different object ID in each tenant - they are considered different accounts, even though the user logs into each account with the same credentials. |
| `rh` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources should not use this claim. |
| `scp` | String, a space separated list of scopes | The set of scopes exposed by your application for which the client application has requested (and received) consent. Your app should verify that these scopes are valid ones exposed by your app, and make authorization decisions based on the value of these scopes. Only included for [user tokens](#user-and-application-tokens). |
| `roles`| String, a space separated list of permissions | The set of permissions exposed by your application that the requesting application has been given permission to call. This is used during the [client-credentials](v1-oauth2-client-creds-grant-flow.md) flow in place of user scopes, and is only present in [applications tokens](#user-and-application-tokens). |
| `sub` | String, a GUID | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource, and can be used as a key in database tables. Because the subject is always present in the tokens that Azure AD issues, we recommend using this value in a general-purpose authorization system. The subject is, however, a pairwise identifier - it is unique to a particular application ID. Therefore, if a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim. This may or may not be desired depending on your architecture and privacy requirements. |
| `tid` | String, a GUID | Represents the Azure AD tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. The `profile` scope is required in order to receive this claim. |
| `unique_name` | String | Only present in v1.0 tokens. Provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and should be used only for display purposes. |
| `upn` | String | The username of the user. May be a phone number, email address, or unformatted string. Should only be used for display purposes and providing username hints in reauthentication scenarios. |
| `uti` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources should not use this claim. |
| `ver` | String, either 1.0 or 2.0 | Indicates the version of the access token. |

#### v1.0 basic claims

The following claims will be included in v1.0 tokens if applicable, but are not included in v2.0 tokens by default. If you are using v2.0 and need one of these claims, request them using [optional claims](active-directory-optional-claims.md).

| Claim | Format | Description |
|-----|--------|-------------|
| `ipaddr`| String | The IP address the user authenticated from. |
| `onprem_sid`| String, in [SID format](https://docs.microsoft.com/windows/desktop/SecAuthZ/sid-components) | In cases where the user has an on-premises authentication, this claim provides their SID. This can be used for authorization in legacy applications. |
| `pwd_exp`| int, a UNIX timestamp | Indicates when the user's password expires. |
| `pwd_url`| String | A URL where users can be sent to reset their password. |
| `in_corp`|boolean | Signals if the client is logging in from the corporate network. If they are not, the claim is not included. |
| `nickname`| String | An additional name for the user, separate from first or last name.|
| `family_name` | String | Provides the last name, surname, or family name of the user as defined on the user object. |
| `given_name` | String | Provides the first or given name of the user, as set on the user object. |

#### The `amr` claim

Microsoft identities can authenticate in a variety of ways, which may be relevant to your application. The `amr` claim is an array that can contain multiple items,such as `["mfa", "rsa", "pwd"]`, for an authentication that used both a password and the Authenticator app. 

| Value | Description |
|-----|-------------|
| `pwd` | Password authentication, either a user's Microsoft password or an app's client secret. |
| `rsa` | Authentication was based on the proof of an RSA key, for example with the [Microsoft Authenticator pp](https://aka.ms/AA2kvvu). This includes if authentication was performed by a self-signed JWT with a service owned X509 certificate. |
| `otp` | One-time passcode using an email or a text message. |
| `fed` | A federated authentication assertion (such as JWT or SAML) was used. |
| `wia` | Windows Integrated Authentication |
| `mfa` | Multi-factor authentication was used. When this is present the other authentication methods will also be included. |
| `ngcmfa` | Equivalent to `mfa`, used for provisioning of certain advanced credential types. |
| `wiaormfa`| The user used Windows or an MFA credential to authenticate. |
| `none` | No authentication was performed. |

## Validating tokens

To validate an id_token or an access_token, your app should validate both the token's signature and the claims. In order to validate access tokens, your app should also validate the issuer, the audience and the signing tokens. These need to be validated against the values in the OpenID discovery document. For example, the tenant independent version of the document is located at [https://login.microsoftonline.com/common/.well-known/openid-configuration](https://login.microsoftonline.com/common/.well-known/openid-configuration). 

The Azure AD middleware has built-in capabilities for validating access tokens, and you can browse through our [samples](https://docs.microsoft.com/azure/active-directory/active-directory-code-samples) to find one in the language of your choice. For more information on how to explicitly validate a JWT token, see the [manual JWT validation sample](https://github.com/Azure-Samples/active-directory-dotnet-webapi-manual-jwt-validation). 

We provide libraries and code samples that show how to easily handle token validation. The below information is provided for those who wish to understand the underlying process. There are also several third-party open source libraries available for JWT validation - there is at least one option for almost every platform and language out there. For more information about Azure AD authentication libraries and code samples, see [v1.0 authentication libraries](active-directory-authentication-libraries.md) and [v2.0 authentication libraries](reference-v2-libraries.md).

### Validating the signature

A JWT contains three segments, which are separated by the `.` character. The first segment is known as the **header**, the second as the **body**, and the third as the **signature**. The signature segment can be used to validate the authenticity of the token so that it can be trusted by your app.

Tokens issued by Azure AD are signed using industry standard asymmetric encryption algorithms, such as RSA 256. The header of the JWT contains information about the key and encryption method used to sign the token:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "x5t": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk",
  "kid": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk"
}
```

The `alg` claim indicates the algorithm that was used to sign the token, while the `kid` claim indicates the particular public key that was used to sign the token.

At any given point in time, Azure AD may sign an id_token using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

You can acquire the signing key data necessary to validate the signature by using the OpenID Connect metadata document located at:

```
https://login.microsoftonline.com/common/.well-known/openid-configuration
```

> [!TIP]
> Try this URL in a browser!

This metadata document:

* Is a JSON object containing several useful pieces of information, such as the location of the various endpoints required for performing OpenID Connect authentication. 
* Includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens. The JSON document located at the `jwks_uri` contains all of the public key information in use at that particular moment in time. Your app can use the `kid` claim in the JWT header to select which public key in this document has been used to sign a particular token. It can then perform signature validation using the correct public key and the indicated algorithm.

> [!NOTE]
> The v1.0 endpoint returns both the `x5t` and `kid` claims. The `x5t` claim is missing from v2.0 tokens. The v2.0 endpoint responds with the `kid` claim. Going forward, we recommend using the `kid` claim to validate your token.

Performing signature validation is outside the scope of this document - there are many open source libraries available for helping you do so if necessary.

### Claims based authorization

Your application's business logic will dictate this step, some common authorization methods are laid out below.

* Check the `scp` or `roles` claim to verify that all present scopes match those exposed by your API, and allow the client to perform the requested action.
* Ensure the calling client is allowed to call your API using the `appid` claim.
* Validate the authentication status of the calling client using `appidacr` - it should not be 0 if public clients are not allowed to call your API.
* Check against a list of past `nonce` claims to verify the token is not being replayed.
* Check that the `tid` matches a tenant that is allowed to call your API.
* Use the `acr` claim to verify the user has performed MFA. Note that this should be enforced using [conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview).
* If you've requested the `roles` or `groups` claims in the access token, verify that the user is in the group allowed to perform this action.
  * For tokens retrieved using the implicit flow, you'll likely need to query the [Graph](https://developer.microsoft.com/graph/) for this data, as it's often too large to fit in the token. 

## User and application tokens

Your application may receive tokens on behalf of a user (the usual flow) or directly from an application (through the [client credentials flow](v1-oauth2-client-creds-grant-flow.md)). These app-only tokens indicate that this call is coming from an application and does not have a user backing it. These tokens are handled largely the same, with some differences:

* App-only tokens will not have a `scp` claim, and will instead have a `roles` claim. This is where application permission (as opposed to delegated permissions) will be recorded. For more information about delegated and application permissions, see permission and consent in [v1.0](v1-permissions-and-consent.md) and [v2.0](v2-permissions-and-consent.md).
* Many human-specific claims will be missing, such as `name`.

## Token revocation

Refresh tokens can be invalidated or revoked at any time, for a variety of reasons. These fall into two main categories: timeouts and revocations.

### Token timeouts

* MaxInactiveTime: If the refresh token has not been used within the time dictated by the MaxInactiveTime, the Refresh Token will no longer be valid. 
* MaxSessionAge: If MaxAgeSessionMultiFactor or MaxAgeSessionSingleFactor have been set to something other than their default (Until-revoked), then reauthentication will be required after the time set in the MaxAgeSession* elapses. 
* Examples:
  * The tenant has a MaxInactiveTime of 5 days, and the user went on vacation for a week, and so AAD has not seen a new token request from the user in 7 days. The next time the user requests a new token, they will find their Refresh Token has been revoked, and they must enter their credentials again.
  * A sensitive application has a MaxAgeSessionSingleFactor of 1 day. If a user logs in on Monday, and on Tuesday (after 25 hours have elapsed), they will be required to reauthenticate.

### Revocation

|   | Password based cookie | Password based token | Non-password based cookie | Non-password based token | Confidential client token| 
|---|-----------------------|----------------------|---------------------------|--------------------------|--------------------------|
| Password expires | Stays alive| Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User revokes their refresh tokens [via PowerShell](https://docs.microsoft.com/powershell/module/azuread/revoke-azureadsignedinuserallrefreshtoken) | Revoked | Revoked |Revoked | Revoked |Revoked | Revoked |
| Admin revokes all refresh tokens for the tenant [via PowerShell](https://docs.microsoft.com/powershell/module/azuread/revoke-azureaduserallrefreshtoken) | Revoked | Revoked |Revoked | Revoked |Revoked | Revoked |
| [Single sign-out](v1-protocols-openid-connect-code.md#single-sign-out) on web | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

> [!NOTE]
> A "Non-password based" login is one where the user didn't type in a password to get it. For example, using your face with Windows Hello, a FIDO key, or a PIN. 
>
> A known issue exists with the Windows Primary Refresh Token. If the PRT is obtained via a password, and then the user logs in via Hello, this does not change the origination of the PRT, and it will be revoked if the user changes their password.

## Next steps

* Learn about [`id_tokens` in Azure AD](id-tokens.md).
* Learn about permission and consent in [v1.0](v1-permissions-and-consent.md) and [v2.0](v2-permissions-and-consent.md).
