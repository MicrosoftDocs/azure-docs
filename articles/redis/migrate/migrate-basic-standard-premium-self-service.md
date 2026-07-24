---
title: Plan execution - Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis
description: Step-by-step instructions for migrating from Azure Cache for Redis Basic, Standard, and Premium tiers to Azure Managed Redis.
ms.date: 03/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Basic, Standard, or Premium instances, I want step-by-step instructions to execute my migration to Azure Managed Redis.
---

# Plan migration execution - Basic, Standard, and Premium tiers to Azure Managed Redis

This article provides step-by-step instructions for migration paths. We highly recommend performing the migration during off-business hours, as it will result in a brief connectivity blip similar to behavior during regular maintenance operations.

[!INCLUDE [Redis migration agent skill](../includes/redis-migration-agent-skill.md)]

## Step 1: Update deployment scripts and create new Azure Managed Redis instance

1. Once you have identified the appropriate Azure Managed Redis SKU, update your deployment scripts (such as ARM templates, Bicep files, or Terraform configurations) to provision Azure Managed Redis instead of Azure Cache for Redis.
1. Use the [SKU mapping table](migrate-basic-standard-premium-understand.md#choose-the-right-azure-managed-redis-size-and-sku) to select the right size (same size or bigger than the existing cache) and performance tier.
1. Create the instance by following the [Quickstart: Create an Azure Managed Redis Instance](../quickstart-create-managed-redis.md).

> [!TIP]
> If you're unsure whether your workload is memory-intensive or compute-intensive, start with the **Balanced** performance tier.

## Step 2: Migrate your data

Choose a data migration strategy based on your tolerance for downtime and data loss. If your application can tolerate data loss, or can rehydrate the cache from its data source (for example, a look-aside cache pattern), you can skip this step and proceed directly to [Step 3](#step-3-update-your-application).

> [!IMPORTANT]
> Azure Managed Redis reserves approximately 20% of memory for system operations and overhead. Account for this reservation when choosing the right memory size for your new instance. For example, if your workload requires 10 GB of usable memory, select a SKU with at least 12.5 GB of total memory.

### Export and import data using an RDB file

Only supported for Premium tier. Provides a point-in-time snapshot of your data.

- **Pros:** Simple, compatible with any Redis cache.
- **Cons:** Data written after the snapshot is taken isn't captured.

Steps:

1. Export the RDB file from the existing Azure Cache for Redis instance using the [export instructions](../../azure-cache-for-redis/cache-how-to-import-export-data.md#export) or the [PowerShell Export cmdlet](/powershell/module/az.rediscache/export-azrediscache).
1. Import the RDB file into the new Azure Managed Redis instance using the [import instructions](../how-to-import-export-data.md) or the PowerShell Import cmdlet.
1. Proceed to [Step 3: Update your application](#step-3-update-your-application).

### Dual-write strategy

Best when you need zero data loss and can tolerate running two caches temporarily.

- **Pros:** No data loss, no downtime, uninterrupted operations.
- **Cons:** Requires running two caches for an extended period.

Steps:

1. Modify your application code to write to both the existing cache and the new Azure Managed Redis instance.
1. Continue reading data from the existing cache until the new instance is sufficiently populated.
1. Update the application code to read and write from the new instance only.
1. Proceed to [Step 3: Update your application](#step-3-update-your-application).

### Programmatic migration

RIOT provides a way to migrate content from Enterprise to Azure Managed Redis. For more information, see [Data Migration with RIOT-X for Azure Managed Redis](https://techcommunity.microsoft.com/blog/azure-managed-redis/data-migration-with-riot-x-for-azure-managed-redis/4404672).

- **Pros:** Full control, customizable.
- **Cons:** Requires development effort.

Steps:

1. Create a VM in the same region as the existing cache. If your dataset is large, choose a powerful VM to reduce copying time.
1. Flush data from the new cache to ensure it's empty. **Don't flush the source cache.**
1. Copy data from the source cache to the new Azure Managed Redis instance.
1. Proceed to [Step 3: Update your application](#step-3-update-your-application).

## Step 3: Update your application

Update your application's connection configuration to point to the new Azure Managed Redis instance. At a minimum, you need to update:

- **Hostname**: The DNS suffix changes from `.redis.cache.windows.net` to `<region>.redis.azure.net`.
- **Port**: The TLS port changes from `6380` to `10000`.
- **Access key**: Use the access key from the new Azure Managed Redis instance.

> [!IMPORTANT]
> Consider switching to Microsoft Entra ID authentication instead of access keys. Microsoft Entra ID offers improved security and is the recommended authentication method.

> [!NOTE]
> If you connect to your existing cache through a private endpoint, ensure your new Azure Managed Redis instance is peered to the same virtual network as your application, with a similar networking setup.

Azure Cache for Redis and Azure Managed Redis are compatible, so no application code changes other than connection configurations are required for most scenarios.

## Step 4: Validate and decommission

1. Verify your application works correctly with the new Azure Managed Redis instance.
1. Monitor the new cache for expected behavior, performance, and error rates.
1. Once you're confident the new instance is working as expected, delete the old Azure Cache for Redis instance.

## Related content

- [Migration overview](migrate-basic-standard-premium-overview.md)
- [Understand the differences](migrate-basic-standard-premium-understand.md)
- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
- [Scale an Azure Managed Redis instance](../how-to-scale.md)
