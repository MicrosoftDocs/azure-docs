---
title: Azure Service Bus bindings for Azure Functions
description: Learn to send Azure Service Bus triggers and bindings in Azure Functions.
author: craigshoemaker
ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 12/03/2021
ms.author: cshoe
ms.custom: fasttrack-edit
zone_pivot_groups: programming-languages-set-functions
---

# Azure Service Bus bindings for Azure Functions

Azure Functions integrates with [Azure Service Bus](https://azure.microsoft.com/services/service-bus) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Service Bus allows you to build functions that react to and send queue or topic messages.

| Action | Type |
|---------|---------|
| Run a function when a Service Bus queue or topic message is created | [Trigger](./functions-bindings-service-bus-trigger.md) |
| Send Azure Service Bus messages |[Output binding](./functions-bindings-service-bus-output.md) |

## Prerequisites


::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.RabbitMQ).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated process](dotnet-isolated-process-guide.md).

Add the extension to your project installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.servicebus).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x, or a later version.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell,programming-language-typescript"  

## Install bundle    

The Service Bus extension is part of an [extension bundle], which is specified in your *host.json* project file. When you create a project that targets version 3.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

::: zone-end

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles