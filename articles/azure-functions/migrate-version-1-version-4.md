---
title: Migrate apps from Azure Functions version 1.x to 4.x 
description: This article shows you how to upgrade your existing function apps running on version 1.x of the Azure Functions runtime to be able to run on version 4.x of the runtime. 
ms.service: azure-functions
ms.topic: how-to 
ms.date: 10/19/2022
ms.custom: template-how-to-pattern 
---

# Migrate apps from Azure Functions version 1.x to version 4.x 

If you're running on version 1.x of the Azure Functions runtime, it's likely because your C# app requires .NET Framework 2.1. Version 4.x of the runtime now lets you run .NET Framework 4.8 apps. At this point, you should consider migrating your version 1.x function apps to run on version 4.x. For more information about Functions runtime versions, see [Azure Functions runtime versions overview](./functions-versions.md).

Migrating a C# function app from version 1.x to version 4.x of the Functions runtime requires you to make changes to your project code. Many of these changes are a result of changes in the C# language and .NET APIs. JavaScript apps generally don't require code changes to migrate. 

You can upgrade your C# project to one of the following versions of .NET, all of which can run on Functions version 4.x: 

| .NET version | Process model<sup>*</sup> | 
| --- | --- | --- |
| .NET 7 | [Isolated worker process](./dotnet-isolated-process-guide.md) | 
| .NET 6 | [Isolated worker process](./dotnet-isolated-process-guide.md) | 
| .NET 6 | [In-process](./functions-dotnet-class-library.md) |  
| .NET&nbsp;Framework&nbsp;4.8 | [Isolated worker process](./dotnet-isolated-process-guide.md) |  

<sup>*</sup> [In-process execution](./functions-dotnet-class-library.md) is only supported for Long Term Support (LTS) releases of .NET. Non-LTS releases and .NET Framework require you to run in an [isolated worker process](./dotnet-isolated-process-guide.md).

This article walks you through the process of safely migrating your function app to run on version 4.x of the Functions runtime.

## Prepare for migration

Before you upgrade your app to version 4.x of the Functions runtime, you should do the following tasks:

* Review the list of [behavior changes after version 1.x](#behavior-changes-after-version-1x). Migrating from version 1.x to version 4.x also can affect bindings.
* Review [Update your C# project files](#update-your-c-project-files) and decide which version of .NET you want to migrate to. Complete the steps to migrate your local project to your chosen version of .NET. 
* After migrating your local project, fully test the app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
* Upgrade your function app in Azure to the new version. If you need to minimize downtime, consider using a [staging slot](functions-deployment-slots.md) to test and verify your migrated app in Azure on the new runtime version. You can then deploy your app with the updated version settings to the production slot. For more information, see [Migrate using slots](#upgrade-using-slots).  
* Republished your migrated project to the upgraded function app. When you use Visual Studio to publish a version 4.x project to an existing function app at a lower version, you're prompted to let Visual Studio upgrade the function app to version 4.x during deployment. This upgrade uses the same process defined in [Migrate without slots](#upgrade-without-slots).
* Consider using a [staging slot](functions-deployment-slots.md) to test and verify your app in Azure on the new runtime version. You can then deploy your app with the updated version settings to the production slot. For more information, see [Migrate using slots](#upgrade-using-slots).  

## Update your C# project files

The following sections describes the updates you must make to your C# project files to be able to run on one of the supported versions of .NET in Functions version 4.x. The updates shown are ones common to most projects. Your project code may require updates not mentioned in this article, especially when using custom NuGet packages.

Choose the tab that matches your target version of .NET and the desired process model (in-process or isolated worker process).

### .csproj file

The following example is a .csproj project file that runs on version 1.x:

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

# [.NET Framework 4.8](#tab/v4)

The following changes are required in the .csproj XML project file: 

1. Change the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Add the following `OutputType` element to the `PropertyGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="5-5":::

1. Replace the existing `ItemGroup`.`PackageReference` with the following `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

1. Add the following new `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="31-33":::

After you make these changes, your updated project should look like the following example:

```xml

<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
    <OutputType>Exe</OutputType>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.8.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.7.0" />
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
  <ItemGroup>
    <Folder Include="Properties\" />
  </ItemGroup>
</Project>
```

# [.NET 6 (isolated)](#tab/net6-isolated)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated](../../includes/functions-dotnet-migrate-project-v4-isolated.md)]

# [.NET 6 (in-process)](#tab/net6-in-proc)

[!INCLUDE [functions-dotnet-migrate-project-v4-inproc](../../includes/functions-dotnet-migrate-project-v4-inproc.md)]

# [.NET 7](#tab/net7)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-2](../../includes/functions-dotnet-migrate-project-v4-isolated-2.md)]

---

### program.cs file

In most cases, migrating requires you to add the following program.cs file to your project:

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="2-20":::

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

# [.NET 6 (in-process)](#tab/net6-in-proc)

A program.cs file isn't required when running in-process.

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

---

### host.json file

Settings in the host.json file apply at the function app level, both locally and in Azure. In version 1.x, your host.json file is either empty or it contains some settings that apply to all functions in the function app. For more information, see [Host.json v1](./functions-host-json-v1.md). If your host.json file has setting values, review the [host.json v2 format](./functions-host-json.md) for any changes.

To run on version 4.x, you must add `"version": "2.0"` to the host.json file. You should also consider adding `logging` to your configuration, as in the following examples: 

# [.NET Framework 4.8](#tab/v4)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/host.json":::

# [.NET 7](#tab/net7)

:::code language="json" source="~/functions-quickstart-templates//Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). In version 1.x, the local.settings.json file has only two required values:

:::code language="json" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/local.settings.json":::

When you upgrade to version 4.x, make sure that your local.settings.json file has at least the following elements:

# [.NET Framework 4.8](#tab/v4)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::
# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/local.settings.json":::

# [.NET 7](#tab/net7)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

---

### Namespace changes

C# functions that run in an isolated worker process uses libraries in a different namespace than those libraries used in version 1.x. In-process functions use libraries in the same namespace. 

Version 1.x and in-process libraries are generally in the namespace `Microsoft.Azure.WebJobs.*`. Isolated worker process function apps use libraries in the namespace `Microsoft.Azure.Functions.Worker.*`. You can see the effect of these namespace changes on `using` statements in the [HTTP trigger template examples](#http-trigger-template) that follow.

### Class name changes

Some key classes changed names between version 1.x and version 4.x. These changes are a result either of changes in .NET APIs or in differences between in-process and isolated worker process. The following table indicates these key .NET classes used by Azure Functions that changed after version 1.x:

# [.NET Framework 4.8](#tab/v4)

| Version 1.x | .NET Framework 4.8 | 
| --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) |  
| `TraceWriter` | `ILogger` |
| `HttpRequestMessage` | `HttpRequestData` |
| `HttpResonseMessage` | `HttpResonseData` |

# [.NET 6 (isolated)](#tab/net6-isolated)

| Version 1.x |  .NET 6 (isolated) | 
| --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | 
| `TraceWriter` | `ILogger` |
| `HttpRequestMessage` | `HttpRequestData` |
| `HttpResonseMessage` | `HttpResonseData` |

# [.NET 6 (in-process)](#tab/net6-in-proc)

| Version 1.x | .NET 6 (in-process) | 
| --- | --- | 
| `FunctionName` (attribute) | `FunctionName` (attribute) | 
| `TraceWriter` | `ILogger` |
| `HttpRequestMessage` | `HttpRequest` |
| `HttpResonseMessage` | `OkObjectResult` |

# [.NET 7](#tab/net7)

| Version 1.x |  .NET 7 | 
| --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | 
| `TraceWriter` | `ILogger` |
| `HttpRequestMessage` | `HttpRequestData` |
| `HttpResonseMessage` | `HttpResonseData` |

---

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

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

---

[!INCLUDE [functions-migrate-v4](../../includes/functions-migrate-v4.md)]

## Behavior changes after version 1.x

This section details changes made after version 1.x in both trigger and binding behaviors as well as in core Functions features and behaviors.

### Changes in triggers and bindings

Starting with version 2.x, you must install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](./functions-bindings-register.md).

There are also a few changes in the *function.json* or attributes of the function between versions. For example, the Event Hubs `path` property is now `eventHubName`. See the [existing binding table](functions-versions.md#bindings) for links to documentation for each binding.

### Changes in features and functionality

A few features were removed, updated, or replaced after version 1.x. This section details the changes you see in later versions after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure Files by default. When you upgrade an app from version 1.x to version 2.x, existing secrets that are in Azure Files are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* The host configuration file (host.json) should be empty or have the string `"version": "2.0"`.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-develop-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for Consumption plan functions, with a default of 100 concurrent requests per instance. You can change this behavior in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET Core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (`.fsx` files) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to follow this pattern: `https://{app}/runtime/webhooks/{triggerName}`.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Functions versions](functions-versions.md)


