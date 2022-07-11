---
ms.author: cherylmc
author: cherylmc
ms.date: 05/25/2022
ms.service: virtual-wan
ms.topic: include
---
1. Go to the virtual WAN that you created. On the virtual WAN page left pane, under the **Connectivity**, select **Hubs**.

1. On the **Hubs** page, select **+New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="./media/virtual-wan-tutorial-er-hub/create-hub.png" alt-text="Screenshot shows the Create virtual hub pane with the Basics tab selected." lightbox="./media/virtual-wan-tutorial-er-hub/create-hub.png":::

1. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   * **Region**: This setting was previously referred to as location. It's the region in which you want to create your virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The hub's address range in CIDR notation. The minimum address space is /24 to create a hub.
   * **Virtual hub capacity**: Select from the dropdown. For more information, see [Virtual hub settings](../articles/virtual-wan/hub-settings.md).
   * **Hub routing preference**: This field is only available as part of the virtual hub routing preference preview and can only be viewed in the [preview portal](https://portal.azure.com/?feature.customRouterAsn=true&feature.virtualWanRoutingPreference=true#home). See [Virtual hub routing preference](../articles/virtual-wan/about-virtual-hub-routing-preference.md) for more information.
   * **Router ASN**: Set the Autonomous System Number for the virtual hub router. You can use any ASN number except numbers that are reserved by [Azure or IANA](../articles/vpn-gateway/vpn-gateway-bgp-overview.md#what-asns-autonomous-system-numbers-can-i-use).

1. Select the **ExpressRoute tab**. Click **Yes** to reveal settings and fill out the field. For information about gateway scale units, see the [FAQ](../articles/virtual-wan/virtual-wan-faq.md#what-are-virtual-wan-gateway-scale-units).

   :::image type="content" source="media/virtual-wan-tutorial-er-hub/expressroute.png" alt-text="Screenshot shows the ExpressRoute tab where you can enter values.":::

1. Select **Review + Create** to validate.
1. Select **Create** to create the hub with an ExpressRoute gateway. A hub can take about 30 minutes to complete. After 30 minutes, **Refresh** to view the hub on the **Hubs** page. Select **Go to resource** to navigate to the resource.