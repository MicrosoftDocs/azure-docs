---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/10/2023
 ms.author: cherylmc
---
1. Go to your virtual network. On your VNet page, select **Connected devices** on the left. Locate your VPN gateway and click to open it.
1. On the page for the gateway, select **Connections**.
1. At the top of the Connections page, select **+Add** to open the **Create connection** page.

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/add-connection.png" alt-text="Graphic shows a screenshot of the Basics page." lightbox="./media/vpn-gateway-add-site-to-site-connection-portal-include/add-connection.png":::
1. On the Create connection **Basics** page, configure the values for your connection.
   * For **Project details**, select the subscription and the Resource group where your resources are located.
   * For **Instance details**, configure the following settings:

     * **Connection type:** Select **Site-to-site (IPSec)**.
     * **Name:** Name your connection.
     * **Region:** Select the region for this connection.
1. Select **Settings** to navigate to the settings page.

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/settings-page.png" alt-text="Graphic shows a screenshot of the Settings page." lightbox="./media/vpn-gateway-add-site-to-site-connection-portal-include/settings-page.png":::

   * **Virtual network gateway:** Select the virtual network gateway from the dropdown.
   * **Local network gateway:** Select the local network gateway from the dropdown.
   * **Shared Key:** the value here must match the value that you're using for your local on-premises VPN device.
   * Select **IKEv2**.
   * Leave **Use Azure Private IP Address** deselected.
   * Leave **Enable BGP** deselected.
   * Leave **FastPath** deselected.
   * **IPse/IKE policy:** Default.
   * **Use policy based traffic selector:** Disable.
   * **DPD timeout in seconds:** 45
   * **Connection Mode:** leave as Default. This setting is used to specify which gateway can initiate the connection. For more information, see [VPN Gateway settings - connection modes](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#connectionmode).
1. For **NAT Rules Associations**, leave both Ingress and Egress as **0 selected**.
1. Select **Review + create** to validate your connection settings.
1. Select **Create** to create the connection.
1. Once the deployment is complete, you can view the connection in the **Connections** page of the virtual network gateway. The Status goes from *Unknown* to *Connecting*, and then to *Succeeded*.