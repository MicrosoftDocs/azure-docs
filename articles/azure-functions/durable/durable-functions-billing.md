---
title: Durable functions billing - Azure Functions
description: Learn about the internal behaviors of Durable functions and how they impact billing for Azure Functions.
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: overview
ms.date: 08/31/2019
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand how using Durable Functions influences my Azure consumption bill.
---

# Durable Functions Billing

[Durable Functions](durable-functions-overview.md) are billed the same as Azure Functions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/). When executing orchestrator functions in the Azure Functions [Consumption plan](../functions-scale.md#consumption-plan), there are some billing behaviors to be aware of. The following sections describe these behaviors and their impact in more detail.

## Orchestrator function replay billing

[Orchestrator functions](durable-functions-orchestrations.md) may replay several times throughout the lifetime of the orchestration. Each replay is viewed by the Azure Functions runtime as a distinct function invocation. For this reason, in the Azure Functions consumption plan, you'll be billed for each replay of the orchestrator function. Other plan types won't charge for orchestrator function replay.

## Awaiting and yielding in orchestrator functions

When an orchestrator function waits for an asynchronous action to complete using `await` (C#) or `yield` (JavaScript), the runtime considers that particular execution complete. The billing for the orchestrator function stops at that point and doesn't resume until the next orchestrator function replay. You aren't billed for any time spent awaiting or yielding in an orchestrator function.

> [!NOTE]
> Functions calling other functions is considered by some to be an anti-pattern. This is because of a problem known as _double billing_. When a function calls another function directly, both execute at the same time. The callee is actively executing code while the caller is waiting for a response. In this case, you must pay for the time the caller spends waiting for the callee to execute. Orchestrator functions don't suffer from this double billing because the orchestrator function's billing stops while it waits for the result of an activity function (or sub-orchestration).

## Durable HTTP polling

Orchestrator functions can make long-running HTTP calls to external endpoints as described in the [HTTP features](durable-functions-http-features.md) article. The `CallHttpAsync` method (C#) and the `callHttp` method (JavaScript) may internally poll an HTTP endpoint when following the [asynchronous 202 pattern](durable-functions-http-features.md#http-202-handling). There isn't currently direct billing for the internal HTTP polling operations. However, the internal polling may cause the orchestrator function to periodically replay, and you'll be billed standard charges for these internal function replays.

## Azure storage transactions

Durable Functions uses Azure Storage by default to persist state, process messages, and manage partitions via blob leases. This storage account is owned by you, so any transaction costs are billed to your Azure subscription. For more information about the Azure Storage artifacts used by Durable Functions, see the [Task hubs](durable-functions-task-hubs.md) article.

Several factors contribute to the actual Azure Storage costs  incurred by your Durable Functions application.

* A single function app is associated with a single task hub, which shares a set of Azure Storage resources. These resources are used by all Durable functions in a function app. The actual number of functions in the function app has no impact on Azure Storage transaction costs.
* Each function app instance internally polls multiple queues in the storage account using an exponential backoff polling algorithm. An idle application instance will poll the queues less frequently than an active application, resulting in fewer transaction costs. For more information about Durable Functions queue-polling behavior, see the [queue polling section of the Performance and Scale](durable-functions-perf-and-scale.md#queue-polling) article.
* When running in the Azure Functions Consumption or Premium plans, the [Azure Functions Scale Controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) regularly polls all task hub queues in the background. Under light to moderate scale, only a single Scale Controller instance will poll these queues. If the function app scales out to a large number of instances, more Scale Controller instances may be added. These additional scale controller instances can increase the total queue transaction costs.
* Each function app instance competes for a set of blob leases. These instances will periodically make calls to the Azure Blob service to either renew held leases are attempt to acquire new leases. The number of blob leases is determined by the task hub's configured partition count. Scaling out to a larger number of function app instances will likely increase the Azure Storage transaction costs associated with these lease operations.

More information on Azure Storage pricing can be found in the [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)
