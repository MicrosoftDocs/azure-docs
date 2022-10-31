---
title: Migrate apps from Azure Functions version 3.x to 4.x 
description: This article shows you how to upgrade your existing function apps running on version 3.x of the Azure Functions runtime to be able to run on version 4.x of the runtime. 
ms.service: azure-functions
ms.topic: how-to 
ms.date: 10/23/2022
zone_pivot_groups: programming-languages-set-functions
---

# <a name="top"></a>Migrate apps from Azure Functions version 3.x to version 4.x 

Azure Functions version 4.x is highly backwards compatible to version 3.x. Most apps should safely upgrade to 4.x without requiring significant code changes. For more information about Functions runtime versions, see [Azure Functions runtime versions overview](./functions-versions.md).

This article walks you through the process of safely migrating your function app to run on version 4.x of the Functions runtime. Because project upgrade instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

::: zone pivot="programming-language-csharp" 
## Choose your target .NET

On version 3.x of the Functions runtime, your C# function app targets .NET Core 3.1. When you migrate your function app to version 4.x, you have the opportunity to choose the target version of .NET. You can upgrade your C# project to one of the following versions of .NET, all of which can run on Functions version 4.x: 

| .NET version | Process model<sup>*</sup> | 
| --- | --- | --- |
| .NET 7 | [Isolated worker process](./dotnet-isolated-process-guide.md) | 
| .NET 6 | [Isolated worker process](./dotnet-isolated-process-guide.md) | 
| .NET 6 | [In-process](./functions-dotnet-class-library.md) |  

<sup>*</sup> [In-process execution](./functions-dotnet-class-library.md) is only supported for Long Term Support (LTS) releases of .NET. Non-LTS releases and .NET Framework require you to run in an [isolated worker process](./dotnet-isolated-process-guide.md).

Upgrading from .NET Core 3.1 to .NET 6 running in-process requires minimal updates to your project and virtually no updates to code. Switching to the isolated worker process model requires you to make changes to your code, but provides the flexibility of being able to easily run on any future version of .NET. 
::: zone-end

## Prepare for migration

Before you upgrade your app to version 4.x of the Functions runtime, you should do the following tasks:

* Review the list of [breaking changes between 3.x and 4.x](#breaking-changes-between-3x-and-4x).
* [Run the pre-upgrade validator](#run-the-pre-upgrade-validator).
* When possible, [upgrade your local project environment to version 4.x](#upgrade-your-local-project). Fully test your app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
* Upgrade your function app in Azure to the new version. If you need to minimize downtime, consider using a [staging slot](functions-deployment-slots.md) to test and verify your migrated app in Azure on the new runtime version. You can then deploy your app with the updated version settings to the production slot. For more information, see [Migrate using slots](#upgrade-using-slots).  
* Republished your migrated project to the upgraded function app. When you use Visual Studio to publish a version 4.x project to an existing function app at a lower version, you're prompted to let Visual Studio upgrade the function app to version 4.x during deployment. This upgrade uses the same process defined in [Migrate without slots](#upgrade-without-slots).

## Run the pre-upgrade validator

Azure Functions provides a pre-upgrade validator to help you identify potential issues when migrating your function app to 4.x. To run the pre-upgrade validator:

1. In the [Azure portal](https://portal.azure.com), navigate to your function app.

1. Open the **Diagnose and solve problems** page.

1. In **Function App Diagnostics**, start typing `Functions 4.x Pre-Upgrade Validator` and then choose it from the list. 

1.  After validation completes, review the recommendations and address any issues in your app. If you need to make changes to your app, make sure to validate the changes against version 4.x of the Functions runtime, either [locally using Azure Functions Core Tools v4](#upgrade-your-local-project) or by [using a staging slot](#upgrade-using-slots). 

## Upgrade your local project

Upgrading instructions are language dependent. If you don't see your language, choose it from the selector at the [top of the article](#top).

::: zone pivot="programming-language-csharp"  

Choose the tab that matches your target version of .NET and the desired process model (in-process or isolated worker process).

### .csproj file

The following example is a .csproj project file that uses .NET Core 3.1 on version 3.x:

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

# [.NET 6 (in-process)](#tab/net6-in-proc)

[!INCLUDE [functions-dotnet-migrate-project-v4-inproc](../../includes/functions-dotnet-migrate-project-v4-inproc.md)]

# [.NET 6 (isolated)](#tab/net6-isolated)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated](../../includes/functions-dotnet-migrate-project-v4-isolated.md)]

# [.NET 7](#tab/net7)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-2](../../includes/functions-dotnet-migrate-project-v4-isolated-2.md)]

---

### program.cs file

When migrating to run in an isolated worker process, you must add the following program.cs file to your project:

# [.NET 6 (in-process)](#tab/net6-in-proc)

A program.cs file isn't required when running in-process.

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value, as in the following example:

# [.NET 6 (in-process)](#tab/net6-in-proc)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/local.settings.json":::

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

# [.NET 7](#tab/net7)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

---

### Namespace changes

C# functions that run in an isolated worker process uses libraries in a different namespace than those libraries used when running in-process. In-process libraries are generally in the namespace `Microsoft.Azure.WebJobs.*`. Isolated worker process function apps use libraries in the namespace `Microsoft.Azure.Functions.Worker.*`. You can see the effect of these namespace changes on `using` statements in the [HTTP trigger template examples](#http-trigger-template) that follow.

### Class name changes

Some key classes change names as a result of differences between in-process and isolated worker process APIs. 

The following table indicates key .NET classes used by Functions that could change when migrating from in-process:

| .NET Core 3.1 |  .NET 6 (in-process) | .NET 6 (isolated) | .NET 7 |
| --- | --- | --- | --- |
| `FunctionName` (attribute) | `FunctionName` (attribute) | `Function` (attribute) | `Function` (attribute) |
| `HttpRequest` | `HttpRequest` | `HttpRequestData` | `HttpRequestData` |
| `OkObjectResult` | `OkObjectResult` | `HttpResonseData` | `HttpResonseData` |

There might also be class name differences in bindings. For more information, see the reference articles for the specific bindings.    

### HTTP trigger template

The differences between in-process and isolated worker process can be seen in HTTP triggered functions. The HTTP trigger template for version 3.x (in-process) looks like the following example:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs":::

The HTTP trigger template for the migrated version looks like the following example:

# [.NET 6 (in-process)](#tab/net6-in-proc)

Sames as version 3.x (in-process).

# [.NET 6 (isolated)](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

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
1. If needed, move to one of the [Node.js versions supported on version 4.x](functions-reference-node.md#node-version).
::: zone-end  
::: zone pivot="programming-language-powershell"  
1. If needed, move to one of the [PowerShell versions supported version 4.x](functions-reference-powershell.md#powershell-versions).
::: zone-end  
::: zone pivot="programming-language-python"  
1. If you're using Python 3.6, move to one of the [supported versions](functions-reference-python.md#python-version).
::: zone-end

[!INCLUDE [functions-migrate-v4](../../includes/functions-migrate-v4.md)]

## Breaking changes between 3.x and 4.x

The following are key breaking changes to be aware of before upgrading a 3.x app to 4.x, including language-specific breaking changes. For a full list, see Azure Functions GitHub issues labeled [*Breaking Change: Approved*](https://github.com/Azure/azure-functions/issues?q=is%3Aissue+label%3A%22Breaking+Change%3A+Approved%22+is%3A%22closed+OR+open%22). More changes are expected during the preview period. Subscribe to [App Service Announcements](https://github.com/Azure/app-service-announcements/issues) for updates.

If you don't see your programming language, go select it from the [top of the page](#top). 

### Runtime

- Azure Functions proxies is a legacy feature for versions 1.x through 3.x of the Azure Functions runtime. Support for Functions proxies is being returned in version 4.x so that you can successfully upgrade your function apps to the latest runtime version. As soon as possible, you should instead switch to integrating your function apps with Azure API Management. API Management lets you take advantage of a more complete set of features for defining, securing, managing, and monetizing your Functions-based APIs. For more information, see [API Management integration](functions-proxies.md#api-management-integration). For information about the pending return of proxies in version 4.x, [Monitor the App Service announcements page](https://github.com/Azure/app-service-announcements/issues).  

- Logging to Azure Storage using *AzureWebJobsDashboard* is no longer supported in 4.x. You should instead use [Application Insights](./functions-monitoring.md). ([#1923](https://github.com/Azure/Azure-Functions/issues/1923))

- Azure Functions 4.x now enforces [minimum version requirements for extensions](#minimum-extension-versions). Upgrade to the latest version of affected extensions. For non-.NET languages, [upgrade](./functions-bindings-register.md#extension-bundles) to extension bundle version 2.x or later. ([#1987](https://github.com/Azure/Azure-Functions/issues/1987))

- Default and maximum timeouts are now enforced in 4.x for function app running on Linux in a Consumption plan. ([#1915](https://github.com/Azure/Azure-Functions/issues/1915))

- Azure Functions 4.x uses `Azure.Identity` and `Azure.Security.KeyVault.Secrets` for the Key Vault provider and has deprecated the use of Microsoft.Azure.KeyVault. For more information about how to configure function app settings, see the Key Vault option in [Secret Repositories](security-concepts.md#secret-repositories). ([#2048](https://github.com/Azure/Azure-Functions/issues/2048))

- Function apps that share storage accounts now fail to start when their host IDs are the same. For more information, see [Host ID considerations](storage-considerations.md#host-id-considerations). ([#2049](https://github.com/Azure/Azure-Functions/issues/2049))

::: zone pivot="programming-language-csharp" 

- Azure Functions 4.x supports .NET 6 in-process and isolated apps.

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
- PowerShell 6 isn't supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Default thread count has been updated. Functions that aren't thread-safe or have high memory usage may be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end  
::: zone pivot="programming-language-python"  
- Python 3.6 isn't supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Shared memory transfer is enabled by default. ([#1973](https://github.com/Azure/Azure-Functions/issues/1973))

- Default thread count has been updated. Functions that aren't thread-safe or have high memory usage may be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end