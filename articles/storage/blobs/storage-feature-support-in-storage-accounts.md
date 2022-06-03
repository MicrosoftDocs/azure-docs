---
title: Blob Storage feature support in Azure storage accounts
description: Determine the level of support for each storage account feature given storage account type, and the settings that are enabled on the account.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 02/24/2022
ms.author: normesta
---

# Blob Storage feature support in Azure Storage accounts

This article shows whether a feature is fully supported, supported at the preview level, or is not yet supported. Support levels are impacted by storage account type, and whether certain capabilities or protocols are enabled on the account.

The items that appear in these tables will change over time as support continues to expand.

## Standard general-purpose v2 accounts

| Storage feature | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup>   | NFS 3.0 <sup>1</sup>  | SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Access tier - cold](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)| ![Yes](../media/icons/yes-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)| ![Yes](../media/icons/yes-icon.png) |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob inventory](blob-inventory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Blob index tags](storage-manage-find-blobs.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob snapshots](snapshots-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob Storage APIs](reference.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup> | ![Yes](../media/icons/yes-icon.png) <sup>3</sup>| ![Yes](../media/icons/yes-icon.png) <sup>3</sup> |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage events](storage-blob-event-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup>  | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob versioning](versioning-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blobfuse](storage-how-to-mount-container-linux.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Change feed](storage-blob-change-feed.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Custom domains](storage-custom-domain-name.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Encryption scopes](encryption-scope-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Immutable storage](immutable-storage-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | ![Yes](../media/icons/yes-icon.png)  | ![Yes](../media/icons/yes-icon.png)  | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Object replication for block blobs](object-replication-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | ![Yes](../media/icons/yes-icon.png) |![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup> | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Soft delete for containers](soft-delete-container-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Static websites](storage-blob-static-website.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup> | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

<sup>1</sup>    Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

<sup>2</sup>    Feature is supported at the preview level.

<sup>3</sup>    See [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md). These issues apply to all accounts that have the hierarchical namespace feature enabled.

## Premium block blob accounts

| Storage feature | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md)  | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Access tier - cold](access-tiers-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob inventory](blob-inventory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Blob index tags](storage-manage-find-blobs.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob snapshots](snapshots-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob Storage APIs](reference.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup> | ![Yes](../media/icons/yes-icon.png) <sup>3</sup>| ![Yes](../media/icons/yes-icon.png) <sup>3</sup> |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage events](storage-blob-event-overview.md) | ![Yes](../media/icons/yes-icon.png)  <sup>3</sup>  | ![Yes](../media/icons/yes-icon.png) <sup>3</sup>| ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob versioning](versioning-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blobfuse](storage-how-to-mount-container-linux.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Change feed](storage-blob-change-feed.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Custom domains](storage-custom-domain-name.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json)  | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Encryption scopes](encryption-scope-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Immutable storage](immutable-storage-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | ![Yes](../media/icons/yes-icon.png)  | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> |
| [Object replication for block blobs](object-replication-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Soft delete for blobs](./soft-delete-blob-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) <sup>3</sup> | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Soft delete for containers](soft-delete-container-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Static websites](storage-blob-static-website.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup> | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  <sup>2</sup>  <sup>3</sup> | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

<sup>1</sup>    Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

<sup>2</sup>    Feature is supported at the preview level.

<sup>3</sup>    See [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md). These issues apply to all accounts that have the hierarchical namespace feature enabled.

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
