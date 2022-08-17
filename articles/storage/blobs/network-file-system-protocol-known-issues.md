---
title: Known issues with NFS 3.0 in Azure Blob Storage
description: Learn about limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/08/2021
ms.author: normesta
ms.reviewer: yzheng
---

# Known issues with Network File System (NFS) 3.0 protocol support for Azure Blob Storage

This article describes limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.

> [!IMPORTANT]
> Because you must enable the hierarchical namespace feature of your account to use NFS 3.0, all of the known issues that are described in the [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md) article also apply to your account.

## NFS 3.0 support

- NFS 3.0 support can't be enabled on existing storage accounts.

- NFS 3.0 support can't be disabled in a storage account after you've enabled it.

- GRS, GZRS, and RA-GRS redundancy options aren't supported when you create an NFS 3.0 storage account.

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

When you enable NFS 3.0 protocol support, some Blob Storage features will be fully supported, but some features might be supported only at the preview level or not yet supported at all.

To see how each Blob Storage feature is supported in accounts that have NFS 3.0 support enabled, see [Blob Storage feature support for Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

> [!NOTE]
> Static websites is an example of a partially supported feature because the configuration page for static websites does not yet appear in the Azure portal for accounts that have NFS 3.0 support enabled. You can enable static websites only by using PowerShell or Azure CLI.

## See also

- [Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-support.md)
- [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](network-file-system-protocol-support-how-to.md)
