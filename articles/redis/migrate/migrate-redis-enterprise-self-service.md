---
title: Plan execution - Migrate from Redis Enterprise to Azure Managed Redis
description: Step-by-step instructions for migrating from Azure Cache for Redis Enterprise tier to Azure Managed Redis.
ms.date: 02/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis Enterprise
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Enterprise instances, I want step-by-step instructions to execute my migration to Azure Managed Redis.
---

# Plan execution - Redis Enterprise

This article provides step-by-step instructions for both migration paths:

- [Self-service migration for caches without geo-replication](#self-service-migration-for-caches-without-geo-replication)
- [Self-service migration for caches with geo-replication](#self-service-migration-for-caches-with-geo-replication)

We highly recommend performing the migration during off-business hours, as it will result in a brief connectivity blip similar to behavior during regular maintenance operations.

## Self-service migration for caches without geo-replication

### Step 1: Update deployment scripts

Once you have identified the appropriate Azure Managed Redis SKU, update your deployment scripts (such as ARM templates, Bicep files, or Terraform configurations) to provision Azure Managed Redis instead of Azure Cache for Redis Enterprise.

### Step 2: Create a new Azure Managed Redis instance

Using the [size and performance tier](migrate-redis-enterprise-understand.md#choose-the-right-azure-managed-redis-size) you identified earlier, create the instance by following the [Quickstart: Create an Azure Managed Redis Instance](../quickstart-create-managed-redis.md).
You can alternately use list-skus-for-scaling command on your Redis Enterprise instance to determine the recommended Azure Managed Redis instance.
`az redisenterprise list-skus-for-scaling --resource-group rg --cluster-name clustername.region.redisenterprise.cache.azure.net`

### Step 3: Migrate your data

Choose a data migration strategy based on your tolerance for downtime and data loss.

> [!NOTE]
> If your application can tolerate data loss, or has mechanisms to rehydrate the cache from its data source, you can skip this step and proceed directly to [Step 4: Update your application](#step-4-update-your-application).

#### Export and import data using an RDB file

Best for creating a point-in-time snapshot of your data.

- **Pros:** Preserves data snapshot, straightforward process.
- **Cons:** Data written after the snapshot is taken isn't captured.

Steps:

1. Export the RDB file from the existing Enterprise cache to your Azure Storage account.
1. Import the data from the Azure Storage account into the new Azure Managed Redis instance.
1. For detailed instructions, see [Import and Export data in Azure Managed Redis](../how-to-import-export-data.md).

#### Dual-write strategy

Best when you need zero data loss and can tolerate running two caches temporarily.

- **Pros:** No data loss, no downtime, uninterrupted operations.
- **Cons:** Requires running two caches for an extended period.

Steps:

1. Modify your application to write to both the existing Enterprise cache and the new Azure Managed Redis instance.
1. Continue reading from the Enterprise cache while data populates in the new instance.
1. After sufficient data sync, switch reads to Azure Managed Redis.
1. Proceed to [Step 4: Update your application](#step-4-update-your-application).

#### Programmatic migration using RIOT

RIOT provides a way to migrate content from Enterprise to Azure Managed Redis. For more information, see [Data Migration with RIOT-X for Azure Managed Redis](https://techcommunity.microsoft.com/blog/azure-managed-redis/data-migration-with-riot-x-for-azure-managed-redis/4404672).

- **Pros:** Full control, customizable.
- **Cons:** Requires development effort.

### Step 4: Update your application

Update your application's connection configuration to point to the new Azure Managed Redis instance. At a minimum, you need to update:

- **Hostname**: The DNS suffix changes from `redisenterprise.cache.azure.net` to `redis.azure.net`.
- **Access key**: Use the access key from the new Azure Managed Redis instance.

> [!IMPORTANT]
> Consider switching to Microsoft Entra ID authentication instead of access keys. Microsoft Entra ID offers improved security and is the recommended authentication method.

> [!NOTE]
> If you connect to your existing Enterprise instance through a private endpoint, ensure your new Azure Managed Redis instance is peered to the same virtual network as your application, with a similar networking setup.

### Step 5: Validate and decommission

1. Verify your application works correctly with the new Azure Managed Redis instance.
1. Monitor the new cache for expected behavior, performance, and error rates.
1. Once you're confident the new instance is working as expected, delete the old Enterprise instance.

## Self-service migration for caches with geo-replication

Use these steps if you have a set of geo-replicated Redis Enterprise caches that you want to migrate to Azure Managed Redis.

1. Identify the appropriate Azure Managed Redis SKU using the `list-skus-for-scaling` command in the Azure CLI: `az redisenterprise list-skus-for-scaling --resource-group --cluster-name`. 
1. Ensure that all Redis Enterprise caches in your geo-replication group are the same SKU and size.
1. Create a new Azure Managed Redis instance and during creation, add it to the geo-replication group which contains the Redis Enterprise instances that you wish to migrate.
1. If you use private endpoint, then provision a new private DNS Zone for `*.redis.azure.net` in the same virtual network and create a new private endpoint for this new Azure Managed Redis instance.
1. Verify that the new Azure Managed Redis instance is accessible and update your application to include the new Azure Managed Redis endpoint.
1. Once Azure Managed Redis instance has replicated all the dataset, remove one Redis Enterprise instance from the geo-replicated group.
1. Repeat the preceding steps for every remaining Redis Enterprise cache in your geo-replication group.

### Limitations/callouts
1. Once an Azure Managed Redis instance is added to an existing geo-replication group of Redis Enterprise instances, you cannot add new Redis Enterprise instances to that geo-replication group. You can only add Azure Managed Redis and only remove Redis Enterprise instances.
1. Scaling is blocked when a geo-replication contains a mix of Azure Managed Redis and Redis Enterprise instances.
1. While geo-replication groups have a limit of 5 Redis instances, we allow up to 6 Redis instances for geo-replication group containing a mix of Azure Managed Redis and Redis Enterprise to facilitate migration.

> [!IMPORTANT]
> We recommend moving to Microsoft Entra ID authentication after migration, even if you initially continue using existing access keys.

## Related content

- [Migration overview](migrate-redis-enterprise-overview.md)
- [Understand the differences](migrate-redis-enterprise-understand.md)
- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
- [Scale an Azure Managed Redis instance](../how-to-scale.md)
