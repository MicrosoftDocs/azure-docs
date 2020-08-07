---
title: 'Scenario: Custom isolation for VNets'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - prevent selected VNets from being able to reach each other
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Custom isolation for VNets

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In a custom isolation scenario for VNets, the goal is to prevent specific set of VNets from being able to reach other specific set of VNets. However, the VNets are required to reach all branches (VPN/ER/User VPN).

In this scenario, VPN, ExpressRoute, and User VPN connections (collectively called branches) are associated to the same route table (Default Route Table). All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario workflow

In **Figure 1**, there are Blue and Red VNet connections.

* Blue-connected VNets can reach each other, as well as reach all branches (VPN/ER/P2S) connections.
* Red VNets can reach each other, as well as reach all branches (VPN/ER/P2S) connections.

Consider the following steps when setting up routing.

1. Create two custom route tables in the Azure portal, **RT_BLUE** and **RT_RED**.
2. For route table **RT_BLUE**, under:
   * **Association**: Select all Blue VNets
   * **Propagation**: For Branches, Select the option for branches, implying branch(VPN/ER/P2S) connections will propagate routes to this route table.
3. Repeat the same steps for **RT_RED** route table for red VNets and branches (VPN/ER/P2S).

This will result in the routing configuration changes as seen the figure below

**Figure 1**

:::image type="content" source="./media/routing-scenarios/custom-isolation/custom.png" alt-text="figure 1":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
