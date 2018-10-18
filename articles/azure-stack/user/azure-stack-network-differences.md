---
title: Azure Stack networking Differences and considerations | Microsoft Docs
description: Learn about differences and considerations when working with networking in Azure Stack.
services: azure-stack
keywords: 
author: mattbriggs
manager: femila
ms.date: 08/02/2018
ms.topic: article
ms.service: azure-stack
ms.author: mabrigg
ms.reviewer: scottnap

---

# Considerations for Azure Stack networking

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack networking has many of the features provided by Azure networking. However, there are some key differences that you should understand before deploying an Azure Stack network.

This article provides an overview of the unique considerations for Azure Stack networking and its features. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) article.

## Cheat sheet: Networking differences

| Service | Feature | Azure (global) | Azure Stack |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| DNS | Multi-tenant DNS | Supported | Not yet supported |
|  | DNS AAAA records | Supported | Not supported |
|  | DNS zones per subscription | 100 (default)<br>Can be increased on request. | 100 |
|  | DNS record sets per zone | 5000 (default)<br>Can be increased on request. | 5000 |
|  | Name servers for zone delegation | Azure provides four name servers for each user (tenant) zone that is created. | Azure Stack provides two name servers for each user (tenant) zone that is created. |
| Virtual Network | Virtual network peering | Connect two virtual networks in the same region through the Azure backbone network. | Not yet supported |
|  | IPv6 addresses | You can assign an IPv6 address as part of the [Network Interface Configuration](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface-addresses#ip-address-versions). | Only IPv4 is supported. |
|  | DDoS Protection Plan | Supported | Not yet supported. |
|  | Scale Set IP Configurations | Supported | Not yet supported. |
|  | Private Access Services (Subnet) | Supported | Not yet supported. |
|  | Service Endpoints | Supported for internal (non-Internet) connection to Azure Services. | Not yet supported. |
| Only IPv4 is supported. | Service Endpoint Policies | Supported | Not yet supported. |
|  | Service Tunnels | Supported | Not yet supported.  |
| Network Security Groups | Augmented Security Rules | Supported | Not yet supported. |
|  | Effective Security Rules | Supported | Not yet supported. |
|  | Application Security Groups | Supported | Not yet supported. |
| Virtual Network Gateways | Point-to-Site VPN Gateway | Supported | Not yet supported. |
|  | Vnet-to-Vnet Gateway | Supported | Not yet supported. |
|  | Virtual Network Gateway Type | Azure Supports VPN<br> Express Route <br> Hyper Net | Azure Stack supports only VPN type at this time. |
|  | VPN Gateway SKUs | Support for Basic, GW1, GW2, GW3, Standard High Performance, Ultra-High Performance. | Support for Basic, Standard, and High-Performance SKUs. |
|  | VPN Type | Azure supports both Policy Based and Route Based. | Azure Stack supports Route Based only. |
|  | BGP Settings | Azure supports configuration of BGP Peering Address and Peer Weight. | BGP Peering Address and Peer Weight are auto-configured in Azure Stack. There is no way for the user to configure these settings with their own values. |
|  | Default Gateway Site | Azure supports configuration of a default site for forced tunneling. | Not yet supported. |
|  | Gateway Resizing | Azure supports resizing the gateway after deployment. | Re-sizing not supported. |
|  | Active/Active Configuration | Supported | Not yet supported. |
|  | IKE/IPSec Policies | Azure Supports custom IPSec policy configurations. | Not yet supported. |
|  | UsePolicyBasedTrafficSelectors | Azure supports using policy-based traffic selectors with route-based gateway connections. | Not yet supported. |
| Load balancer | SKU | Basic and Standard Load Balancers are supported | Only the Basic Load Balancer is supported.  The SKU property is not supported. |
|  | Zones | Availability Zones are Supported. | Not yet supported |
|  | Inbound NAT Rules support for Service Endpoints | Azure supports specifying Service Endpoints for Inbound NAT rules. | Azure Stack does not yet support Service Endpoints, so these cannot be specified. |
|  | Protocol | Azure Supports specifying GRE or ESP. | Protocol Class is not supported in Azure Stack. |
| Public IP Address | Public IP Address Version | Azure supports both IPv6 and IPv4 | Only IPv4 is supported. |
| Network Interface | Get Effective Route Table | Supported | Not yet supported. |
|  | Get Effective ACLs | Supported | Not yet supported. |
|  | Enable Accelerated Networking | Supported | Not yet supported. |
|  | IP Forwarding | Disabled by default.  Can be enabled. | Toggling this setting is not supported.  On by default. |
|  | Multiple IP Configurations per interface | Supported | Not yet supported. |
|  | Application Security Groups | Supported | Not yet supported. |
|  | Internal DNS Name Label | Supported | Not yet supported. |
|  | Private IP Address Version | Both IPv6 and IPv4 are supported. | Only IPv4 is supported. |
|  | Primary IP Configuration | Supported. Identifies the primary IP configuration on the interface. | Not yet supported. |
| Network Watcher | Network Watcher tenant network monitoring capabilities | Supported | Not yet supported. |
| CDN | Content Delivery Network profiles | Supported | Not yet supported. |
| Application gateway | Layer-7 load balancing | Supported | Not yet supported. |
| Traffic Manager | Route incoming traffic for optimal application performance and reliability. | Supported | Not yet supported. |
| Express Route | Set up a fast, private connection to Microsoft cloud services from your on-premises infrastructure or colocation facility. | Supported | Support for connecting Azure Stack to an Express Route circuit. |

## Next steps

[DNS in Azure Stack](azure-stack-dns.md)