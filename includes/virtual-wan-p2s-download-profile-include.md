---
ms.author: cherylmc
author: cherylmc
ms.date: 07/29/2021
ms.service: virtual-wan
ms.topic: include
---

1. On the page for your **virtual WAN**, select **User VPN configurations**.
1. On the **User VPN configurations** page, select a configuration, then select **Download virtual WAN user VPN profile**.

   :::image type="content" source="./media/virtual-wan-p2s-download-profile/download.png" alt-text="Screenshot of Download virtual WAN user VPN profile.":::

   * When you download the WAN-level configuration, you get a built-in Traffic Manager-based User VPN profile. 
   
   * For information about Global profiles and hub-based profiles, see [Hub profiles](../articles/virtual-wan/global-hub-profile.md). Failover scenarios are simplified with global profile.

   * If for some reason a hub is unavailable, the built-in traffic management provided by the service ensures connectivity (via a different hub) to Azure resources for point-to-site users. You can always download a hub-specific VPN configuration by navigating to the hub. Under **User VPN (point to site)**, download the virtual hub **User VPN** profile.
1. On the **Download virtual WAN user VPN profile** page, select the **Authentication type**, then click **Generate and download profile**. A profile package (zip file) containing the client configuration settings is generated and downloads to your computer.

   :::image type="content" source="./media/virtual-wan-p2s-download-profile/generate.png" alt-text="Screenshot of generate and download profile.":::

