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

To reduce the impact that unpredictable events can have on your Azure resources, you can replicate these resources to help you maintain [*business continuity (BC)*](https://en.wikipedia.org/wiki/Business_continuity_planning). You can create a *replication task* to copy a resource into another region and forward events so that you can have the target resource readily available if you need to switch over.

This article shows how to create example replication tasks for Azure Event Hubs and Azure Service Bus. Each replication task is powered by a stateless workflow in a Standard logic app resource type, which is hosted in single-tenant Azure Logic Apps. If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md) and [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

## What is a replication task?

A replication task receives events from a source and forwards them to a target. Most replication tasks forward events and payloads unchanged. At most, if the source and target protocols differ, these tasks perform mappings between metadata structures. Replication tasks are generally stateless, meaning that they don't share states or other side-effects across parallel or sequential executions of a task.

Replication don't aim to exactly create exact 1:1 clones of a source to a target. Instead, replication focuses on preserving the relative order of events where required by grouping related events with the same partition key and Event Hubs arranges messages with the same partition key sequentially in the same partition.

Here are the currently available replication task templates in this preview:

| Resource type | Replication task template |
|---------------|---------------------------|
| Azure Event Hubs | - Replicate to Event Hubs: Replicate content between two Event Hubs instances. |
| Azure Service Bus | - Replicate to Service Bus: Replicate content between two Service Bus namespaces. <p>- Copy new messages from Service Bus queue to Storage container: When a new message arrives in a queue, create a blob to store the message. |
|||

## Retry policy

To avoid data loss during an availability event on either side of a replication relationship, you need to configure the retry policy for robustness. Refer to the Azure Functions documentation on retries to configure the retry policy.

The policy settings chosen for the example projects in the sample repository configure an exponential backoff strategy with retry intervals from 5 seconds to 15 minutes with infinite retries to avoid data loss.

For Service Bus, review the "using retry support on top of trigger resilience" section to understand the interaction of triggers and the maximum delivery count defined for the queue.

<a name="pricing"></a>

## Pricing

When you create a replication task, charges start incurring immediately. Underneath, a replication is a single-tenant based logic app, so the [Standard pricing model](logic-apps-pricing.md) and [Standard plan rates](https://azure.microsoft.com/pricing/details/logic-apps/) applies to replication tasks. Metering and billing are based on the hosting plan and pricing tier that's used for the underlying logic app workflow.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Based on the template that you choose, the source and target Azure resources, specifically:

  | Replication task template | Resources |
  |---------------------------|-----------|
  | Replicate to Event Hubs | The source and target Event Hubs instances. You can also create the target instance when you create the replication task. |
  | Replicate to Service Bus | The source and target Service Bus namespaces. You can also create the target namespace when you create the replication task. |
  | Copy new messages from Service Bus queue to Storage container | The source Service Bus queue and the target Blob Storage container. You can also create the storage container when you create the replication task. |
  |||

* An Office 365 account if you want to follow along with the example, which sends you email by using Office 365 Outlook.

<a name="create-replication-task"></a>

## Create a replication task

