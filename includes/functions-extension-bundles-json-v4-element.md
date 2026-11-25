---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/01/2026
ms.author: glenga
---

Your project is configured to use [extension bundles](../articles/azure-functions/extension-bundles.md), which automatically install a predefined set of extension packages.  

You enable extension bundles in the *host.json* file at the root of the project. This file should contain the following `extensionBundle` element:

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model/host.json":::
