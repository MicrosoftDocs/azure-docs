---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
ms.topic: conceptual
ms.custom: devx-track-dotnet
ms.date: 01/22/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions runtime versions overview

<a name="top"></a>Azure Functions currently supports several versions of the runtime host. The following table details the available versions, their support level, and when they should be used:

| Version | Support level | Description |
| --- | --- | --- |
| 4.x | GA | **_Recommended runtime version for functions in all languages._** Use this version to [run C# functions on .NET 6.0 and .NET Framework 4.8](functions-dotnet-class-library.md#supported-versions). |
| 3.x | GA | Supports all languages. Use this version to [run C# functions on .NET Core 3.1 and .NET 5.0](functions-dotnet-class-library.md#supported-versions).|
| 2.x | GA | Supported for [legacy version 2.x apps](#pinning-to-version-20). This version is in maintenance mode, with enhancements provided only in later versions.|
| 1.x | GA | Recommended only for C# apps that must use .NET Framework and only supports development in the Azure portal, Azure Stack Hub portal, or locally on Windows computers. This version is in maintenance mode, with enhancements provided only in later versions. |

This article details some of the differences between these versions, how you can create each version, and how to change the version on which your functions run.

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages

All functions in a function app must share the same language. You chose the language of functions in your function app when you create the app. The language of your function app is maintained in the [FUNCTIONS\_WORKER\_RUNTIME](functions-app-settings.md#functions_worker_runtime) setting, and shouldn't be changed when there are existing functions. 

The following table indicates which programming languages are currently supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

## <a name="creating-1x-apps"></a>Run on a specific version

By default, function apps created in the Azure portal and by the Azure CLI are set to version 4.x. You can modify this version if needed. You can only downgrade the runtime version to 1.x after you create your function app but before you add any functions. Moving to a later version is allowed even with apps that have existing functions. When your app has existing functions, be aware of any breaking changes between versions before moving to a later runtime version. The following sections detail changes between versions:

+ [Between 3.x and 4.x](#breaking-changes-between-3x-and-4x) 
+ [Between 2.x and 3.x](#breaking-changes-between-2x-and-3x)
+ [Between 1.x and later versions](#migrating-from-1x-to-later-versions)

Before making a change to the major version of the runtime, you should first test your existing code by deploying to another function app running on the latest major version. This testing helps to make sure it runs correctly after the upgrade. You can also verify your code locally by using the runtime-specific version of the [Azure Functions Core Tools](functions-run-local.md), which includes the Functions runtime. 

Downgrades to v2.x aren't supported. When possible, you should always run your apps on the latest supported version of the Functions runtime. 

### Changing version of apps in Azure

The version of the Functions runtime used by published apps in Azure is dictated by the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) application setting. The following major runtime version values are supported:

| Value | Runtime target |
| ------ | -------- |
| `~4` | 4.x |
| `~3` | 3.x |
| `~2` | 2.x |
| `~1` | 1.x |

>[!IMPORTANT]
> Don't arbitrarily change this app setting, because other app setting changes and changes to your function code may be required. You should instead change this setting in the **Function runtime settings** tab of the function app **Configuration** in the Azure portal when you are ready to make a major version upgrade.

To learn more, see [How to target Azure Functions runtime versions](set-runtime-version.md).  

### Pinning to a specific minor version

To resolve issues your function app may have when running on the latest major version, you have to temporarily pin your app to a specific minor version. This gives you time to get your app running correctly on the latest major version. The way that you pin to a minor version differs between Windows and Linux. To learn more, see [How to target Azure Functions runtime versions](set-runtime-version.md).

Older minor versions are periodically removed from Functions. For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues). 

### Pinning to version ~2.0

.NET function apps running on version 2.x (`~2`) are automatically upgraded to run on .NET Core 3.1, which is a long-term support version of .NET Core 3. Running your .NET functions on .NET Core 3.1 allows you to take advantage of the latest security updates and product enhancements. 

Any function app pinned to `~2.0` continues to run on .NET Core 2.2, which no longer receives security and other updates. To learn more, see [Functions v2.x considerations](functions-dotnet-class-library.md#functions-v2x-considerations). 

## Minimum extension versions

::: zone pivot="programming-language-csharp"
There's technically not a correlation between binding extension versions and the Functions runtime version. However, starting with version 4.x the Functions runtime enforces a minimum version for all trigger and binding extensions. 

If you receive a warning about a package not meeting a minimum required version, you should update that NuGet package to the minimum version as you normally would. The minimum version requirements for extensions used in Functions v4.x can be found in [this configuration file](https://github.com/Azure/azure-functions-host/blob/v4.x/src/WebJobs.Script/extensionrequirements.json).

For C# script, update the extension bundle reference in the host.json as follows:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[2.*, 3.0.0)"
    }
}
```

::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
There's technically not a correlation between extension bundle versions and the Functions runtime version. However, starting with version 4.x the Functions runtime enforces a minimum version for extension bundles. 

If you receive a warning about your extension bundle version not meeting a minimum required version, update your existing extension bundle reference in the host.json as follows:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[2.*, 3.0.0)"
    }
}
```  

To learn more about extension bundles, see [Extension bundles](functions-bindings-register.md#extension-bundles).
::: zone-end

## <a name="migrating-from-3x-to-4x"></a>Migrating from 3.x to 4.x

Azure Functions version 4.x is highly backwards compatible to version 3.x. Many apps should safely upgrade to 4.x without significant code changes. Be sure to fully test your app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md) or [in a staging slot](functions-deployment-slots.md) before changing the major version in production apps.

### Upgrading an existing app

When you develop your function app locally, you must upgrade both your local project environment and your function app running in Azure. 

#### Local project

Upgrading instructions may be language dependent. If you don't see your language, please select it from the switcher at the [top of the article](#top).

::: zone pivot="programming-language-csharp"  
To update a C# class library app to .NET 6 and Azure Functions 4.x, update the `TargetFramework` and `AzureFunctionsVersion`:

```xml
<TargetFramework>net6.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

You must also make sure the NuGet packages references by your app are updated to the latest versions. See [breaking changes](#breaking-changes-between-3x-and-4x) for more information. Specific packages depend on whether your functions run in-process or out-of-process. 

# [In-process](#tab/in-process)

* [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) 4.0.0 or later

# [Isolated process](#tab/isolated-process)

* [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/) 1.5.2 or later
* [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/) 1.2.0 or later

---
::: zone-end  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python" 
To update your app to Azure Functions 4.x, update your local installation of [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) to 4.x and update your app's [Azure Functions extensions bundle](functions-bindings-register.md#extension-bundles) to 2.x or above. See [breaking changes](#breaking-changes-between-3x-and-4x) for more information.

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
> [!NOTE]
> Node.js 10 and 12 are not supported in Azure Functions 4.x.
::: zone-end  
::: zone pivot="programming-language-powershell"  
> [!NOTE]
> PowerShell 6 is not supported in Azure Functions 4.x.
::: zone-end  
::: zone pivot="programming-language-python"  
> [!NOTE]
> Python 3.6 isn't supported in Azure Functions 4.x.
::: zone-end

#### Azure

A pre-upgrade validator is available to help identify potential issues when migrating a function app to 4.x. Before you migrate an existing app, follow these steps to run the validator:

1. In the Azure portal, navigate to your function app

1. Open the *Diagnose and solve problems* blade

1. In *Search for common problems or tools*, enter and select **Functions 4.x Pre-Upgrade Validator**

Once you have validated that the app can be upgraded, you can begin the process of migration. See the subsections below for instructions for [migration without slots](#migration-without-slots) and [migration with slots](#migration-with-slots).

> [!NOTE]
> If you are using a slot to manage the migration, you will need to set the `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS` application setting to "0" on _both_ slots. This allows the version changes you make to be included in the slot swap operation. You can then upgrade your staging (non-production) slot, and then you can perform the swap.

To migrate an app from 3.x to 4.x, you will:

- Set the `FUNCTIONS_EXTENSION_VERSION` application setting to `~4`
- **For Windows function apps only**, enable .NET 6.0 through the `netFrameworkVersion` setting

##### Migration without slots

You can use the following Azure CLI or Azure PowerShell commands to perform this upgrade directly on a site without slots:

# [Azure CLI](#tab/azure-cli)

```azurecli
az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>

# For Windows function apps only, also enable .NET 6.0 that is needed by the runtime
az functionapp config set --net-framework-version v6.0 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Update-AzFunctionAppSetting -AppSetting @{FUNCTIONS_EXTENSION_VERSION = "~4"} -Name <APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -Force

# For Windows function apps only, also enable .NET 6.0 that is needed by the runtime
Set-AzWebApp -NetFrameworkVersion v6.0 -Name <APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME>
```

---

##### Migration with slots

You can use the following Azure CLI commands to perform this upgrade using deployment slots:

First, update the production slot with `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0`. If your app can tolerate a restart (which impacts availability), it is recommended that you update the setting directly on the production slot, possibly at a time of lower traffic. If you instead choose to swap this setting into place, you should immediately update the staging slot after the swap. A consequence of swapping when only staging has `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` is that it will remove the `FUNCTIONS_EXTENSION_VERSION` setting in staging, putting the slot into a bad state. Updating the staging slot with a version right after the swap enables you to roll your changes back if necessary. However, in such a situation, you should still be prepared to directly update settings on production to remove `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` before the swap back.

```azurecli
# Update production with WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS
az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0  -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> 

# OR

# Alternatively get production prepared with WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS via a swap
az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0  -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
# The swap actions should be accompanied with a version specification for the slot. You may see errors from staging during the time between these actions.
az functionapp deployment slot swap -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME> --target-slot production
az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~3 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
```

After the production slot has `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` configured, you can configure everything else in the staging slot and then swap: 

```azurecli
# Get staging configured with WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS
az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
# Get staging configured with the new extension version
az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
# For Windows function apps only, also enable .NET 6.0 that is needed by the runtime
az functionapp config set --net-framework-version v6.0 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>

# Be sure to confirm that your staging environment is working as expected before swapping.

# Swap to migrate production to the new version
az functionapp deployment slot swap -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME> --target-slot production
```

### Breaking changes between 3.x and 4.x

The following are some changes to be aware of before upgrading a 3.x app to 4.x. For a full list, see Azure Functions GitHub issues labeled [*Breaking Change: Approved*](https://github.com/Azure/azure-functions/issues?q=is%3Aissue+label%3A%22Breaking+Change%3A+Approved%22+is%3A%22closed+OR+open%22). More changes are expected during the preview period. Subscribe to [App Service Announcements](https://github.com/Azure/app-service-announcements/issues) for updates.

#### Runtime

- Azure Functions Proxies are no longer supported in 4.x. You are recommended to use [Azure API Management](../api-management/import-function-app-as-api.md).

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

- Node.js versions 10 and 12 are not supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Output serialization in Node.js apps was updated to address previous inconsistencies. ([#2007](https://github.com/Azure/Azure-Functions/issues/2007))
::: zone-end  
::: zone pivot="programming-language-powershell"  
- PowerShell 6 is not supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Default thread count has been updated. Functions that are not thread-safe or have high memory usage may be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end  
::: zone pivot="programming-language-python"  
- Python 3.6 is not supported in Azure Functions 4.x. ([#1999](https://github.com/Azure/Azure-Functions/issues/1999))

- Shared memory transfer is enabled by default. ([#1973](https://github.com/Azure/Azure-Functions/issues/1973))

- Default thread count has been updated. Functions that are not thread-safe or have high memory usage may be impacted. ([#1962](https://github.com/Azure/Azure-Functions/issues/1962))
::: zone-end

## Migrating from 2.x to 3.x

Azure Functions version 3.x is highly backwards compatible to version 2.x.  Many apps can safely upgrade to 3.x without any code changes. While moving to 3.x is encouraged, run extensive tests before changing the major version in production apps.

### Breaking changes between 2.x and 3.x

The following are the language-specific changes to be aware of before upgrading a 2.x app to 3.x.

::: zone pivot="programming-language-csharp"
The main differences between versions when running .NET class library functions is the .NET Core runtime. Functions version 2.x is designed to run on .NET Core 2.2 and version 3.x is designed to run on .NET Core 3.1.  

* [Synchronous server operations are disabled by default](/dotnet/core/compatibility/2.2-3.0#http-synchronous-io-disabled-in-all-servers).

* Breaking changes introduced by .NET Core in [version 3.1](/dotnet/core/compatibility/3.1) and [version 3.0](/dotnet/core/compatibility/3.0), which aren't specific to Functions but might still affect your app.

>[!NOTE]
>Due to support issues with .NET Core 2.2, function apps pinned to version 2 (`~2`) are essentially running on .NET Core 3.1. To learn more, see [Functions v2.x compatibility mode](functions-dotnet-class-library.md#functions-v2x-considerations).

::: zone-end  
::: zone pivot="programming-language-javascript"  

* Output bindings assigned through 1.x `context.done` or return values now behave the same as setting in 2.x+ `context.bindings`.

* Timer trigger object is camelCase instead of PascalCase

* Event hub triggered functions with `dataType` binary will receive an array of `binary` instead of `string`.

* The HTTP request payload can no longer be accessed via `context.bindingData.req`.  It can still be accessed as an input parameter, `context.req`, and in `context.bindings`.

* Node.js 8 is no longer supported and won't execute in 3.x functions.
::: zone-end 

## Migrating from 1.x to later versions

You may choose to migrate an existing app written to use the version 1.x runtime to instead use a newer version. Most of the changes you need to make are related to changes in the language runtime, such as C# API changes between .NET Framework 4.8 and .NET Core. You'll also need to make sure your code and libraries are compatible with the language runtime you choose. Finally, be sure to note any changes in trigger, bindings, and features highlighted below. For the best migration results, you should create a new function app in a new version and port your existing version 1.x function code to the new app.  

While it's possible to do an "in-place" upgrade by manually updating the app configuration, going from 1.x to a higher version includes some breaking changes. For example, in C#, the debugging object is changed from `TraceWriter` to `ILogger`. By creating a new version 3.x project, you start off with updated functions based on the latest version 3.x templates.

### Changes in triggers and bindings after version 1.x

Starting with version 2.x, you must install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](./functions-bindings-register.md).

There are also a few changes in the *function.json* or attributes of the function between versions. For example, the Event Hubs `path` property is now `eventHubName`. See the [existing binding table](#bindings) for links to documentation for each binding.

### Changes in features and functionality after version 1.x

A few features were removed, updated, or replaced after version 1.x. This section details the changes you see in later versions after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure Files by default. When you upgrade an app from version 1.x to version 2.x, existing secrets that are in Azure Files are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* The host configuration file (host.json) should be empty or have the string `"version": "2.0"`.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-develop-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for Consumption plan functions, with a default of 100 concurrent requests per instance. You can change this in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET Core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (`.fsx` files) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to follow this pattern: `https://{app}/runtime/webhooks/{triggerName}`.

### Locally developed application versions

You can make the following updates to function apps to locally change the targeted versions.

#### Visual Studio runtime versions

In Visual Studio, you select the runtime version when you create a project. Azure Functions tools for Visual Studio supports the three major runtime versions. The correct version is used when debugging and publishing based on project settings. The version settings are defined in the `.csproj` file in the following properties:

# [Version 4.x](#tab/v4)

```xml
<TargetFramework>net6.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

You can also choose `net6.0` or `net48` as the target framework if you are using [.NET isolated process functions](dotnet-isolated-process-guide.md). Support for `net48` is currently in preview.

> [!NOTE]
> Azure Functions 4.x requires the `Microsoft.NET.Sdk.Functions` extension be at least `4.0.0`.

# [Version 3.x](#tab/v3)

```xml
<TargetFramework>netcoreapp3.1</TargetFramework>
<AzureFunctionsVersion>v3</AzureFunctionsVersion>
```

You can also choose `net5.0` as the target framework if you are using [.NET isolated process functions](dotnet-isolated-process-guide.md).

> [!NOTE]
> Azure Functions 3.x and .NET requires the `Microsoft.NET.Sdk.Functions` extension be at least `3.0.0`.

# [Version 2.x](#tab/v2)

```xml
<TargetFramework>netcoreapp2.1</TargetFramework>
<AzureFunctionsVersion>v2</AzureFunctionsVersion>
```

# [Version 1.x](#tab/v1)

```xml
<TargetFramework>net472</TargetFramework>
<AzureFunctionsVersion>v1</AzureFunctionsVersion>
```
---

###### Updating 2.x apps to 3.x in Visual Studio

You can open an existing function targeting 2.x and move to 3.x by editing the `.csproj` file and updating the values above.  Visual Studio manages runtime versions automatically for you based on project metadata.  However, it's possible if you have never created a 3.x app before that Visual Studio doesn't yet have the templates and runtime for 3.x on your machine.  This may present itself with an error like "no Functions runtime available that matches the version specified in the project."  To fetch the latest templates and runtime, go through the experience to create a new function project.  When you get to the version and template select screen, wait for Visual Studio to complete fetching the latest templates. After the latest .NET Core 3 templates are available and displayed, you can run and debug any project configured for version 3.x.

> [!IMPORTANT]
> Version 3.x functions can only be developed in Visual Studio if using Visual Studio version 16.4 or newer.

#### VS Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command-line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. To develop against version 3.x, install version 3.x of the Core Tools. Version 2.x development requires version 2.x of the Core Tools, and so on. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you may also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed.  This setting also updates the templates and languages used during function app creation.  To create apps in `~3` you would update the `azureFunctions.projectRuntime` user setting to `~3`.

![Azure Functions extension runtime setting](./media/functions-versions/vs-code-version-runtime.png)

#### Maven and Java apps

You can migrate Java apps from version 2.x to 3.x by [installing the 3.x version of the core tools](functions-run-local.md#install-the-azure-functions-core-tools) required to run locally.  After verifying that your app works correctly running locally on version 3.x, update the app's `POM.xml` file to modify the `FUNCTIONS_EXTENSION_VERSION` setting to `~3`, as in the following example:

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
            <value>~3</value>
        </property>
    </appSettings>
</configuration>
```

## Bindings

Starting with version 2.x, the runtime uses a new [binding extensibility model](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview) that offers these advantages:

* Support for third-party binding extensions.

* Decoupling of runtime and bindings. This change allows binding extensions to be versioned and released independently. You can, for example, opt to upgrade to a version of an extension that relies on a newer version of an underlying SDK.

* A lighter execution environment, where only the bindings in use are known and loaded by the runtime.

With the exception of HTTP and timer triggers, all bindings must be explicitly added to the function app project, or registered in the portal. For more information, see [Register binding extensions](./functions-bindings-expressions-patterns.md).

The following table shows which bindings are supported in each runtime version.

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]

## Next steps

For more information, see the following resources:

* [Code and test Azure Functions locally](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
