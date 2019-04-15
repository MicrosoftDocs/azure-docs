---
title: How to create multiple independent Azure Cosmos DB Triggers
description: Learn how to configure multiple independent Azure Cosmos DB Triggers to create event-driven Azure Functions architectures.
author: ealsur
ms.service: cosmos-db
ms.topic: sample
ms.date: 4/15/2019
ms.author: maquaran
---

# Create multiple Azure Cosmos DB Triggers

This article describes how you can configure multiple Cosmos DB Triggers to work in parallel and independently react to changes.

![Serverless event-based Functions working with the Azure Cosmos DB Trigger and sharing a leases container](./media/change-feed-functions/multi-trigger.png)

## Event-based architecture requirements

When building serverless architectures with [Azure Functions](../azure-functions/functions-overview.md), it's often recommended to make your Functions as small and quick as possible.

As you build event-based serverless flows using the [Azure Cosmos DB Trigger](./change-feed-functions.md), you'll  run into the scenario where you want to do multiple things whenever there is a new event or data in a particular [container](./databases-containers-items.md#azure-cosmos-containers). If these actions you want to start are independent from one another, the ideal solution would be to **create one Cosmos DB Trigger per action** you want to do, all listening for changes on the same container.

But reading through the *requirements* for the Cosmos DB Trigger, we see that it requires a second container to store state, also called, the *leases container*. Does this mean that you need a separate leases container for each Function?

## Optimizing containers for multiple Triggers

At this point, you have two options:

* Create one leases container **per Function**: This approach can translate into additional costs, unless you're using [Shared Throughput Databases](./set-throughput.md#set-throughput-on-a-database). Remember that the minimum throughput at the container level is 400 [Request Units](./request-units.md), and it the case of the leases container, it's only being used to checkpoint the progress and maintain state.
* Have one lease container and **share it** for all your Functions: This second option makes better use of the provisioned Request Units of the container, as it enables multiple Functions to share and use the same throughput budget.

The goal of this article is to guide you in the simple task of achieving the second option.

## Configuring your Triggers for a shared leases container

The only extra configuration you need to make on your Triggers is to add the `LeaseCollectionPrefix` (C#) / `leaseCollectionPrefix` (Javascript) [attribute](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---configuration). The value of the attribute should be a logical descriptor of what that particular Trigger's work is.

For example, if you have three Triggers, one that sends emails, one that does an aggregation for to create a materialized view, and one that sends the changes to another storage for later analysis, you could assign the `LeaseCollectionPrefix` of "emails" to the first one, "materialized" to the second one, and "analytics" to the third one.

The important part is that all three Triggers **can use the same leases container configuration** (account, database, and container name).

> [!NOTE]
> Always keep watch on the Request Units consumption on your shared leases container. Each Trigger that shares it, will increase the throughput average consumption, so you might need to increase the provisioned throughput as you increase the amount of Functions that are using it.