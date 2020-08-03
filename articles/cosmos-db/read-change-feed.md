---
title: Reading Azure Cosmos DB change feed
description: This article describes different options available to read and access change feed in Azure Cosmos DB.  
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020
ms.reviewer: sngun
---

# Reading Azure Cosmos DB change feed

You can work with the Azure Cosmos DB change feed using either a push model or a pull model. With a push model, a client requests work from a server and has business logic for processing a change. However, the complexity in checking for changes and storing state for the last processed changes is handled on the server.

With a pull model, a server requests work, often requesting it from a central work queue. The client, in this case, not only has business logic for processing changes but also storing state for the last processed change, handling load balancing across multiple clients processing changes in parallel, and handling errors.

When reading from the Azure Cosmos DB change feed, we usually recommend using a push model because you won't need to worry about:

- Polling the change feed for future changes.
- Storing state for the last processed change. When reading from the change feed, this is automatically stored in a [lease container](change-feed-processor.md#components-of-the-change-feed-processor).
- Load balancing across multiple clients consuming changes. For example, if one client can't keep up with processing changes and another has available capacity.
- [Handling errors](change-feed-processor.md#error-handling). For example, automatically retrying failed changes that weren't correctly processed after an unhandled exception in code or a transient network issue.

The majority of scenarios that use the Azure Cosmos DB change feed will use one of the push model options. However, there are some scenarios where you might want the additional low level control of the pull model. These include:

- Reading changes from a particular partition key
- Controlling the pace at which your client receives changes for processing
- Doing a one-time read of the existing data in the change feed (for example, to do a data migration)

## Reading change feed with a push model

Using a push model is the easiest way to read from the change feed. There are two ways you can read from the change feed with a push model: [Azure Functions Cosmos DB triggers](change-feed-functions.md) and the [change feed processor library](change-feed-processor.md). Azure Functions uses the change feed processor behind the scenes, so these are both very similar ways to read the change feed. Think of Azure Functions as simply a hosting platform for the change feed processor, not an entirely different way of reading the change feed.

### Azure Functions

Azure Functions is the simplest option if you are just getting started using the change feed. Due to its simplicity, it is also the recommended option for most change feed use cases. When you create an Azure Functions trigger for Azure Cosmos DB, you select the container to connect, and the Azure Function gets triggered whenever there is a change in the container. Because Azure Functions uses the change feed processor behind the scenes, it automatically parallelizes change processing across your container's [partitions](partition-data.md).

Developing with Azure Functions is an easy experience and can be faster than deploying the change feed processor on your own. Triggers can be created using the Azure Functions portal or programmatically using SDKs. Visual Studio and VS Code provide support to write Azure Functions, and you can even use the Azure Functions CLI for cross-platform development. You can write and debug the code on your desktop, and then deploy the function with one click. See [Serverless database computing using Azure Functions](serverless-computing-database.md) and [Using change feed with Azure Functions](change-feed-functions.md) articles to learn more.

### Change feed processor library

The change feed processor gives you more control of the change feed and still hides most complexity. The change feed processor library follows the observer pattern, where your processing function is called by the library. The change feed processor library will automatically check for changes and, if changes are found, "push" these to the client. If you have a high throughput change feed, you can instantiate multiple clients to read the change feed. The change feed processor library will automatically divide the load among the different clients. You won't have to implement any logic for load balancing across multiple clients or any logic to maintain the lease state.

The change feed processor library guarantees an "at-least-once" delivery of all of the changes. In other words, if you use the change feed processor library, your processing function will be called successfully for every item in the change feed. If there is an unhandled exception in the business logic in your processing function, the failed changes will be retried until they are processed successfully. To prevent your change feed processor from getting "stuck" continuously retrying the same changes, add logic in your processing function to write documents, upon exception, to a dead-letter queue. Learn more about [error handling](change-feed-processor.md#error-handling).

In Azure Functions, the recommendation for handling errors is the same. You should still add logic in your delegate code to write documents, upon exception, to a dead-letter queue. However, if there is an unhandled exception in your Azure Function, the change that generated the exception won't be automatically retried. If there is an unhandled exception in the business logic, the Azure Function will move on to processing the next change. The Azure Function won't retry the same failed change.

Like Azure Functions, developing with the change feed processor library is easy. However, you are responsible for deploying one or more hosts for the change feed processor. A host is an application instance that uses the change feed processor to listen for changes. While Azure Functions has capabilities for automatic scaling, you are responsible for scaling your hosts. To learn more, see [using the change feed processor](change-feed-processor.md#dynamic-scaling). The change feed processor library is part of the [Azure Cosmos DB SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3).

## Reading change feed with a pull model

The [change feed pull model](change-feed-pull-model.md) allows you to consume the change feed at your own pace. Changes must be requested by the client and there is no automatic polling for changes. If you want to permanently "bookmark" the last processed change (similar to the push model's lease container), you'll need to [save a continuation token](change-feed-pull-model.md#saving-continuation-tokens).

Using the change feed pull model, you get more low level control of the change feed. When reading the change feed with the pull model, you have three options:

- Read changes for an entire container
- Read changes for a specific [FeedRange](change-feed-pull-model.md#using-feedrange-for-parallelization)
- Read changes for a specific partition key value

You can parallelize the processing of changes across multiple clients, just as you can with the change feed processor. However, the pull model does not automatically handle load-balancing across clients. When you use the pull model to parallelize processing of the change feed, you'll first obtain a list of FeedRanges. A FeedRange spans a range of partition key values. You'll need to have an orchestrator process that obtains FeedRanges and distributes them among your machines. You can then use these FeedRanges to have multiple machines read the change feed in parallel.

There is no built-in "at-least-once" delivery guarantee with the pull model. The pull model gives you low level control to decide how you would like to handle errors.

> [!NOTE]
> The change feed pull model is currently in [preview in the Azure Cosmos DB .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.9.0-preview) only. The preview is not yet available for other SDK versions.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change streams in MongoDB API and Query with predicate in Cassandra API. To learn more about the implementation details for MongoDB API, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb-change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival as well as rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB API for Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB API for Cassandra](cassandra-change-feed.md).

## Next steps

You can now continue to learn more about change feed in the following articles:

* [Overview of change feed](change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor library](change-feed-processor.md)
