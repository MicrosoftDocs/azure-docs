---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/22/2020
 ms.author: cherylmc
 ms.custom: include file
---
1. Open the page for your virtual network gateway. You can navigate to the gateway by going to **Name of your VNet -> Overview -> Connected devices -> Name of your gateway**, although there are multiple other ways to navigate as well.
1. On the page for the gateway, select **Connections**. At the top of the Connections page, select **+Add** to open the **Add connection** page.

   :::image type="content" source="./media/vpn-gateway-add-site-to-site-connection-portal-include/connection.png" alt-text="Site-to-Site connection":::
1. On the **Add connection** page, configure the values for your connection.

   * **Name:** Name your connection.
   * **Connection type:** Select **Site-to-site (IPSec)**.
   * **Virtual network gateway:** The value is fixed because you are connecting from this gateway.
   * **Local network gateway:** Select **Choose a local network gateway** and select the local network gateway that you want to use.
   * **Shared Key:** the value here must match the value that you are using for your local on-premises VPN device. The example uses 'abc123', but you can (and should) use something more complex. The important thing is that the value you specify here must be the same value that you specify when configuring your VPN device.
   * Leave **Use Azure Private IP Address** unchecked.
   * Leave **Enable BGP** unchecked.
   * Select **IKEv2**.
   * The remaining values for **Subscription**, **Resource Group**, and **Location** are fixed.

1. Select **OK** to create your connection. You'll see *Creating Connection* flash on the screen.
1. You can view the connection in the **Connections** page of the virtual network gateway. The Status will go from *Unknown* to *Connecting*, and then to *Succeeded*.
