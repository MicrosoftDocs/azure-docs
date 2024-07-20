---
title: Scalability Overview
titleSuffix: Overview of compute and storage scalability on Azure Cosmos DB for MongoDB vCore
description: Cost and performance advantages of scalability for Azure Cosmos DB for MongoDB vCore
author: abinav2307
ms.author: abramees
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/22/2024
---

The vCore based service for Azure Cosmos DB for MongoDB offers the ability to scale clusters both vertical and horizontally. While the Compute cluster tier and Storage disk functionally depend on each other, the scalability and cost of compute and storage are decoupled in the vCore service.

# Vertical Scaling
Vertical scaling offers the following benefits:
- Application teams may not always have a clear path to logically sharding their data. Moreover, logical sharding is defined per collection. In a dataset with several un-sharded collections, data modeling to partition the data can quickly become tedious. Simply scaling up the cluster can circumvent the need for logical sharding and still meet the growing needs of the application.
- Data is not rebalanced during a vertical scaling operation. In addition, scaling up and down are zero down-time operations with no disruptions to the service. No application changes are needed and steady state operations can continue with a larger cluster capacity.
- Similarly, compute and storage can also be scaled down during known time windows of lower activity. Once again, scaling down avoids the need to rebalance data across a fewer number of physical shards and is a zero down-time operation with no disruption to the service. Here too, no application changes are needed after scaling down the resources of the cluster.
- Most importantly, Compute and Storage can be scaled independently. If more cores and memory are needed, the disk SKU can be left as is and the cluster tier can be scaled up. Conversely, if more storage and IOPS are needed, the cluster tier can be left as is and the Storage SKU can be scaled up independently. If both Compute and Storage need to be scaled, scaling both can be optimized for each entity individually, without the scaling of Compute impacting the scaling of Storage and vice versa.


# Horizontal Scaling
Eventually, scaling up may not be enough. Workload requirements can grow beyond the capacity of the largest cluster tier and eventually more shards will be needed. Horizontal scaling in the vCore based offering for Azure Cosmos DB for MongoDB offers the following benefits:
- If the data is logically sharded, no user intervention is needed to balance the data across the physical shards in the cluster. Logical shards are automatically mapped to the underlying physical shards by the service. When nodes are added or removed, the shards are similarly rebalanced and reassigned by the service.
- Similarly, requests are auto routed to the relevant physical shard that owns the hash range for the logical shards being queried.
- Geo-distributed clusters have a homogeneous multi-node configuration. Thus logical to physical shard mappings are consistent across the primary and replica regions for a cluster.


# Compute and Storage scaling
Read operations in the vCore based service for Azure Cosmos DB for MongoDB are more impacted by the cluster tier's compute and memory resources and less impacted by the IOPS of the attached storage disk. 
- Read operations first consult the cache in the compute layer for fast access and fall back to the disk when data could not be fetched from the cache. For workloads that require a higher rate of read operations per second, scaling up the cluster tier to get more CPU and memory resources will lead to a higher throughput.
- In addition to read throughput, workloads with a higher volume of data per read operation will also benefit from compute scaling. For instance, compute cluster tiers with more memory can facilitate 
 larger payload sizes per document as well as a larger number of smaller documents that are part of the same query operation.

Write operations in the vCore based service for Azure Cosmos DB for MongoDB are more impacted by the IOPS capacity of the disk SKU as opposed to the CPU and memory capacities of the compute resources.
- Write operations always need to persist data to disk (in addition to persisting data in memory to optimize reads). Larger disks with more IOPS will provide higher write throughput, particularly when running at scale.
- The service supports upto 32TB disks per shard, offering significantly more IOPS per shard to benefit write heavy workloads, particularly when running at scale.


# Storage heavy workloads and large disks
## No minimum storage requirements per cluster tier
As mentioned earlier, storage and compute are decoupled for billing and provisioning. While they function as a cohesive unit, they can be scaled independently. The M30 cluster tier can have 32TB disks provisioned. Similarly, the M200 cluster tier can have 32GB disks provisioned to optimize for both storage and compute costs individually. 

## Lower TCO with large disks (32TB and beyond)
Typically, NoSQL databases with a vCore based model limit the storage per physical shard at 4TB. The vCore based service for Azure Cosmos DB for MongoDB provides upto 8x that capacity with 32TB disks with plans to expand to 64TB and 128TB disks per shard in the near future. For storage heavy workloads, a 4TB storage capacity per physical shard will require a massive fleet of compute resources just so sustain the storage requirements of the workload. Compute is more expensive than storage and over provisioning compute due to capacity limits in a service can inflate costs rapidly. 

Let's consider the lower TCO with the vCore based Azure Cosmos DB for MongDB for a storage heavy workload with 200TB of data. 
| Storage size per shard      | Min shards needed to sustain 200TB | 
|-----------------------------|------------------------------------|
| 4TB                         | 50                                 | 
| 32 TiB                      | 7                                  | 
| 64 TiB (Coming soon)        | 4                                  | 

The reduction in Compute requirements reduces sharply with larger disks. While 7 or 4 physical shards may not be sufficient to sustain the throughput requirements of the workload and more shards may be needed, even doubling or tripling the shard count along with the larger disks will be significantly more cost optimal than a 50 shard cluster with smaller disks.

## Skip storage tiering with large disks
An immediate response to minimize compute costs in storage heavy scenarios is to "tier" the data. Data in the transactional database is limited to the most frequently accessed "hot" data while the larger volume of "cold" data is detached to a cold store. This causes operational complexity in the application layer. Latencies will also be unpredictable depending upon the data tier being accessed. Furthermore, the availability of the entire system is now dependent on the resiliency of both the hot and cold data stores combined. With large disks in the vCore service, there is no need for tiered storage as the cost of storage heavy workloads are significantly minimized.

## Next steps
- [Learn how to scale Azure Cosmos DB for MongoDB vCore cluster](./how-to-scale-cluster.md)
- [Check out indexing best practices](./how-to-create-indexes.md)

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)

