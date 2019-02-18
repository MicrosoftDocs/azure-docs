---
title: Partitioning in Azure Cosmos DB
description: Overview of partitioning in Azure Cosmos DB.
ms.author: mjbrown
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/30/2018

---

# Partitioning in Azure Cosmos DB

Azure Cosmos DB uses partitioning to scale individual containers in a database to meet the performance needs of your application. In partitioning, the items in a container are divided into distinct subsets, called *logical partitions*. Logical partitions are created based on the value of a *partition key* that's associated with each item in a container. The same partition key value is shared by all items in a logical partition.

For example, a container holds documents. Each document has a unique value for the `UserID` property. If `UserID` serves as the partition key for the items in the container and there are 1,000 unique `UserID` values, 1,000 logical partitions are created for the container.

In addition to a partition key that determines the item’s logical partition, each item in a container has an *item ID* (unique within a logical partition). Combining the partition key and the item ID creates the item's *index*, which uniquely identifies the item.

[Choosing a partition key](partitioning-overview.md#choose-partitionkey) is an important decision that will affect your application’s performance.

## Logical partition management

Azure Cosmos DB transparently and automatically manages the placement of logical partitions on physical partitions (your server infrastructure) to efficiently satisfy the scalability and performance needs of the container. As the throughput and storage requirements of an application increase, Cosmos DB moves logical partitions to automatically spread the load across a greater number of servers. 

Azure Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions. Azure Cosmos DB hashes the partition key value of an item. The hashed result determines the physical partition. Then, Azure Cosmos DB allocates the key space of partition key hashes evenly across the 'N' physical partitions.

Queries that access data within a single partition are more cost-effective than queries that access multiple partitions. Transactions (in stored procedures or triggers) are allowed only against items in a single logical partition.

To learn more about how Azure Cosmos DB manages partitions, see [Logical partitions](partition-data.md). (It's not necessary to understand these details to build or run your applications.)

## <a id="choose-partitionkey"></a>Choosing a partition key

Consider the following details when you choose a partition key:

* A single logical partition has an upper limit of 10 GB of storage.  

* Partitioned containers have a minimum throughput of 400 RU/s. Requests to the same partition key can't exceed the throughput allocated to a partition. If they exceed the allocated throughput, the requests are rate-limited. So, it's important to pick a partition key that doesn't result in "hot spots" within your application.

* Choose a partition key that spreads workload evenly across all partitions and evenly over time.  Your choice of partition key should balance the need for efficient partition queries and transactions against the goal of distributing items across multiple partitions to achieve scalability.

* Choose a partition key that has a wide range of values and access patterns that are evenly spread across logical partitions. The basic idea is to spread the data and the activity in your container across the set of logical partitions, so that resources for data storage and throughput can be distributed across the logical partitions.

* Candidates for partition keys might include the properties that appear frequently as a filter in your queries. Queries can be efficiently routed by including the partition key in the filter predicate.

## Next steps

* Learn about [partitions](partition-data.md).
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md).
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md).
