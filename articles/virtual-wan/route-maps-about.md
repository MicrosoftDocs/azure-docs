---
title: 'About Route-maps'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN Route-maps.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 03/04/2024
ms.author: cherylmc
ms.custom: references_regions

---
# About Route-maps for virtual hubs (Preview)

Route-maps is a feature that gives you the ability to control route advertisements and routing for Virtual WAN virtual hubs. Route-maps lets you have more control of the routing  that enters and leaves Azure Virtual WAN site-to-site (S2S) VPN connections, User VPN point-to-site (P2S) connections, ExpressRoute (ER) connections, and virtual network (VNet) connections. Route-maps can be configured using the Azure portal. For configuration steps, see [How to configure Route-maps](route-maps-how-to.md).

> [!IMPORTANT]
> [!INCLUDE [Preview text](../../includes/virtual-wan-route-maps-preview.md)]
>

## Why use Route-maps?

Some of the key benefits of using Route-maps are:

* Route-maps can be used to summarize routes when you have on-premises networks connected to Virtual WAN via ExpressRoute or VPN and are limited by the number of routes that can be advertised from/to virtual hub.
* You can use Route-maps to control routes entering and leaving your Virtual WAN deployment among on-premises and virtual-networks.
* You can control routing decisions in your Virtual WAN deployment by modifying a BGP attribute such as *AS-PATH* to make a route more, or less preferable. This is helpful when there are destination prefixes reachable via multiple paths and customers want to use AS-PATH to control best path selection.  
* You can easily tag routes using the BGP Community attribute in order to manage routes.

In Virtual WAN, the virtual hub router acts as a route manager, providing simplification in routing operations within and across virtual hubs. The virtual hub router simplifies routing management by being the central routing engine that talks to gateways (S2S, ER, and P2S), Azure Firewall, and Network Virtual Appliances (NVAs).

While the gateways make their routing decisions, the virtual hub router provides central route management and enables advanced routing scenarios in the virtual hub with features such as custom route tables, route association, and propagation.

Route-maps lets you perform route aggregation, route filtering, and gives you the ability to modify BGP attributes such as AS-PATH and Community to manage routes and routing decisions. Route-maps are configurable for the following resources and settings:

* **Connections:** A route-map can be applied to user, branch, ExpressRoute, and VNet connections.

  * ExpressRoute connection: The hub's connection to an ER circuit.
  * Site-to-site VPN connection: The hub's connection to a VPN site.
  * VNet connection: The hub's connection to a virtual network.
  * Point-to-site connection: The hub’s connection to a P2S user.

   A virtual hub can have a route-map applied to any of the connections, as shown in the following diagram:

   :::image type="content" source="./media/route-maps-about/architecture.png" alt-text="Screenshot shows a diagram of the Virtual WAN architecture using Route-map."lightbox="./media/route-maps-about/architecture.png":::

* **Route aggregation:** Route-maps lets you reduce the number of routes coming in and/or out of a connection by summarizing. (Example: 10.2.1.0.0/24, 10.2.2.0/24 and 10.2.3.0/24 can be summarized to 10.2.0.0/16).
* **Route Filtering:** Route-maps lets you exclude routes that are advertised or received from ExpressRoute connections, site-to-site VPN connections, VNet connections, and point-to-site connections.
* **Modify BGP attributes:** Route-maps lets you modify AS-PATH and BGP Communities. You can now add or set ASNs (Autonomous system numbers).

## Considerations and limitations

Before using Route-maps, take into consideration the following limitations:

* During Preview, hubs that are using Route-maps must be deployed in their own virtual WANs.
* The Route-maps feature is only available for virtual hubs running on the Virtual Machine Scale Sets infrastructure. For more information, see the [FAQ](virtual-wan-faq.md).
* When using Route-maps to summarize a set of routes, the hub router strips the *BGP Community* and *AS-PATH* attributes from those routes. This applies to both inbound and outbound routes.
* When adding ASNs to the AS-PATH, don't use ASNs reserved by Azure:
  * Public ASNs: 8074, 8075, 12076
  * Private ASNs: 65515, 65517, 65518, 65519, 65520
* You can't apply Route-maps to connections between on-premises and SD-WAN/Firewall NVAs in the virtual hub. These connections aren't supported during Preview. You can still apply route-maps to other supported connections when an NVA in the virtual hub is deployed. This doesn't apply to the Azure Firewall, as the routing for Azure Firewall is provided through Virtual WAN [routing intent features](how-to-routing-policies.md).
* Route-maps supports only 2-byte ASN numbers.
* The point-to-site (P2S) Multipool feature isn't currently supported with Route-maps.
* Modifying the *Default* route is only supported when the default route is learned from on-premises or an NVA.
* A prefix can be modified either by Route-maps, or by NAT, but not both.
* Route-maps won't be applied to the [hub address space](virtual-wan-site-to-site-portal.md#hub).
* Modifying the Default route is only supported when the default route is learned from on-Prem or an NVA.
* Applying Route-Maps on NVAs in a spoke VNet is not supported. 

## Configuration workflow

You can configure Route-maps using the Azure portal. For configuration workflow and comprehensive steps, see [How to configure Route-maps](route-maps-how-to.md).

## What are route-map rules?

A route-map is an ordered sequence of one or more **route-map rules** that are applied to routes that are received or sent by the virtual hub. Route-map rules consist of [match conditions](#match-conditions), and [actions](#actions).

When you're configuring a route-map rule, you use the **Next step** setting to specify whether routes that match this rule will continue on to be processed by the subsequent rules in the route-map, or stop (terminate). After route-map rules are configured for the route-map, the route-map can be applied to connections.

Things to consider:

* A route-map rule can have any number of route modifications configured. It's possible to have a route-map without any rules.
* If a route-map has no actions configured in a rule, the routes are unaltered.
* If a route-map has multiple modifications configured in a rule, all configured actions are applied on the route. The order of the actions isn't relevant.
* If a route isn't matched by all the match conditions in a rule, the route isn't considered a match for the rule. The route is passed on to the rule under the route-map, irrespective of the **Next step** setting.
* Configure rules to only match the routes intended to avoid unintended traffic flows.

### Match conditions

Route-maps allows you to match routes using Route-prefix, BGP community, and AS-Path. **Match conditions** are the set of conditions that a processed route must meet to be considered as a match for the rule.

* A route-map rule can have any number of match conditions.
* If a route-map is created without a match condition, all routes from the applied connection will be matched.

  For example, a site-to-site VPN connection has routes 10.2.1.0/24, 10.2.2.0/24 and 10.2.3.0/24 being advertised from Azure to a branch office. A route-map without a match condition will match 10.2.1.0/24, 10.2.2.0/24 and 10.2.3.0/24.
* If a route-map has multiple match conditions, then a route must meet all the match conditions to be considered a match for the rule. The order of the match conditions isn't relevant.

  For example, a site-to-site VPN connection has routes 10.2.1.0/24 with an AS Path of 65535 and a BGP community of 65535:100 being advertised from Azure to a branch office. If a route-map rule is created on the connection with a match condition to match on prefix 10.2.1.0, and another match condition for AS Path 65535, both conditions need to be met in order to be considered a match.
* Multiple rules are supported. If the first rule isn't matched, then the second rule is evaluated. Select **Terminate** in the **Next step** field to end the list of rules in the route-map. When no rule is matched, the default is to allow, not to deny.

### Actions

Match conditions are used to select a set of routes. Once those routes are selected, they can be dropped or modified. You can configure the following **Actions**:

* **Drop:** All the matched routes are dropped (i.e filtered-out) from the route advertisement. For example, a site-to-site VPN connection has routes 10.2.1.0/24, 10.2.2.0/24 and 10.2.3.0/24 being advertised from Azure to a branch office. A route-map can be configured to drop 10.2.1.0/24, 10.2.2.0/24, resulting in only 10.2.3.0/24 being advertised from Azure to a branch office.

* **Modify:** The possible route modifications are aggregating route-prefixes or modifying route BGP attributes. For example, a site-to-site VPN connection has routes 10.2.1.0/24 with an AS Path of 65535 and a BGP community of 65535:100 being advertised from Azure to a branch office. A route-map can be configured to add the AS Path of [65535, 65005].

### Supported configurations for route-map rules

This section shows the match conditions and actions supported for the Route-maps Preview.

#### Match conditions

|Property|	Criterion|	Value (example)|	Interpretation|
|---|---|---|---|
|Route-prefix|	equals|	10.1.0.0/16,10.2.0.0/16,10.3.0.0/16,10.4.0.0/16|Matches these 4 routes only. Specific prefixes under these routes won't be matched.  |
|Route-prefix	|contains|	10.1.0.0/16,10.2.0.0/16, 192.168.16.0/24, 192.168.17.0/24|	Matches all the specified routes and all prefixes underneath. (Example 10.2.1.0/24 is underneath 10.2.0.0/16) |
|Community|	equals	|65001:100,65001:200	|Community property of the route must have both the communities. Order isn't relevant.|
|Community	|contains|	65001:100,65001:200|Community property of the route can have one or more of the specified communities. |
|AS-Path	|equals|	65001,65002,65003|	AS-PATH of the routes must have ASNs listed in the specified order.
|AS-Path	|contains|	65001,65002,65003|	AS-PATH in the routes can contain one or more of the ASNs listed. Order isn't relevant.|

#### Route modifications

|Property|	Action|	Value	|Interpretation|
|---|---|---|---|
|Route-prefix|	Add	|10.3.0.0/8,10.4.0.0/8 |The routes specified in the rules are added. |
|Route-prefix |	Replace|	10.0.0.0/8,192.168.0.0/16|Replace all the matched routes with the routes specified in the rule.  |
|As-Path |	Add |	64580,64581	|Prepend AS-PATH with the list of ASNs specified in the rule. These ASNs are applied in the same order for the matched routes. |
|As-Path |	Replace |	65004,65005 |AS-PATH will be set to this list in the same order, for every matched route. See key considerations for reserved AS numbers. |
|As-Path |	Replace |	No value specified	|Remove all ASNs in the AS-PATH in the matched routes. |
|Community |	Add	|64580:300,64581:300 |Add all the listed communities to all the matched routes Community attribute.  |
|Community |	Replace |	64580:300,64581:300 |	Replace Community attribute for all the matched routes with the list provided. |
|Community |	Replace |	No value specified |Remove Community attribute from all the matched routes. |
|Community |	Remove|	65001:100,65001:200|Remove any of the listed communities that are present in the matched routes’ Community attribute. |

## Apply route-maps to connections

You can apply route-maps on each connection for the inbound, outbound, or both inbound and outbound directions. You can choose to apply same or different route-maps in inbound and outbound directions, but only one route-map can be applied in each direction. For ExpressRoute connections, a route-map can't be applied on MSEE devices.

* **Inbound direction:** When a route-map is configured on a connection in the inbound direction, all the ingress route advertisements on that connection are processed by the route-map before they're entered into the virtual hub router’s routing table, *defaultRouteTable*.

* **Outbound direction:** When a route-map is configured on a connection in the outbound direction, the route-map processes all the egress route advertisements on that connection before they're advertised by the virtual hub router across the connection.

For steps to apply route-maps to connections, see [How to configure Route-maps](route-maps-how-to.md).

## Monitor using the Route Map dashboard

When a route-map is applied to a connection, you can use the Route Map dashboard to monitor and view:

* Routes
* AS Path
* BGP communities

For more information and steps, see [Monitor Route-maps using the Route Map dashboard](route-maps-dashboard.md).

## Next steps

* To configure Route-maps, see [How to configure Route-maps](route-maps-how-to.md).
* To monitor routes, AS Path, and BGP communities, see the
[Route Map dashboard](route-maps-dashboard.md).
