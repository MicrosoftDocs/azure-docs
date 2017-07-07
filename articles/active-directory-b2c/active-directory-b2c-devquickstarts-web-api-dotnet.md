---
title: Azure Active Directory B2C | Microsoft Docs
description: How to build a .NET Web app and call a web api using Azure Active Directory B2C and OAuth 2.0 access tokens.
services: active-directory-b2c
documentationcenter: .net
author: parakhj
manager: krassk
editor: ''

ms.assetid: d3888556-2647-4a42-b068-027f9374aa61
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/17/2017
ms.author: parakhj

---
# Azure AD B2C: Call a .NET web API from a .NET web app

By using Azure AD B2C, you can add powerful identity management features to your web apps and web APIs. This article discusses how to request access tokens and make calls from a .NET "to-do list" web app to a .NET web api.

This article does not cover how to implement sign-in, sign-up and profile management with Azure AD B2C. It focuses on calling web APIs after the user is already authenticated. If you haven't already, you should:

* Get started with a [.NET web app](active-directory-b2c-devquickstarts-web-dotnet-susi.md)
* Get started with a [.NET web api](active-directory-b2c-devquickstarts-api-dotnet.md)

## Prerequisite

To build a web application that calls a web api, you need to:

1. [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).
2. [Register a web api](active-directory-b2c-app-registration.md#register-a-web-api).
3. [Register a web app](active-directory-b2c-app-registration.md#register-a-web-application).
4. [Set up policies](active-directory-b2c-reference-policies.md).
5. [Grant the web app permissions to use the web api](active-directory-b2c-access-tokens.md#granting-permissions-to-a-web-api).

> [!IMPORTANT]
> The client application and web API must use the same Azure AD B2C directory.
>

## Download the code

The code for this tutorial is maintained on [GitHub](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi). You can clone the sample by running:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

After you download the sample code, open the Visual Studio .sln file to get started. The solution file contains two projects: `TaskWebApp` and `TaskService`. `TaskWebApp` is a MVC web application that the user interacts with. `TaskService` is the app's back-end web API that stores each user's to-do list. This article does not cover building the `TaskWebApp` web app or the `TaskService` web api. To learn how to build the .NET web app using Azure AD B2C, see our [.NET web app tutorial](active-directory-b2c-devquickstarts-web-dotnet-susi.md). To learn how to build the .NET web API secured using Azure AD B2C, see our [.NET web API tutorial](active-directory-b2c-devquickstarts-api-dotnet.md).

### Update the Azure AD B2C configuration

Our sample is configured to use the policies and client ID of our demo tenant. If you would like to use your own tenant:

1. Open `web.config` in the `TaskService` project and replace the values for

    * `ida:Tenant` with your tenant name
    * `ida:ClientId` with your web api application ID
    * `ida:SignUpSignInPolicyId` with your "Sign-up or Sign-in" policy name

2. Open `web.config` in the `TaskWebApp` project and replace the values for

    * `ida:Tenant` with your tenant name
    * `ida:ClientId` with your web app application ID
    * `ida:ClientSecret` with your web app secret key
    * `ida:SignUpSignInPolicyId` with your "Sign-up or Sign-in" policy name
    * `ida:EditProfilePolicyId` with your "Edit Profile" policy name
    * `ida:ResetPasswordPolicyId` with your "Reset Password" policy name



## Requesting and saving an access token

### Specify the permissions

In order to make the call to the web API, you need to authenticate the user (using your sign-up/sign-in policy) and [receive an access token](active-directory-b2c-access-tokens.md) from Azure AD B2C. In order to receive an access token, you first must specify the permissions you would like the access token to grant. The permissions are specified in the `scope` parameter when you make the request to the `/authorize` endpoint. For example, to acquire an access token with the “read” permission to the resource application that has the App ID URI of `https://contoso.onmicrosoft.com/tasks`, the scope would be `https://contoso.onmicrosoft.com/tasks/read`.

To specify the scope in our sample, open the file `App_Start\Startup.Auth.cs` and define the `Scope` variable in OpenIdConnectAuthenticationOptions.

```CSharp
// App_Start\Startup.Auth.cs

    app.UseOpenIdConnectAuthentication(
        new OpenIdConnectAuthenticationOptions
        {
            ...

            // Specify the scope by appending all of the scopes requested into one string (seperated by a blank space)
            Scope = $"{OpenIdConnectScopes.OpenId} {ReadTasksScope} {WriteTasksScope}"
        }
    );
}
```

### Exchange the authorization code for an access token

After an user completes the sign-up or sign-in experience, your app will receive an authorization code from Azure AD B2C. The OWIN OpenID Connect middleware will store the code, but will not exchange it for an access token. You can use the [MSAL library](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) to make the exchange. In our sample, we configured a notification callback into the OpenID Connect middleware whenever an authorization code is received. In the callback, we use MSAL to exchange the code for a token and save the token into the cache.

```CSharp
/*
* Callback function when an authorization code is received
*/
private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification notification)
{
    // Extract the code from the response notification
    var code = notification.Code;

    var userObjectId = notification.AuthenticationTicket.Identity.FindFirst(ObjectIdElement).Value;
    var authority = String.Format(AadInstance, Tenant, DefaultPolicy);
    var httpContext = notification.OwinContext.Environment["System.Web.HttpContextBase"] as HttpContextBase;

    // Exchange the code for a token. Make sure to specify the necessary scopes
    ClientCredential cred = new ClientCredential(ClientSecret);
    ConfidentialClientApplication app = new ConfidentialClientApplication(authority, Startup.ClientId,
                                            RedirectUri, cred, new NaiveSessionCache(userObjectId, httpContext));
    var authResult = await app.AcquireTokenByAuthorizationCodeAsync(new string[] { ReadTasksScope, WriteTasksScope }, code, DefaultPolicy);
}
```

## Calling the web API

This section discusses how to use the token received during sign-up/sign-in with Azure AD B2C in order to access the web API.

### Retrieve the saved token in the controllers

The `TasksController` is responsible for communicating with the web API and for sending HTTP requests to the API to read, create, and delete tasks. Because the API is secured by Azure AD B2C, you need to first retrieve the token you saved in the above step.

```CSharp
// Controllers\TasksController.cs

/*
* Uses MSAL to retrieve the token from the cache
*/
private async void acquireToken(String[] scope)
{
    string userObjectID = ClaimsPrincipal.Current.FindFirst(Startup.ObjectIdElement).Value;
    string authority = String.Format(Startup.AadInstance, Startup.Tenant, Startup.DefaultPolicy);

    ClientCredential credential = new ClientCredential(Startup.ClientSecret);

    // Retrieve the token using the provided scopes
    ConfidentialClientApplication app = new ConfidentialClientApplication(authority, Startup.ClientId,
                                        Startup.RedirectUri, credential,
                                        new NaiveSessionCache(userObjectID, this.HttpContext));
    AuthenticationResult result = await app.AcquireTokenSilentAsync(scope);

    accessToken = result.Token;
}
```

### Read tasks from the web API

When you have a token, you can attach it to the HTTP `GET` request in the `Authorization` header to securely call `TaskService`:

```CSharp
// Controllers\TasksController.cs

public async Task<ActionResult> Index()
{
    try {

        // Retrieve the token with the specified scopes
        acquireToken(new string[] { Startup.ReadTasksScope });

        HttpClient client = new HttpClient();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, apiEndpoint);

        // Add token to the Authorization header and make the request
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        HttpResponseMessage response = await client.SendAsync(request);

        // Handle response ...
}

```

### Create and delete tasks on the web API

Follow the same pattern when you send `POST` and `DELETE` requests to the web API, using MSAL to retrieve the access token from the cache.

## Run the sample app

Finally, build and run both the apps. Sign up and sign in, and create tasks for the signed-in user. Sign out and sign in as a different user. Create tasks for that user. Notice how the tasks are stored per-user on the API, because the API extracts the user's identity from the token it receives. Also try playing with the scopes. Remove the permission to "write" and then try adding a task. Just make sure to sign out each time you change the scope.

