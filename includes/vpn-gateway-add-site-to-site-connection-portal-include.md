---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/16/2024
 ms.author: cherylmc
---
1. Go to your virtual network. On your virtual network page, in the left pane, select **Connected devices**. Locate your VPN gateway and select it to open it.
1. On the page for the gateway, select **Connections**.
1. At the top of the **Connections** page, select **+ Add** to open the **Create connection** page.

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/add-connection.png" alt-text="Screenshot that shows the Basics page." lightbox="./media/vpn-gateway-add-site-to-site-connection-portal-include/add-connection.png":::
1. On the **Create connection** page, on the **Basics** tab, configure the values for your connection:
   * Under **Project details**, select the subscription and the resource group where your resources are located.
   * Under **Instance details**, configure the following settings:

     * **Connection type**: Select **Site-to-site (IPSec)**.
     * **Name**: Name your connection.
     * **Region**: Select the region for this connection.
1. Select the **Settings** tab and configure the following values:

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/settings-page.png" alt-text="Screenshot that shows the Settings page." lightbox="./media/vpn-gateway-add-site-to-site-connection-portal-include/settings-page.png":::

   * **Virtual network gateway**: Select the virtual network gateway from the dropdown list.
   * **Local network gateway**: Select the local network gateway from the dropdown list.
   * **Shared key**: The value here must match the value that you're using for your local on-premises VPN device. If this field doesn't appear on your portal page, or you want to later update this key, you can do so once the connection object is created. Go to the connection object you created (example name: VNet1toSite1) and update the key on the **Authentication** page.
   * **IKE Protocol**: Select **IKEv2**.
   * **Use Azure Private IP Address**: Don't select.
   * **Enable BGP**: Don't select.
   * **FastPath**: Don't select.
   * **IPsec/IKE policy:** Select **Default**.
   * **Use policy based traffic selector**: Select **Disable**.
   * **DPD timeout in seconds**: Select **45**.
   * **Connection Mode**: Select **Default**. This setting is used to specify which gateway can initiate the connection. For more information, see [VPN Gateway settings - Connection modes](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#connectionmode).
1. For **NAT Rules Associations**, leave both **Ingress** and **Egress** as **0 selected**.
1. Select **Review + create** to validate your connection settings.
1. Select **Create** to create the connection.
1. After the deployment is finished, you can view the connection on the **Connections** page of the virtual network gateway. The status changes from *Unknown* to *Connecting* and then to *Succeeded*.