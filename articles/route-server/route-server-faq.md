---
title: Azure Route Server frequently asked questions
description: Find answers to frequently asked questions about Azure Route Server, including general questions, routing capabilities, and service limitations.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: faq
ms.date: 09/17/2025
---

# Azure Route Server frequently asked questions

This article provides answers to commonly asked questions about Azure Route Server, covering general service information, routing capabilities, and current limitations.

## General

### What is Azure Route Server?

Azure Route Server is a fully managed service that allows you to easily manage routing between your network virtual appliance (NVA) and your virtual network.

### Is Azure Route Server just a virtual machine?

No. Azure Route Server is a service designed with high availability. Your Route Server has zone-level redundancy if you deploy it in an Azure region that supports [Availability Zones](/azure/reliability/availability-zones-overview).

### Do I need to peer each NVA with both Azure Route Server instances?
Yes, you must peer each NVA instance with both instances of Route Server to ensure that Route Server successfully receives routes and to configure high availability. You must also advertise the same routes to both instances. We also recommend that you peer at least two NVA instances with both instances of Route Server.

> [!NOTE]
> During Route Server maintenance events, BGP peering might go down between your NVA and one of Route Server's instances. If you configure your NVA to peer with both instances of Route Server, your connectivity remains available during maintenance events. 

### Can I get advanced notification of maintenance?

Currently, you can't get advanced notification for Azure Route Server maintenance.

### Does Azure Route Server store customer data?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA) and then propagates them to your virtual network.

### Does Azure Route Server support virtual network peering?

Yes. If you peer a virtual network hosting the Azure Route Server to another virtual network and you enable **Use the remote virtual network's gateway or Route Server** on the second virtual network, Azure Route Server learns the address spaces of the peered virtual network and sends them to all the peered network virtual appliances (NVAs). Route Server also programs the routes from the NVAs into the route table of the virtual machines in the peered virtual network. 

### Why does Azure Route Server require a public IP address with opened ports?

These public endpoints are required for Azure's underlying software-defined networking (SDN) and management platform to communicate with Azure Route Server. Because Route Server is considered part of the customer's private network, Azure's underlying platform can't directly access and manage Route Server via its private endpoints due to compliance requirements. Connectivity to Route Server's public endpoints is authenticated via certificates, and Azure conducts routine security audits of these public endpoints. As a result, they don't constitute a security exposure of your virtual network.

> [!NOTE]
> Azure signs these certificates with an internal certificate authority, so this certificate chain appears not to be signed by a known trusted authority. This doesn't represent an SSL vulnerability.

### Does Azure Route Server support IPv6?

No. If you deploy a virtual network with an IPv6 address space and later deploy an Azure Route Server in the same virtual network, this breaks connectivity for IPv6 traffic.

You can peer a virtual network with an IPv6 address space to Route Server's virtual network, and IPv4 connectivity with this peered dual-stack virtual network continues to function. IPv6 connectivity with this peered virtual network isn't supported. 

### What are routing infrastructure units?

By default, an Azure Route Server is deployed with a capacity of two routing infrastructure units. This default deployment supports 4,000 connected VMs deployed in Route Server's virtual network and all peered virtual networks. 

You can specify more routing infrastructure units to increase Route Server's capacity in increments of 1,000 VMs. Each additional routing infrastructure unit costs $0.10/hour in the United States. Prices in other regions may vary. Full pricing, including regional differences, will be available in mid-December in the official [Azure pricing page](https://azure.microsoft.com/pricing/details/route-server/).


## Routing

### Does Azure Route Server route data traffic between my NVA and my VMs?

No. Azure Route Server only exchanges BGP routes with your network virtual appliance (NVA). The data traffic goes directly from the NVA to the destination virtual machine (VM) and directly from the VM to the NVA.

### <a name = "protocol"></a>What routing protocols does Azure Route Server support?

Azure Route Server supports only Border Gateway Protocol (BGP). Your network virtual appliance (NVA) must support multi-hop external BGP because you need to deploy the Route Server in a dedicated subnet in your virtual network. When you configure BGP on your NVA, the ASN you choose must be different from the Route Server ASN.

### Does Azure Route Server preserve the BGP AS path of the route it receives?

Yes, Azure Route Server propagates the route with the BGP AS path intact.

### If AS path prepend is configured on an NVA towards the Route Server, does the ExpressRoute circuit pass the AS path prepend information to on-premises?

When ExpressRoute advertises routes to on-premises, it removes the private BGP ASN information. On-premises receives the prefix with [AS 12076](../expressroute/expressroute-routing.md#autonomous-system-numbers-asn).

### Does Azure Route Server preserve the BGP communities of the route it receives?

Yes, Azure Route Server propagates the route with the BGP communities intact.

### What is the BGP timer setting of Azure Route Server?

Azure Route Server keepalive timer is 60 seconds and the hold timer is 180 seconds.

### Can Azure Route Server filter out routes from NVAs?

Azure Route Server supports **NO_ADVERTISE** BGP community. If a network virtual appliance (NVA) advertises routes with this community string to the Route Server, the Route Server doesn't advertise it to other peers including the ExpressRoute gateway. This feature can help reduce the number of routes sent from Azure Route Server to ExpressRoute.

### When a virtual network peering is created between my hub virtual network and spoke virtual network, does this cause a BGP soft reset between Azure Route Server and its peered NVAs?

Yes. If a virtual network peering is created between your hub virtual network and spoke virtual network, Azure Route Server performs a BGP soft reset by sending route refresh requests to all its peered NVAs. If the NVAs don't support BGP route refresh, then Azure Route Server performs a BGP hard reset with the peered NVAs, which might cause connectivity disruption for traffic traversing the NVAs.

### How is the 4000 route limit calculated on a BGP peering session between an NVA and Azure Route Server?

Currently, Route Server can accept a maximum of 4,000 routes from a single BGP peer. When Route Server process BGP route updates, this limit is calculated as the number of current routes learned from a BGP peer plus the number of routes coming in the BGP route update. For example, if an NVA initially advertises 2001 routes to Route Server and later readvertises these 2001 routes in a BGP route update, the Route Server calculates this as 4,002 routes and tears down the BGP session. 

### What Autonomous System Numbers (ASNs) can I use?

You can use your own public ASNs or private ASNs in your network virtual appliance (NVA). You can't use ASNs reserved by Azure or [Internet Assigned Number Authority (IANA)](https://www.iana.org/).

**ASNs reserved by Azure:**
- Public ASNs: 8074, 8075, 12076
- Private ASNs: 65515, 65517, 65518, 65519, 65520

**ASNs [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml):**
- 23456, 64496-64511, 65535-65551

### Can I use 32-bit (4 byte) ASNs?

No, Azure Route Server supports only 16-bit (2 bytes) ASNs.

### If Azure Route Server receives the same route from more than one NVA, how does it handle them?

If the route has the same AS path length, Azure Route Server programs multiple copies of the route, each with a different next hop, to the virtual machines (VMs) in the virtual network. When a VM sends traffic to the destination of this route, the VM host uses Equal-Cost Multi-Path (ECMP) routing. However, if one NVA sends the route with a shorter AS path length than other NVAs, Azure Route Server only programs the route that has the next hop set to this NVA to the VMs in the virtual network.

### Does creating a Route Server affect the operation of existing virtual network gateways (VPN or ExpressRoute)?

Yes. When you create or delete a Route Server in a virtual network that contains a virtual network gateway (ExpressRoute or VPN), expect downtime to last 10 minutes. The actual Route Server deployment might take 30-60 minutes to complete, so we recommend scheduling a maintenance window of 60 minutes for deployment. If you have an ExpressRoute circuit connected to the virtual network where you're creating or deleting the Route Server, the downtime doesn't affect the ExpressRoute circuit's connections to other virtual networks.

### Does Azure Route Server exchange routes by default between NVAs and the virtual network gateways (VPN or ExpressRoute)?

No. By default, Azure Route Server doesn't propagate routes it receives from an NVA and a virtual network gateway to each other. The Route Server exchanges these routes after you enable **branch-to-branch** in it.

### Do NVA-advertised routes get propagated from one Route Server to another Route Server via ExpressRoute MSEE? 

No. If **branch-to-branch** is enabled, then the NVA-advertised routes will be advertised to the ExpressRoute-connected on-premises. However, the NVA-advertised routes will be dropped by the second Route Server. To illustrate this, the diagram below shows the SDWAN on-premises advertising 10.3.0.0/16 to the SDWAN NVA. This route gets learned by the first Route Server, and so any workloads in VNet 1 (or peered to VNet 1) also learn this route. In addition, the ExpressRoute-connected on-premises learns the 10.3.0.0/16 route if **branch-to-branch** is enabled. However, the second Route Server (in VNet 2) does not learn the 10.3.0.0/16 route, and so this route will not be learned by any workloads in VNet 2. As a result, the 10.3.0.0/16 on-premises network will be unreachable from any workloads in VNet 2 and peered to VNet 2.

:::image type="content" source="./media/faq/route-server-msee-hairpin.png" alt-text="Diagram showing NVA-advertised route not being learned by second Route Server via ExpressRoute MSEE bow-tie.":::

### When the same route is learned over ExpressRoute, VPN, or SD-WAN, which network is preferred?

By default, routes learned over ExpressRoute take precedence over those learned over VPN or SD-WAN. You can configure routing preference to influence Route Server route selection. For more information, see [Routing preference](hub-routing-preference.md).

### What are the requirements for an Azure VPN gateway to work with Azure Route Server?

Azure VPN gateway must be configured in active-active mode and have the ASN set to 65515.

### Do I need to enable BGP on the VPN gateway?

No. It's not a requirement to have BGP enabled on the VPN gateway to communicate with the Route Server.

### Can I peer two Azure Route Servers in two peered virtual networks and enable the NVAs connected to the Route Servers to talk to each other?

**Topology: NVA1 -> RouteServer1 -> (via virtual network peering) -> RouteServer2 -> NVA2**

No, Azure Route Server doesn't forward data traffic. To enable transit connectivity through the NVA, set up a direct connection (for example, an IPsec tunnel) between the NVAs and use the Route Servers for dynamic route propagation.

### Can I use Azure Route Server to direct traffic between subnets in the same virtual network to flow inter-subnet traffic through the NVA?

No. Azure Route Server uses BGP to advertise routes. System routes for traffic related to virtual network, virtual network peerings, or virtual network service endpoints, are preferred routes, even if BGP routes are more specific. You must continue to use user-defined routes (UDRs) to override system routes, and you can't utilize BGP to quickly fail over these routes. You must continue to use a third-party solution to update the UDRs via the API in a failover situation, or use an Azure Load Balancer with HA ports mode to direct traffic.

You can still use Route Server to direct traffic between subnets in different virtual networks to flow using the NVA. A possible design that might work is one subnet per "spoke" virtual network and all "spoke" virtual networks are peered to a "hub" virtual network. This design is very limiting and needs to take into scaling considerations and Azure's maximum limits on virtual networks vs subnets.

### Can Azure Route Server provide transit between ExpressRoute and a Point-to-Site (P2S) VPN gateway connection when enabling the branch-to-branch setting?

No, Azure Route Server provides transit only between ExpressRoute and Site-to-Site (S2S) VPN gateway connections when enabling the *branch-to-branch* setting.

### Can I create an Azure Route Server in a spoke virtual network that connects to a Virtual WAN hub?

No. The spoke virtual network can't have a Route Server if it's connected to the Virtual WAN hub.

## Limitations

### How many Azure Route Servers can I create in a virtual network?

You can create only one Route Server in a virtual network. You must deploy the Route Server in a dedicated subnet called *RouteServerSubnet*.

### Can I associate a UDR to the RouteServerSubnet?

No, Azure Route Server doesn't support configuring a user-defined route (UDR) on the *RouteServerSubnet* subnet. Azure Route Server doesn't route any data traffic between network virtual appliances (NVAs) and virtual machines (VMs).

### Can I associate a network security group (NSG) to the RouteServerSubnet?

No, Azure Route Server doesn't support network security group association to the *RouteServerSubnet* subnet.

### <a name = "limits"></a>What are Azure Route Server limits?

Azure Route Server has the following limits (per deployment).

[!INCLUDE [route server limits](../../includes/route-server-limits.md)]

For information on troubleshooting routing problems in a virtual machine, see [Diagnose an Azure virtual machine routing problem](../virtual-network/diagnose-network-routing-problem.md).

### Why am I seeing an error about invalid scope and authorization to perform operations on Route Server resources?

If you see an error in the following format, make sure you have the following permissions configured: [Route Server roles and permissions](roles-permissions.md).

**Error message format:** "The client with object ID {} doesn't have authorization to perform action {} over scope {} or the scope is invalid. For details on the required permissions, please visit {}. If access was recently granted, please refresh your credentials."

## Next steps

Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
