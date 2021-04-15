---
title: Microsoft identity platform ID tokens | Azure
titleSuffix: Microsoft identity platform
description: Learn how to use id_tokens emitted by the Azure AD v1.0 and Microsoft identity platform (v2.0) endpoints. 
services: active-directory
author: hpsin
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 04/02/2021
ms.author: hirsin
ms.reviewer: hirsin
ms.custom:
  - aaddev
  - identityplatformtop40
  - fasttrack-edit
---

# Microsoft identity platform ID tokens

`id_tokens` are sent to the client application as part of an [OpenID Connect](v2-protocols-oidc.md) (OIDC) flow. They can be sent alongside or instead of an access token, and are used by the client to authenticate the user.

## Using the id_token

ID Tokens should be used to validate that a user is who they claim to be and get additional useful information about them - it shouldn't be used for authorization in place of an [access token](access-tokens.md). The claims it provides can be used for UX inside your application, as [keys in a database](#using-claims-to-reliably-identify-a-user-subject-and-object-id), and providing access to the client application.  

## Claims in an id_token

`id_tokens` are [JWTs](https://tools.ietf.org/html/rfc7519) (JSON Web Tokens), meaning they consist of a header, payload, and signature portion. You can use the header and signature to verify the authenticity of the token, while the payload contains the information about the user requested by your client. Except where noted, all JWT claims listed here appear in both v1.0 and v2.0 tokens.

### v1.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyIsImtpZCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyJ9.eyJhdWQiOiJiMTRhNzUwNS05NmU5LTQ5MjctOTFlOC0wNjAxZDBmYzljYWEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkvIiwiaWF0IjoxNTM2Mjc1MTI0LCJuYmYiOjE1MzYyNzUxMjQsImV4cCI6MTUzNjI3OTAyNCwiYWlvIjoiQVhRQWkvOElBQUFBcXhzdUIrUjREMnJGUXFPRVRPNFlkWGJMRDlrWjh4ZlhhZGVBTTBRMk5rTlQ1aXpmZzN1d2JXU1hodVNTajZVVDVoeTJENldxQXBCNWpLQTZaZ1o5ay9TVTI3dVY5Y2V0WGZMT3RwTnR0Z2s1RGNCdGsrTExzdHovSmcrZ1lSbXY5YlVVNFhscGhUYzZDODZKbWoxRkN3PT0iLCJhbXIiOlsicnNhIl0sImVtYWlsIjoiYWJlbGlAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiTGluY29sbiIsImdpdmVuX25hbWUiOiJBYmUiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaXBhZGRyIjoiMTMxLjEwNy4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJub25jZSI6IjEyMzUyMyIsIm9pZCI6IjA1ODMzYjZiLWFhMWQtNDJkNC05ZWMwLTFiMmJiOTE5NDQzOCIsInJoIjoiSSIsInN1YiI6IjVfSjlyU3NzOC1qdnRfSWN1NnVlUk5MOHhYYjhMRjRGc2dfS29vQzJSSlEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6IkFiZUxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJMeGVfNDZHcVRrT3BHU2ZUbG40RUFBIiwidmVyIjoiMS4wIn0=.UJQrCA6qn2bXq57qzGX_-D3HcPHqBMOKDPx4su1yKRLNErVD8xkxJLNLVRdASHqEcpyDctbdHccu6DPpkq5f0ibcaQFhejQNcABidJCTz0Bb2AbdUCTqAzdt9pdgQvMBnVH1xk3SCM6d4BbT4BkLLj10ZLasX7vRknaSjE_C5DI7Fg4WrZPwOhII1dB0HEZ_qpNaYXEiy-o94UJ94zCr07GgrqMsfYQqFR7kn-mn68AjvLcgwSfZvyR_yIK75S_K37vC3QryQ7cNoafDe9upql_6pB2ybMVlgWPs_DmbJ8g0om-sPlwyn74Cc1tW3ze-Xptw_2uVdPgWyqfuWAfq6Q
```

View this v1.0 sample token in [jwt.ms](https://jwt.ms/#id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyIsImtpZCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyJ9.eyJhdWQiOiJiMTRhNzUwNS05NmU5LTQ5MjctOTFlOC0wNjAxZDBmYzljYWEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkvIiwiaWF0IjoxNTM2Mjc1MTI0LCJuYmYiOjE1MzYyNzUxMjQsImV4cCI6MTUzNjI3OTAyNCwiYWlvIjoiQVhRQWkvOElBQUFBcXhzdUIrUjREMnJGUXFPRVRPNFlkWGJMRDlrWjh4ZlhhZGVBTTBRMk5rTlQ1aXpmZzN1d2JXU1hodVNTajZVVDVoeTJENldxQXBCNWpLQTZaZ1o5ay9TVTI3dVY5Y2V0WGZMT3RwTnR0Z2s1RGNCdGsrTExzdHovSmcrZ1lSbXY5YlVVNFhscGhUYzZDODZKbWoxRkN3PT0iLCJhbXIiOlsicnNhIl0sImVtYWlsIjoiYWJlbGlAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiTGluY29sbiIsImdpdmVuX25hbWUiOiJBYmUiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaXBhZGRyIjoiMTMxLjEwNy4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJub25jZSI6IjEyMzUyMyIsIm9pZCI6IjA1ODMzYjZiLWFhMWQtNDJkNC05ZWMwLTFiMmJiOTE5NDQzOCIsInJoIjoiSSIsInN1YiI6IjVfSjlyU3NzOC1qdnRfSWN1NnVlUk5MOHhYYjhMRjRGc2dfS29vQzJSSlEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6IkFiZUxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJMeGVfNDZHcVRrT3BHU2ZUbG40RUFBIiwidmVyIjoiMS4wIn0=.UJQrCA6qn2bXq57qzGX_-D3HcPHqBMOKDPx4su1yKRLNErVD8xkxJLNLVRdASHqEcpyDctbdHccu6DPpkq5f0ibcaQFhejQNcABidJCTz0Bb2AbdUCTqAzdt9pdgQvMBnVH1xk3SCM6d4BbT4BkLLj10ZLasX7vRknaSjE_C5DI7Fg4WrZPwOhII1dB0HEZ_qpNaYXEiy-o94UJ94zCr07GgrqMsfYQqFR7kn-mn68AjvLcgwSfZvyR_yIK75S_K37vC3QryQ7cNoafDe9upql_6pB2ybMVlgWPs_DmbJ8g0om-sPlwyn74Cc1tW3ze-Xptw_2uVdPgWyqfuWAfq6Q).

### v2.0

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE16YWtpaGlSbGFfOHoyQkVKVlhlV01xbyJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTEyMjA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFJa3pxRlZyU2FTYUZIeTc4MmJidGFRIiwiYXVkIjoiNmNiMDQwMTgtYTNmNS00NmE3LWI5OTUtOTQwYzc4ZjVhZWYzIiwiZXhwIjoxNTM2MzYxNDExLCJpYXQiOjE1MzYyNzQ3MTEsIm5iZiI6MTUzNjI3NDcxMSwibmFtZSI6IkFiZSBMaW5jb2xuIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiQWJlTGlAbWljcm9zb2Z0LmNvbSIsIm9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC02NmYzLTMzMzJlY2E3ZWE4MSIsInRpZCI6IjkxMjIwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTMwNGI2NmRhZCIsIm5vbmNlIjoiMTIzNTIzIiwiYWlvIjoiRGYyVVZYTDFpeCFsTUNXTVNPSkJjRmF0emNHZnZGR2hqS3Y4cTVnMHg3MzJkUjVNQjVCaXN2R1FPN1lXQnlqZDhpUURMcSFlR2JJRGFreXA1bW5PcmNkcUhlWVNubHRlcFFtUnA2QUlaOGpZIn0.1AFWW-Ck5nROwSlltm7GzZvDwUkqvhSQpm55TQsmVo9Y59cLhRXpvB8n-55HCr9Z6G_31_UbeUkoz612I2j_Sm9FFShSDDjoaLQr54CreGIJvjtmS3EkK9a7SJBbcpL1MpUtlfygow39tFjY7EVNW9plWUvRrTgVk7lYLprvfzw-CIqw3gHC-T7IK_m_xkr08INERBtaecwhTeN4chPC4W3jdmw_lIxzC48YoQ0dB1L9-ImX98Egypfrlbm0IBL5spFzL6JDZIRRJOu8vecJvj1mq-IUhGt0MacxX8jdxYLP-KUu2d9MbNKpCKJuZ7p8gwTL5B7NlUdh_dmSviPWrw
```

View this v2.0 sample token in [jwt.ms](https://jwt.ms/#id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE16YWtpaGlSbGFfOHoyQkVKVlhlV01xbyJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTEyMjA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFJa3pxRlZyU2FTYUZIeTc4MmJidGFRIiwiYXVkIjoiNmNiMDQwMTgtYTNmNS00NmE3LWI5OTUtOTQwYzc4ZjVhZWYzIiwiZXhwIjoxNTM2MzYxNDExLCJpYXQiOjE1MzYyNzQ3MTEsIm5iZiI6MTUzNjI3NDcxMSwibmFtZSI6IkFiZSBMaW5jb2xuIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiQWJlTGlAbWljcm9zb2Z0LmNvbSIsIm9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC02NmYzLTMzMzJlY2E3ZWE4MSIsInRpZCI6IjkxMjIwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTMwNGI2NmRhZCIsIm5vbmNlIjoiMTIzNTIzIiwiYWlvIjoiRGYyVVZYTDFpeCFsTUNXTVNPSkJjRmF0emNHZnZGR2hqS3Y4cTVnMHg3MzJkUjVNQjVCaXN2R1FPN1lXQnlqZDhpUURMcSFlR2JJRGFreXA1bW5PcmNkcUhlWVNubHRlcFFtUnA2QUlaOGpZIn0.1AFWW-Ck5nROwSlltm7GzZvDwUkqvhSQpm55TQsmVo9Y59cLhRXpvB8n-55HCr9Z6G_31_UbeUkoz612I2j_Sm9FFShSDDjoaLQr54CreGIJvjtmS3EkK9a7SJBbcpL1MpUtlfygow39tFjY7EVNW9plWUvRrTgVk7lYLprvfzw-CIqw3gHC-T7IK_m_xkr08INERBtaecwhTeN4chPC4W3jdmw_lIxzC48YoQ0dB1L9-ImX98Egypfrlbm0IBL5spFzL6JDZIRRJOu8vecJvj1mq-IUhGt0MacxX8jdxYLP-KUu2d9MbNKpCKJuZ7p8gwTL5B7NlUdh_dmSviPWrw).

### Header claims

|Claim | Format | Description |
|-----|--------|-------------|
|`typ` | String - always "JWT" | Indicates that the token is a JWT token.|
|`alg` | String | Indicates the algorithm that was used to sign the token. Example: "RS256" |
|`kid` | String | Thumbprint for the public key used to verify this token. Emitted in both v1.0 and v2.0 `id_tokens`. |
|`x5t` | String | The same (in use and value) as `kid`. However, this is a legacy claim emitted only in v1.0 `id_tokens` for compatibility purposes. |

### Payload claims

This list shows the JWT claims that are in most id_tokens by default (except where noted).  However, your app can use [optional claims](active-directory-optional-claims.md) to request additional JWT claims in the id_token.  These can range from the `groups` claim to information about the user's name.

|Claim | Format | Description |
|-----|--------|-------------|
|`aud` |  String, an App ID URI | Identifies the intended recipient of the token. In `id_tokens`, the audience is your app's Application ID, assigned to your app in the Azure portal. Your app should validate this value, and reject the token if the value does not match. |
|`iss` |  String, an STS URI | Identifies the security token service (STS) that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in `/v2.0`.  The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if applicable. |
|`iat` |  int, a UNIX timestamp | "Issued At" indicates when the authentication for this token occurred.  |
|`idp`|String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account not in the same tenant as the issuer - guests, for instance. If the claim isn't present, it means that the value of `iss` can be used instead.  For personal accounts being used in an organizational context (for instance, a personal account invited to an Azure AD tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. |
|`nbf` |  int, a UNIX timestamp | The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.|
|`exp` |  int, a UNIX timestamp | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.  It's important to note that a resource may reject the token before this time as well - if, for example, a change in authentication is required or a token revocation has been detected. |
| `c_hash`| String |The code hash is included in ID tokens only when the ID token is issued with an OAuth 2.0 authorization code. It can be used to validate the authenticity of an authorization code. For details about performing this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html). |
|`at_hash`| String |The access token hash is included in ID tokens only when the ID token is issued from the `/authorize` endpoint with an OAuth 2.0 access token. It can be used to validate the authenticity of an access token. For details about performing this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#HybridIDToken). This is not returned on ID tokens from the `/token` endpoint. |
|`aio` | Opaque String | An internal claim used by Azure AD to record data for token reuse. Should be ignored.|
|`preferred_username` | String | The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. The `profile` scope is required to receive this claim.|
|`email` | String | The `email` claim is present by default for guest accounts that have an email address.  Your app can request the email claim for managed users (those from the same tenant as the resource) using the `email` [optional claim](active-directory-optional-claims.md).  On the v2.0 endpoint, your app can also request the `email` OpenID Connect scope - you don't need to request both the optional claim and the scope to get the claim.  The email claim only supports addressable mail from the user's profile information. |
|`name` | String | The `name` claim provides a human-readable value that identifies the subject of the token. The value isn't guaranteed to be unique, it is mutable, and it's designed to be used only for display purposes. The `profile` scope is required to receive this claim. |
|`nonce`| String | The nonce matches the parameter included in the original /authorize request to the IDP. If it does not match, your application should reject the token. |
|`oid` | String, a GUID | The immutable identifier for an object in the Microsoft identity system, in this case, a user account. This ID uniquely identifies the user across applications - two different applications signing in the same user will receive the same value in the `oid` claim. The Microsoft Graph will return this ID as the `id` property for a given user account. Because the `oid` allows multiple apps to correlate users, the `profile` scope is required to receive this claim. Note that if a single user exists in multiple tenants, the user will contain a different object ID in each tenant - they're considered different accounts, even though the user logs into each account with the same credentials. The `oid` claim is a GUID and cannot be reused. |
|`roles`| Array of strings | The set of roles that were assigned to the user who is logging in. |
|`rh` | Opaque String |An internal claim used by Azure to revalidate tokens. Should be ignored. |
|`sub` | String | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. The subject is a pairwise identifier - it is unique to a particular application ID. If a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim. This may or may not be wanted depending on your architecture and privacy requirements. |
|`tid` | String, a GUID | A GUID that represents the Azure AD tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. The `profile` scope is required to receive this claim. |
|`unique_name` | String | Provides a human readable value that identifies the subject of the token. This value is unique at any given point in time, but as emails and other identifiers can be reused, this value can reappear on other accounts, and should therefore be used only for display purposes. Only issued in v1.0 `id_tokens`. |
|`uti` | Opaque String | An internal claim used by Azure to revalidate tokens. Should be ignored. |
|`ver` | String, either 1.0 or 2.0 | Indicates the version of the id_token. |
|`hasgroups`|Boolean|If present, always true, denoting the user is in at least one group. Used in place of the groups claim for JWTs in implicit grant flows if the full groups claim would extend the URI fragment beyond the URL length limits (currently 6 or more groups). Indicates that the client should use the Microsoft Graph API to determine the user's groups (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`).|
|`groups:src1`|JSON object | For token requests that are not length limited (see `hasgroups` above) but still too large for the token, a link to the full groups list for the user will be included. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects" }`<br><br> For more info, see [Groups overage claim](#groups-overage-claim).|

> [!NOTE]
> The v1.0 and v2.0 id_token have differences in the amount of information they will carry as seen from the examples above. The version is based on the endpoint from where it was requested. While existing applications likely use the Azure AD endpoint, new applications should use the "Microsoft identity platform".
>
> - v1.0: Azure AD endpoints: `https://login.microsoftonline.com/common/oauth2/authorize`
> - v2.0: Microsoft identity Platform endpoints: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`

### Using claims to reliably identify a user (Subject and Object ID)

When identifying a user (say, looking them up in a database, or deciding what permissions they have), it's critical to use information that will remain constant and unique across time. Legacy applications sometimes use fields like the email address, a phone number, or the UPN.  All of these can change over time, and can also be reused over time - when an employee changes their name, or an employee is given an email address that matches that of a previous, no longer present employee). Thus, it is **critical** that your application not use human-readable data to identify a user - human readable generally means someone will read it, and want to change it. Instead, use the claims provided by the OIDC standard, or the extension claims provided by Microsoft - the `sub` and `oid` claims.

To correctly store information per-user,  use `sub` or `oid` alone (which as GUIDs are unique), with `tid` used for routing or sharding if needed.  If you need to share data across services, `oid`+`tid` is best as all apps get the same `oid` and `tid` claims for a given user.  The `sub` claim in the Microsoft identity platform is "pair-wise" - it is unique based on a combination of the token recipient, tenant, and user.  Thus, two apps that request ID tokens for a given user will receive different `sub` claims, but the same `oid` claims for that user.

>[!NOTE]
> Do not use the `idp` claim to store information about a user in an attempt to correlate users across tenants.  It will not function, as the `oid` and `sub` claims for a user change across tenants, by design, to ensure that applications cannot track users across tenants.  
>
> Guest scenarios, where a user is homed in one tenant, and authenticates in another, should treat the user as if they are a brand new user to the service.  Your documents and privileges in the Contoso tenant should not apply in the Fabrikam tenant. This is important to prevent accidental data leakage across tenants.

### Groups overage claim
To ensure that the token size doesn't exceed HTTP header size limits, Azure AD limits the number of object IDs that it includes in the `groups` claim. If a user is member of more groups than the overage limit (150 for SAML tokens, 200 for JWT tokens), then Azure AD does not emit the groups claim in the token. Instead, it includes an overage claim in the token that indicates to the application to query the Microsoft Graph API to retrieve the user's group membership.

```json
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

## ID token lifetime

By default, an ID token is valid for 1 hour - after 1 hour, the client must acquire a new ID token.

You can adjust the lifetime of an ID token to control how often the client application expires the application session, and how often it requires the user to re-authenticate (either silently or interactively). For more information, read [Configurable token lifetimes](active-directory-configurable-token-lifetimes.md).

## Validating an id_token

Validating an `id_token` is similar to the first step of [validating an access token](access-tokens.md#validating-tokens) - your client can validate that the correct issuer has sent back the token and that it hasn't been tampered with. Because `id_tokens` are always a JWT token, many libraries exist to validate these tokens - we recommend you use one of these rather than doing it yourself.  Note that only confidential clients (those with a secret) should validate ID tokens.  Public applications (code running entirely on a device or network you don't control - for instance, a user's browser or their home network) don't benefit from validating the ID token, as a malicious user can intercept and edit the keys used for validation of the token.

To manually validate the token, see the steps details in [validating an access token](access-tokens.md#validating-tokens). After validating the signature on the token, the following JWT claims should be validated in the id_token (these may also be done by your token validation library):

* Timestamps: the `iat`, `nbf`, and `exp` timestamps should all fall before or after the current time, as appropriate.
* Audience: the `aud` claim should match the app ID for your application.
* Nonce: the `nonce` claim in the payload must match the nonce parameter passed into the /authorize endpoint during the initial request.

## Next steps

* Learn about [access tokens](access-tokens.md)
* Customize the JWT claims in your id_token using [optional claims](active-directory-optional-claims.md).
