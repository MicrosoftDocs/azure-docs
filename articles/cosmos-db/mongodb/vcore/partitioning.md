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

## Logical shards
Azure Cosmos DB for MongoDB vCore supports logical sharding to horizontally distribute data and application traffic across physical shards.

Sharding is defined at the granularity of an individual collection within the cluster and by a designated shard key from the collection's document structure. Data is then bucketed into individual chunks with each chunk corresponding to a logical partition. Documents corresponding to each unique value of the shard key property reside in the same logical shard. There are no limits to the number of logical partitions that a collection contains. In theory, a collection can have as many logical shards as documents.

For each document inserted into a sharded collection, the value of the shard key property is hashed to compute the corresponding logical shard. The onus of placing the logical shard and distributing all the logical shards within the cluster are abstracted from the user and fully managed by the service.

## Physical shards
Physical shards are the underlying machines and disks responsible for persisting the data and fulfilling database transactions. Unlike logical shards, physical shards are entirely managed by the service under the covers.

The number of physical shards are defined when the cluster is created. The address space of all the logical shards is evenly distributed across the physical shards in the cluster. The mapping of a logical shard to a physical shard is an internal implementation that is abstracted from users. Data for a logical shard will always map to one physical shard and never across multiple physical shards.

When new logical shards are added, the cluster's mapping is updated based on the hash value of the new logical shards and the address space distribution of the physical shards. Similarly, the assignment of the address space to each physical shard is changed as new physical shards are added to the cluster after which, logical shards are rebalanced across the cluster.  

Each physical shard in a multi-shard cluster has the same characteristics. The CPU and memory capacity of each physical shard is determined by the cluster tier that is provisioned. Similarly the storage and IOPS capacity is uniform across each physical shard and is determined by the storage SKU provisioned. Scaling up the cluster tier or the storage SKU does not change the placement of logical shards on the physical shards. After a scale up operation, the number of physical shards remains the same and so does the distribution of the hash range buckets.

The logical shards that are co-located within the same physical shard are collectively bound by the compute, memory, storage and IOPS capacity of the physical shard. Shard keys that do not have an even distribution of storage and request volumes can cause uneven storage and throughput distribution within the cluster. Hot partitions can cause physical shards to be unevenly utilized leading to unpredictable throughput and performance. Thus sharded clusters require careful planning upfront to ensure performance remains consistent as the requirements of the application grow.

## Best practices for logical sharding
- Shard keys are not indexed by default. Indexes should be explicitly created for the shard key property to ensure optimal query performance..
- For read heavy applications, the shard key must be selected based on query patterns. The most commonly used query filter for a given collection should be chosen as the shard key for that collection. This ensures the highest percentage of queries are optimized by localizing the search to a single physical shard.
- For write heavy applications that favor write performance over reads, a shard key should be chosen such that data is most evenly distributed across the physical shards. Shard keys that have the most number of distinct values provide the best opportunity to hash to the most number of unique hash buckets and thus the best physical distribution across the underlying machines.
- For optimal performance, the storage size of a logical shard should be less than 4TB.
- For optimal performance, logical shards should be evenly distributed in storage and request volume across the physical shards of the cluster.
  

## Next steps

