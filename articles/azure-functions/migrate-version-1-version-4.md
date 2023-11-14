---
title: Migrate apps from Azure Functions version 1.x to 4.x
description: This article shows you how to upgrade your existing function apps running on version 1.x of the Azure Functions runtime to be able to run on version 4.x of the runtime.
ms.service: azure-functions
ms.topic: how-to
ms.date: 07/31/2023
ms.custom:
  - template-how-to-pattern
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - devx-track-dotnet
  - devx-track-azurecli
  - ignite-2023
zone_pivot_groups: programming-languages-set-functions
---

# <a name="top"></a>Migrate apps from Azure Functions version 1.x to version 4.x 

::: zone pivot="programming-language-java"

> [!IMPORTANT]
> Java isn't supported by version 1.x of the Azure Functions runtime. Perhaps you're instead looking to [migrate your Java app from version 3.x to version 4.x](./migrate-version-3-version-4.md). If you're migrating a version 1.x function app, select either C# or JavaScript above.  

::: zone-end

::: zone pivot="programming-language-typescript"

> [!IMPORTANT]
> TypeScript isn't supported by version 1.x of the Azure Functions runtime. Perhaps you're instead looking to [migrate your TypeScript app from version 3.x to version 4.x](./migrate-version-3-version-4.md). If you're migrating a version 1.x function app, select either C# or JavaScript above.  

::: zone-end

::: zone pivot="programming-language-powershell"

> [!IMPORTANT]
> PowerShell isn't supported by version 1.x of the Azure Functions runtime. Perhaps you're instead looking to [migrate your PowerShell app from version 3.x to version 4.x](./migrate-version-3-version-4.md). If you're migrating a version 1.x function app, select either C# or JavaScript above.  

::: zone-end

::: zone pivot="programming-language-python"

> [!IMPORTANT]
> Python isn't supported by version 1.x of the Azure Functions runtime. Perhaps you're instead looking to [migrate your Python app from version 3.x to version 4.x](./migrate-version-3-version-4.md). If you're migrating a version 1.x function app, select either C# or JavaScript above.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-csharp"

> [!IMPORTANT]
> [Support will end for version 1.x of the Azure Functions runtime on September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1). We highly recommend that you migrate your apps to version 4.x by following the instructions in this article.

This article walks you through the process of safely migrating your function app to run on version 4.x of the Functions runtime. Because project upgrade instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

If you are running version 1.x of the runtime in Azure Stack Hub, see [Considerations for Azure Stack Hub](#considerations-for-azure-stack-hub) first.

## Identify function apps to upgrade

Use the following PowerShell script to generate a list of function apps in your subscription that currently target version 1.x:

```powershell
$Subscription = '<YOUR SUBSCRIPTION ID>' 
 
Set-AzContext -Subscription $Subscription | Out-Null

$FunctionApps = Get-AzFunctionApp

$AppInfo = @{}

foreach ($App in $FunctionApps)
{
     if ($App.ApplicationSettings["FUNCTIONS_EXTENSION_VERSION"] -like '*1*')
     {
          $AppInfo.Add($App.Name, $App.ApplicationSettings["FUNCTIONS_EXTENSION_VERSION"])
     }
}

$AppInfo
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Choose your target .NET version

On version 1.x of the Functions runtime, your C# function app targets .NET Framework.

[!INCLUDE [functions-dotnet-migrate-v4-versions](../../includes/functions-dotnet-migrate-v4-versions.md)]

> [!TIP]
> **Unless your app depends on a library or API only available to .NET Framework, we recommend upgrading to .NET 8 on the isolated worker model.** Many apps on version 1.x target .NET Framework only because that is what was available when they were created. Additional capabilities are available to more recent versions of .NET, and if your app is not forced to stay on .NET Framework due to a dependency, you should upgrade. .NET 8 is the fully released version with the longest support window from .NET. 
>
> Migrating to the isolated worker model will require additional code changes as part of this migration, but it will give your app [additional benefits](./dotnet-isolated-in-process-differences.md), including the ability to more easily target future versions of .NET. If you are moving to an LTS or STS version of .NET using the isolated worker model, the [.NET Upgrade Assistant] can also handle many of the necessary code changes for you.

This guide doesn't present specific examples for .NET 7 or .NET 6 on the isolated worker model. If you need to target these versions, you can adapt the .NET 8 isolated worker model examples.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-csharp"

## Prepare for migration

If you haven't already, identify the list of apps that need to be migrated in your current Azure Subscription by using the [Azure PowerShell](#identify-function-apps-to-upgrade).

Before you upgrade an app to version 4.x of the Functions runtime, you should do the following tasks:

1. Review the list of [behavior changes after version 1.x](#behavior-changes-after-version-1x). Migrating from version 1.x to version 4.x also can affect bindings.
1. Complete the steps in [Upgrade your local project](#upgrade-your-local-project) to migrate your local project to version 4.x.
1. After migrating your project, fully test the app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
1. Upgrade your function app in Azure to the new version. If you need to minimize downtime, consider using a [staging slot](functions-deployment-slots.md) to test and verify your migrated app in Azure on the new runtime version. You can then deploy your app with the updated version settings to the production slot. For more information, see [Migrate using slots](#upgrade-using-slots).
1. Publish your migrated project to the upgraded function app.

::: zone-end

::: zone pivot="programming-language-csharp"

  When you use Visual Studio to publish a version 4.x project to an existing function app at a lower version, you're prompted to let Visual Studio upgrade the function app to version 4.x during deployment. This upgrade uses the same process defined in [Migrate without slots](#upgrade-without-slots).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-csharp"

## Upgrade your local project

::: zone-end

::: zone pivot="programming-language-csharp"

The following sections describes the updates you must make to your C# project files to be able to run on one of the supported versions of .NET in Functions version 4.x. The updates shown are ones common to most projects. Your project code could require updates not mentioned in this article, especially when using custom NuGet packages.

Migrating a C# function app from version 1.x to version 4.x of the Functions runtime requires you to make changes to your project code. Many of these changes are a result of changes in the C# language and .NET APIs.

Choose the tab that matches your target version of .NET and the desired process model (in-process or isolated worker process).

> [!TIP]
> If you are moving to an LTS or STS version of .NET using the isolated worker model, the [.NET Upgrade Assistant] can be used to automatically make many of the changes mentioned in the following sections.

### .csproj file

The following example is a `.csproj` project file that runs on version 1.x:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <AzureFunctionsVersion>v1</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="1.0.24" />
  </ItemGroup>
  <ItemGroup>
    <Reference Include="Microsoft.CSharp" />
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

Use one of the following procedures to update this XML file to run in Functions version 4.x:

# [.NET 8 (isolated)](#tab/net8)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net8](../../includes/functions-dotnet-migrate-project-v4-isolated-net8.md)]

# [.NET 6 (in-process)](#tab/net6-in-proc)

[!INCLUDE [functions-dotnet-migrate-project-v4-inproc](../../includes/functions-dotnet-migrate-project-v4-inproc.md)]

# [.NET Framework 4.8](#tab/netframework48)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net-framework](../../includes/functions-dotnet-migrate-project-v4-isolated-net-framework.md)]


---

### Package and namespace changes

Based on the model you are migrating to, you might need to upgrade or change the packages your application references. When you adopt the target packages, you then need to update the namespace of using statements and some types you reference. You can see the effect of these namespace changes on `using` statements in the [HTTP trigger template examples](#http-trigger-template) later in this article.

# [.NET 8 (isolated)](#tab/net8)

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

# [.NET 6 (in-process)](#tab/net6-in-proc)

[!INCLUDE [functions-dotnet-migrate-packages-v4-in-process](../../includes/functions-dotnet-migrate-packages-v4-in-process.md)]

# [.NET Framework 4.8](#tab/netframework48)

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

---

The [Notification Hubs](./functions-bindings-notification-hubs.md) and [Mobile Apps](./functions-bindings-mobile-apps.md) bindings are supported only in version 1.x of the runtime. When upgrading to version 4.x of the runtime, you need to remove these bindings in favor of working with these services directly using their SDKs.

### Program.cs file

In most cases, migrating requires you to add the following program.cs file to your project:

# [.NET 8 (isolated)](#tab/net8)

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

# [.NET 6 (in-process)](#tab/net6-in-proc)

A program.cs file isn't required when running in-process.

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

### host.json file

Settings in the host.json file apply at the function app level, both locally and in Azure. In version 1.x, your host.json file is either empty or it contains some settings that apply to all functions in the function app. For more information, see [Host.json v1](./functions-host-json-v1.md). If your host.json file has setting values, review the [host.json v2 format](./functions-host-json.md) for any changes.

To run on version 4.x, you must add `"version": "2.0"` to the host.json file. You should also consider adding `logging` to your configuration, as in the following examples: 

# [.NET 8 (isolated)](#tab/net8)

:::code language="json" source="~/functions-quickstart-templates//Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/host.json":::

# [.NET Framework 4.8](#tab/netframework48)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::


---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). In version 1.x, the local.settings.json file has only two required values:

:::code language="json" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/local.settings.json":::

When you upgrade to version 4.x, make sure that your local.settings.json file has at least the following elements:

# [.NET 8 (isolated)](#tab/net8)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

> [!NOTE]
> When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated".

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/local.settings.json":::

# [.NET Framework 4.8](#tab/netframework48)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

> [!NOTE]
> When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated".

---

### Class name changes

Some key classes changed names between version 1.x and version 4.x. These changes are a result either of changes in .NET APIs or in differences between in-process and isolated worker process. The following table indicates key .NET classes used by Functions that could change when migrating:

# [.NET 8 (isolated)](#tab/net8)

| Version 1.x |  .NET 7 | 
| --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | 
| `TraceWriter` | `ILogger<T>`, `ILogger`  |
| `HttpRequestMessage` | `HttpRequestData`, `HttpRequest` (using [ASP.NET Core integration])|
| `HttpResponseMessage` | `HttpResponseData`, `IActionResult` (using [ASP.NET Core integration])|

# [.NET 6 (in-process)](#tab/net6-in-proc)

| Version 1.x | .NET 6 (in-process) | 
| --- | --- | 
| `FunctionName` (attribute) | `FunctionName` (attribute) | 
| `TraceWriter` | `ILogger<T>`, `ILogger`  |
| `HttpRequestMessage` | `HttpRequest` |
| `HttpResponseMessage` | `IActionResult` |

# [.NET Framework 4.8](#tab/netframework48)

| Version 1.x | .NET Framework 4.8 | 
| --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) |  
| `TraceWriter` | `ILogger<T>`, `ILogger` |
| `HttpRequestMessage` | `HttpRequestData` |
| `HttpResponseMessage` | `HttpResponseData` |


---

[ASP.NET Core integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration

There might also be class name differences in bindings. For more information, see the reference articles for the specific bindings.

### HTTP trigger template

Most of the code changes between version 1.x and version 4.x can be seen in HTTP triggered functions. The HTTP trigger template for version 1.x looks like the following example:

```csharp
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace Company.Function
{
    public static class HttpTriggerCSharp
    {
        [FunctionName("HttpTriggerCSharp")]
        public static async Task<HttpResponseMessage> 
            Run([HttpTrigger(AuthorizationLevel.AuthLevelValue, "get", "post", 
            Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;
            
            if (name == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                name = data?.name;
            }
            
            return name == null
                ? req.CreateResponse(HttpStatusCode.BadRequest, 
                    "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }
    }
}
```

In version 4.x, the HTTP trigger template looks like the following example:

# [.NET 8 (isolated)](#tab/net8)

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

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs":::

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

::: zone-end

::: zone pivot="programming-language-javascript" 

To update your project to Azure Functions 4.x:

1. Update your local installation of [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) to version 4.x. 

1. Move to one of the [Node.js versions supported on version 4.x](functions-reference-node.md#node-version).

1. Add both `version` and `extensionBundle` elements to the host.json, so that it looks like the following example:

    [!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]
 
    The `extensionBundle` element is required because after version 1.x, bindings are maintained as external packages. For more information, see [Extension bundles](functions-bindings-register.md#extension-bundles).

1. Update your local.settings.json file so that it has at least the following elements:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "node"
        }
    }
    ```   

    The `AzureWebJobsStorage` setting can be either the Azurite storage emulator or an actual Azure storage account. For more information, see [Local storage emulator](functions-develop-local.md#local-storage-emulator).
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-csharp"

[!INCLUDE [functions-migrate-v4](../../includes/functions-migrate-v4.md)]

::: zone-end

## Behavior changes after version 1.x

This section details changes made after version 1.x in both trigger and binding behaviors as well as in core Functions features and behaviors.

### Changes in triggers and bindings

Starting with version 2.x, you must install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](functions-bindings-register.md).

There are also a few changes in the *function.json* or attributes of the function between versions. For example, the Event Hubs `path` property is now `eventHubName`. See the [existing binding table](functions-versions.md#bindings) for links to documentation for each binding.

### Changes in features and functionality

A few features were removed, updated, or replaced after version 1.x. This section details the changes you see in later versions after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure Files by default. When you upgrade an app from version 1.x to version 2.x, existing secrets that are in Azure Files are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-develop-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for Consumption plan functions, with a default of 100 concurrent requests per instance. You can change this behavior in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET Core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (`.fsx` files) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to follow this pattern: `https://{app}/runtime/webhooks/{triggerName}`.

* The names of some [pre-defined custom metrics](analyze-telemetry-data.md) were changed after version 1.x. `Duration` was replaced with `MaxDurationMs`, `MinDurationMs`, and `AvgDurationMs`. `Success Rate` was also renamed to `Success Rate`.

## Considerations for Azure Stack Hub

[App Service on Azure Stack Hub](/azure-stack/operator/azure-stack-app-service-overview) does not support version 4.x of Azure Functions. When you are planning a migration off of version 1.x in Azure Stack Hub, you can choose one of the following options:

- Migrate to version 4.x hosted in public cloud Azure Functions using the instructions in this article. Instead of upgrading your existing app, you would create a new app using version 4.x and then deploy your modified project to it.
- Switch to [WebJobs](../app-service/webjobs-create.md) hosted on an App Service plan in Azure Stack Hub.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Functions versions](functions-versions.md)

[.NET Upgrade Assistant]: /dotnet/core/porting/upgrade-assistant-overview
