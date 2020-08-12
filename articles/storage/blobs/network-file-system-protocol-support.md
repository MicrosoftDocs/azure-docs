---
title: Network File System 3.0 support in Azure Blob storage (preview) | Microsoft Docs
description: Blob storage now supports the Network File System (NFS) 3.0 protocol. This support enables Windows and Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer that runs on-premises.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 08/04/2020
ms.author: normesta
ms.reviewer: yzheng
ms.custom: references_regions
---

# Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)

Blob storage now supports the Network File System (NFS) 3.0 protocol. This support enables Windows or Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer on-premises. 

> [!NOTE]
> NFS 3.0 protocol support in Azure Blob storage is in public preview and is available in the following regions: US East, US Central, US West Central, Australia Southeast, North Europe, UK West, Korea Central, Korea South, and Canada Central.

## General workflow: Mounting a storage account container

To mount a storage account container, you'll have to do these things.

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

  For the purpose of this article, we'll refer to that VNet as the *primary VNet*. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- A peered VNet that is in the same region as the primary VNet.

  You'll have to configure your storage account to allow access to this peered VNet. To learn more, see [Grant access from a virtual network](../common/storage-network-security.md#grant-access-from-a-virtual-network).

- An on-premises network that is connected to your primary VNet by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager). 

  To learn more, see [Configuring access from on-premises networks](../common/storage-network-security.md#configuring-access-from-on-premises-networks).

- An on-premises network that is connected to a peered network.

  This can be done by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager) along with [Gateway transit](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/vnet-peering#gateway-transit). 

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

The following NFS 3.0 features aren't yet supported with Azure Data Lake Storage Gen2.

- NFS 3.0 over UDP. Only NFS 3.0 over TCP is supported.

- Locking files with Network Lock Manager (NLM). Mount commands must include the `-o nolock` parameter.

- Mounting sub-directories. You can only mount the root directory (Container).

- Listing mounts (For example: by using the command `showmount -a`)

- Listing exports (For example: by using the command `showmount -e`)

- Exporting a container as read-only

## Pricing

During the preview, the data stored in your storage account is billed at the same capacity rate that blob storage charges per GB per month. 

A transaction is not charged during the preview. Pricing for transactions is subject to change and will be determined when it is generally available.

## Next steps

To get started, see [Mount Blob storage by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).





