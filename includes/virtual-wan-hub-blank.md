---
author: cherylmc
ms.author: cherylmc
ms.date: 07/28/2023
ms.service: virtual-wan
ms.topic: include

#This include is used in multiple articles. Before modifying, verify that any changes apply to all articles that use this include.
---

1. Go to the virtual WAN that you created. On the virtual WAN page left pane, under the **Connectivity**, select **Hubs**.

1. On the **Hubs** page, select **+New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="media/virtual-wan-hub-blank/new-hub.jpg" alt-text="Screenshot shows the Hubs configuration dialog box with New Hub selected.":::

1. On the **Basics** tab, fill in the values.

   :::image type="content" source="media/virtual-wan-hub-blank/basics-page.png" alt-text="Screenshot shows the Create virtual hub pane where you can enter values.":::

   * **Region**: This setting was previously referred to as location. It's the region in which you want to create your virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The hub's address range in CIDR notation. The minimum address space is /24 to create a hub.
   * **Virtual hub capacity**: Select from the dropdown. For more information, see [Virtual hub settings](../articles/virtual-wan/hub-settings.md).
   * **Hub routing preference**: Select from the dropdown. See [Virtual hub routing preference](../articles/virtual-wan/about-virtual-hub-routing-preference.md) for more information.

1. Click **Review + create**.

1. On the **Validation passed** page, click **Create**.