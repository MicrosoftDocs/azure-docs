---
title: 'Scenario: Route to Shared Services VNets'
titleSuffix: Azure Virtual WAN
description: Scenarios for routing - set up routes to access a Shared Service VNet with a workload that you want every VNet and Branch to access.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: cherylmc

---
# Scenario: Route to Shared Services VNets

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this scenario, the goal is to set up routes to access a **Shared Service** VNet with workload that you want every VNet and Branch (VPN/ER/P2S) to access. For information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="workflow"></a>Scenario workflow

In order to configure this scenario, take the following steps into consideration:

1. Identify the **Shared Services** VNet.
2. Create a custom route table. In the example, we refer to this route table as **RT_SHARED**. For steps to create a route table, see [How to configure virtual hub routing](how-to-virtual-hub-routing.md). For this scenario, you need to propagate all branch routes and Shared Services VNet routes to this route table. Use the following values as a guideline:

   * **Propagation**
      * For **Branches**, select **RT_SHARED**, in addition to any other route tables you may have already selected.
      * For **VNets**, select the **Shared Services VNet**,  in addition to any other route tables you may have already selected.

   * **Association**
      * For **VNets *except* the Shared Services VNet**, select **RT_SHARED**. This will imply that all VNets (except the shared services VNet) will learn routes for branches and shared services VNet due to the association to the RT_SHARED route table.

   All VPN/ExpressRoute/User VPN Connections are associated to the same and one route table. All VPN/ExpressRoute/User VPN Connections propagate routes to the same set of route tables.

   :::image type="content" source="./media/routing-scenarios/shared-service-vnet/shared-services.png" alt-text="Shared services VNet":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).