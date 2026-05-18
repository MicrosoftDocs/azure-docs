---
author: hhunter-ms
title: Durable Task Scheduler billing
titleSuffix: Durable Task
description: "Learn how Durable Task Scheduler billing works, including Dedicated and Consumption SKU pricing, actions calculation, and compute costs. Explore pricing examples to estimate your costs."
ms.topic: concept-article
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 05/01/2026
ms.author: franlanglois
---
# Durable Task Scheduler billing

The Durable Task Scheduler is a managed backend service that persists orchestration state. It's billed separately from the orchestration frameworks that connect to it. The Durable Task Scheduler doesn't charge for Durable Functions or the Durable Task SDKs directly. Your total cost has two components:

- **Durable Task Scheduler**—billed based on the SKU you choose ([Dedicated](#dedicated-sku-pricing-and-capacity) or [Consumption](#consumption-sku))
- **Compute resources**—billed separately by the platform hosting your application, whether that's [Azure Functions](#durable-functions) (for Durable Functions) or a container/VM platform (for [Durable Task SDKs](#durable-task-sdks))

The following table compares the two pricing models at a glance.

| | Dedicated | Consumption |
| --- | --- | --- |
| **Billing model** | Fixed monthly cost per Capacity Unit (CU) | Pay per action dispatched |
| **Max throughput** | 2,000 actions/sec per CU (up to 3 CUs) | 500 actions/sec |
| **Data retention** | Up to 90 days | Up to 30 days |
| **High availability** | Supported (requires 3 CUs) | Not available |
| **Best for** | Production workloads with predictable volume | Dev/test and variable workloads |

For current pricing, see the [Durable Task Scheduler pricing page](https://azure.microsoft.com/pricing/details/durable-task-scheduler/).

## What is an action?

An *action* is a message dispatched by the Durable Task Scheduler to your application, triggering the execution of an orchestrator, activity, or entity function. Actions include:

- Starting an orchestration or suborchestration
- Starting an activity
- Completing a timer
- Triggering an external event
- Executing an entity operation
- Pausing, resuming, or terminating an orchestration
- Processing the result of an activity, entity call, entity lock, or suborchestration

The following diagram shows how to calculate actions in your orchestration.

:::image type="content" source="media/durable-task-scheduler-dedicated-sku/actions-calculation.png" alt-text="Diagram showing how to calculate the number of billing actions in a Durable Task Scheduler orchestration.":::

### Example

An orchestration that calls three different activities incurs the following actions:

:::image type="content" source="media/durable-task-scheduler-dedicated-sku/function-code-image.png" alt-text="Screenshot of Durable Task Scheduler orchestration code showing three activity function calls and their corresponding action breakdown.":::

In this example, Durable Task Scheduler processes each action as shown here:

- Orchestrator start (`RunOrchestrator`) uses one action
- Activity 1 (`(nameof(SayHello), "Tokyo")`) uses two actions:
   - Scheduling the activity
   - Processing the result
- Activity 2 (`(nameof(SayHello), "Seattle")`) uses two actions:
   - Scheduling the activity
   - Processing the result
- Activity 3 (`(nameof(SayHello), "London")`) uses two actions:
   - Scheduling the activity
   - Processing the result

## Dedicated SKU pricing and capacity

The Dedicated SKU provides predictable performance through preallocated Capacity Units (CUs). Each deployment supports up to three CUs. You can create up to 25 schedulers and 25 task hubs per region per subscription with the Dedicated SKU. For more quota, [contact support](https://github.com/Azure/azure-functions-durable-extension/issues).

### Key features

| Feature | Description |
| - | - |
| Base cost | Fixed monthly cost per CU (regional pricing). Not "per action" billing. |
| Performance | Each CU supports up to 2,000 actions per second and 50 GB of orchestration data storage. |
| Orchestration data retention | Up to 90 days. |
| Custom scaling | Configure CUs to match your workload needs. One CU required per deployment. |
| High availability | High availability with multi-CU deployments. A minimum of three CUs is required. |

> [!NOTE]
> For high-availability deployments, configure three CUs. Single-CU deployments don't provide redundancy.

### Calculate capacity units for the Dedicated SKU

#### Example 1

You have an orchestration with five activities, plus error handling, and averaging 12 actions per orchestration (orchestrator and activity invocations). Let's calculate running 20 million orchestrations per month.

| Step | Calculation | Result |
| - | ----------- | ------ |
| Monthly actions | 20,000,000 × 12 | 240,000,000 actions |
| Actions per second | 240,000,000 ÷ 2,628,000 (seconds in a month) | ≈ 91 actions/second |
| Required CUs | 91 ÷ 2,000 | CUs needed: 0.046 → **1 CU sufficient** |

#### Example 2

A large enterprise runs 500 million complex orchestrations monthly, with an average of 15 actions per orchestration (multiple activities with orchestrator coordination). 

| Step | Calculation | Result |
| - | ----------- | ------ |
| Monthly actions | 500 million × 15 | 7.5 billion actions |
| Actions per second | 7.5 billion ÷ 2,628,000 | ≈ 2,854 actions/second |
| Required CUs | 2,854 ÷ 2,000 | CUs needed: 1.43 → **2 CUs sufficient** |

#### Example 3

A software as a service (SaaS) platform supports 800 million orchestrations monthly, each with an average of 15 actions (user interactions, background processing, and external API calls).

| Step | Calculation | Result |
| - | ----------- | ------ |
| Monthly actions | 800 million × 15 | 12 billion actions |
| Actions per second | 12 billion ÷ 2,628,000 | ≈ 4,571 actions/second |
| Required CUs | 4,571 ÷ 2,000 | CUs needed: 2.29 → **3 CUs sufficient** |

## Consumption SKU

The Consumption SKU offers a pay-as-you-use model, ideal for variable workloads and development scenarios. 

You can create up to 10 schedulers and 5 task hubs per region per subscription with the Consumption SKU. For more quota, [contact support](https://github.com/Azure/azure-functions-durable-extension/issues).

### Key features

| Feature | Description |
| - | - |
| Pay-per-use | Pay only for actions dispatched. No upfront costs, minimum commitments, or base fees. |
| Performance | Supports up to 500 actions per second. |
| Data retention | Retains data for a maximum of 30 days. |

### Example 1

A development team is testing simple orchestrations, each with three actions (using [the "Hello City" pattern](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-functions/dotnet/HelloCities)), and runs 10,000 orchestrations per month.

| Step | Calculation | Result |
| - | ----------- | ------ |
| Monthly actions | 10,000 × 3 | 30,000 actions |

### Example 2

An e-commerce application experiences dynamic scaling during promotional sales events. It uses an orchestration that has seven total actions, which runs approximately 20,000 times per month.

| Step | Calculation | Result |
| - | ----------- | ------ |
| Monthly actions | 20,000 × 7 | 140,000 actions |

## Compute costs

In addition to the Durable Task Scheduler, you pay for the compute platform that hosts your application. Your compute costs depend on the orchestration framework you use.

### Durable Functions

Durable Functions runs on [Azure Functions](../../azure-functions/functions-overview.md). Your compute costs depend on the Azure Functions hosting plan you choose:

| Hosting plan | Description |
| --- | --- |
| **Consumption plan** | Pay only for the time your functions run. Includes automatic scaling and a free monthly grant. |
| **Flex Consumption plan** | Event-driven scaling with virtual network integration. Pay for instances during request processing, plus an always-ready baseline. |
| **Premium plan** | Prewarmed instances to avoid cold starts, with virtual network connectivity. Billed per vCPU and memory second. |
| **Dedicated (App Service) plan** | Run functions on dedicated virtual machines within an App Service plan. Best when you have underused VMs that already run other App Service instances. |

For detailed Durable Functions billing behaviors (replay billing, awaiting, HTTP polling), see [Durable Functions billing](../../azure-functions/durable-functions/durable-functions-billing.md). For Azure Functions pricing, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

### Durable Task SDKs

The Durable Task SDKs are platform-agnostic and can run on different compute platforms:

| Compute platform | Description |
| --- | --- |
| **Azure Container Apps** | Serverless container hosting with consumption-based or dedicated pricing. Billed for vCPU and memory usage. |
| **Azure Kubernetes Service (AKS)** | Managed Kubernetes clusters where you pay for the virtual machines (nodes) in your cluster. |
| **Azure App Service** | Fully managed platform for hosting web applications with different pricing tiers based on features and scale. |

For detailed pricing information, see the billing documentation for each compute service:

- [Azure Container Apps billing](../../container-apps/billing.md)
- [Understand Azure Kubernetes Service costs](/azure/aks/understand-aks-costs)
- [Plan and manage costs for Azure App Service](../../app-service/overview-manage-costs.md)

## Related content

- [Quickstart: Host a Durable Task SDK app on Azure Container Apps](../sdks/quickstart-container-apps-durable-task-sdk.md)
- [Durable Task Scheduler pricing](https://azure.microsoft.com/pricing/details/durable-task-scheduler/)
- [Throughput performance benchmarks](./durable-task-scheduler-work-item-throughput.md)
- [Choose your orchestration framework](../common/choose-orchestration-framework.md)
- [Durable Functions billing](../../azure-functions/durable-functions/durable-functions-billing.md)