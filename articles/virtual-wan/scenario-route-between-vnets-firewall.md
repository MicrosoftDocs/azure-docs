---
title: 'Scenario: Azure Firewall custom routing for Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about routing scenarios to route traffic between VNets directly, but use Azure Firewall for VNet -> Internet/Branch and Branch to VNet traffic flows.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 02/13/2023
ms.author: cherylmc

---
# Scenario: Azure Firewall - custom

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to route traffic between VNets directly, but use Azure Firewall for VNet-to-Internet/Branch and Branch-to-VNet traffic flows.

## <a name="design"></a>Design

In order to figure out how many route tables will be needed, you can build a connectivity matrix, where each cell represents whether a source (row) can communicate to a destination (column). The connectivity matrix in this scenario is trivial, but be consistent with other scenarios, we can still look at it.

**Connectivity matrix**

| From           | To:      | *VNets*      | *Branches*    | *Internet*   |
|---             |---       |---           |---            |---           |
| **VNets**      |   &#8594;|    Direct    |     AzFW      |     AzFW     |
| **Branches**   |   &#8594;|    AzFW      |    Direct     |    Direct    |

In the previous table, "Direct" represents direct connectivity between two connections without the traffic traversing the Azure Firewall in Virtual WAN, and "AzFW" indicates that the flow will go through the Azure Firewall. Since there are two distinct connectivity patterns in the matrix, we'll need two route tables that will be configured as follows:

* Virtual networks:
  * Associated route table: **RT_VNet**
  * Propagating to route tables: **RT_VNet**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **Default**

> [!NOTE]
> You can create a separate Virtual WAN instance with one single Secure Virtual Hub in each region, and then you can connect each Virtual WAN to each other via Site-to-Site VPN.

For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Workflow

In this scenario, you want to route traffic through the Azure Firewall for VNet-to-Internet, VNet-to-Branch, or Branch-to-VNet traffic, but would like to go direct for VNet-to-VNet traffic. If you used Azure Firewall Manager, the route settings are automatically populated into the **Default Route Table**. Private Traffic applies to VNet and Branches, Internet traffic applies to 0.0.0.0/0.

VPN, ExpressRoute, and User VPN connections are collectively called Branches and associate to the same (Default) route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. In order to configure this scenario, take the following steps into consideration:

1. Create a custom route table **RT_VNet**.
1. Create a route to activate VNet-to-Internet and VNet-to-Branch: 0.0.0.0/0 with the next hop pointing to Azure Firewall. In the Propagation section, you'll make sure that VNets are selected which would ensure more specific routes, thereby allowing VNet-to-VNet direct traffic flow.

   * In **Association:** Select VNets that will imply that VNets will reach destination according to the routes of this route table.
   * In **Propagation:** Select VNets that will imply that the VNets propagate to this route table; in other words, more specific routes will propagate to this route table, thereby ensuring direct traffic flow between VNet to VNet.

1. Add an aggregated static route for VNets into the **Default Route table** to activate the Branch-to-VNet flow via the Azure Firewall.

   * Remember, branches are associated and propagating to the default route table.
   * Branches don't propagate to RT_VNet route table. This ensures the VNet-to-Branch traffic flow via the Azure Firewall.

This results in the routing configuration changes as shown in **Figure 1**.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/between-vnets-firewall/routing.png" alt-text="Figure 1":::


## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about how to configure virtual hub routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).
