---
title: Azure Blob storage trigger and bindings for Azure Functions
description: Learn to use the Azure Blob storage trigger and bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/13/2020
ms.author: cshoe
---

# Azure Blob storage bindings for Azure Functions overview

Azure Functions integrates with [Azure Storage](https://docs.microsoft.com/azure/storage/) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Blob storage allows you to build functions that react to changes in blob data as well as read and write values.

| Action | Type |
|---------|---------|
| Run a function as blob storage data changes | [Trigger](./functions-bindings-storage-blob-trigger.md) |
| Read blob storage data in a function | [Input binding](./functions-bindings-storage-blob-input.md) |
| Allow a function to write blob storage data |[Output binding](./functions-bindings-storage-blob-output.md) |

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[Update your extensions]: ./install-update-binding-extensions-manual.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## Next steps

- [Run a function when blob storage data changes](./functions-bindings-storage-blob-trigger.md)
- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)
