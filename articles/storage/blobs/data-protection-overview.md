---
title: Data protection overview
titleSuffix: Azure Storage
description: The data protection options available for you're for Blob Storage and Azure Data Lake Storage Gen2 data enable you to protect your data from being deleted or overwritten. If you should need to recover data that has been deleted or overwritten, this guide can help you to choose the recovery option that's best for your scenario.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 09/19/2022
ms.topic: conceptual
ms.author: normesta
ms.reviewer: prishet
---

# Data protection overview

Azure Storage provides data protection for Blob Storage and Azure Data Lake Storage Gen2 to help you to prepare for scenarios where you need to recover data that has been deleted or overwritten. It's important to think about how to best protect your data before an incident occurs that could compromise it. This guide can help you decide in advance which data protection features your scenario requires, and how to implement them. If you should need to recover data that has been deleted or overwritten, this overview also provides guidance on how to proceed, based on your scenario.

In the Azure Storage documentation, *data protection* refers to strategies for protecting the storage account and data within it from being deleted or modified, or for restoring data after it has been deleted or modified. Azure Storage also offers options for *disaster recovery*, including multiple levels of redundancy to protect your data from service outages due to hardware problems or natural disasters, and customer-managed failover in the event that the data center in the primary region becomes unavailable. For more information about how your data is protected from service outages, see [Disaster recovery](#disaster-recovery).

## Recommendations for basic data protection

If you're looking for basic data protection coverage for your storage account and the data that it contains, then Microsoft recommends taking the following steps to begin with:

- Configure an Azure Resource Manager lock on the storage account to protect the account from deletion or configuration changes. [Learn more...](../common/lock-account-resource.md)
- Enable container soft delete for the storage account to recover a deleted container and its contents. [Learn more...](soft-delete-container-enable.md)
- Save the state of a blob at regular intervals:
  - For Blob Storage workloads, enable blob versioning to automatically save the state of your data each time a blob is overwritten. [Learn more...](versioning-enable.md)
  - For Azure Data Lake Storage workloads, take manual snapshots to save the state of your data at a particular point in time. [Learn more...](snapshots-overview.md)

These options, as well as other data protection options for other scenarios, are described in more detail in the following section.

For an overview of the costs involved with these features, see [Summary of cost considerations](#summary-of-cost-considerations).

## Overview of data protection options

The following table summarizes the options available in Azure Storage for common data protection scenarios. Choose the scenarios that are applicable to your situation to learn more about the options available to you. Not all features are available at this time for storage accounts with a hierarchical namespace enabled.

| Scenario | Data protection option | Recommendations | Protection benefit | Available for Data Lake Storage |
|--|--|--|--|--|
| Prevent a storage account from being deleted or modified. | Azure Resource Manager lock<br />[Learn more...](../common/lock-account-resource.md) | Lock all of your storage accounts with an Azure Resource Manager lock to prevent deletion of the storage account. | Protects the storage account against deletion or configuration changes.<br /><br />Doesn't protect containers or blobs in the account from being deleted or overwritten. | Yes |
| Prevent a blob version from being deleted for an interval that you control. | Immutability policy on a blob version<br />[Learn more...](immutable-storage-overview.md) | Set an immutability policy on an individual blob version to protect business-critical documents, for example, in order to meet legal or regulatory compliance requirements. | Protects a blob version from being deleted and its metadata from being overwritten. An overwrite operation creates a new version.<br /><br />If at least one container has version-level immutability enabled, the storage account is also protected from deletion. Container deletion fails if at least one blob exists in the container. | No |
| Prevent a container and its blobs from being deleted or modified for an interval that you control. | Immutability policy on a container<br />[Learn more...](immutable-storage-overview.md) | Set an immutability policy on a container to protect business-critical documents, for example, in order to meet legal or regulatory compliance requirements. | Protects a container and its blobs from all deletes and overwrites.<br /><br />When a legal hold or a locked time-based retention policy is in effect, the storage account is also protected from deletion. Containers for which no immutability policy has been set aren't protected from deletion. | Yes |
| Restore a deleted container within a specified interval. | Container soft delete<br />[Learn more...](soft-delete-container-overview.md) | Enable container soft delete for all storage accounts, with a minimum retention interval of seven days.<br /><br />Enable blob versioning and blob soft delete together with container soft delete to protect individual blobs in a container.<br /><br />Store containers that require different retention periods in separate storage accounts. | A deleted container and its contents may be restored within the retention period.<br /><br />Only container-level operations (for example, [Delete Container](/rest/api/storageservices/delete-container)) can be restored. Container soft delete doesn't enable you to restore an individual blob in the container if that blob is deleted. | Yes |
| Automatically save the state of a blob in a previous version when it's overwritten. | Blob versioning<br />[Learn more...](versioning-overview.md) | Enable blob versioning, together with container soft delete and blob soft delete, for storage accounts where you need optimal protection for blob data.<br /><br />Store blob data that doesn't require versioning in a separate account to limit costs. | Every blob write operation creates a new version. The current version of a blob may be restored from a previous version if the current version is deleted or overwritten. | No |
| Restore a deleted blob or blob version within a specified interval. | Blob soft delete<br />[Learn more...](soft-delete-blob-overview.md) | Enable blob soft delete for all storage accounts, with a minimum retention interval of seven days.<br /><br />Enable blob versioning and container soft delete together with blob soft delete for optimal protection of blob data.<br /><br />Store blobs that require different retention periods in separate storage accounts. | A deleted blob or blob version may be restored within the retention period. | Yes |
| Restore a set of block blobs to a previous point in time. | Point-in-time restore<br />[Learn more...](point-in-time-restore-overview.md) | To use point-in-time restore to revert to an earlier state, design your application to delete individual block blobs rather than deleting containers. | A set of block blobs may be reverted to their state at a specific point in the past.<br /><br />Only operations performed on block blobs are reverted. Any operations performed on containers, page blobs, or append blobs aren't reverted. | No |
| Manually save the state of a blob at a given point in time. | Blob snapshot<br />[Learn more...](snapshots-overview.md) | Recommended as an alternative to blob versioning when versioning isn't appropriate for your scenario, due to cost or other considerations, or when the storage account has a hierarchical namespace enabled. | A blob may be restored from a snapshot if the blob is overwritten. If the blob is deleted, snapshots are also deleted. | Yes, in preview |
| A blob can be deleted or overwritten, but the data is regularly copied to a second storage account. | Roll-your-own solution for copying data to a second account by using Azure Storage object replication or a tool like AzCopy or Azure Data Factory. | Recommended for peace-of-mind protection against unexpected intentional actions or unpredictable scenarios.<br /><br />Create the second storage account in the same region as the primary account to avoid incurring egress charges. | Data can be restored from the second storage account if the primary account is compromised in any way. | AzCopy and Azure Data Factory are supported.<br /><br />Object replication isn't supported. |

## Data protection by resource type

The following table summarizes the Azure Storage data protection options according to the resources they protect.

| Data protection option | Protects an account from deletion | Protects a container from deletion | Protects an object from deletion | Protects an object from overwrites |
|--|--|--|--|--|
| Azure Resource Manager lock | Yes | No<sup>1</sup> | No | No |
| Immutability policy on a blob version | Yes<sup>2</sup> | Yes<sup>3</sup> | Yes | Yes<sup>4</sup> |
| Immutability policy on a container | Yes<sup>5</sup> | Yes | Yes | Yes |
| Container soft delete | No | Yes | No | No |
| Blob versioning<sup>6</sup> | No | No | Yes | Yes |
| Blob soft delete | No | No | Yes | Yes |
| Point-in-time restore<sup>6</sup> | No | No | Yes | Yes |
| Blob snapshot | No | No | No | Yes |
| Roll-your-own solution for copying data to a second account<sup>7</sup> | No | Yes | Yes | Yes |

<sup>1</sup> An Azure Resource Manager lock doesn't protect a container from deletion.<br />
<sup>2</sup> Storage account deletion fails if there is at least one container with version-level immutable storage enabled.<br />
<sup>3</sup> Container deletion fails if at least one blob exists in the container, regardless of whether policy is locked or unlocked.<br />
<sup>4</sup> Overwriting the contents of the current version of the blob creates a new version. An immutability policy protects a version's metadata from being overwritten.<br />
<sup>5</sup> While a legal hold or a locked time-based retention policy is in effect at container scope, the storage account is also protected from deletion.<br />
<sup>6</sup> Not currently supported for Data Lake Storage workloads.<br />
<sup>7</sup> AzCopy and Azure Data Factory are options that are supported for both Blob Storage and Data Lake Storage workloads. Object replication is supported for Blob Storage workloads only.<br />

## Recover deleted or overwritten data

If you should need to recover data that has been overwritten or deleted, how you proceed depends on which data protection options you've enabled and which resource was affected. The following table describes the actions that you can take to recover data.

| Deleted or overwritten resource | Possible recovery actions | Requirements for recovery |
|--|--|--|
| Storage account | Attempt to recover the deleted storage account<br />[Learn more...](../common/storage-account-recover.md) | The storage account was originally created with the Azure Resource Manager deployment model and was deleted within the past 14 days. A new storage account with the same name hasn't been created since the original account was deleted. |
| Container | Recover the soft-deleted container and its contents<br />[Learn more...](soft-delete-container-enable.md) | Container soft delete is enabled and the container soft delete retention period hasn't yet expired. |
| Containers and blobs | Restore data from a second storage account | All container and blob operations have been effectively replicated to a second storage account. |
| Blob (any type) | Restore a blob from a previous version<sup>1</sup><br />[Learn more...](versioning-enable.md) | Blob versioning is enabled and the blob has one or more previous versions. |
| Blob (any type) | Recover a soft-deleted blob<br />[Learn more...](soft-delete-blob-enable.md) | Blob soft delete is enabled and the soft delete retention interval hasn't expired. |
| Blob (any type) | Restore a blob from a snapshot<br />[Learn more...](snapshots-manage-dotnet.md) | The blob has one or more snapshots. |
| Set of block blobs | Recover a set of block blobs to their state at an earlier point in time<sup>1</sup><br />[Learn more...](point-in-time-restore-manage.md) | Point-in-time restore is enabled and the restore point is within the retention interval. The storage account hasn't been compromised or corrupted. |
| Blob version | Recover a soft-deleted version<sup>1</sup><br />[Learn more...](soft-delete-blob-enable.md) | Blob soft delete is enabled and the soft delete retention interval hasn't expired. |

<sup>1</sup> Not currently supported for Data Lake Storage workloads.

## Summary of cost considerations

The following table summarizes the cost considerations for the various data protection options described in this guide.

| Data protection option | Cost considerations |
|-|-|
| Azure Resource Manager lock for a storage account | No charge to configure a lock on a storage account. |
| Immutability policy on a blob version | No charge to enable version-level immutability on a container. Creating, modifying, or deleting a time-based retention policy or legal hold on a blob version results in a write transaction charge. |
| Immutability policy on a container | No charge to configure an immutability policy on a container. |
| Container soft delete | No charge to enable container soft delete for a storage account. Data in a soft-deleted container is billed at same rate as active data until the soft-deleted container is permanently deleted. |
| Blob versioning | No charge to enable blob versioning for a storage account. After blob versioning is enabled, every write or delete operation on a blob in the account creates a new version, which may lead to increased capacity costs.<br /><br />A blob version is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from a particular version. Changing a blob or blob version's tier may have a billing impact. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing).<br /><br />Use lifecycle management to delete older versions as needed to control costs. For more information, see [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md). |
| Blob soft delete | No charge to enable blob soft delete for a storage account. Data in a soft-deleted blob is billed at same rate as active data until the soft-deleted blob is permanently deleted. |
| Point-in-time restore | No charge to enable point-in-time restore for a storage account; however, enabling point-in-time restore also enables blob versioning, soft delete, and change feed, each of which may result in other charges.<br /><br />You're billed for point-in-time restore when you perform a restore operation. The cost of a restore operation depends on the amount of data being restored. For more information, see [Pricing and billing](point-in-time-restore-overview.md#pricing-and-billing). |
| Blob snapshots | Data in a snapshot is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from the snapshot. Changing a blob or snapshot's tier may have a billing impact. For more information, see [Pricing and billing](snapshots-overview.md#pricing-and-billing).<br /><br />Use lifecycle management to delete older snapshots as needed to control costs. For more information, see [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md). |
| Copy data to a second storage account | Maintaining data in a second storage account will incur capacity and transaction costs. If the second storage account is located in a different region than the source account, then copying data to that second account will additionally incur egress charges. |

## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it's protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

If a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

Customer-managed failover isn't currently supported for storage accounts with a hierarchical namespace enabled. For more information, see [Blob storage features available in Azure Data Lake Storage Gen2](./storage-feature-support-in-storage-accounts.md).

## Next steps

- [Azure Storage redundancy](../common/storage-redundancy.md)
- [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md)
