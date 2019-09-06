---
title: Durable functions billing - Azure Functions
description: Learn about the internal behaviors of Durable functions and how they impact billing for Azure Functions.
services: functions
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

[Orchestrator functions](durable-functions-orchestrations.md) will replay several times throughout the lifetime of the orchestration. Each replay is viewed by the Azure Functions runtime as a distinct function invocation. For this reason, in the Azure Functions consumption plan, you will be billed for each replay of the orchestrator function. Other plan types do not charge for orchestrator function replay.

## Awaiting and yielding in orchestrator functions

When an orchestrator function waits for an asynchronous action to complete using the `await` keyword in C# or `yield` in JavaScript, the Azure Functions runtime considers that particular execution complete. The billing for the orchestrator function stops at that point and does not resume until the next orchestrator function replay. You will not be billed for any time spent `await`ing or `yield`ing in an orchestrator function.

> [!NOTE]
> In some Serverless literature, functions calling other functions is considered an anti-pattern. The primary reason is because of a problem known as "double billing". If a function calls another function directly, two functions are executing at the same time. The callee is actively executing code while the caller is waiting for a response. In particular, you must pay for the time the caller spends waiting for the caller to execute. Orchestrator functions do not suffer from "double billing" because the orchestrator function's billing stops while it waits for the result of an activity function (or sub-orchestration).

## Durable HTTP polling

Orchestrator functions have the ability to make long-running HTTP calls to external endpoints as described in the [HTTP features](durable-functions-http-features.md) topic. The `CallHttpAsync` method in C# and the `callHttp` method in JavaScript may internally poll an HTTP endpoint when following the [asynchronous 202 pattern](durable-functions-http-features.md#http-202-handling). There is currently no direct billing for the internal HTTP polling operations. However, the internal polling may cause the orchestrator function to periodically replay, and you will be billed standard charges for these internal function replays.

## Azure storage transactions

Durable Functions uses Azure Storage by default to persist state, send and receive messages, and manage partitions via blob leases. The Azure storage account used by Durable Functions is owned by you and any internal Azure Storage transaction costs are billed to your Azure subscription. For more information about the Azure Storage artifacts used by Durable Functions, see the [Task hubs](durable-functions-task-hubs.md) topic.

There are several factors which contribute to the actual Azure Storage costs that are incurred by your Durable Functions application.

* A single function app is associated with a single task hub, which shares a set of Azure Storage resources. The same set of resources are used by all Durable functions in a function app. The actual number of functions in the function app has no impact on Azure Storage transaction costs.
* Each function app instance internally polls multiple queues in the storage account using an exponential backoff polling algorithm. An idle application instance will poll the queues less frequently than an active application, resulting in fewer transaction costs. For more information about Durable Functions queue-polling behavior see the [queue polling section of the Performance and Scale](durable-functions-perf-and-scale.md#queue-polling) topic.
* When running in the Azure Functions Consumption or Premium plans, the [Azure Functions Scale Controller](../functions-scale.md#how-the-consumption-and-premium-plans-work) will regularly poll all task hub queues in the background at a constant interval. Under light to mederate scale, only a single Scale Controller instance will poll these queues. However, if the function app scales out to a large number of instances, more Scale Controller instances may be added, which can increase queue transaction costs.
* Each function app instance competes for a set of blob leases. These instances will periodically make calls to the Azure Blob service to either renew held leases are attempt to acquire new leases. The number of blob leases is determined by the task hub's configured partition count. Scaling out to a larger number of function app instances will likely increase the Azure Storage transaction costs associated with these lease operations.

More information on Azure Storage pricing can be found in the [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)