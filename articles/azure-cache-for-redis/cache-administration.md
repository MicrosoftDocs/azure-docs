---
title: How to administer Azure Cache for Redis
description: Learn how to perform administration tasks such as reboot and schedule updates for Azure Cache for Redis
author: flang-msft

ms.service: cache
ms.topic: conceptual
ms.date: 09/29/2023
ms.author: franlanglois 
---
# How to administer Azure Cache for Redis

This article describes how to do administration tasks such as [rebooting](#reboot) and [Update channel and Schedule updates](#update-channel-and-schedule-updates) for your Azure Cache for Redis instances.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Reboot

On the left, **Reboot** allows you to reboot one or more nodes of your cache. This reboot capability enables you to test your application for resiliency if there's a failure of a cache node.

> [!IMPORTANT]
> Reboot is not yet available for the Enterprise tier. Reboot is available for all other tiers.
>

:::image type="content" source="media/cache-administration/cache-administration-reboot-2.png" alt-text="Screenshot that highlights the Reboot menu option":::

Select the nodes to reboot and select **Reboot**.

:::image type="content" source="media/cache-administration/redis-cache-reboot-2.png" alt-text="Screenshot that shows which nodes you can reboot":::

If you have a premium cache with clustering enabled, you can select which shards of the cache to reboot.

:::image type="content" source="media/cache-administration/redis-cache-reboot-cluster-2.png" alt-text="screenshot of shard options":::

To reboot one or more nodes of your cache, select the nodes and select **Reboot**. If you have a premium cache with clustering enabled, select the shards to reboot, and then select **Reboot**. After a few minutes, the selected nodes reboot, and are back online a few minutes later.

The effect on your client applications varies depending on which nodes you reboot.

* **Primary** - When the primary node is rebooted, Azure Cache for Redis fails over to the replica node and promotes it to primary. During this failover, there may be a short interval in which connections may fail to the cache.
* **Replica** - When the replica node is rebooted, there's typically no effect on the cache clients.
* **Both primary and replica** - When both cache nodes are rebooted, Azure Cache for Redis attempts to gracefully reboot both nodes, waiting for one to finish before rebooting the other. Typically, data loss doesn't occur. However, data loss can still occur do to unexpected maintenance events or failures. Rebooting your cache many times in a row increases the odds of data loss.
* **Nodes of a premium cache with clustering enabled** - When you reboot one or more nodes of a premium cache with clustering enabled, the behavior for the selected nodes is the same as when you reboot the corresponding node or nodes of a non-clustered cache.

## Reboot FAQ

* [Which node should I reboot to test my application?](#which-node-should-i-reboot-to-test-my-application)
* [Can I reboot the cache to clear client connections?](#can-i-reboot-the-cache-to-clear-client-connections)
* [Will I lose data from my cache if I do a reboot?](#will-i-lose-data-from-my-cache-if-i-do-a-reboot)
* [Can I reboot my cache using PowerShell, CLI, or other management tools?](#can-i-reboot-my-cache-using-powershell-cli-or-other-management-tools)
* [Can I reboot my Enterprise cache?](#can-i-reboot-my-enterprise-cache)

### Which node should I reboot to test my application?

To test the resiliency of your application against failure of the primary node of your cache, reboot the **Primary** node. To test the resiliency of your application against failure of the replica node, reboot the **Replica** node.

### Can I reboot the cache to clear client connections?

Yes, if you reboot the cache, all client connections are cleared. Rebooting can be useful in the case where each client connection is used up because of a logic error or a bug in the client application. Each pricing tier has different [client connection limits](cache-configure.md#default-redis-server-configuration) for the various sizes, and once these limits are reached, no more client connections are accepted. Rebooting the cache provides a way to clear all client connections.

> [!IMPORTANT]
> If you reboot your cache to clear client connections, StackExchange.Redis automatically reconnects once the Redis node is back online. If the underlying issue is not resolved, the client connections may continue to be used up.
>
>

### Will I lose data from my cache if I do a reboot?

If you reboot both the **Primary** and **Replica** nodes, all data in the cache (or in that shard when you're using a premium cache with clustering enabled) like likely be safe. However, the data may be lost in some cases. Rebooting both nodes should be taken with caution.

If you reboot just one of the nodes, data isn't typically lost, but it still might be. For example if the primary node is rebooted and a cache write is in progress, the data from the cache write is lost. Another scenario for data loss would be if you reboot one node and the other node happens to go down because of a failure at the same time. For more information about possible causes for data loss, see [What happened to my data in Redis?](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md)

### Can I reboot my cache using PowerShell, CLI, or other management tools?

Yes, for PowerShell instructions see [To reboot an Azure Cache for Redis](cache-how-to-manage-redis-cache-powershell.md#to-reboot-an-azure-cache-for-redis).

### Can I reboot my Enterprise cache?

No. Reboot isn't available for the Enterprise tier yet. Reboot is available for Basic, Standard and Premium tiers.The settings that you see on the Resource menu under **Administration** depend on the tier of your cache. You don't see **Reboot** when using a cache from the Enterprise tier.

## Flush data (preview)

When using the Basic, Standard, or Premium tiers of Azure Cache for Redis, you see **Flush data** on the resource menu. The **Flush data** operation allows you to delete or _flush_ all data in your cache. This _flush_ operation can be used before scaling operations to potentially reduce the time required to complete the scaling operation on your cache. You can also configure to run the _flush_ operation periodically on your dev/test caches to keep memory usage in check.

The _flush_ operation, when executed on a clustered cache, clears data from all shards at the same time.

> [!IMPORTANT]
> Previously, the _flush_ operation was only available for geo-replicated Enterprise tier caches. Now, it is available in Basic, Standard and Premium tiers.
>
:::image type="content" source="media/cache-administration/cache-flush.png" alt-text="Screenshot showing flush data selected in the resource menu of a cache instance. ":::

## Update channel and Schedule updates

On the left, **Schedule updates** allows you to choose an update channel and a maintenance window for your cache instance.

Any cache instance using the **Stable** update channel receives updates a few weeks later than cache instances using **Preview** update channel. We recommend choosing the **Preview** update channel for your non-production and less critical workloads. Choose the **Stable** update channel for your most critical, production workloads. All caches default to the **Stable** update channel by default.

> [!IMPORTANT]
> Changing the update channel on your cache instance results in your cache undergoing a patching event to apply the right updates. Consider changing the update channel during your maintenance window.
>

A maintenance window allows you to control the days and times of a week during which the VMs hosting your cache can be updated. Azure Cache for Redis makes a best effort to start and finish updating Redis server software within the specified time window you define.

> [!IMPORTANT]
> The update channel and maintenance window applies to Redis server updates and updates to the Operating System of the VMs hosting the cache. The update channel and maintenance window does not apply to Host OS updates to the Hosts hosting the cache VMs or other Azure Networking components. In rare cases, where caches are hosted on older models the maintenance window won't apply to Guest OS updates either. You can tell if your cache is on an older model if the DNS name of the cache resolves to a suffix of `cloudapp.net`, `chinacloudapp.cn`, `usgovcloudapi.net` or `cloudapi.de`.
>
Currently, no option is available to configure an update channel or scheduled updates for an Enterprise tier cache.

:::image type="content" source="media/cache-administration/redis-schedule-updates-2.png" alt-text="Screenshot showing schedule updates":::

To specify a maintenance window, check the days you want and specify the maintenance window start hour for each day. Then, select **OK**. The maintenance window time is in UTC and can only be configured on an hourly basis.

The default, and minimum, maintenance window for updates is five hours. This value isn't configurable from the Azure portal, but you can configure it in PowerShell using the `MaintenanceWindow` parameter of the [New-AzRedisCacheScheduleEntry](/powershell/module/az.rediscache/new-azrediscachescheduleentry) cmdlet. For more information, see [Can I manage scheduled updates using PowerShell, CLI, or other management tools?](#can-i-manage-scheduled-updates-using-powershell-cli-or-other-management-tools)

## Schedule updates FAQ

* [When do updates occur if I don't use the schedule updates feature?](#when-do-updates-occur-if-i-dont-use-the-schedule-updates-feature)
* [What type of updates are made during the scheduled maintenance window?](#what-type-of-updates-are-made-during-the-scheduled-maintenance-window)
* [Can I manage scheduled updates using PowerShell, CLI, or other management tools?](#can-i-manage-scheduled-updates-using-powershell-cli-or-other-management-tools)
* [Can an update that is covered and managed by the "Scheduled Updates" feature happen outside of the "Scheduled Updates" window?](#can-an-update-that-is-covered-and-managed-by-the-scheduled-updates-feature-happen-outside-the-scheduled-updates-window)

### When do updates occur if I don't use the schedule updates feature?

If you don't specify a maintenance window, updates can be made at any time.

### What type of updates are made during the scheduled maintenance window?

Only Redis server updates are made during the scheduled maintenance window. The maintenance window doesn't apply to Azure updates or updates to the host operating system.

### Can I manage scheduled updates using PowerShell, CLI, or other management tools?

Yes, you can manage your scheduled updates using the following PowerShell cmdlets:

* [Get-AzRedisCachePatchSchedule](/powershell/module/az.rediscache/get-azrediscachepatchschedule)
* [New-AzRedisCachePatchSchedule](/powershell/module/az.rediscache/new-azrediscachepatchschedule)
* [New-AzRedisCacheScheduleEntry](/powershell/module/az.rediscache/new-azrediscachescheduleentry)
* [Remove-AzRedisCachePatchSchedule](/powershell/module/az.rediscache/remove-azrediscachepatchschedule)

### Can an update that is covered and managed by the Scheduled Updates feature happen outside the Scheduled Updates window?

Yes. In general, updates aren't applied outside the configured Scheduled Updates window. Rare critical security updates can be applied outside the patching schedule as part of our security policy.

## Next steps

Learn more about Azure Cache for Redis features.

* [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
