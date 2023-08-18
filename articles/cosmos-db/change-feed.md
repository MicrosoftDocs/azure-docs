---
title: Working with the change feed
titleSuffix: Azure Cosmos DB 
description: Use Azure Cosmos DB change feed to track changes, process events, and keep other systems up-to-date.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/09/2023
ms.custom: seodec18, seo-nov-2020, ignite-2022, build-2023
---

# Change feed in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin](includes/appliesto-nosql-mongodb-cassandra-gremlin.md)]

Change feed in Azure Cosmos DB is a persistent record of changes to a container in the order they occur. Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos DB container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The persisted changes can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing.

Learn more about [change feed design patterns](change-feed-design-patterns.md).

## Supported APIs and client SDKs

The change feed feature is currently supported in the following Azure Cosmos DB SDKs.

| **Client drivers** | **NoSQL** | **Apache Cassandra** | **MongoDB** | **Apache Gremlin** | **Table** | **PostgreSQL** |
| --- | --- | --- | --- | --- | --- | --- |
| .NET | ![Icon indicating that this feature is supported in the .NET SDK for the API for NoSQL.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the .NET SDK for the API for Apache Cassandra.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the .NET SDK for the API for MongoDB.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the .NET SDK for the API for Apache Gremlin.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is not supported in the .NET SDK for the API for Table.](media/change-feed/no-icon.svg) | ![Icon indicating that this feature is not supported in the .NET SDK for the API for PostgreSQL.](media/change-feed/no-icon.svg) |
| Java | ![Icon indicating that this feature is supported in the Java SDK for the API for NoSQL.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Java SDK for the API for Apache Cassandra.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Java SDK for the API for MongoDB.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Java SDK for the API for Apache Gremlin.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is not supported in the Java SDK for the API for Table.](media/change-feed/no-icon.svg) | ![Icon indicating that this feature is not supported in the Java SDK for the API for PostgreSQL.](media/change-feed/no-icon.svg) |
| Python | ![Icon indicating that this feature is supported in the Python SDK for the API for NoSQL.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Python SDK for the API for Apache Cassandra.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Python SDK for the API for MongoDB.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the Python SDK for the API for Apache Gremlin.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is not supported in the Python SDK for the API for Table.](media/change-feed/no-icon.svg) | ![Icon indicating that this feature is not supported in the Python SDK for the API for PostgreSQL.](media/change-feed/no-icon.svg) |
| Node/JavaScript | ![Icon indicating that this feature is supported in the JavaScript SDK for the API for NoSQL.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the JavaScript SDK for the API for Apache Cassandra.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the JavaScript SDK for the API for MongoDB.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is supported in the JavaScript SDK for the API for Apache Gremlin.](media/change-feed/yes-icon.svg) | ![Icon indicating that this feature is not supported in the JavaScript SDK for the API for Table.](media/change-feed/no-icon.svg) | ![Icon indicating that this feature is not supported in the JavaScript SDK for the API for PostgreSQL.](media/change-feed/no-icon.svg) |

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

* There are multiple [change feed modes](#change-feed-modes), some of which require additional configuration to enable.

* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Azure Cosmos DB operation, in any of the regions associated with your Azure Cosmos DB account.

* The change feed includes insert and update operations made to items within the container. If you're using [all versions and deletes mode (preview)](#all-versions-and-deletes-mode-preview), you also get changes from delete operations and TTL expirations.

* Each change appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor provides automatic checkpointing and "at least once" semantics. For more information, see the [using change feed with change feed processor](nosql/change-feed-processor.md) article.

* Changes are available in parallel for partition key ranges of an Azure Cosmos DB container. This capability allows multiple consumers to process changes from large containers in parallel. 

* Applications can request multiple change feeds on the same container simultaneously. 

* The starting point for change feed can be customized and different options are available for each mode.

### Sort order of items in change feed

Change feed items come in the order of their modification time. This sort order is guaranteed per physical partition, and there's no guaranteed order across the partition key values.

### Change feed in multi-region Azure Cosmos DB accounts

In a multi-region Azure Cosmos DB account, changes in one region are available in all regions. If a write-region fails over, change feed works across the manual failover operation, and it's contiguous. For accounts with multiple write regions, there's no guarantee of when changes will be available. Incoming changes to the same document may be dropped in latest version mode if there was a more recent change in another region, and all changes will be captured in all versions and deletes mode.

## Change feed modes

There are two [change feed modes](./nosql/change-feed-modes.md) available: latest version mode and all versions and deletes mode. The mode that change feed is read in determines which operations changes are captured from and the metadata available for each change. It's possible to consume the change feed in different modes across multiple applications for the same Azure Cosmos DB container.

### Latest version mode

In latest version change feed mode, you see the latest change from an insert or update for all items in the feed, and the feed is available for the life of the container. There's no indication whether a given change is from an insert or an update operation, and deletes aren't captured. Changes can be read from any point in time as far back as the origin of your container. However, if an item is deleted it's removed from the change feed. See the [latest version change feed mode](nosql/change-feed-modes.md#latest-version-change-feed-mode) article to learn more.

### All versions and deletes mode (preview)

All versions and deletes mode allows you to see all changes to items from creates, updates, and deletes. You get a record of each change to items in the order that it occurred, including intermediate changes to an item between change feed reads. To read from the change feed in all versions and deletes mode, you must have [continuous backups](continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account, which creates Azure Cosmos DBs all versions and deletes change feed. In this mode, you can only read changes that occurred within the continuous backup period configured for the account. See the [all versions and deletes change feed mode](nosql/change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview) article to learn more, including how to enroll in the preview.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change stream in API for MongoDB and Query with predicate in API for Cassandra. To learn more about the implementation details for API for MongoDB, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb/change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival and rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB for Apache Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB for Apache Cassandra](cassandra/change-feed.md).

## Measuring change feed request unit consumption

The change feed is available in every container regardless of whether it's utilized. The only cost for the change feed is the [lease container's](change-feed-processor.md#components-of-the-change-feed-processor) provisioned throughput and RUs for each request. Use Azure Monitor to measure the request unit (RU) consumption of the change feed. For more information, see [monitor throughput or request unit usage in Azure Cosmos DB](monitor-request-unit-usage.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Options to read change feed](read-change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor](change-feed-processor.md)
