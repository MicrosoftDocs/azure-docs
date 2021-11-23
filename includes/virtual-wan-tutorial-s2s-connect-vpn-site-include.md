---
ms.author: cherylmc
author: cherylmc
ms.date: 08/18/2021
ms.service: virtual-wan
ms.topic: include
---
1. Navigate to your **Virtual HUB -> VPN (Site to site)**.

1. You may need to click **Hub association: Connected to this hub** in order to clear the filters and view your sites.

1. Select the checkbox for the site that you want to connect, then click **Connect VPN sites**.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connect-site.png" alt-text="Screenshot shows Connect site.":::

1. On the **Connect sites** page, configure the required settings.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png" alt-text="Screenshot shows the Connected Sites pane for Virtual HUB ready for a Pre-shared key and associated settings.":::

   * **Pre-shared key (PSK)**: Enter the pre-shared key used by your VPN device. If you don't enter a key, Azure autogenerates one for you. You would then use that key when configuring your VPN device.
   * **Protocol and IPsec**: You can either leave the default settings for Protocol (IKEv2) and IPsec (Default), or you can configure custom settings. For more information, see [default/custom IPsec](../articles/virtual-wan/virtual-wan-ipsec.md).
   * **Propagate Default Route**: Only change this setting to **Enable** if you know you want to propagate the default route. Otherwise, leave it as **Disable**. You can always modify this setting later. 
   
     The **Enable** option allows the virtual hub to propagate a learned default route to this connection. This flag enables default route propagation to a connection only if the default route is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced tunneling enabled. The default route does not originate in the Virtual WAN hub. 
   * **Use policy based traffic selector**: Leave this setting as **Disable** unless you are configuring a connection to a device that uses this setting.

1. At the bottom of the page, click **Connect**.

1. Once you click **Connect**, the connectivity status shows **Updating**. After updating completes, the site will show the connection and connectivity status.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connectivity-status.png" alt-text="Screenshot shows a site to site connection and connectivity status." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/connectivity-status.png":::

   **Connection Provisioning status**: This is the status of the Azure resource for the connection that connects the VPN site to the Azure hub’s VPN gateway. Once this control plane operation is successful, Azure VPN gateway and the on-premises VPN device will proceed to establish connectivity.

   **Connectivity status**: This is the actual connectivity (data path) status between Azure’s VPN gateway in the hub and VPN site. After updating is completed, it can show any of the following states:

    * **Unknown**: This state is typically seen if the backend systems are working to transition to another status.
    * **Connecting**: The VPN gateway is trying to reach out to the actual on-premises VPN site.
    * **Connected**: Connectivity is established between VPN gateway and the on-premises VPN site.
   * **Not connected**: Connectivity is not established.
    * **Disconnected**: This status is seen if, for any reason (on-premises or in Azure), the connection was disconnected.
1. If you want to make changes to your site, select your site, then click the **...** context menu.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/edit.png" alt-text="Screenshot shows edit, delete and download." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/expand/edit.png":::

   From this page, you can do the following: 

   * Edit or delete the VPN Connection.
   * Delete the VPN connection to this hub.
   * Download a branch-specific configuration for details about the Azure site. If you want to download the configuration file that pertains to all connected sites in your hub, select **Download VPN Config** from the menu at the top of the page instead.
