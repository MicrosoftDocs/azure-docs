---
title: Working with the change feed support in Azure Cosmos DB 
description: Use Azure Cosmos DB change feed support to track changes in documents, event-based processing like triggers, and keep caches and analytic systems up-to-date 
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/09/2023
ms.custom: seodec18, seo-nov-2020, ignite-2022
---
# Change feed in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin](includes/appliesto-nosql-mongodb-cassandra-gremlin.md)]

Change feed in Azure Cosmos DB is a persistent record of changes to a container in the order they occur. Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos DB container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The persisted changes can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing.

Learn more about [change feed design patterns](change-feed-design-patterns.md).

## Supported APIs and client SDKs

This feature is currently supported by the following Azure Cosmos DB APIs and client SDKs.

| **Client drivers** | **NoSQL** | **Apache Cassandra** | **MongoDB** | **Apache Gremlin** | **Table** |
| --- | --- | --- | --- | --- | --- | --- |
| .NET | Yes | Yes | Yes | Yes | No |
|Java|Yes|Yes|Yes|Yes|No|
|Python|Yes|Yes|Yes|Yes|No|
|Node/JS|Yes|Yes|Yes|Yes|No|

## Working with change feed

You can work with change feed using the following options:

* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed with change feed processor](change-feed-processor.md) 
* [Using change feed with pull model](nosql/change-feed-pull-model.md) 

Change feed is available for partition key ranges of an Azure Cosmos DB container. This allows it to be distributed across one or more consumers for parallel processing as shown in the image below.  

:::image type="content" source="./media/change-feed/changefeedvisual.png" alt-text="Distributed processing of Azure Cosmos DB change feed" border="false":::

> [!NOTE]
> Partition key ranges map to physical partitions when using the [change feed processor](nosql/change-feed-processor.md) and `FeedRanges` when using the [pull model](nosql/change-feed-pull-model.md).

## Features of change feed

* Change feed is enabled by default for all Azure Cosmos DB accounts. 

* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Azure Cosmos DB operation, in any of the regions associated with your Azure Cosmos DB account.

* The change feed includes inserts and update operations made to items within the container. If you are using [all versions and deletes mode (preview)](#all-versions-and-deletes-mode-preview), you will also get changes from delete operations and TTL expirations.

* Each change appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor provides automatic checkpointing and "at least once" semantics. [using change feed with change feed processor](change-feed-processor.md).

* Changes from different partitions can be processed in parallel by multiple consumers. 

* Applications can request multiple change feeds on the same container simultaneously. 

* The starting point for change feed can be customized to be from the beginning of the container, from a point in time, or from "now". The precision of the start time is ~5 secs.

### Sort order of items in change feed

Change feed items come in the order of their modification time. This sort order is guaranteed per logical partition key, and there is no guaranteed order across the partition key values.

### Consistency level

While consuming the change feed in an Eventual consistency level, there could be duplicate events in-between subsequent change feed read operations (the last event of one read operation appears as the first of the next).

### Change feed in multi-region Azure Cosmos DB accounts

In a multi-region Azure Cosmos DB account, if a write-region fails over, change feed will work across the manual failover operation and it will be contiguous.

## Change feed modes

There are two change feed modes available: latest version mode and all versions and deletes mode. The mode that change feed is read in determines which operations changes are captured from as well as the metadata available for each change. It is possible to consume the change feed in different modes across multiple applications for the same Azure Cosmos DB container.

### Latest version mode

In latest version change feed mode, you see the latest change from an insert or update for all items in the feed, and the feed will be available for the life of the container. There is no indication whether a given change is from an insert or an update operation, and deletes aren't captured. Changes can be read from any point in time as far back as the origin of your container, but if an item is deleted, it will be removed from the change feed. See the [latest version change feed mode](nosql/change-feed-latest-version.md) article to learn more.

### All versions and deletes mode (preview)

All versions and deletes (preview) mode allows you to see all changes to items from creates, updates, and deletes. You will get a record of each change to items in the order that it occurred, including intermediate changes to an item between change feed reads. To read from the change feed in all versions and deletes mode, you must have [continuous backups](continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account which creates Azure Cosmos DB’s all versions and deletes change log. In this mode, you will only be able to read changes that occurred within the continuous backup period configured for the account. See the [all versions and deletes change feed mode](nosql/change-feed-all-versions-and-deletes.md) article to learn more, including how to enroll in the preview.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change stream in API for MongoDB and Query with predicate in API for Cassandra. To learn more about the implementation details for API for MongoDB, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb/change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival as well as rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB for Apache Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB for Apache Cassandra](cassandra/change-feed.md).

## Measuring change feed request unit consumption

Use Azure Monitor to measure the request unit (RU) consumption of the change feed. For more information, see [monitor throughput or request unit usage in Azure Cosmos DB](monitor-request-unit-usage.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Options to read change feed](read-change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor](change-feed-processor.md)
