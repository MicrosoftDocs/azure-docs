---
title: Azure Managed Redis - Flash Optimized tier
description: Learn about the Flash Optimized tier in Azure Managed Redis, including SKU sizes, features, best practices, and common issues.
author: apbhatnagar
ms.author: apbhatnagar
ms.service: azure-managed-redis
ms.topic: conceptual
ms.date: 04/30/2026
ms.custom: references_regions
---

# Azure Managed Redis – Flash Optimized tier

The Flash Optimized tier in Azure Managed Redis enables cost-effective scaling for very large datasets by automatically moving less-frequently accessed data from memory (RAM) to fast NVMe flash storage. Hot data remains in DRAM for low-latency access, while colder data is served from NVMe at a lower cost per GB than purely in-memory tiers.

> [!IMPORTANT]
> All Flash Optimized tiers are currently in **Public Preview**.

## How Flash Optimized works

Azure Managed Redis Flash Optimized uses a tiered storage approach built on Redis Enterprise:

- **Hot data** – Frequently accessed keys and values stay in DRAM for sub-millisecond latency.
- **Cold data** – Less frequently accessed data is automatically moved to local NVMe storage on the host VM.
- **Transparent to clients** – The tiering is fully managed. Clients interact with the cache using standard Redis commands without awareness of where data physically resides.

This architecture allows you to maintain caches in the terabyte range at a significantly lower cost compared to all-in-memory deployments.

> [!NOTE]
> Storing data on NVMe via Flash Optimized does **not** increase data resiliency. For durability, configure [data persistence](how-to-persistence) (RDB or AOF) in addition to Flash storage.

## When to use Flash Optimized

Flash Optimized is ideal for scenarios where:

- Your dataset is very large (hundreds of GB to multiple TB).
- A significant portion of data is accessed infrequently ("cold").
- You need Redis semantics and performance for hot data, but want to avoid the cost of keeping everything in DRAM.
- You need Redis semantics and performance for hot data, but want to avoid the cost of keeping everything in DRAM.
- Your workload can tolerate higher latency on cold-data reads compared to in-memory tiers.

Common use cases include:

- **Analytics and reporting** – Large lookup tables, aggregated datasets
- **Social and gaming** – User profiles, session histories, leaderboards with long tails
- **AI/ML** – Feature stores, embedding caches, vector data (note: RediSearch/vector search is not supported on Flash)
- **IoT and telemetry** – Time-series data, device state

## Region availability

The Flash Optimized tier is available in the following Azure regions:

| Region | Region | Region |
|--------|--------|--------|
| Australia Central | Indonesia Central | Norway West |
| Australia Central 2 | Israel Central | Poland Central |
| Australia East | Italy North | South Africa North |
| Austria East | Japan West | South Africa West |
| Belgium Central | Jio India Central | Spain Central |
| Brazil South | Jio India West | Sweden Central |
| Brazil Southeast | Korea Central | Switzerland North |
| Canada Central | Korea South | Switzerland West |
| Canada East | Malaysia West | UAE North |
| Central India | Mexico Central | UK South |
| Central US | New Zealand North | West Central US |
| Chile Central | North Central US | West Europe |
| Denmark East | North Europe | West US |
| East US | Norway East | West US 2 |
| East US 2 |  | West US 3 |
| France Central |  |  |
| France South |  |  |
| Germany North |  |  |
| Germany West Central |  |  |

For the latest region availability, see [Azure products by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

## SKU sizes and max client connections

| Size (GB) | Max Client Connections | Status |
|-----------|------------------------|--------|
| 235       | 75,000                 | Public Preview |
| 480       | 150,000                | Public Preview |
| 720       | 200,000                | Public Preview |
| 960       | 200,000                | Public Preview |
| 1,440     | 200,000                | Public Preview |
| 1,920     | 200,000                | Public Preview |
| 4,500     | 200,000                | Public Preview |

For pricing details, see [Azure Managed Redis Pricing](https://azure.microsoft.com/pricing/details/managed-redis/).

## Feature support

The following table summarizes feature availability on the Flash Optimized tier compared to in-memory tiers:

| Feature | Flash Optimized | In-memory tiers |
|---------|:---------------:|:---------------:|
| SLA | ✅ | ✅ |
| Data encryption in transit (Private endpoint) | ✅ | ✅ |
| Replication and failover | ✅ | ✅ |
| Network isolation (Private Link) | ✅ | ✅ |
| Microsoft Entra ID authentication | ✅ | ✅ |
| Scaling | ✅ | ✅ |
| High availability (zone redundant) | ✅ | ✅ |
| Data persistence (RDB/AOF) | ✅ | ✅ |
| Active geo-replication | ❌ | ✅ |
| Non-clustered instances | ❌ | ✅ |
| Connection audit logs (event-based) | ✅ | ✅ |
| RedisJSON | ✅ | ✅ |
| RediSearch / vector search | ❌ | ✅ |
| RedisBloom | ✅ | ✅ |
| RedisTimeSeries | ✅ | ✅ |
| Import/Export | ✅ | ✅ |

> [!IMPORTANT]
> Active geo-replication and non-clustered clustering policies are **not supported** on the Flash Optimized tier.

## Best practices

### Optimize your hot/cold data ratio

The more predictable your access patterns, the better Flash Optimized performs:

- Keys with consistent access frequency benefit from stable tiering.
- Workloads with extremely random access patterns across the full dataset may not see as much cost benefit.
- Use `INFO` and monitoring to understand your hit rates and eviction behavior.

### Use data persistence for durability

Flash storage is for performance tiering, **not for data protection**. Configure RDB snapshots or AOF persistence to protect against data loss from outages. Both persistence options are supported on Flash Optimized.

### Network and security

- **Private endpoints** – Always use Private Link to keep traffic within your Azure virtual network.
- **Microsoft Entra ID** – Use passwordless authentication where possible for improved security posture.
- **Customer-managed keys (CMK)** – Configure encryption at rest with Azure Key Vault for compliance requirements.

### Client configuration

- Set appropriate client timeouts to account for occasional higher latency on cold-data reads.
- Use pipelining to maximize throughput.
- Prefer many small keys over few large keys.
- Monitor connections, latency percentiles (especially p99), and CPU.

## Limitations

- **No active geo-replication** – If you require multi-region active-active replication, use an in-memory tier instead.
- **No non-clustered mode** – Flash Optimized only supports clustered instances.
- **No RediSearch/vector search** – Modules requiring search functionality are not available on Flash.
- **Higher tail latency** – Cold-data reads served from NVMe will have higher latency than in-memory reads.
- **Public Preview** – Not recommended for production workloads that require an SLA guarantee until GA.

## Common issues and troubleshooting

### Large keys causing OOM despite available Flash capacity

Keys with very large values or keys that may grow over a certain size become ineligible to move to Flash storage and will remain in RAM. If many large keys accumulate, RAM can fill up causing OOM errors even when Flash storage has available capacity. Mitigation: break large values into smaller keys, or monitor RAM usage independently from total cache capacity.

### Hot keys causing RAM fragmentation

Frequently accessed (hot) keys remain in RAM and can cause memory fragmentation over time. This fragmentation consumes additional RAM beyond the actual data size, potentially leading to OOM errors while Flash storage remains unaffected. Mitigation: distribute access patterns across more keys where possible.

## Pricing

Flash Optimized pricing is based on the selected cache size. Because Flash uses NVMe storage for a portion of data, the cost per GB is lower than equivalent in-memory tiers at scale.

- [Azure Managed Redis Pricing Calculator](https://azure.microsoft.com/pricing/details/managed-redis/)
- [Reservations for Azure Managed Redis](reserved-pricing) – Prepay for compute to reduce costs.

## Migration from Azure Cache for Redis

If you're currently using the Enterprise Flash tier of Azure Cache for Redis, see [Migrate Enterprise tier to Azure Managed Redis](migrate/migrate-redis-enterprise-overview) for guidance on moving to Azure Managed Redis Flash Optimized.

## Related content

- [What is Azure Managed Redis?](overview)
- [Azure Managed Redis Architecture](architecture)
- [Choose the right tier](cache-choose-tier)
- [Scale an Azure Managed Redis instance](how-to-scale)
- [Data persistence in Azure Managed Redis](how-to-persistence)
- [Best practices for Enterprise tiers](../azure-cache-for-redis/cache-best-practices-enterprise-tiers)
