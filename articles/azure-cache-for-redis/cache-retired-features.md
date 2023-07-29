---
title: What's been retired from Azure Cache for Redis?
titleSuffix: Azure Cache for Redis
description: Information on retirements from Azure Cache for Redis
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 12/08/2022

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

From now through June 30, 2023, you can continue to use existing Azure Cache for Redis version 4 instances. Retirement will occur in following stages, so you have the maximum amount of time to upgrade.

| Date    | Description |
|-------- |-------------|
| November 1. 2022 | Beginning November 1, 2022, all the versions of Azure Cache for Redis REST API, PowerShell, Azure CLI, and Azure SDK will create Redis instances using Redis version 6 by default. If you need a specific Redis version for your cache instance, see [Redis 6 becomes default for new cache instances](cache-whats-new.md#redis-6-becomes-default-for-new-cache-instances). |
| March 1, 2023 | Beginning March 1, 2023, you won't be able to create new Azure Cache for Redis instances using Redis version 4. Also, you won’t be able to create new geo-replication links between cache instances using Redis version 4.|
| June 30, 2023 | After June 30 2023, any remaining version 4 cache instances, which don't have geo-replication links, will be automatically upgraded to version 6.|
| August 30, 2023 |After August 30, 2023, any remaining version 4 cache instances, which have geo-replication links, will be automatically upgraded to version 6. This upgrade operation will require unlinking and relinking the caches and customers could experience geo-replication link down time. |

### Version 4 caches on cloud services

If your cache instance is affected by the Cloud Service retirement, you're unable to upgrade to Redis 6 until after you migrate to a cache built on Virtual Machine Scale Set. In this case, send mail to azurecachemigration@microsoft.com, and we'll help you with the migration.

For more information on what to do if your cache is on Cloud Services (classic), see [Azure Cache for Redis on Cloud Services (classic)](cache-faq.yml#what-should-i-do-with-any-instances-of-azure-cache-for-redis-that-depend-on-cloud-services--classic-).

### Redis 4 Retirement Questions

- [How to check if a cache is running on version 4?](#how-to-check-if-a-cache-is-running-on-version-4)
- [Why is Redis version 4 being retired?](#why-is-redis-version-4-being-retired)
- [Will Redis 4 caches be supported until retirement?](#will-redis-4-caches-be-supported-until-retirement)
- [My Redis 4 caches are linked with geo-replication link. What happens to the geo-replication link during upgrade?](#my-redis-4-caches-are-linked-with-geo-replication-link-what-happens-to-the-geo-replication-link-during-upgrade)
- [What happens to my cache if I don't upgrade to Redis version 6 by June 30, 2023?](#what-happens-to-my-cache-if-i-dont-upgrade-to-redis-version-6-by-june-30-2023)
- [What happens to my Cloud Service cache if I don't upgrade it by June 30, 2023?](#what-happens-to-my-cloud-service-cache-if-i-dont-upgrade-it-by-june-30-2023)
- [Do I need to update my application to be able to use Redis version 6?](#do-i-need-to-update-my-application-to-be-able-to-use-redis-version-6)
- [What exactly happens to my cache when I execute the upgrade operation?](#what-exactly-happens-to-my-cache-when-i-execute-the-upgrade-operation)
- [Will my cache be available during the upgrade process?](#will-my-cache-be-available-during-the-upgrade-process)
- [How long does the upgrade operation last?](#how-long-does-the-upgrade-operation-last)
- [Can I execute upgrade operation through REST API, Azure CLI or PowerShell?](#can-i-execute-upgrade-operation-through-rest-api-azure-cli-or-powershell)
- [Is my application affected during upgrade?](#is-my-application-affected-during-upgrade)
- [Can I roll back the upgrade operation?](#can-i-roll-back-the-upgrade-operation)

#### How to check if a cache is running on version 4?

You check the Redis version of your cache instance by selecting **Properties** from the resource menu in the Azure Cache for Redis portal.

#### Why is Redis version 4 being retired?

Azure Cache for Redis is the managed offering for the popular open-source caching solution Redis. Redis version 4 is no longer supported by the open-source community. Redis 4 will no longer be supported on Azure starting June 30, 2023.

#### Will Redis 4 caches be supported until retirement?

Redis version 4 caches continues to get critical bug fixes and security updates until June 30, 2023.

#### My Redis 4 caches are linked with geo-replication link. What happens to the geo-replication link during upgrade?

Caches can't be upgraded while they have a geo-replication link.  

1. First, you must unlink the caches temporarily.
1. Upgrade both your caches.
1. Then relink them.

#### What happens to my cache if I don't upgrade to Redis version 6 by June 30, 2023?

If you don't upgrade your Redis 4 cache by June 30, 2023, the cache is automatically upgraded to version 6. If you have a maintenance window scheduled for your cache, the upgrade happens during the maintenance window. Geo-replicated Redis 4 caches will be retired on August 30, 2023.

#### What happens to my Cloud Service cache if I don't upgrade it by June 30, 2023?

Cloud Service version 4 caches can't be upgraded to version 6 until they're migrated to a cache based on Azure Virtual Machine Scale Set.

For more information, see [Caches with a dependency on Cloud Services (classic)](./cache-faq.yml).

Cloud Service cache will continue to function beyond June 30, 2023, however, starting on April 30, 2023, Cloud Service caches receive only critical security updates and bug fixes with limited support. Cloud Service caches won't support any new features released after April 30, 2023. We highly recommend migrating your caches to Azure Virtual Machine Scale Set as soon as possible.

#### Do I need to update my application to be able to use Redis version 6?

Redis version 6 is compatible with version 4 and applications should continue to function seamlessly after the version upgrade.

#### What exactly happens to my cache when I execute the upgrade operation?

During the upgrade process, the replica node of your cache is first upgraded to run Redis version 6. The upgrade replica node then takes over as the primary node for your cache while the former primary node reboots to take on the role of replica. This process is exactly like the patching process described in [How does patching occur?](cache-failover.md#how-does-patching-occur).

#### Will my cache be available during the upgrade process?

Standard and Premium caches are fully functional and available during the upgrade process, but your applications see a connection blip for a few seconds. Basic caches are unavailable during the upgrade and all data will be lost.

#### How long does the upgrade operation last?

Typically, the upgrade operation takes about 20 minutes per cache node, but it could take longer if the cache is under high server load.

#### Can I execute upgrade operation through REST API, Azure CLI or PowerShell?

Yes, the upgrade process can be triggered through REST API, Azure CLI or PowerShell command. For more information, see [How to upgrade an existing Redis 4 cache to Redis 6](cache-how-to-upgrade.md).

#### Is my application affected during upgrade?

Your application sees a connection blip that lasts a few seconds. Your application should retry commands appropriately when experiencing connectivity errors. Fore more information, see [Best practices for connection resilience](cache-best-practices-connection.md).

#### Can I roll back the upgrade operation?

No, the upgrade can't be rolled back.

## Next steps
<!-- Add a context sentence for the following links -->
- [What's new](cache-whats-new.md)
- [Azure Cache for Redis FAQ](cache-faq.yml)
