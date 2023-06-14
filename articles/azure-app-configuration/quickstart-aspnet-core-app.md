---
title: Quickstart for Azure App Configuration with ASP.NET Core | Microsoft Docs
description: Create an ASP.NET Core app with Azure App Configuration to centralize storage and management of application settings for an ASP.NET Core application.
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, contperf-fy21q1, mode-other, engagement-fy23
ms.topic: quickstart
ms.date: 03/27/2023
ms.author: zhenlwa
#Customer intent: As an ASP.NET Core developer, I want to learn how to manage all my app settings in one place.
---
# Quickstart: Create an ASP.NET Core app with Azure App Configuration

In this quickstart, you'll use Azure App Configuration to externalize storage and management of your app settings for an ASP.NET Core app. ASP.NET Core builds a single, key-value-based configuration object using settings from one or more [configuration providers](/aspnet/core/fundamentals/configuration#configuration-providers). App Configuration offers a .NET configuration provider library. Therefore, you can use App Configuration as an extra configuration source for your app. If you have an existing app, to begin using App Configuration, you'll only need a few small changes to your app startup code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [.NET Core SDK](https://dotnet.microsoft.com/download)

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Add key-values

Add the following key-values to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                                | Value                               |
|------------------------------------|-------------------------------------|
| *TestApp:Settings:BackgroundColor* | *white*                             |
| *TestApp:Settings:FontColor*       | *black*                             |
| *TestApp:Settings:FontSize*        | *24*                                |
| *TestApp:Settings:Message*         | *Data from Azure App Configuration* |

## Create an ASP.NET Core web app

Use the [.NET Core command-line interface (CLI)](/dotnet/core/tools) to create a new ASP.NET Core web app project. The [Azure Cloud Shell](https://shell.azure.com) provides these tools for you. They're also available across the Windows, macOS, and Linux platforms.

Run the following command to create an ASP.NET Core web app in a new *TestAppConfig* folder:

#### [.NET 6.x](#tab/core6x)

```dotnetcli
dotnet new webapp --output TestAppConfig --framework net6.0
```

#### [.NET Core 3.x](#tab/core3x)

```dotnetcli
dotnet new webapp --output TestAppConfig --framework netcoreapp3.1
```

---

## Connect to the App Configuration store

1. Navigate into the project's directory *TestAppConfig*, and run the following command to add a [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) NuGet package reference:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Run the following command. The command uses [Secret Manager](/aspnet/core/security/app-secrets) to store a secret named `ConnectionStrings:AppConfig`, which stores the connection string for your App Configuration store. Replace the `<your_connection_string>` placeholder with your App Configuration store's connection string. You can find the connection string under **Access Keys** of your App Configuration store in the Azure portal.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set ConnectionStrings:AppConfig "<your_connection_string>"
    ```

    > [!TIP]
    > Some shells will truncate the connection string unless it's enclosed in quotes. Ensure that the output of the `dotnet user-secrets list` command shows the entire connection string. If it doesn't, rerun the command, enclosing the connection string in quotes.

    Secret Manager stores the secret outside of your project tree, which helps prevent the accidental sharing of secrets within source code. It's used only to test the web app locally. When the app is deployed to Azure like [App Service](../app-service/overview.md), use the *Connection strings*, *Application settings* or environment variables to store the connection string. Alternatively, to avoid connection strings all together, you can [connect to App Configuration using managed identities](./howto-integrate-azure-managed-service-identity.md) or your other [Azure AD identities](./concept-enable-rbac.md).

1. Open *Program.cs* and add Azure App Configuration as an extra configuration source by calling the `AddAzureAppConfiguration` method.

    #### [.NET 6.x](#tab/core6x)

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    // Retrieve the connection string
    string connectionString = builder.Configuration.GetConnectionString("AppConfig");

    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(connectionString);

    // The rest of existing code in program.cs
    // ... ...
    ```

    #### [.NET Core 3.x](#tab/core3x)

    Update the `CreateHostBuilder` method.

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureAppConfiguration(config =>
                {
                    // Retrieve the connection string
                    IConfiguration settings = config.Build();
                    string connectionString = settings.GetConnectionString("AppConfig");

                    // Load configuration from Azure App Configuration
                    config.AddAzureAppConfiguration(connectionString);
                });

                webBuilder.UseStartup<Startup>();
            });
    ```

    ---

    This code will connect to your App Configuration store using a connection string and load *all* key-values that have *no labels*. For more information on the App Configuration provider, see the [App Configuration provider API reference](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration).

## Read from the App Configuration store

In this example, you'll update a web page to display its content using the settings you configured in your App Configuration store.

1. Add a *Settings.cs* file at the root of your project directory. It defines a strongly typed `Settings` class for the configuration you're going to use. Replace the namespace with the name of your project.

    ```csharp
    namespace TestAppConfig
    {
        public class Settings
        {
            public string BackgroundColor { get; set; }
            public long FontSize { get; set; }
            public string FontColor { get; set; }
            public string Message { get; set; }
        }
    }
    ```

1. Bind the `TestApp:Settings` section in configuration to the `Settings` object.

    #### [.NET 6.x](#tab/core6x)

    Update *Program.cs* with the following code and add the `TestAppConfig` namespace at the beginning of the file.

    ```csharp
    using TestAppConfig;

    // Existing code in Program.cs
    // ... ...

    builder.Services.AddRazorPages();

    // Bind configuration "TestApp:Settings" section to the Settings object
    builder.Services.Configure<Settings>(builder.Configuration.GetSection("TestApp:Settings"));

    var app = builder.Build();

    // The rest of existing code in program.cs
    // ... ...
    ```

    #### [.NET Core 3.x](#tab/core3x)

    Open *Startup.cs* and update the `ConfigureServices` method.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddRazorPages();

        // Bind configuration "TestApp:Settings" section to the Settings object
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
    }
    ```

    ---

1. Open *Index.cshtml.cs* in the *Pages* directory, and update the `IndexModel` class with the following code. Add the `using Microsoft.Extensions.Options` namespace at the beginning of the file, if it's not already there.

    ```csharp
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public Settings Settings { get; }

        public IndexModel(IOptionsSnapshot<Settings> options, ILogger<IndexModel> logger)
        {
            Settings = options.Value;
            _logger = logger;
        }
    }
    ```

1. Open *Index.cshtml* in the *Pages* directory, and update the content with the following code.

    ```html
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
    }

    <style>
        body {
            background-color: @Model.Settings.BackgroundColor;
        }

        h1 {
            color: @Model.Settings.FontColor;
            font-size: @(Model.Settings.FontSize)px;
        }
    </style>

    <h1>@Model.Settings.Message</h1>
    ```

## Build and run the app locally

1. To build the app using the .NET Core CLI, navigate to the root directory of your project. Run the following command in the command shell:

    ```dotnetcli
    dotnet build
    ```

1. After the build completes successfully, run the following command to run the web app locally:

    ```dotnetcli
    dotnet run
    ```

1. The output of the `dotnet run` command contains two URLs. Open a browser and navigate to either one of these URLs to access your application. For example: `https://localhost:5001`.

    If you're working in the Azure Cloud Shell, select the *Web Preview* button followed by *Configure*. When prompted to configure the port for preview, enter *5000*, and select *Open and browse*.

    :::image type="content" source="./media/quickstarts/cloud-shell-web-preview.png" alt-text="Screenshot of Azure Cloud Shell. Locate Web Preview.":::

    The web page looks like this:
    :::image type="content" source="./media/quickstarts/aspnet-core-app-launch-local-navbar.png" alt-text="Screenshot of the browser.Launching quickstart app locally.":::

## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you:

* Provisioned a new App Configuration store.
* Connected to your App Configuration store using the App Configuration provider library.
* Read your App Configuration store's key-values with the configuration provider library.
* Displayed a web page using the settings you configured in your App Configuration store.

To learn how to configure your ASP.NET Core web app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)
