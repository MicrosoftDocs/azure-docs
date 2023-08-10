---
title: 'About virtual hub routing'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN virtual hub routing.
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: cherylmc
ms.custom: fasttrack-edit
---

# About virtual hub routing

The routing capabilities in a virtual hub are provided by a router that manages all routing between gateways using Border Gateway Protocol (BGP). A virtual hub can contain multiple gateways such as a Site-to-site VPN gateway, ExpressRoute gateway, Point-to-site gateway, Azure Firewall. This router also provides transit connectivity between virtual networks that connect to a virtual hub and can support up to an aggregate throughput of 50 Gbps. These routing capabilities apply to Standard Virtual WAN customers.

To configure routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).

## <a name="concepts"></a>Routing concepts

The following sections describe the key concepts in virtual hub routing.

### <a name="hub-route"></a>Hub route table

A virtual hub route table can contain one or more routes. A route includes its name, a label, a destination type, a list of destination prefixes, and next hop information for a packet to be routed. A **Connection** typically will have a routing configuration that associates or propagates to a route table.

### <a name= "hub-route"></a> Hub routing intent and policies

Routing Intent and Routing policies allow you to configure your Virtual WAN hub to send Internet-bound and Private (Point-to-site, Site-to-site, ExpressRoute, Network Virtual Appliances inside the Virtual WAN Hub and Virtual Network) Traffic via an Azure Firewall, Next-Generation Firewall NVA or software-as-a-service solution deployed in the Virtual WAN hub. There are two types of Routing Policies: Internet Traffic and Private Traffic Routing Policies. Each Virtual WAN Hub may have at most one Internet Traffic Routing Policy and one Private Traffic Routing Policy, each with a Next Hop resource.


While Private Traffic includes both branch and Virtual Network address prefixes, Routing Policies considers them as one entity within the Routing Intent concepts.

* **Internet Traffic Routing Policy**:  When an Internet Traffic Routing Policy is configured on a Virtual WAN hub, all branch (User VPN (Point-to-site VPN), Site-to-site VPN and ExpressRoute) and Virtual Network connections to that Virtual WAN Hub will forward Internet-bound traffic to the Azure Firewall resource or Third-Party Security provider specified as part of the Routing Policy.
 
* **Private Traffic Routing Policy**: When a Private Traffic Routing Policy is configured on a Virtual WAN hub, **all** branch and Virtual Network traffic in and out of the Virtual WAN Hub including inter-hub traffic will be forwarded to the Next Hop Azure Firewall resource that was specified in the Private Traffic Routing Policy.

For more information on how to configure Routing Intent and Policies please view the following [document](how-to-routing-policies.md).

### <a name="connection"></a>Connections

Connections are Resource Manager resources that have a routing configuration. The four types of connections are:

* **VPN connection**: Connects a VPN site to a virtual hub VPN gateway.
* **ExpressRoute connection**: Connects an ExpressRoute circuit to a virtual hub ExpressRoute gateway.
* **P2S configuration connection**: Connects a User VPN (Point-to-site) configuration to a virtual hub User VPN (Point-to-site) gateway.
* **Hub virtual network connection**: Connects virtual networks to a virtual hub.

You can set up the routing configuration for a virtual network connection during setup. By default, all connections associate and propagate to the Default route table.

### <a name="association"></a>Association

Each connection is associated to one route table. Associating a connection to a route table allows the traffic (from that connection) to be sent to the destination indicated as routes in the route table. The routing configuration of the connection will show the associated route table.  Multiple connections can be associated to the same route table. All VPN, ExpressRoute, and User VPN connections are associated to the same (default) route table.

By default, all connections are associated to a **Default route table** in a virtual hub. Each virtual hub has its own Default route table, which can be edited to add a static route(s). Routes added statically take precedence over dynamically learned routes for the same prefixes.

:::image type="content" source="./media/about-virtual-hub-routing/concepts-association.png" alt-text="Diagram shows Association." lightbox="./media/about-virtual-hub-routing/concepts-association.png":::

### <a name="propagation"></a>Propagation

Connections dynamically propagate routes to a route table. With a VPN connection, ExpressRoute connection, or P2S configuration connection, routes are propagated from the virtual hub to the on-premises router using BGP. Routes can be propagated to one or multiple route tables.

A **None route table** is also available for each virtual hub. Propagating to the None route table implies that no routes are required to be propagated from the connection. VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables.

:::image type="content" source="./media/about-virtual-hub-routing/concepts-propagation.png" alt-text="Diagram shows propagation." lightbox="./media/about-virtual-hub-routing/concepts-propagation.png":::

### <a name="labels"></a>Labels

Labels provide a mechanism to logically group route tables. This is especially helpful during propagation of routes from connections to multiple route tables. For example, the **Default Route Table** has a built-in label called 'Default'. When users propagate connection routes to 'Default' label, it automatically applies to all the Default Route Tables across every hub in the Virtual WAN.

### <a name="static"></a>Configuring static routes in a virtual network connection

Configuring static routes provides a mechanism to steer traffic from the hub through a next hop IP, which could be of a Network Virtual Appliance (NVA) provisioned in a Spoke VNet attached to a virtual hub. The static route is composed of a route name, list of destination prefixes, and a next hop IP.

## <a name="route"></a>Route tables for pre-existing routes

Route tables now have features for association and propagation. A pre-existing route table is a route table that doesn't have these features. If you have pre-existing routes in hub routing and would like to use the new capabilities, consider the following:

* **Standard Virtual WAN Customers with pre-existing routes in virtual hub**:

   If you have pre-existing routes in Routing section for the hub in Azure portal, you'll need to first delete them and then attempt creating new route tables (available in the Route Tables section for the hub in Azure portal).

* **Basic Virtual WAN Customers with pre-existing routes in virtual hub**:

   If you have pre-existing routes in Routing section for the hub in Azure portal, you'll need to first delete them, then **upgrade** your Basic Virtual WAN to Standard Virtual WAN. See [Upgrade a virtual WAN from Basic to Standard](upgrade-virtual-wan.md).

## <a name="reset"></a>Hub reset

Virtual hub **Reset** is available only in the Azure portal. Resetting provides you with a way to bring any failed resources such as route tables, hub router, or the virtual hub resource itself back to its rightful provisioning state. Consider resetting the hub prior to contacting Microsoft for support. This operation doesn't reset any of the gateways in a virtual hub.

## <a name="considerations"></a>Additional considerations

Consider the following when configuring Virtual WAN routing:

* All branch connections (Point-to-site, Site-to-site, and ExpressRoute) need to be associated to the Default route table. That way, all branches will learn the same prefixes.
* All branch connections need to propagate their routes to the same set of route tables. For example, if you decide that branches should propagate to the Default route table, this configuration should be consistent across all branches. As a result, all connections associated to the Default route table will be able to reach all of the branches.
* When you use Azure Firewall in multiple regions, all spoke virtual networks must be associated to the same route table. For example, having a subset of the VNets going through the Azure Firewall while other VNets bypass the Azure Firewall in the same virtual hub isn't possible.
* You may specify multiple next hop IP addresses on a single Virtual Network connection. However, Virtual Network Connection doesn't support ‘multiple/unique’ next hop IP to the ‘same’ network virtual appliance in a SPOKE Virtual Network 'if' one of the routes with next hop IP is indicated to be public IP address or 0.0.0.0/0 (internet)
* All information pertaining to 0.0.0.0/0 route is confined to a local hub's route table. This route doesn't propagate across hubs.
* You can only use Virtual WAN to program routes in a spoke if the prefix is shorter (less specific) than the virtual network prefix. For example, in the diagram above the spoke VNET1 has the prefix 10.1.0.0/16: in this case, Virtual WAN wouldn't be able to inject a route that matches the virtual network prefix (10.1.0.0/16) or any of the subnets (10.1.0.0/24, 10.1.1.0/24). In other words, Virtual WAN can't attract traffic between two subnets that are in the same virtual network.

## Next steps

* To configure routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).
* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).


