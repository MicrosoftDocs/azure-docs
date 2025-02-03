---
title: 'Configure custom BGP communities for Azure ExpressRoute private peering using the Azure portal'
description: Learn how to apply or update BGP community value for a new or an existing virtual network using the Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 01/31/2025
ms.author: duau
---

# Configure custom BGP communities for Azure ExpressRoute private peering using the Azure portal

BGP communities are groupings of IP prefixes tagged with a community value, which can be used to make routing decisions on the router's infrastructure. By using BGP community tags, you can apply filters or specify routing preferences for traffic sent from Azure to your on-premises network. This article explains how to apply a custom BGP community value to your virtual networks using the Azure portal. Once configured, you can view both the regional BGP community value and the custom community value for your virtual network. This value will be used for outbound traffic sent over ExpressRoute from that virtual network.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Ensure you have an active ExpressRoute circuit:
    * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it enabled by your connectivity provider.
    * Ensure Azure private peering is configured for your circuit. Refer to the [configured routing](expressroute-howto-routing-arm.md) article for routing instructions.
    * Verify that Azure private peering is configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.

## Applying or updating the custom BGP value for an existing virtual network

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select the virtual network you want to update the BGP community value for.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/virtual-network-list.png" alt-text="Screenshot of the list of virtual networks.":::

1. Select the **configure** link below the *BGP community string*.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/virtual-network-overview.png" alt-text="Screenshot of the overview page of a virtual network.":::

1. On the *BGP community string* page, enter the BGP value you want to configure for this virtual network, then select **Save**.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/bgp-community-value.png" alt-text="Screenshot of the BGP community string page.":::
 
## Next steps

- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md).
- [Troubleshoot your network performance](expressroute-troubleshooting-network-performance.md)
