---
title: Best Practices for Azure Functions | Microsoft Docs
description: Learn best practices and patterns for Azure Functions.
services: functions
documentationcenter: na
author: wesmc7777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, patterns, best practice, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 9058fb2f-8a93-4036-a921-97a0772f503c
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 10/16/2017
ms.author: glenga

ms.custom: H1Hack27Feb2017

---

# Optimize the performance and reliability of Azure Functions

This article provides guidance to improve the performance and reliability of your [serverless](https://azure.microsoft.com/overview/serverless-computing/) function apps. 

## General best practices

The following are best practices in how you build and architect your serverless solutions using Azure Functions.

### Avoid long running functions

Large, long-running functions can cause unexpected timeout issues. A function can become large due to many Node.js dependencies. Importing dependencies can also cause increased load times that result in unexpected timeouts. Dependencies are loaded both explicitly and implicitly. A single module loaded by your code may load its own additional modules.  

Whenever possible, refactor large functions into smaller function sets that work together and return responses fast. For example, a webhook or HTTP trigger function might require an acknowledgment response within a certain time limit; it is common for webhooks to require an immediate response. You can pass the HTTP trigger payload into a queue
to be processed by a queue trigger function. This approach allows you to defer the actual work and return an immediate response.


### Cross function communication

[Durable Functions](durable-functions-overview.md) and [Azure Logic Apps](../logic-apps/logic-apps-what-are-logic-apps.md) are built to manage state transitions and communication between multiple functions.

If not using Durable Functions or Logic Apps to integrate with multiple functions, it is generally a best practice to use storage queues for cross function communication.  The main reason is storage queues are cheaper and much easier to provision. 

Individual messages in a storage queue are limited in size to 64 KB. If you need to pass larger messages between functions, an Azure Service Bus queue could be used to support message sizes up to 256 KB.

Service Bus topics are useful if you require message filtering before processing.

Event hubs are useful to support high volume communications.


### Write functions to be stateless 

Functions should be stateless and idempotent if possible. Associate any required state information with your data. For example, an order being processed would likely have an associated `state` member. A function could process an order based on that state while the function itself remains stateless. 

Idempotent functions are especially recommended with timer triggers. For example, if you have something that absolutely must run once a day, write it so it can run any time during the day with the same results. The function can exit when there is no work for a particular day. Also if a previous run failed to complete, the next run should pick up where it left off.


### Write defensive functions

Assume your function could encounter an exception at any time. Design your functions with the ability to continue from a previous fail point during the next execution. Consider a scenario that requires the following actions:

1. Query for 10,000 rows in a db.
2. Create a queue message for each of those rows to process further down the line.
 
Depending on how complex your system is, you may have: involved downstream services behaving badly, networking outages, or quota limits reached, etc. All of these can affect your function at any time. You need to design your functions to be prepared for it.

How does your code react if a failure occurs after inserting 5,000 of those items into a queue for processing? Track items in a set that you’ve completed. Otherwise, you might insert them again next time. This can have a serious impact on your work flow. 

If a queue item was already processed, allow your function to be a no-op.

Take advantage of defensive measures already provided for components you use in the Azure Functions platform. For example, see **Handling poison queue messages** in the documentation for [Azure Storage Queue triggers and bindings](functions-bindings-storage-queue.md#trigger---poison-messages). 

## Scalability best practices

There are a number of factors which impact how instances of your function app scale. The details are provided in the documentation for [function scaling](functions-scale.md).  The following are some best practices to ensure optimal scalability of a function app.

### Don't mix test and production code in the same function app

Functions within a function app share resources. For example, memory is shared. If you're using a function app in production, don't add test-related functions and resources to it. It can cause unexpected overhead during production code execution.

Be careful what you load in your production function apps. Memory is averaged across each function in the app.

If you have a shared assembly referenced in multiple .Net functions, put it in a common shared folder. Reference the assembly with a statement similar to the following example if using C# Scripts (.csx): 

	#r "..\Shared\MyAssembly.dll". 

Otherwise, it is easy to accidentally deploy multiple test versions of the same binary that behave differently between functions.

Don't use verbose logging in production code. It has a negative performance impact.

### Use async code but avoid blocking calls

Asynchronous programming is a recommended best practice. However, always avoid referencing the `Result` property or calling `Wait` method on a `Task` instance. This approach can lead to thread exhaustion.

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

### Recieve messages in batch whenever possible

Some triggers like Event Hub and Storage Queues enable receiving a batch of messages on a single invocation.  Batching messages has much better performance.  You can configure the max batch size in the `functions.json` file as detailed in the [host.json reference documentation](functions-host-json.md)

For C# functions you can change the type to a strongly-typed array.  For example, instead of `EventData sensorEvent` the method signature could be `EventData[] sensorEvent`.  For other languages you'll need to explicitely set the cardinality property in your `function.json` to `many` in order to enable batching [as shown here](https://github.com/Azure/azure-webjobs-sdk-templates/blob/df94e19484fea88fc2c68d9f032c9d18d860d5b5/Functions.Templates/Templates/EventHubTrigger-JavaScript/function.json#L10).

### Configure host behaviors to better handle concurrency

The `host.json` file in the function app allows for configuration of host runtime and trigger behaviors.  In addition to batching behaviors, you can manage concurrency for a number of triggers.  Often adjusting the values in these options can help each instance scale appropriately for the demands of the invoked functions. 

**HTTP concurrency host options**

* `maxOutstandingRequests` - the maximum number of outstanding requests that will be held at any given time. This limit will include requests that are queued but have not started executing, as well as any in progress executions. Any incoming requests over this limit will be rejected with a 429 "Too Busy" response. That allows callers to employ time based retry strategies, and also helps you to control maximum request latencies. Note that this only controls queuing that occurs within the script host execution path. Other queues such as the ASP.NET request queue will still be in effect and unaffected by this setting. The default is unbounded.
* `maxConcurrentRequests` - the maximum number of http functions that will be executed in parallel. This allows you to control concurrency, which can help manage resource utilization. For example, you might have an http function that uses a lot of system resources (memory/cpu/sockets) such that it causes issues when concurrency is too high. Or you might have a function that makes outbound requests to a 3rd party service, and those calls need to be rate limited. In these cases, applying a throttle here can help. The default is unbounded.
* `dynamicThrottlesEnabled` - When enabled, this setting will cause the request processing pipeline to periodically check system performance counters like connections/threads/processes/memory/cpu/etc. and if any of those counters are over a built in high threshold (80%), requests will be rejected with a 429 "Too Busy" response until the counter(s) return to normal levels. The default is false.

**Service Bus concurrency host options**

* `maxConcurrentCalls` - The maximum number of concurrent calls to the callback the message pump should initiate. The default is 16.

## Next steps
For more information, see the following resources:

Because Azure Functions uses Azure App Service, you should also be aware of  App Service guidelines.
* [Patterns and Practices HTTP Performance Optimizations](https://docs.microsoft.com/azure/architecture/antipatterns/improper-instantiation/)
