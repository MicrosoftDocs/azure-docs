---
title: Data protection overview
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.date: 01/21/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection overview

You can configure data protection for your Azure Storage account now to prepare for scenarios where data could be compromised in the future. This guide will help you to decide which features are best for your scenario.

## Understanding data protection options in Azure Storage

Azure Storage includes data protection features that enable you to prevent accidental deletes or overwrites, restore data that has been deleted, track changes to data, and apply legal holds and time-based retention policies. You can implement these features for your blob data without needing to reach out to Microsoft.

| If you want to... | Then Microsoft recommends using these features... |
|-|-|
| Protect your blob data from accidental or malicious deletes | [Container soft delete](#container-soft-delete)<br>Blob soft delete<br>Blob versioning<br>Point-in-time restore |
| Protect your blob data from accidental or malicious updates | Blob versioning<br>Blob snapshots<br>Point-in-time restore |
| Restore all or some of your blob data to a previous point in time  | Point-in-time restore |
| Track changes to your blob data | Change feed |
| Prevent all updates and deletes for a specified period of time | Immutable blobs for Write-Once, Read-Many (WORM) workloads |

### Soft delete

Soft delete protects your blob data from accidental or malicious deletion by maintaining the deleted data for a period of time after it has been deleted. If needed, you can restore the deleted data during that interval. Soft delete is available for both containers and blobs.

Microsoft recommends enabling both [container soft delete](#container-soft-delete) and [blob soft delete](#blob-soft-delete) for your storage accounts for optimal protection against data deletion or corruption. Container soft delete protects the entire contents of a container, while blob soft delete protects an individual blob.

In a scenario where you need to recover a deleted blob, it's important to have blob soft delete enabled. Suppose you have only container soft delete enabled. If the container has not been deleted, then you cannot restore it, and so cannot restore the deleted blob.

And in a scenario where you need to recover a deleted container, it's important to have container soft delete enabled so that you can restore all of the blobs in the container as well as the container metadata. For example, suppose a deleted container has a large number of blobs. If you have blob soft delete enabled but not container soft delete, then you would need to restore each blob individually, which could be time consuming. You also would not be able to restore container metadata. If container soft delete is enabled, then you can restore all of the deleted blobs by simply restoring the container.

You must enable soft delete and configure the retention period before your data is deleted. Data that was deleted before soft delete was enabled cannot be restored.

Microsoft also recommends enabling [blob versioning](#blob-versioning) together with soft delete.

#### Container soft delete

Container soft delete (preview) protects a container's contents and metadata from accidental or malicious deletions or corruption. When container soft delete is enabled for a storage account, a deleted container and its blobs may be recovered during a retention interval that you specify. The retention period for deleted containers can be between 1 and 365 days. To recover a deleted container and its blobs, call the **Undelete Container** operation.

:::image type="content" source="media/data-protection-overview/container-soft-delete-diagram.png" alt-text="Diagram showing how container soft delete protects against unintended deletion":::

After the retention period has expired, the container and its blobs are permanently deleted.

#### Blob soft delete





### Blob versioning


### Blob snapshots


### Point-in-time restore


### Change feed


### Immutable blobs



## Protecting against accidental deletion

Container/blob Soft Delete, File/Folder Soft Delete (not yet available?), PITR, Versioning

soft delete only restores 

## Protecting against accidental overwrites

PITR, Versioning, Snapshots 

## Disaster recovery

