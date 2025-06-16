---
title: What's new in Azure Managed Redis
description: Recent updates for Azure Managed Redis
ms.date: 05/18/2025
ms.topic: conceptual
ms.custom:
  - references_regions
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# What's New in Azure Managed Redis

Find out what's new in Azure Managed Redis.

## May 2025

### Azure Managed Redis General Availability (GA)

Azure Managed Redis is now generally available (GA) for you to create and to use managed caches. Azure Managed Redis offers significant advantages over the Basic, Standard, and Premium tiers of Azure Cache for Redis. 

Certain features remain in Public Preview.

- Scaling a cache
- Data persistence
- Non-clustered caches

All in-memory tiers that use over 120 GB of storage are in Public Preview, including:

- Memory Optimized M150 and higher
- Balanced B150 and higher
- Compute Optimized X150 and higher

All Flash Optimized tiers are in Public Preview.

## November 2024

### Azure Managed Redis (preview)

Azure Managed Redis (preview) is now available to create and use managed caches. Azure Managed Redis runs on the [Redis Enterprise](https://redis.io/technology/advantages/) stack, which offers significant advantages over the community edition of Redis.

Three tiers are for in-memory data:

- **Memory Optimized** Ideal for memory-intensive use cases that require a high memory-to-vCPU ratio (1:8) but don't need the highest throughput performance. It provides a lower price point for scenarios where less processing power or throughput is necessary, making it an excellent choice for development and testing environments.
- **Balanced (Memory + Compute)** Offers a balanced memory-to-vCPU (1:4) ratio, making it ideal for standard workloads. This tier provides a healthy balance of memory and compute resources. 
- **Compute Optimized** Designed for performance-intensive workloads requiring maximum throughput, with a low memory-to-vCPU (1:2) ratio. It's ideal for applications that demand the highest performance. 

One tier stores data both in-memory and on-disk:

- **Flash Optimized** Enables Redis clusters to automatically move less frequently accessed data from memory (RAM) to NVMe storage. This reduces performance, but allows for cost-effective scaling of caches with large datasets.

For more information, see [What is Azure Managed Redis (preview)?](overview.md).

## Related content

- [What is Azure Managed Redis (preview)?](overview.md)
- [Azure Managed Redis Architecture](architecture.md)
