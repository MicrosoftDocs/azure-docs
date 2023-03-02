---
title: Best practices for the Enterprise tiers
titleSuffix: Azure Cache for Redis
description: Learn Azure Cache for Redis Enterprise and Enterprise Flash tiers
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 03/15/2023
ms.author: franlanglois
---

# Best Practices for the Enterprise and Enterprise Flash tiers of Azure Cache for Redis

## Zone Redundancy

We strongly recommended that you deploy new caches in a [zone redundant](cache-high-availability.md) configuration. Zone redundancy ensures that Redis Enterprise nodes are spread among three availability zones, boosting redundancy from data center-level outages. 
<!-- I don't quite understand what the last sentence. -->
This [increases the availability](https://azure.microsoft.com/en-us/support/legal/sla/cache/v1_1/) SLA to 99.99%.

 Zone redundancy is particularly important on the Enterprise tier because it always uses at least three nodes. Two nodes are data nodes, which hold your data. Increasing capacity scales the number of these nodes in even-number increments. There is also an additional node called a quorum node. This node monitors the data nodes and automatically selects the new primary node in case of failover. Zone redundancy ensures that the nodes are distributed evenly across three availability zones, minimizing the potential for quorum loss. Customers are not charged for the quorum node and there is no additional charge for using zone redundancy beyond [intra-zonal bandwidth charges](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

## Scaling

In the Enterprise and Enterprise Flash tiers of Azure Cache for Redis, we recommended to prioritize scaling up over scaling out. Prioritize scaling up because the Enterprise tiers are built on Redis Enterprise, which is able to utilize the additional CPU cores in larger VMs.

Conversely, the opposite recommendation is true for the Basic, Standard, and Premium tiers, which are built on open-source Redis. There, prioritizing scaling out over scaling up is recommended in most cases.
<!-- You didn't an actual note so I removed that intro -->

## Sharding and CPU Utilization

In the Basic, Standard, and Premium tiers of Azure Cache for Redis, determining the number of vCPUs utilized is fairly straightforward. Each Redis node runs on a dedicated VM. The Redis server process is single-threaded, utilizing one vCPU on each primary and each replica node. The other vCPUs on the VM are still used for other activities, such as workflow coordination for different tasks, health monitoring, and TLS load, among others. When you use clustering, the effect is to shard data across additional nodes, which linearly increases the number of vCPUs that can be utilized based on the number of shards in the cluster. 
<!-- Let's work on the last sentence sounds a bit to marketing-shh -->

Redis Enterprise, on the other hand, is able to utilize multiple vCPUs for the Redis instance itself. In other words, all tiers of Azure Cache for Redis can utilize multiple vCPUs for background and monitoring tasks, but only the Enterprise and Enterprise Flash tiers are able to utilize multiple vCPUs per VM for Redis shards. The table below shows the number of effective vCPUs utilized for each SKU and capacity (that is, scale-out) configuration. The tables just show the number of vCPUs utilized for the primary shards, not the replica shards. Note that there isn’t a one-to-one mapping between the number of shards and number of vCPUs. Some configurations use more shards than available vCPUs. This will boost performance further in some usage scenarios. 
<!-- Let's clarify what is This in the last sentence. -->

### E10

|Capacity|Effective vCPUs|
|---|---:|
| 2 | 2 |
| 4 | 6 |
| 6 | 6 |
| 8 | 16 |
| 10 | 20 |


### E20
|Capacity|Effective vCPUs|
|---|---|
|2| 2|
|4|6|
|6|6|
|8|16|
|10|20|

### E50

|Capacity|Effective vCPUs|
|---|---|
|2|6|
|4|6|
|6|6|
|8|30 |
|10|30|


### E100
|Capacity|Effective vCPUs|
|---|---|
|2| 6|
|4|30|
|6|30|
|8|30|
|10|30|

### F300
|Capacity|Effective vCPUs|
|---|---|
|3| 6|
|9|30|

### F700
|Capacity|Effective vCPUs|
|---|---|
|3| 30|
|9| 30|

### F1500
|Capacity|Effective vCPUs |
|---:|---:|
|3| 30 |
|9| 90 |


## Clustering on Enterprise

Unlike the Basic, Standard, and Premium tiers, the Enterprise and Enterprise Flash tiers are inherently clustered. The implementation depends on the clustering policy that is selected.
The Enterprise tiers offer two choices for Clustering Policy: _OSS_ and _Enterprise_. _OSS_ cluster policy is recommended for most applications because it supports higher maximum throughput, but there are advantages and disadvantages to each version. 

The _OSS clustering policy_ implements the same [Redis Cluster API](https://redis.io/docs/reference/cluster-spec/) as open-source Redis. This allows the Redis client to connect directly to each Redis node, minimizing latency and optimizing network throughput. As a result, near-linear scalability is obtained when scaling the cluster out with additional nodes. The OSS clustering policy generally provides the best latency and throughput performance, but requires your client library to support Redis Clustering. OSS clustering policy also cannot be used with the [RediSearch module](cache-redis-modules.md). 

The _Enterprise clustering policy_ is a simpler configuration that utilizes a single endpoint for all client connections. Using the Enterprise clustering policy routes all requests to a single Redis node that is then used as a proxy, internally routing requests to the correct node in the cluster. The advantage of this approach is that Redis client libraries don’t need to support Redis Clustering to take advantage of multiple nodes. The downside is that the single node proxy can be a bottleneck, in either compute utilization or network throughput. The Enterprise clustering policy is the only one that can be used with the[RediSearch module](cache-redis-modules.md). 

## Multi-key commands

Because the Enterprise tiers use a clustered configuration, you will see `CROSSSLOT` exceptions on commands that operate on multiple keys. Behavior varies based on which clustering policy is used. When using the OSS clustering policy, multi-key commands require all keys to be mapped to [the same hash slot](https://docs.redis.com/latest/rs/databases/configure/oss-cluster-api/#multi-key-command-support). 

You might also see `CROSSSLOT` errors with Enterprise clustering policy. Only the following multi-key commands are allowed across slots with Enterprise clustering: `DEL`, `MSET`, `MGET`, `EXISTS`, `UNLINK`, and `TOUCH`. For more information, see [Database clustering](https://docs.redis.com/latest/rs/databases/durability-ha/clustering/#multikey-operations).

## Handling Region Down Scenarios with Active Geo-Replication

Active geo-replication is a powerful feature to dramatically boost availability when using the Enterprise tiers of Azure Cache for Redis. You should take steps, however, to prepare your caches in case of a regional outage.

For example, consider these tips:

- Identify in advance which other cache in the geo-replication group to switch over to if a region goes down.
- Ensure that firewalls are set so that any applications and clients can access the identified backup cache.
- Each cache in the geo-replication group has its own access key. Determine how the application switches access keys when targeting a backup cache. 
- If a cache in the geo-replication group goes down, a buildup of metadata starts to occur in all the caches in the geo-replication group. The metadata cannot be discarded until writes can be synced again to all caches. This can be prevented by [force unlinking](cache-how-to-active-geo-replication.md) the cache that is down. 
<!-- need to clarify what can be prevented. then join the next sentence as part of the bullet.  -->

Consider monitoring the available memory in the cache and unlinking if there is memory pressure, especially for write-heavy workloads.

It is also possible to use a [circuit breaker pattern](/azure/architecture/patterns/circuit-breaker) to automatically redirect traffic away from a cache suffering a region outage and towards a backup cache in the same geo-replication group. Use Azure services such as [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) or [Azure Load Balancer](../load-balancer/load-balancer-overview.md) to enable the redirection.

## Data Persistence vs Data Backup

The [data persistence](cache-how-to-premium-persistence.md) feature in the Enterprise and Enterprise Flash tiers is designed to automatically provide a quick recovery point for data in case the cache goes down. It does this by storing the RDB or AOF file in a managed disk that is mounted to the cache instance. Persistence files on this disk are not accessible to users.

Many customers want to use persistence to take periodic backups of the data on their cache. While this is a great idea, data persistence isn’t recommended to be used in this way. Instead, use the [import/export](cache-how-to-import-export-data.md) feature. You can export copies of cache data in RDB format directly into your chosen storage account and trigger the data export as frequently as you require. Export can be triggered either from the portal or by using the CLI, PowerShell, or SDK tools. 

## Next steps

- [Development](cache-best-practices-development.md)

