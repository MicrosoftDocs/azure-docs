---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 11/04/2019
 ms.author: cherylmc
 ms.custom: include file
---
1. Locate the Virtual WAN that you created. On the Virtual WAN page, under the **Connectivity** section, select **Hubs**.
2. On the Hubs page, select **+New Hub** to open the **Create virtual hub** page.
3. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   ![Basics](./media/virtual-wan-tutorial-er-hub-include/hub1.png "Basics")

    **Project details**

   * Region (previously referred to as Location)
   * Name
   * Hub private address space. The minimum address space is /24 to create a hub, which implies anything range from /25 to /32 will produce an error during creation.
4. Select the **ExpressRoute tab**.

5. On the **ExpressRoute** tab, complete the following fields:

   ![ExpressRoute](./media/virtual-wan-tutorial-er-hub-include/hub2.png "ExpressRoute")

   * Select **Yes** to create an **ExpressRoute** gateway.
   * Select the **Gateway scale units** value from the dropdown.
6. Select **Review + Create** to validate.
7. Select **Create** to create the hub. After 30 minutes, **Refresh** to view the hub on the **Hubs** page. Select **Go to resource** to navigate to the resource.