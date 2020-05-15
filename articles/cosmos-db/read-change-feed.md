---
title: Accessing change feed in Azure Cosmos DB Azure Cosmos DB 
description: This article describes different options available to read and access change feed in Azure Cosmos DB.  
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2020
ms.reviewer: sngun
---

# Reading Azure Cosmos DB change feed

You can work with the Azure Cosmos DB change feed using any of the following options:

* Using Azure Functions
* Using the change feed processor
* Using the Azure Cosmos DB SQL API SDK
* Using the change feed pull model (preview)

## Using Azure Functions

Azure Functions is the simplest and recommended option. When you create an Azure Functions trigger for Cosmos DB, you can select the container to connect, and the Azure Function gets triggered whenever there is a change to the container. Triggers can be created by using the Azure Functions portal, the Azure Cosmos DB portal or programmatically with SDKs. Visual Studio and VS Code provide support to write Azure Functions, and you can even use the Azure Functions CLI for cross-platform development. You can write and debug the code on your desktop, and then deploy the function with one click. See [Serverless database computing using Azure Functions](serverless-computing-database.md) and [Using change feed with Azure Functions](change-feed-functions.md)) articles to learn more.

## Using the change feed processor

The change feed processor hides complexity and still gives you a complete control of the change feed. The library follows the observer pattern, where your processing function is called by the library. If you have a high throughput change feed, you can instantiate multiple clients to read the change feed. Because you're using change feed processor library, it will automatically divide the load among the different clients without you having to implement this logic. All the complexity is handled by the library. To learn more, see [using change feed processor](change-feed-processor.md). The change feed processor is part of the [Azure Cosmos DB SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3).

## Using the Azure Cosmos DB SQL API SDK

With the SDK, you get a low-level control of the change feed. You can manage the checkpoint, access a particular logical partition key, etc. If you have multiple readers, you can use `ChangeFeedOptions` to distribute read load to different threads or different clients.

## Using the change feed pull model

The [change feed pull model](change-feed-pull-model.md) allows you to consume the change feed at your own pace and parallelize processing of changes with FeedRanges. A FeedRange spans a range of partition key values. Using the change feed pull model, it is also easy to process changes for a specific partition key.

> [!NOTE]
> The change feed pull model is currently in [preview in the Azure Cosmos DB .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.9.0-preview) only. The preview is not yet available for other SDK versions.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change stream in MongoDB API and Query with predicate in Cassandra API. To learn more about the implementation details for MongoDB API, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb-change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival as well as rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB API for Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB API for Cassandra](cassandra-change-feed.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Overview of change feed](change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor library](change-feed-processor.md)
