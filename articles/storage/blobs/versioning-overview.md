---
title: Blob versioning (preview)
titleSuffix: Azure Storage
description: Blob storage versioning (preview) automatically maintains prior versions of an object and identifies them with timestamps. You can restore a prior version of a blob to recover your data if it is erroneously modified or deleted.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 04/02/2020
ms.author: tamram
ms.subservice: blobs
---

# Blob versioning (preview)

Blob storage versioning (preview) automatically maintains prior versions of an object and identifies them with timestamps. You can restore a prior version of a blob to recover your data if it is erroneously modified or deleted.

After you enable blob versioning for a storage account, blob versions are automatically maintained for every blob in the storage account. Microsoft recommends using blob versioning to maintain prior versions of a blob for superior data protection. Blob snapshots also maintain prior versions of a blob, but they must be maintained manually by your application.

> [!IMPORTANT]
> Blob versioning cannot help you to recover from the accidental deletion of a storage account or container. To prevent accidental deletion of the storage account, configure a **CannotDelete** lock on the storage account resource. For more information on locking Azure resources, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).

## How blob versioning works

When blob versioning is enabled for a storage account, Azure Storage automatically creates a new version of a blob each time that blob is modified or deleted. A version captures a committed blob state at a given point in time.

Blob versions are immutable. You cannot modify the content or metadata of an existing blob version.

The most recent write operation creates the current version of the blob. A prior version preserves the state of a blob at an earlier point in time.

### Version ID

Each blob version is identified by a version ID. The value of the version ID is the timestamp at which the blob was written or updated. The version ID is assigned at the time that the version is created.

You can provide the version ID on read or delete operations to perform the operation on a specific version. Any operation on a blob that omits the version ID acts on the base blob.

When you call a write operation to create or modify a blob, Azure Storage returns the *x-ms-version-id* header in the response. This header contains the version ID for the current version of the base blob that was created by the write operation.

The version ID remains the same for the lifetime of the version.

### Versioning on write operations

When blob versioning is turned on, each write operation to a blob creates a new version. Write operations include [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), [Copy Blob](/rest/api/storageservices/copy-blob), and [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata).

If the write operation creates a new blob, then the resulting blob is the current version of the blob. If the write operation modifies an existing blob, then the new data is captured in the updated blob, which is the current version, and Azure Storage creates a new version that saves the blob's previous state.

For simplicity, the diagrams shown in this article display the version ID as a simple integer value. In reality, the version ID is a timestamp. The current version is shown in blue, and previous versions are shown in gray.

The following diagram shows how write operations affect blob versions. When a blob is created, that blob is the current version. When the same blob is modified, a new version is created to save the blob's previous state, and the updated blob becomes the current version.

:::image type="content" source="media/versioning-overview/write-operations-blob-versions.png" alt-text="Diagram showing how write operations affect versioned blobs":::

> [!NOTE]
> A blob that was created prior to versioning being enabled for the storage account does not have a version ID. When that blob is modified, the modified blob becomes the current version, and a version is created to save the blob's state before the update. The version is assigned a version ID that is its creation time.

### Versioning on delete operations

A [Delete Blob](/rest/api/storageservices/delete-blob) operation acts on the current version. When you delete a blob that is versioned, the current version no longer exists. Azure Storage creates a version to save the state of the blob prior to deletion. All existing versions of the blob are preserved when the blob is deleted.

You can also delete a specific version of the blob by specifying its version ID. However, you cannot delete the current version using its version ID.

The following diagram shows the effect of a delete operation on a versioned blob. The current version blob is deleted, but the prior versions persist.

:::image type="content" source="media/versioning-overview/delete-versioned-base-blob.png" alt-text="Diagram showing deletion of versioned base blob":::

Writing new data to the base blob creates a new version of the blob. Any existing versions are unaffected, as shown in the following diagram.

:::image type="content" source="media/versioning-overview/recreate-deleted-base-blob.png" alt-text="Diagram showing re-creation of deleted base blob":::

### Blob types

When blob versioning is enabled for a storage account, all write and delete operations on block blobs trigger the creation of a new version.

For page blobs and append blobs, only a subset of write and delete operations trigger the creation of a version. These operations include the [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), [Delete Blob](/rest/api/storageservices/delete-blob), [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), and [Copy Blob](/rest/api/storageservices/copy-blob) operations. A [Put Page](/rest/api/storageservices/put-page) operation on a page blob or an [Append Block](/rest/api/storageservices/append-block) operation on an append blob does not trigger the creation of a new version. To capture changes from those operations, take a manual snapshot.

All versions of a blob must be of the same blob type. For more information on blob types, see [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

When blob versioning is enabled, you cannot overwrite a blob of one type with another type unless you first delete the blob and all its versions.

### Access tiers

You can move any version of a blob, including the current version, to a different blob access tier by calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation. You can take advantage of lower capacity pricing by moving older versions of a blob to the cool or archive tier. For more information, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).

To automate the process of moving blobs to the appropriate tier, use blob life cycle management. For more information on life cycle management, see [Manage the Azure Blob storage life cycle](storage-lifecycle-management-concepts.md).

## Enable or disable blob versioning

To learn how to enable or disable blob versioning, see [Enable or disable blob versioning](versioning-manage.md).

Disabling blob versioning does not delete existing blobs, versions, or snapshots. When you turn off blob versioning, any existing versions remain accessible in your storage account. No new versions are subsequently created.

If a blob was created or modified after versioning was disabled on the storage account, then overwriting the blob creates a new version. The updated blob is no longer the current version and does not have a version ID. All subsequent updates to the blob will overwrite its data without saving the previous state.

You can read or delete versions using the version ID after versioning is disabled. You can also list a blob's versions after versioning is disabled.

The following diagram shows how modifying a blob after versioning is disabled creates a blob that is not versioned. Any existing versions associated with the blob persist.

:::image type="content" source="media/versioning-overview/modify-base-blob-versioning-disabled.png" alt-text="Diagram showing base blob modified after versioning disabled":::

## Blob versioning and soft delete

Blob versioning and blob soft delete work together to provide you with optimal data protection. For more information about blob soft delete, see [Soft delete for Azure Storage blobs](storage-blob-soft-delete.md).

When you enable soft delete, you specify the retention period for soft-deleted data. Any deleted blob version remains in the system and can be undeleted within the soft delete retention period.

When both blob versioning and blob soft delete are enabled, modifying or deleting a blob creates a new version instead of a soft-deleted snapshot. This  version is not in the soft-deleted state, so it is not subject to the retention period for soft-deleted data and is not deleted permanently when the retention period elapses.

To remove a version, explicitly delete it using the version ID. When a version is deleted while soft delete is enabled, that version becomes a soft-deleted version. Soft-deleted versions are permanently deleted after the soft delete retention period has expired. The following image shows how a version is deleted when soft delete is enabled.

:::image type="content" source="media/versioning-overview/soft-delete-historical-version.png" alt-text="Diagram showing deletion of a version with soft delete enabled":::

You can restore a soft-deleted blob version by calling the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation during the soft delete retention period. Once the retention period has elapsed, the blob version is permanently deleted.

## Blob versioning and blob snapshots

A blob snapshot is a read-only copy of a blob that's taken at a specific point in time. Blob snapshots and blob versions are similar, but a snapshot is created manually by you or your application, while a blob version is created automatically on a write or delete operation when blob versioning is enabled for your storage account.

> [!IMPORTANT]
> Microsoft recommends that after you enable blob versioning, you also update your application to stop taking snapshots of block blobs. If versioning is enabled for your storage account, all block blob updates and deletions are captured and preserved by versions. Taking snapshots does not offer any additional protections to your block blob data if blob versioning is enabled, and may increase costs and application complexity.

### Snapshot a blob when versioning is enabled

Although it is not recommended, you can take a snapshot of a blob that is also versioned. If you cannot update your application to stop taking snapshots of block blobs when you enable versioning, your application can support both snapshots and versions.

When you take a snapshot of a versioned blob, a new version is created at the same time that the snapshot is created. A new current version is also created when a snapshot is taken.

The following diagram shows what happens when you take a snapshot of a versioned blob. In the diagram, blob versions and snapshots with version ID 2 and 3 contain identical data.

???need to discuss this image with Yuan - it's confusing - which version is the snapshot associated with? can we change the snapshot ID?

:::image type="content" source="media/versioning-overview/snapshot-versioned-blob.png" alt-text="Diagram showing snapshots of a versioned blob ":::

## Authorize operations on blob versions

You can authorize access to blob versions using one of the following approaches:

- By using role-based access control (RBAC) to grant permissions to an Azure Active Directory (Azure AD) security principal. Microsoft recommends using Azure AD for superior security and ease of use. For more information about using Azure AD with blob operations, see [Authorize access to blobs and queues using Azure Active Directory](../common/storage-auth-aad.md).
- By using a shared access signature (SAS) to delegate access to blob versions. Specify the version ID for the signed resource type `bv`, representing a blob version, to create a SAS token for operations on a specific version. For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).
- By using the account access keys to authorize operations against blob versions with Shared Key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key).

Blob versioning is designed to protect your data from accidental or malicious deletion. To enhance protection, deleting a blob version requires special permissions. The following sections describe the permissions needed to delete a blob version.

### RBAC action to delete a blob version

The following table shows which RBAC actions support deleting a base blob or a blob version.

| Description | Blob service operation | RBAC data action required | RBAC built-in role support |
|----------------------------------------------|------------------------|---------------------------------------------------------------------------------------|-------------------------------|
| Deleting the current version of the blob | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete/actionDeleting** | Storage Blob Data Contributor |
| Deleting a version | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/** | Storage Blob Data Owner |

### SAS permission to delete a blob version

The following table shows the permission required on a SAS to delete a blob version.

| **Permission** | **URI symbol** | **Allowed operations** |
|----------------|----------------|------------------------|
| Delete         | x              | Delete a blob version. |

## About the preview

Blob versioning is available in preview in the following regions:

- West US 2
- West Central US

The preview is intended for non-production use only.

Version 2019-10-19 of the Azure Storage REST API supports blob versioning.

### Storage account support

Blob versioning is available for the following types of storage accounts:

- General-purpose v2 storage accounts
- Block blob storage accounts
- Blob storage accounts

If your storage account is a general-purpose v1 account, use the Azure portal to upgrade to a general-purpose v2 account. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).

Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage Gen2 are not currently supported.

## Pricing and billing

Enabling blob versioning can result in additional data storage charges to your account. When designing your application, it is important to be aware of how these charges might accrue so that you can minimize costs.

Blob versions, like blob snapshots, are billed at the same rate as active data. If a version shares blocks or pages with its base blob, then you pay only for any additional blocks or pages that are not shared between the version and the base blob.

> [!NOTE]
> Enabling versioning for data that is frequently overwritten may result in increased storage capacity charges and increased latency during listing operations. To mitigate these concerns, store frequently overwritten data in a separate storage account with versioning disabled.

### Important billing considerations

Make sure to consider the following points when enabling blob versioning:

- Your storage account incurs charges for unique blocks or pages, whether they are in the blob or in a previous version of the blob. Your account does not incur additional charges for versions associated with a blob until you update the blob on which they are based. After you update the blob, it diverges from its previous versions. When this happens, you are charged for the unique blocks or pages in each blob or version.
- When you replace a block within a block blob, that block is subsequently charged as a unique block. This is true even if the block has the same block ID and the same data as it has in the version. After the block is committed again, it diverges from its counterpart in any version, and you will be charged for its data. The same holds true for a page in a page blob that's updated with identical data.
- Blob storage does not have a means to determine whether two blocks contain identical data. Each block that is uploaded and committed is treated as unique, even if it has the same data and the same block ID. Because charges accrue for unique blocks, it's important to consider that updating a blob when versioning is enabled will result in additional unique blocks and additional charges.
- When blob versioning is enabled, design update operations on block blobs so that they update the least possible number of blocks. The write operations that permit fine-grained control over blocks are [Put Block](/rest/api/storageservices/put-block) and [Put Block List](/rest/api/storageservices/put-block-list). The [Put Blob](/rest/api/storageservices/put-blob) operation, on the other hand, replaces the entire contents of a blob and so may lead to additional charges.

### Versioning billing scenarios

The following scenarios demonstrate how charges accrue for a block blob and its versions.

#### Scenario 1

In scenario 1, the blob has a prior version. The blob has not been updated since the version was created, so charges are incurred only for unique blocks 1, 2, and 3.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-1.png)

#### Scenario 2

In scenario 2, one block (block 3 in the diagram) in the blob has been updated. Even though the updated block contains the same data and the same ID, it is not the same as block 3 in the previous version. As a result, the account is charged for four blocks. ???here, the blob shown in #1 should have two versions - do we want to show that here?

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-2.png)

#### Scenario 3

In scenario 3, the blob has been updated, but the version has not. Block 3 was replaced with block 4 in the base blob, but the previous version still reflects block 3. As a result, the account is charged for four blocks.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-3.png)

#### Scenario 4

In scenario 4, the base blob has been completely updated and contains none of its original blocks. As a result, the account is charged for all eight unique blocks -- four in the base blob, and four in the previous version. This scenario can occur if you are using an update method such as [UploadFromFile][dotnet_UploadFromFile], [UploadText][dotnet_UploadText], [UploadFromStream][dotnet_UploadFromStream], or [UploadFromByteArray][dotnet_UploadFromByteArray], because these methods replace all of the contents of a blob.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-4.png)

## See also

- [Enable blob versioning](versioning-manage.md)
- [Creating a snapshot of a blob](/rest/api/storageservices/creating-a-snapshot-of-a-blob)
- [Soft delete for Azure Storage Blobs](storage-blob-soft-delete.md)
