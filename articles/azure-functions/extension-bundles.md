---
title: Azure Functions extension bundles
description: Learn how to use extension bundles to make the correct set of Azure Functions trigger and binding extensions available in your non-.NET function code.
ms.topic: concept-article
ms.date: 05/30/2025

#Customer intent: I want to understand how to correctly install extension bundles so that the functionality implemented in the extensions are available to my functions in my preferred development language.
---

# Azure Functions extension bundles

This article explains how extension bundles enable your function code use all of the [triggers and bindings supported by Azure Functions](./functions-triggers-bindings.md). You also learn about the various support levels and policies for your apps when using extension bundles.  

This article applies only to Azure Functions developers using non-.NET languages. To learn how to add binding extensions directly to your C# function apps, see [Register Azure Functions binding extensions](functions-bindings-register.md). 

## Overview

Extension bundles adds a predefined set of compatible binding extensions to your function app. Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the versions of the extensions that you need in your app.

When you create an Azure Functions project from a non-.NET template, extension bundles are already enabled in the app's *host.json* file. 

## Define an extension bundle reference

You define an extension bundle reference in the *host.json* project file by adding an `extensionBundle` section, as in this example: 

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

## Supported extension bundles

This table lists the default `Microsoft.Azure.Functions.ExtensionBundle` bundles that are currently GA.

| Bundle version | Version in host.json | Included extensions |
| --- | --- | --- |
| 4.x | `[4.0.0, 5.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 3.x | `[3.3.0, 4.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 2.x | `[2.*, 3.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v2/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 1.x | `[1.*, 2.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |

The default extension bundles are defined using version ranges, and this table links to the extension definitions for the bundle. For more information, see [Support policy](#support-policy). 

## Extension bundles considerations

Keep these considerations in mind when working with extension bundles:

+ When possible, you should set a `version` range value in *host.json* from this table, such as `[4.0.0, 5.0.0)`, instead of defining a custom range. 
+ Use the latest version range to obtain optimal app performance and access to the latest features. 
+ In the unlikely event you can't use an extension bundle, you must instead [explicitly install extensions](./functions-bindings-register.md#explicitly-install-extensions).

## Preview extension bundles

Prerelease versions of specific binding extensions are made maintained in a preview extension bundle. This preview extension bundle, which has an ID of `Microsoft.Azure.Functions.ExtensionBundle.Preview`, allow you to take advantage of new extension behaviors before they're declared as GA. 

Keep these considerations in mind when choosing to use a non-GA extension bundle:

+ Preview bundles can include features that are still under development and not yet ready for production use. They're intended for evaluation and testing in nonproduction environments.
+ Breaking changes occur between preview versions without prior notice, which can include changes to:
    + Trigger and binding definitions
    + Extensions included in the preview
    + Performance characteristics and stability 
+ Security updates might require you to upgrade versions.
+ You must completely test preview bundles in nonproduction environments and avoid using preview bundles in production. When you must use a preview bundle in production, take these extra precautions:
    + Pin your bundle to a specific well-tested bundle version instead of to a range. Pinning prevents automatic upgrading of your bundle version before you have a chance to verify the update in a nonproduction environment. 
    + Move your app to using a GA bundle version as soon as the functionality becomes available in a fully supported bundle release.
+ To stay informed about bundle updates, including moving from preview to GA, you should: 
    + Monitor preview bundle version releases on the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases). - Releases · Azure/azure-functions-extension-bundles
    + Monitor [extension specific reference documentation](./functions-triggers-bindings.md).
    + Review the NuGet package versions of specific preview extensions you're using. 
    + Track significant updates or changes on the change logs published on NuGet.org for each preview extension.

## Support policy 

Major version releases of extension bundles can occur when there are breaking changes or updates in the dependencies of the underlying binding extensions. These breaking changes, often introduced in Azure SDKs, require updates to the bundle to remain compatible.  

Each major version of an extension bundle is supported for a minimum of 12 months after the next major version is released. This overlap period gives you time to plan, test, and upgrade your apps before the previous version is retired. 

You can view the extension bundle versions and their included extensions in the [Azure Functions Extension Bundles GitHub repo](https://github.com/Azure/azure-functions-extension-bundles/releases). Individual .NET packages can be found on [https://nuget.org](https://nuget.org). 

### Notification phase 

Microsoft provides advance notice before retiring an extension bundle or binding extension version. When you receive such a notification, you should begin planning to upgrade your function apps to a latest supported extension bundle version. This upgrade ensures that your apps continue to access new features, performance improvements, and support. 

### Retirement phase 

After the retirement of an extension bundle or binding extension version, function apps that use retired versions can still be created and deployed and continue to run on the platform. However, your function apps aren’t eligible for new features, security patches, and performance optimizations until you upgrade them to use a supported extension bundle version. You must upgrade your functions apps to a supported bundle version before you can receive support.  

### Bundle version support state 

This table shows the major versions of GA bundles and their current lifecycle state: 

| Bundle Version | State      | End of Support Date |
|----------------|------------|---------------------|
| 4.x            | Supported  | Not yet determined  |
| 3.x            | Deprecated | 05/30/2026          |
| 2.x            | Deprecated | 05/30/2026          |
| 1.x            | Deprecated | 05/30/2026          |

## Related articles

To learn more about binding extensions, see [Register Azure Functions binding extensions](functions-bindings-register.md).
