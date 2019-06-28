---
title: Web sign-in with OpenID Connect - Azure Active Directory B2C | Microsoft Docs
description: Build web applications using the OpenID Connect authentication protocol in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: marsma
ms.subservice: B2C
ms.custom: fasttrack-edit
---

# Web sign-in with OpenID Connect in Azure Active Directory B2C

OpenID Connect is an authentication protocol, built on top of OAuth 2.0, that can be used to securely sign users in to web applications. By using the Azure Active Directory B2C (Azure AD B2C) implementation of OpenID Connect, you can outsource sign-up, sign-in, and other identity management experiences in your web applications to Azure Active Directory (Azure AD). This guide shows you how to do so in a language-independent manner. It describes how to send and receive HTTP messages without using any of our open-source libraries.

[OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) extends the OAuth 2.0 *authorization* protocol for use as an *authentication* protocol. This authentication protocol allows you to perform single sign-on. It introduces the concept of an *ID token*, which allows the client to verify the identity of the user and obtain basic profile information about the user.

Because it extends OAuth 2.0, it also enables applications to securely acquire *access tokens*. You can use access tokens to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md). OpenID Connect is recommended if you're building a web application that's hosted on a server and accessed through a browser. If you want to add identity management to your mobile or desktop applications using Azure AD B2C, you should use [OAuth 2.0](active-directory-b2c-reference-oauth-code.md) rather than OpenID Connect. For more information about tokens, see the [Overview of tokens in Azure Active Directory B2C](active-directory-b2c-reference-tokens.md)

Azure AD B2C extends the standard OpenID Connect protocol to do more than simple authentication and authorization. It introduces the [user flow parameter](active-directory-b2c-reference-policies.md), which enables you to use OpenID Connect to add user experiences to your application, such as sign-up, sign-in, and profile management.

## Send authentication requests

When your web application needs to authenticate the user and run a user flow, it can direct the user to the `/authorize` endpoint. The user takes action depending on the user flow.

In this request, the client indicates the permissions that it needs to acquire from the user in the `scope` parameter and the user flow to run in the `p` parameter. Three examples are provided in the following sections (with line breaks for readability), each using a different user flow. To get a feel for how each request works, try pasting the request into a browser and running it. You can replace `fabrikamb2c` with the name of your tenant if you have one and have created a user flow.

#### Use a sign-in user flow
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

#### Use a sign-up user flow
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

#### Use an edit-profile user flow
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

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| client_id | Yes | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your application. |
| response_type | Yes | Must include an ID token for OpenID Connect. If your web application also needs tokens for calling a web API, you can use `code+id_token`. |
| redirect_uri | No | The `redirect_uri` parameter of your application, where authentication responses can be sent and received by your application. It must exactly match one of the `redirect_uri` parameters that you registered in the Azure portal, except that it must be URL encoded. |
| scope | Yes | A space-separated list of scopes. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. The `offline_access` scope is optional for web applications. It indicates that your application will need a *refresh token* for extended access to resources. |
| response_mode | No | The method that is used to send the resulting authorization code back to your application. It can be either `query`, `form_post`, or `fragment`.  The `form_post` response mode is recommended for best security. |
| state | No | A value included in the request that's also returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the application before the authentication request occurred, such as the page they were on. |
| nonce | Yes | A value included in the request (generated by the application) that is included in the resulting ID token as a claim. The application can then verify this value to mitigate token replay attacks. The value is typically a randomized unique string that can be used to identify the origin of the request. |
| p | Yes | The user flow that is run. It is the name of a user flow that's created in your Azure AD B2C tenant. The name of the user flow should begin with `b2c\_1\_`. |
| prompt | No | The type of user interaction that's required. The only valid value at this time is `login`, which forces the user to enter their credentials on that request. |

At this point, the user is asked to complete the workflow. The user might have to enter their username and password, sign in with a social identity, or sign up for the directory. There could be any other number of steps depending on how the user flow is defined.

After the user completes the user flow, a response is returned to your application at the indicated `redirect_uri` parameter, by using the method that's specified in the `response_mode` parameter. The response is the same for each of the preceding cases, independent of the user flow.

A successful response using `response_mode=fragment` would look like:

```
GET https://aadb2cplayground.azurewebsites.net/#
id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --------- | ----------- |
| id_token | The ID token that the application requested. You can use the ID token to verify the user's identity and begin a session with the user. |
| code | The authorization code that the application requested, if you used `response_type=code+id_token`. The application can use the authorization code to request an access token for a target resource. Authorization codes typically expire after about 10 minutes. |
| state | If a `state` parameter is included in the request, the same value should appear in the response. The application should verify that the `state` values in the request and response are identical. |

Error responses can also be sent to the `redirect_uri` parameter so that the application can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --------- | ----------- |
| error | A code that can be used to classify the types of errors that occur. |
| error_description | A specific error message that can help identify the root cause of an authentication error. |
| state | If a `state` parameter is included in the request, the same value should appear in the response. The application should verify that the `state` values in the request and response are identical. |

## Validate the ID token

Just receiving an ID token is not enough to authenticate the user. Validate the ID token's signature and verify the claims in the token per your application's requirements. Azure AD B2C uses [JSON Web Tokens (JWTs)](https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid. There are many open-source libraries that are available for validating JWTs, depending on your language of preference. We recommend exploring those options rather than implementing your own validation logic. 

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an application to get information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. There is a JSON metadata document for each user flow in your B2C tenant. For example, the metadata document for the `b2c_1_sign_in` user flow in `fabrikamb2c.onmicrosoft.com` is located at:

`https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is `jwks_uri`, whose value for the same user flow would be:

`https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

To determine which user flow was used in signing an ID token (and from where to get the metadata), you have two options. First, the user flow name is included in the `acr` claim in the ID token. Your other option is to encode the user flow in the value of the `state` parameter when you issue the request, and then decode it to determine which user flow was used. Either method is valid.

After you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA 256 public keys to validate the signature of the ID token. There might be multiple keys listed at this endpoint, each identified by a `kid` claim. The header of the ID token also contains a `kid` claim, which indicates which of these keys was used to sign the ID token.

After you've validated the signature of the ID token, there are several claims that you need to verify. For instance:

- Validate the `nonce` claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
- Validate the `aud` claim to ensure that the ID token was issued for your application. Its value should be the application ID of your application.
- Validate the `iat` and `exp` claims to make sure that the ID token hasn't expired.

There are also several more validations that you should perform. The validations are described in detail in the [OpenID Connect Core Spec](https://openid.net/specs/openid-connect-core-1_0.html). You might also want to validate additional claims, depending on your scenario. Some common validations include:

- Ensuring that the user/organization has signed up for the application.
- Ensuring that the user has proper authorization/privileges.
- Ensuring that a certain strength of authentication has occurred, such as Azure Multi-Factor Authentication.

After you validate the ID token, you can begin a session with the user. You can use the claims in the ID token to obtain information about the user in your application. Uses for this information include display, records, and authorization.

## Get a token

If you need your web application to only run user flows, you can skip the next few sections. These sections are applicable only to web applications that need to make authenticated calls to a web API and are also protected by Azure AD B2C.

You can redeem the authorization code that you acquired (by using `response_type=code+id_token`) for a token to the desired resource by sending a `POST` request to the `/token` endpoint. In Azure AD B2C, you can [request access tokens for other API's](active-directory-b2c-access-tokens.md#request-a-token) as usual by specifying their scope(s) in the request.

You can also request an access token for your app's own back-end Web API by convention of using the app's client ID as the requested scope (which will result in an access token with that client ID as the "audience"):

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| p | Yes | The user flow that was used to acquire the authorization code. You can't use a different user flow in this request. Add this parameter to the query string, not to the POST body. |
| client_id | Yes | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your application. |
| grant_type | Yes | The type of grant, which must be `authorization_code` for the authorization code flow. |
| scope | No | A space-separated list of scopes. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of id_token parameters. It can be used to get tokens to your application's own back-end web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your application needs a refresh token for extended access to resources. |
| code | Yes | The authorization code that you acquired in the beginning of the user flow. |
| redirect_uri | Yes | The `redirect_uri` parameter of the application where you received the authorization code. |
| client_secret | Yes | The application secret that was generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. Change this client secret on a periodic basis. |

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
| --------- | ----------- |
| not_before | The time at which the token is considered valid, in epoch time. |
| token_type | The token type value. `Bearer` is the only type that is supported. |
| access_token | The signed JWT token that you requested. |
| scope | The scopes for which the token is valid. |
| expires_in | The length of time that the access token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh token. The application can use this token to acquire additional tokens after the current token expires. Refresh tokens can be used to retain access to resources for extended periods of time. The scope `offline_access` must have been used in both the authorization and token requests in order to receive a refresh token. |

Error responses look like:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --------- | ----------- |
| error | A code that can be used to classify types of errors that occur. |
| error_description | A message that can help identify the root cause of an authentication error. |

## Use the token

Now that you've successfully acquired an access token, you can use the token in requests to your back-end web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## Refresh the token

ID tokens expire in a short period of time. Refresh the tokens after they expire to continue being able to access resources. You can refresh a token by submitting another `POST` request to the `/token` endpoint. This time, provide the `refresh_token` parameter instead of the `code` parameter:

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=openid offline_access&refresh_token=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_secret=<your-application-secret>
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| p | Yes | The user flow that was used to acquire the original refresh token. You can't use a different user flow in this request. Add this parameter to the query string, not to the POST body. |
| client_id | Yes | The application ID that the [Azure portal](https://portal.azure.com/) assigned to your application. |
| grant_type | Yes | The type of grant, which must be a refresh token for this part of the authorization code flow. |
| scope | No | A space-separated list of scopes. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. It can be used to send tokens to your application's own back-end web API, which is represented by the same application ID as the client. The `offline_access` scope indicates that your application needs a refresh token for extended access to resources. |
| redirect_uri | No | The `redirect_uri` parameter of the application where you received the authorization code. |
| refresh_token | Yes | The original refresh token that was acquired in the second part of the flow. The `offline_access` scope must be used in both the authorization and token requests in order to receive a refresh token. |
| client_secret | Yes | The application secret that was generated in the [Azure portal](https://portal.azure.com/). This application secret is an important security artifact. You should store it securely on your server. Change this client secret on a periodic basis. |

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
| --------- | ----------- |
| not_before | The time at which the token is considered valid, in epoch time. |
| token_type | The token type value. `Bearer` is the only type that is supported. |
| access_token | The signed JWT token that was requested. |
| scope | The scope for which the token is valid. |
| expires_in | The length of time that the access token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh token. The application can use this token to acquire additional tokens after the current token expires. Refresh tokens can be used to retain access to resources for extended periods of time. |

Error responses look like:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --------- | ----------- |
| error | A code that can be used to classify types of errors that occur. |
| error_description | A message that can help identify the root cause of an authentication error. |

## Send a sign-out request

When you want to sign the user out of the application, it isn't enough to clear the application's cookies or otherwise end the session with the user. Redirect the user to Azure AD B2C to sign out. If you fail to do so, the user might be able to reauthenticate to your application without entering their credentials again.

You can simply redirect the user to the `end_session` endpoint that is listed in the OpenID Connect metadata document described earlier:

```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| p | Yes | The user flow that you want to use to sign the user out of your application. |
| post_logout_redirect_uri | No | The URL that the user should be redirected to after successful sign out. If it isn't included, Azure AD B2C shows the user a generic message. |

Directing the user to the `end_session` endpoint clears some of the user's single sign-on state with Azure AD B2C, but it doesn't sign the user out of their social identity provider (IDP) session. If the user selects the same IDP during a subsequent sign-in, they are reauthenticated, without entering their credentials. If a user wants to sign out of the application, it doesn't necessarily mean they want to sign out of their Facebook account. However, if local accounts are used, the user's session ends properly.

