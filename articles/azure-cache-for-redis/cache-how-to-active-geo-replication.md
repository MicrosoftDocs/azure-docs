---
title: Configure active geo-replication for Enterprise Azure Cache for Redis instances
description: Learn how to replicate your Azure Cache for Redis Enterprise instances across Azure regions
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: franlanglois
---
# Configure active geo-replication for Enterprise Azure Cache for Redis instances (Preview)

In this article, you'll learn how to configure an active geo-replicated Azure Cache using the Azure portal.

Active geo-replication groups up to five Enterprise Azure Cache for Redis instances into a single cache that spans across Azure regions. All instances act as the local primaries. An application decides which instance or instances to use for read and write requests.

> [!NOTE]
> Data transfer between Azure regions will be charged at standard [bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/).

## Create or join an active geo-replication group

> [!IMPORTANT]
> Active geo-replication must be enabled at the time an Azure Cache for Redis is created.
>
>

1. In the **Advanced** tab of **New Redis Cache** creation UI, select **Enterprise** for **Clustering Policy**.

    ![Configure active geo-replication](./media/cache-how-to-active-geo-replication/cache-active-geo-replication-not-configured.png)
    
    The OSS Cluster mode allows clients to communicate with Redis using the same Redis Cluster API as open-source Redis. This mode provides optimal latency and near-linear scalability improvements when scaling the cluster. Your client library must support clustering to use the OSS Cluster mode.

    The Enterprise Cluster mode is a simpler configuration that exposes a single endpoint for client connections. This mode allows an application designed to use a standalone, or non-clustered, Redis server to seamlessly operate with a scalable, multi-node, Redis implementation. Enterprise Cluster mode abstracts the Redis Cluster implementation from the client by internally routing requests to the correct node in the cluster. Clients are not required to support OSS Cluster mode.

1. Select **Configure** to set up **Active geo-replication**.

1. Create a new replication group, for a first cache instance, or select an existing one from the list.

    ![Link caches](./media/cache-how-to-active-geo-replication/cache-active-geo-replication-new-group.png)

1. Select **Configure** to finish.

    ![Active geo-replication configured](./media/cache-how-to-active-geo-replication/cache-active-geo-replication-configured.png)

1. Wait for the first cache to be created successfully. Repeat the above steps for each additional cache instance in the geo-replication group.

## Remove from an active geo-replication group

To remove a cache instance from an active geo-replication group, you just delete the instance. The remaining instances will reconfigure themselves automatically.

## Next steps

Learn more about Azure Cache for Redis features.

* [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
* [High availability for Azure Cache for Redis](cache-high-availability.md)
