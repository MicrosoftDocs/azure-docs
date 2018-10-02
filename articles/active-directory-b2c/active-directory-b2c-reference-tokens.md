---
title: Token reference in Azure Active Directory B2C | Microsoft Docs
description: The types of tokens issued in Azure Active Directory B2C
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/16/2017
ms.author: davidmu
ms.component: B2C
---

# Azure AD B2C: Token reference

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) emits several types of security tokens as it processes each [authentication flow](active-directory-b2c-apps.md). This document describes the format, security characteristics, and contents of each type of token.

## Types of tokens
Azure AD B2C supports the [OAuth 2.0 authorization protocol](active-directory-b2c-reference-protocols.md), which makes use of both access tokens and refresh tokens. It also supports authentication and sign-in via [OpenID Connect](active-directory-b2c-reference-protocols.md), which introduces a third type of token: the ID token. Each of these tokens is represented as a bearer token.

A bearer token is a lightweight security token that grants the "bearer" access to a protected resource. The bearer is any party that can present the token. Azure AD B2C must first authenticate a party before it can receive a bearer token. But if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. Some security tokens have a built-in mechanism for preventing unauthorized parties from using them, but bearer tokens do not have this mechanism. They must be transported in a secure channel, such as transport layer security (HTTPS).

If a bearer token is transmitted outside a secure channel, a malicious party can use a man-in-the-middle attack to acquire the token and use it to gain unauthorized access to a protected resource. The same security principles apply when bearer tokens are stored or cached for later use. Always ensure that your app transmits and stores bearer tokens in a secure manner.

For additional security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Many of the tokens that Azure AD B2C issues are implemented as JSON web tokens (JWTs). A JWT is a compact, URL-safe means of transferring information between two parties. JWTs contain information known as claims. These are assertions of information about the bearer and the subject of the token. The claims in JWTs are JSON objects that are encoded and serialized for transmission. Because the JWTs issued by Azure AD B2C are signed but not encrypted, you can easily inspect the contents of a JWT to debug it. Several tools are available that can do this, including [jwt.ms](https://jwt.ms). For more information about JWTs, refer to [JWT specifications](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html).

### ID tokens

An ID token is a form of security token that your app receives from the Azure AD B2C `/authorize` and `/token` endpoints. ID tokens are represented as [JWTs](#types-of-tokens), and they contain claims that you can use to identify users in your app. When ID tokens are acquired from the `/authorize` endpoint, they are done so using the [implicit flow](active-directory-b2c-reference-spa.md), which is often used for users signing into to javascript based web applications. When ID tokens are acquired from the `/token` endpoint, they are done so using the [confidential code flow](active-directory-b2c-reference-oidc.md), which keeps the token hidden from the browser. This allows the token to be securely sent in HTTP requests for communication between two components of the same application or service. You can use the claims in an ID token as you see fit. They are commonly used to display account information or to make access control decisions in an app.  

ID tokens are signed, but they are not currently encrypted. When your app or API receives an ID token, it must [validate the signature](#token-validation) to prove that the token is authentic. Your app or API must also validate a few claims in the token to prove that it is valid. Depending on the scenario requirements, the claims validated by an app can vary, but your app must perform some [common claim validations](#token-validation) in every scenario.

#### Sample ID token
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

### Access tokens

An access token is also a form of security token that your app receives from the Azure AD B2C `/authorize` and `/token` endpoints. Access tokens are also represented as [JWTs](#types-of-tokens), and they contain claims that you can use to identify the granted permissions to your APIs. Access tokens are signed, but they are not currently encrypted. Access tokens should be used to provide access to APIs and resource servers. Learn more about how to [use access tokens](active-directory-b2c-access-tokens.md). 

When your API receives an access token, it must [validate the signature](#token-validation) to prove that the token is authentic. Your API must also validate a few claims in the token to prove that it is valid. Depending on the scenario requirements, the claims validated by an app can vary, but your app must perform some [common claim validations](#token-validation) in every scenario.

### Claims in ID and access tokens

When you use Azure AD B2C, you have fine-grained control over the content of your tokens. You can configure [policies](active-directory-b2c-reference-policies.md) to send certain sets of user data in claims that your app requires for its operations. These claims can include standard properties such as the user's `displayName` and `emailAddress`. They can also include [custom user attributes](active-directory-b2c-reference-custom-attr.md) that you can define in your B2C directory. Every ID and access token that you receive contains a certain set of security-related claims. Your applications can use these claims to securely authenticate users and requests.

Note that the claims in ID tokens are not returned in any particular order. In addition, new claims can be introduced in ID tokens at any time. Your app should not break as new claims are introduced. Here are the claims that you expect to exist in ID and access tokens issued by Azure AD B2C. Any additional claims are determined by policies. For practice, try inspecting the claims in the sample ID token by pasting it into [jwt.ms](https://jwt.ms). Further details can be found in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).

| Name | Claim | Example value | Description |
| --- | --- | --- | --- |
| Audience |`aud` |`90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6` |An audience claim identifies the intended recipient of the token. For Azure AD B2C, the audience is your app's application ID, as assigned to your app in the app registration portal. Your app should validate this value and reject the token if it does not match. Audience is synonymous with resource. |
| Issuer |`iss` |`https://{tenantname}.b2clogin.com/775527ff-9a37-4307-8b3d-cc311f58d925/v2.0/` |This claim identifies the security token service (STS) that constructs and returns the token. It also identifies the Azure AD directory in which the user was authenticated. Your app should validate the issuer claim to ensure that the token came from the Azure Active Directory v2.0 endpoint. |
| Issued at |`iat` |`1438535543` |This claim is the time at which the token was issued, represented in epoch time. |
| Expiration time |`exp` |`1438539443` |The expiration time claim is the time at which the token becomes invalid, represented in epoch time. Your app should use this claim to verify the validity of the token lifetime. |
| Not before |`nbf` |`1438535543` |This claim is the time at which the token becomes valid, represented in epoch time. This is usually the same as the time the token was issued. Your app should use this claim to verify the validity of the token lifetime. |
| Version |`ver` |`1.0` |This is the version of the ID token, as defined by Azure AD. |
| Code hash |`c_hash` |`SGCPtt01wxwfgnYZy2VJtQ` |A code hash is included in an ID token only when the token is issued together with an OAuth 2.0 authorization code. A code hash can be used to validate the authenticity of an authorization code. For more details on how to perform this validation, see the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).  |
| Access token hash |`at_hash` |`SGCPtt01wxwfgnYZy2VJtQ` |An access token hash is included in an ID token only when the token is issued together with an OAuth 2.0 access token. An access token hash can be used to validate the authenticity of an access token. For more details on how to perform this validation, see the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html)  |
| Nonce |`nonce` |`12345` |A nonce is a strategy used to mitigate token replay attacks. Your app can specify a nonce in an authorization request by using the `nonce` query parameter. The value you provide in the request will be emitted unmodified in the `nonce` claim of an ID token only. This allows your app to verify the value against the value it specified on the request, which associates the app's session with a given ID token. Your app should perform this validation during the ID token validation process. |
| Subject |`sub` |`884408e1-2918-4cz0-b12d-3aa027d7563b` |This is the principal about which the token asserts information, such as the user of an app. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory. To learn more, see [Azure Active Directory B2C: Token, session, and single sign-on configuration](active-directory-b2c-token-session-sso.md). |
| Authentication context class reference |`acr` |Not applicable |Not used currently, except in the case of older policies. To learn more, see [Azure Active Directory B2C: Token, session, and single sign-on configuration](active-directory-b2c-token-session-sso.md). |
| Trust framework policy |`tfp` |`b2c_1_sign_in` |This is the name of the policy that was used to acquire the ID token. |
| Authentication time |`auth_time` |`1438535543` |This claim is the time at which a user last entered credentials, represented in epoch time. |

### Refresh tokens
Refresh tokens are security tokens that your app can use to acquire new ID tokens and access tokens in an OAuth 2.0 flow. They provide your app with long-term access to resources on behalf of users without requiring interaction with those users.

To receive a refresh token in a token response, your app must request the `offline_acesss` scope. To learn more about the `offline_access` scope, refer to the [Azure AD B2C protocol reference](active-directory-b2c-reference-protocols.md).

Refresh tokens are, and will always be, completely opaque to your app. They are issued by Azure AD and can be inspected and interpreted only by Azure AD. They are long-lived, but your app should not be written with the expectation that a refresh token will last for a specific period of time. Refresh tokens can be invalidated at any moment for a variety of reasons. The only way for your app to know if a refresh token is valid is to attempt to redeem it by making a token request to Azure AD.

When you redeem a refresh token for a new token (and if your app has been granted the `offline_access` scope), you will receive a new refresh token in the token response. You should save the newly issued refresh token. It should replace the refresh token you previously used in the request. This helps guarantee that your refresh tokens remain valid for as long as possible.

## Token validation
To validate a token, your app should check both the signature and claims of the token.

Many open source libraries are available for validating JWTs, depending on your preferred language. We recommend that you explore those options rather than implement your own validation logic. The information in this guide can help you learn how to properly use those libraries.

### Validate the signature
A JWT contains three segments, separated by the `.` character. The first segment is the *header*, the second is the *body*, and the third is the *signature*. The signature segment can be used to validate the authenticity of the token so that it can be trusted by your app.

Azure AD B2C tokens are signed by using industry-standard asymmetric encryption algorithms, such as RSA 256. The header of the token contains information about the key and encryption method used to sign the token:

```
{
        "typ": "JWT",
        "alg": "RS256",
        "kid": "GvnPApfWMdLRi8PDmisFn7bprKg"
}
```

The `alg` claim indicates the algorithm that was used to sign the token. The `kid` claim indicates the particular public key that was used to sign the token.

At any given time, Azure AD can sign a token by using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys periodically, so your app should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

Azure AD B2C has an OpenID Connect metadata endpoint. This allows apps to fetch information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. Your B2C directory contains a JSON metadata document for each policy. For example, the metadata document for the `b2c_1_sign_in` policy in  `fabrikamb2c.onmicrosoft.com` is located at:

```
https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in
```

`fabrikamb2c.onmicrosoft.com` is the B2C directory used to authenticate the user, and `b2c_1_sign_in` is the policy used to acquire the token. To determine which policy was used to sign a token (and where to go to fetch the metadata), you have two options. First, the policy name is included in the `acr` claim in the token. You can parse claims out of the body of the JWT by base-64 decoding the body and deserializing the JSON string that results. The `acr` claim will be the name of the policy that was used to issue the token.  Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used. Either method is valid.

The metadata document is a JSON object that contains several useful pieces of information. These include the location of the endpoints required to perform OpenID Connect authentication. They also include `jwks_uri`, which gives the location of the set of public keys that are used to sign tokens. That location is provided here, but it is best to fetch the location dynamically by using the metadata document and parsing out `jwks_uri`:

```
https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in
```

The JSON document located at this URL contains all the public key information in use at a particular moment. Your app can use the `kid` claim in the JWT header to select the public key in the JSON document that is used to sign a particular token. It can then perform signature validation by using the correct public key and the indicated algorithm.

A description of how to perform signature validation is outside the scope of this document. Many open source libraries are available to help you with this if you need it.

### Validate the claims
When your app or API receives an ID token, it should also perform several checks against the claims in the ID token. These include, but are not limited to:

* The **audience** claim: This verifies that the ID token was intended to be given to your app.
* The **not before** and **expiration time** claims: These verify that the ID token has not expired.
* The **issuer** claim: This verifies that the token was issued to your app by Azure AD.
* The **nonce**: This is a strategy for token replay attack mitigation.

For a full list of validations your app should perform, refer to the [OpenID Connect specification](https://openid.net). Details of the expected values for these claims are included in the preceding [token section](#types-of-tokens).  

## Token lifetimes
The following token lifetimes are provided to further your knowledge. They can help you when you develop and debug apps. Note that your apps should not be written to expect any of these lifetimes to remain constant. They can and will change. Read more about the [customization of token lifetimes](active-directory-b2c-token-session-sso.md) in Azure AD B2C.

| Token | Lifetime | Description |
| --- | --- | --- |
| ID tokens |One hour |ID tokens are typically valid for an hour. Your web app can use this lifetime to maintain its own sessions with users (recommended). You can also choose a different session lifetime. If your app needs to get a new ID token, it simply needs to make a new sign-in request to Azure AD. If a user has a valid browser session with Azure AD, that user might not be required to enter credentials again. |
| Refresh tokens |Up to 14 days |A single refresh token is valid for a maximum of 14 days. However, a refresh token can become invalid at any time for a number of reasons. Your app should continue to try to use a refresh token until the request fails, or until your app replaces the refresh token with a new one. A refresh token can also become invalid if 90 days have passed since the user last entered credentials. |
| Authorization codes |Five minutes |Authorization codes are intentionally short-lived. They should be redeemed immediately for access tokens, ID tokens, or refresh tokens when they are received. |

