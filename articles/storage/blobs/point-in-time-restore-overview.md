---
title: Point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: Point-in-time restore for block blobs provides protection against accidental deletion or corruption by enabling you to restore a storage account to its previous state at a given point in time.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/01/2020
ms.author: tamram
ms.subservice: blobs
---

# Point-in-time restore for block blobs (preview)

Point-in-time restore for block blobs provides protection against accidental deletion or corruption by enabling you to restore a storage account to its previous state at a given point in time. Point-in-time restore is useful in scenarios where a user or application accidentally deletes data or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

After you enable point-in-time restore for a storage account, you can restore one or more blob containers to their previous state at a specified point in time. To learn how to enable point-in-time restore, see [Enable and manage point-in-time restore for block blobs (preview)](point-in-time-restore-manage.md).

## About point-in-time restore

To enable point-in-time restore, you create a management policy for the storage account and specify a retention period. During the retention period, you can restore one or more containers to a previous state at a given point in time.

To initiate a point-in-time restore, call the [Restore Blob Ranges](/rest/api/storagerp/storageaccounts/restoreblobranges) operation and specify a restore point in UTC time. You can specify a lexicographical range of container and blob names to restore, or omit the range to restore all containers in the storage account. The **Restore Blob Ranges** operation returns a restore ID that uniquely identifies the operation.

When you request a restore operation, Azure Storage blocks read and write operations to the specified set of containers for the duration of the operation in the primary location, and also in the secondary location if the storage account is geo-replicated. (???is it granular enough to block subset of blobs in container, or does traffic blocking happen only at container level???) Azure Storage then analyzes the changes that have been made to the data between the requested restore point and the present moment. If there are any blobs that cannot be restored, the operation fails and traffic to the specified set of containers resumes. The restore operation is atomic, so it either succeeds completely in restoring all changes, or it fails.

When the restore operation begins, a system table named `$RestoreTable-{RestoreID}` is created in the storage account. This table is deleted when the restore operation completes successfully, or if it fails.

To check the status of a point-in-time restore, call the [Get Restore Status](???this is in the spec, but i don't see it in the SRP REST API) operation with the restore ID.

Only one restore operation can be run on a storage account at a time. A restore operation cannot be canceled once it is in progress, but a second restore operation can be performed to undo the first operation.

### Prerequisites for point-in-time restore

Point-in-time restore requires that the following Azure Storage features are enabled:

- [Soft delete](soft-delete-overview.md)
- [Change feed (preview)](storage-blob-change-feed.md)
- [Blob versioning (preview)](versioning-overview.md)

Enable these features for the storage account before you enable point-in-time restore. Be sure to register for the change feed preview before you enable it.

### Permissions for point-in-time restore

To initiate a restore operation, a client must have write permissions to all containers in the storage account. To grant permissions to authorize a restore operation with Azure Active Directory (Azure AD), assign the **Storage Blob Data Contributor** role to the security principal at the level of the storage account, resource group, or subscription. ???or could be granted perms scoped to every container - is that a realistic scenario???

### Retention period for point-in-time restore

When you enable point-in-time restore for a storage account, you specify a retention period. Block blobs in your storage account can be restored during the retention period.

The retention period begins when you enable point-in-time restore. Keep in mind that you cannot restore containers and blobs to a state that they were in prior to the beginning of the retention period. For example, if you enabled point-in-time restore on May 1st with a retention of 30 days, then on May 15th you can restore to a maximum of 15 days. On June 1st, you can restore data from between 1 and 30 days.

The retention period for point-in-time restore must be greater than (or equal to???) the retention period specified for soft delete and change feed.

### Supported operations

Point-in-time restore will restore data affected by the following operations on block blobs, if these operations have been called during the interval between the restore point and the present moment:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Set Blob Properties](/rest/api/storageservices/set-blob-properties)
- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)
- [Delete Blob](/rest/api/storageservices/delete-blob)
- [Undelete Blob](/rest/api/storageservices/undelete-blob)

The following operations are not restored:

- [Put Block](/rest/api/storageservices/put-block): A block that has been uploaded but not committed is not part of a blob and so is not restored.
- [Put Block from URL](/rest/api/storageservices/put-block-from-url): A block that has been uploaded but not committed is not part of a blob and so is not restored.
- [Lease Blob](/rest/api/storageservices/lease-blob): A blob with an active lease cannot be restored.???or is it the lease that cannot be restored??? ???Does this cause atomic failure???
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob): Snapshots are not created or deleted as part of a restore operation. ???accurate way to put it???
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier): If the tier of a blob has been changed between the present moment and the restore point, the restore operation will fail. ???true???

Point-in-time restore supports only operations on block blobs. Operations on containers cannot be restored.

> [!CAUTION]
> If you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation during the point-in-time restore preview, that container is not restored when you initiate a restore operation. During the preview, be careful to delete individual blobs only if you may want to restore them. Avoid deleting blobs by deleting their parent container.

## About the preview

The point-in-time restore preview is available in the West Central US region. Point-in-time restore is supported for general-purpose v2 storage accounts only. Only data in the hot and cool access tiers can be restored with point-in-time restore.

The preview includes the following limitations:

- Restoring premium block blobs is not supported.
- Restoring blobs in the archive tier is not supported. For example, if a blob in the hot tier was moved to the archive tier two days ago, and a restore operation restores to a point three days ago, the blob is not restored to the hot tier.
- Restoring Azure Data Lake Storage Gen2 flat and hierarchical namespaces is not supported.
- Restoring storage accounts using customer-provided keys is not supported.

> [!IMPORTANT]
> The point-in-time restore preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

### Register for the preview

To register for the preview, run the following commands from Azure PowerShell:

```powershell
# Register for the point-in-time restore preview
Register-AzProviderFeature -FeatureName RestoreBlobRanges -ProviderNamespace Microsoft.Storage

# Register for change feed (preview)
Register-AzProviderFeature -FeatureName Changefeed -ProviderNamespace Microsoft.Storage

# Refresh the Azure Storage provider namespace
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

### Check registration status

To check the status of your registration, run the following commands:

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName RestoreBlobRanges

Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Changefeed
```

## Next steps

- [Enable and manage point-in-time restore for block blobs (preview)](point-in-time-restore-manage.md)
- [Change feed support in Azure Blob Storage (Preview)](storage-blob-change-feed.md)
- [Enable soft delete for blobs](soft-delete-enable.md)
- [Enable and manage blob versioning](versioning-enable.md)
