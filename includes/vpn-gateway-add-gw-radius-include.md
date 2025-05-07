---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 11/14/2024
 ms.author: cherylmc
---

1. In the Azure portal, open your virtual network gateway (VPN gateway).
1. On the **Overview** page, verify that the Gateway type is set to **VPN** and that the VPN type is **route-based**.
1. In the left pane, expand **Settings** and select **Point to site configuration** > **Configure now**.
1. View the **Point-to-site configuration** page.

   :::image type="content" source="./media/vpn-gateway-add-gw-radius/point-to-site-settings.png" alt-text="Screenshot that shows point-to-site configuration page." lightbox="./media/vpn-gateway-add-gw-radius/point-to-site-settings.png":::
1. On the **Point-to-site configuration** page, configure the following settings:

    * **Address pool**: This value specifies the client address pool from which the VPN clients receive an IP address when they connect to the VPN gateway. The address pool must be a private IP address range that doesn't overlap with the virtual network address range. For example, **172.16.201.0/24**.
    * **Tunnel type**: Select the tunnel type. For example, select **IKEv2 and OpenVPN (SSL)**.
    * **Authentication type**: Select **RADIUS authentication**.
    * If you have an active-active VPN gateway, a third public IP address is required. You can create a new public IP address using the example value **VNet1GWpip3**.
    * **Primary Server IP address**: Type the IP address of the Network Policy Server (NPS).
    * **Primary Server secret**: Type the shared secret that you specified when you created the RADIUS client on the NPS.
1. At the top of the page, **Save** the configuration settings.
