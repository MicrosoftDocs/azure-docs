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

# Azure AD B2C Preview: Web sign-in with OpenID Connect

OpenID Connect is an authentication protocol built on top of OAuth 2.0 that can be used to securely sign users into web applications.  Using Azure AD B2C's implementation of OpenID Connect, you can outsource sign-up, sign-in,
and other identity management experiences in your web applications to Azure AD.  This guide will show you how to do so in a language-independent manner, describing how to send and receive HTTP messages without using any of our open-source libraries.

<!-- TODO: Need link to libraries -->	

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) extends the OAuth 2.0 *authorization* protocol for use as an *authentication* protocol, which allows you to perform single sign-on using OAuth.  It introduces the concept of an `id_token`, which is a security token that allows the client to verify the identity of the user and obtain basic profile information about the user.  Because it extends OAuth 2.0, it also enables apps to securely acquire **access_tokens** which can be used to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md#the-basics).  OpenID Connect is our reccomendation if you are building a web application that is hosted on a server and accessed via a browser.  If you want to add identity management to your mobile or desktop applications using Azure AD B2C, you should use [OAuth 2.0](active-directory-b2c-reference-oauth-code.md) rather than OpenID Connect.

Azure AD B2C extends the standard OpenID Connect protocol to do more than simple authentication and authorization.  It introduces the [**policy parameter**](active-directory-b2c-reference-poliices.md), 
which enables you to use OpenID Connect to add user experiences to your app such as sign-up, sign-in, and profile management.  Here we'll show how to to use OpenID Connect and policies to implement each of these experiences 
in your web applications and get access_tokens for accessing web APIs.

The example HTTP requests below will use our sample B2C directory, **fabrikamb2c.onmicrosoft.com**, as well as our sample application **https://aadb2cplayground.azurewebsites.net** and policies.  You are free to try the requests out yourself using these values, or you can replace them with your own.
Learn how to [get your own B2C directory, application, and policies](#use-your-own-b2c-directory).

## Send authentication requests
When your web app needs to authenticate the user and execute a policy, it can direct the user to the `/authorize` endpoint.  This is the interactive portion of the flow, where the user will actually take action depending on the policy.  
In this request, the client indicates the permissions it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter.  Three examples are provided below (with line breaks for readability),
each using a different policy. To get a feel for how each request works, try pasting the request into a browser and running it.

#### Use a sign-in policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code+id_token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=form_post
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_sign_in
```

#### Use a sign-up policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code+id_token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=form_post
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_sign_up
```

#### Use an edit profile policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code+id_token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=fragment
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_edit_profile
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | required | The Application Id that the [Azure portal](https://portal.azure.com) assigned your app. |
| response_type | required | Must include `id_token` for OpenID Connect.  If your web app will also need tokens for calling a web API, you can use `code+id_token`, as we've done here.  |
| redirect_uri | required | The redirect_uri of your app, where authentication responses can be sent and receieved by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to Azure AD both thethe permissions being requested.  The `openid` scope indicates a permission to sign the user in and get data about the user in the form of **id_tokens** (more to come on this).  The `offline_access` scope is optional for web apps.  It indicates that your app will need a **refresh_token** for long-lived access to resources.  |
| response_mode | recommended | Specifies the method that should be used to send the resulting authorization_code back to your app.  Can be one of 'query', 'form_post', or 'fragment'. |
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on. |
| nonce | required | A value included in the request, generated by the app, that will included in the resulting id_token as a claim.  The app can then verify this value to mitigate token replay attacks.  The value is typically a randomized, unique string that can be used to identify the origin of the request.  |
| p | required | Indicates the policy to be executed.  It is the name of a policy created in your B2C directory, whose value should begin with "b2c_1_".  Learn more about policies [here](active-directory-b2c-reference-policies.md). |
| prompt | optional | Indicates the type of user interaction that is required.  The only valid value at this time is 'login', which forces the user to enter their credentials on that request.  Single-sign on will not take effect. |

At this point, the user will be asked to complete the policy's workflow.  This may involve the user entering their username and password, signing in with a social identity, signing up for the directory, or any other number of steps depending on how the policy is defined.
Once the user completes the policy, Azure AD will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.  The response will be exactly the same for each of the above cases, independent of the policy that was executed.

A successful response using `response_mode=query` would look like:

```
GET https://aadb2cplayground.azurewebsites.net/#
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| id_token | The id_token that the app requested. You can use the id_token to verify the user's identity and begin a session with the user.  More details on id_tokens and their contents is included in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).  |
| code | The authorization_code that the app requested, if you used `response_type=code+id_token`. The app can use the authorization code to request an access token for a target resource.  Authorization_codes are very short lived, typically they expire after about 10 minutes. |
| state | If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |
| state | If a state parameter is included in the request, the same value should appear in the response. The  app should verify that the state values in the request and response are identical. |


## Validate the id_token
Just receiving an id_token is not sufficient to authenticate the user; you must validate the id_token's signature and verify the claims in the token per your app's requirements.  Azure AD B2C uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.  There are many open source libraries available for validating JWTs depending on your language of preference.  We reccomend exploring those options rather than implenting your own validation logic.  The information here will be usefuly in figuring out how to properly use those libraries.

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an app to fetch information about Azure AD B2C at runtime.  This information includes endpoints, token contents, and token signing keys.  There is a JSON metadata document for each policy in your B2C directory.  For example the metadata doucment for the `b2c_1_sign_in` policy in the `fabrikamb2c.onmicrosoft.com` is located at:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is the `jwks_uri`, whose value for the same policy would be:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

In order to determine which policy was used in signing an id_token (and where to fetch the metadata from), you have two options.  First, the policy name is included in the `acr` claim in the id_token.  For information on how to parse the claims from an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).  Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used.  Either method is perfectly valid.

Once you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA256 public keys located at this endpoint to validate the signature of the id_token.  There may be multiple keys listed at this endpoint at any given point in time, each identified by a `kid`.  The header of the id_token also contains a `kid` claim, which indicates which of these keys was used to sign the id_token.  See the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md) for more information, including [Validating Tokens](active-directory-b2c-reference-tokens.md#validating-tokens) and [Important Information About Signing Key Rollover](active-directory-b2c-reference-tokens.md#validating-tokens).
<!--TODO: Improve the information on this-->

Once you've validated the signature of the id_token, there are a few claims you will need to verify:

- You should validate the `nonce` claim to prevent token replay attacks.  Its value should be what you specified in the sign-in request.
- You should validate the `aud` claim to ensure the id_token was issued for your app.  Its value should be the Application ID of your app.
- You should validate the `iat` and `exp` claims to ensure the id_token has not expired.

You may also wish to validate additional claims depending on your scenario.  Some common validations include:

- Ensuring the user/organization has signed up for the app.
- Ensuring the user has proper authorization/privileges
- Ensuring a certain strength of authentication has occurred, such as multi-factor authentication.

For more information on the claims in an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

Once you have completely validated the id_token, you can begin a session with the user and use the claims in the id_token to obtain information about the user in your app.  This information can be used for display, records, authorization, and so on.

## Get a token
If all your web app needs to do is execute policies, you can skip the next few sections.  These sections are only applicable to web apps who need to need to make authenticated calls to a web API that are also protected by Azure AD B2C.

You can redeem the authorization_code you acquired (using `response_type=code+id_token`) for a token to the desired resource, by sending a `POST` request to the `/token` endpoint.  In the Azure AD B2C preview, the only resource you can request a token for is
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
	"redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
	"client_secret": "<your-application-secret>"
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
| client_secret | required | The application secret that you generated in the [Azure portal](https://portal.azure.com).  This application secret is an important security artifact, and should be stored securely on your server.  You should also take care to rotate this client secret on a periodic basis. |

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
| refresh_token |  An OAuth 2.0 refresh token. The  app can use this token acquire additional tokens after the current token expires.  Refresh_tokens are long-lived, and can be used to retain access to resources for extended periods of time.  For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md).  Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh token.  |
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

## Use the token
Now that you've successfully acquired an `id_token`, you can use the token in requests to you backend Web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the token
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
	"redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
	"client_secret": "<your-application-secret>"	
}
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | -------- |
| p | required | The policy that was used to acquire the original refresh token.  You may not use a different policy in this request.  **Note that this parameter is added to the query string**, not in the POST body.  |
| client_id | required | The Application Id that the [Azure portal](https://portal.azure.com) assigned your app. |
| grant_type | required | Must be `refresh_token` for this leg of the authorization code flow. |
| scope | required | A space-separated list of scopes.  A single scope value indicates to Azure AD both thethe permissions being requested.  The `openid` scope indicates a permission to sign the user in and get data about the user in the form of **id_tokens**.  It can be used to get tokens to your app's own backend web API, represented by the same Application Id as the client.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  |
| redirect_uri | required | The redirect_uri of the application where you received the authorization_code.   |
| refresh_token | required | The original refresh_token that you acquired in the second leg of the flow.  Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh token.   |
| client_secret | required | The application secret that you generated in the [Azure portal](https://portal.azure.com).  This application secret is an important security artifact, and should be stored securely on your server.  You should also take care to rotate this client secret on a periodic basis. |

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

## Send a sign out request

When you wish to sign the user out of the  app, it is not sufficient to clear your app's cookies or otherwise end the session with the user.  You must also redirect the user to Azure AD for sign out.  If you fail to do so, the user may be able to re-authenticate to your app without entering their credentials again, because they will have a valid single sign-on session with Azure AD.

You can simply redirect the user to the `end_session_endpoint` listed in the same OpenID Connect metadata document described [above](#validate-the-id-token):

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | ------------ |
| p | required | The policy which the user most recently used to sign into your application.  |
| post_logout_redirect_uri | recommended | The URL which the user should be redirected to after successful logout.  If not included, the user will be shown a generic message by Azure AD B2C.  |

> [AZURE.NOTE]
	While directing the user to the `end_session_endpoint` will clear some of the users single sign-on state with Azure AD, it will currently not effectively sign the user out.  Instead, the user will select the IDP in which they want to sign in with, and then they will be re-authenticated without entering their credentials.  In the case of social IDPs, this is the expected behavior.  If a user wishes to sign out of your B2C directory, it does not necessarily mean they want to sign out of their Facebook account entirely.  However, in the case of local accounts, it should be possible to end the user's session properly.  It is a known [limitation](active-directory-b2c-limitations.md) of the Azure AD preview that local account sign-out does not work properly.  A workaround for the immediate term is to send the `&prompt=login` parameter in each authentication request, which will have the appearance of the desired behavior, but will break single sign-on between applications in your B2C directory.

## Use your own B2C directory

If you want to try these requests out for yourself, you must first perform these three steps, then replace the example values above with your own:

- [Create a B2C directory](active-directory-b2c-get-started.md), and use the name of your directory in the requests.
- [Create an application](active-directory-b2c-app-registration.md) to obtain an Application Id and a redirect_uri.  You will want to include a **web app/web api** in your app, and optionally create an **application secret**.
- [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.

<!--

TODO

OpenID Connect for the v2.0 app model is the recommended way to implement sign-in for a [web  app](active-directory-v2-flows.md#web-apps).  The most basic sign-in flow contains the following steps:

image goes here

-->