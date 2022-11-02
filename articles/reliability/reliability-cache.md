---
title: Reliability in Azure Cache for Redis
description: Find out about reliability in Azure Cache for Redis
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 10/10/2022
---

<!--#Customer intent:  I want to understand reliability support in Azure Cache for Redis so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# What is reliability in Azure Cache for Redis?

This article describes reliability support in Azure Cache for Redis and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

As with any cloud systems,  unexpected outages may occur that result in downtime for a virtual machines (VM) instance, an availability zone, or an entire Azure region. This article provides information that will help you plan for these possible zone or regional outages.

## Standard replication for high availability

Azure Cache for Redis has a high availability architecture that ensures your managed instance is functioning, even when outages affect the underlying virtual machines (VMs). Whether the outage is planned or unplanned, Azure Cache for Redis delivers a much greater percentage of availability rates than what's attainable by hosting Redis on a single VM.

An Azure Cache for Redis in the applicable tiers runs on a pair of Redis servers by default. The two servers are hosted on dedicated VMs. Open-source Redis allows only one server to handle data write requests.

With Azure Cache for Redis, one server is the primary node, while the other is the replica. After Azure Cache provisions the server nodes, the service assigns the primary and replica roles to them. The primary node that is usually the one that is responsible for servicing read/write requests from clients. On a write operation, the primary node commits a new key and a key update to its internal memory and replies immediately to the client. The primary node then asynchronously forwards the operation to the replica.

:::image type="content"  alt-text="Diagram showing standard replication for high availability in Azure Cache"  source="../azure-cache-for-redis/media/cache-high-availability/replication.png":::

>[!NOTE]
>Normally, an Azure Cache for Redis client application communicates with the primary node in a cache for all read and write requests. Certain clients can be configured to read from the replica node.

If the primary node in a cache is unavailable, the replica automatically promotes itself to become the new primary. This process is called a *failover*. A failover is just two nodes, primary/replica, trading roles, replica/primary, with one of the nodes possibly going offline for a few minutes. In most failovers, the primary and replica nodes coordinate the handover so you have near zero time without a primary.

The former primary goes offline briefly to receive updates from the new primary. Then, the new replica comes back online and rejoins the cache fully synchronized. The key is that when a node is unavailable, it's a temporary condition and it comes back online.

A typical failover sequence looks like this, when a primary needs to go down for maintenance:

1. Primary and replica nodes negotiate a coordinated failover and trade roles.
1. Replica (formerly primary) goes offline for a reboot.
1. A few seconds or minutes later, the replica comes back online.
1. Replica syncs the data from the primary.

A primary node can go out of service as part of a planned maintenance activity, such as an update to Redis software or the operating system. It also can stop working because of unplanned events such as failures in underlying hardware, software, or network. Failover and patching for Azure Cache for Redis provides a detailed explanation on types of failovers. An Azure Cache for Redis goes through many failovers during its lifetime. The design of the high availability architecture makes these changes inside a cache as transparent to its clients as possible.

Also, Azure Cache for Redis provides more replica nodes in the Premium tier. A multi-replica cache can be configured with up to three replica nodes. Having more replicas generally improves resiliency because you have nodes backing up the primary. Even with more replicas, an Azure Cache for Redis instance still can be severely impacted by a data center or Availability Zone outage. You can increase cache availability by using multiple replicas with zone redundancy.

## Availability zone support

Applicable tiers: **Premium, Enterprise, Enterprise Flash**

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](az-service-support.md).

There are three basic types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](az-service-support.md#azure-services-with-availability-zone-support).

Azure Cache for Redis offers various high availability options are in Standard, Premium, and Enterprise tiers:

| Option | Description | Availability | Standard | Premium | Enterprise |
| ------------------- | ------- | ------- | :------: | :---: | :---: |
| [Standard replication](#availability-zone-support)| Dual-node replicated configuration in a single data center with automatic failover | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |✔|✔|✔|
| [Zone redundancy](#zone-redundancy) | Multi-node replicated configuration across Availability Zones, with automatic failover | 99.9% in Premium; 99.99% in Enterprise (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |-|✔|✔|
| [Geo-replication](#geo-replication) | Linked cache instances in two regions, with user-controlled failover | Premium; Enterprise (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |-|Passive|Active|
| [Import/Export](#importexport) | Point-in-time snapshot of data in cache.  | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |-|✔|✔|
| [Persistence](#persistence) | Periodic data saving to storage account.  | 99.9% (see [details](https://azure.microsoft.com/support/legal/sla/cache/v1_1/)) |-|✔|Preview|


### Zone Redundancy
Azure Cache for Redis supports zone redundant configurations in the Premium and Enterprise tiers. A zone redundant cache can place its nodes across different Azure Availability Zones in the same region. It eliminates data center or AZ outage as a single point of failure and increases the overall availability of your cache. See this article for information on how to set it up.

If a cache is configured to use two or more zones as described above, the cache nodes are created in different zones. When a zone goes down, cache nodes in other zones are available to keep the cache functioning as usual.

Azure Cache for Redis supports zone redundant configurations in the Premium and Enterprise tiers. A zone redundant cache can place its nodes across different Azure Availability Zones in the same region. It eliminates data center or Availability Zone outage as a single point of failure and increases the overall availability of your cache.

#### Premium tier support

The following diagram illustrates the zone redundant configuration for the Premium tier:

:::image type="content"  alt-text="Diagram showing standard replication for Premium support zone-redundant configuration in Azure Cache"  source="../azure-cache-for-redis/media/cache-high-availability/zone-redundancy.png":::

Azure Cache for Redis distributes nodes in a zone redundant cache in a round-robin manner over the selected Availability Zones. It also determines which node will serve as the primary initially.

A zone redundant cache provides automatic failover. When the current primary node is unavailable, one of the replicas will take over. Your application may experience higher cache response time if the new primary node is located in a different AZ. Availability Zones are geographically separated. Switching from one AZ to another alters the physical distance between where your application and cache are hosted. This change impacts round-trip network latencies from your application to the cache. The extra latency is expected to fall within an acceptable range for most applications. We recommend you test your application to ensure it does well with a zone-redundant cache.

#### Enterprise and Enterprise Flash tier support

A cache in either Enterprise tier runs on a Redis Enterprise cluster. It always requires an odd number of server nodes to form a quorum. By default, it has three nodes, each hosted on a dedicated VM.

- An Enterprise cache has two same-sized *data nodes* and one smaller quorum node.
- An Enterprise Flash cache has three same-sized data nodes.

The Enterprise cluster divides Azure Cache for Redis data into partitions internally. Each partition has a primary and at least one replica. Each data node holds one or more partitions. The Enterprise cluster ensures that the primary and replica(s) of any partition are never collocated on the same data node. Partitions replicate data asynchronously from primaries to their corresponding replicas.

When a data node becomes unavailable or a network split happens, a failover similar to the one described in Standard replication takes place. The Enterprise cluster uses a quorum-based model to determine which surviving nodes participate in a new quorum. It also promotes replica partitions within these nodes to primaries as needed.

### Regional availability

<!-- Can we provide List regions that Redis Cache supports availability zones, or regions that don't support availability zones (whichever is less). If Redis provides AZ support in all Azure regions were AZ is supported, lets add one line here to indicate the same --> 

Zone-redundant Enterprise and Enterprise Flash plans are available in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|


Zone-redundant Premium plans are available in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|


### Create a resource with availability zone enabled

To learn how to set up zone redundancy for your Premium and Enterprise tier Azure Cache for Redis instances. see  [Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md).

### Zone down experience

<!-- Can we provide some guidance to users on what the experience would be during a zone down and what kind of failures they can see before secondary nodes pick up traffic? -->


### Availability zone redeployment and migration

Currently, the only way to convert a resource from non-availability zone support to availability zone support is to redeploy your current cache. To learn how to redeploy your current cache, see [Migrate an Azure Cache for Redis instance to availability zone support](../reliability/migrate-cache-redis.md)


## Disaster recovery: cross region failover

<!-- It’ll be good to give explicit Indication who is responsible for setup (Microsoft or Customer)? -->

When entire Azure regions or datacenters experience downtime, your mission-critical code needs to continue processing in a different region. See [Azure Functions geo-disaster recovery and high availability](../azure-functions/functions-geo-disaster-recovery.md) for guidance on how to setup a cross region failover

### Geo-replication 

Geo-replication is a mechanism for linking two or more Azure Cache for Redis instances, typically spanning two Azure regions. Geo-replication is primarily designed for disaster recovery. Two Premium tier cache instances are connected through geo-replication in a way that provides reads and writes to your primary cache, and that data is replicated to the secondary cache. For more information on how to set it up, see [Configure geo-replication for Premium Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-geo-replication.md).

If the region hosting the primary cache goes down, you’ll need to start the failover by: first, unlinking the secondary cache, and then, updating your application to point to the secondary cache for reads and writes.

### Active geo-replication

Applicable tiers: **Enterprise**, **Enterprise Flash**

The Enterprise tiers support a more advanced form of geo-replication called [active geo-replication](../azure-cache-for-redis/cache-how-to-active-geo-replication.md). The Azure Cache for Redis Enterprise software uses conflict-free replicated data types to support writes to multiple cache instances, merges changes, and resolves conflicts. You can join up to five Enterprise tier cache instances in different Azure regions to form a geo-replication group.

An application using such a cache can read and write to any of the geo-distributed cache instances through their corresponding endpoints. The application should use what is the closest to each application instance, giving you the lowest latency. For more information, see [Configure active geo-replication for Enterprise Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-active-geo-replication.md).

If a region of one of the caches in your replication group goes down, your application needs to switch to another region that is available.

When a cache in your replication group is unavailable, we recommend monitoring memory usage for other caches in the same replication group. While one of the caches is down, all other caches in the replication group start saving metadata that they couldn't share with the cache that is down. If the memory usage for the available caches starts growing at a high rate after one of the caches goes down, consider unlinking the cache that is unavailable from the replication group.

For more information on force-unlinking, see [Force-Unlink if there's region outage](../azure-cache-for-redis/cache-how-to-active-geo-replication.md#force-unlink-if-theres-a-region-outage).

### Delete and recreate cache

Applicable tiers: **Standard**, **Premium**, **Enterprise**, **Enterprise Flash**

If you experience a regional outage, consider recreating your cache in a different region, and updating your application to connect to the new cache instead. It's important to understand that data will be lost during a regional outage. Your application code should be resilient to data loss.

Once the affected region is restored, your unavailable Azure Cache for Redis is automatically restored, and available for use again. For more strategies for moving your cache to a different region, see [Move Azure Cache for Redis instances to different regions](../azure-cache-for-redis/cache-moving-resources.md).

### Cross-region disaster recovery in multi-region geography
<!-- Placeholder for more information -->

#### Outage detection, notification, and management
<!-- Placeholder for more information -->

#### Set up disaster recovery and outage detection
<!-- Placeholder for more information -->

### Single-region geography disaster recovery
<!-- Placeholder for more information -->

### Additional guidance

#### Persistence

Applicable tiers: **Premium**, **Enterprise (preview)**, **Enterprise Flash (preview)**

Because your cache data is stored in memory, a rare and unplanned failure of multiple nodes can cause all the data to be dropped. To avoid losing data completely, [Redis persistence](https://redis.io/topics/persistence) allows you to take periodic snapshots of in-memory data, and store it to your storage account. If you experience a failure across multiple nodes causing data loss, your cache loads the snapshot from storage account. For more information, see [Configure data persistence for a Premium Azure Cache for Redis instance](../azure-cache-for-redis/cache-how-to-premium-persistence.md).

##### Storage account for persistence

Consider choosing a geo-redundant storage account to ensure high availability of persisted data. For more information, see [Azure Storage redundancy](../storage/common/storage-redundancy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

#### Import/Export

Applicable tiers: **Premium**, **Enterprise**, **Enterprise Flash**

Azure cache for Redis supports the option to import and export Redis Database (RDB) files to provide data portability. It allows you to import data into Azure Cache for Redis or export data from Azure Cache for Redis by using an RDB snapshot. The RDB snapshot from a premium cache is exported to a blob in an Azure Storage Account. You can create a script to trigger export periodically to your storage account. For more information, see [Import and Export data in Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-import-export-data.md).

#### Storage account for export

Consider choosing a geo-redundant storage account to ensure high availability of your exported data. For more information, see [Azure Storage redundancy](../storage/common/storage-redundancy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Next steps

Learn more about how to configure Azure Cache for Redis high-availability options.

- [Azure Cache for Redis Premium service tiers](../azure-cache-for-redis/cache-overview.md#service-tiers)
- [Add replicas to Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-multi-replicas.md)
- [Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md)
- [Set up geo-replication for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-geo-replication.md)