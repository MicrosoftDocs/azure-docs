<properties
	pageTitle="Azure AD .NET Protocol Overview | Microsoft Azure"
	description="How to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure AD."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>

# Azure AD Protocols Reference

[AZURE.INCLUDE [active-directory-devguide](../../includes/active-directory-devguide.md)]


## Request to Authorize Endpoint

```
// This is the first step in the authorization workflow
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&state=12345
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------- |
| tenant | required | The `{tenant}` value in the path of the request can be used to control who can sign into the application.  The allowed values are tenant identifiers, e.g. `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` or `common` for tenant-independent tokens |
| client_id | required | The Application Id assigned to your app when you registered it with AAD. You can find this in the Azure Management Portal. Click on **Active Directory**, click the directory, click on the application and then click on **Configure** |
| response_type | required | Must include `code` for the authorization code flow. |
| redirect_uri | recommended | The redirect_uri of your app, where authentication responses can be sent and received by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded.  For native & mobile apps, you should use the default value of `urn:ietf:wg:oauth:2.0:oob`. |
| scope | required | A space-separated list of [scopes](active-directory-v2-scopes.md) that you want the user to consent to.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting token back to your app.  Can be `query` or `form_post`.  |
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](http://tools.ietf.org/html/rfc6749#section-10.12).  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid values at this time are 'login', 'none', and 'consent'.  `prompt=login` will force the user to enter their credentials on that request, negating single-sign on.  `prompt=none` is the opposite - it will ensure that the user is not presented with any interactive prompt whatsoever.  If the request cannot be completed silently via single-sign on, the v2.0 endpoint will return an error.  `prompt=consent` will trigger the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app. |
| login_hint | optional | Can be used to pre-fill the username/email address field of the sign in page for the user, if you know their username ahead of time.  Often apps will use this parameter during re-authentication, having already extracted the username from a previous sign-in using the `preferred_username` claim. |
| domain_hint | optional | Can be one of `consumers` or `organizations`.  If included, it will skip the email-based discovery process that user goes through on the v2.0 sign in page, leading to a slightly more streamlined user experience.  Often apps will use this parameter during re-authentication, by extracting the `tid` from a previous sign-in.  If the `tid` claim value is `9188040d-6c67-4c5b-b112-36a304b66dad`, you should use `domain_hint=consumers`.  Otherwise, use `domain_hint=organizations`. |

## Authorization Code Response

A sample response to the authorization request could look like this:

```
http://localhost:12345/?code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrqqf_ZT_p5uEAEJJ_nZ3UmphWygRNy2C3jJ239gV_DBnZ2syeg95Ki-374WHUP-i3yIhv5i-7KU2CEoPXwURQp6IVYMw-DjAOzn7C3JCu5wpngXmbZKtJdWmiBzHpcO2aICJPu1KvJrDLDP20chJBXzVYJtkfjviLNNW7l7Y3ydcHDsBRKZc3GuMQanmcghXPyoDg41g8XbwPudVh7uCmUponBQpIhbuffFP_tbV8SNzsPoFz9CLpBCZagJVXeqWoYMPe2dSsPiLO9Alf_YIe5zpi-zY4C3aLw5g9at35eZTfNd0gBRpR5ojkMIcZZ6IgAA&state=12345&session_state=733ad279-b681-49c3-9215-951abf94d2c5
```

| Parameter | Description |
| -----------------------| --------------- |
| admin_consent | The value is True if an administrator consented to a consent request prompt.|
| code | The authorization code that the application requested. The application can use the authorization code to request an access token for the target resource. |
| session_state | A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state | If a state parameter is included in the request, the same value should appear in the response. The application should verify that the state values in the request and response are identical. |


## Using the Authorization Code to Request an Access Token

### Sample Request

```
// This uses the code from the previous section to request a token
// Line breaks for legibility only

POST /{tenant}/oauth2/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&code=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&grant_type=authorization_code
&client_secret=JqQX2PNo9bpM0uEihUPzyrh    // NOTE: Only required for web apps
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------------- |
| tenant | required |  The `{tenant}` value in the path of the request can be used to control who can sign into the application.  The allowed values are tenant identifiers, e.g. `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` or `common` for tenant-independent tokens |
| client_id | required | The Application Id assigned to your app when you registered it with AAD. You can find this in the Azure Management Portal. Click on **Active Directory**, click the directory, click on the application and then click on **Configure** |
| grant_type | required | Must be `authorization_code` for the authorization code flow. |
| code | required | The authorization_code that you acquired in the previous section   |
| redirect_uri | required | The same redirect_uri value that was used to acquire the authorization_code. |
| client_secret | required for web apps | The application secret that you created in the app registration portal for your app.  It should not be used in a native app, because client_secrets cannot be reliably stored on devices.  It is required for web apps and web APIs, which have the ability to store the client_secret securely on the server side. |

### Sample Response

A sample response to a token request could look like this:

```
{
  "access_token": " eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1THdqcHdBSk9NOW4tQSJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0MDg2MywibmJmIjoxMzg4NDQwODYzLCJleHAiOjEzODg0NDQ3NjMsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6IjY4Mzg5YWUyLTYyZmEtNGIxOC05MWZlLTUzZGQxMDlkNzRmNSIsInVwbiI6ImZyYW5rbUBjb250b3NvLmNvbSIsInVuaXF1ZV9uYW1lIjoiZnJhbmttQGNvbnRvc28uY29tIiwic3ViIjoiZGVOcUlqOUlPRTlQV0pXYkhzZnRYdDJFYWJQVmwwQ2o4UUFtZWZSTFY5OCIsImZhbWlseV9uYW1lIjoiTWlsbGVyIiwiZ2l2ZW5fbmFtZSI6IkZyYW5rIiwiYXBwaWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJhcHBpZGFjciI6IjAiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhY3IiOiIxIn0.JZw8jC0gptZxVC-7l5sFkdnJgP3_tRjeQEPgUn28XctVe3QqmheLZw7QVZDPCyGycDWBaqy7FLpSekET_BftDkewRhyHk9FW_KeEz0ch2c3i08NGNDbr6XYGVayNuSesYk5Aw_p3ICRlUV1bqEwk-Jkzs9EEkQg4hbefqJS6yS1HoV_2EsEhpd_wCQpxK89WPs3hLYZETRJtG5kvCCEOvSHXmDE6eTHGTnEgsIk--UlPe275Dvou4gEAwLofhLDQbMSjnlV5VLsjimNBVcSRFShoxmQwBJR_b2011Y5IuD6St5zPnzruBbZYkGNurQK63TJPWmRd3mbJsGM0mf3CUQ",
  "token_type": "Bearer",
  "expires_in": "3600",
  "expires_on": "1388444763",
  "resource": "https://service.contoso.com/",
  "refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4rTfgV29ghDOHRc2B-C_hHeJaJICqjZ3mY2b_YNqmf9SoAylD1PycGCB90xzZeEDg6oBzOIPfYsbDWNf621pKo2Q3GGTHYlmNfwoc-OlrxK69hkha2CF12azM_NYhgO668yfcUl4VBbiSHZyd1NVZG5QTIOcbObu3qnLutbpadZGAxqjIbMkQ2bQS09fTrjMBtDE3D6kSMIodpCecoANon9b0LATkpitimVCrl-NyfN3oyG4ZCWu18M9-vEou4Sq-1oMDzExgAf61noxzkNiaTecM-Ve5cq6wHqYQjfV9DOz4lbceuYCAA",
  "scope": "https%3A%2F%2Fgraph.microsoft.com%2Fmail.read",
"id_token": " eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83ZmU4MTQ0Ny1kYTU3LTQzODUtYmVjYi02ZGU1N2YyMTQ3N2UvIiwiaWF0IjoxMzg4NDQwODYzLCJuYmYiOjEzODg0NDA4NjMsImV4cCI6MTM4ODQ0NDc2MywidmVyIjoiMS4wIiwidGlkIjoiN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlIiwib2lkIjoiNjgzODlhZTItNjJmYS00YjE4LTkxZmUtNTNkZDEwOWQ3NGY1IiwidXBuIjoiZnJhbmttQGNvbnRvc28uY29tIiwidW5pcXVlX25hbWUiOiJmcmFua21AY29udG9zby5jb20iLCJzdWIiOiJKV3ZZZENXUGhobHBTMVpzZjd5WVV4U2hVd3RVbTV5elBtd18talgzZkhZIiwiZmFtaWx5X25hbWUiOiJNaWxsZXIiLCJnaXZlbl9uYW1lIjoiRnJhbmsifQ.”
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer. For more information about Bearer tokens, see [OAuth2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](http://www.rfc-editor.org/rfc/rfc6750.txt)  |
| expires_in | How long the access token is valid (in seconds). |
| scope | Impersonation permissions granted to the client application. The default permission is `user_impersonation`. The owner of the secured resource can register additional values in Azure AD.|
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token to acquire additional access tokens after the current access token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time. |
| id_token | An unsigned JSON Web Token (JWT). The  app can base64Url decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries. |

### JWT Token Claims
The JWT token in the value of the `id_token` parameter can be decoded into the following claims:

```
{
 "typ": "JWT",
 "alg": "none"
}.
{
 "aud": "2d4d11a2-f814-46a7-890a-274a72a7309e",
 "iss": "https://sts.windows.net/7fe81447-da57-4385-becb-6de57f21477e/",
 "iat": 1388440863,
 "nbf": 1388440863,
 "exp": 1388444763,
 "ver": "1.0",
 "tid": "7fe81447-da57-4385-becb-6de57f21477e",
 "oid": "68389ae2-62fa-4b18-91fe-53dd109d74f5",
 "upn": "frank@contoso.com",
 "unique_name": "frank@contoso.com",
 "sub": "JWvYdCWPhhlpS1Zsf7yYUxShUwtUm5yzPmw_-jX3fHY",
 "family_name": "Miller",
 "given_name": "Frank"
}.
```

The `id_token` parameter includes the following claim types. For more information about JSON web tokens, please see the [JWT IETF draft specification](http://go.microsoft.com/fwlink/?LinkId=392344). For more information about the token types and claims, please read [Supported Token and Claim Types](active-directory-token-and-claims)

| Claim type | Description |
|------------|-------------|
| aud | Audience of the token. When the token is issued to a client application, the audience is the `client_id` of the client.
| exp | Expiration time. The time when the token expires. For the token to be valid, the current date/time must be less than or equal to the `exp` value. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token was issued. |
| family_name | User’s last name or surname. The application can display this value. |
| given_name | User’s first name. The application can display this value. |
| iat | Issued at time. The time when the JWT was issued. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token was issued. |
| iss | Identifies the token issuer |
| nbf | Not before time. The time when the token becomes effective. For the token to be valid, the current date/time must be greater than or equal to the Nbf value. The time is represented as the number of seconds from January 1, 1970 (1970-01-01T0:0:0Z) UTC until the time the token was issued. |
| oid | Object identifier (ID) of the user object in Azure AD. |
| sub | Token subject identifier. This is a persistent and immutable identifier for the user that the token describes. Use this value in caching logic. |
| tid | Tenant identifier (ID) of the Azure AD tenant that issued the token. |
| unique_name | A unique identifier for that can be displayed to the user. This is usually a user principal name (UPN). |
| upn | User principal name of the user. |
| ver | Version. The version of the JWT token, typically 1.0. |

### Error Response

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
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |
| error_codes | A list of STS specific error codes that can help in diagnostics. |
| timestamp | The time at which the error occurred. |
| trace_id | A unique identifier for the request that can help in diagnostics.  |
| correlation_id | A unique identifier for the request that can help in diagnostics across components.|

## Use the Access Token to Access the Resource

### Sample Request

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

| Parameter | Description |
|-----------|-------------|
| access_token | The new access token that was requested.|
| expires_in   | The remaining lifetime of the token in seconds. A typical value is 3600 (one hour). |
| expires_on   | The date and time on which the token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. |
| refresh_token | A new OAuth 2.0 refresh_token that can be used to request new access tokens when the one in this response expires. |
| resource     | Identifies the secured resource that the access token can be used to access. |
| scope        | Impersonation permissions granted to the native client application. The default permission is **user_impersonation**. The owner of the target resource can register alternate values in Azure AD. |
| token_type   | The token type. The only supported value is **bearer**. |
