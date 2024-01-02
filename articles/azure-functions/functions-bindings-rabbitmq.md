---
title: Azure RabbitMQ bindings for Azure Functions
description: Learn to send Azure RabbitMQ triggers and bindings in Azure Functions.
author: cachai2
ms.assetid: 
ms.topic: reference
ms.date: 11/15/2021
ms.author: cachai
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions-lang-workers
---


# RabbitMQ bindings for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on [Premium](functions-premium-plan.md) and [Dedicated App Service](dedicated-plan.md) plans. Consumption plans aren't supported.  
> RabbitMQ bindings are only supported for Azure Functions version 3.x and later versions.
 
Azure Functions integrates with [RabbitMQ](https://www.rabbitmq.com/) via [triggers and bindings](./functions-triggers-bindings.md). The Azure Functions RabbitMQ extension allows you to send and receive messages using the RabbitMQ API with Functions.

| Action | Type |
|---------|---------|
| Run a function when a RabbitMQ message comes through the queue | [Trigger](./functions-bindings-rabbitmq-trigger.md) |
| Send RabbitMQ messages |[Output binding](./functions-bindings-rabbitmq-output.md) |

## Prerequisites

Before working with the RabbitMQ extension, you must [set up your RabbitMQ endpoint](https://github.com/Azure/azure-functions-rabbitmq-extension/wiki/Setting-up-a-RabbitMQ-Endpoint). To learn more about RabbitMQ, see the [getting started page](https://www.rabbitmq.com/getstarted.html).

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Rabbitmq).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.RabbitMQ).

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle    

The RabbitMQ extension is part of an [extension bundle], which is specified in your host.json project file. When you create a project that targets version 3.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

::: zone-end

## Next steps

- [Run a function when a RabbitMQ message is created (Trigger)](./functions-bindings-rabbitmq-trigger.md)
- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-rabbitmq-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
