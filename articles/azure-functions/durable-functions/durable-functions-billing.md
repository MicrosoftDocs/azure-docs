---
title: "Durable Functions Billing: Costs and Pricing Options"
titleSuffix: Durable Task
description: Understand how Durable Functions billing works, including orchestrator replay charges, Azure Storage costs, and Durable Task Scheduler pricing. Optimize your Azure Functions costs today.
author: cgillum
reviewer: hhunter-ms
ms.topic: concept-article
ms.date: 04/23/2026
ms.author: azfuncdf
ms.service: azure-functions
ms.subservice: durable
#Customer intent: As a developer, I want to understand how using Durable Functions influences my Azure consumption bill.
---

# Durable Functions billing

When you use the Azure Functions [Consumption plan](../consumption-plan.md), each orchestrator function replay counts as a separate billable invocation, and you also pay for the storage provider that persists your orchestration state. This article breaks down the specific cost areas so you can understand and optimize your Durable Functions spending.

In this article:

- [Orchestrator function replay billing](#orchestrator-function-replay-billing) - How replays generate charges on the Consumption plan
- [Billing stops during await and yield](#billing-stops-during-await-and-yield) - Why you're not charged while waiting
- [HTTP polling and replay charges](#http-polling-and-replay-charges) - How internal polling affects billing
- [Durable Task Scheduler transactions](#durable-task-scheduler-transactions) - Purpose-built backend pricing
- [Azure Storage transactions](#azure-storage-transactions) - Storage account cost drivers

## Orchestrator function replay billing

[Orchestrator functions](../../durable-task/common/durable-task-orchestrations.md) might replay several times throughout an orchestration's lifetime. The Azure Functions runtime views each replay as a distinct function invocation. For this reason, when you use the Azure Functions Consumption plan, you're billed for each replay of an orchestrator function. Other plan types don't charge for orchestrator function replay.

## Billing stops during await and yield

When your orchestrator function waits for an asynchronous task to complete, the runtime considers that particular function invocation finished. The billing for your orchestrator function stops at that point. It doesn't resume until the next orchestrator function replay. You aren't billed for any time spent awaiting or yielding in an orchestrator function.

> [!NOTE]
> Unlike direct function-to-function calls where both functions run (and bill) concurrently, orchestrator functions avoid this *double billing* problem. An orchestrator function's billing stops while it waits for the result of an activity function or suborchestration.

## HTTP polling and replay charges

Orchestrator functions can make long-running HTTP calls to external endpoints. The *"call HTTP"* APIs might [internally poll an HTTP endpoint](durable-functions-http-features.md) while following the [asynchronous 202 pattern](durable-functions-http-features.md#http-202-handling).

Internal HTTP polling itself doesn't incur extra charges. However, each poll can cause your orchestrator function to replay, and those replays are billed at the standard rate on the Consumption plan.

## Durable Task Scheduler transactions

The [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) is a purpose-built, managed backend for Durable Task that you can use with [any of the Functions hosting plans](../functions-scale.md). It offers two pricing models based on *actions*.

An *action* is a message dispatched by the Durable Task Scheduler to your application that triggers the execution of an orchestrator, activity, or entity function. Actions include starting orchestrations, scheduling activities, completing timers, and processing results.

| SKU | Description |
| --- | --- |
| **Dedicated** | Fixed monthly cost per Capacity Unit (CU). Each CU supports up to 2,000 actions per second and 50 GB of orchestration data storage. |
| **Consumption (preview)** | Pay-per-use model where you only pay for actions dispatched. Ideal for variable workloads and development scenarios. |

For detailed pricing information, SKU comparisons, and capacity planning examples, see [Durable Task Scheduler billing](../../durable-task/scheduler/durable-task-scheduler-billing.md).

## Azure Storage transactions

When using the [Azure Storage provider](durable-functions-azure-storage-provider.md), Durable Functions can keep state persistent, process messages, and manage partitions via blob leases. Since you own this storage account, any transaction costs are billed to your Azure subscription.

Several factors contribute to Azure Storage costs. Queue polling by function app instances and the scale controller typically generates the most storage transactions. Other factors include:

- Blob lease operations for partition management
- Task hub resource sharing across functions

For more information about Azure Storage costs and queue-polling behavior, see [Azure Storage provider](durable-functions-azure-storage-provider.md).

> [!TIP]
> To compare the cost profiles, features, and trade-offs of different storage providers, see [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).

## Next steps

- [Durable Task Scheduler billing](../../durable-task/scheduler/durable-task-scheduler-billing.md)
- [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)
- [Performance and scale in Durable Functions](durable-functions-perf-and-scale.md)
- [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md)
