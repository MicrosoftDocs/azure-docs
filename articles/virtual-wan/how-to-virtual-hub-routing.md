---
title: 'How to configure virtual hub routing: Azure portal'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN virtual hub routing using the Azure portal.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/10/2024
ms.author: cherylmc

---
# How to configure virtual hub routing - Azure portal

This article helps you configure virtual hub routing using Azure portal. You can also configure virtual hub routing using the [Azure PowerShell steps](how-to-virtual-hub-routing-powershell.md).

A virtual hub can contain multiple gateways such as a site-to-site VPN gateway, ExpressRoute gateway, point-to-site gateway, and Azure Firewall. The routing capabilities in the virtual hub are provided by a router that manages all routing, including transit routing, between the gateways using Border Gateway Protocol (BGP). The virtual hub router also provides transit connectivity between virtual networks that connect to a virtual hub and can support up to an aggregate throughput of 50 Gbps. These routing capabilities apply to customers using **Standard** Virtual WANs. For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

## Create a route table

The following steps help you create a route table and a route.

1. In the Azure portal, go to the **virtual hub**.
1. On the **Virtual HUB** page, in the left pane, select **Route Tables** to open the Route Tables page. Notice the route tables that are propagated to this virtual hub.
1. Select **+ Create route table** to open the **Create Route Table** page.
1. On the **Basics** tab, complete the following fields, then click **Labels** to move to the Labels page.

   :::image type="content" source="./media/how-to-virtual-hub-routing/basics.png" alt-text="Screenshot showing the Create Route Table page Basics tab." lightbox="./media/how-to-virtual-hub-routing/basics.png":::

   * **Name**: Name the route table instance.
   * **Route name**: Name the route.
   * **Destination type**: Select from the dropdown.
   * **Destination prefix**: You can aggregate prefixes. For example: VNet 1: 10.1.0.0/24 and VNet 2: 10.1.1.0/24 can be aggregated as 10.1.0.0/16. **Branch** routes apply to all connected VPN sites, ExpressRoute circuits, and User VPN connections.
   * **Next hop**: A list of virtual network connections, or Azure Firewall.
   * **Next Hop IP**: If you select a virtual network connection for Next hop, you'll see **Configure static routes** when you click **Configure**. This is an optional configuration setting. For more information, see [Configuring static routes](about-virtual-hub-routing.md#static).

1. On the **Labels** page, configure label names. Labels provide a mechanism to logically group route tables. Configure any required labels, then move to the Associations page.

1. On the **Associations** page, associate connections to the route table. You'll see **Branches**, **Virtual Networks**, and the **Current settings** of the connections. After configuring settings, move to the Propagations page.

    :::image type="content" source="./media/how-to-virtual-hub-routing/associations-settings.png" alt-text="Screenshot shows Associations page with connections to the route table." lightbox="./media/how-to-virtual-hub-routing/associations-settings.png":::

1. On the **Propagations** page, select the settings to propagate routes from connections to the route table.

    :::image type="content" source="./media/how-to-virtual-hub-routing/propagations-settings.png" alt-text="Screenshots shows propagations settings." lightbox="./media/how-to-virtual-hub-routing/propagations-settings.png":::

1. Select **Create** to create the route table.

## Edit a route table

1. Go to the virtual hub and select the **Route Tables** from the left pane. On the **Route Tables** page, click the name of the route table you want to edit.
1. On the **Edit route table** page, edit the values that you want to change. For example, you can add or remove routes, or edit a route that's contained in the route table. If you want to edit a specific route contained in the route table, click the name of the route to open the **Edit route table** page for that route.
1. After making your changes, click **Review + create** or **Create** (depending on the page that you are on) to save your settings.

## Remove a route from a route table

1. Go to the virtual hub and select the **Route Tables** from the left pane. On the **Route Tables** page, click the name of the route table you want to edit.
1. On the **Edit route table** page, use the scroll bar to navigate to the right. You'll see 3 dots. Click the 3 dots to reveal the **Remove** button.
1. Click **Remove**, then select **Review + Create** at the bottom of the page. As long as no errors occur, the route is removed.

## Delete a route table

In the Azure portal, go to your **Virtual HUB -> Route Tables** page. Select the checkbox for route table that you want to delete. Click **"…"**, and then select **Delete**. You can't delete a Default or None route table. However, you can delete all custom route tables.

## View effective routes

1. In the Azure portal, go to your **Virtual HUB -> Effective Routes** page.
1. From the dropdowns, select the route table to view routes learned by the selected route table. Propagated routes from the connection to the route table are automatically populated in **Effective Routes** of the route table. For more information, see [About effective routes](effective-routes-virtual-hub.md).
1. To download this information to a csv file, click **Download** at the top of the page.

   :::image type="content" source="./media/how-to-virtual-hub-routing/effective-routes.png" alt-text="Screenshot of Effective Routes page." lightbox="./media/how-to-virtual-hub-routing/effective-routes.png":::

## <a name="routing-configuration"></a>Configure routing for a virtual network connection

[!INCLUDE [Connect](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## Next steps

* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
