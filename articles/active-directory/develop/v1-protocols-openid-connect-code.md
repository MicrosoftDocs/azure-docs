---
title: Understand the OpenID Connect authentication code flow in Azure AD | Microsoft Docs
description: This article describes how to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure Active Directory and OpenID Connect.
services: active-directory
documentationcenter: .net
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 29142f7e-d862-4076-9a1a-ecae5bcd9d9b
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# Authorize access to web applications using OpenID Connect and Azure Active Directory

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) is a simple identity layer built on top of the OAuth 2.0 protocol. OAuth 2.0 defines mechanisms to obtain and use [**access tokens**](access-tokens.md) to access protected resources, but they do not define standard methods to provide identity information. OpenID Connect implements authentication as an extension to the OAuth 2.0 authorization process. It provides information about the end user in the form of an [`id_token`](id-tokens.md) that verifies the identity of the user and provides basic profile information about the user.

OpenID Connect is our recommendation if you are building a web application that is hosted on a server and accessed via a browser.


[!INCLUDE [active-directory-protocols-getting-started](../../../includes/active-directory-protocols-getting-started.md)] 

## Authentication flow using OpenID Connect

The most basic sign-in flow contains the following steps - each of them is described in detail below.

![OpenId Connect Authentication Flow](./media/v1-protocols-openid-connect-code/active-directory-oauth-code-flow-web-app.png)

## OpenID Connect metadata document

OpenID Connect describes a metadata document that contains most of the information required for an app to perform sign-in. This includes information such as the URLs to use and the location of the service's public signing keys. The OpenID Connect metadata document can be found at:

```
https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration
```
The metadata is a simple JavaScript Object Notation (JSON) document. See the following snippet for an example. The snippet's contents are fully described in the [OpenID Connect specification](https://openid.net). Note that providing tenant rather than `common` in place of {tenant} above will result in tenant-specific URIs in the JSON object returned.

```
{
    "authorization_endpoint": "https://login.microsoftonline.com/common/oauth2/authorize",
    "token_endpoint": "https://login.microsoftonline.com/common/oauth2/token",
    "token_endpoint_auth_methods_supported":
    [
        "client_secret_post",
        "private_key_jwt",
        "client_secret_basic"
    ],
    "jwks_uri": "https://login.microsoftonline.com/common/discovery/keys"
    "userinfo_endpoint":"https://login.microsoftonline.com/{tenant}/openid/userinfo",
    ...
}
```

## Send the sign-in request

When your web application needs to authenticate the user, it must direct the user to the `/authorize` endpoint. This request is similar to the first leg of the [OAuth 2.0 Authorization Code Flow](v1-protocols-oauth-code.md), with a few important distinctions:

* The request must include the scope `openid` in the `scope` parameter.
* The `response_type` parameter must include `id_token`.
* The request must include the `nonce` parameter.

So a sample request would look like this:

```
// Line breaks for legibility only

GET https://login.microsoftonline.com/{tenant}/oauth2/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=id_token
&redirect_uri=http%3A%2F%2Flocalhost%3a12345
&response_mode=form_post
&scope=openid
&state=12345
&nonce=7362CAEA-9CA5-4B43-9BA3-34D7C303EBA7
```

| Parameter |  | Description |
| --- | --- | --- |
| tenant |required |The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are tenant identifiers, for example, `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` or `common` for tenant-independent tokens |
| client_id |required |The Application Id assigned to your app when you registered it with Azure AD. You can find this in the Azure Portal. Click **Azure Active Directory**, click **App Registrations**, choose the application and locate the Application Id on the application page. |
| response_type |required |Must include `id_token` for OpenID Connect sign-in. It may also include other response_types, such as `code` or `token`. |
| scope |required |A space-separated list of scopes. For OpenID Connect, it must include the scope `openid`, which translates to the "Sign you in" permission in the consent UI. You may also include other scopes in this request for requesting consent. |
| nonce |required |A value included in the request, generated by the app, that is included in the resulting `id_token` as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized, unique string or GUID that can be used to identify the origin of the request. |
| redirect_uri |recommended |The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| response_mode |optional |Specifies the method that should be used to send the resulting authorization_code back to your app. Supported values are `form_post` for *HTTP form post* and `fragment` for *URL fragment*. For web applications, we recommend using `response_mode=form_post` to ensure the most secure transfer of tokens to your application. The default for any flow including an id_token is `fragment`.|
| state |recommended |A value included in the request that is returned in the token response. It can be a string of any content that you wish. A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](http://tools.ietf.org/html/rfc6749#section-10.12). The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| prompt |optional |Indicates the type of user interaction that is required. Currently, the only valid values are 'login', 'none', and 'consent'. `prompt=login` forces the user to enter their credentials on that request, negating single-sign on. `prompt=none` is the opposite - it ensures that the user is not presented with any interactive prompt whatsoever. If the request cannot be completed silently via single-sign on, the endpoint returns an error. `prompt=consent` triggers the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app. |
| login_hint |optional |Can be used to pre-fill the username/email address field of the sign-in page for the user, if you know their username ahead of time. Often apps use this parameter during reauthentication, having already extracted the username from a previous sign-in using the `preferred_username` claim. |

At this point, the user is asked to enter their credentials and complete the authentication.

### Sample response

A sample response, after the user has authenticated, could look like this:

```
POST / HTTP/1.1
Host: localhost:12345
Content-Type: application/x-www-form-urlencoded

id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNB...&state=12345
```

| Parameter | Description |
| --- | --- |
| id_token |The `id_token` that the app requested. You can use the `id_token` to verify the user's identity and begin a session with the user. |
| state |A value included in the request that is also returned in the token response. A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](http://tools.ietf.org/html/rfc6749#section-10.12). The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |

### Error response

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
POST / HTTP/1.1
Host: localhost:12345
Content-Type: application/x-www-form-urlencoded

error=access_denied&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |

#### Error codes for authorization endpoint errors

The following table describes the various error codes that can be returned in the `error` parameter of the error response.

| Error Code | Description | Client Action |
| --- | --- | --- |
| invalid_request |Protocol error, such as a missing required parameter. |Fix and resubmit the request. This is a development error, and is typically caught during initial testing. |
| unauthorized_client |The client application is not permitted to request an authorization code. |This usually occurs when the client application is not registered in Azure AD or is not added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| access_denied |Resource owner denied consent |The client application can notify the user that it cannot proceed unless the user consents. |
| unsupported_response_type |The authorization server does not support the response type in the request. |Fix and resubmit the request. This is a development error, and is typically caught during initial testing. |
| server_error |The server encountered an unexpected error. |Retry the request. These errors can result from temporary conditions. The client application might explain to the user that its response is delayed due to a temporary error. |
| temporarily_unavailable |The server is temporarily too busy to handle the request. |Retry the request. The client application might explain to the user that its response is delayed due to a temporary condition. |
| invalid_resource |The target resource is invalid because it does not exist, Azure AD cannot find it, or it is not correctly configured. |This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |

## Validate the id_token

Just receiving an `id_token` is not sufficient to authenticate the user; you must validate the signature and verify the claims in the `id_token` per your app's requirements. The Azure AD endpoint uses JSON Web Tokens (JWTs) and public key cryptography to sign tokens and verify that they are valid.

You can choose to validate the `id_token` in client code, but a common practice is to send the `id_token` to a backend server and perform the validation there. Once you've validated the signature of the `id_token`, there are a few claims you are required to verify.

You may also wish to validate additional claims depending on your scenario. Some common validations include:

* Ensuring the user/organization has signed up for the app.
* Ensuring the user has proper authorization/privileges
* Ensuring a certain strength of authentication has occurred, such as multi-factor authentication.

Once you have validated the `id_token`, you can begin a session with the user and use the claims in the `id_token` to obtain information about the user in your app. This information can be used for display, records, personalization, etc. For more information about `id_tokens` and claims, read [AAD id_tokens](id-tokens.md).

## Send a sign-out request

When you wish to sign the user out of the app, it is not sufficient to clear your app's cookies or otherwise end the session with the user. You must also redirect the user to the `end_session_endpoint` for sign-out. If you fail to do so, the user will be able to reauthenticate to your app without entering their credentials again, because they will have a valid single sign-on session with the Azure AD endpoint.

You can simply redirect the user to the `end_session_endpoint` listed in the OpenID Connect metadata document:

```
GET https://login.microsoftonline.com/common/oauth2/logout?
post_logout_redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F

```

| Parameter |  | Description |
| --- | --- | --- |
| post_logout_redirect_uri |recommended |The URL that the user should be redirected to after successful logout. If not included, the user is shown a generic message. |

## Single sign-out

When you redirect the user to the `end_session_endpoint`, Azure AD clears the user's session from the browser. However, the user may still be signed in to other applications that use Azure AD for authentication. To enable those applications to sign the user out simultaneously, Azure AD sends an HTTP GET request to the registered `LogoutUrl` of all the applications that the user is currently signed in to. Applications must respond to this request by clearing any session that identifies the user and returning a `200` response. If you wish to support single sign out in your application, you must implement such a `LogoutUrl` in your application's code. You can set the `LogoutUrl` from the Azure portal:

1. Navigate to the [Azure Portal](https://portal.azure.com).
2. Choose your Active Directory by clicking on your account in the top right corner of the page.
3. From the left hand navigation panel, choose **Azure Active Directory**, then choose **App registrations** and select your application.
4. Click on **Settings**, then **Properties** and find the **Logout URL** text box. 

## Token Acquisition
Many web apps need to not only sign the user in, but also access a web service on behalf of that user using OAuth. This scenario combines OpenID Connect for user authentication while simultaneously acquiring an `authorization_code` that can be used to get `access_tokens` using the [OAuth Authorization Code Flow](v1-protocols-oauth-code.md#use-the-authorization-code-to-request-an-access-token).

## Get Access Tokens
To acquire access tokens, you need to modify the sign-in request from above:

```
// Line breaks for legibility only

GET https://login.microsoftonline.com/{tenant}/oauth2/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e        // Your registered Application Id
&response_type=id_token+code
&redirect_uri=http%3A%2F%2Flocalhost%3a12345          // Your registered Redirect Uri, url encoded
&response_mode=form_post                              // `form_post' or 'fragment'
&scope=openid
&resource=https%3A%2F%2Fservice.contoso.com%2F        // The identifier of the protected resource (web API) that your application needs access to
&state=12345                                          // Any value, provided by your app
&nonce=678910                                         // Any value, provided by your app
```

By including permission scopes in the request and using `response_type=code+id_token`, the `authorize` endpoint ensures that the user has consented to the permissions indicated in the `scope` query parameter, and return your app an authorization code to exchange for an access token.

### Successful response

A successful response using `response_mode=form_post` looks like:

```
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNB...&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...&state=12345
```

| Parameter | Description |
| --- | --- |
| id_token |The `id_token` that the app requested. You can use the `id_token` to verify the user's identity and begin a session with the user. |
| code |The authorization_code that the app requested. The app can use the authorization code to request an access token for the target resource. Authorization_codes are short lived, and typically expire after about 10 minutes. |
| state |If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

### Error response

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

error=access_denied&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |

For a description of the possible error codes and their recommended client action, see [Error codes for authorization endpoint errors](#error-codes-for-authorization-endpoint-errors).

Once you've gotten an authorization `code` and an `id_token`, you can sign the user in and get [access tokens](access-tokens.md) on their behalf. To sign the user in, you must validate the `id_token` exactly as described above. To get access tokens, you can follow the steps described in the "Use the authorization code to request an access token" section of our [OAuth code flow documentation](v1-protocols-oauth-code.md#use-the-authorization-code-to-request-an-access-token).

## Next steps

* Learn more about the [access tokens](access-tokens.md).
* Learn more about the [`id_token` and claims](id-tokens.md).
