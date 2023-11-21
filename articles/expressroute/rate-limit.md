---
title: Rate limiting for ExpressRoute Direct circuits (Preview)
titleSuffix: Azure ExpressRoute
description: This document provides guidance on how to enable or disable rate limiting for an ExpressRoute Direct circuit.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: duau
---

# Rate limiting for ExpressRoute Direct circuits (Preview)

Rate limiting is a feature that enables you to control the traffic volume between your on-premises network and Azure over an ExpressRoute Direct circuit. It applies to the traffic over either private or Microsoft peering of the ExpressRoute circuit. This feature helps distribute the port bandwidth evenly among the circuits, ensures network stability, and prevents network congestion. This document outlines the steps to enable rate limiting for your ExpressRoute Direct circuits.

## Prerequisites

Before you enable rate limiting for your ExpressRoute Direct circuit, ensure that you satisfy the following prerequisites:

- **Azure subscription:** You need an active Azure subscription with the required permissions to configure ExpressRoute Direct circuits. 
- **ExpressRoute Direct links:** You need to establish ExpressRoute Direct links between your on-premises network and Azure.
- **Knowledge:** You should have a good understanding of Azure networking concepts, including ExpressRoute.

## Enable rate limiting

### Existing ExpressRoute Direct circuits

To enable rate limiting for an existing ExpressRoute Direct circuit, follow these steps:

1. Sign-in to the Azure portal using this [Azure portal](https://portal.azure.com/?feature.erdirectportratelimit=true) link, then go to the ExpressRoute Direct circuit that you want to configure rate limiting for.

1. Select **Configuration** under *Settings* on the left side pane.

1. Select **Yes** for *Enable Rate Limiting*. The following diagram illustrates the configuration page for enabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limit/existing-circuit.png" alt-text="Screenshot of the configuration page for an ExpressRoute Direct circuit showing the rate limiting setting.":::

1. Then select the **Save** button at the top of the page to apply the changes.

## Disable rate limiting

To disable rate limiting for an existing ExpressRoute Direct circuit, follow these steps:

1. Sign-in to the Azure portal using this [Azure portal](https://portal.azure.com/?feature.erdirectportratelimit=true) link, then go to the ExpressRoute Direct circuit that you want to configure rate limiting for.

1. Select **Configuration** under *Settings* on the left side pane.

1. Select **No** for *Enable Rate Limiting*. The following diagram illustrates the configuration page for disabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limit/disable-rate-limiting.png" alt-text="Screenshot of the configuration page for an ExpressRoute Direct circuit showing how to disable rate limiting.":::

1. Then select the **Save** button at the top of the page to apply the changes.

## Frequently asked questions

* What is the benefit of rate limiting on ExpressRoute Direct circuits?
 
    Rate limiting enables you to manage and restrict the data transfer rate over your ExpressRoute Direct circuits, which helps optimize network performance and costs.

* How is rate limiting applied?

    Rate limiting is applied on the Microsoft and private peering subinterfaces of Microsoft edge routers that connect to customer edge routers.

* How does rate limiting affect my circuit performance?

    An ExpressRoute circuit has two connection links between Microsoft edge routers and customer edge (CE) routers. For example, if your circuit bandwidth is set to 1 Gbps and you distribute your traffic evenly across both links, you can reach up to 2*1 (that is, 2) Gbps. However, it isn't a recommended practice and we suggest using the extra bandwidth for high availability only. If you exceed the configured bandwidth over private or Microsoft peering on either of the links by more than 20%, then rate limiting lowers the throughput to the configured bandwidth.

* How can I check the rate limiting status of my ExpressRoute Direct port circuits?

    In Azure portal, on the ‘Circuits’ pane of your ExpressRoute Direct port, you would see all the circuits configured over the ExpressRoute Direct port along with the rate limiting status. See the following screenshot:

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

    Increasing the circuit bandwidth doesn’t affect the traffic flow through the circuit. The bandwidth increase is seamless and the circuit bandwidth upgrade reflects in a few minutes. However, the bandwidth increase is irreversible.

* Can I enable or disable rate limiting for a specific circuit configured over my ExpressRoute Direct port? 

    Yes, you can enable or disable rate limiting for a specific circuit.

* Is this feature available in sovereign clouds? 

    No, this feature is only available in the public cloud.

## Next steps

- For more information regarding ExpressRoute Direct, see [About ExpressRoute Direct](expressroute-erdirect-about.md).
- For information about setting up ExpressRoute Direct, see [How to configure ExpressRoute Direct](expressroute-howto-erdirect.md).
