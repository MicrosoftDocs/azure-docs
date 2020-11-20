---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/06/2020
 ms.author: cherylmc
 ms.custom: include file
---

1. On the page for your virtual WAN, select **User VPN configurations**.
1. At the top of the  page, select **Download user VPN config**. When you download the WAN-level configuration, you get a built-in Traffic Manager-based User VPN profile. For more information about Global profiles or a hub-based profile, see [Hub profiles](https://docs.microsoft.com/azure/virtual-wan/global-hub-profile). Failover scenarios are simplified with global profile.

   If for some reason a hub is unavailable, the built-in traffic management provided by the service ensures connectivity (via a different hub) to Azure resources for point-to-site users. You can always download a hub-specific VPN configuration by navigating to the hub. Under **User VPN (point to site)**, download the virtual hub **User VPN** profile.
1. Once the file has finished creating, select the link to download it.
1. Use the profile file to configure the VPN clients.
