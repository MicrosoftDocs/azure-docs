---
title: Use Azure AD v2.0 to access secure resources without user interaction | Microsoft Docs
description: Build web applications by using the Azure AD implementation of the OAuth 2.0 authentication protocol.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 9b7cfbd7-f89f-4e33-aff2-414edd584b07
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/07/2017
ms.author: celested
ms.reviewer: hirsin, dastrock
ms.custom: aaddev
---

# Azure Active Directory v2.0 and the OAuth 2.0 client credentials flow
You can use the [OAuth 2.0 client credentials grant](http://tools.ietf.org/html/rfc6749#section-4.4) specified in RFC 6749, sometimes called *two-legged OAuth*, to access web-hosted resources by using the identity of an application. This type of grant commonly is used for server-to-server interactions that must run in the background, without immediate interaction with a user. These types of applications often are referred to as *daemons* or *service accounts*.

> [!NOTE]
> The v2.0 endpoint doesn't support all Azure Active Directory scenarios and features. To determine whether you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).
>
>

In the more typical *three-legged OAuth*, a client application is granted permission to access a resource on behalf of a specific user. The permission is delegated from the user to the application, usually during the [consent](v2-permissions-and-consent.md) process. However, in the client credentials flow, permissions are granted directly to the application itself. When the app presents a token to a resource, the resource enforces that the app itself has authorization to perform an action, and not that the user has authorization.

## Protocol diagram
The entire client credentials flow looks similar to the next diagram. We describe each of the steps later in this article.

![Client credentials flow](./media/v2-oauth2-client-creds-grant-flow/convergence_scenarios_client_creds.png)

## Get direct authorization
An app typically receives direct authorization to access a resource in one of two ways: through an access control list (ACL) at the resource, or through application permission assignment in Azure Active Directory (Azure AD). These two methods are the most common in Azure AD, and we recommend them for clients and resources that perform the client credentials flow. A resource can choose to authorize its clients in other ways, however. Each resource server can choose the method that makes the most sense for its application.

### Access control lists
A resource provider might enforce an authorization check based on a list of Application IDs that it knows and grants a specific level of access to. When the resource receives a token from the v2.0 endpoint, it can decode the token and extract the client's Application ID from the `appid` and `iss` claims. Then it compares the application against an ACL that it maintains. The ACL's granularity and method might vary substantially between resources.

A common use case is to use an ACL to run tests for a web application or for a Web API. The Web API might grant only a subset of full permissions to a specific client. To run end-to-end tests on the API, create a test client that acquires tokens from the v2.0 endpoint and then sends them to the API. The API then checks the ACL for the test client's Application ID for full access to the API's entire functionality. If you use this kind of ACL, be sure to validate not only the caller's `appid` value. Also validate that the `iss` value of the token is trusted.

This type of authorization is common for daemons and service accounts that need to access data owned by consumer users who have personal Microsoft accounts. For data owned by organizations, we recommend that you get the necessary authorization through application permissions.

### Application permissions
Instead of using ACLs, you can use APIs to expose a set of application permissions. An application permission is granted to an application by an organization's administrator, and can be used only to access data owned by that organization and its employees. For example, Microsoft Graph exposes several application permissions to do the following:

* Read mail in all mailboxes
* Read and write mail in all mailboxes
* Send mail as any user
* Read directory data

For more information about application permissions, go to [Microsoft Graph](https://graph.microsoft.io).

To use application permissions in your app, do the steps we discuss in the next sections.

#### Request the permissions in the app registration portal
1. Go to your application in the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList), or [create an app](quickstart-v2-register-an-app.md), if you haven't already. You'll need to use at least one Application Secret when you create your app.
2. Locate the **Microsoft Graph Permissions** section, and then add the **application permissions** that your app requires.
3. **Save** the app registration.

#### Recommended: Sign the user in to your app
Typically, when you build an application that uses application permissions, the app requires a page or view on which the admin approves the app's permissions. This page can be part of the app's sign-in flow, part of the app's settings, or it can be a dedicated "connect" flow. In many cases, it makes sense for the app to show this "connect" view only after a user has signed in with a work or school Microsoft account.

If you sign the user in to your app, you can identify the organization to which the user belongs before you ask the user to approve the application permissions. Although not strictly necessary, it can help you create a more intuitive experience for your users. To sign the user in, follow our [v2.0 protocol tutorials](active-directory-v2-protocols.md).

#### Request the permissions from a directory admin
When you're ready to request permissions from the organization's admin, you can redirect the user to the v2.0 *admin consent endpoint*.

```
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/adminconsent?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&state=12345
&redirect_uri=http://localhost/myapp/permissions
```

```
// Pro tip: Try pasting the following request in a browser!
```

```
https://login.microsoftonline.com/common/adminconsent?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&state=12345&redirect_uri=http://localhost/myapp/permissions
```

| Parameter | Condition | Description |
| --- | --- | --- |
| tenant |Required |The directory tenant that you want to request permission from. This can be in GUID or friendly name format. If you don't know which tenant the user belongs to and you want to let them sign in with any tenant, use `common`. |
| client_id |Required |The Application ID that the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) assigned to your app. |
| redirect_uri |Required |The redirect URI where you want the response to be sent for your app to handle. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL encoded, and it can have additional path segments. |
| state |Recommended |A value that is included in the request that also is returned in the token response. It can be a string of any content that you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |

At this point, Azure AD enforces that only a tenant administrator can sign in to complete the request. The administrator will be asked to approve all the direct application permissions that you have requested for your app in the app registration portal.

##### Successful response
If the admin approves the permissions for your application, the successful response looks like this:

```
GET http://localhost/myapp/permissions?tenant=a8990e1f-ff32-408a-9f8e-78d3b9139b95&state=state=12345&admin_consent=True
```

| Parameter | Description |
| --- | --- | --- |
| tenant |The directory tenant that granted your application the permissions that it requested, in GUID format. |
| state |A value that is included in the request that also is returned in the token response. It can be a string of any content that you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| admin_consent |Set to **true**. |

##### Error response
If the admin does not approve the permissions for your application, the failed response looks like this:

```
GET http://localhost/myapp/permissions?error=permission_denied&error_description=The+admin+canceled+the+request
```

| Parameter | Description |
| --- | --- | --- |
| error |An error code string that you can use to classify types of errors, and which you can use to react to errors. |
| error_description |A specific error message that can help you identify the root cause of an error. |

After you've received a successful response from the app provisioning endpoint, your app has gained the direct application permissions that it requested. Now you can request a token for the resource that you want.

## Get a token
After you've acquired the necessary authorization for your application, proceed with acquiring access tokens for APIs. To get a token by using the client credentials grant, send a POST request to the `/token` v2.0 endpoint:

### First case: Access token request with a shared secret

```
POST /{tenant}/oauth2/v2.0/token HTTP/1.1           //Line breaks for clarity
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=535fb089-9ff3-47b6-9bfb-4f1264799865
&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_secret=qWgdYAmab0YSkuL1qKv5bPX
&grant_type=client_credentials
```

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id=535fb089-9ff3-47b6-9bfb-4f1264799865&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=qWgdYAmab0YSkuL1qKv5bPX&grant_type=client_credentials' 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
```

| Parameter | Condition | Description |
| --- | --- | --- |
| tenant |Required | The directory tenant the application plans to operate against, in GUID or domain-name format. |
| client_id |Required |The Application ID that the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) assigned to your app. |
| scope |Required |The value passed for the `scope` parameter in this request should be the resource identifier (Application ID URI) of the resource you want, affixed with the `.default` suffix. For the Microsoft Graph example, the value is `https://graph.microsoft.com/.default`. This value informs the v2.0 endpoint that of all the direct application permissions you have configured for your app, it should issue a token for the ones associated with the resource you want to use. |
| client_secret |Required |The Application Secret that you generated for your app in the app registration portal. The client secret must be URL-encoded before being sent.|
| grant_type |Required |Must be `client_credentials`. |

### Second case: Access token request with a certificate

```
POST /{tenant}/oauth2/v2.0/token HTTP/1.1               // Line breaks for clarity
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_id=97e0a5b7-d745-40b6-94fe-5f77d35c6e05
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&grant_type=client_credentials
```

| Parameter | Condition | Description |
| --- | --- | --- |
| tenant |Required | The directory tenant the application plans to operate against, in GUID or domain-name format. |
| client_id |Required |The Application ID that the [Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) assigned to your app. |
| scope |Required |The value passed for the `scope` parameter in this request should be the resource identifier (Application ID URI) of the resource you want, affixed with the `.default` suffix. For the Microsoft Graph example, the value is `https://graph.microsoft.com/.default`. This value informs the v2.0 endpoint that of all the direct application permissions you have configured for your app, it should issue a token for the ones associated with the resource you want to use. |
| client_assertion_type |required |The value must be `urn:ietf:params:oauth:client-assertion-type:jwt-bearer` |
| client_assertion |required | An assertion (a JSON Web Token) that you need to create and sign with the certificate you registered as credentials for your application. Read about [certificate credentials](active-directory-certificate-credentials.md) to learn how to register your certificate and the format of the assertion.|
| grant_type |Required |Must be `client_credentials`. |

Notice that the parameters are almost the same as in the case of the request by shared secret except that the client_secret parameter is replaced by two parameters: a client_assertion_type and client_assertion.

### Successful response
A successful response looks like this:

```
{
  "token_type": "Bearer",
  "expires_in": 3599,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBP..."
}
```

| Parameter | Description |
| --- | --- |
| access_token |The requested access token. The app can use this token to authenticate to the secured resource, such as to a Web API. |
| token_type |Indicates the token type value. The only type that Azure AD supports is `bearer`. |
| expires_in |How long the access token is valid (in seconds). |

### Error response
An error response looks like this:

```
{
  "error": "invalid_scope",
  "error_description": "AADSTS70011: The provided value for the input parameter 'scope' is not valid. The scope https://foo.microsoft.com/.default is not valid.\r\nTrace ID: 255d1aef-8c98-452f-ac51-23d051240864\r\nCorrelation ID: fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7\r\nTimestamp: 2016-01-09 02:02:12Z",
  "error_codes": [
    70011
  ],
  "timestamp": "2016-01-09 02:02:12Z",
  "trace_id": "255d1aef-8c98-452f-ac51-23d051240864",
  "correlation_id": "fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7"
}
```

| Parameter | Description |
| --- | --- |
| error |An error code string that you can use to classify types of errors that occur, and to react to errors. |
| error_description |A specific error message that might help you identify the root cause of an authentication error. |
| error_codes |A list of STS-specific error codes that might help with diagnostics. |
| timestamp |The time at which the error occurred. |
| trace_id |A unique identifier for the request that might help with diagnostics. |
| correlation_id |A unique identifier for the request that might help with diagnostics across components. |

## Use a token
Now that you've acquired a token, use the token to make requests to the resource. When the token expires, repeat the request to the `/token` endpoint to acquire a fresh access token.

```
GET /v1.0/me/messages
Host: https://graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

```
// Pro tip: Try the following command! (Replace the token with your own.)
```

```
curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q" 'https://graph.microsoft.com/v1.0/me/messages'
```

## Code sample
To see an example of an application that implements the client credentials grant by using the admin consent endpoint, see our [v2.0 daemon code sample](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).
