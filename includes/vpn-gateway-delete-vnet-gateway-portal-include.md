---

author: cherylmc
ms.author: cherylmc
ms.date: 08/22/2023
ms.service: vpn-gateway
ms.topic: include
---
### Step 1: Go to the virtual network gateway

1. In the [Azure portal](https://portal.azure.com), go to **All resources**.
2. To open the virtual network gateway page, go to the virtual network gateway and click to select it.

### Step 2: Delete connections

1. On the page for your virtual network gateway, click **Connections** to view all connections to the gateway.
2. Click the **'...'** on the row of the name of the connection, then select **Delete** from the dropdown.
3. Click **Yes** to confirm that you want to delete the connection. If you have multiple connections, delete each connection.

### Step 3: Delete the virtual network gateway

If you have a P2S configuration to this VNet in addition to your S2S configuration, deleting the virtual network gateway will automatically disconnect all P2S clients without warning.

1. On the virtual network gateway page, click **Overview**.
2. On the **Overview** page, click **Delete** to delete the gateway.
