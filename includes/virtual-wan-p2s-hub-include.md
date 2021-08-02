---
ms.author: cherylmc
author: cherylmc
ms.date: 07/30/2021
ms.service: virtual-wan
ms.topic: include
---

1. On the page for your **virtual WAN**, on the left pane, select **Hubs**. On the **Hubs** page, select **+New Hub**.

   :::image type="content" source="media/virtual-wan-p2s-hub/new-hub.png" alt-text="Screenshot of new hub.":::

1. On the **Create virtual hub** page, view the **Basics** tab.

   :::image type="content" source="media/virtual-wan-p2s-hub/create-hub.png" alt-text="Screenshot of create virtual hub.":::

1. On the **Basics** tab, configure the following settings:

   * **Region** - Select the region in which you want to deploy the virtual hub.
   * **Name** - Enter the name that you want to call your virtual hub.
   * **Hub private address space** - The hub's address range in CIDR notation.

1. Click the **Point to site** tab to open the configuration page for point-to-site. To view the point to site settings, click **Yes**.

   :::image type="content" source="media/virtual-wan-p2s-hub/create-point-to-site.png" alt-text="Screenshot of virtual hub configuration with point-to-site selected.":::

1. Configure the following settings:

   * **Gateway scale units** - This represents the aggregate capacity of the User VPN gateway. If you select 40 or more gateway scale units, plan your client address pool accordingly. For information about how this setting impacts the client address pool, see [About client address pools](../articles/virtual-wan/about-client-address-pools.md).
   * **Point to site configuration** - Select the User VPN configuration that you created in a previous step.
   * **Routing preference** - Azure routing preference enables you to choose how your traffic routes between Azure and the Internet. You can choose to route traffic either via the Microsoft network, or, via the ISP network (public internet). These options are also referred to as cold potato routing and hot potato routing, respectively. The public IP address in Virtual WAN is assigned by the service based on the routing option selected. For more information about routing preference via Microsoft network or ISP, see the [Routing preference](../articles/virtual-network/routing-preference-overview.md) article.
   * **Client address pool** -  The address pool from which IP addresses will be automatically assigned to VPN clients. For more information, see [About client address pools](../articles/virtual-wan/about-client-address-pools.md).
   * **Custom DNS Servers** - The IP address of the DNS server(s) the clients will use. You can specify up to 5.

1. Select **Review + create** to validate your settings.

1. When validation passes, select **Create**. Creating a hub can take 30 minutes or more to complete.