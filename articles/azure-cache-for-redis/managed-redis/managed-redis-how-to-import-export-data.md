---
title: Import and Export data in Azure Managed Redis
description: Learn how to import and export data to and from blob storage with your Azure Managed Redis instances


ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---
# Import and Export data in Azure Managed Redis (preview)

Use the import and export functionality in Azure Managed Redis (preview) as a data management operation. You import data into your cache instance or export data from a cache instance using a Redis Database (RDB) snapshot. The snapshots are imported or exported using a blob in an Azure Storage Account.

- _Export_ - you can export your Azure Managed Redis RDB snapshots to a Block Blob.
- _Import_ - you can import your Azure Managed Redis RDB snapshots from either a Page Blob or a Block Blob.

You can use Import/Export to migrate between different Azure Managed Redis instances or populate the cache with data before use. You can also export data from an older Azure Cache for Redis instance to migrate data to an Azure Managed Redis instance.

This article provides a guide for importing and exporting data with Azure Managed Redis and provides the answers to commonly asked questions.

## Scope of availability

|Tier     | Memory Optimized, Balanced, Compute Optimized  |Flash Optimized  |
|---------|---------|---------|
|Available  | Yes     |  Yes  |

## Compatibility

- Data is exported as a .gz block blob.
- Instances running Redis 7.2 support RDB version 11 and below.
- Exported backups from newer versions of Redis (for example, Redis 7.2) can't be imported into older versions of Redis (for example, Redis 6.0)
- RDB files from _Premium_ tier Azure Cache for Redis instances can be imported into Azure Managed Redis, but not vice-versa.
- RDB files from _Enterprise_ or _Enterprise Flash_ tier Azure Cache for Redis instances can be imported into Azure Managed Redis. RDB files from Azure Managed Redis can be imported back into these tiers if the Enterprise tier cache is running the same Redis version (e.g. Redis 7.2) 

## Import

Use import to bring Redis compatible RDB files from any Redis server running in any cloud or environment, including Redis running on Linux, Windows, or any cloud provider such as Amazon Web Services and others. Importing data is an easy way to create a cache with prepopulated data. During the import process, Azure Managed Redis loads the RDB files from Azure storage into memory and then inserts the keys into the cache.

> [!NOTE]
> Before beginning the import operation, ensure that your Redis Database (RDB) file or files are uploaded into page or block blobs in Azure storage, in the same region and subscription as your Azure Managed Redis instance. If you are using managed identity for authentication, the storage account can be in a different subscription. For more information, see [Get started with Azure Blob storage](/azure/storage/blobs/storage-quickstart-blobs-dotnet). If you exported your RDB file using the [Azure Cache for Redis Export](#export) feature, your RDB file is already stored in a block blob and is ready for importing.

1. To import one or more exported cache blobs, [browse to your cache](managed-redis-configure.md#configure-azure-managed-redis-settings) in the Azure portal and select **Import data** from the **Resource menu**. In the working pane, you see **Choose Blob(s)** where you can find RDB files.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-data.png" alt-text="Screenshot showing Import data selected in the Resource menu.":::

2. Select **Choose Blob(s)** and select the storage account that contains the data to import.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-choose-storage-account.png" alt-text="Screenshot showing a list of storage accounts.":::

3. Select the container that contains the data to import.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-choose-container.png" alt-text="Screenshot showing list of containers from the previously chosen storage account.":::

4. Select one or more blobs to import by selecting the area to the left of the blob name, and then **Select**.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-choose-blobs.png" alt-text="Screenshot showing a blob from the container. ":::

5. Select **Import** to begin the import process.

   > [!IMPORTANT]
   > The cache is not accessible by cache clients during the import process, and any existing data in the cache is deleted.
   >

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-blobs.png" alt-text="Screenshot showing the Import button to select to begin the import.":::

    You can monitor the progress of the import operation by following the notifications from the Azure portal, or by viewing the events in the [activity log](/azure/azure-monitor/essentials/activity-log).

    > [!IMPORTANT]
    > Activity log support is not yet available in Azure Managed Redis.
    >

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-import-data-import-complete.png" alt-text="Screenshot showing the import progress in the notifications area.":::

## Export

Export allows you to export the data stored in Azure Managed Redis. You can use this feature to move data from one Azure Managed Redis instance to another or to another Redis server. During the export process, a temporary file is created on the VM that hosts the Azure Managed Redis server instance. Then, the file is uploaded to the chosen storage account. When the export operation completes with either a status of success or failure, the temporary file is deleted.

1. To export the current contents of the cache to storage, [browse to your cache](managed-redis-configure.md#configure-azure-managed-redis-settings) in the Azure portal and select **Export data** from the **Resource menu**. You see **Choose Storage Container** in the working pane.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-export-data-choose-storage-container.png" alt-text="Screenshot showing Export data selected in the Resource menu":::

2. Select **Choose Storage Container** and to display a list of available storage accounts. Select the storage account you want. The storage account must be in the same region as your cache. If you're using managed identity for authentication, the storage account can be in a different subscription. Otherwise, the storage account must be in the same subscription as your cache.

   > [!IMPORTANT]
   >
   > If your cache data export to Firewall-enabled storage accounts fails, refer to [What if I have firewall enabled on my storage account?](#what-if-i-have-firewall-enabled-on-my-storage-account)
   >
   > For more information, see [Azure storage account overview](/azure/storage/common/storage-account-overview).
   >

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-export-data-choose-account.png" alt-text="Screenshot showing a list of containers in the working pane.":::

3. Choose the storage container you want to hold your export, then **Select**. If you want a new container, select **Add Container** to add it first, and then select it from the list.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-export-data-container.png" alt-text="Screenshot of a list of containers with one highlighted and a select button.":::

4. Type a **Blob name prefix** and select **Export** to start the export process. The blob name prefix is used to prefix the names of files generated by this export operation.

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-export-data.png" alt-text="Screenshot showing a blob name prefix and an Export button.":::

    You can monitor the progress of the export operation by following the notifications from the Azure portal, or by viewing the events in the [audit log](/azure/azure-monitor/essentials/activity-log).

    :::image type="content" source="media/managed-redis-how-to-import-export-data/managed-redis-export-data-export-complete.png" alt-text="Screenshot showing the export progress in the notifications area.":::

    Caches remain available for use during the export process.

## Import/Export FAQ

This section contains frequently asked questions about the Import/Export feature.

- [Which tiers support Import/Export?](#which-tiers-support-importexport)
- [Can I import data from any Redis server?](#can-i-import-data-from-any-redis-server)
- [What RDB versions can I import?](#what-rdb-versions-can-i-import)
- [Is my cache available during an Import/Export operation?](#is-my-cache-available-during-an-importexport-operation)
- [How is Import/Export different from Redis persistence?](#how-is-importexport-different-from-redis-persistence)
- [Can I automate Import/Export using PowerShell, CLI, or other management clients?](#can-i-automate-importexport-using-powershell-cli-or-other-management-clients)
- [I received a timeout error during my Import/Export operation. What does it mean?](#i-received-a-timeout-error-during-my-importexport-operation-what-does-it-mean)
- [I got an error when exporting my data to Azure Blob Storage. What happened?](#i-got-an-error-when-exporting-my-data-to-azure-blob-storage-what-happened)
- [What if I have firewall enabled on my storage account?](#what-if-i-have-firewall-enabled-on-my-storage-account)
- [Can I import or export data from a storage account in a different subscription than my cache?](#can-i-import-or-export-data-from-a-storage-account-in-a-different-subscription-than-my-cache)
- [Which permissions need to be granted to the storage account container shared access signature (SAS) token to allow export?](#which-permissions-need-to-be-granted-to-the-storage-account-container-shared-access-signature-sas-token-to-allow-export)

### Which tiers support Import/Export?

The _import_ and _export_ features are available in all tiers of Azure Managed Redis.

### Can I import data from any Redis server?

Yes, you can import data that was exported from Azure Managed Redis instances or from any Redis server running in any cloud or environment. The environments include Linux, Windows, or cloud providers such as Amazon Web Services. To import this data, upload the RDB file from the Redis server you want into a page or block blob in an Azure Storage Account. Then, import it into your Azure Managed Redis instance.

For example, you might want to:

1. Export the data from your production cache.

1. Then, import it into a cache that is used as part of a staging environment for testing or migration.

> [!IMPORTANT]
> To successfully import data exported from Redis servers other than Azure Managed Redis when using a page blob, the page blob size must be aligned on a 512 byte boundary. For sample code to perform any required byte padding, see [Sample page blob upload](https://github.com/JimRoberts-MS/SamplePageBlobUpload).
>

### What RDB versions can I import?

For more information on supported RDB versions used with import, see the [compatibility section](#compatibility).

### Is my cache available during an Import/Export operation?

- **Export** - Caches remain available and you can continue to use your cache during an export operation.
- **Import** - Caches become unavailable when an import operation starts, and become available for use when the import operation completes.

### How is Import/Export different from Redis persistence?

The Azure Managed Redis [persistence feature](managed-redis-how-to-persistence.md) is primarily a data durability feature. Conversely, the _import/export_ functionality is designed as a method to make periodic data backups for point-in-time recovery.

When _persistence_ is configured, your cache persists a snapshot of the data to disk, based on a configurable backup frequency. This persistence file is not accessible by the user. If a catastrophic event occurs that disables both the primary and the replica caches, the cache data is restored automatically using the most recent snapshot.

Data persistence is designed for disaster recovery. It isn't intended as a point-in-time recovery mechanism.

If you want to make periodic data backups for point-in-time recovery, we recommend using the _import/export_ functionality. For more information, see [How to configure data persistence for Azure Managed Redis](managed-redis-how-to-persistence.md).

### Can I automate Import/Export using PowerShell, CLI, or other management clients?

Yes, see the following instructions:

- PowerShell instructions [to import Redis data](/powershell/module/az.redisenterprisecache/import-azredisenterprisecache) and [to export Redis data](/powershell/module/az.redisenterprisecache/export-azredisenterprisecache).
- Azure CLI instructions to [import Redis data](/cli/azure/redisenterprise/database#az-redisenterprise-database-import) and [export Redis data](/cli/azure/redisenterprise/database#az-redisenterprise-database-export)

### I received a timeout error during my Import/Export operation. What does it mean?

If you remain on **Import data** or **Export data** for longer than 15 minutes before starting the operation, you receive an error with an error message similar to the following example:

```azcopy
The request to import data into cache 'contoso55' failed with status 'error' and error 'One of the SAS URIs provided could not be used for the following reason: The SAS token end time (se) must be at least 1 hour from now and the start time (st), if given, must be at least 15 minutes in the past.
```

To resolve this error, start the import or export operation before 15 minutes has elapsed.

### I got an error when exporting my data to Azure Blob Storage. What happened?

Export works only with RDB files stored as block blobs. Other blob types aren't currently supported. For more information, see [Azure storage account overview](/azure/storage/common/storage-account-overview). If you're using an access key to authenticate a storage account, having firewall exceptions on the storage account tends to cause the import/export process to fail.

### What if I have firewall enabled on my storage account?

You need to check “Allow Azure services on the trusted services list to access this storage account” in your storage account settings. Then, use managed identity (System or User assigned) and provision Storage Blob Data Contributor RBAC role for that object ID.

For more information, see [managed identity for storage accounts - Azure Cache for Redis](../cache-managed-identity.md)

### Can I import or export data from a storage account in a different subscription than my cache?

You can import and export data from a storage account in a different subscription than your cache, but you must use [managed identity](../cache-managed-identity.md) as the authentication method. You will need to select the chosen subscription holding the storage account when configuring the import or export.

### Which permissions need to be granted to the storage account container shared access signature (SAS) token to allow export?
In order for export to an Azure storage account to work successfully, the [shared access signature (SAS) token](/azure/storage/common/storage-sas-overview) must have the following permissions:
- `read`
- `add`
- `create`
- `write`
- `delete`
- `tag`
- `move`

## Next steps

- [Azure Managed Redis service tiers](managed-redis-overview.md#choosing-the-right-tier)
