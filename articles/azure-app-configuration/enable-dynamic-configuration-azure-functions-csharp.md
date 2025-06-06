---
title: Tutorial for using Azure App Configuration dynamic configuration in an Azure Functions app
description: In this tutorial, you learn how to dynamically update the configuration data for Azure Functions apps
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 03/09/2025
ms.author: zhenlwa
ms.custom: "devx-track-csharp, azure-functions"
ms.tgt_pltfrm: Azure Functions

#Customer intent: I want to dynamically update my Azure Functions app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in an Azure Functions app

This tutorial shows how you can enable dynamic configuration updates in your Azure Functions app. It builds upon the Azure Functions app introduced in the quickstarts. Before you continue, finish [Create an Azure Functions app with Azure App Configuration](./quickstart-azure-functions-csharp.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up dynamic configuration refresh for your Azure Functions app.
> * Enable automatic configuration refresh using App Configuration middleware.
> * Use the latest configuration in Function calls when changes occur in your App Configuration store.

## Prerequisites

- Finish quickstart [Create an Azure Functions app with Azure App Configuration](./quickstart-azure-functions-csharp.md)

## Reload data from App Configuration

The Azure App Configuration .NET provider supports caching and dynamic refresh of configuration settings based on application activity. In this section, you configure the provider to refresh settings dynamically and enable automatic configuration refresh using the App Configuration middleware, `Microsoft.Azure.AppConfiguration.Functions.Worker`, each time a function executes.

> [!NOTE]  
> Azure App Configuration can be used with Azure Functions in either the [isolated worker model](../azure-functions/dotnet-isolated-process-guide.md) or the [in-process model](../azure-functions/functions-dotnet-class-library.md). This tutorial uses the isolated worker model as an example. You can find complete code examples for both models in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore/AzureFunctions).

1. Open the *Program.cs* file and update the call to `AddAzureAppConfiguration` to include the `ConfigureRefresh` method. This method configures the conditions for refreshing configuration settings, including specifying the keys to monitor and the interval between refresh checks.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    ```csharp
    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIG_ENDPOINT") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_ENDPOINT' is not set or is empty."));
        options.Connect(endpoint, new DefaultAzureCredential())
               // Load all keys that start with `TestApp:` and have no label
               .Select("TestApp:*")
               // Reload configuration if any selected key-values have changed.
               // Use the default refresh interval of 30 seconds. It can be overridden via AzureAppConfigurationRefreshOptions.SetRefreshInterval.
               .ConfigureRefresh(refreshOptions =>
               {
                   refreshOptions.RegisterAll();
               });
    });
    ```

    ### [Connection string](#tab/connection-string)

    ```csharp
    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        string connectionString = Environment.GetEnvironmentVariable("AZURE_APPCONFIG_CONNECTION_STRING") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_CONNECTION_STRING' is not set or is empty.");
        options.Connect(connectionString)
               // Load all keys that start with `TestApp:` and have no label
               .Select("TestApp:*")
               // Reload configuration if any selected key-values have changed.
               // Use the default refresh interval of 30 seconds. It can be overridden via AzureAppConfigurationRefreshOptions.SetRefreshInterval.
               .ConfigureRefresh(refreshOptions =>
               {
                   refreshOptions.RegisterAll();
               });
    });
    ```
    ---

    You call the `RegisterAll` method to instruct the App Configuration provider to reload the entire configuration whenever it detects a change in any of the selected key-values (those starting with *TestApp:* and having no label). For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

    By default, the refresh interval is set to 30 seconds. You can customize this interval by calling the `AzureAppConfigurationRefreshOptions.SetRefreshInterval` method.

1. Update the *Program.cs* file to enable automatic configuration refresh upon each function execution by adding the App Configuration middleware:

    ```csharp
    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        // Omitted the code added in the previous step.
    });

    // Add Azure App Configuration middleware to the service collection.
    builder.Services.AddAzureAppConfiguration()

    // Use Azure App Configuration middleware for dynamic configuration refresh.
    builder.UseAzureAppConfiguration();

    builder.ConfigureFunctionsWebApplication();

    builder.Build().Run();
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

2. To test your function, press F5. If prompted, accept the request from Visual Studio to download and install **Azure Functions Core (CLI)** tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

3. Copy the URL of your function from the Azure Functions runtime output.

    ![Quickstart Function debugging in VS](./media/quickstarts/function-visual-studio-debugging.png)

4. Paste the URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the local GET request returned by the function.

    ![Quickstart Function launch local](./media/quickstarts/dotnet-core-function-launch-local.png)

5. Select your App Configuration store in Azure portal and update the value of the following key in **Configuration explorer**.

    | Key | Value |
    |---|---|
    | *TestApp:Settings:Message* | *Data from Azure App Configuration - Updated* |

6. Refresh your browser a few times. After the default refresh interval of 30-seconds passes, the page displays the updated value retrieved from your Azure Functions app.

    ![Quickstart Function refresh local](./media/quickstarts/dotnet-core-function-refresh-local.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your Azure Functions app to dynamically refresh configuration settings from App Configuration.

To learn how to use feature flags from Azure App Configuration within your Azure Functions app, proceed to the following tutorial.

> [!div class="nextstepaction"]
> [Use feature flags in Azure Functions](./quickstart-feature-flag-azure-functions-csharp.md)

To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Access App Configuration using managed identity](./howto-integrate-azure-managed-service-identity.md)
