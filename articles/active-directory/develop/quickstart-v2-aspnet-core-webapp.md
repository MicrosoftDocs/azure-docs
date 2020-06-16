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
ms.date: 04/11/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core
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
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
> 1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter your application's registration information:
>    - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `AspNetCore-Quickstart`.
>    - In **Redirect URI**, add `https://localhost:44321/`, and select **Register**.
> 1. Select the **Authentication** menu, and then add the following information:
>    - In **Redirect URIs**, add `https://localhost:44321/signin-oidc`,  and select **Save**.
>    - In the **Advanced settings** section, set **Logout URL** to `https://localhost:44321/signout-oidc`.
>    - Under **Implicit grant**, check **ID tokens**.
>    - Select **Save**.

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
> [Download the Visual Studio 2019 solution](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore2-2.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Run the project using Visual Studio 2019.
> [!div renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore2-2.zip)

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties and it's ready to run.
> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`
> [!div renderon="docs"]
> #### Step 3: Run your Visual Studio project
> 1. Extract the zip file to a local folder within the root folder - for example, **C:\Azure-Samples**
> 1. Open the solution in Visual Studio
> 1. Edit the **appsettings.json** file. Find `ClientId` and update the value of `ClientId` with the **Application (client) ID** value of the application you registered.
>
>    ```json
>    "ClientId": "Enter_the_Application_Id_here"
>    "TenantId": "Enter_the_Tenant_Info_Here"
>    ```



> [!div renderon="docs"]
> Where:
> - `Enter_the_Application_Id_here` - is the **Application (client) ID** for the application you registered in the Azure portal. You can find **Application (client) ID** in the app's **Overview** page.
> - `Enter_the_Tenant_Info_Here` - is one of the following options:
>   - If your application supports **Accounts in this organizational directory only**, replace this value with the **Tenant ID** or **Tenant name** (for example, contoso.microsoft.com)
>   - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
>   - If your application supports **All Microsoft account users**, replace this value with `common`
>
> > [!TIP]
> > To find the values of **Application (client) ID**, **Directory (tenant) ID**, and **Supported account types**, go to the app's **Overview** page in the Azure portal.

## More information

This section gives an overview of the code required to sign in users. This overview can be useful to understand how the code works, main arguments, and also if you want to add sign-in to an existing ASP.NET Core application.

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

### Startup class

*Microsoft.AspNetCore.Authentication* middleware uses a Startup class that is executed when the hosting process initializes:

```csharp
public void ConfigureServices(IServiceCollection services)
{
  services.Configure<CookiePolicyOptions>(options =>
  {
    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
  });

  services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
          .AddAzureAD(options => Configuration.Bind("AzureAd", options));

  services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
  {
    options.Authority = options.Authority + "/v2.0/";         // Microsoft identity platform

    options.TokenValidationParameters.ValidateIssuer = false; // accept several tenants (here simplified)
  });

  services.AddMvc(options =>
  {
     var policy = new AuthorizationPolicyBuilder()
                     .RequireAuthenticatedUser()
                     .Build();
     options.Filters.Add(new AuthorizeFilter(policy));
  })
  .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
}
```

The method `AddAuthentication` configures the service to add cookie-based authentication, which is used on browser scenarios and to set the challenge to OpenID Connect.

The line containing `.AddAzureAd` adds the Microsoft identity platform authentication to your application. It's then configured to sign in using the Microsoft identity platform endpoint.

> |Where  |  |
> |---------|---------|
> | ClientId  | Application (client) ID from the application registered in the Azure portal. |
> | Authority | The STS endpoint for the user to authenticate. Usually, this is <https://login.microsoftonline.com/{tenant}/v2.0> for public cloud, where {tenant} is the name of your tenant or your tenant ID, or *common* for a reference to the common endpoint (used for multi-tenant applications) |
> | TokenValidationParameters | A list of parameters for token validation. In this case, `ValidateIssuer` is set to `false` to indicate that it can accept sign-ins from any personal, or work or school accounts. |


> [!NOTE]
> Setting `ValidateIssuer = false` is a simplification for this quickstart. In real applications you need to validate the issuer.
> See the samples to understand how to do that.
>
> Also note the `Configure` method which contains two important methods: `app.UseCookiePolicy()` and `app.UseAuthentication()`

```csharp
// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // more core
    app.UseCookiePolicy();
    app.UseAuthentication();
    // more core
}
```

### Protect a controller or a controller's method

You can protect a controller or controller methods using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by only allowing authenticated users, which means that authentication challenge can be started to access the controller if the user isn't authenticated.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

Check out the GitHub repo for this ASP.NET Core tutorial for more information including instructions on how to add authentication to a brand new ASP.NET Core Web application, how to call Microsoft Graph, and other Microsoft APIs, how to call your own APIs, how to add authorization, how to sign in users in national clouds, or with social identities and more:

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
