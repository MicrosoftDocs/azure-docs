<properties
	pageTitle="App Model v2.0 Protocols | Microsoft Azure"
	description="The protocols supported by the Azure AD v2.0 app model public preview."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/12/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Protocols - OAuth 2.0 & OpenID Connect

The v2.0 app model provides identity-as-a-service for your apps by supporting industry standard protocols, OpenID Connect and OAuth 2.0.  While the service is standard compliant, there can be subtle differences between any two implementations of these protocols.  The information here will be useful if you choose to write your code by directly sending & handling HTTP requests, rather than using one of our open source libraries.
<!-- TODO: Need link to libraries above -->

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Tokens
The v2.0 app model's implementation of OAuth 2.0 and OpenID Connect make extensive use of bearer tokens, including bearer tokens represented as JWTs. A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your  app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Further details of different types of tokens used in the v2.0 app model is available in [the v2.0 app model token reference](active-directory-v2-tokens.md).

## The Basics
Every app that uses the v2.0 app model will need to be registered at [apps.dev.microsoft.com](https://apps.dev.microsoft.com).  The app registration process will collect & assign a few values to your app:

- An **Application Id** that uniquely identifies your app
- A **Redirect URI** or **Package Identifier** that can be used to direct responses back to your app
- A few other scenario-specific values.  For more detail, learn how to [register an app](active-directory-v2-app-registration.md).

Once registered, the  app communicates with Azure AD my sending requests to the v2.0 endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

In nearly all OAuth & OpenID Connect flows, there are four parties involved in the exchange:

![OAuth 2.0 Roles](../media/active-directory-v2-flows/protocols_roles.png)

- The **Authorization Server** is the v2.0 Endpoint.  It is responsible for ensuring the user's identity, granting and revoking access to resources, and issuing tokens.  It is also known as the identity provider - it securely handles anything to do with the user's information, their access, and the trust relationships between parties in an flow.
- The **Resource Owner** is typically the end-user.  It is the party that owns the data, and has the power to allow third parties to access that data, or resource.
- The **OAuth Client** is your app, identified by its Application Id.  It is usually the party that the end-user interacts with, and it requests tokens from the authorization server.  The client must be granted permission to access the resource by the resource owner.
- The **Resource Server** is where the resource or data resides.  It trusts the Authorization Server to securely authenticate and authorize the OAuth Client, and uses Bearer access_tokens to ensure that access to a resource can be granted.

## OAuth2 Authorization Code Flow
The OAuth 2.0 authorization code flow is described in in [section 4.1 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749).  It is used to perform authentication and authorization in the majority of  app types, including [web apps](active-directory-v2-flows.md#web-apps) and [natively installed  apps](active-directory-v2-flows.md#mobile-and-native-apps).  It enables apps to securely acquire access_tokens which can be used to access resources that are secured using the v2.0 app model.  

Here is the entire flow for a native  app; each request is detailed in the sections below:
![OAuth Auth Code Flow](../media/active-directory-v2-flows/convergence_scenarios_native.png)

#### Request an Authorization Code
The authorization code flow begins with the client directing the user to the `/authorize` endpoint.  In this request, the client indicates the permissions it needs to acquire from the user:

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e		// Your registered Application Id
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F 	  // Your registered Redirect Uri, url encoded
&response_mode=query							      // 'query', 'form_post', or 'fragment'
&scope=											   // See table below for scope parameter details.
https%3A%2F%2Fgraph.windows.net%2Fdirectory.read%20
https%3A%2F%2Fgraph.windows.net%2Fdirectory.write
&state=12345						 				 // Any value provided by your app
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| response_type | required | Must include `code` for the authorization code flow. |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and receieved by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to the v2.0 endpoint both the resource and the permissions to that resource being requested.  Scopes take the form `<app identifier URI>/<scope value>`.  In the example above, the app identifier for the Azure AD Graph API is used, `https://graph.windows.net`, and two permissions are requested: `directory.read` and `directory.write`.  For a more detailed explanation of scopes, refer to c.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'.
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid value at this time is 'login', which forces the user to enter their credentials on that request.  Single-sign on will not take effect. |

At this point, the user will be asked to enter their credentials and complete the authentication.  The v2.0 endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter.  If the user has not consented to any of those permissions, it will ask the user to consent to the required permissions.  Details of [permissions, consent, and multi-tenant apps are provided here](active-directory-v2-scopes.md).

Once the user authenticates and grants consent, the v2.0 endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

A successful response using `response_mode=query` looks like:

```
GET https://localhost/myapp/?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq... 	// the authorization_code, truncated
&session_state=7B29111D-C220-4263-99AB-6F6E135D75EF			   // a value generated by the v2.0 endpoint
&state=12345												  							// the value provided in the request
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| code | The authorization_code that the  app requested. The  app can use the authorization code to request an access token for the target resource.  Authorization_codes are very short lived, typically they expire after about 10 minutes. |
| session_state | A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET https://localhost/myapp/?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

#### Request an Access Token
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
	"expires_on": "1388444763",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD..."
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer  |
| expires_in | How long the access token is valid (in seconds). |
| expires_on | The time when the access token expires. The date is represented as the number of seconds from the epoch time. |
| scope | The scopes that the access_token is valid for. |
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token acquire additional access tokens after the current access token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time.  For more detail, refer to the [v2.0 token reference](active-directory-v2-tokens.md).  |
| id_token | An unsigned JSON Web Token (JWT). The  app can base64Url decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries.  For more information about id_tokens see the [v2.0 app model token reference](active-directory-v2-tokens.md). |

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

#### Use the Access Token
Now that you've successfully acquired an `access_token`, you can use the token in reqeusts to Web APIs by including it in the `Authorization` header:

```
GET /contoso.onmicrosoft.com/users
Host: https://graph.windows.net
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

#### Refresh the Access Token
Access_tokens are short lived, and you must refresh them after they expire to continue accessing resources.  You can do so by submitting another `POST` request to the `/authorize` endpoint, this time providing the `refresh_token` instead of the `code`:

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
	"expires_on": "1388444763",
	"scope": "https://graph.windows.net/directory.read https://graph.windows.net/directory.write",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGAMxZGUTdM0t4B4...",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctOD..."
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer  |
| expires_in | How long the access token is valid (in seconds). |
| expires_on | The time when the access token expires. The date is represented as the number of seconds from the epoch time. |
| scope | The scopes that the access_token is valid for. |
| refresh_token |  A new OAuth 2.0 refresh token. You should replace the old refresh token with this newly acquired refresh token to ensure your refresh tokens remain valid for as long as possible.  |
| id_token | An unsigned JSON Web Token (JWT). The  app can base64Url decode the segements of this token to request information about the user who signed in. The  app can cache the values and display them, but it should not rely on them for any authorization or security boundaries.  For more information about id_tokens see the [v2.0 app model token reference](active-directory-v2-tokens.md). |

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






## OpenID Connect Sign-In Flow
[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) extends the OAuth 2.0 *authorization* protocol for use as an *authentication* protocol, which allows you to perform single sign-on using OAuth.  It introduces the concept of an `id_token`, which is a security token that allows the client to verify the identity of the user and obtain basic profile information about the user.

OpenID Connect for the v2.0 app model is the recommended way to implement sign-in for a [web  app](active-directory-v2-flows.md#web-apps).  The most basic sign-in flow contains the following steps:

![OpenId Connect Swimlanes](../media/active-directory-v2-flows/convergence_scenarios_webapp.png)

#### Send the Sign-In Request
When your web  app needs to authenticate the user, it can direct the user to the `/authorize` endpoint.  This request is similar to the first leg of the [OAuth 2.0 Authorization Code Flow](#oauth2-authorization-code-flow), with a few important distinctions:
- The request must include the scope `openid` in the `scope` parameter.
- The `response_type` parameter must include `id_token`
- The request must include the `nonce` parameter

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e		// Your registered Application Id
&response_type=id_token
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F 	  // Your registered Redirect Uri, url encoded
&response_mode=query							      // 'query', 'form_post', or 'fragment'
&scope=openid										 // Translates to the 'Read your profile' permission
&state=12345						 				 // Any value, provided by your app
&nonce=678910										 // Any value, provided by your app
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| response_type | required | Must include `id_token` for OpenID Connect sign-in.  It may also include other response_types, as described in the [OpenID Connect with OAuth Code Flow ](#OpenID-Connect-with-OAuth-Code-Flow) section. |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and received by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  For OpenID Connect, it must include the scope `openid`, which translates to the "Sign in & Read Your Profile" permission in the consent UI.  You may also include other scopes in this request for requesting consent, as described in the [OpenID Connect with OAuth Code Flow ](#OpenID-Connect-with-OAuth-Code-Flow) section.  |
| nonce | required | A value included in the request, generated by the app, that will included in the resulting id_token as a claim.  The app can then verify this value to mitigate token replay attacks.  The value is typically a randomized, unique string that can be used to identify the origin of the request.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'.  
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid value at this time is 'login', which forces the user to enter their credentials on that request.  Single-sign on will not take effect. |

At this point, the user will be asked to enter their credentials and complete the authentication.  The v2.0 endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter.  If the user has not consented to any of those permissions, it will ask the user to consent to the required permissions.  Details of [permissions, consent, and multi-tenant apps are provided here](active-directory-v2-scopes.md).

Once the user authenticates and grants consent, the v2.0 endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

A successful response using `response_mode=query` looks like:

```
GET https://localhost/myapp/?
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q... 	// the id_token, truncated
&session_state=7B29111D-C220-4263-99AB-6F6E135D75EF			   // a value generated by the v2.0 endpoint
&state=12345												  	// the value provided in the request

```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| id_token | The id_token that the  app requested. You can use the id_token to verify the user's identity and begin a session with the user.  More details on id_tokens and their contents is included in the [v2.0 endpoint token reference](active-directory-v2-tokens.md).  |
| session_state | A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET https://localhost/myapp/?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

#### Validate the id_token
Just receiving an id_token is not sufficient to authenticate the user; you must validate the id_token's signature and verify the claims in the token per your  app's requirements.  The v2.0 endpoint uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.

The v2.0 app model has an OpenID Connect metadata endpoint, which allows an app to fetch information about the v2.0 app model at runtime.  This information includes endpoints, token contents, and token signing keys.  The metadata endpoint contains a JSON document located at:

`https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`

One of the properties of this configuration document is the `jwks_uri`, whose value for the v2.0 app model will be:

`https://login.microsoftonline.com/common/discovery/v2.0/keys`.

You can use the RSA256 public keys located at this endpoint to validate the signature of the id_token.  There are multiple keys listed at this endpoint at any given point in time, each identified by a `kid`.  The header of the id_token also contains a `kid` claim, which indicates which of these keys was used to sign the id_token.  

See the [v2.0 app model token reference](active-directory-v2-tokens.md) for more information, including [Validating Tokens](active-directory-v2-tokens.md#validating-tokens) and [Important Information About Signing Key Rollover](active-directory-v2-tokens.md#validating-tokens).
<!--TODO: Improve the information on this-->

Once you've validated the signature of the id_token, there are a few claims you will need to verify:

- You should validate the `nonce` claim to prevent token replay attacks.  Its value should be what you specified in the sign-in request.
- You should validate the `aud` claim to ensure the id_token was issued for your app.  Its value should be the `client_id` of your app.
- You should validate the `iat` and `exp` claims to ensure the id_token has not expired.

You may also wish to validate additional claims depending on your scenario.  Some common validations include:

- Ensuring the user/organization has signed up for the  app.
- Ensuring the user has proper authorization/privileges
- Ensuring a certain strength of authentication has occurred, such as multi-factor authentication.

For more information on the claims in an id_token, see the [v2.0 app model token reference](active-directory-v2-tokens.md).

Once you have completely validated the id_token, you can begin a session with the user and use the claims in the id_token to obtain information about the user in your app.  This information can be used for display, records, authorizations, etc.

#### Send a Sign Out Request

The OpenIdConnect `end_session_endpoint` is not currently supported by the v2.0 app model preview. This means your app cannot send a request to the v2.0 endpoint to end a user's session and clear cookies set by the v2.0 endpoint.
To sign a user out, your app can simply end its own session with the user, and leave the user's session with the v2.0 endpoint in-tact.  The next time the user tries to sign in, they will see a "choose account" page, with their actively signed-in accounts listed.
On that page, the user can choose to sign out of any account, ending the session with the v2.0 endpoint.

<!--

When you wish to sign the user out of the  app, it is not sufficient to clear your app's cookies or otherwise end the session with the user.  You must also redirect the user to the v2.0 endpoint for sign out.  If you fail to do so, the user will be able to re-authenticate to your app without entering their credentials again, because they will have a valid single sign-on session with the v2.0 endpoint.

You can simply redirect the user to the `end_session_endpoint` listed in the OpenID Connect metadata document:

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/logout?
post_logout_redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ------------ |
| post_logout_redirect_uri | recommended | The URL which the user should be redirected to after successful logout.  If not included, the user will be shown a generic message by the v2.0 endpoint.  |

-->

## OpenID Connect with OAuth Code Flow
Many web  apps need to sign the user in and then access a web service on behalf of that user using OAuth.  This scenario combines the two above sections - it uses OpenID Connect for user authentication while simultaneously acquiring an authorization_code that can be used to get access_tokens using the OAuth Authorization Code Flow:

![OpenId Connect Swimlanes](../media/active-directory-v2-flows/convergence_scenarios_webapp_webapi.png)

This flow only slightly differs from the above sections, in how you send the sign-in request.

#### Send the Sign-In Request
When your web  app needs to authenticate the user & get the permissions it needs to access resources, it can direct the user to the `/authorize` endpoint.  In this case, your app must ask for both an `id_token` and a `code` in the response:

```
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e		// Your registered Application Id
&response_type=id_token+code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F 	  // Your registered Redirect Uri, url encoded
&response_mode=query							      // 'query', 'form_post', or 'fragment'
&scope=openid%20										 // Include both 'openid' and scopes your app needs  
https%3A%2F%2Fgraph.windows.net%2Fdirectory.read%20
https%3A%2F%2Fgraph.windows.net%2Fdirectory.write
&state=12345						 				 // Any value, provided by your app
&nonce=678910										 // Any value, provided by your app
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ----------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| response_type | required | Must include `id_token` and `code` for this scenario. |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and received by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  For OpenID Connect, it must include the scope `openid`, which translates to the "Sign in & Read Your Profile" permission in the consent UI.  You must also include scopes for resources that your app requires access to.  For a more detailed explanation of scopes, refer to [permissions, consent, and scopes](active-directory-v2-scopes.md). |
| nonce | required | A value included in the request, generated by the app, that will included in the resulting id_token as a claim.  The app can then verify this value to mitigate token replay attacks.  The value is typically a randomized, unique string that can be used to identify the origin of the request.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'.  
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid value at this time is 'login', which forces the user to enter their credentials on that request.  Single-sign on will not take effect. |

At this point, the user will be asked to enter their credentials and complete the authentication.  The v2.0 endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter.  If the user has not consented to any of those permissions, it will ask the user to consent to the required permissions.  Details of [permissions, consent, and multi-tenant apps are provided here](active-directory-v2-scopes.md).

Once the user authenticates and grants consent, the v2.0 endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

A successful response using `response_mode=query` looks like:

```
GET https://localhost/myapp/?
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q... 	// the id_token, truncated
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq... 	// the authorization_code, truncated
&session_state=7B29111D-C220-4263-99AB-6F6E135D75EF			   // a value generated by the v2.0 endpoint
&state=12345												  	// the value provided in the request

```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| id_token | The id_token that the  app requested. You can use the id_token to verify the user's identity and begin a session with the user.  More details on id_tokens and their contents is included in the [v2.0 app model token reference](active-directory-v2-tokens.md).  |
| code | The authorization_code that the  app requested. The  app can use the authorization code to request an access token for the target resource.  Authorization_codes are very short lived, typically they expire after about 10 minutes. |
| session_state | A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination. |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET https://localhost/myapp/?
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |

#### Validate the id_token
This process is exactly the same as described above in the [OpenID Connect Sign-In Flow](#OpenID-Connect-Sign-In-Flow).

#### Send a Sign Out Request
This process is exactly the same as described above in the [OpenID Connect Sign-In Flow](#OpenID-Connect-Sign-In-Flow).

#### Request an Access Token
This process is exactly the same as described above in the [OAuth 2.0 Authorization Code Flow](#oauth2-authorization-code-flow).

#### Use the Access Token
This process is exactly the same as described above in the [OAuth 2.0 Authorization Code Flow](#oauth2-authorization-code-flow).

#### Refresh the Access Token
This process is exactly the same as described above in the [OAuth 2.0 Authorization Code Flow](#oauth2-authorization-code-flow).





## OAuth2 Client Credentials Grant Flow
The OAuth 2.0 Client Credentials Grant is described in the [OAuth 2.0 Specification](http://tools.ietf.org/html/rfc6749#section-4.4).  It is useful for long running processes and other server to server scenarios, where the  app can authenticate to a resource using its own "Application Identity", rather than a user's delegated identity.

This flow is not currently supported by the v2.0 app model preview.  To see how it works in the generally available Azure AD service, see [this Azure AD code sample](https://github/com/AzureADSamples/Daemon-DotNet).

## OAuth2 Implicit Flow
The OAuth 2.0 Implicit Flow is described in the [OAuth 2.0 Specification](http://tools.ietf.org/html/rfc6749#section-4.2).  It is often used for single-page/javascript apps that run in a browser.

This flow is not currently supported by the v2.0 app model preview.  To see how it works in the generally available Azure AD service, see [this Azure AD code sample](active-directory-devquickstarts-angular.md).

## OAuth2 Resource Owner Password Credentials Grant
The OAuth 2.0 Resource Owner Password Credentials Grant is described in the [OAuth 2.0 Specification](http://tools.ietf.org/html/rfc6749#section-4.3).  It allows an app to acquire access_tokens by providing a user's username & password in a token request.

This flow is not currently supported by the v2.0 app model preview.  To see how it works in the generally available Azure AD service, see [this Azure AD code sample](https://github.com/AzureADSamples/NativeClient-Headless-DotNet).

## OAuth2 On Behalf Of Flow
The On Behalf Of Flow, or JWT Bearer Credentials Grant is described in this [OAuth 2.0 Extension Grant Draft](https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12).  It allows a Web API that receives an access_token to use that access_token as a credential for acquiring access_tokens to other resources.  This allows a Web API to securely call another downstream Web API.

This flow is not currently supported by the v2.0 app model preview.  To see how it works in the generally available Azure AD service, see [this Azure AD code sample](https://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet).
