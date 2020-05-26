---
title: Change feed design patterns in Azure Cosmos DB 
description: Overview of common change feed design patterns
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/08/2020
---
# Change feed design patterns in Azure Cosmos DB

The Azure Cosmos DB change feed enables efficient processing of large datasets with a high volume of writes. Change feed also offers an alternative to querying an entire dataset to identify what has changed. This document focuses on common change feed design patterns, design tradeoffs, and change feed limitations.

Azure Cosmos DB is well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to use changes to the data to trigger additional actions. Examples of additional actions include:

* Triggering a notification or a call to an API, when an item is inserted or updated.
* Real-time stream processing for IoT or real-time analytics processing on operational data.
* Data movement such as synchronizing with a cache, a search engine, a data warehouse, or cold storage.

The change feed in Azure Cosmos DB enables you to build efficient and scalable solutions for each of these patterns, as shown in the following image:

![Using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios](./media/change-feed/changefeedoverview.png)

## Event computing and notifications

The Azure Cosmos DB change feed can simplify scenarios that need to trigger a notification or send a call to an API based on a certain event. You can use the [Change Feed Process Library](change-feed-processor.md) to automatically poll your container for changes and call an external API each time there is a write or update.

You can also selectively trigger a notification or send a call to an API based on specific criteria. For example, if you are reading from the change feed using [Azure Functions](change-feed-functions.md), you can put logic into the function to only send a notification if a specific criteria has been met. While the Azure Function code would execute during each write and update, the notification would only be sent if specific criteria had been met.

## Real-time stream processing

The Azure Cosmos DB change feed can be used for real-time stream processing for IoT or real-time analytics processing on operational data.
For example, you might receive and store event data from devices, sensors, infrastructure and applications, and process these events in real time, using [Spark](../hdinsight/spark/apache-spark-overview.md). The following image shows how you can implement a lambda architecture using the Azure Cosmos DB via change feed:

![Azure Cosmos DB-based lambda pipeline for ingestion and query](./media/change-feed/lambda.png)

In many cases, stream processing implementations first receive a high volume of incoming data into a temporary message queue such as Azure Event Hub or Apache Kafka. The change feed is a great alternative due to Azure Cosmos DB's ability to support a sustained high rate of data ingestion with guaranteed low read and write latency. The advantages of the Azure Cosmos DB change feed over a message queue include:

### Data persistence

Data written to Azure Cosmos DB will show up in the change feed and be retained until deleted. Message queues typically have a maximum retention period. For example, [Azure Event Hub](https://azure.microsoft.com/services/event-hubs/) offers a maximum data retention of 90 days.

### Querying ability

In addition to reading from a Cosmos container's change feed, you can also run SQL queries on the data stored in Azure Cosmos DB. The change feed isn't a duplication of data already in the container but rather just a different mechanism of reading the data. Therefore, if you read data from the change feed, it will always be consistent with queries of the same Azure Cosmos DB container.

### High availability

Azure Cosmos DB offers up to 99.999% read and write availability. Unlike many message queues, Azure Cosmos DB data can be easily globally distributed and configured with an [RTO (Recovery Time Objective)](consistency-levels-tradeoffs.md#rto) of zero.

After processing items in the change feed, you can build a materialized view and persist aggregated values back in Azure Cosmos DB. If you're using Azure Cosmos DB to build a game, you can, for example, use change feed to implement real-time leaderboards based on scores from completed games.

## Data movement

You can also read from the change feed for real-time data movement.

For example, the change feed helps you perform the following tasks efficiently:

* Update a cache, search index, or data warehouse with data stored in Azure Cosmos DB.

* Perform zero down-time migrations to another Azure Cosmos account or another Azure Cosmos container with a different logical partition key.

* Implement an application-level data tiering and archival. For example, you can store "hot data" in Azure Cosmos DB and age out "cold data" to other storage systems such as [Azure Blob Storage](../storage/common/storage-introduction.md).

When you have to [denormalize data across partitions and containers](how-to-model-partition-example.md#v2-introducing-denormalization-to-optimize-read-queries
), you can read from your container's change feed as a source for this data replication. Real-time data replication with the change feed can only guarantee eventual consistency. You can [monitor how far the Change Feed Processor lags behind](how-to-use-change-feed-estimator.md) in processing changes in your Cosmos container.

## Event sourcing

The [event sourcing pattern](https://docs.microsoft.com/azure/architecture/patterns/event-sourcing) involves using an append-only store to record the full series of actions on that data. Azure Cosmos DB's change feed is a great choice as a central data store in event sourcing architectures where all data ingestion is modeled as writes (no updates or deletes). In this case, each write to Azure Cosmos DB is an "event" and you'll have a full record of past events in the change feed. Typical uses of the events published by the central event store are for maintaining materialized views or for integration with external systems. Because there is no time limit for retention in the change feed, you can replay all past events by reading from the beginning of your Cosmos container's change feed.

You can have [multiple change feed consumers subscribe to the same container's change feed](how-to-create-multiple-cosmos-db-triggers.md#optimizing-containers-for-multiple-triggers). Aside from the [lease container's](change-feed-processor.md#components-of-the-change-feed-processor) provisioned throughput, there is no cost to utilize the change feed. The change feed is available in every container regardless of whether it is utilized.

Azure Cosmos DB is a great central append-only persistent data store in the event sourcing pattern because of its strengths in horizontal scalability and high availability. In addition, the change Feed Processor library offers an ["at least once"](change-feed-processor.md#error-handling) guarantee, ensuring that you won't miss processing any events.

## Current limitations

The change feed has important limitations that you should understand. While items in a Cosmos container will always remain in the change feed, the change feed is not a full operation log. There are important areas to consider when designing an application that utilizes the change feed.

### Intermediate updates

Only the most recent change for a given item is included in the change feed. When processing changes, you will read the latest available item version. If there are multiple updates to the same item in a short period of time, it is possible to miss processing intermediate updates. If you would like to track updates and be able to replay past updates to an item, we recommend modeling these updates as a series of writes instead.

### Deletes

The change feed does not capture deletes. If you delete an item from your container, it is also removed from the change feed. The most common method of handling this is adding a soft marker on the items that are being deleted. You can add a property called "deleted" and set it to "true" at the time of deletion. This document update will show up in the change feed. You can set a TTL on this item so that it can be automatically deleted later.

### Guaranteed order

There is guaranteed order in the change feed within a partition key value but not across partition key values. You should select a partition key that gives you a meaningful order guarantee.

For example, consider a retail application using the event sourcing design pattern. In this application, different user actions are each "events" which are modeled as writes to Azure Cosmos DB. Imagine if some example events occurred in the following sequence:

1. Customer adds Item A to their shopping cart
2. Customer adds Item B to their shopping cart
3. Customer removes Item A from their shopping cart
4. Customer checks out and shopping cart contents are shipped

A materialized view of current shopping cart contents is maintained for each customer. This application must ensure that these events are processed in the order in which they occur. If, for example, the cart checkout were to be processed before Item A's removal, it is likely that the customer would have had Item A shipped, as opposed to the desired Item B. In order to guarantee that these four events are processed in order of their occurrence, they should fall within the same partition key value. If you select **username** (each customer has a unique username) as the partition key, you can guarantee that these events show up in the change feed in the same order in which they are written to Azure Cosmos DB.

## Examples

Here are some real-world change feed code examples that extend beyond the scope of the samples provided in Microsoft docs:

- [Introduction to the change feed](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html)
- [IoT use case centered around the change feed](https://github.com/AzureCosmosDB/scenario-based-labs)
- [Retail use case centered around the change feed](https://github.com/AzureCosmosDB/scenario-based-labs)

## Next steps

* [Change feed overview](change-feed.md)
* [Options to read change feed](read-change-feed.md)
* [Using change feed with Azure Functions](change-feed-functions.md)
