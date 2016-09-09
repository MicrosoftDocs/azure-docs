<properties
	pageTitle="Azure Active Directory B2C | Microsoft Azure"
	description="Building web applications by using the Azure Active Directory implementation of the OpenID Connect authentication protocol."
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
	ms.date="07/22/2016"
	ms.author="dastrock"/>

# Azure Active Directory B2C: Web sign-in with OpenID Connect

OpenID Connect is an authentication protocol, built on top of OAuth 2.0, that can be used to securely sign users into web applications.  By using the Azure Active Directory (Azure AD) B2C implementation of OpenID Connect, you can outsource sign-up, sign-in, and other identity management experiences in your web applications to Azure AD. This guide will show you how to do so in a language-independent manner. It will describe how to send and receive HTTP messages without using any of our open-source libraries.

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) extends the OAuth 2.0 *authorization* protocol for use as an *authentication* protocol. This allows you to perform single sign-on by using OAuth. It introduces the concept of an `id_token`, which is a security token that allows the client to verify the identity of the user and obtain basic profile information about the user.

Because it extends OAuth 2.0, it also enables apps to securely acquire **access_tokens**. You can use access_tokens to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md#the-basics). We recommend OpenID Connect if you're building a web application that is hosted on a server and accessed through a browser. If you want to add identity management to your mobile or desktop applications by using Azure AD B2C, you should use [OAuth 2.0](active-directory-b2c-reference-oauth-code.md) rather than OpenID Connect.

Azure AD B2C extends the standard OpenID Connect protocol to do more than simple authentication and authorization. It introduces the [**policy parameter**](active-directory-b2c-reference-policies.md),
which enables you to use OpenID Connect to add user experiences to your app--such as sign-up, sign-in, and profile management. Here we'll show you how to use OpenID Connect and policies to implement each of these experiences
in your web applications. We'll also show you how to get access_tokens for accessing web APIs.

The example HTTP requests below will use our sample B2C directory, **fabrikamb2c.onmicrosoft.com**, as well as our sample application **https://aadb2cplayground.azurewebsites.net** and policies. You're free to try out the requests yourself by using these values, or you can replace them with your own.
Learn how to [get your own B2C tenant, application, and policies](#use-your-own-b2c-directory).

## Send authentication requests
When your web app needs to authenticate the user and execute a policy, it can direct the user to the `/authorize` endpoint. This is the interactive portion of the flow, where the user will actually take action, depending on the policy.

In this request, the client indicates the permissions that it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter. Three examples are provided below (with line breaks for readability),
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

#### Use an edit-profile policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code+id_token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=form_post
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_edit_profile
```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | Required | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| response_type | Required | The response type, which must include `id_token` for OpenID Connect. If your web app will also need tokens for calling a web API, you can use `code+id_token`, as we've done here. |
| redirect_uri | Recommended | The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris that you registered in the portal, except that it must be URL encoded. |
| scope | Required | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of **id_tokens** (more to come on this later in the article). The `offline_access` scope is optional for web apps. It indicates that your app will need a **refresh_token** for long-lived access to resources. |
| response_mode | Recommended | The method that should be used to send the resulting authorization_code back to your app. It can be one of 'query', 'form_post', or 'fragment'.  'form_post' is recommended for best security. |
| state | Recommended | A value included in the request that will also be returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on. |
| nonce | Required | A value included in the request (generated by the app) that will be included in the resulting id_token as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized, unique string that can be used to identify the origin of the request. |
| p | Required | The policy that will be executed. It is the name of a policy that is created in your B2C tenant. The policy name value should begin with "b2c\_1\_". Learn more about policies in [Extensible policy framework](active-directory-b2c-reference-policies.md). |
| prompt | Optional | The type of user interaction that is required. The only valid value at this time is 'login', which forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user will be asked to complete the policy's workflow. This may involve the user entering their user name and password, signing in with a social identity, signing up for the directory, or any other number of steps, depending on how the policy is defined.

After the user completes the policy, Azure AD will return a response to your app at the indicated `redirect_uri`, by using the method that is specified in the `response_mode` parameter. The response will be exactly the same for each of the above cases, independent of the policy that was executed.

A successful response using `response_mode=fragment` would look like:

```
GET https://aadb2cplayground.azurewebsites.net/#
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| id_token | The id_token that the app requested. You can use the id_token to verify the user's identity and begin a session with the user. More details on id_tokens and their contents are included in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |
| code | The authorization_code that the app requested, if you used `response_type=code+id_token`. The app can use the authorization code to request an access_token for a target resource. Authorization_codes are very short lived. Typically, they expire after about 10 minutes. |
| state | If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

Error responses can also be sent to the `redirect_uri` so that the app can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error. |
| state | See the full description in the previous table. If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |


## Validate the id_token
Just receiving an id_token is not enough to authenticate the user--you must validate the id_token's signature and verify the claims in the token as per your app's requirements. Azure AD B2C uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.

There are many open-source libraries that are available for validating JWTs, depending on your language of preference. We recommend exploring those options rather than implementing your own validation logic. The information here will be useful in figuring out how to properly use those libraries.

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an app to fetch information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. There is a JSON metadata document for each policy in your B2C tenant. For example the metadata document for the `b2c_1_sign_in` policy in the `fabrikamb2c.onmicrosoft.com` is located at:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is the `jwks_uri`, whose value for the same policy would be:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

In order to determine which policy was used in signing an id_token (and where to fetch the metadata from), you have two options. First, the policy name is included in the `acr` claim in the id_token. For information on how to parse the claims from an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used. Either method is perfectly valid.

After you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA 256 public keys (which are located at this endpoint) to validate the signature of the id_token. There may be multiple keys listed at this endpoint at any given point in time, each identified by a `kid`. The header of the id_token also contains a `kid` claim, which indicates which of these keys was used to sign the id_token. See the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md) for more information, including sections on [validating tokens](active-directory-b2c-reference-tokens.md#validating-tokens) and [important information about signing key rollover](active-directory-b2c-reference-tokens.md#validating-tokens).
<!--TODO: Improve the information on this-->

After you've validated the signature of the id_token, there are several claims that you will need to verify, for instance:

- You should validate the `nonce` claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
- You should validate the `aud` claim to ensure that the id_token was issued for your app. Its value should be the application ID of your app.
- You should validate the `iat` and `exp` claims to ensure that the id_token has not expired.

There are also several more validations that you should perform, described in detail in the [OpenID Connect Core Spec](http://openid.net/specs/openid-connect-core-1_0.html).  You might also want to validate additional claims, depending on your scenario. Some common validations include:

- Ensuring that the user/organization has signed up for the app.
- Ensuring that the user has proper authorization/privileges.
- Ensuring that a certain strength of authentication has occurred, such as Azure Multi-Factor Authentication.

For more information on the claims in an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

After you have completely validated the id_token, you can begin a session with the user and use the claims in the id_token to obtain information about the user in your app. This information can be used for display, records, authorization, and so on.

## Get a token
If all that your web app needs to do is execute policies, you can skip the next few sections. These sections are only applicable to web apps that need to make authenticated calls to a web API and are also protected by Azure AD B2C.

You can redeem the authorization_code that you acquired (by using `response_type=code+id_token`) for a token to the desired resource by sending a `POST` request to the `/token` endpoint. Currently, the only resource that you can request a token for is your app's own backend web API. The convention for requesting a token to yourself is to use your app's client ID as the scope:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>

```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | --------------------- |
| p | Required | The policy that was used to acquire the authorization code. You cannot use a different policy in this request. Note that you add this parameter to the **query string**, not in the POST body. |
| client_id | Required | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| grant_type | Required | The type of grant, which must be `authorization_code` for the authorization code flow. |
| scope | Recommended | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of **id_tokens**. It can be used to get tokens to your app's own backend web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources. |
| code | Required | The authorization_code that you acquired in the first leg of the flow. |
| redirect_uri | Required | The redirect_uri of the application where you received the authorization_code. |
| client_secret | Required | The application secret that you generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. You should also take care to rotate this client secret on a periodic basis. |

A successful token response will look like:

```
{
	"not_before": "1442340812",
	"token_type": "Bearer",
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"scope": "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access",
	"expires_in": "3600",
	"refresh_token": "AAQfQmvuDy8WtUv-sd0TBwWVQs1rC-Lfxa_NDkLqpg50Cxp5Dxj0VPF1mx2Z...",
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| not_before | The time at which the token is considered valid, in epoch time. |
| token_type | The token type value. The only type that Azure AD supports is Bearer. |
| access_token | The signed JWT token that you requested. |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| expires_in | The length of time that the access_token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh_token. The app can use this token to acquire additional tokens after the current token expires.  Refresh_tokens are long lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh_token. |

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
| error_description | A specific error message that can help a developer identify the root cause of an authentication error. |

## Use the token
Now that you've successfully acquired an `access_token`, you can use the token in requests to your backend web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the token
The id_tokens are short lived. You must refresh them after they expire to continue being able to access resources. You can do so by submitting another `POST` request to the `/token` endpoint. This time, provide the `refresh_token` instead of the `code`:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=openid offline_access&refresh_token=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>
```

| Parameter | Required | Description |
| ----------------------- | ------------------------------- | -------- |
| p | Required | The policy that was used to acquire the original refresh_token. You cannot use a different policy in this request. Note that you add this parameter to the **query string**, not in the POST body. |
| client_id | Required | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| grant_type | Required | The type of grant, which must be `refresh_token` for this leg of the authorization code flow. |
| scope | Recommended | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of **id_tokens**. It can be used to get tokens to your app's own backend web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources. |
| redirect_uri | Recommended | The redirect_uri of the application where you received the authorization_code. |
| refresh_token | Required | The original refresh_token that you acquired in the second leg of the flow. Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh_token. |
| client_secret | Required | The application secret that you generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. You should also take care to rotate this client secret on a periodic basis. |

A successful token response will look like:

```
{
	"not_before": "1442340812",
	"token_type": "Bearer",
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...",
	"scope": "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access",
	"expires_in": "3600",
	"refresh_token": "AAQfQmvuDy8WtUv-sd0TBwWVQs1rC-Lfxa_NDkLqpg50Cxp5Dxj0VPF1mx2Z...",
}
```
| Parameter | Description |
| ----------------------- | ------------------------------- |
| not_before | The time at which the token is considered valid, in epoch time. |
| token_type | The token type value. The only type that Azure AD supports is Bearer. |
| access_token | The signed JWT token that you requested. |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| expires_in | The length of time that the access_token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh_token. The app can use this token to acquire additional tokens after the current token expires.  Refresh_tokens are long lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). |

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
| error_description | A specific error message that can help a developer identify the root cause of an authentication error. |


## Send a sign-out request

When you want to sign the user out of the app, it is not enough to clear your app's cookies or otherwise end the session with the user. You must also redirect the user to Azure AD to sign out. If you fail to do so, the user might be able to reauthenticate to your app without entering their credentials again. This is because they will have a valid single sign-on session with Azure AD.

You can simply redirect the user to the `end_session_endpoint` that is listed in the same OpenID Connect metadata document described in the earlier section "Validate the id_token":

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | ------------ |
| p | Required | The policy that you wish to use to sign the user out of your application. |
| post_logout_redirect_uri | Recommended | The URL that the user should be redirected to after successful sign-out. If it is not included, the user will be shown a generic message by Azure AD B2C.  |

> [AZURE.NOTE]
	While directing the user to the `end_session_endpoint` will clear some of the user's single sign-on state with Azure AD B2C, it will not sign the user out of the user's social identity provider (IDP) session. If the user selects the same IDP during a subsequent sign-in, they will be reauthenticated, without entering their credentials. If a user wants to sign out of your B2C application, it does not necessarily mean they want to sign out of their Facebook account entirely. However, in the case of local accounts, the user's session will be ended properly.

## Use your own B2C tenant

If you want to try these requests for yourself, you must first perform these three steps, and then replace the example values above with your own:

- [Create a B2C tenant](active-directory-b2c-get-started.md), and use the name of your tenant in the requests.
- [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID and a redirect_uri. You will want to include a **web app/web api** in your app, and optionally create an **application secret**.
- [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.