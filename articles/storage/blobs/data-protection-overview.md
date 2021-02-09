---
title: Data protection overview
titleSuffix: Azure Storage
description: Data protection overview for Azure Storage
services: storage
author: tamram

ms.service: storage
ms.date: 02/08/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

You can configure data protection for your blob and Azure Data Lake Storage Gen2 data to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

## Understanding data protection options

Azure Storage includes data protection features that enable you to prevent accidental deletes or overwrites, restore data that has been deleted, track changes to data, and apply legal holds and time-based retention policies. You can implement these features for your blob data without needing to reach out to Microsoft.

| Data protection scenario | Blob storage | Azure Data Lake Storage Gen2 |
|-|-|
| Quickly recover data in the event of accidental or malicious deletes | [Container soft delete (preview)](#container-soft-delete)<br>[Blob soft delete](#blob-soft-delete)<br>[Blob versioning](#blob-versioning)<br>[Point-in-time restore](#point-in-time-restore) | [Container soft delete (preview)](#container-soft-delete)|
| Quickly recover data in the event of accidental or malicious updates | [Blob versioning](#blob-versioning)<br>[Blob snapshots](#blob-snapshots)<br>[Point-in-time restore](#point-in-time-restore) | [Blob snapshots](#blob-snapshots) (preview) |
| Restore all or some of your data to a previous point in time | [Point-in-time restore](#point-in-time-restore) | Not yet available |
| Track changes to your data | [Change feed](#change-feed) | Not yet available |
| Prevent all updates and deletes for a specified period of time | [Immutable blob storage](#immutable-blob-storage) for Write-Once, Read-Many (WORM) workloads | [Immutable blob storage](#immutable-blob-storage) for WORM workloads (preview) |

## Scenario: Recover deleted data

| If your scenario requires... | Then configure these data protection features... |
|-|-|
| My scenario requires complete coverage, regardless of cost |  |
| I need to balance coverage with costs |   |

### Recommendations

- Enable soft delete for containers
- Enable blob versioning
- Enable soft delete for blobs

## Scenario: Recover data that has been overwritten

| If your scenario requires... | Then configure these data protection features... |
|-|-|
| My scenario requires complete coverage, regardless of cost |  |
| I need to balance coverage with costs |   |

### Recommendations

- Enable blob versioning
- Enable point-in-time restore

## Scenario: Restore data to a previous point in time

Point-in-time restore

### Recommendations

1. Rec 1
1. Rec 2

## Scenario: Track write and delete operations

Change feed

### Recommendations

1. Rec 1
1. Rec 2

## Scenario: Prevent all updates and deletes

Immutable blobs

### Recommendations

1. Rec 1
1. Rec 2

## Implementing data protection in Azure Storage

Azure Storage provides a set of features that you can use together or separately to protect your data appropriately for your scenario.

### Soft delete

Soft delete protects your blob data from accidental or malicious deletion or from corruption by maintaining the deleted data for a period of time after it has been deleted. If needed, you can restore the deleted data during that interval. Soft delete is available for both [containers](#container-soft-delete) and [blobs](#blob-soft-delete).

Restoring a soft-deleted container restores all of the blobs within it to their state when the container was deleted. However, it's important to also enable blob soft delete (or versioning) so that you can restore an individual blob in the container if it is deleted.

#### Container soft delete

When you enable container soft delete (preview) for your storage account, you can quickly recover a container and its contents and metadata if it is deleted. The container may be recovered during a retention interval that you specify, up to one year. After the retention period has expired, the container and its blobs are permanently deleted. For more information, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

#### Blob soft delete

Blob soft delete protects an individual blob, its versions, and its metadata from deletion. When blob soft delete is enabled for a storage account, a deleted blob may be recovered during a retention interval that you specify, up to one year. After the retention period has expired, the blob is permanently deleted. For more information, see [Soft delete for blobs](soft-delete-blob-overview.md).

### Blob versioning

When blob versioning is enabled for a storage account, Azure Storage automatically stores the previous version of a blob each time it is modified or deleted. If a blob is erroneously modified or deleted, you can restore an earlier version to recover your data. For more information about blob versioning, see [Blob versioning](versioning-overview.md).

### Blob snapshots

A blob snapshot is a copy of a blob taken at a given point in time by your application code. Blob snapshots are similar to blob versions, except that they are manually generated, while blob versions are created automatically on every blob write or delete operation after versioning is enabled for the storage account. For more information about blob snapshots, see [Blob snapshots](snapshots-overview.md).

> [!NOTE]
> When possible, use blob versioning instead of blob snapshots to maintain previous versions. Blob snapshots provide similar functionality in that they maintain earlier versions of a blob, but snapshots must be maintained manually by your application. Microsoft recommends that after you enable blob versioning, you also update your application to stop taking snapshots of block blobs. For more information, see [Blob versioning and blob snapshots](versioning-overview.md#blob-versioning-and-blob-snapshots).

### Point-in-time restore

When point-in-time restore is enabled for your storage account, you can restore block blobs to an earlier state within a specified retention period. Point-in-time restore is useful in scenarios where a user or application accidentally or maliciously deletes or updates data, or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests. For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

### Change feed

The blob change feed provides transaction logs of all write and delete operations on blobs and blob metadata in your storage account. The change feed provides an ordered, guaranteed, durable, immutable, read-only log of these changes. Your applications can consume the change feed to track changes to blob data. 

For more information about change feed, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md).

### Immutable blob storage

Immutable blob storage stores business-critical data in a Write Once, Read Many (WORM) state. In this state, blobs in a protected container cannot be deleted or modified. Azure Storage provides two types of immutability policies:

- A time-based retention policy prevents write operations for a specified period of time.
- A legal hold prevents write operations until the legal hold is explicitly cleared.

For more information, see [Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md).

## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

