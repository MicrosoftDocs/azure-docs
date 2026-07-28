---
title: 'How to configure Route-maps to summarize routes from an NVA in a spoke virtual network'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Route-maps to summarize routes from an NVA in a spoke virtual network.
author: cfields475
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/04/2025
ms.author: cfields
ms.custom: references_region

---
# How to configure Route-maps to summarize routes from an NVA in a spoke virtual network 

This article helps you use the Route-maps feature to summarize routes from an NVA in a spoke virtual network  using the Azure portal. For more information about Virtual WAN Route-maps, see [About Route-maps](route-maps-about.md).

## Prerequisites

Verify that you have met the following criteria before beginning your configuration:

* You have virtual WAN (VWAN) with a connection (S2S, P2S, or ExpressRoute) already configured.

  * For steps to create a VWAN with a S2S connection, see [Tutorial - Create a S2S connection with Virtual WAN](virtual-wan-site-to-site-portal.md).
  * For steps to create a virtual WAN with a P2S User VPN connection, see [Tutorial - Create a User VPN P2S connection with Virtual WAN](virtual-wan-point-to-site-portal.md).
* Be sure to view [About Route-maps](route-maps-about.md#considerations-and-limitations) for considerations and limitations before proceeding with configuration steps.

## Design
In this situation, we have two hubs. Hub 1 has 2 VNets and a VPN branch office. One of the VNets has an NVA (network virtual appliance) peered with the hub. Hub 2 also has 2 VNets and a VPN branch office. 

   :::image type="content" source="./media/route-maps-how-to-summarize/environment.png" alt-text="Screenshot that shows the environment." lightbox="./media/route-maps-how-to-summarize/environment.png":::

Here's the addressing for this environment:  

| Resource |Address Space |
| --- |---| 
|Hub 1 |192.168.1.0/24 | 
|Hub 2 |192.168.2.0/24  |
|Virtual network 1 |10.1.0.0/24  |
|Virtual network 2 |10.2.0.0/24 |
|Virtual network 3 |10.3.0.0/24  |
|Virtual network 4 |10.4.0.0/24  |
|VPN Branch 1 |10.122.1.0/24, 10.122.2.0/24, 10.122.3.0/24, 10.100.0.0/16|
|VPN Branch 2 |10.200.0.0/16 |
|NVA 1 | 10.150.1.0/24, 10.150.2.0/24, 10.150.3.0/24, 10.150.4.0/24 |  

## Scenario: Summarize routes from an NVA in a spoke virtual network  

In this scenario, the goal is to summarize some routes being advertised to the hub from the NVA in virtual network 1. In this example we'll be taking the routes 10.150.1.0/24, 10.150.2.0/24, 10.150.3.0/24, 10.150.4.0/24, and summarizing them to 10.150.0.0/16   

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/nva.png" alt-text="Screenshot that shows the Scenario." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/nva.png":::

## Workflow

1. Use the Route-Map dashboard in hub 1 to verify the correct routes are currently being advertised from virtual network 1 to the hub.

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-before-one.png" alt-text="Screenshot that shows the routes before Route-maps." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-before-one.png":::

   Use the Route-Map dashboard to verify the routes being sent to VPN branch 1.  

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-before-two.png" alt-text="Screenshot that shows the routes before Route-maps for VPN branch." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-before-two.png":::  

2. Create a Route-Map to tag the route. If this is your first time creating a Route-Map, see [How to configure Route-maps](route-maps-how-to.md) for more information. 

   The Route-Map will have a match rule for route 10.150.0.0/16. The action **modify** will be selected. Route Modification has an **Replace** for **RoutePrefix** 10.150.0.0/16.  

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/rm.png" alt-text="Screenshot that shows the Route-map." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/rm.png":::

3. Apply the Route-Map on the virtual network 1 connection. The Route-Map will be applied in the inbound direction. 

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/apply.png" alt-text="Screenshot that shows the Route-map being applied." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/apply.png":::

4. Using the Route-Map dashboard in Hub 1, Verify that route 10.150.0.0/16 is being summarized.    

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-after-one.png" alt-text="Screenshot that shows routes after Route-map being applied." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-after-one.png":::

   Using the Route-Map dashboard verify route 10.150.0.0/16 has been advertised to VPN branch 1

   :::image type="content" source="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-after-two.png" alt-text="Screenshot that shows routes after Route-map being applied for the VPN branch." lightbox="./media/route-maps-summarize-from-device-spoke-vnet-nva/db-after-two.png":::

## Next steps

* Use the [Route-maps dashboard](route-maps-dashboard.md) to monitor routes, AS Path, and BGP communities.
* To learn more about Route-maps, see [About Route-maps](route-maps-about.md).
