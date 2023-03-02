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

We strongly recommended to deploy new caches in a zone redundant configuration. This ensures that Redis Enterprise nodes are spread among three availability zones, boosting redundancy from data center-level outages. 

This increases the availability SLA to 99.99%! Zone redundancy is particularly important on the Enterprise tier because it always uses at least three nodes. Two nodes are data nodes, which hold your data. Increasing capacity scales the number of these nodes in even-number increments. There is also an additional node called a quorum node. This node monitors the data nodes and automatically selects the new primary node in case of failover. Zone redundancy ensures that the nodes are distributed evenly across three availability zones, minimizing the potential for quorum loss. Customers are not charged for the quorum node and there is no additional charge for using zone redundancy beyond intra-zonal bandwidth charges.  

## Scaling

In the Enterprise and Enterprise Flash tiers of Azure Cache for Redis it is recommended to prioritize scaling up over scaling out. This is because the Enterprise tiers are built on Redis Enterprise, which is able to utilize the additional CPU cores in larger VMs. Note that the opposite recommendation is true for the Basic, Standard, and Premium tiers, which are built on open-source Redis. There, prioritizing scaling out over scaling up is recommended in most cases. 

## Sharding and CPU Utilization

In the Basic, Standard, and Premium tiers of Azure Cache for Redis, determining the number of vCPUs utilized is fairly straightforward.  Each Redis node runs on a dedicated VM. The Redis server process is single-threaded, utilizing one vCPU on each primary and each replica node. The other vCPUs on the VM are still utilized for other activities, such as workflow coordination for different tasks, health monitoring, and TLS load, among others. Using clustering shards data across additional nodes, which linearly increases the number of vCPUs that can be utilized based on the number of shards in the cluster. 

Redis Enterprise, on the other hand, is able to utilize multiple vCPUs for the Redis instance itself. In other words, all tiers of Azure Cache for Redis can utilize multiple vCPUs for background and monitoring tasks, but only the Enterprise and Enterprise Flash tiers are able to utilize multiple vCPUs per VM for Redis shards. The table below shows the number of effective vCPUs utilized for each SKU and capacity (i.e. scale-out) configuration. The tables just show the number of vCPUs utilized for the primary shards, not the replica shards. Note that there isn’t a one-to-one mapping between the number of shards and number of vCPUs. Some configurations use more shards than available vCPUs. This will boost performance further in some usage scenarios.  

### E10
Capacity	2	4	6	8	10
Effective vCPUs	2	6	6	16	20

### E20
Capacity	2	4	6	8	10
Effective vCPUs	2	6	6	16	20

### E50
Capacity	2	4	6	8	10
Effective vCPUs	6	6	6	30	30

### E100
Capacity	2	4	6	8	10
Effective vCPUs	6	30	30	30	30

### F300
Capacity	3	9
Effective vCPUs	6	30

### F700
Capacity	3	9
Effective vCPUs	30	30

### F1500
Capacity	3	9
Effective vCPUs	30	90

## Clustering on Enterprise

Unlike the Basic, Standard, and Premium tiers, the Enterprise and Enterprise Flash tiers are inherently clustered. The implementation depends on the clustering policy that is selected.
The Enterprise tiers offer two choices for Clustering Policy: OSS and Enterprise. OSS cluster policy is recommended for most applications because it supports higher maximum throughput, but there are advantages and disadvantages to each version. 

The OSS clustering policy implements the same Redis Cluster API as open-source Redis. This allows the Redis client to connect directly to each Redis node, minimizing latency and optimizing network throughput. As a result, near-linear scalability is obtained when scaling the cluster out with additional nodes. The OSS clustering policy generally provides the best latency and throughput performance, but requires your client library to support Redis Clustering. OSS clustering policy also cannot be used with the RediSearch module. 

The Enterprise clustering policy is a simpler configuration that utilizes a single endpoint for all client connections. Using the Enterprise clustering policy routes all requests to a single Redis node which is then used as a proxy, internally routing requests to the correct node in the cluster. The advantage of this approach is that Redis client libraries don’t need to support Redis Clustering to take advantage of multiple nodes. The downside is that the single node proxy can be a bottleneck, either in terms of compute utilization or network throughput. The Enterprise clustering policy is the only one that can be used with the RediSearch module. 

## Multi-key commands

Because the Enterprise tiers use a clustered configuration, you will see CROSSSLOT exceptions on commands that operate on multiple keys. Behavior varies based on which clustering policy is used. When using the OSS clustering policy, multi-key commands require all keys to be mapped to the same hash slot. You may see CROSSSLOT errors with Enterprise clustering policy as well. Only the following multi-key commands are allowed across slots with enterprise clustering: DEL, MSET, MGET, EXISTS, UNLINK, TOUCH. Details are documented here. 

## Handling Region Down Scenarios with Active Geo-Replication

Active geo-replication is a powerful feature in the Enterprise tiers of Azure Cache for Redis that can dramatically boost availability. Steps should still be taken, however, to prepare your caches in case of a regional outage. Some tips include:

- Identify in advance which other cache in the geo-replication group to switch over to if a region goes down.
- Ensure that firewalls are set so that any applications and clients can access the identified backup cache.
- Each cache in the geo-replication group has its own access key. Determine how the application will switch access keys when targeting a backup cache. 
- If a cache in the geo-replication group goes down, a buildup of metadata will start to occur in all the caches in the geo-replication group that cannot be discarded until writes can be synced again to all caches. 

This can be prevented by force unlinking the cache that is down. Consider monitoring the available memory in the cache and unlinking if there is memory pressure, especially for write-heavy workloads.
It is also possible to use a circuit breaker pattern to automatically redirect traffic away from a cache suffering a region outage and towards a backup cache in the same geo-replication group. Azure services like Azure Traffic Manager or Azure Load Balancer can be used to enable the redirection.

## Data Persistence vs Data Backup

The data persistence feature in the Enterprise and Enterprise Flash tier is designed to automatically provide a quick recovery point for data in case the cache goes down. It does this by storing the RDB or AOF file in a managed disk that is mounted to the cache instance. Persistence files on this disk are not accessible to users.

Many customers want to use persistence to take periodic backups of the data on their cache. While this is a great idea, data persistence isn’t recommended to be used in this way. Instead, use the import/export feature. You can export copies of cache data in RDB format directly into your chosen storage account and trigger the data export as frequently as you require. Export can be triggered either from the portal or by using the CLI, PowerShell, or SDK tools. 

## Next steps

- [Development](cache-best-practices-development.md)

