---
author: wesmc7777
ms.service: redis-cache
ms.topic: include
ms.date: 11/09/2018
ms.author: wesmc
---
| Resource | Limit |
| --- | --- |
| Cache size |530 GB |
| Databases |64 |
| Maximum connected clients |40,000 |
| Azure Cache for Redis replicas, for high availability |1 |
| Shards in a premium cache with clustering |10 |

Azure Cache for Redis limits and sizes are different for each pricing tier. To see the pricing tiers and their associated sizes, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).

For more information on Azure Cache for Redis configuration limits, see [Default Redis server configuration](../articles/azure-cache-for-redis/cache-configure.md#default-redis-server-configuration).

Because configuration and management of Azure Cache for Redis instances is done by Microsoft, not all Redis commands are supported in Azure Cache for Redis. For more information, see [Redis commands not supported in Azure Cache for Redis](../articles/azure-cache-for-redis/cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).

