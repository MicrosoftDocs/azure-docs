---
title: Point-in-time restore for block blobs
titleSuffix: Azure Storage
description: Point-in-time restore for block blobs provides protection against accidental deletion or corruption by enabling you to restore a storage account to its previous state at a given point in time.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/06/2021
ms.author: tamram
ms.subservice: blobs
ms.custom: devx-track-azurepowershell
---

# Point-in-time restore for block blobs

Point-in-time restore provides protection against accidental deletion or corruption by enabling you to restore block blob data to an earlier state. Point-in-time restore is useful in scenarios where a user or application accidentally deletes data or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

Point-in-time restore is supported for general-purpose v2 storage accounts in the standard performance tier only. Only data in the hot and cool access tiers can be restored with point-in-time restore.

To learn how to enable point-in-time restore for a storage account, see [Perform a point-in-time restore on block blob data](point-in-time-restore-manage.md).

## How point-in-time restore works

To enable point-in-time restore, you create a management policy for the storage account and specify a retention period. During the retention period, you can restore block blobs from the present state to a state at a previous point in time.

To initiate a point-in-time restore, call the [Restore Blob Ranges](/rest/api/storagerp/storageaccounts/restoreblobranges) operation and specify a restore point in UTC time. You can specify lexicographical ranges of container and blob names to restore, or omit the range to restore all containers in the storage account. Up to 10 lexicographical ranges are supported per restore operation.

Azure Storage analyzes all changes that have been made to the specified blobs between the requested restore point, specified in UTC time, and the present moment. The restore operation is atomic, so it either succeeds completely in restoring all changes, or it fails. If there are any blobs that cannot be restored, then the operation fails, and read and write operations to the affected containers resume.

The following diagram shows how point-in-time restore works. One or more containers or blob ranges is restored to its state *n* days ago, where *n* is less than or equal to the retention period defined for point-in-time restore. The effect is to revert write and delete operations that happened during the retention period.

:::image type="content" source="media/point-in-time-restore-overview/point-in-time-restore-diagram.png" alt-text="Diagram showing how point-in-time restores containers to a previous state":::

Only one restore operation can be run on a storage account at a time. A restore operation cannot be canceled once it is in progress, but a second restore operation can be performed to undo the first operation.

The **Restore Blob Ranges** operation returns a restore ID that uniquely identifies the operation. To check the status of a point-in-time restore, call the **Get Restore Status** operation with the restore ID returned from the **Restore Blob Ranges** operation.

> [!IMPORTANT]
> When you perform a restore operation, Azure Storage blocks data operations on the blobs in the ranges being restored for the duration of the operation. Read, write, and delete operations are blocked in the primary location. For this reason, operations such as listing containers in the Azure portal may not perform as expected while the restore operation is underway.
>
> Read operations from the secondary location may proceed during the restore operation if the storage account is geo-replicated.

> [!CAUTION]
> Point-in-time restore supports restoring against operations that acted on block blobs only. Any operations that acted on containers cannot be restored. For example, if you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation, that container cannot be restored with a point-in-time restore operation. Rather than deleting an entire container, delete individual blobs if you may want to restore them later.

### Prerequisites for point-in-time restore

Point-in-time restore requires that the following Azure Storage features be enabled before you can enable point-in-time restore:

- [Soft delete](soft-delete-blob-overview.md)
- [Change feed](storage-blob-change-feed.md)
- [Blob versioning](versioning-overview.md)

Enabling these features may result in additional charges. Make sure that you understand the billing implications before enabling point-in-time restore and the prerequisite features.

### Retention period for point-in-time restore

When you enable point-in-time restore for a storage account, you specify a retention period. Block blobs in your storage account can be restored during the retention period.

The retention period begins a few minutes after you enable point-in-time restore. Keep in mind that you cannot restore blobs to a state prior to the beginning of the retention period. For example, if you enabled point-in-time restore on May 1st with a retention of 30 days, then on May 15th you can restore to a maximum of 15 days. On June 1st, you can restore data from between 1 and 30 days.

The retention period for point-in-time restore must be at least one day less than the retention period specified for soft delete. For example, if the soft delete retention period is set to 7 days, then the point-in-time restore retention period may be between 1 and 6 days.

> [!IMPORTANT]
> The time that it takes to restore a set of data is based on the number of write and delete operations made during the restore period. For example, an account with one million objects with 3,000 objects added per day and 1,000 objects deleted per day will require approximately two hours to restore to a point 30 days in the past. A retention period and restoration more than 90 days in the past would not be recommended for an account with this rate of change.

### Permissions for point-in-time restore

To initiate a restore operation, a client must have write permissions to all containers in the storage account. To grant permissions to authorize a restore operation with Azure Active Directory (Azure AD), assign the **Storage Account Contributor** role to the security principal at the level of the storage account, resource group, or subscription.

## Limitations and known issues

Point-in-time restore for block blobs has the following limitations and known issues:

- Only block blobs in a standard general-purpose v2 storage account can be restored as part of a point-in-time restore operation. Append blobs, page blobs, and premium block blobs are not restored.
- If you have deleted a container during the retention period, that container will not be restored with the point-in-time restore operation. If you attempt to restore a range of blobs that includes blobs in a deleted container, the point-in-time restore operation will fail. To learn about protecting containers from deletion, see [Soft delete for containers](soft-delete-container-overview.md).
- If a blob has moved between the hot and cool tiers in the period between the present moment and the restore point, the blob is restored to its previous tier. Restoring block blobs in the archive tier is not supported. For example, if a blob in the hot tier was moved to the archive tier two days ago, and a restore operation restores to a point three days ago, the blob is not restored to the hot tier. To restore an archived blob, first move it out of the archive tier. For more information, see [Rehydrate blob data from the archive tier](storage-blob-rehydration.md).
- If an immutability policy is configured, then a restore operation can be initiated, but any blobs that are protected by the immutability policy will not be modified. A restore operation in this case will not result in the restoration of a consistent state to the date and time given.
- A block that has been uploaded via [Put Block](/rest/api/storageservices/put-block) or [Put Block from URL](/rest/api/storageservices/put-block-from-url), but not committed via [Put Block List](/rest/api/storageservices/put-block-list), is not part of a blob and so is not restored as part of a restore operation.
- A blob with an active lease cannot be restored. If a blob with an active lease is included in the range of blobs to restore, the restore operation will fail atomically. Break any active leases prior to initiating the restore operation.
- Snapshots are not created or deleted as part of a restore operation. Only the base blob is restored to its previous state.
- Restoring Azure Data Lake Storage Gen2 flat and hierarchical namespaces is not supported.

> [!IMPORTANT]
> If you restore block blobs to a point that is earlier than September 22, 2020, preview limitations for point-in-time restore will be in effect. Microsoft recommends that you choose a restore point that is equal to or later than September 22, 2020 to take advantage of the generally available point-in-time restore feature.

## Pricing and billing

There is no charge to enable point-in-time restore. However, enabling point-in-time restore also enables blob versioning, soft delete, and change feed, each of which may result in additional charges.

Billing for point-in-time restore depends on the amount of data processed to perform the restore operation. The amount of data processed is based on the number of changes that occurred between the restore point and the present moment. For example, assuming a relatively constant rate of change to block blob data in a storage account, a restore operation that goes back in time 1 day would cost 1/10th of a restore that goes back in time 10 days.

To estimate the cost of a restore operation, review the change feed log to estimate the amount of data that was modified during the restore period. For example, if the retention period for change feed is 30 days, and the size of the change feed is 10 MB, then restoring to a point 10 days earlier would cost approximately one-third of the price listed for an LRS account in that region. Restoring to a point that is 27 days earlier would cost approximately nine-tenths of the price listed.

For more information about pricing for point-in-time restore, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Next steps

- [Perform a point-in-time restore on block blob data](point-in-time-restore-manage.md)
- [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
- [Enable soft delete for blobs](./soft-delete-blob-enable.md)
- [Enable and manage blob versioning](versioning-enable.md)
