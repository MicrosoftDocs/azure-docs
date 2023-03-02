---
author: flang-msft
ms.service: redis-cache
ms.topic: include
ms.date: 11/09/2018
ms.author: franlanglois
---
| Resource | Limit |
| --- | --- |
| Cache size |1.2 TB |
| Databases |64 |
| Maximum connected clients |40,000 |
| Azure Cache for Redis replicas, for high availability |3 |
| Shards in a premium cache with clustering |10 |

Azure Cache for Redis limits and sizes are different for each pricing tier. To see the pricing tiers and their associated sizes, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).

For more information on Azure Cache for Redis configuration limits, see [Default Redis server configuration](../cache-configure.md#default-redis-server-configuration).

Because configuration and management of Azure Cache for Redis instances is done by Microsoft, not all Redis commands are supported in Azure Cache for Redis. For more information, see [Redis commands not supported in Azure Cache for Redis](../cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis).
