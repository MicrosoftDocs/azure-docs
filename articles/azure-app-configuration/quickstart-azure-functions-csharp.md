---
title: Quickstart for Azure App Configuration with Azure Functions | Microsoft Docs
description: "In this quickstart, make an Azure Functions app with Azure App Configuration and C#. Create and connect to an App Configuration store. Test the function locally."
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.date: 03/09/2025
ms.author: zhenlwa
ms.custom: "devx-track-csharp, azure-functions"
ms.tgt_pltfrm: Azure Functions

#Customer intent: As an Azure Functions developer, I want to manage all my app settings in one place using Azure App Configuration.
---
# Quickstart: Create an Azure Functions app with Azure App Configuration

This quickstart shows you how to centralize and manage your Azure Functions application settings outside of your code using Azure App Configuration. With the .NET configuration provider integration, you can add App Configuration as an extra configuration source with just a few simple code changes.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/vs) with the **Azure development** workload.
- [Azure Functions tools](../azure-functions/functions-develop-vs.md).

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
| -------------------------- | ----------------------------------- |
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

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
    - Azure.Identity

    ### [Connection string](#tab/connection-string)

    - Microsoft.Azure.AppConfiguration.Functions.Worker

    ---

2. Open *Program.cs* and update the code as follows. You add Azure App Configuration as an additional configuration source by calling the `AddAzureAppConfiguration` method.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.
    
    ```csharp
    using Azure.Identity;
    using Microsoft.Azure.Functions.Worker.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;

    var builder = FunctionsApplication.CreateBuilder(args);

    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIG_ENDPOINT") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_ENDPOINT' is not set or is empty."));
        options.Connect(endpoint, new DefaultAzureCredential())
               // Load all keys that start with `TestApp:` and have no label
               .Select("TestApp:*");
    });
    ```

    ### [Connection string](#tab/connection-string)

    ```csharp
    using Microsoft.Azure.Functions.Worker.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;

    var builder = FunctionsApplication.CreateBuilder(args);

    // Connect to Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        string connectionString = Environment.GetEnvironmentVariable("AZURE_APPCONFIG_CONNECTION_STRING") ?? 
            throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIG_CONNECTION_STRING' is not set or is empty.");
        options.Connect(connectionString)
               // Load all keys that start with `TestApp:` and have no label
               .Select("TestApp:*");
    });
    ```

    ---

3. Open *Function1.cs*, and add the following namespace.

    ```csharp
    using Microsoft.Extensions.Configuration;
    ```

   Update the constructor to obtain an instance of `IConfiguration` through dependency injection.

    ```csharp
    private readonly IConfiguration _configuration;
    private readonly ILogger<Function1> _logger;

    public Function1(IConfiguration configuration, ILogger<Function1> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
    ```

4. Update the `Run` method to read values from the configuration.

    ```csharp
    [Function("Function1")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        // Read configuration data
        string key = "TestApp:Settings:Message";
        string? message = _configuration[key];

        return new OkObjectResult(message ?? $"Please create a key-value with the key '{key}' in Azure App Configuration.");
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

2. Press F5 to test your function. If prompted, accept the request from Visual Studio to download and install **Azure Functions Core (CLI)** tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

3. Copy the URL of your function from the Azure Functions runtime output.

    ![Quickstart Function debugging in VS](./media/quickstarts/function-visual-studio-debugging.png)

4. Paste the URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the local GET request returned by the function.

    ![Quickstart Function launch local](./media/quickstarts/dotnet-core-function-launch-local.png)

## Manage trigger parameters with App Configuration references

Azure Functions triggers define how a function is invoked. Trigger attributes, such as queue names or database names, are loaded at host startup time and can't directly retrieve values from Azure App Configuration. To manage these parameters, you can use the App Configuration reference feature available for Azure Functions and App Service.

The App Configuration reference feature allows you to reference key-values stored in Azure App Configuration directly from your application settings. Azure Functions resolves these references at startup, enabling you to manage trigger parameters centrally and securely.

For example, consider a queue-triggered Function app. Instead of specifying the queue name directly in the trigger attribute, you can reference a key-value stored in Azure App Configuration.

1. In your Azure App Configuration store, add a key-value for your queue name:

   | Key                          | Value                                        |
   |------------------------------|----------------------------------------------|
   | *TestApp:Storage:QueueName*  | *\<The queue name in your storage account>*  |

1. In your Function app, select **Settings** -> **Environment variables** -> **App settings** in the Azure portal, and create an application setting that references the App Configuration key:

   | Name                 | Value                                      |
   |----------------------|--------------------------------------------|
   | *MyQueueName*        | `@Microsoft.AppConfiguration(Endpoint=<your-store-endpoint>; Key=TestApp:Storage:QueueName)` |

   > [!TIP]
   > If you have multiple key-values in Azure App Configuration, you can [export them in batch as App Configuration references](./howto-import-export-data.md?#export-data-to-azure-app-service) to Azure Functions using the Azure portal or CLI.

1. Enable the managed identity for your Azure Functions app and assign it the **App Configuration Data Reader** role for your App Configuration store. For detailed instructions on setting up App Configuration references, see [Use App Configuration references in App Service and Azure Functions](../app-service/app-service-configuration-references.md).

1. Update your queue-triggered function to use the application setting:

   ```csharp
   [Function("QueueTriggeredFunction")]
   public void Run([QueueTrigger(queueName: "%MyQueueName%")] QueueMessage message)
   {
       _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
   }
   ```

   At runtime, Azure Functions resolves the `%MyQueueName%` placeholder to the value stored in Azure App Configuration, allowing you to manage trigger parameters centrally without hardcoding them into your function code.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you integrated Azure App Configuration with an Azure Functions app. To learn how to enable your Function app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in Azure Functions](./enable-dynamic-configuration-azure-functions-csharp.md)

To learn how to use feature flags from Azure App Configuration within your Azure Functions app, proceed to the following tutorial.

> [!div class="nextstepaction"]
> [Use feature flags in Azure Functions](./quickstart-feature-flag-azure-functions-csharp.md)

To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Access App Configuration using managed identity](./howto-integrate-azure-managed-service-identity.md)
