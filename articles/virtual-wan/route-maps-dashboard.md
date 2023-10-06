---

title: 'Monitor Route-maps using the Route Map Dashboard'
titleSuffix: Azure Virtual WAN
description: Learn how to use the Route Map dashboard to monitor routes, AS Path, and BGP communities.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 05/31/2023
ms.author: cherylmc

---
# Monitor Route-maps using the Route Map dashboard (Preview)

This article helps you use the Route Map dashboard to monitor Route-maps. Using the Route Map dashboard, you can monitor routes, AS Path, and BGP communities for routes in your Virtual WAN.

[!INCLUDE [Preview text](../../includes/virtual-wan-route-maps-preview.md)]

## Dashboard view

[!INCLUDE [Route-maps email](../../includes/virtual-wan-route-maps-preview-email.md)]

The following steps walk you through how to navigate to the Route Map dashboard.

1. Go to the **Azure portal -> your Virtual WAN**.
1. On your Virtual WAN, in the left pane, under Connectivity, select **Hubs**.
1. On the hubs page, you can see the hubs that are connected to your Virtual WAN. Select the hub that you want to view.
1. In the left pane, under Routing, select **Route-Maps** to open the **Route Map Dashboard**.

   :::image type="content" source="./media/route-maps-dashboard/dashboard-view.png" alt-text="Screenshot shows the Route Map dashboard page." lightbox="./media/route-maps-dashboard/dashboard-view.png":::

## View connections

After you open the Route Map dashboard, you can view the details of your connection. The following steps walk you through selecting the necessary values.

:::image type="content" source="./media/route-maps-dashboard/example-dashboard.png" alt-text="Screenshot shows the example Route Map dashboard page." lightbox="./media/route-maps-dashboard/example-dashboard.png":::

1. From the drop-down, select the **Connection type** that you want to view. The connections types are VPN (Site-to-Site and Point-to-Site), ExpressRoute, and Virtual Network.
1. From the drop-down, select **Connection** you want to view.
1. Select the direction from the two options: **In the inbound direction.** or **In the outbound direction.**You can view inbound from a VNet or inbound to the virtual hub router from ExpressRoute, Branch or User connections. You can also view routes outbound from a VNet or outbound from the virtual hub router to ExpressRoute, Branch or User connections.
1. On the Route Map dashboard, the following values are available:

   |Value | Description|
   |---|---|
   | Prefix | The route after a route map has been applied.|
   | As Path | The BGP AS path of the route.|
   | Community | The BGP community of the route.|

### Example

:::image type="content" source="./media/route-maps-dashboard/example-diagram.png" alt-text="Diagram shows a connection example." lightbox="./media/route-maps-dashboard/example-diagram.png":::

In this example, you can use the Route Map Dashboard to view the routes on **Connection1** that are leaving the virtual hub router and going to the VPN Branch. The following steps walk you through how to view this connection.

1. Go to the **Route Map** Dashboard.
1. From the **Choose connection type** drop-down, select "VPN".
1. From the **Connection** drop-down, select the connection. In this example, the connection is "Connection 1".
1. For **View routs for Route-maps applied**, select **In the outbound direction**.

## Next steps

* [Configure Route Maps](route-maps-how-to.md)
* [About Route Maps](route-maps-about.md)