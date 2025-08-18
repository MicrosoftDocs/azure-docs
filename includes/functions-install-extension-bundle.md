---
ms.service: azure-functions
ms.topic: include
ms.date: 08/08/2025
author: ggailey777
ms.author: glenga
---
 
## Install bundle

To be able to use this binding extension in your app, make sure that the *host.json* file in the root of your project contains this `extensionBundle` reference:

[!INCLUDE [functions-extension-bundles-json-v4](./functions-extension-bundles-json-v4.md)]

When possible, you should use the latest extension bundle major version and allow the runtime to automatically maintain the latest minor version. You can view the contents of the latest bundle on the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases/latest). 

If your app requires you to use a previous extension version, you might need to instead specify a previous bundle version. You can [review the bundle releases](https://github.com/Azure/azure-functions-extension-bundles/releases) to locate a bundle that contains a version of this extension that can be used by your app. For more information, see [Azure Functions extension bundles](../articles/azure-functions/extension-bundles.md).
::: zone-end