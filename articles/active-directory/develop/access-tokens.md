---
title: Azure Active Directory access tokens reference | Microsoft Docs
description: Accepting access tokens emitted by the v1.0 and v2.0 endpoints of Azure AD. 
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: df02ab01-3490-419b-90f5-be7adaeadd58
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/31/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# Azure AD access tokens

Access tokens enable clients to securely call APIs protected by Azure.  Azure AD access tokens are [JWTs](https://tools.ietf.org/html/rfc7519), base-64 encoded JSON objects signed by Azure.  For clients, these access tokens should be treated as opaque strings, as the contents of the token are intended for the resource only.  For validation and debugging purposes though, JWTs can be decoded using a site like [jwt.ms](https://jwt.ms).  Your client can get an access token from either endpoint (v1.0 or v2.0) using a variety of protocols.

When you request an access token, Azure AD also returns some metadata about the access token for your app's consumption. This information includes the expiry time of the access token and the scopes for which it is valid. This allows your app to perform intelligent caching of access tokens without having to parse open the access token itself.

[!> Try it out!] 
This is a v1.0 access token - view it in [JWT.ms](https://jwt.ms/#access_token=eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFEWHpaM2lmci1HUmJEVDQ1ek5TRUZFY0dpMmkxeGdrbW4zVmFxdkZzYkE5Y2JjYmlOSThtZFktY2Y2dkMtOEFkbTVQcVo1dHlLUWcyTGhBU1F0N25KMTdSSFB6QzFRUVI3Vjk2QWV6MFB6SmlBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiN19adWYxdHZrd0x4WWFIUzNxNmxValVZSUd3Iiwia2lkIjoiN19adWYxdHZrd0x4WWFIUzNxNmxValVZSUd3In0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNTMzOTIxNTQ5LCJuYmYiOjE1MzM5MjE1NDksImV4cCI6MTUzMzkyNTQ0OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhJQUFBQVVjZU9oVEEvd2VqR2ZvWStrOVp1bmRBczNldXJSWnp1elREd1NFUVMrNloyRThwU1AvZE0yV00yeU5YTmZzc2NaZWZBMHA0Y1pxOEptWXEraHMvcDVBPT0iLCJhbXIiOlsicnNhIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IlRlc3RPZmZsaW5lQWNjZXNzIiwiYXBwaWQiOiJmZWZlZDlmMy1lZmU2LTQ3Y2YtODY5YS04YzcwZjMyMjQ5NjQiLCJhcHBpZGFjciI6IjEiLCJkZXZpY2VpZCI6ImVkNTU1NTVlLTU1ZDUtNTU1NS1hNWY1LTU1MGRlNTU1NTU1ZSIsImZhbWlseV9uYW1lIjoiTGluY29sbiIsImdpdmVuX25hbWUiOiJBYnJhaGFtIiwiaXBhZGRyIjoiMTExLjEyMi4xMzMuMTQ0IiwibmFtZSI6IkFicmFoYW0gTGluY29sbiIsIm9pZCI6IjY1NWRhZmJlLWZmNWEtNGQ1Ni1hYmQxLTdlNGY3ZDM4ZTQ3NCIsInJoIjoiSSIsInNjcCI6IlVzZXIuUmVhZCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJkdmNfZG1qZCIsImttc2kiXSwic3ViIjoiaENfQUh3R3JuMFJkQ0Vnei1WXzVhX3R2Ul9RcnpHSm1vR1ZrM3dBcEZvMCIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiYWJlTGluQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhYmVMaW5AbWljcm9zb2Z0LmNvbSIsInV0aSI6IkppSVg0UWpkWGtleTVNenJBQUFBQUEiLCJ2ZXIiOiIxLjAifQ.MztYL_oFyjZ7n36LcIWdM4Sah99OwYZlZ6vhTxArMaM3P-o1jEXe1KnzUrF8jhGk5IiGMzxkMDiB3PyI4l9093V_wc7XU2JRnFqlvPvUEBChtagI3DtxZQcsUm7w7J08FuTSpRTMPL-tLXmwQRrTxJVXoIvapCTeCW84HAGMQwVUnLQVgXzeZtXjQ8UgVpcAO7zoliYUYLM45kC2uqw9MDuOT-M4aTyFmUFIDsq7qs7lRUZ7jDfLWX9OvrstigylfQTC1A6WaI9c-qSL3dBFqSJhIxJmsNiJ5EMCJ26iHZ-SiZ_gPmp4lVNZh7ul9lKJsl11OQ).  Note that it includes several [optional claims](active-directory-optional-claims.md), which won't appear unless your resource requests them.  

    eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFEWHpaM2lmci1HUmJEVDQ1ek5TRUZFY0dpMmkxeGdrbW4zVmFxdkZzYkE5Y2JjYmlOSThtZFktY2Y2dkMtOEFkbTVQcVo1dHlLUWcyTGhBU1F0N25KMTdSSFB6QzFRUVI3Vjk2QWV6MFB6SmlBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiN19adWYxdHZrd0x4WWFIUzNxNmxValVZSUd3Iiwia2lkIjoiN19adWYxdHZrd0x4WWFIUzNxNmxValVZSUd3In0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNTMzOTIxNTQ5LCJuYmYiOjE1MzM5MjE1NDksImV4cCI6MTUzMzkyNTQ0OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhJQUFBQVVjZU9oVEEvd2VqR2ZvWStrOVp1bmRBczNldXJSWnp1elREd1NFUVMrNloyRThwU1AvZE0yV00yeU5YTmZzc2NaZWZBMHA0Y1pxOEptWXEraHMvcDVBPT0iLCJhbXIiOlsicnNhIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IlRlc3RPZmZsaW5lQWNjZXNzIiwiYXBwaWQiOiJmZWZlZDlmMy1lZmU2LTQ3Y2YtODY5YS04YzcwZjMyMjQ5NjQiLCJhcHBpZGFjciI6IjEiLCJkZXZpY2VpZCI6ImVkNTU1NTVlLTU1ZDUtNTU1NS1hNWY1LTU1MGRlNTU1NTU1ZSIsImZhbWlseV9uYW1lIjoiTGluY29sbiIsImdpdmVuX25hbWUiOiJBYnJhaGFtIiwiaXBhZGRyIjoiMTExLjEyMi4xMzMuMTQ0IiwibmFtZSI6IkFicmFoYW0gTGluY29sbiIsIm9pZCI6IjY1NWRhZmJlLWZmNWEtNGQ1Ni1hYmQxLTdlNGY3ZDM4ZTQ3NCIsInJoIjoiSSIsInNjcCI6IlVzZXIuUmVhZCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJkdmNfZG1qZCIsImttc2kiXSwic3ViIjoiaENfQUh3R3JuMFJkQ0Vnei1WXzVhX3R2Ul9RcnpHSm1vR1ZrM3dBcEZvMCIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiYWJlTGluQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhYmVMaW5AbWljcm9zb2Z0LmNvbSIsInV0aSI6IkppSVg0UWpkWGtleTVNenJBQUFBQUEiLCJ2ZXIiOiIxLjAifQ.MztYL_oFyjZ7n36LcIWdM4Sah99OwYZlZ6vhTxArMaM3P-o1jEXe1KnzUrF8jhGk5IiGMzxkMDiB3PyI4l9093V_wc7XU2JRnFqlvPvUEBChtagI3DtxZQcsUm7w7J08FuTSpRTMPL-tLXmwQRrTxJVXoIvapCTeCW84HAGMQwVUnLQVgXzeZtXjQ8UgVpcAO7zoliYUYLM45kC2uqw9MDuOT-M4aTyFmUFIDsq7qs7lRUZ7jDfLWX9OvrstigylfQTC1A6WaI9c-qSL3dBFqSJhIxJmsNiJ5EMCJ26iHZ-SiZ_gPmp4lVNZh7ul9lKJsl11OQ

If your application is a resource (web API) that clients can request access to, access tokens provide helpful information for use in authentication and authorization - the user, client, issuer, permissions, and more.  This document provides details on how a resource can validate and use the claims inside an access token.

[!> NOTE]
>While testing your client application with a consumer Microsoft account (an MSA), you may find that the access token received by your client is an opaque string.  This is because the resource being accessed has requested legacy MSA tickets - these are encrypted and cannot be understood by the client.

## Claims in access tokens

JWTs are split into three pieces - header, payload, and signature, each seperated by a period (`.`) and seperately Base64 encoded.  The header provides information about how to [validate  the token](Validating-tokens) - information about the type of token and how it was signed.  The payload contains all of the important data about the user or app that is attempting to call your service.  Finally, the signature is the raw material used to validate the token.  

[!> Important]
>Claims are present only if a value exists to fill it.  Thus, your app should not take a dependency on a claim being present.  Examples include `pwd_exp` (not every tenant requires passwords to expire) or `family_name` ([client credential](v1-oauth2-client-creds-grant-flow.md) flows are on behalf of applications, which don't have first names).  Claims used for access token validation will always be present.

[!> NOTE]
>Some claims are used to help Azure AD secure tokens from re-use and during special OBO flows.  These are marked as not being for public consumption in the description as "Opaque".  These claims may or may not appear in a token, and new ones may be added without notice.

### Header claims

|Claim   | Format | Description |
|--------|--------|-------------|
|`typ`   | String - always "JWT" | Indicates that the token is a JWT.|
|`nonce` | String | A unique identifier used to protect against token replay attacks.  Your resource can record this value to protect against replays. |
|`alg`   | String | Indicates the algorithm that was used to sign the token.  Example: "RS256" |
|`kid`   | String | Thumbprint for the public key used to sign this token. Emitted in both v1.0 and v2.0 access tokens. |
|`x5t`   | String | The same (in use and value) as `kid`.  However, this is a legacy claim emitted only in v1.0 access tokens for compatibility purposes. |

### Payload claims

|Claim   | Format | Description |
|-----|--------|-------------|
|`aud` |  String, an App ID URI | Identifies the intended recipient of the token. In access tokens, the audience is your app's Application ID, assigned to your app in the Azure Portal. Your app should validate this value, and reject the token if the value does not match. |
|`iss` |  String, an STS URI | Identifies the security token service (STS) that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in `/v2.0`.  The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if applicable. |
|`iat` |  int, a UNIX timestamp | "Issued At" indicates when the authentication for this token occured.  |
|`nbf` |  int, a UNIX timestamp | The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.|
|`exp` |  int, a UNIX timestamp | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.  It's important to note that a resource may reject the token before this time as well - if for example a change in authentication is required or a token revocation has been detected.  The best way to   |
|`acr` |  String, a "0" or "1" | The "Authentication context class" claim. A value of "0" indicates the end-user authentication did not meet the requirements of ISO/IEC 29115. |
|`aio` |  Opaque String | An internal claim used by Azure AD to record data for token re-use. Should not be used by resources.|
|`amr` |  JSON array of strings | Identifies how the subject of the token was authenticated. See [the amr claim section](The-amr-claim) for more details.  |
|`appid` |  String, a GUID | The application ID of the client using the token.   The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD.|
|`appidacr` |  "0", "1", or "2" | Indicates how the client was authenticated. For a public client, the value is 0. If client ID and client secret are used, the value is 1. If a client certificate was used for authentication, the value is 2.  |
|`preferred_name`  | String | The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. The `profile` scope is required in order to receive this claim.|
|`name` |  String | The `name` claim provides a human-readable value that identifies the subject of the token. The value is not guaranteed to be unique, it is mutable, and it's designed to be used only for display purposes. The `profile` scope is required in order to receive this claim. |
|`oid` |  String, a GUID | The immutable identifier for an object in the Microsoft identity system, in this case, a user account. It can also be used to perform authorization checks safely and as a key in database tables. This ID uniquely identifies the user across applications - two different applications signing in the same user will receive the same value in the `oid` claim. This means that it can be used when making queries to Microsoft online services, such as the Microsoft Graph. The Microsoft Graph will return this ID as the `id` property for a given user account. Because the `oid` allows multiple apps to correlate users, the `profile` scope is required in order to receive this claim. Note that if a single user exists in multiple tenants, the user will contain a different object ID in each tenant - they are considered different accounts, even though the user logs into each account with the same credentials |
|`rh` |  Opaque String |An internal claim used by Azure to revalidate tokens. Should not be used by resources. |
|`scp` |  String, a space seperated list of scopes | The set of scopes exposed by your application for which the client application has requested (and received) consent.  Your app should verify that these scopes are valid ones exposed by your app, and make authorization decisions based on the value of these scopes. Only included for [user tokens](#user-and-application-tokens).  |
|`roles`| String, a space seperated list of permissions | The set of permissions exposed by your application that the requesting application has been given permission to call.  This is used during the [client-credentials](v1-oauth2-client-creds-grant-flow.md) flow in place of user scopes, and is only present in [applications tokens](#user-and-application-tokens). |
|`sub` |  String, a GUID | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource, and can be used as a key in database tables. Because the subject is always present in the tokens that Azure AD issues, we recommend using this value in a general-purpose authorization system. The subject is, however, a pairwise identifier - it is unique to a particular application ID. Therefore, if a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim. This may or may not be desired depending on your architecture and privacy requirements. |
|`tid` |  String, a GUID | A GUID that represents the Azure AD tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. The `profile` scope is required in order to receive this claim.  |
|`unique_name` |  String | Provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and is designed to be used only for display purposes. |
|`upn` |  String | The username of the user.  May be a phone number, email address, or unformatted string.  Should only be used for display purposes and providing username hints in re-authentication scenarios. |
|`uti` |  Opaque String | An internal claim used by Azure to revalidate tokens. Should not be used by resources. |
|`ver` |  String, either 1.0 or 2.0 | Indicates the version of the access token. |

#### v1.0 basic claims

These claims will be included in v1.0 tokens if applicable, but must be requested by v2.0 clients or resources using [optional claims](active-directory-optional-claims.md).

|Claim   | Format | Description |
|-----|--------|-------------|
|`ipaddr`| String | The IP address the user authenticated from. |
|`onprem_sid`| String, in [SID format](https://docs.microsoft.com/windows/desktop/SecAuthZ/sid-components) | In cases where the user has an on-premises authentication, this claim provides their SID.  This can be used for authorization in legacy applications. |
|`pwd_exp`| int, a UNIX timestamp | When the users password expires. |
|`pwd_url`| String | A URL where users can be sent to reset their password. |
|`in_corp`|boolean | Signals if the client is logging in from the corporate network. If they are not, the claim is not included |
|`nickname`| String | An additional name for the user, separate from first or last name.|
|`family_name` |  String | Provides the last name, surname, or family name of the user as defined on the  user object. |
|`given_name` |  String | Provides the first or given name of the user, as set on the user object. |

#### The `amr` claim

Microsoft identities can authenticate in a variety of ways, which may be relevant to your application.

|Value |  Description |
|-----|-------------|
|`pwd` | Password authentication, either a user's Microsoft password or an app's client secret. |
|`rsa` |  Authentication was based on the proof of an RSA key, for example with the [authenticator app](https://aka.ms/authapp).  This includes if authentication was performed by a self-signed JWT with a service owned X509 certificate. |
|`otp` | One-time passcode using an email or a text message. |
|`fed` | A federated authentication assertion (e.g. JWT or SAML) was used. |
|`wia` | Windows Integrated Authentication. |
|`mfa` | Multi-factor authentication was used. When this is present the other authentication methods will also be included. |
|`ngcmfa`  | Equivalent to `mfa`, used for provisioning of certain advanced credential types. |
|`wiaormfa`| The user used Windows or an MFA credential to authenticate. |
|`none`| No authentication was performed.|

## Validating tokens

Access tokens should be validated in two steps: first, verifying that the token is valid and issued by a trusted authority for your application, and second that the user has permission to perform the actions requested.  

### Validating the issuer and token

Tokens issued by Azure AD are signed using a public key, publicly documented and rotated on a periodic basis. Your app should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.  You can acquire the signing key data necessary to validate the signature by using the OpenID Connect metadata document located at `https://login.microsoftonline.com/<TENANT>/.well-known/openid-configuration`.  `<TENANT>` may be sourced from the `tid` claim for tenant-specific signing keys, or you can use `common` for personal accounts, which use the Microsoft signing keys.

This metadata document is a JSON object containing several useful pieces of information, such as the location of the various endpoints required for performing OpenID Connect authentication.

It also includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens. The JSON document located at the `jwks_uri` contains all of the public key information in use at that particular moment in time. Your app can use the `kid` claim in the JWT header to select which public key in this document has been used to sign a particular token. It can then perform signature validation using the correct public key and the indicated algorithm.  

With this information in hand, your app should do the following:

1. Ensure the token is a correctly formed JWT with a header, payload, and signature section.
1. Varify that this is an access token - the `appid` and `appidacr` claims will be present.
1. Validate the signature using the appropriate public key.  This is outside the scope of this document, but many libraries exist that cover this.
1. Check the timestamps and audience of the token.  The `iat`, `nbf`, and `exp` timestamps should all fall before or after the current time, as appropriate.  In addition, the `aud` claim should match the app ID for your application.  This may be performed for you by your token validation library.  

### Claims based authorization

Your application's business logic will dictate this step, some common authorization methods are laid out below.  

* Check the `scp` or `roles` claim to verify that all present scopes match those exposed by your API, and allow the client to perform the requested action.
* Ensure the calling client is allowed to call your API using the `appid` claim.
* Validate the authentication status of the calling client using `appidacr` - it should not be 0 if public clients are not allowed to call your API.
* Check againts a list of past `nonce` claims to verify the token is not being replayed.
* Check that the `tid` matches a tenant that is allowed to call your API.
* Use the `acr` claim to verify the user has performed MFA - note that this should be enforced using [Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview).
* If you've requested the `roles` or `groups` claims in the access token, verify that the user is in the group allowed to perform this action.
  * For tokens retreived using the implicit flow you'll likely need to query the [Graph](https://developer.microsoft.com/graph/) for this data, as it's often too large to fit in the token.  

## User and application tokens

Your application may recieve tokens on behalf of a user (the usual flow) or directly from an application (through the [client credentials flow](v1-oauth2-client-creds-grant-flow.md)).  These app-only tokens indicate that this the call is coming from an application, and does not have a user backing it. These tokens are handled largely the same, with some differences:

* App-only tokens will not have a `scp` claim, and will instead have a `roles` claim.  This is where application permission (as opposed to delegated permissions) will be recorded.  For more information on delegated and application permissions, see the [Permission and Consent](v1-permissions-and-consent.md) documentation.
* Many human-specific claims will be missing - e.g. `name`.