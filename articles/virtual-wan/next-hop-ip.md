---
title: 'Next hop IP support for Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about Next hop IP support for Virtual WAN
author: cfields475
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 04/21/2025
ms.author: cfields
ms.custom: references_region

---
# Next hop IP support for Virtual WAN

Azure Virtual WAN hub router, also called virtual hub router, acts as a route manager and provides simplification in routing operation within and across virtual hubs. The virtual hub router exposes the ability to [peer with the hub](scenario-bgp-peering-hub.md), thus exchanging routing information directly through Border Gateway Protocol (BGP) routing protocol. Network Virtual Appliances (NVA) or a BGP end point provisioned in a virtual network connected to a virtual hub can directly peer with the virtual hub router. Peering with the hub is supported if the NVA supports the BGP routing protocol. The ASN (Autonomous System Number) of the NVA must be different from the virtual hub ASN.

With the added support for Next hop IP in Virtual WAN, you can peer with NVAs or BGP endpoints that are deployed behind a load balancer. Deploying behind a load balancer can provide load balancing, improved connectivity, and performance.

## Benefits and considerations

Key benefits

   * NVAs and BGP endpoints can now advertise routes with the next hop as a load balancer or any other devices that aren't the NVA itself.

Considerations

   * NVAs or BGP endpoints can't advertise next hop IPs that are in a different region.
   * All the Considerations with [BGP peering with the hub](scenario-bgp-peering-hub.md) still apply. 

## Scenario: Setting the Next Hop IP to a load balancer

In this scenario, the virtual hub named "Hub 1" is connected to a virtual network (VNet-1). The goal is to have the NVA (NVA-1) set the next hop for the route **10.222.222.0/24** to the load balancer (**192.168.1.40**). 

:::image type="content" source="./media/next-hop-ip/scenario.png" alt-text="Screenshot that shows the environment." lightbox="./media/next-hop-ip/scenario.png":::

## Workflow

1. Configure BGP peering with the hub

   Instructions on how to configure BGP peering with the hub, can be found [here](scenario-bgp-peering-hub.md). 

2. Verify the current next hop is in the effective route table

   Verify what routes are currently being advertised and what the next hop IPs are for those routes.

   :::image type="content" source="./media/next-hop-ip/effective-routes-before.png" alt-text="Screenshot that shows the route before changing the next hop IP." lightbox="./media/next-hop-ip/effective-routes-before.png":::

   The next hop for route **10.222.222.0/24** is the NVA.

3. Change the next hop in the NVA and verify in the next hop

   Use the NVA to change the next hop IP for the route **10.222.222.0/24** to the load balancer **192.168.1.40**.

   Check the effective routes to verify the next hop IP for the route **10.222.222.0/24** has changed to the load balancer (**192.168.1.40**). 

   :::image type="content" source="./media/next-hop-ip/effective-routes-after.png" alt-text="Screenshot showing the routes after changing the next hop IP." lightbox="./media/next-hop-ip/effective-routes-after.png":::

## Troubleshooting

1. Verify BGP peering with the hub is set up correctly and working before attempting to set a custom next hop.  Instructions on setting up BGP peering with the hub can be found [here](scenario-bgp-peering-hub.md).

2. Verify the BGP peering status is up. In the "BGP peer" section, select on "BGP Status". 
   
   :::image type="content" source="./media/next-hop-ip/bgp-peers.png" alt-text="Screenshot showing the confonfigured BGP peers." lightbox="./media/next-hop-ip/bgp-peers.png":::
   
   Verify the BGP peer is up. 

   :::image type="content" source="./media/next-hop-ip/bgp-peers-up.png" alt-text="Screenshot showing the bgp peers are up." lightbox="./media/next-hop-ip/bgp-peers-up.png"::: 

3. Check the current limitations for BGP peering with the hub.

4. Verify the new next hop IP is the correct address. Check to see if the next hop is set in a different region. NVAs or BGP endpoints can't advertise next hop IPs that are in a different region. 

## Next steps

* To learn more about BGP peering with the hub, see [BGP peering with the hub](scenario-bgp-peering-hub.md).