---
title: 'How to configure virtual hub routing'
titleSuffix: Azure Virtual WAN
description: This article describes how to configure virtual hub routing
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 06/29/2020
ms.author: cherylmc

---
# How to configure virtual hub routing

A virtual hub can contain multiple gateways such as a Site-to-site VPN gateway, ExpressRoute gateway, Point-to-site gateway, and Azure Firewall. The routing capabilities in the virtual hub are provided by a router that manages all routing, including transit routing, between the gateways using Border Gateway Protocol (BGP). This router also provides transit connectivity between virtual networks that connect to a virtual hub and can support up to an aggregate throughput of 50 Gbps. These routing capabilities apply to Standard Virtual WAN customers.

For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="create-table"></a>Create a route table

1. In the Azure portal, navigate to the virtual hub.
2. Under **Connectivity**, select **Routing**. On the Routing page, you see the **Default** and **None** route tables.

   :::image type="content" source="./media/how-to-virtual-hub-routing/routing.png" alt-text="Routing page":::
3. Select **+Create route table** to open the **Create Route Table** page.
4. On the Create Route Table page **Basics** tab, complete the following fields.

   :::image type="content" source="./media/how-to-virtual-hub-routing/basics.png" alt-text="Basics tab":::

   * **Name**
   * **Routes**
   * **Route name**
   * **Destination type**
   * **Destination prefix**: You can aggregate prefixes. For example: VNet 1: 10.1.0.0/24 and VNet 2: 10.1.1.0/24 can be aggregated as 10.1.0.0/16. **Branch** routes apply to all connected VPN sites, ExpressRoute circuits, and User VPN connections.
   * **Next hop**: A list of virtual network connections, or Azure Firewall.

     If you select a virtual network connection, you will see **Configure static routes**. This is an optional configuration setting. For more information, see [Configuring static routes](about-virtual-hub-routing.md#static).

      :::image type="content" source="./media/how-to-virtual-hub-routing/next-hop.png" alt-text="Next hop":::

5. Select the **Labels** tab to configure label names. Labels provide a mechanism to logically group route tables.

    :::image type="content" source="./media/how-to-virtual-hub-routing/labels.png" alt-text="Configure label names":::

6. Select the **Associations** tab to associate connections to the route table.
You will see **Branches**, **Virtual Networks**, and the **Current settings** of the connections.

    :::image type="content" source="./media/how-to-virtual-hub-routing/associations.png" alt-text="Association connections to the route table":::

7. Select the **Propagations** tab to propagate routes from connections to the route table.

    :::image type="content" source="./media/how-to-virtual-hub-routing/propagations.png" alt-text="Propagate routes":::

8. Select **Create** to create the route table.

## <a name="edit-table"></a>To edit a route table

In the Azure portal, locate the route table of your virtual hub. Select the route table to edit any information.

## <a name="delete-table"></a>To delete a route table

In the Azure portal, locate the route table of your virtual hub. You cannot delete a Default or None route table. However, you can delete all custom route tables. Click **"…"**, and then select **Delete**.

## <a name="view-routes"></a>To view effective routes

In the Azure portal, locate the route table of your virtual hub. Click **"…"** and select **Effective Routes** to view routes learned by the selected route table. Propagated routes from the connection to the route table are automatically populated in **Effective Routes** of the route table. For more information, see [About effective routes](effective-routes-virtual-hub.md).

:::image type="content" source="./media/how-to-virtual-hub-routing/effective.png" alt-text="View Effective Routes" lightbox="./media/how-to-virtual-hub-routing/effective-expand.png":::

## <a name="routing-configuration"></a>To set up routing configuration for a virtual network connection

1. In the Azure portal, navigate to your virtual WAN and, under **Connectivity**, select **Virtual Network Connections**.
1. Select **+Add connection**.
1. Select the virtual network from the dropdown.
1. Set up the routing configuration to associate to a route table. For **Associate Route Table**, select the route table from the dropdown.
1. Set up the routing configuration to propagate to one or many route tables. For **Propagate to Route Table**, select from the dropdown.
1. For **Static routes**, configure static routes for Network Virtual Appliance (if applicable).

:::image type="content" source="./media/how-to-virtual-hub-routing/routing-configuration.png" alt-text="Set up routing configuration" lightbox="./media/how-to-virtual-hub-routing/routing-configuration-expand.png":::

## Next steps

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
