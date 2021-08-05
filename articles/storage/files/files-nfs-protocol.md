---
title: NFS file shares (preview) in Azure Files
description: Learn about file shares hosted in Azure Files using the Network File System (NFS) protocol.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/01/2021
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# NFS file shares in Azure Files (preview)
Azure Files offers two industry-standard protocols for mounting Azure file share: the [Server Message Block (SMB)](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol (preview). Azure Files enables you to pick the file system protocol that is the best fit for your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols, although you can create SMB and NFS file shares within the same storage account. For all file shares, Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

This article covers NFS Azure file shares. For information about SMB Azure file shares, see [SMB file shares in Azure Files](files-smb-protocol.md).

> [!IMPORTANT]
> While the service is in preview, production usage of this service isn't recommended. See the [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md) article for a list of known issues.

## Common scenarios
NFS file shares are often used in the following scenarios:

- Backing storage for Linux/UNIX-based applications, such as line-of-business applications written using Linux or POSIX file system APIs (even if they don't require POSIX-compliance).
- Workloads that require POSIX-compliant file shares, case sensitivity, or Unix style permissions(UID/GID).
- New application and service development, particularly if that application or service has a requirement for random IO and hierarchical storage. 

## Features
- Fully POSIX-compliant file system.
- Hard link support.
- Symbolic link support.
- NFS file shares currently only support most features from the [4.1 protocol specification](https://tools.ietf.org/html/rfc5661). Some features such as delegations and callback of all kinds, Kerberos authentication, and encryption-in-transit are not supported.


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

The following table shows the current level of support for Azure Storage features in accounts that have the NFS 4.1 feature enabled. 

The status of items that appear in this tables may change over time as support continues to expand.

| Storage feature | Supported for NFS shares |
|-----------------|---------|
| [File management plane REST API](/rest/api/storagerp/file-shares)	| ✔️ |
| [File data plane REST API](/rest/api/storageservices/file-service-rest-api)| ⛔ |
| Encryption at rest|	✔️ |
| Encryption in transit| ⛔ |
| [LRS or ZRS redundancy types](storage-files-planning.md#redundancy)|	✔️ |
| [Private endpoints](storage-files-networking-overview.md#private-endpoints) | ✔️  |
| Subdirectory mounts|	✔️ |
| [Grant network access to specific Azure virtual networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-virtual-networks)|  ✔️  |
| [Grant network access to specific IP addresses](../common/storage-network-security.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#grant-access-from-an-internet-ip-range)| ⛔ |
| [Premium tier](storage-files-planning.md#storage-tiers) |  ✔️  |
| [Standard tiers (Hot, Cool, and Transaction optimized)](storage-files-planning.md#storage-tiers)| ⛔ |
| [POSIX-permissions](https://en.wikipedia.org/wiki/File-system_permissions#Notation_of_traditional_Unix_permissions)|  ✔️  |
| Root squash|  ✔️  |
| [Identity-based authentication](storage-files-active-directory-overview.md) | ⛔ |
| [Azure file share soft delete](storage-files-prevent-file-share-deletion.md) | ⛔  |
| [Azure File Sync](../file-sync/file-sync-introduction.md)| ⛔ |
| [Azure file share backups](../../backup/azure-file-share-backup-overview.md)| ⛔ |
| [Azure file share snapshots](storage-snapshots-files.md)| ⛔ |
| [GRS or GZRS redundancy types](storage-files-planning.md#redundancy)| ⛔ |
| [AzCopy](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)| ⛔ |
| Azure Storage Explorer| ⛔ |
| Create NFS shares on existing storage accounts*| ⛔ |
| Support for more than 16 groups| ⛔ |

\* If a storage account was created prior to registering for NFS, you cannot use it for NFS. Only storage accounts created after registering for NFS can be used.

## Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Performance
NFS Azure file shares are only offered on premium file shares, which are SSD-backed. The IOPS and the throughput of NFS shares scale with the provisioned capacity. See the [provisioned model](understanding-billing.md#provisioned-model) section of the understanding billing article to understand the formulas for IOPS, IO bursting, and throughput. The IO latencies are low-single-digit-millisecond for small IO size while metadata latencies are high-single-digit-millisecond. Operations like untar or metadata heavy workloads like WordPress won't be performant.

## Validated workloads
> [!IMPORTANT]
> While the service is in preview, production usage of this service is not recommended. Highly recommend looking at [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md) article for list of known issues.

The following is a list of workloads that have been validated to work with NFS Azure file shares at the time of publishing this section. This list may change over time.
- Home directories for general purpose file servers
- Content repositories
- Shared user space (home directories) for application workloads

The following workloads have open issues and shouldn't be deployed at this time:
- IBM MQ will experience locking issues.
- Metadata heavy workloads such as untar may experience high latency
- Oracle Database will experience incompatibility with its dNFS feature.
- SAP Application Layer will experience inconsistent behavior due to a known active issue with ls -l.

Reach out to azurefilesnfs@microsoft .com to validate workloads not in the prior list or to share more successful workloads stories.

## Next steps
- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)
- [Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS](../common/nfs-comparison.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)
