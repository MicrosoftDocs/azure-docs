---
title: Point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/01/2020
ms.author: tamram
ms.subservice: blobs
---

# Point-in-time restore for block blobs (preview)

Point-in-time restore for block blobs provides protection for your data against accidental deletion or corruption by enabling you to restore a storage account to its previous state at a given point in time. Point-in-time restore is useful in scenarios where a user or application accidentally deletes data or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

After you enable point-in-time restore for a storage account, you can restore one or more blob containers to their previous state at a specified point in time.

## How point-in-time restore works/about PITR

To enable point-in-time restore, you create a management policy for the storage account and specify a retention period. During the retention period, you can restore the storage account, or a set of containers in the account, to a previous state.

To initiate a point-in-time restore, call the [Restore Blob Ranges](/rest/api/storagerp/storageaccounts/restoreblobranges) operation. When you request a restore operation, Azure Storage blocks read and write operations to the storage account (or set of containers???) for the duration of the operation. Azure Storage analyzes the changes that have been made to the data from the present moment to the requested restore point. If there are any blobs that cannot be restored, the operation fails and traffic to the storage account (or set of containers???) resumes. The restore operation is atomic, so it either succeeds completely in restoring all changes, or it fails.

To check the status of a point-in-time restore, call the [Get Restore Status](???this is in the spec, but not in the SRP REST API) operation.

Only one restore operation can be run on a storage account at a time.

### Requirements for point-in-time restore

Point-in-time restore requires that the following Azure Storage features are enabled:

- [Soft delete](blobs/soft-delete-overview.md).
- [Change feed (preview)](blobs/storage-blob-change-feed.md)
- [Blob versioning (preview)](blobs/versioning-overview.md).

Enable these features for the storage account before you enable point-in-time restore (???spec says that they should be enabled automatically, but i haven't seen this).

### Retention period for point-in-time restore

When you enable point-in-time restore for a storage account, you specify a retention period. Block blobs in your storage account can be restored during the retention period.

The retention period begins when you enable point-in-time restore, and you cannot restore data to a state prior to the beginning of the retention period. For example, if you enabled point-in-time restore on May 1st with a retention of 30 days, then on May 15th you can restore to a maximum of 15 days. As of June 1st, you can restore data from between 1 and 30 days.

The retention period for point-in-time restore must be greater than the retention period specified for soft delete and change feed.

### Supported operations

Point-in-time restore will restore the following operations on block blobs, if they have been called during the period between the present moment and the restore point:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Set Blob Properties](/rest/api/storageservices/set-blob-properties)
- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)
- [Delete Blob](/rest/api/storageservices/delete-blob)
- [Undelete Blob](/rest/api/storageservices/undelete-blob)

The following operations are not supported:

- [Put Block](/rest/api/storageservices/put-block): A block that has been uploaded but not committed is not part of a blob and so is not restored.
- [Put Block from URL](/rest/api/storageservices/put-block-from-url): A block that has been uploaded but not committed is not part of a blob and so is not restored.
- [Lease Blob](/rest/api/storageservices/lease-blob): A blob with an active lease cannot be restored. ???Does this cause atomic failure???
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob): Snapshots are not created or deleted as part of a restore operation. ???accurate way to put it???
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier): If the tier of a blob has been changed between the present moment and the restore point, the restore operation will fail. ???true???

Point-in-time restore supports only operations on blobs. Operations on containers cannot be restored.

> [!CAUTION]
> If you delete a container from the storage account during the point-in-time restore preview, the container is not restored when you initiate a restore operation. During the preview, be careful to delete individual blobs only in containers where you may want to restore data.

## About the preview

The point-in-time restore preview is available in the West Central US region. Point-in-time restore is supported for general-purpose v2 storage accounts configured for locally redundant storage (LRS) or geo-redundant storage (GRS) only???. Only data in the hot and cool access tiers can be restored with point-in-time restore.

Not supported:

- Premium block blobs are not supported.
- Restoring data in the archive tier is not supported.
- Azure Data Lake Storage Gen2 flat and hierarchical namespaces are not supported.

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

To check the status of your registration, run the following commands:

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName RestoreBlobRanges

Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Changefeed
```

## Next steps
