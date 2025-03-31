---
title: 'How to configure Route-maps to drop inbound routes from branch sites'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Route-maps to drop inbound routes from branch sites.
author: cfields475
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/04/2025
ms.author: cfields
ms.custom: references_region

---
# How to configure Route-maps to drop routes from branch sites

This article helps you use the Route-maps feature to drop routes from branch sites using the Azure portal. For more information about Virtual WAN Route-maps, see [About Route-maps](route-maps-about.md).

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

## Scenario : Drop inbound routes from Branch sites

In this scenario, the goal is to drop routes being advertised from VPN branch site 1.  In this example we will be taking the routes 10.122.1.0/24,10.122.2.0/24, 10.122.3.0/24 and dropping them.   

 :::image type="content" source="./media/route-maps-how-to-Drop/drop.png" alt-text="Screenshot that shows the Scenario." lightbox="./media/route-maps-how-to-Drop/drop.png":::

## Workflow

1.  Use the Route-Map dashboard in hub 1 to verify what routes are being advertised from the VPN branch. 

   :::image type="content" source="./media/route-maps-how-to-Drop/DB_Before.png" alt-text="Screenshot that shows routes before." lightbox="./media/route-maps-how-to-Drop/DB_Before.png":::  
   
   Verify the routes are showing up in the effective route table for hub 1.

   :::image type="content" source="./media/route-maps-how-to-Drop/ER_Before.png" alt-text="Screenshot that shows routes before." lightbox="./media/route-maps-how-to-Drop/ER_Before.png":::   

2. Create a Route-Map to drop the routes. If this is your frist time creating a Route-Map, see [How to configure Route-maps](route-maps-how-to.md) for more information. 

   The Route-Map will have a match rule for route 10.122.2.0/16. The action **Drop** will be selected. 

   :::image type="content" source="./media/route-maps-how-to-Drop/RM.png" alt-text="Screenshot that shows the Route-map." lightbox="./media/route-maps-how-to-Drop/RM.png":::

3. Apply the Route-Map on the VPN branch 1 site connection. The Route-Map will be applied in the inbound direction. 

   :::image type="content" source="./media/route-maps-how-to-Drop/Apply.png" alt-text="Screenshot that shows applying the Route-Map." lightbox="./media/route-maps-how-to-Drop/Apply.png":::

4. Using the Route-Map dashboard in Hub 1, Verify that routes 10.122.1.0/24,10.122.2.0/24, 10.122.3.0/24 are being dropped.   

   :::image type="content" source="./media/route-maps-how-to-Drop/DB_After.png" alt-text="Screenshot that shows routes after applying Route-Map." lightbox="./media/route-maps-how-to-Drop/DB_After.png":::

   Verify the routes are no longer in the effective route table.

   :::image type="content" source="./media/route-maps-how-to-Drop/ER_After.png" alt-text="Screenshot that shows routes after applying Route-Map." lightbox="./media/route-maps-how-to-Drop/ER_After.png":::

## Next steps

* Use the [Route-maps dashboard](route-maps-dashboard.md) to monitor routes, AS Path, and BGP communities.
* To learn more about Route-maps, see [About Route-maps](route-maps-about.md).
