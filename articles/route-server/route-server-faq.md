---
title: Azure Route Server frequently asked questions (FAQ)
description: In this article, you find answers to the most frequently asked questions about Azure Route Server.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: faq
ms.date: 09/11/2024
---

# Azure Route Server frequently asked questions (FAQ)

## General

### What is Azure Route Server?

Azure Route Server is a fully managed service that allows you to easily manage routing between your network virtual appliance (NVA) and your virtual network.

### Is Azure Route Server just a virtual machine?

No. Azure Route Server is a service designed with high availability. Your route server has zone-level redundancy if you deploy it in an Azure region that supports [Availability Zones](../reliability/availability-zones-overview.md).

### Do I need to peer each NVA with both Azure Route Server instances?

Yes, to ensure that routes are successfully advertised to Route Server and to configure high availability, it is required to peer each NVA instance with both instances of Route Server and advertise the same routes to both instances. It is also recommended to peer at least 2 NVA instances with both instances of Route Server. 

>[!NOTE]
> During Route Server maintenance events, BGP peering may go down between your NVA and one of Route Server's instances. As a result, if you configure your NVA to peer with both instances of Route Server, then your connectivity will remain up and running during maintenance events. 
> 


### Does Azure Route Server store customer data?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA) and then propagates them to your virtual network.

### Does Azure Route Server support virtual network peering?

Yes, if you peer a virtual network hosting the Azure Route Server to another virtual network and you enable **Use the remote virtual network's gateway or Route Server** on the second virtual network, Azure Route Server learns the address spaces of the peered virtual network and send them to all the peered network virtual appliances (NVAs). It also programs the routes from the NVAs into the route table of the virtual machines in the peered virtual network. 

### Why does Azure Route Server require a public IP address with opened ports?

These public endpoints are required for Azure's underlying SDN and management platform to communicate with Azure Route Server. Because Route Server is considered part of the customer's private network, Azure's underlying platform is unable to directly access and manage Route Server via its private endpoints due to compliance requirements. Connectivity to Route Server's public endpoints is authenticated via certificates, and Azure conducts routine security audits of these public endpoints. As a result, they do not constitute a security exposure of your virtual network.

> [!NOTE]
> These certificates are signed by an internal certificate authority, so this certificate chain will appear to not be signed by a known trusted authority. As a result, this does not represent an SSL vulnerability.
>

### Does Azure Route Server support IPv6?

No. We'll add IPv6 support in the future. If you have deployed a virtual network with an IPv6 address space and later deploy an Azure Route Server in the same virtual network, this will break connectivity for IPv6 traffic.

> [!WARNING]
> If you have deployed a virtual network with an IPv6 address space and later deploy an Azure Route Server in the same virtual network, this will also break connectivity for IPv4 traffic. This issue will be fixed in our next release to ensure IPv4 traffic continues to work as expected.

## Routing

### Does Azure Route Server route data traffic between my NVA and my VMs?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA). The data traffic goes directly from the NVA to the destination virtual machine (VM) and directly from the VM to the NVA.

### <a name = "protocol"></a>What routing protocols does Azure Route Server support?

Azure Route Server supports only Border Gateway (BGP) Protocol. Your network virtual appliance (NVA) must support multi-hop external BGP because you need to deploy the Route Server in a dedicated subnet in your virtual network. When you configure the BGP on your NVA, the ASN you choose must be different from the Route Server ASN.

### Does Azure Route Server preserve the BGP AS path of the route it receives?

Yes, Azure Route Server propagates the route with the BGP AS path intact.

### If AS path prepend is configured on an NVA towards the route server, will the ExpressRoute circuit pass the AS path prepend information to on-premises?

When ExpressRoute advertises routes to on-premises, it removes the private BGP ASN information. On-premises receives the prefix with [AS 12076](../expressroute/expressroute-routing.md#autonomous-system-numbers-asn).

### Does Azure Route Server preserve the BGP communities of the route it receives?

Yes, Azure Route Server propagates the route with the BGP communities as is.

### What is the BGP timer setting of Azure Route Server?

Azure Route Server Keepalive timer is 60 seconds and the Hold timer is 180 seconds.

### Can Azure Route Server filter out routes from NVAs?

Azure Route Server supports ***NO_ADVERTISE*** BGP community. If a network virtual appliance (NVA) advertises routes with this community string to the route server, the route server doesn't advertise it to other peers including the ExpressRoute gateway. This feature can help reduce the number of routes sent from Azure Route Server to ExpressRoute.

### When a VNet peering is created between my hub VNet and spoke VNet, does this cause a BGP soft reset between Azure Route Server and its peered NVAs?

Yes. If a VNet peering is created between your hub VNet and spoke VNet, Azure Route Server will perform a BGP soft reset by sending route refresh requests to all its peered NVAs. If the NVAs do not support BGP route refresh, then Azure Route Server will perform a BGP hard reset with the peered NVAs, which may cause connectivity disruption for traffic traversing the NVAs. 

### How is the 1000 route limit calculated on a BGP peering session between an NVA and Azure Route Server?

Currently, Route Server can accept a maximum of 1000 routes from a single BGP peer. When processing BGP route updates, this limit is calculated as the number of current routes learnt from a BGP peer plus the number of routes coming in the BGP route update. For example, if an NVA initially advertises 501 routes to Route Server and later re-advertises these 501 routes in a BGP route update, the route server calculates this as 1002 routes and tear down the BGP session. 

### What Autonomous System Numbers (ASNs) can I use?

You can use your own public ASNs or private ASNs in your network virtual appliance (NVA). You can't use ASNs reserved by Azure or IANA.

* ASNs reserved by Azure:
    * Public ASNs: 8074, 8075, 12076
    * Private ASNs: 65515, 65517, 65518, 65519, 65520
* ASNs [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml):
    * 23456, 64496-64511, 65535-65551

### Can I use 32-bit (4 byte) ASNs?

No, Azure Route Server supports only 16-bit (2 bytes) ASNs.

### If Azure Route Server receives the same route from more than one NVA, how does it handle them?

If the route has the same AS path length, Azure Route Server will program multiple copies of the route, each with a different next hop, to the virtual machines (VMs) in the virtual network. When a VM sends traffic to the destination of this route, the VM host uses Equal-Cost Multi-Path (ECMP) routing. However, if one NVA sends the route with a shorter AS path length than other NVAs, Azure Route Server will only program the route that has the next hop set to this NVA to the VMs in the virtual network.

### Does creating a Route Server affect the operation of existing virtual network gateways (VPN or ExpressRoute)?

Yes. When you create or delete a Route Server in a virtual network that contains a virtual network gateway (ExpressRoute or VPN), downtime is expected to last 10 minutes. It may take 30-60 minutes for the actual Route Server deployment to complete, and so we recommend scheduling a maintenance window of 60 minutes for deployment. If you have an ExpressRoute circuit connected to the virtual network where you're creating or deleting the Route Server, the downtime doesn't affect the ExpressRoute circuit's connections to other virtual networks.

### Does Azure Route Server exchange routes by default between NVAs and the virtual network gateways (VPN or ExpressRoute)?

No. By default, Azure Route Server doesn't propagate routes it receives from an NVA and a virtual network gateway to each other. The Route Server exchanges these routes after you enable **branch-to-branch** in it.

### When the same route is learned over ExpressRoute, VPN or SDWAN, which network is preferred?

By default, the route that's learned over ExpressRoute is preferred over the ones learned over VPN or SDWAN. You can configure routing preference to influence Route Server route selection. For more information, see [Routing preference](hub-routing-preference.md).

### What are the requirements for an Azure VPN gateway to work with Azure Route Server?

Azure VPN gateway must be configured in active-active mode and have the ASN set to 65515.

### Do I need to enable BGP on the VPN gateway?

No. It's not a requirement to have BGP enabled on the VPN gateway to communicate with the Route Server.

### Can I peer two Azure Route Servers in two peered virtual networks and enable the NVAs connected to the Route Servers to talk to each other? 

***Topology: NVA1 -> RouteServer1 -> (via VNet Peering) -> RouteServer2 -> NVA2***

No, Azure Route Server doesn't forward data traffic. To enable transit connectivity through the NVA, set up a direct connection (for example, an IPsec tunnel) between the NVAs and use the Route Servers for dynamic route propagation. 

### Can I use Azure Route Server to direct traffic between subnets in the same virtual network to flow inter-subnet traffic through the NVA?

No. Azure Route Server uses BGP to advertise routes. System routes for traffic related to virtual network, virtual network peerings, or virtual network service endpoints, are preferred routes, even if BGP routes are more specific. You must continue to use user defined routes (UDRs) to override system routes, and you can't utilize BGP to quickly fail over these routes. You must continue to use a third-party solution to update the UDRs via the API in a failover situation, or use an Azure Load Balancer with HA ports mode to direct traffic.

You can still use Route Server to direct traffic between subnets in different virtual networks to flow using the NVA. A possible design that may work is one subnet per "spoke" virtual network and all "spoke" virtual networks are peered to a "hub" virtual network. This design is very limiting and needs to take into scaling considerations and Azure's maximum limits on virtual networks vs subnets.

### Can Azure Route Server provide transit between ExpressRoute and a Point-to-Site (P2S) VPN gateway connection when enabling the *branch-to-branch*?

No, Azure Route Server provides transit only between ExpressRoute and Site-to-Site (S2S) VPN gateway connections (when enabling the *branch-to-branch* setting).

### Can I create an Azure Route Server in a spoke VNet that's connected to a Virtual WAN hub?

No. The spoke VNet can't have a Route Server if it's connected to the virtual WAN hub.

## Limitations

### How many Azure Route Servers can I create in a virtual network?

You can create only one Route Server in a virtual network. You must deploy the route server in a dedicated subnet called *RouteServerSubnet*.

### Can I associate a UDR to the *RouteServerSubnet*?

No, Azure Route Server doesn't support configuring a user defined route (UDR) on the ***RouteServerSubnet*** subnet. Azure Route Server doesn't route any data traffic between network virtual appliances (NVAs) and virtual machines (VMs).

### Can I associate a network security group (NSG) to the *RouteServerSubnet*?

No, Azure Route Server doesn't support network security group association to the ***RouteServerSubnet*** subnet.

### <a name = "limits"></a>What are Azure Route Server limits?

Azure Route Server has the following limits (per deployment).

[!INCLUDE [route server limits](../../includes/route-server-limits.md)]

For information on troubleshooting routing problems in a virtual machine, see [Diagnose an Azure virtual machine routing problem](../virtual-network/diagnose-network-routing-problem.md).

### Why am I seeing an error about invalid scope and authorization to perform operations on Route Server resources?

If you see an error in the below format, then please make sure you have the following permissions configured: [Route Server Roles and Permissions](roles-permissions.md).

Error message format: "The client with object id {} does not have authorization to perform action {} over scope {} or the scope is invalid. For details on the required permissions, please visit {}. If access was recently granted, please refresh your credentials."

## Next steps

Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
