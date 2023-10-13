---
title: Apache Kafka bindings for Azure Functions
description: Learn to integrate Azure Functions with an Apache Kafka stream.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 01/12/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka bindings for Azure Functions overview

The Kafka extension for Azure Functions lets you write values out to [Apache Kafka](https://kafka.apache.org/) topics by using an output binding. You can also use a trigger to invoke your functions in response to messages in Kafka topics. 

> [!IMPORTANT]
> Kafka bindings are only available for Functions on the [Elastic Premium Plan](functions-premium-plan.md) and [Dedicated (App Service) plan](dedicated-plan.md). They are only supported on version 3.x and later version of the Functions runtime.

| Action | Type |
|---------|---------|
| Run a function based on a new Kafka event. | [Trigger](./functions-bindings-kafka-trigger.md) |
| Write to the Kafka event stream.  |[Output binding](./functions-bindings-kafka-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka).


# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Kafka).


---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle    

The Kafka extension is part of an [extension bundle], which is specified in your host.json project file. When you create a project that targets Functions version 3.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

::: zone-end

## Enable runtime scaling

To allow your functions to scale properly on the Premium plan when using Kafka triggers and bindings, you need to enable runtime scale monitoring. 

[!INCLUDE [functions-runtime-scaling](../../includes/functions-runtime-scaling.md)]


## host.json settings

This section describes the configuration settings available for this binding in versions 3.x and higher. Settings in the host.json file apply to all functions in a function app instance. For more information about function app configuration settings in versions 3.x and later versions, see the [host.json reference for Azure Functions](functions-host-json.md).

```json
{
    "version": "2.0",
    "extensions": {
        "kafka": {
            "maxBatchSize": 64,
            "SubscriberIntervalInSeconds": 1,
            "ExecutorChannelCapacity": 1,
            "ChannelFullRetryIntervalInMs": 50
        }
    }
}

```

|Property  |Default | Type | Description |
|---------|---------|---------| ---- |
| ChannelFullRetryIntervalInMs | 50 | Trigger | Defines the subscriber retry interval, in milliseconds, used when attempting to add items to an at-capacity channel. | 
| ExecutorChannelCapacity | 1| Both| Defines the channel message capacity. Once capacity is reached, the Kafka subscriber pauses until the function catches up. |
| MaxBatchSize | 64 | Trigger | Maximum batch size when calling a Kafka triggered function. | 
| SubscriberIntervalInSeconds | 1 | Trigger | Defines the minimum frequency incoming messages are executed, per function in seconds. Only when the message volume is less than `MaxBatchSize` / `SubscriberIntervalInSeconds`| 

The following properties, which are inherited from the [Apache Kafka C/C++ client library](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md), are also supported in the `kafka` section of host.json, for either triggers or both output bindings and triggers:

|Property  | Applies to | librdkafka equivalent |
|---------|---------|---------| 
| AutoCommitIntervalMs	| Trigger | `auto.commit.interval.ms` |
| AutoOffsetReset | Trigger	| `auto.offset.reset` | 
| FetchMaxBytes	| Trigger | `fetch.max.bytes` |
| LibkafkaDebug	| Both | `debug` |
| MaxPartitionFetchBytes	| Trigger | `max.partition.fetch.bytes` |
| MaxPollIntervalMs	| Trigger | `max.poll.interval.ms` |
| MetadataMaxAgeMs | Both | `metadata.max.age.ms` |
| QueuedMinMessages	| Trigger | `queued.min.messages` |
| QueuedMaxMessagesKbytes	| Trigger | `queued.max.messages.kbytes` |
| ReconnectBackoffMs | Trigger | `reconnect.backoff.max.ms` |	
| ReconnectBackoffMaxMs | Trigger | `reconnect.backoff.max.ms` |
| SessionTimeoutMs	| Trigger | `session.timeout.ms` |
| SocketKeepaliveEnable	| Both | `socket.keepalive.enable` |
| StatisticsIntervalMs	| Trigger | `statistics.interval.ms` |


## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
 
[extension bundle]: ./functions-bindings-register.md#extension-bundles
