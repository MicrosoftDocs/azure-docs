---
title: Soft delete for containers
titleSuffix: Azure Storage
description: Soft delete for containers protects your data so that you can more easily recover your data when it's erroneously modified or deleted by an application or by another storage account user.
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 06/22/2022
ms.author: normesta
ms.custom: references_regions
---

# Soft delete for containers

Container soft delete protects your data from being accidentally deleted by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore a soft-deleted container and its contents to the container's state at the time it was deleted. After the retention period has expired, the container and its contents are permanently deleted.

## Recommended data protection configuration

Blob soft delete is part of a comprehensive data protection strategy for blob data. For optimal protection for your blob data, Microsoft recommends enabling all of the following data protection features:

- Container soft delete, to restore a container that has been deleted. To learn how to enable container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md).
- Blob versioning, to automatically maintain previous versions of a blob. When blob versioning is enabled, you can restore an earlier version of a blob to recover your data if it's erroneously modified or deleted. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).
- Blob soft delete, to restore a blob, snapshot, or version that has been deleted. To learn how to enable blob soft delete, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md).

To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

> [!CAUTION]
> After you enable blob versioning for a storage account, every write operation to a blob in that account results in the creation of a new version. For this reason, enabling blob versioning may result in additional costs. To minimize costs, use a lifecycle management policy to automatically delete old versions. For more information about lifecycle management, see [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md).

## How container soft delete works

When you enable container soft delete, you can specify a retention period for deleted containers that is between 1 and 365 days. The default retention period is seven days. During the retention period, you can recover a deleted container by calling the **Restore Container** operation.

When you restore a container, the container's blobs and any blob versions and snapshots are also restored. However, you can only use container soft delete to restore blobs if the container itself was deleted. To a restore a deleted blob when its parent container hasn't been deleted, you must use blob soft delete or blob versioning.

> [!WARNING]
> Container soft delete can restore only whole containers and their contents at the time of deletion. You cannot restore a deleted blob within a container by using container soft delete. Microsoft recommends also enabling blob soft delete and blob versioning to protect individual blobs in a container.
>
> When you restore a container, you must restore it to its original name. If the original name has been used to create a new container, then you will not be able to restore the soft-deleted container.

The following diagram shows how a deleted container can be restored when container soft delete is enabled:

:::image type="content" source="media/soft-delete-container-overview/container-soft-delete-diagram.png" alt-text="Diagram showing how a soft-deleted container may be restored":::

After the retention period has expired, the container is permanently deleted from Azure Storage and can't be recovered. The clock starts on the retention period at the point that the container is deleted. You can change the retention period at any time, but keep in mind that an updated retention period applies only to newly deleted containers. Previously deleted containers will be permanently deleted based on the retention period that was in effect at the time that the container was deleted.

Disabling container soft delete doesn't result in permanent deletion of containers that were previously soft-deleted. Any soft-deleted containers will be permanently deleted at the expiration of the retention period that was in effect at the time that the container was deleted.

Container soft delete is available for the following types of storage accounts:

- General-purpose v2 and v1 storage accounts
- Block blob storage accounts
- Blob storage accounts

Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage Gen2 are also supported.

Version 2019-12-12 or higher of the Azure Storage REST API supports container soft delete.

> [!IMPORTANT]
> Container soft delete does not protect against the deletion of a storage account, but only against the deletion of containers in that account. To protect a storage account from deletion, configure a lock on the storage account resource. For more information about locking Azure Resource Manager resources, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Pricing and billing

There's no additional charge to enable container soft delete. Data in soft-deleted containers is billed at the same rate as active data.

## Next steps

- [Configure container soft delete](soft-delete-container-enable.md)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
