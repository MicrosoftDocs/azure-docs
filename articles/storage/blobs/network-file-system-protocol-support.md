---
title: Network File System 3.0 support in Azure Blob storage (preview) | Microsoft Docs
description: Blob storage now supports the Network File System (NFS) 3.0 protocol. This support enables Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer that runs on-premises.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 02/19/2021
ms.author: normesta
ms.reviewer: yzheng
ms.custom: references_regions
---

# Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)

Blob storage now supports the Network File System (NFS) 3.0 protocol. This support provides Linux file system compatibility at object storage scale and prices and enables Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer on-premises. 

> [!NOTE]
> NFS 3.0 protocol support in Azure Blob storage is in public preview. It supports GPV2 storage accounts with standard tier performance in the following regions: Australia East, Korea Central, and South Central US. The preview also supports block blob with premium performance tier in all public regions.

It's always been a challenge to run large-scale legacy workloads, such as High Performance Computing (HPC) in the cloud. One reason is that applications often use traditional file protocols such as NFS or Server Message Block (SMB) to access data. Also, native cloud storage services focused on object storage that have a flat namespace and extensive metadata instead of file systems that provide a hierarchical namespace and efficient metadata operations. 

Blob Storage now supports a hierarchical namespace, and when combined with NFS 3.0 protocol support, Azure makes it much easier to run legacy applications on top of large-scale cloud object storage. 

## Applications and workloads suited for this feature

The NFS 3.0 protocol feature is best suited for processing high throughput, high scale, read heavy workloads such as media processing, risk simulations, and genomics sequencing. You should consider using this feature for any other type of workload that uses multiple readers and many threads, which require high bandwidth. 

## NFS 3.0 and the hierarchical namespace

NFS 3.0 protocol support requires blobs to be organized into on a hierarchical namespace. You can enable a hierarchical namespace when you create a storage account. The ability to use a hierarchical namespace was introduced by Azure Data Lake Storage Gen2. It organizes objects (files) into a hierarchy of directories and subdirectories in the same way that the file system on your computer is organized.  The hierarchical namespace scales linearly and doesn't degrade data capacity or performance. Different protocols extend from the hierarchical namespace. The NFS 3.0 protocol is one of the these available protocols.   

> [!div class="mx-imgBorder"]
> ![hierarchical namespace](./media/network-protocol-support/hierarchical-namespace-and-nfs-support.png)
  
## Data stored as block blobs

If you enable NFS 3.0 protocol support, all of the data in your storage account will be stored as block blobs. Block blobs are optimized to efficiently process large amounts of read-heavy data. Block blobs are composed of blocks. Each block is identified by a block ID. A block blob can include up to 50,000 blocks. Each block in a block blob can be a different size, up to the maximum size permitted for the service version that your account uses.

When your application makes a request by using the NFS 3.0 protocol, that request is translated into combination of block blob operations. For example, NFS 3.0 read Remote Procedure Call (RPC) requests are translated into [Get Blob](/rest/api/storageservices/get-blob) operation. NFS 3.0 write RPC requests are translated into a combination of [Get Block List](/rest/api/storageservices/get-block-list), [Put Block](/rest/api/storageservices/put-block), and [Put Block List](/rest/api/storageservices/put-block-list).

## General workflow: Mounting a storage account container

Your Linux clients can mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer on-premises. To mount a storage account container, you'll have to do these things.

1. Register NFS 3.0 protocol feature with your subscription.

2. Verify that the feature is registered.

3. Create an Azure Virtual Network (VNet).

4. Configure network security.

5. Create and configure storage account that accepts traffic only from the VNet.

6. Create a container in the storage account.

7. Mount the container.

For step-by-step guidance, see [Mount Blob storage by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).

> [!IMPORTANT]
> It's important to complete these tasks in order. You can't mount containers that you create before you enable the NFS 3.0 protocol on your account. Also, after you've enabled the NFS 3.0 protocol on your account, you can't disable it.

## Network security

Your storage account must be contained within a VNet. A VNet enables clients to securely connect to your storage account. The only way to secure the data in your account is by using a VNet and other network security settings. Any other tool used to secure data including account key authorization, Azure Active Directory (AD) security, and access control lists (ACLs) are not yet supported in accounts that have the NFS 3.0 protocol support enabled on them. 

To learn more, see [Network security recommendations for Blob storage](security-recommendations.md#networking).

## Supported network connections

A client can connect over a public or a [private endpoint](../common/storage-private-endpoints.md), and can connect from any of the following network locations:

- The VNet that you configure for your storage account. 

  In this article, we'll refer to that VNet as the *primary VNet*. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- A peered VNet that is in the same region as the primary VNet.

  You'll have to configure your storage account to allow access to this peered VNet. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- An on-premises network that is connected to your primary VNet by using [VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or an [ExpressRoute gateway](../../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md). 

  To learn more, see [Configuring access from on-premises networks](../common/storage-network-security.md#configuring-access-from-on-premises-networks).

- An on-premises network that is connected to a peered network.

  This can be done by using [VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or an [ExpressRoute gateway](../../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md) along with [Gateway transit](/azure/architecture/reference-architectures/hybrid-networking/vnet-peering#gateway-transit). 

> [!IMPORTANT]
> If you're connecting from an on-premises network, make sure that your client allows outgoing communication through ports 111 and 2048. The NFS 3.0 protocol uses these ports.

## Azure Storage features not yet supported

The following Azure Storage features aren't supported when you enable the NFS 3.0 protocol on your account. 

- Azure Active Directory (AD) security

- POSIX-like access control lists (ACLs)

- The ability to enable NFS 3.0 support on existing storage accounts

- The ability to disable NFS 3.0 support in a storage account (after you've enabled it)

- Ability to write to blobs by using REST APIs or SDKs. 
  
## NFS 3.0 features not yet supported

The following NFS 3.0 features aren't yet supported.

- NFS 3.0 over UDP. Only NFS 3.0 over TCP is supported.

- Locking files with Network Lock Manager (NLM). Mount commands must include the `-o nolock` parameter.

- Mounting subdirectories. You can only mount the root directory (Container).

- Listing mounts (For example: by using the command `showmount -a`)

- Listing exports (For example: by using the command `showmount -e`)

- Hard link

- Exporting a container as read-only

## NFS 3.0 clients not yet supported

The following NFS 3.0 clients aren't yet supported.

- Windows client for NFS

## Pricing

During the preview, the data stored in your storage account is billed at the same capacity rate that blob storage charges per GB per month. 

A transaction is not charged during the preview. Pricing for transactions is subject to change and will be determined when it is generally available.

## Next steps

- To get started, see [Mount Blob storage by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).

- To optimize performance, see [Network File System (NFS) 3.0 performance considerations in Azure Blob storage (preview)](network-file-system-protocol-support-performance.md).
