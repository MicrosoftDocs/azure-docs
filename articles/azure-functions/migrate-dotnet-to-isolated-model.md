---
title: Migrate .NET function apps from the in-process model to the isolated worker model
description: This article shows you how to migrate your existing .NET function apps running on the in-process model to the isolated worker model.
ms.service: azure-functions
ms.custom:
  - devx-track-dotnet
  - ignite-2023
ms.topic: how-to
ms.date: 01/17/2024
---

# Migrate .NET apps from the in-process model to the isolated worker model

> [!IMPORTANT]
> [Support will end for the in-process model on November 10, 2026](https://aka.ms/azure-functions-retirements/in-process-model). We highly recommend that you migrate your apps to the isolated worker model by following the instructions in this article.

This article walks you through the process of safely migrating your .NET function app from the [in-process model](./functions-dotnet-class-library.md) to the [isolated worker model][isolated-guide]. To learn about the high-level differences between these models, see the [execution mode comparison](./dotnet-isolated-in-process-differences.md).

This guide assumes that your app is running on version 4.x of the Functions runtime. If not, you should instead follow the guides for upgrading your host version:

- [Migrate apps from Azure Functions version 2.x and 3.x to version 4.x](./migrate-version-3-version-4.md)
- [Migrate apps from Azure Functions version 1.x to version 4.x](./migrate-version-1-version-4.md)

These host version migration guides also help you migrate to the isolated worker model as you work through them.

## Identify function apps to migrate

Use the following Azure PowerShell script to generate a list of function apps in your subscription that currently use the in-process model.

The script uses subscription that Azure PowerShell is currently configured to use. You can change the subscription by first running `Set-AzContext -Subscription '<YOUR SUBSCRIPTION ID>'` and replacing `<YOUR SUBSCRIPTION ID>` with the ID of the subscription you would like to evaluate.

```azurepowershell-interactive
$FunctionApps = Get-AzFunctionApp

$AppInfo = @{}

foreach ($App in $FunctionApps)
{
     if ($App.Runtime -eq 'dotnet')
     {
          $AppInfo.Add($App.Name, $App.Runtime)
     }
}

$AppInfo
```

## Choose your target .NET version

On version 4.x of the Functions runtime, your .NET function app targets .NET 6 or .NET 8 when using the in-process model.

[!INCLUDE [functions-dotnet-migrate-v4-versions](../../includes/functions-dotnet-migrate-v4-versions.md)]

> [!TIP]
> **We recommend upgrading to .NET 8 on the isolated worker model.** This provides a quick migration path to the fully released version with the longest support window from .NET.

This guide doesn't present specific examples for .NET 9. If you need to target that version, you can adapt the .NET 8 examples.

## Prepare for migration

If you haven't already, identify the list of apps that need to be migrated in your current Azure Subscription by using the [Azure PowerShell](#identify-function-apps-to-migrate).

Before you migrate an app to the isolated worker model, you should thoroughly review the contents of this guide. You should also familiarize yourself with the features of the [isolated worker model][isolated-guide] and the [differences between the two models](./dotnet-isolated-in-process-differences.md).

To migrate the application, you will:

1. Migrate your local project to the isolated worker model by following the steps in [Migrate your local project](#migrate-your-local-project).
1. After migrating your project, fully test the app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
1. [Update your function app in Azure](#update-your-function-app-in-azure) to the isolated model.

## Migrate your local project

The section outlines the various changes that you need to make to your local project to move it to the isolated worker model. Some of the steps change based on your target version of .NET. Use the tabs to select the instructions that match your desired version. These steps assume a local C# project, and if your app is instead using C# script (`.csx` files), you should [convert to the project model](./functions-reference-csharp.md#convert-a-c-script-app-to-a-c-project) before continuing.

> [!TIP]
> If you are moving to an LTS or STS version of .NET, the [.NET Upgrade Assistant] can be used to automatically make many of the changes mentioned in the following sections.

First, convert the project file and update your dependencies. As you do, you will see build errors for the project. In subsequent steps, you'll make the corresponding changes to remove these errors.

### Project file

The following example is a `.csproj` project file that uses .NET 8 on version 4.x:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

Use one of the following procedures to update this XML file to run in the isolated worker model:

# [.NET 8](#tab/net8)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net8](../../includes/functions-dotnet-migrate-project-v4-isolated-net8.md)]

# [.NET Framework 4.8](#tab/netframework48)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net-framework](../../includes/functions-dotnet-migrate-project-v4-isolated-net-framework.md)]

---

Changing your project's target framework might also require changes to parts of your toolchain, outside of project code. For example, in VS Code, you might need to update the `azureFunctions.deploySubpath` extension setting through user settings or your project's `.vscode/settings.json` file. Check for any dependencies on the framework version that may exist outside of your project code, as part of build steps or a CI/CD pipeline.

### Package references

 When migrating to the isolated worker model, you need to change the packages your application references.

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

### Program.cs file

When migrating to run in an isolated worker process, you must add a `Program.cs` file to your project with the following contents:

# [.NET 8](#tab/net8)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
    })
    .Build();

host.Run();
```

This example includes [ASP.NET Core integration] to improve performance and provide a familiar programming model when your app uses HTTP triggers. If you do not intend to use HTTP triggers, you can replace the call to `ConfigureFunctionsWebApplication` with a call to `ConfigureFunctionsWorkerDefaults`. If you do so, you can remove the reference to `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` from your project file. However, for the best performance, even for functions with other trigger types, you should keep the `FrameworkReference` to ASP.NET Core.

# [.NET Framework 4.8](#tab/netframework48)

```csharp
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.Functions.Worker;

namespace Company.FunctionApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            FunctionsDebugger.Enable();

            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(services => {
                    services.AddApplicationInsightsTelemetryWorkerService();
                    services.ConfigureFunctionsApplicationInsights();
                })
                .Build();
            host.Run();
        }
    }
}
```

---

[!INCLUDE [functions-dotnet-migrate-isolated-program-cs](../../includes/functions-dotnet-migrate-isolated-program-cs.md)]

### Function signature changes

Some key types change between the in-process model and the isolated worker model. Many of these relate to the attributes, parameters, and return types that make up the function signature. For each of your functions, you must make changes to:

- The function attribute (which also sets the function's name)
- How the function obtains an `ILogger`/`ILogger<T>`
- Trigger and binding attributes and parameters

The rest of this section walks you through each of these steps.

#### Function attributes

The `Function` attribute in the isolated worker model replaces the `FunctionName` attribute. The new attribute has the same signature, and the only difference is in the name. You can therefore just perform a string replacement across your project.

#### Logging

In the in-process model, you could include an optional `ILogger` parameter to your function, or you could use dependency injection to get an `ILogger<T>`. If your app already used dependency injection, the same mechanisms work in the isolated worker model.

However, for any Functions that relied on the `ILogger` method parameter, you need to make a change. It is recommended that you use dependency injection to obtain an `ILogger<T>`.  Use the following steps to migrate the function's logging mechanism:

1. In your function class, add a `private readonly ILogger<MyFunction> _logger;` property, replacing `MyFunction` with the name of your function class.
1. Create a constructor for your function class that takes in the `ILogger<T>` as a parameter:

    ```csharp
    public MyFunction(ILogger<MyFunction> logger) {
        _logger = logger;
    }
    ```

    Replace both instances of `MyFunction` in the preceding code snippet with the name of your function class.

1. For logging operations in your function code, replace references to the `ILogger` parameter with `_logger`.
1. Remove the `ILogger` parameter from your function signature.

To learn more, see [Logging in the isolated worker model](./dotnet-isolated-process-guide.md#logging).

#### Trigger and binding changes

When you [changed your package references in a previous step](#package-references), you introduced errors for your triggers and bindings that you will now fix:

1. Remove any `using Microsoft.Azure.WebJobs;` statements.
1. Add a `using Microsoft.Azure.Functions.Worker;` statement.
1. For each binding attribute, change the attribute's name as specified in its reference documentation, which you can find in the [Supported bindings](./functions-triggers-bindings.md#supported-bindings) index. In general, the attribute names change as follows:

    - **Triggers typically remain named the same way.** For example, `QueueTrigger` is the attribute name for both models.
    - **Input bindings typically need "Input" added to their name.** For example, if you used the `CosmosDB` input binding attribute in the in-process model, the attribute would now be `CosmosDBInput`.
    - **Output bindings typically need "Output" added to their name.** For example, if you used the `Queue` output binding attribute in the in-process model, this attribute would now be `QueueOutput`.
 
1. Update the attribute parameters to reflect the isolated worker model version, as specified in the binding's reference documentation. 

    For example, in the in-process model, a blob output binding is represented by a `[Blob(...)]` attribute that includes an `Access` property. In the isolated worker model, the blob output attribute would be `[BlobOutput(...)]`. The binding no longer requires the `Access` property, so that parameter can be removed. So `[Blob("sample-images-sm/{fileName}", FileAccess.Write, Connection = "MyStorageConnection")]` would become `[BlobOutput("sample-images-sm/{fileName}", Connection = "MyStorageConnection")]`.

1. Move output bindings out of the function parameter list. If you have just one output binding, you can apply this to the return type of the function. If you have multiple outputs, create a new class with properties for each output, and apply the attributes to those properties. To learn more, see [Multiple output bindings](./dotnet-isolated-process-guide.md#multiple-output-bindings).

1. Consult each binding's reference documentation for the types it allows you to bind to. In some cases, you might need to change the type. For output bindings, if the in-process model version used an `IAsyncCollector<T>`, you can replace this with binding to an array of the target type: `T[]`. You can also consider replacing the output binding with a client object for the service it represents, either as the binding type for an input binding if available, or by [injecting a client yourself](./dotnet-isolated-process-guide.md#register-azure-clients).

1. If your function includes an `IBinder` parameter, remove it. Replace the functionality with a client object for the service it represents, either as the binding type for an input binding if available, or by [injecting a client yourself](./dotnet-isolated-process-guide.md#register-azure-clients).

1. Update the function code to work with any new types.

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). 

When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated". Make sure that your local.settings.json file has at least the following elements:

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
    }
}
```

The value you have for `AzureWebJobsStorage`` might be different. You do not need to change its value as part of the migration.

### host.json file

No changes are required to your `host.json` file. However, if your Application Insights configuration in this file from your in-process model project, you might want to make additional changes in your `Program.cs` file. The `host.json` file only controls logging from the Functions host runtime, and in the isolated worker model, some of these logs come from your application directly, giving you more control. See [Managing log levels in the isolated worker model](./dotnet-isolated-process-guide.md#managing-log-levels) for details on how to filter these logs.

### Other code changes

This section highlights other code changes to consider as you work through the migration. These changes are not needed by all applications, but you should evaluate if any are relevant to your scenarios.

[!INCLUDE [functions-dotnet-migrate-isolated-other-code-changes](../../includes/functions-dotnet-migrate-isolated-other-code-changes.md)]

### Example function migrations

#### HTTP trigger example

An HTTP trigger for the in-process model might look like the following example:

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class HttpTriggerCSharp
    {
        [FunctionName("HttpTriggerCSharp")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
        }
    }
}
```

An HTTP trigger for the migrated version might look like the following example:

# [.NET 8](#tab/net8)

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public class HttpTriggerCSharp
    {
        private readonly ILogger<HttpTriggerCSharp> _logger;

        public HttpTriggerCSharp(ILogger<HttpTriggerCSharp> logger)
        {
            _logger = logger;
        }

        [Function("HttpTriggerCSharp")]
        public IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
        }
    }
}
```

# [.NET Framework 4.8](#tab/netframework48)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Company.Function
{
    public class HttpTriggerCSharp
    {
        private readonly ILogger<HttpTriggerCSharp> _logger;

        public HttpTriggerCSharp(ILogger<HttpTriggerCSharp> logger)
        {
            _logger = logger;
        }

        [Function("HttpTriggerCSharp")]
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString($"Welcome to Azure Functions, {req.Query["name"]}!");

            return response;
        }
    }
}
```

---

## Update your function app in Azure

Updating your function app to the isolated model involves two changes that should be completed together, because if you only complete one, the app is in an error state. Both of these changes also cause the app process to restart. For these reasons, you should perform the update using a [staging slot](./functions-deployment-slots.md). Staging slots help minimize downtime for your app and allow you to test and verify your migrated code with your updated configuration in Azure. You can then deploy your fully migrated app to the production slot through a swap operation.

> [!IMPORTANT]
> [When an app's deployed payload doesn't match the configured runtime, it will be in an error state](./errors-diagnostics/diagnostic-events/azfd0013.md). During the migration process, you will put the app into this state, ideally only temporarily. Deployment slots help mitigate the impact of this, because the error state will be resolved in your staging (non-production) environment before the changes are applied as single update to your production environment. Slots also defend against any mistakes and allow you to detect any other issues before reaching production.
> 
> During the process, you might still see errors in logs coming from your staging (non-production) slot. This is expected, though these should go away as you proceed through the steps. Before you perform the slot swap operation, you should confirm that these errors stop being raised and that your application is working as expected.

Use the following steps to use deployment slots to update your function app to the isolated worker model:

1. [Create a deployment slot](./functions-deployment-slots.md#add-a-slot) if you haven't already. You might also want to familiarize yourself with the slot swap process and ensure that you can make updates to the existing application with minimal disruption.
1. Change the configuration of the staging (non-production) slot to use the isolated worker model by setting the `FUNCTIONS_WORKER_RUNTIME` application setting to `dotnet-isolated`. `FUNCTIONS_WORKER_RUNTIME` should **not** be marked as a "slot setting".

    If you are also targeting a different version of .NET as part of your update, you should also change the stack configuration. To do so, see the [instructions to update the stack configuration for the isolated worker model](./update-language-versions.md?pivots=programming-language-csharp#update-the-stack-configuration). You will use the same instructions for any future .NET version updates you make.

    If you have any automated infrastructure provisioning such as a CI/CD pipeline, make sure that the automations are also updated to keep `FUNCTIONS_WORKER_RUNTIME` set to `dotnet-isolated` and to target the correct .NET version.

1. Publish your migrated project to the staging (non-production) slot of your function app.
    
    If you use Visual Studio to publish an isolated worker model project to an existing app or slot that uses the in-process model, it can also complete the previous step for you at the same time. If you did not complete the previous step, Visual Studio prompts you to update the function app during deployment. Visual Studio presents this as a single operation, but these are still two separate operations. You might still see errors in your logs from the staging (non-production) slot during the interim state.

1. Confirm that your application is working as expected within the staging (non-production) slot.
1. Perform a [slot swap operation](./functions-deployment-slots.md#swap-slots). This applies the changes you made in your staging (non-production) slot to the production slot. A slot swap happens as a single update, which avoids introducing the interim error state in your production environment.
1. Confirm that your application is working as expected within the production slot.

Once you complete these steps, the migration is complete, and your app runs on the isolated model. Congratulations! Repeat the steps from this guide as necessary for [any other apps needing migration](#identify-function-apps-to-migrate).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the isolated worker model][isolated-guide]

[isolated-guide]: ./dotnet-isolated-process-guide.md
[.NET Upgrade Assistant]: /dotnet/core/porting/upgrade-assistant-overview
[ASP.NET Core integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration

[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true 
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
