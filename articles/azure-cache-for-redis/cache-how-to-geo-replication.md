---
title: Configure geo-replication for Premium Azure Cache for Redis instances
description: Learn how to replicate your Azure Cache for Redis Premium instances across Azure regions
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: franlanglois
---

# Configure geo-replication for Premium Azure Cache for Redis instances

In this article, you'll learn how to configure a geo-replicated Azure Cache using the Azure portal.

Geo-replication links together two Premium Azure Cache for Redis instances and creates a data replication relationship. These cache instances are typically located in different Azure regions, though that isn't required. One instance acts as the primary, and the other as the secondary. The primary handles read and write requests and propagate changes to the secondary. This process continues until the link between the two instances is removed.

> [!NOTE]
> Geo-replication is designed as a disaster-recovery solution.
>
>

## Geo-replication prerequisites

To configure geo-replication between two caches, the following prerequisites must be met:

- Both caches are [Premium tier](cache-overview.md#service-tiers) caches.
- Both caches are in the same Azure subscription.
- The secondary linked cache is either the same cache size or a larger cache size than the primary linked cache.
- Both caches are created and in a running state.
- Neither cache can have more than one replica.

> [!NOTE]
> Data transfer between Azure regions will be charged at standard [bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/).

Some features aren't supported with geo-replication:

- Zone Redundancy isn't supported with geo-replication.
- Persistence isn't supported with geo-replication.
- Clustering is supported if both caches have clustering enabled and have the same number of shards.
- Caches in the same Virtual Network (VNet) are supported.
- Caches in different VNets are supported with caveats. See [Can I use geo-replication with my caches in a VNet?](#can-i-use-geo-replication-with-my-caches-in-a-vnet) for more information.

After geo-replication is configured, the following restrictions apply to your linked cache pair:

- The secondary linked cache is read-only; you can read from it, but you can't write any data to it. If you choose to read from the Geo-Secondary instance when a full data sync is happening between the Geo-Primary and the Geo-Secondary, the Geo-Secondary instance throws errors on any Redis operation against it until the full data sync is complete. The errors state that a full data sync is in progress. Also, the errors are thrown when either Geo-Primary or Geo-Secondary is updated and on some reboot scenarios. Applications reading from Geo-Secondary should be built to fall back to the Geo-Primary whenever the Geo-Secondary is throwing such errors.
- Any data that was in the secondary linked cache before the link was added is removed. If the geo-replication is later removed however, the replicated data remains in the secondary linked cache.
- You can't [scale](cache-how-to-scale.md) either cache while the caches are linked.
- You can't [change the number of shards](cache-how-to-premium-clustering.md) if the cache has clustering enabled.
- You can't enable persistence on either cache.
- You can [Export](cache-how-to-import-export-data.md#export) from either cache.
- You can't [Import](cache-how-to-import-export-data.md#import) into the secondary linked cache.
- You can't delete either linked cache, or the resource group that contains them, until you unlink the caches. For more information, see [Why did the operation fail when I tried to delete my linked cache?](#why-did-the-operation-fail-when-i-tried-to-delete-my-linked-cache)
- If the caches are in different regions, network egress costs apply to the data moved across regions. For more information, see [How much does it cost to replicate my data across Azure regions?](#how-much-does-it-cost-to-replicate-my-data-across-azure-regions)
- Automatic failover doesn't occur between the primary and secondary linked cache. For more information and information on how to failover a client application, see [How does failing over to the secondary linked cache work?](#how-does-failing-over-to-the-secondary-linked-cache-work)

## Add a geo-replication link

1. To link two caches together for geo-replication, fist select **Geo-replication** from the Resource menu of the cache that you intend to be the primary linked cache. Next, select **Add cache replication link** from **Geo-replication** on the left.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-menu.png" alt-text="Cache geo-replication menu":::

1. Select the name of your intended secondary cache from the **Compatible caches** list. If your secondary cache isn't displayed in the list, verify that the [Geo-replication prerequisites](#geo-replication-prerequisites) for the secondary cache are met. To filter the caches by region, select the region in the map to display only those caches in the **Compatible caches** list.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-select-link.png" alt-text="Select compatible cache":::

    You can also start the linking process or view details about the secondary cache by using the context menu.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-select-link-context-menu.png" alt-text="Geo-replication context menu":::

1. Select **Link** to link the two caches together and begin the replication process.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-confirm-link.png" alt-text="Link caches":::

1. You can view the progress of the replication process using **Geo-replication** on the left.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-linking.png" alt-text="Linking status":::

    You can also view the linking status on the left, using **Overview**, for both the primary and secondary caches.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-link-status.png" alt-text="Screenshot that highlights how to view the linking status for the primary and secondary caches.":::

    Once the replication process is complete, the **Link status** changes to **Succeeded**.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-link-successful.png" alt-text="Cache status":::

    The primary linked cache remains available for use during the linking process. The secondary linked cache isn't available until the linking process completes.

> [!NOTE]
> Geo-replication can be enabled for this cache if you scale it to 'Premium' pricing tier and disable data persistence. This feature is not available at this time when using extra replicas.

## Remove a geo-replication link

1. To remove the link between two caches and stop geo-replication, select **Unlink caches** from the **Geo-replication** on the left.

    :::image type="content" source="media/cache-how-to-geo-replication/cache-geo-location-unlink.png" alt-text="Unlink caches":::

    When the unlinking process completes, the secondary cache is available for both reads and writes.

>[!NOTE]
>When the geo-replication link is removed, the replicated data from the primary linked cache remains in the secondary cache.
>
>

## Geo-replication FAQ

- [Can I use geo-replication with a Standard or Basic tier cache?](#can-i-use-geo-replication-with-a-standard-or-basic-tier-cache)
- [Is my cache available for use during the linking or unlinking process?](#is-my-cache-available-for-use-during-the-linking-or-unlinking-process)
- [Can I link more than two caches together?](#can-i-link-more-than-two-caches-together)
- [Can I link two caches from different Azure subscriptions?](#can-i-link-two-caches-from-different-azure-subscriptions)
- [Can I link two caches with different sizes?](#can-i-link-two-caches-with-different-sizes)
- [Can I use geo-replication with clustering enabled?](#can-i-use-geo-replication-with-clustering-enabled)
- [Can I use geo-replication with my caches in a VNet?](#can-i-use-geo-replication-with-my-caches-in-a-vnet)
- [What is the replication schedule for Redis geo-replication?](#what-is-the-replication-schedule-for-redis-geo-replication)
- [How long does geo-replication replication take?](#how-long-does-geo-replication-replication-take)
- [Is the replication recovery point guaranteed?](#is-the-replication-recovery-point-guaranteed)
- [Can I use PowerShell or Azure CLI to manage geo-replication?](#can-i-use-powershell-or-azure-cli-to-manage-geo-replication)
- [How much does it cost to replicate my data across Azure regions?](#how-much-does-it-cost-to-replicate-my-data-across-azure-regions)
- [Why did the operation fail when I tried to delete my linked cache?](#why-did-the-operation-fail-when-i-tried-to-delete-my-linked-cache)
- [What region should I use for my secondary linked cache?](#what-region-should-i-use-for-my-secondary-linked-cache)
- [How does failing over to the secondary linked cache work?](#how-does-failing-over-to-the-secondary-linked-cache-work)
- [Can I configure Firewall with geo-replication?](#can-i-configure-a-firewall-with-geo-replication)

### Can I use geo-replication with a Standard or Basic tier cache?

No, geo-replication is only available for Premium tier caches.

### Is my cache available for use during the linking or unlinking process?

- The primary linked cache remains available until the linking process completes.
- The secondary linked cache isn't available until the linking process completes.
- Both caches remain available until the unlinking process completes.

### Can I link more than two caches together?

No, you can only link two caches together.

### Can I link two caches from different Azure subscriptions?

No, both caches must be in the same Azure subscription.

### Can I link two caches with different sizes?

Yes, as long as the secondary linked cache is larger than the primary linked cache.

### Can I use geo-replication with clustering enabled?

Yes, as long as both caches have the same number of shards.

### Can I use geo-replication with my caches in a VNet?

Yes, geo-replication of caches in VNets is supported with caveats:

- Geo-replication between caches in the same VNet is supported.
- Geo-replication between caches in different VNets is also supported.
  - If the VNets are in the same region, you can connect them using [VNet peering](../virtual-network/virtual-network-peering-overview.md) or a [VPN Gateway VNet-to-VNet connection](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md).
  - If the VNets are in different regions, geo-replication using VNet peering is supported. A client VM in VNet 1 (region 1) isn't able to access the cache in VNet 2 (region 2) using its DNS name because of a constraint with Basic internal load balancers. For more information about VNet peering constraints, see [Virtual Network - Peering - Requirements and constraints](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints). We recommend using a VPN Gateway VNet-to-VNet connection.
  
Using [this Azure template](https://azure.microsoft.com/resources/templates/redis-vnet-geo-replication/), you can quickly deploy two geo-replicated caches into a VNet connected with a VPN Gateway VNet-to-VNet connection.

### What is the replication schedule for Redis geo-replication?

Replication is continuous and asynchronous. It doesn't happen on a specific schedule. All the writes done to the primary are instantaneously and asynchronously replicated on the secondary.

### How long does geo-replication replication take?

Replication is incremental, asynchronous, and continuous and the time taken isn't much different from the latency across regions. Under certain circumstances, the secondary cache can be required to do a full sync of the data from the primary. The replication time in this case depends on many factors like: load on the primary cache, available network bandwidth, and inter-region latency. We have found replication time for a full 53-GB geo-replicated pair can be anywhere between 5 to 10 minutes.

### Is the replication recovery point guaranteed?

For caches in a geo-replicated mode, persistence is disabled. If a geo-replicated pair is unlinked, such as a customer-initiated failover, the secondary linked cache keeps its synced data up to that point of time. No recovery point is guaranteed in such situations.

To obtain a recovery point, [Export](cache-how-to-import-export-data.md#export) from either cache. You can later [Import](cache-how-to-import-export-data.md#import) into the primary linked cache.

### Can I use PowerShell or Azure CLI to manage geo-replication?

Yes, geo-replication can be managed using the Azure portal, PowerShell, or Azure CLI. For more information, see the [PowerShell docs](/powershell/module/az.rediscache/#redis_cache) or [Azure CLI docs](/cli/azure/redis/server-link).

### How much does it cost to replicate my data across Azure regions?

When you use geo-replication, data from the primary linked cache is replicated to the secondary linked cache. There's no charge for the data transfer if the two linked caches are in the same region. If the two linked caches are in different regions, the data transfer charge is the network egress cost of data moving across either region. For more information, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).

### Why did the operation fail when I tried to delete my linked cache?

Geo-replicated caches and their resource groups can't be deleted while linked until you remove the geo-replication link. If you attempt to delete the resource group that contains one or both of the linked caches, the other resources in the resource group are deleted, but the resource group stays in the `deleting` state and any linked caches in the resource group remain in the `running` state. To completely delete the resource group and the linked caches within it, unlink the caches as described in [Remove a geo-replication link](#remove-a-geo-replication-link).

### What region should I use for my secondary linked cache?

In general, it's recommended for your cache to exist in the same Azure region as the application that accesses it. For applications with separate primary and fallback regions, it's recommended your primary and secondary caches exist in those same regions. For more information about paired regions, see [Best Practices – Azure Paired regions](../availability-zones/cross-region-replication-azure.md).

### How does failing over to the secondary linked cache work?

Automatic failover across Azure regions isn't supported for geo-replicated caches. In a disaster-recovery scenario, customers should bring up the entire application stack in a coordinated manner in their backup region. Letting individual application components decide when to switch to their backups on their own can negatively affect performance. 

One of the key benefits of Redis is that it's a very low-latency store. If the customer's main application is in a different region than its cache, the added round-trip time would have a noticeable effect on performance. For this reason, we avoid failing over automatically because of transient availability issues.

To start a customer-initiated failover, first unlink the caches. Then, change your Redis client to use the connection endpoint of the (formerly linked) secondary cache. When the two caches are unlinked, the secondary cache becomes a regular read-write cache again and accepts requests directly from Redis clients.

### Can I configure a firewall with geo-replication?

Yes, you can configure a [firewall](./cache-configure.md#firewall) with geo-replication. For geo-replication to function alongside a firewall, ensure that the secondary cache's IP address is added to the primary cache's firewall rules.

## Next steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
- [High availability for Azure Cache for Redis](cache-high-availability.md)
