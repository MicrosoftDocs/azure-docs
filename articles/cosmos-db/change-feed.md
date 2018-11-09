---
title: Working with the change feed support in Azure Cosmos DB | Microsoft Docs
description: Use Azure Cosmos DB change feed support to track changes in documents and perform event-based processing like triggers and keeping caches and analytics systems up-to-date. 
keywords: change feed
services: cosmos-db
author: rafats
manager: kfile

ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rafats

---
# Overview of the change feed in Azure Cosmos DB

Azure Cosmos DB is well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to use changes to the data to trigger additional actions. Examples of additional actions include:

* Triggering a notification or a call to an API, when an item is inserted or updated.
* Real-time stream processing for IoT or real-time analytics processing on operational data.
* Additional data movement by either synchronizing with a cache or a search engine or a data warehouse or archiving data to cold storage.

The **change feed** in Cosmos DB enables you to build efficient and scalable solutions for each of these patterns, as shown in the following image:

![Using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios](./media/change-feed/changefeedoverview.png)

## Supported APIs and client SDKs

This feature is currently supported by the following Cosmos DB APIs and client SDKs.

| Client drivers | Azure CLI | SQL API | Cassandra API | MongoDB API | Gremlin API | Table API |
| - | - | - | - | - | - | - |
| .NET | NA | Yes | No | No | Yes | No |
|Java|NA|Yes|No|No|Yes|No|
|Python|NA|Yes|No|No|Yes|No|
|Node/JS|NA|Yes|No|No|Yes|No|

### Change feed and different operations

Today, you see all operations in the change feed. The functionality where you can control change feed, for instance for updates only and not inserts, is coming soon. You can add a “soft marker” on the item for updates and filter based on that when processing items in the change feed. Currently change feed doesn’t log deletes; this functionality is on the roadmap. Similar to above example, you can add a soft marker on the items that are being deleted, for example, you can add an attribute in the item called "deleted" and set it to "true" and set a TTL on the item, so that it can be automatically deleted.

### Change feed and historic items (for example, items that were added five years ago)?

Yes, if the item is not deleted you can read the change feed as far as the origin of your container.

### Sort order of items in change feed

Change feed items come in order of their modification time. This sort order is guaranteed per   logical partition key.

### Change feed in multi-region Cosmos accounts

In a multi-region Cosmos account, if a write-region fails over, change feed will work across the manual failover operation and it will be contiguous.

### Change feed and Time to Live (TTL)

If a TTL (Time to Live) property is set on an item to -1, change feed will persist forever. If data is not deleted, it will remain in change feed.  

### Change feed and _etag, _lsn or _ts

The _etag format is internal and you should not take dependency on it, because it can change anytime. _ts is a modification or a creation timestamp. You can use _ts for chronological comparison. _lsn is a batch id that is added for change feed only; it represents the transaction id. Many items may have same _lsn. ETag on FeedResponse is different from the _etag you see on the item. _etag is an internal identifier and is used for concurrency control (see [Concurrency Control](TBD)), it tells about the version of the item, whereas ETag is used for sequencing the feed.

## Change feed use cases and scenarios

Change feed enables efficient processing of large datasets with a high volume of writes. Change feed also offers an alternative to querying an entire dataset to identify what has changed.

### Use cases

For example, with change feed you can perform the following tasks extremely efficiently:

* Update a cache, update a search index or update a data warehouse with data stored in Cosmos DB.
* Implement an application-level data tiering and archival, for example, store "hot data" in Cosmos DB and age out "cold data" to other storage systems, for example, [Azure Blob Storage](../storage/common/storage-introduction.md).
* Perform zero down-time migrations to another Cosmos account or another Cosmos container with a different logical partition key.
* Implement [lambda architecture](https://blogs.technet.microsoft.com/msuspartner/2016/01/27/azure-partner-community-big-data-advanced-analytics-and-lambda-architecture/) using Cosmos DB, where Cosmos DB supports both real-time, batch and query serving layers, thus enabling lambda architecture with low TCO.
* Receive and store event data from devices, sensors, infrastructure and applications, and process these events in real time, for example, using [Spark](../hdinsight/spark/apache-spark-overview.md).  The following image shows how you can implement lambda architecture using Cosmos DB via change feed:

![Azure Cosmos DB-based lambda pipeline for ingestion and query](./media/change-feed/lambda.png)

### Scenarios

The following are some of the scenarios you can easily implement with change feed:

* Within your [serverless](http://azure.com/serverless) web or mobile apps, you can track events such as all the changes to your customer's profile, preferences, or their location and trigger certain actions, for example, sending push notifications to their devices using [Azure Functions](#azure-functions). 
* If you're using Cosmos DB to build a game, you can, for example, use change feed to implement real-time leaderboards based on scores from completed games.

## How change feed works

Change feed support in Azure Cosmos DB works by listening to a Cosmos DB container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The changes are persisted, can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing.

### Ways to work with change feed

You can work with change feed in the following ways:

* [Using change feed with Azure Functions](TBD)
* [Using change feed with SDK](TBD)
* [Using change feed with change feed processor library](change-feed-processor.md) 
* [Using change feed with Spark](TBD)

The change feed is available for each logical partition key within the container, and thus can be distributed across one or more consumers for parallel processing as shown in the image below.

![Distributed processing of Azure Cosmos DB change feed](./media/change-feed/changefeedvisual.png)

### Additional details
* Change feed is enabled by default for all Cosmos accounts.
* You can use your [provisioned throughput](request-units.md) to read from the change feed, just like any other Cosmos DB operation, in any of the regions associated with your Cosmos database.
* The change feed includes inserts and update operations made to items within the container. You can capture deletes by setting a "soft-delete" flag within your items (for example, documents) in place of deletes. Alternatively, you can set a finite expiration period for your items via the [TTL capability](TBD), for example, 24 hours, and use the value of that property to capture deletes. With this solution, you have to process the changes within a shorter time interval than the TTL expiration period. The change feed native support for deletes is on the roadmap.
* Each change to an item appears exactly once in the change feed, and the clients must manage the checkpointing logic. If you want to avoid the complexity of managing checkpoints, the change feed processor library provides automatic checkpointing and "at least once" semantics. See [using change feed with change feed processor library](change-feed-processor.md).
* Only the most recent change for a given item is included in the change log. Intermediate changes may not be available.
* The change feed is sorted by the order of modification within each logical partition key value. There is no guaranteed order across the partition key values.
* Changes can be synchronized from any point-in-time, that is there is no fixed data retention period for which changes are available.
* Changes are available in parallel for all logical partition keys of a Cosmos container. This capability allows changes from large containers to be processed in parallel by multiple consumers.
* Applications can request multiple change feeds on the same container simultaneously. ChangeFeedOptions.StartTime can be used to provide an initial starting point, for example, to find the continuation token corresponding to a given clock time. The ContinuationToken, if specified, wins over   the StartTime and StartFromBeginning values. The precision of ChangeFeedOptions.StartTime is ~5 secs. See an [example of getting a change feed from a specified time period](TBD).

## Next steps

* [Ways to read change feed](change-feed-reading.md)
* [Using change feed with Azure Functions](TBD)
* [Using change feed with SDK](TBD)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](TBD)
* [How to work with change feed using JavaScript](TBD)
* [How to work with change feed using Java](TBD)
* [How to work with change feed using Spark](TBD)
* [Concurrency Control](TBD)
