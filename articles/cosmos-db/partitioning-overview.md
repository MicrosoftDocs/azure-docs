---
title: Partitioning in Azure Cosmos DB
description: Overview of partitioning in Azure Cosmos DB
services: cosmos-db
author: aliuy
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: andrl

---

# Partitioning

Partitioning is the technique used by Cosmos DB to scale individual containers in a database to meet the performance needs of your application. By using partitioning, the items in a container are divided into distinct subsets, called logical partitions, based on the value of a partition key property that is present in each item.

A logical partition is therefore a distinct subset of items in a container.  The items in a logical partition are identified by the partition key value that is shared by all items in that logical partition.  For example, consider a container that holds documents, each of which has a `UserID` property.  If `UserID` serves as the partition key for items in that container, and there are 1000 unique `UserID` values, then there are 1000 logical partitions in the container.

Every item in a partitioned container has a **partition key** that determines the item’s **logical partition**, and every item also has an **item id** (which is unique within a logical partition).  The **index** of an item, which uniquely identifies it, is the partition key plus the item id.

Choosing a partition key is an important decision that will affect your application’s performance.  See [Choosing a partition key](TBD) for detailed guidance.

## Logical partition management

Cosmos DB transparently and automatically manages the placement of logical partitions onto physical partitions (server infrastructure) to efficiently satisfy the scalability and performance needs of the container.  As throughput and storage requirements of the application increase, Cosmos DB can move logical partitions around and automatically spread the load across a greater number of servers.  If you are interested in how Cosmos DB manages partitions, see the [Logical partitions](partition-data.md) article for more details. It is not necessary to understand these details to build or run your applications.

Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions.  The partition key value of an item is hashed by Cosmos DB, and the hashed result determines the physical partition.  Cosmos DB allocates the key space of partition key hashes evenly across the N physical partitions.

Queries that access data within a single partition more cost-effective than queries that access multiple partitions.  Transactions (in stored procedures or triggers) are only allowed against items within a single logical partition.  

## Partition keys

Consider the following details when choosing a partition key:

* A single logical partition is allowed an upper limit of 10 GB of storage.  
* Partitioned containers are configured with minimum throughput of 400 RU/s. Requests to the same partition key can't exceed the throughput allocated to a partition and will be rate-limited. So, it's important to pick a partition key that doesn't result in "hot spots" within your application.

Choose a partition key that spreads activity evenly across partitions and evenly over time.  Your choice of partition key needs to balance the need for efficient within-partition queries and/or transactions (if your application has these requirements) against the goal of distributing items across multiple partitions to achieve scalability.

Choose a partition key that has a wide range of values and access patterns that are evenly spread across logical partitions.  The basic idea is to spread the data and the activity in your container across the set of logical partitions, so that resources for data storage and throughput can be distributed across the logical partitions.

Candidates for partition keys may include those properties appearing frequently as a filter in your queries.  Queries can be efficiently routed by including the partition key in the filter predicate.

## Next steps

* Learn about [choosing a partition key](TBD)
* Learn about [partitions](partition-data.md)
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md)
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md)
* Learn how to [monitor metrics related to partitions](TBD)
