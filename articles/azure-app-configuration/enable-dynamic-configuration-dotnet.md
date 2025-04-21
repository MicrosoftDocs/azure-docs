---
title: '.NET Framework: dynamic configuration in App Configuration'
description: In this tutorial, you learn how to dynamically update the configuration data for .NET Framework apps using Azure App Configuration. 
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.topic: tutorial
ms.date: 03/06/2025
ms.author: malev
#Customer intent: I want to dynamically update my .NET Framework app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in a .NET Framework app

Data from App Configuration can be loaded as App Settings in a .NET Framework app. For more information, see the [quickstart](./quickstart-dotnet-app.md). However, as is designed by the .NET Framework, the App Settings can only refresh upon app restart. The App Configuration .NET provider is a .NET Standard library. It supports caching and refreshing configuration dynamically without app restart. This tutorial shows how you can implement dynamic configuration updates in a .NET Framework console app.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your .NET Framework app to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration in your application.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/vs)
- [.NET Framework 4.7.2 or later](https://dotnet.microsoft.com/download/dotnet-framework)

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
|----------------------------|-------------------------------------|
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

## Create a .NET Framework console app

1. Start Visual Studio and select **Create a new project**.

1. In **Create a new project**, filter on the **Console** project type and select **Console App (.NET Framework)** with C# from the project template list. Press **Next**.

1. In **Configure your new project**, enter a project name. Under **Framework**, select **.NET Framework 4.7.2** or higher. Press **Create**.

## Reload data from App Configuration

1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search and add the latest version of the following NuGet package to your project.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    - *Microsoft.Extensions.Configuration.AzureAppConfiguration*
    - *Azure.Identity*

    ### [Connection string](#tab/connection-string)

   - *Microsoft.Extensions.Configuration.AzureAppConfiguration*
    ---

1. Open *Program.cs* and add following namespaces.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Azure.Identity;
    ```

   ### [Connection string](#tab/connection-string)

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```
    ---

1. Add two variables to store configuration-related objects.

    ```csharp
    private static IConfiguration _configuration;
    private static IConfigurationRefresher _refresher;
    ```

1. Update the `Main` method to connect to App Configuration with the specified refresh options. Connect to App Configuration using Microsoft Entra ID (recommended), or a connection string.


    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader role**. Be sure to allow sufficient time for the permission to propagate before running your application.
 
    ```csharp
    // Existing code in Program.cs
    // ... ...
    
    static void Main(string[] args)
    {
        var builder = new ConfigurationBuilder();
        builder.AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("Endpoint"); 
            options.Connect(new Uri(endpoint), new DefaultAzureCredential())
                   // Load all keys that start with `TestApp:` and have no label.
                   .Select("TestApp:*")
                   // Reload configuration if any selected key-values have changed.
                   .ConfigureRefresh(refresh =>
                   {
                       refresh.RegisterAll()
                              .SetRefreshInterval(TimeSpan.FromSeconds(10));
                   });

            _refresher = options.GetRefresher();
        });

        _configuration = builder.Build();
        PrintMessage().Wait();
    }
    
    // The rest of existing code in Program.cs
    // ... ...
    ```
 
    ### [Connection string](#tab/connection-string)
 
    ```csharp
    // Existing code in Program.cs
    // ... ...

    static void Main(string[] args)
    {
        var builder = new ConfigurationBuilder();
        builder.AddAzureAppConfiguration(options =>
        {
            options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                   // Load all keys that start with `TestApp:` and have no label.
                   .Select("TestApp:*")
                   // Reload configuration if any selected key-values have changed.
                   .ConfigureRefresh(refresh =>
                   {
                       refresh.RegisterAll()
                              .SetRefreshInterval(TimeSpan.FromSeconds(10));
                   });

            _refresher = options.GetRefresher();
        });

        _configuration = builder.Build();
        PrintMessage().Wait();
    }
    // The rest of existing code in Program.cs
    // ... ...
    ```
    ---
    Inside the `ConfigureRefresh` method, you call the `RegisterAll` method to instruct the App Configuration provider to reload the entire configuration whenever it detects a change in any of the selected key-values (those starting with *TestApp:* and having no label). For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

    The `SetRefreshInterval` method specifies the minimum time that must elapse before a new request is made to App Configuration to check for any configuration changes. In this example, you override the default expiration time of 30 seconds, specifying a time of 10 seconds instead for demonstration purposes.

1. Add a method called `PrintMessage()` that triggers a refresh of configuration data from App Configuration.

    ```csharp
    private static async Task PrintMessage()
    {
        Console.WriteLine(_configuration["TestApp:Settings:Message"] ?? "Hello world!");

        // Wait for the user to press Enter
        Console.ReadLine();

        await _refresher.TryRefreshAsync();
        Console.WriteLine(_configuration["TestApp:Settings:Message"] ?? "Hello world!");
    }
    ```

    Calling the `ConfigureRefresh` method alone won't cause the configuration to refresh automatically. You call the `TryRefreshAsync` method from the interface `IConfigurationRefresher` to trigger a refresh. This design is to avoid requests sent to App Configuration even when your application is idle. You can include the `TryRefreshAsync` call where you consider your application active. For example, it can be when you process an incoming message, an order, or an iteration of a complex task. It can also be in a timer if your application is active all the time. In this example, you call `TryRefreshAsync` when you press the Enter key. Note that, even if the call `TryRefreshAsync` fails for any reason, your application will continue to use the cached configuration. Another attempt will be made when the configured refresh interval has passed and the `TryRefreshAsync` call is triggered by your application activity again. Calling `TryRefreshAsync` is a no-op before the configured refresh interval elapses, so its performance impact is minimal, even if it's called frequently.

## Build and run the app locally

1. Set an environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    Set an environment variable named `Endpoint` to the endpoint of your App Configuration store found under the **Overview** of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx Endpoint "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:Endpoint = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export Endpoint='<endpoint-of-your-app-configuration-store>'
    ```

    ### [Connection string](#tab/connection-string)

    Set an environment variable named `ConnectionString` to the read-only key connection string found under **Access settings** of your store in the Azure portal.

    If you use the Windows command prompt, run the following command:
    ```console
    setx ConnectionString "<connection-string-of-your-app-configuration-store>"
    ```

    If you use Windows PowerShell, run the following command:
    ```powershell
    $Env:ConnectionString = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export ConnectionString='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. Restart Visual Studio to allow the change to take effect. 

1. Press Ctrl + F5 to build and run the console app.

    ![App launch local](./media/dotnet-app-run.png)

1. In the Azure portal, navigate to the **Configuration explorer** of your App Configuration store, and update the value of the following key.

    | Key                        | Value                                         |
    |----------------------------|-----------------------------------------------|
    | *TestApp:Settings:Message* | *Data from Azure App Configuration - Updated* |

1. Back in the running application, press the Enter key to trigger a refresh and print the updated value in the Command Prompt or PowerShell window.

    ![App refresh local](./media/dotnet-app-run-refresh.png)
    
    > [!NOTE]
    > Since the refresh interval was set to 10 seconds using the `SetRefreshInterval` method while specifying the configuration for the refresh operation, the value for the configuration setting will only be updated if at least 10 seconds have elapsed since the last refresh for that setting.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your .NET Framework app to dynamically refresh configuration settings from App Configuration. To learn how to enable dynamic configuration in an ASP.NET Web Application (.NET Framework), continue to the next tutorial:

> [!div class="nextstepaction"]
> [Enable dynamic configuration in ASP.NET Web Applications](./enable-dynamic-configuration-aspnet-netfx.md)

To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial:

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
