---
title: Authentication and authorization
description: Learn about the various ways an app or service can authenticate to Azure Spatial Anchors, and the levels of control that you have to gate access to Azure Spatial Anchors.
author: craigktreasure
manager: vriveras
services: azure-spatial-anchors

ms.author: crtreasu
ms.date: 05/28/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Authentication and authorization to Azure Spatial Anchors

In this section, we will cover the various ways you can authenticate to Azure Spatial Anchors from your app or web service, and the ways in which you can use Role-Based Access Control in Azure Directory (Azure AD) to control access to your Spatial Anchors accounts.

## Overview

![An overview of authentication to Azure Spatial Anchors](./media/spatial-anchors-authentication-overview.png)

To access a given Azure Spatial Anchors account, clients need to first obtain an access token from Azure Mixed Reality Security Token Service (STS). Tokens obtained from STS live for 24 hours, and contain information for the Spatial Anchors services to make authorization decisions on the account, and ensure that only authorized principals can access that account.

Access tokens can be obtained in exchange from either account keys, or from Azure AD-issued tokens.

Account keys enable you to get quickly started on using the Azure Spatial Anchors service; however, before you deploy your application to production, it is advised that you update your app to use Azure AD-based authentication.

Azure AD authentication tokens can be obtained two ways:

- If you are building an enterprise application, and your company is using Azure AD as its identity system, you may use user-based Azure AD authentication in your app, and grant access to your spatial anchors accounts using your existing Azure AD security groups, or directly to users in your organization.
- Otherwise, it is recommended that you obtain Azure AD tokens from a web service supporting your app. Using a supporting web service is the recommended method of authentication for production applications, as it avoids embedding the credentials for accessing Azure Spatial Anchors in your client application.

## Account keys

Using account keys for access to your Azure Spatial Anchors account is the simplest way to get started. You will find your account keys on the Azure portal. Navigate to your account, and select the “Keys” tab.

![An overview of authentication to Azure Spatial Anchors](../../../includes/media/spatial-anchors-get-started-create-resource/view-account-key.png)

Two keys are made available, which are both simultaneously valid for access to the Spatial Anchors account. It is recommended that you regularly update the key you use to access the account; having two separate valid keys enable such updates without downtime; you only have to update  alternatively the primary key and the secondary key.

The SDK has built-in support for authenticating with account keys; you simply need to set the AccountKey property on your cloudSession object.

# [C#](#tab/csharp)

```csharp
this.cloudSession.Configuration.AccountKey = @"MyAccountKey";
```

# [ObjC](#tab/objc)

```objc
_cloudSession.configuration.accountKey = @"MyAccountKey";
```

# [Swift](#tab/swift)

```swift
_cloudSession!.configuration.accountKey = "MyAccountKey"
```

# [Java](#tab/java)

```java
mCloudSession.getConfiguration().setAccountKey("MyAccountKey");
```

# [C++ NDK](#tab/cpp)

```cpp
auto configuration = cloudSession_->Configuration();
configuration->AccountKey(R"(MyAccountKey)");
```

# [C++ WinRT](#tab/cppwinrt)

```cpp
auto configuration = m_cloudSession.Configuration();
configuration.AccountKey(LR"(MyAccountKey)");
```

---

Once that is done, the SDK will handle the exchange of the account key for an access token, and the necessary caching of tokens for your app.

> [!WARNING]
> Use of account keys is recommended for quick on-boarding, but during development/prototyping only. It is strongly recommended not to ship your application to production using an embedded account key in it, and to instead use the user-based or service-based Azure AD authentication approaches listed next.

## Azure AD user authentication

For applications targeting Azure Active Directory users, the recommended approach is to use an Azure AD token for the user, which you can obtain using the [MSAL library](../../active-directory/develop/msal-overview.md). You should follow the steps listed the [register an app quickstart](../../active-directory/develop/quickstart-register-app.md), which include:

1. Configuration in Azure portal
    1.	Register your application in Azure AD as **Native application**. As part of registering, you will need to determine whether your application should be multi-tenant or not, and provide the redirect URLs allowed for your application.
        1.  Switch to the **API permissions** tab
        2.  Select **Add a permission**
            1.  Select **Microsoft Mixed Reality** under **APIs my organization uses** tab
            2.  Select **Delegated permissions**
            3.  Check the box for **mixedreality.signin** under **mixedreality**
            4.  Select **Add permissions**
        3.  Select **Grant admin consent**
    2.	Grant your application or users access to your resource:
        1.	Navigate to your Spatial Anchors resource in Azure portal
        2.	Switch to the **Access control (IAM)** tab
        3.	Hit **Add role assignment**
            1.	[Select a role](#role-based-access-control)
            2.	In the **Select** field, enter the name of the user(s), group(s), and/or application(s) to which you want to assign access.
            3.	Hit **Save**.
2. In your code:
    1.	Make sure to use the **application ID** and **redirect Uri** of your own Azure AD application as the **client ID** and **RedirectUri** parameters in MSAL
    2.	Set the tenant information:
        1.	If your application supports **My organization only**, replace this value with your **Tenant ID** or **Tenant name** (for example, contoso.microsoft.com)
        2.	If your application supports **Accounts in any organizational directory**, replace this value with **Organizations**
        3.	If your application supports **All Microsoft account users**, replace this value with **Common**
    3.	On your token request, set the **scope** to "https://sts.mixedreality.azure.com//.default". This scope will indicate to Azure AD that your application is requesting a token for the Mixed Reality Security Token Service (STS).

With that, your application should be able to obtain from MSAL an Azure AD token; you can set that Azure AD token as the **authenticationToken** on your cloud session config object.

# [C#](#tab/csharp)

```csharp
this.cloudSession.Configuration.AuthenticationToken = @"MyAuthenticationToken";
```

# [ObjC](#tab/objc)

```objc
_cloudSession.configuration.authenticationToken = @"MyAuthenticationToken";
```

# [Swift](#tab/swift)

```swift
_cloudSession!.configuration.authenticationToken = "MyAuthenticationToken"
```

# [Java](#tab/java)

```java
mCloudSession.getConfiguration().setAuthenticationToken("MyAuthenticationToken");
```

# [C++ NDK](#tab/cpp)

```cpp
auto configuration = cloudSession_->Configuration();
configuration->AuthenticationToken(R"(MyAuthenticationToken)");
```

# [C++ WinRT](#tab/cppwinrt)

```cpp
auto configuration = m_cloudSession.Configuration();
configuration.AuthenticationToken(LR"(MyAuthenticationToken)");
```

---

## Azure AD service authentication

The recommended option to deploy apps leveraging Azure Spatial Anchors to production is to leverage a backend service that will broker authentication requests. The general scheme should be as described in this diagram:

![An overview of authentication to Azure Spatial Anchors](./media/spatial-anchors-aad-authentication.png)

Here, it is assumed that your app uses its own mechanism (for example: Microsoft account, PlayFab, Facebook, Google ID, custom username/password, etc.) to authenticate to its backend service. Once your users are authenticated to your backend service, that service can retrieve an Azure AD token, exchange it for an access token for Azure Spatial Anchors, and return it back to your client application.

The Azure AD access token is retrieved using the [MSAL library](../../active-directory/develop/msal-overview.md). You should follow the steps listed the [register an app quickstart](../../active-directory/develop/quickstart-register-app.md), which include:

1.	Configuration in Azure portal:
    1.	Register your application in Azure AD:
        1.	In Azure portal, navigate to **Azure Active Directory**, and select **app registrations**
        2.	Select **new application registration**
        3.	Enter the name of your application, select **Web app / API** as the application type, and enter the auth URL for your service. Then hit **Create**.
        4.	On that application, hit **Settings**, then select the **Certificates and secrets** tab. Create a new client secret, select a duration, and hit **Add**. Make sure to save the secret value, as you will need to include it in your web service’s code.
    2.	Grant your application and/or users access to your resource:
        1.	Navigate to your Spatial Anchors resource in Azure portal
        2.	Switch to the **Access control (IAM)** tab
        3.	Hit **Add role assignment**
        1.	[Select a role](#role-based-access-control)
        2.	In the **select** field, enter the name of the application(s) you created and to which you want to assign access. If you want your app’s users to have different roles against the Spatial Anchors account, you should register multiple applications in Azure AD, and assign to each a separate role. Then implement your authorization logic to use the right role for your users.
        3.	Note - In the **Add role assignment** selection you want the **Assign access to** to be set to "Azure AD user, group, or service principal".
    3.	Hit **Save**.
2.	In your code (note: you can use the service sample included on GitHub):
    1.	Make sure to use the application ID, application secret, and redirect Uri of your own Azure AD application as the client ID, secret, and RedirectUri parameters in MSAL
    2.	Set the tenant ID to your own Azure ADD tenant ID in the authority parameter in MSAL.
    3.	On your token request, set the **scope** to "https://sts.mixedreality.azure.com//.default"

With that, your backend service can retrieve an Azure AD token. It can then exchange it for an MR token that it will return back to the client. Using an Azure AD token to retrieve an MR token is done via a REST call. Here is a sample call:

```
GET https://sts.mixedreality.azure.com/Accounts/35d830cb-f062-4062-9792-d6316039df56/token HTTP/1.1
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni<truncated>FL8Hq5aaOqZQnJr1koaQ
Host: sts.mixedreality.azure.com
Connection: Keep-Alive

HTTP/1.1 200 OK
Date: Sun, 24 Feb 2019 08:00:00 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 1153
Accept: application/json
MS-CV: 05JLqWeKFkWpbdY944yl7A.0
{"AccessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjI2MzYyMTk5ZTI2NjQxOGU4ZjE3MThlM2IyMThjZTIxIiwidHlwIjoiSldUIn0.eyJqdGkiOiJmMGFiNWIyMy0wMmUxLTQ1MTQtOWEzNC0xNzkzMTA1NTc4NzAiLCJjYWkiOiIzNWQ4MzBjYi1mMDYyLTQwNjItOTc5Mi1kNjMxNjAzOWRmNTYiLCJ0aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJhaWQiOiIzNWQ4MzBjYi1mMDYyLTQwNjItOTc5Mi1kNjMxNjAzOWRmNTYiLCJhYW8iOi0xLCJhcHIiOiJlYXN0dXMyIiwicmlkIjoiL3N1YnNjcmlwdGlvbnMvNzIzOTdlN2EtNzA4NC00ODJhLTg3MzktNjM5Y2RmNTMxNTI0L3Jlc291cmNlR3JvdXBzL3NhbXBsZV9yZXNvdXJjZV9ncm91cC9wcm92aWRlcnMvTWljcm9zb2Z0Lk1peGVkUmVhbGl0eS9TcGF0aWFsQW5jaG9yc0FjY291bnRzL2RlbW9fYWNjb3VudCIsIm5iZiI6MTU0NDU0NzkwMywiZXhwIjoxNTQ0NjM0MzAzLCJpYXQiOjE1NDQ1NDc5MDMsImlzcyI6Imh0dHBzOi8vbXJjLWF1dGgtcHJvZC50cmFmZmljbWFuYWdlci5uZXQvIiwiYXVkIjoiaHR0cHM6Ly9tcmMtYW5jaG9yLXByb2QudHJhZmZpY21hbmFnZXIubmV0LyJ9.BFdyCX9UJj0i4W3OudmNUiuaGgVrlPasNM-5VqXdNAExD8acFJnHdvSf6uLiVvPiQwY1atYyPbOnLYhEbIcxNX-YAfZ-xyxCKYb3g_dbxU2w8nX3zDz_X3XqLL8Uha-rkapKbnNgxq4GjM-EBMCill2Svluf9crDmO-SmJbxqIaWzLmlUufQMWg_r8JG7RLseK6ntUDRyDgkF4ex515l2RWqQx7cw874raKgUO4qlx0cpBAB8cRtGHC-3fA7rZPM7UQQpm-BC3suXqRgROTzrKqfn_g-qTW4jAKBIXYG7iDefV2rGMRgem06YH_bDnpkgUa1UgJRRTckkBuLkO2FvA"}
```

Where the Authorization header is formatted as follows: `Bearer <Azure_AD_token>`

And the response contains the MR token in plain text.

That MR token is then returned to the client. Your client app can then set it as its access token in the cloud session config.

# [C#](#tab/csharp)

```csharp
this.cloudSession.Configuration.AccessToken = @"MyAccessToken";
```

# [ObjC](#tab/objc)

```objc
_cloudSession.configuration.accessToken = @"MyAccessToken";
```

# [Swift](#tab/swift)

```swift
_cloudSession!.configuration.accessToken = "MyAccessToken"
```

# [Java](#tab/java)

```java
mCloudSession.getConfiguration().setAccessToken("MyAccessToken");
```

# [C++ NDK](#tab/cpp)

```cpp
auto configuration = cloudSession_->Configuration();
configuration->AccessToken(R"(MyAccessToken)");
```

# [C++ WinRT](#tab/cppwinrt)

```cpp
auto configuration = m_cloudSession.Configuration();
configuration.AccessToken(LR"(MyAccessToken)");
```

---

## Role-based access control

To help control the level of access granted to applications, services or Azure AD users of your service, the following roles have been created for you to assign as needed against your Azure Spatial Anchors accounts:

- **Spatial Anchors Account Owner**: applications or users that have this role are able to create spatial anchors, query for them, and delete them. When you authenticate to your account using account keys, the **Spatial Anchors Account Owner** role is assigned to the authenticated principal.
- **Spatial Anchors Account Contributor**: applications or users that have this role are able to create spatial anchors, query for them, but cannot delete them.
- **Spatial Anchors Account Reader**: applications or users that have this role are only able to query for spatial anchors, but cannot create new ones, delete existing ones, or update metadata on spatial anchors. This is typically used for applications where some users curate the environment, while others can only recall anchors previously placed in that environment.

## Next steps

Create your first app with Azure Spatial Anchors.

> [!div class="nextstepaction"]
> [Unity (HoloLens)](../quickstarts/get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity (iOS)](../quickstarts/get-started-unity-ios.md)

> [!div class="nextstepaction"]
> [Unity (Android)](../quickstarts/get-started-unity-android.md)

> [!div class="nextstepaction"]
> [iOS](../quickstarts/get-started-ios.md)

> [!div class="nextstepaction"]
> [Android](../quickstarts/get-started-android.md)

> [!div class="nextstepaction"]
> [HoloLens](../quickstarts/get-started-hololens.md)

> [!div class="nextstepaction"]
> [Xamarin (Android)](../quickstarts/get-started-xamarin-android.md)

> [!div class="nextstepaction"]
> [Xamarin (iOS)](../quickstarts/get-started-xamarin-ios.md)
