---
title: How to use Azure Cosmos DB change feed with Azure Functions
description: Use Azure Cosmos DB change feed with Azure Functions 
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/12/2019
ms.author: rimman
ms.reviewer: sngun
---

# Serverless event-based flows with Azure Functions and Azure Cosmos DB

Azure Functions provides the simplest way to connect to the Change Feed. You can create small reactive Functions that will be automatically triggered on each new event in your Azure Cosmos DB container’s Change Feed.

![Serverless event-based Functions working with the Azure Cosmos DB Trigger](./media/change-feed-functions/functions.png)

With the [Azure Cosmos DB Trigger](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger), you can leverage the Change Feed Processor scalability and reliable event detection without the need to maintain any worker infrastructure. Just focus on what you want your Function to do and leave the heavy lifting to us. You can even mix the Trigger with any other [Azure Functions bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings).

> [!NOTE]
> Currently, the Azure Cosmos DB trigger is supported for use with the SQL(Core) API only.

## Requirements

To implement a serverless event-based flow, you need:

* **The monitored container**: The monitored container has the data from which the change feed is generated. Any inserts and changes to the monitored container are reflected in the change feed of the container.
* **The lease container**: The lease container maintains state across multiple and dynamic serverless Function instances and enables dynamic scaling. This lease container can be pre-created or automatically created by the Azure Cosmos DB Trigger if you set the *CreateLeaseCollectionIfNotExists* flag in the [configuration](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---configuration). Partitioned lease containers are required to have a `/id` Partition Key definition.

## Creating your Azure Cosmos DB Trigger

Creating your Function with an Azure Cosmos DB Trigger is now supported across all Azure Functions IDE and CLI integrations:

* [Visual Studio Extension](../azure-functions/functions-develop-vs.md) for Visual Studio users.
* [Visual Studio Core Extension](https://code.visualstudio.com/tutorials/functions-extension/create-function) for Visual Studio Code users.
* And finally [Core CLI tooling](../azure-functions/functions-run-local.md#create-func) for a cross-platform IDE agnostic experience.

## Running your Azure Cosmos DB Trigger locally

You can run your [Azure Function locally](../azure-functions/functions-develop-local.md) with the [Azure Cosmos DB Emulator](./local-emulator.md) to create and develop your serverless event-based flows without an Azure Subscription.

And if you want to test live scenarios, you can [Try Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without any credit card or Azure subscription required.

## Next steps

You can now continue to learn more about change feed in the following articles:

* [Overview of change feed](change-feed.md)
* [Ways to read change feed](read-change-feed.md)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](change-feed-processor.md)
* [Serverless database computing using Azure Cosmos DB and Azure Functions](serverless-computing-database.md)
