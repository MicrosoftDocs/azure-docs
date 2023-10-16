---
title: NFS file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Network File System (NFS) protocol.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 10/16/2023
ms.author: kendownie
ms.custom: references_regions, devx-track-linux
---

# NFS file shares in Azure Files
Azure Files offers two industry-standard file system protocols for mounting Azure file shares: the [Server Message Block (SMB)](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol, allowing you to pick the protocol that is the best fit for your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols, although you can create SMB and NFS file shares within the same FileStorage storage account. Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

This article covers NFS Azure file shares. For information about SMB Azure file shares, see [SMB file shares in Azure Files](files-smb-protocol.md).

> [!IMPORTANT]
> NFS Azure file shares aren't supported for Windows. Before using NFS Azure file shares in production, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json) for a list of known issues. NFS access control lists (ACLs) aren't supported.

## Common scenarios
NFS file shares are often used in the following scenarios:

- Backing storage for Linux/UNIX-based applications, such as line-of-business applications written using Linux or POSIX file system APIs (even if they don't require POSIX-compliance).
- Workloads that require POSIX-compliant file shares, case sensitivity, or Unix style permissions (UID/GID).
- New application and service development, particularly if that application or service has a requirement for random I/O and hierarchical storage. 

## Features
- Fully POSIX-compliant file system.
- Hard link support.
- Symbolic link support. 
- NFS file shares currently only support most features from the [4.1 protocol specification](https://tools.ietf.org/html/rfc5661). Some features such as delegations and callback of all kinds, Kerberos authentication, ACLs, and encryption-in-transit aren't supported.

> [!NOTE]
> Creating a hard link from an existing symbolic link isn't currently supported.

## Security and networking
All data stored in Azure Files is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't have to have access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

For encryption in transit, Azure provides a layer of encryption for all data in transit between Azure datacenters using [MACSec](https://en.wikipedia.org/wiki/IEEE_802.1AE). Through this, encryption exists when data is transferred between Azure datacenters. 

Unlike Azure Files using the SMB protocol, file shares using the NFS protocol don't offer user-based authentication. Authentication for NFS shares is based on the configured network security rules. Due to this, to ensure only secure connections are established to your NFS share, you must set up either a private endpoint or a service endpoint for your storage account. 

A private endpoint (also called a private link) gives your storage account a private, static IP address within your virtual network, preventing connectivity interruptions from dynamic IP address changes. Traffic to your storage account stays within peered virtual networks, including those in other regions and on premises. Standard [data processing rates](https://azure.microsoft.com/pricing/details/private-link/) apply.

If you don't require a static IP address, you can enable a [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Files within the virtual network. A service endpoint configures storage accounts to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. There's no extra charge for using service endpoints. 

If you want to access shares from on-premises, then you must set up a VPN or ExpressRoute in addition to a private endpoint. Requests that don't originate from the following sources will be rejected:

- [A private endpoint](storage-files-networking-overview.md#private-endpoints)
- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
    - [Point-to-site (P2S) VPN](../../vpn-gateway/point-to-site-about.md)
    - [Site-to-Site](../../vpn-gateway/design.md#s2smulti)
- [ExpressRoute](../../expressroute/expressroute-introduction.md)
- [A restricted public endpoint](storage-files-networking-overview.md#public-endpoint-firewall-settings)

For more details on the available networking options, see [Azure Files networking considerations](storage-files-networking-overview.md).

## Support for Azure Storage features

The following table shows the current level of support for Azure Storage features in accounts that have the NFS 4.1 feature enabled. 

The status of items that appear in this table might change over time as support continues to expand.

| Storage feature | Supported for NFS shares |
|-----------------|---------|
| [File management plane REST API](/rest/api/storagerp/file-shares)	| ✔️ |
| [File data plane REST API](/rest/api/storageservices/file-service-rest-api)| ⛔ |
| Encryption at rest|	✔️ |
| Encryption in transit| ⛔ |
| [LRS or ZRS redundancy types](storage-files-planning.md#redundancy)|	✔️ |
| [LRS to ZRS conversion](../common/redundancy-migration.md?tabs=portal#limitations-for-changing-replication-types)|	⛔ |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md#storage-account-endpoints) | ✔️  |
| [Private endpoints](storage-files-networking-overview.md#private-endpoints) | ✔️  |
| Subdirectory mounts|	✔️ |
| [Grant network access to specific Azure virtual networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-virtual-networks)|  ✔️  |
| [Grant network access to specific IP addresses](../common/storage-network-security.md?toc=/azure/storage/files/toc.json#grant-access-from-an-internet-ip-range)| ⛔ |
| [Premium tier](storage-files-planning.md#storage-tiers) |  ✔️  |
| [Standard tiers (Hot, Cool, and Transaction optimized)](storage-files-planning.md#storage-tiers)| ⛔ |
| [POSIX-permissions](https://en.wikipedia.org/wiki/File-system_permissions#Notation_of_traditional_Unix_permissions)|  ✔️  |
| Root squash|  ✔️  |
| Access same data from Windows and Linux client|  ⛔   |
| [Identity-based authentication](storage-files-active-directory-overview.md) | ⛔ |
| [Azure file share soft delete](storage-files-prevent-file-share-deletion.md) | ⛔  |
| [Azure File Sync](../file-sync/file-sync-introduction.md)| ⛔ |
| [Azure file share backups](../../backup/azure-file-share-backup-overview.md)| ⛔ |
| [Azure file share snapshots](storage-snapshots-files.md)|  ✔️ (preview) |
| [GRS or GZRS redundancy types](storage-files-planning.md#redundancy)| ⛔ |
| [AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json)| ⛔ |
| Azure Storage Explorer| ⛔ |
| Support for more than 16 groups| ⛔ |

## Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Performance
NFS Azure file shares are only offered on premium file shares, which store data on solid-state drives (SSD). The IOPS and throughput of NFS shares scale with the provisioned capacity. See the [provisioned model](understanding-billing.md#provisioned-model) section of the **Understanding billing** article to understand the formulas for IOPS, IO bursting, and throughput. The average IO latencies are low-single-digit-millisecond for small IO size, while average metadata latencies are high-single-digit-millisecond. Metadata heavy operations such as untar and workloads like WordPress may face additional latencies due to the high number of open and close operations.

> [!NOTE]
> You can use the `nconnect` Linux mount option to improve performance for NFS Azure file shares at scale. For more information, see [Improve NFS Azure file share performance](nfs-performance.md).

## Workloads
> [!IMPORTANT]
> Before using NFS Azure file shares in production, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json) for a list of known issues.

NFS has been validated to work well with workloads such as SAP application layer, database backups, database replication, messaging queues, home directories for general purpose file servers, and content repositories for application workloads.

## Next steps
- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)
- [Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS](../common/nfs-comparison.md?toc=/azure/storage/files/toc.json)
