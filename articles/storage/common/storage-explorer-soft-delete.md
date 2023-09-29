---
title: Azure Storage Explorer soft delete guide
description: Soft delete in Azure Storage Explorer
services: storage
author: JasonYeMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 08/30/2021
ms.author: chuye
---

# Azure Storage Explorer soft delete guide

Soft delete helps mitigate the impact of accidentally deleting critical data. This guide will help you understand how you can take advantage of this feature in Storage Explorer. Before continuing, it's recommended you read more about [blob soft delete](../blobs/soft-delete-blob-overview.md).

## Configuring delete retention policy

You can configure the delete retention policy for each storage account in Storage Explorer. Open the context menu for any "Blob Containers" node under the storage account and choose **Configure Soft Delete Policy...**.

Setting a new policy may take up to 30 seconds for it to take effect. Deleting data without waiting for the new policy to take effect may result in unexpected behavior. Storage Explorer waits 30 seconds before reporting a successfully configured policy in the Activity Log.

## Soft delete with hierarchical namespace enabled

The soft delete feature has fundamental differences between blob containers with or without hierarchical namespace (HNS) enabled.

HNS enabled blob containers have real directories. Those directories can also be soft-deleted. When a real directory is soft-deleted, all the active blobs or directories under it will become inaccessible. These blobs and directories will be recovered when the directory is undeleted and discarded when the directory expires. Blobs or directories under it that have already been soft-deleted will be kept as is.

Non-HNS enabled blob containers don't allow soft-deleted blobs and active blobs with the same name to coexist. Uploading a blob with the same name as a soft-deleted blob will cause the soft-deleted blob to become a snapshot of the new one. In an HNS enabled blob container, doing the same thing will result in the soft-deleted blob coexisting with the new one. HNS enabled blob containers also allow the coexistence of multiple soft-deleted blobs with the same name.

Each soft-deleted blob or directory in an HNS enabled blob container has a `DeletionID` property. This property distinguishes blobs or directories with the same name. Soft-deleted blobs in non-HNS enabled blob containers don't have a `DeletionID` property.

Non-HNS enabled blob containers also support "blob versioning". If blob versioning is enabled, the behavior of certain operations, such as delete, changes. For more information, see [Azure Storage Explorer blob versioning guide](./storage-explorer-blob-versioning.md).

## View soft-deleted blobs

In Blob Explorer, soft-deleted blobs are shown under certain view contexts.

For blob containers without HNS enabled, choose the "Active blobs and soft deleted blobs" or the "All blobs and blobs without current version" view context to view soft-deleted blobs.

For blob containers with HNS enabled, choose the "Active and soft deleted blobs" or the "Deleted only" view context to view soft-deleted blobs and directories.

## Delete blobs

When deleting blobs or directories, Storage Explorer checks the storage account's current delete retention policy. A confirmation dialog then informs you what will happen if you continue with the delete operation. If soft delete is disabled, you can enable it from the confirmation dialog by selecting the **Enable Soft Delete** button.

> [!WARNING]
> Storage Explorer may not see a new delete retention policy if you just saved it. It is highly recommended that you wait at least 30 seconds for the new policy to take effect before deleting data.

## Undelete blobs

Storage Explorer can undelete soft-deleted blobs recursively and in batches.

To undelete blobs, select the soft-deleted blobs you want to undelete and use the **Undelete → Undelete Selected** from the toolbar or the context menu.

You can also undelete blobs recursively under a directory. If an active directory is included in the selection, Storage Explorer will undelete all the soft-deleted blobs or directories in it.

In HNS enabled blob containers, undeleting a blob will fail if an active blob with the same name already exists.

> [!NOTE]
> Soft-deleted snapshots can only undeleted by undeleting the base blob. There is no way to undelete individual snapshots.

## Undelete blobs by date range

Storage Explorer also lets you undelete blobs based on their deletion time.

To undelete blobs by date range, select the soft-deleted blobs you want to undelete and use the **Undelete → Undelete by Date...** from the toolbar or the context menu.

**Undelete by Date...** works exactly the same as **Undelete Selected**, except that it will filter out blobs or directories whose deletion time is out of the range you specify.

## See Also

- [Azure Storage Explorer blob versioning guide](./storage-explorer-blob-versioning.md)
- [Soft delete for blobs](../blobs/soft-delete-blob-overview.md)
