---
title: Create replication tasks for Azure resources and events
description: Replicate Azure resources to forward events using workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/22/2021
---

# Create replication tasks to forward events from Azure resources using Azure Logic Apps (preview)

> [!IMPORTANT]
> This capability is in preview, is not recommended for production workloads, and is excluded from service level agreements. 
> Certain features might not be supported or might have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To reduce the impact that unpredictable events can have on your Azure resources, you can replicate these resources to help you maintain [*business continuity (BC)*](https://en.wikipedia.org/wiki/Business_continuity_planning). You can create a *replication task* that copies a resource into a different region and forwards content from the source resource to the target resource. That way, you can have the target resource readily available if the source goes offline and the target has to take over.

> [!NOTE]
> Currently, replication tasks are available only for Azure Event Hubs and Azure Service Bus.

This article provides a brief overview about replication tasks and shows how to create example replication tasks for Azure Event Hubs and Azure Service Bus. Each replication task is powered by a stateless workflow in a Standard logic app resource, which is hosted in single-tenant Azure Logic Apps. If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md) and [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks forward events and payloads unchanged. At most, if the source and target protocols differ, these tasks perform mappings between metadata structures. Replication tasks are generally stateless, meaning that they don't share states or other side-effects across parallel or sequential executions of a task.

Replication don't aim to exactly create exact 1:1 clones of a source to a target. Instead, replication focuses on preserving the relative order of events where required by grouping related events with the same partition key and Event Hubs arranges messages with the same partition key sequentially in the same partition.

The following table lists the currently available replication task templates in this preview:

| Resource type | Replication task templates |
|---------------|----------------------------|
| Azure Event Hubs | - **Replicate to Event Hubs instance**: Replicate content between two Event Hubs instances. <br>- **Replicate from Event Hubs instance to Service Bus queue** <br>- **Replicate from Event Hubs instance to Service Bus topic** |
| Azure Service Bus | - **Replicate to Service Bus**: Replicate content between two Service Bus namespaces. <br>- **Replicate to Service Bus queue**: Replicate content between two Service Bus queues. <br>- **Replicate from Service Bus queue to Service Bus topic** <br>- **Replicate from Service Bus topic subscription to Service Bus queue** <br>- **Replicate from Service Bus topic subscription to Event Hubs instance** |
|||

<a name="pricing"></a>

## Pricing

When you create a replication task, charges start incurring immediately. Underneath, a replication task is powered by a stateless workflow in a logic app resource that's hosted in single-tenant Azure Logic Apps. So, the [Standard pricing model](logic-apps-pricing.md) and [Standard plan rates](https://azure.microsoft.com/pricing/details/logic-apps/) applies to replication tasks. Metering and billing are based on the hosting plan and pricing tier that's used for the underlying logic app workflow.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Based on the template that you choose, the source and target Azure resources, which should exist in different Azure regions. You can also create the target resource when you create the replication task.

<a name="create-replication-task"></a>

## Create a replication task

1. In the [Azure portal](https://portal.azure.com), find the Azure resource that you want to replicate.

   Currently, replication tasks are available only for Event Hubs instances and Service Bus namespaces.

1. On the resource navigation menu, in the **Automation** section, and select **Tasks (preview)**.

   ![Screenshot showing Azure Service Bus instance with "Automation" section and "Tasks (preview)" selected.](./media/create-replication-tasks-azure-resources/service-bus-automation-menu.png)

1. On the **Tasks** pane, select **Add a task** so that you can select a task template.

1. On the **Add a task** pane, under **Select a template**, select the template for the replication task that you want to create. If the next page doesn't appear, select **Next: Authenticate**.

   This example continues by selecting the **Replicate to Service Bus** task template.

1. Under **Authenticate**, in the **Connections** section, select **Create** for every connection that appears in the task so that you can provide authentication credentials for all the connections. The types of connections in each task vary based on the task.

   This example shows only one of the connections that's required by this task.

1. When you're prompted, sign in with your Azure account credentials.

   Each successfully authenticated connection looks similar to this example:

1. After you authenticate all the connections, select **Next: Configure** if the next page doesn't appear.

1. Under **Configure**, provide a name for the task and any other information required for the task. When you're done, select **Review + create**.

   > [!NOTE]
   > You can't change the task name after creation, so consider a name that still applies if you [edit the underlying workflow](#edit-task-workflow). 
   > Changes that you make to the underlying workflow apply only to the task that you created, not the task template.
   >
   > For example, if you name your task `SendMonthlyCost`, but you later edit the underlying workflow to run weekly, 
   > you can't change your task's name to `SendWeeklyCost`.

   The task that you created, which is automatically live and running, now appears on the **Tasks** list.

   > [!TIP]
   > If the task doesn't appear immediately, try refreshing the tasks list or wait a little before you refresh. On the toolbar, select **Refresh**.

## Set up retry policy

To avoid data loss during an availability event on either side of a replication relationship, you need to configure the retry policy for robustness. Refer to the Azure Functions documentation on retries to configure the retry policy.

The policy settings chosen for the example projects in the sample repository configure an exponential backoff strategy with retry intervals from 5 seconds to 15 minutes with infinite retries to avoid data loss.

For Service Bus, review the "using retry support on top of trigger resilience" section to understand the interaction of triggers and the maximum delivery count defined for the queue.
