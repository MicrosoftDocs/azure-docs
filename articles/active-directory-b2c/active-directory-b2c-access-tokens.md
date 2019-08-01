---
title: Request an access token - Azure Active Directory B2C | Microsoft Docs
description: Learn how to request an access token from Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: marsma
ms.subservice: B2C

---
# Request an access token in Azure Active Directory B2C

An *access token* contains claims that you can use in Azure Active Directory (Azure AD) B2C to identify the granted permissions to your APIs. When calling a resource server, an access token must be present in the HTTP request. An access token is denoted as **access_token** in the responses from Azure AD B2C. 

This article shows you how to request an access token for a web application and web API. For more information about tokens in Azure AD B2C, see the [overview of tokens in Azure Active Directory B2C](active-directory-b2c-reference-tokens.md).

> [!NOTE]
> **Web API chains (On-Behalf-Of) is not supported by Azure AD B2C.** - Many architectures include a web API that needs to call another downstream web API, both secured by Azure AD B2C. This scenario is common in clients that have a web API back end, which in turn calls a another service. This chained web API scenario can be supported by using the OAuth 2.0 JWT Bearer Credential grant, otherwise known as the On-Behalf-Of flow. However, the On-Behalf-Of flow is not currently implemented in Azure AD B2C.

## Prerequisites

- [Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application.
- If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-application.md).

## Scopes

Scopes provide a way to manage permissions to protected resources. When an access token is requested, the client application needs to specify the desired permissions in the **scope** parameter of the request. For example, to specify the **Scope Value** of `read` for the API that has the **App ID URI** of `https://contoso.onmicrosoft.com/api`, the scope would be `https://contoso.onmicrosoft.com/api/read`.

Scopes are used by the web API to implement scope-based access control. For example, users of the web API could have both read and write access, or users of the web API might have only read access. To acquire multiple permissions in the same request, you can add multiple entries in the single **scope** parameter of the request, separated by spaces.

The following example shows scopes decoded in a URL:

```
scope=https://contoso.onmicrosoft.com/api/read openid offline_access
```

The following example shows scopes encoded in a URL:

```
scope=https%3A%2F%2Fcontoso.onmicrosoft.com%2Fapi%2Fread%20openid%20offline_access
```

If you request more scopes than what is granted for your client application, the call succeeds if at least one permission is granted. The **scp** claim in the resulting access token is populated with only the permissions that were successfully granted. The OpenID Connect standard specifies several special scope values. The following scopes represent the permission to access the user’s profile:

- **openid** - Requests an ID token.
- **offline_access** - Requests a refresh token using [Auth Code flows](active-directory-b2c-reference-oauth-code.md).

If the **response_type** parameter in an `/authorize` request includes `token`, the **scope** parameter must include at least one resource scope other than `openid` and `offline_access` that will be granted. Otherwise, the `/authorize` request fails.

## Request a token

To request an access token, you need an authorization code. Below is an example of a request to the `/authorize` endpoint for an authorization code. Custom domains are not supported for use with access tokens. Use your tenant-name.onmicrosoft.com domain in the request URL.

In the following example, you replace these values:

- `<tenant-name>` - The name of your Azure AD B2C tenant.
- `<policy-name>` - The name of your custom policy or user flow.
- `<application-ID>` - The application identifier of the web application that you registered to support the user flow.
- `<redirect-uri>` - The **Redirect URI** that you entered when you registered the client application.

```
GET https://<tenant-name>.b2clogin.com/tfp/<tenant-name>.onmicrosoft.com/<policy-name>/oauth2/v2.0/authorize?
client_id=<application-ID>
&nonce=anyRandomValue
&redirect_uri=https://jwt.ms
&scope=https://tenant-name>.onmicrosoft.com/api/read
&response_type=code 
```

The response with the authorization code should be similar to this example:

```
https://jwt.ms/?code=eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMC...
```

After successfully receiving the authorization code, you can use it to request an access token:

```
POST <tenant-name>.onmicrosoft.com/oauth2/v2.0/token?p=<policy-name> HTTP/1.1
Host: https://<tenant-name>.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=<application-ID>
&scope=https://<tenant-name>.onmicrosoft.com/api/read
&code=eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMC...
&redirect_uri=https://jwt.ms
&client_secret=2hMG2-_:y12n10vwH...
```

You should see something similar to the following response:

```
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

When using https://jwt.ms to examine the access token that was returned, you should see something similar to the following example:

```
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "X5eXk4xyojNFum1kl2Ytv8dl..."
}.{
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
}.[Signature]
```

## Next steps

- Learn about how to [configure tokens in Azure AD B2C](configure-tokens.md)
