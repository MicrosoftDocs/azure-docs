---
title: Quickstart for adding feature flags to .NET/.NET Framework apps
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your .NET application using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.date: 2/19/2024
ms.author: zhiyuanliang
#Customer intent: As a .NET developer, I want to use feature flags to control feature availability quickly and confidently.
---
# Quickstart: Add feature flags to a .NET/.NET Framework console app

In this quickstart, you incorporate Azure App Configuration into a .NET console app to create an end-to-end implementation of feature management. You can use App Configuration to centrally store all your feature flags and control their states. 

The .NET Feature Management libraries extend the framework with feature flag support. These libraries are built on top of the .NET configuration system. They integrate with App Configuration through its .NET configuration provider.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/downloads)
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download) for .NET console app.
- [.NET Framework 4.7.2 or later](https://dotnet.microsoft.com/download/dotnet-framework) for .NET Framework console app.

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

> [!div class="mx-imgBorder"]
> ![Enable feature flag named Beta](media/add-beta-feature-flag.png)

## Create a console app

You can use Visual Studio to create a new console app project.

1. Start Visual Studio, and select **File** > **New** > **Project**.

1. In **Create a new project**, filter on the **Console** project type and select **Console App**. If you want to create a .NET Framework app, select **Console App (.NET Framework)** instead. Click **Next**.

1. In **Configure your new project**, enter a project name. If you're creating a .NET Framework app, select **.NET Framework 4.7.2** or higher under **Framework**. Click **Create**.

## Use the feature flag

1. Right-click your project and select **Manage NuGet Packages**. On the **Browse** tab, search and add the latest stable versions of the following NuGet packages to your project.
 
    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```
    Microsoft.Extensions.Configuration.AzureAppConfiguration
    Microsoft.FeatureManagement
    Azure.Identity
    ```

    ### [Connection string](#tab/connection-string)

    ```
    Microsoft.Extensions.Configuration.AzureAppConfiguration
    Microsoft.FeatureManagement
    ```
    ---

1. Open *Program.cs* and add the following statements.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Microsoft.FeatureManagement;
    using Azure.Identity;
    ```

    ### [Connection string](#tab/connection-string)

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Microsoft.FeatureManagement;
    ```
    ---

1. Update the *Program.cs* file and add a call to the `UseFeatureFlags` method to load feature flags from App Configuration. Then create a `FeatureManager` to read feature flags from the configuration. Finally, display a message if the *Beta* feature flag is enabled.

    You can connect to your App Configuration store using Microsoft Entra ID (recommended) or a connection string.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store by default. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    #### .NET

    ```csharp
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("Endpoint");
            options.Connect(new Uri(endpoint), new DefaultAzureCredential());
                   .UseFeatureFlags();
        }).Build();

    var featureManager = new FeatureManager(
        new ConfigurationFeatureDefinitionProvider(configuration));

    if (await featureManager.IsEnabledAsync("Beta"))
    {
        Console.WriteLine("Welcome to the beta!");
    }

    Console.WriteLine("Hello World!");
    ```

    #### .NET Framework

    ```csharp
    public static async Task Main(string[] args)
    {         
        IConfiguration configuration = new ConfigurationBuilder()
            .AddAzureAppConfiguration(options =>
            {
                string endpoint = Environment.GetEnvironmentVariable("Endpoint");
                options.Connect(new Uri(endpoint), new DefaultAzureCredential());
                       .UseFeatureFlags();
            }).Build();

        var featureManager = new FeatureManager(
            new ConfigurationFeatureDefinitionProvider(configuration));

        if (await featureManager.IsEnabledAsync("Beta"))
        {
            Console.WriteLine("Welcome to the beta!");
        }

        Console.WriteLine("Hello World!");
    }
    ```

    ### [Connection string](#tab/connection-string)

    #### .NET

    ```csharp
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                   .UseFeatureFlags();
        }).Build();

    var featureManager = new FeatureManager(
        new ConfigurationFeatureDefinitionProvider(configuration));

    if (await featureManager.IsEnabledAsync("Beta"))
    {
        Console.WriteLine("Welcome to the beta!");
    }

    Console.WriteLine("Hello World!");
    ```

    #### .NET Framework

    ```csharp
    public static async Task Main(string[] args)
    {         
        IConfiguration configuration = new ConfigurationBuilder()
            .AddAzureAppConfiguration(options =>
            {
                options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                       .UseFeatureFlags();
            }).Build();

        var featureManager = new FeatureManager(
            new ConfigurationFeatureDefinitionProvider(configuration));

        if (await featureManager.IsEnabledAsync("Beta"))
        {
            Console.WriteLine("Welcome to the beta!");
        }

        Console.WriteLine("Hello World!");
    }
    ```

    ---

## Build and run the app locally

1. Set an environment variable named **ConnectionString** to the connection string of your App Configuration store.

    ### [Windows command prompt](#tab/windowscommandprompt)

    If you use the Windows command prompt, run the following command.

    ```console
    setx ConnectionString "<connection-string-of-your-app-configuration-store>"
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command.

    ```azurepowershell
    $Env:ConnectionString = "<connection-string-of-your-app-configuration-store>"
    ```

    ---

1. Restart Visual Studio to allow the change to take effect. 

1. Press Ctrl + F5 to build and run the application.

1. You should see the following outputs in the console.

    ![App with feature flag disabled](./media/quickstarts/dotnet-app-feature-flag-disabled.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store that you created previously. 

1. Select **Feature manager** and locate the *Beta* feature flag. Enable the flag by selecting the checkbox under **Enabled**.

1. Run the application again. You should see the Beta message in the console.

    ![App with feature flag enabled](./media/quickstarts/dotnet-app-feature-flag.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a feature flag in App Configuration and used it with a console app. To learn how to dynamically update feature flags and other configuration values without restarting the application, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in a .NET app](./enable-dynamic-configuration-dotnet-core.md)

> [!div class="nextstepaction"]
> [Enable dynamic configuration in a .NET Framework app](./enable-dynamic-configuration-dotnet.md)

To enable feature management capability for other types of apps, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Use feature flags in ASP.NET Core apps](./quickstart-feature-flag-aspnet-core.md)

> [!div class="nextstepaction"]
> [Use feature flags in .NET background services](./quickstart-feature-flag-dotnet-background-service.md)

For the full feature rundown of the .NET feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
