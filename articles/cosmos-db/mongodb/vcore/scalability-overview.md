---
title: Scalability overview
titleSuffix: Overview of compute and storage scalability on Azure Cosmos DB for MongoDB vCore
description: Cost and performance advantages of scalability for Azure Cosmos DB for MongoDB vCore
author: abinav2307
ms.author: abramees
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/22/2024
---

# Scalability in Azure Cosmos DB for MongoDB (vCore)

The vCore based service for Azure Cosmos DB for MongoDB offers the ability to scale clusters both vertically and horizontally. While the Compute cluster tier and Storage disk functionally depend on each other, the scalability and cost of compute and storage are decoupled.

## Vertical scaling
Vertical scaling offers the following benefits:
- Application teams may not always have a clear path to logically shard their data. Moreover, logical sharding is defined per collection. In a dataset with several unsharded collections, data modeling to partition the data can quickly become tedious. Simply scaling up the cluster can circumvent the need for logical sharding while meeting the growing storage and compute needs of the application.
- Vertical scaling does not require data rebalancing. The number of physical shards remains the same and only the capacity of the cluster is increased with no impact to the application.
- Scaling up and down are zero down-time operations with no disruptions to the service. No application changes are needed and steady state operations can continue unperturbed.
- Compute and Storage resources can also be scaled down during known time windows of low activity. Once again, scaling down avoids the need to rebalance data across fewer physical shards and is a zero down-time operation with no disruption to the service. Here too, no application changes are needed after scaling down the cluster.
- Most importantly, Compute and Storage can be scaled independently. If more cores and memory are needed, the disk SKU can be left as is and the cluster tier can be scaled up. Equally, if more storage and IOPS are needed, the cluster tier can be left as is and the Storage SKU can be scaled up independently. If needed, both Compute and Storage can be scaled independently to optimize for each component's requirements individually, without either component's elasticity requirements affecting the other.


## Horizontal scaling
Eventually, the application grows to a point where scaling vertically is not sufficient. Workload requirements can grow beyond the capacity of the largest cluster tier and eventually more shards are needed. Horizontal scaling in the vCore based offering for Azure Cosmos DB for MongoDB offers the following benefits:
- Logically sharded datasets do not require user intervention to balance data across the underlying physical shards. The service automatically maps logical shards to physical shards. When nodes are added or removed, data is automatically rebalanced the database under the covers.
- Requests are automatically routed to the relevant physical shard that owns the hash range for the data being queried.
- Geo-distributed clusters have a homogeneous multi-node configuration. Thus logical to physical shard mappings are consistent across the primary and replica regions of a cluster.


## Compute and storage scaling
Compute and memory resources influence read operations in the vCore based service for Azure Cosmos DB for MongoDB more than disk IOPS. 
- Read operations first consult the cache in the compute layer and fall back to the disk when data could not be retrieved from the cache. For workloads with a higher rate of read operations per second, scaling up the cluster tier to get more CPU and memory resources leads to higher throughput.
- In addition to read throughput, workloads with a high volume of data per read operation also benefit from scaling the compute resources of the cluster. For instance, cluster tiers with more memory facilitate larger payload sizes per document and a larger number of smaller documents per response.

Disk IOPS influences write operations in the vCore based service for Azure Cosmos DB for MongoDB more than the CPU and memory capacities of the compute resources.
- Write operations always persist data to disk (in addition to persisting data in memory to optimize reads). Larger disks with more IOPS provide higher write throughput, particularly when running at scale.
- The service supports upto 32 TB disks per shard, with more IOPS per shard to benefit write heavy workloads, particularly when running at scale.


## Storage heavy workloads and large disks
### No minimum storage requirements per cluster tier
As mentioned earlier, storage and compute resources are decoupled for billing and provisioning. While they function as a cohesive unit, they can be scaled independently. The M30 cluster tier can have 32 TB disks provisioned. Similarly, the M200 cluster tier can have 32 GB disks provisioned to optimize for both storage and compute costs. 

### Lower TCO with large disks (32 TB and beyond)
Typically, NoSQL databases with a vCore based model limit the storage per physical shard to 4 TB. The vCore based service for Azure Cosmos DB for MongoDB provides up to 8x that capacity with 32 TB disks. For storage heavy workloads, a 4 TB storage capacity per physical shard requires a massive fleet of compute resources just to sustain the storage requirements of the workload. Compute is more expensive than storage and over provisioning compute due to capacity limits in a service can inflate costs rapidly. 

Let's consider a storage heavy workload with 200 TB of data.

| Storage size per shard | Min shards needed to sustain 200 TB | 
|------------------------|-------------------------------------|
| 4 TB                   | 50                                  | 
| 32 TiB                 | 7                                   | 

The reduction in Compute requirements reduces sharply with larger disks. While more than the minimum number of physical shards may be needed to sustain the throughput requirements of the workload, even doubling or tripling the number of shards are more cost effective than a 50 shard cluster with smaller disks.

### Skip storage tiering with large disks
An immediate response to compute costs in storage heavy scenarios is to "tier" the data. Data in the transactional database is limited to the most frequently accessed "hot" data while the larger volume of "cold" data is detached to a cold store. This causes operational complexity. Performance is also unpredictable and dependent upon the data tier that is accessed. Furthermore, the availability of the entire system is dependent on the resiliency of both the hot and cold data stores combined. With large disks in the vCore service, there is no need for tiered storage as the cost of storage heavy workloads is minimized.

## Next steps
- [Learn how to scale Azure Cosmos DB for MongoDB vCore cluster](./how-to-scale-cluster.md)
- [Check out indexing best practices](./how-to-create-indexes.md)

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)

