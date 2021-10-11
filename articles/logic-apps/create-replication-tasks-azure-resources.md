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
| Azure Event Hubs | - Replicate to an Event Hub: Replicate from the current namespace to a specified target. <p>- Replicate from an Event Hub: Replicate from a specified target to the current namespace. |
| Azure Service Bus | - Replicate to Service Bus queue: Replicate events from the current namespace to a specified target. <p>- Replicate from Service Bus queue: Replicate events from a specified target to the current namespace. <p>- Replicate from Service Bus topic subscription: Replicate events from the current namespace to a specified target. |
|||

## Retry policy

To avoid data loss during an availability event on either side of a replication relationship, you need to configure the retry policy for robustness. Refer to the Azure Functions documentation on retries to configure the retry policy.

The policy settings chosen for the example projects in the sample repository configure an exponential backoff strategy with retry intervals from 5 seconds to 15 minutes with infinite retries to avoid data loss.

For Service Bus, review the "using retry support on top of trigger resilience" section to understand the interaction of triggers and the maximum delivery count defined for the queue.