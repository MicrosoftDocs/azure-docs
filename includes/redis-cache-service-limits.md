| Resource                                    | Limit                                  |
|---------------------------------------------|----------------------------------------|
| Cache size                                  | 530 GB ([contact us](mailto:wapteams@microsoft.com?subject=Redis%20Cache%20quota%20increase) for more)                                  |
| Databases                                   | 64                                     |
| Max connected clients                       | 40,000                                 |
| Redis Cache replicas (for high availability) | 1 |
| Shards in a premium cache with clustering    | 10 |

Azure Redis Cache limits and sizes are different for each pricing tier. To see the pricing tiers and their associated sizes, see [Azure Redis Cache Pricing](https://azure.microsoft.com/pricing/details/cache/).

For more information on Azure Redis Cache configuration limits, see [Default Redis server configuration](redis-cache/cache-configure.md#default-redis-server-configuration).

Because configuration and management of Azure Redis Cache instances is done by Microsoft, not all Redis commands are supported in Azure Redis Cache. For more information, see [Redis commands not supported in Azure Redis Cache]((redis-cache/cache-configure.md#redis-commands-not-supported-in-azure-redis-cache).