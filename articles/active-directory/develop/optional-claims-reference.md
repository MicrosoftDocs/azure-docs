---
title: Optional claims reference
description: Claims reference with details on the optional claims that can be included in tokens in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 06/07/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
ms.reviewer: ludwignick
---

# Optional claims reference

You can use optional claims to:

- Select claims to include in tokens for your application.
- Change the behavior of certain claims that the Microsoft identity platform returns in tokens.
- Add and access custom claims for your application.

While optional claims are supported in both v1.0 and v2.0 format tokens and SAML tokens, they provide most of their value when moving from v1.0 to v2.0. In the Microsoft identity platform, smaller token sizes are used to ensure optimal performance by clients. As a result, several claims formerly included in the access and ID tokens are no longer present in v2.0 tokens and must be asked for specifically on a per-application basis.

| Account Type | v1.0 tokens | v2.0 tokens |
|--------------|-------------|-------------|
| Personal Microsoft account | N/A | Supported |
| Azure AD account | Supported | Supported |

## v1.0 and v2.0 optional claims set

The set of optional claims available by default for applications to use are listed in the following table. You can use custom data in extension attributes and directory extensions to add optional claims for your application. When you add claims to the access token, the claims apply to access tokens requested *for* the application (a web API), not claims requested *by* the application. No matter how the client accesses your API, the right data is present in the access token that's used to authenticate against your API.

> [!NOTE]
>The majority of these claims can be included in JWTs for v1.0 and v2.0 tokens, but not SAML tokens, except where noted in the Token Type column. Consumer accounts support a subset of these claims, marked in the User Type column.  Many of the claims listed don't apply to consumer users (they have no tenant, so `tenant_ctry` has no value).

The following table lists the v1.0 and v2.0 optional claim set.

| Name | Description | Token Type | User Type | Notes |
|------|-------------|------------|-----------|-------|
| `acct` | Users account status in tenant | JWT, SAML | | If the user is a member of the tenant, the value is `0`. If they're a guest, the value is `1`. |
| `acrs` | Auth Context IDs | JWT | Azure AD | Indicates the Auth Context IDs of the operations that the bearer is eligible to perform. Auth Context IDs can be used to trigger a demand for step-up authentication from within your application and services. Often used along with the `xms_cc` claim. |
| `auth_time` | Time when the user last authenticated. | JWT | | |
| `ctry` | User's country/region | JWT |  | This claim is returned if it's present and the value of the field is a standard two-letter country/region code, such as FR, JP, SZ, and so on. |
| `email` | The reported email address for this user | JWT, SAML | MSA, Azure AD | This value is included by default if the user is a guest in the tenant. For managed users (the users inside the tenant), it must be requested through this optional claim or, on v2.0 only, with the OpenID scope. This value isn't guaranteed to be correct, and is mutable over time - never use it for authorization or to save data for a user. For more information, see [Validate the user has permission to access this data](access-tokens.md). If you're using the email claim for authorization, we recommend [performing a migration to move to a more secure claim](./migrate-off-email-claim-authorization.md). If you require an addressable email address in your app, request this data from the user directly, using this claim as a suggestion or prefill in your UX. |
| `fwd` | IP address | JWT | | Adds the original address of the requesting client (when inside a VNET). |
| `groups` | Optional formatting for group claims | JWT, SAML | | The `groups` claim is used with the GroupMembershipClaims setting in the [application manifest](reference-app-manifest.md), which must be set as well. |
| `idtyp` | Token type | JWT access tokens | Special: only in app-only access tokens | The value is `app` when the token is an app-only token. This claim is the most accurate way for an API to determine if a token is an app token or an app+user token. |
| `login_hint` | Login hint | JWT | MSA, Azure AD | An opaque, reliable login hint claim that's base 64 encoded. Don't modify this value. This claim is the best value to use for the `login_hint` OAuth parameter in all flows to get SSO. It can be passed between applications to help them silently SSO as well - application A can sign in a user, read the `login_hint` claim, and then send the claim and the current tenant context to application B in the query string or fragment when the user selects on a link that takes them to application B. To avoid race conditions and reliability issues, the `login_hint` claim *doesn't* include the current tenant for the user, and defaults to the user's home tenant when used. In a guest scenario where the user is from another tenant, a tenant identifier must be provided in the sign-in request. and pass the same to apps you partner with. This claim is intended for use with your SDK's existing `login_hint` functionality, however that it exposed. |
| `sid` | Session ID, used for per-session user sign out | JWT | Personal and Azure AD accounts. | |
| `tenant_ctry` | Resource tenant's country/region | JWT | | Same as `ctry` except set at a tenant level by an admin. Must also be a standard two-letter value. |
| `tenant_region_scope` | Region of the resource tenant | JWT | | |
| `upn` | UserPrincipalName | JWT, SAML | | An identifier for the user that can be used with the `username_hint` parameter. Not a durable identifier for the user and shouldn't be used for authorization or to uniquely identity user information (for example, as a database key). Instead, use the user object ID (`oid`) as a database key. For more information, see [Secure applications and APIs by validating claims](claims-validation.md). Users signing in with an [alternate login ID](../authentication/howto-authentication-use-email-signin.md) shouldn't be shown their User Principal Name (UPN). Instead, use the following ID token claims for displaying sign-in state to the user: `preferred_username` or `unique_name` for v1 tokens and `preferred_username` for v2 tokens. Although this claim is automatically included, you can specify it as an optional claim to attach other properties to modify its behavior in the guest user case. You should use the `login_hint` claim for `login_hint` use - human-readable identifiers like UPN are unreliable. |
| `verified_primary_email` | Sourced from the user's PrimaryAuthoritativeEmail | JWT | | |
| `verified_secondary_email` | Sourced from the user's SecondaryAuthoritativeEmail   | JWT | | |
| `vnet` | VNET specifier information. | JWT | | |
| `xms_cc` | Client Capabilities | JWT | Azure AD | Indicates whether the client application that acquired the token is capable of handling claims challenges. It's often used along with claim `acrs`. This claim is commonly used in Conditional Access and Continuous Access Evaluation scenarios. The resource server or service application that the token is issued for controls the presence of this claim in a token. A value of `cp1` in the access token is the authoritative way to identify that a client application is capable of handling a claims challenge. For more information, see [Claims challenges, claims requests and client capabilities](claims-challenge.md?tabs=dotnet). |
| `xms_edov` | Boolean value indicating whether the user's email domain owner has been verified. | JWT | | An email is considered to be domain verified if it belongs to the tenant where the user account resides and the tenant admin has done verification of the domain. Also, the email must be from a Microsoft account (MSA), a Google account, or used for authentication using the one-time passcode (OTP) flow. It should also be noted the Facebook and SAML/WS-Fed accounts **do not** have verified domains. | 
| `xms_pdl` | Preferred data location | JWT | | For Multi-Geo tenants, the preferred data location is the three-letter code showing the geographic region the user is in. For more information, see the [Azure AD Connect documentation about preferred data location](../hybrid/how-to-connect-sync-feature-preferreddatalocation.md). |
| `xms_pl` | User preferred language | JWT | | The user's preferred language, if set. Sourced from their home tenant, in guest access scenarios. Formatted LL-CC ("en-us"). |
| `xms_tpl` | Tenant preferred language| JWT | | The resource tenant's preferred language, if set. Formatted LL ("en"). |
| `ztdid` | Zero-touch Deployment ID | JWT | | The device identity used for `Windows AutoPilot`. |

> [!WARNING]
> Never use `email` or `upn` claim values to store or determine whether the user in an access token should have access to data. Mutable claim values like these can change over time, making them insecure and unreliable for authorization.

## v2.0-specific optional claims set

These claims are always included in v1.0 tokens, but not included in v2.0 tokens unless requested. These claims are only applicable for JWTs (ID tokens and access tokens).

| JWT Claim | Name | Description | Notes |
|-----------|------|-------------|-------|
| `ipaddr` | IP Address | The IP address the client logged in from. | |
| `onprem_sid` | On-premises Security Identifier | | |
| `pwd_exp` | Password Expiration Time | The number of seconds after the time in the `iat` claim at which the password expires. This claim is only included when the password is expiring soon (as defined by "notification days" in the password policy). | |
| `pwd_url` | Change Password URL | A URL that the user can visit to change their password. This claim is only included when the password is expiring soon (as defined by "notification days" in the password policy). | |
| `in_corp` | Inside Corporate Network | Signals if the client is logging in from the corporate network. If they're not, the claim isn't included. | Based off of the [trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips) settings in MFA. |
| `family_name` | Last Name | Provides the last name, surname, or family name of the user as defined in the user object. For example, `"family_name":"Miller"`. | Supported in MSA and Azure AD. Requires the `profile` scope. |
| `given_name` | First name | Provides the first or "given" name of the user, as set on the user object. For example, `"given_name": "Frank"`. | Supported in MSA and Azure AD. Requires the `profile` scope. |
| `upn` | User Principal Name | An identifier for the user that can be used with the `username_hint` parameter. Not a durable identifier for the user and shouldn't be used for authorization or to uniquely identity user information (for example, as a database key). For more information, see [Secure applications and APIs by validating claims](claims-validation.md). Instead, use the user object ID (`oid`) as a database key. Users signing in with an [alternate login ID](../authentication/howto-authentication-use-email-signin.md) shouldn't be shown their User Principal Name (UPN). Instead, use the following `preferred_username` claim for displaying sign-in state to the user. | Requires the `profile` scope. |

## v1.0-specific optional claims set

Some of the improvements of the v2 token format are available to apps that use the v1 token format, as they help improve security and reliability. These improvements only apply to JWTs, not SAML tokens.

| JWT Claim | Name | Description | Notes |
|-----------|------|-------------|-------|
|`aud` | Audience | Always present in JWTs, but in v1 access tokens it can be emitted in various ways - any appID URI, with or without a trailing slash, and the client ID of the resource. This randomization can be hard to code against when performing token validation. Use `additionalProperties` for this claim to ensure it's always set to the resource's client ID in v1 access tokens. | v1 JWT access tokens only|
|`preferred_username` | Preferred username | Provides the preferred username claim within v1 tokens. This claim makes it easier for apps to provide username hints and show human readable display names, regardless of their token type. It's recommended that you use this optional claim instead of using, `upn` or `unique_name`. | v1 ID tokens and access tokens |

### `additionalProperties` of optional claims

Some optional claims can be configured to change the way the claim is returned. These `additionalProperties` are mostly used to help migration of on-premises applications with different data expectations. For example, `include_externally_authenticated_upn_without_hash` helps with clients that can't handle hash marks (`#`) in the UPN.

| Property name | `additionalProperty` name | Description |
|---------------|--------------------------|-------------|
| `upn` | | Can be used for both SAML and JWT responses, and for v1.0 and v2.0 tokens. |
| | `include_externally_authenticated_upn` | Includes the guest UPN as stored in the resource tenant. For example, `foo_hometenant.com#EXT#@resourcetenant.com`. |
| | `include_externally_authenticated_upn_without_hash` | Same as listed previously, except that the hash marks (`#`) are replaced with underscores (`_`), for example `foo_hometenant.com_EXT_@resourcetenant.com`. |
| `aud` | | In v1 access tokens, this claim is used to change the format of the `aud` claim.  This claim has no effect in v2 tokens or either version's ID tokens, where the `aud` claim is always the client ID. Use this configuration to ensure that your API can more easily perform audience validation. Like all optional claims that affect the access token, the resource in the request must set this optional claim, since resources own the access token. |
| | `use_guid` | Emits the client ID of the resource (API) in GUID format as the `aud` claim always instead of it being runtime dependent. For example, if a resource sets this flag, and its client ID is `bb0a297b-6a42-4a55-ac40-09a501456577`, any app that requests an access token for that resource receives an access token with `aud` : `bb0a297b-6a42-4a55-ac40-09a501456577`. Without this claim set, an API could get tokens with an `aud` claim of `api://MyApi.com`, `api://MyApi.com/`, `api://myapi.com/AdditionalRegisteredField` or any other value set as an app ID URI for that API, and the client ID of the resource. |

#### `additionalProperties` example

```json
"optionalClaims": {
    "idToken": [
        {
            "name": "upn",
            "essential": false,
            "additionalProperties": [
                "include_externally_authenticated_upn"
            ]
        }
    ]
}
```

This `optionalClaims` object causes the ID token returned to the client to include a `upn` claim with the other home tenant and resource tenant information. The `upn` claim is only changed in the token if the user is a guest in the tenant (that uses a different IDP for authentication).

## See also

- [Access token](access-tokens.md)
- [ID token](id-tokens.md)

## Next steps

- Learn more about [configuring optional claims](optional-claims.md).
