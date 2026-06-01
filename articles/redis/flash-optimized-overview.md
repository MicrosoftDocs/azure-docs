---
title: Best practices for the Flash Optimized tier
description: Learn about the Flash Optimized tier in Azure Managed Redis, including SKU sizes, features, best practices, and common issues.
ms.date: 04/30/2026
ms.topic: conceptual
ms.custom:
  - references_regions
  - build-2025
appliesto:
  - Γ£à Azure Managed Redis
---

# Best practices for the Flash Optimized tier

The Flash Optimized tier in Azure Managed Redis enables cost-effective scaling for very large datasets by automatically moving less-frequently accessed data from memory (RAM) to fast NVMe flash storage. Hot data remains in DRAM for low-latency access, while colder data is served from NVMe at a lower cost per GB than purely in-memory tiers.

> [!IMPORTANT]
> All Flash Optimized tiers are currently in **Public Preview**.

## How Flash Optimized works

Azure Managed Redis Flash Optimized uses a tiered storage approach built on Redis Enterprise:

- **Hot data** ΓÇô Frequently accessed keys and values stay in DRAM for sub-millisecond latency.
- **Cold data** ΓÇô Less frequently accessed data is automatically moved to local NVMe storage on the host VM.
- **Transparent to clients** ΓÇô The tiering is fully managed. Clients interact with the cache using standard Redis commands without awareness of where data physically resides.

This architecture allows you to maintain caches in the terabyte range at a significantly lower cost compared to all-in-memory deployments.

> [!NOTE]
> Storing data on NVMe via Flash Optimized does **not** increase data resiliency. For durability, configure [data persistence](how-to-persistence) (RDB or AOF) in addition to Flash storage.

## When to use Flash Optimized

Flash Optimized is ideal for scenarios where:

- Your dataset is very large (hundreds of GB to multiple TB).
- A significant portion of data is accessed infrequently ("cold").
- You need Redis semantics and performance for hot data, but want to avoid the cost of keeping everything in DRAM.
- Your workload can tolerate slightly higher latency on cold-data reads compared to in-memory tiers.

Common use cases include:

- **Analytics and reporting** - Large lookup tables, aggregated datasets
- **Social and gaming** - User profiles, session histories, leaderboards with long tails

## SKU sizes

| SKU | Size (GB) | Status |
|-----|-----------|--------|
| A250 | 235       | Public Preview |
| A500 | 480       | Public Preview |
| A700 | 720       | Public Preview |
| A1000 | 960       | Public Preview |
| A1500 | 1,440     | Public Preview |
| A2000 | 1,920     | Public Preview |
| A4500 | 4,500     | Public Preview |

For connection limits per SKU, see [Maximum number of client connections](overview#maximum-number-of-client-connections). For pricing details, see [Azure Managed Redis Pricing](https://azure.microsoft.com/pricing/details/managed-redis/).

## Feature support

The following table summarizes feature availability on the Flash Optimized tier:

| Feature | Supported |
|---------|:---------:|
| SLA | Γ£à |
| Data encryption in transit (Private endpoint) | Γ£à |
| Replication and failover | Γ£à |
| Network isolation (Private Link) | Γ£à |
| Microsoft Entra ID authentication | Γ£à |
| Scaling | Γ£à |
| High availability (zone redundant) | Γ£à |
| Data persistence (RDB/AOF) | Γ£à |
| Connection audit logs (event-based) | Γ£à |
| RedisJSON | Γ£à |
| Import/Export | Γ£à |
| Active geo-replication | Γ¥î |
| Non-clustered instances | Γ¥î |
| RediSearch / vector search | Γ¥î |
| RedisBloom | Γ¥î |
| RedisTimeSeries | Γ¥î |

> [!IMPORTANT]
> RedisJSON is the only module supported on the Flash Optimized tier. Active geo-replication, non-clustered mode, RediSearch/vector search, RedisBloom, and RedisTimeSeries are not supported due to performance considerations inherent to Flash storage. These features are currently not planned for Flash.

For a full comparison of features across all Azure Managed Redis tiers, see [What is Azure Managed Redis?](overview).

## Best practices

### How Flash storage is utilized

On Flash Optimized instances, 20% of the cache space is on RAM, while the other 80% uses Flash storage. All keys are stored in RAM, while values can be stored either in Flash storage or RAM. The Redis software intelligently determines the location of values. Hot values that are accessed frequently are stored in RAM, while cold values that are less commonly used are kept on Flash. Before data is read or written, it must be moved to RAM, becoming hot data.

Because Redis optimizes for the best performance, the instance first fills up the available RAM before adding items to Flash storage. Filling RAM first has a few implications for performance:

- Better performance and lower latency can occur when testing with low memory usage. Testing with a full cache instance can yield lower performance because only RAM is being used in the low memory usage testing phase.
- As you write more data to the cache, the proportion of data in RAM compared to Flash storage decreases, typically causing latency and throughput performance to decrease as well.

### Workloads well-suited for Flash Optimized

Workloads that are likely to run well on the Flash Optimized tier often have the following characteristics:

- Read heavy, with a high ratio of read commands to write commands.
- Access is focused on a subset of keys that are used much more frequently than the rest of the dataset.
- Relatively large values in comparison to key names. (Because key names are always stored in RAM, large values can become a bottleneck for memory growth.)

### Workloads that aren't well-suited for Flash Optimized

Some workloads have access characteristics that are less optimized for the design of the Flash tier:

- Write heavy workloads.
- Random or uniform data access patterns across most of the dataset.
- Long key names with relatively small value sizes.

### Optimize your hot/cold data ratio

The more predictable your access patterns, the better Flash Optimized performs:

- Keys with consistent access frequency benefit from stable tiering.
- Workloads with extremely random access patterns across the full dataset will cause degraded latency
- Use `INFO` and monitoring to understand your hit rates and eviction behavior.

### Use data persistence for durability

Flash storage is for performance tiering, **not for data protection**. Configure RDB snapshots or AOF persistence to protect against data loss from outages. Both persistence options are supported on Flash Optimized.

### Network and security

- **Private endpoints** ΓÇô Always use Private Link to keep traffic within your Azure virtual network.
- **Microsoft Entra ID** ΓÇô Use passwordless authentication where possible for improved security posture.
- **Customer-managed keys (CMK)** ΓÇô Configure encryption at rest with Azure Key Vault for compliance requirements.

### Client configuration

- For client timeout and connection resilience guidance, see [Connection resilience best practices](best-practices-connection).
- Use pipelining to maximize throughput.
- Prefer many small keys over few large keys.
- Monitor connections, latency percentiles (especially p99), and CPU.

## Common issues and troubleshooting

### Large keys causing OOM despite available Flash capacity

Large keys can cause issues on Flash caches. As a best practice, keep value sizes under 512KB. Large keys are pinned to RAM and cannot spill to NVMe Flash storage. If many large keys accumulate, RAM can fill up causing out of memory (OOM) errors even when Flash storage has available capacity. Mitigation: break large values into smaller keys, use compression or chunking strategies, and monitor RAM usage independently from total cache capacity.

### Hot keys causing RAM fragmentation

Having frequently accessed (hot) keys in RAM is expected and desirable for Flash Optimized - this is how the tier delivers low-latency reads. However, hot keys that are frequently updated or resized can cause memory fragmentation in RAM over time. This fragmentation consumes additional RAM beyond the actual data size, potentially leading to OOM errors while Flash storage remains unaffected.

This is distinct from the recommendation to avoid random access patterns. Concentrated access on a subset of keys is ideal for Flash, but if those hot keys are also write-heavy with variable value sizes, RAM fragmentation can accumulate.

Mitigation: monitor the memory fragmentation ratio and, where possible, use fixed-size values for frequently updated keys to reduce fragmentation.

## Migration from Azure Cache for Redis

If you're currently using the Enterprise Flash tier of Azure Cache for Redis, see [Migrate Enterprise tier to Azure Managed Redis](migrate/migrate-redis-enterprise-overview) for guidance on moving to Azure Managed Redis Flash Optimized.

## Related content

- [What is Azure Managed Redis?](overview)
- [Azure Managed Redis Architecture](architecture)
- [Choose the right tier](cache-choose-tier)
- [Scale an Azure Managed Redis instance](how-to-scale)
- [Data persistence in Azure Managed Redis](how-to-persistence)
- [Best practices for Enterprise tiers](../azure-cache-for-redis/cache-best-practices-enterprise-tiers)
