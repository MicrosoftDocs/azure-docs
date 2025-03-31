---
title: 'How to configure Route-maps to summarize routes leaving your virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Route-maps to summarize routes leaveing your Virtual WAN hubs.
author: cfields475
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/04/2025
ms.author: cfields
ms.custom: references_region

---
# How to configure Route-maps to summarize routes leaving your virtual WAN

This article helps you use the Route-maps feature to summarize routes using the Azure portal. For more information about Virtual WAN Route-maps, see [About Route-maps](route-maps-about.md).

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

* You have virtual WAN (VWAN) with a connection (S2S, P2S, or ExpressRoute) already configured.

  * For steps to create a VWAN with a S2S connection, see [Tutorial - Create a S2S connection with Virtual WAN](virtual-wan-site-to-site-portal.md).
  * For steps to create a virtual WAN with a P2S User VPN connection, see [Tutorial - Create a User VPN P2S connection with Virtual WAN](virtual-wan-point-to-site-portal.md).
* Be sure to view [About Route-maps](route-maps-about.md#considerations-and-limitations) for considerations and limitations before proceeding with configuration steps.

## Design

In this situation we have two hubs. Hub 1 has 2 VNets and a VPN branch office. One of the VNets has an NVA peered with the hub.  Hub 2 also has 2 VNets and a VPN branch office. 

:::image type="content" source="./media/route-maps-how-to-summarize/Environment.png" alt-text="Screenshot shows how to the Enviroment." lightbox="./media/route-maps-how-to-summarize/Environment.png":::

Here is the addressing for this environment:  

| Resource |Address Space |
| --- |---| 
|Hub 1 |192.168.1.0/24 | 
|Hub 2 |192.168.2.0/24  |
|VNet 1 |10.1.0.0/24  |
|VNet 2 |10.2.0.0/24 |
|VNet 3 |10.3.0.0/24  |
|VNet 4 |10.4.0.0/24  |
|VPN Branch 1 |10.122.1.0/24, 10.122.2.0/24, 10.122.3.0/24, 10.100.0.0/16|
|VPN Branch 2 |10.200.0.0/16 |
|NVA 1 | 10.150.1.0/24, 10.150.2.0/24 , 10.150.3.0/24 , 10.150.4.0/24 |  

## Scenario : Summarize routes leaving your virtual WAN 

In this scenario, the goal is to summarize routes being advertised to the VPN branch 2 site. In this example we will be taking the routes 10.122.1.0/24, 10.122.2.0/24, 10.122.3.0/24 from VPN Brach 1 and summarizing them to 10.122.0.0/16 

:::image type="content" source="./media/route-maps-how-to-summarize/Sum1.png" alt-text="Screenshot shows Scenario." lightbox="./media/route-maps-how-to-summarize/Sum1.png":::

## Workflow

1. Use the Route-map dashboard in hub 2 to verify the correct routes are currently being advertised to VPN branch 2 site.

   :::image type="content" source="./media/route-maps-how-to-summarize/DB1.png" alt-text="Screenshot shows before routes." lightbox="./media/route-maps-how-to-summarize/DB1.png":::   

2. Create a Route-map to summrize the routes. If this is your frist time creating a Route-map, see [How to configure Route-maps](route-maps-how-to.md) for more information.

   The Route-map will have a match rule for contains 10.122.0.0/16. The action **Modify** will be selected. Route Modification will have a **Replace** for the **RoutePrefix** 10.122.0.0/16.  

   :::image type="content" source="./media/route-maps-how-to-summarize/RM.png" alt-text="Screenshot shows Route-map." lightbox="./media/route-maps-how-to-summarize/RM.png":::

3. Apply the Route-map on the VPN branch 2 site connection. The Route-map will be applied in the outbound direction.

   :::image type="content" source="./media/route-maps-how-to-summarize/Apply.png" alt-text="Screenshot shows applying Route-map." lightbox="./media/route-maps-how-to-summarize/Apply.png":::

4. Using the Route-map dashboard in Hub 2, Verify that route 10.122.0.0/16 is being summarized.  

   :::image type="content" source="./media/route-maps-how-to-summarize/DB_After.png" alt-text="Screenshot shows results of Route-Map." lightbox="./media/route-maps-how-to-summarize/DB_After.png":::

## Next steps

* Use the [Route-maps dashboard](route-maps-dashboard.md) to monitor routes, AS Path, and BGP communities.
* To learn more about Route-maps, see [About Route-maps](route-maps-about.md).
