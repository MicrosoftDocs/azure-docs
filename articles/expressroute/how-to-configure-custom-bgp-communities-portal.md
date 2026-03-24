---
title: 'Configure custom BGP communities for Azure ExpressRoute private peering by using the Azure portal'
description: Learn how to apply or update BGP community value for a new or an existing virtual network by using the Azure portal.
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 03/23/2026
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: "As a network administrator, I want to configure custom BGP community values for my Azure ExpressRoute private peering so that I can optimize routing decisions and manage outbound traffic effectively between Azure and my on-premises network."
---

# Configure custom BGP communities for Azure ExpressRoute private peering by using the Azure portal

BGP communities are groupings of IP prefixes tagged with a community value. You can use these tags to make routing decisions on the router's infrastructure. By using BGP community tags, you can apply filters or specify routing preferences for traffic sent from Azure to your on-premises network. This article explains how to apply a custom BGP community value to your virtual networks by using the Azure portal. After you configure this value, you can view both the regional BGP community value and the custom community value for your virtual network. This value is used for outbound traffic sent over ExpressRoute from that virtual network.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Ensure you have an active ExpressRoute circuit:
    * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it enabled by your connectivity provider.
    * Ensure Azure private peering is configured for your circuit. Refer to the [configured routing](expressroute-howto-routing-arm.md) article for routing instructions.
    * Verify that Azure private peering is configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.

## Apply or update the custom BGP value for an existing virtual network

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter **Virtual networks** and select **Virtual networks** from the results.

1. Select the virtual network you want to configure a custom BGP community value for.

1. On the virtual network's **Overview** page, locate the **BGP community string** property, and then select the **configure** link next to it.

1. On the **BGP community string** page, enter the BGP community value you want to assign to this virtual network, and then select **Save**.

    :::image type="content" source="./media/how-to-configure-custom-bgp-communities-portal/bgp-community-value.png" alt-text="Screenshot of the BGP community string configuration page for a virtual network.":::
 
## Next steps

- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md).
- [Troubleshoot your network performance](expressroute-troubleshooting-network-performance.md)
