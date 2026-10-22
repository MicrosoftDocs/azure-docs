---
title: NFS file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Network File System (NFS) protocol, including security, networking, feature support, and regional availability.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/03/2026
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a DevOps engineer, I want to deploy and manage NFS file shares in Azure Files, so that I can support Linux-based applications and workloads that require POSIX compliance and efficient data access."
---

# NFS Azure file shares

**Applies to:** :heavy_check_mark: NFS file shares created with Microsoft.Storage or Microsoft.FileShares

Azure Files supports two industry-standard protocols for mounting file shares: the [Server Message Block (SMB)](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) protocol and the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol. Choose the protocol that best fits your workload. Azure file shares don't support accessing an individual Azure file share with both the SMB and NFS protocols. For classic file shares, you can create separate SMB and NFS file shares within the same FileStorage storage account. Microsoft.FileShares currently supports only NFS file shares. Azure Files offers enterprise-grade file shares that can scale up to meet your storage needs and can be accessed concurrently by thousands of clients.

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

### NFS Azure file share support for Azure Files features

The following table shows the current level of feature support for NFS Azure file shares. Unless noted, support applies to both classic file shares (Microsoft.Storage) and file shares created with Microsoft.FileShares.

The status of items that appear in this table might change over time as support continues to expand.

| Storage feature | Supported for NFS shares |
|-----------------|---------|
| File management plane REST API | ✔️ [Microsoft.Storage](/rest/api/storagerp/file-shares) and [Microsoft.FileShares](/rest/api/fileshares/file-shares) |
| [File data plane REST API](/rest/api/storageservices/file-service-rest-api)| ✔️ Classic file shares only |
| Encryption at rest|	✔️ |
| [Encryption in transit](#encryption)| ✔️ |
| [LRS or ZRS redundancy types](storage-files-planning.md#redundancy)|	✔️ |
| [LRS to ZRS conversion or vice versa](files-change-redundancy-configuration.md) (private endpoints only) | ✔️ Classic file shares only |
| [GRS or GZRS redundancy types](storage-files-planning.md#redundancy)| ⛔ |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md?toc=/azure/storage/files/toc.json#storage-account-endpoints) | ✔️ Classic file shares only |
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
| [Azure file share soft delete](storage-files-prevent-file-share-deletion.md) | ✔️ Classic file shares only |
| [Azure File Sync](../file-sync/file-sync-introduction.md)| ⛔ |
| [Azure file share backups](../../backup/azure-file-share-backup-overview.md)| ⛔ |
| [Azure file share snapshots](storage-snapshots-files.md)|  ✔️ |
| [AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json)| ✔️ Classic file shares only |
| Azure Storage Explorer| ✔️ Classic file shares only |
| Azure Storage Browser on Azure portal| ⛔ |
| Support for more than 16 groups| ⛔ |

> [!NOTE]
> The 16-group limit is an NFS protocol constraint. Each user is limited to 16 group IDs (GIDs) per connection.

## Management model

NFS Azure file shares support two top-level resource providers:

- **Microsoft.FileShares** (recommended for new NFS deployments): Creates a standalone file share without a storage account. Supports only the [provisioned v2 billing model](understanding-billing.md#provisioned-v2-model).
- **Microsoft.Storage** (classic): Creates classic file shares within a storage account. Supports provisioned v1 and v2 billing models for NFS shares.

For a full feature comparison, see [Comparing resource providers: Microsoft.Storage vs Microsoft.FileShares](files-management-concepts.md#comparing-resource-providers-microsoftstorage-versus-microsoftfileshares).

## Security and networking for NFS Azure file shares

NFS Azure file shares protect data through encryption at rest and in transit, and require network-level access controls in place of user-based authentication.

### Encryption

Azure Files encrypts all data at rest by using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: it encrypts data beneath the file system level. Because encryption happens beneath the Azure file share's file system as data is encoded to disk, you don't need access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

Both classic file shares and Microsoft.FileShares file shares support TLS encryption in transit through the [AZNFS mount helper](encryption-in-transit-for-nfs-shares.md). You configure encryption requirements at different scopes:

- **Microsoft.FileShares**: Encryption in transit is required by default. You configure this requirement on the individual file share. See [Advanced settings when creating a file share](create-file-share.md#advanced).
- **Classic file shares**: You configure **Require Encryption in Transit for NFS** on the storage account. For new storage accounts created through the Azure portal, this setting is enabled by default. When the setting is **Not selected**, **Secure transfer required** governs NFS encryption behavior. For creation defaults and configuration steps, see [Enforce encryption in transit](encryption-in-transit-for-nfs-shares.md#enforce-encryption-in-transit).

Azure provides a layer of encryption for all data in transit between Azure datacenters by using [MACSec](https://en.wikipedia.org/wiki/IEEE_802.1AE). Through this technology, encryption exists when data is transferred between Azure datacenters.

### Authentication and network access

Because NFS Azure file shares don't support user-based authentication, they rely on network access rules to authenticate clients. Clients must therefore connect through a private endpoint or a service endpoint with virtual network restrictions.

Both classic file shares and Microsoft.FileShares file shares support these connection options. For classic file shares, you configure networking on the storage account. For Microsoft.FileShares, you configure networking on the individual file share.

#### Private endpoints
A [private endpoint](storage-files-networking-overview.md#private-endpoints) provides a private IP address in your virtual network for access to the file share. To allow access only through private endpoints, disable public network access. [Private Link charges](https://azure.microsoft.com/pricing/details/private-link/) apply.

Clients can connect from the virtual network or from peered virtual networks. For on-premises access, connect your network to the virtual network through a [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../../expressroute/expressroute-introduction.md).

#### Service endpoints
A [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) lets clients in a subnet access the file share's public endpoint over the Azure backbone. Enable the service endpoint on the client subnet. Configure the file share's network rules to allow that subnet. Allowed subnets can be in the same subscription or a different subscription, including a different Microsoft Entra tenant. There's no extra charge for service endpoints.

A service endpoint doesn't assign a private IP address to the file share. If a rare event, such as a zone outage, changes the public endpoint's IP address, clients might need to remount the share.

#### Optional outbound filtering
The file share's network rules control which clients can access it. They don't limit which other storage resources those clients can access. For example, a client that can read your file share could copy data to another resource it has permission to write to.

For classic file shares, you can optionally use a service endpoint policy to limit which storage accounts clients in a subnet can access through service endpoints. Service endpoint traffic bypasses Azure Firewall and network virtual appliances. A policy filters destinations on this path. It doesn't restrict other outbound paths or replace the destination's network rules and authorization requirements.

Service endpoint policies aren't currently supported for Microsoft.FileShares file shares. If the client subnet has a policy, clients must use a private endpoint to access those file shares. For more information, see [Restrict outbound access with service endpoint policies](storage-files-networking-overview.md#restrict-outbound-access-with-service-endpoint-policies).

For more information about networking options, see [Azure Files networking considerations](storage-files-networking-overview.md).

## NFS Azure file share regional availability

Regional availability depends on the resource provider and redundancy option:

- **Microsoft.FileShares**: See [LRS regions](redundancy-premium-file-shares.md#lrs-support-for-ssd-file-shares) and [ZRS regions](redundancy-premium-file-shares.md#zrs-support-for-ssd-file-shares).
- **Classic file shares**: See [LRS regions](redundancy-premium-file-shares.md#lrs-support-for-ssd-classic-file-shares) and [ZRS regions](redundancy-premium-file-shares.md#zrs-support-for-ssd-classic-file-shares).

## NFS Azure file share performance

NFS Azure file shares are only available on SSD file shares. Both resource providers support the provisioned v2 billing model, which lets you set provisioned capacity, IOPS, and throughput independently. Classic file shares also support the provisioned v1 billing model, in which IOPS and throughput scale automatically with provisioned capacity. For details on both models, see [Understand Azure Files billing](understanding-billing.md).

Typical I/O latencies for SSD Azure file shares are in the low-single-digit millisecond range for small I/O operations. Metadata-heavy workloads such as untar might experience higher latencies due to the high volume of open and close operations.

For guidance on improving NFS performance at scale, see [Improve NFS Azure file share performance](nfs-performance.md).

## Next steps

- [Create a file share with Microsoft.FileShares](create-file-share.md)
- [Create a classic file share](create-classic-file-share.md)
- [Compare NFS options across Azure storage services](../common/nfs-comparison.md?toc=/azure/storage/files/toc.json)
