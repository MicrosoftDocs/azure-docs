---
title: 'View effective routes in a virtual hub: Azure Virtual WAN | Microsoft Docs'
description: Vie effective routes for a virtual hub in Azure Virtual WAN
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 10/18/2019
ms.author: cherylmc
---

# View effective routes in a virtual hub

You can view all the routes of your Virtual WAN hub. Navigate to the virtual hub, then select **Routing -> View Effective Routes**.

## Understanding routes

The following example can help you better understand how Virtual WAN routing appears.

Consider the following virtual WAN with three hubs. The first hub is in the East US region, second hub is in the West Europe region, and the third hub is in the West US region. In a virtual WAN, all hubs are interconnected. In this example, we will assume that the East US and West Europe hubs have connections from on-premise branches (spokes) and Azure virtual networks (spokes).

An Azure VNet spoke (10.4.0.0/16) with a Network Virtual Appliance (10.4.0.6) is further peered to a VNet (10.5.0.0/16). (You can use Hub Route Table – See Additional info later in this article). Let's also assume that the West Europe Branch 1 is connected to East US hub, as well as to the West Europe hub. An ExpressRoute circuit in East US connects Branch 2 to the East US hub.
 
![diagram](./media/effective-routes-virtual-hub/diagram.png)

When you select **View Effective Route**, it produces the following output for East US Hub. To put it in perspective, the first line implies that the East US hub has learned the route of 10.20.1.0/24 (Branch 1) due to the VPN **Next hop type** connection (Next hop VPN Gateway Instance0 IP 10.1.0.6, Instance1 IP 10.1.0.7). **Route Origin points** to the resource id. **AS Path** indicates Branch 1’s AS Path.

### Hub route table

| **Prefix** |  **Next hop type** | **Next hop** |  **Route Origin** |**AS Path** |
| ---        | ---                | ---          | ---               | ---         |
| 10.20.1.0/24|VPN |10.1.0.6, 10.1.0.7| /subscriptions/`<sub>`/resourceGroups/`<rg>`/providers/Microsoft.Network/vpnGateways/343a19aa6ac74e4d81f05ccccf1536cf-eastus-gw| 20000|
|10.21.1.0/24 |ExpressRoute|10.1.0.10, 10.1.0.11|/subscriptions/`<sub>`/resourceGroups/<rg>/providers/Microsoft.Network/expressRouteGateways/4444a6ac74e4d85555-eastus-gw|21000|
|10.23.1.0/24| VPN |10.1.0.6, 10.1.0.7|/subscriptions/`<sub>`/resourceGroups/`<rg>`/providers/Microsoft.Network/vpnGateways/343a19aa6ac74e4d81f05ccccf1536cf-eastus-gw|23000|
|10.4.0.0/16|Virtual Network Connection| On-link |  |  |
|10.5.0.0/16| IP Address| 10.4.0.6|/subscriptions/`<sub>`/resourceGroups/`<rg>`/providers/Microsoft.Network/virtualHubs/easthub_1/routeTables/table_1| |
|0.0.0.0/0| IP Address|	`<Azure Firewall IP>` |/subscriptions/`<sub>`/resourceGroups/`<rg>`/providers/Microsoft.Network/virtualHubs/easthub_1/routeTables/table_1| |
|10.22.1.0/16| Remote Hub|10.8.0.6, 10.8.0.7|/subscriptions/`<sub>`/resourceGroups/<rg>/providers/Microsoft.Network/virtualHubs/westhub_| 4848-22000 |
|10.9.0.0/16| Remote Hub|  On-link |/subscriptions/`<sub>`/resourceGroups/`<rg>`/providers/Microsoft.Network/virtualHubs/westhub_1| |

 Note: If East US and West Europe hub were not communicating with each other in the above topology, the route learnt about 10.9.0.0/16 would not exist as hubs only advertise networks that are directly connected to them.

 ### Additional information

 #### Hub route table
 
 You can create a virtual hub route and apply the route to the Virtual hub route table (Add the pointer to the doc where we show how to set this up send traffic via NVA). You can apply multiple routes to the virtual hub route table. This ability allows you to set a route for destination VNET via an IP address (typically the Network Virtual Appliance in a spoke VNET)

 #### Default Route (0.0.0.0/0)
 
A Virtual Hub has the ability to propagate a learnt default route to a Virtual Network/Site-to-Site VPN/ExpressRoute connection if the flag is ‘Enabled’ on the connection. This flag is visible when the user edits either a Virtual Network Connection or a VPN connection or ExpressRoute connection. By default it is disabled when a site or an ExpressRoute circuit is connected to a hub. It is enabled by default when a Virtual Network Connection is added to connect a VNET to a Virtual Hub.
The default route does not originate in the Virtual WAN hub; the default route is propagated if it is already learned by the Virtual WAN hub as a result of deploying a firewall in the hub or if another connected site has forced tunneling enabled.

**For Virtual Network Connection:** Default at creation is 'Enable'.





[!INCLUDE [Virtual WAN FAQ](../../includes/virtual-wan-faq-include.md)]
