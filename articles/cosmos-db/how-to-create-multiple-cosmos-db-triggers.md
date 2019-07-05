---
title: How to create multiple independent Azure Cosmos DB Triggers
description: Learn how to configure multiple independent Azure Cosmos DB Triggers to create event-driven Azure Functions architectures.
author: ealsur
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/23/2019
ms.author: maquaran
---

# Create multiple Azure Cosmos DB Triggers

This article describes how you can configure multiple Cosmos DB Triggers to work in parallel and independently react to changes.

![Serverless event-based Functions working with the Azure Cosmos DB Trigger and sharing a leases container](./media/change-feed-functions/multi-trigger.png)

## Event-based architecture requirements

When building serverless architectures with [Azure Functions](../azure-functions/functions-overview.md), it's [recommended](../azure-functions/functions-best-practices.md#avoid-long-running-functions) to create small function sets that work together instead of large long running functions.

As you build event-based serverless flows using the [Azure Cosmos DB Trigger](./change-feed-functions.md), you'll  run into the scenario where you want to do multiple things whenever there is a new event in a particular [Azure Cosmos container](./databases-containers-items.md#azure-cosmos-containers). If actions you want to trigger, are independent from one another, the ideal solution would be to **create one Cosmos DB Trigger per action** you want to do, all listening for changes on the same Azure Cosmos container.

## Optimizing containers for multiple Triggers

Given the *requirements* of the Cosmos DB Trigger, we need a second container to store state, also called, the *leases container*. Does this mean that you need a separate leases container for each Azure Function?

Here, you have two options:

* Create **one leases container per Function**: This approach can translate into additional costs, unless you're using a [shared throughput database](./set-throughput.md#set-throughput-on-a-database). Remember, that the minimum throughput at the container level is 400 [Request Units](./request-units.md), and in the case of the leases container, it is only being used to checkpoint the progress and maintain state.
* Have **one lease container and share it** for all your Functions: This second option makes better use of the provisioned Request Units on the container, as it enables multiple Azure Functions to share and use the same provisioned throughput.

The goal of this article is to guide you to accomplish the second option.

## Configuring a shared leases container

To configure the shared leases container, the only extra configuration you need to make on your triggers is to add the `LeaseCollectionPrefix` [attribute](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---c-attributes) if you are using C# or `leaseCollectionPrefix` [attribute](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---javascript-example) if you are using JavaScript. The value of the attribute should be a logical descriptor of what that particular trigger.

For example, if you have three Triggers: one that sends emails, one that does an aggregation to create a materialized view, and one that sends the changes to another storage, for later analysis, you could assign the `LeaseCollectionPrefix` of "emails" to the first one, "materialized" to the second one, and "analytics" to the third one.

The important part is that all three Triggers **can use the same leases container configuration** (account, database, and container name).

A very simple code samples using the `LeaseCollectionPrefix` attribute in C#, would look like this:

```cs
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

[FunctionName("SendEmails")]
public static void SendEmails([CosmosDBTrigger(
    databaseName: "ToDoItems",
    collectionName: "Items",
    ConnectionStringSetting = "CosmosDBConnection",
    LeaseCollectionName = "leases",
    LeaseCollectionPrefix = "emails")]IReadOnlyList<Document> documents,
    ILogger log)
{
    ...
}

[FunctionName("MaterializedViews")]
public static void MaterializedViews([CosmosDBTrigger(
    databaseName: "ToDoItems",
    collectionName: "Items",
    ConnectionStringSetting = "CosmosDBConnection",
    LeaseCollectionName = "leases",
    LeaseCollectionPrefix = "materialized")]IReadOnlyList<Document> documents,
    ILogger log)
{
    ...
}
```

And for JavaScript, you can apply the configuration on the `function.json` file, with the `leaseCollectionPrefix` attribute:

```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "CosmosDBConnection",
    "databaseName": "ToDoItems",
    "collectionName": "Items",
    "leaseCollectionPrefix": "emails"
},
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "CosmosDBConnection",
    "databaseName": "ToDoItems",
    "collectionName": "Items",
    "leaseCollectionPrefix": "materialized"
}
```

> [!NOTE]
> Always monitor on the Request Units provisioned on your shared leases container. Each Trigger that shares it, will increase the throughput average consumption, so you might need to increase the provisioned throughput as you increase the number of Azure Functions that are using it.

## Next steps

* See the full configuration for the [Azure Cosmos DB Trigger](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---configuration)
* Check the extended [list of samples](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---example) for all the languages.
* Visit the Serverless recipes with Azure Cosmos DB and Azure Functions [GitHub repository](https://github.com/ealsur/serverless-recipes/tree/master/cosmosdbtriggerscenarios) for more samples.