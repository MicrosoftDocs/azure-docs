---
title: Tag routes with BGP communities by using route maps
description: Learn how to use route maps for Azure Route Server to add BGP community tags to routes so downstream peers can make routing decisions based on route metadata.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 10/27/2026

#CustomerIntent: As an Azure administrator, I want to tag routes with BGP communities by using Azure Route Server so that downstream routers, NVAs, and on-premises networks can make routing decisions based on route metadata.
---

# Tag routes with BGP communities by using route maps for Azure Route Server

> [!NOTE]
> Route maps for Azure Route Server are generally available in the Azure public cloud.

A BGP community is a tag that you attach to a route so that downstream routers, network virtual appliances (NVAs), SD-WAN controllers, and on-premises networks can make routing decisions based on route metadata rather than on prefixes or AS path alone. Common uses include traffic engineering, route classification, route filtering, WAN policy enforcement, and SD-WAN route selection.

This article shows you how to use route maps for Azure Route Server to add a BGP community to matched routes by using the Azure portal. For an overview of route maps, see [About route maps for Azure Route Server](route-maps-about.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network, with at least one BGP peering to an NVA, an ExpressRoute gateway connection, or a VPN gateway connection. For the full list of prerequisites, see [Configure route maps: Prerequisites](route-maps-how-to.md#prerequisites).
- Verify that routes are learned through Azure Route Server before you configure a route map. Use the **Effective Routes** view on your route server to confirm the routes.

## Considerations

Review the following considerations before you tag routes with BGP communities:

- Route maps add communities to routes that Route Server exchanges with its peers. This feature is separate from the custom BGP community that you can set on a virtual network for ExpressRoute private peering. For that feature, see [Configure custom BGP communities for Azure ExpressRoute private peering](../expressroute/how-to-configure-custom-bgp-communities-portal.md).
- BGP communities are treated as a set. Unlike AS path prepending, the order in which you add communities doesn't matter.
- Standard BGP communities are typically transitive unless a routing policy removes them. The receiving network decides whether to preserve, modify, or strip the community.

For the complete list of route maps limitations, see [About route maps: Considerations and limitations](route-maps-about.md#considerations-and-limitations).

## Understand the scenario

In this scenario, a workload subnet uses the prefix 10.0.0.0/16 and Azure Route Server uses ASN 65515. You create a route map that matches the workload prefix and adds the BGP community 3356:70 before the route is advertised to downstream peers. The route remains reachable and carries the community value, which downstream peers can use for policy decisions such as preferring the route, adjusting local preference, or triggering an SD-WAN routing policy.

The following table shows the route attributes before and after the route map is applied:

| | Prefix | AS path | Communities |
|---|---|---|---|
| **Before the route map** | 10.0.0.0/16 | 65515 | None |
| **After the route map** | 10.0.0.0/16 | 65515 | 3356:70 |

The community travels with the route, so networks beyond your NVA can act on it. In the following diagram, two upstream providers receive the same tagged route and apply different policies to it:

:::image type="complex" source="./media/route-maps-scenario-tag-bgp-communities/bgp-communities-traffic-engineering.png" alt-text="Diagram that shows two upstream providers applying different policies to a route based on its BGP community." lightbox="./media/route-maps-scenario-tag-bgp-communities/bgp-communities-traffic-engineering.png":::
   An on-premises router with ASN 65000 advertises a route that carries the BGP community 3356:70 over eBGP to two upstream providers. Provider A applies a policy that accepts routes matching community 3356:70. Provider B applies a policy that prefers routes matching community 3356:70 by assigning them a higher local preference. Azure Route Server sets the community on the originating prefix, and the community propagates to on-premises through the network virtual appliance.
:::image-end:::

## Configure the route map

Configure a route map rule that matches the workload prefix and adds the BGP community.

1. In the Azure portal, go to your **Azure Route Server** resource.

1. In the left menu under **Routing**, select **Route Maps**.

1. On **Route Maps**, select **+ Add Route-map**.

1. On **Create Route-map**, enter a **Name** for the route map, and then select **+ Add rule**.

1. On **Create Route-map rule**, enter a **Name** for the rule, and configure the following settings:

    **Next step**: Select **Continue** if later rules in the route map should also process matched routes. Select **Terminate** if this rule is the last rule that should act on matched routes.

    **Match condition**

    | Property | Criterion | Value |
    |---|---|---|
    | RoutePrefix | Equals | 10.0.0.0/16 |

    **Action on matched routes**: Select **Modify**.

    **Route modifications**

    | Property | Action | Value |
    |---|---|---|
    | Community | Add | 3356:70 |

    To add multiple communities, enter comma-separated values. Downstream devices evaluate all communities attached to the route.

    :::image type="content" source="./media/route-maps-scenario-tag-bgp-communities/route-map-rule.png" alt-text="Screenshot of the route-map rule page that shows a prefix match condition and a BGP community route modification." lightbox="./media/route-maps-scenario-tag-bgp-communities/route-map-rule.png":::

1. Select **Add** to save the rule to the route map.

1. On **Create Route-map**, select **Save** to save the route map and its rules.

    It takes a few minutes to save. After the save completes, the **Provisioning state** shows **Succeeded**.

    > [!NOTE]
    > The first time you create a route map on an Azure Route Server, the route server undergoes a one-time upgrade that can take up to 30 minutes.

## Apply and verify the route map

1. Apply the route map to the outbound direction of the BGP peering or gateway connection that advertises the workload route. For steps, see [Apply a route map to BGP peerings and gateway connections](route-maps-how-to.md#apply-a-route-map-to-bgp-peerings-and-gateway-connections).

1. Under **Routing**, select **Route Maps**, and then open **Connections Dashboard**. Select the connection and the outbound direction to confirm that the community is added as expected.

1. Verify the community on the receiving device. Because communities are carried in the route advertisement, you can check the advertised route on a remote or on-premises BGP peer, and the community attribute appears on the route.

## Example: classify routes per spoke virtual network

You can use different BGP communities to classify routes from different spoke virtual networks, and then let downstream networks apply policy based on the tag. To tag routes per spoke, create a route map for each spoke and apply it to that spoke's virtual network connection. For the association model, see [Apply route maps to an NVA in a spoke virtual network](route-maps-scenario-spoke-network-virtual-appliance.md). For example, tag routes from each spoke with a community that identifies its purpose or environment:

| Community | Meaning |
|---|---|
| 3356:70 | Preferred Azure route |
| 65000:100 | Production |
| 65000:200 | Development |
| 65000:300 | Disaster recovery |

Downstream routers and NVAs can then prefer routes, adjust local preference, advertise routes to specific locations, block route propagation, or trigger SD-WAN routing policies based on the community value.

## Frequently asked questions

### Can I add multiple communities to a route?

Yes. You can attach multiple communities to a route, and downstream devices evaluate them. Communities are treated as a set, so their order doesn't matter.

### Can I change the AS path and the community on the same route?

Yes. A single route map rule can make multiple changes to a matched route.

### Can I tag only selected routes?

Yes. Use match conditions such as a route prefix to selectively tag routes.

### How can downstream routers use communities?

Downstream routers can use communities to prefer routes, increase or decrease local preference, advertise routes to specific locations, block route propagation, or trigger SD-WAN routing policies.

### How is community tagging verified?

Check the route on the receiving BGP peer, including a remote or on-premises device, and verify that the community attribute appears on the advertised route. You can also use **Connections Dashboard** on the **Route Maps** page of the route server.

## Clean up resources

If you created the route map only to test this scenario, remove it when you're done:

1. Remove the route map from each connection where you applied it. Set **Outbound Route-map** to **None** for the connection, and then select **Save**. For steps, see [Remove a route map from a connection](route-maps-how-to.md#remove-a-route-map-from-a-connection).
1. If no other connection uses the route map, delete it. For steps, see [Modify or remove a route map](route-maps-how-to.md#modify-or-remove-a-route-map).

## Related content

- [About route maps for Azure Route Server](route-maps-about.md)
- [Configure route maps for Azure Route Server](route-maps-how-to.md)
- [Prepend routes by using route maps](route-maps-scenario-prepend-routes.md)
- [Drop inbound routes by using route maps](route-maps-scenario-drop-inbound-routes.md)
- [Apply route maps to an NVA in a spoke virtual network](route-maps-scenario-spoke-network-virtual-appliance.md)
- [Azure Route Server FAQ](route-server-faq.md)
