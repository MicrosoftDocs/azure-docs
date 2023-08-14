---
title: Access token claims reference
description: Claims reference with details on the claims included in access tokens issued by the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 05/26/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
---

# Access token claims reference

Access tokens are [JSON web tokens (JWT)](https://wikipedia.org/wiki/JSON_Web_Token). JWTs contain the following pieces:

- **Header** - Provides information about how to validate the token including information about the type of token and its signing method.
- **Payload** - Contains all of the important data about the user or application that's attempting to call the service.
- **Signature** - Is the raw material used to validate the token.

Each piece is separated by a period (`.`) and separately Base 64 encoded.

Claims are present only if a value exists to fill it. An application shouldn't take a dependency on a claim being present. Examples include `pwd_exp` (not every tenant requires passwords to expire) and `family_name` ([client credential](v2-oauth2-client-creds-grant-flow.md) flows are on behalf of applications that don't have names). Claims used for access token validation are always present.

The Microsoft identity platform uses some claims to help secure tokens for reuse. The description of `Opaque` marks these claims as not being for public consumption. These claims may or may not appear in a token, and new ones may be added without notice.

## Header claims

| Claim | Format | Description |
|-------|--------|-------------|
| `typ` | String - always `JWT` | Indicates that the token is a JWT.|
| `alg` | String | Indicates the algorithm used to sign the token, for example, `RS256`. |
| `kid` | String | Specifies the thumbprint for the public key used for validating the signature of the token. Emitted in both v1.0 and v2.0 access tokens. |
| `x5t` | String | Functions the same (in use and value) as `kid`. `x5t` and is a legacy claim emitted only in v1.0 access tokens for compatibility purposes. |

## Payload claims

| Claim | Format | Description | Authorization considerations |
|-------|--------|-------------|------------------------------|
| `acrs` | JSON array of strings | Indicates the Auth Context IDs of the operations that the bearer is eligible to perform. Auth Context IDs can be used to trigger a demand for step-up authentication from within your application and services. Often used along with the `xms_cc` claim. |
| `aud` | String, an Application ID URI or GUID | Identifies the intended audience of the token. In v2.0 tokens, this value is always the client ID of the API. In v1.0 tokens, it can be the client ID or the resource URI used in the request. The value can depend on how the client requested the token. | This value must be validated, reject the token if the value doesn't match the intended audience. |
| `iss` | String, a security token service (STS) URI | Identifies the STS that constructs and returns the token, and the Azure AD tenant of the authenticated user. If the token issued is a v2.0 token (see the `ver` claim), the URI ends in `/v2.0`. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. | The application can use the GUID portion of the claim to restrict the set of tenants that can sign in to the application, if applicable. |
|`idp`| String, usually an STS URI | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account isn't in the same tenant as the issuer, such as guests. Use the value of `iss` if the claim isn't present. For personal accounts being used in an organizational context (for instance, a personal account invited to an Azure AD tenant), the `idp` claim may be 'live.com' or an STS URI containing the Microsoft account tenant `9188040d-6c67-4c5b-b112-36a304b66dad`. | |
| `iat` | int, a Unix timestamp | Specifies when the authentication for this token occurred. | |
| `nbf` | int, a Unix timestamp | Specifies the time after which the JWT can be processed. | |
| `exp` | int, a Unix timestamp | Specifies the expiration time before which the JWT can be accepted for processing. A resource may reject the token before this time as well. The rejection can occur for a required change in authentication or when a token is revoked. | |
| `aio` | Opaque String | An internal claim used by Azure AD to record data for token reuse. Resources shouldn't use this claim. | |
| `acr` | String, a `0` or `1`, only present in v1.0 tokens | A value of `0` for the "Authentication context class" claim indicates the end-user authentication didn't meet the requirements of ISO/IEC 29115. | |
| `amr` | JSON array of strings, only present in v1.0 tokens | Identifies the authentication method of the subject of the token. | |
| `appid` | String, a GUID, only present in v1.0 tokens | The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. |  `appid` may be used in authorization decisions. |
| `azp` | String, a GUID, only present in v2.0 tokens | A replacement for `appid`. The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. | `azp` may be used in authorization decisions. |
| `appidacr` | String, a `0`, `1`, or `2`, only present in v1.0 tokens | Indicates authentication method of the client. For a public client, the value is `0`. When you use the client ID and client secret, the value is `1`. When you use a client certificate for authentication, the value is `2`. | |
| `azpacr` | String, a `0`, `1`, or `2`, only present in v2.0 tokens | A replacement for `appidacr`. Indicates the authentication method of the client. For a public client, the value is `0`. When you use the client ID and client secret, the value is `1`. When you use a client certificate for authentication, the value is `2`. | |
| `preferred_username` | String, only present in v2.0 tokens. | The primary username that represents the user. The value could be an email address, phone number, or a generic username without a specified format. Use the value for username hints and in human-readable UI as a username. To receive this claim, use the `profile` scope. | Since this value is mutable, don't use it to make authorization decisions. |
| `name` | String | Provides a human-readable value that identifies the subject of the token. The value can vary, it's mutable, and is for display purposes only. To receive this claim, use the `profile` scope. | Don't use this value to make authorization decisions. |
| `scp` | String, a space separated list of scopes | The set of scopes exposed by the application for which the client application has requested (and received) consent. Only included for user tokens. | The application should verify that these scopes are valid ones exposed by the application, and make authorization decisions based on the value of these scopes. |
| `roles` | Array of strings, a list of permissions | The set of permissions exposed by the application that the requesting application or user has been given permission to call.  The [client credential flow](v2-oauth2-client-creds-grant-flow.md) uses this set of permission in place of user scopes for application tokens. For user tokens, this set of values contains the assigned roles of the user on the target application. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `wids` | Array of [RoleTemplateID](../roles/permissions-reference.md#all-roles) GUIDs | Denotes the tenant-wide roles assigned to this user, from the section of roles present in [Azure AD built-in roles](../roles/permissions-reference.md#all-roles). The `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md) configures this claim on a per-application basis. Set the claim to `All` or `DirectoryRole`. May not be present in tokens obtained through the implicit flow due to token length concerns. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `groups` | JSON array of GUIDs | Provides object IDs that represent the group memberships of the subject. The `groupMembershipClaims` property of the [application manifest](reference-app-manifest.md) configures the groups claim on a per-application basis. A value of `null` excludes all groups, a value of `SecurityGroup` includes only Active Directory Security Group memberships, and a value of `All` includes both Security Groups and Microsoft 365 Distribution Lists. <br><br>See the `hasgroups` claim for details on using the `groups` claim with the implicit grant. For other flows, if the number of groups the user is in goes over 150 for SAML and 200 for JWT, then Azure AD adds an overage claim to the claim sources. The claim sources point to the Microsoft Graph endpoint that contains the list of groups for the user. | These values can be used for managing access, such as enforcing authorization to access a resource. |
| `hasgroups` | Boolean | If present, always `true`, indicates whether the user is in at least one group. Used in place of the `groups` claim for JWTs in implicit grant flows if the full groups claim would extend the URI fragment beyond the URL length limits (currently six or more groups). Indicates that the client should use the Microsoft Graph API to determine the groups (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`) of the user. | |
| `groups:src1` | JSON object | Includes a link to the full groups list for the user when token requests are too large for the token. For JWTs as a distributed claim, for SAML as a new claim in place of the `groups` claim. <br><br>**Example JWT Value**: <br> `"groups":"src1"` <br> `"_claim_sources`: `"src1" : { "endpoint" : "https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects" }` | |
| `sub` | String | The principal associated with the token. For example, the user of an application. This value is immutable, don't reassign or reuse. The subject is a pairwise identifier that's unique to a particular application ID. If a single user signs into two different applications using two different client IDs, those applications receive two different values for the subject claim. Using the two different values depends on architecture and privacy requirements. See also the `oid` claim, which does remain the same across applications within a tenant. | This value can be used to perform authorization checks, such as when the token is used to access a resource, and can be used as a key in database tables. |
| `oid` | String, a GUID | The immutable identifier for the requestor, which is the verified identity of the user or service principal. This ID uniquely identifies the requestor across applications. Two different applications signing in the same user receive the same value in the `oid` claim. The `oid` can be used when making queries to Microsoft online services, such as the Microsoft Graph. The Microsoft Graph returns this ID as the `id` property for a given user account. Because the `oid` allows multiple applications to correlate principals, to receive this claim for users use the `profile` scope. If a single user exists in multiple tenants, the user contains a different object ID in each tenant. Even though the user logs into each account with the same credentials, the accounts are different. | This value can be used to perform authorization checks, such as when the token is used to access a resource, and can be used as a key in database tables. |
| `tid` | String, a GUID | Represents the tenant that the user is signing in to. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user is signing in to. For sign-ins to the personal Microsoft account tenant (services like Xbox, Teams for Life, or Outlook), the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. To receive this claim, the application must request the `profile` scope. | This value should be considered in combination with other claims in authorization decisions. |
| `unique_name` | String, only present in v1.0 tokens | Provides a human readable value that identifies the subject of the token. | This value can be different within a tenant and use it only for display purposes. |
| `uti` | String | Token identifier claim, equivalent to `jti` in the JWT specification. Unique, per-token identifier that is case-sensitive. | |
| `rh` | Opaque String | An internal claim used by Azure to revalidate tokens. Resources shouldn't use this claim. | |
| `ver` | String, either `1.0` or `2.0` | Indicates the version of the access token. | |
| `xms_cc` | JSON array of strings | Indicates whether the client application that acquired the token is capable of handling claims challenges. It's often used along with claim `acrs`. This claim is commonly used in Conditional Access and Continuous Access Evaluation scenarios. The resource server or service application that the token is issued for controls the presence of this claim in a token. A value of `cp1` in the access token is the authoritative way to identify that a client application is capable of handling a claims challenge. For more information, see [Claims challenges, claims requests and client capabilities](claims-challenge.md?tabs=dotnet). |

### Groups overage claim

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

### v1.0 basic claims

The v1.0 tokens include the following claims if applicable, but not v2.0 tokens by default. To use these claims for v2.0, the application requests them using [optional claims](active-directory-optional-claims.md).

| Claim | Format | Description |
|-------|--------|-------------|
| `ipaddr`| String | The IP address the user authenticated from. |
| `onprem_sid`| String, in [SID format](/windows/desktop/SecAuthZ/sid-components) | In cases where the user has an on-premises authentication, this claim provides their SID. Use this claim for authorization in legacy applications. |
| `pwd_exp`| int, a Unix timestamp | Indicates when the user's password expires. |
| `pwd_url`| String | A URL where users can reset their password. |
| `in_corp`| boolean | Signals if the client is signing in from the corporate network. |
| `nickname`| String | Another name for the user, separate from first or last name.|
| `family_name` | String | Provides the last name, surname, or family name of the user as defined on the user object. |
| `given_name` | String | Provides the first or given name of the user, as set on the user object. |
| `upn` | String | The username of the user. May be a phone number, email address, or unformatted string. Only use for display purposes and providing username hints in reauthentication scenarios. |

### amr claim

Identities can authenticate in different ways, which may be relevant to the application. The `amr` claim is an array that can contain multiple items, such as `["mfa", "rsa", "pwd"]`, for an authentication that used both a password and the Authenticator app.

| Value | Description |
|-----|-------------|
| `pwd` | Password authentication, either a user's Microsoft password or a client secret of an application. |
| `rsa` | Authentication was based on the proof of an RSA key, for example with the [Microsoft Authenticator app](https://aka.ms/AA2kvvu). This value also indicates the use of a self-signed JWT with a service owned X509 certificate in authentication. |
| `otp` | One-time passcode using an email or a text message. |
| `fed` | Indicates the use of a federated authentication assertion (such as JWT or SAML). |
| `wia` | Windows Integrated Authentication |
| `mfa` | Indicates the use of [Multi-factor authentication](../authentication/concept-mfa-howitworks.md). Includes the other authentication methods when this claim is present. |
| `ngcmfa` | Equivalent to `mfa`, used for provisioning of certain advanced credential types. |
| `wiaormfa`| The user used Windows or an MFA credential to authenticate. |
| `none` | Indicates no completed authentication. |

## Next steps

- Learn more about the [access tokens used in Azure AD](access-tokens.md).
