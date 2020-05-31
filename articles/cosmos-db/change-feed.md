---
title: Working with the change feed support in Azure Cosmos DB 
description: Use Azure Cosmos DB change feed support to track changes in documents, event-based processing like triggers, and keep caches and analytic systems up-to-date 
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/08/2020
ms.reviewer: sngun
ms.custom: seodec18
---
# Change feed in Azure Cosmos DB

Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The changes are persisted, can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing.

Learn more about [change feed design patterns](change-feed-design-patterns.md).

## Supported APIs and client SDKs

This feature is currently supported by the following Azure Cosmos DB APIs and client SDKs.

| **Client drivers** | **SQL API** | **Azure Cosmos DB's API for Cassandra** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API**|**Table API** |
| --- | --- | --- | --- | --- | --- | --- |
| .NET | Yes | Yes | Yes | Yes | No |
|Java|Yes|Yes|Yes|Yes|No|
|Python|Yes|Yes|Yes|Yes|No|
|Node/JS|Yes|Yes|Yes|Yes|No|

## Change feed and different operations

Today, you see all inserts and updates in the change feed. You can't filter the change feed for a specific type of operation. One possible alternative, is to add a "soft marker" on the item for updates and filter based on that when processing items in the change feed.

Currently change feed doesn't log deletes. Similar to the previous example, you can add a soft marker on the items that are being deleted. For example, you can add an attribute in the item called "deleted" and set it to "true" and set a TTL on the item, so that it can be automatically deleted. You can read the change feed for historic items (the most recent change corresponding to the item, it doesn't include the intermediate changes), for example, items that were added five years ago. You can read the change feed as far back as the origin of your container but if an item is deleted, it will be removed from the change feed.

### Sort order of items in change feed

Change feed items come in the order of their modification time. This sort order is guaranteed per logical partition key.

### Consistency level

While consuming the change feed in an Eventual consistency level, there could be duplicate events in-between subsequent change feed read operations (the last event of one read operation appears as the first of the next).

### Change feed in multi-region Azure Cosmos accounts

In a multi-region Azure Cosmos account, if a write-region fails over, change feed will work across the manual failover operation and it will be contiguous.

### Change feed and Time to Live (TTL)

If a TTL (Time to Live) property is set on an item to -1, change feed will persist forever. If the data is not deleted, it will remain in the change feed.  

### Change feed and _etag, _lsn or _ts

The _etag format is internal and you should not take dependency on it, because it can change anytime. _ts is a modification or a creation timestamp. You can use _ts for chronological comparison. _lsn is a batch ID that is added for change feed only; it represents the transaction ID. Many items may have same _lsn. ETag on FeedResponse is different from the _etag you see on the item. _etag is an internal identifier and is used for concurrency control tells about the 
version of the item, whereas ETag is used for sequencing the feed.

## Working with change feed

You can work with change feed using the following options:

* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed with change feed processor](change-feed-processor.md) 

Change feed is available for each logical partition key within the container, and it can be distributed across one or more consumers for parallel processing as shown in the image below.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/changefeedvisual.png)

## Features of change feed

* Change feed is enabled by default for all Azure Cosmos accounts.

* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Azure Cosmos DB operation, in any of the regions associated with your Azure Cosmos database.

* The change feed includes inserts and update operations made to items within the container. You can capture deletes by setting a "soft-delete" flag within your items (for example, documents) in place of deletes. Alternatively, you can set a finite expiration period for your items with the [TTL capability](time-to-live.md). For example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process the changes within a shorter time interval than the TTL expiration period.

* Each change to an item appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor provides automatic checkpointing and "at least once" semantics. See [using change feed with change feed processor](change-feed-processor.md).

* Only the most recent change for a given item is included in the change log. Intermediate changes may not be available.

* The change feed is sorted by the order of modification within each logical partition key value. There is no guaranteed order across the partition key values.

* Changes can be synchronized from any point-in-time, that is there is no fixed data retention period for which changes are available.

* Changes are available in parallel for all logical partition keys of an Azure Cosmos container. This capability allows changes from large containers to be processed in parallel by multiple consumers.

* Applications can request multiple change feeds on the same container simultaneously. ChangeFeedOptions.StartTime can be used to provide an initial starting point. For example, to find the continuation token corresponding to a given clock time. The ContinuationToken, if specified, takes precedence over the StartTime and StartFromBeginning values. The precision of ChangeFeedOptions.StartTime is ~5 secs.

## Change feed in APIs for Cassandra and MongoDB

Change feed functionality is surfaced as change stream in MongoDB API and Query with predicate in Cassandra API. To learn more about the implementation details for MongoDB API, see the [Change streams in the Azure Cosmos DB API for MongoDB](mongodb-change-streams.md).

Native Apache Cassandra provides change data capture (CDC), a mechanism to flag specific tables for archival as well as rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached. The change feed feature in Azure Cosmos DB API for Cassandra enhances the ability to query the changes with predicate via CQL. To learn more about the implementation details, see [Change feed in the Azure Cosmos DB API for Cassandra](cassandra-change-feed.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Options to read change feed](read-change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
* [Using change feed processor](change-feed-processor.md)
