
<properties
	pageTitle="App Model v2.0 OAuth Protocol | Microsoft Azure"
	description="Building web applications using Azure AD's implementation of the OAuth 2.0 authentication protocol."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/19/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Protocols - OAuth 2.0 Authorization Code Flow

The OAuth 2.0 authorization code grant can be used in apps that are installed on a device to gain access to protected resources, such as web APIs.  Using the app model v2.0's implementation of OAuth 2.0, you can add sign in and API access to your mobile and desktop apps.  This guide is language-independent, and describes how to send and receive HTTP messages without using any of our open-source libraries.

<!-- TODO: Need link to libraries -->	

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

The OAuth 2.0 authorization code flow is described in in [section 4.1 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749).  It is used to perform authentication and authorization in the majority of app types, including [web apps](active-directory-v2-flows.md#web-apps) and [natively installed  apps](active-directory-v2-flows.md#mobile-and-native-apps).  It enables apps to securely acquire access_tokens which can be used to access resources that are secured using the v2.0 app model.  



## Request an Authorization Code
The authorization code flow begins with the client directing the user to the `/authorize` endpoint.  In this request, the client indicates the permissions it needs to acquire from the user:

```
// Line breaks for legibility only

GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e		  // Your registered Application Id
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob 	  // Your registered Redirect Uri, url encoded
&response_mode=query							        // 'query', 'form_post', or 'fragment'
&scope=											     // See table below
openid%20
offline_access%20
https%3A%2F%2Fgraph.windows.net%2Fdirectory.read%20
https%3A%2F%2Fgraph.windows.net%2Fdirectory.write
&state=12345						 				   // Any value provided by your app
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| response_type | required | Must include `code` for the authorization code flow. |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and receieved by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to the v2.0 endpoint both the resource and the permissions to that resource being requested.  Scopes take the form `<app identifier URI>/<scope value>`.  In the example above, the app identifier for the Azure AD Graph API is used, `https://graph.windows.net`, and two permissions are requested: `directory.read` and `directory.write`.  For a more detailed explanation of scopes, refer to the [app model v2.0 scope reference](active-directory-v2-scopes.md).  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'.
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid values at this time are 'login', 'none', and 'consent'.  `prompt=login` will force the user to enter their credentials on that request, negating single-sign on.  `prompt=none` is the opposite - it will ensure that the user is not presented with any interactive prompt whatsoever.  If the request cannot be completed silently via single-sign on, the v2.0 endpoint will return an error.  `prompt=consent` will trigger the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app. |
| login_hint | optional | Can be used to pre-fill the username/email address field of the sign in page for the user. |

At this point, the user will be asked to enter their credentials and complete the authentication.  The v2.0 endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter.  If the user has not consented to any of those permissions, it will ask the user to consent to the required permissions.  Details of [permissions, consent, and multi-tenant apps are provided here](active-directory-v2-scopes.md).

Once the user authenticates and grants consent, the v2.0 endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

A successful response using `response_mode=query` looks like:

```
GET urn:ietf:wg:oauth:2.0:oob?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq... 	// the authorization_code, truncated
&session_state=7B29111D-C220-4263-99AB-6F6E135D75EF			   // a value generated by the v2.0 endpoint
&state=12345												      // the value provided in the request
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| code | The authorization_code that the  app requested. The  app can use the authorization code to request an access token for the target resource.  Authorization_codes are very short lived, typically they expire after about 10 minutes. |
| session_state | A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET urn:ietf:wg:oauth:2.0:oob?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

## Request an Access Token
Now that you've acquired an authorization_code and have been granted permission by the user, you can redeem the `code` for an `access_token` to the desired resource, by sending a `POST` request to the `/token` endpoint:

```
POST common/v2.0/oauth2/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
	"grant_type": "authorization_code",
	"client_id": "2d4d11a2-f814-46a7-890a-274a72a7309e",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"code": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq..."
	"client_secret": "zc53fwe80980293klaj9823"  // NOTE: Only required for web apps
}
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| grant_type | required | Must be `authorization_code` for the authorization code flow. |
| scope | required | A space-separated list of scopes.  The scopes requested in this leg must be equivalent to or a subset of the scopes requested in the first leg.  If the scopes specified in this request span multiple resource servers, then the v2.0 endpoint will return a token for the resource specified in the first scope.  For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](active-directory-v2-scopes.md).  |
| code | required | The authorization_code that you acquired in the first leg of the flow.   |
| client_secret | required for web apps | The application secret that you created in the app registration portal for your app.  It should not be used in a native  app, because client_secrets cannot be reliably stored on devices.  It is required for web apps and web APIs, which have the ability to store the client_secret securely on the server side. |

A successful token response will look like:

```
{
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"token_type": "Bearer",
	"expires_in": "3600",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD...",
	"id_token_expires_in": "3599"
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer  |
| expires_in | How long the access token is valid (in seconds). |
| scope | The scopes that the access_token is valid for. |
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token acquire additional access tokens after the current access token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time.  For more detail, refer to the [v2.0 token reference](active-directory-v2-tokens.md).  |
| id_token | An unsigned JSON Web Token (JWT). The  app can base64Url decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries.  For more information about id_tokens see the [v2.0 app model token reference](active-directory-v2-tokens.md). |
| id_token_expires_in | How long the id token is valid (in seconds). |


Error responses will look like:

```
{
	"error": "access_denied",
	"error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

## Use the Access Token
Now that you've successfully acquired an `access_token`, you can use the token in requests to Web APIs by including it in the `Authorization` header:

```
GET /contoso.onmicrosoft.com/users
Host: https://graph.windows.net
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the Access Token
Access_tokens are short lived, and you must refresh them after they expire to continue accessing resources.  You can do so by submitting another `POST` request to the `/token` endpoint, this time providing the `refresh_token` instead of the `code`:

```
POST common/v2.0/oauth2/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
	"grant_type": "refresh_token",
	"client_id": "2d4d11a2-f814-46a7-890a-274a72a7309e",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...",
	"client_secret": "zc53fwe80980293klaj9823"  // NOTE: Only required for web apps
}
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | -------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| grant_type | required | Must be `refresh_token` for this leg of the authorization code flow. |
| scope | required | A space-separated list of scopes.  The scopes requested in this leg must be equivalent to or a subset of the scopes requested in the original authorization_code request leg.  If the scopes specified in this request span multiple resource servers, then the v2.0 endpoint will return a token for the resource specified in the first scope.  For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](active-directory-v2-scopes.md).  |
| refresh_token | required | The refresh_token that you acquired in the second leg of the flow.   |
| client_secret | required for web apps | The application secret that you created in the app registration portal for your app.  It should not be used in a native  app, because client_secrets cannot be reliably stored on devices.  It is required for web apps and web APIs, which have the ability to store the client_secret securely on the server side. |

A successful token response will look like:

```
{
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"token_type": "Bearer",
	"expires_in": "3600",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD...",
	"id_token_expires_in": "3599"
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer  |
| expires_in | How long the access token is valid (in seconds). |
| scope | The scopes that the access_token is valid for. |
| refresh_token |  A new OAuth 2.0 refresh token. You should replace the old refresh token with this newly acquired refresh token to ensure your refresh tokens remain valid for as long as possible.  |
| id_token | An unsigned JSON Web Token (JWT). The  app can base64Url decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries.  For more information about id_tokens see the [v2.0 app model token reference](active-directory-v2-tokens.md). |
| id_token_expires_in | How long the id token is valid (in seconds). |

Error responses will look like:

```
{
	"error": "access_denied",
	"error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

## Summary
At a high level, the entire authentication flow for a native/mobile application looks a bit like this:

![OAuth Auth Code Flow](../media/active-directory-v2-flows/convergence_scenarios_native.png)