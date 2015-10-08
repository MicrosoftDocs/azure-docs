<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="Building web applications using Azure AD's implementation of the OpenID Connect authentication protocol."
	services="active-directory-b2c"
	documentationCenter=""
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="dastrock"/>

# Azure AD B2C Preview: OAuth 2.0 Authorization Code Flow

The OAuth 2.0 authorization code grant can be used in apps that are installed on a device to gain access to protected resources, such as web APIs.  Using Azure AD B2C's implementation of OAuth 2.0, you can add sign-up, sign-in,
and other identity management tasks to your mobile and desktop apps.  This guide is language-independent, and describes how to send and receive HTTP messages without using any of our open-source libraries.

<!-- TODO: Need link to libraries -->	

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

The OAuth 2.0 authorization code flow is described in in [section 4.1 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749).  It can be used to perform authentication and authorization in the majority of app types, including [web apps](active-directory-b2c-apps.md#web-apps) and [natively installed  apps](active-directory-b2c-apps.md#mobile-and-native-apps).  It enables apps to securely acquire **access_tokens** which can be used to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md#the-basics).  This guide will focus
on a particular flavor of the OAuth 2.0 authorization code flow - **public clients**.  A public client is any client application that cannot be trusted to securely maintain the integrity of a secret password.  This includes mobile apps, desktop apps, and pretty much any application that
runs on a device and needs to get access_tokens.  If you want to add identity management to a web app using Azure AD B2C, you should use [OpenID Connect](active-directory-b2c-reference-oidc.md) rather than OAuth 2.0.

Azure AD B2C extends the standard OAuth 2.0 flows to do more than simple authentication and authorization.  It introduces the [**policy parameter**](active-directory-b2c-reference-poliices.md), 
which enables you to use OAuth 2.0 to add user experiences to your app such as sign-up, sign-in, and profile management.  Here we'll show how to to use OAuth 2.0 and policies to implement each of these experiences 
in your native applications and get access_tokens for accessing web APIs.

The example HTTP requests below will use our sample B2C directory, **fabrikamb2c.onmicrosoft.com**, as well as our sample application and policies.  You are free to try the requests out yourself using these values, or you can replace them with your own.
Learn how to [get your own B2C directory, application, and policies](#use-your-own-b2c-directory).

## 1. Get an authorization code
The authorization code flow begins with the client directing the user to the `/authorize` endpoint.  This is the interactive part of the flow, where the user will actually take action.  
In this request, the client indicates the permissions it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter.  Three examples are provided below (with line breaks for readability),
each using a different policy.

#### Use a sign-in policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_sign_in
```

#### Use a sign-up policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_sign_up
```

#### Use an edit profile policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_edit_profile
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | required | The Application Id that the [Azure portal](https://portal.azure.com) assigned your app. |
| response_type | required | Must include `code` for the authorization code flow. |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and receieved by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to Azure AD both thethe permissions being requested.  The `openid` scope indicates a permission to sign the user in and get data about the user in the form of **id_tokens** (more to come on this).  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'.
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on or the policy being executed. |
| p | required | Indicates the policy to be executed.  It is the name of a policy created in your B2C directory, whose value should begin with "b2c_1_".  Learn more about policies [here](active-directory-b2c-reference-policies.md). |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid value at this time is 'login', which forces the user to enter their credentials on that request.  Single-sign on will not take effect. |

At this point, the user will be asked to complete the policy's workflow.  This may involve the user entering their username and password, signing in with a social identity, signing up for the directory, or any other number of steps depending on how the policy is defined.
Once the user completes the policy, Azure AD will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.  The response will be exactly the same for each of the above cases, independent of the policy that was executed.

A successful response using `response_mode=query` looks like:

```
GET urn:ietf:wg:oauth:2.0:oob?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...        // the authorization_code, truncated
&state=arbitrary_data_you_can_receive_in_the_response                // the value provided in the request
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| code | The authorization_code that the app requested. The app can use the authorization code to request an access token for a target resource.  Authorization_codes are very short lived, typically they expire after about 10 minutes. |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET urn:ietf:wg:oauth:2.0:oob?
error=access_denied
&error_description=The+user+has+cancelled+entering+self-asserted+information
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |


## 2. Get a token
Now that you've acquired an authorization_code, you can redeem the `code` for a token to the desired resource, by sending a `POST` request to the `/token` endpoint.  In the Azure AD B2C preview, the only resource you can request a token for is
your app's own backend web API.  The convention used for requesting a token to yourself is to use the scope `openid`:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
	"grant_type": "authorization_code",
	"client_id": "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6",
	"scope": "openid offline_access",
	"code": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...",
	"redirect_uri": "urn:ietf:wg:oauth:2.0:oob"
}
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------------- |
| p | required | The policy that was used to acquire the authorization code.  You may not use a different policy in this request.  **Note that this parameter is added to the query string**, not in the POST body.  |
| client_id | required | The Application Id that the [Azure portal](https://portal.azure.com) assigned your app. |
| grant_type | required | Must be `authorization_code` for the authorization code flow. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to Azure AD both thethe permissions being requested.  The `openid` scope indicates a permission to sign the user in and get data about the user in the form of **id_tokens**.  It can be used to get tokens to your app's own backend web API, represented by the same Application Id as the client.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  |
| code | required | The authorization_code that you acquired in the first leg of the flow.   |
| redirect_uri | required | The redirect_uri of the application where you received the authorization_code.   |

A successful token response will look like:

```
{
	"not_before": "1442340812",
	"token_type": "Bearer",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"scope": "openid offline_access",
	"id_token_expires_in": "3600",
	"profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiI3NzU1MjdmZi05YTM3LTQzMDctOGIzZC1jY...",
	"refresh_token": "AAQfQmvuDy8WtUv-sd0TBwWVQs1rC-Lfxa_NDkLqpg50Cxp5Dxj0VPF1mx2Z...",
	"refresh_token_expires_in": "1209600"
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| not_before | The time at which the token is considered valid, in epoch time.  |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer.  |
| id_token | The signed JWT token that you requested.  |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| id_token_expires_in | How long the id_token is valid (in seconds). |
| profile_info | A base-64 encoded JSON string that may contain useful information about the user for display in your native application.  Its exact contents will depend on the application claims you configured in your policy  |
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token acquire additional tokens after the current token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time.  For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md).  |
| refresh_token_expires_in | The maximum time a refresh token may be valid for (in seconds).  The refresh token may however become invalid at any point in time. |

> [AZURE.NOTE]
	If at this point you're thinking: "Where's the access_token?", consider the following.  When you request the `openid` scope, Azure AD will issue a JWT `id_token` in the response.  While this `id_token` is not technically an OAuth 2.0 access_token, it can be used as such when communcating with your app's own backend service, represented by the same client_id as the client.  The `id_token` is still a signed JWT Bearer token that can be sent to a resource in an HTTP authorization header and used to authenticate requests.  The difference is that an `id_token` does not have a mechanism for scoping down the access that a particular client application may have.  However, when your client application is the only client that is able to communicate with your backend service (as is the case with the current Azure AD B2C preview), there is no need for such a scoping mechanism.  When the Azure AD B2C preview adds the capability for clients to communicate with additional 1st and 3rd party resources, access_tokens will be introduced.  However, even at that time, using `id_tokens` to communicate with your app's own backend service will still be the reccomended pattern.  For more info on the types of applications you can build with the Azure AD B2C preview, see [this article](active-directory-b2c-apps.md).

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

## 3. Use the token
Now that you've successfully acquired an `id_token`, you can use the token in requests to you backend Web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## 4. Refresh the token
Id_tokens are short lived, and you must refresh them after they expire to continue accessing resources.  You can do so by submitting another `POST` request to the `/token` endpoint, this time providing the `refresh_token` instead of the `code`:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
	"grant_type": "refresh_token",
	"client_id": "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6",
	"scope": "openid offline_access",
	"refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...",
	"redirect_uri": "urn:ietf:wg:oauth:2.0:oob"
}
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | -------- |
| p | required | The policy that was used to acquire the original refresh token.  You may not use a different policy in this request.  **Note that this parameter is added to the query string**, not in the POST body.  |
| client_id | required | The Application Id that the [Azure portal](https://portal.azure.com) assigned your app. |
| grant_type | required | Must be `refresh_token` for this leg of the authorization code flow. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to Azure AD both thethe permissions being requested.  The `openid` scope indicates a permission to sign the user in and get data about the user in the form of **id_tokens**.  It can be used to get tokens to your app's own backend web API, represented by the same Application Id as the client.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  |
| redirect_uri | required | The redirect_uri of the application where you received the authorization_code.   |
| refresh_token | required | The original refresh_token that you acquired in the second leg of the flow.   |

A successful token response will look like:

```
{
	"not_before": "1442340812",
	"token_type": "Bearer",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"scope": "openid offline_access",
	"id_token_expires_in": "3600",
	"profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiI3NzU1MjdmZi05YTM3LTQzMDctOGIzZC1jY...",
	"refresh_token": "AAQfQmvuDy8WtUv-sd0TBwWVQs1rC-Lfxa_NDkLqpg50Cxp5Dxj0VPF1mx2Z...",
	"refresh_token_expires_in": "1209600"
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| not_before | The time at which the token is considered valid, in epoch time.  |
| token_type | Indicates the token type value. The only type that Azure AD supports is Bearer.  |
| id_token | The signed JWT token that you requested.  |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| id_token_expires_in | How long the id_token is valid (in seconds). |
| profile_info | A base-64 encoded JSON string that may contain useful information about the user for display in your native application.  Its exact contents will depend on the application claims you configured in your policy  |
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token acquire additional tokens after the current token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time.  For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md).  |
| refresh_token_expires_in | The maximum time a refresh token may be valid for (in seconds).  The refresh token may however become invalid at any point in time. |

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


<!-- 

Here is the entire flow for a native  app; each request is detailed in the sections below:

![OAuth Auth Code Flow](./media/active-directory-b2c-reference-oauth-code/convergence_scenarios_native.png) 

-->

## Use your own B2C directory

If you want to try these requests out for yourself, you must first perform these three steps, then replace the example values above with your own:

- [Create a B2C directory](active-directory-b2c-get-started.md), and use the name of your directory in the requests.
- [Create an application](active-directory-b2c-app-registration.md) to obtain an Application Id and a redirect_uri.  You will want to include a **native client** in your app.
- [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.