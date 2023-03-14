---
title: 'Monitor S2S VPN BGP routes - BGP dashboard'
titleSuffix: Azure Virtual WAN
description: Learn how to monitor BGP peers for site-to-site VPNs using the BGP dashboard.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/06/2022
ms.author: cherylmc
---
# Monitor site-to-site VPN BGP routes using the BGP dashboard

This article helps you monitor Virtual WAN site-to-site VPN BGP information using the **BGP Dashboard**. Using the BGP dashboard, you can monitor BGP peers, advertised routes, and learned routes. The BGP dashboard is available for site-to-site VPNs that are configured to use BGP. The BGP dashboard can be accessed on the page for the site that you want to monitor.

## BGP dashboard

The following steps walk you through one way to navigate to your site and open the BGP dashboard.

1. Go to the **Azure portal -> your Virtual WAN**.
1. On your Virtual WAN, in the left pane, under Connectivity, click **VPN sites**. On the VPN sites page, you can see the sites that are connected to your Virtual WAN.
1. Click the site that you want to view.
1. On the page for the site, click **BGP Dashboard**.

   :::image type="content" source="./media/monitor-bgp-dashboard/bgp-dashboard.png" alt-text="Screenshot shows the overview page for the site with the B G P dashboard highlighted." lightbox="./media/monitor-bgp-dashboard/bgp-dashboard.png":::

## <a name="peers"></a>BGP peers

1. To open the BGP Peers page, go to the **BGP Dashboard**.

1. The **BGP Peers** page is the main view that you see when you open the BGP dashboard.

   :::image type="content" source="./media/monitor-bgp-dashboard/bgp-peers.png" alt-text="Screenshot shows the B G P Peers page." lightbox="./media/monitor-bgp-dashboard/bgp-peers.png":::

1. On the **BGP Peers** page, the following values are available:

   |Value | Description|
   |---|---|
   |Peer address| The BGP address of the remote connection. |
   |Local address | The BGP address of the Virtual WAN hub.  |
   | Gateway instance| The instance of the Virtual WAN hub. |
   |ASN| The Autonomous System Number. |
   |Status | The status the peer is currently in.<br>Available statuses: Connecting, Connected  |
   |Connected duration |The length of time the peer has been connected. HH:MM:SS |
   |Routes received |The number of routes received by the remote site. |
   |Messages sent |The number of messages sent to the remote site.  |
   |Messages received | The number of messages received from the remote site. |

## <a name="advertised"></a>Advertised routes

The **Advertised Routes** page contains the routes that are being advertised to remote sites.

1. On the **BGP Peers** page, click **Routes the site-to-site gateway is advertising** to show the **Advertised Routes** page.

   :::image type="content" source="./media/monitor-bgp-dashboard/routes-advertising.png" alt-text="Screenshot shows B G P peers page with routes the site-to-site gateway is advertising highlighted." lightbox="./media/monitor-bgp-dashboard/routes-advertising.png":::

1. On the **Advertised Routes** page, you can view the top 50 BGP routes. To view all routes, click **Download advertised routes**.

   :::image type="content" source="./media/monitor-bgp-dashboard/advertised-routes.png" alt-text="Screenshot shows the Advertised Routes page with Download advertised routes highlighted." lightbox="./media/monitor-bgp-dashboard/advertised-routes.png":::

1. On the **Advertised Routes** page, the following values are available:

   |Value | Description|
   |---|---|
   | Network  |The address prefix that is being advertised. |
   | Link Name  |  The name of the link.  |
   | Local address  |  A BGP address of the Virtual WAN hub.|
   | Next hop  | The next hop address for the prefix.  |
   |AS Path | The BGP AS path attribute. |

## <a name="learned"></a>Learned routes

The **Learned Routes** page shows the routes that are learned.

1. On the **BGP Peers** page, click **Routes the site-to-site gateway is learning** to show the **Learned Routes** page.

   :::image type="content" source="./media/monitor-bgp-dashboard/routes-learning.png" alt-text="Screenshot shows B G P peers page with routes the site-to-site gateway is learning highlighted." lightbox="./media/monitor-bgp-dashboard/routes-learning.png":::

1. On the **Learned Routes** page, you can view the top 50 BGP routes. To view all routes, click **Download learned routes**.

   :::image type="content" source="./media/monitor-bgp-dashboard/learned-routes.png" alt-text="Screenshot shows the Learned Routes page with Download advertised routes highlighted." lightbox="./media/monitor-bgp-dashboard/learned-routes.png":::

1. On the **Learned Routes** page, the following values are available:

   |Value | Description|
   |---|---|
   | Network | The address prefix that is being advertised. |
   | Link Name |The name of the link.   |
   |Local address  |A BGP address of the Virtual WAN hub.  |
   |Source Peer  |The address the routes is being learned from.  |
   | AS Path | The BGP AS path attribute. |

## Next steps

For more monitoring information, see [Monitoring Azure Virtual WAN](monitor-virtual-wan.md).
