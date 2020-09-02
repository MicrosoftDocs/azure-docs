---
title: Select a protocol
description: Select a protocol before creating an Azure file share
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 08/25/2020
ms.author: rogarana
ms.subservice: files
---

# Azure file share protocols

Azure Files offers two protocols for connecting and mounting your Azure file shares. [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System) (preview). Azure Files does not currently support multi-protocol access, so a share can only be either an NFS share, or an SMB share. Due to this, we recommend determining which protocol best suits your needs before creating Azure file shares.

Connecting with SMB is our more mature offering, it has more available features and no feature restrictions since it is generally available. Connecting with NFS is our preview offering, for now, it has fewer available features but tighter integration with Linux.

## Differences at a glance

|Feature  |NFS (preview)  |SMB  |
|---------|---------|---------|
|Access protocols     |NFS 4.1         |SMB 2.1, SMB 3.0         |
|Supported OS     |Linux kernel version 4.3+         |Windows 2008 R2+, Linux kernel version 4.11+         |
|Available tiers     |Premium storage         |Premium storage, standard storage         |
|Replication     |LRS, ZRS         |LRS, ZRS, GRS         |
|Authentication     |Host-based authentication only        |Identity-based authentication, user-based authentication         |
|Permissions     |UNIX-style permissions         |NTFS-style permissions         |
|File system semantics     |POSIX compliant         |Not POSIX compliant         |
|Case sensitivity     |Case sensitive         |Not case sensitive         |
|Hard link support     |Supported         |Not supported         |
|Symbolic links support     |Supported         |Not supported         |
|Deleting or modifying open files     |Supported         |Not supported         |
|Locking     |Byte-range advisory network lock manager         |Supported         |
|Public IP safe listing | Not supported | Supported|
|Protocol interop| Not supported | File-REST|

## SMB shares

SMB description here.

### Features

- Azure file sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Encryption-in-transit and encryption-at-rest

### Use cases

SMB with Azure Files is ideal for:

- Customers that require any of the features listed in [Features](#features)
- Production environments

Do not use SMB if you need Unix style permissions (UID/GID), case sensitivity, or POSIX delete behavior.

## NFS shares (preview)

Azure Files offers NFS v4.1 protocol that is fully managed, network-attached storage. It is highly scalable, highly durable, and highly available. This is a fully POSIX-compliant offer that is a standard across variants of Unix and other *nix based operating systems. This enterprise-grade file storage service scales up to meet your storage needs and can be accessed concurrently by thousands of compute instances. You can start with a file system that contains only 100 GiB data to 100 TiB per volume. Moreover, your data and metadata are protected with encryption at rest by default. NFS is currently in preview and should not be used for production data.

### Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

#### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

### Best suited

NFS with Azure Files is ideal for:

- Fully POSIX-compliant
- SAP
- Linux-centric workloads that do not require SMB access.
- Inherent locking system that you do not need to manage.

## Next steps

- [Create an NFS file share](storage-files-how-to-create-mount-nfs-shares.md)
- Create an SMB file share