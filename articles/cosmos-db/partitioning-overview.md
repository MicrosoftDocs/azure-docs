---
title: Partitioning in Azure Cosmos DB
description: Overview of partitioning in Azure Cosmos DB
ms.author: mjbrown
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/30/2018


---

# Partitioning in Azure Cosmos DB

Partitioning is the technique used by Cosmos DB to scale individual containers in a database to meet the performance needs of your application. By using partitioning, the items in a container are divided into distinct subsets, called logical partitions. The logical partitions are created based on the value of a partition key property associated with each item.

A logical partition is a distinct subset of items in a container. The items in a logical partition are identified by the partition key value that is shared by all items in the logical partition.  For example, consider a container that holds documents and each document has a `UserID` property.  If `UserID` serves as the partition key for the items in a container, and there are 1000 unique `UserID` values, 1000 logical partitions will be created for the container.

Each item in a container has a **partition key** that determines the item’s **logical partition**, and each item also has an **item id** (which is unique within a logical partition).  The **index** of an item uniquely identifies it and it is formed by combining the partition key and the item id.

Choosing a partition key is an important decision that will affect your application’s performance.  To learn more, see [Choosing a partition key](partitioning-overview.md#choose-partitionkey) article for detailed guidance.

## Logical partition management

Cosmos DB transparently and automatically manages the placement of logical partitions onto physical partitions (server infrastructure) to efficiently satisfy the scalability and performance needs of the container. As the throughput and storage requirements of the application increase, Cosmos DB moves logical partitions to automatically spread the load across a greater number of servers. To learn more about how Cosmos DB manages partitions, see [Logical partitions](partition-data.md) article. It is not necessary to understand these details to build or run your applications.

Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions.  The partition key value of an item is hashed by Cosmos DB, and the hashed result determines the physical partition. Cosmos DB allocates the key space of partition key hashes evenly across the 'N' physical partitions.

Queries that access data within a single partition are more cost-effective than queries that access multiple partitions. Transactions (in stored procedures or triggers) are only allowed against items within a single logical partition.  

## <a id="choose-partitionkey"></a>Choosing a partition key

Consider the following details when choosing a partition key:

* A single logical partition is allowed an upper limit of 10 GB of storage.  

* Partitioned containers are configured with minimum throughput of 400 RU/s. Requests to the same partition key can't exceed the throughput allocated to a partition. If they exceed the allocated throughput, the requests will be rate-limited. So, it's important to pick a partition key that doesn't result in "hot spots" within your application.

* Choose a partition key that spreads workload evenly across all partitions and evenly over time.  Your choice of partition key should balance the need for efficient partition queries and/or transactions against the goal of distributing items across multiple partitions to achieve scalability.

* Choose a partition key that has a wide range of values and access patterns that are evenly spread across logical partitions. The basic idea is to spread the data and the activity in your container across the set of logical partitions, so that resources for data storage and throughput can be distributed across the logical partitions.

* Candidates for partition keys may include the properties that appear frequently as a filter in your queries. Queries can be efficiently routed by including the partition key in the filter predicate.

## Next steps

* Learn about [partitions](partition-data.md)
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md)
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md)
