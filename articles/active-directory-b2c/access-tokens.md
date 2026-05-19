---
title: Request an access token in Azure Active Directory B2C
description: Learn how to request an access token from Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory
ms.topic: concept-article
ms.date: 02/17/2025
ms.author: kengaderdus
ms.subservice: b2c

# Customer intent:
# As a developer integrating Azure Active Directory B2C into a web application and web API,
# I want to understand how to request and use access tokens so that I can securely
# authenticate users and authorize API access.
---

# Request an access token in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-end-of-sale-notice-b](../../includes/active-directory-b2c-end-of-sale-notice-b.md)]

An *access token* contains claims that can be used in Azure Active Directory B2C (Azure AD B2C) to identify permissions granted to an application or API. To call a protected API or resource server, the HTTP request must include a valid access token.

In Azure AD B2C responses, the access token is returned as **access_token**.

This article explains how to request and use access tokens for web applications and web APIs.

For more information about tokens, see [Overview of tokens in Azure Active Directory B2C](tokens-overview.md).

> [!NOTE]
> **Web API chains (On-Behalf-Of) are not supported in Azure AD B2C**
>
> Some architectures include a web API that calls another downstream web API secured by Azure AD B2C. This scenario is commonly known as the *On-Behalf-Of* (OBO) flow or OAuth 2.0 JWT Bearer Credential grant.
>
> Although the OBO flow is supported in Microsoft Entra ID, it is currently **not supported** for applications registered in Azure AD B2C tenants.

---

## Prerequisites

Before requesting an access token, complete the following setup steps:

- [Create a user flow](tutorial-create-user-flows.md) to enable user sign-up and sign-in.
- [Add a web API application to your Azure AD B2C tenant](add-web-api-application.md).

---

## Scopes

Scopes define the permissions that a client application requests for accessing protected resources.

When requesting an access token, the client application specifies the required permissions in the `scope` parameter.

For example, if the API exposes a scope named `read` and has the App ID URI:

```text
https://contoso.onmicrosoft.com/api
```

Then the full scope value becomes:

```text
https://contoso.onmicrosoft.com/api/read
```

Scopes are used by APIs to implement scope-based authorization. For example:

- Some users may only have **read** access
- Other users may have both **read** and **write** access

To request multiple scopes, separate them with spaces.

### Example: Decoded scope value

```text
scope=https://contoso.onmicrosoft.com/api/read openid offline_access
```

### Example: URL-encoded scope value

```text
scope=https%3A%2F%2Fcontoso.onmicrosoft.com%2Fapi%2Fread%20openid%20offline_access
```

If multiple scopes are requested, Azure AD B2C grants any valid scopes that the application is allowed to use.

The resulting access token contains the granted permissions in the `scp` claim.

---

## OpenID Connect scopes

OpenID Connect defines several special scopes.

| Scope | Description |
|---|---|
| `openid` | Requests an ID token |
| `offline_access` | Requests a refresh token |
| `00000000-0000-0000-0000-000000000000` | Requests an access token for the application's own API |

> [!IMPORTANT]
> If the `response_type` parameter includes `token`, the `scope` parameter must contain at least one API scope in addition to `openid` or `offline_access`.

---

## Request an authorization code

To request an access token, first obtain an authorization code.

Example request to the `/authorize` endpoint:

```http
GET https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/authorize?
client_id=<application-ID>
&nonce=anyRandomValue
&redirect_uri=https://jwt.ms
&scope=<application-ID-URI>/<scope-name>
&response_type=code
```

### Replace the placeholders

| Placeholder | Description |
|---|---|
| `<tenant-name>` | Azure AD B2C tenant name |
| `<policy-name>` | User flow or custom policy name |
| `<application-ID>` | Client application ID |
| `<application-ID-URI>` | API Application ID URI |
| `<scope-name>` | API scope name |
| `<redirect-uri>` | Registered redirect URI |

---

## Sign in and complete the user flow

When the request runs:

1. The user is redirected to the Azure AD B2C sign-in experience
2. The configured user flow executes
3. The user signs in or completes any required steps
4. Azure AD B2C returns an authorization code

Example response:

```text
https://jwt.ms/?code=eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMC...
```

---

## Exchange the authorization code for an access token

After receiving the authorization code, exchange it for an access token using the `/token` endpoint.

Example request:

```http
POST https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/token HTTP/1.1
Host: <tenant-name>.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=<application-ID>
&scope=<application-ID-URI>/<scope-name>
&code=<authorization-code>
&redirect_uri=https://jwt.ms
&client_secret=<client-secret>
```

---

## Successful token response

A successful response returns an access token.

Example:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrN...",
  "token_type": "Bearer",
  "not_before": 1549647431,
  "expires_in": 3600,
  "expires_on": 1549651031,
  "resource": "f2a76e08-93f2-4350-833c-965c02483b11",
  "profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiJjNjRhNGY3ZC0zMDkxLTRjNzMtYTcyMi1hM2YwNjk0Z..."
}
```

---

## Decode and inspect the access token

You can inspect the returned JWT access token using:

```text
https://jwt.ms
```

Example decoded token:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "X5eXk4xyojNFum1kl2Ytv8dl..."
}.
{
  "iss": "https://contoso0926tenant.b2clogin.com/c64a4f7d-3091-4c73-a7.../v2.0/",
  "exp": 1549651031,
  "nbf": 1549647431,
  "aud": "f2a76e08-93f2-4350-833c-965...",
  "oid": "1558f87f-452b-4757-bcd1-883...",
  "sub": "1558f87f-452b-4757-bcd1-883...",
  "name": "David",
  "tfp": "B2C_1_signupsignin1",
  "nonce": "anyRandomValue",
  "scp": "read",
  "azp": "38307aee-303c-4fff-8087-d8d2...",
  "ver": "1.0",
  "iat": 1549647431
}
.[Signature]
```

### Important claims

| Claim | Description |
|---|---|
| `iss` | Token issuer |
| `aud` | Intended audience |
| `scp` | Granted scopes |
| `exp` | Expiration time |
| `tfp` | User flow or policy |
| `sub` | User identifier |

---

## Next steps

- Learn how to [configure tokens in Azure AD B2C](configure-tokens.md)
- Learn about [token overview in Azure AD B2C](tokens-overview.md)
- Learn how to [add a web API application](add-web-api-application.md)
