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
---

# Network File System (NFS) 3.0 protocol support in Azure Data Lake Storage Gen2 (preview)

Azure Data Lake Storage Gen2 supports the Network File System (NFS) 3.0 protocol. This support enables you to mount a container in Azure Data Lake Storage from a Linux-based Azure Virtual Machine (VM) or from a computer that runs Linux on on-premises. 

> [!NOTE]
> NFS 3.0 protocol support is in public preview.
> Support is available for general-purpose v2 accounts in the following regions: US Central (EUAP), and US East 2 (EUAP) regions. 
> Support is available for BlockBlobStorage accounts in the following regions: US East, US Central, US West Central, UK West, Korea South, Korea Central, EU North, Canada Central, and Australia Southeast.

## Mount a storage account container

To mount a storage account container, you'll have to do these things.

1. Register NFS 3.0 protocol feature with your subscription.

2. Create an Azure Virtual Network (VNet).

3. Create and configure storage account that accepts traffic only from the VNet.

4. Create containers in the storage account.

> [!IMPORTANT]
> The order in which you complete these tasks are important. First register, then create and configure the account, and then add containers. You can't mount containers that you create before you enable the NFS 3.0 protocol on your account.

For step-by-step guidance, see [Mount Azure Data Lake Storage Gen2 on Linux by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).

## Supported network locations

A connecting client can run any of these locations:

- The VNet that you configure for your storage account. 
  
  For the purpose of this article, we'll refer to that VNet as the *primary VNet*.

- A peered VNet that is in the same region as the primary VNet.

- An on-premises network that is connected to your primary VNet by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager).

- An on-premises network that is connected to a peered network.

  This can be done by using [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or an [ExpressRoute gateway](https://docs.microsoft.com/azure/expressroute/expressroute-howto-add-gateway-portal-resource-manager) gateway along with [Gateway transit](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/vnet-peering#gateway-transit).

## Known issues and feature limitations

- Any security configurations other than network security are not yet supported.

  This includes any aspect of Azure Active Directory (AD) including Role Based Access Control (RBAC) as well as POSIX ACLs on directories and containers.

- Once you've enable stuff. You can't disable it.

- UDP. We only support TCP
- Locking (i.e. Network Lock Manager (NLM))
- Quotad for supporting quotas
- Mounting a subdirectory
- Listing mounts, i.e. “showmount -a”
- Listing exports via “showmount -e”
  Note: We support listing exports via List File Systems
- Exporting via the RPC call EXPORT
  Note: We have export support for Create File System and a flag Hard links
- Post-op attributes
- WCC
- Read-only mount
- During preview, the only way to access data in the NFS v3 enabled storage account is through NFS. You cannot access it via blob REST apis. The blob REST api access will be available at GA timeframe. 

## Pricing

During preview, the data stored in your NFS test storage accounts are billed the same capacity rate blob storage has per GB per month. 
The transaction is free during preview. Transaction will not be free at GA timeframe. The exact transaction pricing is to be determined. 

## Next Steps

To get started, see [Mount Azure Data Lake Storage Gen2 on Linux by using the Network File System (NFS) 3.0 protocol (preview)](network-file-system-protocol-support-how-to.md).






