---
title: Azure Route Server frequently asked questions (FAQ)
description: Find answers to frequently asked questions about Azure Route Server.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: faq
ms.date: 08/18/2023
---

# Azure Route Server frequently asked questions (FAQ)

## General

### What is Azure Route Server?

Azure Route Server is a fully managed service that allows you to easily manage routing between your network virtual appliance (NVA) and your virtual network.

### Is Azure Route Server just a virtual machine?

No. Azure Route Server is a service designed with high availability. Your route server has zone-level redundancy if you deploy it in an Azure region that supports [Availability Zones](../availability-zones/az-overview.md).

### Do I need to peer each NVA with both Azure Route Server instances?

Yes, to ensure that virtual network routes are successfully advertised over the target NVA connections, and to configure High Availability, we recommend peering each NVA instance with both instances of Route Server.

### Does Azure Route Server store customer data?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA) and then propagates them to your virtual network.

### Does Azure Route Server support virtual network peering?

Yes, if you peer a virtual network hosting the Azure Route Server to another virtual network and you enable **Use the remote virtual network's gateway or Route Server** on the second virtual network, Azure Route Server learns the address spaces of the peered virtual network and send them to all the peered network virtual appliances (NVAs). It also programs the routes from the NVAs into the route table of the virtual machines in the peered virtual network. 

### Why does Azure Route Server require a public IP address?

Azure Router Server needs to ensure connectivity to the backend service that manages the Route Server configuration, that's why it needs the public IP address. This public IP address doesn't constitute a security exposure of your virtual network.

### Does Azure Route Server support IPv6?

No. We'll add IPv6 support in the future. If you have deployed an ExpressRoute virtual network gateway in a virtual network with an IPv6 address space and later deploy an Azure Route Server in the same virtual network, this will break ExpressRoute connectivity for IPv6 traffic.

## Routing

### Does Azure Route Server route data traffic between my NVA and my VMs?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA). The data traffic goes directly from the NVA to the destination virtual machine (VM) and directly from the VM to the NVA.

### <a name = "protocol"></a>What routing protocols does Azure Route Server support?

Azure Route Server supports only Border Gateway (BGP) Protocol. Your network virtual appliance (NVA) must support multi-hop external BGP because you need to deploy the Route Server in a dedicated subnet in your virtual network. When you configure the BGP on your NVA, the ASN you choose must be different from the Route Server ASN.

### Does Azure Route Server preserve the BGP AS Path of the route it receives?

Yes, Azure Route Server propagates the route with the BGP AS Path intact.

### Does Azure Route Server preserve the BGP communities of the route it receives?

Yes, Azure Route Server propagates the route with the BGP communities as is.

### What is the BGP timer setting of Azure Route Server?

Azure Route Server Keepalive timer is 60 seconds and the Hold timer is 180 seconds.

### Can Azure Route Server filter out routes from NVAs?

Azure Route Server supports ***NO_ADVERTISE*** BGP community. If a network virtual appliance (NVA) advertises routes with this community string to the route server, the route server doesn't advertise it to other peers including the ExpressRoute gateway. This feature can help reduce the number of routes sent from Azure Route Server to ExpressRoute.

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

Yes. When you create or delete a Route Server in a virtual network that contains a virtual network gateway (ExpressRoute or VPN), expect downtime until the operation is complete. If you have an ExpressRoute circuit connected to the virtual network where you're creating or deleting the Route Server, the downtime doesn't affect the ExpressRoute circuit or its connections to other virtual networks.

### Does Azure Route Server exchange routes by default between NVAs and the virtual network gateways (VPN or ExpressRoute)?

No. By default, Azure Route Server doesn't propagate routes it receives from an NVA and a virtual network gateway to each other. The Route Server exchanges these routes after you enable **branch-to-branch** in it.

### When the same route is learned over ExpressRoute, VPN or SDWAN, which network is preferred?

By default, the route that's learned over ExpressRoute is preferred over the ones learned over VPN or SDWAN. You can configure routing preference to influence Route Server route selection. For more information, see [Routing preference (preview)](hub-routing-preference.md)

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

## Next steps

Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
