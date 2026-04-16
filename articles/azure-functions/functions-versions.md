---
title: Compare Azure Functions Runtime Versions
description: Learn how Azure Functions supports multiple versions of the runtime, and understand the differences between them and how to choose the one that's right for you.
ms.topic: concept-article
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, ignite-2023, devx-track-ts
ms.date: 04/09/2026
zone_pivot_groups: programming-languages-set-functions
---

# Compare Azure Functions runtime versions

::: zone pivot="programming-language-csharp"
Azure Functions currently supports two versions of the runtime host. The following table details the currently supported runtime versions, their support level, and when to use them:

| Version | Support level | Description |
| --- | --- | --- |
| 4.x | GA | **_Recommended runtime version for functions in all languages._** Check out [Supported language versions](#languages). |
| 1.x | GA<sup>*</sup> | Supported only for C# apps that must use .NET Framework. This version is in maintenance mode, with enhancements provided only in later versions. **Support ends for version 1.x on September 14, 2026.** [Migrate your apps to version 4.x](migrate-version-1-version-4.md?pivots=programming-language-csharp). For more information, see [supported language versions](#languages). |

<sup>*</sup> Support ends September 14, 2026. For more information, see [the version 1.x support announcement](https://aka.ms/azure-functions-retirements/hostv1).
::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
Azure Functions currently supports only version 4.x of the runtime host. 

::: zone-end  
> [!IMPORTANT]
> Versions 2.x and 3.x of the Azure Functions runtime are no longer supported. For more information, see [Retired versions](#retired-versions).

[Migrate apps from Azure Functions version 3.x to version 4.x](migrate-version-3-version-4.md).

## Levels of support

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages

All functions in a function app must share the same language. Choose the language of functions in your function app when you create the app. The language of your function app is maintained in the [FUNCTIONS\_WORKER\_RUNTIME](functions-app-settings.md#functions_worker_runtime) setting, and can't be changed when there are existing functions. 

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For information about language versions of previously supported Functions runtime versions, see [Retired runtime versions](language-support-policy.md#language-support-related-resources).

## <a name="creating-1x-apps"></a>Run on a specific version

The [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) application setting determines the version of the Functions runtime that published apps use in Azure. In some cases and for certain languages, other settings might apply.  

By default, function apps created in the Azure portal, by the Azure CLI, or from Visual Studio tools are set to version 4.x. You can modify this version if needed. You can only downgrade the runtime version to 1.x after you create your function app but before you add any functions. You can update to a later major version even with apps that have existing functions.

### Migrate existing function apps

[!INCLUDE [functions-migrate-apps](../../includes/functions-migrate-apps.md)]
::: zone pivot="programming-language-csharp"
### Change the version of apps in Azure

The following major runtime version values are used:

| Value | Runtime target |
| ------ | -------- |
| `~4` | 4.x |
| `~1` | 1.x |

>[!IMPORTANT]
> Don't arbitrarily change this app setting, because other app setting changes and changes to your function code might be required. For existing function apps, follow the [migration instructions](#migrate-existing-function-apps).
::: zone-end  

### Pin to a specific minor version

To resolve issues that your function app could have when running on the latest major version, you must temporarily pin your app to a specific minor version. Pinning gives you time to get your app running correctly on the latest major version. The way that you pin to a minor version differs between Windows and Linux. To learn more, see [How to target Azure Functions runtime versions](set-runtime-version.md).

Older minor versions are periodically removed from Functions. For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues).

## Minimum extension versions

::: zone pivot="programming-language-csharp"
There's technically not a correlation between binding extension versions and the Functions runtime version. However, starting with version 4.x, the Functions runtime enforces a minimum version for all trigger and binding extensions. 

If you receive a warning about a package not meeting a minimum required version, you should update that NuGet package to the minimum version as you normally would. Find the minimum version requirements for extensions used in Functions v4.x in [the linked configuration file](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script/extensionrequirements.json).

For C# script, update the extension bundle reference in the *host.json*:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.0.0, 5.0.0)"
    }
}
```

::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
There's technically not a correlation between extension bundle versions and the Functions runtime version. However, starting with version 4.x, the Functions runtime enforces a minimum version for extension bundles. 

If you receive a warning about your extension bundle version not meeting a minimum required version, update your existing extension bundle reference in the *host.json* as follows:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.0.0, 5.0.0)"
    }
}
```  

To learn more about extension bundles, see [Extension bundles](extension-bundles.md).
::: zone-end

## Retired versions

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

These versions of the Functions runtime reached end of extended support on December 13, 2022.

| Version | Current support level | Previous support level |
| --- | --- | --- |
| 3.x | Out of support | GA |
| 2.x | Out of support | GA |

Migrate your apps to version 4.x as soon as possible to get full support. For a complete set of language-specific migration instructions, see [Migrate apps to Azure Functions version 4.x](migrate-version-3-version-4.md).

Apps using versions 2.x and 3.x can still be created and deployed from your CI/CD DevOps pipeline, and all existing apps continue to run without breaking changes. But your apps aren't eligible for new features, security patches, and performance optimizations. You can only get related service support after you upgrade your apps to version 4.x.

Versions 2.x and 3.x are no longer supported because .NET Core 3.1, a core dependency, reached end of support. This requirement affects all [languages supported by Azure Functions](supported-languages.md).
::: zone pivot="programming-language-csharp"
## Locally developed application versions

Make the following updates to function apps to locally change the targeted versions.

### Visual Studio runtime versions

In Visual Studio, you select the runtime version when you create a project. Azure Functions tools for Visual Studio supports the two major runtime versions. The correct version is used when debugging and publishing based on project settings. The version settings are defined in the *.csproj* file in the following properties:

#### [Version 4.x](#tab/v4)

```xml
<TargetFramework>net8.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

If you're using the [isolated worker model](dotnet-isolated-process-guide.md), you can choose, `net9.0`, `net8.0`, or `net48` as the target framework. You can also choose to use [preview support](./dotnet-isolated-process-guide.md#preview-net-versions) for `net10.0`. If you're using the [in-process model](./functions-dotnet-class-library.md), you can choose `net8.0` or `net6.0`, and you must include the `Microsoft.NET.Sdk.Functions` extension set to at least `4.4.0`. .NET 10 isn't supported by the in-process model; if you are on the in-process model and wish to use .NET 10, [migrate your app to the isolated worker model](./migrate-dotnet-to-isolated-model.md).

.NET 6 was previously supported on the isolated worker model and the in-process model, but it reached the end of official support on [November 12, 2024][dotnet-policy].

.NET 7 was previously supported on the isolated worker model but reached the end of official support on [May 14, 2024][dotnet-policy].

[dotnet-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle

#### [Version 1.x](#tab/v1)

```xml
<TargetFramework>net48</TargetFramework>
<AzureFunctionsVersion>v1</AzureFunctionsVersion>
```
---

### Visual Studio Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command-line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you might also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed. This setting also updates the templates and languages used during function app creation.
::: zone-end  

## Related content

* [Develop Azure Functions locally by using Core Tools](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
