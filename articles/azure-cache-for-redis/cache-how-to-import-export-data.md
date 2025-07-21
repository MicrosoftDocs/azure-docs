---
title: Import and export data
description: Learn how to import and export data to and from blob storage with your premium Azure Cache for Redis instances.



ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.date: 04/29/2025
appliesto:
  - ✅ Azure Cache for Redis
---
# Import and export data in Azure Cache for Redis

Azure Cache for Redis import and export functionality imports or exports data to or from Azure Redis cache instances as Redis Database (RDB) snapshots. The snapshots are imported or exported using a blob in an Azure Storage account.

You can use Azure Redis import and export functionality for data management, to migrate between different cache instances, or to populate a cache with data before use. This article describes how to import and export data in Azure Redis, and answers commonly asked questions.

## Scope of availability

|Tier     | Basic, Standard  | Premium  |Enterprise, Enterprise Flash  |
|---------|---------|---------|---------|
|Available  | No         | Yes        |  Yes  |

Import and export are supported in the Premium, Enterprise, and Enterprise Flash tiers.

## Compatibility

**Import**
- You can import your RDB snapshots from either page blobs or block blobs.
- You can import RDB files from Premium tier caches into Enterprise and Enterprise Flash tier caches.
- You can't import from Redis Enterprise and Enterprise Flash tier caches into Premium tier caches.

**Export**
- You can export your snapshots as RDB page blobs in Premium tier, or as `.gz` block blobs in Enterprise tiers.
- Blob storage accounts don't support export.

**Versions**
- Redis 4.0 caches support RDB version 8 and below. Redis 6.0 caches support RDB version 9 and below.
- You can't import exported backups from newer Redis versions like Redis 6.0 into older versions like Redis 4.0.

## Prerequisites

- A Premium, Enterprise, or Enterprise Flash tier cache in Azure Cache for Redis.
- To import files, an RDB file or files uploaded into page or block blobs in Azure Storage, in the same region and subscription as your Azure Redis cache.
  > [!NOTE]
  > If you use managed identity for storage account authentication, the storage account can be in a different subscription.

## Import

You can use import to bring Redis-compatible RDB files from any Redis server running in any cloud or environment, including Linux, Windows, or other cloud providers such as Amazon Web Services. Importing data is an easy way to create a cache with prepopulated data.

During the import process, Azure Redis loads the RDB files from Azure Storage into memory and then inserts the keys into the cache.

> [!IMPORTANT]
> Importing data deletes preexisting cache data, and the cache isn't accessible by cache clients during the import process.

> [!IMPORTANT]
> Importing from Redis Enterprise tiers to Premium tier isn't supported.

> [!NOTE]
> Before importing, ensure that your RDB file or files are uploaded into page or block blobs in Azure Storage. If you follow the [Export](#export) procedure first, your RDB file is already stored in a page blob and is ready for importing.

1. To import one or more cache blobs, on your Redis cache page in the Azure portal, select **Import data** under **Administration** on the left navigation menu.

1. On the **Import data** page, select an **Authentication Method**, and then select **Choose Blob(s)**.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-data.png" alt-text="Screenshot showing the Import data page with Choose Blob(s) selected.":::

1. On the **Storage accounts** page, select the storage account that contains the data to import.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-choose-storage-account.png" alt-text="Screenshot showing a list of storage accounts.":::

1. On the **Containers** page, select the container within the storage account that contains the data to import.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-choose-container.png" alt-text="Screenshot showing a list of containers in the storage account.":::

1. On the container page, select the checkboxes next to one or more blobs to import, and then select **Select**.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-choose-blobs.png" alt-text="Screenshot that shows selecting blobs from the container. ":::

1. On the **Import data** page, select **Import** to begin the import process.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-blobs.png" alt-text="Screenshot showing the Import button to select to begin the import.":::

You can monitor import progress by following the notifications from the Azure portal, or by viewing events in the [Activity log](/azure/azure-monitor/essentials/activity-log).

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-data-import-complete.png" alt-text="Screenshot showing the import progress in the Notifications pane.":::

## Export

The export process exports the data stored in your Azure Redis cache to RDB files. You can use this feature to move data from one Azure Redis cache or server to another.

During the export process, a temporary file is created on the virtual machine that hosts the Azure Redis server instance. The file is then uploaded to the chosen storage account. When the export operation completes with either success or failure, the temporary file is deleted.

> [!IMPORTANT]
> - Azure Redis doesn't support exporting to Azure Data Lake Storage Gen2 storage accounts.
> - Blob storage accounts don't support Azure Redis export.
> - Enterprise and Enterprise Flash don't support importing or exporting to or from to storage accounts that use firewalls or private endpoints. The storage account must have public network access.
> 
> If your export to a firewall-enabled storage account fails, see [What if I have firewall enabled on my storage account?](#what-if-i-have-firewall-enabled-on-my-storage-account) For more information, see [Azure storage account overview](/azure/storage/common/storage-account-overview).

1. To export the current contents of the cache to storage, on your Redis cache page in the Azure portal, select **Export data** under **Administration** on the left navigation menu.

1. On the **Export data** page, for **Blob name prefix**, enter a prefix for names of files generated by this export operation. Select an **Authentication Method**, and then select **Choose Storage Container**.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-export-data-choose-account.png" alt-text="Screenshot showing Export data and Choose Storage Container selected.":::

1. On the **Storage accounts** page, select the storage account that contains the data to export.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-import-choose-storage-account.png" alt-text="Screenshot showing a list of storage accounts.":::

1. On the **Containers** page, if you want to create a new container for the export, select **Container**, and on the **New Container** page, enter a name for the container and select **Create**. Otherwise, select the existing container you want to use.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-export-data-choose-storage-container.png" alt-text="Screenshot showing Export data selected in the Resource menu":::

1. On the **Containers** page, select the container you want to use for the export, and select **Select**.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-export-data.png" alt-text="Screenshot showing the selected storage container and Select button.":::

1. On the **Export data** page, select **Export**.

   :::image type="content" source="./media/cache-how-to-import-export-data/cache-export-data-container.png" alt-text="Screenshot showing the Export button.":::

You can monitor the progress of the export operation by following the notifications from the Azure portal, or by viewing the events in the [Activity log](/azure/azure-monitor/essentials/activity-log). Caches remain available for use during the export process.

:::image type="content" source="./media/cache-how-to-import-export-data/cache-export-data-export-complete.png" alt-text="Screenshot showing the export progress in the Notification pane.":::

## Import-export FAQ

This section contains frequently asked questions about the import and export features.

- [Can I automate import-export using Azure PowerShell or Azure CLI?](#can-i-automate-import-export-using-azure-powershell-or-azure-cli)
- [Can I import data from any Redis server?](#can-i-import-data-from-any-redis-server)
- [Can I import or export data from a storage account in a different subscription than my cache?](#can-i-import-or-export-data-from-a-storage-account-in-a-different-subscription-than-my-cache)
- [Can I use import-export with Redis clustering?](#can-i-use-import-export-with-redis-clustering)
- [How does import-export work with custom database settings?](#how-does-import-export-work-with-custom-database-settings)
- [How is import-export different from Redis data persistence?](#how-is-import-export-different-from-redis-data-persistence)
- [Is my cache available during an import-export operation?](#is-my-cache-available-during-an-import-export-operation)
- [What if I have a firewall enabled on my storage account?](#what-if-i-have-firewall-enabled-on-my-storage-account)
- [What RDB versions can I import?](#what-rdb-versions-can-i-import)
- [Which Azure Redis tiers support import-export?](#which-tiers-support-import-export)
- [Which permissions does the storage account container shared access signature (SAS) token need to allow export?](#which-permissions-need-to-be-granted-to-the-storage-account-container-shared-access-signature-sas-token-to-allow-export)
- [Why did I get an error when exporting my data to Azure Blob Storage?](#why-did-i-get-an-error-when-exporting-my-data-to-azure-blob-storage)
<!--- [Why did I get a timeout error during my import-export operation?](#why-did-i-get-a-timeout-error-during-my-import-export-operation?)-->

### Which tiers support import-export?

The import and export features are available only in the Premium, Enterprise, and Enterprise Flash tiers.

### Can I import data from any Redis server?

Yes, you can import data that was exported from Azure Redis instances. You can import RDB files from any Redis server running in any cloud or environment, including Linux, Windows, or other cloud providers like Amazon Web Services.

To import this data, upload the RDB file from the Redis server into a page or block blob in an Azure Storage account. Then import it into your Azure Redis cache instance.

For example, you might want to export the data from your production cache, and then import it into a cache that's part of a staging environment for testing or migration.

> [!IMPORTANT]
> To successfully import page blob data exported from non-Azure Redis servers, the page blob size must be aligned on a 512-byte boundary. For sample code to perform any required byte padding, see [Sample page blob upload](https://github.com/JimRoberts-MS/SamplePageBlobUpload).

### What RDB versions can I import?

For more information on supported RDB versions for import, see [Compatibility](#compatibility).

### Is my cache available during an import-export operation?

- Caches remain available during *export*, and you can continue to use your cache during an export operation.
- Caches become unavailable when an *import* operation starts and become available again when the import operation completes.

### Can I use import-export with Redis clustering?

Yes, and you can import and export between a clustered cache and a nonclustered cache. Since Redis cluster [only supports database 0](cache-how-to-scale.md#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering), any data in databases other than 0 isn't imported. When clustered cache data is imported, the keys are redistributed among the shards of the cluster.

### How does import-export work with custom database settings?

Some pricing tiers have different [database limits](cache-configure.md#databases). If you configured a custom value for the `databases` setting during cache creation, there are some considerations when importing.

When you import to a pricing tier with a lower `databases` limit than the tier you exported from:
- If you use the default number of `databases`, which is 16 for all pricing tiers, no data is lost.
- If you use a custom number of `databases` that falls within the limits for the tier you're importing to, no data is lost.
- If your exported data is from a database that exceeds the limits of the new tier, the data from the excess databases isn't imported.

### How is import-export different from Redis data persistence?

The Azure Cache for Redis data persistence feature is primarily for data durability, while the import-export functionality is designed for making periodic data backups for point-in-time recovery (PITR).
<!-- Kyle I rewrote this based on another convo. Also I want the primary answer to be in the first paragraph. -->
When you configure data persistence, your cache persists a snapshot of the data to disk, based on a configurable backup frequency. The data is written with a Redis-proprietary binary format.

On the Premium tier, the data persistence file is stored in Azure Storage, but you can't import the file into a different cache. On the Enterprise tiers, the data persistence file is stored in a mounted disk that isn't user-accessible.

If a catastrophic event disables both the primary and the replica caches, the persisted cache data is restored automatically using the most recent snapshot. Data persistence is designed for disaster recovery, and isn't intended as a PITR mechanism.

To make periodic data backups for PITR, use the import-export functionality. For more information, see [How to configure data persistence for Azure Cache for Redis](cache-how-to-premium-persistence.md).

### Can I automate import-export using Azure PowerShell or Azure CLI?

Yes. For the Premium tier, see the following content:

- [Import a Premium Azure Redis cache using Azure PowerShell](../redis/how-to-manage-redis-cache-powershell.md#to-import-an-azure-cache-for-redis)
- [Export a Premium Azure Redis cache using Azure PowerShell](../redis/how-to-manage-redis-cache-powershell.md#to-export-an-azure-cache-for-redis)
- [Import a Premium Azure Redis cache using Azure CLI](/cli/azure/redis#az-redis-import)
- [Export a Premium Azure Redis cache using Azure CLI](/cli/azure/redis#az-redis-export)

For the Enterprise and Enterprise Flash tiers, see the following content:

- [Import an Enterprise Azure Redis cache using Azure PowerShell](/powershell/module/az.redisenterprisecache/import-azredisenterprisecache)
- [Export an Enterprise Azure Redis cache using Azure PowerShell](/powershell/module/az.redisenterprisecache/export-azredisenterprisecache)
- [Import an Enterprise Azure Redis cache using Azure CLI](/cli/azure/redisenterprise/database#az-redisenterprise-database-import)
- [Export an Enterprise Azure Redis cache using Azure CLI](/cli/azure/redisenterprise/database#az-redisenterprise-database-export)

<!--huh? Not sure what this means, but I stayed on the Export page for an hour after setting it up before pressing Export, and the export worked fine.

### Why did I get a timeout error during my import-export operation?

If you remain on the **Import data** or **Export data** page for longer than 15 minutes before starting the operation, you receive an error with an error message similar to the following example:

```output
The request to import data into cache 'contoso55' failed with status 'error' and error 'One of the SAS URIs provided could not be used for the following reason: The SAS token end time (se) must be at least 1 hour from now and the start time (st), if given, must be at least 15 minutes in the past.
```

To resolve this error, start the import or export operation before 15 minutes elapses.-->

### Why did I get an error when exporting my data to Azure Blob Storage?

Export works only with RDB files stored as page blobs. Other blob types aren't supported, including blob storage accounts with hot and cool tiers. For more information, see [Azure storage account overview](/azure/storage/common/storage-account-overview).

If you use an access key to authenticate a storage account, having firewall exceptions on the storage account can cause the import-export processes to fail.

### What if I have firewall enabled on my storage account?

For a Premium tier instance, you must select **Allow Azure services on the trusted services list to access this storage account** in your storage account settings. Then use the system-assigned or user-assigned managed identity and provision the **Storage Blob Data Contributor** role-based access control (RBAC) role for that object ID. For more information, see [Managed identity for storage accounts](cache-managed-identity.md).

Enterprise and Enterprise Flash instances don't support importing or exporting to or from to storage accounts that use firewalls or private endpoints. The storage account must have public network access.

### Can I import or export data from a storage account in a different subscription than my cache?

In the Premium tier, you can import and export data from a storage account in a different subscription than your cache if you use [managed identity](cache-managed-identity.md) as the authentication method. You need to select the subscription holding the storage account when you configure the import or export.

### Which permissions need to be granted to the storage account container shared access signature (SAS) token to allow export?

For export to an Azure Storage account to work successfully, the [shared access signature (SAS) token](/azure/storage/common/storage-sas-overview) must have the following permissions:
- `read`
- `add`
- `create`
- `write`
- `delete`
- `tag`
- `move`

## Related content

- [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
- [Quickstart: Azure Blob Storage client library for .NET](/azure/storage/blobs/storage-quickstart-blobs-dotnet)
