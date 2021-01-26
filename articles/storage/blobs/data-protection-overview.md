---
title: Data protection overview
titleSuffix: Azure Storage
description: Data protection overview for Azure Storage
services: storage
author: tamram

ms.service: storage
ms.date: 01/26/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

You can configure data protection for your blob and Azure Data Lake Storage Gen2 data to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

## Understanding data protection options

Azure Storage includes data protection features that enable you to prevent accidental deletes or overwrites, restore data that has been deleted, track changes to data, and apply legal holds and time-based retention policies. You can implement these features for your blob data without needing to reach out to Microsoft.

| Data protection feature | Blob storage | Azure Data Lake Storage Gen2 |
|-|-|
| Protect your data from accidental or malicious deletes | [Container soft delete (preview)](#container-soft-delete)<br>[Blob soft delete](#blob-soft-delete)<br>[Blob versioning](#blob-versioning)<br>[Point-in-time restore](#point-in-time-restore) | [Container soft delete (preview)](#container-soft-delete)|
| Protect your data from accidental or malicious updates | [Blob versioning](#blob-versioning)<br>[Blob snapshots](#blob-snapshots)<br>[Point-in-time restore](#point-in-time-restore) | File snapshots (preview) (???are we using file term instead of blob for ADLS? I'm still confused on that???) |
| Restore all or some of your data to a previous point in time  | [Point-in-time restore](#point-in-time-restore) | Not yet available |
| Track changes to your data | [Change feed](#change-feed) | Not yet available |
| Prevent all updates and deletes for a specified period of time | [Immutable blob storage](#immutable-blob-storage) for Write-Once, Read-Many (WORM) workloads | Immutable storage for WORM workloads (preview) |

### Soft delete

Soft delete protects your blob data from accidental or malicious deletion or from corruption by maintaining the deleted data for a period of time after it has been deleted. If needed, you can restore the deleted data during that interval. Soft delete is available for both containers and blobs.

You must enable soft delete and configure the retention period before your data is deleted. Data that was deleted before soft delete was enabled cannot be restored.

Microsoft recommends enabling both [container soft delete](#container-soft-delete) and [blob soft delete](#blob-soft-delete) for your storage accounts for optimal protection against data deletion or corruption. Container soft delete protects the entire contents of a container, while blob soft delete protects an individual blob.

In a scenario where you need to recover a deleted blob, it's important to have blob soft delete enabled. Suppose you have only container soft delete enabled for your storage account, and you need to recover a deleted blob. If the parent container has not been deleted, then you cannot restore it, and so cannot restore the blob.

In a scenario where you need to recover a deleted container, it's important to have container soft delete enabled so that you can restore all of the blobs in the container as well as the container metadata. For example, suppose a deleted container has a large number of blobs. If you have blob soft delete enabled for the storage account, but not container soft delete, then you would need to restore each blob individually, which could be time consuming. You also would not be able to restore container metadata. If container soft delete is enabled, then you can restore all of the deleted blobs by simply restoring the container.

Microsoft recommends enabling [blob versioning](#blob-versioning) together with soft delete.

#### Container soft delete

Container soft delete (preview) protects a container's contents and metadata from deletion. When container soft delete is enabled for a storage account, a deleted container and its blobs may be recovered during a retention interval that you specify. The retention period for deleted containers can be between 1 and 365 days. To recover a deleted container and its blobs, call the **Undelete Container** operation.

The following diagram shows how container soft delete works:

:::image type="content" source="media/data-protection-overview/container-soft-delete-diagram.png" alt-text="Diagram showing how container soft delete protects against unintended deletion":::

After the retention period has expired, the container and its blobs are permanently deleted.

For more information, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

#### Blob soft delete

Blob soft delete protects an individual blob and its metadata from deletion. When blob soft delete is enabled for a storage account, a deleted blob may be recovered during a retention interval that you specify. The retention period for a deleted blob can be between 1 and 365 days. To recover a deleted blobs, call the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation.

The following diagram shows how blob soft delete works:

:::image type="content" source="media/data-protection-overview/blob-soft-delete-diagram.png" alt-text="Diagram showing how blob soft delete protects against unintended deletion":::

After the retention period has expired, the blob is permanently deleted.

[Soft delete for blobs](soft-delete-blob-overview.md)

### Blob versioning

When blob versioning is enabled for a storage account, Azure Storage automatically stores the previous version of a blob each time it is modified or deleted. If a blob is erroneously modified or deleted, you can restore an earlier version to recover your data.

The following diagram shows how blob versioning works. Although the diagram shows an integer value for the version ID, an actual version ID is a timestamp value in UTC time.

:::image type="content" source="media/data-protection-overview/blob-versioning-diagram.png" alt-text="Diagram showing how blob versioning protects against unintended modification or deletion":::

Microsoft recommends using blob versioning together with soft delete for superior data protection. Soft delete protects a blob's previous versions as well as the current version, so that any version of the blob that is deleted can be restored throughout the soft-delete retention period. For additional information about how blob versioning and soft delete work together, see [Blob versioning and soft delete](versioning-overview.md#blob-versioning-and-soft-delete).

> [!NOTE]
> When possible, use blob versioning instead of blob snapshots to maintain previous versions. Blob snapshots provide similar functionality in that they maintain earlier versions of a blob, but snapshots must be maintained manually by your application. For more information, see [Blob versioning and blob snapshots](versioning-overview.md#blob-versioning-and-blob-snapshots).
>
> Microsoft recommends that after you enable blob versioning, you also update your application to stop taking snapshots of block blobs. If versioning is enabled for your storage account, all block blob updates and deletions are captured and preserved by versions. Taking snapshots does not offer any additional protections to your block blob data if blob versioning is enabled, and may increase costs and application complexity.

For more information about blob versioning, see [Blob versioning](versioning-overview.md).

### Blob snapshots

A blob snapshot is a copy of a blob taken at a given point in time by your application code. Blob snapshots are similar to blob versions, except that they are manually generated. Versions are created automatically on every blob write or delete operation after versioning is enabled for the storage account.

To create a blob snapshot, call the [Snapshot Blob](/rest/api/storageservices/snapshot-blob) operation.

???what language do we want to use here to describe ADLS support???

For more information about blob snapshots, see [Blob snapshots](snapshots-overview.md).

### Point-in-time restore

When point-in-time restore is enabled for your storage account, you can restore block blobs to an earlier state within a specified retention period. Point-in-time restore is useful in scenarios where a user or application accidentally or maliciously deletes or updates data, or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

You can use a point-in-time restore operation to restore all of the containers in a storage account, or a lexicographical range of containers or blobs.

The following diagram shows how point-in-time restore works.

:::image type="content" source="media/data-protection-overview/point-in-time-restore-diagram.png" alt-text="Diagram showing how point-in-time restore protects against unintended deletes or updates":::

Point-in-time restore requires that the following data protection features are also enabled:

- Blob soft delete
- Change feed
- Blob versioning

For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

### Change feed

The blob change feed provides transaction logs of all write and delete operations on blobs and blob metadata in your storage account. The change feed provides an ordered, guaranteed, durable, immutable, read-only log of these changes. Your applications can consume the change feed to track changes to blob data. 

The following diagram shows how point-in-time restore works.

:::image type="content" source="media/data-protection-overview/change-feed-diagram.png" alt-text="Diagram showing how change feed tracks write operations to blob data":::

Microsoft recommends enabling change feed so that you can track all write operations to your blob data.

### Immutable blob storage

Immutable blob storage stores business-critical data in a Write Once, Read Many (WORM) state. In this state, blobs in a protected container cannot be deleted or modified. Azure Storage provides two types of immutability policies:

- A time-based retention policy prevents write operations for a specified period of time.
- A legal hold prevents write operations until the legal hold is explicitly cleared.

A container can have either or both types of immutability policy.

The following diagram shows how immutability policies work:

:::image type="content" source="media/data-protection-overview/worm-diagram.png" alt-text="Diagram showing how immutable blob storage provides Write Once, Read Many (WORM) support":::

???what language do we want to use here to describe ADLS support???

For more information, see [Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md).

## Disaster recovery

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

