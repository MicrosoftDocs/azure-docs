---
title: Understand - Migrate from Redis Enterprise to Azure Managed Redis
description: Understand the key differences between Azure Cache for Redis Enterprise tier and Azure Managed Redis before migrating.
ms.date: 03/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis Enterprise
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Enterprise instances, I want to understand the differences before migrating to Azure Managed Redis.
---

# Understand the differences - Azure Cache for Redis Enterprise versus Azure Managed Redis

[!INCLUDE [Redis Enterprise migration agent skill](../includes/redis-enterprise-migration-agent-skill.md)]

Azure Managed Redis is built on the same core Redis Enterprise software stack as Azure Cache for Redis Enterprise, but with a simplified SKU structure. Because the core software is the same, your existing Enterprise applications require minimal changes — primarily updating connection credentials and hostname. However, please read the following differences carefully as Azure Managed Redis has a different SKU structure and high availability configuration.

## Key feature differences

Here are the important differences to be aware of when moving from Azure Cache for Redis Enterprise to Azure Managed Redis:

- **SKU structure.** Azure Managed Redis organizes SKUs by memory size and performance tier (Balanced, Memory Optimized, Compute Optimized), rather than the capacity-based scaling model used by Azure Cache for Redis Enterprise. For more information, see [Choosing the right tier](../overview.md#choosing-the-right-tier).

- **Redis version.** Azure Managed Redis runs Redis 7.4, while Azure Cache for Redis Enterprise runs Redis 7.2.

- **Clustering policy.** Azure Managed Redis supports OSS, Enterprise, and Nonclustered clustering policies. Azure Cache for Redis Enterprise supports only OSS and Enterprise clustering policies.

- **Zone redundancy.** Azure Managed Redis is zone redundant by default when high availability is enabled and the region supports multiple availability zones. Azure Cache for Redis Enterprise is also zone redundant, but Azure Managed Redis removes the need for a quorum node, so all nodes serve as data nodes, increasing cost-efficiency. For more about the quorum node, see [Enterprise and Enterprise Flash tiers](/azure/azure-cache-for-redis/cache-high-availability#enterprise-and-enterprise-flash-tiers).

- **Non-HA mode.** Azure Managed Redis offers the option to deploy without high availability for development and test environments, which halves the cost of your instance. Azure Cache for Redis Enterprise doesn't offer a non-HA option.

- **Data persistence.** Azure Managed Redis supports data persistence as a generally available feature. In Azure Cache for Redis Enterprise, data persistence is in preview.

- **Microsoft Entra ID authentication.** Azure Managed Redis supports Microsoft Entra ID authentication. Azure Cache for Redis Enterprise doesn't support Microsoft Entra ID authentication. We recommend adopting Microsoft Entra ID for improved security.

- **Azure region support.** Azure Managed Redis is available in most Azure regions, while Azure Cache for Redis Enterprise has limited regional availability due to quorum node requirements.

- **Hostname and DNS suffix.** The DNS suffix changes from `redisenterprise.cache.azure.net` to `redis.azure.net`. Update your applications to use the new Redis instance hostname.

## Choose the right Azure Managed Redis size

Azure Managed Redis offers many memory sizes and three performance tiers. For more information, see [Choosing the right tier](../overview.md#choosing-the-right-tier).

### Identify the memory size of your existing Enterprise instance

Azure Cache for Redis Enterprise instances can be scaled out, so it's important to note the scale-out factor for your cache.

1. Go to the Azure portal and select **Overview** from the resource menu.
1. Check the **Status** field to see the memory size of your Enterprise instance.

**Example:**

:::image type="content" source="../media/migrate-overview/enterprise-overview-resource.png" alt-text="Screenshot of the overview of an Enterprise cache." lightbox="../media/migrate-overview/enterprise-overview-resource.png":::

In this example, the **Status** field shows **Running - Enterprise 8GB (2 x 4GB)**. This means the cache is using an E5 Enterprise SKU with a scale of 2, yielding an 8-GB cache. You should select an Azure Managed Redis instance with at least 10 GB of memory.

> [!NOTE]
> Azure Managed Redis reserves approximately 20% of memory for system operations and overhead. When comparing sizes, account for this reservation — for example, the B10/M10/X10 SKUs offer 12 GB of total memory but approximately 9.6 GB of usable memory for your data.

To find a more optimized size, review the **Used Memory Percentage** metric on your existing Enterprise cache in Azure Monitor. If your actual memory usage is well below the cache size, you may be able to select a smaller, more cost-effective Azure Managed Redis SKU.

In this case, any of the following tiers offering 12 GB of memory would be appropriate:

| SKU     | Tier              |
|---------|-------------------|
| M10     | Memory Optimized  |
| B10     | Balanced          |
| X10     | Compute Optimized |

### Choose a performance tier

- **Memory Optimized** — Choose this if your workload is more likely to run out of memory before CPU.
- **Compute Optimized** — Choose this if your workload is throughput-intensive or latency-sensitive.
- **Balanced** — A good starting point if you're unsure. It offers a healthy mix of memory and compute.
- **Flash Optimized** — Choose this if you're currently using Redis Enterprise Flash tier.

## Next step

> [!div class="nextstepaction"]
> [Plan execution](migrate-redis-enterprise-self-service.md)

## Related content

- [Migration overview](migrate-redis-enterprise-overview.md)
- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
