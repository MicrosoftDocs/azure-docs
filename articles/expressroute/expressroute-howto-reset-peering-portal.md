---
title: 'Azure ExpressRoute: Reset circuit peerings by using the Azure portal'
description: Learn how to disable and enable peerings of an Azure ExpressRoute circuit by using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Reset ExpressRoute circuit peerings by using the Azure portal

This article describes how to disable and enable peerings of an Azure ExpressRoute circuit using the Azure portal. When you disable a peering, the Border Gateway Protocol (BGP) session for both the primary and the secondary connection of your ExpressRoute circuit is shut down. When you enable a peering, the BGP session on both the primary and the secondary connection of your ExpressRoute circuit is restored.

> [!NOTE]
> The first time you configure the peerings on your ExpressRoute circuit, the peerings are enabled by default.

Resetting your ExpressRoute peerings might be helpful in the following scenarios:

* You're testing your disaster recovery design and implementation. For example, assume that you have two ExpressRoute circuits. You can disable the peerings of one circuit and force your network traffic to use the other circuit.

* You want to enable Bidirectional Forwarding Detection (BFD) on Azure private peering or Microsoft peering. If your ExpressRoute circuit was created before August 1, 2018, on Azure private peering or before January 10, 2020, on Microsoft peering, BFD wasn't enabled by default. Reset the peering to enable BFD.

## Sign in to the Azure portal

From a browser, sign in to the [Azure portal](https://portal.azure.com), and then sign in with your Azure account.

## Reset a peering

You can reset the Microsoft peering and the Azure private peering on an ExpressRoute circuit independently.

1. Choose the circuit that you want to change.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/expressroute-circuit-list.png" alt-text="Screenshot that shows choosing a circuit in the ExpressRoute circuit list.":::

1. Choose the peering configuration that you want to reset.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/expressroute-circuit.png" alt-text="Screenshot that shows choosing a peering in the ExpressRoute circuit overview.":::

1. Clear the **Enable Peering** check box, and then select **Save** to disable the peering configuration.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/disable-peering.png" alt-text="Screenshot that shows clearing the Enable Peering check box.":::

1. Select the **Enable Peering** check box, and then select **Save** to re-enable the peering configuration.

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
