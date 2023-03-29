---
title: Microsoft identity platform access tokens
description: Learn about access tokens emitted by the Azure AD v1.0 and Microsoft identity platform (v2.0) endpoints.
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/28/2022
ms.author: davidmu
ms.custom: aaddev, identityplatformtop40, fasttrack-edit
ms.reviewer: ludwignick
---

# Microsoft identity platform access tokens

Access tokens enable clients to securely call protected web APIs. Access tokens are used by web APIs to perform authentication and authorization.

Per the OAuth specification, access tokens are opaque strings without a set format. Some identity providers (IDPs) use GUIDs and others use encrypted blobs. The format of the access token can depend on how the API that accepts the token is configured.

Custom APIs registered by developers on the Microsoft identity platform can choose from two different formats of JSON Web Tokens (JWTs) called `v1.0` and `v2.0`. Microsoft-developed APIs like Microsoft Graph or APIs in Azure have other proprietary token formats. These proprietary formats might be encrypted tokens, JWTs, or special JWT-like tokens that won't validate.

Clients must treat access tokens as opaque strings because the contents of the token are intended for the API only. For validation and debugging purposes *only*, developers can decode JWTs using a site like [jwt.ms](https://jwt.ms). Tokens that are received for a Microsoft API might not always be a JWT and can't always be decoded.

For details on what's inside the access token, clients should use the token response data that's returned with the access token to the client. When the client requests an access token, the Microsoft identity platform also returns some metadata about the access token for the consumption of the application. This information includes the expiry time of the access token and the scopes for which it's valid. This data allows the application to do intelligent caching of access tokens without having to parse the access token itself.

See the following sections to learn how an API can validate and use the claims inside an access token.  

> [!NOTE]
> All documentation on this page, except where noted, applies only to tokens issued for registered APIs. It doesn't apply to tokens issued for Microsoft-owned APIs, nor can those tokens be used to validate how the Microsoft identity platform issues tokens for a registered API.  

## Token formats

There are two versions of access tokens available in the Microsoft identity platform: v1.0 and v2.0. These versions determine the claims that are in the token and make sure that a web API can control the contents of the token.

Web APIs have one of the following versions selected as a default during registration:

- v1.0 for Azure AD-only applications. The following example shows a v1.0 token (this token example won't validate because the keys have rotated prior to publication and personal information has been removed):

    ```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0.D3H6pMUtQnoJAGq6AHd
    ```

- v2.0 for applications that support consumer accounts. The following example shows a v2.0 token (this token example won't validate because the keys have rotated prior to publication and personal information has been removed):  

    ```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt
    ```

The version can be set for applications by providing the appropriate value to the `accessTokenAcceptedVersion` setting in the [app manifest](reference-app-manifest.md#manifest-reference). The values of `null` and `1` result in v1.0 tokens, and the value of `2` results in v2.0 tokens.

## Token ownership

Two parties are involved in an access token request: the client, who requests the token, and the resource (Web API) that accepts the token. The `aud` claim in a token indicates the resource that the token is intended for (its *audience*). Clients use the token but shouldn't understand or attempt to parse it. Resources accept the token.  

The Microsoft identity platform supports issuing any token version from any version endpoint - they aren't related. When `accessTokenAcceptedVersion` is set to `2`, a client calling the v1.0 endpoint to get a token for that resource receives a v2.0 access token.

Resources always own their tokens using the `aud` claim and are the only applications that can change their token details.

## Claims in access tokens

JWTs are split into three pieces:

- **Header** - Provides information about how to validate the token including information about the type of token and how it was signed.
- **Payload** - Contains all of the important data about the user or application that's attempting to call the service.
- **Signature** - Is the raw material used to validate the token.

Each piece is separated by a period (`.`) and separately Base64 encoded.

Claims are present only if a value exists to fill it. An application shouldn't take a dependency on a claim being present. Examples include `pwd_exp` (not every tenant requires passwords to expire) and `family_name` ([client credential](v2-oauth2-client-creds-grant-flow.md) flows are on behalf of applications that don't have names). Claims used for access token validation are always present.

Some claims are used to help the Microsoft identity platform secure tokens for reuse. These claims are marked as not being for public consumption in the description as `Opaque`. These claims may or may not appear in a token, and new ones may be added without notice.

### Header claims

| Claim | Format | Description |
|-------|--------|-------------|
| `typ` | String - always `JWT` | Indicates that the token is a JWT.|
| `alg` | String | Indicates the algorithm that was used to sign the token, for example, `RS256`. |
| `kid` | String | Specifies the thumbprint for the public key that can be used to validate this signature of the token. Emitted in both v1.0 and v2.0 access tokens. |
| `x5t` | String | Functions the same (in use and value) as `kid`. `x5t` and is a legacy claim emitted only in v1.0 access tokens for compatibility purposes. |

### Payload claims

| Claim | Format | Description | Authorization considerations |
|-------|--------|-------------|------------------------------|
| `aud` | String, an Application ID URI or GUID | Identifies the intended audience of the token. In v2.0 tokens, this value is always the client ID of the API. In v1.0 tokens, it can be the client ID or the resource URI used in the request. The value can depend on how the client requested the token. | This value must be validated, reject the token if the value doesn't match the intended audience. |
| `iss` | String, a security token service (STS) URI | Identifies the STS that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. If the token issued is a v2.0 token (see the `ver` claim), the URI ends in `/v2.0`. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. | The application can use the GUID portion of the claim to restrict the set of tenants that can sign in to the application, if applicable. |
|`idp`| String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account isn't in the same tenant as the issuer, such as guests. If the claim isn't present, the value of `iss` can be used instead. For personal accounts being used in an organizational context (for instance, a personal account invited to an Azure AD tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. | |
| `iat` | int, a Unix timestamp | Specifies when the authentication for this token occurred. | |
| `nbf` | int, a Unix timestamp | Specifies the time before which the JWT must not be accepted for processing. | |
| `exp` | int, a Unix timestamp | Specifies the expiration time on or after which the JWT must not be accepted for processing. A resource may reject the token before this time as well. The rejection can occur when a change in authentication is required or a token revocation has been detected. | |
| `aio` | Opaque String | An internal claim used by Azure AD to record data for token reuse. Resources shouldn't use this claim. | |
| `acr` | String, a `0` or `1`, only present in v1.0 tokens | A value of `0` for the "Authentication context class" claim indicates the end-user authentication didn't meet the requirements of ISO/IEC 29115. | |
| `amr` | JSON array of strings, only present in v1.0 tokens | Identifies how the subject of the token was authenticated. | |
| `appid` | String, a GUID, only present in v1.0 tokens | The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. | `appid` may be used in authorization decisions. |
| `azp` | String, a GUID, only present in v2.0 tokens | A replacement for `appid`. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. | `azp` may be used in authorization decisions. |
| `appidacr` | String, a `0`, `1`, or `2`, only present in v1.0 tokens | Indicates how the client was authenticated. For a public client, the value is `0`. If client ID and client secret are used, the value is `1`. If a client certificate was used for authentication, the value is `2`. | |
| `azpacr` | String, a `0`, `1`, or `2`, only present in v2.0 tokens | A replacement for `appidacr`. Indicates how the client was authenticated. For a public client, the value is `0`. If client ID and client secret are used, the value is `1`. If a client certificate was used for authentication, the value is `2`. | |
| `preferred_username` | String, only present in v2.0 tokens. | The primary username that represents the user. The value could be an email address, phone number, or a generic username without a specified format. The value is mutable and might change over time. The value can be used for username hints, however, and in human-readable UI as a username. The `profile` scope is required in order to receive this claim. | Since this value is mutable, it must not be used to make authorization decisions. |
| `name` | String | Provides a human-readable value that identifies the subject of the token. The value isn't guaranteed to be unique, it's mutable, and is only used for display purposes. The `profile` scope is required in order to receive this claim. | This value must not be used to make authorization decisions. |
| `scp` | String, a space separated list of scopes | The set of scopes exposed by the application for which the client application has requested (and received) consent. Only included for user tokens. | The application should verify that these scopes are valid ones exposed by the application, and make authorization decisions based on the value of these scopes. |
| `roles` | Array of strings, a list of permissions | The set of permissions exposed by the application that the requesting application or user has been given permission to call. For application tokens, this set of permissions is used during the [client credential flow](v2-oauth2-client-creds-grant-flow.md) in place of user scopes. For user tokens, this set of values is populated with the roles the user was assigned to on the target application. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `wids` | Array of [RoleTemplateID](../roles/permissions-reference.md#all-roles) GUIDs | Denotes the tenant-wide roles assigned to this user, from the section of roles present in [Azure AD built-in roles](../roles/permissions-reference.md#all-roles).  This claim is configured on a per-application basis, through the `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md). Setting it to `All` or `DirectoryRole` is required. May not be present in tokens obtained through the implicit flow due to token length concerns. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `groups` | JSON array of GUIDs | Provides object IDs that represent the group memberships of the subject. The groups included in the groups claim are configured on a per-application basis, through the `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md). A value of `null` excludes all groups, a value of `SecurityGroup` includes only Active Directory Security Group memberships, and a value of `All` includes both Security Groups and Microsoft 365 Distribution Lists. <br><br>See the `hasgroups` claim for details on using the `groups` claim with the implicit grant. For other flows, if the number of groups the user is in goes over 150 for SAML and 200 for JWT, then Azure AD adds an overage claim to the claim sources. The claim sources point to the Microsoft Graph endpoint that contains the list of groups for the user. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `hasgroups` | Boolean | If present, always `true`, indicates whether the user is in at least one group. Used in place of the `groups` claim for JWTs in implicit grant flows if the full groups claim would extend the URI fragment beyond the URL length limits (currently six or more groups). Indicates that the client should use the Microsoft Graph API to determine the groups (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`) of the user. | |
| `groups:src1` | JSON object | For token requests that aren't length limited (see `hasgroups`) but still too large for the token, a link to the full groups list for the user is included. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects" }` | |
| `sub` | String | The principal about which the token asserts information, such as the user of an application. This value is immutable and can't be reassigned or reused. The subject is a pairwise identifier that is unique to a particular application ID. If a single user signs into two different applications using two different client IDs, those applications receive two different values for the subject claim. Two different values may or may not be desired depending on architecture and privacy requirements. See also the `oid` claim (which does remain the same across applications within a tenant). | This value can be used to perform authorization checks, such as when the token is used to access a resource, and can be used as a key in database tables. |
| `oid` | String, a GUID | The immutable identifier for the requestor, which is the user or service principal whose identity has been verified. This ID uniquely identifies the requestor across applications. Two different applications signing in the same user receive the same value in the `oid` claim. The `oid` can be used when making queries to Microsoft online services, such as the Microsoft Graph. The Microsoft Graph returns this ID as the `id` property for a given user account. Because the `oid` allows multiple applications to correlate principals, the `profile` scope is required in order to receive this claim for users. If a single user exists in multiple tenants, the user contains a different object ID in each tenant. The accounts are considered different, even though the user logs into each account with the same credentials. | This value can be used to perform authorization checks, such as when the token is used to access a resource, and can be used as a key in database tables. |
| `tid` | String, a GUID | Represents the tenant that the user is signing in to. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user is signing in to. For sign-ins to the personal Microsoft account tenant (services like Xbox, Teams for Life, or Outlook), the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. To receive this claim, the application must request the `profile` scope. | This value should be considered in combination with other claims in authorization decisions. |
| `unique_name` | String, only present in v1.0 tokens | Provides a human readable value that identifies the subject of the token. | This value isn't guaranteed to be unique within a tenant and should be used only for display purposes. |
| `uti` | String | Token identifier claim, equivalent to `jti` in the JWT specification. Unique, per-token identifier that is case-sensitive. | |
| `rh` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources shouldn't use this claim. | |
| `ver` | String, either `1.0` or `2.0` | Indicates the version of the access token. | |

#### Groups overage claim

Azure AD limits the number of object IDs that it includes in the groups claim to stay within the size limit of the HTTP header. If a user is a member of more groups than the overage limit (150 for SAML tokens, 200 for JWT tokens, and only 6 if issued by using the implicit flow), then Azure AD doesn't emit the groups claim in the token. Instead, it includes an overage claim in the token that indicates to the application to query the Microsoft Graph API to retrieve the group membership of the user.

```JSON
{
    ...
    "_claim_names": {
        "groups": "src1"
    },
    "_claim_sources": {
        "src1": {
            "endpoint": "[Url to get this user's group membership from]"
        }   
    }
    ...
}
```

Use the `BulkCreateGroups.ps1` provided in the [App Creation Scripts](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-2-Groups/AppCreationScripts) folder to help test overage scenarios.

#### v1.0 basic claims

The following claims are included in v1.0 tokens if applicable, but aren't included in v2.0 tokens by default. To use these claims for v2.0, the application requests them using [optional claims](active-directory-optional-claims.md).

| Claim | Format | Description |
|-------|--------|-------------|
| `ipaddr`| String | The IP address the user authenticated from. |
| `onprem_sid`| String, in [SID format](/windows/desktop/SecAuthZ/sid-components) | In cases where the user has an on-premises authentication, this claim provides their SID. Use this claim for authorization in legacy applications. |
| `pwd_exp`| int, a Unix timestamp | Indicates when the user's password expires. |
| `pwd_url`| String | A URL where users can be sent to reset their password. |
| `in_corp`| boolean | Signals if the client is signing in from the corporate network. If they aren't, the claim isn't included. |
| `nickname`| String | Another name for the user, separate from first or last name.|
| `family_name` | String | Provides the last name, surname, or family name of the user as defined on the user object. |
| `given_name` | String | Provides the first or given name of the user, as set on the user object. |
| `upn` | String | The username of the user. May be a phone number, email address, or unformatted string. Should only be used for display purposes and providing username hints in reauthentication scenarios. |

#### amr claim

Identities can authenticate in different ways, which may be relevant to the application. The `amr` claim is an array that can contain multiple items, such as `["mfa", "rsa", "pwd"]`, for an authentication that used both a password and the Authenticator app.

| Value | Description |
|-----|-------------|
| `pwd` | Password authentication, either a user's Microsoft password or a client secret of an application. |
| `rsa` | Authentication was based on the proof of an RSA key, for example with the [Microsoft Authenticator app](https://aka.ms/AA2kvvu). This value also indicates whether authentication was done by a self-signed JWT with a service owned X509 certificate. |
| `otp` | One-time passcode using an email or a text message. |
| `fed` | A federated authentication assertion (such as JWT or SAML) was used. |
| `wia` | Windows Integrated Authentication |
| `mfa` | [Multi-factor authentication](../authentication/concept-mfa-howitworks.md) was used. When this claim is present, the other authentication methods are included. |
| `ngcmfa` | Equivalent to `mfa`, used for provisioning of certain advanced credential types. |
| `wiaormfa`| The user used Windows or an MFA credential to authenticate. |
| `none` | No authentication was done. |

## Access token lifetime

The default lifetime of an access token is variable. When issued, the default lifetime of an access token is assigned a random value ranging between 60-90 minutes (75 minutes on average). The variation improves service resilience by spreading access token demand over a time, which prevents hourly spikes in traffic to Azure AD.

Tenants that don’t use Conditional Access have a default access token lifetime of two hours for clients such as Microsoft Teams and Microsoft 365.

The lifetime of an access token can be adjusted to control how often the client application expires the application session, and how often it requires the user to reauthenticate (either silently or interactively). To override the default access token lifetime variation, set a static default access token lifetime by using [Configurable token lifetime (CTL)](active-directory-configurable-token-lifetimes.md).

Default token lifetime variation is applied to organizations that have Continuous Access Evaluation (CAE) enabled. Default token lifetime variation is applied even if the organizations use CTL policies. The default token lifetime for long lived token lifetime ranges from 20 to 28 hours. When the access token expires, the client must use the refresh token to silently acquire a new refresh token and access token.

Organizations that use [Conditional Access sign-in frequency (SIF)](../conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency) to enforce how frequently sign-ins occur can't override default access token lifetime variation. When organizations use SIF, the time between credential prompts for a client is the token lifetime that ranges from 60 - 90 minutes plus the sign-in frequency interval.  

Here's an example of how default token lifetime variation works with sign-in frequency.  Let's say an organization sets sign-in frequency to occur every hour. The actual sign-in interval occurs anywhere between 1 hour to 2.5 hours because the token is issued with lifetime ranging from 60-90 minutes (due to token lifetime variation).

If a user with a token with a one hour lifetime performs an interactive sign-in at 59 minutes (just before the sign-in frequency being exceeded), there's no credential prompt because the sign-in is below the SIF threshold.  If a new token is issued with a lifetime of 90 minutes, the user wouldn't see a credential prompt for another hour and a half.  When a silent renewal attempted of the 90-minute token lifetime is made, Azure AD requires a credential prompt because the total session length has exceeded the sign-in frequency setting of 1 hour. In this example, the time difference between credential prompts due to the SIF interval and token lifetime variation would be 2.5 hours.

## Validate tokens

Not all applications should validate tokens. Only in specific scenarios should applications validate a token:

- Web APIs must validate access tokens sent to them by a client. They must only accept tokens containing their `aud` claim.
- Confidential web applications like ASP.NET Core must validate ID tokens sent to them by using the user's browser in the hybrid flow, before allowing access to a user's data or establishing a session.

If none of the above scenarios apply, the application won't benefit from validating the token, and may present a security and reliability risk if decisions are made based on the validity of the token. Public clients like native or single-page applications don't benefit from validating tokens because the application communicates directly with the IDP where SSL protection ensures the tokens are valid.

APIs and web applications must only validate tokens that have an `aud` claim that matches the application. Other resources may have custom token validation rules. For example, tokens for Microsoft Graph won't validate according to these rules due to their proprietary format. Validating and accepting tokens meant for another resource is an example of the [confused deputy](https://cwe.mitre.org/data/definitions/441.html) problem.

If the application needs to validate an ID token or an access token, it should first validate the signature of the token and the issuer against the values in the OpenID discovery document. For example, the tenant-independent version of the document is located at [https://login.microsoftonline.com/common/.well-known/openid-configuration](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Azure AD middleware has built-in capabilities for validating access tokens, see [samples](sample-v2-code.md) to find one in the appropriate language. There are also several third-party open-source libraries available for JWT validation. For more information about Azure AD authentication libraries and code samples, see the [authentication libraries](reference-v2-libraries.md).

### Validating the signature

A JWT contains three segments, which are separated by the `.` character. The first segment is known as the **header**, the second as the **body**, and the third as the **signature**. The signature segment can be used to validate the authenticity of the token so that it can be trusted by the application.

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

At any given point in time, Azure AD may sign an ID token using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys on a periodic basis, so the application should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

Acquire the signing key data necessary to validate the signature by using the [OpenID Connect metadata document](v2-protocols-oidc.md#fetch-the-openid-configuration-document) located at:

```
https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
```

> [!TIP]
> Try this in a browser: [URL](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration)

The following information describes the metadata document:

- Is a JSON object that contains several useful pieces of information, such as the location of the various endpoints required for doing OpenID Connect authentication.
- Includes a `jwks_uri`, which gives the location of the set of public keys that correspond to the private keys used to sign tokens. The JSON Web Key (JWK) located at the `jwks_uri` contains all of the public key information in use at that particular moment in time. The JWK format is described in [RFC 7517](https://tools.ietf.org/html/rfc7517). The application can use the `kid` claim in the JWT header to select the public key, from this document, which corresponds to the private key that has been used to sign a particular token. It can then do signature validation using the correct public key and the indicated algorithm.

> [!NOTE]
> Use the `kid` claim to validate the token. Though v1.0 tokens contain both the `x5t` and `kid` claims, v2.0 tokens contain only the `kid` claim.

Doing signature validation is outside the scope of this document. There are many open-source libraries available for helping with signature validation if necessary.  However, the Microsoft identity platform has one token signing extension to the standards, which are custom signing keys.

If the application has custom signing keys as a result of using the [claims-mapping](active-directory-claims-mapping.md) feature, append an `appid` query parameter that contains the application ID to get a `jwks_uri` that points to the signing key information of the application, which should be used for validation. For example: `https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration?appid=6731de76-14a6-49ae-97bc-6eba6914391e` contains a `jwks_uri` of `https://login.microsoftonline.com/{tenant}/discovery/keys?appid=6731de76-14a6-49ae-97bc-6eba6914391e`.

### Claims based authorization

The business logic of an application determines how authorization should be handled. The general approach to authorization based on token claims, and which claims should be used, is described below.

After a token is validated with the correct `aud` claim, the token tenant, subject, actor must be authorized.

#### Tenant

First, always check that the `tid` in a token matches the tenant ID used to store data with the application. When information is stored for an application in the context of a tenant, it should only be accessed again later in the same tenant. Never allow data in one tenant to be accessed from another tenant.

#### Subject

Next, to determine if the token subject, such as the user (or app itself in the case of an app-only token), is authorized, either check for specific `sub` or `oid` claims, or check that the subject belongs to an appropriate role or group with the `roles`, `groups`, `wids` claims.

For example, use the immutable claim values `tid` and `oid` as a combined key for application data and determining whether a user should be granted access.

The `roles`, `groups` or `wids` claims can also be used to determine if the subject has authorization to perform an operation. For example, an administrator may have permission to write to an API, but not a normal user, or the user may be in a group allowed to do some action.

> [!WARNING]
> Never use `email` or `upn` claim values to store or determine whether the user in an access token should have access to data. Mutable claim values like these can change over time, making them insecure and unreliable for authorization.

#### Actor

Lastly, when an app is acting for a user, this client app (the actor), must also be authorized. Use the `scp` claim (scope) to validate that the app has permission to perform an operation.

Scopes are defined by the application, and the absence of `scp` claim means full actor permissions.	

> [!NOTE]
> An application may handle app-only tokens (requests from applications without users, such as daemon apps) and want to authorize a specific application across multiple tenants, rather than individual service principal IDs. In that case, check for an app-only token using the `idtyp` optional claim and use the `appid` claim (for v1.0 tokens) or the `azp` claim (for v2.0 tokens) along with `tid` to determine authorization based on tenant and application ID.


## Token revocation

Refresh tokens can be invalidated or revoked at any time, for different reasons. The reasons fall into the categories of timeouts and revocations.

### Token timeouts

When an organization uses [token lifetime configuration](active-directory-configurable-token-lifetimes.md), the lifetime of refresh tokens can be altered. It's expected that some tokens can go without use. For example, the user doesn't open the application for three months and then the token expires. Applications can encounter scenarios where the login server rejects a refresh token due to its age.

- MaxInactiveTime: If the refresh token hasn't been used within the time dictated by the MaxInactiveTime, the refresh token is no longer valid.
- MaxSessionAge: If MaxAgeSessionMultiFactor or MaxAgeSessionSingleFactor have been set to something other than their default (Until-revoked), then reauthentication is required after the time set in the MaxAgeSession* elapses. Examples:
  - The tenant has a MaxInactiveTime of five days, and the user went on vacation for a week, and so Azure AD hasn't seen a new token request from the user in seven days. The next time the user requests a new token, they'll find their refresh token has been revoked, and they must enter their credentials again.
  - A sensitive application has a MaxAgeSessionSingleFactor of one day. If a user logs in on Monday, and on Tuesday (after 25 hours have elapsed), they'll be required to reauthenticate.

### Token revocations

Refresh tokens can be revoked by the server due to a change in credentials, or due to use or administrative action. Refresh tokens are in the classes of confidential clients and public clients.

| Change | Password-based cookie | Password-based token | Non-password-based cookie | Non-password-based token | Confidential client token |
|---|-----------------------|----------------------|---------------------------|--------------------------|---------------------------|
| Password expires | Stays alive | Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User revokes their refresh tokens by using [PowerShell](/powershell/module/azuread/revoke-azureadsignedinuserallrefreshtoken) | Revoked | Revoked | Revoked | Revoked | Revoked |
| Admin revokes all refresh tokens for a user by using [PowerShell](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) | Revoked | Revoked |Revoked | Revoked | Revoked |
| [Single sign-out](v2-protocols-oidc.md#single-sign-out) on web | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

#### Non-password-based

A *non-password-based* login is one where the user didn't type in a password to get it. Examples of non-password-based login include:

- Using your face with Windows Hello
- FIDO2 key
- SMS
- Voice
- PIN

For more information, see [Primary Refresh Tokens](../devices/concept-primary-refresh-token.md).

## Next steps

- Learn about [`id_tokens` in Azure AD](id-tokens.md).
- Learn about [permission and consent](permissions-consent-overview.md).
