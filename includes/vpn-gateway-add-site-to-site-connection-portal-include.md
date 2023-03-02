---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/14/2022
 ms.author: cherylmc
---
1. Go to your virtual network. On your VNet page, select **Connected devices** on the left. Locate your VPN gateway and click to open it.
1. On the page for the gateway, select **Connections**. At the top of the Connections page, select **+Add** to open the **Add connection** page.

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/connection.png" alt-text="Screenshot of Add Connection page." lightbox="./media/vpn-gateway-add-site-to-site-connection-portal-include/connection.png" :::
1. On the **Add connection** page, configure the values for your connection.

   * **Name:** Name your connection.
   * **Connection type:** Select **Site-to-site (IPSec)**.
   * **Virtual network gateway:** The value is fixed because you're connecting from this gateway.
   * **Local network gateway:** Select **Choose a local network gateway** and select the local network gateway that you want to use.
   * **Shared Key:** the value here must match the value that you're using for your local on-premises VPN device. The example uses 'abc123', but you can (and should) use something more complex. It's important that the value you specify here is the same value that you specify when configuring your VPN device.
   * Leave **Use Azure Private IP Address** unchecked.
   * Leave **Enable BGP** unchecked.
   * Select **IKEv2**.

1. Select **OK** to create your connection. You'll see *Creating Connection* flash on the screen.
1. You can view the connection in the **Connections** page of the virtual network gateway. The Status will go from *Unknown* to *Connecting*, and then to *Succeeded*.