---
title: Understand - Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis
description: Understand the key differences between Azure Cache for Redis Basic, Standard, and Premium tiers and Azure Managed Redis before migrating.
ms.date: 03/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Basic, Standard, or Premium instances, I want to understand the differences before migrating to Azure Managed Redis.
---

# Understand the differences - Basic, Standard, and Premium tiers versus Azure Managed Redis

Before migrating, review the key differences between Azure Cache for Redis and Azure Managed Redis so that you can plan effectively.

[!INCLUDE [Redis migration agent skill](../includes/redis-migration-agent-skill.md)]

## Why Azure Managed Redis is more performant

Azure Managed Redis is built on the Redis Enterprise software stack, which provides significant performance improvements over the open-source Redis used by the Basic, Standard, and Premium tiers. Redis Enterprise uses a multi-threaded architecture that can handle more operations per second, deliver lower latencies, and make more efficient use of underlying hardware. This means that for the same amount of memory and compute, Azure Managed Redis can serve substantially higher throughput compared to the equivalent Basic, Standard, or Premium tier cache.

Additionally, Azure Managed Redis supports advanced data structures through Redis modules (such as RediSearch, RedisJSON, and RedisBloom) that aren't available in the Basic, Standard, or Premium tiers. To learn more about the architecture, see [Azure Managed Redis architecture](../architecture.md).

## Key feature/functionality differences

Here are the important differences to be aware of when moving from Basic, Standard, or Premium to Azure Managed Redis:

- **SKU structure.** Azure Managed Redis organizes SKUs differently from Azure Cache for Redis. Instead of tier-based SKUs (Basic, Standard, Premium) where features vary by tier, Azure Managed Redis SKUs are based on two dimensions: **memory size** and **performance tier** (Balanced, Memory Optimized, or Compute Optimized). All high availability and disaster recovery (HADR) features — including zone redundancy, data persistence, geo-replication, and import/export — are available on all sizes and performance tiers. You no longer need to choose a higher-tier SKU just to access these capabilities.

- **High availability vs. non-high availability.** Azure Managed Redis gives you the option to deploy with or without high availability. The non-HA option is designed for nonproduction and dev/test workloads where you want to reduce costs. Non-HA instances don't carry an SLA and come with the possibility of data loss during maintenance. In contrast, Basic, Standard, and Premium tiers don't offer this flexibility — Basic has no HA, while Standard and Premium always include it.

- **Clustering.** Azure Managed Redis is clustered by default and offers two clustering policies - OSS clustering and Enterprise clustering. We recommend choosing OSS clustering for best performance. If you're currently using a nonclustered Basic or Standard cache, your Redis client library configuration may require changes to work with a clustered instance (for example, handling `MOVED` redirections using a cluster-aware client library). If your application absolutely requires a nonclustered instance, Azure Managed Redis offers a Nonclustered mode for caches up to 25 GB.

- **Network isolation.** Azure Managed Redis doesn't support virtual network injection and configuring IP based firewall rules. If your existing Azure Cache for Redis instance uses virtual network injection for network isolation, you need to switch to using Azure Private Link with your new Azure Managed Redis instance.

- **Scaling.** Azure Managed Redis supports changing memory size and performance tier.

- **Microsoft Entra ID.** Both services support Microsoft Entra ID authentication. However, Azure Managed Redis doesn't currently support Microsoft Entra ID RBAC.

- **Scheduled updates.** Azure Cache for Redis supports configuring a scheduled update window for Redis engine updates. Azure Managed Redis supports scheduled updates currently in preview.

- **TLS and non-TLS port support.** In Azure Cache for Redis Basic, Standard, and Premium tiers, the same cache instance can simultaneously support both TLS (port 6380) and plain-text (port 6379) connections, allowing different applications to connect using either mode. In Azure Managed Redis, the cache supports only one mode at a time — either TLS or non-TLS. Once the mode is chosen during cache creation, all applications connecting to that cache must use the same mode.

- **Zone redundancy.** Azure Managed Redis is zone redundant by default when high availability is enabled and the region supports multiple availability zones. In comparison, zone redundancy is only available in Premium tier (and in preview for Standard).

- **Databases.** Basic, Standard, and Premium tiers support multiple Redis databases (up to 16 by default, configurable up to 64 on Premium). Azure Managed Redis supports only a single database (database 0). If your application uses multiple databases, you need to refactor your data model to use a single database or use key prefixes to logically separate data before migrating.

- **Geo-replication.** Azure Managed Redis supports active geo-replication, which allows read and write operations across linked caches in different regions. Premium tier only supports passive geo-replication, where the secondary cache is read-only. Unlike Azure Cache for Redis, Azure Managed Redis does not support an explicit Failover command. Instead, your application needs to switch to a different geo-replicated Azure Managed Redis instance when it detects one of the regions is down.

- **Data persistence.** Azure Managed Redis supports data persistence across all SKUs. In Azure Cache for Redis, persistence is only available in the Premium tier.

- **Redis modules.** Azure Managed Redis supports Redis modules such as RediSearch, RedisJSON, RedisBloom, and RedisTimeSeries. These modules aren't available in Basic, Standard, or Premium tiers.

- **Import/Export.** Azure Managed Redis supports RDB import and export across all SKUs. In Azure Cache for Redis, this feature is only available in the Premium tier.

- **Keyspace notifications.** Keyspace notifications are supported in Azure Cache for Redis but aren't currently available in Azure Managed Redis.

- **Reboot.** Azure Cache for Redis supports manual reboot of cache nodes. This operation isn't available in Azure Managed Redis, which manages node operations automatically. If you use Reboot to flush data from your cache, then Azure Managed Redis offers Flush as a management operation. Azure Managed Redis APIs to simulate maintenance events for testing the resilience of your applications are on the roadmap.

## Key differences for client applications

Review these differences when planning your application updates:

| Feature description              | Azure Cache for Redis      | Azure Managed Redis                           |
|:---------------------------------|:---------------------------|:----------------------------------------------|
| DNS suffix (for Azure Public cloud) | `.redis.cache.windows.net` | `<region>.redis.azure.net`                    |
| TLS port                         | 6380                       | 10000                                         |
| Non-TLS port                     | 6379                       | 10000                                 |
| Individual node TLS ports        | 13XXX                      | 85xx                                          |
| Individual node non-TLS port     | 15XXX                      | 85xx                                 |
| Clustering support               | OSS clustering only        | OSS and Enterprise clustering              |
| Non-clustered/standalone         | Yes (Basic, Standard, Premium up to 120GB) | Yes (Nonclustered mode, up to 25 GB only) |
| Redis version                    | 6                          | 7.4                                           |
| Supported TLS versions           | 1.2 and 1.3                | 1.2 and 1.3                                   |

## Choose the right Azure Managed Redis size and SKU

Choosing the right Azure Managed Redis SKU involves two steps: selecting the right **memory size** and then selecting the right **performance tier**.

### Step A: Choose the right memory size

1. **Identify the memory size of your current cache.** Go to the Azure portal, open your Basic, Standard, or Premium cache, and note the memory size from the **Overview** page (for example, C3 = 13 GB, P2 = 13 GB).
> [!NOTE]
> For Premium clustered caches: for sharded clusters, choose a size that has equivalent total memory across all shards.

1. **Find a similar size SKU in Azure Managed Redis.** Look for an Azure Managed Redis SKU that offers the same or greater amount of usable memory. When comparing sizes, note that Azure Managed Redis reserves approximately 20% of memory for system operations and overhead. Account for this reservation when selecting a size — for example, the B10/M10/X10 SKUs offer 12 GB of total memory but approximately 9.6 GB of usable memory for your data after reservation.

1. **Optimize based on actual memory usage.** Rather than matching the nominal cache size, review the **Used Memory** metric on your existing cache in Azure Monitor. Check the peak memory usage over the past month to identify a better-fitting SKU. If your actual memory usage is well below the cache size, you may be able to select a smaller, more cost-effective Azure Managed Redis SKU.



### Step B: Choose the right performance tier

Azure Managed Redis offers three performance tiers — **Balanced**, **Memory Optimized**, and **Compute Optimized**. Select based on your workload characteristics:

- **Balanced** — A good starting point if you're unsure. Offers a healthy mix of memory and compute.
- **Memory Optimized** — Choose this if your workload is memory-intensive and more likely to run out of memory before CPU.
- **Compute Optimized** — Choose this if your workload is throughput-intensive or latency-sensitive.

For more information, see [Choosing the right tier](../overview.md#choosing-the-right-tier).

### Additional considerations

- **Disable high availability for Basic tier migrations.** If you're migrating from a Basic cache (which has no replication or SLA), disable high availability on your new Azure Managed Redis instance. This halves the cost and provides a comparable setup for dev/test workloads.

## Next step

> [!div class="nextstepaction"]
> [Plan execution](migrate-basic-standard-premium-self-service.md)

## Related content

- [Migration overview](migrate-basic-standard-premium-overview.md)
- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
