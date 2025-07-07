---
title: Quickstart for adding feature flags to Azure Functions | Microsoft Docs
description: In this quickstart, use Azure Functions with feature flags from Azure App Configuration and test the function locally.
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 03/15/2025
ms.author: zhenlwa
---
# Quickstart: Add feature flags to an Azure Functions app

In this quickstart, you create an Azure Functions app and use feature flags in it. You use the feature management from Azure App Configuration to centrally store all your feature flags and control their states.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/vs) with the **Azure development** workload.

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

> [!div class="mx-imgBorder"]
> ![Enable feature flag named Beta](media/add-beta-feature-flag.png)

## Create a Function App

Create an Azure Functions app using Visual Studio by selecting the **Azure Functions (C#)** template. This template guides you through configuring essential settings for your project. For detailed instructions, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md?pivots=isolated).

Use the following table as a reference for key parameters when creating your Function App.

| Setting              | Value                      |
|----------------------|----------------------------|
| Functions worker     | .NET 8.0 Isolated          |
| Function             | HTTP trigger               |
| Authorization level  | Anonymous                  |

> [!NOTE]  
> Azure App Configuration can be used with Azure Functions in either the [isolated worker model](../azure-functions/dotnet-isolated-process-guide.md) or the [in-process model](../azure-functions/functions-dotnet-class-library.md). This quickstart uses the isolated worker model as an example. You can find complete code examples for both models in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore/AzureFunctions).

## Connect to an App Configuration store
You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search for and add the latest stable version of following NuGet packages to your project.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    - Microsoft.Azure.AppConfiguration.Functions.Worker
    - Microsoft.FeatureManagement
    - Azure.Identity

    ### [Connection string](#tab/connection-string)

    - Microsoft.Azure.AppConfiguration.Functions.Worker
    - Microsoft.FeatureManagement

    ---

1. Open *Program.cs* and update the code as follows. You add Azure App Configuration as an extra configuration source by calling the `AddAzureAppConfiguration` method.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.
    
    ```csharp
    using Azure.Identity;
    using Microsoft.Azure.Functions.Worker.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using Microsoft.FeatureManagement;

    var builder = FunctionsApplication.CreateBuilder(args);

    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIG_ENDPOINT") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_ENDPOINT' is not set or is empty."));
        options.Connect(endpoint, new DefaultAzureCredential())
               // Load all feature flags with no label. To load feature flags with specific keys and labels, set via FeatureFlagOptions.Select.
               // Use the default refresh interval of 30 seconds. It can be overridden via FeatureFlagOptions.SetRefreshInterval.
               .UseFeatureFlags();
    });
    ```

    ### [Connection string](#tab/connection-string)

    ```csharp
    using Microsoft.Azure.Functions.Worker.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using Microsoft.FeatureManagement;

    var builder = FunctionsApplication.CreateBuilder(args);

    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        string connectionString = Environment.GetEnvironmentVariable("AZURE_APPCONFIG_CONNECTION_STRING") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_CONNECTION_STRING' is not set or is empty.");
        options.Connect(connectionString)
               // Load all feature flags with no label. To load feature flags with specific keys and labels, set via FeatureFlagOptions.Select.
               // Use the default refresh interval of 30 seconds. It can be overridden via FeatureFlagOptions.SetRefreshInterval.
               .UseFeatureFlags();
    });
    ```
    ---

    The `UseFeatureFlags()` method instructs the provider to load feature flags. By default, all feature flags without labels are loaded and refreshed every 30 seconds. The selection and refresh behavior of feature flags are configured independently from other configuration key-values. You can customize these behaviors by passing a `FeatureFlagOptions` action to the `UseFeatureFlags` method. Use `FeatureFlagOptions.Select` to specify the keys and labels of feature flags to load, and use `FeatureFlagOptions.SetRefreshInterval` to override the default refresh interval.

    > [!TIP]
    > If you don't want any configuration other than feature flags to be loaded to your application, you can call `options.Select("_")` to only load a nonexisting dummy key `"_"`. By default, all configuration key-values without labels in your App Configuration store will be loaded if no `Select` method is called.

1. Update the *Program.cs* file to enable automatic feature flag refresh on each function execution by adding the Azure App Configuration middleware. You also register feature management service, allowing you to inject and use it in your function code later.

    ```csharp
    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        // Omitted the code added in the previous step.
    });

    // Add Azure App Configuration middleware and feature management to the service collection.
    builder.Services
        .AddAzureAppConfiguration()
        .AddFeatureManagement();

    // Use Azure App Configuration middleware for dynamic configuration and feature flag refresh.
    builder.UseAzureAppConfiguration();

    builder.ConfigureFunctionsWebApplication();

    builder.Build().Run();
    ```

1. Open *Function1.cs*, and add the following namespace.

    ```csharp
    using Microsoft.FeatureManagement;
    ```

   Update the constructor to obtain an instance of `IVariantFeatureManagerSnapshot` through dependency injection.

    ```csharp
    private readonly IVariantFeatureManagerSnapshot _featureManager;
    private readonly ILogger<Function1> _logger;

    public Function1(IVariantFeatureManagerSnapshot featureManager, ILogger<Function1> logger)
    {
        _featureManager = featureManager;
        _logger = logger;
    }
    ```

1. Update the `Run` method to return a response message based on the state of the feature flag.

    ```csharp
    [Function("Function1")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        // Read feature flag
        string featureName = "Beta";
        bool featureEnabled = await _featureManager.IsEnabledAsync(featureName, req.HttpContext.RequestAborted);

        return new OkObjectResult(featureEnabled
            ? $"The Feature Flag '{featureName}' is turned ON!"
            : $"The Feature Flag '{featureName}' is turned OFF");
    }
    ```

## Test the function locally

1. Set the environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

    ### [Connection string](#tab/connection-string)
    Set the environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access settings* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```

   If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```    
    ---

1. Press F5 to test your function. If prompted, accept the request from Visual Studio to download and install **Azure Functions Core (CLI)** tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

1. Copy the URL of your function from the Azure Functions runtime output.

    ![Quickstart Function debugging in VS](./media/quickstarts/function-visual-studio-debugging.png)

1. Paste the URL for the HTTP request into your browser's address bar. The following image shows the response indicating that the feature flag *Beta* is disabled. 

    ![Quickstart Function feature flag disabled](./media/quickstarts/functions-launch-ff-disabled.png)

1. In the Azure portal, navigate to your App Configuration store. Under **Operations**, select **Feature manager**, locate the *Beta* feature flag, and set the **Enabled** toggle to **On**.

1. Refresh the browser a few times. When the refresh interval time window passes, the page changes to indicate the feature flag *Beta* is turned on, as shown in the image.
 
    ![Quickstart Function feature flag enabled](./media/quickstarts/functions-launch-ff-enabled.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a feature flag and used it with an Azure Functions app.

For the full feature rundown of the .NET feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)

To learn more about managing feature flags in Azure App Configuration, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Manage feature flags in Azure App Configuration](./manage-feature-flags.md)
