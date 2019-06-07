---
title: Partitioning in Azure Cosmos DB's API for MongoDB
description: This doc discusses the topic of partitioning in Azure Cosmos DB's API for MongoDB.
author: roaror
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 06/07/2019
ms.author: roaror

---

# Partitioning in Azure Cosmos DB’s API for MongoDB 

The concept of partitioning in Cosmos DB’s API for MongoDB is analogous to sharding in MongoDB, but please keep in mind: 
It is important to note that you must pick a partition key if you expect your data to grow more than 10GB. Unless you are sure that your data will never grow more than 10GB, you should always create a partitioned collection and pick a good partition key.  

Please follow the best practices for choosing the partition key for your collection, which are discussed below in this article. 

In this article, we cover: 

1. [Partitioning in Cosmos DB’s API for MongoDB](#partitioning-in-cosmos-dbs-api-for-mongodb) 
2. [Managing Logical Partitions ](#managing-logical-partitions)
3. [Best practices for choosing a partition key ](#best-practices-for-choosing-a-partition-key)
 
## Partitioning in Cosmos DB’s API for MongoDB 

Azure Cosmos DB uses partitioning to scale individual collections in a database to meet the performance needs of your application. In partitioning, the items in a collection are divided into distinct subsets called logical partitions. Logical partitions are formed based on the value of a partition key that is associated with each item in a collection. All items in a logical partition have the same partition key value. 

For example, a collection holds items. Each item has a unique value for the UserID property. If UserID serves as the partition key for the items in the collection and there are 1,000 unique UserID values, 1,000 logical partitions are created for the collection. 

In addition to a partition key that determines the item’s logical partition, each item in a collection has an item ID (unique within a logical partition). Combining the partition key and the item ID creates the item's index, which uniquely identifies the item. 

[Choosing a partition key](#best-practices-for-choosing-a-partition-key) is an important decision that will affect your application’s performance. 

## Managing logical partitions 

Azure Cosmos DB transparently and automatically manages the placement of logical partitions on physical partitions to efficiently satisfy the scalability and performance needs of the collection. As the throughput and storage requirements of an application increase, Azure Cosmos DB moves logical partitions to automatically spread the load across a greater number of servers. 

Azure Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions. Azure Cosmos DB hashes the partition key value of an item. The hashed result determines the physical partition. Then, Azure Cosmos DB allocates the key space of partition key hashes evenly across the physical partitions. 

Queries that access data within a single logical partition are more cost-effective than queries that access multiple partitions. Transactions (in stored procedures or triggers) are allowed only against items in a single logical partition. 

To learn more about how Azure Cosmos DB manages partitions, see [Logical Partitions](partition-data.md#logical-partitions) (it's not necessary to understand the internal details to build or run your applications, but added here for a curious reader). 

## Best practices for choosing a partition key 

The following are best practices for choosing a partition key: 

1. A single logical partition has an upper limit of 10 GB of storage. 
2. Azure Cosmos collections have a minimum throughput of 400 request units per second (RU/s). Requests to the same partition key can't exceed the throughput that's allocated to a partition. If requests exceed the allocated throughput, requests are rate-limited. So, it's important to pick a partition key that doesn't result in "hot spots" within your application. 
3. Choose a partition key that has a wide range of values and access patterns that are evenly spread across logical partitions. This helps spread the data and the activity in your collection across the set of logical partitions, so that resources for data storage and throughput can be distributed across the logical partitions. 
4. Choose a partition key that spreads the workload evenly across all partitions and evenly over time. Your choice of partition key should balance the need for efficient partition queries and transactions against the goal of distributing items across multiple partitions to achieve scalability. 
5. Candidates for partition keys might include properties that appear frequently as a filter in your queries. Queries can be efficiently routed by including the partition key in the filter predicate. 

 

## Next steps:
- Learn about provisioned throughput in Azure Cosmos DB. 
- Learn about global distribution in Azure Cosmos DB's API for MongoDB. 
- Learn about managing data indexing in Azure Cosmos DB’s API for MongoDB. 

 