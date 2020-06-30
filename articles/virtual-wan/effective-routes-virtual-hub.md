---
title: 'View effective routes of a virtual hub: Azure Virtual WAN | Microsoft Docs'
description: How to view effective routes for a virtual hub in Azure Virtual WAN
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 06/29/2020
ms.author: cherylmc
---

# View virtual hub effective routes

You can view all of the routes of your Virtual WAN hub in the Azure portal. This article walks you through the steps to view effective routes. For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="routing"></a>Select connections or route tables

1. Navigate to your virtual hub, then select **Routing**. On the Routing page, select **Effective Routes**.
1. From the dropdown, you can select **Connection Type** or a **Route Table**. If you don't see a Route Table option, this means that you don't have a custom or default route table set up in this virtual hub.
1. From the dropdown for **Connections / Route Tables**, you can select from the following items:

   * Virtual Network Connection
   * VPN Site Connection
   * ExpressRoute Connection
   * Point-to-site Connection
   * Route table

   :::image type="content" source="./media/effective-routes-virtual-hub/routing.png" alt-text="Routing":::

## <a name="output"></a>View output

The page output shows the following fields:

* **Prefix**: Address prefix known to the current entity.
* **Next hop type**: Can be Virtual Network Connection, VPN_S2S_Gateway, ExpressRouteGateway, Remote Hub, or Azure Firewall.
* **Next hop**: This is the IP, or simply shows On-link to imply the current hub.
* **Origin**: Resource ID of the routing source.
* **AS Path**: BGP Attribute AS (autonomous system) path lists all the AS numbers that need to be traversed to reach the location where the prefix that the path is attached to, is advertised from.

### <a name="example"></a>Example

The values in the following example table imply that the virtual hub connection or route table has learned the route of 10.2.0.0/24 (a branch prefix). It has learned the route due to the **VPN Next hop type** VPN_S2S_Gateway with **Next hop** VPN Gateway resource ID. **Route Origin** points to the resource ID of the originating VPN gateway/Route table/Connection. **AS Path** indicates the AS Path for the branch.

Use the scroll bar at the bottom of the table to view the "AS Path".

| **Prefix** |  **Next hop type** | **Next hop** |  **Route Origin** |**AS Path** |
| ---        | ---                | ---          | ---               | ---         |
| 10.2.0.0/24| VPN_S2S_Gateway |10.1.0.6, 10.1.0.7|/subscriptions/`<sub id>`/resourceGroups/`<resource group name>`/providers/Microsoft.Network/vpnGateways/vpngw| 20000|

**Considerations:**

* If you see 0.0.0.0/0 in the **Get Effective Routes** output, it implies the route exists in one of the route tables. However, if this route was set up for internet, an additional flag **"enableInternetSecurity": true** is required on the connection. The effective route on the VM NIC will not show the route if the "enableInternetSecurity" flag on the connection is "false".

* The **Propagate Default Route** field is seen in Azure Virtual WAN portal when you edit a virtual network connection, a VPN connection, or an ExpressRoute connection. This field indicates the **enableInternetSecurity** flag, which is always by default "false" for ExpressRoute and VPN connections, but "true" for virtual network connections.

## Next steps

* For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
