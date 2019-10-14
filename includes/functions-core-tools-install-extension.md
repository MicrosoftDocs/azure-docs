---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/25/2019
ms.author: glenga
ms.custom: include file
---

## Register extensions

With the exception of HTTP and timer triggers, Functions bindings in runtime version 2.x are implemented as extension packages. In version 2.x of the Azure Functions runtime, you have to explicitly register the extensions for the binding types used in your functions. The exceptions to this are HTTP bindings and timer triggers, which do not require extensions.

You can choose to install binding extensions individually, or you can add an extension bundle reference to the host.json project file. Extension bundles removes the chance of having package compatibility issues when using multiple binding types. It is the recommended approach for registering binding extensions. Extension bundles also removes the requirement of installing the .NET Core 2.x SDK. 

### Extension bundles

[!INCLUDE [Register extensions](functions-extension-bundles.md)]

To learn more, see [Register Azure Functions binding extensions](../articles/azure-functions/functions-bindings-register.md#extension-bundles). You should add extension bundles to the host.json before you add bindings to the functions.json file.

### Register individual extensions

If you need to install extensions that aren't in a bundle, you can manually register individual extension packages for specific bindings. 

> [!NOTE]
> To manually register extensions by using `func extensions install`, you must have the .NET Core 2.x SDK installed.

After you have updated your *function.json* file to include all the bindings that your function needs, run the following command in the project folder.

```bash
func extensions install
```

The command reads the *function.json* file to see which packages you need, installs them, and rebuilds the extensions project. It adds any new bindings at the current version but does not update existing bindings. Use the `--force` option to update existing bindings to the latest version when installing new ones.