---
title: Azure Service Bus bindings for Azure Functions
description: Understand how to use Azure Service Bus triggers and bindings in Azure Functions.
author: craigshoemaker

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 04/01/2017
ms.author: cshoe
---

# Azure Service Bus bindings for Azure Functions

Azure Functions integrates with [Azure Storage](https://docs.microsoft.com/azure/storage/) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Blob storage allows you to build functions that react to changes in blob data as well as read and write values.

| Action | Type |
|---------|---------|
| Run a function when messages in a Service Bus queue or topic is created | [Trigger](./functions-bindings-storage-service-bus-trigger.md) |
| Allow a function to create Service Bus messages |[Output binding](./functions-bindings-storage-service-bus-output.md) |

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./install-update-binding-extensions-manual.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## Next steps

- [Run a function when messages in a Service Bus queue or topic is created (Trigger)](./functions-bindings-storage-service-bus-trigger.md)
- [Allow a function to create Service Bus messages (Output binding)](./functions-bindings-storage-service-bus-output.md)
