---
title: Web sign-in with OpenID Connect in Azure Active Directory B2C | Microsoft Docs
description: Building web applications by using the Azure Active Directory implementation of the OpenID Connect authentication protocol.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/16/2017
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Web sign-in with OpenID Connect
OpenID Connect is an authentication protocol, built on top of OAuth 2.0, that can be used to securely sign users in to web applications. By using the Azure Active Directory B2C (Azure AD B2C) implementation of OpenID Connect, you can outsource sign-up, sign-in, and other identity management experiences in your web applications to Azure Active Directory (Azure AD). This guide shows you how to do so in a language-independent manner. It describes how to send and receive HTTP messages without using any of our open-source libraries.

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) extends the OAuth 2.0 *authorization* protocol for use as an *authentication* protocol. This allows you to perform single sign-on by using OAuth. It introduces the concept of an *ID token*, which is a security token that allows the client to verify the identity of the user and obtain basic profile information about the user.

Because it extends OAuth 2.0, it also enables apps to securely acquire *access tokens*. You can use access_tokens to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md#the-basics). We recommend OpenID Connect if you're building a web application that is hosted on a server and accessed through a browser. If you want to add identity management to your mobile or desktop applications by using Azure AD B2C, you should use [OAuth 2.0](active-directory-b2c-reference-oauth-code.md) rather than OpenID Connect.

Azure AD B2C extends the standard OpenID Connect protocol to do more than simple authentication and authorization. It introduces the [policy parameter](active-directory-b2c-reference-policies.md),
which enables you to use OpenID Connect to add user experiences--such as sign-up, sign-in, and profile management--to your app. Here, we show you how to use OpenID Connect and policies to implement each of these experiences
in your web applications. We'll also show you how to get access tokens for accessing web APIs.

The example HTTP requests in the next section use our sample B2C directory, fabrikamb2c.onmicrosoft.com, as well as our sample application, https://aadb2cplayground.azurewebsites.net, and policies. You're free to try out the requests yourself by using these values, or you can replace them with your own.
Learn how to [get your own B2C tenant, application, and policies](#use-your-own-b2c-directory).

## Send authentication requests
When your web app needs to authenticate the user and execute a policy, it can direct the user to the `/authorize` endpoint. This is the interactive portion of the flow, where the user takes action, depending on the policy.

In this request, the client indicates the permissions that it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter. Three examples are provided in the following sections (with line breaks for readability),
each using a different policy. To get a feel for how each request works, try pasting the request into a browser and running it.

#### Use a sign-in policy
```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
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
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
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
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
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
| --- | --- | --- |
| client_id |Required |The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| response_type |Required |The response type, which must include an ID token for OpenID Connect. If your web app also needs tokens for calling a web API, you can use `code+id_token`, as we've done here. |
| redirect_uri |Recommended |The `redirect_uri` parameter of your app, where authentication responses can be sent and received by your app. It must exactly match one of the `redirect_uri` parameters that you registered in the portal, except that it must be URL encoded. |
| scope |Required |A space-separated list of scopes. A single scope value indicates to Azure AD both permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens (more to come on this later in the article). The `offline_access` scope is optional for web apps. It indicates that your app will need a *refresh token* for long-lived access to resources. |
| response_mode |Recommended |The method that should be used to send the resulting authorization code back to your app. It can be either `query`, `form_post`, or `fragment`.  The `form_post` response mode is recommended for best security. |
| state |Recommended |A value included in the request that is also returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on. |
| nonce |Required |A value included in the request (generated by the app) that will be included in the resulting ID token as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized unique string that can be used to identify the origin of the request. |
| p |Required |The policy that will be executed. It is the name of a policy that is created in your B2C tenant. The policy name value should begin with `b2c\_1\_`. Learn more about policies and the [extensible policy framework](active-directory-b2c-reference-policies.md). |
| prompt |Optional |The type of user interaction that is required. The only valid value at this time is `login`, which forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user is asked to complete the policy's workflow. This might involve the user entering their username and password, signing in with a social identity, signing up for the directory, or any other number of steps, depending on how the policy is defined.

After the user completes the policy, Azure AD returns a response to your app at the indicated `redirect_uri` parameter, by using the method that is specified in the `response_mode` parameter. The response is the same for each of the preceding cases, independent of the policy that is executed.

A successful response using `response_mode=fragment` would look like:

```
GET https://aadb2cplayground.azurewebsites.net/#
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --- | --- |
| id_token |The ID token that the app requested. You can use the ID token to verify the user's identity and begin a session with the user. More details on ID tokens and their contents are included in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |
| code |The authorization code that the app requested, if you used `response_type=code+id_token`. The app can use the authorization code to request an access token for a target resource. Authorization codes are very short-lived. Typically, they expire after about 10 minutes. |
| state |If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |

Error responses can also be sent to the `redirect_uri` parameter so that the app can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --- | --- |
| error |An error-code string that can be used to classify types of errors that occur and that can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |
| state |See the full description in the first table in this section. If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |

## Validate the ID token
Just receiving an ID token is not enough to authenticate the user. You must validate the ID token's signature and verify the claims in the token per your app's requirements. Azure AD B2C uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.

There are many open-source libraries that are available for validating JWTs, depending on your language of preference. We recommend exploring those options rather than implementing your own validation logic. The information here will be useful in figuring out how to properly use those libraries.

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an app to fetch information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. There is a JSON metadata document for each policy in your B2C tenant. For example, the metadata document for the `b2c_1_sign_in` policy in `fabrikamb2c.onmicrosoft.com` is located at:

`https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is `jwks_uri`, whose value for the same policy would be:

`https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

To determine which policy was used in signing an ID token (and from where to fetch the metadata), you have two options. First, the policy name is included in the `acr` claim in the ID token. For information on how to parse the claims from an ID token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used. Either method is valid.

After you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA 256 public keys (which are located at this endpoint) to validate the signature of the ID token. There might be multiple keys listed at this endpoint at any given point in time, each identified by a `kid` claim. The header of the ID token also contains a `kid` claim, which indicates which of these keys was used to sign the ID token. For more information, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md) (the section on [validating tokens](active-directory-b2c-reference-tokens.md#token-validation), in particular).
<!--TODO: Improve the information on this-->

After you've validated the signature of the ID token, there are several claims that you need to verify. For instance:

* You should validate the `nonce` claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
* You should validate the `aud` claim to ensure that the ID token was issued for your app. Its value should be the application ID of your app.
* You should validate the `iat` and `exp` claims to ensure that the ID token has not expired.

There are also several more validations that you should perform. These are described in detail in the [OpenID Connect Core Spec](http://openid.net/specs/openid-connect-core-1_0.html).  You might also want to validate additional claims, depending on your scenario. Some common validations include:

* Ensuring that the user/organization has signed up for the app.
* Ensuring that the user has proper authorization/privileges.
* Ensuring that a certain strength of authentication has occurred, such as Azure Multi-Factor Authentication.

For more information on the claims in an ID token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

After you have validated the ID token, you can begin a session with the user. You can use the claims in the ID token to obtain information about the user in your app. Uses for this information include display, records, and authorization.

## Get a token
If you need your web app to only execute policies, you can skip the next few sections. These sections are applicable only to web apps that need to make authenticated calls to a web API and are also protected by Azure AD B2C.

You can redeem the authorization code that you acquired (by using `response_type=code+id_token`) for a token to the desired resource by sending a `POST` request to the `/token` endpoint. Currently, the only resource that you can request a token for is your app's own back-end web API. The convention for requesting a token to yourself is to use your app's client ID as the scope:

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>

```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The policy that was used to acquire the authorization code. You cannot use a different policy in this request. Note that you add this parameter to the query string, not to the `POST` body. |
| client_id |Required |The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| grant_type |Required |The type of grant, which must be `authorization_code` for the authorization code flow. |
| scope |Recommended |A space-separated list of scopes. A single scope value indicates to Azure AD both permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of id_token parameters. It can be used to get tokens to your app's own back-end web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your app will need a refresh token for long-lived access to resources. |
| code |Required |The authorization code that you acquired in the first leg of the flow. |
| redirect_uri |Required |The `redirect_uri` parameter of the application where you received the authorization code. |
| client_secret |Required |The application secret that you generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. You should also rotate this client secret on a periodic basis. |

A successful token response looks like:

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
| --- | --- |
| not_before |The time at which the token is considered valid, in epoch time. |
| token_type |The token type value. The only type that Azure AD supports is `Bearer`. |
| access_token |The signed JWT token that you requested. |
| scope |The scopes for which the token is valid. These can be used for caching tokens for later use. |
| expires_in |The length of time that the access token is valid (in seconds). |
| refresh_token |An OAuth 2.0 refresh token. The app can use this token to acquire additional tokens after the current token expires. Refresh tokens are long-lived and can be used to retain access to resources for extended periods of time. For more details, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh token. |

Error responses look like:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --- | --- |
| error |An error-code string that can be used to classify types of errors that occur and that can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |

## Use the token
Now that you've successfully acquired an access token, you can use the token in requests to your back-end web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the token
ID tokens are short-lived. You must refresh them after they expire to continue being able to access resources. You can do so by submitting another `POST` request to the `/token` endpoint. This time, provide the `refresh_token` parameter instead of the `code` parameter:

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=openid offline_access&refresh_token=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>
```

| Parameter | Required | Description |
| --- | --- | --- |
| p |Required |The policy that was used to acquire the original refresh token. You cannot use a different policy in this request. Note that you add this parameter to the query string, not to the POST body. |
| client_id |Required |The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| grant_type |Required |The type of grant, which must be a refresh token for this leg of the authorization code flow. |
| scope |Recommended |A space-separated list of scopes. A single scope value indicates to Azure AD both permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. It can be used to get tokens to your app's own back-end web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your app will need a refresh token for long-lived access to resources. |
| redirect_uri |Recommended |The `redirect_uri` parameter of the application where you received the authorization code. |
| refresh_token |Required |The original refresh token that you acquired in the second leg of the flow. Note that you must have used the scope `offline_access` in both the authorization and token requests in order to receive a refresh token. |
| client_secret |Required |The application secret that you generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. You should also rotate this client secret on a periodic basis. |

A successful token response looks like:

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
| --- | --- |
| not_before |The time at which the token is considered valid, in epoch time. |
| token_type |The token type value. The only type that Azure AD supports is `Bearer`. |
| access_token |The signed JWT token that you requested. |
| scope |The scope that the token is valid for, which can be used for caching tokens for later use. |
| expires_in |The length of time that the access token is valid (in seconds). |
| refresh_token |An OAuth 2.0 refresh token. The app can use this token to acquire additional tokens after the current token expires.  Refresh tokens are long-lived and can be used to retain access to resources for extended periods of time. For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). |

Error responses look like:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --- | --- |
| error |An error-code string that can be used to classify types of errors that occur and that can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |

## Send a sign-out request
When you want to sign the user out of the app, it is not enough to clear your app's cookies or otherwise end the session with the user. You must also redirect the user to Azure AD to sign out. If you fail to do so, the user might be able to reauthenticate to your app without entering their credentials again. This is because they will have a valid single sign-on session with Azure AD.

You can simply redirect the user to the `end_session` endpoint that is listed in the OpenID Connect metadata document described earlier in the "Validate the ID token" section:

```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The policy that you want to use to sign the user out of your application. |
| post_logout_redirect_uri |Recommended |The URL that the user should be redirected to after successful sign-out. If it is not included, Azure AD B2C shows the user a generic message. |

> [!NOTE]
> Although directing the user to the `end_session` endpoint will clear some of the user's single sign-on state with Azure AD B2C, it will not sign the user out of their social identity provider (IDP) session. If the user selects the same IDP during a subsequent sign-in, they will be reauthenticated, without entering their credentials. If a user wants to sign out of your B2C application, it does not necessarily mean they want to sign out of their Facebook account. However, in the case of local accounts, the user's session will be ended properly.
> 
> 

## Use your own B2C tenant
If you want to try these requests for yourself, you must first perform these three steps, and then replace the example values described earlier with your own:

1. [Create a B2C tenant](active-directory-b2c-get-started.md), and use the name of your tenant in the requests.
2. [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID. Include a web app/web API in your app. Optionally, create an application secret.
3. [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.

