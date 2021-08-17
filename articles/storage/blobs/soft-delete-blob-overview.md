---
title: Soft delete for blobs
titleSuffix: Azure Storage 
description: Soft delete for blobs protects your data so that you can more easily recover your data when it is erroneously modified or deleted by an application or by another storage account user.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/23/2021
ms.author: tamram
ms.subservice: blobs
---

# Soft delete for blobs

Blob soft delete protects an individual blob, snapshot, or version from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore a soft-deleted object to its state at the time it was deleted. After the retention period has expired, the object is permanently deleted.

> [!IMPORTANT]
> Soft delete in accounts that have the hierarchical namespace feature enabled is currently in PREVIEW, and is available globally in all Azure regions.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
>
> To enroll in the preview, see [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4mEEwKhLjlBjU3ziDwLH-pUOVRVOUpDRUtHVUtDUUtMVTZUR0tUMjZWNy4u).


## Recommended data protection configuration

Blob soft delete is part of a comprehensive data protection strategy for blob data. For optimal protection for your blob data, Microsoft recommends enabling all of the following data protection features:

- Container soft delete, to restore a container that has been deleted. To learn how to enable container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md).
- Blob versioning, to automatically maintain previous versions of a blob. When blob versioning is enabled, you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).
- Blob soft delete, to restore a blob, snapshot, or version that has been deleted. To learn how to enable blob soft delete, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md).

To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

## How blob soft delete works

When you enable blob soft delete for a storage account, you specify a retention period for deleted objects of between 1 and 365 days. The retention period indicates how long the data remains available after it is deleted or overwritten. The clock starts on the retention period as soon as an object is deleted or overwritten.

While the retention period is active, you can restore a deleted blob, together with its snapshots, or a deleted version by calling the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation. The following diagram shows how a deleted object can be restored when blob soft delete is enabled:

:::image type="content" source="media/soft-delete-blob-overview/blob-soft-delete-diagram.png" alt-text="Diagram showing how a soft-deleted blob may be restored":::

You can change the soft delete retention period at any time. An updated retention period applies only to data that was deleted after the retention period was changed. Any data that was deleted before the retention period was changed is subject to the retention period that was in effect when it was deleted.

Attempting to delete a soft-deleted object does not affect its expiry time.

If you disable blob soft delete, you can continue to access and recover soft-deleted objects in your storage account until the soft delete retention period has elapsed.

Blob versioning is available for general-purpose v2, block blob, and Blob storage accounts. Storage accounts with a hierarchical namespace aren't currently supported.

Version 2017-07-29 and higher of the Azure Storage REST API support blob soft delete.

> [!IMPORTANT]
> You can use blob soft delete only to restore an individual blob, snapshot, directory (in a hierarchical namespace) or version. To restore a container and its contents, container soft delete must also be enabled for the storage account. Microsoft recommends enabling container soft delete and blob versioning together with blob soft delete to ensure complete protection for blob data. For more information, see [Data protection overview](data-protection-overview.md).
>
> Blob soft delete does not protect against the deletion of a storage account. To protect a storage account from deletion, configure a lock on the storage account resource. For more information about locking a storage account, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

### How deletions are handled when soft delete is enabled

When blob soft delete is enabled, deleting a blob marks that blob as soft-deleted. No snapshot is created. When the retention period expires, the soft-deleted blob is permanently deleted.

If a blob has snapshots, the blob cannot be deleted unless the snapshots are also deleted. When you delete a blob and its snapshots, both the blob and snapshots are marked as soft-deleted. No new snapshots are created.

You can also delete one or more active snapshots without deleting the base blob. In this case, the snapshot is soft-deleted.

If a directory is deleted in an account that has the hierarchical namespace feature enabled on it, the directory and all its contents are marked as soft-deleted. 

Soft-deleted objects are invisible unless they are explicitly displayed or listed. For more information about how to list soft-deleted objects, see [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md).

### How overwrites are handled when soft delete is enabled

>[!IMPORTANT]
> This section doesn't apply to accounts that have a hierarchical namespace.

Calling an operation such as [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), or [Copy Blob](/rest/api/storageservices/copy-blob) overwrites the data in a blob. When blob soft delete is enabled, overwriting a blob automatically creates a soft-deleted snapshot of the blob's state prior to the write operation. When the retention period expires, the soft-deleted snapshot is permanently deleted.

Soft-deleted snapshots are invisible unless soft-deleted objects are explicitly displayed or listed. For more information about how to list soft-deleted objects, see [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md).

To protect a copy operation, blob soft delete must be enabled for the destination storage account.

Blob soft delete does not protect against operations to write blob metadata or properties. No soft-deleted snapshot is created when a blob's metadata or properties are updated.

Blob soft delete does not afford overwrite protection for blobs in the archive tier. If a blob in the archive tier is overwritten with a new blob in any tier, then the overwritten blob is permanently deleted.

For premium storage accounts, soft-deleted snapshots do not count toward the per-blob limit of 100 snapshots.

### Restoring soft-deleted objects

You can restore soft-deleted blobs or directories (in a hierarchical namespace) by calling the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation within the retention period. The **Undelete Blob** operation restores a blob and any soft-deleted snapshots associated with it. Any snapshots that were deleted during the retention period are restored.

In accounts that have a hierarchical namespace, the **Undelete Blob** operation can also be used to restore a soft-deleted directory and all its contents. If you rename a directory that contains soft deleted blobs, those soft deleted blobs become disconnected from the directory. If you want to restore those blobs, you'll have to revert the name of the directory back to it's original name or create a separate directory that uses the original directory name. Otherwise, you'll receive an error when you attempt to restore those soft deleted blobs.

Calling **Undelete Blob** on a blob that is not soft-deleted will restore any soft-deleted snapshots that are associated with the blob. If the blob has no snapshots and is not soft-deleted, then calling **Undelete Blob** has no effect.

To promote a soft-deleted snapshot to the base blob, first call **Undelete Blob** on the base blob to restore the blob and its snapshots. Next, copy the desired snapshot over the base blob. You can also copy the snapshot to a new blob.

Data in a soft-deleted blob or snapshot cannot be read until the object has been restored.

For more information on how to restore soft-deleted objects, see [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md).

## Blob soft delete and versioning

>[!IMPORTANT]
> Versioning is not supported for accounts that have a hierarchical namespace.

If blob versioning and blob soft delete are both enabled for a storage account, then overwriting a blob automatically creates a new version. The new version is not soft-deleted and is not removed when the soft-delete retention period expires. No soft-deleted snapshots are created. When you delete a blob, the current version of the blob becomes a previous version, and there is no longer a current version. No new version is created and no soft-deleted snapshots are created.

Enabling soft delete and versioning together protects blob versions from deletion. When soft delete is enabled, deleting a version creates a soft-deleted version. You can use the **Undelete Blob** operation to restore soft-deleted versions during the soft delete retention period. The **Undelete Blob** operation always restores all soft-deleted versions of the blob. It is not possible to restore only a single soft-deleted version.

After the soft-delete retention period has elapsed, any soft-deleted blob versions are permanently deleted.

> [!NOTE]
> Calling the **Undelete Blob** operation on a deleted blob when versioning is enabled restores any soft-deleted versions or snapshots, but does not restore the current version. To restore the current version, promote a previous version by copying it to the current version.

Microsoft recommends enabling both versioning and blob soft delete for your storage accounts for optimal data protection. For more information about using blob versioning and soft delete together, see [Blob versioning and soft delete](versioning-overview.md#blob-versioning-and-soft-delete).

## Blob soft delete protection by operation

The following table describes the expected behavior for delete and write operations when blob soft delete is enabled, either with or without blob versioning. 

### Storage account (no hierarchical namespace)

| REST API operations | Soft delete enabled | Soft delete and versioning enabled |
|--|--|--|
| [Delete Storage Account](/rest/api/storagerp/storageaccounts/delete) | No change. Containers and blobs in the deleted account are not recoverable. | No change. Containers and blobs in the deleted account are not recoverable. |
| [Delete Container](/rest/api/storageservices/delete-container) | No change. Blobs in the deleted container are not recoverable. | No change. Blobs in the deleted container are not recoverable. |
| [Delete Blob](/rest/api/storageservices/delete-blob) | If used to delete a blob, that blob is marked as soft deleted. <br /><br /> If used to delete a blob snapshot, the snapshot is marked as soft deleted. | If used to delete a blob, the current version becomes a previous version, and the current version is deleted. No new version is created and no soft-deleted snapshots are created.<br /><br /> If used to delete a blob version, the version is marked as soft deleted. |
| [Undelete Blob](/rest/api/storageservices/undelete-blob) | Restores a blob and any snapshots that were deleted within the retention period. | Restores a blob and any versions that were deleted within the retention period. |
| [Put Blob](/rest/api/storageservices/put-blob)<br />[Put Block List](/rest/api/storageservices/put-block-list)<br />[Copy Blob](/rest/api/storageservices/copy-blob)<br />[Copy Blob from URL](/rest/api/storageservices/copy-blob) | If called on an active blob, then a snapshot of the blob's state prior to the operation is automatically generated. <br /><br /> If called on a soft-deleted blob, then a snapshot of the blob's prior state is generated only if it is being replaced by a blob of the same type. If the blob is of a different type, then all existing soft deleted data is permanently deleted. | A new version that captures the blob's state prior to the operation is automatically generated. |
| [Put Block](/rest/api/storageservices/put-block) | If used to commit a block to an active blob, there is no change.<br /><br />If used to commit a block to a blob that is soft-deleted, a new blob is created and a snapshot is automatically generated to capture the state of the soft-deleted blob. | No change. |
| [Put Page](/rest/api/storageservices/put-page)<br />[Put Page from URL](/rest/api/storageservices/put-page-from-url) | No change. Page blob data that is overwritten or cleared using this operation is not saved and is not recoverable. | No change. Page blob data that is overwritten or cleared using this operation is not saved and is not recoverable. |
| [Append Block](/rest/api/storageservices/append-block)<br />[Append Block from URL](/rest/api/storageservices/append-block-from-url) | No change. | No change. |
| [Set Blob Properties](/rest/api/storageservices/set-blob-properties) | No change. Overwritten blob properties are not recoverable. | No change. Overwritten blob properties are not recoverable. |
| [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) | No change. Overwritten blob metadata is not recoverable. | A new version that captures the blob's state prior to the operation is automatically generated. |
| [Set Blob Tier](/rest/api/storageservices/set-blob-tier) | The base blob is moved to the new tier. Any active or soft-deleted snapshots remain in the original tier. No soft-deleted snapshot is created. | The base blob is moved to the new tier. Any active or soft-deleted versions remain in the original tier. No new version is created. |

### Storage account (hierarchical namespace)

|**REST API operation**|**Soft Delete enabled**|
|---|---|
|[Path - Delete](/rest/api/storageservices/datalakestoragegen2/path/delete) |A soft deleted blob or directory is created. The soft deleted object is deleted after the retention period.|
|[Delete Blob](/rest/api/storageservices/delete-blob)|A soft deleted object is created. The soft deleted object is deleted after the retention period. Soft delete will not be supported for blobs with snapshots and snapshots.|
|[Path - Create](/rest/api/storageservices/datalakestoragegen2/path/create) that renames a blob or directory | Existing destination blob or empty directory will get soft deleted and the source will replace it. The soft deleted object is deleted after the retention period.|

## Pricing and billing

All soft deleted data is billed at the same rate as active data. You will not be charged for data that is permanently deleted after the retention period elapses.

When you enable soft delete, Microsoft recommends using a short retention period to better understand how the feature will affect your bill. The minimum recommended retention period is seven days.

Enabling soft delete for frequently overwritten data may result in increased storage capacity charges and increased latency when listing blobs. You can mitigate this additional cost and latency by storing the frequently overwritten data in a separate storage account where soft delete is disabled.

You are not billed for transactions related to the automatic generation of snapshots or versions when a blob is overwritten or deleted. You are billed for calls to the **Undelete Blob** operation at the transaction rate for write operations.

For more information on pricing for Blob Storage, see the [Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

## Blob soft delete and virtual machine disks  

Blob soft delete is available for both premium and standard unmanaged disks, which are page blobs under the covers. Soft delete can help you recover data deleted or overwritten by the [Delete Blob](/rest/api/storageservices/delete-blob), [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), and [Copy Blob](/rest/api/storageservices/copy-blob) operations only.

Data that is overwritten by a call to [Put Page](/rest/api/storageservices/put-page) is not recoverable. An Azure virtual machine writes to an unmanaged disk using calls to [Put Page](/rest/api/storageservices/put-page), so using soft delete to undo writes to an unmanaged disk from an Azure VM is not a supported scenario.

## Next steps

- [Enable soft delete for blobs](./soft-delete-blob-enable.md)
- [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md)
- [Blob versioning](versioning-overview.md)
