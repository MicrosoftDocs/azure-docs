---
title: include file
description: include file
author: ejizba
ms.service: azure-functions
ms.topic: include
ms.date: 03/21/2023
ms.author: erijiz
ms.custom: include file
---

## Considerations

> [!NOTE]
> Version 4 of the Node.js programming model is currently in public preview.

- During preview, the v4 model requires you to set the app setting `AzureWebJobsFeatureFlags` to `EnableWorkerIndexing`. For more information, see [Enable v4 programming model](../articles/azure-functions/functions-node-upgrade-v4.md#enable-v4-programming-model).
- The Node.js "programming model" shouldn't be confused with the Azure Functions "runtime".
    - _**Programming model**_: Defines how you author your code and is specific to JavaScript and TypeScript.
    - _**Runtime**_: Defines underlying behavior of Azure Functions and is shared across all languages.
- The programming model version is strictly tied to the version of the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package, and is versioned independently of the [runtime](../articles/azure-functions/functions-versions.md). Both the runtime and the programming model use "4" as their latest major version, but that is purely a coincidence. 
- Keep in mind that you can't mix the v3 and v4 programming models in the same function app. As soon as you register one v4 function in your app, any v3 functions registered in `function.json` files are ignored.