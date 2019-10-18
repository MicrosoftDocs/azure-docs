---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/07/2019
 ms.author: cherylmc
 ms.custom: include file
---
A virtual wan **hub** contains the gateway. Once the hub is created, you'll be charged for the hub, even if you don't attach any sites. It takes about 30 minutes to create the hub and gateway.

1. Locate the Virtual WAN that you created. On the Virtual WAN page, under the **Virtual WAN architecture** section, select **Hubs**.
2. On the Hubs page, select **+New Hub** to open the **Create virtual hub** page.
3. On the **Create virtual hub** page, complete the following fields:

    **Virtual Hub Details**

   * Region (previously referred to as Location)
   * Name
   * Hub private address space

4. Select **Review + Create**  to validate.
5. Select **Create** to create the hub. After 30 minutes, **Refresh** to view the hub on the **Hubs** page.
6. Once your hub has created, locate it on the **Hubs** page and select it. Click **VPN (Site to site)** to open the VPN page. Select **Create VPN gateway**.
7. On the **Create VPN Gateway** page, select the Gateway scale units for your gateway.
8. Click **Create** to create the gateway and update the hub. This takes about 30 minutes to complete.