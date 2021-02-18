---
title: Data protection overview
titleSuffix: Azure Storage
description: Data protection overview for Azure Storage
services: storage
author: tamram

ms.service: storage
ms.date: 02/17/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

You can configure data protection for your blob and Azure Data Lake Storage Gen2 data to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

## Overview of data protection options

Azure Storage includes data protection features that enable you to prevent accidental deletes or overwrites, restore data that has been deleted, track changes to data, and apply legal holds and time-based retention policies. You can implement these features for your blob data without needing to reach out to Microsoft.

| Data protection scenario | Recommended for Blob storage | Recommended for Azure Data Lake Storage Gen2 |
|--|--|--|
| [Prevent deletion or modification of the storage account](#prevent-deletion-or-modification-of-the-storage-account) | Azure Resource Manager lock | Azure Resource Manager lock |
| [Maintain deleted data for a specified period of time](#maintain-deleted-data-for-a-specified-period-of-time) | Container soft delete (preview)<br />Blob soft delete | Container soft delete (preview) |
| [Keep a copy of the previous state when a blob is updated or deleted](#retain-a-copy-of-the-original-data-when-a-blob-is-updated-or-deleted) | Blob versioning<br />Blob soft delete | Blob snapshots (preview) |
| [Restore data to a specific point in time](#restore-data-to-a-specific-point-in-time) | Point-in-time restore | Not yet available |
| [Prevent all updates or deletes to blob data](#prevent-all-updates-or-deletes-to-blob-data) | Immutable blob storage for Write-Once, Read-Many (WORM) workloads | Immutable blob storage for WORM workloads (preview) |
| [Track changes to your data](#track-changes-to-your-data) | Change feed | Not yet available |

## Prevent deletion or modification of the storage account

To prevent users from deleting a storage account or modifying its configuration, you can apply an Azure Resource Manager lock. There are two types of resource locks available:

- A **CannotDelete** lock prevents users from deleting a storage account, but permits reading and modifying its configuration.
- A **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration, but permits reading the configuration.

For more information about Azure Resource Manager locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).

If a container is protected with a time-based retention policy or a legal hold, then the storage account cannot be deleted. For more information, see [Immutable blob storage](#immutable-blob-storage).

In some cases, a deleted storage account may be recovered, although recovery is not guaranteed. For more information, see [Recover a deleted storage account](../common/storage-account-recover.md)

## Maintain deleted data for a specified period of time

Soft delete protects your blob data from accidental or malicious deletion or from corruption by maintaining the deleted data in the system for a period of time after it has been deleted. If needed, you can restore the deleted data during that interval. Soft delete is available for both [containers](#container-soft-delete) and [blobs](#blob-soft-delete).

Microsoft recommends enabling container soft delete, blob versioning, and blob soft delete together, so that you can restore a container, an individual blob or blob version if it is deleted. If you need to optimize costs, then enable container soft delete and blob versioning only.

### Container soft delete

Container soft delete (preview) is available both for Blob storage and for Azure Data Lake Storage Gen2.

When you enable container soft delete (preview) for your storage account, you can quickly recover a container and its contents and metadata if the container is deleted. The container may be recovered during a retention interval that you specify, up to one year. Restoring a soft-deleted container restores all of the blobs within it to their state when the container was deleted. After the retention period has expired, the container and its blobs are permanently deleted.

For more information, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

### Blob soft delete

Blob soft delete protects an individual blob, its versions, and its metadata from deletion. When blob soft delete is enabled for a storage account, a deleted blob may be recovered during a retention interval that you specify, up to one year. After the retention period has expired, the blob is permanently deleted.

Blob soft delete is not currently available for a storage account with a hierarchical namespace enabled.

For more information, see [Soft delete for blobs](soft-delete-blob-overview.md).

## Keep a copy of the previous state when a blob is updated or deleted

To keep a copy of the previous state of a blob each time the blob is updated or when the blob is deleted, enable blob versioning for the storage account. When versioning is enabled, previous versions of every blob in the account are automatically maintained after write or delete operations.

The data in a previous version can be read at any time. To restore a previous version, you can promote it to be the current version. For more information, see [Blob versioning](versioning-overview.md).

When a new blob version is created, you are charged for storing any unique blocks in that version. If you need to optimize costs, then follow these guidelines:

- Be sure that you understand the billing implications of enabling blob versioning. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing).
- Design your application so that it deletes previous versions as appropriate.
- Store blob data that requires versioning in one storage account, and other data in another storage account.

Blob versioning is not currently available for Azure Data Lake Storage Gen2. However, you can take manual snapshots of blob data in a storage account for which a hierarchical namespace is enabled (preview).

## Restore data to a specific point in time

Point-in-time restore is a convenient option for restoring block blob data to an earlier point in time. When point-in-time restore is enabled for a storage account, you can restore sets of block blobs to their earlier state within a specified retention period. Point-in-time restore is useful in scenarios where a user or application accidentally deletes or updates data, or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests. For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

Point-in-time restore is a best-effort restore for the specified period. Azure Storage cannot guarantee that data will be restored with perfect fidelity. If you need to restore data with greater control and accuracy, or if you need to restore blobs that are not block blobs, then Microsoft recommends restoring from a soft-deleted container or blob, or from a previous version of a blob.

Point-in-time restore is not currently available for Azure Data Lake Storage Gen2.

## Prevent all updates or deletes to blob data

Immutable blob storage stores business-critical data in a Write Once, Read Many (WORM) state. In this state, blobs in a protected container cannot be deleted or modified. Azure Storage provides two types of immutability policies:

- A time-based retention policy prevents write operations for a specified period of time.
- A legal hold prevents write operations until the legal hold is explicitly cleared.

For more information, see [Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md).

## Track changes to your data

change feed

## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

