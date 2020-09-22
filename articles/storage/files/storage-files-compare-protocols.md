---
title: Available Azure Files protocols
description: Learn about the available protocols before creating an Azure file share.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# Azure file share protocols
Azure Files offers two industry-standard protocols for mounting Azure file share: the [Server Message Block (SMB)](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol (preview). Azure Files enables you to pick the file system protocol that is the best fit for your workload. Azure file shares do not support both the SMB and NFS protocols on the same file share, although you can create SMB and NFS Azure file shares within the same storage account. NFS 4.1 is currently only supported within new **FileStorage** storage account type (premium file shares only).

With both SMB and NFS file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

## Differences at a glance
| Feature | SMB | NFS (preview) |
|---------|-----|---------------|
| Supported protocol versions | SMB 2.1, SMB 3.0 | NFS 4.1 |
| Available tiers | Premium, transaction optimized, hot, and cool | Premium |
| Redundancy | LRS, zone redundant storage (ZRS), geo-redundant storage (GRS), geo-zone redundant storage (GZRS) | Locally redundant storage (LRS) |
| File system semantics | Win32 | POSIX |
| Authentication | Identity-based authentication (Kerberos), shared key authentication (NTLMv2) | Host-based authentication |
| Authorization | Win32-style access control lists (ACLs) | UNIX-style permissions |
| Case sensitivity | Case insensitive, case preserving | Case sensitive |
| Deleting or modifying open files | With lock only | Yes |
| Locking | Mandatory locks | Byte-range advisory network lock manager |
| Hard link support | Not supported | Supported |
| Symbolic link support | Not supported | Supported |
| Optionally internet accessible | Yes (SMB 3.0 only) | No |

## SMB shares
SMB file shares are used for a variety of applications including end-user file shares and file shares that back databases and applications. The SMB protocol is tightly integrated into Windows, however Linux and macOS also have first-class SMB protocol support. To learn more about how to mount SMB Azure file shares, see:

- [Mounting SMB file shares on Windows](storage-how-to-use-files-windows.md)
- [Mounting SMB file shares on Linux](storage-how-to-use-files-linux.md)
- [Mounting SMB file shares on macOS](storage-how-to-use-files-mac.md)

### Features
SMB file shares support the full breadth and depth of Azure Files features, including:

- Identity-based (Kerberos) authentication
- Encryption-in-transit
- Snapshots
- Soft delete
- Azure Backup integration
- Azure File Sync

### Best suited
SMB file shares are ideally suited for:

- End-user file shares such as team shares, home directories, etc.
- Backing storage for Windows-based applications, such as SQL Server databases or line-of-business applications written for Win32 or .NET local file system APIs. 
- File shares requiring features not currently available on NFS Azure file shares, such as any of the features listed in [Features](#features).

## NFS shares (preview)
Mounting Azure file shares with NFS 4.1 is currently in preview. NFS Azure file shares are fully POSIX-compliant file systems, offering tighter integration for Linux applications. POSIX-compliant is a standard for file system semantics and APIs across variants of Unix and other *nix based operating systems. 

### Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

#### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

### Best suited
NFS file shares are ideally suited for:

- Backing storage for Linux/UNIX-based applications, such as line-of-business applications written using Linux or POSIX file system APIs (even if they don't require POSIX-compliance).
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

## Next steps
- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)
- [Create an SMB file share](storage-how-to-create-file-share.md)