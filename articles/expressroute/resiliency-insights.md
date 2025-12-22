---
title: Resiliency Insights for ExpressRoute virtual network gateway
ms.reviewer: duau
description: Use Resiliency Insights to analyze your ExpressRoute gateway's reliability and take steps to strengthen connectivity to your Azure workloads.
author: dpremchandani
ms.service: azure-expressroute
services: expressroute
ms.topic: concept-article
ms.date: 11/04/2025
ms.author: divyapr
ms.custom: ai-usage
# Customer intent: As a network administrator, I want to evaluate the resiliency index of my ExpressRoute connection so that I can improve connectivity reliability between my on-premises network and Azure resources.
---

# Resiliency Insights for ExpressRoute virtual network gateway

Resiliency Insights is a feature that measures the reliability of your ExpressRoute connection. It provides a resiliency index—a percentage score based on factors like route resilience, zone-redundant gateway usage, advisory recommendations, and resiliency validation tests. The index evaluates the control plane resiliency of the ExpressRoute connectivity between your ExpressRoute virtual network gateway and on-premises network. By analyzing and improving this index, you can strengthen the reliability of your connectivity to Azure workloads through ExpressRoute.

:::image type="content" source="media/resiliency-insights/resiliency-insights.png" alt-text="Screenshot of the Resiliency Insights feature, accessible under the Monitoring section in the left menu of the ExpressRoute gateway resource." lightbox="media/resiliency-insights/resiliency-insights.png":::

## Route set

The Resiliency Insights topology provides a detailed view of your route sets to help you determine if they're site-resilient. It also highlights issues like Private peering BGP (Border Gateway Protocol) session failures at any peering location or uneven route advertisement across ExpressRoute connections. By expanding the route sets, you can trace how routes propagate through each circuit and connection at the peering location.

:::image type="content" source="media/resiliency-insights/route-set.png" alt-text="Screenshot of the route set section in the Resiliency Insights feature, showing the routes associated with ExpressRoute circuit.":::

A route set represents a group of routes advertised from your on-premises network to the ExpressRoute virtual network gateway. These routes are shared across one or more connections within a common set of ExpressRoute circuits. By analyzing the route sets associated with your gateway, you can evaluate the resiliency of your ExpressRoute connections and identify potential areas for improvement.

## Resiliency index

The resiliency index score is a metric that assesses the reliability of your ExpressRoute connection. The value is calculated based on four key factors that contribute to the resiliency of your ExpressRoute virtual network gateway: route resiliency, resiliency validation tests, gateway zone redundancy, and advisory recommendations. Each factor is evaluated to produce an overall resiliency index score, which ranges from 0 to 100. A higher score indicates a more resilient ExpressRoute connection, while a lower score highlights potential areas for improvement that can affect the reliability of your connection.

| Scoring Criteria | Weight |
|-------------------|--------|
| [Route resiliency](#route) (Advertising routes through multi-site ExpressRoute circuits) | 20% |
| [Zone redundant virtual network gateway](#redundancy) | 10% |
| [Resiliency recommendation](#recommendation) | 10% |
| [Resiliency validation readiness test score](#readiness) | Route score multiplier |

### <a name="route"></a> Route resiliency score

Route resiliency is a key factor in assessing the reliability of your ExpressRoute connection. When you advertise routes through multiple ExpressRoute circuits at different peering locations, you create redundant paths for your traffic. This redundancy minimizes the effect of circuit failures or maintenance events at a single site, so you have uninterrupted access to your Azure resources.

- Advertising routes through two distinct peering locations: **20%**.
- Advertising routes through ExpressRoute Metro: **10%**.
- Advertising routes through a single peering location: **5%**.

The route resiliency score is **zero** in both high-resiliency (ExpresRoute Metro) and standard-resiliency configurations if there's a link failure between the Microsoft Enterprise Edge (MSEE) and the provider edge (PE) router.

### <a name="redundancy"></a> Zone redundant virtual network gateway score

The zone redundancy feature enhances the reliability of the virtual network gateway by deploying it across multiple failure zones. This configuration provides higher resiliency for your ExpressRoute connection and maintains connectivity between your on-premises network and Azure resources.

- **Standard** and **High-Performance** SKUs:  **0%**.
- **Ultra Performance** SKUs: **2%**.
- **ErGW1Az, ErGW2Az, ErGW3Az** SKUs:
    - Zonal deployment: **8%**.
    - Zone-redundant deployment: **10%**.
- **ErGWScale** SKU:
    - Up to four instances (two scale units): **8%**.
    - More than four instances: **10%**.

### <a name="recommendation"></a> Resiliency recommendation score

Advisor recommendations provide actionable insights to improve the reliability of your ExpressRoute connection. When you implement these recommendations, you can enhance the resiliency of your connection and maintain uninterrupted access to Azure resources.

If no advisory recommendations are provided, the resiliency score for this category is **10%**.

> [!NOTE]
> Recommendations to deploy a zone redundant gateway or a multi-site ExpressRoute circuit are already factored into the overall resiliency index score. As a result, they don't affect the advisory recommendations score directly.

### <a name = "readiness"></a> Resiliency validation readiness test score

ExpressRoute maximum resiliency circuits are defined as a pair of two standard circuits configured in two different peering locations. Any extra circuits would further enhance the resiliency, but these circuits aren't scored. For the resiliency validation multiplier to take effect, you must run the [Resiliency Validation](resiliency-validation.md) test on both peering locations. 

The following multipliers are applied to the route resiliency score based on the results of the Resiliency Validation test:

- Resiliency tests conducted within the last 30 days: multiplier of **4**.
- Tests conducted 31–60 days ago: multiplier of **3**.
- Tests conducted 61–90 days ago: multiplier of **2**.
- Tests conducted over 90 days ago: multiplier of **1**.

> [!IMPORTANT]
> If resiliency validation is completed for only one of the two peering locations, the multiplier applied to the route resiliency score is reduced by **half**.

The resiliency index score provides a comprehensive assessment of the reliability of your ExpressRoute connection. By understanding the key factors that influence this score, you can identify opportunities to enhance the resiliency of your connection. When you implement the recommendations and best practices outlined in this article, you strengthen your ExpressRoute setup and maintain consistent and reliable connectivity between your on-premises network and Azure resources.

## FAQ

1. Why can't I see the Resiliency Insights feature in my ExpressRoute virtual network gateway?

    - Resiliency Insights currently support Virtual Network ExpressRoute Gateways only. 
    - You must have Contributor-level authorization to access this feature.

1. Why doesn't the pane refresh immediately after I select **Refresh**?

    The pane refreshes automatically every hour. If the last update occurred less than an hour ago, the pane won't refresh until the next polling interval is reached.

1. Does the feature support Microsoft Peering or VPN connectivity?

    No, the Resiliency Insights feature supports only ExpressRoute Private Peering connectivity. It doesn't support Microsoft Peering or VPN connectivity.

## Next steps

- Learn more about [ExpressRoute virtual network gateway](expressroute-about-virtual-network-gateways.md).
- Learn about [Zone redundancy for ExpressRoute virtual network gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json).