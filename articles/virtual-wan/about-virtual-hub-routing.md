---
title: 'About virtual hub routing'
titleSuffix: Azure Virtual WAN
description: This article describes virtual hub routing
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# About virtual hub routing

The routing capabilities in a virtual hub are provided by a router that manages all routing between gateways using Border Gateway Protocol (BGP). A virtual hub can contain multiple gateways such as a Site-to-site VPN gateway, ExpressRoute gateway, Point-to-site gateway, Azure Firewall. This router also provides transit connectivity between virtual networks that connect to a virtual hub and can support up to an aggregate throughput of 50 Gbps. These routing capabilities apply to Standard Virtual WAN customers.

To configure routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).

## <a name="concepts"></a>Routing concepts

The following sections describe the key concepts in virtual hub routing.

### <a name="hub-route"></a>Hub route table

A virtual hub route table can contain one or more routes. A route includes its name, a label, a destination type, a list of destination prefixes, and next hop information for a packet to be routed. A **Connection** typically will have a routing configuration that associated or propagates to a route table

### <a name="connection"></a>Connection

Connections are Resource Manager resources that have a routing configuration. The four types of connections are:

* **VPN connection**: Connects a VPN site to a virtual hub VPN gateway.
* **ExpressRoute connection**: Connects an ExpressRoute circuit to a virtual hub ExpressRoute gateway.
* **P2S configuration connection**: Connects a User VPN (Point-to-site) configuration to a virtual hub User VPN (Point-to-site) gateway.
* **Hub virtual network connection**: Connects virtual networks to a virtual hub.

You can set up the routing configuration for a virtual network connection during setup. By default, all connections associate and propagate to the Default route table.

### <a name="association"></a>Association

Each connection is associated to one route table. Associating a connection to a route table allows the traffic to be sent to the destination indicated as routes in the route table. The routing configuration of the connection will show the associated route table.  Multiple connections can be associated to the same route table. All VPN, ExpressRoute, and User VPN connections are associated to the same (default) route table.

By default, all connections are associated to a **Default route table** in a virtual hub. Each virtual hub has its own Default route table, which can be edited to add a static route(s). Routes added statically take precedence over dynamically learned routes for the same prefixes.

:::image type="content" source="./media/about-virtual-hub-routing/concepts-association.png" alt-text="Association":::

### <a name="propagation"></a>Propagation

Connections dynamically propagate routes to a route table. With a VPN connection, ExpressRoute connection, or P2S configuration connection, routes are propagated from the virtual hub to the on-premises router using BGP. Routes can be propagated to one or multiple route tables.

A **None route table** is also available for each virtual hub. Propagating to the None route table implies that no routes are required to be propagated from the connection. VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables.

:::image type="content" source="./media/about-virtual-hub-routing/concepts-propagation.png" alt-text="Propagation":::

### <a name="static"></a>Configuring static routes in a virtual network connection

Configuring static routes provides a mechanism to steer traffic through a next hop IP, which could be of a Network Virtual Appliance (NVA) provisioned in a Spoke VNet attached to a virtual hub. The static route is composed of a route name, list of destination prefixes, and a next hop IP.

## Next steps

To configure routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
