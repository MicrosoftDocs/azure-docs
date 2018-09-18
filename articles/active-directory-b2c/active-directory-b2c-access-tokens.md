---
title: Requesting access tokens in Azure Active Directory B2C | Microsoft Docs
description: This article will show you how to setup a client application and acquire an access token.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/09/2017
ms.author: davidmu
ms.component: B2C

---
# Azure AD B2C: Requesting access tokens

An access token (denoted as **access\_token** in the responses from Azure AD B2C) is a form of security token that a client can use to access resources that are secured by an [authorization server](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-protocols#the-basics), such as a web API. Access tokens are represented as [JWTs](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-tokens#types-of-tokens) and contain information about the intended resource server and the granted permissions to the server. When calling the resource server, the access token must be present in the HTTP request.

This article discusses how to configure a client application and web API in order to obtain an **access\_token**.

> [!NOTE]
> **Web API chains (On-Behalf-Of) is not supported by Azure AD B2C.**
>
> Many architectures include a web API that needs to call another downstream web API, both secured by Azure AD B2C. This scenario is common in native clients that have a web API back end, which in turn calls a Microsoft online service such as the Azure AD Graph API.
>
> This chained web API scenario can be supported by using the OAuth 2.0 JWT Bearer Credential grant, otherwise known as the On-Behalf-Of flow. However, the On-Behalf-Of flow is not currently implemented in Azure AD B2C.

## Register a web API and publish permissions

Before requesting an access token, you first need to register a web API and publish permissions (scopes) that can be granted to the client application.

### Register a web API

1. On the Azure AD B2C features menu on the Azure portal, click **Applications**.
1. Click **+Add** at the top of the menu.
1. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso API".
1. Toggle the **Include web app / web API** switch to **Yes**.
1. Enter an arbitrary value for the **Reply URLs**. For example, enter `https://localhost:44316/`. The value does not matter since an API should not be receiving the token directly from Azure AD B2C.
1. Enter an **App ID URI**. This is the identifier used for your web API. For example, enter 'notes' in the box. The **App ID URI** would then be `https://{tenantName}.onmicrosoft.com/notes`.
1. Click **Create** to register your application.
1. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.

### Publishing permissions

Scopes, which are analogous to permissions, are necessary when your app is calling an API. Some examples of scopes are "read" or "write". Suppose you want your web or native app to "read" from an API. Your app would call Azure AD B2C and request an access token that gives access to the scope "read". In order for Azure AD B2C to emit such an access token, the app needs to be granted permission to "read" from the specific API. To do this, your API first needs to publish the "read" scope.

1. Within the Azure AD B2C **Applications** menu, open the web API application ("Contoso API").
1. Click on **Published scopes**. This is where you define the permissions (scopes) that can be granted to other applications.
1. Add **Scope Values** as necessary (for example, "read"). By default, the "user_impersonation" scope will be defined. You can ignore this if you wish. Enter a description of the scope in the **Scope Name** column.
1. Click **Save**.

> [!IMPORTANT]
> The **Scope Name** is the description of the **Scope Value**. When using the scope, make sure to use the **Scope Value**.

## Grant a native or web app permissions to a web API

Once an API is configured to publish scopes, the client application needs to be granted those scopes via the Azure portal.

1. Navigate to the **Applications** menu in the Azure AD B2C features menu.
1. Register a client application ([web app](active-directory-b2c-app-registration.md#register-a-web-app) or [native client](active-directory-b2c-app-registration.md#register-a-mobile-or-native-app)) if you don’t have one already. If you are following this guide as your starting point, you'll need to register a client application.
1. Click on **API access**.
1. Click on **Add**.
1. Select your web API and the scopes (permissions) you would like to grant.
1. Click **OK**.

> [!NOTE]
> Azure AD B2C does not ask your client application users for their consent. Instead, all consent is provided by the admin, based on the permissions configured between the applications described above. If a permission grant for an application is revoked, all users who were previously able to acquire that permission will no longer be able to do so.

## Requesting a token

When requesting an access token, the client application needs to specify the desired permissions in the **scope** parameter of the request. For example, to specify the **Scope Value** “read” for the API that has the **App ID URI** of `https://contoso.onmicrosoft.com/notes`, the scope would be `https://contoso.onmicrosoft.com/notes/read`. Below is an example of an authorization code request to the `/authorize` endpoint.

> [!NOTE]
> Currently, custom domains are not supported along with access tokens. You must use your tenantName.onmicrosoft.com domain in the request URL.

```
https://<tenantName>.b2clogin.com/tfp/<tenantName>.onmicrosoft.com/<yourPolicyId>/oauth2/v2.0/authorize?client_id=<appID_of_your_client_application>&nonce=anyRandomValue&redirect_uri=<redirect_uri_of_your_client_application>&scope=https%3A%2F%2Fcontoso.onmicrosoft.com%2Fnotes%2Fread&response_type=code 
```

To acquire multiple permissions in the same request, you can add multiple entries in the single **scope** parameter, separated by spaces. For example:

URL decoded:

```
scope=https://contoso.onmicrosoft.com/notes/read openid offline_access
```

URL encoded:

```
scope=https%3A%2F%2Fcontoso.onmicrosoft.com%2Fnotes%2Fread%20openid%20offline_access
```

You may request more scopes (permissions) for a resource than what is granted for your client application. When this is the case, the call will succeed if at least one permission is granted. The resulting **access\_token** will have its “scp” claim populated with only the permissions that were successfully granted.

> [!NOTE] 
> We do not support requesting permissions against two different web resources in the same request. This kind of request will fail.

### Special cases

The OpenID Connect standard specifies several special “scope” values. The following special scopes represent the permission to “access the user’s profile”:

* **openid**: This requests an ID token
* **offline\_access**: This requests a refresh token (using [Auth Code flows](active-directory-b2c-reference-oauth-code.md)).

If the `response_type` parameter in a `/authorize` request includes `token`, the `scope` parameter must include at least one resource scope (other than `openid` and `offline_access`) that will be granted. Otherwise, the `/authorize` request will terminate with a failure.

## The returned token

In a successfully minted **access\_token** (from either the `/authorize` or `/token` endpoint), the following claims will be present:

| Name | Claim | Description |
| --- | --- | --- |
|Audience |`aud` |The **application ID** of the single resource that the token grants access to. |
|Scope |`scp` |The permissions granted to the resource. Multiple granted permissions will be separated by space. |
|Authorized Party |`azp` |The **application ID** of the client application that initiated the request. |

When your API receives the **access\_token**, it must [validate the token](active-directory-b2c-reference-tokens.md) to prove that the token is authentic and has the correct claims.

We are always open to feedback and suggestions! If you have any difficulties with this topic, please post on Stack Overflow using the tag ['azure-ad-b2c'](https://stackoverflow.com/questions/tagged/azure-ad-b2c). For feature requests, add them to [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c).

## Next steps

* Build a web API using [.NET Core](https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi)
* Build a web API using [Node.JS](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi)
