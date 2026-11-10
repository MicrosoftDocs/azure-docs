---
title: Drop inbound routes by using Route Server route maps
description: Learn how to use route maps for Azure Route Server to drop inbound BGP routes and filter unwanted prefixes before they propagate to peers and gateways.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 10/27/2026

#CustomerIntent: As an Azure administrator, I want to drop specific routes that Azure Route Server learns from a BGP peer so that unwanted prefixes don't propagate to my virtual networks and gateway connections.
---

# Drop inbound routes by using route maps for Azure Route Server

> [!NOTE]
> Route maps for Azure Route Server are generally available in the Azure public cloud.

Route filtering is a common Border Gateway Protocol (BGP) practice. A network virtual appliance (NVA), SD-WAN appliance, or on-premises network might advertise more routes than you want in Azure. You can drop the unwanted routes as Azure Route Server learns them. Dropping routes on ingress keeps them out of the route tables of your virtual networks, ExpressRoute gateways, and VPN gateways.

Filter inbound routes when you need to:

- Resolve overlapping address spaces.
- Restrict which branch routes reach Azure.
- Prevent accidental route leaks.
- Reduce the size of your route tables.
- Enforce routing policy between routing domains.

This article shows you how to use route maps for Azure Route Server to drop matched routes in the inbound direction by using the Azure portal. For an overview of route maps, see [About route maps for Azure Route Server](route-maps-about.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network, with at least one BGP peering to a network virtual appliance (NVA), an ExpressRoute gateway connection, or a VPN gateway connection. For the full list of prerequisites, see [Configure route maps: Prerequisites](route-maps-how-to.md#prerequisites).
- Verify which routes Azure Route Server learns from the peer before you configure a route map. Use the **Effective Routes** view on your route server to confirm the routes you plan to drop.

## Considerations

Review the following considerations before you drop routes:

- Dropping a route affects only what Azure Route Server accepts and propagates. The route isn't removed from the peer that advertised it, and the peer continues to advertise it.
- Apply the route map in the **inbound** direction to filter routes before Azure Route Server propagates them. An outbound route map filters routes as Route Server advertises them, which is a different outcome.
- Route-map rules are evaluated sequentially, so rule order determines which rule acts on a route first.
- A match condition that uses a broad prefix, such as 10.0.0.0/8, can match far more routes than you intend. Confirm the scope of a match condition before you save the route map.
- Validate the routes that Azure Route Server learns before and after you apply the route map. This confirms that only the intended routes were dropped.

For the complete list of route maps limitations, see [About route maps: Considerations and limitations](route-maps-about.md#considerations-and-limitations).

## Understand the scenario

In this scenario, an NVA peers with Azure Route Server and advertises four routes. You want Azure Route Server to accept 10.100.0.0/16 and drop the three routes in the 10.122.0.0/16 range. You create a route map that matches routes containing 10.122.0.0/16 and drops them. You then apply the route map to the BGP peering in the inbound direction.

The following table shows the routes before and after the route map is applied:

| Route advertised by the NVA | Before the route map | After the route map |
|---|---|---|
| 10.122.1.0/24 | Learned | Dropped |
| 10.122.2.0/24 | Learned | Dropped |
| 10.122.3.0/24 | Learned | Dropped |
| 10.100.0.0/16 | Learned | Learned |

## Configure the route map

> [!NOTE]
> The first time you create a route map on an Azure Route Server, the route server undergoes a one-time upgrade that can take up to 30 minutes.

Configure a route map rule that matches the unwanted prefix range and drops the matched routes.

1. In the Azure portal, go to your **Azure Route Server** resource.

1. In the left menu under **Routing**, select **Route Maps**.

1. On **Route Maps**, select **+ Add Route-map**.

1. On **Create Route-map**, enter a **Name** for the route map, and then select **+ Add rule**.

1. On **Create Route-map rule**, enter a **Name** for the rule, and configure the following settings:

    **Next step**: Select **Terminate** so that dropped routes aren't evaluated against later rules.

    **Match condition**

    | Property | Criterion | Value |
    |---|---|---|
    | RoutePrefix | Contains | 10.122.0.0/16 |

    **Action on matched routes**: Select **Drop**.

    When you select **Drop**, the matched routes are denied and the **Route modifications** table is unavailable. To permit and modify matched routes instead, select **Modify**.

1. Select **Add** to save the rule to the route map.

1. On **Create Route-map**, select **Save** to save the route map and its rules.

    It takes a few minutes to save. After the save completes, the **Provisioning state** shows **Succeeded**.

:::image type="content" source="./media/route-maps-scenario-drop-inbound-routes/route-map-rule.png" alt-text="Screenshot of a route-map rule with RoutePrefix Contains 10.122.0.0/16 and Drop selected." lightbox="./media/route-maps-scenario-drop-inbound-routes/route-map-rule.png":::

## Apply and verify the route map

1. Apply the route map to the **inbound** direction of the BGP peering that advertises the routes you want to drop. For steps, see [Apply a route map to BGP peerings and gateway connections](route-maps-how-to.md#apply-a-route-map-to-bgp-peerings-and-gateway-connections).

1. Use the **Effective Routes** view on your route server to confirm the result. The routes in the 10.122.0.0/16 range no longer appear, and 10.100.0.0/16 is still present.

1. Under **Routing**, select **Route Maps**, and then open **Connections Dashboard**. Select the BGP peering and the inbound direction to compare the routes processed by the rule.

## Frequently asked questions

### Does dropping a route remove it from the peer?

No. The route map controls only what Azure Route Server accepts and propagates. The peer keeps the route in its own routing table and continues to advertise it.

### What's the difference between dropping routes inbound and outbound?

An inbound route map filters routes as Azure Route Server learns them, so the dropped routes never reach your virtual networks or gateway connections. An outbound route map filters routes as Azure Route Server advertises them, so Route Server still learns the routes but doesn't pass them on.

### Can I drop routes based on something other than the prefix?

Yes. A match condition can use the route prefix, the AS path, or a BGP community. For the supported match conditions, see [About route maps: Match conditions](route-maps-about.md#match-conditions).

### What happens if a route matches more than one rule?

Rules are evaluated in the order defined in the route map. The **Next step** setting on each rule determines whether evaluation continues to the next rule or stops.

### How do I confirm which routes were dropped?

Compare the **Effective Routes** view before and after you apply the route map. You can also use **Connections Dashboard** on the **Route Maps** page of the route server to inspect routes for the selected connection and direction.

## Clean up resources

If you created the route map only to test this scenario, remove it when you're done:

1. Remove the route map from each connection where you applied it. Set **Inbound Route-map** to **None** for the connection, and then select **Save**. For steps, see [Remove a route map from a connection](route-maps-how-to.md#remove-a-route-map-from-a-connection).
1. If no other connection uses the route map, delete it. For steps, see [Modify or remove a route map](route-maps-how-to.md#modify-or-remove-a-route-map).

After you remove the route map from the connection, Route Server accepts the previously dropped routes again if the peer still advertises them.

## Related content

- [About route maps for Azure Route Server](route-maps-about.md)
- [Configure route maps for Azure Route Server](route-maps-how-to.md)
- [Prepend routes by using route maps](route-maps-scenario-prepend-routes.md)
- [Tag routes with BGP communities by using route maps](route-maps-scenario-tag-bgp-communities.md)
- [Apply route maps to an NVA in a spoke virtual network](route-maps-scenario-spoke-network-virtual-appliance.md)
- [Azure Route Server FAQ](route-server-faq.md)
