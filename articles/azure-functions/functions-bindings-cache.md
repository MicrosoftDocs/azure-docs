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

<!-- 
This is how DAPR used includes for support messages
[!INCLUDE [preview-support](../../includes/functions-cach-support-limitations.md)] 
-->

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

## Install bundle

You need to install this NuGet package:

    Microsoft.Azure.WebJobs.Extensions.Redis, which is the extension that allows Redis keyspace notifications to be used as triggers in Azure Functions.

Install these packages by going to the Terminal tab in VS Code and entering the following commands:

```dos
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis
```

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"

::: zone-end

<!--## Requirements Include any requirements that apply to using the entire extension. See the [Kafka reference](https://learn.microsoft.com/azure/azure-functions/functions-bindings-kafka#enable-runtime-scaling) for an example. -->
host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
## Next steps
- [Introduction to Azure Functions](/azure/azure-functions/functions-overview)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started.md)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-rediscache-tutorial-write-behind)
