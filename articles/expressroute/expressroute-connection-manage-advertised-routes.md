---
title: 'Manage route scale for ExpressRoute virtual network gateways'
description: Learn how to keep routes advertised from Azure virtual networks to on-premises within ExpressRoute limits by using advertised gateway prefixes, Azure Virtual WAN Route-maps, or Azure Route Server route maps.
services: expressroute
author: raghavendermareddy
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 10/05/2026
ms.author: rmareddy
# Customer intent: As a network engineer, I want to manage routes advertised from Azure virtual networks to on-premises over ExpressRoute, so that I can stay within ExpressRoute route limits and maintain reliable connectivity.
---

# Manage route scale for ExpressRoute virtual network gateways

An ExpressRoute virtual network gateway exchanges routes and directs network traffic between Azure virtual networks and on-premises networks. In large hub-and-spoke deployments, the number of Azure prefixes advertised to on-premises can grow as you add virtual networks and address spaces.

ExpressRoute private peering supports a maximum of **1,000 IPv4 prefixes** advertised from Azure to on-premises on a single ExpressRoute connection. For dual-stack connections, a separate maximum of **100 IPv6 prefixes** applies. These totals can include prefixes from the gateway virtual network and peered virtual networks that use gateway transit.

> [!IMPORTANT]
> If you exceed the advertised-prefix limit, the connection between the ExpressRoute circuit and the virtual network gateway disconnects. This behavior also affects peered virtual networks that use gateway transit. Connectivity is re-established after you reduce the number of advertised prefixes to within the supported limit.

This article explains how to manage Azure-to-on-premises route advertisements by using the following features:

- Advertised gateway prefixes for a standard Azure virtual network.
- Azure Virtual WAN Route-maps.
- Azure Route Server route maps.

## Understand the route limits

Different ExpressRoute limits apply at different points in the routing architecture. The limit addressed in this article is the number of routes advertised **from Azure virtual networks to on-premises**.

| Direction or scope | Limit | Behavior when exceeded |
|---|---|---|
| Azure virtual network to on-premises on a single ExpressRoute connection | 1,000 IPv4 prefixes | The connection between the ExpressRoute circuit and gateway disconnects. |
| Azure virtual network to on-premises on a dual-stack connection | 100 IPv6 prefixes, in addition to the IPv4 limit | The connection between the ExpressRoute circuit and gateway disconnects. |
| On-premises to Microsoft through ExpressRoute private peering | 4,000 IPv4 prefixes, or 10,000 with ExpressRoute Premium SKU; 100 IPv6 prefixes | The BGP session between on-premises and the private peering drops. |


> [!NOTE]
> The 1,000 prefix Azure-to-on-premises limit is different from the private peering limit for routes advertised from on-premises to Microsoft and from the total route scale supported by the ExpressRoute gateway.

## Why the advertised route count grows

By default, ExpressRoute Gateway advertises the address spaces of the virtual network that contains the gateway. In a hub-and-spoke topology that uses gateway transit, the gateway also advertises address spaces from peered spoke virtual networks.

For example, consider a deployment with:

- An ExpressRoute gateway in a hub virtual network.
- Multiple spoke virtual networks peered with the hub.
- Gateway transit enabled so that the spokes can reach on-premises networks.
- One or more address prefixes assigned to each spoke.

As you add spoke virtual networks and address spaces, the number of prefixes advertised through the ExpressRoute connection increases. Without route summarization or filtering, a large deployment can reach the advertised-prefix limit.

## Choose a route management option

Use the option that matches your Azure network topology.

| Network topology | Recommended feature | Primary use |
|---|---|---|
| ExpressRoute gateway in a standard virtual network | Advertised gateway prefixes | Advertise summarized prefixes instead of covered hub and spoke address spaces. |
| ExpressRoute connection in an Azure Virtual WAN hub | Virtual WAN Route-maps | Aggregate, filter, or modify routes on Virtual WAN connections. |
| ExpressRoute gateway used with Azure Route Server in the same virtual network | Azure Route Server route maps | Aggregate or filter routes and modify BGP attributes for routes exchanged through Azure Route Server. |

For a standard hub-and-spoke virtual network, advertised gateway prefixes are the most direct option when the goal is to reduce the number of Azure prefixes advertised to on-premises. Use Virtual WAN Route-maps or Azure Route Server route maps when those services are already part of the network topology and you need more routing-policy control.

## Use advertised gateway prefixes in a standard virtual network

By using advertised gateway prefixes, ExpressRoute Gateway can advertise a configured list of summarized CIDR prefixes instead of advertising every covered hub and spoke address space individually.

Configure the `summarizedGatewayPrefixes` property on the hub virtual network that contains the gateway.

### How advertised gateway prefixes work

When you don't configure `summarizedGatewayPrefixes`, the gateway advertises:

- Address spaces in the hub virtual network.
- Address spaces in peered spoke virtual networks that use the hub gateway.

When you configure `summarizedGatewayPrefixes`:

- The gateway advertises the configured summarized prefixes.
- A hub address space covered by a configured summary isn't advertised individually.
- A spoke address space covered by a configured summary isn't advertised individually.
- A hub or spoke address space that isn't covered by a configured summary continues to be advertised.

For example, if you allocate spoke address spaces from `10.10.0.0/16`, you can configure `10.10.0.0/16` as a summarized gateway prefix when that range accurately represents the intended network reachability. The gateway then advertises the summary instead of the individual covered spoke prefixes.

### Considerations

- Set `summarizedGatewayPrefixes` on the hub virtual network that contains the gateway subnet. Azure ignores the property on spoke virtual networks.
- You can configure the property before you create a gateway subnet and gateway, but it doesn't take effect until both are present.
- When you configure summarized CIDRs, ensure that the summaries cover the gateway virtual network address spaces that must be included in the summarized advertisement. Uncovered hub address spaces continue to be advertised individually.
- The advertised gateway prefix list is independent of the virtual network address space and can contain a prefix outside that address space.
- Don't configure overlapping prefixes within the advertised gateway prefix list.
- A summarized prefix can overlap peered virtual network address spaces. This overlap is expected in a hub-and-spoke design.
- You don't need Azure Route Server to use advertised gateway prefixes.

> [!CAUTION]
> A summary advertises reachability for the entire summarized address range. Confirm that the summarized range matches the intended routing design and doesn't attract traffic for addresses that shouldn't be reachable through Azure.

## Use route maps in Azure Virtual WAN

Virtual WAN route maps provide routing control for ExpressRoute, and virtual network connections in a virtual hub.

Route maps can:

- Aggregate route prefixes.
- Filter matched routes by dropping them.
- Modify AS-PATH attributes.
- Modify BGP Community attributes.

Route map rules can match routes by route prefix, BGP Community, and AS-PATH. If a rule has multiple match conditions, a route must meet all the conditions to match the rule. When no rule matches, the default behavior is to allow the route.

### Apply the route map in the correct direction

To modify routes advertised from a Virtual WAN hub toward an ExpressRoute circuit, apply the route map to the ExpressRoute connection in the **outbound** direction.

- An inbound route map processes routes before they enter the virtual hub router's `defaultRouteTable`.
- An outbound route map processes routes before the virtual hub router advertises them across the connection.
- You can apply only one route map to a connection in each direction.
- An outbound route map changes the advertisements sent to a specific connection. It doesn't control the virtual hub's best-path selection.

### Virtual WAN considerations and limitations

Before you enable route maps, consider the following behavior:

- The first route map you create on a hub triggers a software upgrade of the virtual hub router and gateways. The upgrade takes around 30 minutes and occurs only when you create the first route map on a hub.
- After the upgrade, spoke virtual network prefixes must be in the **Default route table** to be advertised to on-premises. Ensure that the corresponding virtual network connections propagate to the Default route table.
- Deleting the route map doesn't revert the virtual hub router to its earlier software version.
- Using route maps incurs an additional charge.
- Route summarization strips BGP Community and AS-PATH attributes from the summarized routes. This behavior applies to inbound and outbound routes.
- Route maps support 2-byte autonomous system numbers for AS-PATH modification.
- Don't use Azure-reserved autonomous system numbers for AS prepending.
- A prefix can be modified by either route maps or network address translation, but not both.
- Route maps aren't applied to the virtual hub address space.
- Route maps support summarization but shouldn't be used to create more-specific routes.
- You can't apply a route map to Microsoft Enterprise Edge devices for ExpressRoute connections.

After applying a route map, use the Route Map dashboard to review routes, AS paths, and BGP communities.

## Use route maps with Azure Route Server

> [!IMPORTANT]
> Route maps for Azure Route Server are currently in preview. Review the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before using the feature in a production environment.

Azure Route Server route maps control routes that enter and leave Azure Route Server BGP peerings. You can use them with:

- Network virtual appliances and other BGP peers.
- An ExpressRoute gateway in the same virtual network.


Azure Route Server route maps can:

- Summarize routes.
- Filter routes by permitting or denying matched routes.
- Modify AS-PATH attributes.
- Modify BGP Community attributes.

Inbound route maps process routes as Azure Route Server learns them. Outbound route maps process routes as Azure Route Server advertises them. Route-map rules can match prefixes, AS-PATH values, and BGP communities before permitting or denying a route.

> [!NOTE]
> Azure Route Server route maps run in the Azure Route Server routing pipeline. They aren't route policies applied directly to the ExpressRoute circuit or to Microsoft Enterprise Edge devices.

### Azure Route Server considerations and limitations

- Route summarization strips BGP Community and AS-PATH attributes from summarized routes for inbound and outbound processing.
- You can modify a default route only when it's learned from on-premises or from a network virtual appliance.
- A prefix can be modified by either a route map or network address translation, but not both.
- Route maps can't modify or filter the virtual network address space advertised by Azure Route Server.
- Route maps support summarization but shouldn't be used to create more-specific routes.
- Route maps can't be applied to Microsoft Enterprise Edge devices for ExpressRoute connections.
- Creating the first route map triggers an Azure Route Server upgrade that takes approximately 30 minutes. Subsequent route map operations don't require another upgrade.
- Using route maps incurs an additional charge.

## Plan address spaces for summarization

Route summarization is most effective when you allocate virtual network address spaces from contiguous ranges.

For example, if you allocate spoke virtual networks from `10.100.0.0/16`, you can represent multiple spoke prefixes with one summary. If you distribute spoke address spaces across unrelated ranges, you might need several summaries or summarization might not be appropriate.

Use the following planning process:

1. Inventory the hub and spoke prefixes currently advertised to on-premises.
1. Identify contiguous ranges that can be represented safely by summarized prefixes.
1. Select the route-management feature that matches the network topology.
1. Verify that all required networks remain reachable after aggregation or filtering.
1. Review the resulting route advertisements before making the change broadly available.
1. Track route growth as you connect new virtual networks and address spaces.

## Summary

ExpressRoute supports up to 1,000 IPv4 prefixes advertised from Azure virtual networks to on-premises on a single ExpressRoute connection. A separate limit of 100 IPv6 prefixes applies to dual-stack connections. If you exceed the limit, the connection between the ExpressRoute circuit and virtual network gateway disconnects until the prefix count returns to within the supported limit.

Use one of the following options to manage route scale:

- **Advertised gateway prefixes** for an ExpressRoute gateway in a standard virtual network.
- **Virtual WAN Route-maps** for an ExpressRoute connection in a Virtual WAN hub.
- **Azure Route Server route maps** for a deployment that uses Azure Route Server and requires route-policy control.

Plan contiguous virtual network address ranges where possible so that you can summarize routes efficiently as the network grows.

## Related content

- [About ExpressRoute virtual network gateways](/azure/expressroute/expressroute-about-virtual-network-gateways)
- [ExpressRoute frequently asked questions](/azure/expressroute/expressroute-faqs)
- [ExpressRoute routing requirements](/azure/expressroute/expressroute-routing)
- [Advertised gateway prefixes in Azure virtual networks](/azure/virtual-network/advertised-gateway-prefixes-overview)
- [Configure advertised gateway prefixes for a virtual network](/azure/virtual-network/how-to-advertised-gateway-prefixes)
- [About Route-maps for Azure Virtual WAN](/azure/virtual-wan/route-maps-about)
- [Configure Route-maps for Azure Virtual WAN](/azure/virtual-wan/route-maps-how-to)
- [Summarize routes leaving your Virtual WAN](/azure/virtual-wan/route-maps-how-to-summarize-routes-leaving-your-virtual-wan)
- [About route maps for Azure Route Server](/azure/route-server/route-maps-about)
- [Configure route maps for Azure Route Server](/azure/route-server/route-maps-how-to)
