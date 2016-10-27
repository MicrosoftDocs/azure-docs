<properties
	pageTitle="Azure Active Directory v2.0 token reference | Microsoft Azure"
	description="The types of tokens and claims emitted by the Azure AD v2.0 endpoint"
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
	ms.date="09/30/2016"
	ms.author="dastrock"/>

# Azure Active Directory v2.0 token reference

The Azure Active Directory (Azure AD) v2.0 endpoint emits several types of security tokens in each [authentication flow](active-directory-v2-flows.md). This reference describes the format, security characteristics, and contents of each type of token.

> [AZURE.NOTE]
	The v2.0 endpoint does not support all Azure Active Directory scenarios and features. To determine whether you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Types of tokens

The v2.0 endpoint supports the [OAuth 2.0 authorization protocol](active-directory-v2-protocols.md), which uses access tokens and refresh tokens. It also supports authentication and sign-in via [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow). OpenID Connect introduces a third type of token, the ID token. Each of these tokens is represented as a *bearer* token.

A bearer token is a lightweight security token that grants the bearer access to a protected resource. The bearer is any party that can present the token. Although a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. Although some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism. Bearer tokens must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted without this type of security, a "man-in-the-middle attack" can be used by a malicious party to acquire the token and use it for unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your app transmits and stores bearer tokens securely. For more security considerations for bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Many of the tokens issued by the v2.0 endpoint are implemented as JSON Web Tokens (JWTs). A JWT is a compact, URL-safe way to transfer information between two parties. The information in a JWT is called a *claims*. It's an assertion of information about the bearer and subject of the token. The claims in a JWT are JSON objects that are encoded and serialized for transmission. Because the JWTs issued by the v2.0 endpoint are signed but not encrypted, you can easily inspect the contents of a JWT for debugging purposes. For more information about JWTs, see the [JWT specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html).

## ID tokens

ID tokens are a form of sign-in security token that your app receives when it performs authentication using [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow). ID tokens are represented as [JWTs](#types-of-tokens), and contain claims that you can use to sign in the user in your app. You can use the claims in an ID token in various ways. Typically, admins use ID tokens to display account information or to make access control decisions in an app. The v2.0 endpoint issues only one type of ID token, which has a consistent set of claims, regardless of the type of user that is signed in. The format and content of the ID tokens are the same for personal Microsoft account users and for work or school accounts.

Currently, ID tokens are signed but not encrypted. When your app receives an ID token, it must [validate the signature](#validating-tokens) to prove the token's authenticity, and validate a few claims in the token to prove its validity. The claims validated by an app vary depending on scenario requirements, but your app must perform some [common claim validations](#validating-tokens) in every scenario.

Full details on claims in ID tokens are in the following sections, in addition to a sample ID token. Note that claims in ID tokens are not returned in a specific order. Also, new claims can be introduced into ID tokens at any time. Your app should not break when new claims are introduced. The following list includes the claims that your app currently can reliably interpret. You can find more details in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).

#### Sample ID token

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiI2NzMxZGU3Ni0xNGE2LTQ5YWUtOTdiYy02ZWJhNjkxNDM5MWUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYjk0MTk4MTgtMDlhZi00OWMyLWIwYzMtNjUzYWRjMWYzNzZlL3YyLjAiLCJpYXQiOjE0NTIyODUzMzEsIm5iZiI6MTQ1MjI4NTMzMSwiZXhwIjoxNDUyMjg5MjMxLCJuYW1lIjoiQmFiZSBSdXRoIiwibm9uY2UiOiIxMjM0NSIsIm9pZCI6ImExZGJkZGU4LWU0ZjktNDU3MS1hZDkzLTMwNTllMzc1MGQyMyIsInByZWZlcnJlZF91c2VybmFtZSI6InRoZWdyZWF0YmFtYmlub0BueXkub25taWNyb3NvZnQuY29tIiwic3ViIjoiTUY0Zi1nZ1dNRWppMTJLeW5KVU5RWnBoYVVUdkxjUXVnNWpkRjJubDAxUSIsInRpZCI6ImI5NDE5ODE4LTA5YWYtNDljMi1iMGMzLTY1M2FkYzFmMzc2ZSIsInZlciI6IjIuMCJ9.p_rYdrtJ1oCmgDBggNHB9O38KTnLCMGbMDODdirdmZbmJcTHiZDdtTc-hguu3krhbtOsoYM2HJeZM3Wsbp_YcfSKDY--X_NobMNsxbT7bqZHxDnA2jTMyrmt5v2EKUnEeVtSiJXyO3JWUq9R0dO-m4o9_8jGP6zHtR62zLaotTBYHmgeKpZgTFB9WtUq8DVdyMn_HSvQEfz-LWqckbcTwM_9RNKoGRVk38KChVJo4z5LkksYRarDo8QgQ7xEKmYmPvRr_I7gvM2bmlZQds2OeqWLB1NSNbFZqyFOCgYn3bAQ-nEQSKwBaA36jYGPOVG2r2Qv1uKcpSOxzxaQybzYpQ
```

> [AZURE.TIP] For practice, to inspect the claims in the sample ID token, paste the ID token into [calebb.net](https://calebb.net).

#### Claims in ID tokens
| Name | Claim | Example value | Description |
| ----------------------- | ------------------------------- | ------------ | --------------------------------- |
| Audience | `aud` | `6731de76-14a6-49ae-97bc-6eba6914391e` | Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Microsoft Application Registration Portal. Your app should validate this value and reject the token if it does not match. |
| Issuer | `iss` | `https://login.microsoftonline.com/b9419818-09af-49c2-b0c3-653adc1f376e/v2.0 ` | Identifies the security token service (STS) that constructs and returns the token, and the Azure AD tenant in which the user was authenticated. Your app should validate the issuer claim to ensure that the token came from the v2.0 endpoint. It also should use the GUID portion of the claim to restrict the set of tenants that are allowed to sign in to the app. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. |
| Issued At | `iat` | `1452285331` | The time at which the token was issued, represented in epoch time. |
| Expiration Time | `exp` | `1452289231` | The time at which the token becomes invalid, represented in epoch time. Your app should use this claim to verify the validity of the token lifetime. |
| Not Before | `nbf` | `1452285331` | The time at which the token becomes valid, represented in epoch time. It is usually the same as the issuance time. Your app should use this claim to verify the validity of the token lifetime. |
| Version | `ver` | `2.0` | The version of the ID token, as defined by Azure AD. For the v2.0 endpoint, the value is `2.0`. |
| Tenant Id | `tid` | `b9419818-09af-49c2-b0c3-653adc1f376e` | A GUID that represents the Azure AD tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is `9188040d-6c67-4c5b-b112-36a304b66dad`. The `profile` scope is required in order to receive this claim. |
| Code Hash | `c_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The code hash is included in ID tokens only when the ID token is issued at the same time as an OAuth 2.0 authorization code. It can be used to validate the authenticity of an authorization code. See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Access Token Hash | `at_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | The access token hash is included in ID tokens only when the ID token is issued at the same time as an OAuth 2.0 access token. It can be used to validate the authenticity of an access token. See the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html) for more details on performing this validation. |
| Nonce | `nonce` | `12345` | The nonce is a strategy for mitigating token replay attacks. Your app can specify a nonce in an authorization request by using the `nonce` query parameter. The value you provide in the request will be emitted in the ID token's `nonce` claim, unmodified. This allows your app to verify the value against the value it specified on the request, which associates the app's session with a specific ID token. Your app should perform this validation during the ID token validation process. |
| Name | `name` | `Babe Ruth` | The name claim provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique, is mutable, and is designed to be used only for display purposes. The `profile` scope is required in order to receive this claim. |
| Email | `email` | `thegreatbambino@nyy.onmicrosoft.com` | The primary email address associated with the user account, if one exists. Its value is mutable and might change over time for a specific user. The `email` scope is required in order to receive this claim. |
| Preferred Username | `preferred_username` | `thegreatbambino@nyy.onmicrosoft.com` | The primary username that is used to represent the user in the v2.0 endpoint. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time for a specific user. The `profile` scope is required in order to receive this claim. |
| Subject | `sub` | `MF4f-ggWMEji12KynJUNQZphaUTvLcQug5jdF2nl01Q` | The principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. Because the subject is always present in the tokens that Azure AD issues, we recommended using this value in a general purpose authorization system. |
| ObjectId | `oid` | `a1dbdde8-e4f9-4571-ad93-3059e3750d23` | The object ID of the work or school account in the Azure AD system. This claim is not issued for personal Microsoft accounts. The `profile` scope is required in order to receive this claim. |


## Access tokens

Currently, access tokens issued by the v2.0 endpoint are consumable only by Microsoft Services. Your apps shouldn't need to perform any validation or inspection of access tokens for any of the currently supported scenarios. You can treat access tokens as completely opaque. They are just strings that your app can pass to Microsoft in HTTP requests.

In the near future, the v2.0 endpoint will introduce the ability for your app to receive access tokens from other clients. At that time, the information in this reference topic will be updated with the information you need for your app to perform access token validation and other similar tasks.

When you request an access token from the v2.0 endpoint, the v2.0 endpoint also returns metadata about the access token for your app to use. This information includes the expiry time of the access token and the scopes for which it is valid. Your app uses this metadata to perform intelligent caching of access tokens without having to parse open the access token itself.

## Refresh tokens

Refresh tokens are security tokens that your app can use to get new access tokens in an OAuth 2.0 flow. Your app can use refresh tokens to achieve long-term access to resources on behalf of a user without requiring interaction with the user.

Refresh tokens are multi-resource. A refresh token received during a token request for one resource can be redeemed for access tokens to a completely different resource.

To receive a refresh in a token response, your app must request and be granted the `offline_acesss` scope. To learn more about the `offline_access` scope, see the [consent and scopes article](active-directory-v2-scopes.md).

Refresh tokens are, and always will be, completely opaque to your app. They are issued by the Azure AD v2.0 endpoint and can only be inspected and interpreted by the v2.0 endpoint. They are long-lived, but your app should not be written to expect that a refresh token will last for any period of time. Refresh tokens can be invalidated at any moment for a variety of reasons. The only way for your app to know if a refresh token is valid is to attempt to redeem it by making a token request to the v2.0 endpoint.

When you redeem a refresh token for a new access token (and if your app had been granted the `offline_access` scope), you receive a new refresh token in the token response. You should save the newly issued refresh token, to replace the one you used in the request. This guarantees that your refresh tokens remain valid for as long as possible.

## Validating tokens

At this point in time, the only token validation your apps should need to perform is validating ID tokens. To validate an ID token, your app should validate both the ID token's signature and the claims in the ID token.

<!-- TODO: Link -->
Microsoft provides libraries and code samples that show you how to easily handle token validation. The information in the next sections is provided simply for those who want to understand the underlying process. Several third-party open-source libraries also are available for JWT validation. There's at least one library option for almost every platform and language.

#### Validate the signature
A JWT contains three segments, which are separated by the `.` character. The first segment is known as the *header*, the second segment as the *body*, and the third segment as the *signature*. The signature segment can be used to validate the authenticity of the ID token so that it can be trusted by your app.

ID tokens are signed by using industry standard asymmetric encryption algorithms, such as RSA 256. The header of the ID token has information about the key and encryption method used to sign the token:

```
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "MnC_VZcATfM5pOYiJHMba9goEKY"
}
```

The `alg` claim indicates the algorithm that was used to sign the token. The `kid` claim indicates the particular public key that was used to sign the token.

At any time, the v2.0 endpoint might sign an ID token using any one of a certain set of public-private key pairs. The v2.0 endpoint rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by the v2.0 endpoint is about every 24 hours.

You can acquire the signing key data necessary to validate the signature by using the OpenID Connect metadata document located at:

```
https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
```

> [AZURE.TIP] Try the this URL in a browser!

This metadata document is a JavaScript Object Notation (JSON) object that has several useful pieces of information, such as the location of the various endpoints required for OpenID Connect authentication.  

The document also includes a `jwks_uri`, which gives the location of the set of public keys used to sign tokens. The JSON document located at the `jwks_uri` has all of the current public key information in use. Your app can use the `kid` claim in the JWT header to select which public key in this document has been used to sign a particular token. It can then perform signature validation using the correct public key and the indicated algorithm.

Performing signature validation is outside the scope of this document. Many open-source libraries are available to help you with this, if you need it.

#### Validate the claims
When your app receives an ID token upon user sign-in, it should also perform a few checks against the claims in the ID token. These include but are not limited to:

- The **Audience** claim - to verify that the ID token was intended to be given to your app.
- The **Not Before** and **Expiration Time** claims - to verify that the ID token has not expired.
- The **Issuer** claim - to verify that the token was indeed issued to your app by the v2.0 endpoint.
- The **Nonce** - as a token replay attack mitigation.
- and more...

For a full list of claim validations your app should perform, see the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).

Details of the expected values for these claims are included in the [ID token](# ID tokens) section.


## Token lifetimes

The following token lifetimes are provided purely for your understanding, because they might help you with developing and debugging apps. Your apps should not be written to expect any of these lifetimes to remain constant. Token lifetimes can and will change at any time.

| Token | Lifetime | Description |
| ----------------------- | ------------------------------- | ------------ |
| ID tokens (work or school accounts) | 1 hour | ID tokens typically are valid for 1 hour. Your web app can use this same lifetime to maintain its own session with the user (recommended), or you can choose a completely different session lifetime. If your app needs to get a new ID token, it needs to make a new sign-in request to the v2.0 authorize endpoint. If the user has a valid browser session with the v2.0 endpoint, the user might not be required to enter their credentials again. |
| ID tokens (personal accounts) | 24 hours | ID tokens for personal accounts typically are valid for 24 hours. Your web app can use this same lifetime to maintain its own session with the user (recommended), or you can choose a completely different session lifetime. If your app needs to get a new ID token, it needs to make a new sign-in request to the v2.0 authorize endpoint. If the user has a valid browser session with the v2.0 endpoint, the user might not be required to enter their credentials again. |
| Access tokens (work or school accounts) | 1 hour | Indicated in token responses as part of the token metadata. |
| Access tokens (personal accounts) | 1 hour | Indicated in token responses as part of the token metadata. Access tokens that are issued on behalf of personal accounts can be configured for a different lifetime, but 1 hour is typical. |
| Refresh tokens (work or school account) | Up to 14 days | A single refresh token is valid for a maximum of 14 days. However, the refresh token might become invalid at any time for numerous reasons, so your app should continue to try and use a refresh token until it fails, or until your app replaces it with a new refresh token. A refresh token also becomes invalid if it has been 90 days since the user has entered their credentials. |
| Refresh tokens (personal accounts) | Up to 1 year | A single refresh token is valid for a maximum of 1 year. However, the refresh token might become invalid at any time for numerous reasons, so your app should continue to try and use a refresh token until it fails. |
| Authorization codes (work or school accounts) | 10 minutes | Authorization codes are purposely short-lived, and should be immediately redeemed for access tokens and refresh tokens when they are received. |
| Authorization codes (personal accounts) | 5 minutes | Authorization codes are purposely short-lived, and should be immediately redeemed for access tokens and refresh tokens when they are received. Authorization codes issued on behalf of personal accounts are for one-time use. |
