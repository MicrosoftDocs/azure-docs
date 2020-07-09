---
title: Network File System 3.0 and Azure Data Lake Storage Gen2 (preview) | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with Azure Data Lake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 07/08/2020
ms.author: normesta
ms.reviewer: yzheng
ms.custom: references_regions
---

# Network File System (NFS) 3.0 protocol support in Azure Data Lake Storage Gen2 (preview)

Azure Data Lake Storage Gen2 supports the Network File System (NFS) 3.0 protocol. This support enables Linux clients to mount a container in Azure Data Lake Storage from an Azure Virtual Machine (VM) or a computer on-premises. 

> [!NOTE]
> Data Lake Storage Gen2 support for NFS 3.0 protocol is in public preview.
>
> In general-purpose v2 accounts, support is available in the following regions: US Central (EUAP), and US East 2 (EUAP) regions. 
>
> For BlockBlobStorage accounts, support is available in the following regions: US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast.

## Get started: Mount a storage account container

To mount a storage account container, you'll have to do these things.

1. Register NFS 3.0 protocol feature with your subscription.

2. Create an Azure Virtual Network (VNet).

3. Create and configure storage account that accepts traffic only from the VNet.

4. Create a container in the storage account.

5. Mount a container in the storage account.

> [!IMPORTANT]
> It's important to complete these tasks in order. You can't mount containers that you create before you enable the NFS 3.0 protocol on your account.

For step-by-step guidance, see [Mount Azure Data Lake Storage Gen2 on Linux by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).

## Supported network locations

A client can connect from any of these locations:

- The VNet that you configure for your storage account. 
  
  For the purpose of this article, we'll refer to that VNet as the *primary VNet*.

- A peered VNet that is in the same region as the primary VNet.

- An on-premises network that is connected to your primary VNet by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager).

- An on-premises network that is connected to a peered network.

  This can be done by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager) along with [Gateway transit](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/vnet-peering#gateway-transit).

## Azure Storage features not yet supported

The following Azure Storage features aren't supported when you enable the NFS 3.0 protocol on your account. 

- Azure Active Directory (AD) security

- POSIX access control lists (ACLs)

- Disabling NFS 3.0 support for a storage account 

- Access to the account by using REST APIs, Blob SDKs, or Data Lake Storage SDKs.

  Once you've enabled the NFS 3.0 protocol for your storage account, you can only use that protocol to access data in the storage account. 

## NFS 3.0 features not yet supported

The following NFS 3.0 features aren't yet supported with Azure Data Lake Storage Gen2.

- NFS 3.0 over UDP. Only NFS 3.0 over TCP is supported.

- Locking files with Network Lock Manager (NLM). Mount commands must include the `-o nolock` parameter.

- Mounting sub-directories. You can only mount the root directory (Container).

- Listing mounts (For example: by using the command `showmount -a`)

- Listing exports (For example: by using the command `showmount -e`)

- Post-operation attributes

- Weak Cache Consistency

- Mounting a container as read-only

## Pricing

During preview, the data stored in your storage account is billed at the same capacity rate that blob storage charges per GB per month. 

A transaction is free during the preview. Transactions will not be free when this feature becomes generally available. The exact transaction pricing is yet to be determined. 

## Next Steps

To get started, see [Mount Azure Data Lake Storage Gen2 on Linux by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).





