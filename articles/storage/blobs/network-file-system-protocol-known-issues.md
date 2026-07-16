---
title: Known Issues with NFS 3.0 in Azure Blob Storage
titleSuffix: Azure Storage
description: Learn about limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 03/04/2024
ms.author: normesta
# Customer intent: As a storage administrator, I want to understand the limitations and known issues of NFS 3.0 support for Azure Blob Storage so that I can make informed decisions about enabling it and managing my storage environment effectively.
---

# Known issues with Network File System (NFS) 3.0 protocol support for Azure Blob Storage

This article describes limitations and known issues of Network File System (NFS) 3.0 protocol support for Azure Blob Storage.

> [!IMPORTANT]
> Because you must enable the hierarchical namespace feature of your account to use NFS 3.0, all the known issues that are described in the [Known issues with Azure Data Lake Storage](data-lake-storage-known-issues.md) article also apply to your account.

## NFS 3.0 support

- NFS 3.0 support can't be enabled on existing storage accounts.
- NFS 3.0 support can't be disabled in a storage account after you enable it.
- Geo-redundant storage is supported only for unplanned failover scenarios and isn't supported for planned failover.
- Geo-zone-redundant storage and read-access geo-redundant storage redundancy options aren't supported when you create an NFS 3.0 storage account.
- Access control lists (ACLs) can't be used to authorize an NFS 3.0 request. If the ACL or a blob or directory contains an entry for a named user or group, that file becomes inaccessible on the client for nonroot users. You have to remove these entries to restore access to nonroot users on the client. For information about how to remove an ACL entry for named users and groups, see [How to set ACLs](data-lake-storage-access-control.md#how-to-set-acls).
- NFS 3.0 enabled accounts don't support [Azure Data Lake Storage vaulted backup](/azure/backup/azure-data-lake-storage-backup-support-matrix).

## NFS 3.0 features

The following NFS 3.0 features aren't yet supported:

- Using NFS 3.0 over UDP. Only NFS 3.0 over TCP is supported.
- Locking files with Network Lock Manager. Mount commands must include the `-o nolock` parameter.
- Mounting subdirectories. You can only mount the root directory (container).
- Listing mounts (for example, by using the command `showmount -a`).
- Listing exports (for example, by using the command `showmount -e`).
- Using hard links.
- Exporting a container as read-only.

## NFS 3.0 clients

Windows client for NFS isn't yet supported. A workaround is available that uses the Windows Subsystem for Linux (WSL 2) to mount storage by using the NFS 3.0 protocol. For more information, see the [BlobNFS-wsl2](https://github.com/Azure/BlobNFS-wsl2/tree/develop) project on GitHub.

## Blob Storage features

When you enable NFS 3.0 protocol support, some Azure Blob Storage features are fully supported, but some features might be supported only at the preview level or not yet supported at all.

To see how each Blob Storage feature is supported in accounts that have NFS 3.0 support enabled, see [Blob Storage feature support for Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

> [!NOTE]
> Static websites are an example of a partially supported feature. The configuration page for static websites doesn't yet appear in the Azure portal for accounts that have NFS 3.0 support enabled. You can enable static websites only by using Azure PowerShell or the Azure CLI.

## Blob Storage events

The names of NFS operations don't appear in resource logs or in responses returned by Azure Event Grid. Only block blob operations appear. When your application makes a request by using the NFS 3.0 protocol, that request is translated into combination of block blob operations. For example, NFS 3.0 read remote procedure call (RPC) requests are translated into a `Get Blob` operation. NFS 3.0 write RPC requests are translated into a combination of `Get Block List`, `Put Block`, and `Put Block List`.

Storage events aren't supported for NFS specific operations. If you perform blob or data lake storage operations on an NFS-enabled account, the events get created based on the API being called.

## Group membership in an NFS share

Files and directories that you create in an NFS share always inherit the group ID of the parent directory regardless of whether the Set Group ID is set on the parent directory.

## Related content

- [Network File System (NFS) 3.0 protocol support for Azure Blob Storage](network-file-system-protocol-support.md)
- [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](network-file-system-protocol-support-how-to.md)