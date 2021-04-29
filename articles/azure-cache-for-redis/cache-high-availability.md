---
title: High availability for Azure Cache for Redis
description: Learn about Azure Cache for Redis high availability features and options
author: yegu-ms
ms.service: cache
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: yegu

---
# High availability for Azure Cache for Redis

Azure Cache for Redis has built-in high availability. The goal of its high availability architecture is to ensure that your managed Redis instance is functioning even when its underlying virtual machines (VMs) are impacted by planned or unplanned outages. It delivers much greater percentage rates than what's attainable by hosting Redis on a single VM.

Azure Cache for Redis implements high availability by using multiple VMs, called *nodes*, for a cache. It configures these nodes such that data replication and failover happen in coordinated manners. It also orchestrates maintenance operations such as Redis software patching. Various high availability options are available in the Standard, Premium, and Enterprise tiers:

| Option | Description | Availability | Standard | Premium | Enterprise |
| ------------------- | ------- | ------- | :------: | :---: | :---: |
| [Standard replication](#standard-replication)| Dual-node replicated configuration in a single datacenter with automatic failover | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_0/)) |✔|✔|-|
| [Zone redundancy](#zone-redundancy) | Multi-node replicated configuration across AZs, with automatic failover | Up to 99.99% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_0/)) |-|Preview|✔|
| [Geo-replication](#geo-replication) | Linked cache instances in two regions, with user-controlled failover | Up to 99.999% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_0/)) |-|✔|Preview|

## Standard replication

An Azure Cache for Redis in the Standard or Premium tier runs on a pair of Redis servers by default. The two servers are hosted on dedicated VMs. Open-source Redis allows only one server to handle data write requests. This server is the *primary* node, while the other *replica*. After it provisions the server nodes, Azure Cache for Redis assigns primary and replica roles to them. The primary node usually is responsible for servicing write as well as read requests from Redis clients. On a write operation, it commits a new key and a key update to its internal memory and replies immediately to the client. It forwards the operation to the replica asynchronously.

:::image type="content" source="media/cache-high-availability/replication.png" alt-text="Data replication setup":::
   
>[!NOTE]
>Normally, a Redis client communicates with the primary node in a Redis cache for all read and write requests. Certain Redis clients can be configured to read from the replica node.
>
>

If the primary node in a Redis cache is unavailable, the replica will promote itself to become the new primary automatically. This process is called a *failover*. The replica will wait for sufficiently long time before taking over in case that the primary node recovers quickly. When a failover happens, Azure Cache for Redis provisions a new VM and joins it to the cache as the replica node. The replica performs a full data synchronization with the primary so that it has another copy of the cache data.

A primary node can go out of service as part of a planned maintenance activity such as Redis software or operating system update. It also can stop working because of unplanned events such as failures in underlying hardware, software, or network. [Failover and patching for Azure Cache for Redis](cache-failover.md) provides a detailed explanation on types of Redis failovers. An Azure Cache for Redis will go through many failovers during its lifetime. The high availability architecture is designed to make these changes inside a cache as transparent to its clients as possible.

>[!NOTE]
>The following is available as a preview.
>
>

In addition, Azure Cache for Redis allows additional replica nodes in the Premium tier. A [multi-replica cache](cache-how-to-multi-replicas.md) can be configured with up to three replica nodes. Having more replicas generally improves resiliency because of the additional nodes backing up the primary. Even with more replicas, an Azure Cache for Redis instance still can be severely impacted by a datacenter- or AZ-level outage. You can increase cache availability by using multiple replicas in conjunction with [zone redundancy](#zone-redundancy).

## Zone redundancy

Azure Cache for Redis supports zone redundant configurations in the Premium and Enterprise tiers. A [zone redundant cache](cache-how-to-zone-redundancy.md) can place its nodes across different [Azure Availability Zones](../availability-zones/az-overview.md) in the same region. It eliminates datacenter or AZ outage as a single point of failure and increases the overall availability of your cache.

### Premium tier

>[!NOTE]
>This is available as a preview.
>
>

The following diagram illustrates the zone redundant configuration for the Premium tier:

:::image type="content" source="media/cache-high-availability/zone-redundancy.png" alt-text="Zone redundancy setup":::
   
Azure Cache for Redis distributes nodes in a zone redundant cache in a round-robin manner over the AZs you've selected. It also determines which node will serve as the primary initially.

A zone redundant cache provides automatic failover. When the current primary node is unavailable, one of the replicas will take over. Your application may experience higher cache response time if the new primary node is located in a different AZ. AZs are geographically separated. Switching from one AZ to another alters the physical distance between where your application and cache are hosted. This change impacts round-trip network latencies from your application to the cache. The extra latency is expected to fall within an acceptable range for most applications. We recommend that you test your application to ensure that it can perform well with a zone-redundant cache.

### Enterprise tiers

A cache in either Enterprise tier runs on a Redis Enterprise cluster. It requires an odd number of server nodes at all times to form a quorum. By default, it's comprised of three nodes, each hosted on a dedicated VM. An Enterprise cache has two same-sized *data nodes* and one smaller *quorum node*. An Enterprise Flash cache has three same-sized data nodes. The Enterprise cluster divides Redis data into partitions internally. Each partition has a *primary* and at least one *replica*. Each data node holds one or more partitions. The Enterprise cluster ensures that the primary and replica(s) of any partition are never colocated on the same data node. Partitions replicate data asynchronously from primaries to their corresponding replicas.

When a data node becomes unavailable or a network split happens, a failover similar to the one described in [Standard replication](#standard-replication) takes place. The Enterprise cluster uses a quorum-based model to determine which surviving nodes will participate in a new quorum. It also promotes replica partitions within these nodes to primaries as needed.

## Geo-replication

[Geo-replication](cache-how-to-geo-replication.md) is a mechanism for linking two or more Azure Cache for Redis instances, typically spanning two Azure regions. 

### Premium tier

>[!NOTE]
>Geo-replication in the Premium tier is designed mainly for disaster recovery.
>
>

Two Premium tier cache instances can be connected through [geo-replication](cache-how-to-geo-replication.md) so that you can back up your cache data to a different region. Once linked together, one instance is designated as the primary linked cache and the other as the secondary linked cache. Only the primary cache accepts read and write requests. Data written to the primary cache is replicated to the secondary cache. An application access the cache through separate endpoints for the primary and secondary caches. The application must send all write requests to the primary cache when it's deployed in multiple Azure regions. It can read from either the primary or secondary cache. In general, you want to your application's compute instances to read from the closest caches to reduce latency. Data transfer between the two cache instances is secured by TLS.

Geo-replication doesn't provide automatic failover due to concerns over added network roundtrip time between regions if the rest of your application remains in the primary region. You'll need to manage and initiate the failover by unlinking the secondary cache. This will promote it to be the new primary instance.

### Enterprise tiers

>[!NOTE]
>This is available as a preview.
>
>

The Enterprise tiers support a more advanced form of geo-replication, called [active geo-replication](cache-how-to-active-geo-replication.md). Leveraging conflict-free replicated data types, the Redis Enterprise software supports writes to multiple cache instances and takes care of merging of changes and resolving conflicts if necessary. Two or more Enterprise tier cache instances in different Azure regions can be joined to form an active geo-replicated cache. An application using such a cache can read and write to the geo-distributed cache instances through corresponding endpoints. It should use what is the closest to each compute instance, which gives the lowest latency. The application also needs to monitor the cache instances and switch to another region if one of the instances becomes unavailable. For more information on how active geo-replication works, see [Active-Active Geo-Distriubtion (CRDTs-Based)](https://redislabs.com/redis-enterprise/technology/active-active-geo-distribution/).

## Next steps

Learn more about how to configure Azure Cache for Redis high-availability options.

* [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
* [Add replicas to Azure Cache for Redis](cache-how-to-multi-replicas.md)
* [Enable zone redundancy for Azure Cache for Redis](cache-how-to-zone-redundancy.md)
* [Set up geo-replication for Azure Cache for Redis](cache-how-to-geo-replication.md)
