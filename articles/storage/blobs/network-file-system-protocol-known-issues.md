---
title: Known issues with NFS 3.0 in Azure Blob Storage
titleSuffix: Azure Storage
description: Learn about limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 08/18/2023
ms.author: normesta
---

# Known issues with Network File System (NFS) 3.0 protocol support for Azure Blob Storage

This article describes limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.

> [!IMPORTANT]
> Because you must enable the hierarchical namespace feature of your account to use NFS 3.0, all of the known issues that are described in the [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md) article also apply to your account.

## NFS 3.0 support

- NFS 3.0 support can't be enabled on existing storage accounts.

- NFS 3.0 support can't be disabled in a storage account after you've enabled it.

- GRS, GZRS, and RA-GRS redundancy options aren't supported when you create an NFS 3.0 storage account.

- Access control lists (ACLs) can't be used to authorize an NFS 3.0 request. In fact, if the ACL or a blob or directory contains an entry for a named user or group, that file becomes inaccessible on the client for non-root users. You'll have to remove these entries to restore access to non-root users on the client.  For information about how to remove an ACL entry for named users and groups, see [How to set ACLs](data-lake-storage-access-control.md#how-to-set-acls).

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

Windows client for NFS is not yet supported.

## Blob Storage features

When you enable NFS 3.0 protocol support, some Blob Storage features will be fully supported, but some features might be supported only at the preview level or not yet supported at all.

To see how each Blob Storage feature is supported in accounts that have NFS 3.0 support enabled, see [Blob Storage feature support for Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

> [!NOTE]
> Static websites is an example of a partially supported feature because the configuration page for static websites does not yet appear in the Azure portal for accounts that have NFS 3.0 support enabled. You can enable static websites only by using PowerShell or Azure CLI.

## Blob Storage events

The names of NFS operations don't appear in resource logs or in responses returned by the Event Grid. Only block blob operations appear. When your application makes a request by using the NFS 3.0 protocol, that request is translated into combination of block blob operations. For example, NFS 3.0 read Remote Procedure Call (RPC) requests are translated into Get Blob operation. NFS 3.0 write RPC requests are translated into a combination of Get Block List, Put Block, and Put Block List.

Storage Events aren't supported for NFS specific operations. However, if you are performing blob or data lake storage operations on NFS enabled account, then the events shall get created based on the API being called.

## Group membership in an NFS share

Files and directories that you create in an NFS share always inherit the group ID of the parent directory regardless of whether the Set Group Identification (SGID) is set on the parent directory.

## See also

- [Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-support.md)
- [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](network-file-system-protocol-support-how-to.md)

