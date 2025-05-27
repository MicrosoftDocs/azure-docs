---
title: Azure Functions Extension Bundles stack support policy
description: Learn about the support policy for the Extension Bundles that Azure Functions supports.
ms.topic: conceptual
ms.date: 05/27/2025
---


# Azure Functions Extension Bundles Support Policy

This article explains Azure functions extension bundles support policy. 

## Support policy 

Azure Functions creates NuGet packages for .NET apps and extension bundles for non-.NET languages to provide access to extensions that enhance the capabilities of your functions apps. Major version upgrades of extension bundles may occur when there are breaking changes or updates in underlying dependencies. In some cases, this may be due to breaking changes introduced in the Azure SDKs, which require updates to the bundle to remain compatible.  

Each major version of an extension bundle is supported for a minimum of 12 months after the next major version is released. This gives you time to plan, test, and upgrade your apps before the previous version is retired. You can view the extension bundle versions and their included extensions in the [Azure Functions Extension Bundles GitHub repo](https://github.com/Azure/azure-functions-extension-bundles/releases). Individual .NET packages can be found on [https://nuget.org](https://nuget.org). 

## Notification phase 

Microsoft will provide advance notification before retiring a package/extension bundle version. When you receive this notification, you should begin planning to upgrade your function apps to a latest supported extension bundle version to ensure continued access to new features, performance improvements, and support. 

## Retirement phase 

After the retirement of a package/extension bundle version, function apps that use retired packages/extension bundle versions can still be created and deployed, and they continue to run on the platform. However, the retired packages/bundle version aren’t eligible for new features, security patches, and performance optimizations until you upgrade them to a supported extension bundle version. Additionally, functions apps using a retired extension bundle will need to be upgraded before receiving support. 

# Preview Bundles

Preview bundles offer early access to Azure Functions extensions that are still in development. They are intended for evaluation and testing in non-production environments. These bundles may change without notice - functionality, bindings, or triggers can shift between versions, and performance or stability may vary. It's important to move to a Generally Available bundle version as soon as the needed features are available.
To stay informed about what’s transitioning from preview to GA, monitor the [bundle release notes](https://github.com/Azure/azure-functions-extension-bundles/releases), extension documentation, and NuGet changelogs.

# Bundle version state 

This table shows the major bundle versions and their current lifecycle state: 

| Bundle Version | State      | End of Support Date |
|----------------|------------|---------------------|
| 4.x            | Supported  | TBD                 |
| 3.x            | Deprecated | 30/05/2026          |
| 2.x            | Deprecated | 30/05/2026          |
| 1.x            | Deprecated | 30/05/2026          |

## Next steps 

To learn more about how to upgrade your extension bundle versions, see [Migrating extension bundle version](https://learn.microsoft.com/en-us/azure/azure-functions/migrating-extension-bundle-version)
