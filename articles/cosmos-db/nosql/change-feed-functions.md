---
title: How to use Azure Cosmos DB change feed with Azure Functions
description: Use Azure Functions to connect to Azure Cosmos DB change feed. Later you can create reactive Azure functions that are triggered on every new event.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, build-2023
ms.topic: conceptual
ms.date: 05/10/2023
---

# Serverless event-based architectures with Azure Cosmos DB and Azure Functions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Functions provides the simplest way to connect to the [change feed](../change-feed.md). You can create small reactive Azure Functions that will be automatically triggered on each new event in your Azure Cosmos DB container's change feed.

:::image type="content" source="./media/change-feed-functions/functions.png" alt-text="Serverless event-based Functions working with the Azure Functions trigger for Azure Cosmos DB" border="false":::

With the [Azure Functions trigger for Azure Cosmos DB](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md), you can leverage the [Change Feed Processor](change-feed-processor.md)'s scaling and reliable event detection functionality without the need to maintain any [worker infrastructure](change-feed-processor.md). Just focus on your Azure Function's logic without worrying about the rest of the event-sourcing pipeline. You can even mix the Trigger with any other [Azure Functions bindings](../../azure-functions/functions-triggers-bindings.md#supported-bindings).

> [!NOTE]
> The Azure Functions trigger uses [latest version change feed mode.](change-feed-modes.md#latest-version-change-feed-mode) Currently, the Azure Functions trigger for Azure Cosmos DB is supported for use with the API for NoSQL only.

## Requirements

To implement a serverless event-based flow, you need:

* **The monitored container**: The monitored container is the Azure Cosmos DB container being monitored, and it stores the data from which the change feed is generated. Any inserts, updates to the monitored container are reflected in the change feed of the container.
* **The lease container**: The lease container maintains state across multiple and dynamic serverless Azure Function instances and enables dynamic scaling. You can create the lease container automatically with the Azure Functions trigger for Azure Cosmos DB. You can also create the lease container manually. To automatically create the lease container, set the *CreateLeaseContainerIfNotExists* flag in the [configuration](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md?tabs=extensionv4&pivots=programming-language-csharp#attributes). Partitioned lease containers are required to have a `/id` partition key definition.

## Create your Azure Functions trigger for Azure Cosmos DB

Creating your Azure Function with an Azure Functions trigger for Azure Cosmos DB is now supported across all Azure Functions IDE and CLI integrations:

* [Visual Studio Extension](../../azure-functions/functions-develop-vs.md) for Visual Studio users.
* [Visual Studio Code Extension](/azure/developer/javascript/tutorial-vscode-serverless-node-01) for Visual Studio Code users.
* And finally [Core CLI tooling](../../azure-functions/functions-run-local.md#create-func) for a cross-platform IDE agnostic experience.

## Run your trigger locally

You can run your [Azure Function locally](../../azure-functions/functions-develop-local.md) with the [Azure Cosmos DB Emulator](../emulator.md) to create and develop your serverless event-based flows without an Azure Subscription or incurring any costs.

If you want to test live scenarios in the cloud, you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without any credit card or Azure subscription required.

## Next steps

You can now continue to learn more about change feed in the following articles:

* [Overview of change feed](../change-feed.md)
* [Ways to read change feed](read-change-feed.md)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](change-feed-processor.md)
* [Serverless database computing using Azure Cosmos DB and Azure Functions](serverless-computing-database.md)
