---
title: Data protection overview
titleSuffix: Azure Storage
description: Data protection overview for Azure Storage
services: storage
author: tamram

ms.service: storage
ms.date: 02/19/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

The data protection options available for your blob and Azure Data Lake Storage Gen2 data enable you to prepare for scenarios where data could be compromised in the future. It's important to think about how to best protect your data before an incident occurs that could compromise your data. This guide can help you decide in advance which data protection features your scenario requires, and how to implement them. If you should need to recover data that has been deleted or overwritten, this overview also provides guidance on how to proceed, based on your scenario.

In the Azure Storage documentation, *data protection* refers to strategies for protecting the storage account and data within it from being deleted or modified. Azure Storage also offers options for *disaster recovery*, including multiple levels of redundancy to protect your data from service outages due to hardware problems or natural disasters, and customer-managed failover in the event that the data center in the primary region becomes unavailable. For more information about how your data is protected from service outages, see [Disaster recovery](#disaster-recovery).

## Plan ahead for data protection

The best time to think about data protection is before an incident that requires data recovery. Whether you are anticipating that data could be deleted or overwritten by accident in the normal course of business, or intentionally, by a malicious actor, preparing your storage account so that your data is protected in advance can provide peace of mind, and simplify the act of recovery should it ever be necessary.

The following table summarizes the data protection options available in Azure Storage. Note that not all features are available for storage accounts with a hierarchical namespace (HNS) enabled.

| Scenario | Action | Available for accounts with HNS enabled | Protection benefit | Recommendation |
|--|--|--|--|--|
| Prevent a storage account from being deleted or modified. | [Configure an Azure Resource Manager lock on the storage account](#configure-an-azure-resource-manager-lock-on-the-storage-account) | Yes | Protects the storage account against accidental or malicious deletes or configuration changes. Does not protect blob data in the account from being deleted or overwritten. | Recommended for all storage accounts. |
| Prevent a container and its blobs from being deleted or modified. | [Set a time-based retention policy or a legal hold for a container](#set-a-time-based-retention-policy-or-a-legal-hold-for-a-container) | Yes, in preview | Protects against accidental or malicious deletes or updates. | Recommended when your scenario requires locking blob data to prevent all updates and deletes. |
| Permit a container to be deleted, but maintain a copy of the deleted container and its contents for a specified interval. | [Configure container soft delete for the storage account](#configure-container-soft-delete-for-the-storage-account) | Yes, in preview | Protects against accidental deletes. | Recommended for all storage accounts, with a minimum retention period of 7 days. |
| Permit a blob to be deleted or updated, but automatically save its state in a previous version. | [Configure blob versioning for the storage account](#configure-blob-versioning-for-the-storage-account) | No | Protects against accidental deletes and updates. | Recommended for all storage accounts. |
| Permit a blob to be deleted or updated, or a blob version to be deleted, but maintain a copy of the blob or version for a specified interval. | [Configure blob soft delete for the storage account](#configure-blob-soft-delete-for-the-storage-account) | No | Protects against accidental deletes and updates. | Recommended for all storage accounts, with a minimum retention period of 7 days. |
| Permit blobs to be deleted or updated, but track all updates and deletes so that data can be restored to a previous point in time. | [Configure point-in-time restore for the storage account](#configure-point-in-time-restore-for-the-storage-account) | No | Protects against accidental deletes and updates with best-effort restore. | Recommended when your scenario can tolerate some data loss in exchange for convenience of recovery. |
| Permit a blob to be updated, but manually save the state of a blob at a given point in time. | [Take a manual snapshot of a blob](#take-a-manual-snapshot-of-a-blob) | Yes, in preview |Preserves the state of a blob at a particular time. | Recommended when blob versioning is not appropriate for your scenario, due to cost or other considerations. |
| Permit a blob to be updated or deleted, but regularly copy the data to a second storage account with a tool like AzCopy. | [Get started with AzCopy](../common/storage-use-azcopy-v10.md)??? | Yes | Protects against accidental or malicious deletes or updates. | Recommended for peace-of-mind protection against malicious actions or unpredictable scenarios. |

### Configure an Azure Resource Manager lock on the storage account

To prevent users from deleting a storage account or modifying its configuration, you can apply an Azure Resource Manager lock. There are two types of Azure Resource Manager resource locks available:

- A **CannotDelete** lock prevents users from deleting a storage account, but permits reading and modifying its configuration.
- A **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration, but permits reading the configuration.

For more information about Azure Resource Manager locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).

### Set a time-based retention policy or a legal hold for a container

To prevent updates or deletes to blob data, you can configure an immutability policy for a container. Immutability policies store business-critical data in a Write Once, Read Many (WORM) state. When an immutability policy is in effect for a container, blobs in that container can be read by users with appropriate permissions, but cannot be modified or deleted. Azure Storage provides two types of immutability policies:

- A time-based retention policy prevents write or delete operations for a specified period of time.
- A legal hold prevents write or delete operations until the legal hold is explicitly cleared.

When a container is protected with an immutability policy, the storage account cannot be deleted. In this way, a time-based retention policy or legal hold behaves similarly to a **CannotDelete** lock on the account, for as long as the immutability policy is in effect.

For more information about immutability policies, see [Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md).

### Configure container soft delete for the storage account

Container soft delete (preview) protects your blob data from accidental deletion by maintaining a deleted container, its blobs, and its metadata in the system for a specified period of time. The retention interval may be up to one year and is configured when you enable container soft delete for the storage account. After the retention period has expired, the container and its blobs are permanently deleted.

If needed, you can restore the deleted container during the retention interval by calling the Restore Container operation. Restoring a soft-deleted container restores all of the blobs within it to their state at the point when the container was deleted.

When a container is deleted, the retention period that is currently specified for the storage account is in effect for that container. The retention period countdown starts at the time that the container is deleted. If you change the retention period, that change applies only to subsequently deleted containers. It does not apply to any containers that have already been deleted.

When container soft delete is enabled for the storage account, it protects all containers in that account with the same retention period. If you have containers that require different retention periods, then Microsoft recommends storing them in different storage accounts. Store containers in the same storage account only if they can all be served by the same soft delete retention period.

Container soft delete can restore only whole containers. You cannot restore a deleted blob within a container by using container soft delete unless the entire container has been deleted. To protect the blobs in your containers from accidental deletion, enable blob versioning, blob soft delete, or both, as described in the following table:

xref to table below

Container soft delete is available for both Blob storage and Azure Data Lake Storage Gen2. For more information about container soft delete, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

### Configure blob versioning for the storage account

Blob versioning automatically saves a copy of the previous state of a blob each time the blob is updated or when the blob is deleted. The data in a previous version is read-only. To restore a previous version, you can promote it to be the current version, which makes it writable again.

When blob versioning is enabled for the storage account, every write and delete operation to a blob in that account creates a new version. Versions are maintained until they are explicitly deleted. Each time a version is created, you are charged for storing any unique blocks or pages in that version. If you need to optimize costs, then follow these guidelines:

- Be sure that you understand the billing implications of enabling blob versioning. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing).
- Design your application so that it deletes previous versions as appropriate. Avoid storing more than 1000 versions of any blob.
- Store blob data that requires versioning in one storage account, and other data in a different storage account.

Blob versioning is not currently available for Azure Data Lake Storage Gen2. However, you can take manual snapshots of blob data in a storage account for which a hierarchical namespace is enabled (preview).

For more information about blob versioning, see [Blob versioning](versioning-overview.md).

### Configure blob soft delete for the storage account

Blob soft delete protects an individual blob, its versions, and its metadata from accidental deletion by maintaining the deleted data in the system for a specified period of time. The retention interval may be up to one year and is configured when you enable blob soft delete for the storage account. After the retention period has expired, the blob is permanently deleted.

If needed, you can restore a deleted blob or version during the retention interval by calling the Undelete Blob operation.

When a blob or version is deleted, the retention period that is currently specified for the storage account is in effect for that blob or version. The retention period countdown starts at the time that the object is deleted. If you change the retention period, that change applies only to subsequently deleted objects. It does not apply to any objects that have already been deleted.

When blob soft delete is enabled for the storage account, it protects all blobs and versions in that account with the same retention period. If you have blobs that require different retention periods, then Microsoft recommends storing them in different storage accounts. Store blobs in the same storage account only if they can all be served by the same soft delete retention period.

Blob soft delete is not currently available for Azure Data Lake Storage Gen2.

For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

### Configure point-in-time restore for the storage account

Point-in-time restore is a convenient option for automatically restoring block blob data to an earlier point in time. When point-in-time restore is enabled for a storage account, you can restore sets of block blobs to an earlier state within a specified period of time. The retention interval is configured when you enable point-in-time restore for the storage account.

Point-in-time restore is a best-effort restore, so it is recommended for scenarios where some amount of data loss is an acceptable risk. Azure Storage cannot guarantee that data will be restored with perfect fidelity. If you need to restore data with greater control and accuracy, or if you need to restore blobs that are not block blobs, then Microsoft recommends restoring from a soft-deleted container or blob, or from a previous version of a blob.

Point-in-time restore is not currently available for Azure Data Lake Storage Gen2.

For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

### Take a manual snapshot of a blob

A snapshot is a read-only copy of a blob that's taken manually at a particular point in time. Blob snapshots are available for both Blob storage and Azure Data Lake Storage Gen2. For more information about blob snapshots, see [Blob snapshots](snapshots-overview.md).

Microsoft recommends enabling blob versioning when possible, because blob versions are created automatically when a blob is updated or deleted. Taking a snapshot, on the other hand, must be handled by your application logic.

> [!IMPORTANT]
> Using blob versioning and snapshots together is not recommended. Taking snapshots does not offer any additional protections to your block blob data if blob versioning is enabled, and may increase costs and application complexity.

## Recover deleted or overwritten data

If you should need to recover data that was overwritten or deleted, think about each of the following questions in the context of your scenario:

- Was the storage account itself deleted?
- Was data deleted or overwritten maliciously or accidentally?
- What level of control do you require over the recovery operation?
- What degree of fidelity does your scenario require for the recovered data?
- What costs can you incur for data recovery?

### Recover a deleted storage account

In some cases, a deleted storage account may be recovered, either through the Azure portal or via a support ticket. To recover a deleted storage account, the following conditions must be true:

- The storage account was deleted within the past 14 days.
- The storage account was created with the Azure Resource Manager deployment model.
- A new storage account with the same name has not been created since the original account was deleted.

For more information, see [Recover a deleted storage account](../common/storage-account-recover.md).

### Recover from a malicious action

The best way to protect against malicious activity is to prevent write and delete operations altogether. However, the need to prevent malicious activity for a set of data must be balanced against the needs of clients that write to that data. If you cannot prevent write and delete operations, then consider how you can best recover in the event of a malicious act.

A good way to protect against malicious activity is to regularly copy your data to a second storage account with a tool like AzCopy. While this strategy may incur greater costs, it can provide peace of mind that your data is safe. If the data in your storage account is compromised, you can update your application to point to the endpoints for the second storage account.

Point-in-time restore is a convenient way to restore data to a previous point in time, but it uses information from the storage account to perform the restore. In the case of a malicious act, this information might also be compromised. Additionally, point-in-time restore is a best-effort restore operation, and it may not be able to restore with absolute fidelity to the original data. If you don't have a second storage account that serves as a copy of your data, your best option is to try to recover your data manually by restoring soft-deleted containers and blobs or promoting a previous version of a blob to the current version.

### Recover from an accidental action

If data is accidentally overwritten or deleted, then point-in-time restore may be a good option for restoring it to a previous state, with the caveat that absolute fidelity is not guaranteed. If your scenario requires high fidelity, then use a manual restore method to recover the data. To restore soft-deleted containers, call the Restore Container operation. To recover a deleted or overwritten blob, promote a previous blob version to be the current version, or use the Undelete Blob operation. You can also call Undelete Blob to restore a deleted blob version.  

## Billing impact

The following table summarizes the billing impact of the various data protection options described in this guide.

| Data protection option | Billing impact  |
|-|-|
| Azure Resource Manager lock for a storage account | None |
| Time-based retention policy or legal hold for a container | None |
| Container soft delete | No charge to enable. Data in soft-deleted containers is billed at same rate as active data. |
| Blob versioning | No charge to enable. A blob version is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from the version. Changing a blob or blob version's tier may have a billing impact. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing). |
| Blob soft delete | No charge to enable. Data in soft-deleted blobs is billed at same rate as active data. |
| Point-in-time restore | No charge to enable. You are billed when you perform a restore operation. The cost of a restore operation depends on the amount of data being restored. For more information, see [Pricing and billing](point-in-time-restore-overview.md#pricing-and-billing). |
| Blob snapshots | Data in a snapshot is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from the snapshot. Changing a blob or snapshot's tier may have a billing impact. For more information, see [Pricing and billing](snapshots-overview.md#pricing-and-billing). |
| Copy data to a second storage account | Maintaining data in a second storage account will incur capacity and transaction costs. |

## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

