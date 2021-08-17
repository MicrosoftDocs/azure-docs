---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 06/23/2021
 ms.author: cherylmc
 ms.custom: include file
---
1. Locate the virtual WAN that you created. On the virtual WAN page, under the **Connectivity** section, select **Hubs**.
1. On the **Hubs** page, select **+New Hub** to open the **Create virtual hub** page.

   :::image type="content" source="./media/virtual-wan-tutorial-hub-include/basics.png" alt-text="Screenshot shows the Create virtual hub pane with the Basics tab selected." border="false":::
1. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   * **Region** (previously referred to as Location)
   * **Name**
   * **Hub private address space** - The minimum address space is /24 to create a hub. If you use anything in the range from /25 to /32, it will produce an error during creation. You don't need to explicitly plan the subnet address space for the services in the virtual hub. Because Azure Virtual WAN is a managed service, it creates the appropriate subnets in the virtual hub for the different gateways/services (for example, VPN gateways, ExpressRoute gateways, User VPN point-to-site gateways, Firewall, routing, and etc.).
