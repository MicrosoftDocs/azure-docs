---
title: Quickstart for adding feature flags to ASP.NET Core
description: Add feature flags to ASP.NET Core apps and manage them using Azure App Configuration
author: AlexandraKemperMS

ms.service: azure-app-configuration
ms.custom: devx-track-csharp
ms.topic: quickstart
ms.date: 09/28/2020
ms.author: alkemper

#Customer intent: As an ASP.NET Core developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to an ASP.NET Core app

In this quickstart, you create an end-to-end implementation of feature management in an ASP.NET Core app using Azure App Configuration. You'll use the App Configuration service to centrally store all your feature flags and control their states. 

The .NET Core Feature Management libraries extend the framework with comprehensive feature flag support. These libraries are built on top of the .NET Core configuration system. They seamlessly integrate with App Configuration through its .NET Core configuration provider.

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
* [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create an App Configuration store

[!INCLUDE[Azure App Configuration resource creation steps](../../includes/azure-app-configuration-create.md)]

8. Select **Operations** > **Feature manager** > **Add** to add a feature flag called *Beta*.

    > [!div class="mx-imgBorder"]
    > ![Enable feature flag named Beta](media/add-beta-feature-flag.png)

    Leave **Label** empty for now. Select **Apply** to save the new feature flag.

## Create an ASP.NET Core web app

Use the [.NET Core command-line interface (CLI)](/dotnet/core/tools) to create a new ASP.NET Core MVC project. The advantage of using the .NET Core CLI instead of Visual Studio is that the .NET Core CLI is available across the Windows, macOS, and Linux platforms.

Run the following command to create an ASP.NET Core MVC project in a new *TestFeatureFlags* folder:

```dotnetcli
dotnet new mvc --no-https --output TestFeatureFlags
```

[!INCLUDE[Add Secret Manager support to an ASP.NET Core project](../../includes/azure-app-configuration-add-secret-manager.md)]

## Connect to an App Configuration store

1. Install the [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) and [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore) NuGet packages by running the following commands:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

    ```dotnetcli
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    ```

1. Run the following command in the same directory as the *.csproj* file. The command uses Secret Manager to store a secret named `ConnectionStrings:AppConfig`, which stores the connection string for your App Configuration store. Replace the `<your_connection_string>` placeholder with your App Configuration store's connection string. You can find the connection string under **Access Keys** in the Azure portal.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppConfig "<your_connection_string>"
    ```

    Secret Manager is used only to test the web app locally. When the app is deployed to [Azure App Service](https://azure.microsoft.com/services/app-service/web), use the **Connection Strings** application setting in App Service instead of Secret Manager to store the connection string.

    Access this secret using the .NET Core Configuration API. A colon (`:`) works in the configuration name with the Configuration API on all supported platforms. For more information, see [Configuration keys and values](/aspnet/core/fundamentals/configuration#configuration-keys-and-values).

1. In *Program.cs*, update the `CreateWebHostBuilder` method to use App Configuration by calling the `AddAzureAppConfiguration` method.

    > [!IMPORTANT]
    > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.x. Select the correct syntax based on your environment.

     #### [.NET 5.x](#tab/core5x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration(config =>
                {
                    var settings = config.Build();
                    var connection = settings.GetConnectionString("AppConfig");
                    config.AddAzureAppConfiguration(options =>
                        options.Connect(connection).UseFeatureFlags());
                }).UseStartup<Startup>());
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration(config =>
                {
                    var settings = config.Build();
                    var connection = settings.GetConnectionString("AppConfig");
                    config.AddAzureAppConfiguration(options =>
                        options.Connect(connection).UseFeatureFlags());
                }).UseStartup<Startup>());
    ```

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
               .ConfigureAppConfiguration(config =>
               {
                   var settings = config.Build();
                   var connection = settings.GetConnectionString("AppConfig");
                   config.AddAzureAppConfiguration(options =>
                       options.Connect(connection).UseFeatureFlags());
               }).UseStartup<Startup>();
    ```

    ---

    With the preceding change, the [configuration provider for App Configuration](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration) has been registered with the .NET Core Configuration API.

1. In *Startup.cs*, add a reference to the .NET Core feature manager:

    ```csharp
    using Microsoft.FeatureManagement;
    ```

1. Update the `Startup.ConfigureServices` method to add feature flag support by calling the `AddFeatureManagement` method. Optionally, you can include any filter to be used with feature flags by calling `AddFeatureFilter<FilterType>()`:

     #### [.NET 5.x](#tab/core5x)

    ```csharp    
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews();
        services.AddFeatureManagement();
    }
    ```
    #### [.NET Core 3.x](#tab/core3x)

    ```csharp    
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews();
        services.AddFeatureManagement();
    }
    ```

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc()
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        services.AddFeatureManagement();
    }
    ```

    ---

1. Add a *MyFeatureFlags.cs* file to the root project directory with the following code:

    ```csharp
    namespace TestFeatureFlags
    {
        public enum MyFeatureFlags
        {
            Beta
        }
    }
    ```

1. Add a *BetaController.cs* file to the *Controllers* directory with the following code:

    ```csharp
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.FeatureManagement;
    using Microsoft.FeatureManagement.Mvc;

    namespace TestFeatureFlags.Controllers
    {
        public class BetaController: Controller
        {
            private readonly IFeatureManager _featureManager;

            public BetaController(IFeatureManagerSnapshot featureManager) =>
                _featureManager = featureManager;

            [FeatureGate(MyFeatureFlags.Beta)]
            public IActionResult Index() => View();
        }
    }
    ```

1. In *Views/_ViewImports.cshtml*, register the feature manager Tag Helper using an `@addTagHelper` directive:

    ```cshtml
    @addTagHelper *, Microsoft.FeatureManagement.AspNetCore
    ```

    The preceding code allows the `<feature>` Tag Helper to be used in the project's *.cshtml* files.

1. Open *_Layout.cshtml* in the *Views*\\*Shared* directory. Locate the `<nav>` bar code under `<body>` > `<header>`. Insert a new `<feature>` tag in between the *Home* and *Privacy* navbar items, as shown in the highlighted lines below.

    :::code language="html" source="../../includes/azure-app-configuration-navbar.md" range="15-38" highlight="14-18":::

1. Create a *Views/Beta* directory and an *Index.cshtml* file containing the following markup:

    ```cshtml
    @{
        ViewData["Title"] = "Beta Home Page";
    }

    <h1>This is the beta website.</h1>
    ```

## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

    ```dotnetcli
    dotnet build
    ```

1. After the build successfully completes, run the following command to run the web app locally:

    ```dotnetcli
    dotnet run
    ```

1. Open a browser window, and go to `http://localhost:5000`, which is the default URL for the web app hosted locally. If you're working in the Azure Cloud Shell, select the **Web Preview** button followed by **Configure**. When prompted, select port 5000.

    ![Locate the Web Preview button](./media/quickstarts/cloud-shell-web-preview.png)

    Your browser should display a page similar to the image below.

    :::image type="content" source="media/quickstarts/aspnet-core-feature-flag-local-before.png" alt-text="Local quickstart app before change" border="true":::

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance that you created in the quickstart.

1. Select **Feature manager**. 

1. Enable the *Beta* flag by selecting the checkbox under **Enabled**.

1. Return to the command shell. Cancel the running `dotnet` process by pressing <kbd>Ctrl+C</kbd>. Restart your app using `dotnet run`.

1. Refresh the browser page to see the new configuration settings.

    :::image type="content" source="media/quickstarts/aspnet-core-feature-flag-local-after.png" alt-text="Local quickstart app after change" border="true":::

## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it to manage features in an ASP.NET Core web app via the [Feature Management libraries](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration).

* Learn more about [feature management](./concept-feature-management.md).
* [Manage feature flags](./manage-feature-flags.md).
* [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md).
* [Use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md)