---
title: "Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how an app implements Microsoft sign-in on an ASP.NET Core web app using OpenID Connect
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/11/2020
ms.author: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal accounts, as well as work and school accounts from any Azure Active Directory instance.
---

# Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app

In this quickstart, you use a code sample to learn how an ASP.NET Core web app can sign in personal accounts (hotmail.com, outlook.com, others) and work and school accounts from any Azure Active Directory (Azure AD) instance. (See [How the sample works](#how-the-sample-works) for an illustration.)

> [!div renderon="docs"]
> ## Prerequisites
>
> * [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
> * [.NET Core SDK 3.1+](https://dotnet.microsoft.com/download)
>
> ## Register and download your quickstart app
> You have two options to start your quickstart application:
> * [Express] [Option 1: Register and auto configure your app and then download your code sample](#option-1-register-and-auto-configure-your-app-and-then-download-your-code-sample)
> * [Manual] [Option 2: Register and manually configure your application and code sample](#option-2-register-and-manually-configure-your-application-and-code-sample)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the [Azure portal - App registrations](https://aka.ms/aspnetcore2-1-aad-quickstart-v2).
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions to download and automatically configure your new application for you in one click.
>
> ### Option 2: Register and manually configure your application and code sample
>
> #### Step 1: Register your application
> To register your application and manually add the app's registration information to your solution, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
> 1. Search for and select **Azure Active Directory**.
> 1. Under **Manage**, select **App registrations**, then **New registration**.
> 1. Enter a **Name** for your application, for example `AspNetCore-Quickstart`. Users of your app might see this name, and you can change it later.
> 1. Enter a **Redirect URI** of `https://localhost:44321/`
> 1. Select **Register**.
> 1. Under **Manage**, select **Authentication**.
> 1. Under **Redirect URIs**, select **Add URI**, and then enter `https://localhost:44321/signin-oidc`
> 1. Enter a **Logout URL** of `https://localhost:44321/signout-oidc`
> 1. Under **Implicit grant**, select **ID tokens**.
> 1. Select **Save**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
> For the code sample for this quickstart to work, you need to add reply URLs as `https://localhost:44321/` and `https://localhost:44321/signin-oidc`, add the Logout URL as `https://localhost:44321/signout-oidc`, and request ID tokens to be issued by the authorization endpoint.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make this change for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-aspnet-webapp/green-check.png) Your application is configured with these attributes.

#### Step 2: Download your ASP.NET Core project

> [!div renderon="docs"]
> [Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1.zip)

> [!div renderon="portal" class="sxs-lookup"]
> Run the project.

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1.zip)

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties and it's ready to run.
> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`
> [!div renderon="docs"]
> #### Step 3: Configure your ASP.NET Core project
> 1. Extract the .zip archive into a local folder near the root of your drive. For example, into *C:\Azure-Samples*.
> 1. Open the solution in Visual Studio 2019.
> 1. Open the *appsettings.json* file and modify the following:
>
>    ```json
>    "ClientId": "Enter_the_Application_Id_here",
>    "TenantId": "common",
>    ```
>
>    - Replace `Enter_the_Application_Id_here` with the **Application (client) ID** of the application you registered in the Azure portal. You can find **Application (client) ID** in the app's **Overview** page.
>    - Replace `common` with one of the following:
>       - If your application supports **Accounts in this organizational directory only**, replace this value with the **Directory (tenant) ID** (a GUID) or **tenant name** (for example, `contoso.onmicrosoft.com`). You can find the **Directory (tenant) ID** on the app's **Overview** page.
>       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
>       - If your application supports **All Microsoft account users**, leave this value as `common`
>
> For this quickstart, don't change any other values in the *appsettings.json* file.
>
> #### Step 4: Build and run the application
>
> Build and run the app in Visual Studio by selecting the **Debug** menu > **Start Debugging**, or by pressing the `F5` key.
>
> You're prompted for your credentials, and then asked to consent to the permissions your app requires. Select **Accept** on the consent prompt.
>
> :::image type="content" source="media/quickstart-v2-aspnet-core-webapp/webapp-01-consent.png" alt-text="Consent dialog showing the permissions the app is requesting from the > user":::
>
> After consenting to the requested permissions, the app displays that you've successfully logged in using your Azure Active Directory credentials.
>
> :::image type="content" source="media/quickstart-v2-aspnet-core-webapp/webapp-02-signed-in.png" alt-text="Web browser displaying the running web app and the user signed in":::

## More information

This section gives an overview of the code required to sign in users. This overview can be useful to understand how the code works, main arguments, and also if you want to add sign-in to an existing ASP.NET Core application.

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

### Startup class

The *Microsoft.AspNetCore.Authentication* middleware uses a `Startup` class that's executed when the hosting process initializes:

```csharp
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
          .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"));

      services.AddControllersWithViews(options =>
      {
          var policy = new AuthorizationPolicyBuilder()
              .RequireAuthenticatedUser()
              .Build();
          options.Filters.Add(new AuthorizeFilter(policy));
      });
      services.AddRazorPages()
          .AddMicrosoftIdentityUI();
  }
```

The `AddAuthentication()` method configures the service to add cookie-based authentication, which is used in browser scenarios and to set the challenge to OpenID Connect.

The line containing `.AddMicrosoftIdentityWebApp` adds Microsoft identity platform authentication to your application. It's then configured to sign in using the Microsoft identity platform endpoint based on the information in the `AzureAD` section of the *appsettings.json* configuration file:

| *appsettings.json* key | Description                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ClientId`             | **Application (client) ID** of the application registered in the Azure portal.                                                                                       |
| `Instance`             | Security token service (STS) endpoint for the user to authenticate. This value is typically `https://login.microsoftonline.com/`, indicating the Azure public cloud. |
| `TenantId`             | Name of your tenant or its tenant ID (a GUID), or *common* to sign in users with work or school accounts or Microsoft personal accounts.                             |

The `Configure()` method contains two important methods, `app.UseCookiePolicy()` and `app.UseAuthentication()`, that enable their named functionality.

```csharp
// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // more code
    app.UseAuthentication();
    app.UseAuthorization();
    // more code
}
```

### Protect a controller or a controller's method

You can protect a controller or controller methods using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by only allowing authenticated users, which means that authentication challenge can be started to access the controller if the user isn't authenticated.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

The GitHub repo that contains this ASP.NET Core tutorial includes instructions and more code samples that show you how to:

- Add authentication to a new ASP.NET Core Web application
- Call Microsoft Graph, other Microsoft APIs, or your own web APIs
- Add authorization
- Sign in users in national clouds or with social identities

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorials on GitHub](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
