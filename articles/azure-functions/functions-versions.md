---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
ms.topic: conceptual
ms.custom: devx-track-dotnet
ms.date: 10/22/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions runtime versions overview

<a name="top"></a>Azure Functions currently supports several versions of the runtime host. The following table details the available versions, their support level, and when they should be used:

| Version | Support level | Description |
| --- | --- | --- |
| 4.x | GA | **_Recommended runtime version for functions in all languages._** Check out [Supported language versions](#languages). |
| 3.x | GA | Supports all languages. Check out [Supported language versions](#languages).|
| 2.x | GA | Supported for [legacy version 2.x apps](#pinning-to-version-20). This version is in maintenance mode, with enhancements provided only in later versions.|
| 1.x | GA | Recommended only for C# apps that must use .NET Framework and only supports development in the Azure portal, Azure Stack Hub portal, or locally on Windows computers. This version is in maintenance mode, with enhancements provided only in later versions. |

> [!IMPORTANT]
> Beginning on December 3, 2022, function apps running on versions 2.x and 3.x of the Azure Functions runtime can no longer be supported. Before that time, please test, verify, and migrate your function apps to version 4.x of the Functions runtime. For more information, see [Migrate apps from Azure Functions version 3.x to version 4.x](migrate-version-3-version-4.md). After the deadline, function apps can be created and deployed, and existing apps continue to run. However, your apps won't be eligible for new features, security patches, performance optimizations, and support until you upgrade them to version 4.x.
> 
>End of support for these runtime versions is due to the ending of support for .NET Core 3.1, which is required by these older runtime versions. This requirement affects all Azure Functions runtime languages.  
>Functions version 1.x is still supported for C# function apps that require the .NET Framework. Preview support is now available in Functions 4.x to [run C# functions on .NET Framework 4.8](dotnet-isolated-process-guide.md#supported-versions). 

This article details some of the differences between these versions, how you can create each version, and how to change the version on which your functions run.

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages

All functions in a function app must share the same language. You chose the language of functions in your function app when you create the app. The language of your function app is maintained in the [FUNCTIONS\_WORKER\_RUNTIME](functions-app-settings.md#functions_worker_runtime) setting, and shouldn't be changed when there are existing functions. 

The following table indicates which programming languages are currently supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

## <a name="creating-1x-apps"></a>Run on a specific version

The version of the Functions runtime used by published apps in Azure is dictated by the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) application setting. In some cases and for certain languages, other settings may apply.  

By default, function apps created in the Azure portal, by the Azure CLI, or from Visual Studio tools are set to version 4.x. You can modify this version if needed. You can only downgrade the runtime version to 1.x after you create your function app but before you add any functions. Moving to a later version is allowed even with apps that have existing functions. 

### Migrating existing function apps

When your app has existing functions, you must take precautions before moving to a later runtime version. The following articles detail breaking changes between versions, including language-specific breaking changes. They also provide you with step-by-step instructions for a successful migration of you existing function app. 

+ [Migrate from runtime version 3.x to version 4.x](./migrate-version-3-version-4.md) 
+ [Migrate from runtime version 1.x to version 4.x](./migrate-version-1-version-4.md)

### Changing version of apps in Azure

The following major runtime version values are supported:

| Value | Runtime target |
| ------ | -------- |
| `~4` | 4.x |
| `~3` | 3.x |
| `~1` | 1.x |

>[!IMPORTANT]
> Don't arbitrarily change this app setting, because other app setting changes and changes to your function code may be required. You should instead change this setting in the **Function runtime settings** tab of the function app **Configuration** in the Azure portal when you are ready to make a major version upgrade. For existing function apps, [follow the migration instructions](#migrating-existing-function-apps).

### Pinning to a specific minor version

To resolve issues your function app may have when running on the latest major version, you have to temporarily pin your app to a specific minor version. Pinning gives you time to get your app running correctly on the latest major version. The way that you pin to a minor version differs between Windows and Linux. To learn more, see [How to target Azure Functions runtime versions](set-runtime-version.md).

Older minor versions are periodically removed from Functions. For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues). 

### Pinning to version ~2.0

.NET function apps running on version 2.x (`~2`) are automatically upgraded to run on .NET Core 3.1, which is a long-term support version of .NET Core 3. Running your .NET functions on .NET Core 3.1 allows you to take advantage of the latest security updates and product enhancements. 

Any function app pinned to `~2.0` continues to run on .NET Core 2.2, which no longer receives security and other updates. To learn more, see [Functions v2.x considerations](functions-dotnet-class-library.md#functions-v2x-considerations). 

## Minimum extension versions

::: zone pivot="programming-language-csharp"
There's technically not a correlation between binding extension versions and the Functions runtime version. However, starting with version 4.x the Functions runtime enforces a minimum version for all trigger and binding extensions. 

If you receive a warning about a package not meeting a minimum required version, you should update that NuGet package to the minimum version as you normally would. The minimum version requirements for extensions used in Functions v4.x can be found in [the linked configuration file](https://github.com/Azure/azure-functions-host/blob/v4.x/src/WebJobs.Script/extensionrequirements.json).

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

## Locally developed application versions

You can make the following updates to function apps to locally change the targeted versions.

### Visual Studio runtime versions

In Visual Studio, you select the runtime version when you create a project. Azure Functions tools for Visual Studio supports the three major runtime versions. The correct version is used when debugging and publishing based on project settings. The version settings are defined in the `.csproj` file in the following properties:

# [Version 4.x](#tab/v4)

```xml
<TargetFramework>net6.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

You can also choose `net6.0`, `net7.0`, or `net48` as the target framework if you are using [.NET isolated worker process functions](dotnet-isolated-process-guide.md). Support for `net7.0` and `net48` is currently in preview.

> [!NOTE]
> Azure Functions 4.x requires the `Microsoft.NET.Sdk.Functions` extension be at least `4.0.0`.

# [Version 3.x](#tab/v3)

```xml
<TargetFramework>netcoreapp3.1</TargetFramework>
<AzureFunctionsVersion>v3</AzureFunctionsVersion>
```

You can also choose `net5.0` as the target framework if you're using [.NET isolated worker process functions](dotnet-isolated-process-guide.md).

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

### VS Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command-line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. To develop against version 4.x, install version 4.x of the Core Tools. Version 3.x development requires version 3.x of the Core Tools, and so on. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you may also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed.  This setting also updates the templates and languages used during function app creation.  To create apps in `~3`, you update the `azureFunctions.projectRuntime` user setting to `~3`.

![Azure Functions extension runtime setting](./media/functions-versions/vs-code-version-runtime.png)

## Bindings

Starting with version 2.x, the runtime uses a new [binding extensibility model](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview) that offers these advantages:

* Support for third-party binding extensions.

* Decoupling of runtime and bindings. This change allows binding extensions to be versioned and released independently. You can, for example, opt to upgrade to a version of an extension that relies on a newer version of an underlying SDK.

* A lighter execution environment, where only the bindings in use are known and loaded by the runtime.

Except for HTTP and timer triggers, all bindings must be explicitly added to the function app project, or registered in the portal. For more information, see [Register binding extensions](./functions-bindings-expressions-patterns.md).

The following table shows which bindings are supported in each runtime version.

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]

## Next steps

For more information, see the following resources:

* [Code and test Azure Functions locally](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
