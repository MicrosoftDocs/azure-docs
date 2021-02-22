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

You can configure data protection for your blob and Azure Data Lake Storage Gen2 data to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

It's important to think about how to best protect your data before an incident occurs that could compromise your data. This guide can help you decide in advance which data protection features your scenario requires, and how to implement them. It also provides guidance on how to proceed should you need to restore data that has been deleted or overwritten.

## Configure data protection options

The following table summarizes the data protections available in Azure Storage:

| Scenario | Action | Available for accounts with hierarchical namespace enabled | Billing impact | Protection benefit |
|--|--|--|--|--|
| Prevent a storage account from being deleted or modified. | Configure an Azure Resource Manager lock on the storage account. | Yes | None | Protects against accidental or malicious deletes or configuration changes. |
| Prevent a container and its blobs from being deleted or modified. | Set a time-based retention policy or a legal hold for a container. | Yes, in preview | None | Protects against accidental or malicious deletes or updates. |
| Permit a container to be deleted, but maintain a copy of the deleted container and its contents for a specified interval. | Configure container soft delete for the storage account. | Yes, in preview | Data in soft-deleted containers is billed at same rate as active data. | Protects against accidental deletes. |
| Permit a blob to be deleted or updated, but automatically save its state in a previous version. | Configure blob versioning for the storage account. | No | Data is billed based on unique blocks or pages. Changing a blob's tier may have a billing impact. | Protects against accidental deletes and updates. |
| Permit a blob or blob version to be deleted, but maintain a copy of the deleted blob or version for a specified interval. | Configure blob soft delete for the storage account. | No | Data in soft-deleted blobs is billed at same rate as active data. | Protects against accidental deletes and updates. |
| Permit blobs to be deleted or updated, but track all updates and deletes so that data can be restored to a previous point in time. | Configure point-in-time restore for the storage account. | No | The cost of a restore operation depends on the amount of data being restored. | Protects against accidental deletes and updates with best-effort restore. |
| Manually save the state of a blob at a given point in time. | Take a snapshot of a blob. | Yes, in preview | Data is billed based on unique blocks or pages. Changing a blob's tier may have a billing impact. | Preserves the state of a blob at a particular time. ???Anything else we want to say here??? |

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

If needed, you can restore the deleted container during the retention interval with the Restore Container operation. Restoring a soft-deleted container restores all of the blobs within it to their state at the point when container was deleted.

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

Blob soft delete protects an individual blob, its versions, and its metadata from deletion. Microsoft recommends configuring blob soft delete for a new storage account only when blob versioning is also enabled for the storage account, and only if you need to protect blob versions from deletion. If you do not need to protect versions, then enable blob versioning without blob soft delete.

When blob soft delete is enabled for a storage account, a deleted blob or blob version may be recovered during a retention interval that you specify, up to one year. After the retention period has expired, the blob or version is permanently deleted. For more information, see [Soft delete for blobs](soft-delete-blob-overview.md).

When a blob or version is deleted, the retention period that is currently specified will be in effect for that blob or version. The retention period countdown starts at the time that the blob or version is deleted. If you change the retention period, that change applies only to subsequently deleted blobs or blob versions. It does not apply to any blobs or versions that have already been deleted.

If you have blobs that require different retention periods, then Microsoft recommends storing them in different storage accounts. Store blobs in the same storage account only if they can all be served by the same soft delete retention period.

xref to table below

When blob soft delete is enabled for the storage account, it protects all blobs and blob versions in that account. Blob soft delete is not available for storage accounts for which a hierarchical namespace is enabled. For more information, see [Soft delete for blobs](soft-delete-blob-overview.md).

### Configure point-in-time restore for the storage account

Point-in-time restore is a convenient option for restoring block blob data to an earlier point in time. When point-in-time restore is enabled for a storage account, you can restore sets of block blobs to their earlier state within a specified retention period. Point-in-time restore is useful in scenarios where a user or application accidentally deletes or updates data, or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests. For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

Point-in-time restore is a best-effort restore for the specified period. Azure Storage cannot guarantee that data will be restored with perfect fidelity. If you need to restore data with greater control and accuracy, or if you need to restore blobs that are not block blobs, then Microsoft recommends restoring from a soft-deleted container or blob, or from a previous version of a blob.

Point-in-time restore is not currently available for Azure Data Lake Storage Gen2.

For more information, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

## Restore 

| Options for restoring data | Use this feature to... | Recommendation |
|-|-|-|
| Container soft delete | Restore a container and its blobs within a specified interval after the container is deleted. | Recommended for all storage accounts, with a minimum retention period of 7 days. |
| Blob soft delete | Restore a blob or version within a specified interval after it is deleted. | Recommended for all storage accounts, with a minimum retention period of 7 days and with blob versioning also enabled.  |
| Blob versioning | Restore a blob from a previous version after the blob is deleted or overwritten. | Recommended for all storage accounts. |
| Point-in-time restore | Restore a set of blobs from a previous point in time. | Recommended as a convenient, best-effort restore option. If your scenario requires absolute fidelity, use a manual restore method instead. |
| Blob snapshots | Restore a blob from a snapshot taken manually at a given point in time. | When possible, use blob versioning instead for superior protection. |


## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

