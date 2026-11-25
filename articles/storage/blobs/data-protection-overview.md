---
title: Data protection overview
titleSuffix: Azure Storage
description: Learn about data protection options for Blob Storage and Azure Data Lake Storage to protect and recover data from deletion or overwrites. Start now.
services: storage
author: normesta
ms.custom: copilot-scenario-highlight
ms.service: azure-blob-storage
ms.date: 10/02/2026
ms.topic: overview
ms.author: normesta
ms.reviewer: prishet
# Customer intent: "As a data manager, I want to understand the data protection strategies available for Blob Storage and Data Lake Storage, so that I can effectively safeguard and recover my data from accidental deletion or modification."
---

# Data protection overview

In the Azure Storage documentation, *data protection* refers to strategies for protecting the storage account and data within it from being deleted or modified, or for restoring data after it has been deleted or modified. It's important to think about how to best protect your data before an incident occurs that could compromise it. This guide can help you decide in advance which data protection features your scenario requires. Azure Storage also offers options for [Disaster recovery](../common/storage-disaster-recovery-guidance.md) and [Security and networking](secure-blobs.md). All of these methods work together for comprehensive protection of your data. 

## Recommendations for basic data protection

If you want basic data protection coverage for your storage account and the data that it contains, take the following steps:

1. Configure an Azure Resource Manager lock on the storage account to protect the account from deletion or configuration changes. [Learn more...](../common/lock-account-resource.md)

1. Enable container soft delete for the storage account to recover a deleted container and its contents. [Learn more...](soft-delete-container-enable.md)

1. Enable blob soft delete for the storage account to recover a deleted or overwritten blob. [Learn more...](soft-delete-blob-overview.md) 

The following section describes these options and other data protection options for other scenarios in more detail. For protection against broader data loss scenarios such as accidental account deletion or ransomware, consider enabling Azure Backup in addition to in-account features. 

For an overview of the costs involved with these features, see [Summary of cost considerations](#summary-of-cost-considerations).

> [!TIP]
> Use Azure Copilot to get suggestions on enhancing your storage account's protection strategy. For more information, see [Manage and migrate storage accounts using Azure Copilot](/azure/copilot/improve-storage-accounts#enhance-data-resiliency).

## Overview of data protection options

The following table summarizes the options available in Azure Storage for common data protection scenarios. Choose the scenarios that are applicable to your situation to learn more about the options available to you. Not all features are available at this time for storage accounts with a hierarchical namespace enabled.

| Scenario | Data protection option | Recommendations | Protection benefit | Available for Data Lake Storage |
|--|--|--|--|--|
|Prevent a storage account from being deleted or modified. | Azure Resource Manager lock<br />[Learn more...](../common/lock-account-resource.md) | Lock all of your storage accounts with an Azure Resource Manager lock to prevent deletion of the storage account. | Protects the storage account against deletion or configuration changes.<br /><br />Doesn't protect containers or blobs in the account from being deleted or overwritten. | Yes |
| Restore a deleted container within a specified interval. | Container soft delete<br />[Learn more...](soft-delete-container-overview.md) | Enable container soft delete for all storage accounts, with a minimum retention interval of seven days.<br /><br />Enable with blob soft delete for optimal protection of blob data. <br /><br />Store containers that require different retention periods in separate storage accounts. | A deleted container and its contents can be restored within the retention period.<br /><br />Only container-level operations (for example, [Delete Container](/rest/api/storageservices/delete-container)) can be restored. Container soft delete doesn't enable you to restore an individual blob in the container if that blob is deleted. | Yes |
| Restore a deleted blob or blob version within a specified interval. | Blob soft delete<br />[Learn more...](soft-delete-blob-overview.md) | Enable blob soft delete for all storage accounts, with a minimum retention interval of seven days.<br /><br />Enable with container soft delete for optimal protection of blob data.<br /><br />Store blobs that require different retention periods in separate storage accounts. | A deleted blob or blob version can be restored within the retention period. | Yes |
| Automatically save the state of a blob in a previous version when it's overwritten. | Blob versioning<br />[Learn more...](versioning-overview.md) |Enable blob versioning when you want to automatically capture overwrite and metadata changes and hold previous versions of data until explicitly deleted. To minimize costs, use a lifecycle management policy or storage actions task to automatically delete old versions. <br /><br />Enable with blob soft delete for an additional layer of protection. [Learn more...](soft-delete-vs-versioning-options.md)<br /><br />Store blob data that doesn't require versioning in a separate account to limit costs. | Every blob write operation creates a new version. When you delete a blob, the current version of the blob becomes a previous version. Previous versions persist until explicitly deleted or can be promoted to current. | No |
| Manually save the state of a blob at a given point in time. | Blob snapshot<br />[Learn more...](snapshots-overview.md) |Recommended for deliberate, point-in-time captures, or as the alternative to blob versioning on accounts with hierarchical namespace, where versioning isn't available. | A blob can be restored from a snapshot if the blob is overwritten. If the blob is deleted, snapshots are also deleted. <br /><br />When blob soft delete is enabled, overwrites result in the creation of soft-deleted snapshots.| No|
|Prevent a blob version from being deleted for an interval that you control. |Immutability policy on a blob version<br />[Learn more...](immutable-storage-overview.md) |Set an immutability policy on an individual blob version to protect business-critical documents, for example, in order to meet legal or regulatory compliance requirements. | Protects a blob version from being deleted and its metadata from being overwritten. An overwrite operation creates a new version.<br /><br />If at least one container has version-level immutability enabled, the storage account is also protected from deletion. Container deletion fails if at least one blob exists in the container. | No |
| Prevent a container and its blobs from being deleted or modified for an interval that you control. | Immutability policy on a container<br />[Learn more...](immutable-storage-overview.md) | Set an immutability policy on a container to protect business-critical documents, for example, in order to meet legal or regulatory compliance requirements. | Protects a container and its blobs from all deletes and overwrites.<br /><br />When a legal hold or a locked time-based retention policy is in effect, the storage account is also protected from deletion. Containers for which no immutability policy has been set aren't protected from deletion. | Yes |
| Restore a set of block blobs to a previous point in time. | Point-in-time restore<br />[Learn more...](point-in-time-restore-overview.md) | To use point-in-time restore to revert to an earlier state, design your application to delete individual block blobs rather than deleting containers. | A set of block blobs may be reverted to their state at a specific point in the past.<br /><br />Only operations performed on block blobs are reverted. Any operations performed on containers, page blobs, or append blobs aren't reverted. | No |
|A blob can be deleted or overwritten, but the data is regularly copied to a second storage account. |Azure Blob vaulted backup<br />[Learn more](../../backup/blob-backup-overview.md) |Enable vaulted backup to have an offsite copy of your data backed up to a Microsoft tenant with no-direct access. |Provides selective backup of essential containers and enables the restore of individual containers to a storage account which is different from the source storage account. | Yes<br /><br />AzCopy and Azure Data Factory are supported.<br /><br />Object replication isn't supported. |
|Asynchronously copy block blobs to a destination account in another region. |Object replication [Learn more...](object-replication-overview.md) |Enable object replication to maintain a redundant copy of block blobs in another region, so your data stays available if the source region becomes unavailable. Store block blobs that require replication in general-purpose v2 or premium block blob accounts, because object replication only supports these account types. |Block blobs written to the source account are asynchronously copied to the destination account according to the replication policy. Only block blobs are replicated; append blobs and page blobs aren't supported, and object replication doesn't protect against accidental deletion of an individual blob within an account. | Yes |

## Data protection by resource type

The following table summarizes the Azure Storage data protection options according to the resources they protect.

| Data protection option | Protects an account from deletion | Protects a container from deletion | Protects an object from deletion | Protects an object from overwrites |
|--|--|--|--|--|
| Azure Resource Manager lock | Yes | No | No | No |
| Container soft delete | No | Yes | No | No |
| Blob soft delete | No | No | Yes | Yes |
| Blob versioning<sup>6</sup> | No | No | Yes | Yes |
| Blob snapshot<sup>6</sup> | No | No | No | Yes |
| Immutability policy on a blob version | Yes<sup>1</sup> | Yes<sup>2</sup> | Yes | Yes<sup>3</sup> |
| Immutability policy on a container | Yes<sup>4</sup> | Yes | Yes | Yes |
| Point-in-time restore<sup>5</sup> | No | No | Yes | Yes |
| Azure Blob vaulted backup| No | Yes | Yes | Yes |
| Object Replication<sup>7</sup>| No | Yes | Yes | Yes |
| Roll-your-own solution for copying data to a second account<sup>6</sup> | No | Yes | Yes | Yes |

<sup>1</sup> Storage account deletion fails if there's at least one container with version-level immutable storage enabled.<br />
<sup>2</sup> Container deletion fails if at least one blob exists in the container, regardless of whether the policy is locked or unlocked.<br />
<sup>3</sup> Overwriting the contents of the current version of the blob creates a new version. An immutability policy protects a version's metadata from being overwritten.<br />
<sup>4</sup> While a legal hold or a locked time-based retention policy is in effect at container scope, the storage account is also protected from deletion.<br />
<sup>5</sup> Not currently supported for Data Lake Storage workloads.<br />
<sup>6</sup> AzCopy and Azure Data Factory are options that are supported for both Blob Storage and Data Lake Storage workloads. Object replication is supported for Blob Storage workloads only.<br />
<sup>7</sup> A replicated copy is retained in the destination account. Object replication doesn't prevent deletion of the blob in the source account, and replication is asynchronous, so recent writes might not yet be present in the destination.<br />

## Data recovery actions based on resource type

If you should need to recover data that has been overwritten or deleted, how you proceed depends on which data protection options you've enabled and which resource was affected. The following table describes the actions that you can take to recover data.

| Deleted or overwritten resource | Possible recovery actions | Requirements for recovery |
|--|--|--|
| Storage account | Attempt to recover the deleted storage account<br />[Learn more...](../common/storage-account-recover.md) | The storage account was originally created with the Azure Resource Manager deployment model and was deleted within the past 14 days. A new storage account with the same name hasn't been created since the original account was deleted. |
| Container | Recover the soft-deleted container and its contents<br />[Learn more...](soft-delete-container-enable.md) | Container soft delete is enabled and the container soft delete retention period hasn't yet expired. |
| Containers and blobs | Restore data from a second storage account | All container and blob operations have been effectively replicated to a second storage account. |
| Blob| Recover a soft-deleted blob<br />[Learn more...](soft-delete-blob-enable.md) | Blob soft delete is enabled and the soft delete retention interval hasn't expired. |
| Set of block blobs | Recover a set of block blobs to their state at an earlier point in time<sup>1</sup><br />[Learn more...](point-in-time-restore-manage.md) | Point-in-time restore is enabled and the restore point is within the retention interval. The storage account hasn't been compromised or corrupted. |
| Blob snapshot | Recover a soft-deleted snapshot<sup>1</sup><br />[Learn more...](soft-delete-blob-enable.md) |Blob soft delete is enabled, you overwrote the blob to create a soft-deleted snapshot, and the soft delete retention interval hasn't expired. **Or**, blob soft delete was enabled, you deleted a snapshot, and the soft delete retention interval hasn't expired. |
| Blob version | Recover a soft-deleted version<sup>1</sup><br />[Learn more...](soft-delete-blob-enable.md) | Blob soft delete is enabled and the soft delete retention interval hasn't expired. |

<sup>1</sup> Not currently supported for Data Lake Storage workloads.

## Summary of cost considerations

The following table summarizes the cost considerations for the various data protection options described in this guide. There's no charge to enable or configure the following features, but consider the costs that their behavior incurs. 

| Data protection option | Cost considerations |
|-|-|
| Azure Resource Manager lock for a storage account |No charge to configure a lock on a storage account. |
| Container soft delete |Data in a soft-deleted container is billed at the same rate as active data until the soft-deleted container is permanently deleted. |
| Blob soft delete |Soft-deleted blob data is billed at the same rate as active data until it's permanently deleted.<br /><br />You aren't billed for the transactions that automatically generate snapshots or versions when a blob is overwritten or deleted, but you are billed for calls to the Undelete Blob operation at the write-transaction rate.<br /><br />Enabling soft delete for frequently overwritten data might increase capacity charges and listing latency. To gauge the impact, Microsoft recommends starting with a minimum retention period of seven days. For more information, see [Pricing and billing. ](soft-delete-overview.md#pricing-and-billing) |
| Blob versioning |After you enable blob versioning, every write on a blob in the account creates a new version, which might lead to increased capacity costs.<br /><br />You pay for a blob version based on unique blocks or pages. Costs therefore increase as the base blob diverges from a particular version. Changing a blob or blob version's tier might have a billing impact. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing).<br /><br />Use [lifecycle management](lifecycle-management-overview.md) or storage actions to delete older versions as needed to control costs. |
| Blob snapshots | You pay for data in a snapshot based on unique blocks or pages. Costs therefore increase as the base blob diverges from the snapshot. Changing a blob or snapshot's tier might have a billing impact. For more information, see [Pricing and billing](snapshots-overview.md#pricing-and-billing).<br /><br />Use [lifecycle management](lifecycle-management-overview.md) or storage actions to delete older snapshots as needed to control costs. |
| Immutability policy on a blob version | Creating, modifying, or deleting a time-based retention policy or legal hold on a blob version results in a write transaction charge. |
| Immutability policy on a container |Immutable data is priced at the same rate as mutable data. Billing persists until the data is mutable and deleted.  |
| Point-in-time restore |Enabling point-in-time restore also enables blob versioning, soft delete, and change feed, each of which might result in other charges.<br /><br />You're billed for point-in-time restore when you perform a restore operation. The cost of a restore operation depends on the amount of data being restored. For more information, see [Pricing and billing](point-in-time-restore-overview.md#pricing-and-billing). |
| Vaulted backup | For Vaulted Backup, you incur backup storage charges or instance fees, and the source side cost ([associated with object replication](object-replication-overview.md#billing)) on the backed-up source account. See [Pricing](../../backup/blob-backup-overview.md?tabs=vaulted-backup#pricing). |
| Object Replication | No charge to configure object replication, including enabling change feed and blob versioning and adding replication policies. Object replication requires change feed and versioning, each of which might result in other charges.<br /><br />Maintaining replicated data in the destination account incurs capacity costs, including the storage cost of the blob and each blob version. If the destination account is in a different region than the source, replicating data also incurs egress charges.<br /><br />Object replication incurs transaction costs: a write-transaction charge on the source account, and read and write transaction charges on the destination account, including the cost to read change feed records. For more information, see [Billing](object-replication-overview.md#billing). |
| Copy data to a second storage account | Maintaining data in a second storage account will incur capacity and transaction costs. If the second storage account is located in a different region than the source account, then copying data to that second account will additionally incur egress charges. |

## Next steps

- Broadly enable data protection features by using [Azure built-in policies](/azure/storage/common/policy-reference). Policies exist for enabling soft delete, versioning, and object replication.

- For guidance and recommendations on disaster recovery features, see [Disaster recovery](../common/storage-disaster-recovery-guidance.md).

- For guidance on data management, see [lifecycle management](lifecycle-management-overview.md) and [change feed](storage-blob-change-feed.md).

- For guidance on network security and authentication, see [Security and networking](secure-blobs.md).
