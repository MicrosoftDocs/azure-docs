---
title: Understand the OAuth 2.0 authorization code flow in Azure AD
description: This article describes how to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure Active Directory and OAuth 2.0.
services: active-directory
documentationcenter: .net
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/12/2019
ms.author: ryanwi
ms.reviewer: hirsin
ms.custom: aaddev
---

# Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow

> [!NOTE]
>  If you don't tell the server what resource you plan to call, then the server will not trigger the Conditional Access policies for that resource. So in order to have MFA trigger, you will need to include a resource in your URL. 
>

Azure Active Directory (Azure AD) uses OAuth 2.0 to enable you to authorize access to web applications and web APIs in your Azure AD tenant. This guide is language independent, and describes how to send and receive HTTP messages without using any of our [open-source libraries](active-directory-authentication-libraries.md).

The OAuth 2.0 authorization code flow is described in [section 4.1 of the OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749#section-4.1). It is used to perform authentication and authorization in most application types, including web apps and natively installed apps.

[!INCLUDE [active-directory-protocols-getting-started](../../../includes/active-directory-protocols-getting-started.md)]

## OAuth 2.0 authorization flow

At a high level, the entire authorization flow for an application looks a bit like this:

![OAuth Auth Code Flow](./media/v1-protocols-oauth-code/active-directory-oauth-code-flow-native-app.png)

## Request an authorization code

The authorization code flow begins with the client directing the user to the `/authorize` endpoint. In this request, the client indicates the permissions it needs to acquire from the user. You can get the OAuth 2.0 authorization endpoint for your tenant by selecting **App registrations > Endpoints** in the Azure portal.

```
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%3A12345
&response_mode=query
&resource=https%3A%2F%2Fservice.contoso.com%2F
&state=12345
```

| Parameter |  | Description |
| --- | --- | --- |
| tenant |required |The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are tenant identifiers, for example, `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` or `common` for tenant-independent tokens |
| client_id |required |The Application ID assigned to your app when you registered it with Azure AD. You can find this in the Azure Portal. Click **Azure Active Directory** in the services sidebar, click **App registrations**, and choose the application. |
| response_type |required |Must include `code` for the authorization code flow. |
| redirect_uri |recommended |The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. For native & mobile apps, you should use the default value of `https://login.microsoftonline.com/common/oauth2/nativeclient`. |
| response_mode |optional |Specifies the method that should be used to send the resulting token back to your app. Can be `query`, `fragment`, or `form_post`. `query` provides the code as a query string parameter on your redirect URI. If you're requesting an ID token using the implicit flow, you cannot use `query` as specified in the [OpenID spec](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#Combinations). If you're requesting just the code, you can use `query`, `fragment`, or `form_post`. `form_post` executes a POST containing the code to your redirect URI. The default is `query` for a code flow.  |
| state |recommended |A value included in the request that is also returned in the token response. A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](https://tools.ietf.org/html/rfc6749#section-10.12). The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| resource | recommended |The App ID URI of the target web API (secured resource). To find the App ID URI, in the Azure Portal, click **Azure Active Directory**, click **Application registrations**, open the application's **Settings** page, then click **Properties**. It may also be an external resource like `https://graph.microsoft.com`. This is required in one of either the authorization or token requests. To ensure fewer authentication prompts place it in the authorization request to ensure consent is received from the user. |
| scope | **ignored** | For v1 Azure AD apps, scopes must be statically configured in the Azure Portal under the applications **Settings**, **Required Permissions**. |
| prompt |optional |Indicate the type of user interaction that is required.<p> Valid values are: <p> *login*: The user should be prompted to reauthenticate. <p> *select_account*: The user is prompted to select an account, interrupting single sign on. The user may select an existing signed-in account, enter their credentials for a remembered account, or choose to use a different account altogether. <p> *consent*: User consent has been granted, but needs to be updated. The user should be prompted to consent. <p> *admin_consent*: An administrator should be prompted to consent on behalf of all users in their organization |
| login_hint |optional |Can be used to pre-fill the username/email address field of the sign-in page for the user, if you know their username ahead of time. Often apps use this parameter during reauthentication, having already extracted the username from a previous sign-in using the `preferred_username` claim. |
| domain_hint |optional |Provides a hint about the tenant or domain that the user should use to sign in. The value of the domain_hint is a registered domain for the tenant. If the tenant is federated to an on-premises directory, AAD redirects to the specified tenant federation server. |
| code_challenge_method | recommended    | The method used to encode the `code_verifier` for the `code_challenge` parameter. Can be one of `plain` or `S256`. If excluded, `code_challenge` is assumed to be plaintext if `code_challenge` is included. Azure AAD v1.0 supports both `plain` and `S256`. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). |
| code_challenge        | recommended    | Used to secure authorization code grants via Proof Key for Code Exchange (PKCE) from a native or public client. Required if `code_challenge_method` is included. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). |

> [!NOTE]
> If the user is part of an organization, an administrator of the organization can consent or decline on the user's behalf, or permit the user to consent. The user is given the option to consent only when the administrator permits it.
>
>

At this point, the user is asked to enter their credentials and consent to the permissions requested by the app in the Azure Portal. Once the user authenticates and grants consent, Azure AD sends a response to your app at the `redirect_uri` address in your request with the code.

### Successful response
A successful response could look like this:

```
GET  HTTP/1.1 302 Found
Location: http://localhost:12345/?code= AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrqqf_ZT_p5uEAEJJ_nZ3UmphWygRNy2C3jJ239gV_DBnZ2syeg95Ki-374WHUP-i3yIhv5i-7KU2CEoPXwURQp6IVYMw-DjAOzn7C3JCu5wpngXmbZKtJdWmiBzHpcO2aICJPu1KvJrDLDP20chJBXzVYJtkfjviLNNW7l7Y3ydcHDsBRKZc3GuMQanmcghXPyoDg41g8XbwPudVh7uCmUponBQpIhbuffFP_tbV8SNzsPoFz9CLpBCZagJVXeqWoYMPe2dSsPiLO9Alf_YIe5zpi-zY4C3aLw5g9at35eZTfNd0gBRpR5ojkMIcZZ6IgAA&session_state=7B29111D-C220-4263-99AB-6F6E135D75EF&state=D79E5777-702E-4260-9A62-37F75FF22CCE
```

| Parameter | Description |
| --- | --- |
| admin_consent |The value is True if an administrator consented to a consent request prompt. |
| code |The authorization code that the application requested. The application can use the authorization code to request an access token for the target resource. |
| session_state |A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state |If a state parameter is included in the request, the same value should appear in the response. It's a good practice for the application to verify that the state values in the request and response are identical before using the response. This helps to detect [Cross-Site Request Forgery (CSRF) attacks](https://tools.ietf.org/html/rfc6749#section-10.12) against the client. |

### Error response
Error responses may also be sent to the `redirect_uri` so that the application can handle them appropriately.

```
GET http://localhost:12345/?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| error |An error code value defined in Section 5.2 of the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749). The next table describes the error codes that Azure AD returns. |
| error_description |A more detailed description of the error. This message is not intended to be end-user friendly. |
| state |The state value is a randomly generated non-reused value that is sent in the request and returned in the response to prevent cross-site request forgery (CSRF) attacks. |

#### Error codes for authorization endpoint errors
The following table describes the various error codes that can be returned in the `error` parameter of the error response.

| Error Code | Description | Client Action |
| --- | --- | --- |
| invalid_request |Protocol error, such as a missing required parameter. |Fix and resubmit the request. This is a development error, and is typically caught during initial testing. |
| unauthorized_client |The client application is not permitted to request an authorization code. |This usually occurs when the client application is not registered in Azure AD or is not added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| access_denied |Resource owner denied consent |The client application can notify the user that it cannot proceed unless the user consents. |
| unsupported_response_type |The authorization server does not support the response type in the request. |Fix and resubmit the request. This is a development error, and is typically caught during initial testing. |
| server_error |The server encountered an unexpected error. |Retry the request. These errors can result from temporary conditions. The client application might explain to the user that its response is delayed due to a temporary error. |
| temporarily_unavailable |The server is temporarily too busy to handle the request. |Retry the request. The client application might explain to the user that its response is delayed due to a temporary condition. |
| invalid_resource |The target resource is invalid because it does not exist, Azure AD cannot find it, or it is not correctly configured. |This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |

## Use the authorization code to request an access token
Now that you've acquired an authorization code and have been granted permission by the user, you can redeem the code for an access token to the desired resource, by sending a POST request to the `/token` endpoint:

```
// Line breaks for legibility only

POST /{tenant}/oauth2/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded
grant_type=authorization_code
&client_id=2d4d11a2-f814-46a7-890a-274a72a7309e
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrqqf_ZT_p5uEAEJJ_nZ3UmphWygRNy2C3jJ239gV_DBnZ2syeg95Ki-374WHUP-i3yIhv5i-7KU2CEoPXwURQp6IVYMw-DjAOzn7C3JCu5wpngXmbZKtJdWmiBzHpcO2aICJPu1KvJrDLDP20chJBXzVYJtkfjviLNNW7l7Y3ydcHDsBRKZc3GuMQanmcghXPyoDg41g8XbwPudVh7uCmUponBQpIhbuffFP_tbV8SNzsPoFz9CLpBCZagJVXeqWoYMPe2dSsPiLO9Alf_YIe5zpi-zY4C3aLw5g9at35eZTfNd0gBRpR5ojkMIcZZ6IgAA
&redirect_uri=https%3A%2F%2Flocalhost%3A12345
&resource=https%3A%2F%2Fservice.contoso.com%2F
&client_secret=p@ssw0rd

//NOTE: client_secret only required for web apps
```

| Parameter |  | Description |
| --- | --- | --- |
| tenant |required |The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are tenant identifiers, for example, `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` or `common` for tenant-independent tokens |
| client_id |required |The Application Id assigned to your app when you registered it with Azure AD. You can find this in the Azure portal. The Application Id is displayed in the settings of the app registration. |
| grant_type |required |Must be `authorization_code` for the authorization code flow. |
| code |required |The `authorization_code` that you acquired in the previous section |
| redirect_uri |required | A `redirect_uri`registered on the client application. |
| client_secret |required for web apps, not allowed for public clients |The application secret that you created in the Azure Portal for your app under **Keys**. It cannot be used in a native app (public client), because client_secrets cannot be reliably stored on devices. It is required for web apps and web APIs (all confidential clients), which have the ability to store the `client_secret` securely on the server side. The client_secret should be URL-encoded before being sent. |
| resource | recommended |The App ID URI of the target web API (secured resource). To find the App ID URI, in the Azure Portal, click **Azure Active Directory**, click **Application registrations**, open the application's **Settings** page, then click **Properties**. It may also be an external resource like `https://graph.microsoft.com`. This is required in one of either the authorization or token requests. To ensure fewer authentication prompts place it in the authorization request to ensure consent is received from the user. If in both the authorization request and the token request, the     resource` parameters must match. | 
| code_verifier | optional | The same code_verifier that was used to obtain the authorization_code. Required if PKCE was used in the authorization code grant request. For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636)   |

To find the App ID URI, in the Azure Portal, click **Azure Active Directory**, click **Application registrations**, open the application's **Settings** page, then click **Properties**.

### Successful response
Azure AD returns an [access token](access-tokens.md) upon a successful response. To minimize network calls from the client application and their associated latency, the client application should cache access tokens for the token lifetime that is specified in the OAuth 2.0 response. To determine the token lifetime, use either the `expires_in` or `expires_on` parameter values.

If a web API resource returns an `invalid_token` error code, this might indicate that the resource has determined that the token is expired. If the client and resource clock times are different (known as a "time skew"), the resource might consider the token to be expired before the token is cleared from the client cache. If this occurs, clear the token from the cache, even if it is still within its calculated lifetime.

A successful response could look like this:

```
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1THdqcHdBSk9NOW4tQSJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0MDg2MywibmJmIjoxMzg4NDQwODYzLCJleHAiOjEzODg0NDQ3NjMsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6IjY4Mzg5YWUyLTYyZmEtNGIxOC05MWZlLTUzZGQxMDlkNzRmNSIsInVwbiI6ImZyYW5rbUBjb250b3NvLmNvbSIsInVuaXF1ZV9uYW1lIjoiZnJhbmttQGNvbnRvc28uY29tIiwic3ViIjoiZGVOcUlqOUlPRTlQV0pXYkhzZnRYdDJFYWJQVmwwQ2o4UUFtZWZSTFY5OCIsImZhbWlseV9uYW1lIjoiTWlsbGVyIiwiZ2l2ZW5fbmFtZSI6IkZyYW5rIiwiYXBwaWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJhcHBpZGFjciI6IjAiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhY3IiOiIxIn0.JZw8jC0gptZxVC-7l5sFkdnJgP3_tRjeQEPgUn28XctVe3QqmheLZw7QVZDPCyGycDWBaqy7FLpSekET_BftDkewRhyHk9FW_KeEz0ch2c3i08NGNDbr6XYGVayNuSesYk5Aw_p3ICRlUV1bqEwk-Jkzs9EEkQg4hbefqJS6yS1HoV_2EsEhpd_wCQpxK89WPs3hLYZETRJtG5kvCCEOvSHXmDE6eTHGTnEgsIk--UlPe275Dvou4gEAwLofhLDQbMSjnlV5VLsjimNBVcSRFShoxmQwBJR_b2011Y5IuD6St5zPnzruBbZYkGNurQK63TJPWmRd3mbJsGM0mf3CUQ",
  "token_type": "Bearer",
  "expires_in": "3600",
  "expires_on": "1388444763",
  "resource": "https://service.contoso.com/",
  "refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4rTfgV29ghDOHRc2B-C_hHeJaJICqjZ3mY2b_YNqmf9SoAylD1PycGCB90xzZeEDg6oBzOIPfYsbDWNf621pKo2Q3GGTHYlmNfwoc-OlrxK69hkha2CF12azM_NYhgO668yfcUl4VBbiSHZyd1NVZG5QTIOcbObu3qnLutbpadZGAxqjIbMkQ2bQS09fTrjMBtDE3D6kSMIodpCecoANon9b0LATkpitimVCrl-NyfN3oyG4ZCWu18M9-vEou4Sq-1oMDzExgAf61noxzkNiaTecM-Ve5cq6wHqYQjfV9DOz4lbceuYCAA",
  "scope": "https%3A%2F%2Fgraph.microsoft.com%2Fmail.read",
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83ZmU4MTQ0Ny1kYTU3LTQzODUtYmVjYi02ZGU1N2YyMTQ3N2UvIiwiaWF0IjoxMzg4NDQwODYzLCJuYmYiOjEzODg0NDA4NjMsImV4cCI6MTM4ODQ0NDc2MywidmVyIjoiMS4wIiwidGlkIjoiN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlIiwib2lkIjoiNjgzODlhZTItNjJmYS00YjE4LTkxZmUtNTNkZDEwOWQ3NGY1IiwidXBuIjoiZnJhbmttQGNvbnRvc28uY29tIiwidW5pcXVlX25hbWUiOiJmcmFua21AY29udG9zby5jb20iLCJzdWIiOiJKV3ZZZENXUGhobHBTMVpzZjd5WVV4U2hVd3RVbTV5elBtd18talgzZkhZIiwiZmFtaWx5X25hbWUiOiJNaWxsZXIiLCJnaXZlbl9uYW1lIjoiRnJhbmsifQ."
}

```

| Parameter | Description |
| --- | --- |
| access_token |The requested access token.  This is an opaque string - it depends on what the resource expects to receive, and is not intended for the client to look at. The app can use this token to authenticate to the secured resource, such as a web API. |
| token_type |Indicates the token type value. The only type that Azure AD supports is Bearer. For more information about Bearer tokens, see [OAuth2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt) |
| expires_in |How long the access token is valid (in seconds). |
| expires_on |The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens. |
| resource |The App ID URI of the web API (secured resource). |
| scope |Impersonation permissions granted to the client application. The default permission is `user_impersonation`. The owner of the secured resource can register additional values in Azure AD. |
| refresh_token |An OAuth 2.0 refresh token. The app can use this token to acquire additional access tokens after the current access token expires. Refresh tokens are long-lived, and can be used to retain access to resources for extended periods of time. |
| id_token |An unsigned JSON Web Token (JWT) representing an [ID token](id-tokens.md). The app can base64Url decode the segments of this token to request information about the user who signed in. The app can cache the values and display them, but it should not rely on them for any authorization or security boundaries. |

For more information about JSON web tokens, see the [JWT IETF draft specification](https://go.microsoft.com/fwlink/?LinkId=392344).   To learn more about `id_tokens`, see the [v1.0 OpenID Connect flow](v1-protocols-openid-connect-code.md).

### Error response
The token issuance endpoint errors are HTTP error codes, because the client calls the token issuance endpoint directly. In addition to the HTTP status code, the Azure AD token issuance endpoint also returns a JSON document with objects that describe the error.

A sample error response could look like this:

```
{
  "error": "invalid_grant",
  "error_description": "AADSTS70002: Error validating credentials. AADSTS70008: The provided authorization code or refresh token is expired. Send a new interactive authorization request for this user and resource.\r\nTrace ID: 3939d04c-d7ba-42bf-9cb7-1e5854cdce9e\r\nCorrelation ID: a8125194-2dc8-4078-90ba-7b6592a7f231\r\nTimestamp: 2016-04-11 18:00:12Z",
  "error_codes": [
    70002,
    70008
  ],
  "timestamp": "2016-04-11 18:00:12Z",
  "trace_id": "3939d04c-d7ba-42bf-9cb7-1e5854cdce9e",
  "correlation_id": "a8125194-2dc8-4078-90ba-7b6592a7f231"
}
```
| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |
| error_codes |A list of STS-specific error codes that can help in diagnostics. |
| timestamp |The time at which the error occurred. |
| trace_id |A unique identifier for the request that can help in diagnostics. |
| correlation_id |A unique identifier for the request that can help in diagnostics across components. |

#### HTTP status codes
The following table lists the HTTP status codes that the token issuance endpoint returns. In some cases, the error code is sufficient to describe the response, but if there are errors, you need to parse the accompanying JSON document and examine its error code.

| HTTP Code | Description |
| --- | --- |
| 400 |Default HTTP code. Used in most cases and is typically due to a malformed request. Fix and resubmit the request. |
| 401 |Authentication failed. For example, the request is missing the client_secret parameter. |
| 403 |Authorization failed. For example, the user does not have permission to access the resource. |
| 500 |An internal error has occurred at the service. Retry the request. |

#### Error codes for token endpoint errors
| Error Code | Description | Client Action |
| --- | --- | --- |
| invalid_request |Protocol error, such as a missing required parameter. |Fix and resubmit the request |
| invalid_grant |The authorization code is invalid or has expired. |Try a new request to the `/authorize` endpoint |
| unauthorized_client |The authenticated client is not authorized to use this authorization grant type. |This usually occurs when the client application is not registered in Azure AD or is not added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| invalid_client |Client authentication failed. |The client credentials are not valid. To fix, the application administrator updates the credentials. |
| unsupported_grant_type |The authorization server does not support the authorization grant type. |Change the grant type in the request. This type of error should occur only during development and be detected during initial testing. |
| invalid_resource |The target resource is invalid because it does not exist, Azure AD cannot find it, or it is not correctly configured. |This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| interaction_required |The request requires user interaction. For example, an additional authentication step is required. | Instead of a non-interactive request, retry with an interactive authorization request for the same resource. |
| temporarily_unavailable |The server is temporarily too busy to handle the request. |Retry the request. The client application might explain to the user that its response is delayed due to a temporary condition. |

## Use the access token to access the resource
Now that you've successfully acquired an `access_token`, you can use the token in requests to Web APIs, by including it in the `Authorization` header. The [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750.txt) specification explains how to use bearer tokens in HTTP requests to access protected resources.

### Sample request
```
GET /data HTTP/1.1
Host: service.contoso.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1THdqcHdBSk9NOW4tQSJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0MDg2MywibmJmIjoxMzg4NDQwODYzLCJleHAiOjEzODg0NDQ3NjMsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6IjY4Mzg5YWUyLTYyZmEtNGIxOC05MWZlLTUzZGQxMDlkNzRmNSIsInVwbiI6ImZyYW5rbUBjb250b3NvLmNvbSIsInVuaXF1ZV9uYW1lIjoiZnJhbmttQGNvbnRvc28uY29tIiwic3ViIjoiZGVOcUlqOUlPRTlQV0pXYkhzZnRYdDJFYWJQVmwwQ2o4UUFtZWZSTFY5OCIsImZhbWlseV9uYW1lIjoiTWlsbGVyIiwiZ2l2ZW5fbmFtZSI6IkZyYW5rIiwiYXBwaWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJhcHBpZGFjciI6IjAiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhY3IiOiIxIn0.JZw8jC0gptZxVC-7l5sFkdnJgP3_tRjeQEPgUn28XctVe3QqmheLZw7QVZDPCyGycDWBaqy7FLpSekET_BftDkewRhyHk9FW_KeEz0ch2c3i08NGNDbr6XYGVayNuSesYk5Aw_p3ICRlUV1bqEwk-Jkzs9EEkQg4hbefqJS6yS1HoV_2EsEhpd_wCQpxK89WPs3hLYZETRJtG5kvCCEOvSHXmDE6eTHGTnEgsIk--UlPe275Dvou4gEAwLofhLDQbMSjnlV5VLsjimNBVcSRFShoxmQwBJR_b2011Y5IuD6St5zPnzruBbZYkGNurQK63TJPWmRd3mbJsGM0mf3CUQ
```

### Error Response
Secured resources that implement RFC 6750 issue HTTP status codes. If the request does not include authentication credentials or is missing the token, the response includes an `WWW-Authenticate` header. When a request fails, the resource server responds with the HTTP status code and an error code.

The following is an example of an unsuccessful response when the client request does not include the bearer token:

```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer authorization_uri="https://login.microsoftonline.com/contoso.com/oauth2/authorize",  error="invalid_token",  error_description="The access token is missing.",
```

#### Error parameters
| Parameter | Description |
| --- | --- |
| authorization_uri |The URI (physical endpoint) of the authorization server. This value is also used as a lookup key to get more information about the server from a discovery endpoint. <p><p> The client must validate that the authorization server is trusted. When the resource is protected by Azure AD, it is sufficient to verify that the URL begins with https://login.microsoftonline.com or another hostname that Azure AD supports. A tenant-specific resource should always return a tenant-specific authorization URI. |
| error |An error code value defined in Section 5.2 of the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749). |
| error_description |A more detailed description of the error. This message is not intended to be end-user friendly. |
| resource_id |Returns the unique identifier of the resource. The client application can use this identifier as the value of the `resource` parameter when it requests a token for the resource. <p><p> It is important for the client application to verify this value, otherwise a malicious service might be able to induce an **elevation-of-privileges** attack <p><p> The recommended strategy for preventing an attack is to verify that the `resource_id` matches the base of the web API URL that being accessed. For example, if https://service.contoso.com/data is being accessed, the `resource_id` can be https://service.contoso.com/. The client application must reject a `resource_id` that does not begin with the base URL unless there is a reliable alternate way to verify the id. |

#### Bearer scheme error codes
The RFC 6750 specification defines the following errors for resources that use the WWW-Authenticate header and Bearer scheme in the response.

| HTTP Status Code | Error Code | Description | Client Action |
| --- | --- | --- | --- |
| 400 |invalid_request |The request is not well-formed. For example, it might be missing a parameter or using the same parameter twice. |Fix the error and retry the request. This type of error should occur only during development and be detected in initial testing. |
| 401 |invalid_token |The access token is missing, invalid, or is revoked. The value of the error_description parameter provides additional detail. |Request a new token from the authorization server. If the new token fails, an unexpected error has occurred. Send an error message to the user and retry after random delays. |
| 403 |insufficient_scope |The access token does not contain the impersonation permissions required to access the resource. |Send a new authorization request to the authorization endpoint. If the response contains the scope parameter, use the scope value in the request to the resource. |
| 403 |insufficient_access |The subject of the token does not have the permissions that are required to access the resource. |Prompt the user to use a different account or to request permissions to the specified resource. |

## Refreshing the access tokens

Access Tokens are short-lived and must be refreshed after they expire to continue accessing resources. You can refresh the `access_token` by submitting another `POST` request to the `/token` endpoint, but this time providing the `refresh_token` instead of the `code`.  Refresh tokens are valid for all resources that your client has already been given consent to access - thus, a refresh token issued on a request for `resource=https://graph.microsoft.com` can be used to request a new access token for `resource=https://contoso.com/api`. 

Refresh tokens do not have specified lifetimes. Typically, the lifetimes of refresh tokens are relatively long. However, in some cases, refresh tokens expire, are revoked, or lack sufficient privileges for the desired action. Your application needs to expect and handle errors returned by the token issuance endpoint correctly.

When you receive a response with a refresh token error, discard the current refresh token and request a new authorization code or access token. In particular, when using a refresh token in the Authorization Code Grant flow, if you receive a response with the `interaction_required` or `invalid_grant` error codes, discard the refresh token and request a new authorization code.

A sample request to the **tenant-specific** endpoint (you can also use the **common** endpoint) to get a new access token using a refresh token looks like this:

```
// Line breaks for legibility only

POST /{tenant}/oauth2/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&refresh_token=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq...
&grant_type=refresh_token
&resource=https%3A%2F%2Fservice.contoso.com%2F
&client_secret=JqQX2PNo9bpM0uEihUPzyrh    // NOTE: Only required for web apps
```

### Successful response
A successful token response will look like:

```
{
  "token_type": "Bearer",
  "expires_in": "3600",
  "expires_on": "1460404526",
  "resource": "https://service.contoso.com/",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1THdqcHdBSk9NOW4tQSJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0MDg2MywibmJmIjoxMzg4NDQwODYzLCJleHAiOjEzODg0NDQ3NjMsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6IjY4Mzg5YWUyLTYyZmEtNGIxOC05MWZlLTUzZGQxMDlkNzRmNSIsInVwbiI6ImZyYW5rbUBjb250b3NvLmNvbSIsInVuaXF1ZV9uYW1lIjoiZnJhbmttQGNvbnRvc28uY29tIiwic3ViIjoiZGVOcUlqOUlPRTlQV0pXYkhzZnRYdDJFYWJQVmwwQ2o4UUFtZWZSTFY5OCIsImZhbWlseV9uYW1lIjoiTWlsbGVyIiwiZ2l2ZW5fbmFtZSI6IkZyYW5rIiwiYXBwaWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJhcHBpZGFjciI6IjAiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhY3IiOiIxIn0.JZw8jC0gptZxVC-7l5sFkdnJgP3_tRjeQEPgUn28XctVe3QqmheLZw7QVZDPCyGycDWBaqy7FLpSekET_BftDkewRhyHk9FW_KeEz0ch2c3i08NGNDbr6XYGVayNuSesYk5Aw_p3ICRlUV1bqEwk-Jkzs9EEkQg4hbefqJS6yS1HoV_2EsEhpd_wCQpxK89WPs3hLYZETRJtG5kvCCEOvSHXmDE6eTHGTnEgsIk--UlPe275Dvou4gEAwLofhLDQbMSjnlV5VLsjimNBVcSRFShoxmQwBJR_b2011Y5IuD6St5zPnzruBbZYkGNurQK63TJPWmRd3mbJsGM0mf3CUQ",
  "refresh_token": "AwABAAAAv YNqmf9SoAylD1PycGCB90xzZeEDg6oBzOIPfYsbDWNf621pKo2Q3GGTHYlmNfwoc-OlrxK69hkha2CF12azM_NYhgO668yfcUl4VBbiSHZyd1NVZG5QTIOcbObu3qnLutbpadZGAxqjIbMkQ2bQS09fTrjMBtDE3D6kSMIodpCecoANon9b0LATkpitimVCrl PM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4rTfgV29ghDOHRc2B-C_hHeJaJICqjZ3mY2b_YNqmf9SoAylD1PycGCB90xzZeEDg6oBzOIPfYsbDWNf621pKo2Q3GGTHYlmNfwoc-OlrxK69hkha2CF12azM_NYhgO668yfmVCrl-NyfN3oyG4ZCWu18M9-vEou4Sq-1oMDzExgAf61noxzkNiaTecM-Ve5cq6wHqYQjfV9DOz4lbceuYCAA"
}
```
| Parameter | Description |
| --- | --- |
| token_type |The token type. The only supported value is **bearer**. |
| expires_in |The remaining lifetime of the token in seconds. A typical value is 3600 (one hour). |
| expires_on |The date and time on which the token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. |
| resource |Identifies the secured resource that the access token can be used to access. |
| scope |Impersonation permissions granted to the native client application. The default permission is **user_impersonation**. The owner of the target resource can register alternate values in Azure AD. |
| access_token |The new access token that was requested. |
| refresh_token |A new OAuth 2.0 refresh_token that can be used to request new access tokens when the one in this response expires. |

### Error response
A sample error response could look like this:

```
{
  "error": "invalid_resource",
  "error_description": "AADSTS50001: The application named https://foo.microsoft.com/mail.read was not found in the tenant named 295e01fc-0c56-4ac3-ac57-5d0ed568f872. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You might have sent your authentication request to the wrong tenant.\r\nTrace ID: ef1f89f6-a14f-49de-9868-61bd4072f0a9\r\nCorrelation ID: b6908274-2c58-4e91-aea9-1f6b9c99347c\r\nTimestamp: 2016-04-11 18:59:01Z",
  "error_codes": [
    50001
  ],
  "timestamp": "2016-04-11 18:59:01Z",
  "trace_id": "ef1f89f6-a14f-49de-9868-61bd4072f0a9",
  "correlation_id": "b6908274-2c58-4e91-aea9-1f6b9c99347c"
}
```

| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |
| error_codes |A list of STS-specific error codes that can help in diagnostics. |
| timestamp |The time at which the error occurred. |
| trace_id |A unique identifier for the request that can help in diagnostics. |
| correlation_id |A unique identifier for the request that can help in diagnostics across components. |

For a description of the error codes and the recommended client action, see [Error codes for token endpoint errors](#error-codes-for-token-endpoint-errors).

## Next steps
To learn more about the Azure AD v1.0 endpoint and how to add authentication and authorization to your web applications and web APIs, see [sample applications](sample-v1-code.md).
