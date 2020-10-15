---
title: 'Azure ExpressRoute: Reset circuit peering using the Azure portal'
description: Learn how to disable and enable peerings of an Azure ExpressRoute circuit using the Azure portal.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: how-to
ms.date: 10/15/2020
ms.author: duau
---

# Reset ExpressRoute circuit peerings

This article describes how to disable and enable peerings of an ExpressRoute circuit using the Azure portal. When you disable a peering, the BGP session on both the primary and the secondary connection of your ExpressRoute circuit will be shut down. You'll lose connectivity through this peering to Microsoft. When you enable a peering, the BGP session on both the primary and the secondary connection of your ExpressRoute circuit will be brought up. You'll regain connectivity through this peering to Microsoft. You can enable and disable Microsoft Peering and Azure Private Peering on an ExpressRoute circuit independently. The first time you configure the peerings on your ExpressRoute circuit, the peerings are enabled by default.

There are a couple scenarios where you may find it helpful resetting your ExpressRoute peerings.
* Test your disaster recovery design and implementation. For example, you have two ExpressRoute circuits. You can disable the peerings of one circuit and force your network traffic to fail over to the other circuit.
* Enable Bidirectional Forwarding Detection (BFD) on Azure Private Peering or Microsoft Peering of your ExpressRoute circuit. BFD gets enabled by default on Azure Private Peering if your ExpressRoute circuit is created after August 1 2018 and on Microsoft Peering. If your ExpressRoute circuit gets created after January 10 2020. If your circuit was created before that, BFD wasn't enabled. You can enable BFD by disabling the peering and reenabling it. 

### Sign in to the Azure portal

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

## Reset a peering

1. Select the circuit you want that you want to make peering configuration changes.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/expressroute-circuit-list.png" alt-text="ExpressRoute circuit list":::

1. Select the peering configuration you want to enable or disable.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/expressroute-circuit.png" alt-text="ExpressRoute circuit overview":::

1. Uncheck **Enable Peering** and click **Save** to disable the peering configuration.

    :::image type="content" source="./media/expressroute-howto-reset-peering-portal/disable-peering.png" alt-text="Disable private peering":::

1. You can enable the peering again by checking **Enable Peering** and clicking **Save**.

## Next steps
If you need help with troubleshooting an ExpressRoute problem, check out the following articles:
* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
