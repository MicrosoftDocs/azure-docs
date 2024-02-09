---
author: cherylmc
ms.author: cherylmc
ms.date: 06/14/2023
ms.service: virtual-wan
ms.topic: include

#This include is used in multiple articles. Before modifying, verify that any changes apply to all articles that use this include.
---

1. In the Azure portal, go to your **Virtual WAN** In the left pane, select **Virtual network connections**.
1. On the **Virtual network connections** page, select **+ Add connection**.
1. On the **Add connection** page, configure the connection settings. For information about routing settings, see [About routing](../articles/virtual-wan/about-virtual-hub-routing.md).

   :::image type="content" source="./media/virtual-wan-connect-vnet-hub/connection.png" alt-text="Screenshot of the Add connection page." lightbox="./media/virtual-wan-connect-vnet-hub/connection.png":::

   * **Connection name**: Name your connection.
   * **Hubs**: Select the hub you want to associate with this connection.
   * **Subscription**: Verify the subscription.
   * **Resource group**: Select the resource group that contains the virtual network to which you want to connect.
   * **Virtual network**: Select the virtual network you want to connect to this hub. The virtual network you select can't have an already existing virtual network gateway.
   * **Propagate to none**: This is set to **No** by default. Changing the switch to **Yes** makes the configuration options for **Propagate to Route Tables** and **Propagate to labels** unavailable for configuration.
   * **Associate Route Table**: From the dropdown, you can select a route table that you want to associate.
   * **Propagate to labels**: Labels are a logical group of route tables. For this setting, select from the dropdown.
   * **Static routes**: Configure static routes, if necessary. Configure static routes for Network Virtual Appliances (if applicable). Virtual WAN supports a single next hop IP for static route in a virtual network connection. For example, if you have a separate virtual appliance for ingress and egress traffic flows, it would be best to have the virtual appliances in separate VNets and attach the VNets to the virtual hub.
   * **Bypass Next Hop IP for workloads within this VNet**: This setting lets you deploy NVAs and other workloads into the same VNet without forcing all the traffic through the NVA. This setting can only be configured when you're configuring a new connection. If you want to use this setting for a connection you've already created, delete the connection, then add a new connection.
   * **Propagate static route**: This setting is currently being rolled out. This setting lets you propagate static routes defined in the **Static routes** section to route tables specified in **Propagate to Route Tables**. Additionally, routes will be propagated to route tables that have labels specified as **Propagate to labels**. These routes can be propagated inter-hub, except for the default route 0/0.
1. Once you've completed the settings you want to configure, click **Create** to create the connection.