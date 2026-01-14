---
title: Quickstart for Adding Feature Flags to .NET/.NET Framework Apps
titleSuffix: Azure App Configuration
description: Find out how to implement feature flags in .NET and .NET Framework apps. See how to use feature management and Azure App Configuration for dynamic configuration.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.date: 07/25/2025
ms.author: zhiyuanliang
# customer intent: As a .NET developer, I want to find out how to use feature flags so that I can control feature availability quickly and confidently.
---
# Quickstart: Add feature flags to a .NET/.NET Framework console app

In this quickstart, you incorporate Azure App Configuration into a .NET or .NET Framework console app to create an end-to-end implementation of feature management. You can use App Configuration to centrally store all your feature flags and control their states. 

The .NET feature management libraries extend .NET by providing feature flag support. These libraries are built on top of the .NET configuration system. They integrate with App Configuration through its .NET configuration provider.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store, as shown in the [quickstart for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/downloads).
- [.NET SDK 8.0 or later](https://dotnet.microsoft.com/download) for a .NET console app.
- [.NET Framework 4.7.2 or later](https://dotnet.microsoft.com/download/dotnet-framework) for a .NET Framework console app.

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store by using the Azure portal or the Azure CLI, see [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

:::image type="content" source="media/add-beta-feature-flag.png" alt-text="Screenshot of the Create a new feature flag dialog in the Azure portal. The name and key fields contain Beta. The label and description are blank." lightbox="media/add-beta-feature-flag.png":::

## Configure access settings

The app that you create in this quickstart connects to your App Configuration store to access your feature flag settings. To connect to App Configuration, your app can use Microsoft Entra ID or a connection string. Microsoft Entra ID is the recommended approach.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

### Assign an App Configuration data role

By default, the app that you create uses `DefaultAzureCredential` to authenticate to your App Configuration store. `DefaultAzureCredential` is a chain of token credentials. For authorization to work, you need to grant the **App Configuration Data Reader** role to the credential that your app uses. For instructions, see [Authentication with token credentials](./concept-enable-rbac.md#authentication-with-token-credentials). Allow sufficient time for the role assignment to propagate before running your app.

### Set an environment variable

Your app uses an environment variable to establish the connection to App Configuration. Use one of the following commands to set an environment variable named `Endpoint` to the endpoint of your App Configuration store.

- If you use Command Prompt, run the following command:

  ```console
  setx Endpoint "<endpoint-of-your-app-configuration-store>"
  ```

  Close and reopen Command Prompt so that the change takes effect. Verify that the environment variable is set by printing its value to the console.

- If you use Windows PowerShell, run the following command:

  ```azurepowershell
  [System.Environment]::SetEnvironmentVariable("Endpoint", "<endpoint-of-your-app-configuration-store>", "User")
  ```

### [Connection string](#tab/connection-string)

Your app uses an environment variable to establish the connection to App Configuration. Use one of the following commands to set an environment variable named `ConnectionString` to the connection string of your App Configuration store.

- If you use Command Prompt, run the following command:

  ```console
  setx ConnectionString "<connection-string-of-your-app-configuration-store>"
  ```

  Close and reopen Command Prompt so that the change takes effect. Verify that the environment variable is set by printing its value to the console.

- If you use Windows PowerShell, run the following command:

  ```azurepowershell
  [System.Environment]::SetEnvironmentVariable("ConnectionString", "<connection-string-of-your-app-configuration-store>", "User")
  ```

---

## Create a console app

To use Visual Studio to create a new console app project, take the following steps.

1. Open Visual Studio. If it's already running, close and reopen it so that it recognizes the environment variable you set in the previous section.

1. In Visual Studio, select **File** > **New** > **Project**.

1. In the **Create a new project** dialog, enter **Console** into the search box.

    - If you want to create a .NET app, select **Console App**, and then select **Next**.
    - If you want to create a .NET Framework app, select **Console App (.NET Framework)**, and then select **Next**.

1. In the **Configure your new project** dialog, enter a project name.

    - If you want to create a .NET app, select **Next** to open the **Additional information** dialog. In that dialog, select a .NET framework, clear the **Do not use top-level statements** checkbox, and then select **Create**.
    - If you want to create a .NET Framework app, select **.NET Framework 4.7.2** or a later version under **Framework**, and then select **Create**.

## Use the feature flag

To use the feature flag in your app, take the following steps.

1. In **Solution Explorer**, right-click your project, and then select **Manage NuGet Packages**.

1. On the **Browse** tab, search for and add the latest stable versions of the following NuGet packages to your project:
 
    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    - Microsoft.Extensions.Configuration.AzureAppConfiguration
    - Microsoft.FeatureManagement
    - Azure.Identity

    ### [Connection string](#tab/connection-string)

    - Microsoft.Extensions.Configuration.AzureAppConfiguration
    - Microsoft.FeatureManagement

    ---

1. Open *Program.cs* and add the following statements to the beginning of the file.

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

1. As shown in the following code blocks, update *Program.cs* by making three changes:

    - To load feature flags from App Configuration, add a call to the `UseFeatureFlags` method.
    - To read feature flags from the configuration, create an instance of `FeatureManager`.
    - Display a message if the *Beta* feature flag is enabled.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    #### .NET

    ```csharp
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            string endpoint = Environment.GetEnvironmentVariable("Endpoint");
            options.Connect(new Uri(endpoint), new DefaultAzureCredential())
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
                options.Connect(new Uri(endpoint), new DefaultAzureCredential())
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

1. In Visual Studio, select **Ctrl**+**F5** to build and run the application. The following output should appear in the console.

    :::image type="content" source="./media/quickstarts/dotnet-app-feature-flag-disabled.png" alt-text="Screenshot of a Command Prompt window that contains output from the app. The output contains the text Hello World!":::

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select your App Configuration store. 

1. Select **Feature manager** and locate the *Beta* feature flag. Turn on the **Enabled** toggle to enable the flag.

1. Run the application again. The *Beta* message should appear in the console.

    :::image type="content" source="./media/quickstarts/dotnet-app-feature-flag.png" alt-text="Screenshot of a Command Prompt window that contains output from the app. The output contains the text Welcome to the beta! and Hello World!":::

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a feature flag in App Configuration and used it with a console app. To find out how to dynamically update feature flags and other configuration values without restarting the application, see the following tutorials:

> [!div class="nextstepaction"]
> [Use dynamic configuration in a .NET app](./enable-dynamic-configuration-dotnet-core.md)

> [!div class="nextstepaction"]
> [Use dynamic configuration in a .NET Framework app](./enable-dynamic-configuration-dotnet.md)

To enable feature management capability for other types of apps, see the following quickstarts:

> [!div class="nextstepaction"]
> [Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md)

> [!div class="nextstepaction"]
> [Add feature flags to a .NET background service](./quickstart-feature-flag-dotnet-background-service.md)

For the full feature rundown of the .NET feature management library, see the following document:

> [!div class="nextstepaction"]
> [.NET feature management](./feature-management-dotnet-reference.md)
