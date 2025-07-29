---
title: Redis version 4 retirement
description: Learn about the retirement of Redis version 4 from Azure Cache for Redis in June 2023.




ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.date: 05/22/2025
appliesto:
  - ✅ Azure Cache for Redis
---

# Redis version 4 retirement in Azure Cache for Redis

On June 30, 2023, Redis version 4 was retired for Azure Cache for Redis instances. All new Azure Redis instances are version 6.

Existing Azure Redis instances were upgraded automatically to version 6. Redis version 6 is compatible with version 4 and applications continued to function seamlessly after the version upgrade.

During the upgrade process, the replica node of the cache was first upgraded to run Redis version 6. The upgrade replica node then took over as the primary cache node while the former primary node rebooted to take on the role of replica. This process was exactly like the patching process described in [How does patching occur?](cache-failover.md#how-does-patching-occur)

- Caches that had a maintenance window scheduled were upgraded during the maintenance window.

- Standard and Premium caches were fully functional and available during the upgrade process. Applications saw a connection blip for a few seconds. Basic caches were unavailable during the upgrade and all data was lost.

- Cache instances that had geo-replication enabled had to unlink the caches before upgrade, upgrade both caches, and relink them after the upgrade.

- Caches that were affected by Cloud Service retirement had to migrate to caches built on Virtual Machine Scale Set, or undergo an automatic upgrade requiring 30 minutes of downtime and full cache data loss.

The Redis version upgrade process can be triggered through REST API, Azure CLI, or PowerShell command. For more information about upgrading Redis versions in Azure Cache for Redis, see [How to upgrade the version of your Redis instance](cache-how-to-upgrade.md). Also see [Best practices for connection resilience](cache-best-practices-connection.md).

To check the Redis version of your cache instance, select **Properties** from the left navigation menu of your cache page in the Azure portal.
