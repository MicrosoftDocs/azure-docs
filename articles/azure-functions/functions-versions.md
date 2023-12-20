---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
ms.topic: conceptual
ms.custom:
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - ignite-2023
ms.date: 09/01/2023
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions runtime versions overview

<a name="top"></a>Azure Functions currently supports two versions of the runtime host. The following table details the currently supported runtime versions, their support level, and when they should be used:

| Version | Support level | Description |
| --- | --- | --- |
| 4.x | GA | **_Recommended runtime version for functions in all languages._** Check out [Supported language versions](#languages). |
| 1.x | GA ([support ends September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1)) | Supported only for C# apps that must use .NET Framework. This version is in maintenance mode, with enhancements provided only in later versions. **Support will end for version 1.x on September 14, 2026.** We highly recommend you [migrate your apps to version 4.x](migrate-version-1-version-4.md?pivots=programming-language-csharp), which supports .NET Framework 4.8, .NET 6, .NET 7, and .NET 8.|

> [!IMPORTANT]
> As of December 13, 2022, function apps running on versions 2.x and 3.x of the Azure Functions runtime have reached the end of life (EOL) of extended support. For more information, see [Retired versions](#retired-versions).

This article details some of the differences between supported versions, how you can create each version, and how to change the version on which your functions run.

## Levels of support

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages

All functions in a function app must share the same language. You choose the language of functions in your function app when you create the app. The language of your function app is maintained in the [FUNCTIONS\_WORKER\_RUNTIME](functions-app-settings.md#functions_worker_runtime) setting, and shouldn't be changed when there are existing functions. 

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For information about the language versions of previously supported versions of the Functions runtime, see [Retired runtime versions](language-support-policy.md#retired-runtime-versions).

## <a name="creating-1x-apps"></a>Run on a specific version

The version of the Functions runtime used by published apps in Azure is dictated by the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) application setting. In some cases and for certain languages, other settings can apply.  

By default, function apps created in the Azure portal, by the Azure CLI, or from Visual Studio tools are set to version 4.x. You can modify this version if needed. You can only downgrade the runtime version to 1.x after you create your function app but before you add any functions. Moving to a later version is allowed even with apps that have existing functions. 

### Migrating existing function apps

When your app has existing functions, you must take precautions before moving to a later runtime version. The following articles detail breaking changes between versions, including language-specific breaking changes. They also provide you with step-by-step instructions for a successful migration of your existing function app. 

+ [Migrate from runtime version 3.x to version 4.x](./migrate-version-3-version-4.md) 
+ [Migrate from runtime version 1.x to version 4.x](./migrate-version-1-version-4.md)

### Changing version of apps in Azure

The following major runtime version values are used:

| Value | Runtime target |
| ------ | -------- |
| `~4` | 4.x |
| `~1` | 1.x |

>[!IMPORTANT]
> Don't arbitrarily change this app setting, because other app setting changes and changes to your function code might be required. You should instead change this setting in the **Function runtime settings** tab of the function app **Configuration** in the Azure portal when you are ready to make a major version upgrade. For existing function apps, [follow the migration instructions](#migrating-existing-function-apps).

### Pinning to a specific minor version

To resolve issues your function app could have when running on the latest major version, you have to temporarily pin your app to a specific minor version. Pinning gives you time to get your app running correctly on the latest major version. The way that you pin to a minor version differs between Windows and Linux. To learn more, see [How to target Azure Functions runtime versions](set-runtime-version.md).

Older minor versions are periodically removed from Functions. For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues). 

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

## Retired versions

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

These versions of the Functions runtime reached the end of life (EOL) for extended support on December 13, 2022. 

| Version | Current support level | Previous support level |
| --- | --- | --- |
| 3.x | Out-of-support |GA | 
| 2.x | Out-of-support | GA |

As soon as possible, you should migrate your apps to version 4.x to obtain full support. For a complete set of language-specific migration instructions, see [Migrate apps to Azure Functions version 4.x](migrate-version-3-version-4.md).

Apps using versions 2.x and 3.x can still be created and deployed from your CI/CD DevOps pipeline, and all existing apps continue to run without breaking changes. However, your apps aren't eligible for new features, security patches, and performance optimizations. You can only get related service support after you upgrade your apps to version 4.x.

End of support for versions 2.x and 3.x is due to the end of support for .NET Core 3.1, which they had as a core dependency. This requirement affects all [languages supported by Azure Functions](supported-languages.md).

## Locally developed application versions

You can make the following updates to function apps to locally change the targeted versions.

### Visual Studio runtime versions

In Visual Studio, you select the runtime version when you create a project. Azure Functions tools for Visual Studio supports the two major runtime versions. The correct version is used when debugging and publishing based on project settings. The version settings are defined in the `.csproj` file in the following properties:

# [Version 4.x](#tab/v4)

```xml
<TargetFramework>net6.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

You can also choose `net6.0`, `net7.0`, `net8.0`, or `net48` as the target framework if you are using [.NET isolated worker process functions](dotnet-isolated-process-guide.md).

> [!NOTE]
> Azure Functions 4.x requires the `Microsoft.NET.Sdk.Functions` extension be at least `4.0.0`.

# [Version 1.x](#tab/v1)

```xml
<TargetFramework>net48</TargetFramework>
<AzureFunctionsVersion>v1</AzureFunctionsVersion>
```
---

### Visual Studio Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command-line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you could also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed.  This setting also updates the templates and languages used during function app creation. 

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
