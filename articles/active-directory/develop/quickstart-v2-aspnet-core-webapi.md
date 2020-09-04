---
title: Protect a web API with Microsoft to ASP.NET Core web apis  - Microsoft identity platform | Azure
description: Learn how to protect an ASP.NET Core web API using the Microsoft identity platform.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/03/2020
ms.author: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal accounts, as well as work and school accounts from any Azure Active Directory instance.
---

# Quickstart: Protect an ASP.NET Core web API with Microsoft identity platform
In this quickstart, you use a code sample to learn how to protect an ASP.NET Core web API so than it can only be accessed with authorized accounts. Accounts can be personal accounts (hotmail.com, outlook.com, others) and work and school accounts from any Azure Active Directory (Azure AD) instance.
> [!div renderon="docs"]
> ## Register and download your quickstart app
>
> ### Step 1: Register your application
> To register your application and manually add the app's registration information to your solution, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
> 1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter your application's registration information:
>    - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `AspNetCoreWebApi-Quickstart`.
> 1. Select the **Expose an API** menu, and then add the following information:
>    1. Select **Add a scope**, add accept the value proposed for the **Application ID URI** (of the shape `api://ClientId`) by selecting **Save and continue**.
>    1. In the **Add a scope** section, enter the values as indicated below:
>       - For **Scope name**, use `access_as_user`.
>       - Select **Admins and users** options for **Who can consent?**
>       - For **Admin consent display name** type `Access AspNetCoreWebApi-Quickstart`
>       - For **Admin consent description** type `Allows the app to access AspNetCoreWebApi-Quickstart as the signed-in user.`
>       - For **User consent display name** type `Access AspNetCoreWebApi-Quickstart`
>       - For **User consent description** type `Allow the application to access AspNetCoreWebApi-Quickstart on your behalf.`
>       - Keep **State** as **Enabled**
>    1. Click on the **Add scope** button on the bottom to save this scope.

#### Step 2: Download your ASP.NET Core project

> [!div renderon="docs"]
> [Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/archive/aspnetcore3-1.zip)

> [!div renderon="docs"]
> #### Step 3: Run your ASP.NET Core project
> 1. Extract the zip file to a local folder within the root folder - for example, **C:\Azure-Samples**
> 1. change the directory to **active-directory-dotnet-native-aspnetcore-v2-aspnetcore3-1\webapi**
> 1. Open the solution in your IDE
> 1. Edit the **appsettings.json** file. Find `ClientId` and update the value of `ClientId` with the **Application (client) ID** value of the application you registered.
>
>    ```json
>    "ClientId": "Enter_the_Application_Id_here"
>    "TenantId": "Enter_the_Tenant_Info_Here"
>    ```
>

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
The web API will receive a token from a client and will validate it. The scenario is explained in details in [Scenario: Protected web API](scenario-protected-web-api-overview.md)

### Startup class

*Microsoft.AspNetCore.Authentication* middleware uses a Startup class that is executed when the hosting process initializes:

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");
        services.AddControllers();
    }
```

The method `AddAuthentication` configures the service to add JwtBearer-based authentication.

The line containing `.AddMicrosoftIdentityWebApi` adds the Microsoft identity platform authentication to your application. It's then configured to sign in using the Microsoft identity platform endpoint.

> |Where | Description |
> |---------|---------|
> | ClientId  | Application (client) ID from the application registered in the Azure portal. |
> | Instance | The STS endpoint for the user to authenticate. Usually, this is `https://login.microsoftonline.com/` for public cloud, where {tenant} is the name of your tenant or your tenant ID, or *common* for a reference to the common endpoint (used for multi-tenant applications) |

> Also note the `Configure` method which contains two important methods: `app.UseAuthentication()` and `app.UseAuthorization()`

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

### Protect a controller, a controller's method or a Razor page

You can protect a controller or controller methods using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by only allowing authenticated users, which means that authentication challenge can be started to access the controller if the user isn't authenticated.

```CSharp
namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
```

### Validate the scope from the controller action / Razor page method

Your API needs to verify the scopes of the token using `HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);`

```CSharp
namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        // The Web API will only accept tokens 1) for users, and 2) having the "access_as_user" scope for this API
        static readonly string[] scopeRequiredByApi = new string[] { "access_as_user" };

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            // some code here
        }
    }
}
```

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

Check out the GitHub repo for this ASP.NET Core tutorial for more information including instructions on how to add authentication to a brand new ASP.NET Core web API, how to exercice it by calling it from a desktop application, and how to call downstream APIs such as Microsoft Graph, and other Microsoft APIs:

> [!div class="nextstepaction"]
> [Sample: ASP.NET Core web API tutorial](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2)
>
> [Sample: ASP.NET Core web app calling your own web API](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API)
>
> [Sample: .NET Core Daemon application calling your own web API](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/2-Call-OwnApi)
>
> [Sample: Angular application calling your own web API](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnetcore-webapi)
>
> [Sample: web api calling a downstream web API](https://docs.microsoft.com/samples/azure-samples/active-directory-dotnet-native-aspnetcore-v2/2-web-api-now-calls-microsoft-graph/)
