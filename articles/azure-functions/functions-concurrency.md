---
title: Concurrency in Azure Functions
description: An overview of the dynamic concurrency feature in Azure Functions.
author: cachai2
ms.topic: conceptual
ms.date: 9/24/2021
ms.author: cachai
---

# Concurrency in Azure Functions

This article provides an overview of the existing [static concurrency](/functions-concurrency#static-concurrency) model in Azure Functions as well as the new [dynamic concurrency](./functions-concurrency#dynamic-concurrency) model in preview. 

The hosting model for Azure Functions allows multiple function invocations to run concurrently on a single compute instance. For example, if you have 3 different functions in your function app, each function will be processing invocations on each instance your app is scaled to. The function invocations on a single instance will therefore be sharing the same VM compute resources like memory, CPU, etc. If you're in one of our Dynamic SKUs, the platform will scale the number of these instances up or down based on load (see [Event Driven Scaling](./Event-Driven-Scaling.md)). If you're in an App Service plan, you choose the number of instances your app will run on. 

Because multiple function invocations can run on each instance concurrently, each function needs to have a way to throttle how many concurrent invocations it's processing at any given time.

## Static concurrency

Many of the Azure Functions triggers support a host level static configuration model for specifying per instance concurrency for that trigger type. For example, the [ServiceBusTrigger](./functions-bindings-service-bus-trigger.md) exposes **MaxConcurrentCalls** and **MaxConcurrentSessions** which together govern the maximum number of messages each function will process concurrently on each instance. Other trigger types have built in mechanisms for load balancing invocations across instances (e.g. the partition based schemes used by EventHubs and CosmosDB). 

For trigger types that expose concurrency configuration, if you don't configure these yourself defaults are chosen. These settings allow you to control the maximum concurrency for your functions on each instance, which may be important depending on your scenario. For example, if your function is CPU or resource intensive, you may have to limit concurrency to keep instances healthy. Similarly, if your function is making requests to a downstream service that need to be throttled, you may also want to limit concurrency. 

While this does give you total control, it is often difficult to determine optimal values for these settings. Generally you have to arrive at acceptable values via load testing. This can be a difficult and error prone process. Even if you determine values that work for a particular load profile, your load may change from day to day, meaning that often you may be running with sub-optimal values. For example, your function may process particularly demanding message payloads on the last day of the week requiring you to throttle concurrency down. However during the rest of the week the message payloads are simpler meaning you could actually use a much higher concurrency level on those days. 

What you really want is for the system to just "do the right thing" and allow instances to process as much work as they can while keeping each instance healthy and latencies low. That's what dynamic concurrency is designed to do.

## Dynamic concurrency (preview)

The new Azure Functions dynamic concurrency feature for Service Bus, simplifies configuring concurrency for your function apps which exist in the same plan.

### Benefits

Using dynamic concurrency provides the following benefits: 
- **Simplified configuration** - you no longer have to manually determine per trigger concurrency settings. The system will learn the optimal values for your workload over time. 
- **Dynamic adjustments** - concurrency is adjusted up/down dynamically in real time, allowing the system to adapt to changing load patterns over time. 
- **Instance health protection** - dynamic concurrency will limit concurrency to values a host instance can comfortably handle. This protects the host from overloading itself by taking on more work than it should. 
- **Improved throughput** - overall throughput is improved because individual instances aren't pulling more work than they can quickly process. This allows work to be load balanced more effectively across instances. In addition, for functions that can handle higher load, concurrency can be increased to high values (beyond default config values), resulting in higher throughput.

### Dynamic concurrency configuration

This page describes the new Azure Functions **dynamic concurrency** feature for Service Bus, which simplifies configuring concurrency for your function apps. Using Dynamic concurrency, you don't have to configure per trigger concurrency settings. When enabled at the host level, any extensions you use in your Function App that support dynamic concurrency will ignore their static configuration options and instead adjust concurrency dynamically as needed. You can enable dynamic concurrency in host.json as follows: 

```json
    { 
        "version": "2.0", 
        "concurrency": { 
            "dynamicConcurrencyEnabled": true, 
            "snapshotPersistenceEnabled": true 
        } 
    } 
```

By default dynamic concurrency is disabled. When dynamic concurrency is enabled, concurrency will start at 1 for each function, and will be quickly adjusted up to an optimal value. If the SnapshotPersistenceEnabled option is true (the default), these learned concurrency values are periodically persisted to storage so new instances start from those values rather than having to start from 1. 

### Concurrency manager 

Behind the scenes, when dynamic concurrency is enabled there's a **ConcurrencyManager** component running in the background that constantly monitors instance health metrics like CPU, thread utilization, etc., and enables/disables throttles as needed. When one or more throttles are enabled, function concurrency will be adjusted down until the host is healthy again. When throttles are disabled, concurrency is allowed to increase. Various heuristics are used to intelligently adjust concurrency up or down as needed based on these throttles. Thus, over time concurrency for each function will stabilize to a particular level. dynamic concurrency regulates per function concurrency to limit the total amount of work the instance is processing at any given time.  

Concurrency levels are managed for each individual function. So if you have one particularly resource intensive function that can only handle a low level of concurrency, and several others that are lightweight and can handle much higher concurrency, the system will attempt to arrive at concurrency levels for each that maintains overall host health.  

When dynamic concurrency is enabled, you'll see dynamic concurrency concurrency decisions in your logs. For example, you'll see logs when various throttles are enabled, and whenever concurrency is adjusted up or down for each function. These logs are written under the "Host.Concurrency" log category. 

### Extension support 

As mentioned above, dynamic concurrency is enabled globally at the host level, and any extensions that support dynamic concurrency will then operate in that mode. dynamic concurrency requires collaboration between the host and individual trigger extensions. For preview, only the latest versions of the following extensions support dynamic concurrency.

#### Service Bus 

ServiceBusTrigger currently supports 3 different execution models. dynamic concurrency support details for each are as follows: 
- **Single dispatch topic/queue processing** - Each invocation of your function processes a single message. When using static config, concurrency is governed by the MaxConcurrentCalls config option. When using dynamic concurrency, that config value is ignored, and concurrency is adjusted dynamically. 
- **Session based single dispatch topic/queue processing** - Each invocation of your function processes a single message. Depending on the number of active sessions for your topic/queue, each instance will lease one or more sessions, and messages in each session are processed serially, to ensure session ordering guarantees. When using static config, concurrency is governed by the MaxConcurrentSessions config option. When using dynamic concurrency, that config value is ignored, and the number of sessions each instance is processing will be dynamically adjusted. 
- **Batch processing** - Each invocation of your function processes a batch of messages, governed by the MaxMessageCount config option. Batch invocations are serial - concurrency for your batch triggered function will always be one. So dynamic concurrency doesn't apply here. 

To use dynamic concurrency for ServiceBus, you must use version 5.x of the **Microsoft.Azure.WebJobs.Extensions.ServiceBus** extension. You also need to [enable dynamic concurrency](./functions-concurrency.md#dynamic-concurrency-configuration) in your host.json.

## Next steps

For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](event-driven-scaling.md)