---
title: What's been retired from Azure Cache for Redis?
titleSuffix: Azure Cache for Redis
description: Information on retirements from Azure Cache for Redis
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 09/30/2022

---

# Retirements

## Redis version 4

On June 30, 2023, we'll retire version 4 for Azure Cache for Redis instances. Before that date, you need to upgrade any of your cache instances to version 6.

- All cache instances running Redis version 4 after June 30, 2023 will be upgraded automatically.
- All cache instances running Redis version 4 that have geo-replication enabled will be upgraded automatically after August 30, 2023.

We recommend that you upgrade your caches on your own to accommodate your schedule and the needs of your users to make the upgrade as convenient as possible.

The open-source Redis version 4 was released several years ago and is now retired. Version 4 no longer receives critical bug or security fixes from the community. Azure Cache for Redis offers open-source Redis as a managed service on Azure. To stay in sync with the open-source offering, we'll also retire version 4.
Microsoft continues to backport security fixes from recent versions to version 4 until retirement. We encourage you to upgrade your cache to version 6 sooner, so you can use the rich feature set that Redis version 6 has to offer. For more information, See the Redis 6 GA announcement for more details.

To upgrade your version 4 Azure Cache for Redis instance, see [How to upgrade an existing Redis 4 cache to Redis 6](cache-how-to-upgrade.md). If your cache instances have geo-replication enabled, you’re required to unlink the caches before upgrade.

### Important upgrade timelines

From now through 30 June 2023, you can continue to use existing Azure Cache for Redis version 4 instances. Retirement will occur in following stages, so you have the maximum amount of time to upgrade.

| Date    | Description |
|-------- |-------------|
| November 1. 2022 | Beginning November 1, 2022, all the versions of Azure Cache for Redis REST API, PowerShell, Azure CLI, and Azure SDK will create Redis instances using Redis version 6 by default. If you need a specific Redis version for your cache instance, see [Redis 6 becomes default for new cache instances](cache-whats-new.md#redis-6-becomes-default-for-new-cache-instances). |
| March 1, 2023 | Beginning March 1, 2023, you won't be able to create new Azure Cache for Redis instances using Redis version 4. Also, you won’t be able to create new geo-replication links between cache instances using Redis version 4.|
| June 30, 2023 | After June 30 2023, any remaining version 4 cache instances, which don't have geo-replication links, will be automatically upgraded to version 6.|
| August 30, 2023 |After August 30, 2023, any remaining version 4 cache instances, which have geo-replication links, will be automatically upgraded to version 6. This upgrade operation will require unlinking and relinking the caches and customers could experience geo-replication link down time. |

### Version 4 caches on cloud services

If your cache instance is affected by the Cloud Service retirement, you're unable to upgrade to Redis 6 until after you migrate to a cache built on virtual machine scale set. In this case, send mail to azurecachemigration@microsoft.com, and we'll help you with the migration.

For more information on what to do if your cache is on Cloud Services (classic), see [Azure Cache for Redis on Cloud Services (classic)](cache-faq.yml#what-should-i-do-with-any-instances-of-azure-cache-for-redis-that-depend-on-cloud-services--classic-).

## Retirement Questions

### How to check if a cache is running on version 4?

You check the Redis version of your cache instance by selecting **Properties** from the resource menu in the Azure Cache for Redis portal.

### Why is Redis version 4 being retired?

Azure Cache for Redis is the managed offering for the popular open-source caching solution Redis. Redis version 4 is no longer supported by the open source community and will no longer be supported on Azure starting June 30, 2023.

### Will Redis 4 caches be supported until retirement?

Redis version 4 caches continues to get critical bug fixes and security updates until June 20, 2023.

### My Redis 4 caches are linked with geo-replication link. What happens to the geo-replication link during upgrade?

Caches can't be upgrade while they have a geo-replication link. First, you must unlink the caches temporarily, upgrade both your caches, and then re-link them.

### What happens to my cache if I do not upgrade to Redis version 6 by June 30, 2023?

If you do not upgrade your Redis 4 cache by June 30, 2023, the cache is automatically upgraded to version 6. If you have a maintenance window scheduled for your cache, the upgrade happens during the maintenance window. Geo-replicated caches will be retired on August 20, 2023.

### What happens to my CloudService cache if I do not upgrade it by June 30, 2023?

Cloud Service version 4 caches can't be upgraded to version 6 until they are migrated to a cache based on Azure Virtual Machine Scale Set. 

For more information, see <Azure Cache for Redis FAQ - Azure Cache for Redis | Microsoft Learn> for more details.

As documented <> starting April 30, 2023, Cloud Service caches receive only critical security updates and critical bug fixes. Cloud Service caches will not support any new features released after APril 20,2023 and we highly recommend migrating your caches to Azure Virtual Machine Scale Set.

### Do I need to update my application to be able to use Redis version 6?

Redis version 6 is compatible with version 4 and applications should continue to function seamlessly after the version upgrade.

### What exactly happens to my cache when I execute the upgrade operation?

During the upgrade process, the replica node of your cache is first upgraded to run Redis version 6. The upgrade replica node then takes over as the primary node for your cache while the former primary node reboots to take on the role of replica. This is exactly like the patching process described here: Failover and patching - Azure Cache for Redis | Microsoft Learn and results in a failover.

### Will my cache be available during the upgrade process?

Standard and Premium caches are fully functional and available during the upgrade process, but your applications sees a connection blip for a few seconds. Basic caches are unavailable during the upgrade and all data will be lost.

### How long does the upgrade operation last?

Typically, the upgrade operation takes about 20 minutes per cache node, but it could take longer if the cache is under high server load.

### Can I execute upgrade operation through REST API, Azure CLI or PowerShell?

Yes, the upgrade process can be triggered through REST API, Azure CLI or PowerShell command. For more information, see How to upgrade the Redis version of Azure Cache for Redis | Microsoft Learn

### Is my application affected during upgrade?

Your application sees a connection blip that lasts a few seconds. Your application should retry commands appropriately on experiencing connectivity errors. Fore more information, see Best practices for connection resilience - Azure Cache for Redis | Microsoft Learn

### Can I rollback the upgrade operation?

No, the upgrade can't be rolled back.


## Next steps
<!-- Add a context sentence for the following links -->
- [What's new](cache-whats-new.md)
- [Azure Cache for Redis FAQ](cache-faq.yml)
