---
title: Azure Germany networking | Microsoft Docs
description: This provides a comparison of features and guidance for private connectivity to Azure Germany
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

# Azure Germany networking
## ExpressRoute (private connectivity)
ExpressRoute is generally available in Azure Germany. For more information (including partners and peering locations), see the [ExpressRoute global documentation](../expressroute/index.md).

### Variations
ExpressRoute is generally available in Azure Germany. 

* Germany customers connect to a physically isolated capacity over a dedicated Azure Germany ExpressRoute (ER) connection.
* Azure Germany provides increased availability and durability by leveraging multiple region pairs located a minimum of 400 km apart. 
* By default all Azure Germany ER connectivity is configured active-active redundant with support for bursting and delivers up to 10G circuit capacity.
* Azure Germany ER locations provide optimized pathways (shortest hops, low latency, high performance, etc.) for customers and Azure Germany geo-redundant regions.
* The Azure Germany ER private connection does not utilize, traverse, or depend on the Internet.
* Azure Germany physical and logical infrastructure is physically dedicated and separated.
<!-- * Microsoft owns and operates all fiber infrastructure between Azure Germany Regions and Azure Germany ER Meet-Me locations -->
* Azure Germany ER provides private connectivity to Microsoft Azure cloud services, but not to O365 or Dynamics365 cloud services.

### Considerations
There are two basic services that provide private network connectivity into Azure Germany: VPN (site-to-site for a typical organization) and ExpressRoute.

Azure ExpressRoute is used to create private connections between Azure Germany datacenters and your on-premise infrastructure, or in a colocation environment. ExpressRoute connections do not go over the public Internet — they offer more reliability, faster speeds, and lower latencies than typical Internet connections. In some cases, using ExpressRoute connections to transfer data between on premise systems and Azure yields significant cost benefits.   

With ExpressRoute, you establish connections to Azure at an ExpressRoute location (such as an ExpressRoute Exchange provider facility), or you directly connect to Azure from your existing WAN network (such as a multiprotocol label switching (MPLS) VPN, supplied by a network service provider).

<!--
(graphics needed)
![alt text](./media/azure-germany-capability-private-connectivity-options.png)  
![alt text](./media/germany-capability-expressroute.png)  
-->

For network services to support Azure Germany customer applications and solutions, it is strongly recommended that ExpressRoute (private connectivity) is implemented to connect to Azure Germany. If VPN connections are used, the following should be considered:

* Customers should contact their authorizing official/agency to determine whether private connectivity or other secure connection mechanism is required and to identify any additional restrictions to consider.
* Customers should decide whether to mandate that the site-to-site VPN is routed through a private connectivity zone.
* Customers should obtain either an MPLS circuit or VPN with a licensed private connectivity access provider.

All customers who utilize a private connectivity architecture should validate that an appropriate implementation is established and maintained for the customer connection to the Gateway Network/Internet (GN/I) edge router demarcation point for Azure Germany. Similarly, your organization must establish network connectivity between your on-premise environment and Gateway Network/Customer (GN/C) edge router demarcation point for Azure Germany.

## Support for BGP communities
This section provides an overview of how BGP communities will be used with ExpressRoute in Azure Germany. Microsoft will advertise routes in the public peering paths with routes tagged with appropriate community values. The rationale for doing so and the details on community values are described below. Microsoft, however, will not honor any community values tagged to routes advertised to Microsoft.

If you are connecting to Microsoft through ExpressRoute at any one peering location within the Azure Germany region, you will have access to all Microsoft Azure cloud services across all regions within the German boundary. 

For example, if you connected to Microsoft in Berlin through ExpressRoute, you will have access to all Microsoft cloud services hosted in Azure Germany.

Refer to the "Overview" tab on [ExpressRoute global documentation](../expressroute/index.md) for details on locations and partners, and a detailed list of ExpressRoute for Azure Germany peering locations.

You can purchase more than one ExpressRoute circuit. Having multiple connections offers you significant benefits on high availability due to geo-redundancy. In cases where you have multiple ExpressRoute circuits, you will receive the same set of prefixes advertised from Microsoft on the public peering paths. This means you will have multiple paths from your network into Microsoft. This can potentially cause sub-optimal routing decisions to be made within your network. As a result, you may experience sub-optimal connectivity experiences to different services. 

Microsoft will tag prefixes advertised through public peering with appropriate BGP community values indicating the region the prefixes are hosted in. You can rely on the community values to make appropriate routing decisions to offer optimal routing to customers.  For additional details refer to the "Get started" tab on [ExpressRoute global documentation](../expressroute/index.md) and click on "Optimize routing."

<!--
| **National Clouds Azure Region**| **BGP community value** |
| --- | --- |
| **Azure Germany** |  |
| Azure Germany Central | 12076:51109 |
| US Germany Northeast | 12076:51105 |
-->

All routes advertised from Microsoft will be tagged with the appropriate community value. 


> [!NOTE]
> Microsoft does not honor any BGP community values that you set on the routes advertised to Microsoft.


## Support for Load Balancer
Load Balancer is generally available in Azure Germany. For more information, see the [Load Balancer global documentation](../load-balancer/load-balancer-overview.md). 

## Support for Traffic Manager
Traffic Manager is generally available in Azure Germany. For more information, see the [Traffic Manager global documentation](../traffic-manager/traffic-manager-overview.md). 

## Support for VNet Peering 
VNet Peering is generally available in Azure Germany. For more information, see the [VNet Peering global documentation](../virtual-network/virtual-network-peering-overview.md). 

## Support for VPN Gateway 
VPN Gateway is generally available in Azure Germany. For more information, see the [VPN Gateway global documentation](../vpn-gateway/vpn-gateway-about-vpngateways.md). 

## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/).
