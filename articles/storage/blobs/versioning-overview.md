---
title: Blob Versioning in Azure Storage
titleSuffix: Azure Storage
description: Blob storage versioning automatically maintains previous versions of an object and identifies them with timestamps. You can restore a previous version of a blob to recover your data if it's erroneously modified or deleted.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 10/02/2026
ms.author: normesta
ms.custom: engagement-fy23
# Customer intent: "As a data engineer, I want to enable blob versioning for my storage account, so that I can automatically maintain and restore previous versions of my data to safeguard against accidental modifications or deletions."
---

# Blob versioning

You can enable blob versioning to automatically maintain previous versions of an object. When you enable blob versioning, you can access earlier versions of a blob to recover your data if it's modified or deleted.

> [!CAUTION]
> After you enable blob versioning for a storage account, every write operation to a blob in that account results in the creation of a new version. For this reason, enabling blob versioning might result in extra costs. To minimize costs, use a [Lifecycle Management](./lifecycle-management-overview.md) policy or a [Storage Actions](../../storage-actions/overview.md) task to automatically delete previous versions.

## Recommended data protection configuration

Blob versioning is one of several data protection features. Choosing the right feature or combination of features depends on your workload and what you're protecting against. To learn more about Microsoft's recommendations for data protection, see [Data Protection Overview](./data-protection-overview.md).

### Versions versus snapshots

A blob version is similar to a snapshot, but the two differ in how they're created and what they're best suited for. A version is automatic and system-managed: Azure Storage creates a new version on every write or delete when blob versioning is enabled, with no application logic required. A snapshot is manual and application-driven: you explicitly create a point-in-time copy when your application decides one is needed.

Use versioning when you want automatic, continuous protection against accidental or malicious overwrites and deletes. Use snapshots when you want deliberate, point-in-time copies, such as a known-good checkpoint before a planned update. Microsoft recommends that you stop taking snapshots of block blobs once versioning is enabled.

## How blob versioning works

A version captures the state of a blob at a given point in time. Each version has a version ID. When you enable blob versioning for a storage account, Azure Storage automatically creates a new version with a unique ID when you first create a blob and each time you modify the blob.

A version ID can identify the current version or a previous version. A blob can have only one current version at a time, its current state. A blob can have multiple previous versions. 

When you create a new blob, a single version exists, and that version is the current version. When you modify an existing blob, the current version becomes a previous version. A new version is created to capture the updated state, and that new version is the current version. When you delete a blob, the current version of the blob becomes a previous version, and there's no longer a current version. Any previous versions of the blob persist.

The following diagram shows how versions are created on write operations, and how a previous version might be promoted to the current version:

:::image type="content" source="media/versioning-overview/blob-versioning-diagram.png" alt-text="Diagram showing how blob versioning works.":::
Previous blob versions are immutable, meaning you can't modify the content or metadata.

> [!IMPORTANT]
> - Having a large number of versions per blob can increase the latency for blob listing operations. Microsoft recommends maintaining fewer than 1,000 versions per blob. You can use a [Lifecycle Management](./lifecycle-management-overview.md) policy or a [Storage Actions](../../storage-actions/overview.md) task to automatically delete old versions.
> 
> - Blob versioning can't help you recover from the accidental deletion of a storage account or container. To prevent accidental deletion of the storage account, configure a lock on the storage account resource. For more information on locking a storage account, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md). 
### Version ID

Each blob version has a unique version ID. The value of the version ID is the timestamp when the blob was updated. You assign the version ID when you create the version.

You can read or delete a specific version of a blob by using its version ID. If you don't include the version ID, the operation targets the current version.

When you perform a write operation to create or modify a blob, Azure Storage returns the *x-ms-version-id* header in the response. This header contains the version ID for the current version of the blob that the write operation created.

The version ID stays the same for the lifetime of the version.

### Versioning on write operations

When you turn on blob versioning, each write operation to a blob creates a new version. Write operations include [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), [Copy Blob](/rest/api/storageservices/copy-blob), and [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata).

If the write operation creates a new blob, the resulting blob is the current version of the blob. If the write operation modifies an existing blob, the current version becomes a previous version, and a new current version captures the updated blob.

The following diagram shows how write operations affect blob versions. For simplicity, the diagrams in this article display the version ID as a simple integer value. In reality, the version ID is a timestamp. The current version is shown in blue, and previous versions are shown in gray.

:::image type="content" source="media/versioning-overview/write-operations-blob-versions.png" alt-text="Diagram showing how write operations affect versioned blobs.":::

> [!NOTE]
> A blob that you created before versioning was enabled for the storage account doesn't have a version ID. When you modify that blob, the modified blob becomes the new current version, and the blob's state before the update becomes a previous version. The current version is assigned a version ID that is its creation time.

When you enable blob versioning for a storage account, all write operations on block blobs trigger the creation of a new version, except for the [Put Block](/rest/api/storageservices/put-block) operation.

For page blobs and append blobs, only a subset of write operations triggers the creation of a version. These operations include:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Copy Blob](/rest/api/storageservices/copy-blob)

The following operations don't trigger the creation of a new version:

- [Put Page](/rest/api/storageservices/put-page) (page blob)
- [Append Block](/rest/api/storageservices/append-block) (append blob)

To capture changes from those operations, take a manual snapshot. For more information, see [Blob snapshots](snapshots-overview.md).

All versions of a blob must be the same blob type. If a blob has previous versions, you can't overwrite a blob of one type with another type unless you first delete the blob and all of its versions.

### Versioning on delete operations

When you perform the [Delete Blob](/rest/api/storageservices/delete-blob) operation without specifying a version ID, the current version becomes a previous version, and there's no longer a current version. The operation preserves all existing previous versions of the blob.

The following diagram shows the effect of a delete operation on a versioned blob:

:::image type="content" source="media/versioning-overview/delete-versioned-base-blob.png" alt-text="Diagram showing deletion of versioned blob.":::

To delete a specific version of a blob, provide the ID for that version on the delete operation. If you also enable blob soft delete for the storage account, the system retains the version until the soft delete retention period elapses.

Writing new data to the blob creates a new current version of the blob. This action doesn't affect any existing versions, as shown in the following diagram.

:::image type="content" source="media/versioning-overview/recreate-deleted-base-blob.png" alt-text="Diagram showing re-creation of versioned blob after deletion.":::

### Access tiers

You can move any version of a block blob, including the current version, to a different blob access tier by calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation. By moving older versions of a blob to the cool or archive tier, you can take advantage of lower capacity pricing. For more information, see [Hot, Cool, Cold, and Archive access tiers for blob data](access-tiers-overview.md).

To automate the process of moving block blobs to the appropriate tier, create a [Lifecycle Management](lifecycle-management-overview.md) policy, create a [Storage Actions](../../storage-actions/overview.md) task, or enable [Smart Tier](access-tiers-smart.md).

## Enable or disable blob versioning

For instructions about how to enable or disable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).

Disabling blob versioning doesn't delete existing blobs, versions, or snapshots. When you turn off blob versioning, you can't create new versions.

After you disable versioning, modifying the current version creates a blob that isn't a version. All subsequent updates to the blob overwrite its data without saving the previous state. All existing versions persist as previous versions.

You can read or delete versions by using the version ID after versioning is disabled. You can also list a blob's versions after versioning is disabled.

Object replication relies on blob versioning. Before you can disable blob versioning, you must delete any object replication policies on the account. For more information about object replication, see [Object replication for block blobs](object-replication-overview.md).

The following diagram shows how modifying a blob after versioning is disabled creates a blob that isn't versioned. Any existing versions associated with the blob persist.

:::image type="content" source="media/versioning-overview/modify-base-blob-versioning-disabled.png" alt-text="Diagram showing that modification of a current version after versioning is disabled creates a blob that isn't a version.":::

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)] 

Blob versioning is available for standard general-purpose v2, premium block blob, and legacy Blob storage accounts. Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage aren't currently supported.

Version 2019-10-10 and higher of the Azure Storage REST API supports blob versioning.

Versioning isn't supported for blobs that you upload by using [Data Lake Storage](/rest/api/storageservices/data-lake-storage-gen2) APIs.

## Authorize operations on blob versions

You can authorize access to blob versions by using one of the following approaches:

- Use Azure role-based access control (Azure RBAC) to grant permissions to a Microsoft Entra security principal. Microsoft recommends using Microsoft Entra ID for superior security and ease of use. For more information about using Microsoft Entra ID with blob operations, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).
- Use a shared access signature (SAS) to delegate access to blob versions. Specify the version ID for the signed resource type `bv`, which represents a blob version, to create a SAS token for operations on a specific version. For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).
- Use the account access keys to authorize operations against blob versions by using Shared Key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key).

Blob versioning is designed to protect your data from accidental or malicious deletion. To enhance protection, deleting a blob version requires special permissions. The following sections describe the permissions needed to delete a blob version.

### Azure RBAC action to delete a blob version

The following table shows which Azure RBAC actions support deleting a blob or a blob version.

| Description | Blob service operation | Azure RBAC data action required | Azure built-in role support |
|----------------------------------------------|------------------------|---------------------------------------------------------------------------------------|-------------------------------|
| Deleting the current version | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete** | Storage Blob Data Contributor |
| Deleting a previous version | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action** | Storage Blob Data Owner |

### Shared access signature (SAS) parameters

The signed resource for a blob version is `bv`. For more information, see [Create a service SAS](/rest/api/storageservices/create-service-sas) or [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

The following table shows the permission required on a SAS to delete a blob version.

| **Permission** | **URI symbol** | **Allowed operations** |
|----------------|----------------|------------------------|
| Delete         | x              | Delete a blob version. |

## Existing workload considerations

- **Deleting a blob no longer frees space.** When you enable versioning, deleting a blob doesn't remove its data. The current version becomes a previous version that persists and continues to incur charges. Workloads that rely on delete operations to reclaim storage keep incurring charges until you explicitly delete those versions.

- **Overwrite-heavy workloads can accumulate versions.** Versions persist until you explicitly delete them. This persistence can lead to an accumulation of versions if you don't manage them properly. To reduce costs, make block-level changes to be charged at the block level across versions, minimizing per-version costs. 

## Feature interactions

### Soft delete

Blob versioning and blob soft delete are part of the recommended data protection configuration for storage accounts. For more information about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

#### Overwriting a blob

If you enable both blob versioning and blob soft delete for a storage account, then overwriting a blob automatically creates a new previous version that reflects the blob's state before the write operation. The new version isn't soft-deleted and persists until explicitly deleted. No soft-deleted snapshots are created.

#### Deleting a blob or version

If you enable both versioning and soft delete for a storage account, when you delete a blob, the current version of the blob becomes a previous version. The operation doesn't create a new version or any soft-deleted snapshots. The soft delete retention period doesn't apply to the deleted blob.

Soft delete offers extra protection when deleting blob versions. When you delete a previous version of the blob, the operation soft-deletes that version. The soft-deleted version is preserved until the soft delete retention period elapses, at which point it's permanently deleted.

To delete a previous version of a blob, call the **Delete Blob** operation and specify the version ID.

#### Restoring a soft-deleted version

Use the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation to restore soft-deleted versions during the soft delete retention period. The **Undelete Blob** operation always restores all soft-deleted versions of the blob. You can't restore only a single soft-deleted version.

Restoring soft-deleted versions by using the **Undelete Blob** operation doesn't promote any version to be the current version. To restore the current version, first restore all soft-deleted versions, and then use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a previous version to a new current version.

After the soft-delete retention period elapses, the system permanently deletes any soft-deleted blob versions.

### Blob snapshots

A blob snapshot is a read-only copy of a blob taken at a specific point in time. Blob snapshots and blob versions are similar, but you or your application manually create a snapshot, while a blob version is automatically created on a write or delete operation when you enable blob versioning for your storage account.



> [!IMPORTANT]
> After you enable blob versioning, update your application to stop taking snapshots of block blobs. If you enable versioning for your storage account, versions capture and preserve all block blob updates and deletions. Taking snapshots doesn't offer any extra protection to your block blob data if blob versioning is enabled, and it might increase costs and application complexity.

#### Snapshot a blob when versioning is enabled

Although it's not recommended, you can take a snapshot of a blob that is also versioned. If you can't update your application to stop taking snapshots of blobs when you enable versioning, your application can support both snapshots and versions.

When you take a snapshot of a versioned blob, you create a new version at the same time as the snapshot. You also create a new current version when you take a snapshot.

The following diagram shows what happens when you take a snapshot of a versioned blob. In the diagram, blob versions and snapshots with version ID 2 and 3 contain identical data.

![Diagram showing snapshots of a versioned blob.](media/versioning-overview/snapshot-versioned-blob.png)

## Known limitations

- **Not supported on hierarchical namespace (Azure Data Lake Storage) accounts,** or for blobs uploaded by using Data Lake Storage APIs.

- **Doesn't protect against container or account deletion.** Versioning works at the blob level only. Deleting a container removes all blobs and their versions. Recovering from that deletion requires container soft delete. Protecting against account deletion requires a resource lock.

- **Versions are immutable.** You can't change the content or metadata of an existing version.

- **All versions of a blob must be the same blob type.** You can't overwrite a blob with a different blob type while it has previous versions unless you first delete the blob and all its versions.

- **Not all writes create a version.** Reference the information earlier in this article outlining the exceptions. To capture those states, use a manual snapshot.

- **Can't disable versioning while object replication policies exist** on the account. You must delete all object replication policies first.

- **`Undelete Blob` restores all soft-deleted versions of a blob, not a single one.** You can't selectively undelete one version. Undelete never promotes a version to current.

- **Recommended ceiling of 1,000 versions per blob.** Exceeding it degrades blob listing performance.

## Pricing and billing

When you enable blob versioning, you might incur extra data storage charges. When you design your application, consider how these charges might add up so you can keep costs low.

You are billed for blob versions, like blob snapshots, at the same rate as active data. How you are billed for versions depends on whether you explicitly set the tier for the current or previous versions of a blob (or snapshots). For more information about blob tiers, see [Hot, Cool, Cold, and Archive access tiers for blob data](access-tiers-overview.md).

If you don't change a blob or version's tier, you are billed for unique blocks of data across that blob, its versions, and any snapshots it might have. For more information, see [Billing when the blob tier isn't explicitly set](#billing-when-you-dont-explicitly-set-the-blob-tier).

If you change a blob or version's tier, you are billed for the entire object, regardless of whether the blob and version end up in the same tier again. For more information, see [Billing when the blob tier is explicitly set](#billing-when-you-dont-explicitly-set-the-blob-tier).

> [!NOTE]
> If you enable versioning for data that you frequently overwrite, you might see increased storage capacity charges and increased latency during listing operations. To address these concerns, store frequently overwritten data in a separate storage account with versioning disabled.
> 
> If you enable versions on storage accounts that are backed up frequently, you might trigger data retrieval charges when the versions are stored on cool or cold access tiers.

For more information about billing details for blob snapshots, see [Blob snapshots](snapshots-overview.md).

For storage accounts that use smart tier, you pay for versions and snapshots at full content length. For more information, see [Optimize costs with smart tier](access-tiers-smart.md).

### Billing when you don't explicitly set the blob tier

If you don't explicitly set the blob tier for any versions of a blob, you're billed for unique blocks or pages across all versions, and any snapshots it might have. You are billed for data that is shared across blob versions only once. When you update a blob, the data in the new current version diverges from the data stored in previous versions, so you are billed for the unique data per block or page.

When you replace a block within a block blob, you are billed for that block as a unique block. This rule applies even if the block has the same block ID and the same data as it had in the previous version. After you commit the block again, it diverges from its counterpart in the previous version, and you are billed for its data. The same rule applies to a page in a page blob that you update with identical data.

Blob storage doesn't have a way to determine whether two blocks contain identical data. Each block that you upload and commit is treated as unique, even if it has the same data and the same block ID. Because you are billed for unique blocks, keep in mind that updating a blob when versioning is enabled results in extra unique blocks and extra charges.

When you enable blob versioning, call update operations on block blobs so that they update the least possible number of blocks. The write operations that permit fine-grained control over blocks are [Put Block](/rest/api/storageservices/put-block) and [Put Block List](/rest/api/storageservices/put-block-list). [Put Block](/rest/api/storageservices/put-block) stages the changes, but the actual modification and version creation happens on the [Put Block List](/rest/api/storageservices/put-block-list) operation. The [Put Blob](/rest/api/storageservices/put-blob) operation, on the other hand, replaces the entire contents of a blob and so might lead to extra charges.

The following scenarios demonstrate how charges accrue for a block blob and its versions when you don't explicitly set the blob tier.

#### Scenario 1

In scenario 1, the blob has a previous version. The blob isn't updated since the version was created, so you incur charges only for unique blocks 1, 2, and 3.

:::image type="content" source="./media/versioning-overview/versions-billing-scenario-1.png" alt-text="Diagram 1 showing billing for unique blocks in base blob and previous version.":::

#### Scenario 2

In scenario 2, one block (block 3 in the diagram) in the blob is updated. Even though the updated block contains the same data and the same ID, it isn't the same as block 3 in the previous version. As a result, the account is charged for four blocks.

:::image type="content" source="./media/versioning-overview/versions-billing-scenario-2.png" alt-text="Diagram 2 showing billing for unique blocks in base blob and previous version.":::

#### Scenario 3

In scenario 3, the blob is updated, but the version isn't. Block 3 is replaced with block 4 in the current blob, but the previous version still reflects block 3. As a result, the account is charged for four blocks.

:::image type="content" source="./media/versioning-overview/versions-billing-scenario-3.png" alt-text="Diagram 3 showing billing for unique blocks in base blob and previous version.":::

#### Scenario 4

In scenario 4, the current version is completely updated and contains none of its original blocks. As a result, the account is charged for all eight unique blocks - four in the current version, and four combined in the two previous versions. This scenario can occur if you write to a blob by using the [Put Blob](/rest/api/storageservices/put-blob) operation, because it replaces the entire contents of the blob.

:::image type="content" source="./media/versioning-overview/versions-billing-scenario-4.png" alt-text="Diagram 4 showing billing for unique blocks in base blob and previous version.":::

### Billing when you explicitly set the blob tier

If you explicitly set the blob tier for a blob, version, or snapshot, you pay for the full content length of the object in the new tier, regardless of whether it shares blocks with an object in the original tier. You also pay for the full content length of the oldest version in the original tier. For any other previous versions or snapshots that remain in the original tier, you pay for unique blocks they share, as described in [Billing when the blob tier isn't explicitly set](#billing-when-you-dont-explicitly-set-the-blob-tier).

#### Moving a blob to a new tier

The following table describes the billing behavior for a blob or version when you move it to a new tier.

| When you set the blob tier… | Then you're billed for... |
|-|-|
| Explicitly set on a version, whether current or previous | The full content length of that version. Versions that don't have an explicitly set tier are billed only for unique blocks.<sup>1</sup> |
| Set to archive | The full content length of all versions and snapshots.<sup>1</sup> |

<sup>1</sup>If there are other previous versions or snapshots that you didn't move from their original tier, those versions or snapshots are charged based on the number of unique blocks they contain, as described in [Billing when the blob tier isn't explicitly set](#billing-when-you-dont-explicitly-set-the-blob-tier).

The following diagram illustrates how objects are billed when you move a versioned blob to a different tier.

:::image type="content" source="media/versioning-overview/versioning-billing-tiers.png" alt-text="Diagram showing how objects are billed when a versioned blob is explicitly tiered.":::

You can't undo explicitly setting the tier for a blob, version, or snapshot. If you move a blob to a new tier and then move it back to its original tier, you pay for the full content length of the object even if it shares blocks with other objects in the original tier.

Operations that explicitly set the tier of a blob, version, or snapshot include:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)
- [Put Blob](/rest/api/storageservices/put-blob) with tier specified
- [Put Block List](/rest/api/storageservices/put-block-list) with tier specified
- [Copy Blob](/rest/api/storageservices/copy-blob) with tier specified

#### Deleting a blob when soft delete is enabled

When you enable blob soft delete, you pay for all soft-deleted entities at the same rate as live data. If you delete or overwrite a current version that you explicitly set the tier for, you pay for any previous versions of the soft-deleted blob at full content length. For more information about how blob versioning and soft delete work together, see [Feature interactions](#feature-interactions).

## Monitoring and troubleshooting

- **My LCM policy isn't deleting versions when I expect:** A version's age is based on when you originally wrote its data, not when it became a previous version. The clock starts at blob creation, not at the overwrite that pushed it into version history. As a result, a blob that stayed current for a long time before being overwritten can produce a previous version that already exceeds your `daysAfterCreationGreaterThan` threshold the moment it's created, causing it to be deleted almost immediately. Conversely, versions of recently created blobs can persist longer than expected. To confirm, check the actual creation timestamp on the versions rather than assuming it matches the overwrite time. If you need to base retention on when a version became noncurrent or want more granular control than lifecycle management's day-based thresholds allow, consider using Azure Storage Actions instead. For more information, see [Storage Actions](../../storage-actions/overview.md).

- **My bill is still high after disabling versions:** Existing versions remain until you manually delete them. 

- **I can't disable versioning.** Object replication might be configured on the account. Delete all object replication policies first, and then disable versioning. Alternatively, an Immutability (WORM) policy might exist on a container or the account of which versioning can't be disabled. 

## See also

- [Enable and manage blob versioning](versioning-enable.md)
- [Creating a snapshot of a blob](/rest/api/storageservices/creating-a-snapshot-of-a-blob)
- [Soft delete for blobs](./soft-delete-blob-overview.md)
- [Soft delete for containers](soft-delete-container-overview.md)

