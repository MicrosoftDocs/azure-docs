---
title: Authorization code flow - Azure Active Directory B2C | Microsoft Docs
description: Learn how to build web apps by using Azure AD B2C and OpenID Connect authentication protocol.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/19/2019
ms.author: marsma
ms.subservice: B2C
ms.custom: fasttrack-edit
---

# OAuth 2.0 authorization code flow in Azure Active Directory B2C

You can use the OAuth 2.0 authorization code grant in apps installed on a device to gain access to protected resources, such as web APIs. By using the Azure Active Directory B2C (Azure AD B2C) implementation of OAuth 2.0, you can add sign-up, sign-in,
and other identity management tasks to your mobile and desktop apps. This article is language-independent. In the article, we describe how to send and receive HTTP messages without using any open-source libraries.

The OAuth 2.0 authorization code flow is described in [section 4.1 of the OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749). You can use it for authentication and authorization in most [application types](active-directory-b2c-apps.md), including web applications and natively installed applications. You can use the OAuth 2.0 authorization code flow to securely acquire access tokens and refresh tokens for your applications, which can be used to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md).  The refresh token allows the client to acquire new access (and refresh) tokens once the access token expires, typically after one hour.

This article focuses on the **public clients** OAuth 2.0 authorization code flow. A public client is any client application that cannot be trusted to securely maintain the integrity of a secret password. This includes mobile apps, desktop applications, and essentially any application that runs on a device and needs to get access tokens. 

> [!NOTE]
> To add identity management to a web app by using Azure AD B2C, use [OpenID Connect](active-directory-b2c-reference-oidc.md) instead of OAuth 2.0.

Azure AD B2C extends the standard OAuth 2.0 flows to do more than simple authentication and authorization. It introduces the [user flow parameter](active-directory-b2c-reference-policies.md). With user flows, you can use OAuth 2.0 to add user experiences to your application, such as sign-up, sign-in, and profile management. Identity providers that use the OAuth 2.0 protocol include [Amazon](active-directory-b2c-setup-amzn-app.md), [Azure Active Directory](active-directory-b2c-setup-oidc-azure-active-directory.md), [Facebook](active-directory-b2c-setup-fb-app.md), [GitHub](active-directory-b2c-setup-github-app.md), [Google](active-directory-b2c-setup-goog-app.md), and [LinkedIn](active-directory-b2c-setup-li-app.md).

In the example HTTP requests in this article, we use our sample Azure AD B2C directory, **fabrikamb2c.onmicrosoft.com**. We also use our sample application and user flows. You can try the requests yourself by using these values, or you can replace them with your own values.
Learn how to [get your own Azure AD B2C directory, application, and user flows](#use-your-own-azure-ad-b2c-directory).

## 1. Get an authorization code
The authorization code flow begins with the client directing the user to the `/authorize` endpoint. This is the interactive part of the flow, where the user takes action. In this request, the client indicates in the `scope` parameter the permissions that it needs to acquire from the user. In the `p` parameter, it indicates the user flow to execute. The following three examples (with line breaks for readability) each use a different user flow.

### Use a sign-in user flow
```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_sign_in
```

### Use a sign-up user flow
```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_sign_up
```

### Use an edit-profile user flow
```
GET https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_edit_profile
```

| Parameter | Required? | Description |
| --- | --- | --- |
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| response_type |Required |The response type, which must include `code` for the authorization code flow. |
| redirect_uri |Required |The redirect URI of your app, where authentication responses are sent and received by your app. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL-encoded. |
| scope |Required |A space-separated list of scopes. A single scope value indicates to Azure Active Directory (Azure AD) both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an access token that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app needs a refresh token for long-lived access to resources. You also can use the `openid` scope to request an ID token from Azure AD B2C. |
| response_mode |Recommended |The method that you use to send the resulting authorization code back to your app. It can be `query`, `form_post`, or `fragment`. |
| state |Recommended |A value included in the request that can be a string of any content that you want to use. Usually, a randomly generated unique value is  used, to prevent cross-site request forgery attacks. The state also is used to encode information about the user's state in the app before the authentication request occurred. For example, the page the user was on, or the user flow that was being executed. |
| p |Required |The user flow that is executed. It's the name of a user flow that is created in your Azure AD B2C directory. The user flow name value should begin with **b2c\_1\_**. To learn more about user flows, see [Azure AD B2C user flows](active-directory-b2c-reference-policies.md). |
| prompt |Optional |The type of user interaction that is required. Currently, the only valid value is `login`, which forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user is asked to complete the user flow's workflow. This might involve the user entering their username and password, signing in with a social identity, signing up for the directory, or any other number of steps. User actions depend on how the user flow is defined.

After the user completes the user flow, Azure AD returns a response to your app at the value you used for `redirect_uri`. It uses the method specified in the `response_mode` parameter. The response is exactly the same for each of the user action scenarios, independent of the user flow that was executed.

A successful response that uses `response_mode=query` looks like this:

```
GET urn:ietf:wg:oauth:2.0:oob?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...        // the authorization_code, truncated
&state=arbitrary_data_you_can_receive_in_the_response                // the value provided in the request
```

| Parameter | Description |
| --- | --- |
| code |The authorization code that the app requested. The app can use the authorization code to request an access token for a target resource. Authorization codes are very short-lived. Typically, they expire after about 10 minutes. |
| state |See the full description in the table in the preceding section. If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |

Error responses also can be sent to the redirect URI so that the app can handle them appropriately:

```
GET urn:ietf:wg:oauth:2.0:oob?
error=access_denied
&error_description=The+user+has+cancelled+entering+self-asserted+information
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --- | --- |
| error |An error code string that you can use to classify the types of errors that occur. You also can use the string to react to errors. |
| error_description |A specific error message that can help you identify the root cause of an authentication error. |
| state |See the full description in the preceding table. If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |

## 2. Get a token
Now that you've acquired an authorization code, you can redeem the `code` for a token to the intended resource by sending a POST request to the `/token` endpoint. In Azure AD B2C, you can [request access tokens for other API's](active-directory-b2c-access-tokens.md#request-a-token) as usual by specifying their scope(s) in the request.

You can also request an access token for your app's own back-end Web API by convention of using the app's client ID as the requested scope (which will result in an access token with that client ID as the "audience"):

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob

```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The user flow that was used to acquire the authorization code. You cannot use a different user flow in this request. Note that you add this parameter to the *query string*, not in the POST body. |
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| grant_type |Required |The type of grant. For the authorization code flow, the grant type must be `authorization_code`. |
| scope |Recommended |A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an access token that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app needs a refresh token for long-lived access to resources.  You also can use the `openid` scope to request an ID token from Azure AD B2C. |
| code |Required |The authorization code that you acquired in the first leg of the flow. |
| redirect_uri |Required |The redirect URI of the application where you received the authorization code. |

A successful token response looks like this:

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
| token_type |The token type value. The only type that Azure AD supports is Bearer. |
| access_token |The signed JSON Web Token (JWT) that you requested. |
| scope |The scopes that the token is valid for. You also can use scopes to cache tokens for later use. |
| expires_in |The length of time that the token is valid (in seconds). |
| refresh_token |An OAuth 2.0 refresh token. The app can use this token to acquire additional tokens after the current token expires. Refresh tokens are long-lived. You can use them to retain access to resources for extended periods of time. For more information, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |

Error responses look like this:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --- | --- |
| error |An error code string that you can use to classify the types of errors that occur. You also can use the string to react to errors. |
| error_description |A specific error message that can help you identify the root cause of an authentication error. |

## 3. Use the token
Now that you've successfully acquired an access token, you can use the token in requests to your back-end web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## 4. Refresh the token
Access tokens and ID tokens are short-lived. After they expire, you must refresh them to continue to access resources. To do this, submit another POST request to the `/token` endpoint. This time, provide the `refresh_token` instead of the `code`:

```
POST fabrikamb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_sign_in HTTP/1.1
Host: https://fabrikamb2c.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&client_secret=JqQX2PNo9bpM0uEihUPzyrh&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&refresh_token=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The user flow that was used to acquire the original refresh token. You cannot use a different user flow in this request. Note that you add this parameter to the *query string*, not in the POST body. |
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| client_secret |Required |The client_secret associated to your client_id in the [Azure portal](https://portal.azure.com). |
| grant_type |Required |The type of grant. For this leg of the authorization code flow, the grant type must be `refresh_token`. |
| scope |Recommended |A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an access token that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app will need a refresh token for long-lived access to resources.  You also can use the `openid` scope to request an ID token from Azure AD B2C. |
| redirect_uri |Optional |The redirect URI of the application where you received the authorization code. |
| refresh_token |Required |The original refresh token that you acquired in the second leg of the flow. |

A successful token response looks like this:

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
| token_type |The token type value. The only type that Azure AD supports is Bearer. |
| access_token |The signed JWT that you requested. |
| scope |The scopes that the token is valid for. You also can use the scopes to cache tokens for later use. |
| expires_in |The length of time that the token is valid (in seconds). |
| refresh_token |An OAuth 2.0 refresh token. The app can use this token to acquire additional tokens after the current token expires. Refresh tokens are long-lived, and can be used to retain access to resources for extended periods of time. For more information, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |

Error responses look like this:

```
{
    "error": "access_denied",
    "error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| --- | --- |
| error |An error code string that you can use to classify types of errors that occur. You also can use the string to react to errors. |
| error_description |A specific error message that can help you identify the root cause of an authentication error. |

## Use your own Azure AD B2C directory
To try these requests yourself, complete the following steps. Replace the example values we used in this article with your own values.

1. [Create an Azure AD B2C directory](active-directory-b2c-get-started.md). Use the name of your directory in the requests.
2. [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID and a redirect URI. Include a native client in your app.
3. [Create your user flows](active-directory-b2c-reference-policies.md) to obtain your user flow names.

