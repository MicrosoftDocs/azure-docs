---
ms.author: cherylmc
author: cherylmc
ms.date: 05/20/2022
ms.service: virtual-wan
ms.topic: include
---

1. Locate the virtual WAN that you created. On the virtual WAN page left pane, under the **Connectivity**, select **Hubs**.

1. On the **Hubs** page, select **+New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="./media/virtual-wan-tutorial-hub-include/create-hub.png" alt-text="Screenshot shows the Create virtual hub pane with the Basics tab selected." lightbox="./media/virtual-wan-tutorial-hub-include/create-hub.png":::

1. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   * **Region**: This setting was previously referred to as location. It's the region in which you want to create your virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The minimum address space is /24 to create a hub.
   * **Virtual hub capacity**: Select from the dropdown. For more information, see [Virtual hub settings](../articles/virtual-wan/hub-settings.md).
