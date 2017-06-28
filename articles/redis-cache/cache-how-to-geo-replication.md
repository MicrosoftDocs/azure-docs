---
title: How to configure Geo-replication for Azure Redis Cache | Microsoft Docs
description: Learn how to replicate your Azure Redis Cache instances across geographical regions.
services: redis-cache
documentationcenter: ''
author: steved0x
manager: douge
editor: ''

ms.assetid: 375643dc-dbac-4bab-8004-d9ae9570440d
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: sdanie

---
# How to configure Geo-replication for Azure Redis Cache

Geo-replication provides a mechanism for linking two Premium tier Azure Redis Cache instances from different Azure regions. One cache is designated as the primary linked cache, and the other as the secondary linked cache. The secondary linked cache becomes read-only, and as data is written to the primary cache, it is replicated across regions to the secondary linked cache. This article provides a guide to configuring Geo-replication for your Premium tier Azure Redis Cache instances.

## Geo-replication prerequisites

To configure Geo-replication between two caches, the following prerequisites must be met:

- Both caches must be Premium tier caches.
- Both caches must be in the same Azure subscription.
- Both caches must be in different Azure regions.
- The secondary linked cache must be either the same pricing tier or a larger pricing tier than the primary linked cache.
- If the primary linked cache has clustering enabled, the secondary linked cache must have clustering enabled with the same number of shards as the primary linked cache.

## To add a cache replication link

1. To link two premium caches together for geo-replication, click **Geo-replication** from the Resource menu and then click **Add cache replication link** from the **Geo-replication** blade of the cache intended as the primary linked cache.

    ![Add link](./media/cache-how-to-geo-replication/cache-geo-location-menu.png)

2. Click the name of the desired secondary cache from the **Compatible caches** list. If your desired cache isn't displayed in the list, verify that the [Geo-replication prerequisites](#geo-replication-prerequisites) for the desired secondary cache are met.

    ![Ge-replication compatible caches](./media/cache-how-to-geo-replication/cache-geo-location-select-link.png)
    
    You can also initiate the linking process or view details about the secondary cache by using the content menu.

    ![Geo-replication context menu](./media/cache-how-to-geo-replication/cache-geo-location-select-link-context-menu.png)

3. Click **Link** to link the two caches together and begin the replication process.

    ![Link caches](./media/cache-how-to-geo-replication/cache-geo-location-confirm-link.png)

4. You can view the progress of the replication process on the **Geo-replication** blade.

    ![Linking status](./media/cache-how-to-geo-replication/cache-geo-location-linking.png)

    You can also view the linking status on the **Overview** blade for both the primary and secondary caches.

    ![Cache status](./media/cache-how-to-geo-replication/cache-geo-location-link-status.png)

## To unlink two linked caches and stop Geo-replication

1. To unlink two linked caches and stop the Geo-replication process, click **Unlink caches** from the **Geo-replication** blade.
    
    ![Unlink caches](./media/cache-how-to-geo-replication/cache-geo-location-unlink.png)

    When the unlinking process completes, the secondary cache is availablel for both reads and writes.

>[!NOTE]
>When two caches are unlinked, a snapshot of the replicated data from the primary linked cache remains in the secondary cache.
>
>

## Geo-replication FAQ

### Can I use Geo-replication with a Standard or Basic tier cache?

### Can I link more than two caches together?

### Can I link two caches from different Azure subscriptions?

### Can I link two caches with different sizes?

### Can I use Geo-replication with clustering enabled?

### Can I use Geo-replication with my caches in a VNET?

### Can I use PowerShell or Azure CLI to manage Geo-replication?

### How much does it cost to replicate my data across Azure regions?

## Next steps

Learn more about the [Azure Redis Cache Premium tier features](cache-premium-tier-intro.md).

