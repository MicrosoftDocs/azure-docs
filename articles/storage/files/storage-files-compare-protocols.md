---
title: Available Azure Files protocols - NFS and SMB
description: Learn about the available protocols before creating an Azure file share, including Server Message Block (SMB) and Network File System (NFS).
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# Azure file share protocols

Azure Files offers two protocols for connecting and mounting your Azure file shares. [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System) (preview). Azure Files does not currently support multi-protocol access, so a share can only be either an NFS share, or an SMB share. Due to this, we recommend determining which protocol best suits your needs before creating Azure file shares.

## Differences at a glance

|Feature  |NFS (preview)  |SMB  |
|---------|---------|---------|
|Access protocols     |NFS 4.1         |SMB 2.1, SMB 3.0         |
|Supported OS     |Linux kernel version 4.3+         |Windows 2008 R2+, Linux kernel version 4.11+         |
|[Available tiers](storage-files-planning.md#storage-tiers)     |Premium storage         |Premium storage, transaction optimized, hot, cool         |
|[Redundancy](storage-files-planning.md#redundancy)     |LRS         |LRS, ZRS, GRS         |
|Authentication     |Host-based authentication only        |Identity-based authentication, user-based authentication         |
|Permissions     |UNIX-style permissions         |NTFS-style permissions         |
|File system semantics     |POSIX compliant         |Not POSIX compliant         |
|Case sensitivity     |Case sensitive         |Not case sensitive         |
|Hard link support     |Supported         |Not supported         |
|Symbolic links support     |Supported         |Not supported         |
|Deleting or modifying open files     |Supported         |Not supported         |
|Locking     |Byte-range advisory network lock manager         |Supported         |
|Public IP safe listing | Not supported | Supported|
|Protocol interop| Not supported | FileREST|

## NFS shares (preview)

Mounting Azure file shares with NFS 4.1 is currently in preview. It offers a tighter integration with Linux. This is a fully POSIX-compliant offer that is a standard across variants of Unix and other *nix based operating systems. This enterprise-grade file storage service scales up to meet your storage needs and can be accessed concurrently by thousands of compute instances.

### Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

#### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

### Best suited

NFS with Azure Files is ideal for:

- Workloads that require POSIX-compliant file shares, case sensitivity, or Unix style permissions(UID/GID).
- Linux-centric workloads that do not require Windows access.

### Security

All Azure Files data is encrypted at rest. For encryption in transit, Azure provides a layer of encryption for all data in transit between Azure Datacenters using [MACSec](https://en.wikipedia.org/wiki/IEEE_802.1AE). Through this, encryption exists when data is transferred between Azure datacenters. Unlike Azure Files using the SMB protocol, file shares using the NFS protocol do not offer user-based authentication. Authentication for NFS shares is based on the configured network security rules. Due to this, to ensure only secure connections are established to your NFS share, you must use either service endpoints or private endpoints. If you want to access shares from on-premises then, in addition to a private endpoint, you must setup a VPN or ExpressRoute. Requests that do not originate from the following sources will be rejected:

- [A private endpoint](storage-files-networking-overview.md#private-endpoints)
- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
    - [Point-to-site (P2S) VPN](../../vpn-gateway/point-to-site-about.md)
    - [Site-to-Site](https://docs.microsoft.com/azure/vpn-gateway/design#s2smulti)
- [ExpressRoute](../../expressroute/expressroute-introduction.md)
- [A restricted public endpoint](storage-files-networking-overview.md#storage-account-firewall-settings)

For more details on the available networking options, see [Azure Files networking considerations](storage-files-networking-overview.md).

## SMB shares

Azure file shares mounted with SMB offer more Azure Files features and have no Azure Files feature restrictions since it is generally available.

### Features

- Azure file sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Encryption-in-transit and encryption-at-rest

### Best suited

SMB with Azure Files is ideal for:

- Production environments
- Customers that require any of the features listed in [Features](#features)

## Next steps

- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)
- [Create an SMB file share](storage-how-to-create-file-share.md)