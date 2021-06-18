---
title: NFS file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Network File System (NFS) protocol.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/06/2021
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# NFS file shares in Azure Files
Azure Files offers two industry-standard protocols for mounting Azure file share: the [Server Message Block (SMB)](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol (preview). Azure Files enables you to pick the file system protocol that is the best fit for your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols, although you can create SMB and NFS file shares within the same storage account. For all file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

This article covers NFS Azure file shares. For information about SMB Azure file shares, see [SMB file shares in Azure Files](files-smb-protocol.md).

## Common scenarios
NFS file shares are often used in the following scenarios:

- Backing storage for Linux/UNIX-based applications, such as line-of-business applications written using Linux or POSIX file system APIs (even if they don't require POSIX-compliance).
- Workloads that require POSIX-compliant file shares, case sensitivity, or Unix style permissions(UID/GID).
- New application and service development, particularly if that application or service has a requirement for random IO and hierarchical storage. 

## Features
- Fully POSIX-compliant file system.
- Hard link support.
- Symbolic link support.

- NFS file shares currently only support most features from the [4.1 protocol specification](https://tools.ietf.org/html/rfc5661). Some features such as delegations and callback of all kinds, lock upgrades and downgrades, Kerberos authentication, and encryption are not supported.
- If the majority of your requests are metadata-centric, then the latency will be worse when compared to read/write/update operations.
- Only the management plane REST APIs are supported. Data plane REST APIs are not available, which means that tools like Storage Explorer will not work with NFS shares nor will you be able to browse NFS share data in the Azure portal.
- It is best to rely on the permissions assigned to primary group. Sometimes, permissions allocated to the non-primary group of the user may result in access denied due to a known bug.

## Security and networking
All data stored in Azure Files is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't have to have access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

For encryption in transit, Azure provides a layer of encryption for all data in transit between Azure datacenters using [MACSec](https://en.wikipedia.org/wiki/IEEE_802.1AE). Through this, encryption exists when data is transferred between Azure datacenters. Unlike Azure Files using the SMB protocol, file shares using the NFS protocol do not offer user-based authentication. Authentication for NFS shares is based on the configured network security rules. Due to this, to ensure only secure connections are established to your NFS share, you must use either service endpoints or private endpoints. If you want to access shares from on-premises then, in addition to a private endpoint, you must setup a VPN or ExpressRoute. Requests that do not originate from the following sources will be rejected:

- [A private endpoint](storage-files-networking-overview.md#private-endpoints)
- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
    - [Point-to-site (P2S) VPN](../../vpn-gateway/point-to-site-about.md)
    - [Site-to-Site](../../vpn-gateway/design.md#s2smulti)
- [ExpressRoute](../../expressroute/expressroute-introduction.md)
- [A restricted public endpoint](storage-files-networking-overview.md#storage-account-firewall-settings)

For more details on the available networking options, see [Azure Files networking considerations](storage-files-networking-overview.md).

## Support for Azure Storage features

The following table shows the current level of support for Azure Storage features in accounts that have the NFS 3.0 feature enabled. 

The status of items that appear in this tables will change over time as support continues to expand.

| Storage feature | Supported for NFS shares |
|-----------------|---------|
| [File management plane REST API](/rest/api/storageservices/blob-service-rest-api)	| ✔️ |
| Encryption at rest|	✔️ |
| [LRS or ZRS redundancy types](storage-files-planning.md#redundancy)|	✔️ ||
| [Private endpoints](storage-files-networking-overview.md#private-endpoints) | ✔️  |
| [Restricted public endpoints](storage-files-networking-overview.md#storage-account-firewall-settings)|  ✔️  |
| [Identity-based authentication](storage-files-active-directory-overview.md) | ⛔ |
| [Azure file share soft delete](storage-files-prevent-file-share-deletion.md) | ⛔  |
| [File sync introduction](../file-sync/file-sync-introduction.md)| ⛔ |
| [Azure file share backups](../../backup/azure-file-share-backup-overview.md)| ⛔ |
| [Azure file share snapshots](storage-snapshots-files.md)| ⛔ |
| File data plane REST API| ⛔ |
| Encryption in transit| ⛔ |
| [GRS or GZRS redundancy types](storage-files-planning.md#redundancy)| ⛔ |
| AzCopy| ⛔ |
| Standard tier| ⛔ |

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

## Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Next steps
- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)