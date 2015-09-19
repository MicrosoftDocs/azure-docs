<properties
	pageTitle="App Model v2 Token reference | Microsoft Azure"
	description="The types of tokens and claims emitted by the v2.0 Endpoint"
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/12/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Token reference

The v2.0 endpoint emits several types of security tokens in the processing of each [authentication flow](active-directory-v2-flows.md). This document describes the format, security characteristics, and contents of each type of token.

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Types of Tokens

The v2.0 endpoint supports the [OAuth 2.0 authorization protocol](active-directory-v2-protocols.md), which makes use of both access_tokens and refresh_tokens.  It also supports authentication and sign-in via [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow), which introduces a third type of token, the id_token.  Each of these tokens is represented as a "bearer token".

A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Many of the tokens issued by the v2.0 endpoint are implemented as Json Web Tokens, or JWTs.  A JWT is a compact, URL-safe means of transferring information between two parties.  The information contained in JWTs are known as "claims", or assertions of information about the bearer and subject of the token.  The claims in JWTs are JSON objects encoded and serialized for transmission.  Since the JWTs issued by the v2.0 endpoint are signed, but not encrypted, you can easily inspect the contents of a JWT for debugging purposes.  There are several tools available for doing so, such as [calebb.net](https://calebb.net). For more information on JWTs, you can refer to the [JWT specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html).

## Id_Tokens

Id_tokens are a form of sign-in security token that your app receives when performing authentication using [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  They are represented as [JWTs](#types-of-tokens), and contain claims that you can use for signing the user into your app.  You can use the claims in an id_token as you see fit - commonly they are used for displaying account information or making access control decisions in an app.  The v2.0 endpoint only issues one type of id_token, which has a consistent set of claims regardless of the type of user that has signed in.  That is to say that the format and content of the id_tokens will be the same for both personal Microsoft Account users and work or school accounts.

Id_tokens are signed, but not encrypted at this time.  When your app receives an id_token, it must [validate the signature](#validating-tokens) to prove the token's authenticity and validate a few claims in the token to prove its validity.  The claims validated by an app vary depending on scenario requirements, but there are some [common claim validations](#validating-tokens) that your app must perform in every scenario.

Full details on the claims in id_tokens are provided below, as well as a sample id_token.  Note that the claims in id_tokens are not returned in any particular order.  In addition, new claims can be introduced into id_tokens at any point in time - your app should not break as new claims are introduced.  The list below includes the claims that your app can reliably interpret at the time of this writing. For practice, try inspecting the claims in the sample id_token by pasting it into [calebb.net](https://calebb.net).  If necessary, even more detail can be found in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).

#### Sample Id_Token
```
// Line breaks for display purposes only

eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ
19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiI0OTIxMDI1My0wYmExLTRhOWEtYTQyNC02MTY5OTlmYWI2MjAiL
CJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYjk0MTAzMTgtMDlhZi00OWMyLWIwYzMtNjUzYWRjMW
YzNzZlL3YyLjAvIiwiaWF0IjoxNDM4NTM1NTQzLCJuYmYiOjE0Mzg1MzU1NDMsImV4cCI6MTQzODUzOTQ0MywidmVyIjoiMi4
wIiwidGlkIjoiYjk0MTAzMTgtMDlhZi00OWMyLWIwYzMtNjUzYWRjMWYzNzZlIiwib2lkIjoiYTFlYmRkZTgtZTRmOS00NTcx
LWFkOTMtMzA1OWUzNzUwZDIzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2FtcGxlLmFkbWluQHN0cm9ja2lzZGV2Lm9ubWljc
m9zb2Z0LmNvbSIsInN1YiI6IjJvMmQ5SVBGVzI5MGo0RVkySXg0RUdoaEtlWnVGaC1LcFhHS2tuZkNxRWMiLCJuYW1lIjoiU2
FtcGxlIEFkbWluIiwibm9uY2UiOiIxMjM0NSIsImNfaGFzaCI6IngxeU92VTZRaXE0Y1lVcVIxeDBvM2cifQ.Qk9exyv04I6a
P6Sju2xNG9O2sj8dG-aEoJeS5dmnjdLo8k1ZzgZd7w-6yCrKXgPh4FJ1YY-08DZnHNmP3oxm3zmEv3RUIBEyTmo3598PRYLWl
vttis1KD5PoNgAyKfHqiOCL5q_Owd0m9oAKDagbJhRVZOS89phllA0AQnaI6hJOKvMsbOYJt-w00y6TXf1Nkzp_Yey8EmRiwN
7gqvudL1UfZ7_UbST2DBjPIyZsv0gT8gpApz6CecCOyX1NNWpUg8ZRkNnOjGL-IMhq4okPCTTfYriOo93z9Y9v6NmaJxV5bBN
V-DIguXSzLVKnnflfSLyvhinsjLKCnu9L3oXHxw
```

#### Claims in Id_Tokens
| Name | Claim | Example Value | Description |
| ----------------------- | ------------------------------- | ------------ | --------------------------------- |
| Audience | `aud` | `49210253-0ba1-4a9a-a424-616999fab620` | Identifies the intended recipient of the token.  In id_tokens, the audience is your app's Application Id, as assigned to your app in the app registration portal.  Your app should validate this value and reject the token if it does not match. |
| Issuer | `iss` | `https://login.microsoftonline.com/b9410318-09af-49c2-b0c3-653adc1f376e/v2.0/` | Identifies the security token service (STS) that constructs and returns the token, as well as the Azure AD tenant in which the user was authenticated.  Your app should validate the issuer claim to ensure that the token came from the v2.0 endpoint.  It can also use the guid portion of the claim to restrict the set of tenants that are allowed to sign into the app. |
| Issued At | `iat` | `1438535543` | The time at which the token was issued, represented in epoch time. |
| Expiration Time | `exp` | `1438539443` | The time at which the token becomes invalid, represented in epoch time.  Your app should use this claim to verify the validity of the token lifetime.  |
| Version | `ver` | `2.0` | The version of the id_token, as defined by Azure AD.  For app model v2.0, The value will be `2.0`. |
| Tenant Id | `tid` | `b9410318-09af-49c2-b0c3-653adc1f376e` | A guid representing the Azure AD tenant which the user is from.  For work and school accounts, the guid will be the immutable tenant ID of the organization that the user belongs to.  For personal accounts, the value will be `9188040d-6c67-4c5b-b112-36a304b66dad`. |
| Code Hash | `c_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The code hash is included in id_tokens only when the id_token is issued alongside an OAuth 2.0 authorization code.  It can be used to validate the authenticity of an authorization code.  See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Access Token Hash | `at_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The access token hash is included in id_tokens only when the id_token is issued alongside an OAuth 2.0 access token.  It can be used to validate the authenticity of an access token.  See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Nonce | `nonce` | `12345` | The nonce is a strategy for mitigating token replay attacks.  Your app can specify a nonce in an authorization request by using the `nonce` query parameter.  The value you provide in the request will be emitted in the id_token's `nonce` claim, unmodified.  This allows your app to verify the value against the value it specified on the request, which associates the app's session with a given id_token.  Your app should perform this validation during the id_token validation process. |
| Name | `name` | `Leonardo DaVinci` | The name claim provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique, is mutable, and is designed to be used only for display purposes. |
| Preferred Username | `preferred_username` | `leo@outlook.com` | The primary username that is used to represent the user in the v2.0 endpoint.  It could be an email address, phone number, or a generic username without a specified format.  Its value is mutable and may change for a given user over time. |
| Subject | `sub` | `AAAAAAAAAAAAAAAAAAAAAOUtxUJsxQtHuMcFCIA1NC0` | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused, so it can be used to perform authorization checks safely, such as when the token is used to access a resource. Because the subject is always present in the tokens the Azure AD issues, we recommended using this value in a general purpose authorization system. |
| ObjectId | `oid` | `27cb5cec-7c0c-40b4-a69a-22500b6ea853` | The object Id of the work or school account in the Azure AD system.  This claim will not be issued for personal Microsoft accounts. |

<!---
| Not Before | `nbf` | `1438535543` |  The time at which the token becomes valid, represented in epoch time. It is usually the same as the issuance time.  Your app should use this claim to verify the validity of the token lifetime.  |
-->



## Access Tokens

Access tokens issued by the v2.0 endpoint take two different formats.  Access tokens that are issued on behalf of work or school accounts are JWTs, similar to an id_token.  Access tokens that are issued on behalf of a personal Microsoft account are in a format known as "compact tickets".  For this reason, in development you may notice a different string format for access tokens issued by the v2.0 endpoint.  Over time, this difference in access tokens will be eliminated from the v2.0 endpoint.

With that said, access tokens issued by the v2.0 endpoint are only consumable by Microsoft Services at this point in time.  Your apps should not need to perform any validation or inspection of access tokens for any of the currently supported scenarios.  You can treat access tokens as completely opaque - they are just strings which your app can pass to Microsoft in HTTP requests.

In the near future, the v2.0 endpoint will introduce the ability for your app to receive access tokens from other clients.  At that time, this information will be updated with the information your app needs to perform access token validation and other similar tasks.

When you request an access token from the v2.0 endpoint, the v2.0 endpoint also returns some metadata about the access token for your app's consumption.  This information includes the expiry time of the access token and the scopes for which it is valid.  This allows your app to perform intelligent caching of access tokens without having to parse open the access token itself.

## Refresh Tokens

Refresh tokens are security tokens which your app can use to acquire new access tokens in an OAuth 2.0 flow.  It allows your app to achieve long-term access to resources on behalf of a user without requiring interaction by the user.

Refresh tokens are multi-resource.  That is to say that a refresh token received during a token request for one resource can be redeemed for access tokens to a completely different resource.

In order to receive a refresh  in a token response, your app must request & be granted the `offline_acesss` scope.   To learn more about the `offline_access` scope, refer to the [consent & scopes article here](active-directory-v2-scopes.md).

Refresh tokens are, and will always be, completely opaque to your app.  They are issued by the Azure AD v2.0 endpoint and can only be inspected & interpreted by the v2.0 endpoint.  They are long-lived, but your app should not be written to expect that a refresh token will last for any period of time.  Refresh tokens can be invalidated at any moment in time for a variety of reasons.  The only way for your app to know if a refresh token is valid is to attempt to redeem it by making a token request to the v2.0 endpoint.

When you redeem a refresh token for a new access token (and if your app had been granted the `offline_access` scope), you will receive a new refresh token in the token response.  You should  save the newly issued refresh token, replacing the one you used in the request.  This will guarantee that your refresh tokens remain valid for as long as possible.

## Validating Tokens

At this point in time, the only token validation your apps should need to perform is validating id_tokens.  In order to validate an id_token, your app should validate both the id_token's signature and the claims in the id_token.

<!-- TODO: Link -->
We provide libraries & code samples that show how to easily handle token validation - the below information is simply provided for those who wish to understand the underlying process.  There are also several 3rd party open source libraries available for JWT validation - there is at least one option for almost every platform & language out there.

#### Validating the Signature
A JWT contains three segments, which are separated by the `.` character.  The first segment is known as the **header**, the second as the **body**, and the third as the **signature**.  The signature segment can be used to validate the authenticity of the id_token so that it can be trusted by your app.

Id_Tokens are signed using industry standard asymmetric encryption algorithms, such as RSA 256. The header of the id_token contains information about the key and encryption method used to sign the token:

```
{
		typ: "JWT",
		alg: "RS256",
		x5t: "GvnPApfWMdLRi8PDmisFn7bprKg"
}
```

The `alg` claim indicates the algorithm that was used to sign the token, while the `kid` or `x5t` claims indicate the particular public key that was used to sign the token.

At any given point in time, the v2.0 endpoint may sign an id_token using any one of a certain set of public-private key pairs.  The v2.0 endpoint rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically.  A reasonable frequency to check for updates to the public keys used by the v2.0 endpoint is about 24 hours.

You can acquire the signing key data necessary to validate the signature by using the OpenID Connect metadata document located at:

`https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`

This metadata document is a JSON object containing several useful pieces of information, such as the location of the various endpoints required for performing OpenID Connect authentication.  It also includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens.  That location is provided below, but it is best to fetch that location dynamically by using the metadata document and parsing out the `jwks_uri`:

`https://login.microsoftonline.com/common/discovery/v2.0/keys`

The JSON document located at this url contains all of the public key information in use at that particular moment in time.  Your app can use the `kid` or `x5t` claims in the JWT header to select which public key in this document has been used to sign a particular token.  It can then perform signature validation using the correct public key and the indicated algorithm.

Performing signature validation is outside the scope of this document - there are many open source libraries available for helping you do so if necessary.

#### Validating the Claims
When your app receives an id_token upon user sign-in, it should also perform a few checks against the claims in the id_token.  These include:

- The **Audience** claim - to verify that the id_token was intended to be given to your app.
- The **Issued At** and **Expiration Time** claims - to verify that the id_token has not expired.
- The **Issuer** claim - to verify that the token was indeed issued to your app by the v2.0 endpoint.
- The **Nonce** -  as a token replay attack mitigation.

Details of the expected values for these claims are included above in the [id_token section](#id_tokens).


## Token Lifetimes

The following token lifetimes are provided purely for your understanding, as they can help in developing and debugging apps.  Your apps should not be written to expect any of these lifetimes to remain constant - they can and will change at any given point in time.

| Token | Lifetime | Description |
| ----------------------- | ------------------------------- | ------------ |
| Id_Tokens (work or school accounts) | 1 hour | Id_Tokens are typically valid for an hour.  Your web app can use this same lifetime in maintaining its own session with the user (recommended), or choose a completely different session lifetime.  If your app needs to get a new id_token, it simply needs to make a new sign-in request to the v2.0 authorize endpoint.  If the user has a valid browser session with the v2.0 endpoint, they may not be required to enter their credentials again. |
| Id_Tokens (personal accounts) | 24 hours | Id_Tokens for personal accounts are typically valid for 24 hours.  Your web app can use this same lifetime in maintaining its own session with the user (recommended), or choose a completely different session lifetime.  If your app needs to get a new id_token, it simply needs to make a new sign-in request to the v2.0 authorize endpoint.  If the user has a valid browser session with the v2.0 endpoint, they may not be required to enter their credentials again. |
| Access Tokens (work or school accounts) | 1 hour | Indicated in token responses as part of the token metadata. |
| Access Tokens (personal accounts) | 1 hour | Indicated in token responses as part of the token metadata.  Access_tokens issued on behalf of personal accounts may be configured for a different lifetime, but one hour is typically the case. |
| Refresh Tokens (work or school account) | Up to 14 days | A single refresh token is valid for a maximum of 14 days.  However, the refresh token may become invalid at any time for any number of reasons, so your app should continue to try and use a refresh token until it fails, or until your app replaces it with a new refresh token.  A refresh token will also become invalid if it has been 90 days since the user has entered their credentials. |
| Refresh Tokens (personal accounts) | Up to 1 year | A single refresh token is valid for a maximum of 1 year.  However, the refresh token may become invalid at any time for any number of reasons, so your app should continue to try and use a refresh token until it fails. |
| Authorization Codes (work or school accounts) | 10 minutes | Authorization codes are purposefully short-lived, and should be immediately redeemed for access_tokens and refresh_tokens when they are received. |
| Authorization Codes (personal accounts) | 5 minutes | Authorization codes are purposefully short-lived, and should be immediately redeemed for access_tokens and refresh_tokens when they are received.  Authorization codes issued on behalf of personal accounts are also one-time use. |
