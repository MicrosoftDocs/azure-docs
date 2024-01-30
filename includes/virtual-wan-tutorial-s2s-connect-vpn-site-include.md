---
ms.author: cherylmc
author: cherylmc
ms.date: 04/12/2022
ms.service: virtual-wan
ms.topic: include
---
1. On your Virtual WAN page, go to **Hubs**.

1. On the **Hubs** page, click the hub that you created.

1. On the page for the hub that you created, under **Connectivity** on the left pane, click **VPN (Site to site)** to open the VPN Site to site page.

1. On the **VPN (Site to site)** page, you should see your site. If you don't, you may need to click the **Hub association:x** bubble to clear the filters and view your site.

1. Select the checkbox next to the name of the site (don't click the site name directly), then click **Connect VPN sites**.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connect-site.png" alt-text="Screenshot shows Connect site.":::

1. On the **Connect sites** page, configure the settings.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png" alt-text="Screenshot shows the Connected Sites pane for Virtual HUB ready for a Pre-shared key and associated settings.":::

   * **Pre-shared key (PSK)**: Enter the pre-shared key used by your VPN device. If you don't enter a key, Azure autogenerates one for you. You would then use that key when configuring your VPN device.
   * **Protocol and IPsec**: You can either leave the default settings for Protocol (IKEv2) and IPsec (Default), or you can configure custom settings. For more information, see [default/custom IPsec](../articles/virtual-wan/virtual-wan-ipsec.md).
   * **Propagate Default Route**: Only change this setting to **Enable** if you know you want to propagate the default route. Otherwise, leave it as **Disable**. You can always modify this setting later.
   
     The **Enable** option allows the virtual hub to propagate a learned default route to this connection. This flag enables default route propagation to a connection only if the default route is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced tunneling enabled. The default route doesn't originate in the Virtual WAN hub.
   * **Use policy based traffic selector**: Leave this setting as **Disable** unless you're configuring a connection to a device that uses this setting.
   * **Configure traffic selector**: Leave the default. You can always modify this setting later.
   * **Connection Mode**: Leave the default. This setting is used to decide which gateway can initiate the connection.

1. At the bottom of the page, select **Connect**.

1. Once you select **Connect**, the connectivity status shows **Updating**. After updating completes, the site shows the connection and connectivity status.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connectivity-status.png" alt-text="Screenshot shows a site to site connection and connectivity status." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/connectivity-status.png":::

   **Connection Provisioning status**: This is the status of the Azure resource for the connection that connects the VPN site to the Azure hub’s VPN gateway. Once this control plane operation is successful, Azure VPN gateway and the on-premises VPN device will proceed to establish connectivity.

   **Connectivity status**: This is the actual connectivity (data path) status between Azure’s VPN gateway in the hub and VPN site. After updating is completed, it can show any of the following states:

    * **Unknown**: This state is typically seen if the backend systems are working to transition to another status.
    * **Connecting**: The VPN gateway is trying to reach out to the actual on-premises VPN site.
    * **Connected**: Connectivity is established between VPN gateway and the on-premises VPN site.
    * **Not connected**: Connectivity is not established.
    * **Disconnected**: This status is seen if, for any reason (on-premises or in Azure), the connection was disconnected.
1. If you want to make changes to your site, select the checkbox next to the site name (don't click the site name directly), then click the **...** context menu.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/edit.png" alt-text="Screenshot shows edit, delete and download." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/expand/edit.png":::

   From this page, you can do the following:

   * Edit the VPN connection to this hub.
   * Delete the VPN connection to this hub.
   * Download the VPN configuration file specific to this site. If you instead want to download the configuration file for sites connected to this hub, select **Download VPN Config** from the menu at the top of the page.


1. You can then click on the VPN Site to see the connectivity status per each link connection.
   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/link-connectivity-status.png" alt-text="Screenshot shows link connections for a given VPN site." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/link-connectivity-status.png":::

