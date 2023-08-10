---
title: "Quickstart: Protect an ASP.NET Core web API with the Microsoft identity platform"
description: In this quickstart, you download and modify a code sample that demonstrates how to protect an ASP.NET Core web API by using the Microsoft identity platform for authorization.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: include
ms.workload: identity
ms.date: 04/16/2023
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: devx-track-csharp, "scenarios:getting-started", "languages:aspnet-core", mode-api, engagement-fy23
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web API that uses the Microsoft identity platform to authorize API requests from clients.
---

# Quickstart: Protect an ASP.NET Core web API with the Microsoft identity platform

The following quickstart uses a ASP.NET Core web API code sample to demonstrate how to restrict resource access to authorized accounts. The sample supports authorization of personal Microsoft accounts and accounts in any Azure Active Directory (Azure AD) organization.

## Prerequisites

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure Active Directory tenant](quickstart-create-new-tenant.md)
- [.NET Core SDK 6.0+](https://dotnet.microsoft.com/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)

## Step 1: Register the application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

First, register the web API in your Azure AD tenant and add a scope by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. For **Name**, enter a name for the application. For example, enter **AspNetCoreWebApi-Quickstart**. Users of the app will see this name, and can be changed later.
1. Select **Register**.
1. Under **Manage**, select **Expose an API** > **Add a scope**. For **Application ID URI**, accept the default by selecting **Save and continue**, and then enter the following details:
   - **Scope name**: `access_as_user`
   - **Who can consent?**: **Admins and users**
   - **Admin consent display name**: `Access AspNetCoreWebApi-Quickstart`
   - **Admin consent description**: `Allows the app to access AspNetCoreWebApi-Quickstart as the signed-in user.`
   - **User consent display name**: `Access AspNetCoreWebApi-Quickstart`
   - **User consent description**: `Allow the application to access AspNetCoreWebApi-Quickstart on your behalf.`
   - **State**: **Enabled**
1. Select **Add scope** to complete the scope addition.

## Step 2: Download the ASP.NET Core project

[Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/archive/aspnetcore3-1.zip) from GitHub.

## Step 3: Configure the ASP.NET Core project

In this step, the sample code will be configured to work with the app registration that was created earlier.

1. Extract the *.zip* file to a local folder that's close to the root of the disk to avoid errors caused by path length limitations on Windows. For example, extract to *C:\Azure-Samples*.

1. Open the solution in the *webapp* folder in your code editor.
1. In *appsettings.json*, replace the values of `ClientId`, and `TenantId`. The value for the application (client) ID and the directory (tenant) ID, can be found in the app's **Overview** page on the Azure portal.

   ```json
   "ClientId": "Enter_the_Application_Id_here",
   "TenantId": "Enter_the_Tenant_Info_Here"
   ```

   - `Enter_the_Application_Id_Here` is the application (client) ID for the registered application.
   - Replace `Enter_the_Tenant_Info_Here` with one of the following:
      - If the application supports **Accounts in this organizational directory only**, replace this value with the directory (tenant) ID (a GUID) or tenant name (for example, `contoso.onmicrosoft.com`). The directory (tenant) ID can be found on the app's **Overview** page.
      - If the application supports **Accounts in any organizational directory**, replace this value with `organizations`.
      - If the application supports **All Microsoft account users**, leave this value as `common`.

For this quickstart, don't change any other values in the *appsettings.json* file.

### Step 4: Run the sample

1. Open a terminal and change directory to the project folder.

    ```powershell
    cd webapi
    ```

1. Run the following command to build the solution:

   ```powershell
   dotnet run
   ```

If the build has been successful, the following output is displayed:

```powershell
Building...
info: Microsoft.Hosting.Lifetime[0]
    Now listening on: https://localhost:{port}
info: Microsoft.Hosting.Lifetime[0]
    Now listening on: http://localhost:{port}
info: Microsoft.Hosting.Lifetime[0]
    Application started. Press Ctrl+C to shut down.
...
```

## How the sample works

The web API receives a token from a client application, and the code in the web API validates the token. This scenario is explained in more detail in [Scenario: Protected web API](scenario-protected-web-api-overview.md).

### Startup class

The *Microsoft.AspNetCore.Authentication* middleware uses a `Startup` class that's executed when the hosting process starts. In its `ConfigureServices` method, the `AddMicrosoftIdentityWebApi` extension method provided by *Microsoft.Identity.Web* is called.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");
    }
```

The `AddAuthentication()` method configures the service to add JwtBearer-based authentication.

The line that contains `.AddMicrosoftIdentityWebApi` adds the Microsoft identity platform authorization to the web API. It's then configured to validate access tokens issued by the Microsoft identity platform based on the information in the `AzureAD` section of the *appsettings.json* configuration file:

| *appsettings.json* key | Description                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ClientId`             | Application (client) ID of the application registered in the Azure portal.                                                                                       |
| `Instance`             | Security token service (STS) endpoint for the user to authenticate. This value is typically `https://login.microsoftonline.com/`, indicating the Azure public cloud. |
| `TenantId`             | Name of the tenant or its tenant ID (a GUID), or `common` to sign in users with work or school accounts or Microsoft personal accounts.                             |

The `Configure()` method contains two important methods, `app.UseAuthentication()` and `app.UseAuthorization()`, that enable their named functionality:

```csharp
// The runtime calls this method. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // more code
    app.UseAuthentication();
    app.UseAuthorization();
    // more code
}
```

### Protecting a controller, a controller's method, or a Razor page

 A controller or controller methods can be protected by using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by allowing only authenticated users. An authentication challenge can be started to access the controller if the user isn't authenticated.

```csharp
namespace webapi.Controllers
{
    [Authorize]
    [RequiredScope("access_as_user")]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
```

### Validation of scope in the controller

The code in the API verifies that the required scopes are in the token by using `[RequiredScope("access_as_user")]` attribute:

```csharp
namespace webapi.Controllers
{
    [Authorize]
    [RequiredScope("access_as_user")]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            // some code here
        }
    }
}
```

[!INCLUDE [Help and support](includes/error-handling-and-tips/help-support-include.md)]

## Next steps

The following GitHub repository contains the ASP.NET Core web API code sample instructions and more samples that show how to achieve the following:

- Add authentication to a new ASP.NET Core web API.
- Call the web API from a desktop application.
- Call downstream APIs like Microsoft Graph and other Microsoft APIs.

> [!div class="nextstepaction"]
> [ASP.NET Core web API tutorials on GitHub](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2)
