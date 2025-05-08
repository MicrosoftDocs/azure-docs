---
title: Resiliency Insights for ExpressRoute virtual network gateway (preview)
description: Learn about the resiliency features of ExpressRoute gateway and how they can help you maintain connectivity to your on-premises network.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: duau
ms.custom: ai-usage
---

# Resiliency Insights for ExpressRoute virtual network gateway (preview)

Resiliency Insights is an assessment capability designed to measure your network's reliability for ExpressRoute workloads. At the core of this capability is the resiliency index, a percentage score calculated based on factors such as route resilience, zone-redundant gateway usage, advisory recommendations, and resiliency validation tests. This index evaluates the control plane resiliency of the ExpressRoute connectivity between your ExpressRoute virtual network gateway and on-premises network. By analyzing and improving this index, you can enhance the robustness and reliability of your connectivity to Azure workloads through ExpressRoute.

> [!NOTE]
> To participate in the preview, contact the [**Azure ExpressRoute team**](mailto:exr-resiliency@microsoft.com).

:::image type="content" source="media/resiliency-insights/resiliency-insights.png" alt-text="Screenshot of the Resiliency Insights feature, accessible under the monitoring section in the left-hand menu of the ExpressRoute gateway resource.":::

> [!IMPORTANT]
> **Azure ExpressRoute Resiliency Insights** is currently in PREVIEW.  
> Refer to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for the legal terms applicable to Azure features in beta, preview, or other prerelease stages.

## Route set

The Resiliency Insights topology provides a detailed view of your route sets, helping you determine if they're site-resilient. It also highlights issues such as Private peering BGP (Border Gateway Protocol) session failures at any peering location or uneven route advertisement across ExpressRoute connections. By expanding the route sets, you can trace how routes propagate through each circuit and connection at the peering location.

:::image type="content" source="media/resiliency-insights/route-set.png" alt-text="Screenshot of the route set section in the Resiliency Insights feature, showing the routes associated with ExpressRoute circuit.":::

A route set represents a group of routes advertised from your on-premises network to the ExpressRoute virtual network gateway. These routes are shared across one or more connections within a common set of ExpressRoute circuits. By analyzing the route sets associated with your gateway, you can evaluate the resiliency of your ExpressRoute connections and identify potential areas for improvement.

## Resiliency index

The resiliency index score is a metric designed to assess the reliability of your ExpressRoute connection. It's calculated based on four key factors that contribute to the resiliency of your ExpressRoute virtual network gateway: route resiliency, resiliency validation tests, gateway zone redundancy, and advisory recommendations. Each factor is evaluated to produce an overall resiliency index score, which ranges from 0 to 100. A higher score reflects a more resilient ExpressRoute connection, while a lower score highlights potential areas for improvement that could affect the reliability of your connection.

| Scoring Criteria | Weight |
|-------------------|--------|
| [Route resiliency](#route) (Advertising routes through multi-site ExpressRoute circuits) | 20% |
| [Zone redundant virtual network gateway](#redundancy) | 10% |
| [Resiliency recommendation](#recommendation) | 10% |
| [Resiliency validation readiness test score](#readiness) | Route score multiplier |

### <a name="route"></a> Route resiliency score

Route resiliency is a key factor in assessing the reliability of your ExpressRoute connection. Advertising routes through multiple ExpressRoute circuits at different peering locations creates redundant paths for your traffic. This redundancy minimizes the effect of circuit failures or maintenance events at a single site, ensuring uninterrupted access to your Azure resources.

- Advertising routes through two distinct peering locations: **20%**.
- Advertising routes through ExpressRoute Metro: **10%**.
- Advertising routes through a single peering location: **5%**.

The route resiliency score is **zero** in both high-resiliency (ExpresRoute Metro) and standard-resiliency configurations if there's a link failure between the Microsoft Enterprise Edge (MSEE) and the provider edge (PE) router.

### <a name="redundancy"></a> Zone redundant virtual network gateway score

The zone redundancy feature enhances the reliability of the virtual network gateway by deploying it across multiple failure zones. This configuration ensures higher resiliency for your ExpressRoute connection, maintaining connectivity between your on-premises network and Azure resources.

- **Standard** and **High-Performance** SKUs:  **0%**.
- **Ultra Performance** SKUs: **2%**.
- **ErGW1Az, ErGW2Az, ErGW3Az** SKUs:
    - Zonal deployment: **8%**.
    - Zone-redundant deployment: **10%**.
- **ErGWScale** SKU:
    - Up to four instances (two scale units): **8%**.
    - More than four instances: **10%**.

### <a name="recommendation"></a> Resiliency recommendation score

Advisor recommendations provide actionable insights to improve the reliability of your ExpressRoute connection. Implementing these recommendations can enhance the resiliency of your connection and ensure uninterrupted access to Azure resources.

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

The resiliency index score provides a comprehensive assessment of the reliability of your ExpressRoute connection. By understanding the key factors that influence this score, you can identify opportunities to enhance the resiliency of your connection. Implementing the recommendations and best practices outlined in this article help you strengthen your ExpressRoute setup, ensuring consistent and reliable connectivity between your on-premises network and Azure resources.

## Frequently asked questions

1. Why can't I see the Resiliency Insights feature in my ExpressRoute virtual network gateway?

    - The Resiliency Insights feature is currently in preview. To gain access, contact the [Azure ExpressRoute team](mailto:exR-Resiliency@microsoft.com) for onboarding.
    - This feature isn't supported for Virtual WAN ExpressRoute gateways.
    - You must have Contributor-level authorization to access this feature.

1. Why doesn't the pane refresh immediately after I select **Refresh**?

    The pane refreshes automatically every hour. If the last update occurred less than an hour ago, the pane won't refresh until the next polling interval is reached.

1. Does the feature support Microsoft Peering or VPN connectivity?

    No, the Resiliency Insights feature supports only ExpressRoute Private Peering connectivity. It doesn't support Microsoft Peering or VPN connectivity.

## Next steps

- Learn more about [ExpressRoute virtual network gateway](expressroute-about-virtual-network-gateways.md).
- Learn about [Zone redundancy for ExpressRoute virtual network gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json).