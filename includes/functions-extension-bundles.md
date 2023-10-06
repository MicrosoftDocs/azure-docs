---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2022
ms.author: glenga
---

The easiest way to install binding extensions is to enable [extension bundles](../articles/azure-functions/functions-bindings-register.md#extension-bundles). When you enable bundles, a predefined set of extension packages is automatically installed.

To enable extension bundles, open the host.json file and update its contents to match the following code:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[3.*, 4.0.0)"
    }
}
```