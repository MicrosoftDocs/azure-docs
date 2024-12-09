---
title: 'Quickstart: Create a Managed Redis cache'
description: In this quickstart, learn how to create an instance of Azure Managed Redis in use the Managed tier.


ms.service: azure
ms.custom: mvc, mode-other, ignite-2024
ms.topic: quickstart
ms.date: 04/12/2023
---
# Quickstart: Create an Azure Managed Redis (preview) Instance

Azure Managed Redis (preview) provides fully integrated and managed [Redis Enterprise](https://redislabs.com/redis-enterprise/) on Azure. There are four tiers of Azure Managed Redis (preview), each with different performance characteristics:

Three tiers are for in-memory data:

- **Memory Optimized** Ideal for memory-intensive use cases that require a high memory-to-vCPU ratio (1:8) but don't need the highest throughput performance. It provides a lower price point for scenarios where less processing power or throughput is necessary, making it an excellent choice for development and testing environments.
- **Balanced (Memory + Compute)** Offers a balanced memory-to-vCPU (1:4) ratio, making it ideal for standard workloads. It provides a healthy balance of memory and compute resources.
- **Compute Optimized** Designed for performance-intensive workloads requiring maximum throughput, with a low memory-to-vCPU (1:2) ratio. It's ideal for applications that demand the highest performance.

One tier stores data both in-memory and on-disk:

- **Flash Optimized** Enables Redis clusters to automatically move less frequently accessed data from memory (RAM) to NVMe storage. This reduces performance, but allows for cost-effective scaling of caches with large datasets.

For more information on choosing the right SKU and tier, see [Choosing the right tier](managed-redis/managed-redis-overview.md#choosing-the-right-tier)

## Prerequisites

- You need an Azure subscription before you begin. If you don't have one, create an [account](https://azure.microsoft.com/).

### Availability by region

Azure Managed Redis is continually expanding into new regions. To check the availability by region for all tiers, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=redis-cache&regions=all).

## Create a Redis instance

[!INCLUDE [managed-redis-create](includes/managed-redis-create.md)]

## Related content

- [What is Azure Managed Redis?](managed-redis/managed-redis-overview.md)
- [Using Azure Managed Redis with .NET](cache-dotnet-core-quickstart.md)
