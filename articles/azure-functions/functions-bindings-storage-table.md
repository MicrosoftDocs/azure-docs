---
title: Azure Table storage bindings for Azure Functions
description: Understand how to use Azure Table storage bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 09/03/2018
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
---
# Azure Table storage bindings for Azure Functions

Azure Functions integrates with [Azure Storage](../storage/index.yml) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Table storage allows you to build functions that read and write Table storage data.

| Action | Type |
|---------|---------|
| Read table storage data in a function | [Input binding](./functions-bindings-storage-table-input.md) |
| Allow a function to write table storage data |[Output binding](./functions-bindings-storage-table-output.md) |

## Packages - Functions 2.x and higher

The Table storage bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/dev/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Packages - Functions 1.x

The Table storage bindings are provided in the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/v2.x/src/Microsoft.Azure.WebJobs.Storage/Table) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## Next steps

- [Read table storage data when a function runs](./functions-bindings-storage-table-input.md)
- [Write table storage data from a function](./functions-bindings-storage-table-output.md)
