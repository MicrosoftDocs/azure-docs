---
title: Azure AD B2C | Microsoft Docs
description: How to build a .NET Web API by using Azure Active Directory B2C, secured using OAuth 2.0 access tokens for authentication.
services: active-directory-b2c
documentationcenter: .net
author: parakhj
manager: krassk
editor: ''

ms.assetid: 7146ed7f-2eb5-49e9-8d8b-ea1a895e1966
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 03/17/2017
ms.author: parakhj

---
# Azure Active Directory B2C: Build a .NET web API

With Azure Active Directory (Azure AD) B2C, you can secure a web API by using OAuth 2.0 access tokens. These tokens allow your client apps to authenticate to the API. This article shows you how to create a .NET MVC "to-do list" API that allows users of your client application to CRUD tasks. The web API is secured using Azure AD B2C and only allows authenticated users to manage their to-do list.

## Create an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant. A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue in this guide.

> [!NOTE]
> The client application and web API must use the same Azure AD B2C directory.
>

## Create a web API

Next, you need to create a web API app in your B2C directory. This gives Azure AD information that it needs to securely communicate with your app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

* Include a **web app** or **web API** in the application.
* Use the **Redirect URI** `https://localhost:44332/` for the web app. This is the default location of the web app client for this code sample.
* Copy the **Application ID** that is assigned to your app. You'll need it later.
* Enter an app identifier into **App ID URI**.
* Add permissions through the **Published scopes** menu.

  [!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). You will need to create a policy to communicate with Azure AD B2C. We recommend using the combined sign-up/sign-in policy, as described in the [policy reference article](active-directory-b2c-reference-policies.md). When you create your policy, be sure to:

* Choose **Display name** and other sign-up attributes in your policy.
* Choose **Display name** and **Object ID** claims as application claims for every policy. You can choose other claims as well.
* Copy the **Name** of each policy after you create it. You'll need the policy name later.

[!INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have successfully created the policy, you're ready to build your app.

## Download the code

The code for this tutorial is maintained on [GitHub](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi). You can clone the sample by running:

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

After you download the sample code, open the Visual Studio .sln file to get started. The solution file contains two projects: `TaskWebApp` and `TaskService`. `TaskWebApp` is an MVC web application that the user interacts with. `TaskService` is the app's back-end web API that stores each user's to-do list. This article will only discuss the `TaskService` application. To learn how to build `TaskWebApp` using Azure AD B2C, see [our .NET web app tutorial](active-directory-b2c-devquickstarts-web-dotnet-susi.md).

### Update the Azure AD B2C configuration

Our sample is configured to use the policies and client ID of our demo tenant. If you would like to use your own tenant, you will need to do the following:

1. Open `web.config` in the `TaskService` project and replace the values for
    * `ida:Tenant` with your tenant name
    * `ida:ClientId` with your web API application ID
    * `ida:SignUpSignInPolicyId` with your "Sign-up or Sign-in" policy name

2. Open `web.config` in the `TaskWebApp` project and replace the values for
    * `ida:Tenant` with your tenant name
    * `ida:ClientId` with your web app application ID
    * `ida:ClientSecret` with your web app secret key
    * `ida:SignUpSignInPolicyId` with your "Sign-up or Sign-in" policy name
    * `ida:EditProfilePolicyId` with your "Edit Profile" policy name
    * `ida:ResetPasswordPolicyId` with your "Reset Password" policy name


## Secure the API

When you have a client that calls your API, you can secure your API (e.g `TaskService`) by using OAuth 2.0 bearer tokens. This ensures that each request to your API will only be valid if the request has a bearer token. Your API can accept and validate bearer tokens by using Microsoft's Open Web Interface for .NET (OWIN) library.

### Install OWIN

Begin by installing the OWIN OAuth authentication pipeline by using the Visual Studio Package Manager Console.

```Console
PM> Install-Package Microsoft.Owin.Security.OAuth -ProjectName TaskService
PM> Install-Package Microsoft.Owin.Security.Jwt -ProjectName TaskService
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TaskService
```

This will install the OWIN middleware that will accept and validate bearer tokens.

### Add an OWIN startup class

Add an OWIN startup class to the API called `Startup.cs`.  Right-click on the project, select **Add** and **New Item**, and then search for OWIN. The OWIN middleware will invoke the `Configuration(…)` method when your app starts.

In our sample, we changed the class declaration to `public partial class Startup` and implemented the other part of the class in `App_Start\Startup.Auth.cs`. Inside the `Configuration` method, we added a call to `ConfigureAuth`, which is defined in `Startup.Auth.cs`. After the modifications, `Startup.cs` looks like the following:

```CSharp
// Startup.cs

public partial class Startup
{
    // The OWIN middleware will invoke this method when the app starts
    public void Configuration(IAppBuilder app)
    {
        // ConfigureAuth defined in other part of the class
        ConfigureAuth(app);
    }
}
```

### Configure OAuth 2.0 authentication

Open the file `App_Start\Startup.Auth.cs`, and implement the `ConfigureAuth(...)` method. For example, it could look like the following:

```CSharp
// App_Start\Startup.Auth.cs

 public partial class Startup
    {
        // These values are pulled from web.config
        public static string AadInstance = ConfigurationManager.AppSettings["ida:AadInstance"];
        public static string Tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        public static string ClientId = ConfigurationManager.AppSettings["ida:ClientId"];
        public static string SignUpSignInPolicy = ConfigurationManager.AppSettings["ida:SignUpSignInPolicyId"];
        public static string DefaultPolicy = SignUpSignInPolicy;

        /*
         * Configure the authorization OWIN middleware.
         */
        public void ConfigureAuth(IAppBuilder app)
        {
            TokenValidationParameters tvps = new TokenValidationParameters
            {
                // Accept only those tokens where the audience of the token is equal to the client ID of this app
                ValidAudience = ClientId,
                AuthenticationType = Startup.DefaultPolicy
            };

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
            {
                // This SecurityTokenProvider fetches the Azure AD B2C metadata & signing keys from the OpenIDConnect metadata endpoint
                AccessTokenFormat = new JwtFormat(tvps, new OpenIdConnectCachingSecurityTokenProvider(String.Format(AadInstance, Tenant, DefaultPolicy)))
            });
        }
    }
```

### Secure the task controller

After the app is configured to use OAuth 2.0 authentication, you can secure your web API by adding an `[Authorize]` tag to the task controller. This is the controller where all to-do list manipulation takes place, so you should secure the entire controller at the class level. You can also add the `[Authorize]` tag to individual actions for more fine-grained control.

```CSharp
// Controllers\TasksController.cs

[Authorize]
public class TasksController : ApiController
{
    ...
}
```

### Get user information from the token

`TasksController` stores tasks in a database where each task has an associated user who "owns" the task. The owner is identified by the user's **object ID**. (This is why you needed to add the object ID as an application claim in all of your policies.)

```CSharp
// Controllers\TasksController.cs

public IEnumerable<Models.Task> Get()
{
    string owner = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
    IEnumerable<Models.Task> userTasks = db.Tasks.Where(t => t.owner == owner);
    return userTasks;
}
```

### Validate the permissions in the token

A common requirement for web APIs is to validate the "scopes" present in the token. This ensures that the user has consented to the permissions required to access the to-do list service.

```CSharp
public IEnumerable<Models.Task> Get()
{
    if (ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value != "read")
    {
        throw new HttpResponseException(new HttpResponseMessage {
            StatusCode = HttpStatusCode.Unauthorized,
            ReasonPhrase = "The Scope claim does not contain 'read' or scope claim not found"
        });
    }
    ...
}
```

## Run the sample app

Finally, build and run both `TaskWebApp` and `TaskService`. Create some tasks on the user's to-do list and notice how they are persisted in the API even after you stop and restart the client.

## Edit your policies

After you have secured an API by using Azure AD B2C, you can experiment with your Sign-in/Sign-up policy and view the effects (or lack thereof) on the API. You can manipulate the application claims in the policies and change the user information that is available in the web API. Any claims that you add will be available to your .NET MVC web API in the `ClaimsPrincipal` object, as described earlier in this article.
