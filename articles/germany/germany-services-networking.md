---
title: Azure Germany networking services | Microsoft Docs
description: Provides a comparison of features and guidance for private connectivity to Azure Germany
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---

# Azure Germany networking services
## ExpressRoute (private connectivity)
Azure ExpressRoute is generally available in Azure Germany. For more information (including partners and peering locations), see the [ExpressRoute global documentation](../expressroute/index.yml).

### Variations

* Azure Germany customers connect to a physically isolated capacity over a dedicated Azure Germany ExpressRoute connection.
* Azure Germany provides increased availability and durability by using multiple region pairs located a minimum of 400 km apart. 
* By default, all Azure Germany ExpressRoute connectivity is configured as active-active redundant with support for bursting and delivers up to 10G circuit capacity.
* Azure Germany ExpressRoute locations provide optimized pathways (including shortest hops, low latency, and high performance) for customers and Azure Germany geo-redundant regions.
* The Azure Germany ExpressRoute private connection does not use, traverse, or depend on the Internet.
* The Azure Germany physical and logical infrastructure is physically dedicated and separated from the international Microsoft cloud network.
* Azure Germany ExpressRoute provides private connectivity to Microsoft Azure cloud services, but not to Office 365 or Dynamics 365 cloud services.

### Considerations
Two basic services provide private network connectivity to Azure Germany: ExpressRoute and VPN (site-to-site for a typical organization).

You can use ExpressRoute to create private connections between Azure Germany datacenters and your on-premises infrastructure, or in a colocation environment. ExpressRoute connections do not go over the public Internet. They offer more reliability, faster speeds, and lower latencies than typical Internet connections. In some cases, using ExpressRoute connections to transfer data between on-premises systems and Azure yields significant cost benefits.   

With ExpressRoute, you establish connections to Azure at an ExpressRoute location, such as an ExpressRoute Exchange provider facility. Or you directly connect to Azure from your existing WAN, such as a multiprotocol label switching (MPLS) VPN that's supplied by a network service provider.

For network services to support Azure Germany customer applications and solutions, we strongly recommend that you implement ExpressRoute (private connectivity) to connect to Azure Germany. If you use VPN connections, consider the following:

* Contact your authorizing official/agency to determine whether you need private connectivity or another secure connection mechanism, and to identify any additional restrictions.
* Decide whether to mandate that the site-to-site VPN is routed through a private connectivity zone.
* Obtain either an MPLS circuit or a VPN with a licensed private connectivity access provider.

If you use a private connectivity architecture, validate that an appropriate implementation is established and maintained for the connection to the Gateway Network/Internet (GN/I) edge router demarcation point for Azure Germany. Similarly, your organization must establish network connectivity between your on-premises environment and Gateway Network/Customer (GN/C) edge router demarcation point for Azure Germany.

If you are connecting to Microsoft through ExpressRoute at any one peering location in the Azure Germany region, you will have access to all Microsoft Azure cloud services across all regions within the German boundary. For example, if you connect to Microsoft in Berlin through ExpressRoute, you will have access to all Microsoft cloud services hosted in Azure Germany.

For details on locations and partners, and a detailed list of ExpressRoute for Azure Germany peering locations, see the **Overview** tab in the [ExpressRoute global documentation](../expressroute/index.yml).

You can purchase more than one ExpressRoute circuit. Having multiple connections offers you significant benefits on high availability due to geo-redundancy. In cases where you have multiple ExpressRoute circuits, you will receive the same set of prefixes advertised from Microsoft on the public peering paths. This means you will have multiple paths from your network to Microsoft. This situation can potentially cause suboptimal routing decisions to be made in your network. As a result, you might experience suboptimal connectivity experiences to different services. For more information, see the **How-to guides > Best practices** tab in the [ExpressRoute global documentation](../expressroute/index.yml) and select **Optimize routing**.

## Support for Load Balancer
Azure Load Balancer is generally available in Azure Germany. For more information, see the [Load Balancer global documentation](../load-balancer/load-balancer-overview.md). 

## Support for Traffic Manager
Azure Traffic Manager is generally available in Azure Germany. For more information, see the [Traffic Manager global documentation](../traffic-manager/traffic-manager-overview.md). 

## Support for virtual network peering 
Virtual network peering is generally available in Azure Germany. For more information, see the [Virtual network peering global documentation](../virtual-network/virtual-network-peering-overview.md). 

## Support for VPN Gateway 
Azure VPN Gateway is generally available in Azure Germany. For more information, see the [VPN Gateway global documentation](../vpn-gateway/vpn-gateway-about-vpngateways.md). 

## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).
