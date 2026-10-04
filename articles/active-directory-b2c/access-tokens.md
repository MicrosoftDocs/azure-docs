---
title: Request an access token in Azure Active Directory B2C
description: Learn how to request an access token from Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory
ms.service: entra-id

ms.topic: concept-article
ms.date: 02/17/2025
ms.author: kengaderdus
ms.subservice: b2c

# Customer intent: As a developer integrating Azure Active Directory B2C with a web application and web API, I want to understand how to request an access token, so that I can authenticate and authorize users to access my APIs securely.
---

# Request an access token in Azure Active Directory B2C

> [!NOTE]
> Azure Active Directory B2C is approaching end of sale. See the Azure AD B2C end-of-sale announcement for more information.

An **access token** contains claims that you can use in Azure Active Directory B2C (Azure AD B2C) to identify the granted permissions to your APIs. To call a resource server, the HTTP request must include an access token. An access token is denoted as **access_token** in the responses from Azure AD B2C.

This article shows you how to request an access token for a web application and web API. For more information about tokens in Azure AD B2C, see the [overview of tokens in Azure Active Directory B2C](tokens-overview.md).

> [!NOTE]
> **Web API chains (On-Behalf-Of) are not supported by Azure AD B2C**
>
> Many architectures include a web API that needs to call another downstream web API, both secured by Azure AD B2C. This scenario is common in clients that have a web API back end, which in turn calls another service.
>
> This chained web API scenario can be supported by using the OAuth 2.0 JWT Bearer Credential grant, otherwise known as the On-Behalf-Of flow. However, the On-Behalf-Of flow is not currently implemented in Azure AD B2C.
>
> Although On-Behalf-Of works for applications registered in Microsoft Entra ID, it does not work for applications registered in Azure AD B2C, regardless of the tenant (Microsoft Entra ID or Azure AD B2C) that is issuing the tokens.

## Prerequisites

- [Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application.
- If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md).

## Scopes

Scopes provide a way to manage permissions to protected resources. When an access token is requested, the client application needs to specify the desired permissions in the `scope` parameter of the request.

For example, to specify the **Scope Value** of `read` for the API that has the **App ID URI** of:

```text
https://contoso.onmicrosoft.com/api
```

the scope would be:

```text
https://contoso.onmicrosoft.com/api/read
```

Scopes are used by the web API to implement scope-based access control. For example:

- Some users may have both read and write access.
- Others may have read-only access.

To acquire multiple permissions in the same request, add multiple entries to the `scope` parameter separated by spaces.

### Example (decoded URL)

```text
scope=https://contoso.onmicrosoft.com/api/read openid offline_access
```

### Example (URL encoded)

```text
scope=https%3A%2F%2Fcontoso.onmicrosoft.com%2Fapi%2Fread%20openid%20offline_access
```

If you request more scopes than those granted for your client application, the request succeeds if at least one permission is granted. The `scp` claim in the resulting access token contains only the permissions that were successfully granted.

## OpenID Connect scopes

The OpenID Connect standard specifies several special scope values. These scopes represent permissions to access the user's profile.

- **openid** — Requests an ID token.
- **offline_access** — Requests a refresh token using [authorization code flow](authorization-code-flow.md).
- **00000000-0000-0000-0000-000000000000** — Using the client ID as the scope indicates that your app requires an access token for its own service or web API represented by the same client ID.

If the `response_type` parameter in an `/authorize` request includes `token`, the `scope` parameter must include at least one resource scope other than `openid` and `offline_access`. Otherwise, the `/authorize` request fails.

## Request a token

To request an access token, you first need an authorization code.

The following example shows a request to the `/authorize` endpoint:

```http
GET https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/authorize?
client_id=<application-ID>
&nonce=anyRandomValue
&redirect_uri=https://jwt.ms
&scope=<application-ID-URI>/<scope-name>
&response_type=code
```

Replace the placeholders as follows:

| Placeholder | Description |
|-------------|-------------|
| `<tenant-name>` | Name of your Azure AD B2C tenant. If you're using a custom domain, replace `tenant-name.b2clogin.com` with your custom domain. |
| `<policy-name>` | Name of your user flow or custom policy. |
| `<application-ID>` | Application (client) ID of the web application. |
| `<application-ID-URI>` | Application ID URI configured under **Expose an API**. |
| `<scope-name>` | Scope name configured under **Expose an API**. |
| `<redirect-uri>` | Redirect URI registered for the application. |

You can paste the request into your browser to test it.

During this interactive phase, the user completes the sign-up or sign-in flow. Depending on how the policy is configured, users may enter credentials, complete MFA, or perform other steps.

A successful response returns an authorization code similar to:

```text
https://jwt.ms/?code=eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMC...
```

After receiving the authorization code, exchange it for an access token by sending a POST request to the `/token` endpoint.

```http
POST https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/token HTTP/1.1
Host: <tenant-name>.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=<application-ID>
&scope=<application-ID-URI>/<scope-name>
&code=eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMC...
&redirect_uri=https://jwt.ms
&client_secret=2hMG2-_:y12n10vwH...
```

To test the request, you can use any HTTP client such as:

- Postman
- curl
- Microsoft PowerShell

## Successful token response

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

## Example decoded access token

When you inspect the token using `https://jwt.ms`, the payload resembles:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "X5eXk4xyojNFum1kl2Ytv8dl..."
}
.
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
.
[Signature]
```

## Next steps

- Learn how to [configure tokens in Azure AD B2C](configure-tokens.md).
