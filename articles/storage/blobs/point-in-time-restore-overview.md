---
title: Point-in-time restore for block blobs
titleSuffix: Azure Storage
description: Point-in-time restore for block blobs provides protection against accidental deletion or corruption by enabling you to restore a storage account to its previous state at a given point in time.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/21/2023
ms.author: normesta
---

# Point-in-time restore for block blobs

Point-in-time restore provides protection against accidental deletion or corruption by enabling you to restore block blob data to an earlier state. Point-in-time restore is useful in scenarios where a user or application accidentally deletes data or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

Point-in-time restore is supported for general-purpose v2 storage accounts in the standard performance tier only. Only data in the hot and cool access tiers can be restored with point-in-time restore.

To learn how to enable point-in-time restore for a storage account, see [Perform a point-in-time restore on block blob data](point-in-time-restore-manage.md).

## How point-in-time restore works

To enable point-in-time restore, you create a management policy for the storage account and specify a retention period. During the retention period, you can restore block blobs from the present state to a state at a previous point in time.

To initiate a point-in-time restore, call the [Restore Blob Ranges](/rest/api/storagerp/storageaccounts/restoreblobranges) operation and specify a restore point in UTC time. You can specify lexicographical ranges of container and blob names to restore, or omit the range to restore all containers in the storage account. Up to 10 lexicographical ranges are supported per restore operation.

Azure Storage analyzes all changes that have been made to the specified blobs between the requested restore point, specified in UTC time, and the present moment. The restore operation is atomic, so it either succeeds completely in restoring all changes, or it fails. If there are any blobs that can't be restored, then the operation fails, and read and write operations to the affected containers resume.

The following diagram shows how point-in-time restore works. One or more containers or blob ranges is restored to its state *n* days ago, where *n* is less than or equal to the retention period defined for point-in-time restore. The effect is to revert write and delete operations that happened during the retention period.

:::image type="content" source="media/point-in-time-restore-overview/point-in-time-restore-diagram.png" alt-text="Diagram showing how point-in-time restores containers to a previous state":::

Only one restore operation can be run on a storage account at a time. A restore operation can't be canceled once it is in progress, but a second restore operation can be performed to undo the first operation.

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

To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

> [!CAUTION]
> After you enable blob versioning for a storage account, every write operation to a blob in that account results in the creation of a new version. For this reason, enabling blob versioning may result in additional costs. To minimize costs, use a lifecycle management policy to automatically delete old versions. For more information about lifecycle management, see [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md).

### Retention period for point-in-time restore

When you enable point-in-time restore for a storage account, you specify a retention period. Block blobs in your storage account can be restored during the retention period.

The retention period begins a few minutes after you enable point-in-time restore. Keep in mind that you can't restore blobs to a state prior to the beginning of the retention period. For example, if you enabled point-in-time restore on May 1 with a retention of 30 days, then on May 15 you can restore to a maximum of 15 days. On June 1, you can restore data from between 1 and 30 days.

The retention period for point-in-time restore must be at least one day less than the retention period specified for soft delete. For example, if the soft delete retention period is set to seven days, then the point-in-time restore retention period may be between 1 and 6 days.

> [!NOTE]
> The retention period that you specify for point-in-time restore has no effect on the retention of blob versions. Blob versions are retained until they are explicitly deleted. To optimize costs by deleting or tiering older versions, create a lifecycle management policy. For more information, see [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md).

The time that it takes to restore a set of data is based on the number of write and delete operations made during the restore period. For example, an account with one million blobs with 3,000 blobs added per day and 1,000 blobs deleted per day requires approximately two hours to restore to a point 30 days in the past. A retention period and restoration more than 90 days in the past wouldn't be recommended for an account with this rate of change.

### Permissions for point-in-time restore

To initiate a restore operation, a client must have write permissions to all containers in the storage account. To grant permissions to authorize a restore operation with Microsoft Entra ID, assign the **Storage Account Contributor** role to the security principal at the level of the storage account, resource group, or subscription.

## Limitations and known issues

Point-in-time restore for block blobs has the following limitations and known issues:

- Only block blobs in a standard general-purpose v2 storage account can be restored as part of a point-in-time restore operation. Append blobs, page blobs, and premium block blobs aren't restored.
- If you have deleted a container during the retention period, that container won't be restored with the point-in-time restore operation. If you attempt to restore a range of blobs that includes blobs in a deleted container, the point-in-time restore operation fails. To learn about protecting containers from deletion, see [Soft delete for containers](soft-delete-container-overview.md).
- If you use permanent delete to purge soft-deleted versions of a blob during the point-in-time restore retention period, then a restore operation may not be able to restore that blob correctly.
- If a blob has moved between the hot and cool tiers in the period between the present moment and the restore point, the blob is restored to its previous tier.
- Restoring block blobs in the archive tier isn't supported. For example, if a blob in the hot tier was moved to the archive tier two days ago, and a restore operation restores to a point three days ago, the blob isn't restored to the hot tier. To restore an archived blob, first move it out of the archive tier. For more information, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md).
- Partial restore operations aren't supported. Therefore, if a container has archived blobs in it, the entire restore operation fails because restoring block blobs in the archive tier isn't supported.
- If an immutability policy is configured, then a restore operation can be initiated, but any blobs that are protected by the immutability policy won't be modified. A restore operation in this case won't result in the restoration of a consistent state to the date and time given.
- A block that has been uploaded via [Put Block](/rest/api/storageservices/put-block) or [Put Block from URL](/rest/api/storageservices/put-block-from-url), but not committed via [Put Block List](/rest/api/storageservices/put-block-list), isn't part of a blob and so isn't restored as part of a restore operation.
- If a blob with an active lease is included in the range to restore, and if the current version of the leased blob is different from the previous version at the timestamp provided for PITR, the restore operation fails atomically. We recommend breaking any active leases before initiating the restore operation.
- Performing a customer-managed failover on a storage account resets the earliest possible restore point for the storage account. For more details, see [Point-in-time restore](../common/storage-disaster-recovery-guidance.md#point-in-time-restore-inconsistencies).
- Snapshots aren't created or deleted as part of a restore operation. Only the base blob is restored to its previous state.
- Point-in-time restore isn't supported for hierarchical namespaces or operations via Azure Data Lake Storage Gen2.
- Point-in-time restore isn't supported when the storage account's **AllowedCopyScope** property is set to restrict copy scope to the same Microsoft Entra tenant or virtual network. For more information, see [About Permitted scope for copy operations (preview)](../common/security-restrict-copy-operations.md?toc=/azure/storage/blobs/toc.json&tabs=portal#about-permitted-scope-for-copy-operations-preview).
- Point-in-time restore isn't supported when version-level immutability is enabled on a storage account or a container in an account. For more information on version-level immutability, see [Overview of immutable storage for blob data](immutable-storage-overview.md#version-level-scope).

> [!IMPORTANT]
> If you restore block blobs to a point that is earlier than September 22, 2020, preview limitations for point-in-time restore will be in effect. Microsoft recommends that you choose a restore point that is equal to or later than September 22, 2020 to take advantage of the generally available point-in-time restore feature.

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Pricing and billing

There's no charge to enable point-in-time restore. However, enabling point-in-time restore also enables blob versioning, soft delete, and change feed, each of which may result in additional charges.

Billing for performing point-in-time restore operations is based on the amount of change feed data processed for the restore. You're also billed for any storage transactions involved in the restore process. 

For more information about pricing for point-in-time restore, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Next steps

- [Perform a point-in-time restore on block blob data](point-in-time-restore-manage.md)
- [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
- [Enable soft delete for blobs](soft-delete-blob-enable.md)
- [Enable and manage blob versioning](versioning-enable.md)
