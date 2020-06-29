---
title: 'Scenario: any-to-any'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - Any-to-any
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Any-to-any

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In an Any-to-any scenario, any spoke can reach another spoke. When multiple hubs exist, hub-to-hub routing (also known as inter-hub) is enabled by default in Standard Virtual WAN. 

In this scenario, VPN, ExpressRoute, and User VPN connections are associated to the same route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario architecture

In **Figure 1**, all VNets and Branches (VPN, ExpressRoute, P2S) can reach each other. In a virtual hub, connections work as follows:

* A VPN connection connects a VPN site to a VPN gateway.
* A virtual network connection connects a virtual network to a virtual hub. The virtual hub's router provides the transit functionality between VNets.
* An ExpressRoute connection connects an ExpressRoute circuit to an ExpressRoute gateway.

These connections (by default at creation) are associated to the Default route table, unless you set up the routing configuration of the connection to either **None**, or a custom route table. These connections also propagate routes, by default to the Default route table. This is what enables an any-to-any scenario where any spoke (VNet, VPN, ER, P2S) can reach each other.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/any-any/figure-1.png" alt-text="figure 1":::

## <a name="workflow"></a>Scenario workflow

This scenario is enabled by default for Standard Virtual WAN. If the setting for branch-to-branch are disabled in WAN configuration, that will disallow connectivity between branch spokes. VPN/ExpressRoute/User VPN are considered as branch spokes in Virtual WAN

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
