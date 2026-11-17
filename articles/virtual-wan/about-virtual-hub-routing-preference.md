---
title: 'Virtual WAN virtual hub routing preference'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN virtual hub routing preference.
author: duongau
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 12/10/2024
ms.author: duau
ms.custom: sfi-image-nochange, references_regions
---

# Virtual hub routing preference

A Virtual WAN virtual hub connects to virtual networks (VNets) and on-premises using connectivity gateways, such as site-to-site (S2S) VPN gateway, ExpressRoute (ER) gateway, point-to-site (P2S) gateway, and SD-WAN Network Virtual Appliance (NVA). The virtual hub router provides central route management and enables advanced routing scenarios using route propagation, route association, and custom route tables.

The virtual hub router takes routing decisions using built-in route selection algorithm. To influence routing decisions in virtual hub router towards on-premises, we now have a new Virtual WAN hub feature called **Hub routing preference (HRP)**. When a virtual hub router learns multiple routes across S2S VPN, ER and SD-WAN NVA connections for a destination route-prefix in on-premises, the virtual hub router’s route selection algorithm adapts based on the hub routing preference configuration and selects the best routes. For steps, see [How to configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).

## <a name="selection"></a>Route selection algorithm for virtual hub

This section explains the route selection algorithm in a virtual hub along with the control provided by HRP. When a virtual hub has multiple routes to a destination prefix for on-premises, the best route or routes are selected in the order of preference as follows:

1. Select routes with Longest Prefix Match (LPM).
1. Prefer static routes learned from the virtual hub route table over BGP routes.
1. Select best path based on the virtual hub routing preference configuration.

You can select one of the three possible virtual hub routing preference configurations: ExpressRoute, VPN, or AS Path. Each configuration is slightly different. Route rules are processed sequentially within the selected configuration until a match is made.

* **ExpressRoute** (This is the default setting)

   1. Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
   1. If there are routes from both ExpressRoute and Site-to-site VPN/Network Virtual Appliance (NVA):
      * If all the routes are local to the virtual hub, prefer ExpressRoute routes over VPN/NVA routes.
       * If all the routes are through remote hubs, ExpressRoute routes learned from hubs **without** routing intent have the lowest priority. All other remote routes are preferred.
   1. Prefer routes with the shortest BGP AS-Path length.
   1. If all remaining routes are learned from remote hubs, prefer routes with the highest remote hub priority.

* **VPN**

   1. Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
   1. If there are routes from both ExpressRoute and Site-to-site VPN/Network Virtual Appliance (NVA):
       * If all the routes are local to the virtual hub, prefer VPN/NVA routes over ExpressRoute routes.
       * If all the routes are through remote hubs, ExpressRoute routes learned from hubs **without** routing intent have the lowest priority. All other remote routes are preferred.
   1. Prefer routes with the shortest BGP AS-Path length.
   1. If all remaining routes are learned from remote hubs, prefer routes with the highest remote hub priority.

* **AS Path**

   1. Prefer routes with the shortest BGP AS-Path length from the following set of routes:
      * Routes local to the virtual hub.
      * All remote routes except remote ExpressRoute routes learned from remote hubs **without** routing intent. 
   1. ExpressRoute routes learned from remote hubs without routing intent have the lowest priority when compared to the routes in step 1. These routes are considered only if there are no other routes for a given prefix (set in step 1 is empty). 
   1. Prefer routes from local virtual hub connections over routes learned from remote virtual hub.
   1. Prefer routes from local ExpressRoute connections over local VPN/NVA connections.
   1. If all remaining routes are learned from remote hubs, prefer routes with the highest remote hub priority.

### Remote hub priority

>[!NOTE]
> Remote hub priority breaks ties between routes with the **same** AS-PATH length that come from different remote Virtual WAN hubs. The hub routing preference algorithm evaluates remote hub priority as the final routing attribute. It ensures a single deterministic remote path is chosen for each prefix.

Each Virtual WAN hub assigns remote hubs in the same Virtual WAN a remote hub priority. Routes that a given Virtual WAN hub learns from hubs in closer Azure regions get higher priority than routes that the hub learns from virtual hubs in further Azure regions. If there are multiple remote hubs in the **same** Azure region, the remote hubs in that region are preferred in ascending lexicographic order by the ASCII values of the remote Virtual WAN hub names. The following table provides an example ordering of remote hubs in a single remote region.

|Order|Region| Hub Name| 
|--|--|
|1 (more preferred)| West US |Hub-A |
|2| West US |Hub-B |
|3|West US  |Hub-a |
|4 (least preferred)| West US |Hub-b | 


### Things to note

* When there are multiple virtual hubs in a Virtual WAN, a virtual hub selects the best routes using the route selection algorithm described above, and then advertises them to the other virtual hubs in the virtual WAN.
* When a Virtual WAN hub advertises a route to another Virtual WAN hub, this route has the ASNs 65520-65520 prepended to its AS-Path. For more details on routing in Virtual WAN, see [Virtual WAN routing deep dive](routing-deep-dive.md) and [View Virtual Hub Effective Routes](effective-routes-virtual-hub.md). 
* When a Virtual WAN hub advertises a route to another Virtual WAN hub,this route will have the ASNs 6552-65520 prepended to its AS-PATH.
* [Remote hub priority](#remote-hub-priority) is used to break ties between routes with the same AS-PATH length that are learned from different remote Virtual WAN hubs. See [routing intent example](about-virtual-hub-routing-preference.md#routing-intent-example) for a sample configuration and selected path.
* ExpressRoute routes learned from remote hubs without routing intent are always the least preferred, irregardless of the hub routing preference setting and the AS-PATH of the route.  See [routing intent example](about-virtual-hub-routing-preference.md#routing-intent-example) for a sample configuration and selected path.

### Best practices

* When the same address prefix is advertised from multiple on-premises connections (ExpressRoute, VPN, NVA), ensure that each on-premises device that advertises that address prefix is configured to prefer its own originated route over any route learned from Azure. This ensures all candidate routes are advertised to Azure and Virtual WAN hub is able to consider all possible paths for best-path selection. Common strategies to achieve this configuration include using local preference in your on-premises device to prefer its own originated routes, or to use out-bound route-maps in Virtual WAN to increase the AS-PATH length of routes advertised by Azure to on-premises. 
* Ensure that routing symmetry is explicitly considered in routing and failover designs, especially for set-ups that utilize routing intent for stateful inspection of private (on-premises and Virtual Network traffic). Consider both how Virtual WAN selects a specific connection for egress and how on-premises devices select a specific connection for ingress. Common strategies to ensure symmetry include manipulating AS-PATH lengths of routes or utilizing Virtual WAN's remote hub priority to configure routing preference on-premises. 
   
## Routing scenarios

Virtual WAN hub routing preference is beneficial when multiple on-premises are advertising routes to same destination prefixes, which can happen in customer Virtual WAN scenarios that use any of the following setups.

* Virtual WAN hub using ER connections as primary and VPN connections as backup.
* Virtual WAN with connections to multiple on-premises and customer is using one on-premises site as active, and another as standby for a service deployed using the same IP address ranges in both the sites.
* Virtual WAN has both VPN and ER connections simultaneously and the customer is distributing services across connections by controlling route advertisements from on-premises.

The following example is a hypothetical Virtual WAN deployment that encompasses multiple scenarios described earlier. We'll use it to demonstrate the route selection by a virtual hub.

A brief overview of the setup:

* Each on-premises site is connected to one or more of the virtual hubs Hub_1 or Hub_2 using S2S VPN, or ER circuit, or SD-WAN NVA connections.
* For each on-premises site, the ASN it uses and the route-prefixes it advertises are listed in the diagram. Notice that there are multiple routes for several route-prefixes.

   :::image type="content" source="./media/about-virtual-hub-routing-preference/diagram.png" alt-text="Example diagram for hub-route-preference scenario." lightbox="./media/about-virtual-hub-routing-preference/diagram.png":::

Let’s say there are flows from a virtual network VNET1 connected to Hub_1 to various destination route-prefixes advertised by the on-premises. The path that each of those flows takes for different configurations of Virtual WAN **hub routing preference** on Hub_1 and Hub_2 is described in the following tables. The paths have been labeled in the diagram and referred to in the tables for ease of understanding.

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

### Routing intent example

The following example illustrates how routing intent (or lack of routing intent) affects the selection of local and remote routes in a virtual hub. In the following example, all paths are labeled with a **green** circle with a number identifying the path. All on-premises sites advertise the same set of address prefixes to Virtual WAN with different AS-PATH lengths. In addition, Virtual WAN hubs with Azure Firewall, NVA, or SaaS solutions are configured with routing intent private routing policy.

:::image type="content" source="./media/about-virtual-hub-routing-preference/routing-intent-diagram.png" alt-text="Example diagram showing how routing intent affects route selection in a virtual hub." lightbox="./media/about-virtual-hub-routing-preference/routing-intent-diagram.png":::

**West Europe Hub Routing Preference set to AS-PATH**

The following table describes the order of paths selected by the West Europe hub when the West Europe hub's hub routing preference is set to AS-PATH.

|Preference| Path| Explanation|
|--|--|--|
|1 (most preferred)| 2 | Paths 2, 3, and 5 have the shortest AS-PATH length (3) when the path's route is advertised to West Europe Hub. Path 5 is always selected last as the Southeast Asia hub does **not** have routing intent. Path 2 is preferred over Path 3 as UK South Hub is closer to West Europe than Australia East.|
| 2 | 3 | Path 3 is the remaining route that has the shortest AS-PATH length (3).|
| 3| 1| Path 1 and Path 4 have the next shortest AS-PATH length (4). Local routes are selected over remote routes when the AS-PATH length is the same.|
|4| 4| Path 4 is the remaining route that has the shortest AS-PATH length (4).|
| 5| 5| Remote ExpressRoute routes learned from a hub without routing intent are always selected last.|

**West Europe Hub Routing Preference set to ExpressRoute or VPN**

The following table describes the order of paths selected by the West Europe hub when the West Europe hub's hub routing preference is set to ExpressRoute or VPN.

|Preference| Path| Explanation|
|--|--|--|
|1 (most preferred)| 1 | Local routes are always preferred over remote routes when the hub routing preference is set to ExpressRoute or VPN.|
| 2| 2| Paths 2, 3, and 5 have the shortest AS-PATH length (3) when the route is advertised to West Europe Hub. Path 5 is always selected last as the hub does **not** have routing intent. Path 2 is preferred over Path 3 as UK South Hub is closer to West Europe than Australia East.|
| 3| 3 | Path 3 is the remaining route that has the shortest AS-PATH length (3). |
| 4| 4| Path 4 has the next shortest AS-PATH length (4) when advertised to West Europe.|
| 5| 5| Remote ExpressRoute routes learned from a hub without routing intent are always selected last.|

## Next steps

* To use virtual hub routing preference, see [How to configure virtual hub routing preference](howto-virtual-hub-routing-preference.md).
