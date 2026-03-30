---
title: Durable Functions billing
titleSuffix: Durable Task
description: Learn about the internal behaviors of Durable Functions and how they affect billing for Azure Functions.
author: cgillum
reviewer: hhunter-ms
ms.topic: concept-article
ms.date: 02/11/2026
ms.author: azfuncdf
ms.service: azure-functions
ms.subservice: durable
#Customer intent: As a developer, I want to understand how using Durable Functions influences my Azure consumption bill.
---

# Durable Functions billing

Although [Durable Functions](what-is-durable-task.md) follows the same billing model as [Azure Functions](https://azure.microsoft.com/pricing/details/functions/), you need to be aware of some specific billing behaviors when executing orchestrator functions in the Azure Functions [Consumption plan](../consumption-plan.md).

## Orchestrator function replay billing

[Orchestrator functions](durable-functions-orchestrations.md) might replay several times throughout an orchestration's lifetime. The Azure Functions runtime views each replay as a distinct function invocation. For this reason, when you use the Azure Functions Consumption plan, you're billed for each replay of an orchestrator function. Other plan types don't charge for orchestrator function replay.

## Awaiting and yielding in orchestrator functions

When your orchestrator function waits for an asynchronous task to complete, the runtime considers that particular function invocation finished. The billing for your orchestrator function stops at that point. It doesn't resume until the next orchestrator function replay. You aren't billed for any time spent awaiting or yielding in an orchestrator function.

> [!NOTE]
> Some consider functions calling other functions to be a serverless anti-pattern because of a problem known as *double billing*. When a function calls another function directly, both run at the same time. The called function is actively running code while the calling function waits for a response. In this case, you pay for the time the calling function spends waiting for the called function to run.
>
> Orchestrator functions don't have double billing. An orchestrator function's billing stops while it waits for the result of an activity function or suborchestration.

## Durable HTTP polling

Orchestrator functions can make long-running HTTP calls to external endpoints. The *"call HTTP"* APIs might [internally poll an HTTP endpoint](durable-functions-http-features.md) while following the [asynchronous 202 pattern](durable-functions-http-features.md#http-202-handling). 

You currently aren't directly billed for internal HTTP polling operations. However, internal polling might cause your orchestrator function to periodically replay. You're billed standard charges for these internal function replays.

## Durable Task Scheduler transactions (recommended)

The [Durable Task Scheduler](durable-task-scheduler/durable-task-scheduler.md) is a purpose-built backend-as-a-service optimized for Durable Task. You use the Durable Task Scheduler with [any of the Functions SKUs](../functions-scale.md) and choose between two pricing models:

| SKU | Description |
| --- | --- |
| **Dedicated** | Fixed monthly cost per Capacity Unit (CU). Each CU supports up to 2,000 actions per second and 50 GB of orchestration data storage. |
| **Consumption (preview)** | Pay-per-use model where you only pay for actions dispatched. Ideal for variable workloads and development scenarios. |

An *action* is a message dispatched by the Durable Task Scheduler to your application, triggering the execution of an orchestrator, activity, or entity function. Actions include starting orchestrations, scheduling activities, completing timers, and processing results.

For detailed pricing information, SKU comparisons, and capacity planning examples, see [Durable Task Scheduler billing](durable-task-scheduler/durable-task-scheduler-billing.md).

## Azure Storage transactions

When using the [Azure Storage provider](durable-functions-azure-storage-provider.md), Durable Functions can keep state persistent, process messages, and manage partitions via blob leases. Since you own this storage account, any transaction costs are billed to your Azure subscription.

Several factors contribute to Azure Storage costs, including:

- Queue polling by function app instances and the scale controller
- Blob lease operations for partition management
- Task hub resource sharing across functions

For more information about Azure Storage costs and queue-polling behavior, see [Azure Storage provider](durable-functions-azure-storage-provider.md).

## Next steps

- [Durable Task Scheduler billing](durable-task-scheduler/durable-task-scheduler-billing.md)
- [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)
