---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/27/2019
ms.author: glenga
---

With the exception of HTTP and timer triggers, Functions bindings are implemented as extension packages. The easiest way to install binding extensions is to enable [extension bundles](functions-bindings-register.md#extension-bundles). With bundles enabled, a predefined set of extension packages are automatically installed.

To enable extension bundles, open the *host.json* file and update its contents to match the following code:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
    }
}
```