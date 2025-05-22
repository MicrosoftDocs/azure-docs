---
title: Quickstart for Azure App Configuration with ASP.NET Core
description: Create an ASP.NET Core app with Azure App Configuration to centralize storage and management of application settings for an ASP.NET Core application.
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, engagement-fy23
ms.topic: quickstart
ms.date: 12/10/2024
ms.author: zhenlwa
#Customer intent: As an ASP.NET Core developer, I want to learn how to manage all my app settings in one place.
---
# Quickstart: Create an ASP.NET Core app with Azure App Configuration

In this quickstart, you'll use Azure App Configuration to externalize storage and management of your app settings for an ASP.NET Core app. ASP.NET Core builds a single, key-value-based configuration object using settings from one or more [configuration providers](/aspnet/core/fundamentals/configuration#configuration-providers). App Configuration offers a .NET configuration provider library. Therefore, you can use App Configuration as an extra configuration source for your app. If you have an existing app, to begin using App Configuration, you'll only need a few small changes to your app startup code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download)

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Add key-values

Add the following key-values to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                                | Value                               |
|------------------------------------|-------------------------------------|
| *TestApp:Settings:BackgroundColor* | *white*                             |
| *TestApp:Settings:FontColor*       | *black*                             |
| *TestApp:Settings:FontSize*        | *24*                                |
| *TestApp:Settings:Message*         | *Data from Azure App Configuration* |

## Create an ASP.NET Core web app

Use the [.NET command-line interface (CLI)](/dotnet/core/tools) to create a new ASP.NET Core web app project. The [Azure Cloud Shell](https://shell.azure.com) provides these tools for you. They're also available across the Windows, macOS, and Linux platforms.

Run the following command to create an ASP.NET Core web app in a new *TestAppConfig* folder:

```dotnetcli
dotnet new webapp --output TestAppConfig
```

## Connect to the App Configuration store

Connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

1. Navigate into the project's directory *TestAppConfig*, and run the following command to add NuGet package references.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    dotnet add package Azure.Identity
    ```

    ### [Connection string](#tab/connection-string)
    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```
    ---

1. Create a user secret for the application by navigating into the *TestAppConfig* folder and running the following command.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
        
    The command uses [Secret Manager](/aspnet/core/security/app-secrets) to store a secret named `Endpoints:AppConfiguration`, which stores the endpoint for your App Configuration store. Replace the `<your-App-Configuration-endpoint>` placeholder with your App Configuration store's endpoint. You can find the endpoint in your App Configuration store's **Overview** blade in the Azure portal.
    
    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set Endpoints:AppConfiguration "<your-App-Configuration-endpoint>"
    ```
    
    ### [Connection string](#tab/connection-string)

    The command uses [Secret Manager](/aspnet/core/security/app-secrets) to store a secret named `ConnectionStrings:AppConfiguration`, which stores the connection string for your App Configuration store. Replace the `<your-App-Configuration-connection-string>` placeholder with your App Configuration store's read-only connection string. You can find the connection string in your App Configuration store's **Access settings** in the Azure portal.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set ConnectionStrings:AppConfiguration "<your-App-Configuration-connection-string>"
    ```

    > [!TIP]
    > Some shells will truncate the connection string unless it's enclosed in quotes. Ensure that the output of the `dotnet user-secrets list` command shows the entire connection string. If it doesn't, rerun the command, enclosing the connection string in quotes.
    
    Secret Manager stores the secret outside of your project tree, which helps prevent the accidental sharing of secrets within source code. It's used only to test the web app locally. When the app is deployed to Azure like [App Service](../app-service/overview.md), use the *Connection strings*, *Application settings* or environment variables to store the connection string. Alternatively, to avoid connection strings all together, you can [connect to App Configuration using managed identities](./howto-integrate-azure-managed-service-identity.md) or your other [Microsoft Entra identities](./concept-enable-rbac.md).
    
    ---

1. Open *Program.cs* and add the following namespaces:


    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Azure.AppConfiguration.AspNetCore;
    using Azure.Identity;
    ```

    ### [Connection string](#tab/connection-string)
    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Azure.AppConfiguration.AspNetCore;
    ```
    ---

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the `Program.cs` file.
 
    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    var builder = WebApplication.CreateBuilder(args); 
    
    // Retrieve the endpoint
    string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration")
        ?? throw new InvalidOperationException("The setting `Endpoints:AppConfiguration` was not found.");

    // Load configuration from Azure App Configuration 
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(new Uri(endpoint), new DefaultAzureCredential());
    });
    
    // The rest of existing code in program.cs
    // ... ...    
    ```

    ### [Connection string](#tab/connection-string)

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    // Retrieve the connection string
    string connectionString = builder.Configuration.GetConnectionString("AppConfiguration")
        ?? throw new InvalidOperationException("The connection string 'AppConfiguration' was not found.");

    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(connectionString);

    // The rest of existing code in program.cs
    // ... ...
    ```
    ---

    This code loads *all* key-values that have *no label* from your App Configuration store. For more information on loading data from App Configuration, see the [App Configuration provider API reference](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfigurationExtensions).


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

1. To build the app using the .NET CLI, navigate to the root directory of your project. Run the following command in the command shell:

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
