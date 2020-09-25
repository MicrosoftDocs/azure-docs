---
title: High availability for Azure Cache for Redis | Microsoft Docs
description: Learn about Azure Cache for Redis high availability features and options
author: yegu-ms

ms.service: cache
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: yegu

---
# High availability for Azure Cache for Redis

Azure Cache for Redis has high availability built-in. The goal of its high availability architecture is to ensure that your managed Redis instance is up and running even when its underlying virtual machines (VMs) are affected by planned or unplanned outages. It delivers much greater percentage rates than what's attainable by hosting Redis on a single VM.

Azure Cache for Redis implements high availability by using multiple VMs, called *nodes*, for a cache. It configures these nodes such that data replication and failover happen in coordinated manners. It also orchestrates maintenance operations such as Redis software patching. Various high availability options are available in the Standard and Premium tiers:

| Option | Description | Availability | Standard | Premium |
| ------------------- | ------- | :-----: | :------: | :---: |
| [Standard replication](#standard-replication) | 99.9% | Dual-node replicated configuration in a single datacenter or availability zone (AZ), with automatic failover |✔|✔|
| [Multiple replicas](#multiple-replicas) | 99.95% (with zone redundancy) | Multi-node replicated configuration in one or more AZs, with automatic failover |-|✔|
| [Zone redundancy](#zone-redundancy) | 99.95% (with multiple replicas) | Multi-node replicated configuration across AZs, with automatic failover |-|✔|
| [Geo-replication](#geo-replication) | 99.9% (for a single region) | Linked cache instances in two regions, with user-controlled failover |-|✔|

## Standard replication

A Standard or Premium tier cache in Azure Cache for Redis runs on a pair of Redis servers by default. The two servers are hosted on dedicated VMs. Open-source Redis allows only one server to handle data write requests. This is called the *primary* node, and the other *replica*. After it provisions the server nodes, Azure Cache for Redis assigns primary and replica roles to them. The primary node is responsible for all data requests from Redis clients. On a write operation, it first commits a new key and a key update to its internal memory and responds that the request has succeeded. It then forwards the operation to the replica.

>[!NOTE]
>Normally a Redis client communicates with the primary node in a Redis cache for all read and write requests. Certain Redis clients can be configured to read from the replica node.
>
>

If the primary node in a Redis cache becomes unavailable, the replica detects that occurrence and promotes itself to be the new primary automatically. This is known as a failover. The replica waits for a sufficiently long-enough period of time before taking over so as to prevent premature promotion due to transient connectivity issues. When a failover happens, Azure Cache for Redis brings up a new VM and joins it to the cache as the replica node. Subsequently the replica performs a full data synchronization with the primary so that it has another copy of the cache data.

A primary node can go out of service due to planned maintenance activities such as Redis software or operating system updates. It also can stop functioning due to unplanned events such as failures in underlying hardware, software or network. [Failover and patching for Azure Cache for Redis](cache-failover.md) provides a detailed explanation on types of Redis failover. An Azure Cache for Redis will go through many failovers during its lifetime. The high availability architecture is designed to make these changes inside a cache as transparent to its clients as possible.

## Multiple replicas

Azure Cache for Redis allows additional replica nodes in the Premium tier. A [multi-replica cache](cache-how-to-multi-replicas.md) can be configured with up to three replica nodes. Having more replicas generally improves resiliency because of the additional nodes backing up the primary. Even with more replicas, an Azure Cache for Redis instance still can be severely impacted by a datacenter- or AZ-wide outage and goes down completely. You should use multiple replicas in conjunction with [zone redundancy](#zone-redundancy) to get higher availability.

>[!NOTE]
>This is available as a preview.
>
>

## Zone redundancy

Azure Cache for Redis supports zone redundant configurations in the Premium tier. A [zone redundant cache](cache-how-to-zone-redundancy.md) can place its nodes across different [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview) in the same region. It eliminates datacenter or AZ outage as a single point of failure and increases the overall availability of your cache.

>[!NOTE]
>This is available as a preview.
>
>

The following diagram illustrates the zone redundant configuration:

Azure Cache for Redis distributes nodes in a zone redundant cache in a round-robin manner over the AZs you've selected. It also determines which node will serve as the primary initially.

A zone redundant cache provides automatic failover. When the current primary node is unavailable, one of the replicas will take over. Your application may experience higher cache response time if the new primary node is located in a different AZ. AZs are geographically separated. Switching from one AZ to another changes the physical distance between where your application is hosted and where your cache is serving from. This impacts round-trip network latencies from your application to the cache. The extra latency is expected to fall within an acceptable range for most applications. You should test to ensure that's the case for your specific application.

## Geo-replication

Geo-replication is designed mainly for disaster recovery. It gives you the ability to configure an Azure Cache for Redis instance, in a different Azure region, to back up your primary cache. [Set up geo-replication for Azure Cache for Redis](cache-how-to-geo-replications.md) provides a detailed explanation on how geo-replication works.

## Next steps

Learn more about how to configure Azure Cache for Redis high-availability options.

* [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
* [Add replicas to Azure Cache for Redis](cache-how-to-multi-replicas.md)
* [Enable zone redundancy for Azure Cache for Redis](cache-how-to-zone-redundancy.md)
* [Set up geo-replication for Azure Cache for Redis](cache-how-to-geo-replications.md)
