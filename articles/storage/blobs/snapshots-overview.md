---
title: Blob snapshots
titleSuffix: Azure Storage
description: Understand how blob snapshots work and how they are billed.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/27/2020
ms.author: tamram
ms.subservice: blobs
---

# Blob snapshots

A snapshot is a read-only version of a blob that's taken at a point in time.

> [!NOTE]
> Blob versioning offers a superior way to maintain previous versions of a blob. For more information, see [Blob versioning](versioning-overview.md).

## About blob snapshots

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

A snapshot of a blob is identical to its base blob, except that the blob URI has a **DateTime** value appended to the blob URI to indicate the time at which the snapshot was taken. For example, if a page blob URI is `http://storagesample.core.blob.windows.net/mydrives/myvhd`, the snapshot URI is similar to `http://storagesample.core.blob.windows.net/mydrives/myvhd?snapshot=2011-03-09T01:42:34.9360000Z`.

> [!NOTE]
> All snapshots share the base blob's URI. The only distinction between the base blob and the snapshot is the appended **DateTime** value.

A blob can have any number of snapshots. Snapshots persist until they are explicitly deleted, either independently or as part of a [Delete Blob](/rest/api/storageservices/delete-blob) operation for the base blob. You can enumerate the snapshots associated with the base blob to track your current snapshots.

When you create a snapshot of a blob, the blob's system properties are copied to the snapshot with the same values. The base blob's metadata is also copied to the snapshot, unless you specify separate metadata for the snapshot when you create it. After you create a snapshot, you can read, copy, or delete it, but you cannot modify it.

Any leases associated with the base blob do not affect the snapshot. You cannot acquire a lease on a snapshot.

A VHD file is used to store the current information and status for a VM disk. You can detach a disk from within the VM or shut down the VM, and then take a snapshot of its VHD file. You can use that snapshot file later to retrieve the VHD file at that point in time and recreate the VM.

## Understand how snapshots accrue charges

### Important billing considerations

The following list includes key points to consider when creating a snapshot.

- Your storage account incurs charges for unique blocks or pages, whether they are in the blob or in the snapshot. Your account does not incur additional charges for snapshots associated with a blob until you update the blob on which they are based. After you update the base blob, it diverges from its snapshots. When this happens, you are charged for the unique blocks or pages in each blob or snapshot.
- When you replace a block within a block blob, that block is subsequently charged as a unique block. This is true even if the block has the same block ID and the same data as it has in the snapshot. After the block is committed again, it diverges from its counterpart in any snapshot, and you will be charged for its data. The same holds true for a page in a page blob that's updated with identical data.
- Updating a block blob by calling a method that overwrites the entire contents of the blob will replace all blocks in the blob. If you have a snapshot associated with that blob, all blocks in the base blob and snapshot now diverge, and you will be charged for all the blocks in both blobs. This is true even if the data in the base blob and the snapshot remain identical.
- The Azure Blob service does not have a means to determine whether two blocks contain identical data. Each block that is uploaded and committed is treated as unique, even if it has the same data and the same block ID. Because charges accrue for unique blocks, it's important to consider that updating a blob that has a snapshot results in additional unique blocks and additional charges.

### Minimize costs with snapshot management

We recommend managing your snapshots carefully to avoid extra charges. You can follow these best practices to help minimize the costs incurred by the storage of your snapshots:

- Delete and re-create snapshots associated with a blob whenever you update the blob, even if you are updating with identical data, unless your application design requires that you maintain snapshots. By deleting and re-creating the blob's snapshots, you can ensure that the blob and snapshots do not diverge.
- If you are maintaining snapshots for a blob, avoid calling methods that overwrite the entire blob when you update the blob. Instead, update the fewest possible number of blocks in order to keep costs low.

### Snapshot billing scenarios

The following scenarios demonstrate how charges accrue for a block blob and its snapshots.

## Pricing and billing

Creating a snapshot, which is a read-only copy of a blob, can result in additional data storage charges to your account. When designing your application, it is important to be aware of how these charges might accrue so that you can minimize costs.

Blob snapshots, like blob versions, are billed at the same rate as active data. How snapshots are billed depends on whether you have explicitly set the tier for the base blob or for any of its snapshots (or versions). For more information about blob tiers, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).

If you have not changed a blob or snapshot's tier, then you are billed for unique blocks of data across that blob, its snapshots, and any versions it may have. For more information, see [Billing when the blob tier has not been explicitly set](#billing-when-the-blob-tier-has-not-been-explicitly-set).

If you have changed a blob or snapshot's tier, then you are billed for the entire object, regardless of whether the blob and snapshot are eventually in the same tier again. For more information, see [Billing when the blob tier has been explicitly set](#billing-when-the-blob-tier-has-been-explicitly-set).

For more information about billing details for blob versions, see [Blob versioning](versioning-overview.md).

### Billing when the blob tier has not been explicitly set

If you have not explicitly set the blob tier for a base blob or any of its snapshots, then you are charged for unique blocks or pages across the blob, its snapshots, and any versions it may have. Data that is shared across a blob and its snapshots is charged only once. When a blob is updated, then data in a base blob diverges from the data stored in its snapshots, and the unique data is charged per block or page.

When you replace a block within a block blob, that block is subsequently charged as a unique block. This is true even if the block has the same block ID and the same data as it has in the snapshot. After the block is committed again, it diverges from its counterpart in the snapshot, and you will be charged for its data. The same holds true for a page in a page blob that's updated with identical data.

Blob storage does not have a means to determine whether two blocks contain identical data. Each block that is uploaded and committed is treated as unique, even if it has the same data and the same block ID. Because charges accrue for unique blocks, it's important to keep in mind that updating a blob when that blob has snapshots or versions will result in additional unique blocks and additional charges.

When a blob has snapshots, call update operations on block blobs so that they update the least possible number of blocks. The write operations that permit fine-grained control over blocks are [Put Block](/rest/api/storageservices/put-block) and [Put Block List](/rest/api/storageservices/put-block-list). The [Put Blob](/rest/api/storageservices/put-blob) operation, on the other hand, replaces the entire contents of a blob and so may lead to additional charges.

The following scenarios demonstrate how charges accrue for a block blob and its snapshots when the blob tier has not been explicitly set.

#### Scenario 1

In scenario 1, the base blob has not been updated after the snapshot was taken, so charges are incurred only for unique blocks 1, 2, and 3.

![Diagram 1 showing billing for unique blocks in base blob and snapshot.](./media/snapshots-overview/storage-blob-snapshots-billing-scenario-1.png)

#### Scenario 2

In scenario 2, the base blob has been updated, but the snapshot has not. Block 3 was updated, and even though it contains the same data and the same ID, it is not the same as block 3 in the snapshot. As a result, the account is charged for four blocks.

![Diagram 2 showing billing for unique blocks in base blob and snapshot.](./media/snapshots-overview/storage-blob-snapshots-billing-scenario-2.png)

#### Scenario 3

In scenario 3, the base blob has been updated, but the snapshot has not. Block 3 was replaced with block 4 in the base blob, but the snapshot still reflects block 3. As a result, the account is charged for four blocks.

![Diagram 3 showing billing for unique blocks in base blob and snapshot.](./media/snapshots-overview/storage-blob-snapshots-billing-scenario-3.png)

#### Scenario 4

In scenario 4, the base blob has been completely updated and contains none of its original blocks. As a result, the account is charged for all eight unique blocks.

![Diagram 4 showing billing for unique blocks in base blob and snapshot.](./media/snapshots-overview/storage-blob-snapshots-billing-scenario-4.png)

> [!TIP]
> Avoid calling methods that overwrite the entire blob, and instead update individual blocks to keep costs low.

### Billing when the blob tier has been explicitly set

If you have explicitly set the blob tier for a blob or snapshot (or version), then you are charged for the full content length of the object in the new tier, regardless of whether it shares blocks with an object in the original tier. You are also charged for the full content length of the oldest version in the original tier. Any versions or snapshots that remain in the original tier are charged for unique blocks that they may share, as described in [Billing when the blob tier has not been explicitly set](#billing-when-the-blob-tier-has-not-been-explicitly-set).

#### Moving a blob to a new tier

The following table describes the billing behavior for a blob or snapshot when it is moved to a new tier.

| When blob tier is set explicitly on… | Then you are billed for... |
|-|-|
| A base blob with a snapshot | The base blob in the new tier and the oldest snapshot in the original tier, plus any unique blocks in other snapshots.<sup>1</sup> |
| A base blob with a previous version and a snapshot | The base blob in the new tier, the oldest version in the original tier, and the oldest snapshot in the original tier, plus any unique blocks in other versions or snapshots<sup>1</sup>. |
| A snapshot | The snapshot in the new tier and the base blob in the original tier, plus any unique blocks in other snapshots.<sup>1</sup> |

<sup>1</sup>If there are other previous versions or snapshots that have not been moved from their original tier, those versions or snapshots are charged based on the number of unique blocks they contain, as described in [Billing when the blob tier has not been explicitly set](#billing-when-the-blob-tier-has-not-been-explicitly-set).

The following diagram illustrates how objects are billed when a blob with snapshots is moved to a different tier.

:::image type="content" source="media/snapshots-overview/snapshot-billing-tiers.png" alt-text="Diagram showing how objects are billed when a blob with snapshots is explicitly tiered.":::

Explicitly setting the tier for a blob, version, or snapshot cannot be undone. If you move a blob to a new tier and then move it back to its original tier, you are charged for the full content length of the object even if it shares blocks with other objects in the original tier.

Operations that explicitly set the tier of a blob, version, or snapshot include:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)
- [Put Blob](/rest/api/storageservices/put-blob) with tier specified
- [Put Block List](/rest/api/storageservices/put-block-list) with tier specified
- [Copy Blob](/rest/api/storageservices/copy-blob) with tier specified

#### Deleting a blob when soft delete is enabled

When blob soft delete is enabled, if you delete or overwrite a base blob that has had its tier explicitly set, then any previous versions or snapshots of the soft-deleted blob are billed at full content length. For more information about how blob versioning and soft delete work together, see [Blob versioning and soft delete](versioning-overview.md#blob-versioning-and-soft-delete).

The following table describes the billing behavior for a blob that is soft-deleted, depending on whether versioning is enabled or disabled. When versioning is enabled, a new version is created when a blob is soft-deleted. When versioning is disabled, soft-deleting a blob creates a soft-delete snapshot.

| When you overwrite a base blob with its tier explicitly set… | Then you are billed for... |
|-|-|
| If blob soft delete and versioning are both enabled | All existing versions at full content length regardless of tier. |
| If blob soft delete is enabled but versioning is disabled | All existing soft-delete snapshots at full content length regardless of tier. |

## Next steps

- [Blob versioning](versioning-overview.md)
- [Create and manage a blob snapshot in .NET](snapshots-manage-dotnet.md)
- [Back up Azure unmanaged VM disks with incremental snapshots](../../virtual-machines/windows/incremental-snapshots.md)
