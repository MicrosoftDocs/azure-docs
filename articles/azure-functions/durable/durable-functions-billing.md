---
title: Durable functions billing - Azure Functions
description: Learn about the internal behaviors of Durable Functions and how they affect billing for Azure Functions.
author: cgillum
ms.topic: overview
ms.date: 08/31/2019
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand how using Durable Functions influences my Azure consumption bill.
---

# Durable Functions billing

[Durable Functions](durable-functions-overview.md) is billed the same way as Azure Functions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

When executing orchestrator functions in Azure Functions [Consumption plan](../functions-scale.md#consumption-plan), you need to be aware of some billing behaviors. The following sections describe these behaviors and their effect in more detail.

## Orchestrator function replay billing

[Orchestrator functions](durable-functions-orchestrations.md) might replay several times throughout the lifetime of an orchestration. Each replay is viewed by the Azure Functions runtime as a distinct function invocation. For this reason, in the Azure Functions Consumption plan you're billed for each replay of an orchestrator function. Other plan types don't charge for orchestrator function replay.

## Awaiting and yielding in orchestrator functions

When an orchestrator function waits for an asynchronous action to finish by using **await** in C# or **yield** in JavaScript, the runtime considers that particular execution to be finished. The billing for the orchestrator function stops at that point. It doesn't resume until the next orchestrator function replay. You aren't billed for any time spent awaiting or yielding in an orchestrator function.

> [!NOTE]
> Functions calling other functions is considered by some to be an antipattern. This is because of a problem known as _double billing_. When a function calls another function directly, both run at the same time. The called function is actively running code while the calling function is waiting for a response. In this case, you must pay for the time the calling function spends waiting for the called function to run.
>
> There is no double billing in orchestrator functions. An orchestrator function's billing stops while it waits for the result of an activity function or sub-orchestration.

## Durable HTTP polling

Orchestrator functions can make long-running HTTP calls to external endpoints as described in the [HTTP features article](durable-functions-http-features.md). The **CallHttpAsync** method in C# and the **callHttp** method in JavaScript might internally poll an HTTP endpoint while following the [asynchronous 202 pattern](durable-functions-http-features.md#http-202-handling).

There currently isn't direct billing for internal HTTP polling operations. However, internal polling might cause the orchestrator function to periodically replay. You'll be billed standard charges for these internal function replays.

## Azure Storage transactions

Durable Functions uses Azure Storage by default to keep state persistent, process messages, and manage partitions via blob leases. Because you own this storage account, any transaction costs are billed to your Azure subscription. For more information about the Azure Storage artifacts used by Durable Functions, see the [Task hubs article](durable-functions-task-hubs.md).

Several factors contribute to the actual Azure Storage costs incurred by your Durable Functions app:

* A single function app is associated with a single task hub, which shares a set of Azure Storage resources. These resources are used by all durable functions in a function app. The actual number of functions in the function app has no effect on Azure Storage transaction costs.
* Each function app instance internally polls multiple queues in the storage account by using an exponential-backoff polling algorithm. An idle app instance polls the queues less often than does an active app, which results in fewer transaction costs. For more information about Durable Functions queue-polling behavior, see the [queue-polling section of the Performance and Scale article](durable-functions-perf-and-scale.md#queue-polling).
* When running in the Azure Functions Consumption or Premium plans, the [Azure Functions scale controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) regularly polls all task-hub queues in the background. If a function app is under light to moderate scale, only a single scale controller instance will poll these queues. If the function app scales out to a large number of instances, more scale controller instances might be added. These additional scale controller instances can increase the total queue-transaction costs.
* Each function app instance competes for a set of blob leases. These instances will periodically make calls to the Azure Blob service either to renew held leases or to attempt to acquire new leases. The task hub's configured partition count determines the number of blob leases. Scaling out to a larger number of function app instances likely increases the Azure Storage transaction costs associated with these lease operations.

You can find more information on Azure Storage pricing in the [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/) documentation. 

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)
