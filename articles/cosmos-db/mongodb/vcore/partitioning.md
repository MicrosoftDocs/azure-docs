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
Physical shards are the underlying physical machines responsible for persisting the data and fulfilling database transactions.

The number of physical shards are defined when the cluster is created. The address space of all the logical shards is evenly distributed across each physical shard in the cluster. Data is physically distributed across the underlying physical shards based on the assignment of logical to physical shards.

The cluster maintains a mapping of logical shards to physical shards. When new logical shards are added, the cluster's mapping is updated based on the hash value of the new logical shards and the address space distribution of the physical shards at that time. Similarly, the assignment of the address space to each physical shard is changed as new nodes are added to the cluster after which, the logical shards are rebalanced across the cluster.  

Each physical shard in a multi-shard cluster has the same characteristics. The CPU and memory capacity of each physical shard is determined by the cluster tier that is provisioned. Similarly the storage and IOPS capacity is also uniform across each physical shard and is determined by the storage SKU that is provisioned.

The logical shards that are co-located within the same physical shard are collectively bound by the compute, memory, storage and IOPS capacity of the physical shard and its attached storage disk. For a collection with a large number of distinct values of the shard key

## Best practices for logical sharding
- Shard keys are not indexed by default. Indexes should be explicitly created for the field representing the shard key to avoid scans.
- For read heavy applications, the shard key must be selected based on the query patterns. The most commonly used query filter across the fleet of queries used by the application for a given collection should be chosen as the shard key for that collection.
- For write heavy applications that favor higher performance and throughput requirements for writes over reads, a shard key that provides the best physical distribution of data should be chosen. Shard keys that have the most number of distinct values provide the best opportunity to hash to the most number of unique hash buckets and thus the best physical distribution across the underlying machines.
- For optimal performance, the size of the largest logical shard should be within 4TB.
- For optimal performance, logical shards should be relatively evenly distributed in storage and request volume.
  

## Next steps

