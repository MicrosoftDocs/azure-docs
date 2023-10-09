---
title: Change feed design patterns in Azure Cosmos DB 
description: Get an overview of common change feed design patterns.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/10/2023
ms.custom: cosmos-db-video, build-2023
---
# Change feed design patterns in Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The Azure Cosmos DB change feed enables efficient processing of large datasets that have a high volume of writes. Change feed also offers an alternative to querying an entire dataset to identify what has changed. This article focuses on common change feed design patterns, design tradeoffs, and change feed limitations.

>
> [!VIDEO https://aka.ms/docs.change-feed-azure-functions]

Azure Cosmos DB is well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to use changes to the data to trigger other actions. Examples of these actions include:

- Triggering a notification or a call to an API when an item is inserted, updated, or deleted.
- Real-time stream processing for IoT or real-time analytics processing on operational data.
- Data movement such as synchronizing with a cache, a search engine, a data warehouse, or cold storage.

The change feed in Azure Cosmos DB enables you to build efficient and scalable solutions for each of these patterns, as shown in the following image:

:::image type="content" source="../media/change-feed/changefeedoverview.png" alt-text="Diagram that shows using Azure Cosmos DB change feed to power real-time analytics and event-driven computing scenarios." border="false":::

## Event computing and notifications

The Azure Cosmos DB change feed can simplify scenarios that need to trigger a notification or send a call to an API based on a certain event. You can use the [change feed processor](change-feed-processor.md) to automatically poll your container for changes and then call an external API each time there's a write, update, or delete.

You can also selectively trigger a notification or send a call to an API based on specific criteria. For example, if you're reading from the change feed by using [Azure Functions](change-feed-functions.md), you can put logic into the function to send a notification only if a condition is met. Although the Azure Function code would execute for each change, the notification would be sent only if the condition is met.

## Real-time stream processing

The Azure Cosmos DB change feed can be used for real-time stream processing for IoT or real-time analytics processing on operational data. For example, you might receive and store event data from devices, sensors, infrastructure, and applications, and then process these events in real time by using [Spark](../../hdinsight/spark/apache-spark-overview.md). The following image shows how you can implement a lambda architecture by using the Azure Cosmos DB change feed:

:::image type="content" source="../media/change-feed/lambda.png" alt-text="Diagram that shows an Azure Cosmos DB-based lambda pipeline for ingestion and query." border="false":::

In many cases, stream processing implementations first receive a high volume of incoming data into a temporary message queue such as Azure Event Hubs or Apache Kafka. The change feed is a great alternative due to Azure Cosmos DB's ability to support a sustained high rate of data ingestion with guaranteed low read and write latency. The advantages of the Azure Cosmos DB change feed over a message queue include:

### Data persistence

Data that's written to Azure Cosmos DB shows up in the change feed. The data is retained in the change feed until it's deleted if you read by using [latest version mode](change-feed-modes.md#latest-version-change-feed-mode). Message queues typically have a maximum retention period. For example, [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) offers a maximum data retention of 90 days.

### Query ability

In addition to reading from an Azure Cosmos DB container's change feed, you can run SQL queries on the data that's stored in Azure Cosmos DB. The change feed isn't a duplication of data that's already in the container, but rather, it's just a different mechanism of reading the data. Therefore, if you read data from the change feed, the data is always consistent with queries of the same Azure Cosmos DB container.

### High availability

Azure Cosmos DB offers up to 99.999% read and write availability. Unlike many message queues, Azure Cosmos DB data can be easily globally distributed and configured with an [recovery time objective (RTO)](../consistency-levels.md#rto) of zero.

After you process items in the change feed, you can build a materialized view and persist aggregated values back in Azure Cosmos DB. If you're using Azure Cosmos DB to build a game, for example, you can use change feed to implement real-time leaderboards based on scores from completed games.

## Data movement

You can also read from the change feed for real-time data movement.

For example, the change feed helps you perform the following tasks efficiently:

- Update a cache, search index, or data warehouse with data that's stored in Azure Cosmos DB.

- Perform zero-downtime migrations to another Azure Cosmos DB account or to another Azure Cosmos DB container that has a different logical partition key.

- Implement an application-level data tiering and archival. For example, you can store "hot data" in Azure Cosmos DB and age out "cold data" to other storage systems such as [Azure Blob Storage](../../storage/common/storage-introduction.md).

When you have to [denormalize data across partitions and containers](model-partition-example.md#v2-introducing-denormalization-to-optimize-read-queries), you can read from your container's change feed as a source for this data replication. Real-time data replication with the change feed can guarantee only eventual consistency. You can [monitor how far the change feed processor lags behind](how-to-use-change-feed-estimator.md) in processing changes in your Azure Cosmos DB container.

## Event sourcing

The [event sourcing pattern](/azure/architecture/patterns/event-sourcing) involves using an append-only store to record the full series of actions on that data. The Azure Cosmos DB change feed is a great choice as a central data store in event sourcing architectures in which all data ingestion is modeled as writes (no updates or deletes). In this case, each write to Azure Cosmos DB is an "event," so there's a full record of past events in the change feed. Typical uses of the events published by the central event store are to maintain materialized views or to integrate with external systems. Because there's no time limit for retention in the [change feed latest version mode](change-feed-modes.md#latest-version-change-feed-mode), you can replay all past events by reading from the beginning of your Azure Cosmos DB container's change feed. You can even have [multiple change feed consumers subscribe to the same container's change feed](how-to-create-multiple-cosmos-db-triggers.md#optimizing-containers-for-multiple-triggers).

Azure Cosmos DB is a great central append-only persistent data store in the event sourcing pattern because of its strengths in horizontal scalability and high availability. In addition, the change feed processor offers an ["at least once"](change-feed-processor.md#error-handling) guarantee, ensuring that you don't miss processing any events.

## Current limitations

The change feed has multiple modes that each have important limitations that you should understand. There are several areas to consider when you design an application that uses the change feed in either [latest version mode](change-feed-modes.md#latest-version-change-feed-mode) or [all versions and deletes mode](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview).

### Intermediate updates

#### [Latest version mode](#tab/latest-version)

In latest version mode, only the most recent change for a specific item is included in the change feed. When processing changes, you read the latest available item version. If there are multiple updates to the same item in a short period of time, it's possible to miss processing intermediate updates. If you would like to replay past individual updates to an item, you can model these updates as a series of writes instead or use all versions and deletes mode.

#### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

All versions and deletes mode provides a full operation log of every item version from all operations. No intermediate updates are missed if they occurred within the continuous backup retention period that's configured for the account.

---

### Deletes

#### [Latest version mode](#tab/latest-version)

The change feed latest version mode doesn't capture deletes. If you delete an item from your container, it's also removed from the change feed. The most common method of handling deletes is to add a soft marker on the items that are being deleted. You can add a property called `deleted` and set it to `true` at the time of deletion. This document update shows up in the change feed. You can set a Time to Live (TTL) on this item so that it can be automatically deleted later.

#### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

Deletes are captured in all versions and deletes mode without needing to set a soft delete marker. You also get metadata that indicates whether the delete was from a TTL expiration.

---

### Retention

#### [Latest version mode](#tab/latest-version)

The change feed in latest version mode has an unlimited retention. As long as an item exists in your container, it's available in the change feed.

#### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

All versions and deletes mode allows you to read only changes that occurred within the continuous backup retention period that's configured for the account. If your account is configured with a seven-day retention period, you can't read changes from eight days ago. If your application needs to track all updates from the beginning of the container, latest version mode might be a better fit.

---

### Guaranteed order

All change feed modes have a guaranteed order within a partition key value, but not across partition key values. You should select a partition key that gives you a guarantee of meaningful order.

For example, consider a retail application that uses the event sourcing design pattern. In this application, different user actions are each "events," which are modeled as writes to Azure Cosmos DB. Imagine if some example events occurred in the following sequence:

1. Customer adds Item A to their shopping cart.
1. Customer adds Item B to their shopping cart.
1. Customer removes Item A from their shopping cart.
1. Customer checks out and shopping cart contents are shipped.

A materialized view of current shopping cart contents is maintained for each customer. This application must ensure that these events are processed in the order in which they occur. For example, if the cart checkout were to be processed before Item A's removal, it's likely that Item A would have shipped to the customer, and not the item the customer wanted instead, Item B. To guarantee that these four events are processed in order of their occurrence, they should fall within the same partition key value. If you select `username` (each customer has a unique username) as the partition key, you can guarantee that these events show up in the change feed in the same order in which they're written to Azure Cosmos DB.

## Examples

Here are some real-world change feed code examples for latest version mode that extend beyond the scope of the provided samples:

- [Introduction to the change feed](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html)
- [IoT use case centered around the change feed](https://github.com/AzureCosmosDB/scenario-based-labs)
- [Retail use case centered around the change feed](https://github.com/AzureCosmosDB/scenario-based-labs)

## Next steps

- Review the [change feed overview](../change-feed.md).
- Learn more about [change feed modes](change-feed-modes.md).
- Learn your [options to read your change feed](read-change-feed.md).
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units by using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units by using the Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
