---
title: Quickstart for Azure App Configuration with Azure Functions | Microsoft Docs
description: "In this quickstart, make an Azure Functions app with Azure App Configuration and C#. Create and connect to an App Configuration store. Test the function locally."
services: azure-app-configuration
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 03/20/2023
ms.author: zhenlwa
#Customer intent: As an Azure Functions developer, I want to manage all my app settings in one place using Azure App Configuration.
---
# Quickstart: Create an Azure Functions app with Azure App Configuration

In this quickstart, you incorporate the Azure App Configuration service into an Azure Functions app to centralize storage and management of all your application settings separate from your code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/vs) with the **Azure development** workload.
- [Azure Functions tools](../azure-functions/functions-develop-vs.md), if you don't have it installed with Visual Studio already.

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
| -------------------------- | ----------------------------------- |
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

## Create a Functions app

[!INCLUDE [Create a project using the Azure Functions template](../../includes/functions-vstools-create.md)]

## Connect to an App Configuration store
This project will use [dependency injection in .NET Azure Functions](../azure-functions/functions-dotnet-dependency-injection.md) and add Azure App Configuration as an extra configuration source. Azure Functions support running [in-process](../azure-functions/functions-dotnet-class-library.md) or [isolated-process](../azure-functions/dotnet-isolated-process-guide.md). Pick the one that matches your requirements.

1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search for and add following NuGet packages to your project.
    ### [In-process](#tab/in-process)

    - [Microsoft.Extensions.Configuration.AzureAppConfiguration](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.AzureAppConfiguration/) version 4.1.0 or later
    - [Microsoft.Azure.Functions.Extensions](https://www.nuget.org/packages/Microsoft.Azure.Functions.Extensions/) version 1.1.0 or later 

    ### [Isolated process](#tab/isolated-process)

    - [Microsoft.Azure.AppConfiguration.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.Functions.Worker)

    ---

2. Add code to connect to Azure App Configuration.
    ### [In-process](#tab/in-process)

    Add a new file, *Startup.cs*, with the following code. It defines a class named `Startup` that implements the `FunctionsStartup` abstract class. An assembly attribute is used to specify the type name used during Azure Functions startup.

    The `ConfigureAppConfiguration` method is overridden and Azure App Configuration provider is added as an extra configuration source by calling `AddAzureAppConfiguration()`. The `Configure` method is left empty as you don't need to register any services at this point.
    
    ```csharp
    using System;
    using Microsoft.Azure.Functions.Extensions.DependencyInjection;
    using Microsoft.Extensions.Configuration;

    [assembly: FunctionsStartup(typeof(FunctionApp.Startup))]

    namespace FunctionApp
    {
        class Startup : FunctionsStartup
        {
            public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
            {
                string cs = Environment.GetEnvironmentVariable("ConnectionString");
                builder.ConfigurationBuilder.AddAzureAppConfiguration(cs);
            }

            public override void Configure(IFunctionsHostBuilder builder)
            {
            }
        }
    }
    ```

    ### [Isolated process](#tab/isolated-process)

    Open *Program.cs* and update the `Main()` method as following. You add Azure App Configuration provider as an extra configuration source by calling `AddAzureAppConfiguration()`.

    ```csharp
    public static void Main()
    {
        var host = new HostBuilder()
            .ConfigureAppConfiguration(builder =>
            {
                string cs = Environment.GetEnvironmentVariable("ConnectionString");
                builder.AddAzureAppConfiguration(cs);
            })
            .ConfigureFunctionsWorkerDefaults()
            .Build();

        host.Run();
    }
    ```
    ---

3. Open *Function1.cs*, and add the following namespace if it's not present already.

    ```csharp
    using Microsoft.Extensions.Configuration;
    ```

   Add or update the constructor used to obtain an instance of `IConfiguration` through dependency injection.
    ### [In-process](#tab/in-process)

    ```csharp
    private readonly IConfiguration _configuration;

    public Function1(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    ```

    ### [Isolated process](#tab/isolated-process)
    ```csharp
    private readonly IConfiguration _configuration;

    public Function1(ILoggerFactory loggerFactory, IConfiguration configuration)
    {
        _logger = loggerFactory.CreateLogger<Function1>();
        _configuration = configuration;
    }
    ```
    ---

4. Update the `Run` method to read values from the configuration.
    ### [In-process](#tab/in-process)

    ```csharp
    [FunctionName("Function1")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req, ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");

        // Read configuration data
        string keyName = "TestApp:Settings:Message";
        string message = _configuration[keyName];

        return message != null
            ? (ActionResult)new OkObjectResult(message)
            : new BadRequestObjectResult($"Please create a key-value with the key '{keyName}' in App Configuration.");
    }
    ```

    > [!NOTE]
    > The `Function1` class and the `Run` method should not be static. Remove the `static` modifier if it was autogenerated.

    ### [Isolated process](#tab/isolated-process)

    ```csharp
    [Function("Function1")]
    public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

        // Read configuration data
        string keyName = "TestApp:Settings:Message";
        string message = _configuration[keyName];

        response.WriteString(message ?? $"Please create a key-value with the key '{keyName}' in Azure App Configuration.");

        return response;
    }
    ```
    ---

## Test the function locally

1. Set an environment variable named **ConnectionString**, and set it to the access key to your App Configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
        setx ConnectionString "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
        export ConnectionString='connection-string-of-your-app-configuration-store'
    ```

2. Press F5 to test your function. If prompted, accept the request from Visual Studio to download and install **Azure Functions Core (CLI)** tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

3. Copy the URL of your function from the Azure Functions runtime output.

    ![Quickstart Function debugging in VS](./media/quickstarts/function-visual-studio-debugging.png)

4. Paste the URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the local GET request returned by the function.

    ![Quickstart Function launch local](./media/quickstarts/dotnet-core-function-launch-local.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with an Azure Functions app via the [App Configuration provider](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration). To learn how to update your Azure Functions app to dynamically refresh configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in Azure Functions](./enable-dynamic-configuration-azure-functions-csharp.md)

To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Access App Configuration using managed identity](./howto-integrate-azure-managed-service-identity.md)