---
title: Azure Storage Explorer soft delete guide
description: Soft delete in Azure Storage Explorer
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: concept-article
ms.date: 08/30/2021
ms.author: jinglou
ms.reviewer: cralvord,richardgao
---

# Microsoft Azure Storage Explorer: Soft delete guide

Soft delete helps mitigate data loss from accidentally deleting critical data. This guide helps you understand how you can take advantage of this feature in Storage Explorer. Before continuing, we recommended you read more about [blob soft delete](../blobs/soft-delete-blob-overview.md).

## Configuring delete retention policy

You can configure the soft delete retention policy for each storage account in Storage Explorer. Open the context menu for any "Blob Containers" node under the storage account and choose **Configure Soft Delete Policy...**.

Setting a new policy might take up to 30 seconds for it to take effect. Deleting data without waiting for the new policy to take effect might result in unexpected behavior. Storage Explorer waits 30 seconds before reporting a successfully configured policy in the Activity Log.

## Soft delete with hierarchical namespace enabled

The soft delete feature has fundamental differences between blob containers with or without hierarchical namespace (HNS) enabled.

HNS enabled blob containers have real directories. Those directories can also be soft-deleted. When a real directory is soft-deleted, all the active blobs or directories under it become inaccessible. These blobs and directories are recovered when the directory is undeleted and discarded when the directory expires. Blobs or directories under the directory that were already soft-deleted are kept as is.

Non-HNS enabled blob containers don't allow soft-deleted blobs and active blobs with the same name to coexist. Uploading a blob with the same name as a soft-deleted blob causes the soft-deleted blob to become a snapshot of the new one. In an HNS enabled blob container, doing the same thing results in the soft-deleted blob coexisting with the new one. HNS enabled blob containers also allow the coexistence of multiple soft-deleted blobs with the same name.

Each soft-deleted blob or directory in an HNS enabled blob container has a `DeletionID` property. This property distinguishes blobs or directories with the same name. Soft-deleted blobs in non-HNS enabled blob containers don't have a `DeletionID` property.

Non-HNS enabled blob containers also support blob versioning. If blob versioning is enabled, the behavior of certain operations, such as delete, changes. For more information, see [Azure Storage Explorer blob versioning guide](./storage-explorer-blob-versioning.md).

## View soft-deleted blobs

In Blob Explorer, soft-deleted blobs are shown under certain view contexts.

For blob containers without HNS enabled, choose the "Active blobs and soft deleted blobs" or the "All blobs and blobs without current version" view context to view soft-deleted blobs.

For blob containers with HNS enabled, choose the "Active and soft deleted blobs" or the "Deleted only" view context to view soft-deleted blobs and directories.

## Delete blobs

When you delete blobs or directories, Storage Explorer checks the storage account's current delete retention policy. A confirmation dialog then informs you what happens if you continue with the delete operation. If soft delete is disabled, you can enable it from the confirmation dialog by selecting the **Enable Soft Delete** button.

> [!WARNING]
> Storage Explorer might not see a new delete retention policy if you just saved it. We highly recommended that you wait at least 30 seconds for the new policy to take effect before deleting data.

## Undelete blobs

Storage Explorer can undelete soft-deleted blobs recursively and in batches.

To undelete blobs, select the soft-deleted blobs you want to undelete and use the **Undelete → Undelete Selected** from the toolbar or the context menu.

You can also undelete blobs recursively under a directory. If an active directory is included in the selection, Storage Explorer undeletes all the soft-deleted blobs or directories in it.

In HNS enabled blob containers, undeleting a blob fails if an active blob with the same name already exists.

> [!NOTE]
> Soft-deleted snapshots can only be undeleted by undeleting the base blob. There's no way to undelete individual snapshots.

## Undelete blobs by date range

Storage Explorer also lets you undelete blobs based on their deletion time.

To undelete blobs by date range, select the soft-deleted blobs you want to undelete and use the **Undelete → Undelete by Date...** from the toolbar or the context menu.

**Undelete by Date...** works exactly the same as **Undelete Selected**, except that it filters out blobs or directories whose deletion time is out of the range you specify.

## See Also

- [Azure Storage Explorer blob versioning guide](./storage-explorer-blob-versioning.md)
- [Soft delete for blobs](../blobs/soft-delete-blob-overview.md)
