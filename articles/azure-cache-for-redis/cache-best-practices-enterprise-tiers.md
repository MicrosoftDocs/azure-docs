---
title: Best practices for the Enterprise tiers
titleSuffix: Azure Cache for Redis
description: Learn the best practices when using the high performance Azure Cache for Redis Enterprise and Enterprise Flash tiers
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/26/2023
ms.author: franlanglois
---

# What are the best practices for the Enterprise and Enterprise Flash tiers

Here are the best practices when using the Enterprise and Enterprise Flash tiers of Azure Cache for Redis.

## Zone Redundancy

We strongly recommend that you deploy new caches in a [zone redundant](cache-high-availability.md) configuration. Zone redundancy ensures that Redis Enterprise nodes are spread among three availability zones, boosting redundancy from data center-level outages. Using zone redundancy increases availability. For more information, see [Service Level Agreements (SLA) for Online Services](https://azure.microsoft.com/support/legal/sla/cache/v1_1/).

Zone redundancy is important on the Enterprise tier because your cache instance always uses at least three nodes. Two nodes are data nodes, which hold your data, and a _quorum node_. Increasing capacity scales the number of data nodes in even-number increments.

There's also another node called a quorum node. This node monitors the data nodes and automatically selects the new primary node if there was a failover. Zone redundancy ensures that the nodes are distributed evenly across three availability zones, minimizing the potential for quorum loss. Customers aren't charged for the quorum node and there's no other charge for using zone redundancy beyond [intra-zonal bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/).

## Scaling

In the Enterprise and Enterprise Flash tiers of Azure Cache for Redis, we recommend prioritizing _scaling up_ over _scaling out_. Prioritize scaling up because the Enterprise tiers are built on Redis Enterprise, which is able to utilize more CPU cores in larger VMs.

Conversely, the opposite recommendation is true for the Basic, Standard, and Premium tiers, which are built on open-source Redis. In those tiers, prioritizing _scaling out_ over _scaling up_ is recommended in most cases.

## Sharding and CPU utilization

In the Basic, Standard, and Premium tiers of Azure Cache for Redis, determining the number of virtual CPUs (vCPUs) utilized is straightforward. Each Redis node runs on a dedicated VM. The Redis server process is single-threaded, utilizing one vCPU on each primary and each replica node. The other vCPUs on the VM are still used for other activities, such as workflow coordination for different tasks, health monitoring, and TLS load, among others.

When you use clustering, the effect is to spread data across more nodes with one shard per node. By increasing the number of shards, you linearly increase the number of vCPUs you use, based on the number of shards in the cluster.

Redis Enterprise, on the other hand, can use multiple vCPUs for the Redis instance itself. In other words, all tiers of Azure Cache for Redis can use multiple vCPUs for background and monitoring tasks, but only the Enterprise and Enterprise Flash tiers are able to utilize multiple vCPUs per VM for Redis shards. The table shows the number of effective vCPUs used for each SKU and capacity (that is, scale-out) configuration.

The tables show the number of vCPUs used for the primary shards, not the replica shards. Shards don't map one-to-one to the number of vCPUs. The tables only illustrate vCPUs, not shards. Some configurations use more shards than available vCPUs to boost performance in some usage scenarios.

### E5
|Capacity|Effective vCPUs|
|---:|---:|
| 2 | 1 |
| 4 | 2 |
| 6 | 6 |

### E10
|Capacity|Effective vCPUs|
|---:|---:|
| 2 | 2 |
| 4 | 6 |
| 6 | 6 |
| 8 | 16 |
| 10 | 20 |

### E20

|Capacity|Effective vCPUs|
|---:|---:|
|2| 2|
|4|6|
|6|6|
|8|16|
|10|20|

### E50

|Capacity|Effective vCPUs|
|---:|---:|
|2|6|
|4|6|
|6|6|
|8|30 |
|10|30|

### E100

|Capacity|Effective vCPUs|
|---:|---:|
|2| 6|
|4|30|
|6|30|
|8|30|
|10|30|

### E200
|Capacity|Effective vCPUs|
|---:|---:|
|2|30|
|4|60|
|6|60|
|8|120|
|10|120|

### E400
|Capacity|Effective vCPUs|
|---:|---:|
|2|60|
|4|120|
|6|120|
|8|240|
|10|240|

### F300

|Capacity|Effective vCPUs|
|---:|---:|
|3| 6|
|9|30|

### F700

|Capacity|Effective vCPUs|
|---:|---:|
|3| 30|
|9| 30|

### F1500

|Capacity|Effective vCPUs |
|---:|---:|
|3| 30 |
|9| 90 |

## Clustering on Enterprise

Enterprise and Enterprise Flash tiers are inherently clustered, in contrast to the Basic, Standard, and Premium tiers. The implementation depends on the clustering policy that is selected.
The Enterprise tiers offer two choices for Clustering Policy: _OSS_ and _Enterprise_. _OSS_ cluster policy is recommended for most applications because it supports higher maximum throughput, but there are advantages and disadvantages to each version.

The _OSS clustering policy_ implements the same [Redis Cluster API](https://redis.io/docs/reference/cluster-spec/) as open-source Redis. The Redis Cluster API allows the Redis client to connect directly to each Redis node, minimizing latency and optimizing network throughput. As a result, near-linear scalability is obtained when scaling out the cluster with more nodes. The OSS clustering policy generally provides the best latency and throughput performance, but requires your client library to support Redis Clustering. OSS clustering policy also can't be used with the [RediSearch module](cache-redis-modules.md).

The _Enterprise clustering policy_ is a simpler configuration that utilizes a single endpoint for all client connections. Using the Enterprise clustering policy routes all requests to a single Redis node that is then used as a proxy, internally routing requests to the correct node in the cluster. The advantage of this approach is that Redis client libraries don’t need to support Redis Clustering to take advantage of multiple nodes. The downside is that the single node proxy can be a bottleneck, in either compute utilization or network throughput. The Enterprise clustering policy is the only one that can be used with the [RediSearch module](cache-redis-modules.md).

## Multi-key commands

Because the Enterprise tiers use a clustered configuration, you might see `CROSSSLOT` exceptions on commands that operate on multiple keys. Behavior varies depending on the clustering policy used. If you use the OSS clustering policy, multi-key commands require all keys to be mapped to [the same hash slot](https://docs.redis.com/latest/rs/databases/configure/oss-cluster-api/#multi-key-command-support).

You might also see `CROSSSLOT` errors with Enterprise clustering policy. Only the following multi-key commands are allowed across slots with Enterprise clustering: `DEL`, `MSET`, `MGET`, `EXISTS`, `UNLINK`, and `TOUCH`.

In Active-Active databases, multi-key write commands (`DEL`, `MSET`, `UNLINK`) can only be run on keys that are in the same slot. However, the following multi-key commands are allowed across slots in Active-Active databases: `MGET`, `EXISTS`, and `TOUCH`. For more information, see [Database clustering](https://docs.redis.com/latest/rs/databases/durability-ha/clustering/#multikey-operations).

## Handling Region Down Scenarios with Active Geo-Replication

Active geo-replication is a powerful feature to dramatically boost availability when using the Enterprise tiers of Azure Cache for Redis. You should take steps, however, to prepare your caches if there's a regional outage.

For example, consider these tips:

- Identify in advance which other cache in the geo-replication group to switch over to if a region goes down.
- Ensure that firewalls are set so that any applications and clients can access the identified backup cache.
- Each cache in the geo-replication group has its own access key. Determine how the application switches to different access keys when targeting a backup cache.
- If a cache in the geo-replication group goes down, a buildup of metadata starts to occur in all the caches in the geo-replication group. The metadata can't be discarded until writes can be synced again to all caches. You can prevent the metadata build-up by _force unlinking_ the cache that is down. Consider monitoring the available memory in the cache and unlinking if there's memory pressure, especially for write-heavy workloads.

It's also possible to use a [circuit breaker pattern](/azure/architecture/patterns/circuit-breaker). Use the pattern to automatically redirect traffic away from a cache experiencing a region outage, and towards a backup cache in the same geo-replication group. Use Azure services such as [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) or [Azure Load Balancer](../load-balancer/load-balancer-overview.md) to enable the redirection.

## Data Persistence vs Data Backup

The [data persistence](cache-how-to-premium-persistence.md) feature in the Enterprise and Enterprise Flash tiers is designed to automatically provide a quick recovery point for data when a cache goes down. The quick recovery is made possible by storing the RDB or AOF file in a managed disk that is mounted to the cache instance. Persistence files on the disk aren't accessible to users.

Many customers want to use persistence to take periodic backups of the data on their cache. We don't recommend that you use data persistence in this way. Instead, use the [import/export](cache-how-to-import-export-data.md) feature. You can export copies of cache data in RDB format directly into your chosen storage account and trigger the data export as frequently as you require. Export can be triggered either from the portal or by using the CLI, PowerShell, or SDK tools.

## Related content

- [Development](cache-best-practices-development.md)
