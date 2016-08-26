<properties
	pageTitle="Azure Active Directory B2C  | Microsoft Azure"
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

# Azure Active Directory B2C: OAuth 2.0 authorization code flow

The OAuth 2.0 authorization code grant can be used in apps that are installed on a device to gain access to protected resources, such as web APIs. By using the Azure Active Directory (Azure AD) B2C implementation of OAuth 2.0, you can add sign-up, sign-in,
and other identity management tasks to your mobile and desktop apps. This guide is language independent. It describes how to send and receive HTTP messages without using any of our open-source libraries.

<!-- TODO: Need link to libraries -->

The OAuth 2.0 authorization code flow is described in [section 4.1 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749). You can use it to perform authentication and authorization in the majority of app types, including [web apps](active-directory-b2c-apps.md#web-apps) and [natively installed apps](active-directory-b2c-apps.md#mobile-and-native-apps). It enables apps to securely acquire **access_tokens**, which can be used to access resources that are secured by an [authorization server](active-directory-b2c-reference-protocols.md#the-basics).

This guide will focus on a particular flavor of the OAuth 2.0 authorization code flow--**public clients**. A public client is any client application that cannot be trusted to securely maintain the integrity of a secret password. This includes mobile apps, desktop apps, and pretty much any application that runs on a device and needs to get access_tokens. If you want to add identity management to a web app by using Azure AD B2C, you should use [OpenID Connect](active-directory-b2c-reference-oidc.md) rather than OAuth 2.0.

Azure AD B2C extends the standard OAuth 2.0 flows to do more than simple authentication and authorization. It introduces the [**policy parameter**](active-directory-b2c-reference-policies.md),
which enables you to use OAuth 2.0 to add user experiences to your app, such as sign-up, sign-in, and profile management. Here we'll show how to use OAuth 2.0 and policies to implement each of these experiences in your native applications. We'll also show how to get access_tokens for accessing web APIs.

The example HTTP requests below will use our sample B2C directory, **fabrikamb2c.onmicrosoft.com**, as well as our sample application and policies. You're free to try the requests out yourself by using these values, or you can replace them with your own.
Learn how to [get your own B2C directory, application, and policies](#use-your-own-b2c-directory).

## 1. Get an authorization code
The authorization code flow begins with the client directing the user to the `/authorize` endpoint. This is the interactive part of the flow, where the user will actually take action. In this request, the client indicates the permissions that it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter. Three examples are provided below (with line breaks for readability), each using a different policy.

#### Use a sign-in policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
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
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_sign_up
```

#### Use an edit-profile policy

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=code
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&response_mode=query
&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&p=b2c_1_edit_profile
```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | ----------------------- |
| client_id | Required | The application ID that the [Azure portal](https://portal.azure.com) assigned to your app. |
| response_type | Required | The response type, which must include `code` for the authorization code flow. |
| redirect_uri | Required | The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris that you registered in the portal, except that it must be URL encoded. |
| scope | Required | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an **access token** that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  You can also use the `openid` scope to request an **id_token** from Azure AD B2C. |
| response_mode | Recommended | The method that should be used to send the resulting authorization_code back to your app. It can be one of 'query', 'form_post', or 'fragment'.
| state | Recommended | A value included in the request that will also be returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on or the policy being executed. |
| p | Required | The policy that will be executed. It is the name of a policy that is created in your B2C directory. The policy name value should begin with "b2c\_1\_". Learn more about policies in [Extensible policy framework](active-directory-b2c-reference-policies.md). |
| prompt | Optional | The type of user interaction that is required. The only valid value at this time is 'login', which forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user will be asked to complete the policy's workflow. This may involve the user entering their user name and password, signing in with a social identity, signing up for the directory, or any other number of steps, depending on how the policy is defined.

After the user completes the policy, Azure AD will return a response to your app at the indicated `redirect_uri`, by using the method specified in the `response_mode` parameter. The response will be exactly the same for each of the above cases, independent of the policy that was executed.

A successful response that uses `response_mode=query` looks like:

```
GET urn:ietf:wg:oauth:2.0:oob?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...        // the authorization_code, truncated
&state=arbitrary_data_you_can_receive_in_the_response                // the value provided in the request
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| code | The authorization_code that the app requested. The app can use the authorization code to request an access_token for a target resource. Authorization_codes are very short lived. Typically, they expire after about 10 minutes. |
| state | See the full description in the previous table. If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and the response are identical. |

Error responses may also be sent to the `redirect_uri` so that the app can handle them appropriately:

```
GET urn:ietf:wg:oauth:2.0:oob?
error=access_denied
&error_description=The+user+has+cancelled+entering+self-asserted+information
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify the types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer to identify the root cause of an authentication error. |
| state | See the full description in the first table in this section. If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and the response are identical. |


## 2. Get a token
Now that you've acquired an authorization_code, you can redeem the `code` for a token to the desired resource by sending a `POST` request to the `/token` endpoint. In Azure AD B2C, the only resource that you can request a token for is your app's own backend web API. The convention that is used for requesting a token to yourself is to use your app's client ID as the scope:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob

```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | --------------------- |
| p | Required | The policy that was used to acquire the authorization code. You cannot use a different policy in this request. Note that you add this parameter to the *query string*, not in the POST body. |
| client_id | Required | The application ID that the [Azure portal](https://portal.azure.com) assigned to your app. |
| grant_type | Required | The type of grant, which must be `authorization_code` for the authorization code flow. |
| scope | Reccommended | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an **access token** that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  You can also use the `openid` scope to request an **id_token** from Azure AD B2C. |
| code | Required | The authorization_code that you acquired in the first leg of the flow. |
| redirect_uri | Required | The redirect_uri of the application where you received the authorization_code. |

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
| access_token | The signed JSON Web Token (JWT) token that you requested. |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| expires_in | The length of time that the token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh_token. The app can use this token to acquire additional tokens after the current token expires. Refresh_tokens are long lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). |

Error responses will look like:

```
{
	"error": "access_denied",
	"error_description": "The user revoked access to the app.",
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify the types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer to identify the root cause of an authentication error. |

## 3. Use the token
Now that you've successfully acquired an `access_token`, you can use the token in requests to your backend web APIs by including it in the `Authorization` header:

```
GET /tasks
Host: https://mytaskwebapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## 4. Refresh the token
Access & Id tokens are short lived. You must refresh them after they expire to continue being able to access resources. You can do so by submitting another `POST` request to the `/token` endpoint. This time provide the `refresh_token` instead of the `code`:

```
POST fabrikamb2c.onmicrosoft.com/v2.0/oauth2/token?p=b2c_1_sign_in HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6&scope=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access&refresh_token=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

| Parameter | Required? | Description |
| ----------------------- | ------------------------------- | -------- |
| p | Required | The policy that was used to acquire the original refresh_token. You cannot use a different policy in this request. Note that you add this parameter to the *query string*, not in the POST body. |
| client_id | Recommended | The application ID that the [Azure portal](https://portal.azure.com) assigned to your app. |
| grant_type | Required | The type of grant, which must be `refresh_token` for this leg of the authorization code flow. |
| scope | Recommended | A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. Using the client ID as the scope indicates that your app needs an **access token** that can be used against your own service or web API, represented by the same client ID.  The `offline_access` scope indicates that your app will need a **refresh_token** for long-lived access to resources.  You can also use the `openid` scope to request an **id_token** from Azure AD B2C. |
| redirect_uri | Optional | The redirect_uri of the application where you received the authorization_code. |
| refresh_token | Required | The original refresh_token that you acquired in the second leg of the flow. |

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
| access_token | The signed JSON Web Token (JWT) token that you requested. |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| expires_in | The length of time that the token is valid (in seconds). |
| refresh_token | An OAuth 2.0 refresh_token. The app can use this token to acquire additional tokens after the current token expires. Refresh_tokens are long lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [B2C token reference](active-directory-b2c-reference-tokens.md). |

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

## Use your own B2C directory

If you want to try these requests for yourself, you must first perform these three steps, and then replace the example values above with your own:

- [Create a B2C directory](active-directory-b2c-get-started.md) and use the name of your directory in the requests.
- [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID and a redirect_uri. You will want to include a **native client** in your app.
- [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.
