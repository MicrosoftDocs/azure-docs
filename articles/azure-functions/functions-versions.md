---
title: Compare Azure Functions Runtime Versions
description: Learn how Azure Functions supports multiple versions of the runtime, and understand the differences between them and how to choose the one that's right for you.
ms.topic: concept-article
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, ignite-2023, devx-track-ts
ms.date: 09/15/2026
zone_pivot_groups: programming-languages-set-functions
---

# Compare Azure Functions runtime versions

Azure Functions currently supports only version 4.x of the runtime host.

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

Versions 2.x and 3.x of the Azure Functions runtime are also no longer supported. For more information, see [Retired versions](#retired-versions).

[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

[Migrate apps from Azure Functions version 3.x to version 4.x](migrate-version-3-version-4.md).

## Levels of support

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages

All functions in a function app must share the same language. Choose the language of functions in your function app when you create the app. The language of your function app is maintained in the [FUNCTIONS\_WORKER\_RUNTIME](functions-app-settings.md#functions_worker_runtime) setting, and can't be changed when there are existing functions. 

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For information about language versions of previously supported Functions runtime versions, see [Retired runtime versions](language-support-policy.md#language-support-related-resources).

## Run on a specific version

The [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) application setting determines the version of the Functions runtime that published apps use in Azure. In some cases and for certain languages, other settings might apply.  

By default, function apps created in the Azure portal, by the Azure CLI, or from Visual Studio tools are set to version 4.x. If an existing app uses an earlier runtime version, migrate it to version 4.x.

### Migrate existing function apps

[!INCLUDE [functions-migrate-apps](../../includes/functions-migrate-apps.md)]
> [!IMPORTANT]
> Don't arbitrarily change the `FUNCTIONS_EXTENSION_VERSION` setting. Other app settings and your function code might also need to change. For existing function apps, follow the [migration instructions](#migrate-existing-function-apps).

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

For historical runtime 1.x behavior and reference resources, see the [runtime 1.x legacy reference](functions-runtime-1x-legacy.md).

These versions of the Functions runtime reached end of extended support on December 13, 2022.

| Version | Current support level | Previous support level |
| --- | --- | --- |
| 3.x | Out of support | GA |
| 2.x | Out of support | GA |

Migrate your apps to version 4.x as soon as possible to get full support. For a complete set of language-specific migration instructions, see [Migrate apps to Azure Functions version 4.x](migrate-version-3-version-4.md).

Apps using versions 2.x and 3.x can still be created and deployed from your CI/CD DevOps pipeline, and existing apps continue to run without breaking changes, except for v3 apps on Linux Consumption, which [will stop running after September 30, 2026](#retired-versions). Your apps aren't eligible for new features, security patches, and performance optimizations. You can only get related service support after you upgrade your apps to version 4.x.
::: zone pivot="programming-language-csharp"
## Locally developed application versions

Make the following updates to function apps to locally change the targeted versions.

### Visual Studio projects

Visual Studio creates Azure Functions projects that target runtime version 4.x. The project settings determine the runtime used for debugging and publishing. The following properties in the *.csproj* file define the target framework and Functions runtime version:

```xml
<TargetFramework>net8.0</TargetFramework>
<AzureFunctionsVersion>v4</AzureFunctionsVersion>
```

If you're using the [isolated worker model](dotnet-isolated-process-guide.md), you can choose `net10.0`, `net9.0`, `net8.0`, or `net48` as the target framework. .NET 10 requires version 2.50.0 or later of the `Microsoft.Azure.Functions.Worker` NuGet package, and you can't run .NET 10 apps on Linux in the Consumption plan. For more information, see [Supported versions](./dotnet-isolated-process-guide.md#supported-versions). If you're using the [in-process model](./functions-dotnet-class-library.md), you can choose `net8.0`, and you must include the `Microsoft.NET.Sdk.Functions` extension set to at least `4.4.0`. .NET 10 isn't supported by the in-process model, and support for the in-process model ends on November 10, 2026. For continued full support, you should [migrate your app to the isolated worker model](./migrate-dotnet-to-isolated-model.md).

.NET 6 was previously supported on the isolated worker model and the in-process model, but it reached the end of official support on [November 12, 2024][dotnet-policy].

.NET 7 was previously supported on the isolated worker model but reached the end of official support on [May 14, 2024][dotnet-policy].

[dotnet-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle

### Visual Studio Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command-line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you might also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed. This setting also updates the templates and languages used during function app creation.
::: zone-end  

::: zone pivot="programming-language-go"
Go support is currently in public preview and requires Azure Functions runtime 4.x. For version requirements, see the [Go developer reference](functions-reference-go.md#prerequisites).
::: zone-end

## Related content

* [Develop Azure Functions locally by using Core Tools](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
