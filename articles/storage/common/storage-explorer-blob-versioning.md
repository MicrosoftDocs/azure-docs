---
title: Azure Storage Explorer Blob versioning guide | Microsoft Docs
description: Blob versioning guidance for Azure Storage Explorer
services: storage
author: chuye
ms.service: storage
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: chuye
---

# Azure Storage Explorer Blob Versioning guide

Microsoft Azure Storage Explorer provides easy access and management of blob versions. This guide will help you understand how Blob Versioning works in Azure Storage Explorer. If you haven't read the documentation on how Blob Versioning works, please read [Blob Versioning](https://docs.microsoft.com/azure/storage/blobs/versioning-overview) before continuing.

## Terminology

This section will introduce a few terms used in this documentation to help you understand the following sections.

- Soft Delete: The automatic data protection feature prior to Blob Versioning.
- Active/Soft deleted: The state a blob version or a non-version blob is in.
- Blob version: Blobs associated with a version ID.
- Current version: A blob version marked as the current version.
- Previous version: A blob version not marked as the current version.
- Non-version blob: A blob without a version ID.

Soft Delete is the automatic data protection feature prior to Blob Versioning. Blobs are created as active blobs. With Soft Delete enabled, deleting an active blob will mark it as soft deleted. The contents of that blob will be retained for a retention period. Once the retention period expires, it will be permanently deleted.

Blob Versioning is a new automatic data protection feature. Blobs created with Blob Versioning enabled will be associated with a version ID, making them blob versions. A blob version may be marked as the current version to reflect the current contents of the blob. When you change the contents of the blob, the previous contents of the blob will be stored as a previous version and the new contents will become the current version. A blob version can also be soft deleted except for the current version.

Blobs created before Blob Versioning enabled won't be converted to blob versions. They will remain as is and they won't have version IDs associated with them.

## View blob versions

Storage Explorer support four different views for viewing blobs.

| View | Active non-version blobs | Soft deleted non-version blobs | Blob versions |
| ---- | :----------: | :-----------: | :------------------: |
| `Active blobs` | Yes | No | Current version only |
| `Active blobs and soft deleted blobs` | Yes | No | Current version only |
| `Active blobs and blobs without current version`* | Yes | No | Current version or latest active version |
| `All blobs and blobs without current version`* | Yes | Yes | Current version or latest version |

### Active blobs

In `Active blobs` view, Storage Explorer displays the active non-version blobs, and the blob versions that are marked as current version.

### Active blobs and soft deleted blobs

In `Active blobs and soft deleted blobs` view, Storage Explorer displays the active non-version blobs, the soft deleted non-version blobs, and the blob versions that are marked as current version.

### Active blobs and blobs without current version

In `Active blobs and blobs without current version` view, Storage Explorer displays the active non-version blobs, the blob versions that are marked as current version and blobs that don't have a current version but have an active previous version. For blobs that don't have a current version but have an active previous version, Storage Explorer displays their latest active previous version as a representation of that blob.

### All blobs and blobs without current version

In `All blobs and blobs without current version` view, Storage Explorer displays the active non-version blobs, the soft deleted non-version blobs, the blob versions that are marked as current version, and blobs that don't have a current version. For blobs that don't have a current version, Storage Explorer displays their latest previous version as a representation of that blob, no matter it is active or soft deleted.

Due to service limitation, Storage Explorers need some additional processing to get a hierarchical view of your virtual directories when listing blob versions. It will take longer to list blobs in views that include non-current versions (views marked with * in the table).

## Manage blob versions

### View versions of a blob

Storage Explorer provides a `Manage Versions` option to view all the versions of a blob. In order to go to that view, select the blob you want to view versions for and choose `Manage History -> Manage Versions` from either the toolbar or the context menu.

### Download blob versions

To download one or more blob versions, select the blob versions you want to download and choose `Download` from the toolbar or the context menu.

If you are downloading multiple versions of a blob, the downloaded files will have their version IDs at the beginning of their file names.

### Delete blob versions

To delete one or more blob versions, select the blob versions you want to delete and choose `Delete` from the toolbar or the context menu.

Blob versions are subject to your Soft Delete policy. If you have Soft Delete enabled, blob versions will be soft deleted. One special case is deleting a current blob version. Deleting a current blob version will automatically make it become an active previous blob version instead.

### Promote blob version

You can restore the contents of a blob by promoting a previous blob version to become the current blob version. Select the blob version you want to promote and choose `Promote Version` from the toolbar or the context menu.

Non-version blobs will be overwritten by the promoted blob version. Make sure you no longer need that data or back it up yourself before confirming the operation. Current blob versions will automatically become a previous version instead so Storage Explorer don't prompt for a confirmation.

### Undelete blob version

You can only undelete all blob versions of a blob at a time. To undelete all blob versions of a blob, select any one of the blob's versions and choose `Undelete Selected` from the toolbar or the context menu.

### Change access tier of blob versions

Each blob version has its own access tier. To change access tier of blob versions, select the blob versions you want to change access tier and choose `Change Access Tier...` from the context menu.

## See Also

* [Blob Versioning](https://docs.microsoft.com/azure/storage/blobs/versioning-overview)
* [Soft Delete for blobs](https://docs.microsoft.com/azure/storage/blobs/soft-delete-blob-overview)
