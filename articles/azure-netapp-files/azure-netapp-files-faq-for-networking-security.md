---
title: Networking and security FAQs for Azure NetApp Files | Microsoft Docs
description: Describes causes, solutions, and workarounds for common SDE Resource Provider errors.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''
tags:

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/03/2018
ms.author: b-juche
---
# Networking and security FAQs for Azure NetApp Files
This article answers networking and security questions that you might have about Azure NetApp Files.

## Networking FAQs

### <a name="faq_network_01"></a>What does the high-level network topology look like for the service?

An Azure Virtual Network (VNet) is connected to the Azure NetApp Files service by using Azure ExpressRoute dedicated network connections over private network links.


### <a name="faq_network_02"></a>Does the NFS data path go over the Internet?

No. The NFS data path does not go over the Internet. The Azure NetApp Files service uses a network exchange service (Equinix Cloud Exchange) that has dedicated private network connectivity to Azure.


### <a name="faq_network_03"></a>What is the available network bandwidth and capability for the ExpressRoute circuit that is used by the Azure NetApp Files service?

The service uses 10 Gbps Standard ExpressRoute circuits. The Azure Virtual Network Gateways that are used for the Azure NetApp Files service are the Ultra Performance (9 Gbps) SKU gateways. 


### <a name="faq_network_04"></a>Can I request more bandwidth?

Based on use case and performance requirements, during Public Preview and General Availability, the service will use a wider range of Express Route circuit and VNet Gateway options. 


### <a name="faq_network_05"></a>Are there any SLAs or guarantees of network performance or availability?

ExpressRoute network connection availability is based on documented SLAs for the [ExpressRoute service](https://azure.microsoft.com/support/legal/sla/expressroute/v1_0/). 

Microsoft guarantees a minimum of 99.9% uptime for the ExpressRoute service. 

There are no guarantees of network performance implied or explicitly made by Microsoft. 
>[!NOTE]
>The infrastructure for the Azure NetApp Files service uses redundant network connections to the Azure network and uses diverse network exchange ports.
 


### <a name="faq_network_06"></a>Can I connect a VNet that I have already created to the Azure NetApp Files service?

You will be able to connect VNets that you have created to the service. 

However, when you use a pre-existing VNet, the VNet must have an available /28 block of IP addresses for the Gateway Subnet that ExpressRoute uses. If your VNet does not have an available /28 block of IP addresses, you will need to add a /28 address space to the VNet, and you will also need to create a Gateway Subnet from that address space.



### <a name="faq_network_07"></a>Can I connect to the Azure NetApp Files service from my on-site network using a dedicated ExpressRoute connection?

No. Microsoft Azure supports connecting up to four ExpressRoute circuits to an Azure VNet using separate providers. However, ExpressRoute does not support transitive routing via the Azure VNet (Storage Network <--> VNet <--> Customer On-site Network). 

Connecting directly to the Storage Network from your on-site network bypassing the Equinix Cloud Exchange is not supported.



### <a name="faq_network_08"></a>Can I connect to the VNet you created for me to my on-site network using Site-to-Site VPN ExpressRoute?

Yes.  As indicated in ExpressRoute documentation [Configure ExpressRoute and Site-to-Site coexisting connections](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager), transitive routing between your on-site network and the Azure NetApp Files storage network via the Azure VNet (Storage Network <--> VNet <--> Customer On-site Network) is not supported. Therefore, there will be no IP address collision or network routes leaked from the service into your on-site network.



### <a name="faq_network_09"></a>Can a network route from the service leak or be propagated into my on-site network or other VNets in my Azure subscription?

No. The routes from the service cannot be propagated beyond the Azure VNet that the service is connected to.



### <a name="faq_network_10"></a>What Autonomous System Number (ASN) are you using in your storage network?

The service uses a private ASN number: 64531.


### <a name="faq_network_11"></a>Are there risks of the service using an IP address that collides with other IP addresses that I use in Azure or in my on-site network?

No. By your providing the VNet configuration during the onboarding process, NetApp ensures that the storage network does not collide with an address space that the VNet uses to connect to the service. The route to the storage network is not propagated outside the virtual network that is connected to the service.



### <a name="faq_network_12"></a>Where is the ExpressRoute circuit resource? I don’t see it in my resource group.

The ExpressRoute circuit is created under a Microsoft subscription, and the VNet in your subscription is connected to the circuit via an ExpressRoute authorization key.


### <a name="faq_network_13"></a>What are the costs associated with the Azure ExpressRoute circuit and the Azure VNet gateway?

There is no charge associated with the ExpressRoute circuit that is provided for accessing the Azure NetApp Files service.  Upon request, Microsoft can provide a sponsored pass to offset the cost of the VNet gateway that is deployed for accessing the Azure NetApp Files service.

The VNet gateway pricing model is rated on a per-hour basis, regardless of whether data is transiting across the ExpressRoute circuit. For more information, see the [Azure VNet Gateway documentation](https://azure.microsoft.com/pricing/details/vpn-gateway/). 



### <a name="faq_network_14"></a>Can I request a specific IP address range for the storage network?

For special situations, you can request a specific IP address range (CIDR) to be used by the storage network. 



## Security FAQs


### <a name="faq_security_01"></a>Does the NFS data path go over the Internet?

No. The NFS data path does not go over the Internet. The Azure NetApp Files service uses a network exchange service (Equinix Cloud Exchange) that has dedicated private network connectivity to Azure.


### <a name="faq_security_02"></a>Can the network traffic between the Azure VM and the storage be encrypted?

Currently, the NFS service only supports NFSv3, so the network traffic is not encrypted.

During Public Preview and General Availability of the program, NFSv4 and NFSv4.1 will be available to support network traffic encryption. 

VPN tunnels across the ExpressRoute circuit is not supported.



### <a name="faq_security_03"></a>Can the storage be encrypted at rest?

No. Storage encryption at rest is not currently supported by the service but is intended to be available by General Availability.  


### <a name="faq_security_04"></a>Can I configure the network security group rules to control access to the Azure NetApp Files service mount target?

Yes. You can modify the network security group rules to control access to the Azure NetApp Files service mount target. The following network ports must be open:
- Port 111 (TCP and UDP)
- Port 2049 (TCP and UDP)



### <a name="faq_security_05"></a>Can I configure the NFS export policy rules to control access to the Azure NetApp Files service mount target?

Yes. You can configure up to five rules in a single NFS export policy.



### <a name="faq_security_06"></a>Can I use Windows OpenSSH client with the Azure NetApp Files service?

Yes. All clients that support the NFSv3 standard are supported. 
	


## Next steps

* [Read the Microsoft Azure ExpressRoute FAQs](https://docs.microsoft.com/azure/expressroute/expressroute-faqs)
* [Learn about Microsoft Azure ExpressRoute service SLAs](https://azure.microsoft.com/support/legal/sla/expressroute/v1_0/)
* [Learn how to configure ExpressRoute and site-to-site coexisting connections](https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager) 
* [Learn about Microsoft Azure Virtual Network Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/)
* [Learn about the Network Contributor built-in role of Azure role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles#network-contributor)

