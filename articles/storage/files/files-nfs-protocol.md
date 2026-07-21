---
title: NFS file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Network File System (NFS) protocol, including security, networking, feature support, and regional availability.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 07/08/2026
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a DevOps engineer, I want to deploy and manage NFS file shares in Azure Files, so that I can support Linux-based applications and workloads that require POSIX compliance and efficient data access."
---

# NFS Azure file shares

**Applies to:** :heavy_check_mark: NFS file shares

Azure Files supports two industry-standard protocols for mounting file shares: the [Server Message Block (SMB)](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol. Choose the protocol that best fits your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols, although you can create SMB and NFS file shares within the same FileStorage storage account. Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

This article covers NFS Azure file shares. For information about SMB Azure file shares, see [SMB file shares in Azure Files](files-smb-protocol.md).

> [!IMPORTANT]
> NFS Azure file shares aren't supported for Windows. Before using NFS Azure file shares in production, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json) for a list of known issues. NFS access control lists (ACLs) aren't supported.

## Common use cases for NFS Azure file shares

NFS file shares work well with workloads such as SAP application layer, database backups, database replication, messaging queues, home directories for general purpose file servers, and content repositories for application workloads.

NFS file shares are often used in the following scenarios:

- Backing storage for Linux/UNIX-based applications, such as line-of-business applications written using Linux or POSIX file system APIs
- Workloads that require POSIX-compliant file shares, case sensitivity, or Unix style permissions (UID/GID)
- New application and service development that requires random I/O and hierarchical storage

## NFS Azure file share features

NFS Azure file shares offer a fully POSIX-compliant file system. Hard links and symbolic links are supported, however you can't create a hard link from an existing symbolic link.

NFS Azure file shares currently support most features from the [NFSv4.1 protocol specification](https://tools.ietf.org/html/rfc5661). Some features such as delegations and callback of all kinds, Kerberos authentication, and ACLs aren't supported.

Locally redundant storage (LRS) and zone-redundant storage (ZRS) are supported for NFS Azure file shares. Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) aren't available for NFS shares because NFS requires SSD storage, which doesn't support geo-redundancy.

### NFS Azure file share support for Azure storage features

The following table shows the current level of feature support for NFS Azure file shares.

The status of items that appear in this table might change over time as support continues to expand.

| Storage feature | Supported for NFS shares |
|-----------------|---------|
| [File management plane REST API](/rest/api/storagerp/file-shares)	| ✔️ |
| [File data plane REST API](/rest/api/storageservices/file-service-rest-api)| ✔️ |
| Encryption at rest|	✔️ |
| [Encryption in transit](encryption-in-transit-for-nfs-shares.md)| ✔️ |
| [LRS or ZRS redundancy types](storage-files-planning.md#redundancy)|	✔️ |
| [LRS to ZRS conversion or vice versa](files-redundancy.md) (private endpoints only) | ✔️ |
| [GRS or GZRS redundancy types](storage-files-planning.md#redundancy)| ⛔ |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md#storage-account-endpoints) | ✔️  |
| [Private endpoints](storage-files-networking-overview.md#private-endpoints) | ✔️  |
| Subdirectory mounts|	✔️ |
| [Grant network access to specific Azure virtual networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-networks)|  ✔️  |
| [Grant network access to specific IP addresses](../common/storage-network-security.md?toc=/azure/storage/files/toc.json#grant-access-from-an-internet-ip-range)| ⛔ |
| [SSD media tier](storage-files-planning.md#storage-tiers) |  ✔️  |
| [HDD media tier](storage-files-planning.md#storage-tiers)| ⛔ |
| [POSIX-permissions](https://en.wikipedia.org/wiki/File-system_permissions#Notation_of_traditional_Unix_permissions)|  ✔️  |
| [Root squash](nfs-root-squash.md)|  ✔️  |
| Access same data from Windows and Linux client|  ⛔   |
| [Identity-based authentication](storage-files-active-directory-overview.md) | ⛔ |
| [Azure file share soft delete](storage-files-prevent-file-share-deletion.md) | ✔️ |
| [Azure File Sync](../file-sync/file-sync-introduction.md)| ⛔ |
| [Azure file share backups](../../backup/azure-file-share-backup-overview.md)| ⛔ |
| [Azure file share snapshots](storage-snapshots-files.md)|  ✔️ |
| [AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json)| ✔️ |
| Azure Storage Explorer| ✔️ |
| Azure Storage Browser on Azure portal| ⛔ |
| Support for more than 16 groups| ⛔ |

> [!NOTE]
> The 16-group limit is an NFS protocol constraint. Each user is limited to 16 group IDs (GIDs) per connection.

## Management model

NFS Azure file shares support two top-level resource providers:

- **Microsoft.FileShares** (recommended for new NFS deployments): Creates a standalone file share without a storage account. Supports only the [provisioned v2 billing model](understanding-billing.md#provisioned-v2-model).
- **Microsoft.Storage** (classic): Creates classic file shares within a storage account. Supports provisioned v1 and v2 billing models and the full Azure Files feature set.

For a full feature comparison, see [Comparing resource providers: Microsoft.Storage vs Microsoft.FileShares](storage-files-planning.md#comparing-resource-providers-microsoftstorage-versus-microsoftfileshares).

## Security and networking for NFS Azure file shares

NFS Azure file shares protect data through encryption at rest and in transit, and require network-level access controls in place of user-based authentication.

### Encryption

Azure Files encrypts all data at rest by using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: it encrypts data beneath the file system level. Because encryption happens beneath the Azure file share's file system as data is encoded to disk, you don't need access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

For [encryption in transit](encryption-in-transit-for-nfs-shares.md), Azure Files NFSv4.1 volumes enhance network security by enabling secure TLS connections between the server and the client, protecting data in transit from interception. Azure Files provides a dedicated **Require Encryption in Transit for NFS** setting to independently control whether encryption is required for NFS access. For new storage accounts created by using the Azure portal, this setting is enabled by default. Storage accounts created by using Azure PowerShell, Azure CLI, or the FileREST API set this value as **Not selected** to ensure backward compatibility. For existing storage accounts, the **Secure transfer required** setting continues to govern NFS encryption behavior until you explicitly configure the per-protocol setting.

Azure provides a layer of encryption for all data in transit between Azure datacenters by using [MACSec](https://en.wikipedia.org/wiki/IEEE_802.1AE). Through this technology, encryption exists when data is transferred between Azure datacenters.

### Authentication and network access

Unlike Azure Files using the SMB protocol, file shares that use the NFS protocol don't offer user-based authentication. Authentication for NFS shares is based on the configured network security rules. For this reason, to ensure your NFS share accepts only secure connections, you must set up either a private endpoint or a service endpoint for your storage account.

A private endpoint (also called a private link) gives your storage account a private, static IP address within your virtual network, preventing connectivity interruptions from dynamic IP address changes. Traffic to your storage account stays within peered virtual networks, including those in other regions and on-premises. Standard [data processing rates](https://azure.microsoft.com/pricing/details/private-link/) apply.

If you don't require a static IP address, you can enable a [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Files within the virtual network. A service endpoint configures storage accounts to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. There's no extra charge for using service endpoints. However, a rare event such as a zone outage could change the underlying IP address of the storage account. While the data is still available on the file share, you need to remount the share.

If you want to access shares from on-premises, set up a VPN or ExpressRoute in addition to a private endpoint. Requests that don't originate from the following sources are rejected:

- [A private endpoint](storage-files-networking-overview.md#private-endpoints)
- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
    - [Point-to-site VPN](../../vpn-gateway/point-to-site-about.md)
    - [Site-to-site VPN](../../vpn-gateway/design.md#s2smulti)
- [ExpressRoute](../../expressroute/expressroute-introduction.md)
- [A restricted public endpoint](storage-files-networking-overview.md#public-endpoint-firewall-settings)

For more information about networking options, see [Azure Files networking considerations](storage-files-networking-overview.md).

## NFS Azure file share regional availability

NFS Azure file shares are supported in all regions that support SSD file shares. See [Azure products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=storage&regions=all).

## NFS Azure file share performance

NFS Azure file shares are only available on SSD file shares. Under the provisioned v2 billing model, you can set provisioned capacity, IOPS, and throughput independently, giving you precise cost control for NFS workloads with predictable I/O patterns. Under the provisioned v1 billing model, IOPS and throughput scale automatically with provisioned capacity. For details on both models, see [Understand Azure Files billing](understanding-billing.md).

Typical I/O latencies for SSD Azure file shares are in the low-single-digit millisecond range for small I/O operations. Metadata-heavy workloads such as untar might experience higher latencies due to the high volume of open and close operations.

For guidance on improving NFS performance at scale, see [Improve NFS Azure file share performance](nfs-performance.md).

## Next steps

- [Create a file share with Microsoft.FileShares](create-file-share.md)
- [Create a classic file share](create-classic-file-share.md)
- [Compare NFS options across Azure storage services](../common/nfs-comparison.md?toc=/azure/storage/files/toc.json)
