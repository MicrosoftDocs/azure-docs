---
title: 'Scenario: Route traffic through NVAs using custom settings'
titleSuffix: Azure Virtual WAN
description: This scenario helps you route traffic through NVAs using a different NVA for Internet-bound traffic.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Route traffic through NVAs - custom (Preview)

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this NVA (Network Virtual Appliance) scenario, the goal is to route traffic through an NVA for VNet <-> Branch, and use a different NVA for Internet-bound traffic. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario architecture

In **Figure 1**, there is one hub, **Hub 1**.

* **Hub 1** is directly connected to NVA VNets **VNET 4** and **VNET 5**.

* Traffic between VNETs 1, 2, and 3 and Branches (VPN/ER/P2S) is expected to go via **VNET 4 NVA** 10.4.0.5.

* All internet bound traffic from VNETs 1, 2, and 3 is expected to go via **VNET 5 NVA** 10.5.0.5.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-1.png" alt-text="Figure 1":::

## <a name="workflow"></a>Scenario workflow

To set up routing via NVA, here are the steps to consider:

1. In order for Internet-bound traffic to go via VNET5, you need VNETs 1, 2, and 3 to directly connect via VNet peering to VNET 5. You also need a UDR set up in the VNets for 0.0.0.0/0 and next hop 10.5.0.5. Currently, Virtual WAN does not allow a next hop NVA in the virtual hub for 0.0.0.0/0.

1. In the Azure portal, navigate to your virtual hub and create a custom route table **RT_Shared** that will learn routes via propagation from all VNets and Branch connections. In **Figure 2**, this is depicted as an empty Custom Route Table **RT_Shared**.

   * **Routes:** You do not need to add any static routes.

   * **Association:** Select VNETs 4 and 5,  which will mean that VNETs 4 and 5 connections associate to route table **RT_Shared**.

   * **Propagation:** Since you want all branches and VNet connections to propagate their routes dynamically to this route table, select branches and all VNets.

1. Create a custom route table **RT_V2B** for directing traffic from VNETs 1, 2, and 3 to branches.

   * **Routes:** Add an aggregated static route entry for Branches (VPN/ER/P2S) (10.2.0.0/16 in **Figure 2**) with next hop as the VNET 4 connection. You also need to configure a static route in VNET 4’s connection for branch prefixes, and indicate the next hop to be the specific IP of the NVA in VNET 4.

   * **Association:** Select all VNETs 1, 2, and 3. This implies that VNet connections 1, 2, and 3 will associate to this route table and be able to learn routes (static and dynamic via propagation) in this route table.

   * **Propagation:** Connections propagate routes to route tables. Selecting VNETs 1, 2, and 3 will enable propagating routes from VNETs 1, 2, and 3 to this route table. There is no need to propagate routes from branch connections to RT_V2B, as branch VNet traffic goes via the NVA in VNET4.
  
1. Edit the default route table **DefaultRouteTable**.

   All VPN, ExpressRoute, and User VPN connections are associated to the default route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables.

   * **Routes:** Add an aggregated static route entry for VNETs 1, 2, and 3 (10.1.0.0/16 in **Figure 2**) with next hop as the VNET 4 connection. You also need to configure a static route in VNET 4’s connection for VNET 1, 2, and 3 aggregated prefixes, and indicate the next hop to be the specific IP of the NVA in VNET 4.

   * **Association:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring on-premises branch connections are associated to the *defaultroutetable*.

   * **Propagation from:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring on-premise connections are propagating routes to the *defaultroutetable*.

**Figure 2**

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-2.png" alt-text="Figure 2":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
