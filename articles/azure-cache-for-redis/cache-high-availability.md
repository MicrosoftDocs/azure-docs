---
title: High availability for Azure Cache for Redis
description: Learn about Azure Cache for Redis high availability features and options
author: yegu-ms
ms.service: cache
ms.topic: conceptual
ms.date: 10/28/2020
ms.author: yegu

---
# High availability for Azure Cache for Redis

Azure Cache for Redis has built-in high availability. The goal of its high availability architecture is to ensure that your managed Redis instance is functioning even when its underlying virtual machines (VMs) are impacted by planned or unplanned outages. It delivers much greater percentage rates than what's attainable by hosting Redis on a single VM.

Azure Cache for Redis implements high availability by using multiple VMs, called *nodes*, for a cache. It configures these nodes such that data replication and failover happen in coordinated manners. It also orchestrates maintenance operations such as Redis software patching. Various high availability options are available in the Standard, Premium and Enterprise tiers:

| Option | Description | Availability | Standard | Premium | Enterprise |
| ------------------- | ------- | ------- | :------: | :---: | :---: |
| [Standard replication](#standard-replication)| Dual-node replicated configuration in a single datacenter or availability zone (AZ), with automatic failover | 99.9% |✔|✔|-|
| [Enterprise cluster](#enterprise-cluster) | Linked cache instances in two regions, with automatic failover | 99.9% |-|-|✔|
| [Zone redundancy](#zone-redundancy) | Multi-node replicated configuration across AZs, with automatic failover | 99.95% (standard replication), 99.99% (Enterprise cluster) |-|✔|✔|
| [Geo-replication](#geo-replication) | Linked cache instances in two regions, with user-controlled failover | 99.9% (for a single region) |-|✔|-|

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

In addition, Azure Cache for Redis allows additional replica nodes in the Premium tier. A [multi-replica cache](cache-how-to-multi-replicas.md) can be configured with up to three replica nodes. Having more replicas generally improves resiliency because of the additional nodes backing up the primary. Even with more replicas, an Azure Cache for Redis instance still can be severely impacted by a datacenter- or AZ-wide outage. You can increase cache availability by using multiple replicas in conjunction with [zone redundancy](#zone-redundancy).

## Enterprise cluster

>[!NOTE]
>This is available as a preview.
>
>

An Azure Cache for Redis in the Enterprise tier runs on an Enterprise Cluster comprising of at least three cluster nodes, each hosted on a dedicated VM. Two of the nodes are *data nodes*, that host Redis servers. The two servers are hosted on dedicated VMs. Another node is a smaller sized *quorum node* who's role is to maintain cluster quorum during network split events. Any one of the nodes in the cluster can be the *Cluster Primary (master)* node. Each one of the *data nodes* holds one or more *primary* and *replica* Redis servers. The Enterprise cluster ensures that *primary* and *replica* are never co-located on the same *data node*, while also ensuring that Redis traffic in the form or reads and writes are served by one or more *primary* Redis servers while exposing a single endpoint to the Redis client. The *replica* server/s asynchronously replicate data. Failovers follow a similar pattern to the one described in [Standard replication](#standard-replication) with some exceptions: if one of the nodes become unavailable or in the case of a network split, the majority of the surviving nodes will have *quorum*. If not already a *cluster primary*, one of the nodes in the *quorum* will be elected *cluster primary* while the minority nodes, if any, will be considered to have *lost quoroum* and any Redis server on them will be defunct.  The surviving Redis servers, if not already *primary* are promoted to *primary* and will continue to serve traffic. A new compute node will spin up to take the place of the missing node.

## Zone redundancy

>[!NOTE]
>This is available as a preview.
>
>

Azure Cache for Redis supports zone redundant configurations in the Premium and Enterprise tiers. A [zone redundant cache](cache-how-to-zone-redundancy.md) can place its nodes across different [Azure Availability Zones](../availability-zones/az-overview.md) in the same region. It eliminates datacenter or AZ outage as a single point of failure and increases the overall availability of your cache.

The following diagram illustrates the zone redundant configuration:

:::image type="content" source="media/cache-high-availability/zone-redundancy.png" alt-text="Zone redundancy setup":::
   
Azure Cache for Redis distributes nodes in a zone redundant cache in a round-robin manner over the AZs you've selected. It also determines which node will serve as the primary initially.

A zone redundant cache provides automatic failover. When the current primary node is unavailable, one of the replicas will take over. Your application may experience higher cache response time if the new primary node is located in a different AZ. AZs are geographically separated. Switching from one AZ to another alters the physical distance between where your application and cache are hosted. This change impacts round-trip network latencies from your application to the cache. The extra latency is expected to fall within an acceptable range for most applications. We recommend that you test your application to ensure that it can perform well with a zone-redundant cache.

## Geo-replication

Geo-replication is designed mainly for disaster recovery. It gives you the ability to configure an Azure Cache for Redis instance, in a different Azure region, to back up your primary cache. [Set up geo-replication for Azure Cache for Redis](cache-how-to-geo-replication.md) gives a detailed explanation on how geo-replication works.

## Next steps

Learn more about how to configure Azure Cache for Redis high-availability options.

* [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
* [Add replicas to Azure Cache for Redis](cache-how-to-multi-replicas.md)
* [Enable zone redundancy for Azure Cache for Redis](cache-how-to-zone-redundancy.md)
* [Set up geo-replication for Azure Cache for Redis](cache-how-to-geo-replication.md)