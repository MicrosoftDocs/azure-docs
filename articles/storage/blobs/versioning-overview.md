---
title: Blob versioning (preview)
titleSuffix: Azure Storage
description: Blob storage versioning (preview) automatically maintains prior versions of an object and identifies them with timestamps. You can restore  prior versions of a blob to recover your data if it is erroneously modified or deleted.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/05/2020
ms.author: tamram
ms.subservice: blobs
---

# Blob versioning (preview)

You can enable Blob storage versioning (preview) to automatically maintain previous versions of an object.  When blob versioning is enabled, you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted.

Blob versioning is enabled on the storage account and applies to all blobs in the storage account. After you enable blob versioning for a storage account, Azure Storage automatically maintains versions for every blob in the storage account.

Microsoft recommends using blob versioning to maintain previous versions of a blob for superior data protection. When possible, use blob versioning instead of blob snapshots to maintain previous versions. Blob snapshots provide similar functionality in that they maintain earlier versions of a blob, but snapshots must be maintained manually by your application.

> [!IMPORTANT]
> Blob versioning cannot help you to recover from the accidental deletion of a storage account or container. To prevent accidental deletion of the storage account, configure a **CannotDelete** lock on the storage account resource. For more information on locking Azure resources, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).

## How blob versioning works

A version captures the state of a blob at a given point in time. When blob versioning is enabled for a storage account, Azure Storage automatically creates a new version of a blob each time that blob is modified or deleted.

When you create a blob with versioning enabled, the new blob is the current version of the blob (or the base blob). If you subsequently modify that blob, Azure Storage creates a version that captures the state of the blob before it was modified. The modified blob becomes the new current version. A new version is created each time you modify the blob.

When you delete a blob with versioning enabled, Azure Storage creates a version that captures the state of the blob before it was deleted. The current version of the blob is then deleted, but the blob's versions persist, so that it can be re-created if needed. 

Blob versions are immutable. You cannot modify the content or metadata of an existing blob version.

### Version ID

Each blob version is identified by a version ID. The value of the version ID is the timestamp at which the blob was written or updated. The version ID is assigned at the time that the version is created.

You can perform read or delete operations on a specific version of a blob by providing its version ID. If you omit the version ID, the operation acts against the current version (the base blob).

When you call a write operation to create or modify a blob, Azure Storage returns the *x-ms-version-id* header in the response. This header contains the version ID for the current version of the blob that was created by the write operation.

The version ID remains the same for the lifetime of the version.

### Versioning on write operations

When blob versioning is turned on, each write operation to a blob creates a new version. Write operations include [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), [Copy Blob](/rest/api/storageservices/copy-blob), and [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata).

If the write operation creates a new blob, then the resulting blob is the current version of the blob. If the write operation modifies an existing blob, then the new data is captured in the updated blob, which is the current version, and Azure Storage creates a version that saves the blob's previous state.

For simplicity, the diagrams shown in this article display the version ID as a simple integer value. In reality, the version ID is a timestamp. The current version is shown in blue, and previous versions are shown in gray.

The following diagram shows how write operations affect blob versions. When a blob is created, that blob is the current version. When the same blob is modified, a new version is created to save the blob's previous state, and the updated blob becomes the current version.

:::image type="content" source="media/versioning-overview/write-operations-blob-versions.png" alt-text="Diagram showing how write operations affect versioned blobs":::

> [!NOTE]
> A blob that was created prior to versioning being enabled for the storage account does not have a version ID. When that blob is modified, the modified blob becomes the current version, and a version is created to save the blob's state before the update. The version is assigned a version ID that is its creation time.

### Versioning on delete operations

When you delete a blob, the current version of the blob becomes a previous version, and the base blob is deleted. All existing previous versions of the blob are preserved when the blob is deleted.

Calling the [Delete Blob](/rest/api/storageservices/delete-blob) operation without a version ID deletes the base blob. To delete a specific version, provide the ID for that version on the delete operation.

The following diagram shows the effect of a delete operation on a versioned blob:

:::image type="content" source="media/versioning-overview/delete-versioned-base-blob.png" alt-text="Diagram showing deletion of versioned blob":::

Writing new data to the blob creates a new version of the blob. Any existing versions are unaffected, as shown in the following diagram.

:::image type="content" source="media/versioning-overview/recreate-deleted-base-blob.png" alt-text="Diagram showing re-creation of versioned blob after deletion":::

### Blob types

When blob versioning is enabled for a storage account, all write and delete operations on block blobs trigger the creation of a new version, with the exception of the [Put Block](/rest/api/storageservices/put-block) operation.

For page blobs and append blobs, only a subset of write and delete operations trigger the creation of a version. These operations include:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Delete Blob](/rest/api/storageservices/delete-blob)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Copy Blob](/rest/api/storageservices/copy-blob)

The following operations do not trigger the creation of a new version. To capture changes from those operations, take a manual snapshot:

- [Put Page](/rest/api/storageservices/put-page) (page blob)
- [Append Block](/rest/api/storageservices/append-block) (append blob)

All versions of a blob must be of the same blob type. If a blob has previous versions, you cannot overwrite a blob of one type with another type unless you first delete the blob and all its versions.

### Access tiers

You can move any version of a block blob, including the current version, to a different blob access tier by calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation. You can take advantage of lower capacity pricing by moving older versions of a blob to the cool or archive tier. For more information, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).

To automate the process of moving block blobs to the appropriate tier, use blob life cycle management. For more information on life cycle management, see [Manage the Azure Blob storage life cycle](storage-lifecycle-management-concepts.md).

## Enable or disable blob versioning

To learn how to enable or disable blob versioning, see [Enable or disable blob versioning](versioning-enable.md).

Disabling blob versioning does not delete existing blobs, versions, or snapshots. When you turn off blob versioning, any existing versions remain accessible in your storage account. No new versions are subsequently created.

If a blob was created or modified after versioning was disabled on the storage account, then overwriting the blob creates a new version. The updated blob is no longer the current version and does not have a version ID. All subsequent updates to the blob will overwrite its data without saving the previous state.

You can read or delete versions using the version ID after versioning is disabled. You can also list a blob's versions after versioning is disabled.

The following diagram shows how modifying a blob after versioning is disabled creates a blob that is not versioned. Any existing versions associated with the blob persist.

:::image type="content" source="media/versioning-overview/modify-base-blob-versioning-disabled.png" alt-text="Diagram showing base blob modified after versioning disabled":::

## Blob versioning and soft delete

Blob versioning and blob soft delete work together to provide you with optimal data protection. When you enable soft delete, you specify how long Azure Storage should retain a soft-deleted blob. Any soft-deleted blob version remains in the system and can be undeleted within the soft delete retention period. For more information about blob soft delete, see [Soft delete for Azure Storage blobs](storage-blob-soft-delete.md).

### Deleting a blob or version

Soft delete offers additional protection for deleting blob versions. If both versioning and soft delete are enabled on the storage account, then when you delete a blob, Azure Storage creates a new version to save the state of the blob immediately prior to deletion and deletes the current version. The new version is not soft-deleted and is not removed when the soft-delete retention period expires.

When you delete a previous version of the blob, the version is soft-deleted. The soft-deleted version is retained throughout the retention period specified in the soft delete settings for the storage account and is permanently deleted when the soft delete retention period expires.

To remove a previous version of a blob, explicitly delete it by specifying the version ID.

The following diagram shows what happens when you delete a blob or a blob version.

:::image type="content" source="media/versioning-overview/soft-delete-historical-version.png" alt-text="Diagram showing deletion of a version with soft delete enabled":::

If both versioning and soft delete are enabled on a storage account, then no soft-deleted snapshot is created when a blob or blob version is modified or deleted.

### Restoring a soft-deleted version

You can restore a soft-deleted blob version by calling the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation on the version while the soft delete retention period is in effect. The **Undelete Blob** operation restores all soft-deleted versions of the blob.

Restoring soft-deleted versions with the **Undelete Blob** operation does not promote any version to be the current version. To restore the current version, first restore all soft-deleted versions, and then use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a previous version to restore the blob.

The following diagram shows how to restore soft-deleted blob versions with the **Undelete Blob** operation, and how to restore the current version of the blob with the **Copy Blob** operation.

:::image type="content" source="media/versioning-overview/undelete-version.png" alt-text="Diagram showing how to restore soft-deleted versions":::

After the soft-delete retention period has elapsed, any soft-deleted blob versions are permanently deleted.

## Blob versioning and blob snapshots

A blob snapshot is a read-only copy of a blob that's taken at a specific point in time. Blob snapshots and blob versions are similar, but a snapshot is created manually by you or your application, while a blob version is created automatically on a write or delete operation when blob versioning is enabled for your storage account.

> [!IMPORTANT]
> Microsoft recommends that after you enable blob versioning, you also update your application to stop taking snapshots of block blobs. If versioning is enabled for your storage account, all block blob updates and deletions are captured and preserved by versions. Taking snapshots does not offer any additional protections to your block blob data if blob versioning is enabled, and may increase costs and application complexity.

### Snapshot a blob when versioning is enabled

Although it is not recommended, you can take a snapshot of a blob that is also versioned. If you cannot update your application to stop taking snapshots of blobs when you enable versioning, your application can support both snapshots and versions.

When you take a snapshot of a versioned blob, a new version is created at the same time that the snapshot is created. A new current version is also created when a snapshot is taken.

The following diagram shows what happens when you take a snapshot of a versioned blob. In the diagram, blob versions and snapshots with version ID 2 and 3 contain identical data.

:::image type="content" source="media/versioning-overview/snapshot-versioned-blob.png" alt-text="Diagram showing snapshots of a versioned blob ":::

## Authorize operations on blob versions

You can authorize access to blob versions using one of the following approaches:

- By using role-based access control (RBAC) to grant permissions to an Azure Active Directory (Azure AD) security principal. Microsoft recommends using Azure AD for superior security and ease of use. For more information about using Azure AD with blob operations, see [Authorize access to blobs and queues using Azure Active Directory](../common/storage-auth-aad.md).
- By using a shared access signature (SAS) to delegate access to blob versions. Specify the version ID for the signed resource type `bv`, representing a blob version, to create a SAS token for operations on a specific version. For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).
- By using the account access keys to authorize operations against blob versions with Shared Key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key).

Blob versioning is designed to protect your data from accidental or malicious deletion. To enhance protection, deleting a blob version requires special permissions. The following sections describe the permissions needed to delete a blob version.

### RBAC action to delete a blob version

The following table shows which RBAC actions support deleting a blob or a blob version.

| Description | Blob service operation | RBAC data action required | RBAC built-in role support |
|----------------------------------------------|------------------------|---------------------------------------------------------------------------------------|-------------------------------|
| Deleting the current version of the blob | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete** | Storage Blob Data Contributor |
| Deleting a version | Delete Blob | **Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action** | Storage Blob Data Owner |

### Shared access signature (SAS) parameters

The signed resource for a blob version is `bv`. For more information, see [Create a service SAS](/rest/api/storageservices/create-service-sas) or [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

The following table shows the permission required on a SAS to delete a blob version.

| **Permission** | **URI symbol** | **Allowed operations** |
|----------------|----------------|------------------------|
| Delete         | x              | Delete a blob version. |

## About the preview

Blob versioning is available in preview in the following regions:

- France Central
- Canada East
- Canada Central

The preview is intended for non-production use only.

Version 2019-10-10 and higher of the Azure Storage REST API supports blob versioning.

### Storage account support

Blob versioning is available for the following types of storage accounts:

- General-purpose v2 storage accounts
- Block blob storage accounts
- Blob storage accounts

If your storage account is a general-purpose v1 account, use the Azure portal to upgrade to a general-purpose v2 account. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).

Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage Gen2 are not currently supported.

### Register for the preview

To enroll in the blob versioning preview, use PowerShell or Azure CLI to submit a request to register the feature with your subscription. After your request is approved, you can enable blob versioning with any new or existing general-purpose v2, Blob storage, or premium block blob storage accounts.

# [PowerShell](#tab/powershell)

To register with PowerShell, call the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
# Register for blob versioning (preview)
Register-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Versioning

# Refresh the Azure Storage provider namespace
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

# [Azure CLI](#tab/azure-cli)

To register with Azure CLI, call the [az feature register](/cli/azure/feature#az-feature-register) command.

```azurecli
az feature register --namespace Microsoft.Storage \
    --name Versioning
```

---

### Check the status of your registration

To check the status of your registration, use PowerShell or Azure CLI.

# [PowerShell](#tab/powershell)

To check the status of your registration with PowerShell, call the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Versioning
```

# [Azure CLI](#tab/azure-cli)

To check the status of your registration with Azure CLI, call the [az feature](/cli/azure/feature#az-feature-show) command.

```azurecli
az feature show --namespace Microsoft.Storage \
    --name Versioning
```

---

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

In scenario 2, one block (block 3 in the diagram) in the blob has been updated. Even though the updated block contains the same data and the same ID, it is not the same as block 3 in the previous version. As a result, the account is charged for four blocks.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-2.png)

#### Scenario 3

In scenario 3, the blob has been updated, but the version has not. Block 3 was replaced with block 4 in the base blob, but the previous version still reflects block 3. As a result, the account is charged for four blocks.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-3.png)

#### Scenario 4

In scenario 4, the base blob has been completely updated and contains none of its original blocks. As a result, the account is charged for all eight unique blocks &mdash; four in the base blob, and four in the previous version. This scenario can occur if you are writing to a blob with the Put Blob operation, because it replaces the entire contents of the base blob.

![Azure Storage resources](./media/versioning-overview/versions-billing-scenario-4.png)

## See also

- [Enable blob versioning](versioning-enable.md)
- [Creating a snapshot of a blob](/rest/api/storageservices/creating-a-snapshot-of-a-blob)
- [Soft delete for Azure Storage Blobs](storage-blob-soft-delete.md)
