---
title:  Sharding for horizontal scalability in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Logical sharding for horizontal scale in Azure Cosmos DB for MongoDB vCore.
author: abinav2307
ms.author: abramees
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 7/28/2024
---

# Sharding for horizontal scalability in Azure Cosmos DB for MongoDB vCore

Azure Cosmos DB for MongoDB vCore supports sharding to horizontally distribute data and traffic. The documents within a collection are divided into chunks called logical shards. 

Sharding is defined at the granularity of an individual collection within the cluster using a designated shard key from the collection's document structure. Data is then bucketed into chunks with each chunk corresponding to a logical partition. Documents for each unique value of the shard key property reside in the same logical shard. 

For each document inserted into a sharded collection, the value of the shard key property is hashed to compute the designated logical shard. The onus of placing the logical shard and distributing all the logical shards within the cluster are abstracted from the user and fully managed by the service.

## Logical shards
All documents containing the same value for the shard key belong to the same logical shard. 

For example, let's consider a collection called Employees with the document structure below. 

This table shows a mapping of shard key values to logical partitions.

| Document Id | Shard Key Value | Logical Shard |
|-------------|-----------------|-------------- |
| "12345"     | "Steve Smith"   | Shard 1       |
| "23456"     | "Jane Doe"      | Shard 2       | 
| "34567"     | "Steve Smith"   | Shard 1       |
| "45678"     | "Michael Smith" | Shard 3       |
| "56789"     | "Jane Doe"      | Shard 2       |

- There are no limits to the number of logical shards for a collection. A collection can have as many logical shards as documents with a unique value for the shard key property in each document.
  
- There are also no limits to the size of a single logical shard.

- In addition, the service does not limit transactions to the scope of a logical shard. The vCore based service for Azure Cosmos DB for MongoDB supports read and write transactions that are applicable across multiple logical shards and across multiple physical shards in the cluster.

## Physical shards
Physical shards are the underlying machines and disks responsible for persisting the data and fulfilling database transactions. Unlike logical shards, physical shards are entirely managed by the service under the covers.

The number of physical shards are defined when a cluster is created. Single shard clusters have one physical shard that is entirely responsible for the cluster's storage and database transactions. Multi shard clusters distribute the data and transaction volume across the physical shards in the cluster. 

### Mapping logical shards to physical shards
When new logical shards are added, the cluster's mapping is updated based on the hash value of the new logical shards and the address space distribution of the physical shards. Similarly, the assignment of the address space to each physical shard is changed as new physical shards are added to the cluster after which, logical shards are rebalanced across the cluster.  

The hash range used to map logical and physical shards is evenly distributed across the physical shards in the cluster. Each physical shard owns an evenly sized bucket of the hash range. For every document that is written, he value of the shard key property is hashed and the hash value determines the mapping of the document to the underlying physical shard. Internally, several logical shards map to a single physical shard. Moreover, logical shards are never split across physical shards and all the documents for a logical shard will always map to one physical shard. 

Building on the prior example using a cluster with 2 physical shards, the table below describes a sample mapping of documents to physical shards.

| Document Id | Shard Key Value | Logical Shard | Physical Shard   |
|-------------|-----------------|-------------- |------------------|
| "12345"     | "Steve Smith"   | Shard 1       | Physical Shard 1 |
| "23456"     | "Jane Doe"      | Shard 2       | Physical Shard 2 |
| "34567"     | "Steve Smith"   | Shard 1       | Physical Shard 1 |
| "45678"     | "Michael Smith" | Shard 3       | Physical Shard 1 |
| "56789"     | "Jane Doe"      | Shard 2       | Physical Shard 2 |


### Capacity of physical shards 
The CPU and memory capacity of a physical shard is determined by the cluster tier that is selected when the cluster is provisioned. Similarly the storage and IOPS capacity of the shard is determined by the storage SKU. Larger cluster tiers provide more compute power and larger memory while larger storage disks provide more storage and IOPS. Read heavy workloads will benefit from a higher cluster tier while write heavy workloads will benefit from a larger storage SKU. The cluster tier can be scaled up and down after the cluster is created based on the changing needs of the application.

In a multi-shard cluster, the capacity of each physical shard is the same. Scaling up the cluster tier or the storage SKU does not change the placement of logical shards on the physical shards. After a scale up operation, the number of physical shards remains the same thus avoiding the need to relabance the data in the cluster.

The logical shards that are co-located within the same physical shard are collectively bound by the compute, memory, storage and IOPS capacity of the physical shard they are mapped to. Shard keys that do not have an even distribution of storage and request volumes can cause uneven storage and throughput consumption within the cluster. Hot partitions can cause physical shards to be unevenly utilized leading to unpredictable throughput and performance. Thus sharded clusters require careful planning upfront to ensure performance remains consistent as the requirements of the application change over time.


### Replica sets
Each physical shard consists of a set of replicas, also referred to as a replica set. Each replica hosts an instance of the database engine. A replica set makes the data store within the physical shard durable, highly available, and consistent. Each replica that makes up the physical shard inherits the partition's storage and compute capacity. Azure Cosmos DB for MongoDB vCore automatically manages replica sets.


## Best practices for sharding data
- Sharding in Azure Cosmos DB for MongoDB vCore is not required unless the collection's storage and transaction volumes can exceed the capacity of a single physical shard. For instance, the service provides 32 TB disks per shard. If a collection requires more than 32 TB, it should be sharded.

- It is not necessary to shard every collection in a cluster with multiple physical shards. Sharded and unsharded collections can coexist in the same cluster. The service optimally distributes the collections within the cluster to evenly utilize the cluster's compute and storage resources as evenly as possible. 
  
- For read heavy applications, the shard key must be selected based on the most frequent query patterns. The most commonly used query filter for a collection should be chosen as the shard key to optimize the highest percentage of database transactions by localizing the search to a single physical shard.
  
- For write heavy applications that favor write performance over reads, a shard key should be chosen to evenly distribute data across the physical shards. Shard keys with the highest cardinality provide the best opportunity to uniformly distribute as evenly as possible.
  
- For optimal performance, the storage size of a logical shard should be less than 4 TB.
  
- For optimal performance, logical shards should be evenly distributed in storage and request volume across the physical shards of the cluster.
  

## Next steps

