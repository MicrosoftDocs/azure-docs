---
title: Rate limiting for ExpressRoute Direct circuits (Preview) - ExpressRoute | Microsoft Docs
description: This document provides guidance on how to enable rate limiting for an ExpressRoute Direct circuit.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 10/19/2023
ms.author: duau
---

# Rate limiting for ExpressRoute Direct circuits (Preview)

Rate limiting is a feature that enables you to control the traffic volume between your on-premises network and Azure over an ExpressRoute Direct circuit. It applies to the traffic over either private or Microsoft peering of the ExpressRoute circuit. This feature helps distribute the port bandwidth evenly among the circuits, ensures network stability, and prevents network congestion. This document outlines the steps to enable rate limiting for your ExpressRoute Direct circuits.

## Prerequisites

Before you enable rate limiting for your ExpressRoute Direct circuit, ensure that you satisfy the following prerequisites:

- **Azure subscription:** You need an active Azure subscription with the required permissions to configure ExpressRoute Direct circuits. 
- **ExpressRoute Direct links:** You must have established ExpressRoute Direct links between your on-premises network and Azure. 
- **Knowledge:** You should have a good understanding of Azure networking concepts, including ExpressRoute.

## Enable rate limiting

### New ExpressRoute Direct circuits

You can enable rate limiting for an ExpressRoute Direct circuit, either during the creation of the circuit or after it's created.

> [!NOTE]
> - Currently, the only way to enable rate limiting is through the Azure portal.
> - Rate limiting is a feature that will be accessible during the circuit creation process from the public preview stage onwards.

To enable rate limiting while creating an ExpressRoute Direct circuit, follow these steps:

1. Sign-in to the [Azure portal](https://portal.azure.com/) and select **+ Create a resource**.

1. Search for *ExpressRoute circuit* and select **Create**.

1. Enter the required information in the **Basics** tab and select **Next** button.

1. In the **Configuration** tab, enter the required information and select the **Enable Rate Limiting** check box. The following diagram shows a screenshot of the **Configuration** tab.

    :::image type="content" source="./media/rate-limiting/create-circuit.png" alt-text="Screenshot of the configuration tab for a new ExpressRoute Direct circuit.":::

1. Select **Next: Tags** and provide tagging for the circuit, if necessary.

1. Select **Review + create** and then select **Create** to create the circuit.

### Existing ExpressRoute Direct circuits

To enable rate limiting for an existing ExpressRoute Direct circuit, follow these steps:

1. Sign-in to the Azure portal and go to the ExpressRoute Direct circuit that you want to configure rate limiting for.

1. Select **Configuration** under *Settings* on the left side pane.

1. Select **Yes** for *Enable Rate Limiting*. The following diagram illustrates the configuration page for enabling rate limiting for an ExpressRoute Direct circuit.

    :::image type="content" source="./media/rate-limiting/existing-circuit.png" alt-text="Screenshot of the configuration page for an ExpressRoute Direct circuit showing the rate limiting setting.":::

1. Then select the **Save** button at the top of the page to apply the changes.

## Frequently asked questions

1. What is the benefit of rate limiting on ExpressRoute Direct circuits?
 
    Rate limiting enables you to manage and restrict the data transfer rate over your ExpressRoute Direct circuits, which helps optimize network performance and costs.

1. How is rate limiting applied?

    Rate limiting is applied on the Microsoft and private peering subinterfaces of Microsoft edge routers that connect to customer edge routers.

1. How does rate limiting affect my circuit performance?

    An ExpressRoute circuit has two connection links between Microsoft edge routers and customer edge (CE) routers. For example, if your circuit bandwidth gets set to 1 Gbps and you distribute your traffic evenly across both links, you can reach up to 2*1 (that is, 2) Gbps. However, it isn't a recommended practice and we suggest using the extra bandwidth for high availability only. If you exceed the configured bandwidth over private or Microsoft peering on either of the links by more than 20%, then rate limiting lowers the throughput to the configured bandwidth.

1. How can I check the rate limiting status of my ExpressRoute Direct port circuits?

    In Azure portal, on the ‘Circuits’ pane of your ExpressRoute Direct link-pair, you would see all the circuits configured over the ExpressRoute Direct link-pair along with the rate limiting status. See the following screenshot:

    :::image type="content" source="./media/rate-limiting/status.png" alt-text="Screenshot of the rate limiting status from an ExpressRoute Direct resource.":::

1. How can I monitor if my traffic gets affected by the rate limiting feature?

    To monitor your traffic, follow these steps:

    1. Go to the [Azure portal](https://portal.azure.com/) and select the ExpressRoute circuit that you want to check.

    1. Select **Metrics** from under *Monitoring* on the left side menu pane of the circuit.
    
    1. From the drop-down, under **Circuit Qos**, select **DroppedInBitsPerSecond**. Then select **Add metrics** and select **DroppedOutBitsPerSecond**. You now see the chart metric for traffic that is dropped for ingress and egress.

1. How can I change my circuit bandwidth? 

    To change your circuit bandwidth, follow these steps:

    1. Go to the  [Azure portal](https://portal.azure.com/) and select the ExpressRoute circuit that you want to modify.
    
    1. Select **Configuration** from under *Settings* on the left side menu pane of the circuit.
    
    1. Under **Bandwidth**, select the **new bandwidth value** that you want to set for your circuit. You can only increase the bandwidth up to the maximum capacity of your Direct port.
    
    1. Select the **Save** button at the top of the page to apply the changes. If you enabled rate limiting for your circuit, it automatically adjusts to the new bandwidth value.
    
1. How does increasing the circuit bandwidth affect the traffic flow through the circuit? 

    Increasing the circuit bandwidth doesn’t affect the traffic flow through the circuit. The bandwidth increase is seamless and the circuit bandwidth upgrade reflects in a few minutes. However, the bandwidth increase is irreversible.

1. Can I enable or disable rate limiting for a specific circuit configured over my ExpressRoute Direct port? 

    Yes, you can enable or disable rate limiting for a specific circuit.

1. Is this feature available in sovereign clouds? 

    No, this feature is only available in the public cloud.

## Next steps

- For more information regarding ExpressRoute Direct, see [About ExpressRoute Direct](expressroute-erdirect-about.md).
- For information about setting up ExpressRoute Direct, see [How to configure ExpressRoute Direct](expressroute-howto-erdirect.md).