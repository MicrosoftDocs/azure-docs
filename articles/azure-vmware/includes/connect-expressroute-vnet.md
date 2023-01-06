---
title: Connect ExpressRoute to the virtual network gateway
description: Steps to connect ExpressRoute to the virtual network gateway.
ms.topic: include
ms.service: azure-vmware
ms.date: 12/08/2020
author: suzizuber
ms.author: v-szuber
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-configure-networking.md -->


1. Request an ExpressRoute authorization key:

   [!INCLUDE [request-authorization-key](request-authorization-key.md)]

1. Navigate to the virtual network gateway you plan to use and select **Connections** > **+ Add**.

1. On the **Add connection** page, provide values for the fields, and select **OK**. 

   | Field | Value |
   | --- | --- |
   | **Name**  | Enter a name for the connection.  |
   | **Connection type**  | Select **ExpressRoute**.  |
   | **Redeem authorization**  | Ensure this box is selected.  |
   | **Virtual network gateway** | The virtual network gateway you intend to use.  |
   | **Authorization key**  | Paste the authorization key you copied earlier. |
   | **Peer circuit URI**  | Paste the ExpressRoute ID you copied earlier.  |

   :::image type="content" source="../media/tutorial-configure-networking/add-connection.png" alt-text="Screenshot showing the Add connection page to connect ExpressRoute to the virtual network gateway.":::

The connection between your ExpressRoute circuit and your Virtual Network is created.

:::image type="content" source="../media/expressroute-global-reach/virtual-network-gateway-connections.png" alt-text="Screenshot showing a successful virtual network gateway connection.":::
