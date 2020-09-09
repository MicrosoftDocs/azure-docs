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

Mounting Azure file shares with SMB is our more mature offering, it has more available Azure Files features and no Azure Files feature restrictions since it is generally available.

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

### Security

SMB offers etc. 

## NFS shares (preview)

Mounting Azure file shares with NFS is our newer offering, and is currently in preview. It has fewer available Azure Files features but offers a tighter integration with Linux. Azure Files offers NFS v4.1 protocol that is fully managed, network-attached storage. It is highly scalable, highly durable, and highly available. This is a fully POSIX-compliant offer that is a standard across variants of Unix and other *nix based operating systems. This enterprise-grade file storage service scales up to meet your storage needs and can be accessed concurrently by thousands of compute instances. You can start with a file system that contains only 100 GiB data to 100 TiB per volume. Moreover, your data and metadata are protected with encryption at rest by default. NFS is currently in preview and should not be used for production data.

### Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

#### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

### Best suited

NFS with Azure Files is ideal for:

- Workloads that require POSIX-compliant file shares.
- SAP.
- Linux-centric workloads that do not require SMB access.
- A workload that necessitates frequent random access.


### Security

File shares using the NFS protocol currently only have encryption-at-rest, not encryption-in-transit. Due to this, to ensure only secure connections are established to your storage account, you must use one of the following supported network connections:

- A VNet that was configured for your storage account. 

  For the purpose of this article, we'll refer to that VNet as the *primary VNet*. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- A peered VNet in the same region as the primary VNet.

  You'll have to configure your storage account to allow access to this peered VNet. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- An on-premises network that is connected to your primary VNet by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager). 

  To learn more, see [Configuring access from on-premises networks](../common/storage-network-security.md#configuring-access-from-on-premises-networks).

- An on-premises network that is connected to a peered network.

  This can be done by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager) along with [Gateway transit](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/vnet-peering#gateway-transit). 

> [!IMPORTANT]
> If you're connecting from an on-premises network, make sure that your client allows outgoing communication through port 2049. The NFS 4.1 protocol uses this port.


## Next steps

- [Create an NFS file share](storage-files-how-to-create-nfs-shares.md)
- Create an SMB file share