---
title: Tutorial for using Azure App Configuration dynamic configuration in an Azure Functions app | Microsoft Docs
description: In this tutorial, you learn how to dynamically update the configuration data for Azure Functions apps
services: azure-app-configuration
documentationcenter: ''
author: zhenlan
manager: qingye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 11/17/2019
ms.author: zhenlwa
ms.custom: "devx-track-csharp, azure-functions"
ms.tgt_pltfrm: Azure Functions

#Customer intent: I want to dynamically update my Azure Functions app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in an Azure Functions app

The App Configuration .NET configuration provider supports caching and refreshing configuration dynamically driven by application activity. This tutorial shows how you can implement dynamic configuration updates in your code. It builds on the Azure Functions app introduced in the quickstarts. Before you continue, finish [Create an Azure functions app with Azure App Configuration](./quickstart-azure-functions-csharp.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your Azure Functions app to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration to your Azure Functions calls.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs) with the **Azure development** workload
- [Azure Functions tools](../azure-functions/functions-develop-vs.md#check-your-tools-version)
- Finish quickstart [Create an Azure functions app with Azure App Configuration](./quickstart-azure-functions-csharp.md)

## Reload data from App Configuration

1. Open *Startup.cs*, and update the `ConfigureAppConfiguration` method. 

   The `ConfigureRefresh` method registers a setting to be checked for changes whenever a refresh is triggered within the application, which you will do in the later step when adding `_configurationRefresher.TryRefreshAsync()`. The `refreshAll` parameter instructs the App Configuration provider to reload the entire configuration whenever a change is detected in the registered setting.

    All settings registered for refresh have a default cache expiration of 30 seconds. It can be updated by calling the `AzureAppConfigurationRefreshOptions.SetCacheExpiration` method.

    ```csharp
    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
        builder.ConfigurationBuilder.AddAzureAppConfiguration(options =>
        {
            options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                   // Load all keys that start with `TestApp:`
                   .Select("TestApp:*")
                   // Configure to reload configuration if the registered 'Sentinel' key is modified
                   .ConfigureRefresh(refreshOptions =>
                      refreshOptions.Register("TestApp:Settings:Sentinel", refreshAll: true));
        });
    }
    ```

   > [!TIP]
   > When you are updating multiple key-values in App Configuration, you would normally don't want your application to reload configuration before all changes are made. You can register a **sentinel** key and only update it when all other configuration changes are completed. This helps to ensure the consistency of configuration in your application.

2. Update the `Configure` method to make Azure App Configuration services available through dependency injection.

    ```csharp
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddAzureAppConfiguration();
    }
    ```

3. Open *Function1.cs*, and add the following namespaces.

    ```csharp
    using System.Linq;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

   Update the constructor to obtain the instance of `IConfigurationRefresherProvider` through dependency injection, from which you can obtain the instance of `IConfigurationRefresher`.

    ```csharp
    private readonly IConfiguration _configuration;
    private readonly IConfigurationRefresher _configurationRefresher;

    public Function1(IConfiguration configuration, IConfigurationRefresherProvider refresherProvider)
    {
        _configuration = configuration;
        _configurationRefresher = refresherProvider.Refreshers.First();
    }
    ```

4. Update the `Run` method and signal to refresh the configuration using the `TryRefreshAsync` method at the beginning of the Functions call. It will be a no-op if the cache expiration time window isn't reached. Remove the `await` operator if you prefer the configuration to be refreshed without blocking the current Functions call. In that case, later Functions calls will get updated value.

    ```csharp
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req, ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");

        await _configurationRefresher.TryRefreshAsync(); 

        string keyName = "TestApp:Settings:Message";
        string message = _configuration[keyName];
            
        return message != null
            ? (ActionResult)new OkObjectResult(message)
            : new BadRequestObjectResult($"Please create a key-value with the key '{keyName}' in App Configuration.");
    }
    ```

## Test the function locally

1. Set an environment variable named **ConnectionString**, and set it to the access key to your app configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```console
    setx ConnectionString "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```powershell
    $Env:ConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```console
    export ConnectionString='connection-string-of-your-app-configuration-store'
    ```

2. To test your function, press F5. If prompted, accept the request from Visual Studio to download and install **Azure Functions Core (CLI)** tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

3. Copy the URL of your function from the Azure Functions runtime output.

    ![Quickstart Function debugging in VS](./media/quickstarts/function-visual-studio-debugging.png)

4. Paste the URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the local GET request returned by the function.

    ![Quickstart Function launch local](./media/quickstarts/dotnet-core-function-launch-local.png)

5. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store that you created in the quickstart.

6. Select **Configuration explorer**, and update the value of the following key:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration - Updated |

   Then create the sentinel key or modify its value if it already exists, for example,

    | Key | Value |
    |---|---|
    | TestApp:Settings:Sentinel | v1 |


7. Refresh the browser a few times. When the cached setting expires after 30 seconds, the page shows the response of the Functions call with updated value.

    ![Quickstart Function refresh local](./media/quickstarts/dotnet-core-function-refresh-local.png)

> [!NOTE]
> The example code used in this tutorial can be downloaded from [App Configuration GitHub repo](https://github.com/Azure/AppConfiguration/tree/master/examples/DotNetCore/AzureFunction).

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your Azure Functions app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
