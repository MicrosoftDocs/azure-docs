---
title: Azure Files networking considerations | Microsoft Docs
description: An overview of networking options for Azure Files.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 10/19/2019
ms.author: rogarana
ms.subservice: files
---

# Azure Files networking considerations 
You can connect to an Azure file share in two ways:

- Accessing the share directly via the SMB or FileREST protocols. This access pattern is primarily employed when to eliminate as many on-premises servers as possible.
- Creating a cache of the Azure file share on an on-premises server with Azure File Sync, and accessing the file share's data from the on-premises server with your protocol of choice (SMB, NFS, FTPS, etc.) for your use case. This access pattern is handy because it combines the best of both on-premises performance and cloud scale and serverless attachable services, such as Azure Backup.

This article focuses on how to configure networking for when your use case calls for accessing the Azure file share directly rather than using Azure File Sync. For more information about networking considerations for an Azure File Sync deployment, see [configuring Azure File Sync proxy and firewall settings](storage-sync-files-firewall-and-proxy.md).

## Storage account settings
A storage account is a management construct that represents a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues. Azure storage accounts expose two basic sets of settings to secure the network: encryption in transit and firewalls and virtual networks (VNets).

### Encryption in transit
By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files will only allow the connection if it is made with SMB 3.0+ with encryption or HTTPS. Clients that do not support SMB 3.0 or clients that support SMB 3.0 but not SMB encryption will not be able to mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.0 with encryption, see our detailed documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.  

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1, SMB 3.0 without encryption, and un-encrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, will not be able to access the file share.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Firewalls and virtual networks 
A firewall is a network policy which requests are allowed to access the Azure file shares and other storage resources in your storage account. When a storage account is created with the default networking settings, it is not restricted to a specific network and therefore is internet accessible. This does not mean anyone on the internet can access the data stored on the Azure file shares hosted in your storage account, but rather that the storage account will accept authorized requests from any network. Requests can be authorized with a storage account key, a shared access signature (SAS) token (FileREST only), or with an Active Directory user principal. 

The firewall policy for a storage account may be used to restrict access to certain IP addresses or ranges, or to a virtual network. In general, most firewall policies for a storage account will restrict networking access to a virtual network. 

A [virtual network](../../virtual-network/virtual-networks-overview.md), or VNet, is similar to a traditional network that you'd operate in your own datacenter. It allows you to create a secure communication channel for your Azure resources such as Azure file shares, VMs, SQL Databases, etc. to communicate with each other. Like an Azure storage account or an Azure VM, a VNet is an Azure resource that is deployed in a resource group. With additional networking configuration, Azure VNets may also be connected to your on-premises networks.

When resources such as an Azure VM are added to a virtual network, a virtual network interface (NIC) attached to the virtual machine is restricted to specifically that VNet. This is possible because Azure VMs are virtualized computers, which of course have NICs. Virtual machines are offered as part of Azure's infrastructure-as-a-service, or IaaS, product lineup. Because Azure file shares are serverless file shares, they do not have a NIC for you to add to a VNet. Said a different way, Azure Files are offered as part of Azure's platform-as-a-service, or PaaS, product lineup. To enable a storage account to be able to be a part of a VNet, Azure supports a concept for PaaS services called service endpoints. A service endpoint allows PaaS services be a part of a virtual network. To learn more about service endpoints, see [virtual network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

A storage account can be added to one or more virtual networks. To learn more about how to add your storage account to a virtual network or configure other firewall settings, see [configure Azure storage firewalls and virtual networks](../common/storage-network-security.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

## Azure networking
By default, Azure services including Azure Files can be accessed over the internet. Since by default traffic to your storage account is encrypted (and SMB 2.1 mounts are never allowed outside of an Azure region), there is nothing inherently insecure about accessing your Azure file shares over the internet. Based on your organization's policy or unique regulatory requirements, you may require more restrictive communication with Azure, and therefore Azure provides several ways to restrict how traffic from outside of Azure gets to Azure Files. You can further secure your networking when accessing your Azure file share by using the following service offerings:

- [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md): A VPN gateway is a specific type of virtual network gateway that is used to send encrypted traffic between an Azure virtual network and an alternate location (such as on-premises) over the internet. An Azure VPN Gateway is an Azure resource that can be deployed in a resource group along side of a storage account or other Azure resources. VPN gateways expose two different types of connections:
    - [Point-to-Site (P2S) VPN](../../vpn-gateway/point-to-site-about.md) gateway connections, which are VPN connections between Azure and an individual client. This solution is primarily useful for devices that are not part of your organization's on-premises network, such as telecommuters who want to be able to mount their Azure file share from home, a coffee shop, or hotel while on the road. To use a P2S VPN connection with Azure Files, a P2S VPN connection will need to be configured for each client that wants to connect. 
    - [Site-to-Site (S2S) VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md#s2smulti), which are VPN connections between Azure and your organization's network. A S2S VPN connection enables you to configure a VPN connection once, for a VPN server or device hosted on your organization's network, rather than doing for every client device that needs to access your Azure file share.
- [ExpressRoute](../../expressroute/expressroute-introduction.md), which enables you to create a defined route between Azure and your on-premises network that doesn't traverse the internet. Because ExpressRoute provides a dedicated path between your on-premises datacenter and Azure, ExpressRoute may be useful when network performance is a consideration. ExpressRoute is also a good option when your organization's policy or regulatory requirements require a deterministic path to your resources in the cloud.

## Securing access from on-premises 
When you migrate general-purpose file shares (for things like Office documents, PDFs, CAD documents, etc.) to Azure Files, your users typically will continue to need to access their files from on-premises devices such as their workstations, laptops, and tablets. The main consideration for a general-purpose file share is how on-premises users can securely access their file shares through the internet or WAN.

The easiest way to access your Azure file share from on-premises is to open your on-premises network to port 445, the port that SMB uses, and mount the UNC path provided by the Azure portal. This requires no special networking required. Many customers are reluctant to open port 445 because of outdated security guidance around SMB 1.0, which Microsoft does not consider to be an internet safe protocol. Azure Files does not implement SMB 1.0. 

SMB 3.0 was designed with the explicit requirement of being internet safe file share protocols. Therefore, when using SMB 3.0+, from the perspective of computer networking, opening port 445 is no different than opening port 443, the port used for HTTPS connections. Rather than blocking port 445 to prevent insecure SMB 1.0 traffic, Microsoft recommends the following steps:

> [!Important]  
> Even if you decide to leave port 445 closed to outbound traffic, Microsoft still recommends following these steps to remove SMB 1.0 from your environment.

1. Ensure that SMB 1.0 is removed or disabled on your organization's devices. All currently supported versions of Windows and Windows Server support removing or disabling SMB 1.0, and starting with Windows 10, version 1709, SMB 1.0 is not installed on the Windows by default. To learn more about how to disable SMB 1.0, see our OS-specific pages:
    - [Securing Windows/Windows Server](storage-how-to-use-files-windows.md#securing-windowswindows-server)
    - [Securing Linux](storage-how-to-use-files-linux.md#securing-linux)
1. Ensure that no products within your organization require SMB 1.0 and remove the ones that do. We maintain an [SMB1 Product Clearinghouse](https://aka.ms/stillneedssmb1), which contains all the first and third-party products known to Microsoft to require SMB 1.0. 
1. (Optional) Use a third-party firewall with your organization's on-premises network to prevent SMB 1.0 traffic.

If your organization requires port 445 to be blocked per policy or regulation, you can use Azure VPN Gateway or ExpressRoute to tunnel traffic over port 443. To learn more about the specific steps for deploying these, see our specific how to pages:
- [Configure a Site-to-Site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)
- [Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md)
- [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md)

Your organization may have the additional requirement that traffic outbound from your on-premises site must follow a deterministic path to your resources in the cloud. If so, ExpressRoute is capable of meeting this requirement.

## Securing access from cloud resources
Generally, when an on-premises application is lifted and shifted to the cloud, the application and the application's data are moved at the same time. This means that the primary consideration for a lift and shift migration is locking down access to the Azure file share to the specific virtual machines or Azure services that require access to the file share to operate. 

You may wish to use VNets to limit which VMs or other Azure resources are allowed to make network connections (SMB mounts or REST API calls to your Azure file share). We always recommend putting your Azure file share in a VNet if you allow un-encrypted traffic to your storage account. Otherwise, whether or not you use VNets is a decision that should be driven by your business requirements and organizational policy.

The principal reason to allow un-encrypted traffic to your Azure file share is to support Windows Server 2008 R2, Windows 7, or other older OS accessing your Azure file share with SMB 2.1 (or SMB 3.0 without encryption for some Linux distributions). We do not recommend using SMB 2.1 or SMB 3.0 without encryption on operating systems that support SMB 3.0+ with encryption.

## See also
- [Azure Files overview](storage-files-introduction.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)