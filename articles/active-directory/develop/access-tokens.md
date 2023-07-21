---
title: Access tokens in the Microsoft identity platform
description: Learn about access tokens used in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 05/26/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
---

# Access tokens in the Microsoft identity platform

Access tokens enable clients to securely call protected web APIs. Web APIs use access tokens to perform authentication and authorization.

Per the OAuth specification, access tokens are opaque strings without a set format. Some identity providers (IDPs) use GUIDs and others use encrypted blobs. The format of the access token can depend on the configuration of the API that accepts it.

Custom APIs registered by developers on the Microsoft identity platform can choose from two different formats of JSON Web Tokens (JWTs) called `v1.0` and `v2.0`. Microsoft-developed APIs like Microsoft Graph or APIs in Azure have other proprietary token formats. These proprietary formats that can't be validated might be encrypted tokens, JWTs, or special JWT-like.

The contents of the token are intended only for the API, which means that access tokens must be treated as opaque strings. For validation and debugging purposes *only*, developers can decode JWTs using a site like [jwt.ms](https://jwt.ms). Tokens that a Microsoft API receives might not always be a JWT that can be decoded.

Clients should use the token response data that's returned with the access token for details on what's inside it. When the client requests an access token, the Microsoft identity platform also returns some metadata about the access token for the consumption of the application. This information includes the expiry time of the access token and the scopes for which it's valid. This data allows the application to do intelligent caching of access tokens without having to parse the access token itself.

See the following sections to learn how an API can validate and use the claims inside an access token.  

> [!NOTE]
> All documentation on this page, except where noted, applies only to tokens issued for registered APIs. It doesn't apply to tokens issued for Microsoft-owned APIs, nor can those tokens be used to validate how the Microsoft identity platform issues tokens for a registered API.  

## Token formats

There are two versions of access tokens available in the Microsoft identity platform: v1.0 and v2.0. These versions determine the claims that are in the token and make sure that a web API can control the contents of the token.

Web APIs have one of the following versions selected as a default during registration:

- v1.0 for Azure AD-only applications. The following example shows a v1.0 token (the keys are changed and personal information is removed, which prevents token validation):

    ```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiJlZjFkYTlkNC1mZjc3LTRjM2UtYTAwNS04NDBjM2Y4MzA3NDUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTUyMjIyOS8iLCJpYXQiOjE1MzcyMzMxMDYsIm5iZiI6MTUzNzIzMzEwNiwiZXhwIjoxNTM3MjM3MDA2LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOElBQUFBRm0rRS9RVEcrZ0ZuVnhMaldkdzhLKzYxQUdyU091TU1GNmViYU1qN1hPM0libUQzZkdtck95RCtOdlp5R24yVmFUL2tES1h3NE1JaHJnR1ZxNkJuOHdMWG9UMUxrSVorRnpRVmtKUFBMUU9WNEtjWHFTbENWUERTL0RpQ0RnRTIyMlRJbU12V05hRU1hVU9Uc0lHdlRRPT0iLCJhbXIiOlsid2lhIl0sImFwcGlkIjoiNzVkYmU3N2YtMTBhMy00ZTU5LTg1ZmQtOGMxMjc1NDRmMTdjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJBYmVMaUBtaWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJMaW5jb2xuIiwiZ2l2ZW5fbmFtZSI6IkFiZSAoTVNGVCkiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMjIyNDcvIiwiaXBhZGRyIjoiMjIyLjIyMi4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJvaWQiOiIwMjIyM2I2Yi1hYTFkLTQyZDQtOWVjMC0xYjJiYjkxOTQ0MzgiLCJyaCI6IkkiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJsM19yb0lTUVUyMjJiVUxTOXlpMmswWHBxcE9pTXo1SDNaQUNvMUdlWEEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6ImFiZWxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJGVnNHeFlYSTMwLVR1aWt1dVVvRkFBIiwidmVyIjoiMS4wIn0.D3H6pMUtQnoJAGq6AHd
    ```

- v2.0 for applications that support consumer accounts. The following example shows a v2.0 token (the keys are changed and personal information is removed, which prevents token validation):  

    ```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1MzcyMzEwNDgsIm5iZiI6MTUzNzIzMTA0OCwiZXhwIjoxNTM3MjM0OTQ4LCJhaW8iOiJBWFFBaS84SUFBQUF0QWFaTG8zQ2hNaWY2S09udHRSQjdlQnE0L0RjY1F6amNKR3hQWXkvQzNqRGFOR3hYZDZ3TklJVkdSZ2hOUm53SjFsT2NBbk5aY2p2a295ckZ4Q3R0djMzMTQwUmlvT0ZKNGJDQ0dWdW9DYWcxdU9UVDIyMjIyZ0h3TFBZUS91Zjc5UVgrMEtJaWpkcm1wNjlSY3R6bVE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjAiLCJuYW1lIjoiQWJlIExpbmNvbG4iLCJvaWQiOiI2OTAyMjJiZS1mZjFhLTRkNTYtYWJkMS03ZTRmN2QzOGU0NzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmVsaUBtaWNyb3NvZnQuY29tIiwicmgiOiJJIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJIS1pwZmFIeVdhZGVPb3VZbGl0anJJLUtmZlRtMjIyWDVyclYzeERxZktRIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiZnFpQnFYTFBqMGVRYTgyUy1JWUZBQSIsInZlciI6IjIuMCJ9.pj4N-w_3Us9DrBLfpCt
    ```

Set the version for applications by providing the appropriate value to the `accessTokenAcceptedVersion` setting in the [app manifest](reference-app-manifest.md#manifest-reference). The values of `null` and `1` result in v1.0 tokens, and the value of `2` results in v2.0 tokens.

## Token ownership

An access token request involves two parties: the client, who requests the token, and the resource (Web API) that accepts the token. The resource that the token is intended for (its *audience*) is defined in the `aud` claim in a token. Clients use the token but shouldn't understand or attempt to parse it. Resources accept the token.  

The Microsoft identity platform supports issuing any token version from any version endpoint. For example, when the value of `accessTokenAcceptedVersion` is `2`, a client calling the v1.0 endpoint to get a token for that resource receives a v2.0 access token.

Resources always own their tokens using the `aud` claim and are the only applications that can change their token details.

## Token lifetime

The default lifetime of an access token is variable. When issued, the Microsoft identity platform assigns a random value ranging between 60-90 minutes (75 minutes on average) as the default lifetime of an access token. The variation improves service resilience by spreading access token demand over a time, which prevents hourly spikes in traffic to Azure AD.

Tenants that don't use Conditional Access have a default access token lifetime of two hours for clients such as Microsoft Teams and Microsoft 365.

Adjust the lifetime of an access token to control how often the client application expires the application session, and how often it requires the user to reauthenticate (either silently or interactively). To override the default access token lifetime variation, use [Configurable token lifetime (CTL)](configurable-token-lifetimes.md).

Apply default token lifetime variation to organizations that have Continuous Access Evaluation (CAE) enabled. Apply default token lifetime variation even if the organizations use CTL policies. The default token lifetime for long lived token lifetime ranges from 20 to 28 hours. When the access token expires, the client must use the refresh token to silently acquire a new refresh token and access token.

Organizations that use [Conditional Access sign-in frequency (SIF)](../conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency) to enforce how frequently sign-ins occur can't override default access token lifetime variation. When organizations use SIF, the time between credential prompts for a client is the token lifetime that ranges from 60 - 90 minutes plus the sign-in frequency interval.  

Here's an example of how default token lifetime variation works with sign-in frequency.  Let's say an organization sets sign-in frequency to occur every hour. When the token has lifetime ranging from 60-90 minutes due to token lifetime variation, the actual sign-in interval occurs anywhere between 1 hour to 2.5 hours.

If a user with a token with a one hour lifetime performs an interactive sign-in at 59 minutes, there's no credential prompt because the sign-in is below the SIF threshold. If a new token has a lifetime of 90 minutes, the user wouldn't see a credential prompt for another hour and a half.  During a silent renewal attempt, Azure AD requires a credential prompt because the total session length has exceeded the sign-in frequency setting of 1 hour. In this example, the time difference between credential prompts due to the SIF interval and token lifetime variation would be 2.5 hours.

## Validate tokens

Not all applications should validate tokens. Only in specific scenarios should applications validate a token:

- Web APIs must validate access tokens sent to them by a client. They must only accept tokens containing their `aud` claim.
- Confidential web applications like ASP.NET Core must validate ID tokens sent to them by using the user's browser in the hybrid flow, before allowing access to a user's data or establishing a session.

If none of the above scenarios apply, there's no need to validate the token, and may present a security and reliability risk when basing decisions on the validity of the token. Public clients like native or single-page applications don't benefit from validating tokens because the application communicates directly with the IDP where SSL protection ensures the tokens are valid.

APIs and web applications must only validate tokens that have an `aud` claim that matches the application. Other resources may have custom token validation rules. For example, you can't validate tokens for Microsoft Graph according to these rules due to their proprietary format. Validating and accepting tokens meant for another resource is an example of the [confused deputy](https://cwe.mitre.org/data/definitions/441.html) problem.

If the application needs to validate an ID token or an access token, it should first validate the signature of the token and the issuer against the values in the OpenID discovery document.

The Azure AD middleware has built-in capabilities for validating access tokens, see [samples](sample-v2-code.md) to find one in the appropriate language. There are also several third-party open-source libraries available for JWT validation. For more information about Azure AD authentication libraries and code samples, see the [authentication libraries](reference-v2-libraries.md).

### Validate the issuer

[OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) says "The Issuer Identifier \[...\] MUST exactly match the value of the iss (issuer) Claim." For applications which use a tenant-specific metadata endpoint (like [https://login.microsoftonline.com/{example-tenant-id}/v2.0/.well-known/openid-configuration](https://login.microsoftonline.com/{example-tenant-id}/v2.0/.well-known/openid-configuration) or [https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration](https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration)), this is all that is needed.
Azure AD makes available a tenant-independent version of the document for multi-tenant apps at [https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration). This endpoint returns an issuer value `https://login.microsoftonline.com/{tenantid}/v2.0`. Applications may use this tenant-independent endpoint to validate tokens from every tenant with the following modifications:

 1. Instead of expecting the issuer claim in the token to exactly match the issuer value from metadata, the application should replace the `{tenantid}` value in the issuer metadata with the tenant ID that is the target of the current request, and then check the exact match.

 1. The application should use the `issuer` property returned from the keys endpoint to restrict the scope of keys.
    - Keys that have an issuer value like `https://login.microsoftonline.com/{tenantid}/v2.0` may be used with any matching token issuer.
    - Keys that have an issuer value like `https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0` should only be used with exact match.
    Azure AD's tenant-independent key endpoint ([https://login.microsoftonline.com/common/discovery/v2.0/keys](https://login.microsoftonline.com/common/discovery/v2.0/keys)) returns a document like:
    ```
    {
      "keys":[
        {"kty":"RSA","use":"sig","kid":"jS1Xo1OWDj_52vbwGNgvQO2VzMc","x5t":"jS1Xo1OWDj_52vbwGNgvQO2VzMc","n":"spv...","e":"AQAB","x5c":["MIID..."],"issuer":"https://login.microsoftonline.com/{tenantid}/v2.0"},
        {"kty":"RSA","use":"sig","kid":"2ZQpJ3UpbjAYXYGaXEJl8lV0TOI","x5t":"2ZQpJ3UpbjAYXYGaXEJl8lV0TOI","n":"wEM...","e":"AQAB","x5c":["MIID..."],"issuer":"https://login.microsoftonline.com/{tenantid}/v2.0"},
        {"kty":"RSA","use":"sig","kid":"yreX2PsLi-qkbR8QDOmB_ySxp8Q","x5t":"yreX2PsLi-qkbR8QDOmB_ySxp8Q","n":"rv0...","e":"AQAB","x5c":["MIID..."],"issuer":"https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0"}
      ]
    }
    ```

1. Applications that use Azure AD's tenant ID (`tid`) claim as a trust boundary instead of the standard issuer claim should ensure that the tenant-id claim is a GUID and that the issuer and tenant ID match.

Using tenant-independent metadata is more efficient for applications which accept tokens from many tenants.
> [!NOTE]
> With Azure AD tenant-independent metadata, claims should be interpreted within the tenant, just as under standard OpenID Connect, claims are interpreted within the issuer. That is, `{"sub":"ABC123","iss":"https://login.microsoftonline.com/{example-tenant-id}/v2.0","tid":"{example-tenant-id}"}` and `{"sub":"ABC123","iss":"https://login.microsoftonline.com/{another-tenand-id}/v2.0","tid":"{another-tenant-id}"}` describe different users, even though the `sub` is the same, because claims like `sub` are interpreted within the context of the issuer/tenant.

### Validate the signature

A JWT contains three segments separated by the `.` character. The first segment is the **header**, the second is the **body**, and the third is the **signature**. Use the signature segment to evaluate the authenticity of the token.

Azure AD issues tokens signed using the industry standard asymmetric encryption algorithms, such as RS256. The header of the JWT contains information about the key and encryption method used to sign the token:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "x5t": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk",
  "kid": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk"
}
```

The `alg` claim indicates the algorithm used to sign the token, while the `kid` claim indicates the particular public key that was used to validate the token.

At any given point in time, Azure AD may sign an ID token using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys on a periodic basis, so write the application to handle those key changes automatically. A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

Acquire the signing key data necessary to validate the signature by using the [OpenID Connect metadata document](v2-protocols-oidc.md#fetch-the-openid-configuration-document) located at:

```
https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
```

> [!TIP]
> Try this in a browser: [URL](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration)

The following information describes the metadata document:

- Is a JSON object that contains several useful pieces of information, such as the location of the various endpoints required for doing OpenID Connect authentication.
- Includes a `jwks_uri`, which gives the location of the set of public keys that correspond to the private keys used to sign tokens. The JSON Web Key (JWK) located at the `jwks_uri` contains all of the public key information in use at that particular moment in time. [RFC 7517](https://tools.ietf.org/html/rfc7517) describes the JWK format. The application can use the `kid` claim in the JWT header to select the public key, from this document, which corresponds to the private key that has been used to sign a particular token. It can then do signature validation using the correct public key and the indicated algorithm.

> [!NOTE]
> Use the `kid` claim to validate the token. Though v1.0 tokens contain both the `x5t` and `kid` claims, v2.0 tokens contain only the `kid` claim.

Doing signature validation is outside the scope of this document. There are many open-source libraries available for helping with signature validation if necessary.  However, the Microsoft identity platform has one token signing extension to the standards, which are custom signing keys.

If the application has custom signing keys as a result of using the [claims-mapping](active-directory-claims-mapping.md) feature, append an `appid` query parameter that contains the application ID. For validation, use `jwks_uri` that points to the signing key information of the application. For example: `https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration?appid=6731de76-14a6-49ae-97bc-6eba6914391e` contains a `jwks_uri` of `https://login.microsoftonline.com/{tenant}/discovery/keys?appid=6731de76-14a6-49ae-97bc-6eba6914391e`.

## Token revocation

Refresh tokens are invalidated or revoked at any time, for different reasons. The reasons fall into the categories of timeouts and revocations.

### Token timeouts

Organizations can use [token lifetime configuration](configurable-token-lifetimes.md) to alter the lifetime of refresh tokens Some tokens can go without use. For example, the user doesn't open the application for three months and then the token expires. Applications can encounter scenarios where the login server rejects a refresh token due to its age.

- MaxInactiveTime: Specifies the amount of time that a token can be inactive.
- MaxSessionAge: If MaxAgeSessionMultiFactor or MaxAgeSessionSingleFactor is set to something other than their default (Until-revoked), the user must reauthenticate after the time set in the MaxAgeSession*. Examples:
  - The tenant has a MaxInactiveTime of five days, and the user went on vacation for a week, and so Azure AD hasn't seen a new token request from the user in seven days. The next time the user requests a new token, they'll find their refresh token has been revoked, and they must enter their credentials again.
  - A sensitive application has a MaxAgeSessionSingleFactor of one day. If a user logs in on Monday, and on Tuesday (after 25 hours have elapsed), they must reauthenticate.

### Token revocations

The server possibly revokes refresh tokens due to a change in credentials, or due to use or administrative action. Refresh tokens are in the classes of confidential clients and public clients.

| Change | Password-based cookie | Password-based token | Non-password-based cookie | Non-password-based token | Confidential client token |
|--------|-----------------------|----------------------|---------------------------|-----------------------|---------------------------|
| Password expires | Stays alive | Stays alive | Stays alive | Stays alive | Stays alive |
| Password changed by user | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User does SSPR | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| Admin resets password | Revoked | Revoked | Stays alive | Stays alive | Stays alive |
| User or admin revokes the refresh tokens by using [PowerShell](/powershell/module/microsoft.graph.beta.users.actions/invoke-mgbetainvalidateuserrefreshtoken?view=graph-powershell-beta&preserve-view=true) | Revoked | Revoked | Revoked | Revoked | Revoked |
| [Single sign-out](v2-protocols-oidc.md#single-sign-out) on web | Revoked | Stays alive | Revoked | Stays alive | Stays alive |

#### Non-password-based

A *non-password-based* login is one where the user didn't type in a password to get it. Examples of non-password-based login include:

- Using your face with Windows Hello
- FIDO2 key
- SMS
- Voice
- PIN

## See also

- [Access token claims reference](access-token-claims-reference.md)
- [Primary Refresh Tokens](../devices/concept-primary-refresh-token.md)
- [Secure applications and APIs by validating claims](claims-validation.md)


## Next steps

- Learn more about the [security tokens used in Azure AD](security-tokens.md).

