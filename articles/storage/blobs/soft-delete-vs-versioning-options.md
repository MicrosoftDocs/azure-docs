---
title: Best practices for choosing between blob soft delete and blob versioning
titleSuffix: Azure Storage
description: Learn how to choose between blob soft delete and blob versioning for account data protection.
author: despindolams
ms.author: normesta
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/15/2025
---

# Choosing between blob soft delete and blob versioning

This article helps you determine when to enable soft delete, versioning, both, or neither.

Both **blob soft delete** and **blob versioning** can help you protect from deletes and overwrites. These features can be used independently or together, depending on your workload, cost sensitivity, and recovery needs. To learn about other ways to protect blobs and containers, see [data protection overview](https://docs.azure.cn/en-us/storage/blobs/data-protection-overview).

## Our recommendation

Blob storage customers storing critical data should enable soft delete and versioning for layered protection against unintended deletions and overwrites. Soft delete ensures your data remains recoverable for a configurable number of days. Blob versioning offers more flexibility for managing previous versions and recovery options such as being able to read previous versions and recover from metadata or property changes. Refer to the following details to find out what is right for you.  

## Overview of features

| **Feature** | **Protects against** | **Retention duration** | **Storage behavior** | **Hierarchical namespace (HNS) considerations** |
|---|---|---|---|---|
| **Soft delete** | Deletes and overwrites for flat namespace accounts. Deletes for hierarchical namespace accounts. | Up to 365 days (configurable) | Creates a soft-deleted snapshot for each overwrite. Creates a soft-deleted blob for each delete. | Soft delete only protects delete operations for HNS-enabled accounts. With the [Set Blob Expiry](/rest/api/storageservices/set-blob-expiry) API, an expired file can't be restored by using the blob soft delete feature. |
| **Versioning** | Deletes and overwrites for flat namespace accounts. | Indefinite (until explicitly deleted) | Creates a new version on each write. | Versioning is not available for HNS-enabled accounts. |

> [!NOTE]
> Both features are disabled by default and must be enabled at the storage account level.

## When to use soft delete

:::image type="content" source="media/soft-delete-blob-overview/blob-soft-delete-diagram.png" alt-text="Diagram showing how a soft-deleted blob may be restored.":::

Enable soft delete if:

* You want to recover blobs that were accidentally deleted or overwritten. For hierarchical namespace enabled accounts, soft delete only protects from deletes, not overwrites.
* You need a time-limited safety net for blob recovery, equal to your retention days setting.

### Considerations

* A soft-deleted snapshot is created for every overwrite operation. Blob soft delete doesn't protect against operations to write blob metadata or properties.
* A soft-deleted blob is created for every delete operation. Each soft-deleted blob is billed at the full size of the blob at the time of the operation.
* Avoid exceeding **1,000 soft-deleted snapshots per blob** during the retention period to prevent performance degradation during blob listing operations.
* Retention is limited to **a maximum of 365 days**.
* If soft delete is enabled, there is no way to permanently delete until the soft delete retention expires. All deletes are "soft" and when the retention period expires, the soft-deleted blob is permanently deleted.
* If soft delete is disabled, all deletes are permanent, but the existing soft-deleted data are retained until the retention period expires.
* The contents of soft-deleted blobs are not accessible via Read APIs. To access the data, you must first undelete the blob.  

## When to use versioning

:::image type="content" source="media/versioning-overview/blob-versioning-diagram.png" alt-text="Diagram showing how blob versioning works.":::

Enable versioning if:

- You want to maintain a complete history of changes to a blob. For versioning, both overwrites and deletes create a previous version. Deletion removes the current version, but the previous versions remain.

- You want to save changes to metadata and properties as previous versions. 

- You need long-term or indefinite retention of previous blob states.

- You want to maintain quick access to previous versions without having to undelete.

### Considerations

- Each write operation ([Put Blob,](/rest/api/storageservices/put-blob) [Put Block List,](/rest/api/storageservices/put-block-list) [Set Blob Metadata,](/rest/api/storageservices/set-blob-metadata) and [Copy Blob)](/rest/api/storageservices/copy-blob) creates a new version of the blob.

- Versions are retained **until explicitly deleted**, offering long-term recovery options.

- Avoid exceeding **1,000 versions per blob** to maintain optimal performance and prevent performance degradation during blob listing operations.

- You can delete specific versions at any time. Separate roles are required to delete current versions and previous versions. That separation can be helpful to avoid mistakes. The same identity can have both of these roles assigned. [Learn more.](/azure/storage/blobs/versioning-overview)

- You can [configure a lifecycle management policy](/azure/storage/blobs/lifecycle-management-policy-configure) or [Azure Storage Actions](/azure/storage-actions/overview) to control the lifecycle of your versions and define retention conditions.

- Versioning is not available for accounts with hierarchical namespace enabled. 

## When to use both

Enable both soft delete and versioning if:

* You need comprehensive protection against both accidental deletions and overwrites.
* You operate in a regulated environment requiring layered data protection.
* You want to ensure recovery options even if versions are deleted. 
* You want to create a grace period where, when previous versions are deleted, they are retained for some period of time (soft delete retention).

### Considerations

- When versioning is enabled, deletion of the current version makes it a previous version. When soft delete is enabled, deletion of the previous version makes it a soft-deleted previous version. ([Learn more](/azure/storage/blobs/soft-delete-blob-overview))

- Soft delete retention only applies to deletion of previous versions. If you would like to permanently delete soft delete versions before the retention period, review these [instructions](https://techcommunity.microsoft.com/blog/azurepaasblog/permanent-delete-of-soft-deleted-snapshot-and-versions-without-disabling-soft-de/4026868).

- Avoid exceeding **1,000 versions per blob** to maintain optimal performance and prevent performance degradation during blob listing operations.

- Each feature retains data in a different way. You can set different retention periods for versioning and soft delete to balance cost and risk of data loss.

## When to use neither

You might choose to disable both features if:

* Your application has its own backup and recovery mechanisms.
* You have strict cost constraints and low risk of accidental data loss.
* Your data is temporary or test data and protection is not necessary.

## Blob accessibility after deletion

Whether soft delete, versioning, or both are enabled on the account, this section describes how to access the data after a blob is deleted.

If versioning is enabled, you must specify a version ID to read a previous version. Use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a previous version to a new current version.

If soft delete is enabled, you must undelete the blob.

If versioning and soft delete are enabled and the previous version you want to access has been soft-deleted, you must first undelete the blob. The **Undelete Blob** operation always restores all soft-deleted versions of the blob. Then you can use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a previous version to a new current version.

## Cost considerations

Enabling soft delete or versioning for frequently overwritten data might result in increased storage capacity charges and increased latency when listing blobs. Block-level updates using [Put Block](/rest/api/storageservices/put-block) and [Put Block List](/rest/api/storageservices/put-block-list) can reduce storage costs. If you make no changes to a blob, version, or snapshot's tier, then you are billed for unique blocks of data across that blob its versions, and snapshots. You are billed for active data until the blob, versions, and snapshots are permanently deleted.
[Learn more](/azure/storage/blobs/soft-delete-blob-overview)

## Related articles

* [Blob versioning](versioning-overview.md)
* [Soft delete for blobs](./soft-delete-blob-overview.md)
