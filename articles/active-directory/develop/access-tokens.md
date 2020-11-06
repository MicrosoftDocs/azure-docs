---
title: Microsoft identity platform access tokens | Azure
titleSuffix: Microsoft identity platform
description: Learn about access tokens emitted by the Azure AD v1.0 and Microsoft identity platform (v2.0) endpoints.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 10/27/2020
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev, identityplatformtop40, fasttrack-edit
---

# Microsoft identity platform access tokens

Access tokens enable clients to securely call protected web APIs, and are used by web APIs to perform authentication and authorization. Per the OAuth specification, access tokens are opaque strings without a set format - some identity providers (IDPs) use GUIDs, others use encrypted blobs. The Microsoft identity platform uses a variety of access token formats depending on the configuration of the API that accepts the token. [Custom APIs registered by developers](quickstart-configure-app-expose-web-apis.md) on the Microsoft identity platform can choose from two different formats of JSON Web Tokens (JWTs), called "v1" and "v2", and Microsoft-developed APIs like MS Graph or APIs in Azure have additional proprietary token formats. These proprietary formats might be encrypted tokens, JWTs, or special JWT-like tokens that will not validate. 

Clients must treat access tokens as opaque strings because the contents of the token are intended for the resource (the API) only. For validation and debugging purposes *only*, developers can decode JWTs using a site like [jwt.ms](https://jwt.ms). Be aware, however, that the tokens you receive for a Microsoft API might not always be a JWT, and that you can't always decode them. 

For details on what is inside the access token, clients should use the token response data that's returned with the access token to your client. When your client requests an access token, Microsoft identity platform also returns some metadata about the access token for your app's consumption. This information includes the expiry time of the access token and the scopes for which it's valid. This data allows your app to do intelligent caching of access tokens without having to parse the access token itself.

See the following sections to learn how your API can validate and use the claims inside an access token.  

> [!NOTE]
> All documentation on this page, except where noted, applies only to tokens issued for APIs you've registered.  It does not apply to tokens issued for Microsoft-owned APIs, nor can those tokens be used to validate how the Microsoft identity platform will issue tokens for an API you create.  

## Token formats and ownership

### v1.0 and v2.0 

There are two versions of access tokens available in the Microsoft identity platform: v1.0 and v2.0.  These versions govern what claims are in the token, ensuring that a web API can control what their tokens look like. Web APIs have one of these selected as a default during registration - v1.0 for Azure AD-only apps, and v2.0 for apps that support consumer accounts.  This is controllable by applications using the `accessTokenAcceptedVersion` setting in the [app manifest](reference-app-manifest.md#manifest-reference), where `null` and `1` result in v1.0 tokens, and `2` results in v2.0 tokens. 

### What app is a token "for"? 

There are two parties involved in an access token request - the client, who requests the token, and the resource or API, that will accept the token on an API call. The `aud` claim in a token indicates the resource of the token.  Clients use the token, but should not understand it or attmept to parse it.  Resources accept the token.  

The Microosft Identity platform supports issuing any token version from any version endpoint - they are not related. This is why a resource setting `accessTokenAcceptedVersion` to `2` means that a client calling the v1.0 endpoint to get a token for that API will receive a v2.0 access token.  Resources always own their tokens (those with their `aud` claim) and are the only applications that can change their token details. This is why changing the access token [optional claims](active-directory-optional-claims.md) for your *client* does not change the access token received when a token is requested for `user.read`, which is owned by the MS Graph resource.


### Sample tokens

v1.0 and v2.0 tokens look similar and contain many of the same claims. An example of each is provided here (note that they will not [validate](#validating-tokens), as the keys have rotated since publication and they have been edited for personal information. 

#### v1.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0.D3H6pMUtQnoJAGq6AHd
```

View this v1.0 token in [JWT.ms](https://jwt.ms/#access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0.D3H6pMUtQnoJAGq6AHd).

#### v2.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt
```

View this v2.0 token in [JWT.ms](https://jwt.ms/#access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt).

## Claims in access tokens

JWTs (JSON Web Tokens) are split into three pieces:

* **Header** - Provides information about how to [validate the token](#validating-tokens) including information about the type of token and how it was signed.
* **Payload** - Contains all of the important data about the user or app that is attempting to call your service.
* **Signature** - Is the raw material used to validate the token.

Each piece is separated by a period (`.`) and separately Base64 encoded.

Claims are present only if a value exists to fill it. So, your app shouldn't take a dependency on a claim being present. Examples include `pwd_exp` (not every tenant requires passwords to expire) or `family_name` ([client credential] (v2-oauth2-client-creds-grant-flow.md) flows are on behalf of applications, which don't have names). Claims used for access token validation will always be present.

> [!NOTE]
> Some claims are used to help Azure AD secure tokens in case of reuse. These are marked as not being for public consumption in the description as "Opaque". These claims may or may not appear in a token, and new ones may be added without notice.

### Header claims

|Claim | Format | Description |
|--------|--------|-------------|
| `typ` | String - always "JWT" | Indicates that the token is a JWT.|
| `nonce` | String | A unique identifier used to protect against token replay attacks. Your resource can record this value to protect against replays. |
| `alg` | String | Indicates the algorithm that was used to sign the token, for example, "RS256" |
| `kid` | String | Specifies the thumbprint for the public key that's used to sign this token. Emitted in both v1.0 and v2.0 access tokens. |
| `x5t` | String | Functions the same (in use and value) as `kid`. `x5t` is a legacy claim emitted only in v1.0 access tokens for compatibility purposes. |

### Payload claims

| Claim | Format | Description |
|-----|--------|-------------|
| `aud` | String, an App ID URI or GUID | Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal. Your app should validate this value and reject the token if the value does not match. In v2.0 tokens this is always the client ID of the audience, while in v1.0 apps it can be the client ID or the resource URI used in the request, depending on how the client requested the token.|
| `iss` | String, an STS URI | Identifies the security token service (STS) that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. If the token issued is a v2.0 token (see the `ver` claim), the URI will end in `/v2.0`. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if applicable. |
|`idp`| String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account not in the same tenant as the issuer - guests, for instance. If the claim isn't present, it means that the value of `iss` can be used instead.  For personal accounts being used in an organizational context (for instance, a personal account invited to an Azure AD tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. |
| `iat` | int, a UNIX timestamp | "Issued At" indicates when the authentication for this token occurred. |
| `nbf` | int, a UNIX timestamp | The "nbf" (not before) claim identifies the time before which the JWT must not be accepted for processing. |
| `exp` | int, a UNIX timestamp | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT must not be accepted for processing. It's important to note that a resource may reject the token before this time as well, such as when a change in authentication is required or a token revocation has been detected. |
| `aio` | Opaque String | An internal claim used by Azure AD to record data for token reuse. Resources should not use this claim. |
| `acr` | String, a "0" or "1" | Only present in v1.0 tokens. The "Authentication context class" claim. A value of "0" indicates the end-user authentication did not meet the requirements of ISO/IEC 29115. |
| `amr` | JSON array of strings | Only present in v1.0 tokens. Identifies how the subject of the token was authenticated. See [the amr claim section](#the-amr-claim) for more details. |
| `appid` | String, a GUID | Only present in v1.0 tokens. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. |
| `azp` | String, a GUID | Only present in v2.0 tokens, a replacement for `appid`. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. |
| `appidacr` | "0", "1", or "2" | Only present in v1.0 tokens. Indicates how the client was authenticated. For a public client, the value is "0". If client ID and client secret are used, the value is "1". If a client certificate was used for authentication, the value is "2". |
| `azpacr` | "0", "1", or "2" | Only present in v2.0 tokens, a replacement for `appidacr`. Indicates how the client was authenticated. For a public client, the value is "0". If client ID and client secret are used, the value is "1". If a client certificate was used for authentication, the value is "2". |
| `preferred_username` | String | The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions.  It can be used for username hints, however, and in human-readable UI as a username. The `profile` scope is required in order to receive this claim. Present only in v2.0 tokens. |
| `name` | String | Provides a human-readable value that identifies the subject of the token. The value is not guaranteed to be unique, it is mutable, and it's designed to be used only for display purposes. The `profile` scope is required in order to receive this claim. |
| `scp` | String, a space separated list of scopes | The set of scopes exposed by your application for which the client application has requested (and received) consent. Your app should verify that these scopes are valid ones exposed by your app, and make authorization decisions based on the value of these scopes. Only included for [user tokens](#user-and-application-tokens). |
| `roles` | Array of strings, a list of permissions | The set of permissions exposed by your application that the requesting application or user has been given permission to call. For [application tokens](#user-and-application-tokens), this is used during the client credential flow ([v1.0](../azuread-dev/v1-oauth2-client-creds-grant-flow.md), [v2.0](v2-oauth2-client-creds-grant-flow.md)) in place of user scopes.  For [user tokens](#user-and-application-tokens) this is populated with the roles the user was assigned to on the target application. |
| `wids` | Array of [RoleTemplateID](../roles/permissions-reference.md#role-template-ids) GUIDs | Denotes the tenant-wide roles assigned to this user, from the section of roles present in [the admin roles page](../roles/permissions-reference.md#role-template-ids).  This claim is configured on a per-application basis, through the `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md).  Setting it to "All" or "DirectoryRole" is required.  May not be present in tokens obtained through the implicit flow due to token length concerns. |
| `groups` | JSON array of GUIDs | Provides object IDs that represent the subject's group memberships. These values are unique (see Object ID) and can be safely used for managing access, such as enforcing authorization to access a resource. The groups included in the groups claim are configured on a per-application basis, through the `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md). A value of null will exclude all groups, a value of "SecurityGroup" will include only Active Directory Security Group memberships, and a value of "All" will include both Security Groups and Microsoft 365 Distribution Lists. <br><br>See the `hasgroups` claim below for details on using the `groups` claim with the implicit grant. <br>For other flows, if the number of groups the user is in goes over a limit (150 for SAML, 200 for JWT), then an overage claim will be added to the claim sources pointing at the Microsoft Graph endpoint containing the list of groups for the user. |
| `hasgroups` | Boolean | If present, always `true`, denoting the user is in at least one group. Used in place of the `groups` claim for JWTs in implicit grant flows if the full groups claim would extend the URI fragment beyond the URL length limits (currently 6 or more groups). Indicates that the client should use the Microsoft Graph API to determine the user's groups (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`). |
| `groups:src1` | JSON object | For token requests that are not length limited (see `hasgroups` above) but still too large for the token, a link to the full groups list for the user will be included. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects" }` |
| `sub` | String | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource, and can be used as a key in database tables. Because the subject is always present in the tokens that Azure AD issues, we recommend using this value in a general-purpose authorization system. The subject is, however, a pairwise identifier - it is unique to a particular application ID. Therefore, if a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim. This may or may not be desired depending on your architecture and privacy requirements. See also the `oid` claim (which does remain the same across apps within a tenant). |
| `oid` | String, a GUID | The immutable identifier for an object in the Microsoft identity platform, in this case, a user account. It can also be used to perform authorization checks safely and as a key in database tables. This ID uniquely identifies the user across applications - two different applications signing in the same user will receive the same value in the `oid` claim. Thus, `oid` can be used when making queries to Microsoft online services, such as the Microsoft Graph. The Microsoft Graph will return this ID as the `id` property for a given [user account](/graph/api/resources/user). Because the `oid` allows multiple apps to correlate users, the `profile` scope is required in order to receive this claim. Note that if a single user exists in multiple tenants, the user will contain a different object ID in each tenant - they are considered different accounts, even though the user logs into each account with the same credentials. |
| `tid` | String, a GUID | Represents the Azure AD tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. The `profile` scope is required in order to receive this claim. |
| `unique_name` | String | Only present in v1.0 tokens. Provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and should be used only for display purposes. |
| `uti` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources shouldn't use this claim. |
| `rh` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources should not use this claim. |
| `ver` | String, either `1.0` or `2.0` | Indicates the version of the access token. |

**Groups overage claim**

To ensure that the token size doesn't exceed HTTP header size limits, Azure AD limits the number of object IDs that it includes in the groups claim. If a user is member of more groups than the overage limit (150 for SAML tokens, 200 for JWT tokens), then Azure AD does not emit the groups claim in the token. Instead, it includes an overage claim in the token that indicates to the application to query the Microsoft Graph API to retrieve the user's group membership.

```JSON
{
  ...
  "_claim_names": {
   "groups": "src1"
    },
    {
  "_claim_sources": {
    "src1": {
        "endpoint":"[Url to get this user's group membership from]"
        }
       }
     }
  ...
 }
 ```

You can use the `BulkCreateGroups.ps1` provided in the [App Creation Scripts](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-2-Groups/AppCreationScripts) folder to help test overage scenarios.

#### v1.0 basic claims

The following claims will be included in v1.0 tokens if applicable, but aren't included in v2.0 tokens by default. If you're using v2.0 and need one of these claims, request them using [optional claims](active-directory-optional-claims.md).

| Claim | Format | Description |
|-----|--------|-------------|
| `ipaddr`| String | The IP address the user authenticated from. |
| `onprem_sid`| String, in [SID format](/windows/desktop/SecAuthZ/sid-components) | In cases where the user has an on-premises authentication, this claim provides their SID. You can use `onprem_sid` for authorization in legacy applications.|
| `pwd_exp`| int, a UNIX timestamp | Indicates when the user's password expires. |
| `pwd_url`| String | A URL where users can be sent to reset their password. |
| `in_corp`| boolean | Signals if the client is logging in from the corporate network. If they aren't, the claim isn't included. |
| `nickname`| String | An additional name for the user, separate from first or last name.|
| `family_name` | String | Provides the last name, surname, or family name of the user as defined on the user object. |
| `given_name` | String | Provides the first or given name of the user, as set on the user object. |
| `upn` | String | The username of the user. May be a phone number, email address, or unformatted string. Should only be used for display purposes and providing username hints in reauthentication scenarios. |

#### The `amr` claim

Microsoft identities can authenticate in different ways, which may be relevant to your application. The `amr` claim is an array that can contain multiple items, such as `["mfa", "rsa", "pwd"]`, for an authentication that used both a password and the Authenticator app.

| Value | Description |
|-----|-------------|
| `pwd` | Password authentication, either a user's Microsoft password or an app's client secret. |
| `rsa` | Authentication was based on the proof of an RSA key, for example with the [Microsoft Authenticator app](https://aka.ms/AA2kvvu). This includes if authentication was done by a self-signed JWT with a service owned X509 certificate. |
| `otp` | One-time passcode using an email or a text message. |
| `fed` | A federated authentication assertion (such as JWT or SAML) was used. |
| `wia` | Windows Integrated Authentication |
| `mfa` | [Multi-factor authentication](../authentication/concept-mfa-howitworks.md) was used. When this is present the other authentication methods will also be included. |
| `ngcmfa` | Equivalent to `mfa`, used for provisioning of certain advanced credential types. |
| `wiaormfa`| The user used Windows or an MFA credential to authenticate. |
| `none` | No authentication was done. |

## Validating tokens

Only confidential clients (web apps and web APIs) need to validate tokens. Because public clients talk directly to the IDP over secured channels, they don't need to do so. Applications must only validate tokens that have an `aud` claim that matches their application; other resources may have custom token validation rules that you can't implement. For example, tokens for Microsoft Graph won't validate according to these rules due to their proprietary format. Validating and accepting tokens meant for another resource is an example of the [confused deputy](https://cwe.mitre.org/data/definitions/441.html) problem.  

To validate an id_token or an access_token, your app should first validate the token's signature and issuer against the values in the OpenID discovery document. For example, the tenant-independent version of the document is located at [https://login.microsoftonline.com/common/.well-known/openid-configuration](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The below information is provided for those who wish to understand the underlying process. The Azure AD middleware has built-in capabilities for validating access tokens, and you can browse through our [samples](../azuread-dev/sample-v1-code.md) to find one in the language of your choice. There are also several third-party open-source libraries available for JWT validation - there is at least one option for almost every platform and language. For more information about Azure AD authentication libraries and code samples, see [v1.0 authentication libraries](../azuread-dev/active-directory-authentication-libraries.md) and [v2.0 authentication libraries](reference-v2-libraries.md).

### Validating the signature

A JWT contains three segments, which are separated by the `.` character. The first segment is known as the **header**, the second as the **body**, and the third as the **signature**. The signature segment can be used to validate the authenticity of the token so that it can be trusted by your app.

Tokens issued by Azure AD are signed using industry standard asymmetric encryption algorithms, such as RS256. The header of the JWT contains information about the key and encryption method used to sign the token:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "x5t": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk",
  "kid": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk"
}
```

The `alg` claim indicates the algorithm that was used to sign the token, while the `kid` claim indicates the particular public key that was used to validate the token.

At any given point in time, Azure AD may sign an id_token using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

You can acquire the signing key data necessary to validate the signature by using the [OpenID Connect metadata document](v2-protocols-oidc.md#fetch-the-openid-connect-metadata-document) located at:

```
https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
```

> [!TIP]
> Try this [URL](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration) in a browser!

This metadata document:

* Is a JSON object containing several useful pieces of information, such as the location of the various endpoints required for doing OpenID Connect authentication.
* Includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens. The JSON Web Key (JWK) located at the `jwks_uri` contains all of the public key information in use at that particular moment in time.  The JWK format is described in [RFC 7517](https://tools.ietf.org/html/rfc7517).  Your app can use the `kid` claim in the JWT header to select which public key in this document has been used to sign a particular token. It can then do signature validation using the correct public key and the indicated algorithm.

> [!NOTE]
> We recommend using the `kid` claim to validate your token. Though v1.0 tokens contain both the `x5t` and `kid` claims, v2.0 tokens contain only the `kid` claim.

Doing signature validation is outside the scope of this document - there are many open-source libraries available for helping you do so if necessary.  However, the Microsoft Identity platform has one token signing extension to the standards - custom signing keys.

If your app has custom signing keys as a result of using the [claims-mapping](active-directory-claims-mapping.md) feature, you must append an `appid` query parameter containing the app ID to get a `jwks_uri` pointing to your app's signing key information, which should be used for validation. For example: `https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration?appid=6731de76-14a6-49ae-97bc-6eba6914391e` contains a `jwks_uri` of `https://login.microsoftonline.com/{tenant}/discovery/keys?appid=6731de76-14a6-49ae-97bc-6eba6914391e`.

### Claims based authorization

Your application's business logic will dictate this step, some common authorization methods are laid out below.

* Check the `scp` or `roles` claim to verify that all present scopes match those exposed by your API, and allow the client to do the requested action.
* Ensure the calling client is allowed to call your API using the `appid` claim.
* Validate the authentication status of the calling client using `appidacr` - it shouldn't be 0 if public clients aren't allowed to call your API.
* Check against a list of past `nonce` claims to verify the token isn't being replayed.
* Check that the `tid` matches a tenant that is allowed to call your API.
* Use the `acr` claim to verify the user has performed MFA. This should be enforced using [Conditional Access](../conditional-access/overview.md).
* If you've requested the `roles` or `groups` claims in the access token, verify that the user is in the group allowed to do this action.
  * For tokens retrieved using the implicit flow, you'll likely need to query the [Microsoft Graph](https://developer.microsoft.com/graph/) for this data, as it's often too large to fit in the token.

## User and application tokens

Your application may receive tokens for user (the flow usually discussed) or directly from an application (through the [client credentials flow](../azuread-dev/v1-oauth2-client-creds-grant-flow.md)). These app-only tokens indicate that this call is coming from an application and does not have a user backing it. These tokens are handled largely the same:

* Use `roles` to see permissions that have been granted to the subject of the token.
* Use `oid` or `sub` to validate that the calling service principal is the expected one.

If your app needs to distinguish between app-only access tokens and access tokens for users, use the `idtyp` [optional claim](active-directory-optional-claims.md).  By adding the `idtyp` claim to the `accessToken` field, and checking for the value `app`, you can detect app-only access tokens.  ID tokens and access tokens for users will not have the `idtyp` claim included.

## Token revocation

Refresh tokens can be invalidated or revoked at any time, for different reasons. These fall into two main categories: timeouts and revocations.

### Token timeouts

Using [token lifetime configuration](active-directory-configurable-token-lifetimes.md), the lifetime of refresh tokens can be altered.  It is normal and expected for some tokens to go without use (e.g. the user does not open the app for 3 months) and therefore expire.  Apps will encounter scenarios where the login server rejects a refresh token due to its age. 

* MaxInactiveTime: If the refresh token hasn't been used within the time dictated by the MaxInactiveTime, the Refresh Token will no longer be valid.
* MaxSessionAge: If MaxAgeSessionMultiFactor or MaxAgeSessionSingleFactor have been set to something other than their default (Until-revoked), then reauthentication will be required after the time set in the MaxAgeSession* elapses.
* Examples:
  * The tenant has a MaxInactiveTime of five days, and the user went on vacation for a week, and so Azure AD hasn't seen a new token request from the user in 7 days. The next time the user requests a new token, they'll find their Refresh Token has been revoked, and they must enter their credentials again.
  * A sensitive application has a MaxAgeSessionSingleFactor of one day. If a user logs in on Monday, and on Tuesday (after 25 hours have elapsed), they'll be required to reauthenticate.

### Revocation

Refresh tokens can be revoked by the server due to a change in credentials, or due to use or admin action.  Refresh tokens fall into two classes - those issued to confidential clients (the rightmost column) and those issued to public clients (all other columns).   

| Change | Password-based cookie | Password-based token | Non-password-based cookie | Non-password-based token | Confidential client token |
|---|-----------------------|----------------------|---------------------------|--------------------------|---------------------------|
| Password expires | Stays alive | Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User revokes their refresh tokens [via PowerShell](/powershell/module/azuread/revoke-azureadsignedinuserallrefreshtoken) | Revoked | Revoked | Revoked | Revoked | Revoked |
| Admin revokes all refresh tokens for a user [via PowerShell](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) | Revoked | Revoked |Revoked | Revoked | Revoked |
| Single sign-out ([v1.0](../azuread-dev/v1-protocols-openid-connect-code.md#single-sign-out), [v2.0](v2-protocols-oidc.md#single-sign-out) ) on web | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

#### Non-password-based

A *non-password-based* login is one where the user didn't type in a password to get it. Examples of non-password-based login include:

- Using your face with Windows Hello
- FIDO2 key
- SMS
- Voice
- PIN 

> [!NOTE]
> Primary Refresh Tokens (PRT) on Windows 10 are segregated based on the credential. For example, Windows Hello and password have their respective PRTs, isolated from one another. When a user signs-in with a Hello credential (PIN or biometrics) and then changes the password, the password based PRT obtained previously will be revoked. Signing back in with a password invalidates the old PRT and requests a new one.
>
> Refresh tokens aren't invalidated or revoked when used to fetch a new access token and refresh token.  However, your app should discard the old one as soon as it's used and replace it with the new one, as the new token has a new expiration time in it. 

## Next steps

* Learn about [`id_tokens` in Azure AD](id-tokens.md).
* Learn about permission and consent ( [v1.0](../azuread-dev/v1-permissions-consent.md), [v2.0](v2-permissions-and-consent.md)).
