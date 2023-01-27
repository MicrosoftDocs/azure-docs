---
title: Change feed mode latest version in Azure Cosmos DB 
description: Use Azure Cosmos DB change feed latest version mode to track changes in documents from create or update operations 
author: jcocchi
ms.author: jucocchi
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/27/2023
---
# Change feed mode latest version in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin](../includes/appliesto-nosql-mongodb-cassandra-gremlin.md)]

Latest version mode for the Azure Cosmos DB change feed is a persistent record of changes to items from creates and updates. You'll get the latest version of each item in the container. Deletes aren't captured as changes, but when an item is deleted it will no longer be available in the feed. Latest version change feed mode is enabled by default and can be used by all Azure Cosmos DB accounts except API for Table and API for PostgreSQL accounts. This mode was previously referred to as *Incremental* and was the default way to consume the change feed.

## Use cases for latest version change feed mode

 Latest version mode provides an easy way to process both real time and historic changes to items in a container with the ability to go back to changes from the beginning of the container. 

This mode is well suited to many scenarios including the following:

* Migrations of an entire container to a secondary location.

* Ability to reprocess changes from the beginning of the container

* Real time processing of changes to items in a container resulting from create and update operations.

* Workloads that don't need to capture deletes or intermediate changes between reads.

## Features of latest version change feed mode

In addition to the [common features across all change feed modes](../change-feed.md#features-of-change-feed), latest version  mode has the following characteristics:

* The change feed includes insert and update operations made to items within the container.

* This mode of change feed doesn't log deletes. You can capture deletes by setting a "soft-delete" flag within your items in place of deleting it directly. For example, you can add an attribute in the item called "deleted" with the value "true" and then set a TTL on the item. It will be captured by the change feed as an update and the item will be automatically deleted when the TTL expires. Alternatively, you can set a finite expiration period for your items with the [TTL capability](time-to-live.md). For example, 24 hours and use the value of that property to capture deletes. With this solution, you have to process the changes within a shorter time interval than the TTL expiration period.

* Only the most recent change for a given item is included in the change log. Intermediate changes may not be available.

* When an item is deleted, it will no longer be available in the change feed.

* Changes can be synchronized from any point-in-time, and there's no fixed data retention period for which changes are available.

* You can't filter the change feed for a specific type of operation. One possible alternative, is to add a "soft marker" on the item for updates and filter based on that when processing items in the change feed.

## Working with latest version change feed mode

You can use the following ways to consume changes from change feed in latest version mode:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node/JS** |
| --- | --- | --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | Yes | Yes |  Yes  |  Yes  |
| [Change feed processor](change-feed-processor.md) | Yes | Yes | No | No |
| [Azure Functions trigger](change-feed-functions.md) | Yes | Yes | Yes | Yes |

### Parsing the response object

In latest version mode, the default response object will be an array of items that have changed. Each item contains the standard metadata for any Azure Cosmos DB item including `_etag` and `_ts` with the addition of a new property `_lsn`.

The `_etag` format is internal and you shouldn't take dependency on it, because it can change anytime. `_ts` is a modification or a creation timestamp. You can use `_ts` for chronological comparison. `_lsn` is a batch ID that is added for change feed only; it represents the transaction ID. Many items may have same `_lsn`. ETag on FeedResponse is different from the `_etag` you see on the item. `_etag` is an internal identifier and it's used for concurrency control. The `_etag` property tells about the version of the item, whereas the ETag property is used for sequencing the feed.

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Change feed overview](../change-feed.md)
* [Options to read change feed](read-change-feed.md)
* [All versions and deletes change feed mode](change-feed-all-versions-and-deletes.md)
