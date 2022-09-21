---
author: cherylmc
ms.author: cherylmc
ms.date: 08/22/2022
ms.service: virtual-wan
ms.topic: include

#This include is used in multiple articles. Before modifying, verify that any changes apply to all articles that use this include.
---
1. Go to your **Virtual WAN**.

1. In the left pane, under Connectivity, select **Virtual network connections**.

1. On the **Virtual network connections** page, click **+Add connection**.

   :::image type="content" source="./media/virtual-wan-connect-vnet-hub/add-connection.png" alt-text="Screenshot shows add connection.":::

1. On the **Add connection** page, configure the required settings. For more information about routing settings, see [About routing](../articles/virtual-wan/about-virtual-hub-routing.md).

   :::image type="content" source="./media/virtual-wan-connect-vnet-hub/connection.png" alt-text="Screenshot shows VNet connection page.":::

   * **Connection name**: Name your connection.
   * **Hubs**: Select the hub you want to associate with this connection.
   * **Subscription**: Verify the subscription.
   * **Resource group**: The resource group that contains the VNet.
   * **Virtual network**: Select the virtual network you want to connect to this hub. The virtual network you select can't have an already existing virtual network gateway.
   * **Propagate to none**: This is set to **No** by default. Changing the switch to **Yes** makes the configuration options for **Propagate to Route Tables** and **Propagate to labels** unavailable for configuration.
   * **Associate Route Table**: You can select the route table that you want to associate.
   * **Static routes**: You can use this setting to specify next hop.

1. Once you've completed the settings you want to configure, select **Create** to create the connection.