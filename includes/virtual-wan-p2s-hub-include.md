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

1. Under your virtual WAN, select Hubs and select **+New Hub**.

   :::image type="content" source="media/virtual-wan-p2s-hub/new-hub.jpg" alt-text="new hub":::

1. On the create virtual hub page, fill in the following fields.

   * **Region** - Select the region that you want to deploy the virtual hub in.
   * **Name** - Enter the name that you want to call your virtual hub.
   * **Hub private address space** - The hub's address range in CIDR notation.

   :::image type="content" source="media/virtual-wan-p2s-hub/create-hub.jpg" alt-text="create virtual hub":::

1. On the Point-to-site tab, complete the following fields:

   * **Gateway scale units** - which represents the aggregate capacity of the User VPN gateway.
   * **Point to site configuration** - which you created in the previous step.
   * **Client Address Pool** -  for the remote users.
   * **Custom DNS Server IP**.

   :::image type="content" source="media/virtual-wan-p2s-hub/hub-with-p2s.png" alt-text="hub with point-to-site":::

1. Select **Review + create**.
1. On the **validation passed** page, select **Create**.