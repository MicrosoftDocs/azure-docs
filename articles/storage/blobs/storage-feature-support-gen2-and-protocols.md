---
title: 'Feature support: Azure Data Lake Storage Gen2 & protocols'
description: Put a description here.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 06/30/2021
ms.author: normesta
---

# Azure Storage features available when Azure Data Lake Storage Gen2 or protocols are enabled

This article shows how each storage account feature is supported in your account when you enable Data Lake Storage Gen2 or support for protocols. 

> [!NOTE]
> Data Lake Storage Gen2, and the Network File System (NFS) 3.0 protocol always require a storage account with a hierarchical namespace enabled.
 
## Standard general-purpose v2 accounts

| Storage feature | Data Lake Storage Gen2  | NFS 3.0 |
|---------------|-------------------|---|
| [Access tier - archive](storage-blob-storage-tiers.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Access tier - cold](storage-blob-storage-tiers.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| [Access tier - hot](storage-blob-storage-tiers.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| [Azure Active Directory (AD) Security](authorize-access-azure-active-directory.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Azure Storage blob inventory](blob-inventory.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Blob index tags](storage-manage-find-blobs.md) |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob snapshots](snapshots-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| [Blob Storage APIs](reference.md) | ![Yes](../media/icons/yes-icon.png) |	![Yes](../media/icons/yes-icon.png) |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage events](storage-blob-event-overview.md) |	![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob storage PowerShell commands](storage-quickstart-blobs-powershell.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob versioning](versioning-enable.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blobfuse](storage-how-to-mount-container-linux.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Change feed](storage-blob-change-feed.md) |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Custom domains](storage-custom-domain-name.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Customer-managed keys](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) |	![Yes](../media/icons/yes-icon.png) |
| [Customer-provided keys for Azure Storage encryption](encryption-customer-provided-keys.md) |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Encryption scopes](encryption-scope-manage.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Immutable storage](immutable-storage-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Lifecycle management policies (delete blob)](storage-lifecycle-management-concepts.md) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (tiering)](storage-lifecycle-management-concepts.md) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Object replication for block blobs](object-replication-configure.md) | ![No](../media/icons/no-icon.png) |	![No](../media/icons/no-icon.png) |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| [Soft delete for containers](soft-delete-container-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Static websites](storage-blob-static-website.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup>    Feature is supported at the preview level.

## Premium block blob accounts

| Storage feature | Data Lake Storage Gen2  | NFS 3.0 |
|---------------|-------------------|---|
| [Access tier - archive](storage-blob-storage-tiers.md)  | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Access tier - cold](storage-blob-storage-tiers.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Access tier - hot](storage-blob-storage-tiers.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Azure Active Directory (AD) Security](authorize-access-azure-active-directory.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Azure Storage blob inventory](blob-inventory.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Blob index tags](storage-manage-find-blobs.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob snapshots](snapshots-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| [Blob Storage APIs](reference.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage events](storage-blob-event-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob storage PowerShell commands](storage-quickstart-blobs-powershell.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob versioning](versioning-enable.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blobfuse](storage-how-to-mount-container-linux.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Change feed](storage-blob-change-feed.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Custom domains](storage-custom-domain-name.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Customer-managed keys](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Customer-provided keys for Azure Storage encryption](encryption-customer-provided-keys.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Encryption scopes](encryption-scope-manage.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Immutable storage](immutable-storage-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Lifecycle management policies (delete blob)](storage-lifecycle-management-concepts.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (tiering)](storage-lifecycle-management-concepts.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Object replication for block blobs](object-replication-configure.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Soft delete for blobs](./soft-delete-blob-overview.md)	| ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| [Soft delete for containers](soft-delete-container-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Static websites](storage-blob-static-website.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup>    Feature is supported at the preview level.

## See also