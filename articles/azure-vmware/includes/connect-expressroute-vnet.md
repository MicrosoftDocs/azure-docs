---
title: Connect ExpressRoute to the virtual network gateway
description: Steps to connect ExpressRoute to the virtual network gateway.
ms.topic: include
ms.date: 12/08/2020
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
   | **Virtual network gateway** | The virtual network gateway your intent to use.  |
   | **Authorization key**  | Paste the authorization key you copied earlier. |
   | **Peer circuit URI**  | Paste the ExpressRoute ID you copied earlier.  |

   :::image type="content" source="../media/expressroute-global-reach/expressroute-add-connection.png" alt-text="Screenshot of the Add connection page to connect ExpressRoute to the virtual network gateway.":::

The connection between your ExpressRoute circuit and your Virtual Network is created.

:::image type="content" source="../media/expressroute-global-reach/virtual-network-gateway-connections.png" alt-text="Screenshot of the virtual network gateway connections.":::