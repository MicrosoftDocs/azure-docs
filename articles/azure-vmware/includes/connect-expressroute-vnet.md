---
title: Connect ExpressRoute to a virtual network gateway
description: Steps to connect ExpressRoute to a virtual network gateway.
ms.topic: include
ms.service: azure-vmware
ms.date: 1/03/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-configure-networking.md -->

1. Request an ExpressRoute authorization key:

   [!INCLUDE [request-authorization-key](request-authorization-key.md)]

1. Go to the virtual network gateway that you plan to use, and then select **Connections** > **+ Add**.

1. On the **Add connection** pane, provide the following values, and then select **OK**.

   | Field | Value |
   | --- | --- |
   | **Name**  | Enter a name for the connection.  |
   | **Connection type**  | Select **ExpressRoute**.  |
   | **Redeem authorization**  | Ensure that this checkbox is selected.  |
   | **Virtual network gateway** | The value is prepopulated with the virtual network gateway that you intend to use.  |
   | **Authorization key**  | Paste the authorization key that you copied earlier. |
   | **Peer circuit URI**  | Paste the ExpressRoute ID that you copied earlier.  |

   :::image type="content" source="../media/tutorial-configure-networking/add-connection.png" alt-text="Screenshot that shows the pane for adding an ExpressRoute connection to a virtual network gateway.":::

A status of **Succeeded** indicates that you finished creating the connection between your ExpressRoute circuit and your virtual network.

:::image type="content" source="../media/expressroute-global-reach/virtual-network-gateway-connections.png" alt-text="Screenshot that shows a successful virtual network gateway connection.":::
