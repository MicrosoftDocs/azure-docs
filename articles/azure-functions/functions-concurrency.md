---
title: Concurrency in Azure Functions
description: An overview of the dynamic concurrency feature in Azure Functions.
author: cachai2
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 05/05/2024
ms.author: cachai
---

# Concurrency in Azure Functions

This article describes the concurrency behaviors of event-driven triggers in Azure Functions. It also compares the static and dynamic concurrency models. 

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

In Functions, you can have multiple executing processes of a given function running concurrently on a single compute instance. For example, consider a case where you have three different functions in your function app that is scaled-out to multiple instances to handle an increased load. In this scenario, each function is executing in response to individual invocations across all three instances, and a given instance can handle multiple invocations of the same type. Keep in mind that the function executions on a single instance share the same memory, CPU, and connection resources. Because multiple function executions can run on each instance concurrently, each function needs to have a way to manage the number of concurrent executions.

When your app is hosted in a dynamic scale plan (Consumption, Flex Consumption, or Premium), the host scales the number of function app instances up or down based on the number of incoming events. To learn more, see [Event Driven Scaling](./Event-Driven-Scaling.md). When you host your functions in a Dedicated (App Service) plan, you must manually configure your instances or [set up an autoscale scheme](dedicated-plan.md#scaling).

These scale decisions also are directly impacted by the concurrency of executions on a given instance. When an app in a dynamic scale plan hits a concurrency limit, it might need to scale to keep up with incoming demand. 

Functions provides two main ways of managing concurrency:

+ **[Static concurrency](#static-concurrency):** You can configure host-level limits on concurrency, which are specific to individual triggers. This is the default concurrency behavior for Functions.

+ **[Dynamic concurrency](#dynamic-concurrency):** For certain trigger types, the Functions host can automatically determine the best level of concurrency for that trigger in your app. You must [opt in to this concurrency model](#dynamic-concurrency-configuration).  

## Static concurrency

By default, most triggers support a host-level static configuration model. In this model, each trigger type has a per-instance concurrency limit. However, for most triggers you can also request a specific per-instance concurrency for that trigger type. For example, the [Service Bus trigger](./functions-bindings-service-bus-trigger.md) provides both a `MaxConcurrentCalls` and a `MaxConcurrentSessions` setting in the [host.json file](functions-host-json.md). These settings together control the maximum number of messages each function processes concurrently on each instance. Other trigger types have built-in mechanisms for load-balancing invocations across instances. For example, Event Hubs and Azure Cosmos DB both use a partition-based scheme. 

For trigger types that support concurrency configuration, the settings you choose are applied to all running instances. This allows you to control the maximum concurrency for your functions on each instance. For example, when your function is CPU or resource-intensive, you may choose to limit concurrency to keep instances healthy and rely on scaling to handle increased loads. Similarly, when your function is making requests to a downstream service that is being throttled, you should also consider limiting concurrency to avoid overloading the downstream service. 

## HTTP trigger concurrency

_Applies only to the Flex Consumption plan (preview)_ 

The Flex Consumption plan scales all HTTP trigger functions together as a group. For more information, see [Per-function scaling](event-driven-scaling.md#per-function-scaling). The following table indicates the default concurrency setting for HTTP triggers on a given instance, based on the configured [instance memory size](./flex-consumption-plan.md#instance-memory).

| Instance size (MB) | Default concurrency<sup>*</sup> |
| ---- | ---- |
| `2048` | `16` |
| `4096` | `32` |

<sup>*</sup>For Python apps, the default HTTP trigger concurrency for all instances sizes is `1`.

These defaults should work well for most cases, and you start with them. Consider that at a given number of HTTP requests, increasing the HTTP concurrency value reduces the number of instances required to handle HTTP requests. Likewise decreasing the HTTP concurrency value requires more instances to handle the same load. 

If you need to fine tune the HTTP concurrency, you can do this by using the Azure CLI. For more information, see [Set HTTP concurrency limits](flex-consumption-how-to.md#set-http-concurrency-limits).

The default concurrency values in the previous table only apply when you haven't set your own HTTP concurrency setting. When you haven't explicitly set an HTTP concurrency setting, the default concurrency increases as shown in the table when you change the instance size. After you specifically set an HTTP concurrency value, that value is maintained despite changes in the instance size.

## Determine optimal static concurrency

While static concurrency configurations give you control of certain trigger behaviors, such as throttling your functions, it can be difficult to determine the optimal values for these settings. Generally, you have to arrive at acceptable values by an iterative process of load testing. Even after you determine a set of values that are working for a particular load profile, the number of events arriving from your connected services may change from day to day. This variability means your app often may run with suboptimal values. For example, your function app may process particularly demanding message payloads on the last day of the week, which requires you to throttle concurrency down. However, during the rest of the week the message payloads are simpler, which means you could use a higher concurrency level the rest of the week. 

Ideally, we want the system to allow instances to process as much work as they can while keeping each instance healthy and latencies low, which is what dynamic concurrency is designed to do.

## Dynamic concurrency

Functions now provides a dynamic concurrency model that simplifies configuring concurrency for all function apps running in the same plan. 

> [!NOTE]
> Dynamic concurrency is currently only supported for the Azure Blob, Azure Queue, and Service Bus triggers and requires you to use the versions listed in the [extension support section below](#extension-support).

### Benefits

Using dynamic concurrency provides the following benefits: 

- **Simplified configuration**: You no longer have to manually determine per-trigger concurrency settings. The system learns the optimal values for your workload over time. 
- **Dynamic adjustments**: Concurrency is adjusted up or down dynamically in real time, which allows the system to adapt to changing load patterns over time. 
- **Instance health protection**: The runtime limits concurrency to levels a function app instance can comfortably handle. This protects the app from overloading itself by taking on more work than it should. 
- **Improved throughput**: Overall throughput is improved because individual instances aren't pulling more work than they can quickly process. This allows work to be load-balanced more effectively across instances. For functions that can handle higher loads, higher throughput can be obtained by increasing concurrency to values above the default configuration.

### Dynamic concurrency configuration

Dynamic concurrency can be enabled at the host level in the host.json file. When enabled, the concurrency levels of any binding extensions that support this feature are adjusted automatically as needed. In these cases, dynamic concurrency settings override any manually configured concurrency settings. 

By default, dynamic concurrency is disabled. With dynamic concurrency enabled, concurrency starts at 1 for each function, and is adjusted up to an optimal value, which is determined by the host.

You can enable dynamic concurrency in your function app by adding the following settings in your host.json file: 

```json
    { 
        "version": "2.0", 
        "concurrency": { 
            "dynamicConcurrencyEnabled": true, 
            "snapshotPersistenceEnabled": true 
        } 
    } 
```

 When `SnapshotPersistenceEnabled` is `true`, which is the default, the learned concurrency values are periodically persisted to storage so new instances start from those values instead of starting from 1 and having to redo the learning. 

### Concurrency manager 

Behind the scenes, when dynamic concurrency is enabled there's a concurrency manager process running in the background. This manager constantly monitors instance health metrics, like CPU and thread utilization, and changes throttles as needed. When one or more throttles are enabled, function concurrency is adjusted down until the host is healthy again. When throttles are disabled, concurrency is allowed to increase. Various heuristics are used to intelligently adjust concurrency up or down as needed based on these throttles. Over time, concurrency for each function stabilizes to a particular level. 

Concurrency levels are managed for each individual function. As such, the system balances between resource-intensive functions that require a low level of concurrency and more lightweight functions that can handle higher concurrency. The balance of concurrency for each function helps to maintain overall health of the function app instance.  

When dynamic concurrency is enabled, you'll see dynamic concurrency decisions in your logs. For example, you'll see logs when various throttles are enabled, and whenever concurrency is adjusted up or down for each function. These logs are written under the **Host.Concurrency** log category in the traces table. 

### Extension support 

Dynamic concurrency is enabled for a function app at the host level, and any extensions that support dynamic concurrency run in that mode. Dynamic concurrency requires collaboration between the host and individual trigger extensions. Only the listed versions of the following extensions support dynamic concurrency.

| Extension | Version | Description |
| --- | --- | --- |
| **Queue storage** | [version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) (Storage extension) | The Azure Queue storage trigger has its own message polling loop. When using static config, concurrency is governed by the `BatchSize`/`NewBatchThreshold` config options. When using dynamic concurrency, those configuration values are ignored. Dynamic concurrency is integrated into the message loop, so the number of messages fetched per iteration are dynamically adjusted. When throttles are enabled (host is overloaded), message processing will be paused until throttles are disabled. When throttles are disabled, concurrency will increase. |
| **Blob storage** |  [version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) (Storage extension) | Internally, the Azure Blob storage trigger uses the same infrastructure that the Azure Queue Trigger uses. When new/updated blobs need to be processed, messages are written to a platform managed control queue, and that queue is processed using the same logic used for QueueTrigger. When dynamic concurrency is enabled, concurrency for the processing of that control queue will be dynamically managed. |
| **Service Bus** |  [version 5.x](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus) | The Service Bus trigger currently supports three execution models. Dynamic concurrency affects these execution models as follows:<br/><br/>• **Single dispatch topic/queue processing**:  Each invocation of your function processes a single message. When using static config, concurrency is governed by the `MaxConcurrentCalls` config option. When using dynamic concurrency, that config value is ignored, and concurrency is adjusted dynamically.<br/>• **Session based single dispatch topic/queue processing**: Each invocation of your function processes a single message. Depending on the number of active sessions for your topic/queue, each instance leases one or more sessions. Messages in each session are processed serially, to guarantee ordering in a session. When dynamic concurrency isn't used, concurrency is governed by the `MaxConcurrentSessions` setting. With dynamic concurrency enabled, `MaxConcurrentSessions` is ignored and the number of sessions each instance is processing is dynamically adjusted.<br/>• **Batch processing**: Each invocation of your function processes a batch of messages, governed by the `MaxMessageCount` setting. Because batch invocations are serial, concurrency for your batch-triggered function is always one and dynamic concurrency doesn't apply. |

## Next steps

For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](event-driven-scaling.md)
