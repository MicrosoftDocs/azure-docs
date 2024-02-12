---
title: 'Virtual WAN routing deep dive'
titleSuffix: Azure Virtual WAN
description: Learn about how Virtual WAN routing works in detail.
services: virtual-wan
author: erjosito
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/24/2023
ms.author: jomore
---

# Virtual WAN routing deep dive

[Azure Virtual WAN][virtual-wan-overview] is a networking solution that allows creating sophisticated networking topologies easily: it encompasses routing across Azure regions between Azure VNets and on-premises locations via Point-to-Site VPN, Site-to-Site VPN, [ExpressRoute][er] and [integrated SDWAN appliances][virtual-wan-nva], including the option to [secure the traffic][virtual-wan-secured-hub]. In most scenarios, it isn't required that you have deep knowledge of how Virtual WAN internal routing works, but in certain situations it can be useful to understand Virtual WAN routing concepts.

This document explores sample Virtual WAN scenarios that explain some of the behaviors that organizations might encounter when interconnecting their VNets and branches in complex networks. The scenarios shown in this article are by no means design recommendations, they're just sample topologies designed to demonstrate certain Virtual WAN functionalities.

## Scenario 1: topology with default routing preference

The first scenario in this article analyzes a topology with two Virtual WAN hubs, ExpressRoute, VPN and SDWAN connectivity. In each hub, there are VNets connected directly (VNets 11 and 21) and indirectly through an NVA (VNets 121, 122, 221 and 222). VNet 12 exchanges routing information with hub 1 via BGP (see [BGP peering with a virtual hub][virtual-wan-bgp]), and VNet 22 has static routes configured, so that differences between both options can be shown.

In each hub, the VPN and SDWAN appliances serve a dual purpose: on one side they advertise their own individual prefixes (`10.4.1.0/24` over VPN in hub 1 and `10.5.3.0/24` over SDWAN in hub 2), and on the other they advertise the same prefixes as the ExpressRoute circuits in the same region (`10.4.2.0/24` in hub 1 and `10.5.2.0/24` in hub 2). This difference will be used to demonstrate how the [Virtual WAN hub routing preference][virtual-wan-hrp] works.

All VNet and branch connections are associated and propagating to the default route table. Although the hubs are secured (there is an Azure Firewall deployed in every hub), they aren't configured to secure private or Internet traffic. Doing so would result in all connections propagating to the `None` route table, which would remove all non-static routes from the `Default` route table and defeat the purpose of this article since the effective route blade in the portal would be almost empty (except for the static routes to send traffic to the Azure Firewall).

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1.png" alt-text="Diagram that shows a Virtual WAN design with two ExpressRoute circuits and two V P N branches." :::

> [!IMPORTANT]
> The previous diagram shows two secured virtual hubs, this topology is supported with Routing Intent. For more information see [How to configure Virtual WAN Hub routing intent and routing policies][virtual-wan-intent].

Out of the box, the Virtual WAN hubs exchange information between each other so that communication across regions is enabled. You can inspect the effective routes in Virtual WAN route tables: for example, the following picture shows  the effective routes in hub 1:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-1-no-route.png" alt-text="Screenshot of effective routes in Virtual WAN hub 1." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-1-no-route-expanded.png":::

These effective routes will be then advertised by Virtual WAN to branches, and will inject them into the VNets connected to the virtual hubs, making the use of User Defined Routes unnecessary. When inspecting the effective routes in a virtual hub the "Next Hop Type" and "Origin" fields will indicate where the routes are coming from. For example, a Next Hop Type of "Virtual Network Connection" indicates that the prefix is defined in a VNet directly connected to Virtual WAN (VNets 11 and 12 in the previous screenshot)

The NVA in VNet 12 injects the route 10.1.20.0/22 over BGP, as the Next Hop Type "HubBgpConnection" implies (see [BGP Peering with a Virtual Hub][virtual-wan-bgp]). This summary route covers both indirect spokes VNet 121 (10.1.21.0/24) and VNet 122 (10.1.22.0/24). VNets and branches in the remote hub are visible with a next hop of `hub2`, and it can be seen in the AS path that the Autonomous System Number `65520` has been prepended two times to these interhub routes.

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-2.png" alt-text="Screenshot of effective routes in Virtual WAN hub 2." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-2-expanded.png":::

In hub 2 there is an integrated SDWAN Network Virtual Appliance. For more details on supported NVAs for this integration please visit [About NVAs in a Virtual WAN hub][virtual-wan-nva]. Note that the route to the SDWAN branch `10.5.3.0/24` has a next hop of `VPN_S2S_Gateway`. This type of next hop can indicate today either routes coming from an Azure Virtual Network Gateway or from NVAs integrated in the hub.

In hub 2, the route for `10.2.20.0/22` to the indirect spokes VNet 221 (10.2.21.0/24) and VNet 222 (10.2.22.0/24) is installed as a static route, as indicated by the origin `defaultRouteTable`. If you check in the effective routes for hub 1, that route isn't there. The reason is because static routes aren't propagated via BGP, but need to be configured in every hub. Hence, a static route is required in hub 1 to provide connectivity between the VNets and branches in hub 1 to the indirect spokes in hub 2 (VNets 221 and 222):

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-add-route.png" alt-text="Screenshot that shows how to add a static route to a Virtual WAN hub." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-add-route-expanded.png":::

After adding the static route, hub 1 will contain the `10.2.20.0/22` route as well:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-1-with-route.png" alt-text="Screenshot of effective routes in Virtual hub 1." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-1-hub-1-with-route-expanded.png":::

## Scenario 2: Global Reach and hub routing preference

Even if hub 1 knows the ExpressRoute prefix from circuit 2 (`10.5.2.0/24`) and hub 2 knows the ExpressRoute prefix from circuit 1 (`10.4.2.0/24`), ExpressRoute routes from remote regions aren't advertised back to on-premises ExpressRoute links. Consequently, [ExpressRoute Global Reach][er-gr] is required for the ExpressRoute locations to communicate to each other:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2.png" alt-text="Diagram showing a Virtual WAN design with two ExpressRoute circuits with Global Reach and two V P N branches.":::

> [!IMPORTANT]
> The previous diagram shows two secured virtual hubs, this topology is supported with Routing Intent. For more information see [How to configure Virtual WAN Hub routing intent and routing policies][virtual-wan-intent].

As explained in [Virtual hub routing preference (Preview)][virtual-wan-hrp], Virtual WAN favors routes coming from ExpressRoute per default. Since routes are advertised from hub 1 to the ExpressRoute circuit 1, from the ExpressRoute circuit 1 to the circuit 2, and from the ExpressRoute circuit 2 to hub 2 (and vice versa), virtual hubs prefer this path over the more direct inter hub link now. The effective routes in hub 1 show this:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-er-hub-1.png" alt-text="Screenshot of effective routes in Virtual hub 1 with Global Reach and routing preference ExpressRoute." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-er-hub-1-expanded.png":::

As you can see in the routes, ExpressRoute Global Reach prepends the ExpressRoute Autonomous System Number (12076) multiple times before sending routes back to Azure to make these routes less preferable. However, Virtual WAN default hub routing precedence of ExpressRoute ignores the AS path length when taking routing decision.

The effective routes in hub 2 will be similar:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-er-hub-2.png" alt-text="Screenshot of effective routes in Virtual hub 2 with Global Reach and routing preference ExpressRoute." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-er-hub-2-expanded.png":::

The routing preference can be changed to VPN or AS-Path as explained in [Virtual hub routing preference (Preview)][virtual-wan-hrp]. For example, you can set the preference to VPN as shown in this image:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-set-hrp-vpn.png" alt-text="Screenshot of how to set hub routing preference in Virtual WAN to V P N." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-set-hrp-vpn.png":::

With a hub routing preference of VPN, the effective routes in hub 1 look like this:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-vpn-hub-1.png" alt-text="Screenshot of effective routes in Virtual hub 1 with Global Reach and routing preference V P N." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-vpn-hub-1-expanded.png":::

The previous image shows that the route to `10.4.2.0/24` has now a next hop of `VPN_S2S_Gateway`, while with the default routing preference of ExpressRoute it was `ExpressRouteGateway`. However, in hub 2 the route to `10.5.2.0/24` will still appear with a next hop of `ExpressRoute`, because in this case the alternative route doesn't come from a VPN Gateway but from an NVA integrated in the hub:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-vpn-hub-2.png" alt-text="Screenshot of effective routes in Virtual hub 2 with Global Reach and routing preference V P N." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-vpn-hub-2.png":::

However, traffic between hubs is still preferring the routes coming via ExpressRoute. To use the more efficient direct connection between the virtual hubs, the  route preference can be set to "AS Path" on both hubs:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-set-hrp-aspath.png" alt-text="Screenshot that shows how to set hub routing preference in Virtual WAN to A S Path." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-set-hrp-aspath.png":::

Now the routes for remote spokes and branches in hub 1 will have a next hop of `Remote Hub` as intended:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-1.png" alt-text="Screenshot of effective routes in Virtual hub 1 with Global Reach and routing preference A S Path." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-1-expanded.png":::

You can see that the IP prefix for hub 2 (`192.168.2.0/23`) still appears reachable over the Global Reach link, but this shouldn't impact traffic as there shouldn't be any traffic addressed to devices in hub 2. This route might be an issue though, if there were NVAs in both hubs establishing SDWAN tunnels between each other.

However, note that `10.4.2.0/24` is now preferred over the VPN Gateway. This can happen if the routes advertised via VPN have a shorter AS path than the routes advertised over ExpressRoute. After configuring the on-premises VPN device to prepend its Autonomous System Number (`65501`) to the VPN routes to make the less preferable, hub 1 now selects ExpressRoute as next hop for `10.4.2.0/24`:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-1-prepend.png" alt-text="Screenshot of effective routes in Virtual hub 1 with Global Reach and routing preference A S Path after prepending." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-1-prepend-expanded.png":::

Hub 2 will show a similar table for the effective routes, where the VNets and branches in the other hub now appear with `Remote Hub` as next hop:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-2-prepend.png" alt-text="Screenshot of effective routes in Virtual hub 2 with Global Reach and routing preference A S Path." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-2-aspath-hub-2-prepend-expanded.png":::

## Scenario 3: Cross-connecting the ExpressRoute circuits to both hubs

In order to add direct links between the Azure regions and the on-premises locations connected via ExpressRoute, it's often desirable connecting a single ExpressRoute circuit to multiple Virtual WAN hubs in a topology some times described as "bow tie", as the following topology shows:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3.png" alt-text="Diagram that shows a Virtual WAN design with two ExpressRoute circuits in bow tie with Global Reach and two V P N branches." :::

> [!IMPORTANT]
> The previous diagram shows two secured virtual hubs, this topology is supported with Routing Intent. For more information, see [How to configure Virtual WAN Hub routing intent and routing policies][virtual-wan-intent].

Virtual WAN shows that both circuits are connected to both hubs:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-circuits.png" alt-text="Screenshot of Virtual WAN showing both ExpressRoute circuits connected to both virtual hubs." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-circuits-expanded.png":::

Going back to the default hub routing preference of ExpressRoute, the routes to remote branches and VNets in hub 1 will show again ExpressRoute as next hop. Although this time the reason isn't Global Reach, but the fact that the ExpressRoute circuits bounce back the route advertisements they get from one hub to the other. For example, the effective routes of hub 1 with hub routing preference of ExpressRoute are as follows:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-er-hub-1.png" alt-text="Screenshot of effective routes in Virtual hub 1 in bow tie design with Global Reach and routing preference ExpressRoute." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-er-hub-1-expanded.png":::

Changing back the hub routing preference again to AS Path returns the inter hub routes to the optimal path using the direct connection between hubs 1 and 2:

:::image type="content" source="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-aspath-hub-1.png" alt-text="Screenshot of effective routes in Virtual hub 1 in bow tie design with Global Reach and routing preference A S Path." lightbox="./media/routing-deep-dive/virtual-wan-routing-deep-dive-scenario-3-aspath-hub-1-expanded.png":::

## Next steps

For more information about Virtual WAN, see:

* The Virtual WAN [FAQ](virtual-wan-faq.md)

[virtual-wan-overview]: ./virtual-wan-about.md

[virtual-wan-secured-hub]: ../firewall-manager/secured-virtual-hub.md

[virtual-wan-hrp]: ./about-virtual-hub-routing-preference.md

[virtual-wan-nva]: ./about-nva-hub.md

[virtual-wan-bgp]: ./scenario-bgp-peering-hub.md

[virtual-wan-intent]: ./how-to-routing-policies.md

[er]: ../expressroute/expressroute-introduction.md

[er-gr]: ../expressroute/expressroute-global-reach.md


