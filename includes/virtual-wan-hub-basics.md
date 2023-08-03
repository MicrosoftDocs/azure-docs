---
ms.author: cherylmc
author: cherylmc
ms.date: 07/28/2023
ms.service: virtual-wan
ms.topic: include
---

1. Go to the virtual WAN that you created. On the virtual WAN page left pane, under the **Connectivity**, select **Hubs**.

1. On the **Hubs** page, select **+New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="./media/virtual-wan-hub-basics/create-hub.png" alt-text="Screenshot shows the Create virtual hub pane with the Basics tab selected." lightbox="./media/virtual-wan-hub-basics/create-hub.png":::

1. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   * **Region**: Select the region in which you want to deploy the virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The hub's address range in CIDR notation. The minimum address space is /24 to create a hub.
   * **Virtual hub capacity**: Select from the dropdown. For more information, see [Virtual hub settings](../articles/virtual-wan/hub-settings.md).
   * **Hub routing preference**: Leave as default. For more information, see [Virtual hub routing preference](../articles/virtual-wan/about-virtual-hub-routing-preference.md).
