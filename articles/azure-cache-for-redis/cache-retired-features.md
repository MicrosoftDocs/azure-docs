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

### How to check if a cache is running on version 4?

You check the Redis version of your cache instance by selecting **Properties** from the resource menu in the Azure Cache for Redis portal.

## Next steps
<!-- Add a context sentence for the following links -->
- [What's new](cache-whats-new.md)
- [Azure Cache for Redis FAQ](cache-faq.yml)
