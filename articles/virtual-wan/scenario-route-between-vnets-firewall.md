---
title: 'Scenario: Azure Firewall custom routing for Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - routing traffic between VNets directly, but use Azure Firewall for VNet ->Internet/Branch and Branch to VNet traffic flows
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Azure Firewall - custom

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to route traffic between VNets directly,  but use Azure Firewall for VNet-to-Internet/Branch and Branch-to-VNet traffic flows. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Scenario workflow

In this scenario, you want to route traffic through the Azure Firewall for VNet-to-Internet, VNet-to-Branch, or Branch-to-VNet traffic, but would like to go direct for VNet-to-VNet traffic. If you used Azure Firewall Manager, the route settings are automatically populated into the **Default Route Table**. Private Traffic applies to VNet and Branches, Internet traffic applies to 0.0.0.0/0.

VPN, ExpressRoute, and User VPN connections are collectively called Branches and associate to the same (Default) route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. In order to configure this scenario, take the following steps into consideration:

1. Create a custom route table **RT_VNET**.
1. Create a route to activate VNet-to-Internet and VNet-to-Branch: 0.0.0.0/0 with the next hop pointing to Azure Firewall. In the Propagation section, you'll make sure that VNets are selected which would ensure more specific routes, thereby allowing VNet-to-VNet direct traffic flow.

   * In **Association:** Select VNets which will imply that VNets will reach destination according to the routes of this route table.
   * In **Propagation:** Select VNets which will imply that the VNets propagate to this route table; in other words, more specific routes will propagate to this route table, thereby ensuring direct traffic flow between VNet to VNet.

1. Add an aggregated static route for VNets into the **Default Route table** to activate the Branch-to-VNet flow via the Azure Firewall. 

   * Remember, branches are associated and propagating to the default route table.
   * Branches do not propagate to RT_VNET route table. This ensures the VNet-to-Branch traffic flow via the Azure Firewall.

This will result in the routing configuration changes as shown in **Figure 1**.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/between-vnets-firewall/routing.png" alt-text="Figure 1":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about how to configure virtual hub routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).
