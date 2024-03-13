---
title: 'Scenario: any-to-any'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN any-to-any routing scenarios, where any spoke can reach another spoke.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/24/2023
ms.author: cherylmc
ms.custom: fasttrack-edit

---
# Scenario: Any-to-any

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In an Any-to-any scenario, any spoke can reach another spoke. When multiple hubs exist, hub-to-hub routing (also known as inter-hub) is enabled by default in Standard Virtual WAN. You can create this configuration using various methods, such as the Azure portal, or an [Azure Quickstart Template](quickstart-any-to-any-template.md). For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md). 

## <a name="design"></a>Design

In order to figure out how many route tables will be needed in a Virtual WAN scenario, you can build a connectivity matrix, where each cell represents whether a source (row) can communicate to a destination (column).

| From |   To |  *VNets* | *Branches* |
| -------------- | -------- | ---------- | ---|
| VNets     | &#8594;| Direct | Direct |
| Branches   | &#8594;| Direct  | Direct |

Each of the cells in the previous table describes whether a Virtual WAN connection (the "From" side of the flow, the row headers) communicates with a destination prefix (the "To" side of the flow, the column headers in italics). In this scenario there are no firewalls or Network Virtual Appliances, so communication flows directly over Virtual WAN (hence the word "Direct" in the table).

Since all connections from both VNets and branches (VPN, ExpressRoute, and User VPN) have the same connectivity requirements, a single route table is required. As a result, all connections will be associated and propagate to the same route table, the Default route table:

* Virtual networks:
  * Associated route table: **Default**
  * Propagating to route tables: **Default**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **Default**

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Architecture

In **Figure 1**, all VNets and Branches (VPN, ExpressRoute, P2S) can reach each other. In a virtual hub, connections work as follows:

* A VPN connection connects a VPN site to a VPN gateway.
* A virtual network connection connects a virtual network to a virtual hub. The virtual hub's router provides the transit functionality between VNets.
* An ExpressRoute connection connects an ExpressRoute circuit to an ExpressRoute gateway.

These connections (by default at creation) are associated to the Default route table, unless you set up the routing configuration of the connection to either **None**, or a custom route table. These connections also propagate routes, by default to the Default route table. This is what enables an any-to-any scenario where any spoke (VNet, VPN, ER, P2S) can reach each other.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/any-any/figure-1.png" alt-text="figure 1":::

## <a name="workflow"></a>Workflow

This scenario is enabled by default for Standard Virtual WAN. If the settings for branch-to-branch are disabled in WAN configuration, that will disallow connectivity between branch spokes. VPN/ExpressRoute/User VPN are considered as branch spokes in Virtual WAN

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
