---
title: High availability for Azure Managed Redis (preview)
description: Learn about Azure Managed Redis high availability features and options for Azure Managed Redis


ms.service: azure-managed-redis
ms.topic: conceptual
ms.date: 11/15/2024
ms.custom: references_regions, ignite-2024
---
# High availability and disaster recovery with Azure Managed Redis (preview)

As with any cloud systems, unplanned outages can occur that result in a virtual machines (VM) instance, an Availability Zone, or a complete Azure region going down. We recommend customers have a plan in place to handle zone or regional outages.

This article presents the information for customers to create a _business continuity and disaster recovery plan_ for their Azure Managed Redis (preview) implementation.

High availability options:

| Option | Description | Availability |
| ------------------- | ------- | ------- |
| [Standard replication](#standard-replication-for-high-availability)| Dual-node replicated configuration in a single data center with automatic failover | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |
| [Zone redundancy](#zone-redundancy) | Multi-node replicated configuration across Availability Zones, with automatic failover | 99.99% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |
| [Geo-replication](#active-geo-replication) | Linked cache instances in two regions, with user-controlled failover | Active (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |
| | <!-- With active geo-replication, there actually isn't failover involved, which is nifty! The instances are always being replicated (this differs from the older passive geo-replication). I think we can also list the availability as "99.999%" rather than saying "Active"-->|
| [Import/Export](#importexport) | Point-in-time snapshot of data in cache.  | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |
| [Persistence](#persistence) | Periodic data saving to storage account.  | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |

## Standard replication for high availability

Recommended for: **High availability**

Azure Managed Redis has a high availability architecture that ensures your managed instance is functioning, even when outages affect the underlying virtual machines (VMs). Whether the outage is planned or unplanned outages, Azure Managed Redis delivers greater percentage availability rates than what's attainable by hosting Redis on a single VM. An Azure Managed Redis setup runs on a pair of Redis servers by default. The two servers are hosted on dedicated VMs.

With Azure Managed Redis, one server is the _primary_ node, while the other is the _replica_. After it provisions the server nodes, Azure Managed Redis assigns primary and replica roles to them. The primary node usually is responsible for servicing write and read requests from  clients. On a write operation, it commits a new key and a key update to its internal memory and replies immediately to the client. It forwards the operation to the _replica_ asynchronously.

:::image type="content" source="media/managed-redis-high-availability/replication.png" alt-text="Data replication setup":::

If the _primary_ node in a cache is unavailable, the _replica_ automatically promotes itself to become the new primary. This process is called a _failover_. A failover is just two nodes, primary/replica, trading roles, replica/primary, with one of the nodes possibly going offline for a few minutes. In most failovers, the primary and replica nodes coordinate the handover so you have near zero time without a primary.

The former primary goes offline briefly to receive updates from the new primary. Then, the now replica comes back online and rejoins the cache fully synchronized. The key is that when a node is unavailable, it's a temporary condition and it comes back online.

A typical failover sequence looks like this, when a primary needs to go down for maintenance:

1. Primary and replica nodes negotiate a coordinated failover and trade roles.
1. Replica (formerly primary) goes offline for a reboot.
1. A few seconds or minutes later, the replica comes back online.
1. Replica syncs the data from the primary.

A primary node can go out of service as part of a planned maintenance activity, such as an update to Redis software or the operating system. It also can stop working because of unplanned events such as failures in underlying hardware, software, or network. [Failover and patching for Azure Managed Redis](managed-redis-failover.md) provides a detailed explanation on types of failovers. An Azure Managed Redis goes through many failovers during its lifetime. The design of the high availability architecture makes these changes inside a cache as transparent to its clients as possible.

## Zone redundancy

Recommended for: **High availability**, **Disaster recovery - intra region**

Azure Managed Redis supports zone redundant configuration by default. A [zone redundant cache](../cache-how-to-zone-redundancy.md) automatically places its nodes across different [Azure Availability Zones](/azure/reliability/availability-zones-overview) in the same region. When a zone goes down, cache nodes in other zones are available to keep the cache functioning as usual. It eliminates data center or Availability Zone outage as a single point of failure and increases the overall availability of your cache.

#### Zone Down Experience

When a data node becomes unavailable or a network split happens, a failover similar to the one described in [Standard replication](#standard-replication-for-high-availability) takes place. The cluster uses a quorum-based model to determine which surviving nodes participate in a new quorum. It also promotes replica partitions within these nodes to primaries as needed.

### Regional availability

Zone-redundant caches are available in the following regions:

| Americas | Europe | Middle East | Africa | Asia Pacific |
|---|---|---|---|---|
| Canada Central* | North Europe | | | Australia East |
| Central US* | UK South | | | Central India |
| East US | West Europe | | | Southeast Asia |
| East US 2 | | | | Japan East* |
| South Central US | | | | East Asia* |
| West US 2 | | | | |
| West US 3 | | | | |
| Brazil South | | | | |

## Persistence

Recommended for: **Data durability**

Because your cache data is stored in memory, a rare and unplanned failure of multiple nodes can cause all the data to be dropped. To avoid losing data completely, [Redis persistence](https://redis.io/topics/persistence) allows you to take periodic snapshots of in-memory data, and store it on a managed disk attached directly to the cache instance. In case of a data loss, the cache data is restored automatically using the snapshot on the managed disk. For more information, see [Configure data persistence for an Azure Managed Redis instance](managed-redis-how-to-persistence.md).

## Import/Export

Recommended for: **Disaster recovery**

Azure Managed Redis supports the option to import and export Redis Database (RDB) files to provide data portability. It allows you to import data into Azure Managed Redis or export data from Azure Managed Redis by using an RDB snapshot. The RDB snapshot from a cache is exported to a blob in an Azure Storage Account. You can create a script to trigger export periodically to your storage account. For more information, see [Import and Export data in Azure Managed Redis](managed-redis-how-to-import-export-data.md).

### Storage account for export

Consider choosing a geo-redundant storage account to ensure high availability of your exported data. For more information, see [Azure Storage redundancy](/azure/storage/common/storage-redundancy?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json).

## Active geo-replication

Recommended for: **High Availability**, **Disaster recovery - multi-region**

Geo-replication is a mechanism for linking Azure Managed Redis instances across multiple Azure regions. Azure Managed Redis supports an advanced form of geo-replication called [active geo-replication](managed-redis-how-to-active-geo-replication.md) that offers both higher availability and cross-region disaster recovery across multiple regions. The Azure Managed Redis software uses conflict-free replicated data types to support writes to multiple cache instances, merges changes, and resolves conflicts. You can join up to five cache instances in different Azure regions to form a geo-replication group.

An application using such a cache can read and write to any of the geo-distributed cache instances through their corresponding endpoints. The application should use what is the closest to each application instance, giving you the lowest latency. For more information, see [Configure active geo-replication for Azure Managed Redis instances](managed-redis-how-to-active-geo-replication.md).

If a region of one of the caches in your replication group goes down, your application needs to switch to another region that is available.

When a cache in your replication group is unavailable, we recommend monitoring memory usage for other caches in the same replication group. While one of the caches is down, all other caches in the replication group start saving metadata that they couldn't share with the cache that is down. If the memory usage for the available caches starts growing at a high rate after one of the caches goes down, consider unlinking the cache that is unavailable from the replication group.

For more information on force-unlinking, see [Force-Unlink if there's region outage](managed-redis-how-to-active-geo-replication.md#force-unlink-if-theres-a-region-outage).

## Delete and recreate cache

If you experience a regional outage, consider recreating your cache in a different region, and updating your application to connect to the new cache instead. It's important to understand that data is lost during a regional outage, unless you use active geo-replication. Your application code should be resilient to data loss.

Once the affected region is restored, your unavailable Azure Managed Redis is automatically restored, and available for use again. For more strategies for moving your cache to a different region, see [Move Azure Managed Redis instances to different regions](../cache-moving-resources.md).

## Next steps

- [Azure Managed Redis service tiers](managed-redis-overview.md#choosing-the-right-tier)
- [Add replicas to Azure Managed Redis](../cache-how-to-multi-replicas.md) <!-- We can delete this one-->
- [Set up geo-replication for Azure Managed Redis](../cache-how-to-geo-replication.md)
