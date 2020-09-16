---
title: "Protect an ASP.NET Core web API with the Microsoft identity platform | Azure"
titleSuffix: Microsoft identity platform
description: Download and modify a code sample that demonstrates how to protect an ASP.NET Core web API by using the Microsoft identity platform for authorization.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/16/2020
ms.author: jmprieur
ms.custom: "devx-track-csharp, scenarios:getting-started, languages:aspnet-core"
# Customer intent: As an application developer, I want to know how to write an ASP.NET Core web API that uses the Microsoft identity platform to authorize API requests from clients.
---

# Quickstart: Protect an ASP.NET Core web API with Microsoft identity platform

In this quickstart, you use a code sample to learn how to protect an ASP.NET Core web API so than it can be accessed only by authorized accounts. Accounts can be personal accounts (hotmail.com, outlook.com, and others) and work and school accounts in any Azure Active Directory (Azure AD) instance.

> [!div renderon="docs"]
> ## Step 1: Register the application
> To register the web API in your Azure AD tenant, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
> 1. Search for and select **Azure Active Directory**.
> 1. Under **Manage**, select **App registrations**, then **New registration**.
> 1. Enter a **Name** for your application, for example `AspNetCoreWebApi-Quickstart`. Users of your app might see this name, and you can change it later.
> 1. Select **Register**.
> 1. Under **Manage**, select **Expose an API**
> 1. Select **Add a scope** and select **Save and continue** to accept the default **Application ID URI**.
> 1. In the **Add a scope** pane, enter the following values:
>    - **Scope name**: `access_as_user`
>    - **Who can consent?**: **Admins and users**
>    - **Admin consent display name**: `Access AspNetCoreWebApi-Quickstart`
>    - **Admin consent description**: `Allows the app to access AspNetCoreWebApi-Quickstart as the signed-in user.`
>    - **User consent display name**: `Access AspNetCoreWebApi-Quickstart`
>    - **User consent description**: `Allow the application to access AspNetCoreWebApi-Quickstart on your behalf.`
>    - **State**: **Enabled**
> 1. Select **Add scope** to complete the scope addition.

## Step 2: Download the ASP.NET Core project

> [!div renderon="docs"]
> [Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/archive/aspnetcore3-1.zip)

> [!div renderon="docs"]
> ## Step 3: Configure ASP.NET Core project
>
> 1. Extract the .zip archive into a local folder near the root of your drive. For example, into *C:\Azure-Samples*.
> 1. Open the solution in *active-directory-dotnet-native-aspnetcore-v2-aspnetcore3-1\webapi* in your code editor.
> 1. Open the *appsettings.json* file and modify the following:
>
>    ```json
>    "ClientId": "Enter_the_Application_Id_here",
>    "TenantId": "Enter_the_Tenant_Info_Here"
>    ```
>
>    - Replace `Enter_the_Application_Id_here` with the **Application (client) ID** of the application you registered in the Azure portal. You can find **Application (client) ID** in the app's **Overview** page.
>    - Replace `Enter_the_Tenant_Info_Here` with one of the following:
>       - If your application supports **Accounts in this organizational directory only**, replace this value with the **Directory (tenant) ID** (a GUID) or **tenant name** (for example, `contoso.onmicrosoft.com`). You can find the **Directory (tenant) ID** on the app's **Overview** page.
>       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
>       - If your application supports **All Microsoft account users**, leave this value as `common`
>
> For this quickstart, don't change any other values in the *appsettings.json* file.

## How the sample works

The web API receives a token from a client, and the code in the web API validates the token. This scenario is explained in more detail in [Scenario: Protected web API](scenario-protected-web-api-overview.md).

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

### Protect a controller, a controller's method, or a Razor page

You can protect a controller or controller methods using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by only allowing authenticated users, which means that authentication challenge can be started to access the controller if the user isn't authenticated.

```csharp
namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
```

### Validate the scope from the controller action / Razor page method

Your API needs to verify the scopes of the token using `HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);`

```csharp
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

The GitHub repository that contains this ASP.NET Core web API code sample includes instructions and more code samples that show you how to:

- Add authentication to a new ASP.NET Core web API
- Call the web API from a desktop application
- Call downstream APIs like Microsoft Graph and other Microsoft APIs

> [!div class="nextstepaction"]
> [ASP.NET Core web API tutorials on GitHub](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2)
