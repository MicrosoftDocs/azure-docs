---
title: Known issues with NFS 3.0 in Azure Blob Storage | Microsoft Docs
description: Learn about limitations and known issues of Network File System (NFS) 3.0 protocol support in Azure Blob Storage.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 06/21/2021
ms.author: normesta
ms.reviewer: yzheng

---
# Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage

This article describes limitations and known issues of Network File System (NFS) 3.0 protocol support in Azure Blob Storage.

## NFS 3.0 support

- NFS 3.0 support can't be enabled on existing storage accounts.

- NFS 3.0 support can't be disabled in a storage account after you've enabled it.

## NFS 3.0 features

The following NFS 3.0 features aren't yet supported.

- NFS 3.0 over UDP. Only NFS 3.0 over TCP is supported.

- Locking files with Network Lock Manager (NLM). Mount commands must include the `-o nolock` parameter.

- Mounting subdirectories. You can only mount the root directory (Container).

- Listing mounts (For example: by using the command `showmount -a`)

- Listing exports (For example: by using the command `showmount -e`)

- Hard link

- Exporting a container as read-only

## NFS 3.0 clients

Windows client for NFS is not yet supported

## Blob Storage features

The following Blob Storage features aren't yet supported.

- [Azure Active Directory (AD) security](../common/authorize-data-access.md?toc=/azure/storage/blobs/toc.json)
- [Azure Backup integration](../../backup/blob-backup-overview.md)
- [Azure Storage analytics logging](../common/storage-analytics-logging.md?toc=/azure/storage/blobs/toc.json)
- [Blob index tags](storage-blob-index-how-to.md)
- [Blob storage events](storage-blob-event-overview.md)
- [Blob versioning](versioning-enable.md)
- [Change Feed](storage-blob-change-feed.md)
- [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=/azure/storage/blobs/toc.json)
- [Customer-provided keys for Azure Storage encryption](encryption-customer-provided-keys.md) 
- [Encryption scopes](encryption-scope-overview.md)
- [Last access time tracking for lifecycle management](storage-lifecycle-management-concepts.md#move-data-based-on-last-accessed-date-preview)
- [Object replication for block blobs](object-replication-overview.md)
- [Page blobs](storage-blobs-introduction.md#blobs)
- [Point-in-time restore for block blobs](point-in-time-restore-overview.md)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Soft delete for containers](soft-delete-container-overview.md)
- [Blob snapshots](snapshots-overview.md)
- [Static websites hosting](storage-blob-static-website.md)

## Blob storage APIs

NFS 3.0, Blob APIs and Data Lake Storage Gen2 APIs can operate on the same data. 

This section describes issues and limitations with using NFS 3.0, blob APIs and Data Lake Storage Gen2 APIs to operate on the same data. 

- You cannot use NFS 3.0 and blob API or Data Lake Storage APIs to write to the same instance of a file. If you write to a file by using NFS, then that file's blocks won't be visible to calls to the [Get Block List](/rest/api/storageservices/get-block-list) blob API. The only exception is when using you are overwriting. You can overwrite a file/blob using either API. You can also overwrite with NFS 3.0 by using the zero-truncate option.

- When you use the [List Blobs](/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results will include both directories and blobs. If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

- If you use the [Delete Blob](/rest/api/storageservices/delete-blob) API to delete a directory, that directory will be deleted only if it's empty. This means that you can't use the Blob API delete directories recursively.

These Blob REST APIs aren't supported:

* [Put Blob (Page)](/rest/api/storageservices/put-blob)
* [Put Page](/rest/api/storageservices/put-page)
* [Get Page Ranges](/rest/api/storageservices/get-page-ranges)
* [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)
* [Put Page from URL](/rest/api/storageservices/put-page-from-url)
* [Put Block List](/rest/api/storageservices/put-block-list)

Unmanaged VM disks are not supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled. 

## See also

- [Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-support.md)
- [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](network-file-system-protocol-support-how-to.md)