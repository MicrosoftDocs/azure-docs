---
title: Rate limiting for ExpressRoute Direct circuits
titleSuffix: Azure ExpressRoute
description: This document provides guidance on how to enable or disable rate limiting for an ExpressRoute Direct circuit.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom: ignite-2023, ai-usage
ms.topic: how-to
ms.date: 03/21/2024
ms.author: duau
---

# Rate limiting for ExpressRoute Direct circuits

Rate limiting is a feature that enables you to regulate the volume of traffic between your on-premises network and Azure via an ExpressRoute Direct circuit. This applies to traffic traversing either private or Microsoft peering of the ExpressRoute circuit. This feature aids in evenly distributing the port bandwidth across the circuits, ensuring network stability, and averting network congestion. This article outlines steps to enable rate limiting for your ExpressRoute Direct circuits.

## Prerequisites

Before enabling rate limiting for your ExpressRoute Direct circuit, it's imperative that you satisfy the following prerequisites:

- **Azure subscription:** An active Azure subscription is required, equipped with the necessary permissions to configure ExpressRoute Direct circuits.
- **ExpressRoute Direct links:** It is necessary to establish ExpressRoute Direct links between your on-premises network and Azure.
- **Knowledge:** A comprehensive understanding of Azure networking concepts, including ExpressRoute, is recommended.

## Enable rate limiting

### For new ExpressRoute Direct circuits

Rate limiting for an ExpressRoute Direct circuit can be enabled during the circuit's creation.

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. From the left side pane, select **+ Create a resource**, then search for and select **ExpressRoute**.

1. Select **Create** to initiate the creation of a new ExpressRoute Direct circuit.

1. Input the necessary details for the ExpressRoute Direct circuit. It is crucial to select **Direct** for the port type and check the **Enable rate limiting** box. The following diagram provides a visual representation of the configuration page for enabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limit/new-direct-circuit.png" alt-text="Screenshot of the configuration page for a new ExpressRoute Direct circuit showing the rate limiting setting.":::

1. Select **Review + create** followed by **Create** to finalize the creation of the ExpressRoute Direct circuit with rate limiting enabled.

### Existing ExpressRoute Direct circuits

To enable rate limiting for an existing ExpressRoute Direct circuit, complete the following steps:

1. Sign-in to the [Azure portal](https://portal.azure.com), then navigate to the ExpressRoute Direct circuit that you intend to configure rate limiting for.

1. Select **Configuration** under *Settings* on the left side pane.

1. Select **Yes** for *Enable Rate Limiting*. The following diagram illustrates the configuration page for enabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limit/existing-circuit.png" alt-text="Screenshot of the configuration page for an ExpressRoute Direct circuit showing the Enable Rate Limiting setting set to Yes.":::

1. Finally, select the **Save** button at the top of the page to apply the changes.

## Disable rate limiting

To disable rate limiting for an existing ExpressRoute Direct circuit, complete the following steps:

1. Sign-in to the Azure portal using this [Azure portal](https://portal.azure.com/?feature.erdirectportratelimit=true) link, then go to the ExpressRoute Direct circuit that you want to configure rate limiting for.

1. Select **Configuration** under *Settings* on the left side pane.

1. Select **No** for *Enable Rate Limiting*. The following diagram illustrates the configuration page for disabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limit/disable-rate-limiting.png" alt-text="Screenshot of the configuration page for an ExpressRoute Direct circuit showing the Enable Rate Limiting setting set to No.":::

1. Finally,  select the **Save** button at the top of the page to apply the changes.

## Frequently asked questions

* What is the benefit of rate limiting on ExpressRoute Direct circuits?
 
    Rate limiting enables you to manage and restrict the data transfer rate over your ExpressRoute Direct circuits, which helps optimize network performance and costs.

* How is rate limiting applied?

    Rate limiting is applied on the Microsoft and private peering subinterfaces of Microsoft edge routers that connect to customer edge routers.

* How does rate limiting affect my circuit performance?

    An ExpressRoute circuit has two connection links between Microsoft edge routers and customer edge (CE) routers. For example, if your circuit bandwidth is set to 1 Gbps and you distribute your traffic evenly across both links, you can reach up to 2*1 (that is, 2) Gbps. However, this is not a recommended practice and we suggest using the extra bandwidth for high availability only. If you exceed the configured bandwidth over private or Microsoft peering on either of the links by more than 20%, then rate limiting lowers the throughput to the configured bandwidth.

* How can I check the rate limiting status of my ExpressRoute Direct port circuits?

    In the Azure portal, on the ‘Circuits’ pane of your ExpressRoute Direct port, you will see all the circuits configured over the ExpressRoute Direct port along with the rate limiting status. See the following screenshot as an example:

    :::image type="content" source="./media/rate-limit/status.png" alt-text="Screenshot of the rate limiting status from an ExpressRoute Direct resource.":::

* How can I monitor if my traffic gets affected by the rate limiting feature?

    To monitor your traffic, follow these steps:

    1. Go to the [Azure portal](https://portal.azure.com/) and select the ExpressRoute circuit that you want to check.

    1. Select **Metrics** from under *Monitoring* on the left side menu pane of the circuit.
    
    1. From the drop-down, under **Circuit QoS**, select **DroppedInBitsPerSecond**. Then select **Add metrics** and select **DroppedOutBitsPerSecond**. You now see the chart metric for traffic that is dropped for ingress and egress.

    :::image type="content" source="./media/rate-limit/drop-bits-metric.png" alt-text="Screenshot of the drop bits per seconds metrics for an ExpressRoute Direct circuit.":::

* How can I change my circuit bandwidth? 

    To change your circuit bandwidth, follow these steps:

    1. Go to the  [Azure portal](https://portal.azure.com/) and select the ExpressRoute circuit that you want to modify.
    
    1. Select **Configuration** from under *Settings* on the left side menu pane of the circuit.
    
    1. Under **Bandwidth**, select the **new bandwidth value** that you want to set for your circuit. You can only increase the bandwidth up to the maximum capacity of your Direct port.
    
    1. Select the **Save** button at the top of the page to apply the changes. If you enabled rate limiting for your circuit, it automatically adjusts to the new bandwidth value.
    

* How does increasing the circuit bandwidth affect the traffic flow through the circuit? 

    Increasing the circuit bandwidth does not affect the traffic flow through the circuit. The bandwidth increase is seamless and the circuit bandwidth upgrade will be reflected in a few minutes. It is important to note the bandwidth increase is irreversible.

* Can I enable or disable rate limiting for a specific circuit configured over my ExpressRoute Direct port? 

    Yes, you can enable or disable rate limiting for a specific circuit.

* Is this feature available in sovereign clouds? 

    No, this feature is only available in the public cloud.

## Next steps

- For more information regarding ExpressRoute Direct, see [About ExpressRoute Direct](expressroute-erdirect-about.md).
- For information about setting up ExpressRoute Direct, see [How to configure ExpressRoute Direct](expressroute-howto-erdirect.md).
