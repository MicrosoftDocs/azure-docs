---
title: 'Scenario: Azure Firewall custom routing for Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - routing traffic between VNets directly, but use Azure Firewall for VNet ->Internet/Branch and Branch to VNet traffic flows
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/04/2020
ms.author: cherylmc
ms.custom: fasttrack-edit

---
# Scenario: Azure Firewall - custom

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to route traffic between VNets directly, but use Azure Firewall for VNet-to-Internet/Branch and Branch-to-VNet traffic flows.

## <a name="design"></a>Scenario design

In order to figure out how many route tables will be needed, you can build a connectivity matrix, where each cell represents whether a source (row) can communicate to a destination (column). The connectivity matrix in this scenario is trivial, but be consistent with other scenarios, we can still look at it:

| From           | To:      | *VNets*      | *Branches*    | *Internet*   |
|---             |---       |---           |---            |---           |
| **VNets**      |   &#8594;|     X        |     AzFW      |     AzFW     |
| **Branches**   |   &#8594;|    AzFW      |       X       |       X      |

In the previous table, an "X" represents direct connectivity between two connections without the traffic traversing the Azure Firewall in Virtual WAN, and "AzFW" indicates that the flow will go through the Azure Firewall. Currently, Virtual WAN does not support sending traffic from branches to the Internet through Azure Firewall, so it is not covered in this scenario. Since there are two distinct connectivity patterns in the matrix, we will need two route tables that will be configured as follows:

* Virtual networks:
  * Associated route table: **RT_VNet**
  * Propagating to route tables: **RT_VNet**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **Default**

In this example, VNets only learn other VNets, and branches only learn other branches, so they are two islands that we can interconnect through the Azure Firewall with static routes:

| Description           | Route table | Static route                  |
| --------------------- | ----------- | ----------------------------- |
| Branches and Internet | RT_VNet     | 0.0.0.0/0 -> Azure Firewall   |
| VNets                 | Default     | 10.1.0.0/16 -> Azure Firewall |

The result is that the Firewall will sit between VNets and branches, and between VNets and the public Internet. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Scenario workflow

In this scenario, you want to route traffic through the Azure Firewall for VNet-to-Internet, VNet-to-Branch, or Branch-to-VNet traffic, but would like to go direct for VNet-to-VNet traffic. If you used Azure Firewall Manager, the route settings are automatically populated into the **Default Route Table**. Private Traffic applies to VNet and Branches, Internet traffic applies to 0.0.0.0/0.

VPN, ExpressRoute, and User VPN connections are collectively called Branches and associate to the same (Default) route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. In order to configure this scenario, take the following steps into consideration:

1. Create a custom route table **RT_VNet**.
1. Create a route to activate VNet-to-Internet and VNet-to-Branch: 0.0.0.0/0 with the next hop pointing to Azure Firewall. In the Propagation section, you'll make sure that VNets are selected which would ensure more specific routes, thereby allowing VNet-to-VNet direct traffic flow.

   * In **Association:** Select VNets which will imply that VNets will reach destination according to the routes of this route table.
   * In **Propagation:** Select VNets which will imply that the VNets propagate to this route table; in other words, more specific routes will propagate to this route table, thereby ensuring direct traffic flow between VNet to VNet.

1. Add an aggregated static route for VNets into the **Default Route table** to activate the Branch-to-VNet flow via the Azure Firewall. 

   * Remember, branches are associated and propagating to the default route table.
   * Branches do not propagate to RT_VNet route table. This ensures the VNet-to-Branch traffic flow via the Azure Firewall.

This will result in the routing configuration changes as shown in **Figure 1**.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/between-vnets-firewall/routing.png" alt-text="Figure 1":::

> [!NOTE]
> The Virtual WAN hubs and the connected virtual networks should be in the same Azure region.

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about how to configure virtual hub routing, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md).
