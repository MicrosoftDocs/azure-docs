---
title: Quickstart for adding feature flags to ASP.NET Core | Microsoft Docs
description: A quickstart for adding feature flags to ASP.NET Core apps and managing them in Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.tgt_pltfrm: ASP.NET Core
ms.workload: tbd
ms.date: 04/19/2019
ms.author: yegu

#Customer intent: As an ASP.NET Core developer, I want to use feature flags to control feature availability quickly and confidently.
---
# Quickstart: Add feature flags to an ASP.NET Core app

Feature management in ASP.NET Core can be enabled by connecting your application to Azure App Configuration. You can use this managed service to store all your feature flags and control their states centrally. This quickstart shows you how to incorporate the service into an ASP.NET Core web app to create an end-to-end implementation of feature management.

The .NET Core Feature Management libraries extend the framework with comprehensive feature flag support. They are built on top of the .NET Core configuration system. They seamlessly integrate with App Configuration through its .NET Core configuration provider.

You can use any code editor to do the steps in this quickstart. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

## Prerequisites

To do this quickstart, install the [.NET Core SDK](https://dotnet.microsoft.com/download).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an app configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Feature Manager** > **+ Create** to add the following feature flags:

    | Key | State |
    |---|---|
    | Beta | Off |

## Create an ASP.NET Core web app

You use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new ASP.NET Core MVC web app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.

1. Create a new folder for your project. For this quickstart, name it *TestFeatureFlags*.

2. In the new folder, run the following command to create a new ASP.NET Core MVC web app project:

        dotnet new mvc

## Add Secret Manager

Add the [Secret Manager tool](https://docs.microsoft.com/aspnet/core/security/app-secrets) to your project. The Secret Manager tool stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code.

- Open the *.csproj* file. Add a `UserSecretsId` element as shown here, and replace its value with your own, which typically is a GUID. Save the file.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">

    <PropertyGroup>
        <TargetFramework>netcoreapp2.1</TargetFramework>
        <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore.App" />
        <PackageReference Include="Microsoft.AspNetCore.Razor.Design" Version="2.1.2" PrivateAssets="All" />
    </ItemGroup>

    </Project>
    ```

## Connect to an app configuration store

1. Add references to the `Microsoft.Extensions.Configuration.AzureAppConfiguration` and `Microsoft.FeatureManagement` NuGet packages by running the following commands:

        dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration --version 1.0.0-preview-008520001

        dotnet add package Microsoft.FeatureManagement.AspNetCore --version 1.0.0-preview-008560001-910

2. Run the following command to restore packages for your project:

        dotnet restore

3. Add a secret named *ConnectionStrings:AppConfig* to Secret Manager.

    This secret contains the connection string to access your app configuration store. Replace the value in the following command with the connection string for your app configuration store.

    This command must be executed in the same directory as the *.csproj* file.

        dotnet user-secrets set ConnectionStrings:AppConfig <your_connection_string>

    Secret Manager is used only to test the web app locally. When the app is deployed to [Azure App Service](https://azure.microsoft.com/services/app-service/web), for example, you use an application setting **Connection Strings** in App Service instead of with Secret Manager to store the connection string.

    This secret is accessed with the configuration API. A colon (:) works in the configuration name with the configuration API on all supported platforms. See [Configuration by environment](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/index?tabs=basicconfiguration&view=aspnetcore-2.0).

4. Open *Program.cs*, and add a reference to the .NET Core App Configuration provider.

    ```csharp
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

5. Update the `CreateWebHostBuilder` method to use App Configuration by calling the `config.AddAzureAppConfiguration()` method.

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();
                config.AddAzureAppConfiguration(options => {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                           .UseFeatureFlags();
                });
            })
            .UseStartup<Startup>();
    ```

6. Open *Startup.cs*, and add references to the .NET Core feature manager.

    ```csharp
    using Microsoft.FeatureManagement.AspNetCore;
    ```

7. Update the `ConfigureServices` method to add the feature flag support by calling the `services.AddFeatureManagement()` method and optionally include any filter to be used with feature flags by calling `services.AddFeatureFilter<FilterType>()`:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddFeatureManagement();
    }
    ```

8. Add a *MyFeatureFlags.cs* file.

    ```csharp
    namespace TestFeatureFlags
    {
        public enum MyFeatureFlags
        {
            Beta
        }
    }
    ```

9. Add *BetaController.cs* to the Controllers directory:

    ```csharp
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.FeatureManagement.AspNetCore;

    namespace TestFeatureFlags.Controllers
    {
        public class BetaController: Controller
        {
            private readonly IFeatureManager _featureManager;

            public BetaController(IFeatureManagerSnapshot featureManager)
            {
                _featureManager = featureManager;
            }

            [Feature(MyFeatureFlags.Beta)]
            public IActionResult Index()
            {
                return View();
            }
        }
    }
    ```

10. Open *_ViewImports.cshtml* in the Views directory, and add the feature manager tag helper:

    ```html
    @addTagHelper *, Microsoft.FeatureManagement.AspNetCore
    ```

11. Open *_Layout.cshtml* in the Views > Shared directory, and replace to the `<nav>` bar under `<body>` > `<header>` with the following code:

    ```html
    <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div class="container">
            <a class="navbar-brand" asp-area="" asp-controller="Home" asp-action="Index">TestFeatureFlags</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                <ul class="navbar-nav flex-grow-1">
                    <li class="nav-item">
                        <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Index">Home</a>
                    </li>
                    <feature name="Beta">
                    <li class="nav-item">
                        <a class="nav-link text-dark" asp-area="" asp-controller="Beta" asp-action="Index">Beta</a>
                    </li>
                    </feature>
                    <li class="nav-item">
                        <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    ```

12. Create a Beta directory under Views and add *Index.cshtml* to it:

    ```html
    @{
        ViewData["Title"] = "Beta Home Page";
    }

    <h1>
        This is the beta website.
    </h1>
    ```

## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

2. After the build successfully completes, run the following command to run the web app locally:

        dotnet run

3. Open a browser window, and go to `https://localhost:5001`, which is the default URL for the web app hosted locally.

    ![Quickstart app launch local](./media/quickstarts/aspnet-core-feature-flag-local-before.png)

4. Sign in to the [Azure portal](https://aka.ms/azconfig/portal). Select **All resources**, and select the app configuration store instance that you created in the quickstart.

5. Select **Feature Manager**, and change the value of *Beta* to *On*:

    | Key | State |
    |---|---|
    | Beta | On |

6. Refresh the browser page to see the new configuration settings.

    ![Quickstart app launch local](./media/quickstarts/aspnet-core-feature-flag-local-after.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new app configuration store and used it to manage features in an ASP.NET Core web app via the [Feature Management libraries](https://go.microsoft.com/fwlink/?linkid=2074664).

* Learn more about [feature management](./concept-feature-management.md)
* [Manage feature flags](./manage-feature-flags.md)
* [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md)
