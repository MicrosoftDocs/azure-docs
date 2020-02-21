---
title: Azure Event Grid bindings for Azure Functions
description: Understand how to handle Event Grid events in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/14/2020
ms.author: cshoe
ms.custom: fasttrack-edit
---

# Azure Event Grid bindings for Azure Functions

This reference explains how to handle [Event Grid](../event-grid/overview.md) events in Azure Functions. For details on how to handle Event Grid messages in an HTTP end point, see [Receive events to an HTTP endpoint](../event-grid/receive-events.md).

Event Grid is an Azure service that sends HTTP requests to notify you about events that happen in *publishers*. A publisher is the service or resource that originates the event. For example, an Azure blob storage account is a publisher, and [a blob upload or deletion is an event](../storage/blobs/storage-blob-event-overview.md). Some [Azure services have built-in support for publishing events to Event Grid](../event-grid/overview.md#event-sources).

Event *handlers* receive and process events. Azure Functions is one of several [Azure services that have built-in support for handling Event Grid events](../event-grid/overview.md#event-handlers). In this reference, you learn to use an Event Grid trigger to invoke a function when an event is received from Event Grid, and to use the output binding to send events to an [Event Grid custom topic](../event-grid/post-to-custom-topic.md).

If you prefer, you can use an HTTP trigger to handle Event Grid Events; see [Receive events to an HTTP endpoint](../event-grid/receive-events.md). Currently, you can't use an Event Grid trigger for an Azure Functions app when the event is delivered in the [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). Instead, use an HTTP trigger.

| Action | Type |
|---------|---------|
| Run a function when an Event Grid event is dispatched | [Trigger](./functions-bindings-event-grid-trigger.md) |
| Sends an Event Grid event |[Output binding](./functions-bindings-event-grid-output.md) |

The code in this reference defaults to .NET Core syntax, used in Functions version 2.x and higher. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

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
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid
[Update your extensions]: ./install-update-binding-extensions-manual.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

## Next steps
* [Run a function when an Event Grid event is dispatched](./functions-bindings-event-grid-trigger.md)
* [Dispatch an Event Grid event](./functions-bindings-event-grid-trigger.md)
