---
title: Microsoft identity platform and OAuth 2.0 authorization code flow | Azure
titleSuffix: Microsoft identity platform
description: Build web applications using the Microsoft identity platform implementation of the OAuth 2.0 authentication protocol.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev, identityplatformtop40
---

# Microsoft identity platform and OAuth 2.0 authorization code flow

The OAuth 2.0 authorization code grant can be used in apps that are installed on a device to gain access to protected resources, such as web APIs. Using the Microsoft identity platform implementation of OAuth 2.0, you can add sign in and API access to your mobile and desktop apps.

This article describes how to program directly against the protocol in your application using any language.  When possible, we recommend you use the supported Microsoft Authentication Libraries (MSAL) instead to [acquire tokens and call secured web APIs](authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows).  Also take a look at the [sample apps that use MSAL](sample-v2-code.md).

The OAuth 2.0 authorization code flow is described in [section 4.1 of the OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749). It's used to perform authentication and authorization in the majority of app types, including [single page apps](v2-app-types.md#single-page-apps-javascript), [web apps](v2-app-types.md#web-apps), and [natively installed apps](v2-app-types.md#mobile-and-native-apps). The flow enables apps to securely acquire access_tokens that can be used to access resources secured by the Microsoft identity platform endpoint, as well as refresh tokens to get additional access_tokens, and ID tokens for the signed in user.

## Protocol diagram

At a high level, the entire authentication flow for an application looks a bit like this:

![OAuth Auth Code Flow](./media/v2-oauth2-auth-code-flow/convergence-scenarios-native.svg)

## Setup required for single-page apps

The authorization code flow for single page applications requires some additional setup.  While you are [creating your application](howto-create-service-principal-portal.md), you must mark the redirect URI for your app as a `spa` redirect URI. This causes the login server to allow CORS (cross origin resource sharing) for your app.  This is required to redeem the code using XHR.

If you attempt to use the authorization code flow and see this error:

`access to XMLHttpRequest at 'https://login.microsoftonline.com/common/v2.0/oauth2/token' from origin 'yourApp.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

Then you need to visit your app registration and update the redirect URI for your app to type `spa`.

## Request an authorization code

The authorization code flow begins with the client directing the user to the `/authorize` endpoint. In this request, the client requests the `openid`, `offline_access`, and `https://graph.microsoft.com/mail.read ` permissions from the user.  Some permissions are admin-restricted, for example writing data to an organization's directory by using `Directory.ReadWrite.All`. If your application requests access to one of these permissions from an organizational user, the user receives an error message that says they're not authorized to consent to your app's permissions. To request access to admin-restricted scopes, you should request them directly from a company administrator.  For more information, read [Admin-restricted permissions](v2-permissions-and-consent.md#admin-restricted-permissions).

```
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&state=12345
```

> [!TIP]
> Click the link below to execute this request! After signing in, your browser should be redirected to `https://localhost/myapp/` with a `code` in the address bar.
> <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345" target="_blank">https://login.microsoftonline.com/common/oauth2/v2.0/authorize...</a>

| Parameter    | Required/optional | Description |
|--------------|-------------|--------------|
| `tenant`    | required    | The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints).  |
| `client_id`   | required    | The **Application (client) ID** that the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app.  |
| `response_type` | required    | Must include `code` for the authorization code flow.       |
| `redirect_uri`  | required | The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. For native & mobile apps, you should use the default value of `https://login.microsoftonline.com/common/oauth2/nativeclient`.   |
| `scope`  | required    | A space-separated list of [scopes](v2-permissions-and-consent.md) that you want the user to consent to.  For the `/authorize` leg of the request, this can cover multiple resources, allowing your app to get consent for multiple web APIs you want to call. |
| `response_mode`   | recommended | Specifies the method that should be used to send the resulting token back to your app. Can be one of the following:<br/><br/>- `query`<br/>- `fragment`<br/>- `form_post`<br/><br/>`query` provides the code as a query string parameter on your redirect URI. If you're requesting an ID token using the implicit flow, you can't use `query` as specified in the [OpenID spec](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#Combinations). If you're requesting just the code, you can use `query`, `fragment`, or `form_post`. `form_post` executes a POST containing the code to your redirect URI. For more info, see [OpenID Connect protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code).  |
| `state`                 | recommended | A value included in the request that will also be returned in the token response. It can be a string of any content that you wish. A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](https://tools.ietf.org/html/rfc6749#section-10.12). The value can also encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| `prompt`  | optional    | Indicates the type of user interaction that is required. The only valid values at this time are `login`, `none`, and `consent`.<br/><br/>- `prompt=login` will force the user to enter their credentials on that request, negating single-sign on.<br/>- `prompt=none` is the opposite - it will ensure that the user isn't presented with any interactive prompt whatsoever. If the request can't be completed silently via single-sign on, the Microsoft identity platform endpoint will return an `interaction_required` error.<br/>- `prompt=consent` will trigger the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app.<br/>- `prompt=select_account` will interrupt single sign-on providing account selection experience listing all the accounts either in session or any remembered account or an option to choose to use a different account altogether.<br/> |
| `login_hint`  | optional    | Can be used to pre-fill the username/email address field of the sign-in page for the user, if you know their username ahead of time. Often apps will use this parameter during re-authentication, having already extracted the username from a previous sign-in using the `preferred_username` claim.   |
| `domain_hint`  | optional    | If included, it will skip the email-based discovery process that user goes through on the sign-in page, leading to a slightly more streamlined user experience - for example, sending them to their federated identity provider. Often apps will use this parameter during re-authentication, by extracting the `tid` from a previous sign-in. If the `tid` claim value is `9188040d-6c67-4c5b-b112-36a304b66dad`, you should use `domain_hint=consumers`. Otherwise, use `domain_hint=organizations`.  |
| `code_challenge`  | recommended / required | Used to secure authorization code grants via Proof Key for Code Exchange (PKCE). Required if `code_challenge_method` is included. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). This is now recommended for all application types - native apps, SPAs, and confidential clients like web apps. |
| `code_challenge_method` | recommended / required | The method used to encode the `code_verifier` for the `code_challenge` parameter. Can be one of the following values:<br/><br/>- `plain` <br/>- `S256`<br/><br/>If excluded, `code_challenge` is assumed to be plaintext if `code_challenge` is included. Microsoft identity platform supports both `plain` and `S256`. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). This is required for [single page apps using the authorization code flow](reference-third-party-cookies-spas.md).|


At this point, the user will be asked to enter their credentials and complete the authentication. The Microsoft identity platform endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter. If the user has not consented to any of those permissions, it will ask the user to consent to the required permissions. Details of [permissions, consent, and multi-tenant apps are provided here](v2-permissions-and-consent.md).

Once the user authenticates and grants consent, the Microsoft identity platform endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

#### Successful response

A successful response using `response_mode=query` looks like:

```HTTP
GET https://login.microsoftonline.com/common/oauth2/nativeclient?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...
&state=12345
```

| Parameter | Description  |
|-----------|--------------|
| `code` | The authorization_code that the app requested. The app can use the authorization code to request an access token for the target resource. Authorization_codes are short lived, typically they expire after about 10 minutes. |
| `state` | If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

You can also receive an access token and ID token if you request one and have the implicit grant enabled in your application registration.  This is sometimes referred to as the "hybrid flow", and is used by frameworks like ASP.NET.

#### Error response

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```HTTP
GET https://login.microsoftonline.com/common/oauth2/nativeclient?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description  |
|----------|------------------|
| `error`  | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an authentication error. |

#### Error codes for authorization endpoint errors

The following table describes the various error codes that can be returned in the `error` parameter of the error response.

| Error Code  | Description    | Client Action   |
|-------------|----------------|-----------------|
| `invalid_request` | Protocol error, such as a missing required parameter. | Fix and resubmit the request. This is a development error typically caught during initial testing. |
| `unauthorized_client` | The client application isn't permitted to request an authorization code. | This error usually occurs when the client application isn't registered in Azure AD or isn't added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| `access_denied`  | Resource owner denied consent  | The client application can notify the user that it can't proceed unless the user consents. |
| `unsupported_response_type` | The authorization server does not support the response type in the request. | Fix and resubmit the request. This is a development error typically caught during initial testing.  |
| `server_error`  | The server encountered an unexpected error.| Retry the request. These errors can result from temporary conditions. The client application might explain to the user that its response is delayed  to a temporary error. |
| `temporarily_unavailable`   | The server is temporarily too busy to handle the request. | Retry the request. The client application might explain to the user that its response is delayed because of a temporary condition. |
| `invalid_resource`  | The target resource is invalid because it does not exist, Azure AD can't find it, or it's not correctly configured. | This error indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| `login_required` | Too many or no users found | The client requested silent authentication (`prompt=none`), but a single user could not found. This may mean there are multiple users active in the session, or no users. This takes into account the tenant chosen (for example, if there are two Azure AD accounts active and one Microsoft account, and `consumers` is chosen, silent authentication will work). |
| `interaction_required` | The request requires user interaction. | An additional authentication step or consent is required. Retry the request without `prompt=none`. |

## Request an access token

Now that you've acquired an authorization_code and have been granted permission by the user, you can redeem the `code` for an `access_token` to the desired resource. Do this by sending a `POST` request to the `/token` endpoint:

```HTTP
// Line breaks for legibility only

POST /{tenant}/oauth2/v2.0/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&code=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&grant_type=authorization_code
&client_secret=JqQX2PNo9bpM0uEihUPzyrh    // NOTE: Only required for web apps. This secret needs to be URL-Encoded.
```

> [!TIP]
> Try executing this request in Postman! (Don't forget to replace the `code`)
> [![Try running this request in Postman](./media/v2-oauth2-auth-code-flow/runInPostman.png)](https://app.getpostman.com/run-collection/f77994d794bab767596d)

| Parameter  | Required/optional | Description     |
|------------|-------------------|----------------|
| `tenant`   | required   | The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints).  |
| `client_id` | required  | The Application (client) ID that the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page assigned to your app. |
| `grant_type` | required   | Must be `authorization_code` for the authorization code flow.   |
| `scope`      | required   | A space-separated list of scopes. The scopes requested in this leg must be equivalent to or a subset of the scopes requested in the first leg. The scopes must all be from a single resource, along with OIDC scopes (`profile`, `openid`, `email`). For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](v2-permissions-and-consent.md). |
| `code`          | required  | The authorization_code that you acquired in the first leg of the flow. |
| `redirect_uri`  | required  | The same redirect_uri value that was used to acquire the authorization_code. |
| `client_secret` | required for confidential web apps | The application secret that you created in the app registration portal for your app. You shouldn't use the application secret in a native app or single page app because client_secrets can't be reliably stored on devices or web pages. It's required for web apps and web APIs, which have the ability to store the client_secret securely on the server side.  The client secret must be URL-encoded before being sent. For more information on uri encoding,  see the [URI Generic Syntax specification](https://tools.ietf.org/html/rfc3986#page-12). |
| `code_verifier` | recommended  | The same code_verifier that was used to obtain the authorization_code. Required if PKCE was used in the authorization code grant request. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). |

### Successful response

A successful token response will look like:

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

| Parameter     | Description   |
|---------------|------------------------------|
| `access_token`  | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API.  |
| `token_type`    | Indicates the token type value. The only type that Azure AD supports is Bearer |
| `expires_in`    | How long the access token is valid (in seconds). |
| `scope`         | The scopes that the access_token is valid for. |
| `refresh_token` | An OAuth 2.0 refresh token. The  app can use this token acquire additional access tokens after the current access token expires. Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time. For more detail on refreshing an access token, refer to the [section below](#refresh-the-access-token). <br> **Note:** Only provided if `offline_access` scope was requested. |
| `id_token`      | A JSON Web Token (JWT). The  app can decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries. For more information about id_tokens, see the [`id_token reference`](id-tokens.md). <br> **Note:** Only provided if `openid` scope was requested. |

### Error response

Error responses will look like:

```json
{
  "error": "invalid_scope",
  "error_description": "AADSTS70011: The provided value for the input parameter 'scope' is not valid. The scope https://foo.microsoft.com/mail.read is not valid.\r\nTrace ID: 255d1aef-8c98-452f-ac51-23d051240864\r\nCorrelation ID: fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7\r\nTimestamp: 2016-01-09 02:02:12Z",
  "error_codes": [
    70011
  ],
  "timestamp": "2016-01-09 02:02:12Z",
  "trace_id": "255d1aef-8c98-452f-ac51-23d051240864",
  "correlation_id": "fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7"
}
```

| Parameter         | Description    |
|-------------------|----------------|
| `error`       | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an authentication error. |
| `error_codes` | A list of STS-specific error codes that can help in diagnostics.  |
| `timestamp`   | The time at which the error occurred. |
| `trace_id`    | A unique identifier for the request that can help in diagnostics. |
| `correlation_id` | A unique identifier for the request that can help in diagnostics across components. |

### Error codes for token endpoint errors

| Error Code         | Description        | Client Action    |
|--------------------|--------------------|------------------|
| `invalid_request`  | Protocol error, such as a missing required parameter. | Fix the request or app registration and resubmit the request   |
| `invalid_grant`    | The authorization code or PKCE code verifier is invalid or has expired. | Try a new request to the `/authorize` endpoint and verify that the code_verifier parameter was correct.  |
| `unauthorized_client` | The authenticated client isn't authorized to use this authorization grant type. | This usually occurs when the client application isn't registered in Azure AD or isn't added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| `invalid_client` | Client authentication failed.  | The client credentials aren't valid. To fix, the application administrator updates the credentials.   |
| `unsupported_grant_type` | The authorization server does not support the authorization grant type. | Change the grant type in the request. This type of error should occur only during development and be detected during initial testing. |
| `invalid_resource` | The target resource is invalid because it does not exist, Azure AD can't find it, or it's not correctly configured. | This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD.  |
| `interaction_required` | The request requires user interaction. For example, an additional authentication step is required. | Retry the request with the same resource.  |
| `temporarily_unavailable` | The server is temporarily too busy to handle the request. | Retry the request. The client application might explain to the user that its response is delayed because of a temporary condition. |

> [!NOTE]
> Single page apps may receive an `invalid_request` error indicating that cross-origin token redemption is permitted only for the 'Single-Page Application' client-type.  This indicates that the redirect URI used to request the token has not been marked as a `spa` redirect URI.  Review the [application registration steps](#setup-required-for-single-page-apps) on how to enable this flow.

## Use the access token

Now that you've successfully acquired an `access_token`, you can use the token in requests to web APIs by including it in the `Authorization` header:

> [!TIP]
> Execute this request in Postman! (Replace the `Authorization` header first)
> [![Try running this request in Postman](./media/v2-oauth2-auth-code-flow/runInPostman.png)](https://app.getpostman.com/run-collection/f77994d794bab767596d)

```HTTP
GET /v1.0/me/messages
Host: https://graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the access token

Access_tokens are short lived, and you must refresh them after they expire to continue accessing resources. You can do so by submitting another `POST` request to the `/token` endpoint, this time providing the `refresh_token` instead of the `code`.  Refresh tokens are valid for all permissions that your client has already received consent for - thus, a refresh token issued on a request for `scope=mail.read` can be used to request a new access token for `scope=api://contoso.com/api/UseResource`.

Refresh tokens for web apps and native apps do not have specified lifetimes. Typically, the lifetimes of refresh tokens are relatively long. However, in some cases, refresh tokens expire, are revoked, or lack sufficient privileges for the desired action. Your application needs to expect and handle [errors returned by the token issuance endpoint](#error-codes-for-token-endpoint-errors) correctly. Single page apps, however, get a token with a 24 hour lifetime, requiring a new authentication every day.  This can be done silently in an iframe when 3rd party cookies are enabled, but must be done in a top level frame (either full page navigation or a popup) in browsers without 3rd party cookies such as Safari.

Although refresh tokens aren't revoked when used to acquire new access tokens, you are expected to discard the old refresh token. The [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749#section-6) says: "The authorization server MAY issue a new refresh token, in which case the client MUST discard the old refresh token and replace it with the new refresh token. The authorization server MAY revoke the old refresh token after issuing a new refresh token to the client."

>[!IMPORTANT]
> For refresh tokens sent to a redirect URI registered as `spa`, the refresh token will expire after 24 hours. Additional refresh tokens acquired using the initial refresh token will carry over that expiration time, so apps must be prepared to re-run the authorization code flow using an interactive authentication to get a new refresh token every 24 hours. Users do not have to enter their credentials, and will usually not even see any UX, just a reload of your application - but the browser must visit the login page in a top level frame in order to see the login session.  This is due to [privacy features in browsers that block 3rd party cookies](reference-third-party-cookies-spas.md).

```HTTP

// Line breaks for legibility only

POST /{tenant}/oauth2/v2.0/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&refresh_token=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq...
&grant_type=refresh_token
&client_secret=JqQX2PNo9bpM0uEihUPzyrh      // NOTE: Only required for web apps. This secret needs to be URL-Encoded
```

> [!TIP]
> Try executing this request in Postman! (Don't forget to replace the `refresh_token`)
> [![Try running this request in Postman](./media/v2-oauth2-auth-code-flow/runInPostman.png)](https://app.getpostman.com/run-collection/f77994d794bab767596d)
>

| Parameter     |                | Description        |
|---------------|----------------|--------------------|
| `tenant`        | required     | The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints).   |
| `client_id`     | required    | The **Application (client) ID** that the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app. |
| `grant_type`    | required    | Must be `refresh_token` for this leg of the authorization code flow. |
| `scope`         | required    | A space-separated list of scopes. The scopes requested in this leg must be equivalent to or a subset of the scopes requested in the original authorization_code request leg. If the scopes specified in this request span multiple resource server, then the Microsoft identity platform endpoint will return a token for the resource specified in the first scope. For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](v2-permissions-and-consent.md). |
| `refresh_token` | required    | The refresh_token that you acquired in the second leg of the flow. |
| `client_secret` | required for web apps | The application secret that you created in the app registration portal for your app. It should not be used in a native  app, because client_secrets can't be reliably stored on devices. It's required for web apps and web APIs, which have the ability to store the client_secret securely on the server side. This secret needs to be URL-Encoded. For more information, see the [URI Generic Syntax specification](https://tools.ietf.org/html/rfc3986#page-12). |

#### Successful response

A successful token response will look like:

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

| Parameter     | Description         |
|---------------|-------------------------------------------------------------|
| `access_token`  | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| `token_type`    | Indicates the token type value. The only type that Azure AD supports is Bearer |
| `expires_in`    | How long the access token is valid (in seconds).   |
| `scope`         | The scopes that the access_token is valid for.    |
| `refresh_token` | A new OAuth 2.0 refresh token. You should replace the old refresh token with this newly acquired refresh token to ensure your refresh tokens remain valid for as long as possible. <br> **Note:** Only provided if `offline_access` scope was requested.|
| `id_token`      | An unsigned JSON Web Token (JWT). The  app can decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries. For more information about id_tokens, see the [`id_token reference`](id-tokens.md). <br> **Note:** Only provided if `openid` scope was requested. |

#### Error response

```json
{
  "error": "invalid_scope",
  "error_description": "AADSTS70011: The provided value for the input parameter 'scope' is not valid. The scope https://foo.microsoft.com/mail.read is not valid.\r\nTrace ID: 255d1aef-8c98-452f-ac51-23d051240864\r\nCorrelation ID: fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7\r\nTimestamp: 2016-01-09 02:02:12Z",
  "error_codes": [
    70011
  ],
  "timestamp": "2016-01-09 02:02:12Z",
  "trace_id": "255d1aef-8c98-452f-ac51-23d051240864",
  "correlation_id": "fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7"
}
```

| Parameter         | Description                                                                                        |
|-------------------|----------------------------------------------------------------------------------------------------|
| `error`           | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an authentication error.           |
| `error_codes` |A list of STS-specific error codes that can help in diagnostics. |
| `timestamp` | The time at which the error occurred. |
| `trace_id` | A unique identifier for the request that can help in diagnostics. |
| `correlation_id` | A unique identifier for the request that can help in diagnostics across components. |

For a description of the error codes and the recommended client action, see [Error codes for token endpoint errors](#error-codes-for-token-endpoint-errors).
