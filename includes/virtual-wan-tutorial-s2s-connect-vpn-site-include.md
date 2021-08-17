---
ms.author: cherylmc
author: cherylmc
ms.date: 08/17/2021
ms.service: virtual-wan
ms.topic: include
---

1. Select **Connect VPN Sites** to open the **Connect sites** page.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/connect.png" alt-text="Screenshot shows the Connected Sites pane for Virtual HUB ready for a Pre-shared key and associated settings." border="false":::

   Complete the following fields:

   * **Pre-shared key (PSK)**: Enter a pre-shared key. If you don't enter a key, Azure autogenerates one for you.
   * **Protocol and IPsec**: You can either leave the default settings for Protocol (IKEv2) and IPsec (Default), or you can configure custom settings. For more information, see [default/custom IPsec](../articles/virtual-wan/virtual-wan-ipsec.md).
   * **Propagate Default Route**: Only change this setting to **Enable** if you know you want to propagate the default route. Otherwise, leave it as **Disable**. You can always modify this setting later. 
   
     The **Enable** option allows the virtual hub to propagate a learned default route to this connection. This flag enables default route propagation to a connection only if the default route is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced tunneling enabled. The default route does not originate in the Virtual WAN hub. 

1. Select **Connect**.
1. After a few minutes, the site will show the connection and connectivity status.

   :::image type="content" source="./media/virtual-wan-tutorial-connect-vpn-site-include/status.png" alt-text="Screenshot shows a site to site connection and connectivity status." lightbox="./media/virtual-wan-tutorial-connect-vpn-site-include/status.png"border="false":::

   **Connection Status**: This is the status of the Azure resource for the connection that connects the VPN site to the Azure hub’s VPN gateway. Once this control plane operation is successful, Azure VPN gateway and the on-premises VPN device will proceed to establish connectivity.

   **Connectivity Status**: This is the actual connectivity (data path) status between Azure’s VPN gateway in the hub and VPN site. It can show any of the following states:

    * **Unknown**: This state is typically seen if the backend systems are working to transition to another status.
    * **Connecting**: Azure VPN gateway is trying to reach out to the actual on-premises VPN site.
    * **Connected**: Connectivity is established between Azure VPN gateway and on-premises VPN site.
    * **Disconnected**: This status is seen if, for any reason (on-premises or in Azure), the connection was disconnected.
1. Within a hub VPN site, you can additionally do the following: 

   * Edit or delete the VPN Connection.
   * Delete the site in the Azure portal.
   * Download a branch-specific configuration for details about the Azure side using the context (…) menu next to the site. If you want to download the configuration for all connected sites in your hub, select **Download VPN Config** on the top menu.
