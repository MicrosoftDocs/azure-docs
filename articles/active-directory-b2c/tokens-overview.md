---
title: Overview of tokens - Azure Active Directory B2C
description: Learn about the tokens used in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 05/21/2020
ms.author: mimart
ms.subservice: B2C
---

# Overview of tokens in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) emits several types of security tokens as it processes each [authentication flow](application-types.md). This document describes the format, security characteristics, and contents of each type of token.

## Token types

Azure AD B2C supports the [OAuth 2.0 and OpenID Connect protocols](protocols-overview.md), which makes use of tokens for authentication and secure access to resources. All tokens used in Azure AD B2C are [JSON web tokens (JWTs)](https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) that contain assertions of information about the bearer and the subject of the token.

The following tokens are used in communication with Azure AD B2C:

- *ID token* - A JWT that contains claims that you can use to identify users in your application. This token is securely sent in HTTP requests for communication between two components of the same application or service. You can use the claims in an ID token as you see fit. They are commonly used to display account information or to make access control decisions in an application. ID tokens are signed, but they are not encrypted. When your application or API receives an ID token, it must validate the signature to prove that the token is authentic. Your application or API must also validate a few claims in the token to prove that it's valid. Depending on the scenario requirements, the claims validated by an application can vary, but your application must perform some common claim validations in every scenario.
- *Access token* -  A JWT that contains claims that you can use to identify the granted permissions to your APIs. Access tokens are signed, but they aren't encrypted. Access tokens are used to provide access to APIs and resource servers.  When your API receives an access token, it must validate the signature to prove that the token is authentic. Your API must also validate a few claims in the token to prove that it is valid. Depending on the scenario requirements, the claims validated by an application can vary, but your application must perform some common claim validations in every scenario.
- *Refresh token* - Refresh tokens are used to acquire new ID tokens and access tokens in an OAuth 2.0 flow. They provide your application with long-term access to resources on behalf of users without requiring interaction with those users. Refresh tokens are opaque to your application. They are issued by Azure AD B2C and can be inspected and interpreted only by Azure AD B2C. They are long-lived, but your application shouldn't be written with the expectation that a refresh token will last for a specific period of time. Refresh tokens can be invalidated at any moment for a variety of reasons. The only way for your application to know if a refresh token is valid is to attempt to redeem it by making a token request to Azure AD B2C. When you redeem a refresh token for a new token, you receive a new refresh token in the token response. Save the new refresh token. It replaces the refresh token that you previously used in the request. This action helps guarantee that your refresh tokens remain valid for as long as possible.

## Endpoints

A [registered application](tutorial-register-applications.md) receives tokens and communicates with Azure AD B2C by sending requests to these endpoints:

- `https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/authorize`
- `https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/token`

Security tokens that your application receives from Azure AD B2C can come from the `/authorize` or `/token` endpoints. When ID tokens are acquired from the `/authorize` endpoint, it's done using the [implicit flow](implicit-flow-single-page-application.md), which is often used for users signing in to JavaScript-based web applications. When ID tokens are acquired from the `/token` endpoint, it's done using the [authorization code flow](openid-connect.md#get-a-token), which keeps the token hidden from the browser.

## Claims

When you use Azure AD B2C, you have fine-grained control over the content of your tokens. You can configure [user flows](user-flow-overview.md) and [custom policies](custom-policy-overview.md) to send certain sets of user data in claims that are required for your application. These claims can include standard properties such as **displayName** and **emailAddress**. Your applications can use these claims to securely authenticate users and requests.

The claims in ID tokens are not returned in any particular order. New claims can be introduced in ID tokens at any time. Your application shouldn't break as new claims are introduced. You can also include [custom user attributes](user-flow-custom-attributes.md) in your claims.

The following table lists the claims that you can expect in ID tokens and access tokens issued by Azure AD B2C.

| Name | Claim | Example value | Description |
| ---- | ----- | ------------- | ----------- |
| Audience | `aud` | `90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6` | Identifies the intended recipient of the token. For Azure AD B2C, the audience is the application ID. Your application should validate this value and reject the token if it doesn't match. Audience is synonymous with resource. |
| Issuer | `iss` |`https://<tenant-name>.b2clogin.com/775527ff-9a37-4307-8b3d-cc311f58d925/v2.0/` | Identifies the security token service (STS) that constructs and returns the token. It also identifies the directory in which the user was authenticated. Your application should validate the issuer claim to make sure that the token came from the appropriate endpoint. |
| Issued at | `iat` | `1438535543` | The time at which the token was issued, represented in epoch time. |
| Expiration time | `exp` | `1438539443` | The time at which the token becomes invalid, represented in epoch time. Your application should use this claim to verify the validity of the token lifetime. |
| Not before | `nbf` | `1438535543` | The time at which the token becomes valid, represented in epoch time. This time is usually the same as the time the token was issued. Your application should use this claim to verify the validity of the token lifetime. |
| Version | `ver` | `1.0` | The version of the ID token, as defined by Azure AD B2C. |
| Code hash | `c_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | A code hash included in an ID token only when the token is issued together with an OAuth 2.0 authorization code. A code hash can be used to validate the authenticity of an authorization code. For more information about how to perform this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html).  |
| Access token hash | `at_hash` | `SGCPtt01wxwfgnYZy2VJtQ` | An access token hash included in an ID token only when the token is issued together with an OAuth 2.0 access token. An access token hash can be used to validate the authenticity of an access token. For more information about how to perform this validation, see the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html)  |
| Nonce | `nonce` | `12345` | A nonce is a strategy used to mitigate token replay attacks. Your application can specify a nonce in an authorization request by using the `nonce` query parameter. The value you provide in the request is emitted unmodified in the `nonce` claim of an ID token only. This claim allows your application to verify the value against the value specified on the request. Your application should perform this validation during the ID token validation process. |
| Subject | `sub` | `884408e1-2918-4cz0-b12d-3aa027d7563b` | The principal about which the token asserts information, such as the user of an application. This value is immutable and cannot be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory. |
| Authentication context class reference | `acr` | Not applicable | Used only with older policies. |
| Trust framework policy | `tfp` | `b2c_1_signupsignin1` | The name of the policy that was used to acquire the ID token. |
| Authentication time | `auth_time` | `1438535543` | The time at which a user last entered credentials, represented in epoch time. There is no discrimination between that authentication being a fresh sign-in, a single sign-on (SSO) session, or another sign-in type. The `auth_time` is the last time the application (or user) initiated an authentication attempt against Azure AD B2C. The method used to authenticate is not differentiated. |
| Scope | `scp` | `Read`| The permissions granted to the resource for an access token. Multiple granted permissions are separated by a space. |
| Authorized Party | `azp` | `975251ed-e4f5-4efd-abcb-5f1a8f566ab7` | The **application ID** of the client application that initiated the request. |

## Configuration

The following properties are used to [manage lifetimes of security tokens](configure-tokens.md) emitted by Azure AD B2C:

- **Access & ID token lifetimes (minutes)** - The lifetime of the OAuth 2.0 bearer token used to gain access to a protected resource. The default is 60 minutes. The minimum (inclusive) is 5 minutes. The maximum (inclusive) is 1440 minutes.

- **Refresh token lifetime (days)** - The maximum time period before which a refresh token can be used to acquire a new access or ID token. The time period also covers acquiring a new refresh token if your application has been granted the `offline_access` scope. The default is 14 days. The minimum (inclusive) is one day. The maximum (inclusive) is 90 days.

- **Refresh token sliding window lifetime (days)** - After this time period elapses the user is forced to reauthenticate, irrespective of the validity period of the most recent refresh token acquired by the application. It can only be provided if the switch is set to **Bounded**. It needs to be greater than or equal to the **Refresh token lifetime (days)** value. If the switch is set to **Unbounded**, you cannot provide a specific value. The default is 90 days. The minimum (inclusive) is one day. The maximum (inclusive) is 365 days.

The following use cases are enabled using these properties:

- Allow a user to stay signed in to a mobile application indefinitely, as long as the user is continually active on the application. You can set **Refresh token sliding window lifetime (days)** to **Unbounded** in your sign-in user flow.
- Meet your industry's security and compliance requirements by setting the appropriate access token lifetimes.

These settings are not available for password reset user flows.

## Compatibility

The following properties are used to [manage token compatibility](configure-tokens.md):

- **Issuer (iss) claim** - This property identifies the Azure AD B2C tenant that issued the token. The default value is `https://<domain>/{B2C tenant GUID}/v2.0/`. The value of `https://<domain>/tfp/{B2C tenant GUID}/{Policy ID}/v2.0/` includes IDs for both the Azure AD B2C tenant and the user flow that was used in the token request. If your application or library needs Azure AD B2C to be compliant with the [OpenID Connect Discovery 1.0 spec](https://openid.net/specs/openid-connect-discovery-1_0.html), use this value.

- **Subject (sub) claim** - This property identifies the entity for which the token asserts information. The default value is **ObjectID**, which populates the `sub` claim in the token with the object ID of the user. The value of **Not supported** is only provided for backward-compatibility. It's recommended that you switch to **ObjectID** as soon as you are able to.

- **Claim representing policy ID** - This property identifies the claim type into which the policy name used in the token request is populated. The default value is `tfp`. The value of `acr` is only provided for backward-compatibility.

## Pass-through

When a user journey starts, Azure AD B2C receives an access token from an identity provider. Azure AD B2C uses that token to retrieve information about the user. You [enable a claim in your user flow](idp-pass-through-user-flow.md) or [define a claim in your custom policy](idp-pass-through-custom.md) to pass the token through to the applications that you register in Azure AD B2C. Your application must be using a [v2 user flow](user-flow-versions.md) to take advantage of passing the token as a claim.

Azure AD B2C currently only supports passing the access token of OAuth 2.0 identity providers, which include Facebook and Google. For all other identity providers, the claim is returned blank.

## Validation

To validate a token, your application should check both the signature and claims of the token. Many open-source libraries are available for validating JWTs, depending on your preferred language. It's recommended that you explore those options rather than implement your own validation logic.

### Validate signature

A JWT contains three segments, a *header*, a *body*, and a *signature*. The signature segment can be used to validate the authenticity of the token so that it can be trusted by your application. Azure AD B2C tokens are signed by using industry-standard asymmetric encryption algorithms, such as RSA 256.

The header of the token contains information about the key and encryption method used to sign the token:

```
{
        "typ": "JWT",
        "alg": "RS256",
        "kid": "GvnPApfWMdLRi8PDmisFn7bprKg"
}
```

The value of the **alg** claim is the algorithm that was used to sign the token. The value of the **kid** claim is the public key that was used to sign the token. At any given time, Azure AD B2C can sign a token by using any one of a set of public-private key pairs. Azure AD B2C rotates the possible set of keys periodically. Your application should be written to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD B2C is every 24 hours.

Azure AD B2C has an OpenID Connect metadata endpoint. Using this endpoint, applications can request information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. Your Azure AD B2C tenant contains a JSON metadata document for each policy. The metadata document is a JSON object that contains several useful pieces of information. The metadata contains **jwks_uri**, which gives the location of the set of public keys that are used to sign tokens. That location is provided here, but it's best to fetch the location dynamically by using the metadata document and parsing **jwks_uri**:

```
https://contoso.b2clogin.com/contoso.onmicrosoft.com/b2c_1_signupsignin1/discovery/v2.0/keys
```
The JSON document located at this URL contains all the public key information in use at a particular moment. Your app can use the `kid` claim in the JWT header to select the public key in the JSON document that is used to sign a particular token. It can then perform signature validation by using the correct public key and the indicated algorithm.

The metadata document for the `B2C_1_signupsignin1` policy in the `contoso.onmicrosoft.com` tenant is located at:

```
https://contoso.b2clogin.com/contoso.onmicrosoft.com/b2c_1_signupsignin1/v2.0/.well-known/openid-configuration
```

To determine which policy was used to sign a token (and where to go to request the metadata), you have two options. First, the policy name is included in the `acr` claim in the token. You can parse claims out of the body of the JWT by base-64 decoding the body and deserializing the JSON string that results. The `acr` claim is the name of the policy that was used to issue the token. The other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used. Either method is valid.

A description of how to perform signature validation is outside the scope of this document. Many open-source libraries are available to help you validate a token.

### Validate claims

When your applications or API receives an ID token, it should also perform several checks against the claims in the ID token. The following claims should be checked:

- **audience** - Verifies that the ID token was intended to be given to your application.
- **not before** and **expiration time** - Verifies that the ID token hasn't expired.
- **issuer** - Verifies that the token was issued to your application by Azure AD B2C.
- **nonce** - A strategy for token replay attack mitigation.

For a full list of validations your application should perform, refer to the [OpenID Connect specification](https://openid.net).

## Next steps

Learn more about how to [use access tokens](access-tokens.md).

