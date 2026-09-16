---
title: Prepend routes by using route maps for Azure Route Server
description: Learn how to use route maps for Azure Route Server to prepend ASNs to the AS-PATH of BGP routes and influence downstream path selection.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 07/20/2026

#CustomerIntent: As an Azure administrator, I want to prepend ASNs to the AS-PATH of routes advertised by Azure Route Server so that I can make a route less preferred and steer traffic toward an alternate path.
---

# Prepend routes by using route maps for Azure Route Server

> [!IMPORTANT]
> Route maps for Azure Route Server is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

AS-PATH prepending is a common Border Gateway Protocol (BGP) traffic-engineering technique. When you prepend one or more autonomous system numbers (ASNs) to the AS-PATH of a route, the route appears longer and becomes less preferred to downstream BGP peers, which typically favor shorter AS-PATHs. You can use this technique to design primary and backup connectivity, influence inbound traffic paths, and steer traffic in active-active architectures.

This article shows you how to use route maps for Azure Route Server to prepend ASNs to the AS-PATH of matched routes by using the Azure portal. For an overview of route maps, see [About route maps for Azure Route Server](route-maps-about.md).

:::image type="complex" source="./media/route-maps-scenario-prepend-routes/as-path-prepending.png" alt-text="Diagram that shows two BGP paths from an on-premises router, where the shorter AS-PATH is preferred." lightbox="./media/route-maps-scenario-prepend-routes/as-path-prepending.png":::
   An on-premises router with ASN 65000 advertises the same prefix to an upstream provider over two paths. Path A has an AS-PATH of 65515, which is a single hop, and the upstream provider selects it because the AS-PATH is shorter. Path B has an AS-PATH of 64511 65515, which is two hops, because a route map prepended ASN 64511 to the route. The longer AS-PATH makes Path B less attractive to the upstream provider, so Path B serves as the backup path.
:::image-end:::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network, with at least one BGP peering to a network virtual appliance (NVA), an ExpressRoute gateway connection, or a VPN gateway connection. For the full list of prerequisites, see [Configure route maps: Prerequisites](route-maps-how-to.md#prerequisites).
- Verify that routes are learned through Azure Route Server before you configure a route map. Use the **Effective Routes** view on your route server to confirm the routes and their current AS-PATH values.

## Considerations

Review the following considerations before you prepend routes:

- Route-map rules are evaluated sequentially, and AS-PATH modifications are applied in the order that you configure them.
- You can prepend multiple ASNs in a single action by using comma-separated values. The resulting AS-PATH reflects the exact order that you configure. You can also prepend the same ASN multiple times to further lengthen the path.
- AS-PATH prepending affects route advertisements only. It doesn't affect route reachability.
- Don't use Azure-reserved ASNs when you prepend routes. Reserved public ASNs are 8074, 8075, and 12076. Reserved private ASNs are 65515, 65517, 65518, 65519, and 65520.
- Routes advertised over ExpressRoute have private ASNs removed by the Microsoft Enterprise Edge (MSEE) routers. Don't use private ASNs for AS-PATH prepending when routes traverse ExpressRoute, because the gateway strips them before the route reaches your equipment. Routes advertised over a VPN gateway or to an NVA can use public or private ASNs.

For the complete list of route maps limitations, see [About route maps: Considerations and limitations](route-maps-about.md#considerations-and-limitations).

## Understand the scenario

In this scenario, a workload subnet uses the prefix 10.0.0.0/16 and Azure Route Server uses ASN 65515. You create a route map that matches the workload prefix and prepends ASN 64511 to its AS-PATH before the route is advertised to downstream peers. The longer AS-PATH makes the route less attractive, so downstream BGP peers prefer an alternate path.

The following table shows the AS-PATH before and after the route map is applied:

| | Prefix | AS-PATH |
|---|---|---|
| **Before the route map** | 10.0.0.0/16 | 65515 |
| **After the route map** | 10.0.0.0/16 | 64511 65515 |

## Configure the route map

Configure a route map rule that matches the workload prefix and prepends the ASN.

1. In the Azure portal, go to your **Azure Route Server** resource.

1. In the left menu under **Settings**, select **route maps**.

1. On **route maps**, select **+ Add Route Map**.

1. On **Create Route Map**, enter a **Name** for the route map, and then select **+ Add rule**.

1. On **Create Route Map rule**, enter a **Name** for the rule, and configure the match condition and action by using the following values:

    **Match condition**

    | Property | Criterion | Value |
    |---|---|---|
    | RoutePrefix | Equals | 10.0.0.0/16 |

    **Action on matched routes**: Select **Modify**.

    **Route modifications**

    | Property | Action | Value |
    |---|---|---|
    | AsPath | Add | 64511 |

    To prepend multiple ASNs, enter comma-separated values such as `64511,64510,64511`. The ASNs are prepended in the order that you enter them.

1. Select **Add** to save the rule to the route map.

1. On **Create Route Map**, select **Save** to save the route map and its rules.

    It takes a few minutes to save. After the save completes, the **Provisioning state** shows **Succeeded**.

    > [!NOTE]
    > The first time you create a route map on an Azure Route Server, the route server undergoes a one-time upgrade that takes approximately 30 minutes.

## Apply and verify the route map

1. Apply the route map to the outbound direction of the BGP peering or gateway connection that advertises the workload route. For steps, see [Apply a route map to BGP peerings and gateway connections](route-maps-how-to.md#apply-a-route-map-to-bgp-peerings-and-gateway-connections).

1. Use the **Route Map dashboard** on the route server to confirm that the AS-PATH is modified as expected.

1. On the receiving BGP peer, verify the advertised route. The prepended ASN values appear in the AS-PATH of the advertised route.

## Frequently asked questions

### Does the order of prepended ASNs matter?

Yes. The ASNs are prepended in the exact order that you configure them. For example, `64511,64510` results in an AS-PATH of `64511 64510 65515`, while `64510,64511` results in `64510 64511 65515`.

### Can I prepend the same ASN multiple times?

Yes. For example, `64510,64510,64510` results in an AS-PATH of `64510 64510 64510 65515`. Repeating an ASN increases the path length and further de-preferences the route.

### Can I use private ASNs for prepending?

Private ASNs work in some BGP environments, but if the routes traverse ExpressRoute, the MSEE routers can strip private ASNs before the route reaches your equipment. Use public ASNs when routes traverse ExpressRoute.

### Can multiple route-map rules modify the same route?

Yes. If a route matches multiple rules, the rules are processed in the order defined in the route map. Plan your rule sequencing carefully.

### How do I verify that prepending is working?

Check the route advertisement on the receiving BGP peer. The additional ASN values appear in the advertised AS-PATH. You can also use the **Route Map dashboard** on the route server.

## Related content

- [About route maps for Azure Route Server](route-maps-about.md)
- [Configure route maps for Azure Route Server](route-maps-how-to.md)
- [Tag routes with BGP communities by using route maps](route-maps-scenario-tag-bgp-communities.md)
- [Drop inbound routes by using route maps](route-maps-scenario-drop-inbound-routes.md)
- [Azure Route Server FAQ](route-server-faq.md)
