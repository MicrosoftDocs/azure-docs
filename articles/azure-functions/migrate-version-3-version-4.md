---
title: Migrate apps from Azure Functions version 3.x to 4.x
description: This article shows you how to migrate your existing function apps running on version 3.x of the Azure Functions runtime to be able to run on version 4.x of the runtime.
ms.service: azure-functions
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-azurecli, ignite-2023, linux-related-content, devx-track-ts
ms.topic: how-to
ms.date: 07/31/2023
zone_pivot_groups: programming-languages-set-functions
---

# Migrate apps from Azure Functions version 3.x to version 4.x 

Azure Functions version 4.x is highly backwards compatible to version 3.x. Most apps should safely migrate to 4.x without requiring significant code changes. For more information about Functions runtime versions, see [Azure Functions runtime versions overview](./functions-versions.md).

> [!IMPORTANT]
> As of December 13, 2022, function apps running on versions 2.x and 3.x of the Azure Functions runtime have reached the end of extended support. For more information, see [Retired versions](functions-versions.md#retired-versions).

This article walks you through the process of safely migrating your function app to run on version 4.x of the Functions runtime. Because project migration instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

## Identify function apps to migrate

Use the following PowerShell script to generate a list of function apps in your subscription that currently target versions 2.x or 3.x:

:::code language="powershell" source="~/functions-azure-product/EOLHostMigration/CheckEOLAppsPerAzSub.ps1" range="4-20":::

::: zone pivot="programming-language-csharp" 

## Choose your target .NET version

On version 3.x of the Functions runtime, your C# function app targets .NET Core 3.1 using the in-process model or .NET 5 using the isolated worker model.

[!INCLUDE [functions-dotnet-migrate-v4-versions](../../includes/functions-dotnet-migrate-v4-versions.md)]

> [!TIP]
> **We recommend updating to .NET 8 on the isolated worker model.** .NET 8 is the fully released version with the longest support window from .NET.
>
> Although you can choose to instead use the in-process model, this is not recommended if it can be avoided. [Support will end for the in-process model on November 10, 2026](https://aka.ms/azure-functions-retirements/in-process-model), so you'll need to move to the isolated worker model before then. Doing so while migrating to version 4.x will decrease the total effort required, and the isolated worker model will give your app [additional benefits](./dotnet-isolated-in-process-differences.md), including the ability to more easily target future versions of .NET. If you are moving to the isolated worker model, the [.NET Upgrade Assistant] can also handle many of the necessary code changes for you.

This guide doesn't present specific examples for .NET 9. If you need to target that version, you can adapt the .NET 8 examples for the isolated worker model.

::: zone-end

## Prepare for migration

If you haven't already, identify the list of apps that need to be migrated in your current Azure Subscription by using the [Azure PowerShell](#identify-function-apps-to-migrate).

Before you migrate an app to version 4.x of the Functions runtime, you should do the following tasks:

1. Review the list of [breaking changes between 3.x and 4.x](#breaking-changes-between-3x-and-4x).
1. Complete the steps in [Migrate your local project](#migrate-your-local-project) to migrate your local project to version 4.x.
1. After migrating your project, fully test the app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
1. [Run the pre-upgrade validator](#run-the-pre-upgrade-validator) on the app hosted in Azure, and resolve any identified issues.
1. Update your function app in Azure to the new version. If you need to minimize downtime, consider using a [staging slot](functions-deployment-slots.md) to test and verify your migrated app in Azure on the new runtime version. You can then deploy your app with the updated version settings to the production slot. For more information, see [Update using slots](#update-using-slots).
1. Publish your migrated project to the updated function app.

::: zone pivot="programming-language-csharp"

  When you use Visual Studio to publish a version 4.x project to an existing function app at a lower version, you're prompted to let Visual Studio update the function app to version 4.x during deployment. This update uses the same process defined in [Update without slots](#update-without-slots).

::: zone-end

## Migrate your local project

Upgrading instructions are language dependent. If you don't see your language, choose it from the selector at the [top of the article](#top).

::: zone pivot="programming-language-csharp"  

Choose the tab that matches your target version of .NET and the desired process model (in-process or isolated worker process).

> [!TIP]
> If you are moving to an LTS or STS version of .NET using the isolated worker model, the [.NET Upgrade Assistant] can be used to automatically make many of the changes mentioned in the following sections.

### Project file

The following example is a `.csproj` project file that uses .NET Core 3.1 on version 3.x:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <AzureFunctionsVersion>v3</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="3.0.13" />
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

# [.NET 8](#tab/net8)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net8](../../includes/functions-dotnet-migrate-project-v4-isolated-net8.md)]

# [.NET Framework 4.8](#tab/netframework48)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net-framework](../../includes/functions-dotnet-migrate-project-v4-isolated-net-framework.md)]

# [.NET 8 (in-process model)](#tab/net8-in-proc)

[!INCLUDE [functions-dotnet-migrate-project-v4-inproc](../../includes/functions-dotnet-migrate-project-v4-inproc.md)]

---

### Package and namespace changes

Based on the model you are migrating to, you might need to update or change the packages your application references. When you adopt the target packages, you then need to update the namespace of using statements and some types you reference. You can see the effect of these namespace changes on `using` statements in the [HTTP trigger template examples](#http-trigger-template) later in this article.

# [.NET 8](#tab/net8)

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

# [.NET Framework 4.8](#tab/netframework48)

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

# [.NET 8 (in-process model)](#tab/net8-in-proc)

[!INCLUDE [functions-dotnet-migrate-packages-v4-in-process](../../includes/functions-dotnet-migrate-packages-v4-in-process.md)]

---

### Program.cs file

When migrating to run in an isolated worker process, you must add the following program.cs file to your project:

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

[!INCLUDE [functions-dotnet-migrate-isolated-program-cs](../../includes/functions-dotnet-migrate-isolated-program-cs.md)]

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

[!INCLUDE [functions-dotnet-migrate-isolated-program-cs](../../includes/functions-dotnet-migrate-isolated-program-cs.md)]

# [.NET 8 (in-process model)](#tab/net8-in-proc)

A `Program.cs` file isn't required when you are using the in-process model.

---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). 

When you migrate to version 4.x, make sure that your local.settings.json file has at least the following elements:

# [.NET 8](#tab/net8)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

> [!NOTE]
> When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated".

# [.NET Framework 4.8](#tab/netframework48)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

> [!NOTE]
> When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated".

# [.NET 8 (in-process model)](#tab/net8-in-proc)

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "AzureWebJobsStorageConnectionStringValue",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "FUNCTIONS_INPROC_NET8_ENABLED": "1"
    }
}
```

> [!NOTE]
> When choosing to target .NET 8 using the in-process model, you need to set the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet" and set the `FUNCTIONS_INPROC_NET8_ENABLED` value to "1".


---

### host.json file

# [.NET 8 (isolated)](#tab/net8)

No changes are required to your `host.json` file. However, if your Application Insights configuration in this file from your in-process model project, you might want to make additional changes in your `Program.cs` file. The `host.json` file only controls logging from the Functions host runtime, and in the isolated worker model, some of these logs come from your application directly, giving you more control. See [Managing log levels in the isolated worker model](./dotnet-isolated-process-guide.md#managing-log-levels) for details on how to filter these logs.


# [.NET Framework 4.8](#tab/netframework48)

No changes are required to your `host.json` file. However, if your Application Insights configuration in this file from your in-process model project, you might want to make additional changes in your `Program.cs` file. The `host.json` file only controls logging from the Functions host runtime, and in the isolated worker model, some of these logs come from your application directly, giving you more control. See [Managing log levels in the isolated worker model](./dotnet-isolated-process-guide.md#managing-log-levels) for details on how to filter these logs.


# [.NET 8 (in-process model)](#tab/net8-in-proc)

No changes are required to your `host.json` file.

---


### Class name changes

Some key classes changed names between versions. These changes are a result either of changes in .NET APIs or in differences between in-process and isolated worker process. The following table indicates key .NET classes used by Functions that could change when migrating:

# [.NET 8](#tab/net8)

| .NET Core 3.1  | .NET 5 | .NET 8 | 
| --- | --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | `Function` (attribute) | 
| `ILogger` | `ILogger` | `ILogger`, `ILogger<T>` |
| `HttpRequest` | `HttpRequestData` | `HttpRequestData`, `HttpRequest` (using [ASP.NET Core integration])|
| `IActionResult` | `HttpResponseData` | `HttpResponseData`, `IActionResult` (using [ASP.NET Core integration])|
| `FunctionsStartup` (attribute) | Uses [`Program.cs`](#programcs-file) instead | Uses [`Program.cs`](#programcs-file) instead | 

# [.NET Framework 4.8](#tab/netframework48)

| .NET Core 3.1  | .NET 5 |.NET Framework 4.8 | 
| --- | --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | `Function` (attribute) | 
| `ILogger` | `ILogger` | `ILogger`, `ILogger<T>` |
| `HttpRequest` | `HttpRequestData` | `HttpRequestData`|
| `IActionResult` | `HttpResponseData` | `HttpResponseData`|
| `FunctionsStartup` (attribute) | Uses [`Program.cs`](#programcs-file) instead | Uses [`Program.cs`](#programcs-file) instead | 

# [.NET 8 (in-process model)](#tab/net8-in-proc)

| .NET Core 3.1  | .NET 5 |  .NET 8 (in-process) | 
| --- | --- | --- | 
| `FunctionName` (attribute) | `Function` (attribute) | `FunctionName` (attribute) | 
| `ILogger` | `ILogger` | `ILogger` |
| `HttpRequest` | `HttpRequestData` | `HttpRequest` |
| `IActionResult` | `HttpResponseData` | `IActionResult` |
| `FunctionsStartup` (attribute) | Uses [`Program.cs`](#programcs-file) instead | `FunctionsStartup` (attribute) |

---

[ASP.NET Core integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration

There might also be class name differences in bindings. For more information, see the reference articles for the specific bindings.


### Other code changes

# [.NET 8 (isolated)](#tab/net8)

This section highlights other code changes to consider as you work through the migration. These changes are not needed by all applications, but you should evaluate if any are relevant to your scenarios. Make sure to check [Breaking changes between 3.x and 4.x](#breaking-changes-between-3x-and-4x) for additional changes you might need to make to your project.

[!INCLUDE [functions-dotnet-migrate-isolated-other-code-changes](../../includes/functions-dotnet-migrate-isolated-other-code-changes.md)]

# [.NET Framework 4.8](#tab/netframework48)

This section highlights other code changes to consider as you work through the migration. These changes are not needed by all applications, but you should evaluate if any are relevant to your scenarios. Make sure to check [Breaking changes between 3.x and 4.x](#breaking-changes-between-3x-and-4x) for additional changes you might need to make to your project.

[!INCLUDE [functions-dotnet-migrate-isolated-other-code-changes](../../includes/functions-dotnet-migrate-isolated-other-code-changes.md)]

# [.NET 8 (in-process model)](#tab/net8-in-proc)

Make sure to check [Breaking changes between 3.x and 4.x](#breaking-changes-between-3x-and-4x) for additional changes you might need to make to your project.

---

### HTTP trigger template

The differences between in-process and isolated worker process can be seen in HTTP triggered functions. The HTTP trigger template for version 3.x (in-process) looks like the following example:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs":::

The HTTP trigger template for the migrated version looks like the following example:

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

# [.NET 8 (in-process model)](#tab/net8-in-proc)

Sames as version 3.x (in-process).

---

::: zone-end  

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python" 

To update your project to Azure Functions 4.x:

1. Update your local installation of [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) to version 4.x. 

1. Update your app's [Azure Functions extensions bundle](functions-bindings-register.md#extension-bundles) to 2.x or above. For more information, see [breaking changes](#breaking-changes-between-3x-and-4x).

::: zone-end  

::: zone pivot="programming-language-java"

1. If needed, move to one of the [Java versions supported on version 4.x](./functions-reference-java.md#supported-versions).

1. Update the app's `POM.xml` file to modify the `FUNCTIONS_EXTENSION_VERSION` setting to `~4`, as in the following example:

    ```xml
    <configuration>
        <resourceGroup>${functionResourceGroup}</resourceGroup>
        <appName>${functionAppName}</appName>
        <region>${functionAppRegion}</region>
        <appSettings>
            <property>
                <name>WEBSITE_RUN_FROM_PACKAGE</name>
                <value>1</value>
            </property>
            <property>
                <name>FUNCTIONS_EXTENSION_VERSION</name>
                <value>~4</value>
            </property>
        </appSettings>
    </configuration>
    ```

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

3. If needed, move to one of the [Node.js versions supported on version 4.x](functions-reference-node.md#node-version).

::: zone-end

::: zone pivot="programming-language-powershell"

1. Take this opportunity to upgrade to PowerShell 7.2, which is recommended. For more information, see [PowerShell versions](functions-reference-powershell.md#powershell-versions).

::: zone-end

::: zone pivot="programming-language-python"

1. If you're using Python 3.6, move to one of the [supported versions](functions-reference-python.md#python-version).

::: zone-end

### Run the pre-upgrade validator

Azure Functions provides a pre-upgrade validator to help you identify potential issues when migrating your function app to 4.x. To run the pre-upgrade validator:

1. In the [Azure portal](https://portal.azure.com), navigate to your function app.

1. Open the **Diagnose and solve problems** page.

1. In **Function App Diagnostics**, start typing `Functions 4.x Pre-Upgrade Validator` and then choose it from the list. 

1.  After validation completes, review the recommendations and address any issues in your app. If you need to make changes to your app, make sure to validate the changes against version 4.x of the Functions runtime, either [locally using Azure Functions Core Tools v4](#migrate-your-local-project) or by [using a staging slot](#update-using-slots). 

[!INCLUDE [functions-migrate-v4](../../includes/functions-migrate-v4.md)]

## Breaking changes between 3.x and 4.x

The following are key breaking changes to be aware of before upgrading a 3.x app to 4.x, including language-specific breaking changes. For a full list, see Azure Functions GitHub issues labeled [*Breaking Change: Approved*](https://github.com/Azure/azure-functions/issues?q=is%3Aissue+label%3A%22Breaking+Change%3A+Approved%22+is%3A%22closed+OR+open%22). 

If you don't see your programming language, go select it from the [top of the page](#top). 

### Runtime

- Azure Functions Proxies is a legacy feature for versions 1.x through 3.x of the Azure Functions runtime. Support for Functions Proxies can be re-enabled in version 4.x so that you can successfully update your function apps to the latest runtime version. As soon as possible, you should instead switch to integrating your function apps with Azure API Management. API Management lets you take advantage of a more complete set of features for defining, securing, managing, and monetizing your Functions-based APIs. For more information, see [API Management integration](functions-proxies.md#api-management-integration). To learn how to re-enable Proxies support in Functions version 4.x, see [Re-enable Proxies in Functions v4.x](legacy-proxies.md#re-enable-proxies-in-functions-v4x).  

- Logging to Azure Storage using *AzureWebJobsDashboard* is no longer supported in 4.x. You should instead use [Application Insights](./functions-monitoring.md). ([#1923](https://github.com/Azure/Azure-Functions/issues/1923))

- Azure Functions 4.x now enforces [minimum version requirements for extensions](functions-versions.md#minimum-extension-versions). Update to the latest version of affected extensions. For non-.NET languages, [update](./functions-bindings-register.md#extension-bundles) to extension bundle version 2.x or later. ([#1987](https://github.com/Azure/Azure-Functions/issues/1987))

- Default and maximum timeouts are now enforced in 4.x for function apps running on Linux in a Consumption plan. ([#1915](https://github.com/Azure/Azure-Functions/issues/1915))

- Azure Functions 4.x uses `Azure.Identity` and `Azure.Security.KeyVault.Secrets` for the Key Vault provider and has deprecated the use of Microsoft.Azure.KeyVault. For more information about how to configure function app settings, see the Key Vault option in [Manage key storage](function-keys-how-to.md#manage-key-storage). ([#2048](https://github.com/Azure/Azure-Functions/issues/2048))

- Function apps that share storage accounts now fail to start when their host IDs are the same. For more information, see [Host ID considerations](storage-considerations.md#host-id-considerations). ([#2049](https://github.com/Azure/Azure-Functions/issues/2049))

::: zone pivot="programming-language-csharp" 

- Azure Functions 4.x supports newer versions of .NET. See [Supported languages in Azure Functions](./supported-languages.md) for a full list of versions.

- `InvalidHostServicesException` is now a fatal error. ([#2045](https://github.com/Azure/Azure-Functions/issues/2045))

- `EnableEnhancedScopes` is enabled by default. ([#1954](https://github.com/Azure/Azure-Functions/issues/1954))

- Remove `HttpClient` as a registered service. ([#1911](https://github.com/Azure/Azure-Functions/issues/1911))
::: zone-end  
::: zone pivot="programming-language-java"  
- Use single class loader in Java 11. ([#1997](https://github.com/Azure/Azure-Functions/issues/1997))

- Stop loading worker jars in Java 8. ([#1991](https://github.com/Azure/Azure-Functions/issues/1991))
::: zone-end    
::: zone pivot="programming-language-javascript,programming-language-typescript"  

- Node.js versions 10 and 12 aren't supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Output serialization in Node.js apps was updated to address previous inconsistencies. ([#2007](https://github.com/Azure/Azure-Functions/issues/2007))
::: zone-end  
::: zone pivot="programming-language-powershell"  
- Default thread count has been updated. Functions that aren't thread-safe or have high memory usage could be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end  
::: zone pivot="programming-language-python"  
- Python 3.6 isn't supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Shared memory transfer is enabled by default. ([#1973](https://github.com/Azure/Azure-Functions/issues/1973))

- Default thread count has been updated. Functions that aren't thread-safe or have high memory usage could be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Functions versions](functions-versions.md)

[.NET Upgrade Assistant]: /dotnet/core/porting/upgrade-assistant-overview
