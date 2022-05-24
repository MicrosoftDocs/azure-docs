---
author: cherylmc
ms.author: cherylmc
ms.date: 05/20/2022
ms.service: virtual-wan
ms.topic: include

#This include is used in multiple articles. Before modifying, verify that any changes apply to all articles that use this include.
---

1. Locate the Virtual WAN that you created. On the Virtual WAN page, under the **Connectivity** section, select **Hubs**.

1. On the **Hubs** page, click **+ New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="media/virtual-wan-empty-hub/new-hub.jpg" alt-text="Screenshot shows the Hubs configuration dialog box with New Hub selected.":::

1. On the **Basics** tab, fill in the values.

   :::image type="content" source="media/virtual-wan-empty-hub/basics-hub.png" alt-text="Screenshot shows the Create virtual hub pane where you can enter values." lightbox= "media/virtual-wan-empty-hub/basics-hub.png":::

   * **Region**: Select the region in which you want to deploy the virtual hub.
   * **Name**: The name by which you want the virtual hub to be known.
   * **Hub private address space**: The hub's address range in CIDR notation.
   * **Virtual hub capacity**: Select from the dropdown. For more information, see [Virtual hub settings](../articles/virtual-wan/hub-settings.md).

1. Click **Review + create**.

1. On the **Validation passed** page, click **Create**.