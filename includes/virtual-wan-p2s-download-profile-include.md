---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 02/05/2021
 ms.author: cherylmc
 ms.custom: include file
---

1. On the page for your virtual WAN, select **User VPN configurations**.
1. On the **User VPN configurations** page, select a configuration, then select **Download virtual WAN user VPN profile**. When you download the WAN-level configuration, you get a built-in Traffic Manager-based User VPN profile. For more information about Global profiles or a hub-based profile, see [Hub profiles](../articles/virtual-wan/global-hub-profile.md). Failover scenarios are simplified with global profile.

   
   If for some reason a hub is unavailable, the built-in traffic management provided by the service ensures connectivity (via a different hub) to Azure resources for point-to-site users. You can always download a hub-specific VPN configuration by navigating to the hub. Under **User VPN (point to site)**, download the virtual hub **User VPN** profile.
1. On the **Download virtual WAN user VPN profile** page, select the **Authentication type**, then select **Generate and download profile**. The profile package will generate and a zip file containing the configuration settings will download.
