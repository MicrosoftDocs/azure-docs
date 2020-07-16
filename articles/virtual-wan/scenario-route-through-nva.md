---
title: 'Scenario: Route traffic through an NVA'
titleSuffix: Azure Virtual WAN
description: Route traffic through an NVA
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: cherylmc

---
# Scenario: Route traffic through an NVA

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this NVA scenario, the goal is to route traffic through an NVA (Network Virtual Appliance) for branch to VNet and VNet to branch. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Scenario architecture

In **Figure 1**, there are two hubs; **Hub 1** and **Hub 2**.

* **Hub 1** and **Hub 2** are directly connected to NVA VNets **VNET 2** and **VNET 4**.

* **VNET 5** and **VNET 6** are peered with **VNET 2**.

* **VNET 7** and **VNET 8** are peered with **VNET 4**.

* **VNETs 5,6,7,8** are indirect spokes, not directly connected to a virtual hub.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/nva/nva.png" alt-text="Figure 1":::

## <a name="workflow"></a>Scenario workflow

To set up routing via NVA, here are the steps to consider:

1. Identify the NVA spoke VNet connection. In **Figure 1**, they are **VNET 2 Connection (eastusconn)** and **VNET 4 Connection (weconn)**.

   Ensure there are UDRs set up:
   * From VNET 5 and 6 to VNET 2 NVA IP
   * From VNET 7 and 8 to VNET 4 NVA IP 
   
   You do not need to connect VNET 5,6,7,8 to the virtual hubs directly.

2. Add an aggregated static route entry for VNETs 2,5,6 to Hub 1’s default route table. 

   :::image type="content" source="./media/routing-scenarios/nva/nva-static-expand.png" alt-text="Example":::

3. Configure a static route for VNETs 5,6 in VNET 2’s virtual network connection. To set up routing configuration for a virtual network connection, see [virtual hub routing](how-to-virtual-hub-routing.md#routing-configuration).

4. Add an aggregated static route entry for VNETs 4,7,8 to Hub 1’s default route table.

5. Repeat steps 2, 3 and 4 for Hub 2’s default route table.

This will result in the routing configuration changes as seen the figure below

   :::image type="content" source="./media/routing-scenarios/nva/nva-result.png" alt-text="Result":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
