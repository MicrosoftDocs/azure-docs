---
title: Concurrency in Azure Functions
description: Become familiar with concurrency behavior of event-driven triggers in Azure Functions. Find information about fixed per-instance and dynamic concurrency models.
author: nzthiago
ms.topic: concept-article
ms.custom:
  - build-2024
  - ignite-2024
  - build-2025
ms.date: 09/02/2025
ms.author: cachai
# customer intent: As a developer, I want to become familiar with concurrency in Azure Functions so that I know when to use which concurrency model and can optimize concurrency settings.
---

# Concurrency in Azure Functions

In Azure Functions, a single function app instance allows for multiple events to be processed concurrently. Because these run on the same compute instance, they share memory, CPU, and connection resources. In certain hosting plans, high demand on a specific instance causes the Functions host to automatically create new instances to handle the increased load. In these _dynamic scale_ plans, there's a tradeoff between concurrency and scaling behaviors. To provide more control over how your app runs, Functions provides a way for you to manage the number of concurrent executions.

Functions provides two main ways of managing concurrency:

- [Fixed per-instance concurrency](#fixed-per-instance-concurrency): You can configure host-level limits on concurrency that are specific to individual triggers. This model is the default concurrency behavior for Functions.
- [Dynamic concurrency](#dynamic-concurrency): For certain trigger types, the Functions host can automatically determine the best level of concurrency for that trigger in your function app. You must [opt in to this concurrency model](#dynamic-concurrency-configuration). 

This article describes the concurrency behaviors of event-driven triggers in Functions and how these behaviors affect scaling in dynamic plans. It also compares the fixed per-instance and dynamic concurrency models.

## Scaling versus concurrency

For functions that use event-based triggers or respond to HTTP requests, you can quickly reach the limits of concurrent executions during periods of high demand. During such periods, you must be able to scale your function app by adding instances to avoid a backlog in processing incoming requests. The way that we scale your app depends on your hosting plan:

| Scale type | Hosting plans | Description |
| ----- | ---- | ---- |
| Dynamic (event-driven) scaling |[Consumption](consumption-plan.md)<br/>[Flex Consumption](flex-consumption-plan.md)<br/>[Premium](functions-premium-plan.md)|  In a dynamic scale plan, the host scales the number of function app instances up or down based on the number of incoming events. For more information, see [Event-driven scaling in Azure Functions](./event-driven-scaling.md). |
| Manual scaling | [Dedicated (App Service) plans](dedicated-plan.md) | When you host your function app in a Dedicated plan, you must manually configure your instances during periods of higher load or [set up an autoscale scheme](dedicated-plan.md#scaling). |

Before any scaling might occur, your function app attempts to handle increases in load by handling multiple invocations of the same type in a single instance. As a result, these concurrent executions on a given instance directly impact scale decisions. For instance, when an app in a dynamic scale plan hits a concurrency limit, it might need to scale to keep up with incoming demand.

The balance of scale versus concurrency you try to achieve in your app depends on where bottlenecks might occur: in processing (CPU-intensive process limitations) or in a downstream service (I/O-based limitations).

## Fixed per-instance concurrency

By default, most triggers support a fixed per-instance concurrency configuration model via [target-based scaling](functions-target-based-scaling.md). In this model, each trigger type has a per-instance concurrency limit.

You can override the concurrency default values for most triggers by setting a specific per-instance concurrency for that trigger type. For many triggers, you configure concurrency settings in the [host.json file](functions-host-json.md). For example, the [Azure Service Bus trigger](./functions-bindings-service-bus-trigger.md) provides both a `MaxConcurrentCalls` and a `MaxConcurrentSessions` setting in _host.json_. These settings work together to control the maximum number of messages that each function app processes concurrently on each instance.

In certain target-based scaling scenarios, such as when you use an Apache Kafka or Azure Cosmos DB trigger, the concurrency configuration is in the function declaration, not in the _host.json_ file. Other trigger types have built-in mechanisms for load balancing invocations across instances. For example, Azure Event Hubs and Azure Cosmos DB both use a partition-based scheme.

For trigger types that support concurrency configuration, the concurrency settings are applied to all running instances. This way, you can control the maximum concurrency for your functions on each instance. For example, when your function is CPU-intensive or resource-intensive, you might choose to limit concurrency to keep instances healthy. In this case, you can rely on scaling to handle increased loads. Similarly, when your function makes requests to a downstream service that's being throttled, you should also consider limiting concurrency to avoid overloading the downstream service. 

## HTTP trigger concurrency

_Applies only to the Flex Consumption plan_ 

HTTP trigger concurrency is a special type of fixed per-instance concurrency. In HTTP trigger concurrency, the default concurrency also depends on the [instance memory size](./flex-consumption-plan.md#instance-memory).

The Flex Consumption plan scales all HTTP trigger functions together as a group. For more information, see [Per-function scaling](event-driven-scaling.md#per-function-scaling).

The following table indicates the default concurrency setting for HTTP triggers on a given instance, based on the configured instance memory size:

| Instance size (MB) | Default concurrency<sup>*</sup> |
| ---- | ---- |
| 512 |  4 |
| 2,048 | 16 |
| 4,096 | 32 |

<sup>*</sup>In Python apps, all instance sizes use an HTTP trigger concurrency level of one by default.

These default values should work well for most cases, and you can start with them. Consider that at a given number of HTTP requests, increasing the HTTP concurrency value reduces the number of instances required to handle HTTP requests. Likewise, decreasing the HTTP concurrency value requires more instances to handle the same load. 

If you need to fine-tune the HTTP concurrency, you can do so by using the Azure CLI. For more information, see [Set HTTP concurrency limits](flex-consumption-how-to.md#set-http-concurrency-limits).

The default concurrency values in the preceding table apply only when you don't set your own HTTP concurrency setting. When you don't explicitly set an HTTP concurrency setting, the default concurrency increases as shown in the table when you change the instance size. After you specifically set an HTTP concurrency value, that value is maintained despite changes in the instance size.

## Determine optimal fixed per-instance concurrency

Fixed per-instance concurrency configurations give you control of certain trigger behaviors, such as throttling your functions. But it can be difficult to determine the optimal values for these settings. Generally, you have to arrive at acceptable values by an iterative process of load testing. Even after you determine a set of values that work for a particular load profile, the number of events that arrive from your connected services can change from day to day. This variability can cause your app to run with suboptimal values. For example, your function app might process demanding message payloads on the last day of the week, which requires you to throttle concurrency down. However, during the rest of the week, the message payloads might be lighter, which means you can use a higher concurrency level the rest of the week. 

Ideally, the system should allow instances to process as much work as they can while keeping each instance healthy and latencies low. Dynamic concurrency is designed for that purpose.

## Dynamic concurrency

Functions provides a dynamic concurrency model that simplifies configuring concurrency for all function apps that run in the same plan. 

> [!NOTE]
> Dynamic concurrency is currently only supported for the Azure Blob Storage, Azure Queue Storage, and Service Bus triggers. Also, you must use the extension versions listed in [Extension support](#extension-support), later in this article.

### Benefits

Dynamic concurrency provides the following benefits: 

- **Simplified configuration**: You no longer have to manually determine per-trigger concurrency settings. The system learns the optimal values for your workload over time. 
- **Dynamic adjustments**: Concurrency is adjusted up or down dynamically in real time, which allows the system to adapt to changing load patterns over time. 
- **Instance health protection**: The runtime limits concurrency to levels that a function app instance can comfortably handle. These limits protect the app from overloading itself by taking on more work than it should. 
- **Improved throughput**: Overall throughput is improved, because individual instances don't pull more work than they can quickly process. As a result, work is load-balanced more effectively across instances. For functions that can handle higher loads, higher throughput can be obtained by increasing concurrency to values above the default configuration.

### Dynamic concurrency configuration

You can turn on dynamic concurrency at the host level in the _host.json_ file. When it's turned on, the concurrency levels of any binding extensions that support this feature are adjusted automatically as needed. In these cases, dynamic concurrency settings override any manually configured concurrency settings. 

By default, dynamic concurrency is turned off. When you turn on dynamic concurrency, concurrency starts at a level of one for each function. The concurrency level is adjusted up to an optimal value, which the host determines.

You can turn on dynamic concurrency in your function app by adding the following settings to your _host.json_ file: 

```json
    { 
        "version": "2.0", 
        "concurrency": { 
            "dynamicConcurrencyEnabled": true, 
            "snapshotPersistenceEnabled": true 
        } 
    } 
```

 When `snapshotPersistenceEnabled` is `true`, which is the default value, the learned concurrency values are periodically persisted to storage. New instances start from those values instead of starting from a level of one and having to redo the learning. 

### Concurrency manager 

Behind the scenes, when dynamic concurrency is turned on, a concurrency manager process runs in the background. This manager constantly monitors instance health metrics, like CPU and thread utilization, and changes throttles as needed. When one or more throttles are turned on, function concurrency is adjusted down until the host is healthy again. When throttles are turned off, concurrency can increase. Various heuristics are used to intelligently adjust concurrency up or down as needed based on these throttles. Over time, concurrency for each function stabilizes to a particular level. Because it can take time to determine the optimal concurrency value, use dynamic concurrency only if a suboptimal value is acceptable for your solution initially or after a period of inactivity.

Concurrency levels are managed for each individual function. Specifically, the system balances between resource-intensive functions that require a low level of concurrency and more lightweight functions that can handle higher concurrency. The balance of concurrency for each function helps to maintain the overall health of the function app instance.  

When dynamic concurrency is turned on, you find dynamic concurrency decisions in your logs. For example, log entries are added when various throttles are turned on, and whenever concurrency is adjusted up or down for each function. These logs are written under the **Host.Concurrency** log category in the **traces** table. 

### Extension support 

Dynamic concurrency is enabled for a function app at the host level, and any extensions that support dynamic concurrency run in that mode. Dynamic concurrency requires collaboration between the host and individual trigger extensions. Only the listed versions of the following extensions support dynamic concurrency.

| Extension | Version | Description |
| --- | --- | --- |
| **Queue Storage** | [Version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) (Storage extension) | The Queue Storage trigger has its own message polling loop. When you use a fixed per-instance configuration, the `BatchSize` and `NewBatchThreshold` configuration options govern concurrency. When you use dynamic concurrency, those configuration values are ignored. Dynamic concurrency is integrated into the message loop, so the number of messages retrieved per iteration is dynamically adjusted. When throttles are turned on, the host is overloaded. Message processing is paused until the throttles are turned off. When the throttles are turned off, concurrency increases. |
| **Blob Storage** |  [Version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) (Storage extension) | Internally, the Blob Storage trigger uses the same infrastructure that the Queue Storage trigger uses. When new or updated blobs need to be processed, messages are written to a platform-managed control queue. That queue is processed by using the same logic used for the Queue Storage trigger. When dynamic concurrency is turned on, concurrency for the processing of that control queue is dynamically managed. |
| **Service Bus** |  [Version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus) | The Service Bus trigger currently supports three execution models. Dynamic concurrency affects these execution models in the following ways:<li>**Single dispatch topic/queue processing**: Each invocation of your function processes a single message. When you use a fixed per-instance configuration, the `MaxConcurrentCalls` configuration option governs concurrency. When you use dynamic concurrency, that configuration value is ignored, and concurrency is adjusted dynamically.</li><li>**Session-based single dispatch topic/queue processing**: Each invocation of your function processes a single message. Depending on the number of active sessions for your topic or queue, each instance leases one or more sessions. Messages in each session are processed serially, to guarantee ordering in a session. When you don't use dynamic concurrency, the `MaxConcurrentSessions` setting governs concurrency. When dynamic concurrency is turned on, the `MaxConcurrentSessions` value is ignored, and the number of sessions that each instance processes is dynamically adjusted.</li><li>**Batch processing**: Each invocation of your function processes a batch of messages, governed by the `MaxMessageCount` setting. Because batch invocations are serial, concurrency for your batch-triggered function is always one, and dynamic concurrency doesn't apply.</li> |

## Next steps

For more information, see the following resources:

- [Best practices for reliable Azure Functions](functions-best-practices.md)
- [Azure Functions developer guide](functions-reference.md)
- [Azure Functions triggers and bindings](functions-triggers-bindings.md)
