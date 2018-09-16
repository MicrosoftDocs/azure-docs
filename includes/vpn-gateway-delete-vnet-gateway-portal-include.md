---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
### Step 1: Navigate to the virtual network gateway

1. In the [Azure portal](https://portal.azure.com), navigate to **All resources**. 
2. To open the virtual network gateway page, navigate to the virtual network gateway that you want to delete and click it.

### Step 2: Delete connections

1. On the page for your virtual network gateway, click **Connections** to view all connections to the gateway.
2. Click the **'...'** on the row of the name of the connection, then select **Delete** from the dropdown.
3. Click **Yes** to confirm that you want to delete the connection. If you have multiple connections, delete each connection.

### Step 3: Delete the virtual network gateway

Be aware that if you have a P2S configuration to this VNet in addition to your S2S configuration, deleting the virtual network gateway will automatically disconnect all P2S clients without warning.

1. On the virtual network gateway page, click **Overview**.
2. On the **Overview** page, click **Delete** to delete the gateway.
