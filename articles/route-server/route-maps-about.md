---
title: About route maps for Azure Route Server
description: Learn how route maps for Azure Route Server let you control route advertisements for BGP peerings, ExpressRoute, and VPN gateway connections.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ai-usage: ai-assisted
ms.date: 07/17/2026

#CustomerIntent: As an Azure administrator, I want to understand route maps for Azure Route Server so that I can control route advertisements, filter routes, and modify BGP attributes for my BGP peerings and gateway connections.
---

# About route maps for Azure Route Server

> [!IMPORTANT]
> Route maps for Azure Route Server is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Route maps for Azure Route Server gives you control over route advertisements and routing behavior. By using route maps, you can manage the routing that enters and leaves Azure Route Server BGP peerings with network virtual appliances (NVAs), ExpressRoute gateway connections, and VPN gateway connections in the same virtual network.

You can configure route maps by using the Azure portal. For configuration steps, see [How to configure route maps](route-maps-how-to.md).

The following diagram shows how inbound and outbound route maps process routes as they enter and leave Azure Route Server. Each route map evaluates match conditions, applies optional attribute modifications, and then permits or denies the route before it's advertised to virtual networks or BGP peers.

:::image type="complex" source="./media/route-maps-about/route-maps-architecture.svg" alt-text="Diagram that shows how inbound and outbound route maps process routes passing through Azure Route Server." lightbox="./media/route-maps-about/route-maps-architecture.svg":::
   Azure Route Server sits between on-premises networks, network virtual appliances, BGP peers, and virtual networks, and applies route maps to the routes exchanged between them. Inbound route maps process routes as Route Server learns them. Outbound route maps process routes as Route Server advertises them. Each route map evaluates its match conditions against a route's prefix, AS-Path, and BGP community. When a route matches, the route map optionally modifies the route's attributes, then either permits the route so it continues through the routing pipeline, or denies it so it's dropped.
:::image-end:::

## Why use route maps?

Route maps provides the following key benefits:

- **Route summarization**: Summarize routes when your on-premises networks connect to your virtual network through ExpressRoute or VPN, and you're limited by the number of routes that can be advertised to or from Azure Route Server.
- **Route control**: Control routes entering and leaving your Azure Route Server deployment between on-premises networks, NVAs, and virtual networks.
- **Path selection**: Modify BGP attributes such as *AS-PATH* to make a route more or less preferable. When destination prefixes are reachable through multiple paths, you can use AS-PATH to control best path selection.
- **Route tagging**: Tag routes by using the BGP Community attribute to manage routes more easily.

## Where you can apply route maps

Azure Route Server acts as a routing engine that manages route distribution between NVAs, virtual network gateways, and Azure's routing infrastructure. Route maps lets you perform route aggregation, route filtering, and BGP attribute modification (AS-PATH and Community) to manage routes and routing decisions.

You can configure route maps for the following resources:

- **BGP peerings**: A route map can be applied to BGP peerings between Azure Route Server and your network virtual appliances (NVAs).
- **ExpressRoute gateway connection**: The route server's connection to the ExpressRoute gateway in the same virtual network.
- **VPN gateway connection**: The route server's connection to the VPN gateway in the same virtual network.

You can apply a route map in the **inbound** or **outbound** direction on any of these connections:

- **Inbound route map**: Applied to routes received by Azure Route Server from a BGP peering, ExpressRoute gateway, or VPN gateway.
- **Outbound route map**: Applied to routes sent from Azure Route Server to a BGP peering, ExpressRoute gateway, or VPN gateway.

> [!IMPORTANT]
> You can apply only one route map per direction (inbound or outbound) on each connection. Outbound route maps modify route advertisements only and don't influence Azure Route Server's best-path selection, because path selection happens before outbound route maps are applied.

Route maps supports the following route manipulation capabilities:

- **Route aggregation**: Reduce the number of routes coming in or out of a connection by summarizing them. For example, 10.2.1.0/24, 10.2.2.0/24, and 10.2.3.0/24 can be summarized as 10.2.0.0/16.
- **Route filtering**: Exclude routes advertised or received from BGP peerings, ExpressRoute connections, and VPN connections.
- **BGP attribute modification**: Modify AS-PATH and BGP Communities. You can add or set ASNs (Autonomous System Numbers).

## What are route-map rules?

A route map is an ordered sequence of one or more **route-map rules** that Azure Route Server applies to routes it receives or sends. Route-map rules consist of match conditions and actions.

When you configure a route-map rule, use the **Next step** setting to specify whether routes that match this rule continue to be processed by subsequent rules in the route map, or stop (terminate). After you configure route-map rules for the route map, you can apply the route map to BGP peerings and gateway connections.

Consider the following points:

- You can configure any number of route modifications in a route-map rule. It's possible to have a route map without any rules.
- If a route map rule has no actions, the routes remain unaltered.
- If a route map rule has multiple modifications, Azure applies all configured actions to the route. The order of the actions isn't relevant.
- If a route doesn't match all the match conditions in a rule, the route isn't considered a match for that rule. The route passes to the next rule in the route map, regardless of the **Next step** setting.
- To avoid unintended traffic flows, configure rules to match only the routes you intend.

### Match conditions

Route maps lets you match routes by using route prefix, BGP community, and AS-Path. **Match conditions** are the conditions that a processed route must meet to be considered a match for the rule.

- You can configure any number of match conditions in a route-map rule.
- If you create a route map without a match condition, all routes from the applied connection are matched.

    For example, a BGP peering has routes 10.2.1.0/24, 10.2.2.0/24, and 10.2.3.0/24 being advertised from an NVA to Azure Route Server. A route map without a match condition matches 10.2.1.0/24, 10.2.2.0/24, and 10.2.3.0/24.

- If a route map has multiple match conditions, a route must meet all the match conditions to be considered a match for the rule. The order of the match conditions isn't relevant.

    For example, a BGP peering has routes 10.2.1.0/24 with an AS-Path of 65535 and a BGP community of 65535:100 being advertised from an NVA to Azure Route Server. If you create a route-map rule with a match condition for prefix 10.2.1.0/24, and another match condition for AS-Path 65535, both conditions need to be met to be considered a match.

- Azure Route Server supports multiple rules. If the first rule isn't matched, then the second rule is evaluated. Select **Terminate** in the **Next step** field to end the list of rules in the route map. When no rule is matched, the default is to allow, not to deny.

### Actions

Match conditions select a set of routes. After the routes are selected, you can drop or modify them. You can configure the following **actions**:

- **Drop**: Drop all the matched routes (filter them out) from the route advertisement. For example, a BGP peering advertises routes 10.2.1.0/24, 10.2.2.0/24, and 10.2.3.0/24 from an NVA to Azure Route Server. You can configure a route map to drop 10.2.1.0/24 and 10.2.2.0/24, so only 10.2.3.0/24 is advertised.
- **Modify**: Modify routes by aggregating route prefixes or changing route BGP attributes. For example, a BGP peering has routes 10.2.1.0/24 with an AS-Path of 65535 and a BGP community of 65535:100. You can configure a route map to add the AS-Path of [64510, 64511].

### Supported configurations for route-map rules

The following tables show the match conditions and actions that route maps supports.

#### Match conditions

[!INCLUDE [Route maps match conditions](../../includes/route-maps-match-conditions.md)]

#### Route modifications

[!INCLUDE [Route maps route modifications](../../includes/route-maps-route-modifications.md)]

## Considerations and limitations

Before you use route maps, consider the following limitations:

- Route summarization strips the *BGP Community* and *AS-PATH* attributes from summarized routes. This limitation applies to both inbound and outbound routes.

[!INCLUDE [Route maps reserved ASNs and communities](../../includes/route-maps-reserved-asn-communities.md)]

- You can modify the default route only when the default route comes from on-premises or an NVA.
- You can modify a prefix either by using route maps or by using NAT, but you can't use both.
- You can't use route maps to modify or filter the virtual network address space that Azure Route Server advertises.
- Route maps only supports route summarization. Don't use route maps to create more specific routes.
- You can't apply route maps on the Microsoft Enterprise Edge (MSEE) for ExpressRoute connections.
- The first time you create a route map on an Azure Route Server, the route server undergoes an upgrade that takes approximately 30 minutes.
- Using route maps incurs extra charges. For more information, see [Azure Route Server pricing](https://azure.microsoft.com/pricing/details/route-server/).

## Related content

- [How to configure route maps](route-maps-how-to.md)
- [Prepend routes by using route maps](route-maps-scenario-prepend-routes.md)
- [Tag routes with BGP communities by using route maps](route-maps-scenario-tag-bgp-communities.md)
- [What is Azure Route Server?](overview.md)
- [Azure Route Server FAQ](route-server-faq.md)
- [Configure and manage Azure Route Server](configure-route-server.md)
