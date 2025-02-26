---
title: What's new in Azure Managed Redis (preview)
description: Recent updates for Azure Managed Redis

ms.custom: references_regions

ms.topic: conceptual
ms.date: 11/15/2024
---

# What's New in Azure Managed Redis (preview)

Find out what's new in Azure Managed Redis (preview).

## November 2024

### Azure Managed Redis (preview)

Azure Managed Redis (preview) is now available to create and use managed caches. Azure Managed Redis runs on the [Redis Enterprise](https://redis.io/redis-enterprise/advantages/) stack, which offers significant advantages over the community edition of Redis. 

Three tiers are for in-memory data:

- **Memory Optimized** Ideal for memory-intensive use cases that require a high memory-to-vCPU ratio (1:8) but don't need the highest throughput performance. It provides a lower price point for scenarios where less processing power or throughput is necessary, making it an excellent choice for development and testing environments.
- **Balanced (Memory + Compute)** Offers a balanced memory-to-vCPU (1:4) ratio, making it ideal for standard workloads. This tier provides a healthy balance of memory and compute resources. 
- **Compute Optimized** Designed for performance-intensive workloads requiring maximum throughput, with a low memory-to-vCPU (1:2) ratio. It's ideal for applications that demand the highest performance. 

One tier stores data both in-memory and on-disk:

- **Flash Optimized** Enables Redis clusters to automatically move less frequently accessed data from memory (RAM) to NVMe storage. This reduces performance, but allows for cost-effective scaling of caches with large datasets.

For more information, see [What is Azure Managed Redis (preview)?](managed-redis-overview.md).

## Related content

- [What is Azure Managed Redis (preview)?](managed-redis-overview.md)
- [Azure Managed Redis Architecture](managed-redis-architecture.md)
