---
title: ID token claims reference
description: Learn the details of the claims included in ID tokens issued by the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 05/30/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
---

# ID token claims reference

ID tokens are [JSON web tokens (JWT)](https://wikipedia.org/wiki/JSON_Web_Token). The v1.0 and v2.0 ID tokens have differences in the information they carry. The version is based on the endpoint from where it was requested. While existing applications likely use the Azure AD v1.0 endpoint, new applications should use the v2.0 endpoint.

* v1.0: `https://login.microsoftonline.com/common/oauth2/authorize`
* v2.0: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`

All JWT claims listed in the following sections appear in both v1.0 and v2.0 tokens unless stated otherwise. ID tokens consist of a header, payload, and signature. The header and signature are used to verify the authenticity of the token, while the payload contains the information about the user requested by your client.

## Header claims

The following table shows header claims present in ID tokens.

|Claim | Format | Description |
|------|--------|-------------|
| `typ` | String - always "JWT" | Indicates that the token is a JWT token. |
| `alg` | String | Indicates the algorithm that was used to sign the token. For example: "RS256" |
| `kid` | String | Specifies the thumbprint for the public key that can be used to validate the token's signature. Emitted in both v1.0 and v2.0 ID tokens. |
| `x5t` | String | Functions the same (in use and value) as `kid`. `x5t` is a legacy claim emitted only in v1.0 ID tokens for compatibility purposes. |

## Payload claims

The following table shows the claims that are in most ID tokens by default (except where noted).  However, your app can use [optional claims](./optional-claims.md) to request more claims in the ID token. Optional claims can range from the `groups` claim to information about the user's name.

| Claim | Format | Description |
|-------|--------|-------------|
|`aud` |  String, an App ID GUID | Identifies the intended recipient of the token. In `id_tokens`, the audience is your app's Application ID, assigned to your app in the Azure portal. This value should be validated. The token should be rejected if it fails to match your app's Application ID. |
|`iss` |  String, an issuer URI | Identifies the issuer, or "authorization server" that constructs and returns the token. It also identifies the tenant for which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI ends in `/v2.0`.  The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if applicable. |
|`iat` | int, a Unix timestamp | Indicates when the authentication for the token occurred. |
|`idp`| String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the issuer claim unless the user account isn't in the same tenant as the issuer - guests, for instance. If the claim isn't present, it means that the value of `iss` can be used instead. For personal accounts being used in an organizational context (for instance, a personal account invited to a tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. |
|`nbf` |  int, a Unix timestamp | Identifies the time before which the JWT can't be accepted for processing. |
|`exp` |  int, a Unix timestamp | Identifies the expiration time on or after which the JWT can't be accepted for processing. In certain circumstances, a resource may reject the token before this time. For example, if a change in authentication is required or a token revocation has been detected. |
| `c_hash`| String | The code hash is included in ID tokens only when the ID token is issued with an OAuth 2.0 authorization code. It can be used to validate the authenticity of an authorization code. To understand how to do this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#HybridIDToken). This claim isn't returned on ID tokens from the /token endpoint. |
| `at_hash` | String | The access token hash is included in ID tokens only when the ID token is issued from the `/authorize` endpoint with an OAuth 2.0 access token. It can be used to validate the authenticity of an access token. To understand how to do this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#HybridIDToken). This claim isn't returned on ID tokens from the `/token` endpoint. |
| `aio` | Opaque String | An internal claim that's used to record data for token reuse. Should be ignored. |
| `preferred_username` | String | The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it's mutable, this value can't be used to make authorization decisions. It can be used for username hints and in human-readable UI as a username. The `profile` scope is required to receive this claim. Present only in v2.0 tokens. |
| `email` | String | Present by default for guest accounts that have an email address. Your app can request the email claim for managed users (from the same tenant as the resource) using the `email` [optional claim](./optional-claims.md). This value isn't guaranteed to be correct and is mutable over time. Never use it for authorization or to save data for a user. If you require an addressable email address in your app, request this data from the user directly by using this claim as a suggestion or prefill in your UX. On the v2.0 endpoint, your app can also request the `email` OpenID Connect scope - you don't need to request both the optional claim and the scope to get the claim. |
| `name` | String | The `name` claim provides a human-readable value that identifies the subject of the token. The value isn't guaranteed to be unique, it can be changed, and should be used only for display purposes. The `profile` scope is required to receive this claim. |
| `nonce` | String | The nonce matches the parameter included in the original authorize request to the IDP. If it doesn't match, your application should reject the token. |
| `oid` | String, a GUID | The immutable identifier for an object, in this case, a user account. This ID uniquely identifies the user across applications - two different applications signing in the same user receives the same value in the `oid` claim. Microsoft Graph returns this ID as the `id` property for a user account. Because the `oid` allows multiple apps to correlate users, the `profile` scope is required to receive this claim. If a single user exists in multiple tenants, the user contains a different object ID in each tenant - they're considered different accounts, even though the user logs into each account with the same credentials. The `oid` claim is a GUID and can't be reused. |
| `roles` | Array of strings | The set of roles that were assigned to the user who is logging in. |
| `rh` | Opaque String | An internal claim used to revalidate tokens. Should be ignored. |
| `sub` | String | The subject of the information in the token. For example, the user of an app. This value is immutable and can't be reassigned or reused. The subject is a pairwise identifier and is unique to an application ID. If a single user signs into two different apps using two different client IDs, those apps receive two different values for the subject claim. You may or may not want two values depending on your architecture and privacy requirements. |
| `tid` | String, a GUID | Represents the tenant that the user is signing in to. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user is signing in to. For sign-ins to the personal Microsoft account tenant (services like Xbox, Teams for Life, or Outlook), the value is `9188040d-6c67-4c5b-b112-36a304b66dad`.|
| `unique_name` | String | Only present in v1.0 tokens. Provides a human readable value that identifies the subject of the token. This value isn't guaranteed to be unique within a tenant and should be used only for display purposes. |
| `uti` | String | Token identifier claim, equivalent to `jti` in the JWT specification. Unique, per-token identifier that is case-sensitive. |
| `ver` | String, either 1.0 or 2.0 | Indicates the version of the ID token. |
| `hasgroups` | Boolean | If present, always true, denoting the user is in at least one group. Used in place of the groups claim for JWTs in implicit grant flows when the full groups claim extends the URI fragment beyond the URL length limits (currently six or more groups). Indicates that the client should use the Microsoft Graph API to determine the user's groups (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`). |
| `groups:src1` | JSON object | For token requests that aren't limited in length (see `hasgroups`) but still too large for the token, a link to the full groups list for the user is included. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects" }`<br><br> For more info, see [Groups overage claim](#groups-overage-claim).|

## Use claims to reliably identify a user

When identifying a user, it's critical to use information that remains constant and unique across time. Legacy applications sometimes use fields like the email address, phone number, or UPN. All of these fields can change over time, and can also be reused over time. For example, when an employee changes their name, or an employee is given an email address that matches that of a previous, no longer present employee. Your application mustn't use human-readable data to identify a user - human readable generally means someone can read it, and want to change it. Instead, use the claims provided by the OIDC standard, or the extension claims provided by Microsoft - the `sub` and `oid` claims.

To correctly store information per-user, use `sub` or `oid` alone (which as GUIDs are unique), with `tid` used for routing or sharding if needed. If you need to share data across services, `oid` and `tid` is best as all apps get the same `oid` and `tid` claims for a user acting in a tenant. The `sub` claim is a pair-wise value that's unique. The value is based on a combination of the token recipient, tenant, and user. Two apps that request ID tokens for a user receive different `sub` claims, but the same `oid` claims for that user.

>[!NOTE]
> Don't use the `idp` claim to store information about a user in an attempt to correlate users across tenants. It doesn't work, as the `oid` and `sub` claims for a user change across tenants, by design, to ensure that applications can't track users across tenants.  

Guest scenarios, where a user is homed in one tenant, and authenticates in another, should treat the user as if they're a brand new user to the service. Your documents and privileges in one tenant shouldn't apply in another tenant. This restriction is important to prevent accidental data leakage across tenants, and enforcement of data lifecycles. Evicting a guest from a tenant should also remove their access to the data they created in that tenant. 

## Groups overage claim

To ensure that the token size doesn't exceed HTTP header size limits, the number of object IDs that it includes in the `groups` claim is limited. If a user is a member of more groups than the overage limit (150 for SAML tokens, 200 for JWT tokens), the groups claim isn't included in the token. Instead, it includes an overage claim in the token that indicates to the application to query the Microsoft Graph API to retrieve the user's group membership.

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

## Next steps

- Learn more about the [ID tokens used in Microsoft Entra ID](id-tokens.md).
