---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 07/15/2021
 ms.author: cherylmc
 ms.custom: include file
---

1. On the page for your virtual WAN, on the left pane, select **Hubs**. On the **Hubs** page, select **+New Hub**.

   :::image type="content" source="media/virtual-wan-p2s-hub/new-hub.png" alt-text="Screenshot of new hub.":::

1. On the **Create virtual hub** page, complete the following fields:

   * **Region** - Select the region that you want to deploy the virtual hub in.
   * **Name** - Enter the name that you want to call your virtual hub.
   * **Hub private address space** - The hub's address range in CIDR notation.

   :::image type="content" source="media/virtual-wan-p2s-hub/create-hub.png" alt-text="Screenshot of create virtual hub.":::

1. On the **Point-to-site** tab, complete the following fields:

   * **Gateway scale units** - which represents the aggregate capacity of the User VPN gateway.
   * **Point to site configuration** - which you created in the previous step.
   * **Client Address Pool** -  for the remote users.
   * **Custom DNS Server IP**.
   * **Routing preference** - Select the appropriate Routing preference. Azure routing preference enables you to choose how your traffic routes between Azure and the Internet. You can choose to route traffic either via the Microsoft network, or, via the ISP network (public internet). These options are also referred to as cold potato routing and hot potato routing, respectively. The public IP address in Virtual WAN is assigned by the service based on the routing option selected. For more information about routing preference via Microsoft network or ISP, see the [Routing preference](../articles/virtual-network/routing-preference-overview.md) article.

   :::image type="content" source="media/virtual-wan-p2s-hub/create-point-to-site.png" alt-text="Screenshot of virtual hub configuration with point-to-site selected.":::

1. Select **Review + create**.
1. On the **validation passed** page, select **Create**.