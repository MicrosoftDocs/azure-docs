---
title: How to migrate an Enterprise cache to Azure Managed Redis
description: In this article, you learn how to migrate an Enterprise cache from Azure Cache for Redis to Azure Managed Redis
ms.date: 09/28/2025
ms.topic: overview
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer who has Enterprise caches, I want to migrate them to Azure Managed Redis
---
# Migrate from Azure Cache for Redis Enterprise to Azure Managed Redis

This article discusses the process of migrating from Azure Cache for Redis Enterprise to Azure Managed Redis, including benefits of choosing Azure Managed Redis, feature comparisons, migration strategies, and best practices.

## Why migrate to Azure Managed Redis?

<!-- some of these sound a bit like marketing. Are we trying to give them a procedure or a reason to change? This feels like it should be in another document at least and maybe not on Learn -->

Like Azure Cache for Redis Enterprise, Azure Managed Redis is also built on the advanced Redis Enterprise software. However, there are subtle differences that make adopting Azure Managed Redis more secure from the start and more and cost-effective.

1. Azure Managed Redis is an Azure first party offering, meaning there's no Azure Marketplace component involved and users don't have to transact with Marketplace separately. You provision, manage, and pay for Azure Managed Redis like any other native Azure service or product.

1. Azure Managed Redis doesn't need the _quorum node_ that leads to underused resources and limits the regions or clouds that Azure Cache for Redis Enterprise can be offered in. Azure Managed Redis is now available in most Azure regions with plans to be supported in other sovereign clouds.

    For more information about quorum node, see [Enterprise and Enterprise Flash tiers](/azure/azure-cache-for-redis/cache-high-availability#enterprise-and-enterprise-flash-tiers).

1. Removal of the unused _quorum node_ results in cost-efficiency because all nodes can be used as data nodes.

1. Azure Managed Redis is zone redundant by default.

1. Azure Managed Redis offers a mode that doesn't use high availability (HA) for your development and test environments. Using non-production environments without HA halves the cost of your instance.

1. Azure Managed Redis has a much-simplified SKU structure based on your memory and performance requirements. Unlike Azure Cache for Redis Enterprise, where you manage the scale factor or capacity of your instance, Azure Managed Redis offers three performance tiers to choose from. Read more here:

1. Azure Managed Redis offers the Microsoft Entra ID authentication when you create a cache to improve the security posture of your workload.

### Feature comparison

| Feature | Azure Cache for Redis Enterprise | Azure Managed Redis |
|----|----|----|
| Redis version | 7.2 | 7.4 |
| Clustering policy | OSS, Enterprise | OSS, Enterprise, Non-clustered |
| Geo-replication | Active | Active |
| SLA | Up to 99.999% | Up to 99.999% |
| Zone redundancy | Yes | Yes (default) |
| Non-HA mode | No | Yes (for dev/test) |
| Data persistence | Yes (in preview) | Yes |
| Scaling | Yes | Yes |
| TLS version support | 1.2,1.3 | 1.2,1.3 |
| Microsoft Entra Id authentication | No | Yes |
| Azure Region support | Limited | Extensive |
| Azure Sovereign Cloud support | No | Yes (coming soon) |
| Hostname DNS suffix | `<name>.<region>.redisenterprise.cache.azure.net` | `<name>.<region>.redis.azure.net` |

## How to migrate to Azure Managed Redis?

Azure Managed Redis uses the same software stack as Azure Cache for Redis Enterprise, so your existing applications using Azure Cache for Redis Enterprise tier don't need many changes. The significant exception is the need to change connection credentials.

### Different hostname suffix

While the core software for Azure Cache for Redis Enterprise and Azure Managed Redis is similar, the DNS suffix for your Redis cluster hostnames is different. When you move to Azure Managed Redis, your application need to change the Redis cluster hostname. If you use access keys for connecting to your  cache, you must also update access key that it uses to connect to the cache.

> [!IMPORTANT]
> Consider updating the code that connects to the cache. Instead of using access keys, use Microsoft Entra ID. We recommend using Microsoft Entra ID instead of access keys.

## Choosing the right Azure Managed Redis size and SKU

Azure Managed Redis offers many memory sizes and three performance tiers. You can read more information about memory sizes and performance tiers here [Choosing the right tier](../overview.md#choosing-the-right-tier).

## Identify memory size of existing Azure Cache for Redis Enterprise instance

To choose the right Azure Managed Redis memory size, go to Azure portal, select Overview from the resource menu. Check the Status field in the Overview of your Azure Cache for Redis Enterprise instance.

The **Status** field shows the memory size of your Redis Enterprise instance.

Azure Cache for Redis Enterprise instances can be scaled out to provide more memory and/or compute resources, so it's important to note the scale-out factor for your cache. This is also related to Capacity, which is essentially the number of virtual machines running for your cluster.
<!-- are we sure we don't want to talk about shards here and not VMs -->

### Examples

If you're using E5 with scale 2 i.e. your Status on Overview blade says Enterprise 8GB (2 x 4GB), this means you're currently using a 8-GB cache and should start with at least 10GB cache on Azure Managed Redis. In this case, use the M10/B10/X10 option, which offers 12GB memory.
<!-- Need to improve this for clarity -->

### Identify performance tier

Identify if your workload is memory intensive or compute intensive. If your Redis Enterprise instance is more likely to run out of memory first than CPU, then your workload is memory-intensive and would benefit from choosing the Memory Optimized performance tier.

If your workload is latency or throughput intensive, then your workload is compute intensive and would benefit from starting with Compute Optimized performance tier.

If you're unsure, you can start with the Balanced performance tier because it offers a healthy mix of memory and performance.

If you're currently using Redis Enterprise Flash tier, then you should choose the Flash Optimized tier.

## Data migration

When migrating to Azure Managed Redis instance, you should consider whether you need to migrate over your data from existing Redis Enterprise instance to your new Azure Managed Redis instance. If your application can tolerate data loss, or has other mechanisms to rehydrate the cache without negative effects, then you skip this step and proceed to the next steps.

If your application needs to ensure that data is also migrated to the new Azure Managed Redis instance, choose one of the following options:

### Data Export and Import using an RDB File

- Pros: Preserves data snapshot.
- Cons: Risk of data loss if writes occur after snapshot.

#### Steps

1. Export RDB from existing Redis Enterprise cache to your Azure Storage account.
1. Import data from Azure Storage account into Azure Managed Redis.
1. Read more about data export/import here [Import and Export data in Azure Managed Redis](how-to-import-export-data).

### Dual-Write Strategy

- Pros: Zero downtime, safe transition.
- Cons: Requires temporary dual-cache setup.

#### Steps

- Modify your application to write to existing both the Azure Cache for Redis Enterprise cache and new Azure Managed Redis cache.
- Continue reading and writing from Redis Enterprise cache.
- After sufficient data sync, switch reads to Azure Managed Redis and delete Redis Enterprise instance

### Programmatic Migration using RIOT-X

RIOT-X provides a way to migrate your content from Enterprise to Azure Managed Redis. For more information, see [Data Migration with RIOT-X for Azure Managed Redis](https://techcommunity.microsoft.com/blog/azure-managed-redis/data-migration-with-riot-x-for-azure-managed-redis/4404672).

- Pros: Full control, customizable.
- Cons: Requires development effort.

## Create a new Azure Managed Redis instance

Once you identify the memory and performance tier for your new Azure Managed Redis instance, you can create the new Azure Managed Redis instance using guidance here.

<!-- add link - to what? -->

> [!IMPORTANT]
> If you connect to your existing Redis Enterprise instance through a private endpoint, ensure that your new Azure Managed Redis cache is also peered to the virtual network of your application. The new cache must have a similar set-up as existing Redis Enterprise instance.

## Update app to connect to Azure Managed Redis instance

Once you create a new Azure Managed Redis instance, you must change the Redis endpoint/hostname and the access key in your application to point to your new Azure Managed Redis instance. We recommend publishing this endpoint change during off-business hours because it results in connectivity blip.

Verify that your application is running as expected and then delete your Redis Enterprise instance.

## Related Content
