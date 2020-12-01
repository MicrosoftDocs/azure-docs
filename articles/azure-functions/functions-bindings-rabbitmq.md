---
title: Azure RabbitMQ bindings for Azure Functions
description: Learn to send Azure RabbitMQ triggers and bindings in Azure Functions.
author: carychai

ms.assetid: 
ms.topic: reference
ms.date: 02/19/2020
ms.author: cshoe
ms.custom: fasttrack-edit
//*******WHAT DO I PUT HERE? ASK GLENN AND CRAIG******
---

# Azure Service Bus bindings for Azure Functions

Azure Functions integrates with [RabbitMQ](https://www.rabbitmq.com/) via [triggers and bindings](./functions-triggers-bindings.md). The Azure Functions RabbitMQ Binding extensions allows you to send and receive messages using the RabbitMQ API with Functions.

| Action | Type |
|---------|---------|
| Run a function when a RabbitMQ message comes through the queue | [Trigger](./functions-bindings-rabbitmq-trigger.md) |
| Send RabbitMQ messages |[Output binding](./functions-bindings-rabbitmq-output.md) |

## Add to your Functions app

> [!NOTE]
> The RabbitMQ binding doesn't currently support authentication using a managed identity. Instead, please use a [RabbitMQ shared access signature](../service-bus-messaging/service-bus-authentication-and-authorization.md#shared-access-signature).

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 4.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus/
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)