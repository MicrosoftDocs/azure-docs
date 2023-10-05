---
title: Azure Storage Explorer blob versioning guide
description: Blob versioning guidance for Azure Storage Explorer
services: storage
author: JasonYeMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: chuye
---

# Azure Storage Explorer blob versioning guide

Microsoft Azure Storage Explorer provides easy access and management of blob versions. This guide will help you understand how blob versioning works in Storage Explorer. Before continuing, it's recommended you read more about [blob versioning](../blobs/versioning-overview.md).

## Terminology

This section provides some definitions to help understand their usage in this article.

- Soft delete: An alternative automatic data protection feature. You can learn more about soft delete [here](../blobs/soft-delete-blob-overview.md).
- Active blob: A blob or blob version is created in active state. You can only operate on blobs or blob versions in active state.
- Soft-deleted blob: A blob or blob version marked as soft-deleted. Soft-deleted blobs are only kept for its retention period.
- Blob version: A blob created with blob versioning enabled. Each blob version is associated with a version ID.
- Current version: A blob version marked as the current version.
- Previous version: A blob version that isn't the current version.
- Non-version blob: A blob created with blob versioning disabled. A non-version blob doesn't have a version ID.

## View blob versions

Storage Explorer supports four different views for viewing blobs.

| View | Active non-version blobs | Soft-deleted non-version blobs | Blob versions |
| ---- | :----------: | :-----------: | :------------------: |
| Active blobs | Yes | No | Current version only |
| Active blobs and soft-deleted blobs | Yes | Yes | Current version only |
| Active blobs and blobs without current version | Yes | No | Current version or latest active version |
| All blobs and blobs without current version | Yes | Yes | Current version or latest version |

### Active blobs

In this view, Storage Explorer displays:

- Active non-version blobs
- Current versions

### Active blobs and soft-deleted blobs

In this view, Storage Explorer displays:

- Active non-version blobs
- Soft-deleted non-version blobs
- Current versions.

### Active blobs and blobs without current version

In this view, Storage Explorer displays:

- Active non-version blobs
- Current versions
- Latest active previous versions.

For blobs that don't have a current version but have an active previous version, Storage Explorer displays their latest active previous version as a representation of that blob.

### All blobs and blobs without current version

In this view, Storage Explorer displays:

- Active non-version blobs
- Soft-deleted non-version blobs
- Current versions
- Latest previous versions.

For blobs that don't have a current version, Storage Explorer displays their latest previous version as a representation of that blob.

> [!NOTE]
> Due to service limitation, Storage Explorer needs some additional processing to get a hierarchical view of your virtual directories when listing blob versions. It will take longer to list blobs in the following views:
>
> - Active blobs and blobs without current version
> - All blobs and blobs without current version

## Manage blob versions

### View versions of a blob

Storage Explorer provides a **Manage Versions** command to view all the versions of a blob. To view a blob's versions, select the blob you want to view versions for and select **Manage History &rarr; Manage Versions** from either the toolbar or the context menu.

### Download blob versions

To download one or more blob versions, select the blob versions you want to download and select **Download** from the toolbar or the context menu.

If you're downloading multiple versions of a blob, the downloaded files will have their version IDs at the beginning of their file names.

### Delete blob versions

To delete one or more blob versions, select the blob versions you want to delete and select **Delete** from the toolbar or the context menu.

Blob versions are subject to your soft-delete policy. If soft-delete is enabled, blob versions will be soft-deleted. One special case is deleting a current version. Deleting a current version will automatically make it become an active previous version instead.

### Promote blob version

You can restore the contents of a blob by promoting a previous version to become the current version. Select the blob version you want to promote and select **Promote Version** from the toolbar or the context menu.

Non-version blobs will be overwritten by the promoted blob version. Make sure you no longer need that data or back up the data yourself before confirming the operation. Current versions automatically become previous versions, so Storage Explorer won't prompt for confirmation.

### Undelete blob version

Blob versions can't be undeleted individually. They must be undeleted all at once. To undelete all blob versions of a blob, select any one of the blob's versions and select **Undelete Selected** from the toolbar or the context menu.

### Change access tier of blob versions

Each blob version has its own access tier. To change access tier of blob versions, select the blob versions you want to change access tier and select **Change Access Tier...** from the context menu.

## See Also

- [Blob versioning](../blobs/versioning-overview.md)
- [Soft delete for blobs](../blobs/soft-delete-blob-overview.md)
- [Azure Storage Explorer soft delete guide](./storage-explorer-soft-delete.md)
