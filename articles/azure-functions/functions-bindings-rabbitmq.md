---
title: Azure RabbitMQ bindings for Azure Functions
description: Learn to send Azure RabbitMQ triggers and bindings in Azure Functions.
author: cachai2

ms.assetid: 
ms.topic: reference
ms.date: 12/17/2020
ms.author: cachai
ms.custom:
---

# RabbitMQ bindings for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Premium and Dedicated** plans. Consumption is not supported.

Azure Functions integrates with [RabbitMQ](https://www.rabbitmq.com/) via [triggers and bindings](./functions-triggers-bindings.md). The Azure Functions RabbitMQ extension allows you to send and receive messages using the RabbitMQ API with Functions.

| Action | Type |
|---------|---------|
| Run a function when a RabbitMQ message comes through the queue | [Trigger](./functions-bindings-rabbitmq-trigger.md) |
| Send RabbitMQ messages |[Output binding](./functions-bindings-rabbitmq-output.md) |

## Add to your Functions app

To get started with developing with this extension, make sure you first [set up a RabbitMQ endpoint](https://github.com/Azure/azure-functions-rabbitmq-extension/wiki/Setting-up-a-RabbitMQ-Endpoint). To learn more about RabbitMQ, check out their [getting started page](https://www.rabbitmq.com/getstarted.html).

### Functions 3.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 4.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.RabbitMQ
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x and 2.x

RabbitMQ Binding extensions are not supported for Functions 1.x and 2.x. Please use Functions 3.x and higher.

## Next steps

- [Run a function when a RabbitMQ message is created (Trigger)](./functions-bindings-rabbitmq-trigger.md)
- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-rabbitmq-output.md)