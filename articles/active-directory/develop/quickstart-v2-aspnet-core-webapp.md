---
title: Add sign-in with Microsoft to ASP.NET Core web apps - Microsoft identity platform | Azure
description: Learn how to implement Microsoft Sign-In on an ASP.NET Core web app using OpenID Connect
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/10/2020
ms.author: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal accounts, as well as work and school accounts from any Azure Active Directory instance.
---

# Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app

In this quickstart, you use a code sample to learn how an ASP.NET Core web app can sign in personal accounts (hotmail.com, outlook.com, others) and work and school accounts from any Azure Active Directory (Azure AD) instance. (See [How the sample works](#how-the-sample-works) for an illustration.)

> [!div renderon="docs"]
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
> 1. In the **NuGet Package Manager**, select the [Include prerelease](/nuget/consume-packages/install-use-packages-visual-studio#manage-packages-for-the-solution) check box to include prerelease NuGet packages.
> 1. Open the *appsettings.json* file and modify the following:
>
>    ```json
>    "ClientId": "Enter_the_Application_Id_here"
>    "TenantId": "Enter_the_Tenant_Info_Here"
>    ```
>
>    - Replace `Enter_the_Application_Id_here` with the **Application (client) ID** of the application you registered in the Azure portal. You can find **Application (client) ID** in the app's **Overview** page.
>    - Replace `Enter_the_Tenant_Info_Here` with one of the following:
>       - If your application supports **Accounts in this organizational directory only**, replace this value with the **Directory (tenant) ID** (a GUID) or **tenant name** (for example, `contoso.onmicrosoft.com`).
>       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
>       - If your application supports **All Microsoft account users**, replace this value with `common`
>
>     > [!TIP]
>     > You can find the **Application (client) ID** and **Directory (tenant) ID** on the app's **Overview** page in the Azure portal.
>
> #### Step 4: Build and run the application
>
> > [!WARNING]
> > WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO WIP TODO

## More information

This section gives an overview of the code required to sign in users. This overview can be useful to understand how the code works, main arguments, and also if you want to add sign-in to an existing ASP.NET Core application.

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

### Startup class

*Microsoft.AspNetCore.Authentication* middleware uses a Startup class that is executed when the hosting process initializes:

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

The method `AddAuthentication` configures the service to add cookie-based authentication, which is used on browser scenarios and to set the challenge to OpenID Connect.

The line containing `.AddMicrosoftIdentityWebApp` adds the Microsoft identity platform authentication to your application. It's then configured to sign in using the Microsoft identity platform endpoint based on the information in the `AzureAD` section of the **appsettings.json** configuration file.

> |Where | Description |
> |---------|---------|
> | ClientId  | Application (client) ID from the application registered in the Azure portal. |
> | Instance | The STS endpoint for the user to authenticate. Usually, this is `https://login.microsoftonline.com/` for public cloud.
> | TenantId | Name of your tenant or your tenant ID, or *common* to sign-in users with work or school accounts or Microsoft personal accounts. |

> Also note the `Configure` method which contains two important methods: `app.UseCookiePolicy()` and `app.UseAuthentication()`

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

Check out the GitHub repo for this ASP.NET Core tutorial for more information. This repo includes instructions on how to add authentication to a brand new ASP.NET Core Web application, how to call Microsoft Graph, and other Microsoft APIs, how to call your own APIs, how to add authorization, how to sign in users in national clouds, or with social identities and more:

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
