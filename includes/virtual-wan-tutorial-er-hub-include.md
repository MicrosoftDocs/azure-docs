---
ms.author: cherylmc
author: cherylmc
ms.date: 08/19/2021
ms.service: virtual-wan
ms.topic: include
---
1. Locate the Virtual WAN that you created. On the Virtual WAN page, under the **Connectivity** section, select **Hubs**. Click **New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="media/virtual-wan-empty-hub/new-hub.jpg" alt-text="Screenshot shows the Hubs configuration dialog box with New Hub selected.":::

1. On the **Create virtual hub** page, fill in the fields.

   :::image type="content" source="media/virtual-wan-tutorial-er-hub/create-hub.png" alt-text="Screenshot shows the Basics tab where you can enter values.":::

   * **Region**: Select the region in which you want to deploy the virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The hub's address range in CIDR notation.

1. Select the **ExpressRoute tab**. Click **Yes** to reveal settings and fill out the field. For information about gateway scale units, see the [FAQ](../articles/virtual-wan/virtual-wan-faq.md#what-are-virtual-wan-gateway-scale-units).

   :::image type="content" source="media/virtual-wan-tutorial-er-hub/expressroute.png" alt-text="Screenshot shows the ExpressRoute tab where you can enter values.":::

1. Select **Review + Create** to validate.
1. Select **Create** to create the hub with an ExpressRoute gateway. A hub can take about 30 minutes to complete. After 30 minutes, **Refresh** to view the hub on the **Hubs** page. Select **Go to resource** to navigate to the resource.