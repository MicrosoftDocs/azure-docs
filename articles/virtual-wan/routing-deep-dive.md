---
title: 'Virtual WAN Routing Deep Dive'
titleSuffix: Azure Virtual WAN
description: Learn about how Virtual WAN routing works in detail.
services: virtual-wan
author: erjosito
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: jomore
---

# Virtual WAN Routing Deep Dive

Azure Virtual WAN is a networking solution that encompasses routing across Azure regions between Azure VNets either statically or dynamically, hybrid connectivity to on-premises locations via Point-to-Site VPN, Site-to-Site VPN, ExpressRoute and integrated SDWAN appliances and network security. As such, it offers a rich set of routing functionality that is useful to understand especially in complex topologies.

This document will explore a relatively complex Virtual WAN scenario that will demonstrate some of the routing challenges that organizations might encounter when interconnecting their VNets and branches, and how to fix them.

## Scenario 1: topology with default routing preference

The first scenario in this article will analyze a topology with two Virtual WAN hubs, one ExpressRoute circuit connected to each hub, one branch connected over VPN to hub 1, and a second branch connected via SDWAN to an NVA deployed inside of hub 2. In each hub there are VNets connected directly (VNets 11 and 21) and through an NVA (VNets 121, 122, 221 and 222). VNet 12 exchanges routing information with hub 1 via BGP, and VNet 22 is configured with static routes. All VNet and branch connections are associated and propagating to the default route table.

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-1.png" alt-text="Virtual WAN design with two ExpressRoute circuits and two V P N branches" :::

Here are the effective routes in hub 1:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-1-hub1-no-route.png" alt-text="Effective routes in Virtual WAN hub 1" :::

The route 10.1.20.0/22 is injected by the NVA in VNet12 to cover both indirect spokes VNet121 (10.1.21.0/24) and VNet122 (10.1.22.0/24). VNets and branches in the remote hub are visible with a next hop of `hub2`, and it can be seen in the AS path that the Autonomous System Number `65520` has been prepended two times to these interhub routes.

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-1-hub2.png" alt-text="Effective routes in Virtual WAN hub 2" :::

Note that in hub 2 there is an integrated SDWAN Network Virtual Appliance. For more details on supported NVAs for this integration please visit [About NVAs in a Virtual WAN hub][vwan-nva]. Note that the route to the SDWAN branch `10.5.3.0/24` has a next hop of `VPN_S2S_Gateway`. This type of next hop can indicate today either routes coming from an Azure Virtual Network Gateway or from NVAs integrated in the hub.

In hub 2 the route for `10.2.20.0/22` to the indirect spokes VNet221 (10.2.21.0/24) and VNet222 (10.2.22.0/24) is installed as a static route, as indicated by the origin `defaultRouteTable`. If you check in the effective routes for hub 1, that route is not there. The reason is because static routes are not propagated via BGP, but need to be configured in every hub. Hence, a static route is required in hub 1 to provide connectivity between the VNets and branches in hub 1 to the indirect spokes in hub 2 (VNet221 and VNet222):

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-1-add-route.png" alt-text="Adding static route to Virtual WAN hub 1" :::

After adding the static route hub 1 will contain the `10.2.20.0/22` route as well:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-1-hub1-with-route.png" alt-text="Effective routes in Virtual hub 1" :::

## Scenario 2: Global Reach and Hub Routing Preference

Even if hub 1 knows the ExpressRoute prefix from circuit 2 (`10.2.5.0/24`) and hub 2 knows the ExpressRoute prefix from circuit 1 (`10.1.5.0/24`), ExpressRoute routes from remote regions will not be advertised back to on-premises ExpressRoute links. Consequently, so that both ExpressRoute locations can communicate to each other interconnecting them via Global Reach is required:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2.png" alt-text="Virtual WAN design with two ExpressRoute circuits with Global Reach and two V P N branches" :::

As explained in [Virtual hub routing preference (Preview)][vwan-hrp] per default Virtual WAN will favor routes coming from ExpressRoute. Since routes are advertised from hub 1 to the ExpressRoute circuit 1, from the ExpressRoute circuit 1 to the circuit 2, and from the ExpressRoute circuit 2 to hub 2 (and vice versa), virtual hubs will prefer this path over the more direct inter hub link now, as the effective routes in hub 1 show:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-er-hub1.png" alt-text="Effective routes in Virtual hub 1 with Global Reach and routing preference ExpressRoute" :::

Note that ExpressRoute Global Reach will prepend the ExpressRoute Autonomous System Number (12076) multiple times before sending routes back to Azure to make these route less preferable. However, Virtual WAN default hub routing precedence of ExpressRoute ignores the AS path length when taking routing decision.

The effective routes in hub 2 will be similar:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-er-hub2.png" alt-text="Effective routes in Virtual hub 2 with Global Reach and routing preference ExpressRoute" :::

The routing preference can be changed to VPN or AS-Path as explained in [Virtual hub routing preference (Preview)][vwan-hrp]. For example, you can set the preference to VPN as shown in this image:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-set-hrp-vpn.png" alt-text="Set hub routing preference in Virtual WAN to V P N" :::

With a hub routing preference of VPN this is how the effective routes in hub 1 look like:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-vpn-hub1.png" alt-text="Effective routes in Virtual hub 1 with Global Reach and routing preference V P N" :::

Note that the route to `10.4.2.0/24` has now a next hop of `VPN_S2S_Gateway`, while with the default routing preference of ExpressRoute it was `ExpressRouteGateway`. Similarly, in hub 2 the route to `10.5.2.0/24` will now appear with a next hop of `VPN_S2S_Gateway` as well:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-vpn-hub2.png" alt-text="Effective routes in Virtual hub 2 with Global Reach and routing preference V P N" :::

However, traffic between hubs is still preferring the routes coming via ExpressRoute. In order to use the more efficient direct connection between hub 1 and hub 2 the  route preference can be set to "AS Path" on both hubs:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-set-hrp-aspath.png" alt-text="Set hub routing preference in Virtual WAN to A S Path" :::

Now the routes for remote spokes and branches in hub 1 will have a next hop of `Remote Hub` as intended:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-aspath-hub1.png" alt-text="Effective routes in Virtual hub 1 with Global Reach and routing preference A S Path" :::

Note that the IP prefix for hub 2 (`192.168.2.0/23`) still appears reachable over the Global Reach link, but this shouldn't impact traffic as there shouldn't be any traffic specifically addressed to devices in hub 2. This might be an issue though if there were NVAs in both hubs establishing SDWAN tunnels between each other.

However, note that `10.4.2.0/24` is now preferred over the VPN Gateway. This can happen if the routes advertised via VPN have a shorter AS path than the routes advertised over ExpressRoute. After configuring the on-premises VPN devide to prepend its Autonomous System Number (`65501`) to the VPN routes to make the less preferable, hub 1 now selects ExpressRoute as next hop for `10.4.2.0/24`:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-aspath-hub1-prepend.png" alt-text="Effective routes in Virtual hub 1 with Global Reach and routing preference A S Path after prepending" :::

Hub 2 will show a similar table for the effective routes, where the VNets and branches in the other hub now appear with `Remote Hub` as next hop:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-2-aspath-hub2-prepend.png" alt-text="Effective routes in Virtual hub 2 with Global Reach and routing preference A S Path" :::

## Scenario 3: Cross-connecting the ExpressRoute circuits to both hubs

In order to add direct links between the Azure regions and the on-premises locations connected via ExpressRoute, it is often desirable connecting an single ExpressRoute circuit to multiple Virtual WAN hubs in a topology some times described as "bow tie", as the following topology shows:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-3.png" alt-text="Virtual WAN design with two ExpressRoute circuits in bow tie with Global Reach and two V P N branches" :::

Virtual WAN will display that both circuits are connected to both hubs:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-3-circuits.png" alt-text="Virtual WAN shows both ExpressRoute circuits connected to both virtual hubs" :::

Going back to the default hub routing preference of ExpressRoute, the routes to remote branches and VNets in hub 1 will show again ExpressRoute as next hop. Although this time the reason is not Global Reach, but the fact that the ExpressRoute circuits will bounce back the route advertisements they get from one hub to the other. For example, for hub 1 these are the effective routes with hub routing preference of ExpressRoute:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-3-er-hub1.png" alt-text="Effective routes in Virtual hub 1 in bow tie design with Global Reach and routing preference ExpressRoute" :::

Changing back the hub routing preference again to AS Path will return the inter hub routes to normal:

:::image type="content" source="./media/routing-deep-dive/vwan-routing-deepdive-scenario-3-aspath-hub1.png" alt-text="Effective routes in Virtual hub 1 in bow tie design with Global Reach and routing preference A S Path" :::


[vwan-hrp]: /azure/virtual-wan/about-virtual-hub-routing-preference
[vwan-nva]: /azure/virtual-wan/about-nva-hub


