---
title: Azure RabbitMQ bindings for Azure Functions
description: Learn to send Azure RabbitMQ triggers and bindings in Azure Functions.
ms.topic: reference
ms.date: 08/20/2025
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions-lang-workers
---


# RabbitMQ bindings for Azure Functions overview

Azure Functions integrates with [RabbitMQ](https://www.rabbitmq.com/) via [triggers and bindings](./functions-triggers-bindings.md). 

[!INCLUDE [functions-rabbitmq-plans-support-note](../../includes/functions-rabbitmq-plans-support-note.md)]

The Azure Functions RabbitMQ extension allows you to send and receive messages using the RabbitMQ API with Functions.

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

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.RabbitMQ).

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  
[!INCLUDE [functions-install-extension-bundle](../../includes/functions-install-extension-bundle.md)]
::: zone-end
## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

```json
{
    "version": "2.0",
    "extensions": {
        "rabbitMQ": {
            "prefetchCount": 100,
            "queueName": "queue",
            "connectionString": "%<MyConnectionAppSetting>%",
            "port": 10
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|`prefetchCount`|30|Gets or sets the number of messages that the message receiver can simultaneously request and is cached.|
|`queueName`|n/a| Name of the queue to receive messages from.|
|`connectionString`|n/a|The app setting that contains the RabbitMQ message queue connection string. |
|`port`|0|(ignored if using connectionString) Gets or sets the Port used. Defaults to 0, which points to rabbitmq client's default port setting: 5672.|

## Related articles

- [Run a function when a RabbitMQ message is created (Trigger)](./functions-bindings-rabbitmq-trigger.md)
- [Send RabbitMQ messages from Azure Functions (Output binding)](./functions-bindings-rabbitmq-output.md)
