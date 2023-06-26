---
title: Using Azure Functions for Azure Cache for Redis
description: Learn how to use Azure Functions Azure Cache for Redis
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/26/2023

---

# Overview of Azure functions for Azure Cache for Redis

::: zone pivot="programming-language-csharp"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)] 

This article describes how to use Azure Cache for Redis with Azure Functions to create optimized serverless and event-driven architectures. 

Azure Cache for Redis can be used as a trigger for Azure Functions, allowing Redis to initiate a serverless workflow. This functionality can be highly useful in data architectures like a write-behind cache, or any event-based architectures.

Azure Functions is an event-driven programming where triggers and bindings are key features, with which you can easily build event-driven serverless applications. Azure Cache for Redis provides a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

With the integration between Azure Cache for Redis and Functions, you can build functions that react to events from Azure Cache for Redis or external systems.

::: zone-end

| Action  | Direction | Type |
|---------|-----------|------|
| Triggers on Redis pubsub messages   | N/A | [RedisPubSubTrigger](functions-bindings-cache-trigger-redispubsubtrigger.md) |
| Triggers on Redis lists | N/A | [RedisListsTrigger](functions-bindings-cache-trigger-redisliststrigger.md)  |
| Triggers on Redis streams | N/A | [RedisStreamsTrigger](functions-bindings-cache-trigger-redisstreamstrigger.md) |

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub  | Yes  | Yes  |  Yes  |
|Lists | Yes  | Yes   |  Yes  |
|Streams | Yes  | Yes  |  Yes  |

> [!IMPORTANT]
> Redis triggers are not currently supported on consumption functions.
>

## Triggering on keyspace notifications

Redis offers a built-in concept called [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/). When enabled, this feature publishes notifications of a wide range of cache actions to a dedicated pub/sub channel. Supported actions include actions that affect specific keys, called _keyspace notifications_, and specific commands, called _keyevent notifications_. A huge range of Redis actions are supported, such as `SET`, `DEL`, and `EXPIRE`. The full list can be found in the [keyspace notification documentation](https://redis.io/docs/manual/keyspace-notifications/).

The `keyspace` and `keyevent` notifications are published with the following syntax:

```
PUBLISH __keyspace@0__:<affectedKey> <command>
PUBLISH __keyevent@0__:<affectedCommand> <key>
```

Because these events are published on pub/sub channels, the `RedisPubSubTrigger` is able to pick them up. See the [RedisPubSubTrigger](#redispubsubtrigger) section for more examples.

> [!IMPORTANT]
> In Azure Cache for Redis, `keyspace` events must be enabled before notifications are published. For more information, see [Advanced Settings](cache-configure.md#keyspace-notifications-advanced-settings).

## Prerequisites and limitations

- The `RedisPubSubTrigger` isn't capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions don't support triggering on `keyspace` or `keyevent` notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` isn't supported with consumption functions.

## Install bundle
<!-- Do either the [extension bundle] install here or manual func install extension if needed. -->

The extension NuGet package you install depends on the C# mode in-process or isolated worker process you're using in your function app:

## In-process
Functions execute in the same process as the Functions host. To learn more, see Develop C# class library functions using Azure Functions.

## Isolated process
Functions execute in an isolated C# worker process. To learn more, see Guide for running C# Azure Functions in an isolated process.

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"

::: zone-end

<!--## Requirements Include any requirements that apply to using the entire extension. See the [Kafka reference](https://learn.microsoft.com/azure/azure-functions/functions-bindings-kafka#enable-runtime-scaling) for an example. -->
host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
## Next steps
<!--Use the next step links from the original article.-->