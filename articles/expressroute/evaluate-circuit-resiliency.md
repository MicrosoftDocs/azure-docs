---
title: Evaluate the resiliency of multi-site redundant ExpressRoute circuits
description: This article shows you how to evaluate the resiliency of your ExpressRoute circuit deployment by manually testing the failover of your ExpressRoute circuits.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 03/22/2024
ms.author: duau
ms.custom: ai-usage
---

# Evaluate the resiliency of multi-site redundant ExpressRoute circuits

The [guided portal experience](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview) assists in the configuration of ExpressRoute circuits for maximum resiliency. The subsequent diagram illustrates the logical architecture of an ExpressRoute circuit designed for maximum resiliency."

:::image type="content" source=".\media\evaluate-circuit-resiliency\maximum-resiliency.png" alt-text="Diagram of ExpressRoute circuits configured with maximum resiliency.":::

Circuits configured for maximum resiliency provide both site (peering location) redundancy and intra-site redundancy. After deploying multi-site redundant ExpressRoute circuits, it's essential to ensure that on-premises routes are advertised over the redundant circuits to fully utilize the benefits of multi-site redundancy. This article offers a guide on how to manually validate your router advertisements and test the resiliency provided by your multi-site redundant ExpressRoute circuit deployment.

## Prerequisites

* Before performing a manual failover of an ExpressRoute circuit, it's imperative that your ExpressRoute circuits are appropriately configured. For more information, see the guide on [Configuring ExpressRoute Circuits](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview). It's also crucial to ensure that all on-premises routes are advertised over both redundant circuits in the maximum resiliency ExpressRoute configuration.

* Verify that identical routes are being advertised over both redundant circuits, navigate to the **Peerings** page of the ExpressRoute circuit within the Azure portal. Select the **Azure private** peering row and then select the **View route table** option at the top of the page.

    :::image type="content" source=".\media\evaluate-circuit-resiliency\view-route-table.png" alt-text="Screenshot of the view route table button from the ExpressRoute peering page.":::

    The routes advertised over the ExpressRoute circuit should be identical across both redundant circuits. If the routes aren't identical, we recommend you review the configuration of the on-premises routers and the ExpressRoute circuits.

    :::image type="content" source=".\media\evaluate-circuit-resiliency\route-table.png" alt-text="Screenshot of the route table for an ExpressRoute private peering.":::

## Initiate a manual failover for an ExpressRoute circuit

> [!NOTE]
> The following procedure outlined will result in the disconnection of both redundant connections of the ExpressRoute circuit. Therefore, it's important that you do this test during scheduled maintenance windows or during off-peak hours. You should also ensure that a redundant circuit is available to provide connectivity to your on-premises network.

To manually failover an ExpressRoute circuit that is configured with maximum resiliency, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter **ExpressRoute circuits** and select **ExpressRoute circuits** from the search results.

1. In the **ExpressRoute circuits** page, identity and select the ExpressRoute circuit for which you intend to disable peering, to facilitate a failover to the second ExpressRoute circuit.

1. Navigate to the **Overview** page and select the private peering that is to be disabled.

    :::image type="content" source="./media/evaluate-circuit-resiliency/primary-circuit.png" alt-text="Screenshot of the peering section of an ExpressRoute circuit on the overview page.":::

1.  Deselect the checkbox next to **Enable IPv4 Peering** or **Enable IPv6 Peering** to disconnect the Border Gateway Protocol (BGP) peering and then select **Save**. When you disable the peering, Azure disconnects the private peering connection on the first circuit, and the secondary circuit assumes the role of the active connection."

    :::image type="content" source="./media/evaluate-circuit-resiliency/disable-private-peering-primary.png" alt-text="Screenshot of the private peering settings page for an ExpressRoute circuit.":::

1. To revert to the first ExpressRoute circuit, select the checkbox next to **Enable IPv4 Peering** or **Enable IPv6 Peering** to reestablish the BGP peering. Then select **Save**.

1. Proceed to the second ExpressRoute circuit and replicate steps 4 and 5 to disable the peering and facilitate a failover to the first ExpressRoute circuit.

1. After verifying the successful completion of the failover, it's crucial to re-enable peering for the second ExpressRoute circuit to resume normal operation.

## Next steps

* Learn how to [plan and managed cost for Azure ExpressRoute](plan-manage-cost.md)
