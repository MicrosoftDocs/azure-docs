---
title: 'Scenario: Isolating VNets'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - Isolating VNets
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Isolating VNets

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to prevent VNets from being able to reach other. This is known as isolating VNets. The workload within the VNet remains isolated and is not able to communicate with other VNets, as in an any-to-any scenario. However, the VNets are required to reach all branches (VPN, ER, and User VPN). In this scenario, all VPN, ExpressRoute, and User VPN connections are associated to the same and one route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Scenario workflow

In order to configure this scenario, take the following steps into consideration:

1. Create a custom route table. In the example, the route table is **RT_VNet**. To create a route table, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md). For more information about route tables, see [About virtual hub routing](about-virtual-hub-routing.md).
2. When you create the **RT_VNet** route table, configure the following settings:

   * **Association**: Select the VNets you want to isolate.
   * **Propagation**: Select the option for branches, implying branch(VPN/ER/P2S) connections will propagate routes to this route table.

:::image type="content" source="./media/routing-scenarios/isolated/isolated-vnets.png" alt-text="Isolated VNets":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
