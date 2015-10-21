<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="The types of tokens issued in the Azure AD B2C preview."
	services="active-directory-b2c"
	documentationCenter=""
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: Token Reference

Azure AD B2C emits several types of security tokens in the processing of each [authentication flow](active-directory-b2c-apps.md). This document describes the format, security characteristics, and contents of each type of token.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Types of Tokens

Azure AD B2C supports the [OAuth 2.0 authorization protocol](active-directory-b2c-reference-protocols.md), which makes use of both access_tokens and refresh_tokens.  It also supports authentication and sign-in via [OpenID Connect](active-directory-b2c-reference-protocols.md), which introduces a third type of token, the id_token.  Each of these tokens is represented as a "bearer token".

A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Many of the tokens issued by Azure AD B2C are implemented as Json Web Tokens, or JWTs.  A JWT is a compact, URL-safe means of transferring information between two parties.  The information contained in JWTs are known as "claims", or assertions of information about the bearer and subject of the token.  The claims in JWTs are JSON objects encoded and serialized for transmission.  Since the JWTs issued by Azure AD B2C are signed, but not encrypted, you can easily inspect the contents of a JWT for debugging purposes.  There are several tools available for doing so, such as [calebb.net](https://calebb.net). For more information on JWTs, you can refer to the [JWT specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html).

## Id_Tokens

Id_tokens are a form of security token that your app receives from the Azure AD B2C `authorize` and `token` endpoints.  They are represented as [JWTs](#types-of-tokens), and contain claims that you can use for identifying the user into your app.  When acquired from the `authorize` endpoint, id_tokens are often used to sign the user into a web application.  When acquired from the `token` endpoint, id_tokens can be sent in HTTP requests when communicating between two components of the same application or service.  You can use the claims in an id_token as you see fit - commonly they are used for displaying account information or making access control decisions in an app.  

Id_tokens are signed, but not encrypted at this time.  When your app or API receives an id_token, it must [validate the signature](#validating-tokens) to prove the token's authenticity and validate a few claims in the token to prove its validity.  The claims validated by an app vary depending on scenario requirements, but there are some [common claim validations](#validating-tokens) that your app must perform in every scenario.

Full details on the claims in id_tokens are provided below, as well as a sample id_token.  Note that the claims in id_tokens are not returned in any particular order.  In addition, new claims can be introduced into id_tokens at any point in time - your app should not break as new claims are introduced.  The list below includes the claims that your app can reliably interpret at the time of this writing. For practice, try inspecting the claims in the sample id_token by pasting it into [calebb.net](https://calebb.net).  If necessary, even more detail can be found in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).

#### Sample Id_Token
```
// Line breaks for display purposes only

eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IklkVG9rZW5TaWduaW5nS2V5Q29udGFpbmVyIn0.
eyJleHAiOjE0NDIzNjAwMzQsIm5iZiI6MTQ0MjM1NjQzNCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9s
b2dpbi5taWNyb3NvZnRvbmxpbmUuY29tLzc3NTUyN2ZmLTlhMzctNDMwNy04YjNkLWNjMzExZjU4ZDkyNS92
Mi4wLyIsImFjciI6ImIyY18xX3NpZ25faW5fc3RvY2siLCJzdWIiOiJOb3Qgc3VwcG9ydGVkIGN1cnJlbnRs
eS4gVXNlIG9pZCBjbGFpbS4iLCJhdWQiOiI5MGMwZmU2My1iY2YyLTQ0ZDUtOGZiNy1iOGJiYzBiMjlkYzYi
LCJpYXQiOjE0NDIzNTY0MzQsImF1dGhfdGltZSI6MTQ0MjM1NjQzNCwiaWRwIjoiZmFjZWJvb2suY29tIn0.
h-uiKcrT882pSKUtWCpj-_3b3vPs3bOWsESAhPMrL-iIIacKc6_uZrWxaWvIYkLra5czBcGKWrYwrAC8ZvQe
DJWZ50WXQrZYODEW1OUwzaD_I1f1HE0c2uvaWdGXBpDEVdsD3ExKaFlKGjFR2V7F-fPThkVDdKmkUDQX3bVc
yyj2V2nlCQ9jd7aGnokTPfLfpOjuIrTsAdPcGpe5hfSEuwYDmqOJjGs9Jp1f-eSNEiCDQOaTBSvr479L5ptP
XWeQZyX2SypN05Rjr05bjZh3j70ZUimiocfJzjibeoDCaQTz907yAg91WYuFOrQxb-5BaUoR7K-O7vxr2M-_
CQhoFA

```

#### Claims in Id_Tokens

With Azure AD B2C, you have fine grained control over the content of your tokens.  You can configure [policies](active-directory-b2c-reference-policies.md) to send a certain set of user data in claims that your app requires for its operations.  These claims can include standard properties such as the user's `displayName` and `emailAddress`, as well as [custom user attributes](active-directory-b2c-reference-custom-attr) that you can define in your B2C directory.  However, every id_token you receive will contain a certain set of security-related claims that your applications can use to securely authenticate users and requests.  Below are the claims that you expect exist in every id_token issued by Azure AD B2C - any other claim will be determined by policy.

| Name | Claim | Example Value | Description |
| ----------------------- | ------------------------------- | ------------ | --------------------------------- |
| Audience | `aud` | `90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6` | Identifies the intended recipient of the token.  In id_tokens, the audience is your app's Application Id, as assigned to your app in the app registration portal.  Your app should validate this value and reject the token if it does not match. |
| Issuer | `iss` | `https://login.microsoftonline.com/775527ff-9a37-4307-8b3d-cc311f58d925/v2.0/` | Identifies the security token service (STS) that constructs and returns the token, as well as the Azure AD directory in which the user was authenticated.  Your app should validate the issuer claim to ensure that the token came from the v2.0 endpoint. |
| Issued At | `iat` | `1438535543` | The time at which the token was issued, represented in epoch time. |
| Expiration Time | `exp` | `1438539443` | The time at which the token becomes invalid, represented in epoch time.  Your app should use this claim to verify the validity of the token lifetime.  |
| Not Before | `nbf` | `1438535543` |  The time at which the token becomes valid, represented in epoch time. It is usually the same as the issuance time.  Your app should use this claim to verify the validity of the token lifetime.  |
| Version | `ver` | `1.0` | The version of the id_token, as defined by Azure AD. |
| Code Hash | `c_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The code hash is included in id_tokens only when the id_token is issued alongside an OAuth 2.0 authorization code.  It can be used to validate the authenticity of an authorization code.  See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Access Token Hash | `at_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The access token hash is included in id_tokens only when the id_token is issued alongside an OAuth 2.0 access token.  It can be used to validate the authenticity of an access token.  See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Nonce | `nonce` | `12345` | The nonce is a strategy for mitigating token replay attacks.  Your app can specify a nonce in an authorization request by using the `nonce` query parameter.  The value you provide in the request will be emitted in the id_token's `nonce` claim, unmodified.  This allows your app to verify the value against the value it specified on the request, which associates the app's session with a given id_token.  Your app should perform this validation during the id_token validation process. |
| Subject | `sub` | `Not supported currently. Use oid claim.` | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused, so it can be used to perform authorization checks safely, such as when the token is used to access a resource.  However, the subject claim is not yet implemented in the Azure AD B2C preview.  Instead of using the subject claim for authorization, you should configure you policies to include the Object ID `oid` claim and use its value for identifying users. |
| Authentication Context Class Reference | `acr` | `b2c_1_sign_in` | The name of policy which was used to acquire the id_token.  |
| Authentication Time | `auth_time | `1438535543` | The time at which the user last entered their credentials, in epoch time. |



## Access Tokens

Azure AD B2C does not issue access tokens at this time.  Authenticating between two different parties is not supported at this early preview stage - however, you can use id_tokens to communicate between components of the same application.  To learn about the applications and authentication scenarios supported by the Azure AD B2C public preview, refer to [the B2C apps article](active-directory-b2c-apps.md).

## Refresh Tokens

Refresh tokens are security tokens which your app can use to acquire new id_tokens and access_tokens in an OAuth 2.0 flow.  It allows your app to achieve long-term access to resources on behalf of a user without requiring interaction by the user.

In order to receive a refresh  in a token response, your app must request the `offline_acesss` scope.   To learn more about the `offline_access` scope, refer to the [Azure AD B2C protocol reference](active-directory-b2c-reference-protocols.md).

Refresh tokens are, and will always be, completely opaque to your app.  They are issued by Azure AD and can only be inspected & interpreted by Azure AD.  They are long-lived, but your app should not be written to expect that a refresh token will last for any period of time.  Refresh tokens can be invalidated at any moment in time for a variety of reasons.  The only way for your app to know if a refresh token is valid is to attempt to redeem it by making a token request to Azure AD.

When you redeem a refresh token for a new token (and if your app had been granted the `offline_access` scope), you will receive a new refresh token in the token response.  You should  save the newly issued refresh token, replacing the one you previously used in the request.  This will guarantee that your refresh tokens remain valid for as long as possible.

## Validating Tokens

At this point in time, the only token validation your apps should need to perform is validating id_tokens.  In order to validate an id_token, your app should validate both the id_token's signature and the claims in the id_token.

<!-- TODO: Link -->
There are many open source libraries available for validating JWTs depending on your language of preference.  We reccomend exploring those options rather than implenting your own validation logic.  The information here will be usefuly in figuring out how to properly use those libraries.

#### Validating the Signature
A JWT contains three segments, which are separated by the `.` character.  The first segment is known as the **header**, the second as the **body**, and the third as the **signature**.  The signature segment can be used to validate the authenticity of the id_token so that it can be trusted by your app.

Id_Tokens are signed using industry standard asymmetric encryption algorithms, such as RSA 256. The header of the id_token contains information about the key and encryption method used to sign the token:

```
{
		"typ": "JWT",
		"alg": "RS256",
		"kid": "GvnPApfWMdLRi8PDmisFn7bprKg"
}
```

The `alg` claim indicates the algorithm that was used to sign the token, while the `kid` or `x5t` claims indicate the particular public key that was used to sign the token.

At any given point in time, Azure AD may sign an id_token using any one of a certain set of public-private key pairs.  Azure AD rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically.  A reasonable frequency to check for updates to the public keys used by Azure AD is about 24 hours.

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an app to fetch information about Azure AD B2C at runtime.  This information includes endpoints, token contents, and token signing keys.  There is a JSON metadata document for each policy in your B2C directory.  For example the metadata doucment for the `b2c_1_sign_in` policy in the `fabrikamb2c.onmicrosoft.com` is located at:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

You can acquire the signing key data necessary to validate the signature by using the OpenID Connect metadata document located at:

```
https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in
```

where `fabrikamb2c.onmicrosoft.com` is the b2c directory used to authenticate the user and `b2c_1_sign_in` is the policy used to acquire the id_token.  In order to determine which policy was used in signing an id_token (and where to fetch the metadata from), you have two options.  First, the policy name is included in the `acr` claim in the id_token.  You can parse claims out of the body of the JWT by base-64 decoding the body and deserializing the resulting JSON string.  The `acr` claim will be the name of the policy that was used to issue the id_token.  Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used.  Either method is perfectly valid. 

The metadata document is a JSON object containing several useful pieces of information, such as the location of the various endpoints required for performing OpenID Connect authentication.  It also includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens.  That location is provided below, but it is best to fetch that location dynamically by using the metadata document and parsing out the `jwks_uri`:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`

The JSON document located at this url contains all of the public key information in use at that particular moment in time.  Your app can use the `kid` or `x5t` claims in the JWT header to select which public key in this document has been used to sign a particular token.  It can then perform signature validation using the correct public key and the indicated algorithm.

Performing signature validation is outside the scope of this document - there are many open source libraries available for helping you do so if necessary.

#### Validating the Claims
When your app or API receives an id_token, it should also perform a few checks against the claims in the id_token.  These include:

- The **Audience** claim - to verify that the id_token was intended to be given to your app.
- The **Not Before** and **Expiration Time** claims - to verify that the id_token has not expired.
- The **Issuer** claim - to verify that the token was indeed issued to your app by Azure AD.
- The **Nonce** -  as a token replay attack mitigation.

Details of the expected values for these claims are included above in the [id_token section](#id_tokens).

## Token Lifetimes

The following token lifetimes are provided purely for your understanding, as they can help in developing and debugging apps.  Your apps should not be written to expect any of these lifetimes to remain constant - they can and will change at any given point in time.

| Token | Lifetime | Description |
| ----------------------- | ------------------------------- | ------------ |
| Id_Tokens | 1 hour | Id_Tokens are typically valid for an hour.  Your web app can use this same lifetime in maintaining its own session with the user (recommended), or choose a completely different session lifetime.  If your app needs to get a new id_token, it simply needs to make a new sign-in request Azure AD.  If the user has a valid browser session with Azure AD, they may not be required to enter their credentials again. |
| Refresh Tokens | Up to 14 days | A single refresh token is valid for a maximum of 14 days.  However, the refresh token may become invalid at any time for any number of reasons, so your app should continue to try and use a refresh token until it fails, or until your app replaces it with a new refresh token.  A refresh token will also become invalid if it has been 90 days since the user has entered their credentials. |
| Authorization Codes | 5 minutes | Authorization codes are purposefully short-lived, and should be immediately redeemed for access_tokens, id_tokens, and refresh_tokens when they are received. |
