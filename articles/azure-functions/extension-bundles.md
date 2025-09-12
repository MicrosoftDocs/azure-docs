---
title: Azure Functions Extension Bundles
description: Learn how to use extension bundles to make the correct set of Azure Functions trigger and binding extensions available in your non-.NET function code.
ms.topic: concept-article
ms.date: 08/26/2025

#Customer intent: I want to understand how to correctly install extension bundles so that the functionality implemented in the extensions is available to my functions in my preferred development language.
---

# Azure Functions extension bundles

This article explains how extension bundles enable your function code to use all of the [triggers and bindings that Azure Functions supports](./functions-triggers-bindings.md). You also learn about the support levels and policies for your apps when you use extension bundles.  

This article applies only to Azure Functions developers who use non-.NET languages. To learn how to add binding extensions directly to your C# function apps, see [Register Azure Functions binding extensions](functions-bindings-register.md).

## Overview

Extension bundles add a predefined set of compatible binding extensions to your function app. A bundle contains all of the binding extensions currently supported by Functions. Extension bundles are versioned. Each version contains a specific set of binding extension versions that are verified to work together. 

You should always use the latest bundle version in your app, when possible.

When you create an Azure Functions project from a non-.NET template, extension bundles are already enabled in the app's `host.json` file.

## Define an extension bundle reference

You define an extension bundle reference in the `host.json` project file by adding an `extensionBundle` section, as in this example:

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

## Bundle versions

This table lists all `Microsoft.Azure.Functions.ExtensionBundle` versions and the current [support state](#extension-bundles-support-policy):

| Bundle version | Version in host.json | Support state<sup>*</sup> | 
| --- | --- | --- | 
| [4.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[4.0.0, 5.0.0)`<br>`[4.*, 5.0.0)` | Active | 
| [3.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[3.3.0, 4.0.0)` | Deprecated | 
| [2.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v2/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[2.*, 3.0.0)` | Deprecated | 
| [1.x](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[1.*, 2.0.0)` | Deprecated |

<sup>*</sup> Deprecated bundle versions can include deprecated binding extension versions. For optimal supportability and reliability, you should [upgrade to bundle version 4.x](#upgrade-extension-bundles). 

By default, extension bundles are defined via version ranges, which guarantees that the latest minor bundle version is used. Select a version link in the table to review the `extensions.json` file that defines the latest bundle for that major version.

## Considerations for extension bundles

Keep these considerations in mind when you work with extension bundles:

- When possible, you should set a `version` range value in `host.json` from the preceding table, such as `[4.0.0, 5.0.0)`, instead of defining a custom range.
- Use the latest version range to obtain optimal app performance and access to the latest features.
- In the unlikely event that you can't use an extension bundle, you must instead [explicitly install extensions](./functions-bindings-register.md#explicitly-install-extensions).
- When updating the extensions used by a deployed app, Functions downloads new extension versions from the `cdn.functions.azure.com` endpoint. For extension updates to succeed, the `cdn.functions.azure.com` endpoint must be accessible to your function app. 

## Upgrade extension bundles

It's important to keep your bundle version up-to-date so that your apps can continue to be eligible for new features, security patches, and performance optimizations. 

To upgrade your app to the most recent bundle, edit the host.json file in the root of your app project. Set the value of `extensionBundle.version` to `[4.0.0,5.0.0)`, which should look like this in your host.json file:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.0.0, 5.0.0)"
    }
}
```

Keep these considerations in mind when upgrading the extension bundle version used by your app:

+ The contents of the latest 4.x bundle can always be found at [this release page in the repo](https://github.com/Azure/azure-functions-extension-bundles/releases/latest).
+ Review the reference documentation for any extensions used by your app to look for any breaking changes between versions. For the list of extension versions included in the default bundle, see the `extension.json` project file linked [from this table](#bundle-versions). You can review the [bundle releases page](https://github.com/Azure/azure-functions-extension-bundles/releases) in the bundles repo for specific bundle version tags.
+ Always verify your app locally after upgrading the bundle version to ensure compatibility with the updated extensions. You can use the [func start](functions-core-tools-reference.md#func-start) command in Azure Functions Core Tools or F5 in Visual Studio or Visual Studio Code to run your function app locally.
+ The way that you trigger extensions to be updated based on changes to the bundle version in the host.json file depends on your app environment:
  + Local project: extensions are updated locally when Core Tools starts, either from the `func start` command or when debugging in your development tools.
  + Function app: extensions are updated when you deploy the updated host.json file to your function app in Azure.

## Extension bundles support policy

Major version releases of an extension bundle can occur when there are breaking change updates in one of the contained binding extensions. These extension breaking changes require updates to the bundle to remain compatible with the underlying Azure SDKs. Upgrading the bundle ensures your apps continue to receive new features, performance improvements, and full product support.

> [!NOTE]  
> Because extension bundle updates are driven by updates in the underlying Azure SDKs, the support cycle for extension bundles generally follows the [support policies of the underlying Azure SDKs](https://azure.github.io/azure-sdk/policies_support.html).  
>  
> Microsoft notifies you when an extension bundle or a binding extension version is deprecated. These notifications might appear in different parts of your Functions experience, such as in host logs, Application Insights tables, or the Azure portal. When you encounter these notifications, you must start the process of planning for and upgrading your function apps to the latest supported extension bundle version. 

The support cycle of extension bundles follows these distinct phases: 

| Phase | Description |
| ----- | ----- |  
| **Preview** |Prerelease versions of specific binding extensions are maintained in a preview extension bundle (`Microsoft.Azure.Functions.ExtensionBundle.Preview`). You can use this preview extension bundle to take advantage of preview extensions and new behaviors in existing extensions before they reach general availability (GA). For more information, see [Work with preview extension bundles](#work-with-preview-extension-bundles). | 
| **Active** | The most recent major version of extension bundles is considered to be the active version. We recommend this version for your function apps. |
| **Deprecation** | The bundle version is superseded by a more recent release and is now deprecated. After a bundle is deprecated, it only receives critical bug fixes and security updates for a limited overlap period. This overlap is typically at least 12 months, which gives you time to plan, test, and upgrade your apps to the latest bundle version.<br/><br/>Function apps that continue to use a deprecated bundle can still run on the platform. However, to ensure access to new features, performance improvements, security patches, and full support, you must upgrade your function apps to a supported bundle version. |

You can view the extension bundle versions and their included extensions in the [Azure Functions extension bundles repository](https://github.com/Azure/azure-functions-extension-bundles/releases). You can also view the Azure SDK releases page for an inventory of all Functions extensions. You can find individual .NET packages on [NuGet.org](https://nuget.org/). 

## Work with preview extension bundles

Keep these considerations in mind when you choose to use a non-GA extension bundle:

- Preview bundles can include features that are still under development and not yet ready for production use. They're intended for evaluation and testing in nonproduction environments.
- Breaking changes occur between preview versions without prior notice. They can include changes to:
  - Trigger and binding definitions.
  - Extensions included in the preview.
  - Performance characteristics and stability.
- Security updates might require you to upgrade versions.
- You must completely test preview bundles in nonproduction environments and avoid using preview bundles in production. When you must use a preview bundle in production, take these extra precautions:
  - Pin your bundle to a specific, well-tested bundle version instead of to a range. Pinning prevents automatic upgrading of your bundle version before you have a chance to verify the update in a nonproduction environment.
  - Move your app to using a GA bundle version as soon as the functionality becomes available in a fully supported bundle release.
- To stay informed about bundle updates, including moving from preview to GA, you should:
  - Monitor releases of preview bundle versions on the [release page for extension bundles](https://github.com/Azure/azure-functions-extension-bundles/releases).
  - Monitor [extension-specific reference documentation](./functions-triggers-bindings.md).
  - Review the NuGet package versions of specific preview extensions that you're using.
  - Track significant updates or changes in the change logs published on NuGet.org for each preview extension.

## Related content

- To learn more about binding extensions, see [Register Azure Functions binding extensions](functions-bindings-register.md).
