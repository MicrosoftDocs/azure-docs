---
title: Authenticate with Azure AD and get a JWT token using OAuth 2.0
description: Example code showing how to authenticate with Azure Active Directory using OAuth 2.0 to access secured web applications and web APIs in your organization.
services: active-directory
author: rloutlaw
manager: angerobe
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2018
ms.author: routlaw
ms.custom: aaddev

#Customer intent: As a developer, I want to use HTTP to authenticate with JWT token to access a secured application or API given that I have retrieved an access token with a service principal or user permission already.

---

# How to: Request an access token using OAuth 2.0 to access web APIs and applications secured by Azure AD

This article shows how to get a JSON Web Token (JWT) to access resources secured by Azure AD. It assumes that you have an [authorization token](/azure/active-directory/develop/active-directory-protocols-oauth-code#request-an-authorization-code) either from user-granted permission or through a [service principal](/azure/active-directory/develop/active-directory-application-objects).

## Build the request

Use the following `POST` HTTP request to get a JWT to access a specific application or API secured by Azure AD.

```http
POST https://{tenant}/oauth2/v2.0/token?client_id={client-id}
&scope={scope}
&code=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&grant_type=authorization_code
&client_secret=JqQX2PNo9bpM0uEihUPzyrh   
```

### Request headers

The following headers are required:

|Request header|Description|  
|--------------------|-----------------|  
| *Host:* | https://login.microsoftonline.com |
| *Content-Type:*| application/x-www-form-urlencoded |

### URI parameters

| Parameter     |                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
|---------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| tenant        | required              | The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints).                                                                                                                                                   |
| client_id     | required              | The Application ID that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList)) assigned your app.                                                                                                                                                                                                                             |
| grant_type    | required              | Must be `authorization_code` for the authorization code flow.                                                                                                                                                                                                                                                                                                                                                                            |
| scope         | required              | A space-separated list of scopes. The scopes requested in this leg must be equivalent to or a subset of the scopes in the call to `/authorize`. If the scopes specified in this request span multiple resource server, then the v2.0 endpoint will return a token for the resource specified in the first scope. For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](v2-permissions-and-consent.md). |
| code          | required              | The authorization_code that you acquired in the call to `/authorize`                                                                                                                                                                                                                                                                                                                                                                |
| redirect_uri  | required              | The same redirect_uri value that was used to acquire the authorization_code.                                                                                                                                                                                                                                                                                                                                                             |
| client_secret | required for web apps | The application secret that you created in the app registration portal for your app. Do not use in a native app, because client_secrets cannot be reliably stored on devices. It is required for web apps and web APIs, which have the ability to store the client_secret securely on the server side.  Client secrets must be URL-encoded before being sent.                                                                                 |
| code_verifier | optional              | The same code_verifier that was used to obtain the authorization_code. Required if PKCE was used in the authorization code grant request. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636)                                                                                                                                                                                                                                                                                             |

## Handle the response

A successful token response will contain a JWT token and will look like:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
    "token_type": "Bearer",
    "expires_in": 3599,
    "scope": "https%3A%2F%2Fgraph.microsoft.com%2Fmail.read",
    "refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD...",
}
```
| Parameter     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| access_token  | The requested [access token](access-tokens.md). The  app can use this token to authenticate to the secured resource, such as a web API.                                                                                                                                                                                                                                                                                                                                    |
| token_type    | Indicates the token type value. The only type that Azure AD supports is Bearer                                                                                                                                                                                                                                                                                                                                                                           |
| expires_in    | How long the access token is valid (in seconds).                                                                                                                                                                                                                                                                                                                                                                                                       |
| scope         | The scopes that the access_token is valid for.                                                                                                                                                                                                                                                                                                                                                                                                         |
| refresh_token | An OAuth 2.0 refresh token. The  app can use this token acquire additional access tokens after the current access token expires. Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [v2.0 code grant reference](v2-oauth2-auth-code-flow.md#refresh-the-access-token). <br> **Note:** Only provided if `offline_access` scope was requested.                                               |
| id_token      | An unsigned JSON Web Token (JWT). The  app can decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries. For more information about id_tokens, see the [`id_token reference`](id-tokens.md). <br> **Note:** Only provided if `openid` scope was requested. |
