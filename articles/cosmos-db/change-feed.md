---
title: Working with the change feed
titleSuffix: Azure Cosmos DB 
description: Use Azure Cosmos DB change feed to track changes, process events, and keep other systems up-to-date.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/27/2023
ms.custom: seodec18, seo-nov-2020, ignite-2022
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

## Change feed and different operations

Today, you see all inserts and updates in the change feed. You can't filter the change feed for a specific type of operation.

> [!TIP]
> One possible alternative, is to add a "soft marker" on the item for updates and filter based on that when processing items in the change feed.

Currently change feed doesn't log delete operations. As a workaround, you can add a soft marker on the items that are being deleted. For example, you can add an attribute in the item called "deleted," set its value to "true," and then set a time-to-live (TTL) value on the item. Setting the TTL ensures that the item is automatically deleted. For more information, see [Time to Live (TTL)](nosql/time-to-live.md).

You can read the change feed for historic items. This historical data includes the most recent change corresponding to the item. The historical data doesn't include the intermediate changes. For example, you can use the change feed to read items that were added five years ago. However, you can't see the intermediate changes since then. You can read the change feed as far back as the origin of your container. If an item is deleted, it's removed from the change feed entirely.

### Sort order of items in change feed

Change feed items arrive in the order of their modification time. This sort order is guaranteed per logical partition key.

### Consistency level

Consuming the change feed in an Eventual consistency level can result in duplicate events in-between subsequent change feed read operations. For example, the last event of one read operation could appear as the first event of the next operation.

### Change feed in multi-region Azure Cosmos DB accounts

In a multi-region Azure Cosmos DB account, if a write-region fails over, change feed works across the manual failover operation and the feed remains contiguous.

### Change feed and Time to Live (TTL)

If the TTL property is set on an item to `-1`, the change feed persists that item forever. If the data isn't deleted, it remains in the change feed.  

### Change feed and \_etag, \_lsn, or \_ts

Azure Cosmos DB includes multiple internal fields that are automatically assigned to a new item. These fields are important to understand in the context of the change feed.

The `_etag` field is internal and you shouldn't take dependency on it, because it can change at any time. Typically, the `_etag` field changes whenever the item is modified.  For more information, see [optimistic concurrency control](nosql/database-transactions-optimistic-concurrency.md#optimistic-concurrency-control). The `_etag` value from the change feed item is different than the `_etag` value on the original source item. In the context of the change feed, the `_etag` value is used to sequence the feed.

`_ts` is a modification or a creation timestamp. You can use `_ts` for chronological comparison.

`_lsn` is a batch ID that is added to the item within the context of the change feed only. The `_lsn` field doesn't exist on the original source item. In the change feed, the field represents the transaction ID. Many items may have the same `_lsn`.

## Working with change feed

You can work with change feed using the following options:

* [Use change feed with Azure Functions](change-feed-functions.md)
* [Use change feed with the change feed processor](change-feed-processor.md)

Change feed is available for each logical partition key within the container, and it can be distributed across one or more consumers for parallel processing.

:::image type="content" source="./media/change-feed/changefeedvisual.png" alt-text="Distributed processing of Azure Cosmos DB change feed" border="false":::

## Features of change feed

* Change feed is enabled by default for all Azure Cosmos DB accounts.

* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Azure Cosmos DB operation, in any of the regions associated with your Azure Cosmos DB database.

* The change feed includes inserts and update operations made to items within the container. You can capture deletes by setting a "soft-delete" flag within your items (for example, documents) in place of deletes. Alternatively, you can set a finite expiration period for your items with the [TTL capability](time-to-live.md). For example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process the changes within a shorter time interval than the TTL expiration period.

* Only the most recent change for a given item is included in the change log. Intermediate changes may not be available.

* Each change included in the change log appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor provides automatic checkpointing and "at least once" semantics. [using change feed with change feed processor](change-feed-processor.md).

* The change feed is sorted by the order of modification within each logical partition key value. There's no guaranteed order across the partition key values.

* Changes can be synchronized from any point-in-time. There's no fixed data retention period for which changes are available.

* Changes are available in parallel for all logical partition keys of an Azure Cosmos DB container. This capability allows multiple consumers to process changes from large containers in parallel.

* Applications can request multiple change feeds on the same container simultaneously. ChangeFeedOptions.StartTime can be used to provide an initial starting point. For example, to find the continuation token corresponding to a given clock time. The ContinuationToken, if specified, takes precedence over the StartTime and StartFromBeginning values. The precision of ChangeFeedOptions.StartTime is ~5 secs.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change stream in API for MongoDB and Query with predicate in API for Cassandra. To learn more about the implementation details for API for MongoDB, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb/change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival and rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB for Apache Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB for Apache Cassandra](cassandra/change-feed.md).

## Measuring change feed request unit consumption

Use Azure Monitor to measure the request unit (RU) consumption of the change feed. For more information, see [monitor throughput or request unit usage in Azure Cosmos DB](monitor-request-unit-usage.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Options to read change feed](read-change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor](change-feed-processor.md)
