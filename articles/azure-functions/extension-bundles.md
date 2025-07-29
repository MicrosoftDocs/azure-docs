---
title: Azure Functions Extension Bundles
description: Learn how to use extension bundles to make the correct set of Azure Functions trigger and binding extensions available in your non-.NET function code.
ms.topic: concept-article
ms.date: 07/25/2025

#Customer intent: I want to understand how to correctly install extension bundles so that the functionality implemented in the extensions is available to my functions in my preferred development language.
---

# Azure Functions extension bundles

This article explains how extension bundles enable your function code to use all of the [triggers and bindings that Azure Functions supports](./functions-triggers-bindings.md). You also learn about the support levels and policies for your apps when you use extension bundles.  

This article applies only to Azure Functions developers who use non-.NET languages. To learn how to add binding extensions directly to your C# function apps, see [Register Azure Functions binding extensions](functions-bindings-register.md).

## Overview

Extension bundles add a predefined set of compatible binding extensions to your function app. Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the versions of the extensions that you need in your app.

When you create an Azure Functions project from a non-.NET template, extension bundles are already enabled in the app's `host.json` file.

## Define an extension bundle reference

You define an extension bundle reference in the `host.json` project file by adding an `extensionBundle` section, as in this example:

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

<!---## Supported extension bundles

This table lists all `Microsoft.Azure.Functions.ExtensionBundle` bundle versions and the current [support state](#support-policy):

| Bundle version | Version in host.json | Support state | End-of-support date |
| --- | --- | --- | --- |
| [4.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[4.0.0, 5.0.0)` | Active | Not yet determined  |
| [3.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[3.3.0, 4.0.0)` | Deprecated | May 30, 2026 |
| [2.x](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v2/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[2.*, 3.0.0)` | Deprecated | May 30, 2026 |
| [1.x](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) | `[1.*, 2.0.0)` | Deprecated | May 30, 2026 |

The default extension bundles are defined via version ranges. To see the `extensions.json` definition file that generates the current bundle version for a major extension, select the link in the table.-->

## Considerations for extension bundles

Keep these considerations in mind when you work with extension bundles:

- When possible, you should set a `version` range value in `host.json` from the preceding table, such as `[4.0.0, 5.0.0)`, instead of defining a custom range.
- Use the latest version range to obtain optimal app performance and access to the latest features.
- In the unlikely event that you can't use an extension bundle, you must instead [explicitly install extensions](./functions-bindings-register.md#explicitly-install-extensions).

## Upgrade extension bundles

It's important to keep your bundle version up-to-date so that your apps can continue to be eligible for new features, security patches, and performance optimizations. 

To upgrade your app to the most recent bundle, edit the host.json file in the root of your app project. Replace the value of `extensionBundle.version` with the most recent supported extension bundles version.

Keep these considerations in mind when upgrading the extension bundle version used by your app:

+ The contents of the latest 4.x bundle can always be found at [this release page in the repo](https://github.com/Azure/azure-functions-extension-bundles/releases/latest).
+ Review the reference documentation for any extensions used by your app to look for any breaking changes between versions. <!---For the list of extension versions included in the default bundle, see the `extension.json` project file linked [from this table](#supported-extension-bundles).--> You can review the [bundle releases page](https://github.com/Azure/azure-functions-extension-bundles/releases) in the bundles repo for specific bundle version tags.
+ Always verify your app locally after upgrading the bundle version to ensure compatibility with the updated extensions. You can use the [func start](functions-core-tools-reference.md#func-start) command in Azure Functions Core Tools or F5 in Visual Studio or Visual Studio Code to run your function app locally.
+ The way that you trigger extensions to be updated based on changes to the bundle version in the host.json file depends on your app environment:
  + Local project: extensions are updated locally when Core Tools starts, either from the `func start` command or when debugging in your development tools.
  + Function app: extensions are updated when you deploy the updated host.json file to your function app in Azure.

## Preview extension bundles

Prerelease versions of specific binding extensions are maintained in a preview extension bundle: `Microsoft.Azure.Functions.ExtensionBundle.Preview`. You can use this preview extension bundle to take advantage of preview extensions and new behaviors in existing extensions before they reach general availability (GA).

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

## Support policy

Major version releases of extension bundles can occur when there are breaking changes or updates in the dependencies of the underlying binding extensions. These breaking changes, often introduced in Azure SDKs, require updates to the bundle to remain compatible.

The support cycle of a GA extension bundle follows these distinct phases:

| Phase | Description |
| ----- | ----- |  
| Active | The most recent major version of extension bundles is considered the active version. We recommend this version for your function apps. |
| Notification| Microsoft provides advanced notice before retiring an extension bundle or a binding extension version. When you receive such a notification, you should begin planning to upgrade your function apps to the latest version of a supported extension bundle. This upgrade helps ensure that your apps continue to access new features, performance improvements, and support. |
| Deprecation | When a new bundle version for a major extension becomes generally available, the previous version enters a 12-month deprecation phase. This overlap period gives you time to plan, test, and upgrade your apps before the previous version is retired. |
| Retirement | After the retirement of an extension bundle, function apps that reference that specific version aren't eligible for new features, security patches, and performance optimizations. Function apps that use retired versions can still be created and deployed and are permitted to run on the platform. However, you must upgrade your function app to a supported bundle version before you can receive support.|

You can view the extension bundle versions and their included extensions in the [GitHub repo for Azure Functions extension bundles](https://github.com/Azure/azure-functions-extension-bundles/releases). You can find individual .NET packages on [NuGet.org](https://nuget.org).

## Related content

- To learn more about binding extensions, see [Register Azure Functions binding extensions](functions-bindings-register.md).
