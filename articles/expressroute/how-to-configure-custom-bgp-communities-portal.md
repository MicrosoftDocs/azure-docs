---
title: 'Configure custom BGP communities for Azure ExpressRoute private peering using the Azure portal'
description: Learn how to apply or update BGP community value for a new or an existing virtual network using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/01/2023
ms.author: duau
---

# Configure custom BGP communities for Azure ExpressRoute private peering using the Azure portal

BGP communities are groupings of IP prefixes tagged with a community value. This value can be used to make routing decisions on the router's infrastructure. You can apply filters or specify routing preferences for traffic sent to your on-premises from Azure with BGP community tags. This article explains how to apply a custom BGP community value for your virtual networks using the Azure portal. Once configured, you can view the regional BGP community value and the custom community value of your virtual network. This value will be used for outbound traffic sent over ExpressRoute when originating from that virtual network.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.

* You must have an active ExpressRoute circuit. 
  * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider. 
  * Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
  * Ensure that Azure private peering gets configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.
  
## Applying or updating the custom BGP value for an existing virtual network

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select the virtual network that you want to update the BGP community value for.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/virtual-network-list.png" alt-text="Screenshot of the list of virtual networks.":::

1. Select the **configure** link below the *BGP community string*.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/virtual-network-overview.png" alt-text="Screenshot of the overview page of a virtual network.":::

1. On the *BGP community string* page, enter the BGP value you would like to configure this virtual network and then select **Save**.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/bgp-community-value.png" alt-text="Screenshot of the BGP community string page.":::
 

## Next steps

- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md).
- [Troubleshoot your network performance](expressroute-troubleshooting-network-performance.md)
