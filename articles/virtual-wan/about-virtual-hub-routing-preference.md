---
title: 'Virtual WAN virtual hub routing preference'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN Virtual virtual hub routing preference.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: cherylmc
---
# Virtual hub routing preference

A Virtual WAN virtual hub connects to virtual networks (VNets) and on-premises using connectivity gateways, such as site-to-site (S2S) VPN gateway, ExpressRoute (ER) gateway, point-to-site (P2S) gateway, and SD-WAN Network Virtual Appliance (NVA). The virtual hub router provides central route management and enables advanced routing scenarios using route propagation, route association, and custom route tables.

The virtual hub router takes routing decisions using built-in route selection algorithm. To influence routing decisions in virtual hub router towards on-premises, we now have a new Virtual WAN hub feature called **Hub routing preference** (HRP). When a virtual hub router learns multiple routes across S2S VPN, ER and SD-WAN NVA connections for a destination route-prefix in on-premises, the virtual hub router’s route selection algorithm adapts based on the hub routing preference configuration and selects the best routes. For steps, see [How to configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).

## <a name="selection"></a>Route selection algorithm for virtual hub

This section explains the route selection algorithm in a virtual hub along with the control provided by HRP. When a virtual hub has multiple routes to a destination prefix for on-premises, the best route or routes are selected in the order of preference as follows:

1. Select routes with Longest Prefix Match (LPM).

1. Prefer static routes over BGP routes.

1. Select best path based on the HRP configuration. There are three possible configurations for HRP and the route preference changes accordingly.

   * **ExpressRoute** (This is the default setting.)

      1. Prefer routes from connections local to a virtual hub over routes learned from remote hub.
      1. If there are still routes from both ER and S2S VPN connections, then see below. Else proceed to the next rule.
         * If all the routes are local to the hub, then choose routes learned from ER connections because HRP is set to ER.
         * If all the routes are through remote hubs, then choose route from S2S VPN connection over ER connections because any transit between ER to ER is supported only if the circuits have ER Global Reach enabled and an Azure Firewall or NVA is provisioned inside the virtual hub.
      1. Then, prefer the routes with the shortest BGP AS-Path length.

   * **VPN**

      1. Prefer routes from connections local to a virtual hub over routes learned from remote hub.
      1. If there are routes from both ER and S2S VPN connections, then choose S2S VPN routes.
      1. Then, prefer the routes with the shortest BGP AS-Path length.

   * **AS Path**

      1. Prefer routes with the shortest BGP AS-Path length irrespective of the source of the route advertisements. For example, whether the routes are learned from on-premises connected via S2S VPN or ER.
      1. Prefer routes from connections local to the virtual hub over routes learned from remote hub.
      1. If there are routes from both ER and S2S VPN connections, then see below. Else proceed to the next rule.
         * If all the routes are local to the virtual hub, then choose routes from ER connections.
         * If all the routes are through remote virtual hubs, then choose routes from S2S VPN connections.

**Things to note:**

* When there are multiple virtual hubs in a Virtual WAN scenario, a virtual hub selects the best routes using the route selection algorithm described above, and then advertises them to the other virtual hubs in the virtual WAN.
* For a given set of destination route-prefixes, if the ExpressRoute routes are preferred and the ExpressRoute connection subsequently goes down, then routes from S2S VPN or SD-WAN NVA connections will be preferred for traffic destined to the same route-prefixes. When the ExpressRoute connection is restored, traffic destined for these route-prefixes may continue to prefer the S2S VPN or SD-WAN NVA connections. To prevent this from happening, you need to configure your on-premises device to utilize AS-Path prepending for the routes being advertised to your S2S VPN Gateway and SD-WAN NVA, as you need to ensure the AS-Path length is longer for VPN/NVA routes than ExpressRoute routes. 

## Routing scenarios

Virtual WAN hub routing preference is beneficial when multiple on-premises are advertising routes to same destination prefixes, which can happen in customer Virtual WAN scenarios that use any of the following setups.

* Virtual WAN hub using ER connections as primary and VPN connections as back-up.
* Virtual WAN with connections to multiple on-premises and customer is using one on-premises site as active, and another as standby for a service deployed using the same IP address ranges in both the sites.
* Virtual WAN has both VPN and ER connections simultaneously and the customer is distributing services across connections by controlling route advertisements from on-premises.

The example below is a hypothetical Virtual WAN deployment that encompasses multiple scenarios described above. We'll use it to demonstrate the route selection by a virtual hub.

A brief overview of the setup:

* Each on-premises site is connected to one or more of the virtual hubs Hub_1 or Hub_2 using S2S VPN, or ER circuit, or SD-WAN NVA connections.
* For each on-premises site, the ASN it uses and the route-prefixes it advertises are listed in the diagram. Notice that there are multiple routes for several route-prefixes.

   :::image type="content" source="./media/about-virtual-hub-routing-preference/diagram.png" alt-text="Example diagram for hub-route-preference scenario." lightbox="./media/about-virtual-hub-routing-preference/diagram.png":::

Let’s say there are flows from a virtual network VNET1 connected to Hub_1 to various destination route-prefixes advertised by the on-premises. The path that each of those flows takes for different configurations of Virtual WAN **hub routing preference** on Hub_1 and Hub_2 is described in the tables below. The paths have been labeled in the diagram and referred to in the tables below for ease of understanding.

**When only local routes are available:**

| Flow destination route-prefix | HRP of Hub_1 | HRP of Hub_2 | Path used by flow | All possible paths | Explanation |
| --- | --- | --- | --- | --- |---|
| 10.61.1.5 | AS Path | Any setting | 4 | 1,2,3,4 | Paths 1 and 4 have the shortest AS Path but for local routes ER takes precedence over VPN, so path 4 is chosen. |
| 10.61.1.5 | VPN | Any setting | 1 | 1,2,3,4 | VPN route is preferred over ER due to HRP setting, so paths 1 and 2 are preferred, but path 1 has the shorter AS Path. |
| 10.61.1.5 | ER | Any setting | 4 | 1,2,3,4 | ER routes 3 and 4 are preferred, but path 4 has the shorter AS Path. |

**When only remote routes are available:**

| Flow destination route-prefix | HRP of Hub_1 | HRP of Hub_2 | Path used by flow | All possible paths | Explanation |
| --- | --- | --- | --- | --- |---|
| 10.62.1.5 | Any setting | AS Path or ER | ECMP across 9 & 10 | 7,8,9,10,11 | All available paths are remote and have equal AS Path, so ER paths 9 and 10 are chosen and advertised by Hub_2. Hub_1’s HRP setting has no impact. |
| 10.62.1.5 | Any setting | VPN | ECMP across 7 & 8 | 7,8,9,10,11 | The Hub_2 will only advertise best routes 7 & 8 and they're only choices for Hub_1, so Hub_1’s HRP setting has no impact. |

**When local and remote routes are available:**

| Flow destination route-prefix | HRP of Hub_1 | HRP of Hub_2 | Path used by flow | All possible paths | Explanation |
| --- | --- | --- | --- | --- |---|
| 10.50.2.5  | Any setting | Any setting | 1 | 1,2,3,4,7,8,9,10,11 | Hub_2 will advertise only 7 due to LPM. Hub_1 selects 1 due to LPM and being local route. |
| 10.50.1.5 | AS Path or ER | Any setting | 4 | 1,2,3,4,7,8,9,10,11 | Hub_2 will advertise different routes based on its HRP setting, but Hub_1 will select 4 due to being local, ER route with the shortest AS Path. |
| 10.50.1.5 | VPN | Any setting | 1 | 1,2,3,4,7,8,9,10,11 | Hub_2 will advertise different routes based on its HRP setting, but Hub_1 will select 1 due to being local, VPN route with the shortest AS Path. |
| 10.55.2.5 | AS Path | AS Path or ER | 9 | 2,3,8,9 | Hub_2 will only advertise 9, because 8 and 9 have same AS Path but 9 is ER route. On Hub_1, among 2, 3 and 9 routes, it selects 9 due to having the shortest AS Path. |
| 10.55.2.5 | AS Path | VPN | 8 | 2,3,8,9 | Hub_2 will only advertise 8, because 8 and 9 have same AS Path but 8 is VPN route. On Hub_1, among 2, 3 and 8 routes, it selects 8 due to having the shortest AS Path. |
| 10.55.2.5 | ER | Any setting | 3 | 2,3,8,9 | Hub_2 will advertise different routes based on its HRP setting, but Hub_1 will select 3 due to being local and ER. |
| 10.55.2.5 | VPN | Any setting | 2 | 2,3,8,9 | Hub_2 will advertise different routes based on its HRP setting, but Hub_1 will select 2 due to being local and VPN. |

**Key takeaways:**

* To prefer remote routes over local routes on a virtual hub, set its hub routing preference to AS Path and increase the AS Path length of the local routes.

## Next steps

* To use virtual hub routing preference, see [How to configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).
