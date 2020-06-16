---
title: 'Scenario: Custom isolation for VNets'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - prevent selected VNets from being able to reach each other
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: cherylmc

---
# Scenario: Custom isolation for VNets

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In a custom isolation scenario for VNets, the goal is to prevent specific VNets from being able to reach other. However, the VNets are required to reach all branches (VPN/ER/User VPN).

In this scenario, VPN, ExpressRoute, and User VPN connections are associated to the same route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario architecture

In **Figure 1**, there are Blue and Red connections.

* Blue-connected VNets can reach each other, as well all branches (VPN/ER/P2S) connections.
* Red VNets can reach each other and all branches (VPN/ER/P2S).
* When multiple hubs exist, hub-to-hub routing (also known as inter-hub) is enabled by default in Standard Virtual WAN.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/custom-isolation/custom.png" alt-text="figure 1":::

## <a name="workflow"></a>Scenario workflow

Consider the following steps when setting up routing. Keep in mind that any spoke can reach another spoke. When multiple hubs exist, hub-to-hub routing (also known as inter-hub) is enabled by default in Standard Virtual WAN.

1. Create two custom route tables, **RT_BLUE** and **RT_RED**.
2. For **RT_BLUE**:
   * **Association**: Select all Blue VNets
   * **Propagation**: For Branches, select **RT_BLUE**, in addition to any option you may have already selected before. For VNets, select all Blue VNets in addition to any option you may have already selected before.
3. Repeat the same configuration for **RT_RED** route table for red VNets and branches (VPN/ER/P2S).

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).